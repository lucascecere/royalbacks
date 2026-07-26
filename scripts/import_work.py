#!/usr/bin/env python3
"""Turn a folder of photos into a Work project.

Resizes and strips EXIF from every image into public/work/<slug>/, then writes
content/work/<slug>.mdx with all of them listed and ready to caption.

Usage:
    python3 scripts/import_work.py <photo-folder> <slug> \
        --title "Locker Room Caps" \
        --category "Hockey" \
        [--client "South Shore Bandits"] \
        [--client-generic "Youth hockey association"] \
        [--year 2025] \
        [--summary "..."] \
        [--spec "84 pieces" --spec "10-day turnaround"] \
        [--garment "Structured 6-panel caps"] \
        [--featured] [--force]

Re-running with --force replaces the images and rewrites the .mdx.
"""
import argparse
import os
import re
import shutil
import sys

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit("Pillow is required:  python3 -m pip install --user Pillow")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EXTS = {".jpg", ".jpeg", ".png", ".webp", ".heic", ".HEIC"}
MAX_EDGE = 2000
QUALITY = 84


def slugify(text):
    text = re.sub(r"[^\w\s-]", "", text.lower()).strip()
    return re.sub(r"[-\s]+", "-", text)


def humanize(filename):
    stem = os.path.splitext(os.path.basename(filename))[0]
    stem = re.sub(r"[_-]+", " ", stem)
    stem = re.sub(r"\b(img|dsc|photo|image)\s*\d+\b", "", stem, flags=re.I)
    return re.sub(r"\s+", " ", stem).strip()


def yaml_escape(value):
    return str(value).replace("\\", "\\\\").replace('"', '\\"')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("source", help="folder of photos")
    ap.add_argument("slug", help="url slug, e.g. south-shore-bandits")
    ap.add_argument("--title", required=True)
    ap.add_argument("--category", required=True, help="Hockey, Contractors, Restaurants, ...")
    ap.add_argument("--client", default=None, help="only if OK to name them publicly")
    ap.add_argument("--client-generic", default=None, help="fallback label when unnamed")
    ap.add_argument("--year", default=None)
    ap.add_argument("--summary", default="")
    ap.add_argument("--spec", action="append", default=[])
    ap.add_argument("--garment", action="append", default=[])
    ap.add_argument("--cover", default=None, help="filename to use as cover (default: first)")
    ap.add_argument("--featured", action="store_true")
    ap.add_argument("--force", action="store_true")
    args = ap.parse_args()

    slug = slugify(args.slug)
    src_dir = os.path.abspath(os.path.expanduser(args.source))
    if not os.path.isdir(src_dir):
        sys.exit(f"Not a folder: {src_dir}")

    photos = sorted(
        f for f in os.listdir(src_dir)
        if os.path.splitext(f)[1].lower() in {e.lower() for e in EXTS}
        and not f.startswith(".")
    )
    if not photos:
        sys.exit(f"No images found in {src_dir}")

    out_dir = os.path.join(ROOT, "public", "work", slug)
    mdx_path = os.path.join(ROOT, "content", "work", f"{slug}.mdx")

    if os.path.exists(mdx_path) and not args.force:
        sys.exit(f"{mdx_path} already exists. Re-run with --force to replace it.")
    if os.path.isdir(out_dir) and args.force:
        shutil.rmtree(out_dir)
    os.makedirs(out_dir, exist_ok=True)
    os.makedirs(os.path.dirname(mdx_path), exist_ok=True)

    entries = []
    for i, name in enumerate(photos, start=1):
        try:
            im = Image.open(os.path.join(src_dir, name))
        except Exception as exc:                      # noqa: BLE001
            print(f"  skipped {name}: {exc}")
            continue
        # Honour the camera's rotation flag, then drop EXIF entirely.
        im = ImageOps.exif_transpose(im).convert("RGB")
        im.thumbnail((MAX_EDGE, MAX_EDGE), Image.LANCZOS)
        out_name = f"{slug}-{i:02d}.jpg"
        im.save(os.path.join(out_dir, out_name), "JPEG",
                quality=QUALITY, optimize=True, progressive=True)
        entries.append({
            "src": f"/work/{slug}/{out_name}",
            "alt": humanize(name) or f"{args.title} — photo {i}",
            "orig": name,
        })
        print(f"  {name}  ->  {out_name}  {im.size[0]}x{im.size[1]}")

    if not entries:
        sys.exit("No images could be processed.")

    cover = entries[0]["src"]
    if args.cover:
        match = next((e for e in entries if e["orig"] == args.cover), None)
        if match:
            cover = match["src"]
        else:
            print(f"  ! --cover {args.cover} not found, using {cover}")

    lines = [
        "---",
        f'title: "{yaml_escape(args.title)}"',
        f'category: "{yaml_escape(args.category)}"',
    ]
    if args.client:
        lines.append(f'client: "{yaml_escape(args.client)}"')
    if args.client_generic:
        lines.append(f'client_generic: "{yaml_escape(args.client_generic)}"')
    if args.year:
        lines.append(f'year: "{yaml_escape(args.year)}"')
    lines.append(f'summary: "{yaml_escape(args.summary)}"')
    if args.spec:
        lines.append("specs:")
        lines += [f'  - "{yaml_escape(s)}"' for s in args.spec]
    if args.garment:
        lines.append("garments:")
        lines += [f'  - "{yaml_escape(g)}"' for g in args.garment]
    lines.append(f'cover: "{cover}"')
    lines.append(f'cover_alt: "{yaml_escape(args.title)}"')
    if args.featured:
        lines.append("featured: true")
    lines.append("images:")
    for e in entries:
        lines.append(f'  - src: "{e["src"]}"')
        lines.append(f'    alt: "{yaml_escape(e["alt"])}"')
    lines += [
        "---",
        "",
        "{/* Optional write-up. Anything here renders above the photo gallery. */}",
        "",
    ]

    with open(mdx_path, "w") as fh:
        fh.write("\n".join(lines))

    print(f"\n{len(entries)} photos -> public/work/{slug}/")
    print(f"Wrote {os.path.relpath(mdx_path, ROOT)}")
    print(f"Preview:  http://localhost:3000/work/{slug}")
    print("\nNext: open the .mdx and fix the alt text — it's guessed from filenames.")


if __name__ == "__main__":
    main()
