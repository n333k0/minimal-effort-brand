// Click-to-edit: click parts of the flyer, use the inspector, check the result.  node tools/dev/insptest.mjs outdir [base]
import { chromium } from 'playwright';
const [OUT, BASE = 'http://127.0.0.1:8790/'] = process.argv.slice(2);
const b = await chromium.launch({ channel: 'chrome' }); const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
const errs = []; p.on('pageerror', e => errs.push(e.message));
const log = (...a) => console.log(...a);
await p.goto(BASE + 'builder.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(1200);
const clickText = async t => { const r = await p.evaluate(t => { const e = [...document.querySelectorAll('#preview .lbx, #preview .pb')].find(e => e.textContent.trim() === t); const q = e.getBoundingClientRect(); return [q.x + q.width / 2, q.y + q.height / 2]; }, t); await p.mouse.click(r[0], r[1]); await p.waitForTimeout(500); };
const padOf = t => p.evaluate(t => { const e = [...document.querySelectorAll('#preview .lbx, #preview .pb')].find(e => e.textContent.trim() === t); return getComputedStyle(e).paddingLeft; }, t);
await clickText('JAMIIE');
log('inspector:', await p.evaluate(() => document.querySelector('#insp').innerText.replace(/\n+/g, ' | ')));
const p0 = await padOf('JAMIIE');
for (let i = 0; i < 3; i++) { await p.click('#insp [data-ik="pad"][data-d="1"]'); await p.waitForTimeout(700); }
log('artist padding', p0, '->', await padOf('JAMIIE'), 'other block', await padOf('613 Imperial Street'));
await p.screenshot({ path: OUT + '/insp_text.png' });
await p.click('#insp [data-ia="edit"]'); await p.waitForTimeout(600);
log('focused field', await p.evaluate(() => [document.activeElement.dataset.k, document.activeElement.value.slice(document.activeElement.selectionStart, document.activeElement.selectionEnd)]));
// logo
const lg = await p.evaluate(() => { const q = document.querySelector('#preview [data-lgi]').getBoundingClientRect(); return [q.x + q.width / 2, q.y + q.height / 2]; });
await p.mouse.click(lg[0], lg[1]); await p.waitForTimeout(500);
log('logo inspector:', await p.evaluate(() => document.querySelector('#insp').innerText.replace(/\n+/g, ' | ')));
await p.selectOption('#insp select[data-ia="swap"]', 'me-mark'); await p.waitForTimeout(700);
await p.click('#insp [data-ia="ladd"]'); await p.waitForTimeout(700);
log('logos now', await p.evaluate(() => location.hash && JSON.parse(decodeURIComponent(escape(atob(location.hash.slice(1))))).logos));
await p.screenshot({ path: OUT + '/insp_logo.png' });
// background
const pv = await p.evaluate(() => { const q = document.querySelector('#preview > div').getBoundingClientRect(); return [q.x + 30, q.y + q.height - 160]; });
await p.mouse.click(pv[0], pv[1]); await p.waitForTimeout(500);
log('bg inspector:', await p.evaluate(() => document.querySelector('#insp').innerText.replace(/\n+/g, ' | ')));
// poster
await p.evaluate(() => document.querySelector('#tpl [data-v="poster"]').click()); await p.waitForTimeout(1500);
const pbt = await p.evaluate(() => [...document.querySelectorAll('#preview .pb')].map(e => e.textContent.trim())[0]);
await clickText(pbt); log('poster inspector on', pbt, ':', await p.evaluate(() => document.querySelector('#insp').innerText.replace(/\n+/g, ' | ')));
const q0 = await padOf(pbt); await p.click('#insp [data-ik="pad"][data-d="1"]'); await p.waitForTimeout(800); log('poster pad', q0, '->', await padOf(pbt));
await p.screenshot({ path: OUT + '/insp_poster.png' });
log('errors', JSON.stringify(errs));
await b.close();
