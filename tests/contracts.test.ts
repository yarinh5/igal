import assert from 'node:assert/strict';
import test from 'node:test';
import { inquirySchema } from '../lib/inquiry';
import { initialScrollAction } from '../lib/navigation';

test('accepts a real contact request while trimming its fields', () => {
  const result = inquirySchema.safeParse({ requestId: '28e71235-e8e6-48b0-8867-721e026de25e', name: '  לקוח בדיקה  ', phone: '050-0000000', email: 'test@example.com', message: 'בקשה למידע', interest: 'אייל SEVEN7', website: '' });
  assert.equal(result.success, true);
  if (result.success) assert.equal(result.data.name, 'לקוח בדיקה');
});
test('rejects missing contact details, invalid email and oversized messages', () => {
  const base = {requestId: '28e71235-e8e6-48b0-8867-721e026de25e', name: 'בדיקה', phone: '0500000000', email: 'test@example.com', message: '', interest: '', website: ''};
  assert.equal(inquirySchema.safeParse({...base, phone:''}).success, false);
  assert.equal(inquirySchema.safeParse({...base,phone:'........'}).success,false);
  assert.equal(inquirySchema.safeParse({...base,phone:'1234567-'}).success,false);
  assert.equal(inquirySchema.safeParse({...base, email:'not-an-email'}).success, false);
  assert.equal(inquirySchema.safeParse({...base, message:'x'.repeat(3001)}).success, false);
  assert.equal(inquirySchema.safeParse({...base, name:' '}).success, false);
});
test('reload resets saved hash but fresh direct navigation preserves an anchor', () => {
  assert.deepEqual(initialScrollAction('reload', '#projects'), {reset:true, hash:''});
  assert.deepEqual(initialScrollAction('navigate', '#projects'), {reset:false, hash:'#projects'});
  assert.deepEqual(initialScrollAction('navigate', ''), {reset:true, hash:''});
  assert.deepEqual(initialScrollAction('back_forward', '#about'), {reset:false, hash:'#about'});
});
