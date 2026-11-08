import test from 'node:test';
import assert from 'node:assert/strict';
import {architecturePose,heroMode} from '../lib/hero-motion';

test('portrait mobile gets a short 3D story; short landscape and reduced motion remain natural',()=>{
 assert.equal(heroMode(390,844,false),'portrait');
 assert.equal(heroMode(1440,900,false),'desktop');
 assert.equal(heroMode(844,390,false),'static');
 assert.equal(heroMode(1440,640,false),'static');
 assert.equal(heroMode(768,649,false),'static');
 assert.equal(heroMode(390,667,false),'portrait');
 assert.equal(heroMode(390,844,true),'static');
});
test('camera path is seekable and ends with an assembled building',()=>{
 const middle=architecturePose(.52,false);
 architecturePose(.98,false);
 assert.deepEqual(architecturePose(.52,false),middle);
 assert.equal(architecturePose(1,false).explosion,0);
 assert.ok(architecturePose(.15,false).explosion>0.5);
 for(const mobile of [false,true]) for(let i=0;i<=100;i++){
  const pose=architecturePose(i/100,mobile);
  for(const n of Object.values(pose)) assert.ok(Number.isFinite(n));
  assert.ok(pose.distance>0);
 }
 assert.deepEqual(architecturePose(-1,false),architecturePose(0,false));
 assert.deepEqual(architecturePose(2,true),architecturePose(1,true));
});
