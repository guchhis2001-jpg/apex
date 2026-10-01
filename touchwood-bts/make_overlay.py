"""Persistent text layer in the reference style, for a 1080x1920 Reel."""
from PIL import Image, ImageDraw, ImageFont
import sys

W, H = 1080, 1920
BOLD = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
REG = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
f = lambda p, s: ImageFont.truetype(p, s)

def spaced(d, xy, text, font, track, anchor_right=False):
    widths = [d.textlength(c, font=font) for c in text]
    total = sum(widths) + track * (len(text) - 1)
    x, y = xy
    if anchor_right:
        x -= total
    for c, w in zip(text, widths):
        d.text((x, y), c, font=font, fill=(255, 255, 255, 235))
        x += w + track

def overlay(out):
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    # top-right wordmark
    spaced(d, (W - 70, 120), "TOUCHWOOD TEAM", f(REG, 22), 7, anchor_right=True)
    # left block, vertical centre
    y = 880
    d.text((110, y), "TOUCHWOOD", font=f(BOLD, 64), fill="white")
    d.text((112, y + 66), "ON SET", font=f(REG, 36), fill="white")
    # right tag
    d.text((W - 110, y + 8), "BTS", font=f(BOLD, 64), fill="white", anchor="ra")
    # bottom caption
    cap = "EVERYTHING THE FINAL CUT DOESN'T SHOW YOU"
    fc = f(REG, 24)
    spaced(d, ((W - (d.textlength(cap, font=fc) + 3 * (len(cap) - 1))) / 2, 1380), cap, fc, 3)
    im.save(out)

def endcard(out):
    im = Image.new("RGB", (W, H), "black")
    d = ImageDraw.Draw(im)
    for text, size, track, y in (("TOUCHWOOD", 40, 18, 1560), ("STRATEGY  ·  CREATIVE  ·  PRODUCTION", 18, 6, 1625)):
        fo = f(REG, size)
        tw = sum(d.textlength(c, font=fo) for c in text) + track * (len(text) - 1)
        spaced(d, ((W - tw) / 2, y), text, fo, track)
    im.save(out)

if __name__ == "__main__":
    overlay(sys.argv[1] if len(sys.argv) > 1 else "overlay.png")
    endcard(sys.argv[2] if len(sys.argv) > 2 else "endcard.png")
