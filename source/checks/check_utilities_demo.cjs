const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync('demo.html', 'utf8');
const payload = html.match(/<script id="module-documents" type="application\/json">([^<]+)<\/script>/)[1];
const source = JSON.parse(payload);
const embeddedFiles = {water: 'water_audit_portfolio.html', electricity: 'seven_day_meter.html'};
for (const [name, file] of Object.entries(embeddedFiles)) {
  assert.equal(source[name], fs.readFileSync(`source/generated/${file}`, 'utf8').replace(/\r\n/g, '\n'));
  assert.equal((html.match(new RegExp(`href="#${name}"`, 'g')) || []).length, 2);
}

const elements = new Map();
let focused;
for (const [, tag, id, rest] of html.matchAll(/<(\w+)[^<>]*\bid="([\w-]+)"([^<>]*)>/g)) {
  const attributes = new Map();
  const callbacks = {};
  const element = {
    title: rest.match(/title="([^"]+)"/)?.[1], hidden: rest.includes('hidden'), style: {}, callbacks,
    setAttribute(name, value) { attributes.set(name, value); },
    getAttribute(name) { return attributes.get(name); },
    hasAttribute(name) { return attributes.has(name); },
    removeAttribute(name) { attributes.delete(name); },
    focus() { focused = id; },
    addEventListener(event, callback) { callbacks[event] = callback; },
  };
  if (tag === 'iframe') {
    const content = {getBoundingClientRect: () => ({height: 575.4})};
    const sourceLink = {};
    element.contentDocument = {querySelector: () => content, querySelectorAll: () => [sourceLink]};
    element.sourceLink = sourceLink;
    element.loads = 0;
    Object.defineProperty(element, 'srcdoc', {set(value) {
      attributes.set('srcdoc', value);
      element.loads++;
      callbacks.load();
    }});
  }
  elements.set(id, element);
}

const element = id => elements.get(id);
element('module-documents').textContent = payload;
const location = {hash: ''};
const browserEvents = {};
vm.runInNewContext(html.match(/<script>\s*([\s\S]*?)<\/script>/)[1], {
  document: {getElementById: id => element(id) ?? null},
  window: {location, addEventListener(event, callback) { browserEvents[event] = callback; }, scrollTo() {}},
  ResizeObserver: class { observe() {} },
});

function go(hash) {
  location.hash = hash;
  browserEvents.hashchange();
}
function checkView(name) {
  for (const key of ['home', 'water', 'electricity']) {
    assert.equal(element(`view-${key}`).hidden, key !== name);
    assert.equal(element(`nav-${key}`).getAttribute('aria-current'), key === name ? 'page' : undefined);
  }
}

checkView('home');
assert.equal(element('frame-water').loads, 0);
assert.equal(element('frame-electricity').loads, 0);
go('#water');
checkView('water');
assert.equal(focused, 'view-water');
assert.equal(element('frame-water').style.height, '576px');
assert.equal(element('frame-water').sourceLink.target, '_blank');
go('#electricity');
checkView('electricity');
assert.equal(focused, 'view-electricity');
go('#water');
checkView('water');
assert.equal(element('frame-water').loads, 1);
assert.equal(element('frame-electricity').loads, 1);
go('#home');
checkView('home');
console.log('Verified both embedded demo documents, Home and module switching, and no reload when returning to an open module.');
