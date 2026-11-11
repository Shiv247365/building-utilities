const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync('source/generated/water_audit_portfolio.html', 'utf8');
const elements = new Map();
const downloads = [];
const objects = new Map();
function element(id) {
  const defaults = {'budget':'10','study-budget':'1','study-metric':'precision'};
  return {
    id, value: defaults[id] ?? '', checked: false, textContent: '', children: [], handlers: {}, style: {}, attrs:{},
    append(child) { this.children.push(child); },
    replaceChildren() { this.children = []; },
    addEventListener(name, handler) { this.handlers[name] = handler; },
    setAttribute(name, value) { this.attrs[name] = value; },
    removeAttribute(name) { delete this.attrs[name]; },
    hasAttribute(name) { return name === 'srcdoc' ? this.srcdoc != null : name in this.attrs; },
    click() { if (id === 'a') downloads.push({name:this.download, blob:objects.get(this.href)}); },
  };
}
for (const [,id] of html.matchAll(/\bid="([\w-]+)"/g)) {
  assert(!elements.has(id), `Duplicate ID ${id}`);
  elements.set(id, element(id));
}
const get = id => { assert(elements.has(id), `Missing ID ${id}`); return elements.get(id); };
get('portfolio-data').textContent = html.match(/<script type="application\/json" id="portfolio-data">([^<]+)<\/script>/)[1];
get('property-document').textContent = html.match(/<script type="application\/json" id="property-document">([^<]+)<\/script>/)[1];
const payload = JSON.parse(get('portfolio-data').textContent);
const script = html.match(/<script>\s*([\s\S]*?)<\/script>/)[1];
const context = vm.createContext({
  document: {getElementById:get,createElement:element}, Blob, setTimeout:()=>0,
  URL: {createObjectURL(blob) { const id = `blob:${objects.size}`; objects.set(id,blob); return id; }},
});
vm.runInContext(script, context);
const run = expression => vm.runInContext(expression, context);
const json = expression => JSON.parse(run(`JSON.stringify(${expression})`));
const set = (id,value,event) => { get(id).value=value; get(id).handlers[event](); };
const hitCount = () => run('selected.size');

(async () => {
  assert.equal(run('records.length'),0);
  assert.equal(get('review-settings').disabled,true);
  assert.equal(get('export').disabled,true);
  assert.equal(get('water-empty').hidden,false);
  assert.equal(get('water-results').hidden,true);
  get('load-demo').handlers.click();
  assert.equal(get('review-settings').disabled,false);
  assert.equal(get('water-empty').hidden,true);
  assert.equal(get('water-results').hidden,false);
  assert.equal(run('records.length'),50);
  assert.equal(run('issues.length'),2);
  assert.equal(hitCount(),5);
  assert.equal(get('policy').value,'1');
  assert.equal(get('queue-table').children.length,5);
  assert.equal(get('pagination').hidden,true);
  assert.match(get('score-heading').textContent,/most above expected/);
  const firstRow = get('queue-table').children[0];
  assert.equal(firstRow.children.length,7);
  assert.equal(get('property-detail').hidden,false);
  firstRow.children[1].children[0].handlers.click();
  assert.equal(get('property-detail').hidden,true);
  firstRow.children[1].children[0].handlers.click();
  assert.equal(get('property-detail').hidden,false);
  assert(get('property-detail').children.some(child=>child.children[0]?.textContent==='All ranking scores'));
  assert.equal(get('quality-count').textContent,'(2)');
  get('shortlist').checked = false;
  get('shortlist').handlers.change();
  assert.equal(get('queue-table').children.length,15);
  assert.equal(get('pagination').hidden,false);
  const peerIds = json('[...selected]');
  set('policy','0','change');
  assert.match(get('score-heading').textContent,/highest use per square foot/);
  assert.equal(hitCount(),5);
  assert.notDeepEqual(json('[...selected]'),peerIds);
  set('budget','20','input');
  assert.equal(hitCount(),10);
  get('export').handlers.click();
  assert.equal(downloads[0].name,'water_audit_shortlist.csv');
  const output = await downloads[0].blob.text();
  assert.equal(output.split('\r\n').length,11);
  assert(output.includes(json('[...selected]')[0]));

  get('sample-csv').handlers.click();
  const sample = await downloads[1].blob.text();
  const file = {name:'sample.csv', size:sample.length, text:async()=>`\uFEFF${sample}`};
  get('csv-file').files = [file];
  await get('csv-file').handlers.change({target:get('csv-file')});
  assert.equal(run('records.length'),50);
  assert.equal(run('issues.length'),2);
  assert.match(get('source-name').textContent,/sample\.csv/);
  get('export-quality').handlers.click();
  assert.match(await downloads[2].blob.text(),/EXAMPLE-INCOMPLETE/);

  const customCSV = [
    'property_id,floor_area_ft2,occupancy_pct,annual_water_gal,complete_year,estimated_water,whole_property',
    '"A, ""North""",10000,75,500000,yes,no,yes',
    'DUP,10000,75,500000,yes,no,yes',
    'DUP,10000,75,600000,yes,no,yes',
    'BAD,10000,110,500000,yes,no,yes',
    'PARTIAL,10000,90,500000,yes,no,no',
    '=1+2,10000,90,600000,yes,no,yes',
  ].join('\r\n');
  context.customCSV = customCSV;
  run('loadRows(parseCSV(customCSV), "Verification portfolio")');
  assert.deepEqual(json('records.map(record=>record.id)'),['A, "North"','=1+2']);
  assert.equal(run('issues.length'),4);
  assert.equal(run('issues.filter(issue=>issue.reasons.includes("Duplicate property ID")).length'),2);
  set('budget','100','input');
  get('export').handlers.click();
  assert.match(await downloads[3].blob.text(),/"'=1\+2"/);
  const malformed = {name:'bad.csv',size:3,text:async()=> 'abc'};
  get('csv-file').files = [malformed];
  await get('csv-file').handlers.change({target:get('csv-file')});
  assert.match(get('upload-error').textContent,/required column/);
  assert.equal(run('records.length'),2);
  assert.match(get('water-status').textContent,/CSV loaded/);
  assert.match(get('source-name').textContent,/Verification portfolio/);

  const invalidCSV = 'property_id,floor_area_ft2,occupancy_pct,annual_water_gal,complete_year,estimated_water,whole_property\nBAD,0,85,500000,yes,no,yes';
  context.invalidCSV = invalidCSV;
  run('loadRows(parseCSV(invalidCSV), "All-invalid portfolio")');
  assert.equal(get('review-settings').disabled,true);
  assert.equal(get('export').disabled,true);
  assert.equal(get('water-results').hidden,true);
  assert.equal(get('water-empty').hidden,false);
  assert.equal(get('quality-panel').open,true);
  get('mode-property').handlers.click();
  assert.equal(get('portfolio-mode').hidden,true);
  assert.equal(get('property-mode').hidden,false);
  const propertyDocument = get('property-frame').srcdoc;
  assert(propertyDocument.includes('id="water-form"'));
  get('mode-portfolio').handlers.click();
  assert.equal(get('portfolio-mode').hidden,false);
  get('mode-property').handlers.click();
  assert.equal(get('property-frame').srcdoc,propertyDocument);

  assert.equal(payload.results[1][0].hits,133);
  assert.equal(payload.results[1][1].hits,153);
  assert.equal(get('study-chart').children.length,4);
  assert.equal(get('study-chart').children[1].children[2].textContent,'82.7%');
  set('study-metric','volumeCapture','change');
  assert.equal(get('study-chart').children[1].children[2].textContent,'91.9%');
  const notebook = JSON.parse(fs.readFileSync('notebooks/water_audit_priority_study.ipynb','utf8'));
  const executed = notebook.cells.filter(cell=>cell.cell_type==='code');
  assert.equal(executed.length,7);
  assert(executed.every(cell=>cell.execution_count && cell.outputs.length===1));
  assert(!html.includes('__PORTFOLIO_DATA__'));
  console.log('Passed fixed-budget ranking, CSV round trip, quoting, duplicate and quality routing, shortlist and quality exports, and study chart checks.');
})().catch(error=>{console.error(error); process.exitCode=1;});
