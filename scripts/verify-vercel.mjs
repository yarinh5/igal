import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {projects} from '../lib/projects.ts';

const base=process.env.TEST_BASE_URL||'http://127.0.0.1:3000';
const pages=JSON.parse(await readFile('content/source-pages.json','utf8'));
const lotteries=JSON.parse(await readFile('content/lotteries.json','utf8'));
const routes=['/','/about','/projects','/commercial','/contact','/lotteries',...lotteries.map(l=>'/lotteries/'+l.id),...projects.map(p=>'/projects/'+p.slug)];
for(const path of routes){const response=await fetch(base+path);assert.equal(response.status,200,path)}
for(const page of pages){const path=new URL(page.url).pathname;assert.equal((await fetch(base+path)).status,200,`legacy ${path}`)}
assert.equal((await fetch(base+'/unknown-page-for-qa')).status,404);
for(const path of ['/compositions/opening/index.html','/compositions/opening/mobile/index.html','/compositions/opening/mobile/assets/assistant-hebrew.woff2','/media/yigal-opening-name-mobile.webp'])assert.equal((await fetch(base+path)).status,200,path);
const response=await fetch(base+'/api/inquiries',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});
assert.equal(response.status,503);
assert.equal((await response.json()).ok,false);
const contact=await (await fetch(base+'/contact')).text();
assert.ok(contact.includes('tel:*6489'));
assert.ok(contact.includes('mailto:'));
assert.ok(!contact.includes('<form'));
console.log(`PASS: ${routes.length+pages.length} routes, 404, opening assets, direct contact, disabled submission API.`);
