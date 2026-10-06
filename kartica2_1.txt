#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Poenostavljena kartica Balkan Rank: šest elementov + logotip."""
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops
import math

GF = "/usr/share/fonts/truetype/google-fonts/"
F_BOLD = GF + "Poppins-Bold.ttf"
F_MED = GF + "Poppins-Medium.ttf"
ZNAK = Image.open("/home/claude/znak.png").convert("RGBA")

TIERS = {
    "BRON": dict(bg1=(26, 18, 12), bg2=(9, 7, 6), glow=(140, 80, 32),
                 met=[(92, 54, 24), (214, 142, 74), (255, 212, 160), (168, 102, 48), (70, 40, 18)],
                 acc=(216, 150, 86), rim=(140, 88, 44)),
    "SREBRO": dict(bg1=(20, 24, 28), bg2=(7, 9, 11), glow=(110, 130, 150),
                   met=[(78, 88, 98), (176, 190, 204), (255, 255, 255), (140, 152, 166), (60, 68, 78)],
                   acc=(198, 212, 226), rim=(150, 166, 182)),
    "ZLATO": dict(bg1=(30, 23, 8), bg2=(11, 8, 4), glow=(190, 145, 30),
                  met=[(120, 82, 12), (230, 180, 60), (255, 244, 198), (198, 146, 36), (96, 64, 10)],
                  acc=(255, 206, 92), rim=(214, 168, 62)),
    "PLATINA": dict(bg1=(14, 26, 30), bg2=(5, 10, 12), glow=(90, 180, 200),
                    met=[(96, 134, 146), (190, 226, 236), (255, 255, 255), (150, 192, 206), (72, 104, 116)],
                    acc=(176, 228, 240), rim=(150, 206, 222)),
    "DIAMANT": dict(bg1=(18, 16, 38), bg2=(6, 5, 14), glow=(120, 110, 240),
                    met=[(96, 150, 220), (170, 220, 255), (255, 255, 255), (190, 160, 255), (110, 96, 210)],
                    acc=(168, 214, 255), rim=(150, 180, 255)),
}


def f(p, s):
    return ImageFont.truetype(p, s)


def vgrad(size, stops):
    w, h = size
    img = Image.new("RGB", (1, h)); px = img.load()
    n = len(stops) - 1
    for y in range(h):
        t = y / max(1, h - 1) * n
        i = min(int(t), n - 1); lo = t - i
        c1, c2 = stops[i], stops[i + 1]
        px[0, y] = tuple(int(c1[k] + (c2[k] - c1[k]) * lo) for k in range(3))
    return img.resize((w, h), Image.BILINEAR)


def metal(size, text, font, stops, bevel=True):
    w, h = size
    tm = Image.new("L", (w, h), 0)
    ImageDraw.Draw(tm).text((w // 2, h // 2), text, font=font, fill=255, anchor="mm")
    bb = tm.getbbox()
    grad = Image.new("RGB", (w, h), stops[0])
    if bb:
        grad.paste(vgrad((w, bb[3] - bb[1]), stops), (0, bb[1]))
    out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    if bevel:
        for o in range(12, 0, -1):
            sh = Image.new("L", (w, h), 0)
            ImageDraw.Draw(sh).text((w // 2 + o, h // 2 + o), text, font=font, fill=255, anchor="mm")
            out = Image.alpha_composite(out, Image.composite(
                Image.new("RGBA", (w, h), (0, 0, 0, 190)),
                Image.new("RGBA", (w, h), (0, 0, 0, 0)), sh))
    return Image.alpha_composite(out, Image.merge("RGBA", (*grad.split(), tm)))


def background(W, H, t):
    base = vgrad((W, H), [t["bg1"], t["bg2"], (0, 0, 0)])
    # mehak sij
    mask = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(mask)
    cx, cy, R = W // 2, int(H * 0.42), int(max(W, H) * 0.58)
    for i in range(80, 0, -1):
        r = R * i / 80
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=int(150 * (1 - i / 80) ** 2))
    mask = mask.filter(ImageFilter.GaussianBlur(R // 3))
    base = Image.composite(ImageChops.screen(base, Image.new("RGB", (W, H), t["glow"])), base, mask)
    # vinjeta
    v = Image.new("L", (W, H), 0)
    ImageDraw.Draw(v).ellipse([-W // 3, -H // 5, W + W // 3, H + H // 5], fill=255)
    v = v.filter(ImageFilter.GaussianBlur(240))
    base = Image.composite(base, ImageChops.multiply(base, Image.new("RGB", (W, H), (56, 56, 62))), v)
    n = Image.effect_noise((W, H), 10).convert("L")
    return ImageChops.overlay(base, Image.merge("RGB", (n, n, n)))


def rr(d, box, r, **kw):
    d.rounded_rectangle(box, radius=r, **kw)


def plaque(img, W, H, t):
    B, M, R = 40, 8, 52
    outer = Image.new("L", (W, H), 0)
    ImageDraw.Draw(outer).rounded_rectangle([M, M, W - M, H - M], radius=R, fill=255)
    inner = Image.new("L", (W, H), 0)
    ImageDraw.Draw(inner).rounded_rectangle([M + B, M + B, W - M - B, H - M - B], radius=R - B // 2, fill=255)
    ring = ImageChops.subtract(outer, inner)

    big = int((W ** 2 + H ** 2) ** .5) + 4
    g = vgrad((big, big), [t["met"][4], t["met"][1], t["met"][2], t["met"][1], t["met"][3], t["met"][0]])
    g = g.rotate(32, resample=Image.BICUBIC)
    g = g.crop(((big - W) // 2, (big - H) // 2, (big - W) // 2 + W, (big - H) // 2 + H))
    frame = Image.merge("RGBA", (*g.split(), ring))

    hi = ImageChops.subtract(ring, ImageChops.offset(ring, 6, 6)).filter(ImageFilter.GaussianBlur(2))
    lo = ImageChops.subtract(ring, ImageChops.offset(ring, -6, -6)).filter(ImageFilter.GaussianBlur(2))
    w = Image.new("RGBA", (W, H), (255, 255, 255, 0)); w.putalpha(hi.point(lambda v: int(v * .8)))
    k = Image.new("RGBA", (W, H), (0, 0, 0, 0)); k.putalpha(lo.point(lambda v: int(v * .78)))
    frame = Image.alpha_composite(Image.alpha_composite(frame, w), k)

    sh = ImageChops.subtract(inner, ImageChops.offset(inner, 0, 12)).filter(ImageFilter.GaussianBlur(10))
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0)); shadow.putalpha(sh.point(lambda v: int(v * .6)))

    base = Image.alpha_composite(img.convert("RGBA"), shadow)
    base = Image.alpha_composite(base, frame)
    d = ImageDraw.Draw(base, "RGBA")
    d.rounded_rectangle([M + B, M + B, W - M - B, H - M - B], radius=R - B // 2,
                        outline=(255, 255, 255, 55), width=2)
    d.rounded_rectangle([M, M, W - M, H - M], radius=R, outline=(0, 0, 0, 110), width=3)
    return base.convert("RGB")


def card(tier, dvig, kolicina, enota, odstotek, out):
    W, H = 1080, 1350
    t = TIERS[tier]
    img = background(W, H, t)

    # 1 logotip
    z = ZNAK.resize((230, 230), Image.LANCZOS)
    img.paste(z, ((W - 230) // 2, 108), z)

    d = ImageDraw.Draw(img)
    # 2 ime dviga
    d.text((W // 2, 406), " ".join(dvig.upper()), font=f(F_MED, 42),
           fill=(226, 232, 240), anchor="mm")

    # 3 velika številka
    num = metal((W, 460), str(kolicina), f(F_BOLD, 340), t["met"])
    img.paste(num, (0, 430), num)
    tmp = ImageDraw.Draw(Image.new("L", (4, 4)))
    nw = tmp.textlength(str(kolicina), font=f(F_BOLD, 340))
    d.text((W // 2 + nw // 2 + 36, 718), enota, font=f(F_BOLD, 96),
           fill=t["acc"], anchor="lm")

    # 4 odstotek
    pct = metal((W, 200), f"TOP {odstotek}%", f(F_BOLD, 136), t["met"], bevel=False)
    img.paste(pct, (0, 926), pct)

    # 5 ime ranga
    d.text((W // 2, 1176), " ".join(tier), font=f(F_BOLD, 62),
           fill=t["acc"], anchor="mm")

    img = plaque(img, W, H, t)
    img.save(out, quality=96)
    print("ok", out)


if __name__ == "__main__":
    demo = [("BRON", "Bench Press", 60, "KG", 64),
            ("SREBRO", "Bench Press", 80, "KG", 35),
            ("ZLATO", "Bench Press", 100, "KG", 11),
            ("PLATINA", "Deadlift", 220, "KG", 4),
            ("DIAMANT", "Squat", 200, "KG", 2)]
    for tier, dvig, kol, en, pct in demo:
        card(tier, dvig, kol, en, pct, f"/mnt/user-data/outputs/k2-{tier.lower()}.png")
