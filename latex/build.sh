#!/bin/sh
# Şevval Boyraz, 2200004208
# Build the LaTeX version of the guide (Bonus 1) from ../README.md.
# Needs: pandoc, a TeX Live with xelatex and minted, and Python with Pygments.
set -e
python3 - <<'PY'
s = open('../README.md', encoding='utf-8').read()
s = s.split('\n', 1)[1]          # the title comes from metadata.yaml
s = s.replace('🚢', '[ship]')    # DejaVu has no colour emoji
open('guide.md', 'w', encoding='utf-8').write(s)
PY
pandoc guide.md -f gfm --metadata-file=metadata.yaml --shift-heading-level-by=-1 \
  --lua-filter=minted.lua --toc --number-sections --standalone -H header.tex -o destructuring-guide.tex
python3 - <<'PY'
p = 'destructuring-guide.tex'
s = open(p, encoding='utf-8').read()
def cols(ws):
    n = len(ws)
    return '{@{}' + ''.join(r'>{\raggedright\arraybackslash}p{(\linewidth - %d\tabcolsep) * \real{%.2f}}' % (2 * (n - 1), w) for w in ws) + '@{}}'
s = s.replace(r'\begin{longtable}[]{@{}lll@{}}', r'\begin{longtable}[]' + cols([0.36, 0.46, 0.18]))
s = s.replace(r'\begin{longtable}[]{@{}llll@{}}', r'\begin{longtable}[]' + cols([0.13, 0.17, 0.30, 0.40]))
if r'\usepackage{calc}' not in s:
    s = s.replace(r'\begin{document}', r'\usepackage{calc}' + '\n' + r'\begin{document}', 1)
open(p, 'w', encoding='utf-8').write(s)
PY
latexmk -xelatex -shell-escape -interaction=nonstopmode -halt-on-error destructuring-guide.tex
