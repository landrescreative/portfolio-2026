"""
scripts/carousel_generator.py
Official Automated Design Engine for Instagram Carousels (1080x1350 px, 4:5 vertical)
for landrescreative.com / LANDRES.

Standard Style:
- Palette:
    * Background: Studio Dark (#08090c) with smooth ambient gradient
    * Texture: Cyber Tech Studio Grid (fine 80px lines with smooth radial vignette)
    * Accent: Orange Warm (#ff7319) - Official brand highlight
    * Typography: Bebas Neue (Monumental Titles), Space Grotesk (Subtitles / Technical), Inter (Body & Micro UI)
- Flow Structure:
    * Slide 1 (Cover):
        - Micro tag pill ("● 3D CREATURE STUDY" / "● 3D PROJECT")
        - Monumental Headline (Bebas Neue in Orange Warm)
        - Subtitle (Space Grotesk in Crisp White)
        - Concise description (Inter in Soft Slate)
        - 3D Model grounded at bottom, zero overlap
        - Footer: @landrescreative + "desliza  →"
    * Slides 2, 3, 4 (Visual Showcases):
        - Pure, high-impact 3D render at maximum scale
        - Studio Cyber Grid backdrop
        - Clean footer: @landrescreative + "desliza  →"
    * Slide 5 (Outro & Web CTA):
        - Micro pill: "● INTERACTIVE 3D WEB"
        - Headline: "Explora el Modelo 3D"
        - Body note inviting real-time orbit inspection
        - Big brand URL: landrescreative.com
        - Project subtitle
        - Creator signature divider: LANDRES · @landrescreative
"""

import os
import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter

CANVAS_WIDTH = 1080
CANVAS_HEIGHT = 1350

# Fonts directory
FONTS_DIR = os.path.join(os.path.dirname(__file__), "assets", "fonts")
FONT_BEBAS = os.path.join(FONTS_DIR, "BebasNeue.ttf")
FONT_SPACE = os.path.join(FONTS_DIR, "SpaceGrotesk.ttf")
FONT_INTER = os.path.join(FONTS_DIR, "Inter.ttf")

# Official Design Tokens
TOKENS = {
    "colors": {
        "bg_dark": (8, 9, 12),
        "bg_top": (12, 13, 16),
        "bg_bottom": (6, 7, 9),
        "accent_orange": (255, 115, 25),      # #ff7319 V3 Orange Warm
        "text_primary": (255, 255, 255),      # Crisp White
        "text_secondary": (165, 170, 185),    # Muted Slate
        "text_faint": (95, 100, 115),         # Navigation cues
        "hairline": (28, 30, 40),
        "pill_bg": (18, 20, 26, 230),
        "pill_border": (45, 48, 62),
    },
    "grid": {
        "step": 80,
        "line_color": (40, 45, 60, 35),
    },
    "layout": {
        "margin_x": 84,
        "content_top": 85,
        "footer_y": 1260,
    }
}

class OfficialCarouselGenerator:
    def __init__(self, tokens=TOKENS):
        self.t = tokens
        self.fonts = {
            "title_mega": ImageFont.truetype(FONT_BEBAS, 155),
            "title_hero": ImageFont.truetype(FONT_SPACE, 48),
            "title_sub": ImageFont.truetype(FONT_SPACE, 34),
            "title_card": ImageFont.truetype(FONT_SPACE, 38),
            "desc": ImageFont.truetype(FONT_INTER, 20),
            "desc_medium": ImageFont.truetype(FONT_INTER, 22),
            "pill": ImageFont.truetype(FONT_INTER, 14),
            "handle": ImageFont.truetype(FONT_INTER, 19),
            "cue": ImageFont.truetype(FONT_INTER, 17),
            "url_big": ImageFont.truetype(FONT_SPACE, 42),
            "url_sub": ImageFont.truetype(FONT_INTER, 18),
        }

    def create_cyber_grid_canvas(self, handle="@landrescreative", is_last_slide=False):
        """Creates the official Cyber Tech Grid background with smooth radial falloff."""
        img = Image.new("RGBA", (CANVAS_WIDTH, CANVAS_HEIGHT), self.t["colors"]["bg_dark"])
        draw = ImageDraw.Draw(img)

        # Smooth vertical gradient
        bg_t = self.t["colors"]["bg_top"]
        bg_b = self.t["colors"]["bg_bottom"]
        for y in range(CANVAS_HEIGHT):
            ratio = y / CANVAS_HEIGHT
            r = int(bg_t[0] + (bg_b[0] - bg_t[0]) * ratio)
            g = int(bg_t[1] + (bg_b[1] - bg_t[1]) * ratio)
            b = int(bg_t[2] + (bg_b[2] - bg_t[2]) * ratio)
            draw.line([(0, y), (CANVAS_WIDTH, y)], fill=(r, g, b, 255))

        # Cyber Grid overlay with radial mask
        grid = Image.new("RGBA", (CANVAS_WIDTH, CANVAS_HEIGHT), (0, 0, 0, 0))
        gdraw = ImageDraw.Draw(grid)
        step = self.t["grid"]["step"]
        line_color = self.t["grid"]["line_color"]

        for x in range(60, CANVAS_WIDTH, step):
            gdraw.line([(x, 0), (x, CANVAS_HEIGHT)], fill=line_color, width=1)
        for y in range(60, CANVAS_HEIGHT, step):
            gdraw.line([(0, y), (CANVAS_WIDTH, y)], fill=line_color, width=1)

        # Radial mask: grid is clear near center and gently dissolves outward
        mask = Image.new("L", (CANVAS_WIDTH, CANVAS_HEIGHT), 255)
        mdraw = ImageDraw.Draw(mask)
        center_x, center_y = CANVAS_WIDTH // 2, 700
        for r in range(CANVAS_WIDTH // 2, 0, -20):
            val = int(255 * (r / (CANVAS_WIDTH // 2)))
            mdraw.ellipse([(center_x - r, center_y - r), (center_x + r, center_y + r)], fill=val)
        mask = mask.filter(ImageFilter.GaussianBlur(80))
        grid.putalpha(mask.point(lambda p: int(p * 0.35)))
        img.paste(grid, (0, 0), grid)

        # Minimalist studio footer
        mx = self.t["layout"]["margin_x"]
        fy = self.t["layout"]["footer_y"]
        accent = self.t["colors"]["accent_orange"]

        draw.text((mx, fy), handle, fill=self.t["colors"]["text_secondary"], font=self.fonts["handle"])

        if not is_last_slide:
            draw.text((CANVAS_WIDTH - mx - 90, fy), "desliza  →", fill=accent, font=self.fonts["cue"])
        else:
            draw.text((CANVAS_WIDTH - mx - 180, fy), "landrescreative.com", fill=accent, font=self.fonts["handle"])

        return img

    def place_sculpt(self, img, img_path, target_box=(80, 420, 1000, 1220), align_center=False):
        """Crops sculpt to its visible bounding box and scales it with zero overlap."""
        if not os.path.exists(img_path):
            print(f"Warning: Render image not found at {img_path}")
            return img

        src = Image.open(img_path).convert("RGBA")
        bbox = src.getbbox()
        if bbox:
            src = src.crop(bbox)

        cw, ch = src.size
        bx0, by0, bx1, by1 = target_box
        avail_w = bx1 - bx0
        avail_h = by1 - by0

        scale = min(avail_w / cw, avail_h / ch)
        nw, nh = int(cw * scale), int(ch * scale)
        resized = src.resize((nw, nh), Image.Resampling.LANCZOS)

        pos_x = bx0 + (avail_w - nw) // 2
        pos_y = (by0 + (avail_h - nh) // 2) if align_center else (by1 - nh)

        img.paste(resized, (pos_x, pos_y), resized)
        return img

    def wrap_text(self, text, font, max_width):
        lines = []
        words = text.split()
        curr = ""
        for w in words:
            test = (curr + " " + w).strip()
            bbox = font.getbbox(test)
            if (bbox[2] - bbox[0]) <= max_width:
                curr = test
            else:
                if curr:
                    lines.append(curr)
                curr = w
        if curr:
            lines.append(curr)
        return lines

    def render_cover_slide(self, slide_cfg, handle="@landrescreative"):
        img = self.create_cyber_grid_canvas(handle=handle, is_last_slide=False)
        draw = ImageDraw.Draw(img)

        mx = self.t["layout"]["margin_x"]
        top_y = self.t["layout"]["content_top"]
        accent = self.t["colors"]["accent_orange"]

        # 1. Pill tag
        tag_text = slide_cfg.get("tag", "3D CREATURE STUDY")
        draw.rounded_rectangle([(mx, top_y), (mx + 200, top_y + 28)], radius=14, fill=self.t["colors"]["pill_bg"], outline=self.t["colors"]["pill_border"], width=1)
        draw.ellipse([(mx + 12, top_y + 11), (mx + 18, top_y + 17)], fill=accent)
        draw.text((mx + 28, top_y + 5), tag_text, fill=self.t["colors"]["text_secondary"], font=self.fonts["pill"])

        # 2. Monumental Headline (Bebas Neue)
        title = slide_cfg.get("title", "DARK SOULS")
        draw.text((mx, top_y + 40), title, fill=accent, font=self.fonts["title_mega"])

        # 3. Subtitle (Space Grotesk)
        subtitle = slide_cfg.get("subtitle", "CREATURE ANATOMY STUDY")
        draw.text((mx, top_y + 205), subtitle, fill=self.t["colors"]["text_primary"], font=self.fonts["title_sub"])

        # 4. Description (Inter)
        desc = slide_cfg.get("description", "")
        if desc:
            lines = self.wrap_text(desc, self.fonts["desc"], CANVAS_WIDTH - (mx * 2))
            cy = top_y + 258
            for l in lines:
                draw.text((mx, cy), l, fill=self.t["colors"]["text_secondary"], font=self.fonts["desc"])
                cy += 30

        # 5. Sculpt placed grounded
        if "image" in slide_cfg:
            self.place_sculpt(img, slide_cfg["image"], target_box=(80, top_y + 300, 1000, 1220), align_center=False)

        return img

    def render_showcase_slide(self, slide_cfg, handle="@landrescreative"):
        img = self.create_cyber_grid_canvas(handle=handle, is_last_slide=False)
        if "image" in slide_cfg:
            # Full vertical canvas space for pure artwork
            self.place_sculpt(img, slide_cfg["image"], target_box=(80, 80, 1000, 1220), align_center=True)
        return img

    def render_outro_slide(self, slide_cfg, handle="@landrescreative", website="landrescreative.com"):
        img = self.create_cyber_grid_canvas(handle=handle, is_last_slide=True)
        draw = ImageDraw.Draw(img)

        mx = self.t["layout"]["margin_x"]
        accent = self.t["colors"]["accent_orange"]
        sy = 330

        # Pill tag
        draw.rounded_rectangle([(mx, sy), (mx + 210, sy + 28)], radius=14, fill=self.t["colors"]["pill_bg"], outline=self.t["colors"]["pill_border"], width=1)
        draw.ellipse([(mx + 12, sy + 11), (mx + 18, sy + 17)], fill=accent)
        draw.text((mx + 28, sy + 5), "INTERACTIVE 3D WEB", fill=self.t["colors"]["text_secondary"], font=self.fonts["pill"])

        sy += 50
        title = slide_cfg.get("title", "Explora el Modelo 3D")
        draw.text((mx, sy), title, fill=self.t["colors"]["text_primary"], font=self.fonts["title_hero"])

        desc = slide_cfg.get("description", "Puedes orbitar, hacer zoom e inspeccionar la malla interactiva en tiempo real en mi portafolio web oficial:")
        desc_lines = self.wrap_text(desc, self.fonts["desc_medium"], 820)
        cy = sy + 85
        for l in desc_lines:
            draw.text((mx, cy), l, fill=self.t["colors"]["text_secondary"], font=self.fonts["desc_medium"])
            cy += 36

        cy += 45
        # Big official website link
        draw.text((mx, cy), website, fill=accent, font=self.fonts["url_big"])
        cy += 58
        proj_label = slide_cfg.get("project_label", "Dark Souls · Personaje 3D (WIP)")
        draw.text((mx, cy), proj_label, fill=self.t["colors"]["text_faint"], font=self.fonts["url_sub"])

        # Creator signature divider
        cy += 130
        draw.line([(mx, cy), (CANVAS_WIDTH - mx, cy)], fill=self.t["colors"]["hairline"], width=1)
        cy += 35
        draw.text((mx, cy), "LANDRES", fill=self.t["colors"]["text_primary"], font=self.fonts["title_card"])
        cy += 48
        draw.text((mx, cy), handle, fill=accent, font=self.fonts["desc_medium"])

        # Faded artistic 3D silhouette in background right
        if "image" in slide_cfg and os.path.exists(slide_cfg["image"]):
            src = Image.open(slide_cfg["image"]).convert("RGBA")
            bbox = src.getbbox()
            if bbox:
                src = src.crop(bbox)
            sw, sh = src.size
            scale = 500 / sh
            nw, nh = int(sw * scale), int(sh * scale)
            src_res = src.resize((nw, nh), Image.Resampling.LANCZOS)
            alpha = src_res.split()[3].point(lambda p: int(p * 0.16))
            src_res.putalpha(alpha)
            img.paste(src_res, (CANVAS_WIDTH - nw - 30, CANVAS_HEIGHT - nh - 110), src_res)

        return img


def generate_full_carousel(config):
    gen = OfficialCarouselGenerator()
    os.makedirs(config["output_gdrive"], exist_ok=True)
    os.makedirs(config["output_local"], exist_ok=True)

    slides = config["slides"]
    total = len(slides)

    print(f"Generating Official Standard Carousel ({total} slides)...")

    for i, s in enumerate(slides, start=1):
        stype = s.get("type", "showcase")
        if stype == "cover":
            img = gen.render_cover_slide(s, handle=config.get("handle", "@landrescreative"))
        elif stype == "showcase":
            img = gen.render_showcase_slide(s, handle=config.get("handle", "@landrescreative"))
        elif stype == "outro":
            img = gen.render_outro_slide(s, handle=config.get("handle", "@landrescreative"), website=config.get("website", "landrescreative.com"))

        rgb = Image.new("RGB", (CANVAS_WIDTH, CANVAS_HEIGHT), TOKENS["colors"]["bg_dark"])
        rgb.paste(img, (0, 0), img)

        fname = s.get("filename", f"slide_{i:02d}.png")

        # 1. Google Drive
        g_png = os.path.join(config["output_gdrive"], fname)
        g_webp = os.path.join(config["output_gdrive"], fname.replace(".png", ".webp"))
        rgb.save(g_png, "PNG", quality=98)
        rgb.save(g_webp, "WEBP", quality=92)

        # 2. Local Portfolio
        l_png = os.path.join(config["output_local"], fname)
        l_webp = os.path.join(config["output_local"], fname.replace(".png", ".webp"))
        rgb.save(l_png, "PNG", quality=95)
        rgb.save(l_webp, "WEBP", quality=90)

        print(f"  [OK] Exported {fname}")

    print("\nOfficial Carousel Generation Complete!")


if __name__ == "__main__":
    CACHE_DIR = r"scripts/assets/renders_cache/dark-souls"
    config = {
        "handle": "@landrescreative",
        "website": "landrescreative.com",
        "output_gdrive": r"G:\Mi unidad\Personal y Marca\LANDRES (Marca Personal)\Instagram Posts\Dark Souls Personaje",
        "output_local": r"public\uploads\instagram\dark-souls",
        "slides": [
            {
                "type": "cover",
                "filename": "slide_01_cover.png",
                "tag": "3D CREATURE STUDY",
                "title": "DARK SOULS",
                "subtitle": "CREATURE ANATOMY STUDY",
                "description": "Estudio de escultura digital en alta resolución y volumen orgánico.",
                "image": os.path.join(CACHE_DIR, "shot_hero_34.png"),
            },
            {
                "type": "showcase",
                "filename": "slide_02_silhouette.png",
                "image": os.path.join(CACHE_DIR, "shot_front.png"),
            },
            {
                "type": "showcase",
                "filename": "slide_03_profile.png",
                "image": os.path.join(CACHE_DIR, "shot_side.png"),
            },
            {
                "type": "showcase",
                "filename": "slide_04_macro.png",
                "image": os.path.join(CACHE_DIR, "shot_macro_detail.png"),
            },
            {
                "type": "outro",
                "filename": "slide_05_web_cta.png",
                "title": "Explora el Modelo 3D",
                "description": "Puedes orbitar, hacer zoom e inspeccionar la malla interactiva en tiempo real en mi portafolio web oficial:",
                "project_label": "Dark Souls · Personaje 3D (WIP)",
                "image": os.path.join(CACHE_DIR, "shot_hero_34.png"),
            }
        ]
    }
    generate_full_carousel(config)
