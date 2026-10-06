#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Kartice z rangi: BRON / SREBRO / ZLATO / PLATINA / DIAMANT
Vsak rang ima svojo paleto, obrobo in količino sijaja.
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops
import math, random

W, H = 1080, 1350
LAND = False
GF = "/usr/share/fonts/truetype/google-fonts/"
F_BOLD = GF + "Poppins-Bold.ttf"
F_MED = GF + "Poppins-Medium.ttf"
F_LIGHT = GF + "Poppins-Light.ttf"


def f(path, size):
    return ImageFont.truetype(path, size)


# ---------- RANGI ----------
# bg1/bg2 = ozadje, met = kovinski prelivi za številko, acc = poudarek
TIERS = {
    "BRON": dict(
        bg1=(26, 18, 12), bg2=(10, 8, 7),
        glow=(140, 80, 32),
        met=[(92, 54, 24), (214, 142, 74), (255, 212, 160), (168, 102, 48), (70, 40, 18)],
        acc=(216, 150, 86),
        rim=(140, 88, 44),
        rays=0, sparkle=0,
    ),
    "SREBRO": dict(
        bg1=(20, 24, 28), bg2=(8, 10, 12),
        glow=(110, 130, 150),
        met=[(78, 88, 98), (176, 190, 204), (255, 255, 255), (140, 152, 166), (60, 68, 78)],
        acc=(198, 212, 226),
        rim=(150, 166, 182),
        rays=0, sparkle=1,
    ),
    "ZLATO": dict(
        bg1=(30, 23, 8), bg2=(12, 9, 4),
        glow=(190, 145, 30),
        met=[(120, 82, 12), (230, 180, 60), (255, 244, 198), (198, 146, 36), (96, 64, 10)],
        acc=(255, 206, 92),
        rim=(214, 168, 62),
        rays=1, sparkle=2,
    ),
    "PLATINA": dict(
        bg1=(14, 26, 30), bg2=(6, 11, 13),
        glow=(90, 180, 200),
        met=[(96, 134, 146), (190, 226, 236), (255, 255, 255), (150, 192, 206), (72, 104, 116)],
        acc=(176, 228, 240),
        rim=(150, 206, 222),
        rays=1, sparkle=3,
    ),
    "DIAMANT": dict(
        bg1=(18, 16, 38), bg2=(7, 6, 16),
        glow=(120, 110, 240),
        met=[(96, 150, 220), (170, 220, 255), (255, 255, 255), (190, 160, 255), (110, 96, 210)],
        acc=(168, 214, 255),
        rim=(150, 180, 255),
        rays=2, sparkle=4,
    ),
}


def vert_gradient(size, stops):
    """Navpični preliv iz seznama barv."""
    w, h = size
    img = Image.new("RGB", (1, h))
    px = img.load()
    n = len(stops) - 1
    for y in range(h):
        t = y / max(1, h - 1) * n
        i = min(int(t), n - 1)
        local = t - i
        c1, c2 = stops[i], stops[i + 1]
        px[0, y] = tuple(int(c1[k] + (c2[k] - c1[k]) * local) for k in range(3))
    return img.resize((w, h), Image.BILINEAR)


def radial_glow(size, color, cx, cy, radius, strength=1.0):
    w, h = size
    mask = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(mask)
    steps = 90
    for i in range(steps, 0, -1):
        r = radius * i / steps
        v = int(255 * strength * (1 - i / steps) ** 2.0)
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=v)
    mask = mask.filter(ImageFilter.GaussianBlur(radius // 3))
    layer = Image.new("RGB", (w, h), color)
    return layer, mask


def background(t):
    """Ozadje: preliv + fasetirane ploskve + sij + zrno."""
    base = vert_gradient((W, H), [t["bg1"], t["bg2"], (0, 0, 0)])

    # fasetirane ploskve - dajo občutek oblikovanja, ne le gradienta
    facets = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    fd = ImageDraw.Draw(facets)
    a = t["glow"]
    fd.polygon([(0, 0), (W, 0), (W, 240), (0, 420)], fill=(a[0], a[1], a[2], 16))
    fd.polygon([(0, 420), (W, 240), (W, 560), (0, 760)], fill=(255, 255, 255, 6))
    fd.polygon([(0, H), (W, H), (W, H - 300), (0, H - 170)], fill=(a[0], a[1], a[2], 14))
    base = Image.alpha_composite(base.convert("RGBA"), facets).convert("RGB")

    # žarki pri višjih rangih
    if t["rays"]:
        rays = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        rd = ImageDraw.Draw(rays)
        cx, cy = W // 2, 560
        for i in range(28):
            ang = i * (360 / 28) + 6
            r1, r2 = 120, 1500
            spread = 2.0
            p = [
                (cx + r1 * math.cos(math.radians(ang - spread)), cy + r1 * math.sin(math.radians(ang - spread))),
                (cx + r2 * math.cos(math.radians(ang - spread * 2)), cy + r2 * math.sin(math.radians(ang - spread * 2))),
                (cx + r2 * math.cos(math.radians(ang + spread * 2)), cy + r2 * math.sin(math.radians(ang + spread * 2))),
                (cx + r1 * math.cos(math.radians(ang + spread)), cy + r1 * math.sin(math.radians(ang + spread))),
            ]
            rd.polygon(p, fill=(255, 255, 255, 5 * t["rays"]))
        rays = rays.filter(ImageFilter.GaussianBlur(26))
        base = Image.alpha_composite(base.convert("RGBA"), rays).convert("RGB")

    # osrednji sij
    layer, mask = radial_glow((W, H), t["glow"], W // 2, 540, 620, 0.55)
    base = Image.composite(ImageChops.screen(base, layer), base, mask)

    # vinjeta
    vign = Image.new("L", (W, H), 0)
    vd = ImageDraw.Draw(vign)
    vd.ellipse([-W // 2, -H // 4, W + W // 2, H + H // 4], fill=255)
    vign = vign.filter(ImageFilter.GaussianBlur(260))
    base = Image.composite(base, ImageChops.multiply(base, Image.new("RGB", (W, H), (60, 60, 66))), vign)

    # zrno
    noise = Image.effect_noise((W, H), 12).convert("L")
    base = ImageChops.overlay(base, Image.merge("RGB", (noise, noise, noise)))
    return base


def metal_text(draw_size, text, font, stops, bevel=True):
    """Besedilo s kovinskim prelivom, senco in zgornjim odsevom."""
    w, h = draw_size
    tmp = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(tmp)
    d.text((w // 2, h // 2), text, font=font, fill=255, anchor="mm")

    bbox = tmp.getbbox()
    grad = vert_gradient((w, h), stops)
    if bbox:
        gh = bbox[3] - bbox[1]
        g2 = vert_gradient((w, gh), stops)
        grad = Image.new("RGB", (w, h), stops[0])
        grad.paste(g2, (0, bbox[1]))

    out = Image.new("RGBA", (w, h), (0, 0, 0, 0))

    if bevel:
        # ekstrudirana senca navzdol-desno
        for off in range(14, 0, -1):
            sh = Image.new("L", (w, h), 0)
            sd = ImageDraw.Draw(sh)
            sd.text((w // 2 + off, h // 2 + off), text, font=font, fill=255, anchor="mm")
            dark = Image.new("RGBA", (w, h), (0, 0, 0, 200))
            out = Image.alpha_composite(out, Image.composite(
                dark, Image.new("RGBA", (w, h), (0, 0, 0, 0)), sh))

    out = Image.alpha_composite(out, Image.merge("RGBA", (*grad.split(), tmp)))

    # zgornji odsev
    hi = Image.new("L", (w, h), 0)
    hd = ImageDraw.Draw(hi)
    hd.text((w // 2, h // 2 - 4), text, font=font, fill=255, anchor="mm")
    hi = ImageChops.subtract(hi, tmp.filter(ImageFilter.GaussianBlur(1)))
    out = Image.alpha_composite(out, Image.merge(
        "RGBA", (Image.new("L", (w, h), 255),) * 3 + (hi.point(lambda v: v // 2),)))
    return out


def tier_badge(t, name, width=560, height=96):
    """Značka ranga - šesterokotna ploščica s kovinskim robom."""
    sc = 3
    w, h = width * sc, height * sc
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    cut = h // 2
    shape = [(cut, 0), (w - cut, 0), (w, h // 2), (w - cut, h), (cut, h), (0, h // 2)]
    d.polygon(shape, fill=(0, 0, 0, 170))
    d.line(shape + [shape[0]], fill=t["rim"] + (255,), width=4 * sc)
    img = img.resize((width, height), Image.LANCZOS)

    fnt = f(F_BOLD, 40)
    dd = ImageDraw.Draw(img)
    sp = " ".join(name)
    dd.text((width // 2, height // 2 - 2), sp, font=fnt, fill=t["acc"] + (255,), anchor="mm")
    return img


def diag_gradient(size, stops, angle=35):
    """Diagonalni kovinski preliv."""
    w, h = size
    big = int((w ** 2 + h ** 2) ** 0.5) + 4
    g = vert_gradient((big, big), stops)
    g = g.rotate(angle, resample=Image.BICUBIC)
    left = (big - w) // 2
    top = (big - h) // 2
    return g.crop((left, top, left + w, top + h))


def plaque(img, t):
    """3D kovinska obroba - kot plaketa."""
    B = 46          # debelina obrobe
    R_OUT = 56
    R_IN = R_OUT - B // 2

    base = img.convert("RGBA")

    # --- maska obroče (zunanji zaobljen pravokotnik minus notranji) ---
    outer = Image.new("L", (W, H), 0)
    ImageDraw.Draw(outer).rounded_rectangle([8, 8, W - 8, H - 8], radius=R_OUT, fill=255)
    inner = Image.new("L", (W, H), 0)
    ImageDraw.Draw(inner).rounded_rectangle(
        [8 + B, 8 + B, W - 8 - B, H - 8 - B], radius=R_IN, fill=255)
    ring = ImageChops.subtract(outer, inner)

    # --- kovina na obroču ---
    metal = diag_gradient((W, H), [t["met"][4], t["met"][1], t["met"][2],
                                   t["met"][1], t["met"][3], t["met"][0]], angle=32)
    frame_layer = Image.merge("RGBA", (*metal.split(), ring))

    # --- bevel: svetel zgoraj-levo, temen spodaj-desno ---
    hi = ImageChops.subtract(ring, ImageChops.offset(ring, 7, 7))
    hi = hi.filter(ImageFilter.GaussianBlur(2))
    lo = ImageChops.subtract(ring, ImageChops.offset(ring, -7, -7))
    lo = lo.filter(ImageFilter.GaussianBlur(2))

    white = Image.new("RGBA", (W, H), (255, 255, 255, 0))
    white.putalpha(hi.point(lambda v: int(v * 0.85)))
    dark = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    dark.putalpha(lo.point(lambda v: int(v * 0.8)))

    frame_layer = Image.alpha_composite(frame_layer, white)
    frame_layer = Image.alpha_composite(frame_layer, dark)

    # --- senca, ki jo obroba vrže na kartico ---
    sh = ImageChops.subtract(inner, ImageChops.offset(inner, 0, 14))
    sh = sh.filter(ImageFilter.GaussianBlur(11))
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    shadow.putalpha(sh.point(lambda v: int(v * 0.65)))
    base = Image.alpha_composite(base, shadow)

    base = Image.alpha_composite(base, frame_layer)

    # --- tanka svetla linija po notranjem robu ---
    d = ImageDraw.Draw(base, "RGBA")
    d.rounded_rectangle([8 + B, 8 + B, W - 8 - B, H - 8 - B], radius=R_IN,
                        outline=(255, 255, 255, 60), width=2)
    d.rounded_rectangle([8, 8, W - 8, H - 8], radius=R_OUT,
                        outline=(0, 0, 0, 120), width=3)

    # --- vijaki v kotih (kot na pravi plaketi) ---
    for (x, y) in [(8 + B // 2, 8 + B // 2), (W - 8 - B // 2, 8 + B // 2),
                   (8 + B // 2, H - 8 - B // 2), (W - 8 - B // 2, H - 8 - B // 2)]:
        r = 9
        d.ellipse([x - r, y - r, x + r, y + r], fill=(0, 0, 0, 90))
        d.ellipse([x - r + 2, y - r + 2, x + r - 1, y + r - 1],
                  fill=t["acc"] + (210,))
        d.line([x - 4, y, x + 4, y], fill=(0, 0, 0, 140), width=2)

    return base.convert("RGB")


def sparkles(img, t):
    if not t["sparkle"]:
        return img
    rnd = random.Random(7)
    lay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)
    for _ in range(t["sparkle"] * 7):
        x, y = rnd.randint(70, W - 70), rnd.randint(70, H - 300)
        s = rnd.randint(6, 20)
        d.line([x - s, y, x + s, y], fill=(255, 255, 255, 190), width=2)
        d.line([x, y - s, x, y + s], fill=(255, 255, 255, 190), width=2)
    lay = lay.filter(ImageFilter.GaussianBlur(1.6))
    return Image.alpha_composite(img.convert("RGBA"), lay).convert("RGB")


def make_card(tier, dvig, kg, teza, odstotek, razmerje, out):
    t = TIERS[tier]
    img = background(t)

    # značka ranga
    b = tier_badge(t, tier)
    img.paste(b, ((W - b.width) // 2, 104), b)

    # ime dviga
    d = ImageDraw.Draw(img)
    d.text((W // 2, 236), " ".join(dvig.upper()), font=f(F_MED, 44),
           fill=(236, 240, 246), anchor="mm")

    # velika številka
    num = metal_text((W, 420), str(kg), f(F_BOLD, 330), t["met"])
    img.paste(num, (0, 300), num)

    # KG
    nb = ImageDraw.Draw(Image.new("L", (10, 10)))
    nw = nb.textlength(str(kg), font=f(F_BOLD, 330))
    d.text((W // 2 + nw // 2 + 34, 585), "KG", font=f(F_BOLD, 92),
           fill=t["acc"], anchor="lm")

    # odstotek
    panel_y = 760
    ov = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(ov)
    od.rounded_rectangle([112, panel_y, W - 112, panel_y + 210], radius=34,
                         fill=(255, 255, 255, 14), outline=t["rim"] + (80,), width=2)
    bar_y0 = 1046
    od.rounded_rectangle([140, bar_y0, W - 140, bar_y0 + 34], radius=17,
                         fill=(255, 255, 255, 26))
    img = Image.alpha_composite(img.convert("RGBA"), ov).convert("RGB")
    d = ImageDraw.Draw(img)
    pct = metal_text((W, 150), odstotek, f(F_BOLD, 118), t["met"], bevel=False)
    img.paste(pct, (0, panel_y + 8), pct)
    d.text((W // 2, panel_y + 170), f"DO {teza} KG   •   BALKAN",
           font=f(F_MED, 36), fill=(170, 180, 192), anchor="mm")

    # napredek do naslednjega ranga
    bar_y = 1046
    fill_w = int((W - 280) * 0.72)
    d.rounded_rectangle([140, bar_y, 140 + fill_w, bar_y + 34], radius=17, fill=t["acc"])
    d.text((140, bar_y + 68), "TI", font=f(F_BOLD, 30), fill=(150, 160, 172), anchor="lm")
    nxt = list(TIERS.keys())
    i = nxt.index(tier)
    nx = nxt[i + 1] if i + 1 < len(nxt) else "VRH"
    d.text((W - 140, bar_y + 68), nx, font=f(F_BOLD, 30), fill=(150, 160, 172), anchor="rm")

    # spodnji podatki
    d.text((152, 1206), razmerje, font=f(F_BOLD, 62), fill=(242, 246, 252), anchor="lm")
    d.text((152, 1258), "TELESNA TEŽA", font=f(F_MED, 28), fill=(140, 150, 162), anchor="lm")
    d.text((W - 152, 1206), tier, font=f(F_BOLD, 50), fill=t["acc"], anchor="rm")
    d.text((W - 152, 1258), "RANG", font=f(F_MED, 28), fill=(140, 150, 162), anchor="rm")

    img = sparkles(img, t)
    img = plaque(img, t)
    img.save(out, quality=96)
    print("shranjeno:", out)




def make_card_wide(tier, dvig, kg, teza, odstotek, razmerje, out):
    """Ležeča 1600x900 - številka levo, podatki desno."""
    global W, H
    W, H = 1600, 900
    t = TIERS[tier]
    img = background(t)
    d = ImageDraw.Draw(img)

    LX = 560          # sredina levega stolpca
    RX = 1052         # začetek desnega stolpca

    # --- levo: značka, dvig, številka ---
    b = tier_badge(t, tier, width=420, height=78)
    img.paste(b, (LX - b.width // 2, 118), b)

    d.text((LX, 236), " ".join(dvig.upper()), font=f(F_MED, 36),
           fill=(236, 240, 246), anchor="mm")

    num = metal_text((W, 360), str(kg), f(F_BOLD, 290), t["met"])
    img.paste(num, (LX - W // 2, 300), num)

    nb = ImageDraw.Draw(Image.new("L", (10, 10)))
    nw = nb.textlength(str(kg), font=f(F_BOLD, 290))
    d.text((LX + nw // 2 + 28, 540), "KG", font=f(F_BOLD, 80),
           fill=t["acc"], anchor="lm")

    d.text((LX, 700), razmerje + "  TELESNE TEŽE", font=f(F_BOLD, 40),
           fill=(210, 218, 228), anchor="mm")

    # --- navpična ločnica ---
    ov = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(ov)
    od.line([996, 180, 996, H - 180], fill=t["rim"] + (90,), width=2)
    od.rounded_rectangle([RX, 300, W - 86, 500], radius=30,
                         fill=(255, 255, 255, 14), outline=t["rim"] + (80,), width=2)
    od.rounded_rectangle([RX, 600, W - 86, 634], radius=17,
                         fill=(255, 255, 255, 26))
    img = Image.alpha_composite(img.convert("RGBA"), ov).convert("RGB")
    d = ImageDraw.Draw(img)

    # --- desno: odstotek ---
    pw = W - 86 - RX
    pct = metal_text((pw, 130), odstotek, f(F_BOLD, 74), t["met"], bevel=False)
    img.paste(pct, (RX, 328), pct)
    d.text((RX + pw // 2, 466), f"DO {teza} KG   •   BALKAN",
           font=f(F_MED, 30), fill=(170, 180, 192), anchor="mm")

    # --- desno: napredek ---
    fill_w = int(pw * 0.72)
    d.rounded_rectangle([RX, 600, RX + fill_w, 634], radius=17, fill=t["acc"])
    nxt = list(TIERS.keys())
    i = nxt.index(tier)
    nx = nxt[i + 1] if i + 1 < len(nxt) else "VRH"
    d.text((RX, 668), "TI", font=f(F_BOLD, 26), fill=(150, 160, 172), anchor="lm")
    d.text((W - 86, 668), nx, font=f(F_BOLD, 26), fill=(150, 160, 172), anchor="rm")

    d.text((RX, 760), tier, font=f(F_BOLD, 44), fill=t["acc"], anchor="lm")
    d.text((W - 86, 760), "RANG", font=f(F_MED, 26), fill=(140, 150, 162), anchor="rm")

    img = sparkles(img, t)
    img = plaque(img, t)
    img.save(out, quality=96)
    print("shranjeno:", out)
    W, H = 1080, 1350


if __name__ == "__main__":
    # pregled vseh rangov
    demo = [
        ("BRON", "Bench Press", 60, 75, "TOP 60%", "0.80x"),
        ("SREBRO", "Bench Press", 80, 75, "TOP 35%", "1.07x"),
        ("ZLATO", "Bench Press", 100, 75, "TOP 10%", "1.37x"),
        ("PLATINA", "Bench Press", 120, 75, "TOP 4%", "1.60x"),
        ("DIAMANT", "Bench Press", 145, 75, "TOP 1%", "1.93x"),
    ]
    for tier, dvig, kg, teza, pct, raz in demo:
        make_card(tier, dvig, kg, teza, pct, raz,
                  f"/mnt/user-data/outputs/rang-{tier.lower()}.png")
    for tier, dvig, kg, teza, pct, raz in demo:
        make_card_wide(tier, dvig, kg, teza, pct, raz,
                       f"/mnt/user-data/outputs/rang-{tier.lower()}-lezeca.png")
