(function (root) {
  'use strict';
  const groups = [
    {key:'institutions', en:'Universities & institutions', zh:'高校与研究机构', intro:['Institutional participants will be listed here as collaborations are confirmed.','参与机构将在合作确认后陆续公布。'], cta:['Explore a collaboration','参与合作'], route:'task'},
    {key:'advisors', en:'Advisors', zh:'学术顾问', intro:['We invite Earth scientists to help shape the research questions and standards of evidence.','邀请地球科学研究者共同判断选题，完善科学证据与验收标准。'], cta:['Join the advisory team','加入顾问团队'], route:'advisor'},
    {key:'contributors', en:'Contributors', zh:'共建者', intro:['Help develop a research task, prepare an environment or review an experiment.','一起打磨题目、准备运行环境，或参与实验评审。'], cta:['Contribute to the project','参与项目共建'], route:'task'}
  ];
  const localized = value => {
    if (typeof value === 'string') return {en:value.trim(),zh:value.trim()};
    const en = typeof value?.en === 'string' ? value.en.trim() : '';
    const zh = typeof value?.zh === 'string' ? value.zh.trim() : '';
    return {en:en || zh,zh:zh || en};
  };
  function safeURL(value, image = false) {
    if (typeof value !== 'string') return '';
    if (image) return /^images\/[a-zA-Z0-9][a-zA-Z0-9/_-]*\.(?:png|jpe?g|webp|svg)$/.test(value) && !value.includes('..') ? value : '';
    try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password ? url.href : ''; } catch { return ''; }
  }
  function entries(data = {}) {
    return groups.flatMap(group => {
      const items = (Array.isArray(data?.[group.key]) ? data[group.key] : []).filter(item => item && typeof item === 'object')
        .map(item => ({group,name:localized(item.name),detail:localized(item.detail),url:safeURL(item.url),image:safeURL(item.image,true)}))
        .filter(item => item.name.en);
      return items.length ? items : [{group,empty:true}];
    });
  }
  function scrollState(left, width, total) {
    const end = Math.max(0,total-width);
    return {previous:left > 2,next:left < end-2};
  }
  const api = {entries, safeURL, scrollState};
  root.ELE_COMMUNITY_UI = api;
  if (typeof document === 'undefined') return;
  const rail = document.getElementById('community-rail');
  if (!rail) return;
  const text = (en,zh,vars={}) => root.ELE_I18N ? root.ELE_I18N.t(en,zh,vars) : String(document.documentElement.lang==='zh-CN'?zh:en).replace(/\{([A-Za-z][A-Za-z0-9_]*)\}/g,(match,key)=>Object.hasOwn(vars,key)?String(vars[key]):match);
  const translatedNodes=[];
  function copy(tag,en,zh,className='') {
    const element = document.createElement(tag);
    element.dataset.en=en; element.dataset.zh=zh; element.textContent=text(en,zh);
    translatedNodes.push(element);
    element.className=className; return element;
  }
  const cards = entries(root.ELE_COMMUNITY);
  const fragment = document.createDocumentFragment();
  cards.forEach(item => {
    const card = document.createElement('article');
    card.className='community-card'+(item.empty?' community-open':'');
    card.append(copy('p',item.group.en,item.group.zh,'community-role'));
    if (item.empty) {
      card.append(copy('h3',item.group.key==='institutions'?'Research across institutions':item.group.key==='advisors'?'Guide the science':'Build the tasks',item.group.key==='institutions'?'汇集不同机构的研究经验':item.group.key==='advisors'?'为研究方向提供指导':'共同打磨科研任务'));
      card.append(copy('p',...item.group.intro,'community-detail'));
      const link=copy('a',...item.group.cta,'text-link');
      link.href='contribute.html?route='+item.group.route+'#proposal'; card.append(link);
    } else {
      if(item.image) {
        const img=document.createElement('img'); img.src=item.image; img.alt=''; img.loading='lazy'; img.width=96; img.height=96;
        img.className=item.group.key==='institutions'?'institution-mark':'community-portrait'; card.append(img);
      }
      card.append(copy('h3',item.name.en,item.name.zh));
      if(item.detail.en) card.append(copy('p',item.detail.en,item.detail.zh,'community-detail'));
      if(item.url) {const link=copy('a','Profile ↗','查看介绍 ↗','text-link');link.href=item.url;link.target='_blank';link.rel='noopener noreferrer';card.append(link);}
    }
    fragment.append(card);
  });
  rail.replaceChildren(fragment);
  const previous=document.getElementById('community-previous'), next=document.getElementById('community-next');
  const status=document.getElementById('community-status');
  function update() {
    const state=scrollState(rail.scrollLeft,rail.clientWidth,rail.scrollWidth);
    previous.disabled=!state.previous; next.disabled=!state.next;
    const all=[...rail.children], edge=rail.getBoundingClientRect();
    const visible=all.map((el,i)=>({rect:el.getBoundingClientRect(),i})).filter(({rect})=>rect.right>edge.left+20&&rect.left<edge.right-20);
    if(visible.length) status.textContent=text('Showing {first}–{last} / {total}','浏览 {first}–{last} / {total}',{first:visible[0].i+1,last:visible.at(-1).i+1,total:all.length});
  }
  function move(direction) {
    const step=(rail.firstElementChild?.getBoundingClientRect().width||rail.clientWidth)+24;
    rail.scrollBy({left:direction*step,behavior:root.matchMedia?.('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  }
  previous.addEventListener('click',()=>move(-1)); next.addEventListener('click',()=>move(1));
  rail.addEventListener('keydown',event=>{
    if(event.target!==rail)return;
    if(event.key==='ArrowLeft'||event.key==='ArrowRight') {event.preventDefault();move(event.key==='ArrowLeft'?-1:1);}
    else if(event.key==='Home'||event.key==='End'){event.preventDefault();rail.scrollTo({left:event.key==='Home'?0:rail.scrollWidth,behavior:'auto'});}
  });
  rail.addEventListener('scroll',update,{passive:true});
  root.addEventListener('resize',update);
  document.addEventListener('ele:languagechange',()=>{
    translatedNodes.forEach(element=>{element.textContent=text(element.dataset.en,element.dataset.zh);});
    update();
  });
  if(typeof ResizeObserver!=='undefined')new ResizeObserver(update).observe(rail);
  previous.hidden=false;next.hidden=false;update();
})(typeof window === 'undefined' ? globalThis : window);
