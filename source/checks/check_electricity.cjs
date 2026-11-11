const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync('source/generated/seven_day_meter.html', 'utf8');
const reference = JSON.parse(fs.readFileSync('source/electricity_reference.json', 'utf8'));
const elements = new Map();
const downloads = [];
function makeElement(id) {
  return {
    id, value:'', textContent:'', children:[], style:{}, attrs:{}, events:{},
    get lastElementChild() { return this.children.at(-1); },
    append(child) { this.children.push(child); },
    prepend(child) { this.children.unshift(child); },
    replaceChildren() { this.children = []; },
    setAttribute(key,value) { this.attrs[key] = value; },
    removeAttribute(key) { delete this.attrs[key]; },
    addEventListener(key,callback) { this.events[key] = callback; },
    click() { downloads.push(this.download); },
  };
}
for (const [tag,id] of html.matchAll(/<[^>]*\bid="([\w-]+)"[^>]*>/g)) {
  assert(!elements.has(id), `Duplicate ID ${id}`);
  const item = makeElement(id);
  item.open = /\sopen(?:\s|>)/.test(tag);
  elements.set(id, item);
}
const element = id => { assert(elements.has(id), `Missing ID ${id}`); return elements.get(id); };
element('meter-data').textContent = html.match(/<script id="meter-data" type="application\/json">([^<]+)<\/script>/)[1];
const payload = JSON.parse(element('meter-data').textContent);
let downloadedBlob;
const context = vm.createContext({
  document:{getElementById:element,createElement:makeElement,createElementNS:(_,name)=>makeElement(name)},
  Blob, setTimeout:()=>0, URL:{createObjectURL(blob){downloadedBlob=blob;return 'blob:meter';}},
});
vm.runInContext(html.match(/<script>\s*([\s\S]*?)<\/script>/)[1], context);
const run = expression => vm.runInContext(expression, context);

(async()=>{
  assert.equal(payload.testBuildings,118);
  assert.equal(payload.testDays,37808);
  assert.equal(run('activeCase'),null);
  assert.equal(element('meter-step-input').attrs['aria-current'],'step');
  element('load-sample').events.click();
  assert.equal(element('forecast').disabled,false);
  assert.equal(element('meter-step-generate').attrs['aria-current'],'step');
  assert.equal(element('reveal').disabled,true);
  assert.equal(element('reveal').hidden,true);
  for (const [index,item] of payload.cases.entries()) {
    element('method-comparison').open = true;
    element('example').value=String(index);
    element('example').events.change();
    element('forecast').events.click();
    assert.equal(element('forecast-output').hidden,false);
    assert.match(element('forecast-total').textContent,/kWh/);
    assert.match(element('peak-window').textContent,/\d\d:00/);
    assert.equal(element('meter-empty').hidden,true);
    assert.equal(element('meter-step-review').attrs['aria-current'],'step');
    assert.equal(element('actual-note').hidden,true);
    assert.equal(element('legend').children.length,3);
    const predictions = JSON.parse(run('JSON.stringify(predictions)'));
    assert.deepEqual(predictions[0],item.history.slice(-24));
    assert.deepEqual(predictions[1],item.history.slice(0,24));
    for (let hour=0;hour<24;hour++) {
      assert(Math.abs(predictions[2][hour]-reference[index][hour])<1e-8, `Case ${index}, hour ${hour}`);
    }
    element('reveal').events.click();
    assert.match(element('actual-note').textContent,/Largest error.*Measured day total/);
    assert.equal(element('actual-note').hidden,false);
    assert.equal(element('legend').children.length,4);
    const comparison = element('method-comparison');
    comparison.open = true;
    comparison.events.toggle();
    assert.equal(element('legend').children.length,4);
    comparison.open = false;
    comparison.events.toggle();
  }
  element('example-csv').events.click();
  assert.equal(downloads.at(-1),'seven_day_meter_example.csv');
  const sample = await downloadedBlob.text();
  const selectFile = async(name, contents) => {
    const input=element('meter-file');
    input.files=[{name,size:contents.length,text:async()=>contents}];
    await input.events.change({target:input});
  };
  await selectFile('my-meter.csv',sample);
  assert.match(element('input-summary').textContent,/my-meter\.csv/);
  element('forecast').events.click();
  assert.equal(element('reveal').disabled,true);
  assert.equal(element('reveal').hidden,true);
  assert.equal(element('legend').children.length,1);
  const rows=sample.split('\r\n');
  await selectFile('missing.csv',rows.filter((_,index)=>index!==2).join('\r\n'));
  assert.match(element('upload-error').textContent,/168 hourly readings/);
  rows[2]=rows[1];
  await selectFile('duplicate.csv',rows.join('\r\n'));
  assert.match(element('upload-error').textContent,/consecutive hourly sequence/);
  assert.match(element('input-summary').textContent,/my-meter\.csv/);
  assert.equal(element('evaluation-table').children.length,3);
  const notebook = JSON.parse(fs.readFileSync('notebooks/seven_day_meter_study.ipynb','utf8'));
  assert(notebook.cells.filter(cell=>cell.cell_type==='code').every(cell=>cell.execution_count && cell.outputs.length===1));
  console.log('Verified forecast parity across four cases, chart and reveal states, sample CSV round trip, and upload rejection for missing and duplicate hours.');
})().catch(error=>{console.error(error);process.exitCode=1;});
