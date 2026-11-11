const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync('source/generated/water_property_check.html', 'utf8');
const elements = new Map();
function makeElement(id) {
  return {
    id,
    value: id === 'units' ? 'us' : '',
    textContent: '',
    get valueAsNumber() { return this.value === '' ? NaN : Number(this.value); },
    hidden: false,
    children: [],
    handlers: {},
    attrs: {},
    classList: { add() {}, toggle() {} },
    addEventListener(name, handler) { this.handlers[name] = handler; },
    append(child) { this.children.push(child); },
    insertRow() { const row = makeElement('row'); this.append(row); return row; },
    insertCell() { const cell = makeElement('cell'); this.append(cell); return cell; },
    setAttribute(name, value) { this.attrs[name] = value; },
  };
}
for (const match of html.matchAll(/\bid="([\w-]+)"/g)) {
  assert(!elements.has(match[1]), `Duplicate id ${match[1]}`);
  elements.set(match[1], makeElement(match[1]));
}
const get = id => { assert(elements.has(id), `Missing id ${id}`); return elements.get(id); };
get('study-data').textContent = html.match(/<script id="study-data" type="application\/json">([^<]+)<\/script>/)[1];
const script = html.match(/<script>\s*([\s\S]*?)<\/script>/)[1];
vm.runInNewContext(script, { document: { getElementById: get, createElement: makeElement } });

const samples = get('samples').children;
assert.equal(samples.length, 3);
samples[0].handlers.click();
assert.equal(get('status').textContent, 'Within comparison band');
samples[1].handlers.click();
assert.equal(get('status').textContent, 'Priority review');
assert.equal(get('result').hidden, false);
const usRatio = get('ratio').textContent;
const originalVolume = Number(get('volume').value);
get('units').value = 'metric';
get('units').handlers.change();
assert.equal(get('intensity-units').textContent, 'Litres per m² per year');
assert.equal(get('ratio').textContent, usRatio);
assert(Math.abs(Number(get('volume').value) - originalVolume * 0.003785411784) < 0.0001);
samples[2].handlers.click();
assert.equal(get('status').textContent, 'Below comparison band');

const form = get('water-form');
const submit = () => form.handlers.submit({ preventDefault() {} });
get('complete').checked = false;
submit();
assert.match(get('input-error').textContent, /Confirm the annual reading/);
assert.equal(get('result').hidden, true);
get('complete').checked = true;
get('occupancy').value = '101';
submit();
assert.match(get('input-error').textContent, /at most 100%/);
get('occupancy').value = '85';
submit();
assert.equal(get('input-error').textContent, '');
assert.equal(get('result').hidden, false);
assert(Number.isFinite(get('observed-mark').attrs.cx));
assert.equal(get('evaluation-table').children.length, 3);
assert.match(get('evaluation-scope').textContent, /2,394 properties across 2,160 groups/);
assert.match(get('calibration').textContent, /78.9%.*11.4%/);

const study = JSON.parse(fs.readFileSync('notebooks/water_audit_study.ipynb', 'utf8'));
assert.deepEqual(study.cells.filter(cell => cell.cell_type === 'code').map(cell => cell.execution_count), [1, 2, 3, 4, 5]);
assert(study.cells.filter(cell => cell.cell_type === 'code').every(cell => cell.outputs.length === 1));
assert.equal((html.match(/__STUDY_JSON__/g) || []).length, 0);
console.log('Passed three bundled cases, unit conversion, input validation, plotting coordinates, results table, and notebook output checks.');
