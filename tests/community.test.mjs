import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
const context=vm.createContext({URL});
vm.runInContext(fs.readFileSync(new URL('../src/community.js',import.meta.url),'utf8'),context);
const api=context.ELE_COMMUNITY_UI;

test('an unconfirmed roster shows three honest invitation cards',()=>{
  const items=api.entries();
  assert.equal(items.length,3);
  assert.ok(items.every(item=>item.empty&&!item.name));
  assert.deepEqual(Array.from(items,x=>x.group.key),['institutions','advisors','contributors']);
});
test('a populated roster retains all people without inventing institutions',()=>{
  const items=api.entries({advisors:[{name:{en:'Example researcher',zh:'示例研究者'},detail:{en:'Sample affiliation'},url:'https://example.org/profile'}]});
  assert.equal(items[0].empty,true);
  assert.equal(items[1].name.zh,'示例研究者');
  assert.equal(items[1].detail.zh,'Sample affiliation');
  assert.equal(items[1].url,'https://example.org/profile');
  assert.equal(items[2].empty,true);
});
test('invalid roster content fails closed while name text stays literal',()=>{
  const entries=api.entries({institutions:[null,{},false,{name:' <img src=x onerror=alert(1)> ',url:'javascript:alert(1)',image:'../private.png'}],advisors:'invalid'});
  assert.equal(entries[0].name.en,'<img src=x onerror=alert(1)>');
  assert.equal(entries[0].url,'');assert.equal(entries[0].image,'');
  assert.equal(entries[1].empty,true);
});
test('only HTTPS profiles and bounded local images are accepted',()=>{
  for(const value of ['javascript:alert(1)','data:text/html,hi','http://example.org','//example.org','https://user:password@example.org'])assert.equal(api.safeURL(value),'');
  for(const value of ['https://example.org/a.jpg','images/../private.jpg','images/a.svg?x=1','images/a".png'])assert.equal(api.safeURL(value,true),'');
  assert.equal(api.safeURL('images/people/person-1.webp',true),'images/people/person-1.webp');
});
test('scroll controls respect start, end, resize and subpixel rounding',()=>{
  assert.equal(api.scrollState(0,800,1300).previous,false);
  assert.equal(api.scrollState(0,800,1300).next,true);
  assert.equal(api.scrollState(499.6,800,1300).next,false);
  assert.equal(api.scrollState(0,1300,1300).next,false);
  assert.equal(api.scrollState(-1,800,1300).previous,false);
});
