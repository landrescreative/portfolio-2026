"""
generate_portfolio_covers.py
Generates multi-platform landscape and banner covers using the official Cyber Tech Grid
and Orange Warm branding (#ff7319) for:
1. ArtStation & Behance: 1920 x 1080 px (16:9 Landscape Project Cover)
2. LinkedIn & Twitter Banner: 1584 x 396 px (Panoramic Header)

Outputs to:
- G:\\Mi unidad\\Personal y Marca\\LANDRES (Marca Personal)\\Portadas y Banners\\Dark Souls Personaje\\
"""

import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

GDRIVE_DIR = r"G:\Mi unidad\Proyectos 3D\Dark Souls Personaje\03_Portadas_Banners"
os.makedirs(GDRIVE_DIR, exist_ok=True)

HERO_RENDER = r"scripts/assets/renders_cache/dark-souls/shot_hero_34.png"
if not os.path.exists(HERO_RENDER):
    # Fallback to public folder
    HERO_RENDER = r"public/uploads/dark-souls-personaje-perspective.webp"

FONTS_DIR = r".agents/skills/blend-to-portfolio/assets/fonts"
FONT_BEBAS = os.path.join(FONTS_DIR, "BebasNeue.ttf")
FONT_SPACE = os.path.join(FONTS_DIR, "SpaceGrotesk.ttf")
FONT_INTER = os.path.join(FONTS_DIR, "Inter.ttf")

C_BG_DARK = (8, 9, 12)
C_BG_TOP = (12, 13, 16)
C_BG_BOT = (6, 7, 9)
C_ACCENT_ORANGE = (255, 115, 25)
C_WHITE = (255, 255, 255)
C_MUTED = (165, 170, 185)
C_FAINT = (95, 100, 115)

def get_cropped_hero():
    src = Image.open(HERO_RENDER).convert("RGBA")
    bbox = src.getbbox()
    return src.crop(bbox) if bbox else src

# -------------------------------------------------------------
# 1. ArtStation / Behance Project Cover (1920 x 1080 px)
# -------------------------------------------------------------
def build_artstation_cover():
    w, h = 1920, 1080
    img = Image.new("RGBA", (w, h), C_BG_DARK)
    draw = ImageDraw.Draw(img)

    for y in range(h):
        r = y / h
        col = (int(C_BG_TOP[0] + (C_BG_BOT[0] - C_BG_TOP[0]) * r),
               int(C_BG_TOP[1] + (C_BG_BOT[1] - C_BG_TOP[1]) * r),
               int(C_BG_TOP[2] + (C_BG_BOT[2] - C_BG_TOP[2]) * r), 255)
        draw.line([(0, y), (w, y)], fill=col)

    # Cyber Grid
    grid = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(grid)
    for x in range(0, w, 80):
        gdraw.line([(x, 0), (x, h)], fill=(40, 45, 60, 35), width=1)
    for y in range(0, h, 80):
        gdraw.line([(0, y), (w, y)], fill=(40, 45, 60, 35), width=1)

    mask = Image.new("L", (w, h), 255)
    mdraw = ImageDraw.Draw(mask)
    for r in range(w // 2, 0, -30):
        val = int(255 * (r / (w // 2)))
        mdraw.ellipse([(w // 2 - r, h // 2 - r), (w // 2 + r, h // 2 + r)], fill=val)
    mask = mask.filter(ImageFilter.GaussianBlur(90))
    grid.putalpha(mask.point(lambda p: int(p * 0.35)))
    img.paste(grid, (0, 0), grid)

    # Place 3D Model on the right side
    src = get_cropped_hero()
    cw, ch = src.size
    avail_h = 980
    scale = avail_h / ch
    nw, nh = int(cw * scale), int(ch * scale)
    resized = src.resize((nw, nh), Image.Resampling.LANCZOS)
    img.paste(resized, (w - nw - 100, (h - nh) // 2 + 30), resized)

    # Left Side Typography
    lx = 120
    top_y = 280

    # Pill tag
    draw.rounded_rectangle([(lx, top_y), (lx + 210, top_y + 32)], radius=16, fill=(18, 20, 26, 230), outline=(45, 48, 62), width=1)
    draw.ellipse([(lx + 14, top_y + 12), (lx + 20, top_y + 18)], fill=C_ACCENT_ORANGE)
    draw.text((lx + 32, top_y + 6), "3D CHARACTER STUDY", fill=C_MUTED, font=ImageFont.truetype(FONT_INTER, 15))

    # Giant Title
    f_mega = ImageFont.truetype(FONT_BEBAS, 175)
    draw.text((lx, top_y + 50), "DARK SOULS", fill=C_ACCENT_ORANGE, font=f_mega)

    # Subtitle
    f_sub = ImageFont.truetype(FONT_SPACE, 38)
    draw.text((lx, top_y + 240), "CREATURE ANATOMY & SCULPT", fill=C_WHITE, font=f_sub)

    # Description
    f_desc = ImageFont.truetype(FONT_INTER, 22)
    draw.text((lx, top_y + 300), "High-resolution organic 3D modeling · 946k polygons", fill=C_MUTED, font=f_desc)
    draw.text((lx, top_y + 334), "Interactive WebGL real-time inspection at landrescreative.com", fill=C_MUTED, font=f_desc)

    # Bottom Studio Branding
    draw.line([(lx, h - 140), (lx + 550, h - 140)], fill=(32, 35, 46), width=1)
    draw.text((lx, h - 105), "LANDRES", fill=C_WHITE, font=ImageFont.truetype(FONT_SPACE, 24))
    draw.text((lx + 130, h - 103), "·  Digital Sculptor & 3D Artist", fill=C_FAINT, font=ImageFont.truetype(FONT_INTER, 19))
    draw.text((lx + 440, h - 103), "@landrescreative", fill=C_ACCENT_ORANGE, font=ImageFont.truetype(FONT_INTER, 19))

    return img

# -------------------------------------------------------------
# 2. LinkedIn / Social Banner Header (1584 x 396 px)
# -------------------------------------------------------------
def build_linkedin_banner():
    w, h = 1584, 396
    img = Image.new("RGBA", (w, h), C_BG_DARK)
    draw = ImageDraw.Draw(img)

    for y in range(h):
        r = y / h
        col = (int(C_BG_TOP[0] + (C_BG_BOT[0] - C_BG_TOP[0]) * r),
               int(C_BG_TOP[1] + (C_BG_BOT[1] - C_BG_TOP[1]) * r),
               int(C_BG_TOP[2] + (C_BG_BOT[2] - C_BG_TOP[2]) * r), 255)
        draw.line([(0, y), (w, y)], fill=col)

    # Grid
    for x in range(0, w, 70):
        draw.line([(x, 0), (x, h)], fill=(40, 45, 60, 25), width=1)
    for y in range(0, h, 70):
        draw.line([(0, y), (w, y)], fill=(40, 45, 60, 25), width=1)

    # Place 3D Model on right
    src = get_cropped_hero()
    cw, ch = src.size
    avail_h = 360
    scale = avail_h / ch
    nw, nh = int(cw * scale), int(ch * scale)
    resized = src.resize((nw, nh), Image.Resampling.LANCZOS)
    img.paste(resized, (w - nw - 80, (h - nh) // 2 + 10), resized)

    # Left Typography
    lx = 80
    top_y = 65

    # Pill tag
    draw.rounded_rectangle([(lx, top_y), (lx + 185, top_y + 26)], radius=13, fill=(18, 20, 26, 230), outline=(45, 48, 62), width=1)
    draw.ellipse([(lx + 12, top_y + 10), (lx + 18, top_y + 16)], fill=C_ACCENT_ORANGE)
    draw.text((lx + 28, top_y + 5), "3D ART & SCULPT", fill=C_MUTED, font=ImageFont.truetype(FONT_INTER, 13))

    # Title
    f_mega = ImageFont.truetype(FONT_BEBAS, 95)
    draw.text((lx, top_y + 38), "DARK SOULS · 3D STUDY", fill=C_ACCENT_ORANGE, font=f_mega)

    # Subtitle
    f_sub = ImageFont.truetype(FONT_SPACE, 22)
    draw.text((lx, top_y + 145), "ORGANIC BIOMECHANICS & HIGH-POLY SCULPT", fill=C_WHITE, font=f_sub)

    # Footer
    f_foot = ImageFont.truetype(FONT_INTER, 17)
    draw.text((lx, top_y + 185), "landrescreative.com  ·  @landrescreative", fill=C_MUTED, font=f_foot)

    return img

def main():
    print("Generating Multi-Platform Portfolio Covers...")

    # 1. ArtStation
    art_img = build_artstation_cover()
    art_rgb = Image.new("RGB", (1920, 1080), C_BG_DARK)
    art_rgb.paste(art_img, (0, 0), art_img)
    p_art = os.path.join(GDRIVE_DIR, "artstation_behance_cover_1920x1080.png")
    art_rgb.save(p_art, "PNG", quality=98)
    print("  [OK] Saved ArtStation/Behance Cover (1920x1080)")

    # 2. LinkedIn
    link_img = build_linkedin_banner()
    link_rgb = Image.new("RGB", (1584, 396), C_BG_DARK)
    link_rgb.paste(link_img, (0, 0), link_img)
    p_link = os.path.join(GDRIVE_DIR, "linkedin_twitter_banner_1584x396.png")
    link_rgb.save(p_link, "PNG", quality=98)
    print("  [OK] Saved LinkedIn/Social Banner (1584x396)")

    print("\nAll Portfolio Covers Generated Successfully in Google Drive!")

if __name__ == "__main__":
    main()
