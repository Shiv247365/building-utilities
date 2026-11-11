import json
import re
from pathlib import Path


work = Path(__file__).resolve().parent
outputs = work / 'generated'
outputs.mkdir(exist_ok=True)
styles = (work / 'utilities_theme.css').read_text(encoding='utf-8')
original_checker = (work / 'water_audit_queue_template.html').read_text(encoding='utf-8')
checker_script = re.search(r'<script>\s*([\s\S]*?)</script>', original_checker).group(1)
assert checker_script.count('showExample(study.examples[0]);') == 1
checker_script = checker_script.replace('showExample(study.examples[0]);', '')
checker_data = json.loads((work / 'water_final_model.json').read_text(encoding='utf-8'))
checker_document = ((work / 'water_property_checker.html').read_text(encoding='utf-8')
                    .replace('__APP_STYLES__', styles)
                    .replace('__STUDY_JSON__', json.dumps(checker_data, ensure_ascii=False))
                    .replace('__PROPERTY_SCRIPT__', checker_script))
(outputs / 'water_property_check.html').write_text(checker_document, encoding='utf-8')
checker_json = json.dumps(checker_document, ensure_ascii=False).replace('<', '\\u003c')
modules = {}
for name, template_file, data_file, placeholder, output_file in (
    ('water', 'water_portfolio.html', 'portfolio_model.json', '__PORTFOLIO_DATA__', 'water_audit_portfolio.html'),
    ('electricity', 'seven_day_meter.html', 'electricity_payload.json', '__METER_DATA__', 'seven_day_meter.html'),
):
    template = (work / template_file).read_text(encoding='utf-8')
    model_data = json.loads((work / data_file).read_text(encoding='utf-8'))
    modules[name] = (template.replace('__APP_STYLES__', styles)
                    .replace(placeholder, json.dumps(model_data, ensure_ascii=False))
                    .replace('__PROPERTY_DOCUMENT__', checker_json))
    (outputs / output_file).write_text(modules[name], encoding='utf-8')

# Keep complete documents in separate frames, including their styles and scripts.
# Escaping opening brackets keeps embedded script tags inside the JSON payload.
module_data = json.dumps(modules, ensure_ascii=False).replace('<', '\\u003c')
template = (work / 'building_utilities_demo.html').read_text(encoding='utf-8')
(work.parent / 'demo.html').write_text(
    template.replace('__APP_STYLES__', styles).replace('__MODULE_DOCUMENTS__', module_data), encoding='utf-8'
)
