import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {compileLocales} from '../scripts/compile-locales.mjs';

test('compiled locale bundle works without fetch and includes all six languages',()=>{
  const catalog=[{id:'a',en:'Welcome {name}',zh:'欢迎 {name}'}];
  const translations=Object.fromEntries(['ja','ko','fr','es'].map(locale=>[locale,{a:locale+' {name}'}]));
  const context=vm.createContext({});vm.runInContext(compileLocales(catalog,translations),context);
  assert.deepEqual(Object.keys(context.ELE_LOCALES).sort(),['en','es','fr','ja','ko','zh']);
  assert.equal(context.ELE_LOCALES.fr['Welcome {name}'],'fr {name}');
  assert.equal(context.ELE_LOCALES.zh['Welcome {name}'],'欢迎 {name}');
});
test('compiler rejects missing translations and changed named placeholders',()=>{
  const catalog=[{id:'a',en:'Welcome {name}',zh:'欢迎 {name}'}];
  const translations=Object.fromEntries(['ja','ko','fr','es'].map(locale=>[locale,{a:locale+' {name}'}]));
  assert.throws(()=>compileLocales(catalog,{...translations,ja:{}}),/ja.*a/);
  assert.throws(()=>compileLocales(catalog,{...translations,ko:{a:'이름'}}),/placeholder/i);
});
test('compiler rejects ambiguous English lookup keys and script content remains literal',()=>{
  const row={id:'a',en:'A </script> line',zh:'一行'};
  const translations=Object.fromEntries(['ja','ko','fr','es'].map(locale=>[locale,{a:locale+' </script>\u2028line'}]));
  assert.throws(()=>compileLocales([row,{...row,id:'b'}],translations),/duplicate/i);
  const compiled=compileLocales([row],translations);assert.ok(!compiled.includes('</script>'));
  const context=vm.createContext({});vm.runInContext(compiled,context);
  assert.equal(context.ELE_LOCALES.es[row.en],'es </script>\u2028line');
});
