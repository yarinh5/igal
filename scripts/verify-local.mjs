import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
const base='http://127.0.0.1:5173';
const pages=JSON.parse(await readFile('content/source-pages.json','utf8'));
const lotteries=JSON.parse(await readFile('content/lotteries.json','utf8'));
const routes=['/','/about','/projects','/commercial','/contact','/lotteries',...lotteries.map(l=>'/lotteries/'+l.id),...['eyal-seven','mol-yarden','nof-zemer','nofim-a','nofim-b','nof-hayarden','eilon','ariel','c1-afula'].map(s=>'/projects/'+s)];
const results=[];
for(const path of routes){const response=await fetch(base+path);assert.equal(response.status,200,path);results.push({path,status:response.status});}
for(const p of pages){const path=new URL(p.url).pathname;const response=await fetch(base+path);assert.equal(response.status,200,`legacy ${path}`);results.push({legacy:path,destination:new URL(response.url).pathname,status:response.status});}
assert.equal((await fetch(base+'/unknown-page-for-qa')).status,404);
const data={requestId:randomUUID(),name:'API local QA',phone:'0500000000',email:'api-qa@example.com',interest:'QA',message:'Local test only',website:''};
const send=(body,headers={})=>fetch(base+'/api/inquiries',{method:'POST',headers:{'Content-Type':'application/json',...headers},body:typeof body==='string'?body:JSON.stringify(body)});
assert.equal((await send(data)).status,201,'valid stored request');
assert.equal((await send(data)).status,201,'identical retry');
assert.equal((await send({...data,message:'Changed payload'})).status,409,'conflicting retry');
assert.equal((await send({...data,requestId:randomUUID(),phone:'........'})).status,422,'invalid phone');
assert.equal((await send({...data,website:'bot.example'})).status,422,'honeypot');
assert.equal((await send(data,{Origin:'https://unrelated.example'})).status,403,'cross origin');
assert.equal((await send('{')).status,400,'malformed JSON');
assert.equal((await send('x'.repeat(14001))).status,413,'oversized body');
assert.equal((await send(data,{'Content-Type':'text/plain'})).status,415,'incorrect type');
await writeFile('docs/http-checks.json',JSON.stringify({checkedAt:new Date().toISOString(),routes:results,api:['valid insert','identical retry','conflicting retry','phone validation','honeypot','origin','JSON','body limit','content type'],scope:'Local preview only'},null,2));
console.log(`PASS: ${results.length} current/legacy routes, 404, 9 real API paths.`);
