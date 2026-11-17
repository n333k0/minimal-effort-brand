import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chrome' }); const p = await b.newPage();
p.on('response', r => r.status() >= 400 && console.log('404', r.url()));
await p.goto('http://127.0.0.1:8790/render.html', { waitUntil: 'networkidle' });
console.log(await p.evaluate(async () => {
  const { render } = await import('./assets/js/templates.js'); const { hydrate } = await import('./assets/js/hydrate.js');
  document.body.innerHTML = render({ template: 'poster', layout: 'wall' }, { forExport: true });
  await hydrate(document.body, { animate: false });
  const e=[...document.querySelectorAll("[data-fit]")][2]; e.style.fontSize="100px"; return [e.outerHTML.slice(0,600), e.scrollHeight, e.clientHeight, [...e.querySelectorAll("*")].map(c=>{const r=c.getBoundingClientRect(); return c.tagName+c.className+" "+Math.round(r.top)+"-"+Math.round(r.bottom)}), JSON.stringify(e.getBoundingClientRect())];
}));
await b.close();
