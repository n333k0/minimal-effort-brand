import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chrome' }); const p = await b.newPage();
await p.goto('http://127.0.0.1:8790/render.html', { waitUntil: 'networkidle' });
console.log(await p.evaluate(async () => {
  const { render } = await import('./assets/js/templates.js'); const { hydrate } = await import('./assets/js/hydrate.js');
  document.body.innerHTML = render({ template: 'poster', layout: 'bands', anim: 'drift' }, { forExport: true });
  await hydrate(document.body, { animate: false });
  document.getAnimations().forEach(a => { a.pause(); a.currentTime = 4000; });
  const e = document.querySelector('.pb'); const cs = getComputedStyle(e); const bx = document.querySelector('.bx');
  return [cs.opacity, cs.transform, cs.animationName, bx.style.fontSize, JSON.stringify(e.getBoundingClientRect()), getComputedStyle(bx).opacity];
}));
await b.close();
