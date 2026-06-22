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

- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe -c from pathlib import Path
from pypdf import PdfReader
import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
path = Path(sys.argv[1])
reader = PdfReader(str(path))
for page in reader.pages:
    text = page.extract_text() or ''
    print(text) C:\Users\jjcal\Downloads\Rift Ascendant- Player’s Guide to the World.pdf` -> 0

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
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 64 -l 64 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Ascendant Guide.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\ascendant\page-0064` -> 0
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
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 133 -l 133 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Ascendant Guide.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\ascendant\page-0133` -> 0
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
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 267 -l 267 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Ascendant Guide.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\ascendant\page-0267` -> 0
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
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 401 -l 401 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Ascendant Guide.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\ascendant\page-0401` -> 0
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
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 533 -l 533 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Ascendant Guide.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\ascendant\page-0533` -> 0
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
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 534 -l 534 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Ascendant Guide.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\ascendant\page-0534` -> 0
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
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 535 -l 535 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Ascendant Guide.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\ascendant\page-0535` -> 0
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
- `C:\tmp\ra_pdf_tools\node_modules\.bin\vivliostyle.cmd --version` -> 0

- `C:\tmp\ra_pdf_tools\node_modules\.bin\vivliostyle.cmd build C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\warden\full-render\warden.html -o "C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Warden Guide.pdf" --size letter` -> null
  - stderr: spawnSync C:\WINDOWS\system32\cmd.exe ETIMEDOUT
- `where.exe weasyprint.exe` -> 1
  - stderr: INFO: Could not find files for the given pattern(s).

- `where.exe weasyprint` -> 1
  - stderr: INFO: Could not find files for the given pattern(s).

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
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 33 -l 33 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Warden Guide.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\warden\page-0033` -> 0
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
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 69 -l 69 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Warden Guide.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\warden\page-0069` -> 0
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
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 139 -l 139 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Warden Guide.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\warden\page-0139` -> 0
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
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 209 -l 209 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Warden Guide.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\warden\page-0209` -> 0
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
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 277 -l 277 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Warden Guide.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\warden\page-0277` -> 0
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
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 278 -l 278 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Warden Guide.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\warden\page-0278` -> 0
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
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 279 -l 279 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Warden Guide.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\warden\page-0279` -> 0
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
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 56 -l 56 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Vaults of the Rift.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\vaults\page-0056` -> 0
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
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 117 -l 117 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Vaults of the Rift.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\vaults\page-0117` -> 0
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
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 235 -l 235 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Vaults of the Rift.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\vaults\page-0235` -> 0
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
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 353 -l 353 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Vaults of the Rift.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\vaults\page-0353` -> 0
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
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 469 -l 469 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Vaults of the Rift.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\vaults\page-0469` -> 0
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
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 470 -l 470 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Vaults of the Rift.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\vaults\page-0470` -> 0
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
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 471 -l 471 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Vaults of the Rift.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\vaults\page-0471` -> 0
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
- `where.exe weasyprint.exe` -> 1
  - stderr: INFO: Could not find files for the given pattern(s).

- `where.exe weasyprint` -> 1
  - stderr: INFO: Could not find files for the given pattern(s).

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
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 51 -l 51 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Anomaly Manual.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\anomaly-manual\page-0051` -> 0
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
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 108 -l 108 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Anomaly Manual.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\anomaly-manual\page-0108` -> 0
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
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 216 -l 216 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Anomaly Manual.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\anomaly-manual\page-0216` -> 0
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
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 324 -l 324 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Anomaly Manual.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\anomaly-manual\page-0324` -> 0
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
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 431 -l 431 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Anomaly Manual.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\anomaly-manual\page-0431` -> 0
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
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 432 -l 432 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Anomaly Manual.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\anomaly-manual\page-0432` -> 0
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
- `C:\Users\jjcal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe -f 433 -l 433 -png -r 150 C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Anomaly Manual.pdf C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\anomaly-manual\page-0433` -> 0
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
  - Renderer: Playwright chunked
  - Page count: 535
  - File size: 19.31 MB (20250805 bytes)
- C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Warden Guide.pdf
  - Renderer: Playwright chunked
  - Page count: 279
  - File size: 33.14 MB (34749396 bytes)
- C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Vaults of the Rift.pdf
  - Renderer: Playwright chunked
  - Page count: 471
  - File size: 8.11 MB (8507028 bytes)
- C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Anomaly Manual.pdf
  - Renderer: Playwright chunked
  - Page count: 433
  - File size: 3.99 MB (4179592 bytes)

## Validation Results

- PASS: Rift Ascendant - Ascendant Guide is 535 pages using genuine source content.
- PASS: Rift Ascendant - Ascendant Guide is 19.31 MB, within the preferred PDF size budget.
- PASS: Rift Ascendant - Ascendant Guide contains no banned campaign/sandbox leakage terms.
- WARN: Rift Ascendant - Warden Guide is 279 pages. Companion books are not padded to 300 pages.
- PASS: Rift Ascendant - Warden Guide is 33.14 MB, within the preferred PDF size budget.
- PASS: Rift Ascendant - Warden Guide contains no banned campaign/sandbox leakage terms.
- PASS: Rift Ascendant - Vaults of the Rift is 471 pages using genuine source content.
- PASS: Rift Ascendant - Vaults of the Rift is 8.11 MB, within the preferred PDF size budget.
- PASS: Rift Ascendant - Vaults of the Rift contains no banned campaign/sandbox leakage terms.
- PASS: Rift Ascendant - Anomaly Manual is 433 pages using genuine source content.
- PASS: Rift Ascendant - Anomaly Manual is 3.99 MB, within the preferred PDF size budget.
- PASS: Rift Ascendant - Anomaly Manual contains no banned campaign/sandbox leakage terms.

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
- /ui-art/gate-portal-3d.webp -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\ascendant-world-lore-819cf4eadf.jpg
- /generated/rift-ascendant-candidates/weapon-weapon-bonded-conductor-jrhva8-v1-930401703.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\ascendant-core-mechanics-636425ad46.jpg
- /generated/rift-ascendant-candidates/character-character-striker-fsk9mx-v1-1749336172.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\ascendant-jobs-ce24b2fcb5.jpg
- /generated/rift-ascendant-candidates/character-character-holy-knight-p092r5-v1-1813314876.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\ascendant-paths-bf02ef4ab3.jpg
- /generated/rift-ascendant-candidates/character-character-contractor-sfraea-v1-1258837483.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\ascendant-backgrounds-45ed706ee2.jpg
- /generated/rift-ascendant-candidates/weapon-weapon-bonded-conductor-jrhva8-v1-930401703.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\ascendant-skills-feats-styles-636425ad46.jpg
- /generated/rift-ascendant-candidates/weapon-weapon-bonded-conductor-jrhva8-v1-930401703.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\ascendant-techniques-powers-spells-636425ad46.jpg
- /generated/magical/rune-circle.webp -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\ascendant-runes-sigils-tattoos-61a840cee1.jpg
- /generated/rift-ascendant-candidates/weapon-weapon-aetheric-compact-smg-pu1oxq-v1-4010952125.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\ascendant-equipment-relics-vehicles-ab19d55903.jpg
- /ui-art/gate-portal-3d.webp -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\ascendant-conditions-index-819cf4eadf.jpg
- /generated/maps/premade/arcane-schematic.webp -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\warden-cover-af65bdb295.jpg
- /generated/rift-ascendant-candidates/character-character-city-guard-1q3i9c-v1-296750299.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\warden-warden-procedures-ea6b3d94d5.jpg
- /generated/maps/premade/arcane-schematic.webp -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\warden-pressure-clocks-af65bdb295.jpg
- /ui-art/gate-portal-3d.webp -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\warden-scenario-frameworks-819cf4eadf.jpg
- /ui-art/gate-portal-3d.webp -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\warden-rift-hazards-domains-819cf4eadf.jpg
- /ui-art/system-interface.webp -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\warden-bureau-afa-guilds-ddae795c29.jpg
- /ui-art/system-interface.webp -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\warden-adjudication-rulings-ddae795c29.jpg
- /generated/rift-ascendant-candidates/map-map-vermillion-outpost-1az275-v1-3746029370.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\warden-aftermath-living-world-6cd22259fb.jpg
- /generated/rift-ascendant-candidates/map-map-vermillion-outpost-1az275-v1-3746029370.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\warden-world-directory-6cd22259fb.jpg
- /generated/compendium/regents/spatial-regent.webp -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\warden-regents-pantheon-c69883160a.jpg
- /generated/rift-ascendant-candidates/anomaly-anomaly-blessed-demonic-overlord-i0to55-v1-3897619112.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\warden-encounter-anomaly-design-dd81452a58.jpg
- /generated/rift-ascendant-candidates/map-map-vermillion-outpost-1az275-v1-3746029370.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\warden-warden-contract-seeds-6cd22259fb.jpg
- /generated/rift-ascendant-candidates/anomaly-anomaly-blessed-demonic-overlord-i0to55-v1-3897619112.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\warden-threat-rosters-dd81452a58.jpg
- /generated/props/treasure-cache.webp -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\warden-rewards-tables-conditions-ca5e2da964.jpg
- /generated/maps/premade/arcane-schematic.webp -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\warden-warden-appendices-af65bdb295.jpg
- /ui-art/gate-portal-3d.webp -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\warden-warden-index-819cf4eadf.jpg
- /generated/rift-ascendant-candidates/weapon-weapon-bonded-conductor-jrhva8-v1-930401703.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\vaults-cover-636425ad46.jpg
- /generated/rift-ascendant-candidates/weapon-weapon-bonded-conductor-jrhva8-v1-930401703.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\vaults-using-the-vaults-636425ad46.jpg
- /generated/magical/rune-circle.webp -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\vaults-expanded-runes-61a840cee1.jpg
- /generated/rift-ascendant-candidates/weapon-weapon-aetheric-compact-smg-pu1oxq-v1-4010952125.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\vaults-expanded-items-ab19d55903.jpg
- /generated/rift-ascendant-candidates/weapon-weapon-archon-s-club-2anxuq-v1-3171127125.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\vaults-relics-artifacts-65adbfd4e5.jpg
- /ui-art/gate-portal-3d.webp -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\vaults-vault-index-819cf4eadf.jpg
- /generated/rift-ascendant-candidates/anomaly-anomaly-blessed-void-wraith-5a2r5d-v1-2002275154.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\anomaly-manual-cover-a877a41891.jpg
- /generated/rift-ascendant-candidates/anomaly-anomaly-celestial-void-beast-obzwf2-v1-3821508069.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\anomaly-manual-using-the-manual-52f77687ce.jpg
- /generated/rift-ascendant-candidates/anomaly-anomaly-ancient-void-beast-h44dji-v1-1688413192.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\anomaly-manual-anomaly-catalog-b5ea4e2857.jpg
- /generated/rift-ascendant-candidates/anomaly-anomaly-ancient-shadow-revenant-1mip0k-v1-859439347.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\anomaly-manual-shadow-soldiers-f37013d142.jpg
- /generated/rift-ascendant-candidates/anomaly-anomaly-ancient-void-beast-h44dji-v1-1688413192.png -> C:\Users\jjcal\Documents\solo-compendium\books\shared\assets\anomaly-manual-anomaly-index-b5ea4e2857.jpg

## Image Quality Checks

- PASS: ascendant-cover source /ui-art/rift-gate-hero.png prepared from 1024x1024 (hero).
- PASS: ascendant-world-lore source /ui-art/gate-portal-3d.webp prepared from 1920x1080 (hero).
- PASS: ascendant-core-mechanics source /generated/rift-ascendant-candidates/weapon-weapon-bonded-conductor-jrhva8-v1-930401703.png prepared from 1024x1024 (hero).
- PASS: ascendant-jobs source /generated/rift-ascendant-candidates/character-character-striker-fsk9mx-v1-1749336172.png prepared from 1024x1360 (hero).
- PASS: ascendant-paths source /generated/rift-ascendant-candidates/character-character-holy-knight-p092r5-v1-1813314876.png prepared from 1024x1360 (hero).
- PASS: ascendant-backgrounds source /generated/rift-ascendant-candidates/character-character-contractor-sfraea-v1-1258837483.png prepared from 1024x1360 (hero).
- PASS: ascendant-skills-feats-styles source /generated/rift-ascendant-candidates/weapon-weapon-bonded-conductor-jrhva8-v1-930401703.png prepared from 1024x1024 (hero).
- PASS: ascendant-techniques-powers-spells source /generated/rift-ascendant-candidates/weapon-weapon-bonded-conductor-jrhva8-v1-930401703.png prepared from 1024x1024 (hero).
- PASS: ascendant-runes-sigils-tattoos source /generated/magical/rune-circle.webp prepared from 1024x1024 (hero).
- PASS: ascendant-equipment-relics-vehicles source /generated/rift-ascendant-candidates/weapon-weapon-aetheric-compact-smg-pu1oxq-v1-4010952125.png prepared from 1024x1024 (hero).
- PASS: ascendant-conditions-index source /ui-art/gate-portal-3d.webp prepared from 1920x1080 (hero).
- PASS: warden-cover source /generated/maps/premade/arcane-schematic.webp prepared from 2048x2048 (hero).
- PASS: warden-warden-procedures source /generated/rift-ascendant-candidates/character-character-city-guard-1q3i9c-v1-296750299.png prepared from 1024x1360 (hero).
- PASS: warden-pressure-clocks source /generated/maps/premade/arcane-schematic.webp prepared from 2048x2048 (hero).
- PASS: warden-scenario-frameworks source /ui-art/gate-portal-3d.webp prepared from 1920x1080 (hero).
- PASS: warden-rift-hazards-domains source /ui-art/gate-portal-3d.webp prepared from 1920x1080 (hero).
- PASS: warden-bureau-afa-guilds source /ui-art/system-interface.webp prepared from 1920x1080 (hero).
- PASS: warden-adjudication-rulings source /ui-art/system-interface.webp prepared from 1920x1080 (hero).
- PASS: warden-aftermath-living-world source /generated/rift-ascendant-candidates/map-map-vermillion-outpost-1az275-v1-3746029370.png prepared from 1024x1024 (hero).
- PASS: warden-world-directory source /generated/rift-ascendant-candidates/map-map-vermillion-outpost-1az275-v1-3746029370.png prepared from 1024x1024 (hero).
- PASS: warden-regents-pantheon source /generated/compendium/regents/spatial-regent.webp prepared from 1024x1024 (hero).
- PASS: warden-encounter-anomaly-design source /generated/rift-ascendant-candidates/anomaly-anomaly-blessed-demonic-overlord-i0to55-v1-3897619112.png prepared from 1024x1024 (hero).
- PASS: warden-warden-contract-seeds source /generated/rift-ascendant-candidates/map-map-vermillion-outpost-1az275-v1-3746029370.png prepared from 1024x1024 (hero).
- PASS: warden-threat-rosters source /generated/rift-ascendant-candidates/anomaly-anomaly-blessed-demonic-overlord-i0to55-v1-3897619112.png prepared from 1024x1024 (hero).
- PASS: warden-rewards-tables-conditions source /generated/props/treasure-cache.webp prepared from 1024x1024 (hero).
- PASS: warden-warden-appendices source /generated/maps/premade/arcane-schematic.webp prepared from 2048x2048 (hero).
- PASS: warden-warden-index source /ui-art/gate-portal-3d.webp prepared from 1920x1080 (hero).
- PASS: vaults-cover source /generated/rift-ascendant-candidates/weapon-weapon-bonded-conductor-jrhva8-v1-930401703.png prepared from 1024x1024 (hero).
- PASS: vaults-using-the-vaults source /generated/rift-ascendant-candidates/weapon-weapon-bonded-conductor-jrhva8-v1-930401703.png prepared from 1024x1024 (hero).
- PASS: vaults-expanded-runes source /generated/magical/rune-circle.webp prepared from 1024x1024 (hero).
- PASS: vaults-expanded-items source /generated/rift-ascendant-candidates/weapon-weapon-aetheric-compact-smg-pu1oxq-v1-4010952125.png prepared from 1024x1024 (hero).
- PASS: vaults-relics-artifacts source /generated/rift-ascendant-candidates/weapon-weapon-archon-s-club-2anxuq-v1-3171127125.png prepared from 1024x1024 (hero).
- PASS: vaults-vault-index source /ui-art/gate-portal-3d.webp prepared from 1920x1080 (hero).
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
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\ascendant\page-0064-064.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\ascendant\page-0133-133.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\ascendant\page-0267-267.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\ascendant\page-0401-401.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\ascendant\page-0533-533.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\ascendant\page-0534-534.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\ascendant\page-0535-535.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\warden\page-0001-001.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\warden\page-0002-002.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\warden\page-0003-003.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\warden\page-0004-004.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\warden\page-0005-005.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\warden\page-0033-033.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\warden\page-0069-069.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\warden\page-0139-139.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\warden\page-0209-209.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\warden\page-0277-277.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\warden\page-0278-278.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\warden\page-0279-279.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\vaults\page-0001-001.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\vaults\page-0002-002.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\vaults\page-0003-003.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\vaults\page-0004-004.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\vaults\page-0005-005.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\vaults\page-0056-056.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\vaults\page-0117-117.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\vaults\page-0235-235.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\vaults\page-0353-353.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\vaults\page-0469-469.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\vaults\page-0470-470.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\vaults\page-0471-471.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\anomaly-manual\page-0001-001.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\anomaly-manual\page-0002-002.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\anomaly-manual\page-0003-003.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\anomaly-manual\page-0004-004.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\anomaly-manual\page-0005-005.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\anomaly-manual\page-0051-051.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\anomaly-manual\page-0108-108.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\anomaly-manual\page-0216-216.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\anomaly-manual\page-0324-324.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\anomaly-manual\page-0431-431.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\anomaly-manual\page-0432-432.png
- C:\Users\jjcal\Documents\solo-compendium\books\exports\rendered-samples\anomaly-manual\page-0433-433.png

## Warnings

- None

## Failed Export Attempts

- Rift Ascendant - Ascendant Guide: full HTML is 3.30 MB, above the 1.43 MB Vivliostyle single-render limit; using fallback renderers.
- Vivliostyle timed out for C:\Users\jjcal\Documents\solo-compendium\books\shared\chunks\warden\full-render\warden.html; later books will use fallback renderers.
- WeasyPrint was not installed or discoverable; Playwright remains available as fallback.
- Rift Ascendant - Warden Guide: full-book paged-media renderers were unavailable or failed; Playwright rendered chapter chunks and pdf-lib merged them.
- Rift Ascendant - Vaults of the Rift: full HTML is 2.67 MB, above the 1.43 MB Vivliostyle single-render limit; using fallback renderers.
- Vivliostyle skipped after a previous timeout in this build run.
- WeasyPrint was not installed or discoverable; Playwright remains available as fallback.
- Rift Ascendant - Anomaly Manual: full-book paged-media renderers were unavailable or failed; Playwright rendered chapter chunks and pdf-lib merged them.

## Final PDF Paths

- C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Ascendant Guide.pdf
- C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Warden Guide.pdf
- C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Vaults of the Rift.pdf
- C:\Users\jjcal\Documents\solo-compendium\books\exports\Rift Ascendant - Anomaly Manual.pdf
