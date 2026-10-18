import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';

// A minimal DOM fixture exercises the actual handlers without launching a browser.
// Layout is fixed here; browser rendering remains a separate visual check.
class Element {
  constructor(tag='div') { this.tagName=tag;this.children=[];this.dataset={};this.listeners={};this.scrollLeft=0;this.clientWidth=680;this.hidden=true;this.width=300; }
  append(...children) { for(const child of children){this.children.push(child);child.parent=this;} }
  replaceChildren(fragment) { this.children=[];this.append(...fragment.children); }
  addEventListener(type,fn) {(this.listeners[type]??=[]).push(fn);}
  emit(type,event={}) { for(const fn of this.listeners[type]??[])fn({...event,target:event.target??this}); }
  dispatchEvent(event){this.emit(event.type,event);}
  setAttribute(name,value){this[name]=value;}
  getAttribute(name){return this[name]??null;}
  get firstElementChild(){return this.children[0];}
  get scrollWidth(){return this.children.length*324-24;}
  getBoundingClientRect(){const left=this.parent?this.parent.children.indexOf(this)*324-this.parent.scrollLeft:0;return {left,right:left+(this.parent?this.width:this.clientWidth),width:this.parent?this.width:this.clientWidth};}
  scrollTo(options){this.lastBehavior=options.behavior;this.scrollLeft=Math.max(0,Math.min(options.left,this.scrollWidth-this.clientWidth));this.emit('scroll');}
  scrollBy(options){this.scrollTo({...options,left:this.scrollLeft+options.left});}
}
function mount(roster={},reduce=false,locale=null){
  const nodes=Object.fromEntries(['community-rail','community-previous','community-next','community-status'].map(id=>[id,new Element()]));
  const doc=new Element();doc.documentElement={lang:'en'};doc.createElement=tag=>new Element(tag);doc.createDocumentFragment=()=>new Element();doc.getElementById=id=>nodes[id];
  const window={ELE_COMMUNITY:roster,matchMedia:()=>({matches:reduce}),addEventListener:()=>{}};
  if(locale){
    const catalog=JSON.parse(fs.readFileSync(new URL('../src/locales/catalog.json',import.meta.url)));
    window.ELE_LOCALES=Object.fromEntries(['ja','ko','fr','es'].map(code=>[code,Object.fromEntries(catalog.map(row=>[row.en,code+':'+row.en]))]));
    window.localStorage={getItem:()=>locale,setItem(){}};
    const descendants=node=>[node,...node.children.flatMap(descendants)];
    doc.querySelectorAll=selector=>selector==='[data-en]'?Object.values(nodes).flatMap(descendants).filter(node=>node.dataset.en):[];
    doc.querySelector=()=>null;
    vm.runInNewContext(fs.readFileSync(new URL('../src/i18n.js',import.meta.url),'utf8'),{window,document:doc,URLSearchParams,Event});
  }
  vm.runInNewContext(fs.readFileSync(new URL('../src/community.js',import.meta.url),'utf8'),{window,document:doc,URL});
  return {nodes,doc,window};
}
test('directory mounts, scrolls, disables boundaries and respects reduced motion',()=>{
  const {nodes}=mount({},true),rail=nodes['community-rail'];
  assert.equal(rail.children.length,3);
  assert.equal(nodes['community-previous'].hidden,false);
  assert.equal(nodes['community-previous'].disabled,true);
  assert.equal(nodes['community-next'].disabled,false);
  nodes['community-next'].emit('click');
  assert.equal(rail.scrollLeft,268);assert.equal(rail.lastBehavior,'auto');
  assert.equal(nodes['community-next'].disabled,true);
  assert.equal(nodes['community-previous'].disabled,false);
  nodes['community-previous'].emit('click');assert.equal(rail.scrollLeft,0);
});
test('rail keyboard navigation does not hijack keys on a profile link',()=>{
  const {nodes}=mount(),rail=nodes['community-rail'];let prevented=0;
  const event={key:'End',preventDefault(){prevented++;}};
  rail.emit('keydown',{...event,target:new Element('a')});assert.equal(rail.scrollLeft,0);
  rail.emit('keydown',event);assert.equal(rail.scrollLeft,268);assert.equal(prevented,1);
  rail.emit('keydown',{...event,key:'Home'});assert.equal(rail.scrollLeft,0);
});
test('roster renders names as text and refreshes its status on language changes',()=>{
  const {nodes,doc}=mount({advisors:[{name:{en:'<Example>',zh:'示例'},url:'javascript:alert(1)'}]});
  const card=nodes['community-rail'].children[1];
  assert.equal(card.children.find(node=>node.tagName==='h3').textContent,'<Example>');
  assert.equal(card.children.filter(node=>node.tagName==='a').length,0);
  assert.match(nodes['community-status'].textContent,/Showing/);
  doc.documentElement.lang='zh-CN';doc.emit('ele:languagechange');assert.match(nodes['community-status'].textContent,/浏览/);
});

test('invitation cards and visible-range status follow each selected locale',()=>{
  const {nodes,window}=mount({},false,'ja');
  assert.equal(nodes['community-rail'].children[0].children[0].textContent,'ja:Universities & institutions');
  for(const locale of ['ja','ko','fr','es']){
    window.ELE_I18N.setLanguage(locale);
    const card=nodes['community-rail'].children[0];
    assert.equal(card.children.find(node=>node.tagName==='h3').textContent,locale+':Research across institutions');
    assert.equal(card.children.find(node=>node.tagName==='a').textContent,locale+':Explore a collaboration');
    assert.equal(nodes['community-status'].textContent,locale+':Showing 1–3 / 3');
    assert.ok(!nodes['community-status'].textContent.includes('{first}'));
  }
});
