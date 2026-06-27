#!/usr/bin/env python3
"""Make partner league/team logos uniform.

For each source logo: remove the (white/black/transparent) background via a
flood fill from the borders, auto-crop to the artwork, pad to a square with a
consistent margin, and downscale. Result: transparent, identically-framed PNGs
that sit uniformly on a single plate.
"""
from collections import deque
from PIL import Image

SRC = "/Users/amazer/Desktop/apex/src/assets"

# (infile, outfile, tolerance) — tolerance = how aggressively to match the bg color
JOBS = [
    ("lions-logo.png", "lions-logo.png", 30),
    ("wtl-logo.jpg", "wtl-logo.png", 38),
    ("wpl-logo.jpg", "wpl-logo.png", 60),
    ("sgl-logo.jpg", "sgl-logo.png", 38),
]

MAX_SIZE = 420
PAD_RATIO = 0.08


def close(a, b, tol):
    return abs(a[0] - b[0]) <= tol and abs(a[1] - b[1]) <= tol and abs(a[2] - b[2]) <= tol


def remove_bg(im, tol):
    im = im.convert("RGBA")
    w, h = im.size
    px = im.load()

    # If the corners are already transparent, there is no bg to flood-remove.
    corner_alphas = [px[0, 0][3], px[w - 1, 0][3], px[0, h - 1][3], px[w - 1, h - 1][3]]
    if max(corner_alphas) < 10:
        return im

    bgc = px[0, 0][:3]
    visited = bytearray(w * h)
    dq = deque()

    def seed(x, y):
        idx = y * w + x
        if not visited[idx] and close(px[x, y][:3], bgc, tol):
            visited[idx] = 1
            dq.append((x, y))

    for x in range(w):
        seed(x, 0)
        seed(x, h - 1)
    for y in range(h):
        seed(0, y)
        seed(w - 1, y)

    while dq:
        x, y = dq.popleft()
        r, g, b, _ = px[x, y]
        px[x, y] = (r, g, b, 0)
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h:
                idx = ny * w + nx
                if not visited[idx] and close(px[nx, ny][:3], bgc, tol):
                    visited[idx] = 1
                    dq.append((nx, ny))
    return im


def square_pad(im):
    bbox = im.getbbox()
    if bbox:
        im = im.crop(bbox)
    w, h = im.size
    side = max(w, h)
    pad = int(side * PAD_RATIO)
    canvas = side + 2 * pad
    out = Image.new("RGBA", (canvas, canvas), (0, 0, 0, 0))
    out.paste(im, ((canvas - w) // 2, (canvas - h) // 2), im)
    if canvas > MAX_SIZE:
        out = out.resize((MAX_SIZE, MAX_SIZE), Image.LANCZOS)
    return out


for infile, outfile, tol in JOBS:
    im = Image.open(f"{SRC}/{infile}")
    im = remove_bg(im, tol)
    im = square_pad(im)
    im.save(f"{SRC}/{outfile}")
    print(f"{infile} -> {outfile}  {im.size}")
