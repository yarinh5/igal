import assert from 'node:assert/strict';
import test from 'node:test';
import {POST} from '../app/api/inquiries/route';

test('unconfigured inquiries never report successful storage',async()=>{
  const response=await POST();
  assert.equal(response.status,503);
  assert.equal(response.headers.get('cache-control'),'no-store');
  const result=await response.json() as Record<string,unknown>;
  assert.equal(result.ok,false);
  assert.equal(typeof result.error,'string');
  assert.equal('reference' in result,false);
});
