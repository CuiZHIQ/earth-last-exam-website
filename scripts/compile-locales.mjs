import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export const localeCodes=['en','zh','ja','ko','fr','es'];
const placeholders=value=>[...value.matchAll(/\{([A-Za-z][A-Za-z0-9_]*)\}/g)].map(match=>match[1]).sort().join(',');

export function compileLocales(catalog,translations){
  if(!Array.isArray(catalog)||!catalog.length)throw new Error('Locale catalog must contain messages');
  const ids=new Set(),english=new Set();
  for(const row of catalog){
    if(!row||!['id','en','zh'].every(key=>typeof row[key]==='string'&&row[key].trim()))throw new Error('Locale catalog requires id, en and zh strings');
    if(ids.has(row.id)||english.has(row.en))throw new Error('Duplicate locale catalog id or English key: '+row.id);
    ids.add(row.id);english.add(row.en);
  }
  const bundle=Object.fromEntries(localeCodes.map(locale=>[locale,Object.fromEntries(catalog.map(row=>{
    const translated=locale==='en'?row.en:locale==='zh'?row.zh:translations[locale]?.[row.id];
    if(typeof translated!=='string'||!translated.trim())throw new Error('Missing translation '+locale+' '+row.id);
    if(placeholders(translated)!==placeholders(row.en))throw new Error('Translation placeholder mismatch: '+locale+' '+row.id);
    return [row.en,translated];
  }))]));
  const json=JSON.stringify(bundle).replaceAll('<','\\u003c').replaceAll('\u2028','\\u2028').replaceAll('\u2029','\\u2029');
  return '// Generated from the versioned locale catalog.\n(typeof window === "undefined" ? globalThis : window).ELE_LOCALES = '+json+';\n';
}

export async function writeLocales(sourceDirectory,outputFile){
  const catalog=JSON.parse(await fs.readFile(path.join(sourceDirectory,'catalog.json'),'utf8'));
  const translations=Object.fromEntries(await Promise.all(localeCodes.filter(locale=>!['en','zh'].includes(locale)).map(async locale=>[locale,JSON.parse(await fs.readFile(path.join(sourceDirectory,locale+'.json'),'utf8'))])));
  await fs.writeFile(outputFile,compileLocales(catalog,translations));
  return {messages:catalog.length,locales:localeCodes.length};
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
  await fs.mkdir(path.join(root,'dist'),{recursive:true});
  const result=await writeLocales(path.join(root,'src/locales'),path.join(root,'dist/locales.js'));
  console.log(`Compiled ${result.messages} messages in ${result.locales} languages.`);
}
