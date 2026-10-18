import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { publicFiles, assetGroups, pages } from './public-assets.mjs';
import { writeLocales } from './compile-locales.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const src=path.join(root,'src'), dist=path.join(root,'dist');
await fs.mkdir(dist,{recursive:true});
// Retire exact, formerly public assets when rebuilding an existing preview.
for(const retired of ['earth-section.svg','typhoon-study.svg','downloads/typhoon-task.md',
  'downloads/task-proposal-template.md','downloads/earth-last-exam-source.zip']) {
  await fs.rm(path.join(dist,retired),{force:true});
}
// Remove the retired, now-empty download folder without touching source archives.
await fs.rmdir(path.join(dist,'downloads')).catch(error=>{if(error.code!=='ENOENT')throw error;});
for(const file of publicFiles)await fs.copyFile(path.join(src,file),path.join(dist,file));
await writeLocales(path.join(src,'locales'),path.join(dist,'locales.js'));
for(const [folder, files] of Object.entries(assetGroups)){
  await fs.mkdir(path.join(dist,folder),{recursive:true});
  for(const file of files)await fs.copyFile(path.join(src,folder,file),path.join(dist,folder,file));
}
const repository=process.env.ELE_REPOSITORY||process.env.GITHUB_REPOSITORY||'';
if(repository){
  if(!/^[A-Za-z0-9][A-Za-z0-9_.-]*\/[A-Za-z0-9][A-Za-z0-9_.-]*$/.test(repository))throw new Error('Invalid owner/repository');
  await fs.appendFile(path.join(dist,'config.js'),'\nwindow.ELE_CONFIG.repository = '+JSON.stringify(repository)+';\n');
}
await fs.writeFile(path.join(dist,'.nojekyll'),'');
console.log('Built '+pages.length+' pages and public assets into dist/. Repository: '+(repository||'local preview'));
