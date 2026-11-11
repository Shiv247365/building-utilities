"""Run the packaged notebook code with plain Python, NumPy and pandas."""
import argparse
import json
import os
from pathlib import Path

root = Path(__file__).resolve().parent.parent
experiments = {
    'electricity': 'seven_day_meter_study.ipynb',
    'water': 'water_audit_study.ipynb',
    'priority': 'water_audit_priority_study.ipynb',
}
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('experiment', choices=experiments)
args = parser.parse_args()
os.chdir(root)
notebook = json.loads((root / 'notebooks' / experiments[args.experiment]).read_text(encoding='utf-8'))
scope = {}
for index, cell in enumerate(notebook['cells'], start=1):
    if cell['cell_type'] == 'code':
        exec(compile(''.join(cell['source']), f'{experiments[args.experiment]}:cell{index}', 'exec'), scope)
