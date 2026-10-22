"""
.agents/skills/blend-to-portfolio/scripts/compile_turntable_video.py
Composites rendered turntable frames with the official Cyber Tech Grid background
and branding overlays, then compiles them into an ultra-smooth vertical MP4 (1080x1920, 9:16)
using FFmpeg.
Outputs directly to:
G:\\Mi unidad\\Proyectos 3D\\<Project Name>\\02_Video_Turntable\\turntable_360_vertical.mp4
"""

import os
import subprocess
import glob
from PIL import Image, ImageDraw, ImageFont, ImageFilter

CANVAS_WIDTH = 1080
CANVAS_HEIGHT = 1920
FPS = 24

FRAMES_DIR = r"C:\Users\snipe\Coding\blend-art-code-main\temp_turntable_frames"
COMPOSED_FRAMES_DIR = r"C:\Users\snipe\Coding\blend-art-code-main\temp_composed_frames"
os.makedirs(COMPOSED_FRAMES_DIR, exist_ok=True)

PROJECT_NAME = "Dark Souls Personaje"
GDRIVE_3D_ROOT = r"G:\Mi unidad\Proyectos 3D"
PROJECT_DIR = os.path.join(GDRIVE_3D_ROOT, PROJECT_NAME)
VIDEO_DIR = os.path.join(PROJECT_DIR, "02_Video_Turntable")
os.makedirs(VIDEO_DIR, exist_ok=True)

OUT_GDRIVE = os.path.join(VIDEO_DIR, "turntable_360_vertical.mp4")

FONTS_DIR = os.path.join(os.path.dirname(__file__), "..", "assets", "fonts")
FONT_BEBAS = os.path.join(FONTS_DIR, "BebasNeue.ttf")
FONT_SPACE = os.path.join(FONTS_DIR, "SpaceGrotesk.ttf")
FONT_INTER = os.path.join(FONTS_DIR, "Inter.ttf")

C_BG_DARK = (8, 9, 12)
C_BG_TOP = (12, 13, 16)
C_BG_BOT = (6, 7, 9)
C_ACCENT_ORANGE = (255, 115, 25)
C_WHITE = (255, 255, 255)
C_MUTED = (165, 170, 185)

def build_cyber_grid_backdrop():
    img = Image.new("RGBA", (CANVAS_WIDTH, CANVAS_HEIGHT), C_BG_DARK)
    draw = ImageDraw.Draw(img)

    for y in range(CANVAS_HEIGHT):
        ratio = y / CANVAS_HEIGHT
        col = (
            int(C_BG_TOP[0] + (C_BG_BOT[0] - C_BG_TOP[0]) * ratio),
            int(C_BG_TOP[1] + (C_BG_BOT[1] - C_BG_TOP[1]) * ratio),
            int(C_BG_TOP[2] + (C_BG_BOT[2] - C_BG_TOP[2]) * ratio),
            255
        )
        draw.line([(0, y), (CANVAS_WIDTH, y)], fill=col)

    grid = Image.new("RGBA", (CANVAS_WIDTH, CANVAS_HEIGHT), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(grid)
    for x in range(60, CANVAS_WIDTH, 80):
        gdraw.line([(x, 0), (x, CANVAS_HEIGHT)], fill=(40, 45, 60, 35), width=1)
    for y in range(60, CANVAS_HEIGHT, 80):
        gdraw.line([(0, y), (CANVAS_WIDTH, y)], fill=(40, 45, 60, 35), width=1)

    mask = Image.new("L", (CANVAS_WIDTH, CANVAS_HEIGHT), 255)
    mdraw = ImageDraw.Draw(mask)
    for r in range(CANVAS_WIDTH // 2, 0, -20):
        val = int(255 * (r / (CANVAS_WIDTH // 2)))
        mdraw.ellipse([(CANVAS_WIDTH // 2 - r, 1000 - r), (CANVAS_WIDTH // 2 + r, 1000 + r)], fill=val)
    mask = mask.filter(ImageFilter.GaussianBlur(80))
    grid.putalpha(mask.point(lambda p: int(p * 0.35)))
    img.paste(grid, (0, 0), grid)

    # Static Overlays (Header & Footer)
    mx = 84
    top_y = 110
    # Pill tag
    draw.rounded_rectangle([(mx, top_y), (mx + 210, top_y + 30)], radius=15, fill=(18, 20, 26, 230), outline=(45, 48, 62), width=1)
    draw.ellipse([(mx + 12, top_y + 12), (mx + 18, top_y + 18)], fill=C_ACCENT_ORANGE)
    draw.text((mx + 28, top_y + 6), "360° ORBITAL VIEW", fill=C_MUTED, font=ImageFont.truetype(FONT_INTER, 14))

    # Headline
    draw.text((mx, top_y + 45), "DARK SOULS", fill=C_ACCENT_ORANGE, font=ImageFont.truetype(FONT_BEBAS, 140))
    draw.text((mx, top_y + 195), "CREATURE 3D STUDY", fill=C_WHITE, font=ImageFont.truetype(FONT_SPACE, 32))

    # Footer
    fy = CANVAS_HEIGHT - 100
    draw.text((mx, fy), "LANDRES · @landrescreative", fill=C_MUTED, font=ImageFont.truetype(FONT_INTER, 20))
    draw.text((CANVAS_WIDTH - mx - 200, fy), "landrescreative.com", fill=C_ACCENT_ORANGE, font=ImageFont.truetype(FONT_INTER, 20))

    return img

def compose_all_frames():
    backdrop = build_cyber_grid_backdrop()
    frame_files = sorted(glob.glob(os.path.join(FRAMES_DIR, "frame_*.png")))
    total = len(frame_files)
    print(f"Compositing {total} frames onto Cyber Tech Grid...")

    for i, fpath in enumerate(frame_files):
        frame_img = Image.open(fpath).convert("RGBA")
        comp = backdrop.copy()
        comp.paste(frame_img, (0, 0), frame_img)

        # Convert to RGB
        rgb = Image.new("RGB", (CANVAS_WIDTH, CANVAS_HEIGHT), C_BG_DARK)
        rgb.paste(comp, (0, 0), comp)

        out_name = os.path.join(COMPOSED_FRAMES_DIR, f"comp_{i:04d}.png")
        rgb.save(out_name, "PNG")

    print(f"All {total} frames composited! Compiling MP4 with FFmpeg at {FPS} fps...")

    cmd = [
        "ffmpeg", "-y",
        "-r", str(FPS),
        "-i", os.path.join(COMPOSED_FRAMES_DIR, "comp_%04d.png"),
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-crf", "18",
        "-preset", "slow",
        OUT_GDRIVE
    ]
    subprocess.run(cmd, check=True)
    print(f"[OK] Master Video Compiled to: {OUT_GDRIVE}")

if __name__ == "__main__":
    compose_all_frames()
