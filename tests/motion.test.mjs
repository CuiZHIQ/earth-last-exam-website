import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

// Browser events are driven explicitly; these tests do not assert rendered layout.
function mount({reduce=false, available=true}={}) {
  const targets = [0, 90, 9999].map(delay => ({
    dataset: {enterDelay: String(delay)},
    classList: new Set(),
    style: {values: {}, setProperty(name, value) {this.values[name]=value;}},
  }));
  targets.forEach(target => {target.classList.remove=target.classList.delete.bind(target.classList);});
  const media = {matches: reduce, addEventListener(type, listener) {this.listener=listener;}};
  const observers=[];
  class Observer {
    constructor(callback) {this.callback=callback;this.targets=new Set();observers.push(this);}
    observe(target) {this.targets.add(target);}
    unobserve(target) {this.targets.delete(target);}
    disconnect() {this.targets.clear();}
    enter(target) {this.callback([{target,isIntersecting:true}]);}
  }
  const window={matchMedia:()=>media};
  if(available)window.IntersectionObserver=Observer;
  const document={querySelectorAll:()=>targets};
  vm.runInNewContext(fs.readFileSync(new URL('../src/motion.js',import.meta.url),'utf8'),{window,document});
  return {targets,observers,media};
}

test('sections stay readable before entering and animate only once',()=>{
  const {targets,observers}=mount();
  assert.equal(observers.length,1);
  assert.ok(targets.every(target=>target.classList.size===0));
  const observer=observers[0],target=targets[0];
  observer.enter(target);
  assert.ok(target.classList.has('motion-enter'));
  assert.equal(observer.targets.has(target),false);
  // Re-entering the viewport should not replay an already read section.
  target.classList.remove('motion-enter');
  observer.enter(target);
  assert.equal(target.classList.has('motion-enter'),false);
});

test('file rows stagger within a short bounded interval',()=>{
  const {targets,observers}=mount();
  targets.forEach(target=>observers[0].enter(target));
  assert.deepEqual(targets.map(target=>target.style.values['--enter-delay']),['0ms','90ms','240ms']);
});

test('reduced-motion visitors get the full page without entrance effects',()=>{
  const {targets,observers}=mount({reduce:true});
  assert.equal(observers.length,0);
  assert.ok(targets.every(target=>target.classList.size===0));
});

test('changing the motion preference stops pending and current entrances',()=>{
  const {targets,observers,media}=mount();
  observers[0].enter(targets[0]);
  media.matches=true;media.listener();
  assert.equal(observers[0].targets.size,0);
  assert.ok(targets.every(target=>!target.classList.has('motion-enter')));
  observers[0].enter(targets[1]);
  assert.equal(targets[1].classList.has('motion-enter'),false);
});

test('a browser without IntersectionObserver keeps content immediately available',()=>{
  const {targets,observers}=mount({available:false});
  assert.equal(observers.length,0);
  assert.ok(targets.every(target=>target.classList.size===0));
});
