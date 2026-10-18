import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { expectedFiles, pages } from './public-assets.mjs';
import { localeCodes } from './compile-locales.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../dist');
const files=await fs.readdir(root,{recursive:true});
assert.deepEqual(files.map(f=>f.replaceAll('\\','/')).sort(),[...expectedFiles].sort(),'Only the declared public assets may be published');
const localeContext=vm.createContext({});
vm.runInContext(await fs.readFile(path.join(root,'locales.js'),'utf8'),localeContext);
const localeBundle=localeContext.ELE_LOCALES;
assert.deepEqual(Object.keys(localeBundle).sort(),[...localeCodes].sort(),'All six language dictionaries are bundled');
const decodeHTML=value=>value.replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos);/gi,(match,entity)=>entity[0]==='#'?String.fromCodePoint(entity[1].toLowerCase()==='x'?parseInt(entity.slice(2),16):parseInt(entity.slice(1),10)):({amp:'&',lt:'<',gt:'>',quot:'"',apos:"'"}[entity]??match));
let checked=0;
for(const file of files.filter(f=>f.endsWith('.html'))){
 const html=await fs.readFile(path.join(root,file),'utf8');
 assert.equal((html.match(/<h1\b/g)||[]).length,1,file+': exactly one main heading');
 assert.ok(html.includes('data-language'),file+': language control');
 const select=html.match(/<select\b[^>]*\bdata-language\b[^>]*>([\s\S]*?)<\/select>/);
 assert.ok(select,file+': native language select');
 assert.deepEqual([...select[1].matchAll(/<option\b[^>]*\bvalue="([^"]+)"/g)].map(match=>match[1]).sort(),[...localeCodes].sort(),file+': six language choices');
 const scripts=[...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)].map(match=>match[1]);
 assert.ok(scripts.indexOf('locales.js')>=0&&scripts.indexOf('locales.js')<scripts.indexOf('i18n.js')&&scripts.indexOf('i18n.js')<scripts.indexOf('app.js'),file+': translations load before the runtime and page code');
 if(scripts.includes('community.js'))assert.ok(scripts.indexOf('i18n.js')<scripts.indexOf('community.js'),file+': community uses the selected language on first render');
 for(const match of html.matchAll(/\bdata-(?:(?:placeholder|aria|alt)-)?en="([^"]+)"/g)){
  const key=decodeHTML(match[1]);
  for(const locale of localeCodes)assert.ok(Object.hasOwn(localeBundle[locale],key),file+': '+locale+' translation for '+key);
 }
 assert.ok(!html.includes('advisor-shortlist'),file+': no private outreach link');
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(ids.length,new Set(ids).size,file+': unique IDs');
 for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  const href=match[1];if(/^(https?:|mailto:|data:)/.test(href))continue;
  const parsed=new URL(href,'http://local/'+file);
  const pagesUrl=new URL(href,'https://example.github.io/earth-last-exam/'+file);
  assert.ok(pagesUrl.pathname.startsWith('/earth-last-exam/'),file+': links work under a GitHub Pages project path');
  const dest=path.resolve(root,'.'+parsed.pathname);
  assert.ok(dest.startsWith(root+path.sep),'Internal link remains in dist');
  await fs.access(dest);
  if(parsed.hash&&dest.endsWith('.html')){
   const target=await fs.readFile(dest,'utf8');
   assert.ok(target.includes('id="'+decodeURIComponent(parsed.hash.slice(1))+'"'),file+': valid anchor '+href);
  }
  checked++;
 }
 assert.ok(html.includes('data-en=')&&html.includes('data-zh='),file+': canonical English and Chinese content');
}
assert.ok(!files.some(x=>/outreach|advisor-shortlist|reference-sites|email-drafts/.test(x)),'No internal documents in public output');
const publicText=(await Promise.all(files.filter(f=>f.endsWith('.html')).map(f=>fs.readFile(path.join(root,f),'utf8')))).join('');
assert.ok(!/低于 30%|below 30%|60 tasks|60 道/.test(publicText),'No internal scale/target in website copy');
assert.ok(!/id="related"|Related work|相关工作/.test(publicText),'Public website focuses on ELE, without Related Work sections');
assert.equal(files.filter(f=>f.endsWith('.html')).length,pages.length,'All declared public pages');
console.log('PASS: 4 pages, '+checked+' local references, unique headings/IDs, six-language coverage, private/public separation.');
