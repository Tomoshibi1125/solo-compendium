# Rift Ascendant PDF Build Report

Generated: 2026-06-22

## Tooling

- Node/tsx TypeScript exporter
- Playwright Chromium fallback renderer
- Vivliostyle attempted when available
- sharp image metadata checks
- Poppler pdfinfo/pdftoppm when available
- Optimized cover/chapter art generated from existing local assets

## Commands Run

- `C:\tmp\ra_pdf_tools\node_modules\.bin\vivliostyle.cmd --version` -> 0

- `C:\tmp\ra_pdf_tools\node_modules\.bin\vivliostyle.cmd build C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\000-front.html -o C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\000-front.pdf --size letter` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdfinfo.exe C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\000-front.pdf` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe -c from pathlib import Path
from pypdf import PdfReader
import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
path = Path(sys.argv[1])
reader = PdfReader(str(path))
for page in reader.pages:
    text = page.extract_text() or ''
    print(text) C:\Users\jjcal\Downloads\Rift Ascendant- Player’s Guide to the World.pdf` -> 0

- `C:\tmp\ra_pdf_tools\node_modules\.bin\vivliostyle.cmd build C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\001-the-rift-age.html -o C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\001-the-rift-age.pdf --size letter` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdfinfo.exe C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\001-the-rift-age.pdf` -> 0

- `C:\tmp\ra_pdf_tools\node_modules\.bin\vivliostyle.cmd build C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\002-core-rules.html -o C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\002-core-rules.pdf --size letter` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdfinfo.exe C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\002-core-rules.pdf` -> 0

- `C:\tmp\ra_pdf_tools\node_modules\.bin\vivliostyle.cmd build C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\003-jobs.html -o C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\003-jobs.pdf --size letter` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdfinfo.exe C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\003-jobs.pdf` -> 0

- `C:\tmp\ra_pdf_tools\node_modules\.bin\vivliostyle.cmd build C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\004-paths.html -o C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\004-paths.pdf --size letter` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdfinfo.exe C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\004-paths.pdf` -> 0

- `C:\tmp\ra_pdf_tools\node_modules\.bin\vivliostyle.cmd build C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\005-backgrounds.html -o C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\005-backgrounds.pdf --size letter` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdfinfo.exe C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\005-backgrounds.pdf` -> 0

- `C:\tmp\ra_pdf_tools\node_modules\.bin\vivliostyle.cmd build C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\006-skills.html -o C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\006-skills.pdf --size letter` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdfinfo.exe C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\006-skills.pdf` -> 0

- `C:\tmp\ra_pdf_tools\node_modules\.bin\vivliostyle.cmd build C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\007-feats.html -o C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\007-feats.pdf --size letter` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdfinfo.exe C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\007-feats.pdf` -> 0

- `C:\tmp\ra_pdf_tools\node_modules\.bin\vivliostyle.cmd build C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\008-fighting-styles.html -o C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\008-fighting-styles.pdf --size letter` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdfinfo.exe C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\008-fighting-styles.pdf` -> 0

- `C:\tmp\ra_pdf_tools\node_modules\.bin\vivliostyle.cmd build C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\009-techniques.html -o C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\009-techniques.pdf --size letter` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdfinfo.exe C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\009-techniques.pdf` -> 0

- `C:\tmp\ra_pdf_tools\node_modules\.bin\vivliostyle.cmd build C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\010-powers.html -o C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\010-powers.pdf --size letter` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdfinfo.exe C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\010-powers.pdf` -> 0

- `C:\tmp\ra_pdf_tools\node_modules\.bin\vivliostyle.cmd build C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\011-spells.html -o C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\011-spells.pdf --size letter` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdfinfo.exe C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\011-spells.pdf` -> 0

- `C:\tmp\ra_pdf_tools\node_modules\.bin\vivliostyle.cmd build C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\012-runes.html -o C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\012-runes.pdf --size letter` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdfinfo.exe C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\012-runes.pdf` -> 0

- `C:\tmp\ra_pdf_tools\node_modules\.bin\vivliostyle.cmd build C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\013-sigils-and-tattoos.html -o C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\013-sigils-and-tattoos.pdf --size letter` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdfinfo.exe C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\013-sigils-and-tattoos.pdf` -> 0

- `C:\tmp\ra_pdf_tools\node_modules\.bin\vivliostyle.cmd build C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\014-equipment.html -o C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\014-equipment.pdf --size letter` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdfinfo.exe C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\014-equipment.pdf` -> 0

- `C:\tmp\ra_pdf_tools\node_modules\.bin\vivliostyle.cmd build C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\015-relics-and-artifacts.html -o C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\015-relics-and-artifacts.pdf --size letter` -> null
  - stderr: spawnSync C:\WINDOWS\system32\cmd.exe ETIMEDOUT
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdfinfo.exe C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\015-relics-and-artifacts.pdf` -> 0

- `C:\tmp\ra_pdf_tools\node_modules\.bin\vivliostyle.cmd build C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\016-vehicles-and-mounts.html -o C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\016-vehicles-and-mounts.pdf --size letter` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdfinfo.exe C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\016-vehicles-and-mounts.pdf` -> 0

- `C:\tmp\ra_pdf_tools\node_modules\.bin\vivliostyle.cmd build C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\017-conditions.html -o C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\017-conditions.pdf --size letter` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdfinfo.exe C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\017-conditions.pdf` -> 0

- `C:\tmp\ra_pdf_tools\node_modules\.bin\vivliostyle.cmd build C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\018-player-index.html -o C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\018-player-index.pdf --size letter` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdfinfo.exe C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\ascendant\018-player-index.pdf` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe -c 
from pathlib import Path
from pypdf import PdfReader, PdfWriter
import json
import os
import sys

path = Path(sys.argv[1])
bookmarks = json.loads(sys.argv[2])
title = sys.argv[3]
reader = PdfReader(str(path))
writer = PdfWriter()
for page in reader.pages:
    writer.add_page(page)
metadata = {}
if reader.metadata:
    for key, value in reader.metadata.items():
        if value is not None:
            metadata[str(key)] = str(value)
metadata["/Title"] = title
writer.add_metadata(metadata)
parents = {}
page_count = len(reader.pages)
added = []
for mark in bookmarks:
    if page_count == 0:
        continue
    page_index = max(0, min(int(mark.get("pageIndex", 0)), page_count - 1))
    level = max(0, int(mark.get("level", 0)))
    parent = parents.get(level - 1) if level else None
    node = writer.add_outline_item(str(mark.get("title", "Section")), page_index, parent=parent)
    parents[level] = node
    for old_level in list(parents.keys()):
        if old_level > level:
            parents.pop(old_level, None)
    added.append({"title": str(mark.get("title", "Section")), "pageIndex": page_index, "level": level})
tmp = path.with_suffix(path.suffix + ".bookmarked")
with tmp.open("wb") as handle:
    writer.write(handle)
os.replace(tmp, path)
print(json.dumps({"count": len(added), "titles": [item["title"] for item in added[:80]]}, ensure_ascii=False))
 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Ascendant Guide.pdf [{"title":"Cover","pageIndex":0,"level":0},{"title":"Preface","pageIndex":1,"level":0},{"title":"Contents","pageIndex":2,"level":0},{"title":"Part 1: The Rift Age","pageIndex":3,"level":0},{"title":"The Rift Age","pageIndex":3,"level":1},{"title":"Core Rules","pageIndex":10,"level":1},{"title":"Part 2: Creating An Ascendant","pageIndex":13,"level":0},{"title":"Jobs","pageIndex":13,"level":1},{"title":"Paths","pageIndex":20,"level":1},{"title":"Backgrounds","pageIndex":117,"level":1},{"title":"Skills","pageIndex":201,"level":1},{"title":"Feats","pageIndex":210,"level":1},{"title":"Fighting Styles","pageIndex":217,"level":1},{"title":"Part 3: Powers And Gear","pageIndex":219,"level":0},{"title":"Techniques","pageIndex":219,"level":1},{"title":"Powers","pageIndex":272,"level":1},{"title":"Spells","pageIndex":325,"level":1},{"title":"Runes","pageIndex":387,"level":1},{"title":"Sigils And Tattoos","pageIndex":485,"level":1},{"title":"Equipment","pageIndex":549,"level":1},{"title":"Relics And Artifacts","pageIndex":638,"level":1},{"title":"Vehicles And Mounts","pageIndex":659,"level":1},{"title":"Appendices","pageIndex":681,"level":0},{"title":"Conditions","pageIndex":681,"level":1},{"title":"Player Index","pageIndex":686,"level":1}] Rift Ascendant — Ascendant Guide` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdfinfo.exe C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Ascendant Guide.pdf` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe -c from pathlib import Path
from pypdf import PdfReader
import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
path = Path(sys.argv[1])
reader = PdfReader(str(path))
for page in reader.pages:
    text = page.extract_text() or ''
    print(text) C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Ascendant Guide.pdf` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe -c 
from pypdf import PdfReader
import json
import sys

reader = PdfReader(sys.argv[1])
titles = []
def walk(items):
    for item in items:
        if isinstance(item, list):
            walk(item)
        else:
            titles.append(str(getattr(item, "title", item)))
try:
    walk(reader.outline)
except Exception:
    titles = []
print(json.dumps({"count": len(titles), "titles": titles[:120]}, ensure_ascii=False))
 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Ascendant Guide.pdf` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe -c 
import json
import math
import sys
import pdfplumber

path = sys.argv[1]
issues = []
max_issues = 24
with pdfplumber.open(path) as pdf:
    for page_index, page in enumerate(pdf.pages):
        if page_index == 0:
            continue
        words = page.extract_words(x_tolerance=1, y_tolerance=3, keep_blank_chars=False, use_text_flow=False) or []
        words = [w for w in words if str(w.get("text", "")).strip()]
        words.sort(key=lambda w: (float(w.get("top", 0)), float(w.get("x0", 0))))
        for i, a in enumerate(words):
            if len(issues) >= max_issues:
                break
            ax0 = float(a.get("x0", 0)); ax1 = float(a.get("x1", 0))
            ay0 = float(a.get("top", 0)); ay1 = float(a.get("bottom", 0))
            aw = max(0.1, ax1 - ax0); ah = max(0.1, ay1 - ay0)
            if aw < 1.5 or ah < 1.5:
                continue
            for b in words[i + 1:i + 140]:
                by0 = float(b.get("top", 0))
                if by0 - ay1 > 6:
                    break
                bx0 = float(b.get("x0", 0)); bx1 = float(b.get("x1", 0))
                by1 = float(b.get("bottom", 0))
                bw = max(0.1, bx1 - bx0); bh = max(0.1, by1 - by0)
                inter_w = max(0, min(ax1, bx1) - max(ax0, bx0))
                inter_h = max(0, min(ay1, by1) - max(ay0, by0))
                if inter_w < 2.5 or inter_h < 2.0:
                    continue
                overlap_ratio = (inter_w * inter_h) / max(0.1, min(aw * ah, bw * bh))
                width_ratio = inter_w / max(0.1, min(aw, bw))
                height_ratio = inter_h / max(0.1, min(ah, bh))
                if overlap_ratio >= 0.42 and width_ratio >= 0.35 and height_ratio >= 0.45:
                    issues.append({
                        "page": page_index + 1,
                        "a": str(a.get("text", ""))[:40],
                        "b": str(b.get("text", ""))[:40],
                        "overlap": round(overlap_ratio, 3),
                    })
                    break
            if len(issues) >= max_issues:
                break
        if len(issues) >= max_issues:
            break
print(json.dumps({"issues": issues}, ensure_ascii=False))
 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Ascendant Guide.pdf` -> 0
  - stderr: Could not get FontBBox from font descriptor because None cannot be parsed as 4 floats
Could not get FontBBox from font descriptor because None cannot be parsed as 4 floats
Could not get FontBBox from font descriptor because None cannot be parsed as 4 floats
Could not get FontBBox from font descriptor because None cannot be parsed as 4 floats
Could not get FontBBox from font descriptor because None cannot be parsed as 4 floats
Could not get FontBBox from font descriptor because None cannot be parsed as 4 floats
Could not get FontBBox from font descriptor because None cannot be parsed as 4 floats
Could not get FontBBox from font descriptor because None cannot be parsed as 4 floats
Could not get FontBBox from font descriptor because None cannot be parsed as 4 floats
Could not get FontBBox from font descriptor because None cannot be parsed as 4 floats
Could not get FontBBox from font descriptor because None cannot be parsed as 4 floats
Could not get FontBBox from font descriptor because No
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 1 -l 1 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Ascendant Guide.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\ascendant\page-0001` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 2 -l 2 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Ascendant Guide.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\ascendant\page-0002` -> 0
  - stderr: Syntax Error: No display font for 'Symbol'
Syntax Error: No display font for 'ArialNarrow'
Syntax Error: No display font for 'ArialNarrow,Bold'
Syntax Error: No display font for 'ArialNarrow,Italic'
Syntax Error: No display font for 'ArialNarrow,BoldItalic'
Syntax Error: No display font for 'ArialNarrow-Bold'
Syntax Error: No display font for 'ArialNarrow-Italic'
Syntax Error: No display font for 'ArialNarrow-BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow'
Syntax Error: No display font for 'HelveticaNarrow,Bold'
Syntax Error: No display font for 'HelveticaNarrow,Italic'
Syntax Error: No display font for 'HelveticaNarrow,BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow-Bold'
Syntax Error: No display font for 'HelveticaNarrow-Italic'
Syntax Error: No display font for 'HelveticaNarrow-BoldItalic'
Syntax Error: No display font for 'BookAntiqua'
Syntax Error: No display font for 'BookAntiqua,Bold'
Syntax Error: No display font for 'BookAntiqua,Italic'
Syntax Er
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 3 -l 3 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Ascendant Guide.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\ascendant\page-0003` -> 0
  - stderr: Syntax Error: No display font for 'Symbol'
Syntax Error: No display font for 'ArialNarrow'
Syntax Error: No display font for 'ArialNarrow,Bold'
Syntax Error: No display font for 'ArialNarrow,Italic'
Syntax Error: No display font for 'ArialNarrow,BoldItalic'
Syntax Error: No display font for 'ArialNarrow-Bold'
Syntax Error: No display font for 'ArialNarrow-Italic'
Syntax Error: No display font for 'ArialNarrow-BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow'
Syntax Error: No display font for 'HelveticaNarrow,Bold'
Syntax Error: No display font for 'HelveticaNarrow,Italic'
Syntax Error: No display font for 'HelveticaNarrow,BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow-Bold'
Syntax Error: No display font for 'HelveticaNarrow-Italic'
Syntax Error: No display font for 'HelveticaNarrow-BoldItalic'
Syntax Error: No display font for 'BookAntiqua'
Syntax Error: No display font for 'BookAntiqua,Bold'
Syntax Error: No display font for 'BookAntiqua,Italic'
Syntax Er
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 4 -l 4 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Ascendant Guide.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\ascendant\page-0004` -> 0
  - stderr: Syntax Error: No display font for 'Symbol'
Syntax Error: No display font for 'ArialNarrow'
Syntax Error: No display font for 'ArialNarrow,Bold'
Syntax Error: No display font for 'ArialNarrow,Italic'
Syntax Error: No display font for 'ArialNarrow,BoldItalic'
Syntax Error: No display font for 'ArialNarrow-Bold'
Syntax Error: No display font for 'ArialNarrow-Italic'
Syntax Error: No display font for 'ArialNarrow-BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow'
Syntax Error: No display font for 'HelveticaNarrow,Bold'
Syntax Error: No display font for 'HelveticaNarrow,Italic'
Syntax Error: No display font for 'HelveticaNarrow,BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow-Bold'
Syntax Error: No display font for 'HelveticaNarrow-Italic'
Syntax Error: No display font for 'HelveticaNarrow-BoldItalic'
Syntax Error: No display font for 'BookAntiqua'
Syntax Error: No display font for 'BookAntiqua,Bold'
Syntax Error: No display font for 'BookAntiqua,Italic'
Syntax Er
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 5 -l 5 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Ascendant Guide.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\ascendant\page-0005` -> 0
  - stderr: Syntax Error: No display font for 'Symbol'
Syntax Error: No display font for 'ArialNarrow'
Syntax Error: No display font for 'ArialNarrow,Bold'
Syntax Error: No display font for 'ArialNarrow,Italic'
Syntax Error: No display font for 'ArialNarrow,BoldItalic'
Syntax Error: No display font for 'ArialNarrow-Bold'
Syntax Error: No display font for 'ArialNarrow-Italic'
Syntax Error: No display font for 'ArialNarrow-BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow'
Syntax Error: No display font for 'HelveticaNarrow,Bold'
Syntax Error: No display font for 'HelveticaNarrow,Italic'
Syntax Error: No display font for 'HelveticaNarrow,BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow-Bold'
Syntax Error: No display font for 'HelveticaNarrow-Italic'
Syntax Error: No display font for 'HelveticaNarrow-BoldItalic'
Syntax Error: No display font for 'BookAntiqua'
Syntax Error: No display font for 'BookAntiqua,Bold'
Syntax Error: No display font for 'BookAntiqua,Italic'
Syntax Er
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 83 -l 83 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Ascendant Guide.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\ascendant\page-0083` -> 0
  - stderr: Syntax Error: No display font for 'Symbol'
Syntax Error: No display font for 'ArialNarrow'
Syntax Error: No display font for 'ArialNarrow,Bold'
Syntax Error: No display font for 'ArialNarrow,Italic'
Syntax Error: No display font for 'ArialNarrow,BoldItalic'
Syntax Error: No display font for 'ArialNarrow-Bold'
Syntax Error: No display font for 'ArialNarrow-Italic'
Syntax Error: No display font for 'ArialNarrow-BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow'
Syntax Error: No display font for 'HelveticaNarrow,Bold'
Syntax Error: No display font for 'HelveticaNarrow,Italic'
Syntax Error: No display font for 'HelveticaNarrow,BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow-Bold'
Syntax Error: No display font for 'HelveticaNarrow-Italic'
Syntax Error: No display font for 'HelveticaNarrow-BoldItalic'
Syntax Error: No display font for 'BookAntiqua'
Syntax Error: No display font for 'BookAntiqua,Bold'
Syntax Error: No display font for 'BookAntiqua,Italic'
Syntax Er
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 174 -l 174 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Ascendant Guide.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\ascendant\page-0174` -> 0
  - stderr: Syntax Error: No display font for 'Symbol'
Syntax Error: No display font for 'ArialNarrow'
Syntax Error: No display font for 'ArialNarrow,Bold'
Syntax Error: No display font for 'ArialNarrow,Italic'
Syntax Error: No display font for 'ArialNarrow,BoldItalic'
Syntax Error: No display font for 'ArialNarrow-Bold'
Syntax Error: No display font for 'ArialNarrow-Italic'
Syntax Error: No display font for 'ArialNarrow-BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow'
Syntax Error: No display font for 'HelveticaNarrow,Bold'
Syntax Error: No display font for 'HelveticaNarrow,Italic'
Syntax Error: No display font for 'HelveticaNarrow,BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow-Bold'
Syntax Error: No display font for 'HelveticaNarrow-Italic'
Syntax Error: No display font for 'HelveticaNarrow-BoldItalic'
Syntax Error: No display font for 'BookAntiqua'
Syntax Error: No display font for 'BookAntiqua,Bold'
Syntax Error: No display font for 'BookAntiqua,Italic'
Syntax Er
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 349 -l 349 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Ascendant Guide.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\ascendant\page-0349` -> 0
  - stderr: Syntax Error: No display font for 'Symbol'
Syntax Error: No display font for 'ArialNarrow'
Syntax Error: No display font for 'ArialNarrow,Bold'
Syntax Error: No display font for 'ArialNarrow,Italic'
Syntax Error: No display font for 'ArialNarrow,BoldItalic'
Syntax Error: No display font for 'ArialNarrow-Bold'
Syntax Error: No display font for 'ArialNarrow-Italic'
Syntax Error: No display font for 'ArialNarrow-BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow'
Syntax Error: No display font for 'HelveticaNarrow,Bold'
Syntax Error: No display font for 'HelveticaNarrow,Italic'
Syntax Error: No display font for 'HelveticaNarrow,BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow-Bold'
Syntax Error: No display font for 'HelveticaNarrow-Italic'
Syntax Error: No display font for 'HelveticaNarrow-BoldItalic'
Syntax Error: No display font for 'BookAntiqua'
Syntax Error: No display font for 'BookAntiqua,Bold'
Syntax Error: No display font for 'BookAntiqua,Italic'
Syntax Er
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 524 -l 524 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Ascendant Guide.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\ascendant\page-0524` -> 0
  - stderr: Syntax Error: No display font for 'Symbol'
Syntax Error: No display font for 'ArialNarrow'
Syntax Error: No display font for 'ArialNarrow,Bold'
Syntax Error: No display font for 'ArialNarrow,Italic'
Syntax Error: No display font for 'ArialNarrow,BoldItalic'
Syntax Error: No display font for 'ArialNarrow-Bold'
Syntax Error: No display font for 'ArialNarrow-Italic'
Syntax Error: No display font for 'ArialNarrow-BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow'
Syntax Error: No display font for 'HelveticaNarrow,Bold'
Syntax Error: No display font for 'HelveticaNarrow,Italic'
Syntax Error: No display font for 'HelveticaNarrow,BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow-Bold'
Syntax Error: No display font for 'HelveticaNarrow-Italic'
Syntax Error: No display font for 'HelveticaNarrow-BoldItalic'
Syntax Error: No display font for 'BookAntiqua'
Syntax Error: No display font for 'BookAntiqua,Bold'
Syntax Error: No display font for 'BookAntiqua,Italic'
Syntax Er
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 697 -l 697 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Ascendant Guide.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\ascendant\page-0697` -> 0
  - stderr: Syntax Error: No display font for 'Symbol'
Syntax Error: No display font for 'ArialNarrow'
Syntax Error: No display font for 'ArialNarrow,Bold'
Syntax Error: No display font for 'ArialNarrow,Italic'
Syntax Error: No display font for 'ArialNarrow,BoldItalic'
Syntax Error: No display font for 'ArialNarrow-Bold'
Syntax Error: No display font for 'ArialNarrow-Italic'
Syntax Error: No display font for 'ArialNarrow-BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow'
Syntax Error: No display font for 'HelveticaNarrow,Bold'
Syntax Error: No display font for 'HelveticaNarrow,Italic'
Syntax Error: No display font for 'HelveticaNarrow,BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow-Bold'
Syntax Error: No display font for 'HelveticaNarrow-Italic'
Syntax Error: No display font for 'HelveticaNarrow-BoldItalic'
Syntax Error: No display font for 'BookAntiqua'
Syntax Error: No display font for 'BookAntiqua,Bold'
Syntax Error: No display font for 'BookAntiqua,Italic'
Syntax Er
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 698 -l 698 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Ascendant Guide.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\ascendant\page-0698` -> 0
  - stderr: Syntax Error: No display font for 'Symbol'
Syntax Error: No display font for 'ArialNarrow'
Syntax Error: No display font for 'ArialNarrow,Bold'
Syntax Error: No display font for 'ArialNarrow,Italic'
Syntax Error: No display font for 'ArialNarrow,BoldItalic'
Syntax Error: No display font for 'ArialNarrow-Bold'
Syntax Error: No display font for 'ArialNarrow-Italic'
Syntax Error: No display font for 'ArialNarrow-BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow'
Syntax Error: No display font for 'HelveticaNarrow,Bold'
Syntax Error: No display font for 'HelveticaNarrow,Italic'
Syntax Error: No display font for 'HelveticaNarrow,BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow-Bold'
Syntax Error: No display font for 'HelveticaNarrow-Italic'
Syntax Error: No display font for 'HelveticaNarrow-BoldItalic'
Syntax Error: No display font for 'BookAntiqua'
Syntax Error: No display font for 'BookAntiqua,Bold'
Syntax Error: No display font for 'BookAntiqua,Italic'
Syntax Er
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 699 -l 699 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Ascendant Guide.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\ascendant\page-0699` -> 0
  - stderr: Syntax Error: No display font for 'Symbol'
Syntax Error: No display font for 'ArialNarrow'
Syntax Error: No display font for 'ArialNarrow,Bold'
Syntax Error: No display font for 'ArialNarrow,Italic'
Syntax Error: No display font for 'ArialNarrow,BoldItalic'
Syntax Error: No display font for 'ArialNarrow-Bold'
Syntax Error: No display font for 'ArialNarrow-Italic'
Syntax Error: No display font for 'ArialNarrow-BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow'
Syntax Error: No display font for 'HelveticaNarrow,Bold'
Syntax Error: No display font for 'HelveticaNarrow,Italic'
Syntax Error: No display font for 'HelveticaNarrow,BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow-Bold'
Syntax Error: No display font for 'HelveticaNarrow-Italic'
Syntax Error: No display font for 'HelveticaNarrow-BoldItalic'
Syntax Error: No display font for 'BookAntiqua'
Syntax Error: No display font for 'BookAntiqua,Bold'
Syntax Error: No display font for 'BookAntiqua,Italic'
Syntax Er
- `C:\tmp\ra_pdf_tools\node_modules\.bin\vivliostyle.cmd build C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\warden\000-front.html -o C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\warden\000-front.pdf --size letter` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdfinfo.exe C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\warden\000-front.pdf` -> 0

- `C:\tmp\ra_pdf_tools\node_modules\.bin\vivliostyle.cmd build C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\warden\001-running-rift-ascendant.html -o C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\warden\001-running-rift-ascendant.pdf --size letter` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdfinfo.exe C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\warden\001-running-rift-ascendant.pdf` -> 0

- `C:\tmp\ra_pdf_tools\node_modules\.bin\vivliostyle.cmd build C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\warden\002-pressure-clocks-and-scene-control.html -o C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\warden\002-pressure-clocks-and-scene-control.pdf --size letter` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdfinfo.exe C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\warden\002-pressure-clocks-and-scene-control.pdf` -> 0

- `C:\tmp\ra_pdf_tools\node_modules\.bin\vivliostyle.cmd build C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\warden\003-scenario-frameworks.html -o C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\warden\003-scenario-frameworks.pdf --size letter` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdfinfo.exe C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\warden\003-scenario-frameworks.pdf` -> 0

- `C:\tmp\ra_pdf_tools\node_modules\.bin\vivliostyle.cmd build C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\warden\004-rift-hazards-and-domains.html -o C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\warden\004-rift-hazards-and-domains.pdf --size letter` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdfinfo.exe C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\warden\004-rift-hazards-and-domains.pdf` -> 0

- `C:\tmp\ra_pdf_tools\node_modules\.bin\vivliostyle.cmd build C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\warden\005-bureau-afa-and-guild-operations.html -o C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\warden\005-bureau-afa-and-guild-operations.pdf --size letter` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdfinfo.exe C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\warden\005-bureau-afa-and-guild-operations.pdf` -> 0

- `C:\tmp\ra_pdf_tools\node_modules\.bin\vivliostyle.cmd build C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\warden\006-adjudication-rulings.html -o C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\warden\006-adjudication-rulings.pdf --size letter` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdfinfo.exe C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\warden\006-adjudication-rulings.pdf` -> 0

- `C:\tmp\ra_pdf_tools\node_modules\.bin\vivliostyle.cmd build C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\warden\007-aftermath-and-living-world.html -o C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\warden\007-aftermath-and-living-world.pdf --size letter` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdfinfo.exe C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\warden\007-aftermath-and-living-world.pdf` -> 0

- `C:\tmp\ra_pdf_tools\node_modules\.bin\vivliostyle.cmd build C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\warden\008-world-directory.html -o C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\warden\008-world-directory.pdf --size letter` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdfinfo.exe C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\warden\008-world-directory.pdf` -> 0

- `C:\tmp\ra_pdf_tools\node_modules\.bin\vivliostyle.cmd build C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\warden\009-regents-and-pantheon.html -o C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\warden\009-regents-and-pantheon.pdf --size letter` -> null
  - stderr: spawnSync C:\WINDOWS\system32\cmd.exe ETIMEDOUT
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdfinfo.exe C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\warden\009-regents-and-pantheon.pdf` -> 0

- `C:\tmp\ra_pdf_tools\node_modules\.bin\vivliostyle.cmd build C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\warden\010-encounter-and-anomaly-design.html -o C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\warden\010-encounter-and-anomaly-design.pdf --size letter` -> null
  - stderr: spawnSync C:\WINDOWS\system32\cmd.exe ETIMEDOUT
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdfinfo.exe C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\warden\010-encounter-and-anomaly-design.pdf` -> 0

- `C:\tmp\ra_pdf_tools\node_modules\.bin\vivliostyle.cmd build C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\warden\011-warden-contract-seeds.html -o C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\warden\011-warden-contract-seeds.pdf --size letter` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdfinfo.exe C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\warden\011-warden-contract-seeds.pdf` -> 0

- `C:\tmp\ra_pdf_tools\node_modules\.bin\vivliostyle.cmd build C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\warden\012-threat-rosters.html -o C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\warden\012-threat-rosters.pdf --size letter` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdfinfo.exe C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\warden\012-threat-rosters.pdf` -> 0

- `C:\tmp\ra_pdf_tools\node_modules\.bin\vivliostyle.cmd build C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\warden\013-rewards-tables-and-conditions.html -o C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\warden\013-rewards-tables-and-conditions.pdf --size letter` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdfinfo.exe C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\warden\013-rewards-tables-and-conditions.pdf` -> 0

- `C:\tmp\ra_pdf_tools\node_modules\.bin\vivliostyle.cmd build C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\warden\014-warden-reference-appendices.html -o C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\warden\014-warden-reference-appendices.pdf --size letter` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdfinfo.exe C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\warden\014-warden-reference-appendices.pdf` -> 0

- `C:\tmp\ra_pdf_tools\node_modules\.bin\vivliostyle.cmd build C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\warden\015-warden-index.html -o C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\warden\015-warden-index.pdf --size letter` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdfinfo.exe C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\warden\015-warden-index.pdf` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe -c 
from pathlib import Path
from pypdf import PdfReader, PdfWriter
import json
import os
import sys

path = Path(sys.argv[1])
bookmarks = json.loads(sys.argv[2])
title = sys.argv[3]
reader = PdfReader(str(path))
writer = PdfWriter()
for page in reader.pages:
    writer.add_page(page)
metadata = {}
if reader.metadata:
    for key, value in reader.metadata.items():
        if value is not None:
            metadata[str(key)] = str(value)
metadata["/Title"] = title
writer.add_metadata(metadata)
parents = {}
page_count = len(reader.pages)
added = []
for mark in bookmarks:
    if page_count == 0:
        continue
    page_index = max(0, min(int(mark.get("pageIndex", 0)), page_count - 1))
    level = max(0, int(mark.get("level", 0)))
    parent = parents.get(level - 1) if level else None
    node = writer.add_outline_item(str(mark.get("title", "Section")), page_index, parent=parent)
    parents[level] = node
    for old_level in list(parents.keys()):
        if old_level > level:
            parents.pop(old_level, None)
    added.append({"title": str(mark.get("title", "Section")), "pageIndex": page_index, "level": level})
tmp = path.with_suffix(path.suffix + ".bookmarked")
with tmp.open("wb") as handle:
    writer.write(handle)
os.replace(tmp, path)
print(json.dumps({"count": len(added), "titles": [item["title"] for item in added[:80]]}, ensure_ascii=False))
 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Warden Guide.pdf [{"title":"Cover","pageIndex":0,"level":0},{"title":"Preface","pageIndex":1,"level":0},{"title":"Contents","pageIndex":1,"level":0},{"title":"Part 1: Warden Operations","pageIndex":2,"level":0},{"title":"Running Rift Ascendant","pageIndex":2,"level":1},{"title":"Pressure Clocks And Scene Control","pageIndex":4,"level":1},{"title":"Scenario Frameworks","pageIndex":6,"level":1},{"title":"Rift Hazards And Domains","pageIndex":8,"level":1},{"title":"Bureau, AFA, And Guild Operations","pageIndex":10,"level":1},{"title":"Adjudication Rulings","pageIndex":11,"level":1},{"title":"Aftermath And Living World","pageIndex":12,"level":1},{"title":"Part 2: The Rift Age World","pageIndex":13,"level":0},{"title":"World Directory","pageIndex":13,"level":1},{"title":"Regents And Pantheon","pageIndex":126,"level":1},{"title":"Part 3: Encounters And Rewards","pageIndex":147,"level":0},{"title":"Encounter And Anomaly Design","pageIndex":147,"level":1},{"title":"Warden Contract Seeds","pageIndex":156,"level":1},{"title":"Threat Rosters","pageIndex":205,"level":1},{"title":"Rewards, Tables, And Conditions","pageIndex":242,"level":1},{"title":"Appendices","pageIndex":248,"level":0},{"title":"Warden Reference Appendices","pageIndex":248,"level":1},{"title":"Warden Index","pageIndex":256,"level":1}] Rift Ascendant — Warden Guide` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdfinfo.exe C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Warden Guide.pdf` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe -c from pathlib import Path
from pypdf import PdfReader
import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
path = Path(sys.argv[1])
reader = PdfReader(str(path))
for page in reader.pages:
    text = page.extract_text() or ''
    print(text) C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Warden Guide.pdf` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe -c 
from pypdf import PdfReader
import json
import sys

reader = PdfReader(sys.argv[1])
titles = []
def walk(items):
    for item in items:
        if isinstance(item, list):
            walk(item)
        else:
            titles.append(str(getattr(item, "title", item)))
try:
    walk(reader.outline)
except Exception:
    titles = []
print(json.dumps({"count": len(titles), "titles": titles[:120]}, ensure_ascii=False))
 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Warden Guide.pdf` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe -c 
import json
import math
import sys
import pdfplumber

path = sys.argv[1]
issues = []
max_issues = 24
with pdfplumber.open(path) as pdf:
    for page_index, page in enumerate(pdf.pages):
        if page_index == 0:
            continue
        words = page.extract_words(x_tolerance=1, y_tolerance=3, keep_blank_chars=False, use_text_flow=False) or []
        words = [w for w in words if str(w.get("text", "")).strip()]
        words.sort(key=lambda w: (float(w.get("top", 0)), float(w.get("x0", 0))))
        for i, a in enumerate(words):
            if len(issues) >= max_issues:
                break
            ax0 = float(a.get("x0", 0)); ax1 = float(a.get("x1", 0))
            ay0 = float(a.get("top", 0)); ay1 = float(a.get("bottom", 0))
            aw = max(0.1, ax1 - ax0); ah = max(0.1, ay1 - ay0)
            if aw < 1.5 or ah < 1.5:
                continue
            for b in words[i + 1:i + 140]:
                by0 = float(b.get("top", 0))
                if by0 - ay1 > 6:
                    break
                bx0 = float(b.get("x0", 0)); bx1 = float(b.get("x1", 0))
                by1 = float(b.get("bottom", 0))
                bw = max(0.1, bx1 - bx0); bh = max(0.1, by1 - by0)
                inter_w = max(0, min(ax1, bx1) - max(ax0, bx0))
                inter_h = max(0, min(ay1, by1) - max(ay0, by0))
                if inter_w < 2.5 or inter_h < 2.0:
                    continue
                overlap_ratio = (inter_w * inter_h) / max(0.1, min(aw * ah, bw * bh))
                width_ratio = inter_w / max(0.1, min(aw, bw))
                height_ratio = inter_h / max(0.1, min(ah, bh))
                if overlap_ratio >= 0.42 and width_ratio >= 0.35 and height_ratio >= 0.45:
                    issues.append({
                        "page": page_index + 1,
                        "a": str(a.get("text", ""))[:40],
                        "b": str(b.get("text", ""))[:40],
                        "overlap": round(overlap_ratio, 3),
                    })
                    break
            if len(issues) >= max_issues:
                break
        if len(issues) >= max_issues:
            break
print(json.dumps({"issues": issues}, ensure_ascii=False))
 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Warden Guide.pdf` -> 0
  - stderr: Could not get FontBBox from font descriptor because None cannot be parsed as 4 floats
Could not get FontBBox from font descriptor because None cannot be parsed as 4 floats
Could not get FontBBox from font descriptor because None cannot be parsed as 4 floats
Could not get FontBBox from font descriptor because None cannot be parsed as 4 floats
Could not get FontBBox from font descriptor because None cannot be parsed as 4 floats
Could not get FontBBox from font descriptor because None cannot be parsed as 4 floats
Could not get FontBBox from font descriptor because None cannot be parsed as 4 floats
Could not get FontBBox from font descriptor because None cannot be parsed as 4 floats
Could not get FontBBox from font descriptor because None cannot be parsed as 4 floats
Could not get FontBBox from font descriptor because None cannot be parsed as 4 floats
Could not get FontBBox from font descriptor because None cannot be parsed as 4 floats
Could not get FontBBox from font descriptor because No
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 1 -l 1 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Warden Guide.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\warden\page-0001` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 2 -l 2 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Warden Guide.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\warden\page-0002` -> 0
  - stderr: Syntax Error: No display font for 'Symbol'
Syntax Error: No display font for 'ArialNarrow'
Syntax Error: No display font for 'ArialNarrow,Bold'
Syntax Error: No display font for 'ArialNarrow,Italic'
Syntax Error: No display font for 'ArialNarrow,BoldItalic'
Syntax Error: No display font for 'ArialNarrow-Bold'
Syntax Error: No display font for 'ArialNarrow-Italic'
Syntax Error: No display font for 'ArialNarrow-BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow'
Syntax Error: No display font for 'HelveticaNarrow,Bold'
Syntax Error: No display font for 'HelveticaNarrow,Italic'
Syntax Error: No display font for 'HelveticaNarrow,BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow-Bold'
Syntax Error: No display font for 'HelveticaNarrow-Italic'
Syntax Error: No display font for 'HelveticaNarrow-BoldItalic'
Syntax Error: No display font for 'BookAntiqua'
Syntax Error: No display font for 'BookAntiqua,Bold'
Syntax Error: No display font for 'BookAntiqua,Italic'
Syntax Er
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 3 -l 3 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Warden Guide.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\warden\page-0003` -> 0
  - stderr: Syntax Error: No display font for 'Symbol'
Syntax Error: No display font for 'ArialNarrow'
Syntax Error: No display font for 'ArialNarrow,Bold'
Syntax Error: No display font for 'ArialNarrow,Italic'
Syntax Error: No display font for 'ArialNarrow,BoldItalic'
Syntax Error: No display font for 'ArialNarrow-Bold'
Syntax Error: No display font for 'ArialNarrow-Italic'
Syntax Error: No display font for 'ArialNarrow-BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow'
Syntax Error: No display font for 'HelveticaNarrow,Bold'
Syntax Error: No display font for 'HelveticaNarrow,Italic'
Syntax Error: No display font for 'HelveticaNarrow,BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow-Bold'
Syntax Error: No display font for 'HelveticaNarrow-Italic'
Syntax Error: No display font for 'HelveticaNarrow-BoldItalic'
Syntax Error: No display font for 'BookAntiqua'
Syntax Error: No display font for 'BookAntiqua,Bold'
Syntax Error: No display font for 'BookAntiqua,Italic'
Syntax Er
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 4 -l 4 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Warden Guide.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\warden\page-0004` -> 0
  - stderr: Syntax Error: No display font for 'Symbol'
Syntax Error: No display font for 'ArialNarrow'
Syntax Error: No display font for 'ArialNarrow,Bold'
Syntax Error: No display font for 'ArialNarrow,Italic'
Syntax Error: No display font for 'ArialNarrow,BoldItalic'
Syntax Error: No display font for 'ArialNarrow-Bold'
Syntax Error: No display font for 'ArialNarrow-Italic'
Syntax Error: No display font for 'ArialNarrow-BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow'
Syntax Error: No display font for 'HelveticaNarrow,Bold'
Syntax Error: No display font for 'HelveticaNarrow,Italic'
Syntax Error: No display font for 'HelveticaNarrow,BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow-Bold'
Syntax Error: No display font for 'HelveticaNarrow-Italic'
Syntax Error: No display font for 'HelveticaNarrow-BoldItalic'
Syntax Error: No display font for 'BookAntiqua'
Syntax Error: No display font for 'BookAntiqua,Bold'
Syntax Error: No display font for 'BookAntiqua,Italic'
Syntax Er
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 5 -l 5 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Warden Guide.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\warden\page-0005` -> 0
  - stderr: Syntax Error: No display font for 'Symbol'
Syntax Error: No display font for 'ArialNarrow'
Syntax Error: No display font for 'ArialNarrow,Bold'
Syntax Error: No display font for 'ArialNarrow,Italic'
Syntax Error: No display font for 'ArialNarrow,BoldItalic'
Syntax Error: No display font for 'ArialNarrow-Bold'
Syntax Error: No display font for 'ArialNarrow-Italic'
Syntax Error: No display font for 'ArialNarrow-BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow'
Syntax Error: No display font for 'HelveticaNarrow,Bold'
Syntax Error: No display font for 'HelveticaNarrow,Italic'
Syntax Error: No display font for 'HelveticaNarrow,BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow-Bold'
Syntax Error: No display font for 'HelveticaNarrow-Italic'
Syntax Error: No display font for 'HelveticaNarrow-BoldItalic'
Syntax Error: No display font for 'BookAntiqua'
Syntax Error: No display font for 'BookAntiqua,Bold'
Syntax Error: No display font for 'BookAntiqua,Italic'
Syntax Er
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 31 -l 31 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Warden Guide.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\warden\page-0031` -> 0
  - stderr: Syntax Error: No display font for 'Symbol'
Syntax Error: No display font for 'ArialNarrow'
Syntax Error: No display font for 'ArialNarrow,Bold'
Syntax Error: No display font for 'ArialNarrow,Italic'
Syntax Error: No display font for 'ArialNarrow,BoldItalic'
Syntax Error: No display font for 'ArialNarrow-Bold'
Syntax Error: No display font for 'ArialNarrow-Italic'
Syntax Error: No display font for 'ArialNarrow-BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow'
Syntax Error: No display font for 'HelveticaNarrow,Bold'
Syntax Error: No display font for 'HelveticaNarrow,Italic'
Syntax Error: No display font for 'HelveticaNarrow,BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow-Bold'
Syntax Error: No display font for 'HelveticaNarrow-Italic'
Syntax Error: No display font for 'HelveticaNarrow-BoldItalic'
Syntax Error: No display font for 'BookAntiqua'
Syntax Error: No display font for 'BookAntiqua,Bold'
Syntax Error: No display font for 'BookAntiqua,Italic'
Syntax Er
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 64 -l 64 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Warden Guide.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\warden\page-0064` -> 0
  - stderr: Syntax Error: No display font for 'Symbol'
Syntax Error: No display font for 'ArialNarrow'
Syntax Error: No display font for 'ArialNarrow,Bold'
Syntax Error: No display font for 'ArialNarrow,Italic'
Syntax Error: No display font for 'ArialNarrow,BoldItalic'
Syntax Error: No display font for 'ArialNarrow-Bold'
Syntax Error: No display font for 'ArialNarrow-Italic'
Syntax Error: No display font for 'ArialNarrow-BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow'
Syntax Error: No display font for 'HelveticaNarrow,Bold'
Syntax Error: No display font for 'HelveticaNarrow,Italic'
Syntax Error: No display font for 'HelveticaNarrow,BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow-Bold'
Syntax Error: No display font for 'HelveticaNarrow-Italic'
Syntax Error: No display font for 'HelveticaNarrow-BoldItalic'
Syntax Error: No display font for 'BookAntiqua'
Syntax Error: No display font for 'BookAntiqua,Bold'
Syntax Error: No display font for 'BookAntiqua,Italic'
Syntax Er
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 129 -l 129 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Warden Guide.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\warden\page-0129` -> 0
  - stderr: Syntax Error: No display font for 'Symbol'
Syntax Error: No display font for 'ArialNarrow'
Syntax Error: No display font for 'ArialNarrow,Bold'
Syntax Error: No display font for 'ArialNarrow,Italic'
Syntax Error: No display font for 'ArialNarrow,BoldItalic'
Syntax Error: No display font for 'ArialNarrow-Bold'
Syntax Error: No display font for 'ArialNarrow-Italic'
Syntax Error: No display font for 'ArialNarrow-BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow'
Syntax Error: No display font for 'HelveticaNarrow,Bold'
Syntax Error: No display font for 'HelveticaNarrow,Italic'
Syntax Error: No display font for 'HelveticaNarrow,BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow-Bold'
Syntax Error: No display font for 'HelveticaNarrow-Italic'
Syntax Error: No display font for 'HelveticaNarrow-BoldItalic'
Syntax Error: No display font for 'BookAntiqua'
Syntax Error: No display font for 'BookAntiqua,Bold'
Syntax Error: No display font for 'BookAntiqua,Italic'
Syntax Er
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 194 -l 194 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Warden Guide.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\warden\page-0194` -> 0
  - stderr: Syntax Error: No display font for 'Symbol'
Syntax Error: No display font for 'ArialNarrow'
Syntax Error: No display font for 'ArialNarrow,Bold'
Syntax Error: No display font for 'ArialNarrow,Italic'
Syntax Error: No display font for 'ArialNarrow,BoldItalic'
Syntax Error: No display font for 'ArialNarrow-Bold'
Syntax Error: No display font for 'ArialNarrow-Italic'
Syntax Error: No display font for 'ArialNarrow-BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow'
Syntax Error: No display font for 'HelveticaNarrow,Bold'
Syntax Error: No display font for 'HelveticaNarrow,Italic'
Syntax Error: No display font for 'HelveticaNarrow,BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow-Bold'
Syntax Error: No display font for 'HelveticaNarrow-Italic'
Syntax Error: No display font for 'HelveticaNarrow-BoldItalic'
Syntax Error: No display font for 'BookAntiqua'
Syntax Error: No display font for 'BookAntiqua,Bold'
Syntax Error: No display font for 'BookAntiqua,Italic'
Syntax Er
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 257 -l 257 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Warden Guide.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\warden\page-0257` -> 0
  - stderr: Syntax Error: No display font for 'Symbol'
Syntax Error: No display font for 'ArialNarrow'
Syntax Error: No display font for 'ArialNarrow,Bold'
Syntax Error: No display font for 'ArialNarrow,Italic'
Syntax Error: No display font for 'ArialNarrow,BoldItalic'
Syntax Error: No display font for 'ArialNarrow-Bold'
Syntax Error: No display font for 'ArialNarrow-Italic'
Syntax Error: No display font for 'ArialNarrow-BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow'
Syntax Error: No display font for 'HelveticaNarrow,Bold'
Syntax Error: No display font for 'HelveticaNarrow,Italic'
Syntax Error: No display font for 'HelveticaNarrow,BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow-Bold'
Syntax Error: No display font for 'HelveticaNarrow-Italic'
Syntax Error: No display font for 'HelveticaNarrow-BoldItalic'
Syntax Error: No display font for 'BookAntiqua'
Syntax Error: No display font for 'BookAntiqua,Bold'
Syntax Error: No display font for 'BookAntiqua,Italic'
Syntax Er
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 258 -l 258 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Warden Guide.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\warden\page-0258` -> 0
  - stderr: Syntax Error: No display font for 'Symbol'
Syntax Error: No display font for 'ArialNarrow'
Syntax Error: No display font for 'ArialNarrow,Bold'
Syntax Error: No display font for 'ArialNarrow,Italic'
Syntax Error: No display font for 'ArialNarrow,BoldItalic'
Syntax Error: No display font for 'ArialNarrow-Bold'
Syntax Error: No display font for 'ArialNarrow-Italic'
Syntax Error: No display font for 'ArialNarrow-BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow'
Syntax Error: No display font for 'HelveticaNarrow,Bold'
Syntax Error: No display font for 'HelveticaNarrow,Italic'
Syntax Error: No display font for 'HelveticaNarrow,BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow-Bold'
Syntax Error: No display font for 'HelveticaNarrow-Italic'
Syntax Error: No display font for 'HelveticaNarrow-BoldItalic'
Syntax Error: No display font for 'BookAntiqua'
Syntax Error: No display font for 'BookAntiqua,Bold'
Syntax Error: No display font for 'BookAntiqua,Italic'
Syntax Er
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 259 -l 259 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Warden Guide.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\warden\page-0259` -> 0
  - stderr: Syntax Error: No display font for 'Symbol'
Syntax Error: No display font for 'ArialNarrow'
Syntax Error: No display font for 'ArialNarrow,Bold'
Syntax Error: No display font for 'ArialNarrow,Italic'
Syntax Error: No display font for 'ArialNarrow,BoldItalic'
Syntax Error: No display font for 'ArialNarrow-Bold'
Syntax Error: No display font for 'ArialNarrow-Italic'
Syntax Error: No display font for 'ArialNarrow-BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow'
Syntax Error: No display font for 'HelveticaNarrow,Bold'
Syntax Error: No display font for 'HelveticaNarrow,Italic'
Syntax Error: No display font for 'HelveticaNarrow,BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow-Bold'
Syntax Error: No display font for 'HelveticaNarrow-Italic'
Syntax Error: No display font for 'HelveticaNarrow-BoldItalic'
Syntax Error: No display font for 'BookAntiqua'
Syntax Error: No display font for 'BookAntiqua,Bold'
Syntax Error: No display font for 'BookAntiqua,Italic'
Syntax Er
- `C:\tmp\ra_pdf_tools\node_modules\.bin\vivliostyle.cmd build C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\vaults\000-front.html -o C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\vaults\000-front.pdf --size letter` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdfinfo.exe C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\vaults\000-front.pdf` -> 0

- `C:\tmp\ra_pdf_tools\node_modules\.bin\vivliostyle.cmd build C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\vaults\001-using-vaults-of-the-rift.html -o C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\vaults\001-using-vaults-of-the-rift.pdf --size letter` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdfinfo.exe C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\vaults\001-using-vaults-of-the-rift.pdf` -> 0

- `C:\tmp\ra_pdf_tools\node_modules\.bin\vivliostyle.cmd build C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\vaults\002-expanded-runes.html -o C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\vaults\002-expanded-runes.pdf --size letter` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdfinfo.exe C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\vaults\002-expanded-runes.pdf` -> 0

- `C:\tmp\ra_pdf_tools\node_modules\.bin\vivliostyle.cmd build C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\vaults\003-expanded-equipment-and-items.html -o C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\vaults\003-expanded-equipment-and-items.pdf --size letter` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdfinfo.exe C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\vaults\003-expanded-equipment-and-items.pdf` -> 0

- `C:\tmp\ra_pdf_tools\node_modules\.bin\vivliostyle.cmd build C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\vaults\004-relics.html -o C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\vaults\004-relics.pdf --size letter` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdfinfo.exe C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\vaults\004-relics.pdf` -> 0

- `C:\tmp\ra_pdf_tools\node_modules\.bin\vivliostyle.cmd build C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\vaults\005-artifacts.html -o C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\vaults\005-artifacts.pdf --size letter` -> null
  - stderr: spawnSync C:\WINDOWS\system32\cmd.exe ETIMEDOUT
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdfinfo.exe C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\vaults\005-artifacts.pdf` -> 0

- `C:\tmp\ra_pdf_tools\node_modules\.bin\vivliostyle.cmd build C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\vaults\006-vault-index.html -o C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\vaults\006-vault-index.pdf --size letter` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdfinfo.exe C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\vaults\006-vault-index.pdf` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe -c 
from pathlib import Path
from pypdf import PdfReader, PdfWriter
import json
import os
import sys

path = Path(sys.argv[1])
bookmarks = json.loads(sys.argv[2])
title = sys.argv[3]
reader = PdfReader(str(path))
writer = PdfWriter()
for page in reader.pages:
    writer.add_page(page)
metadata = {}
if reader.metadata:
    for key, value in reader.metadata.items():
        if value is not None:
            metadata[str(key)] = str(value)
metadata["/Title"] = title
writer.add_metadata(metadata)
parents = {}
page_count = len(reader.pages)
added = []
for mark in bookmarks:
    if page_count == 0:
        continue
    page_index = max(0, min(int(mark.get("pageIndex", 0)), page_count - 1))
    level = max(0, int(mark.get("level", 0)))
    parent = parents.get(level - 1) if level else None
    node = writer.add_outline_item(str(mark.get("title", "Section")), page_index, parent=parent)
    parents[level] = node
    for old_level in list(parents.keys()):
        if old_level > level:
            parents.pop(old_level, None)
    added.append({"title": str(mark.get("title", "Section")), "pageIndex": page_index, "level": level})
tmp = path.with_suffix(path.suffix + ".bookmarked")
with tmp.open("wb") as handle:
    writer.write(handle)
os.replace(tmp, path)
print(json.dumps({"count": len(added), "titles": [item["title"] for item in added[:80]]}, ensure_ascii=False))
 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Vaults of the Rift.pdf [{"title":"Cover","pageIndex":0,"level":0},{"title":"Preface","pageIndex":1,"level":0},{"title":"Contents","pageIndex":1,"level":0},{"title":"Part 1: Vault Rules","pageIndex":2,"level":0},{"title":"Using Vaults Of The Rift","pageIndex":2,"level":1},{"title":"Part 2: Rune Vault","pageIndex":4,"level":0},{"title":"Expanded Runes","pageIndex":4,"level":1},{"title":"Part 3: Item Vault","pageIndex":250,"level":0},{"title":"Expanded Equipment And Items","pageIndex":250,"level":1},{"title":"Part 4: Relics And Artifacts","pageIndex":456,"level":0},{"title":"Relics","pageIndex":456,"level":1},{"title":"Artifacts","pageIndex":527,"level":1},{"title":"Appendices","pageIndex":538,"level":0},{"title":"Vault Index","pageIndex":538,"level":1}] Rift Ascendant — Vaults of the Rift` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdfinfo.exe C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Vaults of the Rift.pdf` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe -c from pathlib import Path
from pypdf import PdfReader
import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
path = Path(sys.argv[1])
reader = PdfReader(str(path))
for page in reader.pages:
    text = page.extract_text() or ''
    print(text) C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Vaults of the Rift.pdf` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe -c 
from pypdf import PdfReader
import json
import sys

reader = PdfReader(sys.argv[1])
titles = []
def walk(items):
    for item in items:
        if isinstance(item, list):
            walk(item)
        else:
            titles.append(str(getattr(item, "title", item)))
try:
    walk(reader.outline)
except Exception:
    titles = []
print(json.dumps({"count": len(titles), "titles": titles[:120]}, ensure_ascii=False))
 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Vaults of the Rift.pdf` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe -c 
import json
import math
import sys
import pdfplumber

path = sys.argv[1]
issues = []
max_issues = 24
with pdfplumber.open(path) as pdf:
    for page_index, page in enumerate(pdf.pages):
        if page_index == 0:
            continue
        words = page.extract_words(x_tolerance=1, y_tolerance=3, keep_blank_chars=False, use_text_flow=False) or []
        words = [w for w in words if str(w.get("text", "")).strip()]
        words.sort(key=lambda w: (float(w.get("top", 0)), float(w.get("x0", 0))))
        for i, a in enumerate(words):
            if len(issues) >= max_issues:
                break
            ax0 = float(a.get("x0", 0)); ax1 = float(a.get("x1", 0))
            ay0 = float(a.get("top", 0)); ay1 = float(a.get("bottom", 0))
            aw = max(0.1, ax1 - ax0); ah = max(0.1, ay1 - ay0)
            if aw < 1.5 or ah < 1.5:
                continue
            for b in words[i + 1:i + 140]:
                by0 = float(b.get("top", 0))
                if by0 - ay1 > 6:
                    break
                bx0 = float(b.get("x0", 0)); bx1 = float(b.get("x1", 0))
                by1 = float(b.get("bottom", 0))
                bw = max(0.1, bx1 - bx0); bh = max(0.1, by1 - by0)
                inter_w = max(0, min(ax1, bx1) - max(ax0, bx0))
                inter_h = max(0, min(ay1, by1) - max(ay0, by0))
                if inter_w < 2.5 or inter_h < 2.0:
                    continue
                overlap_ratio = (inter_w * inter_h) / max(0.1, min(aw * ah, bw * bh))
                width_ratio = inter_w / max(0.1, min(aw, bw))
                height_ratio = inter_h / max(0.1, min(ah, bh))
                if overlap_ratio >= 0.42 and width_ratio >= 0.35 and height_ratio >= 0.45:
                    issues.append({
                        "page": page_index + 1,
                        "a": str(a.get("text", ""))[:40],
                        "b": str(b.get("text", ""))[:40],
                        "overlap": round(overlap_ratio, 3),
                    })
                    break
            if len(issues) >= max_issues:
                break
        if len(issues) >= max_issues:
            break
print(json.dumps({"issues": issues}, ensure_ascii=False))
 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Vaults of the Rift.pdf` -> 0
  - stderr: Could not get FontBBox from font descriptor because None cannot be parsed as 4 floats
Could not get FontBBox from font descriptor because None cannot be parsed as 4 floats
Could not get FontBBox from font descriptor because None cannot be parsed as 4 floats
Could not get FontBBox from font descriptor because None cannot be parsed as 4 floats
Could not get FontBBox from font descriptor because None cannot be parsed as 4 floats
Could not get FontBBox from font descriptor because None cannot be parsed as 4 floats
Could not get FontBBox from font descriptor because None cannot be parsed as 4 floats
Could not get FontBBox from font descriptor because None cannot be parsed as 4 floats
Could not get FontBBox from font descriptor because None cannot be parsed as 4 floats
Could not get FontBBox from font descriptor because None cannot be parsed as 4 floats
Could not get FontBBox from font descriptor because None cannot be parsed as 4 floats
Could not get FontBBox from font descriptor because No
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 1 -l 1 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Vaults of the Rift.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\vaults\page-0001` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 2 -l 2 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Vaults of the Rift.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\vaults\page-0002` -> 0
  - stderr: Syntax Error: No display font for 'Symbol'
Syntax Error: No display font for 'ArialNarrow'
Syntax Error: No display font for 'ArialNarrow,Bold'
Syntax Error: No display font for 'ArialNarrow,Italic'
Syntax Error: No display font for 'ArialNarrow,BoldItalic'
Syntax Error: No display font for 'ArialNarrow-Bold'
Syntax Error: No display font for 'ArialNarrow-Italic'
Syntax Error: No display font for 'ArialNarrow-BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow'
Syntax Error: No display font for 'HelveticaNarrow,Bold'
Syntax Error: No display font for 'HelveticaNarrow,Italic'
Syntax Error: No display font for 'HelveticaNarrow,BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow-Bold'
Syntax Error: No display font for 'HelveticaNarrow-Italic'
Syntax Error: No display font for 'HelveticaNarrow-BoldItalic'
Syntax Error: No display font for 'BookAntiqua'
Syntax Error: No display font for 'BookAntiqua,Bold'
Syntax Error: No display font for 'BookAntiqua,Italic'
Syntax Er
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 3 -l 3 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Vaults of the Rift.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\vaults\page-0003` -> 0
  - stderr: Syntax Error: No display font for 'Symbol'
Syntax Error: No display font for 'ArialNarrow'
Syntax Error: No display font for 'ArialNarrow,Bold'
Syntax Error: No display font for 'ArialNarrow,Italic'
Syntax Error: No display font for 'ArialNarrow,BoldItalic'
Syntax Error: No display font for 'ArialNarrow-Bold'
Syntax Error: No display font for 'ArialNarrow-Italic'
Syntax Error: No display font for 'ArialNarrow-BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow'
Syntax Error: No display font for 'HelveticaNarrow,Bold'
Syntax Error: No display font for 'HelveticaNarrow,Italic'
Syntax Error: No display font for 'HelveticaNarrow,BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow-Bold'
Syntax Error: No display font for 'HelveticaNarrow-Italic'
Syntax Error: No display font for 'HelveticaNarrow-BoldItalic'
Syntax Error: No display font for 'BookAntiqua'
Syntax Error: No display font for 'BookAntiqua,Bold'
Syntax Error: No display font for 'BookAntiqua,Italic'
Syntax Er
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 4 -l 4 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Vaults of the Rift.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\vaults\page-0004` -> 0
  - stderr: Syntax Error: No display font for 'Symbol'
Syntax Error: No display font for 'ArialNarrow'
Syntax Error: No display font for 'ArialNarrow,Bold'
Syntax Error: No display font for 'ArialNarrow,Italic'
Syntax Error: No display font for 'ArialNarrow,BoldItalic'
Syntax Error: No display font for 'ArialNarrow-Bold'
Syntax Error: No display font for 'ArialNarrow-Italic'
Syntax Error: No display font for 'ArialNarrow-BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow'
Syntax Error: No display font for 'HelveticaNarrow,Bold'
Syntax Error: No display font for 'HelveticaNarrow,Italic'
Syntax Error: No display font for 'HelveticaNarrow,BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow-Bold'
Syntax Error: No display font for 'HelveticaNarrow-Italic'
Syntax Error: No display font for 'HelveticaNarrow-BoldItalic'
Syntax Error: No display font for 'BookAntiqua'
Syntax Error: No display font for 'BookAntiqua,Bold'
Syntax Error: No display font for 'BookAntiqua,Italic'
Syntax Er
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 5 -l 5 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Vaults of the Rift.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\vaults\page-0005` -> 0
  - stderr: Syntax Error: No display font for 'Symbol'
Syntax Error: No display font for 'ArialNarrow'
Syntax Error: No display font for 'ArialNarrow,Bold'
Syntax Error: No display font for 'ArialNarrow,Italic'
Syntax Error: No display font for 'ArialNarrow,BoldItalic'
Syntax Error: No display font for 'ArialNarrow-Bold'
Syntax Error: No display font for 'ArialNarrow-Italic'
Syntax Error: No display font for 'ArialNarrow-BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow'
Syntax Error: No display font for 'HelveticaNarrow,Bold'
Syntax Error: No display font for 'HelveticaNarrow,Italic'
Syntax Error: No display font for 'HelveticaNarrow,BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow-Bold'
Syntax Error: No display font for 'HelveticaNarrow-Italic'
Syntax Error: No display font for 'HelveticaNarrow-BoldItalic'
Syntax Error: No display font for 'BookAntiqua'
Syntax Error: No display font for 'BookAntiqua,Bold'
Syntax Error: No display font for 'BookAntiqua,Italic'
Syntax Er
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 65 -l 65 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Vaults of the Rift.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\vaults\page-0065` -> 0
  - stderr: Syntax Error: No display font for 'Symbol'
Syntax Error: No display font for 'ArialNarrow'
Syntax Error: No display font for 'ArialNarrow,Bold'
Syntax Error: No display font for 'ArialNarrow,Italic'
Syntax Error: No display font for 'ArialNarrow,BoldItalic'
Syntax Error: No display font for 'ArialNarrow-Bold'
Syntax Error: No display font for 'ArialNarrow-Italic'
Syntax Error: No display font for 'ArialNarrow-BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow'
Syntax Error: No display font for 'HelveticaNarrow,Bold'
Syntax Error: No display font for 'HelveticaNarrow,Italic'
Syntax Error: No display font for 'HelveticaNarrow,BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow-Bold'
Syntax Error: No display font for 'HelveticaNarrow-Italic'
Syntax Error: No display font for 'HelveticaNarrow-BoldItalic'
Syntax Error: No display font for 'BookAntiqua'
Syntax Error: No display font for 'BookAntiqua,Bold'
Syntax Error: No display font for 'BookAntiqua,Italic'
Syntax Er
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 137 -l 137 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Vaults of the Rift.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\vaults\page-0137` -> 0
  - stderr: Syntax Error: No display font for 'Symbol'
Syntax Error: No display font for 'ArialNarrow'
Syntax Error: No display font for 'ArialNarrow,Bold'
Syntax Error: No display font for 'ArialNarrow,Italic'
Syntax Error: No display font for 'ArialNarrow,BoldItalic'
Syntax Error: No display font for 'ArialNarrow-Bold'
Syntax Error: No display font for 'ArialNarrow-Italic'
Syntax Error: No display font for 'ArialNarrow-BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow'
Syntax Error: No display font for 'HelveticaNarrow,Bold'
Syntax Error: No display font for 'HelveticaNarrow,Italic'
Syntax Error: No display font for 'HelveticaNarrow,BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow-Bold'
Syntax Error: No display font for 'HelveticaNarrow-Italic'
Syntax Error: No display font for 'HelveticaNarrow-BoldItalic'
Syntax Error: No display font for 'BookAntiqua'
Syntax Error: No display font for 'BookAntiqua,Bold'
Syntax Error: No display font for 'BookAntiqua,Italic'
Syntax Er
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 274 -l 274 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Vaults of the Rift.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\vaults\page-0274` -> 0
  - stderr: Syntax Error: No display font for 'Symbol'
Syntax Error: No display font for 'ArialNarrow'
Syntax Error: No display font for 'ArialNarrow,Bold'
Syntax Error: No display font for 'ArialNarrow,Italic'
Syntax Error: No display font for 'ArialNarrow,BoldItalic'
Syntax Error: No display font for 'ArialNarrow-Bold'
Syntax Error: No display font for 'ArialNarrow-Italic'
Syntax Error: No display font for 'ArialNarrow-BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow'
Syntax Error: No display font for 'HelveticaNarrow,Bold'
Syntax Error: No display font for 'HelveticaNarrow,Italic'
Syntax Error: No display font for 'HelveticaNarrow,BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow-Bold'
Syntax Error: No display font for 'HelveticaNarrow-Italic'
Syntax Error: No display font for 'HelveticaNarrow-BoldItalic'
Syntax Error: No display font for 'BookAntiqua'
Syntax Error: No display font for 'BookAntiqua,Bold'
Syntax Error: No display font for 'BookAntiqua,Italic'
Syntax Er
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 411 -l 411 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Vaults of the Rift.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\vaults\page-0411` -> 0
  - stderr: Syntax Error: No display font for 'Symbol'
Syntax Error: No display font for 'ArialNarrow'
Syntax Error: No display font for 'ArialNarrow,Bold'
Syntax Error: No display font for 'ArialNarrow,Italic'
Syntax Error: No display font for 'ArialNarrow,BoldItalic'
Syntax Error: No display font for 'ArialNarrow-Bold'
Syntax Error: No display font for 'ArialNarrow-Italic'
Syntax Error: No display font for 'ArialNarrow-BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow'
Syntax Error: No display font for 'HelveticaNarrow,Bold'
Syntax Error: No display font for 'HelveticaNarrow,Italic'
Syntax Error: No display font for 'HelveticaNarrow,BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow-Bold'
Syntax Error: No display font for 'HelveticaNarrow-Italic'
Syntax Error: No display font for 'HelveticaNarrow-BoldItalic'
Syntax Error: No display font for 'BookAntiqua'
Syntax Error: No display font for 'BookAntiqua,Bold'
Syntax Error: No display font for 'BookAntiqua,Italic'
Syntax Er
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 546 -l 546 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Vaults of the Rift.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\vaults\page-0546` -> 0
  - stderr: Syntax Error: No display font for 'Symbol'
Syntax Error: No display font for 'ArialNarrow'
Syntax Error: No display font for 'ArialNarrow,Bold'
Syntax Error: No display font for 'ArialNarrow,Italic'
Syntax Error: No display font for 'ArialNarrow,BoldItalic'
Syntax Error: No display font for 'ArialNarrow-Bold'
Syntax Error: No display font for 'ArialNarrow-Italic'
Syntax Error: No display font for 'ArialNarrow-BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow'
Syntax Error: No display font for 'HelveticaNarrow,Bold'
Syntax Error: No display font for 'HelveticaNarrow,Italic'
Syntax Error: No display font for 'HelveticaNarrow,BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow-Bold'
Syntax Error: No display font for 'HelveticaNarrow-Italic'
Syntax Error: No display font for 'HelveticaNarrow-BoldItalic'
Syntax Error: No display font for 'BookAntiqua'
Syntax Error: No display font for 'BookAntiqua,Bold'
Syntax Error: No display font for 'BookAntiqua,Italic'
Syntax Er
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 547 -l 547 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Vaults of the Rift.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\vaults\page-0547` -> 0
  - stderr: Syntax Error: No display font for 'Symbol'
Syntax Error: No display font for 'ArialNarrow'
Syntax Error: No display font for 'ArialNarrow,Bold'
Syntax Error: No display font for 'ArialNarrow,Italic'
Syntax Error: No display font for 'ArialNarrow,BoldItalic'
Syntax Error: No display font for 'ArialNarrow-Bold'
Syntax Error: No display font for 'ArialNarrow-Italic'
Syntax Error: No display font for 'ArialNarrow-BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow'
Syntax Error: No display font for 'HelveticaNarrow,Bold'
Syntax Error: No display font for 'HelveticaNarrow,Italic'
Syntax Error: No display font for 'HelveticaNarrow,BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow-Bold'
Syntax Error: No display font for 'HelveticaNarrow-Italic'
Syntax Error: No display font for 'HelveticaNarrow-BoldItalic'
Syntax Error: No display font for 'BookAntiqua'
Syntax Error: No display font for 'BookAntiqua,Bold'
Syntax Error: No display font for 'BookAntiqua,Italic'
Syntax Er
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 548 -l 548 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Vaults of the Rift.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\vaults\page-0548` -> 0
  - stderr: Syntax Error: No display font for 'Symbol'
Syntax Error: No display font for 'ArialNarrow'
Syntax Error: No display font for 'ArialNarrow,Bold'
Syntax Error: No display font for 'ArialNarrow,Italic'
Syntax Error: No display font for 'ArialNarrow,BoldItalic'
Syntax Error: No display font for 'ArialNarrow-Bold'
Syntax Error: No display font for 'ArialNarrow-Italic'
Syntax Error: No display font for 'ArialNarrow-BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow'
Syntax Error: No display font for 'HelveticaNarrow,Bold'
Syntax Error: No display font for 'HelveticaNarrow,Italic'
Syntax Error: No display font for 'HelveticaNarrow,BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow-Bold'
Syntax Error: No display font for 'HelveticaNarrow-Italic'
Syntax Error: No display font for 'HelveticaNarrow-BoldItalic'
Syntax Error: No display font for 'BookAntiqua'
Syntax Error: No display font for 'BookAntiqua,Bold'
Syntax Error: No display font for 'BookAntiqua,Italic'
Syntax Er
- `C:\tmp\ra_pdf_tools\node_modules\.bin\vivliostyle.cmd build C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\anomaly-manual\000-front.html -o C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\anomaly-manual\000-front.pdf --size letter` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdfinfo.exe C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\anomaly-manual\000-front.pdf` -> 0

- `C:\tmp\ra_pdf_tools\node_modules\.bin\vivliostyle.cmd build C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\anomaly-manual\001-using-the-anomaly-manual.html -o C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\anomaly-manual\001-using-the-anomaly-manual.pdf --size letter` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdfinfo.exe C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\anomaly-manual\001-using-the-anomaly-manual.pdf` -> 0

- `C:\tmp\ra_pdf_tools\node_modules\.bin\vivliostyle.cmd build C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\anomaly-manual\002-anomaly-catalog.html -o C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\anomaly-manual\002-anomaly-catalog.pdf --size letter` -> null
  - stderr: spawnSync C:\WINDOWS\system32\cmd.exe ETIMEDOUT
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdfinfo.exe C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\anomaly-manual\002-anomaly-catalog.pdf` -> 0

- `C:\tmp\ra_pdf_tools\node_modules\.bin\vivliostyle.cmd build C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\anomaly-manual\003-shadow-soldiers.html -o C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\anomaly-manual\003-shadow-soldiers.pdf --size letter` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdfinfo.exe C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\anomaly-manual\003-shadow-soldiers.pdf` -> 0

- `C:\tmp\ra_pdf_tools\node_modules\.bin\vivliostyle.cmd build C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\anomaly-manual\004-anomaly-index.html -o C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\anomaly-manual\004-anomaly-index.pdf --size letter` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdfinfo.exe C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\anomaly-manual\004-anomaly-index.pdf` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe -c 
from pathlib import Path
from pypdf import PdfReader, PdfWriter
import json
import os
import sys

path = Path(sys.argv[1])
bookmarks = json.loads(sys.argv[2])
title = sys.argv[3]
reader = PdfReader(str(path))
writer = PdfWriter()
for page in reader.pages:
    writer.add_page(page)
metadata = {}
if reader.metadata:
    for key, value in reader.metadata.items():
        if value is not None:
            metadata[str(key)] = str(value)
metadata["/Title"] = title
writer.add_metadata(metadata)
parents = {}
page_count = len(reader.pages)
added = []
for mark in bookmarks:
    if page_count == 0:
        continue
    page_index = max(0, min(int(mark.get("pageIndex", 0)), page_count - 1))
    level = max(0, int(mark.get("level", 0)))
    parent = parents.get(level - 1) if level else None
    node = writer.add_outline_item(str(mark.get("title", "Section")), page_index, parent=parent)
    parents[level] = node
    for old_level in list(parents.keys()):
        if old_level > level:
            parents.pop(old_level, None)
    added.append({"title": str(mark.get("title", "Section")), "pageIndex": page_index, "level": level})
tmp = path.with_suffix(path.suffix + ".bookmarked")
with tmp.open("wb") as handle:
    writer.write(handle)
os.replace(tmp, path)
print(json.dumps({"count": len(added), "titles": [item["title"] for item in added[:80]]}, ensure_ascii=False))
 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Anomaly Manual.pdf [{"title":"Cover","pageIndex":0,"level":0},{"title":"Preface","pageIndex":1,"level":0},{"title":"Contents","pageIndex":1,"level":0},{"title":"Part 1: Threat Procedures","pageIndex":2,"level":0},{"title":"Using The Anomaly Manual","pageIndex":2,"level":1},{"title":"Part 2: Anomaly Catalog","pageIndex":3,"level":0},{"title":"Anomaly Catalog","pageIndex":3,"level":1},{"title":"Part 3: Shadow Forces","pageIndex":349,"level":0},{"title":"Shadow Soldiers","pageIndex":349,"level":1},{"title":"Appendices","pageIndex":356,"level":0},{"title":"Anomaly Index","pageIndex":356,"level":1}] Rift Ascendant — Anomaly Manual` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdfinfo.exe C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Anomaly Manual.pdf` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe -c from pathlib import Path
from pypdf import PdfReader
import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
path = Path(sys.argv[1])
reader = PdfReader(str(path))
for page in reader.pages:
    text = page.extract_text() or ''
    print(text) C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Anomaly Manual.pdf` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe -c 
from pypdf import PdfReader
import json
import sys

reader = PdfReader(sys.argv[1])
titles = []
def walk(items):
    for item in items:
        if isinstance(item, list):
            walk(item)
        else:
            titles.append(str(getattr(item, "title", item)))
try:
    walk(reader.outline)
except Exception:
    titles = []
print(json.dumps({"count": len(titles), "titles": titles[:120]}, ensure_ascii=False))
 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Anomaly Manual.pdf` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe -c 
import json
import math
import sys
import pdfplumber

path = sys.argv[1]
issues = []
max_issues = 24
with pdfplumber.open(path) as pdf:
    for page_index, page in enumerate(pdf.pages):
        if page_index == 0:
            continue
        words = page.extract_words(x_tolerance=1, y_tolerance=3, keep_blank_chars=False, use_text_flow=False) or []
        words = [w for w in words if str(w.get("text", "")).strip()]
        words.sort(key=lambda w: (float(w.get("top", 0)), float(w.get("x0", 0))))
        for i, a in enumerate(words):
            if len(issues) >= max_issues:
                break
            ax0 = float(a.get("x0", 0)); ax1 = float(a.get("x1", 0))
            ay0 = float(a.get("top", 0)); ay1 = float(a.get("bottom", 0))
            aw = max(0.1, ax1 - ax0); ah = max(0.1, ay1 - ay0)
            if aw < 1.5 or ah < 1.5:
                continue
            for b in words[i + 1:i + 140]:
                by0 = float(b.get("top", 0))
                if by0 - ay1 > 6:
                    break
                bx0 = float(b.get("x0", 0)); bx1 = float(b.get("x1", 0))
                by1 = float(b.get("bottom", 0))
                bw = max(0.1, bx1 - bx0); bh = max(0.1, by1 - by0)
                inter_w = max(0, min(ax1, bx1) - max(ax0, bx0))
                inter_h = max(0, min(ay1, by1) - max(ay0, by0))
                if inter_w < 2.5 or inter_h < 2.0:
                    continue
                overlap_ratio = (inter_w * inter_h) / max(0.1, min(aw * ah, bw * bh))
                width_ratio = inter_w / max(0.1, min(aw, bw))
                height_ratio = inter_h / max(0.1, min(ah, bh))
                if overlap_ratio >= 0.42 and width_ratio >= 0.35 and height_ratio >= 0.45:
                    issues.append({
                        "page": page_index + 1,
                        "a": str(a.get("text", ""))[:40],
                        "b": str(b.get("text", ""))[:40],
                        "overlap": round(overlap_ratio, 3),
                    })
                    break
            if len(issues) >= max_issues:
                break
        if len(issues) >= max_issues:
            break
print(json.dumps({"issues": issues}, ensure_ascii=False))
 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Anomaly Manual.pdf` -> 0
  - stderr: Could not get FontBBox from font descriptor because None cannot be parsed as 4 floats
Could not get FontBBox from font descriptor because None cannot be parsed as 4 floats
Could not get FontBBox from font descriptor because None cannot be parsed as 4 floats
Could not get FontBBox from font descriptor because None cannot be parsed as 4 floats
Could not get FontBBox from font descriptor because None cannot be parsed as 4 floats
Could not get FontBBox from font descriptor because None cannot be parsed as 4 floats
Could not get FontBBox from font descriptor because None cannot be parsed as 4 floats
Could not get FontBBox from font descriptor because None cannot be parsed as 4 floats
Could not get FontBBox from font descriptor because None cannot be parsed as 4 floats
Could not get FontBBox from font descriptor because None cannot be parsed as 4 floats
Could not get FontBBox from font descriptor because None cannot be parsed as 4 floats
Could not get FontBBox from font descriptor because No
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 1 -l 1 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Anomaly Manual.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\anomaly-manual\page-0001` -> 0

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 2 -l 2 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Anomaly Manual.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\anomaly-manual\page-0002` -> 0
  - stderr: Syntax Error: No display font for 'Symbol'
Syntax Error: No display font for 'ArialNarrow'
Syntax Error: No display font for 'ArialNarrow,Bold'
Syntax Error: No display font for 'ArialNarrow,Italic'
Syntax Error: No display font for 'ArialNarrow,BoldItalic'
Syntax Error: No display font for 'ArialNarrow-Bold'
Syntax Error: No display font for 'ArialNarrow-Italic'
Syntax Error: No display font for 'ArialNarrow-BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow'
Syntax Error: No display font for 'HelveticaNarrow,Bold'
Syntax Error: No display font for 'HelveticaNarrow,Italic'
Syntax Error: No display font for 'HelveticaNarrow,BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow-Bold'
Syntax Error: No display font for 'HelveticaNarrow-Italic'
Syntax Error: No display font for 'HelveticaNarrow-BoldItalic'
Syntax Error: No display font for 'BookAntiqua'
Syntax Error: No display font for 'BookAntiqua,Bold'
Syntax Error: No display font for 'BookAntiqua,Italic'
Syntax Er
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 3 -l 3 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Anomaly Manual.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\anomaly-manual\page-0003` -> 0
  - stderr: Syntax Error: No display font for 'Symbol'
Syntax Error: No display font for 'ArialNarrow'
Syntax Error: No display font for 'ArialNarrow,Bold'
Syntax Error: No display font for 'ArialNarrow,Italic'
Syntax Error: No display font for 'ArialNarrow,BoldItalic'
Syntax Error: No display font for 'ArialNarrow-Bold'
Syntax Error: No display font for 'ArialNarrow-Italic'
Syntax Error: No display font for 'ArialNarrow-BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow'
Syntax Error: No display font for 'HelveticaNarrow,Bold'
Syntax Error: No display font for 'HelveticaNarrow,Italic'
Syntax Error: No display font for 'HelveticaNarrow,BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow-Bold'
Syntax Error: No display font for 'HelveticaNarrow-Italic'
Syntax Error: No display font for 'HelveticaNarrow-BoldItalic'
Syntax Error: No display font for 'BookAntiqua'
Syntax Error: No display font for 'BookAntiqua,Bold'
Syntax Error: No display font for 'BookAntiqua,Italic'
Syntax Er
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 4 -l 4 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Anomaly Manual.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\anomaly-manual\page-0004` -> 0
  - stderr: Syntax Error: No display font for 'Symbol'
Syntax Error: No display font for 'ArialNarrow'
Syntax Error: No display font for 'ArialNarrow,Bold'
Syntax Error: No display font for 'ArialNarrow,Italic'
Syntax Error: No display font for 'ArialNarrow,BoldItalic'
Syntax Error: No display font for 'ArialNarrow-Bold'
Syntax Error: No display font for 'ArialNarrow-Italic'
Syntax Error: No display font for 'ArialNarrow-BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow'
Syntax Error: No display font for 'HelveticaNarrow,Bold'
Syntax Error: No display font for 'HelveticaNarrow,Italic'
Syntax Error: No display font for 'HelveticaNarrow,BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow-Bold'
Syntax Error: No display font for 'HelveticaNarrow-Italic'
Syntax Error: No display font for 'HelveticaNarrow-BoldItalic'
Syntax Error: No display font for 'BookAntiqua'
Syntax Error: No display font for 'BookAntiqua,Bold'
Syntax Error: No display font for 'BookAntiqua,Italic'
Syntax Er
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 5 -l 5 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Anomaly Manual.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\anomaly-manual\page-0005` -> 0
  - stderr: Syntax Error: No display font for 'Symbol'
Syntax Error: No display font for 'ArialNarrow'
Syntax Error: No display font for 'ArialNarrow,Bold'
Syntax Error: No display font for 'ArialNarrow,Italic'
Syntax Error: No display font for 'ArialNarrow,BoldItalic'
Syntax Error: No display font for 'ArialNarrow-Bold'
Syntax Error: No display font for 'ArialNarrow-Italic'
Syntax Error: No display font for 'ArialNarrow-BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow'
Syntax Error: No display font for 'HelveticaNarrow,Bold'
Syntax Error: No display font for 'HelveticaNarrow,Italic'
Syntax Error: No display font for 'HelveticaNarrow,BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow-Bold'
Syntax Error: No display font for 'HelveticaNarrow-Italic'
Syntax Error: No display font for 'HelveticaNarrow-BoldItalic'
Syntax Error: No display font for 'BookAntiqua'
Syntax Error: No display font for 'BookAntiqua,Bold'
Syntax Error: No display font for 'BookAntiqua,Italic'
Syntax Er
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 43 -l 43 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Anomaly Manual.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\anomaly-manual\page-0043` -> 0
  - stderr: Syntax Error: No display font for 'Symbol'
Syntax Error: No display font for 'ArialNarrow'
Syntax Error: No display font for 'ArialNarrow,Bold'
Syntax Error: No display font for 'ArialNarrow,Italic'
Syntax Error: No display font for 'ArialNarrow,BoldItalic'
Syntax Error: No display font for 'ArialNarrow-Bold'
Syntax Error: No display font for 'ArialNarrow-Italic'
Syntax Error: No display font for 'ArialNarrow-BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow'
Syntax Error: No display font for 'HelveticaNarrow,Bold'
Syntax Error: No display font for 'HelveticaNarrow,Italic'
Syntax Error: No display font for 'HelveticaNarrow,BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow-Bold'
Syntax Error: No display font for 'HelveticaNarrow-Italic'
Syntax Error: No display font for 'HelveticaNarrow-BoldItalic'
Syntax Error: No display font for 'BookAntiqua'
Syntax Error: No display font for 'BookAntiqua,Bold'
Syntax Error: No display font for 'BookAntiqua,Italic'
Syntax Er
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 89 -l 89 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Anomaly Manual.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\anomaly-manual\page-0089` -> 0
  - stderr: Syntax Error: No display font for 'Symbol'
Syntax Error: No display font for 'ArialNarrow'
Syntax Error: No display font for 'ArialNarrow,Bold'
Syntax Error: No display font for 'ArialNarrow,Italic'
Syntax Error: No display font for 'ArialNarrow,BoldItalic'
Syntax Error: No display font for 'ArialNarrow-Bold'
Syntax Error: No display font for 'ArialNarrow-Italic'
Syntax Error: No display font for 'ArialNarrow-BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow'
Syntax Error: No display font for 'HelveticaNarrow,Bold'
Syntax Error: No display font for 'HelveticaNarrow,Italic'
Syntax Error: No display font for 'HelveticaNarrow,BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow-Bold'
Syntax Error: No display font for 'HelveticaNarrow-Italic'
Syntax Error: No display font for 'HelveticaNarrow-BoldItalic'
Syntax Error: No display font for 'BookAntiqua'
Syntax Error: No display font for 'BookAntiqua,Bold'
Syntax Error: No display font for 'BookAntiqua,Italic'
Syntax Er
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 179 -l 179 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Anomaly Manual.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\anomaly-manual\page-0179` -> 0
  - stderr: Syntax Error: No display font for 'Symbol'
Syntax Error: No display font for 'ArialNarrow'
Syntax Error: No display font for 'ArialNarrow,Bold'
Syntax Error: No display font for 'ArialNarrow,Italic'
Syntax Error: No display font for 'ArialNarrow,BoldItalic'
Syntax Error: No display font for 'ArialNarrow-Bold'
Syntax Error: No display font for 'ArialNarrow-Italic'
Syntax Error: No display font for 'ArialNarrow-BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow'
Syntax Error: No display font for 'HelveticaNarrow,Bold'
Syntax Error: No display font for 'HelveticaNarrow,Italic'
Syntax Error: No display font for 'HelveticaNarrow,BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow-Bold'
Syntax Error: No display font for 'HelveticaNarrow-Italic'
Syntax Error: No display font for 'HelveticaNarrow-BoldItalic'
Syntax Error: No display font for 'BookAntiqua'
Syntax Error: No display font for 'BookAntiqua,Bold'
Syntax Error: No display font for 'BookAntiqua,Italic'
Syntax Er
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 269 -l 269 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Anomaly Manual.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\anomaly-manual\page-0269` -> 0
  - stderr: Syntax Error: No display font for 'Symbol'
Syntax Error: No display font for 'ArialNarrow'
Syntax Error: No display font for 'ArialNarrow,Bold'
Syntax Error: No display font for 'ArialNarrow,Italic'
Syntax Error: No display font for 'ArialNarrow,BoldItalic'
Syntax Error: No display font for 'ArialNarrow-Bold'
Syntax Error: No display font for 'ArialNarrow-Italic'
Syntax Error: No display font for 'ArialNarrow-BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow'
Syntax Error: No display font for 'HelveticaNarrow,Bold'
Syntax Error: No display font for 'HelveticaNarrow,Italic'
Syntax Error: No display font for 'HelveticaNarrow,BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow-Bold'
Syntax Error: No display font for 'HelveticaNarrow-Italic'
Syntax Error: No display font for 'HelveticaNarrow-BoldItalic'
Syntax Error: No display font for 'BookAntiqua'
Syntax Error: No display font for 'BookAntiqua,Bold'
Syntax Error: No display font for 'BookAntiqua,Italic'
Syntax Er
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 357 -l 357 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Anomaly Manual.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\anomaly-manual\page-0357` -> 0
  - stderr: Syntax Error: No display font for 'Symbol'
Syntax Error: No display font for 'ArialNarrow'
Syntax Error: No display font for 'ArialNarrow,Bold'
Syntax Error: No display font for 'ArialNarrow,Italic'
Syntax Error: No display font for 'ArialNarrow,BoldItalic'
Syntax Error: No display font for 'ArialNarrow-Bold'
Syntax Error: No display font for 'ArialNarrow-Italic'
Syntax Error: No display font for 'ArialNarrow-BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow'
Syntax Error: No display font for 'HelveticaNarrow,Bold'
Syntax Error: No display font for 'HelveticaNarrow,Italic'
Syntax Error: No display font for 'HelveticaNarrow,BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow-Bold'
Syntax Error: No display font for 'HelveticaNarrow-Italic'
Syntax Error: No display font for 'HelveticaNarrow-BoldItalic'
Syntax Error: No display font for 'BookAntiqua'
Syntax Error: No display font for 'BookAntiqua,Bold'
Syntax Error: No display font for 'BookAntiqua,Italic'
Syntax Er
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 358 -l 358 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Anomaly Manual.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\anomaly-manual\page-0358` -> 0
  - stderr: Syntax Error: No display font for 'Symbol'
Syntax Error: No display font for 'ArialNarrow'
Syntax Error: No display font for 'ArialNarrow,Bold'
Syntax Error: No display font for 'ArialNarrow,Italic'
Syntax Error: No display font for 'ArialNarrow,BoldItalic'
Syntax Error: No display font for 'ArialNarrow-Bold'
Syntax Error: No display font for 'ArialNarrow-Italic'
Syntax Error: No display font for 'ArialNarrow-BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow'
Syntax Error: No display font for 'HelveticaNarrow,Bold'
Syntax Error: No display font for 'HelveticaNarrow,Italic'
Syntax Error: No display font for 'HelveticaNarrow,BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow-Bold'
Syntax Error: No display font for 'HelveticaNarrow-Italic'
Syntax Error: No display font for 'HelveticaNarrow-BoldItalic'
Syntax Error: No display font for 'BookAntiqua'
Syntax Error: No display font for 'BookAntiqua,Bold'
Syntax Error: No display font for 'BookAntiqua,Italic'
Syntax Er
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 359 -l 359 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Anomaly Manual.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\anomaly-manual\page-0359` -> 0
  - stderr: Syntax Error: No display font for 'Symbol'
Syntax Error: No display font for 'ArialNarrow'
Syntax Error: No display font for 'ArialNarrow,Bold'
Syntax Error: No display font for 'ArialNarrow,Italic'
Syntax Error: No display font for 'ArialNarrow,BoldItalic'
Syntax Error: No display font for 'ArialNarrow-Bold'
Syntax Error: No display font for 'ArialNarrow-Italic'
Syntax Error: No display font for 'ArialNarrow-BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow'
Syntax Error: No display font for 'HelveticaNarrow,Bold'
Syntax Error: No display font for 'HelveticaNarrow,Italic'
Syntax Error: No display font for 'HelveticaNarrow,BoldItalic'
Syntax Error: No display font for 'HelveticaNarrow-Bold'
Syntax Error: No display font for 'HelveticaNarrow-Italic'
Syntax Error: No display font for 'HelveticaNarrow-BoldItalic'
Syntax Error: No display font for 'BookAntiqua'
Syntax Error: No display font for 'BookAntiqua,Bold'
Syntax Error: No display font for 'BookAntiqua,Italic'
Syntax Er

## Generated Support Files

- C:\Users\jjcal\Documents\solo-compendium\books\shared\pdf_build_report.md
- C:\Users\jjcal\Documents\solo-compendium\books\shared\validation_report.md

## PDF Files Generated

- C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Ascendant Guide.pdf
  - Renderer: Vivliostyle/Playwright mixed chunked
  - Page count: 699
  - File size: 15.52 MB (16270892 bytes)
- C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Warden Guide.pdf
  - Renderer: Vivliostyle/Playwright mixed chunked
  - Page count: 259
  - File size: 31.13 MB (32644615 bytes)
- C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Vaults of the Rift.pdf
  - Renderer: Vivliostyle/Playwright mixed chunked
  - Page count: 548
  - File size: 12.62 MB (13230602 bytes)
- C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Anomaly Manual.pdf
  - Renderer: Vivliostyle/Playwright mixed chunked
  - Page count: 359
  - File size: 55.23 MB (57914476 bytes)

## Validation Results

- PASS: Rift Ascendant — Ascendant Guide is 699 pages using genuine source content.
- PASS: Rift Ascendant — Ascendant Guide is 15.52 MB, within the preferred PDF size budget.
- PASS: Rift Ascendant — Ascendant Guide contains no banned campaign/sandbox leakage terms.
- PASS: Rift Ascendant — Ascendant Guide has 25 PDF bookmarks with major sourcebook sections.
- FAIL: Rift Ascendant — Ascendant Guide has severe text-overlap candidates: p.641 "bo" over "t" (0.424); p.641 "n" over "h" (0.594); p.641 "u" over "o" (0.488); p.641 "A" over "R" (0.643); p.641 "m" over "ES" (1).
- WARN: Rift Ascendant — Warden Guide is 259 pages. Companion books are not padded to 300 pages.
- PASS: Rift Ascendant — Warden Guide is 31.13 MB, within the preferred PDF size budget.
- PASS: Rift Ascendant — Warden Guide contains no banned campaign/sandbox leakage terms.
- PASS: Rift Ascendant — Warden Guide has 22 PDF bookmarks with major sourcebook sections.
- FAIL: Rift Ascendant — Warden Guide has severe text-overlap candidates: p.129 "Regent" over "DESCRIPTION:" (0.552); p.129 "primordial" over "and" (0.488); p.129 "the" over "creatures" (0.477); p.129 "catastrophic" over "must" (0.488); p.129 "the" over "be" (0.428).
- PASS: Rift Ascendant — Vaults of the Rift is 548 pages using genuine source content.
- PASS: Rift Ascendant — Vaults of the Rift is 12.62 MB, within the preferred PDF size budget.
- PASS: Rift Ascendant — Vaults of the Rift contains no banned campaign/sandbox leakage terms.
- PASS: Rift Ascendant — Vaults of the Rift has 14 PDF bookmarks with major sourcebook sections.
- FAIL: Rift Ascendant — Vaults of the Rift has severe text-overlap candidates: p.530 "Its" over "LEGENDARY" (0.572); p.531 "RankM" over "Se" (0.504); p.531 "Its" over "LEGENDARY" (0.572); p.531 "th" over "I" (0.574); p.531 "a" over "r" (0.563).
- PASS: Rift Ascendant — Anomaly Manual is 359 pages using genuine source content.
- PASS: Rift Ascendant — Anomaly Manual is 55.23 MB, within the preferred PDF size budget.
- PASS: Rift Ascendant — Anomaly Manual contains no banned campaign/sandbox leakage terms.
- PASS: Rift Ascendant — Anomaly Manual has 11 PDF bookmarks with major sourcebook sections.
- PASS: Rift Ascendant — Anomaly Manual severe text-overlap audit found no candidates.
- PASS: books/exports contains no HTML deliverables.

## Missing Assets

- Pantheon: The Eternal of Frost: /images/compendium/placeholder.webp (Generic placeholder asset skipped)
- Pantheon: The Aesthetic Harmony: /images/compendium/placeholder.webp (Generic placeholder asset skipped)
- Pantheon: The Eternal of Giants: /images/compendium/placeholder.webp (Generic placeholder asset skipped)
- Pantheon: The Weaver of the Absolute: /images/compendium/placeholder.webp (Generic placeholder asset skipped)
- Pantheon: The Fragment of the Absolute: /images/compendium/placeholder.webp (Generic placeholder asset skipped)
- Pantheon: The Queen of the Swarm: /images/compendium/placeholder.webp (Generic placeholder asset skipped)
- Pantheon: The Dragon-King of Void: /images/compendium/placeholder.webp (Generic placeholder asset skipped)
- Pantheon: The Eternal of Fangs: /images/compendium/placeholder.webp (Generic placeholder asset skipped)
- Pantheon: The Brightest Fragment: /images/compendium/placeholder.webp (Generic placeholder asset skipped)
- Pantheon: The Eternal of Transfiguration: /images/compendium/placeholder.webp (Generic placeholder asset skipped)
- Pantheon: The Eternal of White Flame: /images/compendium/placeholder.webp (Generic placeholder asset skipped)
- Pantheon: The Archivist of Eternity: /images/compendium/placeholder.webp (Generic placeholder asset skipped)

## Optimized Assets

- /ui-art/rift-gate-hero.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\ascendant-cover-3d9a0e0e05.jpg
- /generated/rift-ascendant-candidates/location-background-shadow-realm-exile-1nsqp5-v1-3031651259.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\ascendant-world-lore-cc20eb338e.jpg
- /generated/rift-ascendant-candidates/weapon-weapon-bonded-conductor-jrhva8-v1-930401703.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\ascendant-core-mechanics-636425ad46.jpg
- /generated/rift-ascendant-candidates/character-character-striker-fsk9mx-v1-1749336172.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\ascendant-jobs-ce24b2fcb5.jpg
- /generated/rift-ascendant-candidates/character-character-holy-knight-p092r5-v1-1813314876.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\ascendant-paths-bf02ef4ab3.jpg
- /generated/rift-ascendant-candidates/character-character-contractor-sfraea-v1-1258837483.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\ascendant-backgrounds-45ed706ee2.jpg
- /generated/rift-ascendant-candidates/weapon-weapon-bonded-conductor-jrhva8-v1-930401703.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\ascendant-skills-636425ad46.jpg
- /generated/rift-ascendant-candidates/weapon-weapon-bonded-conductor-jrhva8-v1-930401703.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\ascendant-feats-636425ad46.jpg
- /generated/rift-ascendant-candidates/weapon-weapon-bonded-conductor-jrhva8-v1-930401703.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\ascendant-fighting-styles-636425ad46.jpg
- /generated/rift-ascendant-candidates/weapon-weapon-bonded-conductor-jrhva8-v1-930401703.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\ascendant-techniques-636425ad46.jpg
- /generated/rift-ascendant-candidates/weapon-weapon-bonded-conductor-jrhva8-v1-930401703.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\ascendant-powers-636425ad46.jpg
- /generated/rift-ascendant-candidates/weapon-weapon-bonded-conductor-jrhva8-v1-930401703.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\ascendant-spells-636425ad46.jpg
- /generated/rift-ascendant-candidates/item-item-sworn-sealed-inscription-1buuji-v1-1871931860.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\ascendant-runes-9ede7e1606.jpg
- /generated/rift-ascendant-candidates/item-item-sworn-sealed-inscription-1buuji-v1-1871931860.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\ascendant-sigils-tattoos-9ede7e1606.jpg
- /generated/rift-ascendant-candidates/weapon-weapon-aetheric-compact-smg-pu1oxq-v1-4010952125.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\ascendant-equipment-ab19d55903.jpg
- /generated/rift-ascendant-candidates/weapon-weapon-aetheric-compact-smg-pu1oxq-v1-4010952125.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\ascendant-relics-artifacts-ab19d55903.jpg
- /generated/rift-ascendant-candidates/weapon-weapon-aetheric-compact-smg-pu1oxq-v1-4010952125.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\ascendant-vehicles-ab19d55903.jpg
- /generated/rift-ascendant-candidates/location-background-shadow-realm-exile-1nsqp5-v1-3031651259.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\ascendant-conditions-cc20eb338e.jpg
- /generated/rift-ascendant-candidates/location-background-shadow-realm-exile-1nsqp5-v1-3031651259.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\ascendant-player-index-cc20eb338e.jpg
- /generated/rift-ascendant-candidates/item-item-world-ender-reliquary-1jhkij-v1-3056116143.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\warden-cover-60fd2e4e11.jpg
- /generated/rift-ascendant-candidates/character-character-city-guard-1q3i9c-v1-296750299.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\warden-warden-procedures-ea6b3d94d5.jpg
- /generated/rift-ascendant-candidates/item-item-world-ender-reliquary-1jhkij-v1-3056116143.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\warden-pressure-clocks-60fd2e4e11.jpg
- /generated/rift-ascendant-candidates/location-location-void-portal-1m1hic-v1-2589780808.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\warden-scenario-frameworks-7ad8f94a81.jpg
- /generated/rift-ascendant-candidates/location-location-void-portal-1m1hic-v1-2589780808.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\warden-rift-hazards-domains-7ad8f94a81.jpg
- /generated/rift-ascendant-candidates/item-item-bureau-approved-map-nz6kn7-v1-134383353.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\warden-bureau-afa-guilds-48fa496e36.jpg
- /generated/rift-ascendant-candidates/item-item-bureau-approved-map-nz6kn7-v1-134383353.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\warden-adjudication-rulings-48fa496e36.jpg
- /generated/rift-ascendant-candidates/map-map-vermillion-outpost-1az275-v1-3746029370.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\warden-aftermath-living-world-6cd22259fb.jpg
- /generated/rift-ascendant-candidates/map-map-vermillion-outpost-1az275-v1-3746029370.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\warden-world-directory-6cd22259fb.jpg
- /generated/compendium/regents/spatial-regent.webp -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\warden-regents-pantheon-c69883160a.jpg
- /generated/rift-ascendant-candidates/anomaly-anomaly-blessed-demonic-overlord-i0to55-v1-3897619112.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\warden-encounter-anomaly-design-dd81452a58.jpg
- /generated/rift-ascendant-candidates/map-map-vermillion-outpost-1az275-v1-3746029370.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\warden-warden-contract-seeds-6cd22259fb.jpg
- /generated/rift-ascendant-candidates/anomaly-anomaly-blessed-demonic-overlord-i0to55-v1-3897619112.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\warden-threat-rosters-dd81452a58.jpg
- /generated/props/treasure-cache.webp -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\warden-rewards-tables-conditions-ca5e2da964.jpg
- /generated/rift-ascendant-candidates/item-item-world-ender-reliquary-1jhkij-v1-3056116143.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\warden-warden-appendices-60fd2e4e11.jpg
- /generated/rift-ascendant-candidates/location-location-void-portal-1m1hic-v1-2589780808.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\warden-warden-index-7ad8f94a81.jpg
- /generated/rift-ascendant-candidates/weapon-weapon-bonded-conductor-jrhva8-v1-930401703.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\vaults-cover-636425ad46.jpg
- /generated/rift-ascendant-candidates/weapon-weapon-bonded-conductor-jrhva8-v1-930401703.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\vaults-using-the-vaults-636425ad46.jpg
- /generated/rift-ascendant-candidates/item-item-riftbound-sigil-scroll-zr8wwc-v1-4225377924.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\vaults-expanded-runes-fe692c2971.jpg
- /generated/rift-ascendant-candidates/weapon-weapon-aetheric-compact-smg-pu1oxq-v1-4010952125.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\vaults-expanded-items-ab19d55903.jpg
- /generated/rift-ascendant-candidates/weapon-weapon-archon-s-club-2anxuq-v1-3171127125.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\vaults-relics-65adbfd4e5.jpg
- /generated/rift-ascendant-candidates/weapon-weapon-archon-s-club-2anxuq-v1-3171127125.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\vaults-artifacts-65adbfd4e5.jpg
- /generated/rift-ascendant-candidates/location-background-shadow-realm-exile-1nsqp5-v1-3031651259.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\vaults-vault-index-cc20eb338e.jpg
- /generated/rift-ascendant-candidates/anomaly-anomaly-blessed-void-wraith-5a2r5d-v1-2002275154.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\anomaly-manual-cover-a877a41891.jpg
- /generated/rift-ascendant-candidates/anomaly-anomaly-celestial-void-beast-obzwf2-v1-3821508069.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\anomaly-manual-using-the-manual-52f77687ce.jpg
- /generated/rift-ascendant-candidates/anomaly-anomaly-ancient-void-beast-h44dji-v1-1688413192.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\anomaly-manual-anomaly-catalog-b5ea4e2857.jpg
- /generated/rift-ascendant-candidates/anomaly-anomaly-ancient-shadow-revenant-1mip0k-v1-859439347.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\anomaly-manual-shadow-soldiers-f37013d142.jpg
- /generated/rift-ascendant-candidates/anomaly-anomaly-ancient-void-beast-h44dji-v1-1688413192.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\anomaly-manual-anomaly-index-b5ea4e2857.jpg

## Image Quality Checks

- PASS: ascendant-cover source /ui-art/rift-gate-hero.png prepared from 1024x1024 (hero).
- PASS: ascendant-world-lore source /generated/rift-ascendant-candidates/location-background-shadow-realm-exile-1nsqp5-v1-3031651259.png prepared from 1024x1024 (hero).
- PASS: ascendant-core-mechanics source /generated/rift-ascendant-candidates/weapon-weapon-bonded-conductor-jrhva8-v1-930401703.png prepared from 1024x1024 (hero).
- PASS: ascendant-jobs source /generated/rift-ascendant-candidates/character-character-striker-fsk9mx-v1-1749336172.png prepared from 1024x1360 (hero).
- PASS: ascendant-paths source /generated/rift-ascendant-candidates/character-character-holy-knight-p092r5-v1-1813314876.png prepared from 1024x1360 (hero).
- PASS: ascendant-backgrounds source /generated/rift-ascendant-candidates/character-character-contractor-sfraea-v1-1258837483.png prepared from 1024x1360 (hero).
- PASS: ascendant-skills source /generated/rift-ascendant-candidates/weapon-weapon-bonded-conductor-jrhva8-v1-930401703.png prepared from 1024x1024 (hero).
- PASS: ascendant-feats source /generated/rift-ascendant-candidates/weapon-weapon-bonded-conductor-jrhva8-v1-930401703.png prepared from 1024x1024 (hero).
- PASS: ascendant-fighting-styles source /generated/rift-ascendant-candidates/weapon-weapon-bonded-conductor-jrhva8-v1-930401703.png prepared from 1024x1024 (hero).
- PASS: ascendant-techniques source /generated/rift-ascendant-candidates/weapon-weapon-bonded-conductor-jrhva8-v1-930401703.png prepared from 1024x1024 (hero).
- PASS: ascendant-powers source /generated/rift-ascendant-candidates/weapon-weapon-bonded-conductor-jrhva8-v1-930401703.png prepared from 1024x1024 (hero).
- PASS: ascendant-spells source /generated/rift-ascendant-candidates/weapon-weapon-bonded-conductor-jrhva8-v1-930401703.png prepared from 1024x1024 (hero).
- PASS: ascendant-runes source /generated/rift-ascendant-candidates/item-item-sworn-sealed-inscription-1buuji-v1-1871931860.png prepared from 1024x1024 (hero).
- PASS: ascendant-sigils-tattoos source /generated/rift-ascendant-candidates/item-item-sworn-sealed-inscription-1buuji-v1-1871931860.png prepared from 1024x1024 (hero).
- PASS: ascendant-equipment source /generated/rift-ascendant-candidates/weapon-weapon-aetheric-compact-smg-pu1oxq-v1-4010952125.png prepared from 1024x1024 (hero).
- PASS: ascendant-relics-artifacts source /generated/rift-ascendant-candidates/weapon-weapon-aetheric-compact-smg-pu1oxq-v1-4010952125.png prepared from 1024x1024 (hero).
- PASS: ascendant-vehicles source /generated/rift-ascendant-candidates/weapon-weapon-aetheric-compact-smg-pu1oxq-v1-4010952125.png prepared from 1024x1024 (hero).
- PASS: ascendant-conditions source /generated/rift-ascendant-candidates/location-background-shadow-realm-exile-1nsqp5-v1-3031651259.png prepared from 1024x1024 (hero).
- PASS: ascendant-player-index source /generated/rift-ascendant-candidates/location-background-shadow-realm-exile-1nsqp5-v1-3031651259.png prepared from 1024x1024 (hero).
- PASS: warden-cover source /generated/rift-ascendant-candidates/item-item-world-ender-reliquary-1jhkij-v1-3056116143.png prepared from 1024x1024 (hero).
- PASS: warden-warden-procedures source /generated/rift-ascendant-candidates/character-character-city-guard-1q3i9c-v1-296750299.png prepared from 1024x1360 (hero).
- PASS: warden-pressure-clocks source /generated/rift-ascendant-candidates/item-item-world-ender-reliquary-1jhkij-v1-3056116143.png prepared from 1024x1024 (hero).
- PASS: warden-scenario-frameworks source /generated/rift-ascendant-candidates/location-location-void-portal-1m1hic-v1-2589780808.png prepared from 1024x1024 (hero).
- PASS: warden-rift-hazards-domains source /generated/rift-ascendant-candidates/location-location-void-portal-1m1hic-v1-2589780808.png prepared from 1024x1024 (hero).
- PASS: warden-bureau-afa-guilds source /generated/rift-ascendant-candidates/item-item-bureau-approved-map-nz6kn7-v1-134383353.png prepared from 1024x1024 (hero).
- PASS: warden-adjudication-rulings source /generated/rift-ascendant-candidates/item-item-bureau-approved-map-nz6kn7-v1-134383353.png prepared from 1024x1024 (hero).
- PASS: warden-aftermath-living-world source /generated/rift-ascendant-candidates/map-map-vermillion-outpost-1az275-v1-3746029370.png prepared from 1024x1024 (hero).
- PASS: warden-world-directory source /generated/rift-ascendant-candidates/map-map-vermillion-outpost-1az275-v1-3746029370.png prepared from 1024x1024 (hero).
- PASS: warden-regents-pantheon source /generated/compendium/regents/spatial-regent.webp prepared from 1024x1024 (hero).
- PASS: warden-encounter-anomaly-design source /generated/rift-ascendant-candidates/anomaly-anomaly-blessed-demonic-overlord-i0to55-v1-3897619112.png prepared from 1024x1024 (hero).
- PASS: warden-warden-contract-seeds source /generated/rift-ascendant-candidates/map-map-vermillion-outpost-1az275-v1-3746029370.png prepared from 1024x1024 (hero).
- PASS: warden-threat-rosters source /generated/rift-ascendant-candidates/anomaly-anomaly-blessed-demonic-overlord-i0to55-v1-3897619112.png prepared from 1024x1024 (hero).
- PASS: warden-rewards-tables-conditions source /generated/props/treasure-cache.webp prepared from 1024x1024 (hero).
- PASS: warden-warden-appendices source /generated/rift-ascendant-candidates/item-item-world-ender-reliquary-1jhkij-v1-3056116143.png prepared from 1024x1024 (hero).
- PASS: warden-warden-index source /generated/rift-ascendant-candidates/location-location-void-portal-1m1hic-v1-2589780808.png prepared from 1024x1024 (hero).
- PASS: vaults-cover source /generated/rift-ascendant-candidates/weapon-weapon-bonded-conductor-jrhva8-v1-930401703.png prepared from 1024x1024 (hero).
- PASS: vaults-using-the-vaults source /generated/rift-ascendant-candidates/weapon-weapon-bonded-conductor-jrhva8-v1-930401703.png prepared from 1024x1024 (hero).
- PASS: vaults-expanded-runes source /generated/rift-ascendant-candidates/item-item-riftbound-sigil-scroll-zr8wwc-v1-4225377924.png prepared from 1024x1024 (hero).
- PASS: vaults-expanded-items source /generated/rift-ascendant-candidates/weapon-weapon-aetheric-compact-smg-pu1oxq-v1-4010952125.png prepared from 1024x1024 (hero).
- PASS: vaults-relics source /generated/rift-ascendant-candidates/weapon-weapon-archon-s-club-2anxuq-v1-3171127125.png prepared from 1024x1024 (hero).
- PASS: vaults-artifacts source /generated/rift-ascendant-candidates/weapon-weapon-archon-s-club-2anxuq-v1-3171127125.png prepared from 1024x1024 (hero).
- PASS: vaults-vault-index source /generated/rift-ascendant-candidates/location-background-shadow-realm-exile-1nsqp5-v1-3031651259.png prepared from 1024x1024 (hero).
- PASS: anomaly-manual-cover source /generated/rift-ascendant-candidates/anomaly-anomaly-blessed-void-wraith-5a2r5d-v1-2002275154.png prepared from 1024x1024 (hero).
- PASS: anomaly-manual-using-the-manual source /generated/rift-ascendant-candidates/anomaly-anomaly-celestial-void-beast-obzwf2-v1-3821508069.png prepared from 1024x1024 (hero).
- PASS: anomaly-manual-anomaly-catalog source /generated/rift-ascendant-candidates/anomaly-anomaly-ancient-void-beast-h44dji-v1-1688413192.png prepared from 1024x1024 (hero).
- PASS: anomaly-manual-shadow-soldiers source /generated/rift-ascendant-candidates/anomaly-anomaly-ancient-shadow-revenant-1mip0k-v1-859439347.png prepared from 1024x1024 (hero).
- PASS: anomaly-manual-anomaly-index source /generated/rift-ascendant-candidates/anomaly-anomaly-ancient-void-beast-h44dji-v1-1688413192.png prepared from 1024x1024 (hero).

## Rendered Sample Pages

- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\ascendant\page-0001-001.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\ascendant\page-0002-002.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\ascendant\page-0003-003.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\ascendant\page-0004-004.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\ascendant\page-0005-005.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\ascendant\page-0083-083.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\ascendant\page-0174-174.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\ascendant\page-0349-349.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\ascendant\page-0524-524.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\ascendant\page-0697-697.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\ascendant\page-0698-698.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\ascendant\page-0699-699.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\warden\page-0001-001.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\warden\page-0002-002.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\warden\page-0003-003.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\warden\page-0004-004.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\warden\page-0005-005.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\warden\page-0031-031.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\warden\page-0064-064.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\warden\page-0129-129.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\warden\page-0194-194.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\warden\page-0257-257.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\warden\page-0258-258.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\warden\page-0259-259.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\vaults\page-0001-001.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\vaults\page-0002-002.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\vaults\page-0003-003.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\vaults\page-0004-004.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\vaults\page-0005-005.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\vaults\page-0065-065.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\vaults\page-0137-137.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\vaults\page-0274-274.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\vaults\page-0411-411.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\vaults\page-0546-546.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\vaults\page-0547-547.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\vaults\page-0548-548.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\anomaly-manual\page-0001-001.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\anomaly-manual\page-0002-002.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\anomaly-manual\page-0003-003.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\anomaly-manual\page-0004-004.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\anomaly-manual\page-0005-005.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\anomaly-manual\page-0043-043.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\anomaly-manual\page-0089-089.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\anomaly-manual\page-0179-179.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\anomaly-manual\page-0269-269.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\anomaly-manual\page-0357-357.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\anomaly-manual\page-0358-358.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\anomaly-manual\page-0359-359.png

## Warnings

- None

## Failed Export Attempts

- Vivliostyle timed out for Rift Ascendant — Ascendant Guide / Relics And Artifacts (>300s); this chunk rendered via Playwright fallback.
- Vivliostyle timed out for Rift Ascendant — Warden Guide / Regents And Pantheon (>300s); this chunk rendered via Playwright fallback.
- Vivliostyle timed out for Rift Ascendant — Warden Guide / Encounter And Anomaly Design (>300s); this chunk rendered via Playwright fallback.
- Vivliostyle timed out for Rift Ascendant — Vaults of the Rift / Artifacts (>300s); this chunk rendered via Playwright fallback.
- Vivliostyle timed out for Rift Ascendant — Anomaly Manual / Anomaly Catalog (>300s); this chunk rendered via Playwright fallback.

## Final PDF Paths

- C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Ascendant Guide.pdf
- C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Warden Guide.pdf
- C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Vaults of the Rift.pdf
- C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Anomaly Manual.pdf
