"""Cut, grade and title a BTS reel from an edit list.

edit.csv columns: file,start,dur[,speed]   (speed <1 = slow-mo, >1 = ramp)
usage: python3 render.py edit.csv out.mp4 [music.mp3]
"""
import csv, subprocess, sys

W, H, FPS = 1080, 1920, 30
# Cool, muted, cinematic: teal shadows, slightly warm highlights, crushed blacks, grain, vignette.
GRADE = (
    "eq=contrast=1.12:saturation=0.78:brightness=-0.02:gamma=0.95,"
    "colorbalance=rs=-0.06:gs=0.01:bs=0.07:rh=0.04:bh=-0.04,"
    "curves=all='0/0.02 0.25/0.18 0.75/0.80 1/0.96',"
    "noise=alls=7:allf=t,vignette=PI/5"
)

def main(edl, out, music=None):
    rows = [r for r in csv.reader(open(edl)) if r and not r[0].startswith("#")]
    cmd, chains, labels, total = ["ffmpeg", "-y", "-v", "error"], [], [], 0.0
    for i, r in enumerate(rows):
        f, ss, dur = r[0], float(r[1]), float(r[2])
        speed = float(r[3]) if len(r) > 3 and r[3] else 1.0
        cmd += ["-ss", str(ss), "-t", str(dur), "-i", f]
        chains.append(
            f"[{i}:v]setpts=PTS-STARTPTS,setpts=PTS/{speed},fps={FPS},"
            f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},setsar=1,{GRADE}[v{i}]"
        )
        labels.append(f"[v{i}]")
        total += dur / speed
    n = len(rows)
    cmd += ["-i", "overlay.png", "-loop", "1", "-t", "1.8", "-i", "endcard.png"]
    chains.append(f"{''.join(labels)}concat=n={n}:v=1:a=0[body]")
    chains.append(f"[body][{n}:v]overlay=0:0[titled]")
    chains.append(f"[{n+1}:v]fps={FPS},setsar=1,fade=in:st=0:d=0.3[end]")
    chains.append("[titled][end]concat=n=2:v=1:a=0[outv]")
    total += 1.8
    maps = ["-map", "[outv]"]
    if music:
        cmd += ["-i", music]
        chains.append(f"[{n+2}:a]atrim=0:{total},afade=out:st={total-1.2}:d=1.2[outa]")
        maps += ["-map", "[outa]"]
    cmd += ["-filter_complex", ";".join(chains), *maps,
            "-c:v", "libx264", "-preset", "slow", "-crf", "17", "-pix_fmt", "yuv420p",
            "-c:a", "aac", "-b:a", "256k", "-movflags", "+faststart", out]
    subprocess.run(cmd, check=True)

if __name__ == "__main__":
    main(*sys.argv[1:])
