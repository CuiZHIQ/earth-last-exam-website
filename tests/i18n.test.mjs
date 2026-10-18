import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source=name=>fs.readFileSync(new URL('../src/'+name,import.meta.url),'utf8');
class Element {
  constructor(tag='div',attrs={}) {this.tagName=tag.toUpperCase();this.attrs={...attrs};this.dataset={};this.listeners={};this.value='';this.textContent='';this.hidden=false;this.validity={customError:false};this.maxLength=-1;for(const [key,value] of Object.entries(attrs))if(key.startsWith('data-'))this.dataset[key.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=value;}
  getAttribute(name){if(name.startsWith('data-'))return this.dataset[name.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]??null;return this.attrs[name]??null;}
  setAttribute(name,value){this.attrs[name]=String(value);}
  removeAttribute(name){delete this.attrs[name];}
  addEventListener(type,fn){(this.listeners[type]??=[]).push(fn);}
  dispatchEvent(event){for(const fn of this.listeners[event.type]??[])fn(event);return true;}
  emit(type,extra={}){return this.dispatchEvent({type,target:this,preventDefault(){},...extra});}
  setCustomValidity(message){this.validationMessage=message;this.validity.customError=!!message;}
  focus(){this.focused=true;}
}
function mount({stored='en',search='',form=false,bundle=true}={}){
  const nodes={heading:new Element('h1',{'data-en':'Research','data-zh':'研究'}),title:new Element('meta',{'name':'ele-title','data-en':'Research title','data-zh':'研究标题'}),description:new Element('meta',{'name':'description','data-en':'Research description','data-zh':'研究说明'}),input:new Element('input',{'data-placeholder-en':'Question','data-placeholder-zh':'问题'}),image:new Element('img',{'data-alt-en':'Observed storm','data-alt-zh':'台风观测'}),nav:new Element('nav',{'data-aria-en':'Main navigation','data-aria-zh':'主导航'}),language:new Element('select',{'data-language':''})};
  if(form){
    for(const id of ['proposal-form','form-status','draft-preview','draft-content','continue-submit','clear-draft','draft-storage-note','proposal-heading','proposal-intro','question-label','question-hint','submit-label','submission-note','email-note','continue-label','download-draft','copy-draft','proposal-fields'])nodes[id]=new Element();
    const controls=['route','question','email','name'].map(name=>Object.assign(new Element('input'),{name}));
    controls.namedItem=name=>controls.find(control=>control.name===name);
    controls.namedItem('route').value='idea';
    controls.namedItem('question').dataset={placeholderEn:'Question',placeholderZh:'问题'};
    nodes['proposal-form'].elements=controls;
    nodes['proposal-form'].reportValidity=()=>!controls.some(control=>control.validity.customError);
    nodes['proposal-form'].reset=()=>controls.forEach(control=>control.value='');
    nodes['draft-preview'].hidden=true;
  }
  const doc=new Element();doc.documentElement={lang:'en'};
  doc.getElementById=id=>nodes[id]??null;
  doc.querySelector=selector=>selector==='meta[name="ele-title"]'?nodes.title:selector==='[data-language]'?nodes.language:null;
  doc.querySelectorAll=selector=>selector==='[role="tab"]'?[]:Object.values(nodes).filter(node=>{
    const attrs=[...selector.matchAll(/\[([^=\]]+)(?:="([^"]*)")?\]/g)];
    return attrs.length&&attrs.every(([,key,value])=>node.getAttribute(key)!==null&&(value===undefined||node.getAttribute(key)===value));
  });
  const storage=new Map([['ele-language',stored]]),session=new Map();
  const localStorage={getItem:key=>storage.get(key),setItem:(key,value)=>storage.set(key,value)};
  const sessionStorage={getItem:key=>session.get(key),setItem:(key,value)=>session.set(key,value),removeItem:key=>session.delete(key)};
  const messages=['Research','Research title','Research description','Question','Observed storm','Main navigation'];
  const extras=JSON.parse(fs.readFileSync(new URL('../src/locales/catalog.json',import.meta.url)));
  const translations=Object.fromEntries(['ja','ko','fr','es'].map(locale=>[locale,Object.fromEntries([...messages,...extras.map(row=>row.en)].map(en=>[en,`${locale}:${en}`]))]));
  const window={location:{search},localStorage,sessionStorage,addEventListener(){},open(){}};
  if(bundle)window.ELE_LOCALES=translations;
  const context=vm.createContext({window,document:doc,localStorage,sessionStorage,location:window.location,URL,URLSearchParams,Event,FormData:class{constructor(f){return f.elements.map(control=>[control.name,control.value]);}},setTimeout,Blob,navigator:{clipboard:{writeText:async()=>{}}}});
  vm.runInContext(source('i18n.js'),context);
  if(form){vm.runInContext(source('proposal.js'),context);vm.runInContext(source('app.js'),context);}
  return {nodes,doc,window,storage,context};
}

test('all six locales update language, metadata, labels, accessibility and selection',()=>{
  const {nodes,doc,window,storage}=mount();
  for(const locale of ['en','zh','ja','ko','fr','es']){
    nodes.language.value=locale;nodes.language.emit('change');
    assert.equal(doc.documentElement.lang,locale==='zh'?'zh-CN':locale);
    const prefix=['en','zh'].includes(locale)?'':locale+':';
    assert.equal(nodes.heading.textContent,locale==='zh'?'研究':prefix+'Research');
    assert.equal(doc.title,locale==='zh'?'研究标题':prefix+'Research title');
    assert.equal(nodes.description.getAttribute('content'),locale==='zh'?'研究说明':prefix+'Research description');
    assert.equal(nodes.input.placeholder,locale==='zh'?'问题':prefix+'Question');
    assert.equal(nodes.image.getAttribute('alt'),locale==='zh'?'台风观测':prefix+'Observed storm');
    assert.equal(nodes.nav.getAttribute('aria-label'),locale==='zh'?'主导航':prefix+'Main navigation');
    assert.equal(storage.get('ele-language'),locale);assert.equal(window.ELE_I18N.getLocale(),locale);
  }
});
test('query language overrides persisted selection and legacy Chinese still restores',()=>{
  assert.equal(mount({stored:'zh'}).doc.documentElement.lang,'zh-CN');
  const state=mount({stored:'zh',search:'?route=advisor&lang=fr'});
  assert.equal(state.doc.documentElement.lang,'fr');assert.equal(state.nodes.language.value,'fr');
  assert.equal(mount({stored:'es',search:'?lang=unsupported'}).doc.documentElement.lang,'es');
});
test('translation fallback and named interpolation preserve literal user values',()=>{
  const {window}=mount({stored:'ja'});
  assert.equal(window.ELE_I18N.t('Missing','缺失'),'Missing');
  assert.equal(window.ELE_I18N.t('Review the draft in your mail app, then send it to {email}.','邮件：{email}',{email:'a+$&@example.org'}),'ja:Review the draft in your mail app, then send it to a+$&@example.org.');
  const withoutBundle=mount({stored:'zh',bundle:false});assert.equal(withoutBundle.nodes.heading.textContent,'研究');
});
test('locale switch keeps form values and generated draft while refreshing labels and status',()=>{
  const {nodes,window}=mount({form:true});const form=nodes['proposal-form'];
  form.elements.namedItem('question').value='Keep my science 日本語 <literal>';
  form.emit('submit');const draft=nodes['draft-content'].value;
  assert.equal(nodes['draft-preview'].hidden,false);
  for(const locale of ['ja','ko','fr','es','zh','en']){
    window.ELE_I18N.setLanguage(locale);
    assert.equal(form.elements.namedItem('question').value,'Keep my science 日本語 <literal>');
    assert.equal(nodes['draft-content'].value,draft);assert.equal(nodes['draft-preview'].hidden,false);
    if(!['en','zh'].includes(locale)){
      assert.equal(nodes['proposal-heading'].textContent,locale+':Recommend a research question');
      assert.equal(nodes['form-status'].textContent,locale+':Your contribution is ready to copy or save. Nothing has been sent.');
    }
  }
});
test('advisor route and validation error follow current locale without erasing input',()=>{
  const {nodes,window}=mount({form:true,search:'?route=advisor'});const form=nodes['proposal-form'],question=form.elements.namedItem('question');
  form.emit('submit');
  for(const locale of ['ja','ko','fr','es']){
    window.ELE_I18N.setLanguage(locale);
    assert.equal(question.validationMessage,locale+':Please describe your question or advisory interest.');
    assert.equal(question.placeholder,locale+':Your research area and the questions you would like to help us explore.');
    assert.equal(nodes['proposal-heading'].textContent,locale+':Join the advisory team');
  }
});
test('requested draft locale translates headings and delivery titles while preserving content and privacy',()=>{
  const {window}=mount({form:true});const values={route:'advisor',question:'未翻译 user content',email:'private@example.org',name:'Ada'};
  for(const locale of ['ja','ko','fr','es']){
    const markdown=window.ELE_PROPOSAL.markdown(values,{locale});
    assert.ok(markdown.includes('## '+locale+':Research question or advisory interest'));
    assert.ok(markdown.includes(values.question));assert.ok(markdown.includes(values.email));
    const draft=window.ELE_PROPOSAL.githubDraft('example/ele',values,{locale});const url=new URL(draft.url);
    assert.ok(url.searchParams.get('body').includes(locale+':Advisory interest'));
    assert.ok(!url.searchParams.get('body').includes(values.email));
    assert.ok(url.searchParams.get('title').startsWith('['+locale+':Advisor]'));
    const email=window.ELE_PROPOSAL.emailDraft('team@example.org',values,{locale});
    assert.ok(new URL(email.url).searchParams.get('subject').includes(locale+':Advisory interest'));
  }
});
