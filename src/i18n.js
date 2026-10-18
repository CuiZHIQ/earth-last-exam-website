// Translations ship with the site; this also works in a file:// preview.
(function(root){
  'use strict';
  const locales=['en','zh','ja','ko','fr','es'];
  const normalize=value=>value==='zh-CN'?'zh':locales.includes(value)?value:null;
  let language='en';
  try {language=normalize(root.localStorage.getItem('ele-language'))||language;} catch {}
  try {language=normalize(new URLSearchParams(root.location?.search||'').get('lang'))||language;} catch {}
  function t(en,zh,vars={},locale=language){
    const selected=normalize(locale)||'en';
    const dictionary=root.ELE_LOCALES?.[selected];
    const translated=selected==='zh'&&typeof zh==='string'&&zh?zh:
      dictionary&&Object.hasOwn(dictionary,en)?dictionary[en]:en;
    return String(translated??'').replace(/\{([A-Za-z][A-Za-z0-9_]*)\}/g,(match,key)=>Object.hasOwn(vars,key)?String(vars[key]):match);
  }
  function apply(scope){
    if(typeof document==='undefined')return;
    scope=scope||document;
    scope.querySelectorAll('[data-en]').forEach(element=>{
      const value=t(element.dataset.en,element.dataset.zh);
      if(element.tagName?.toUpperCase()==='META')element.setAttribute('content',value);
      else element.textContent=value;
    });
    for(const [source,attribute] of [['placeholder','placeholder'],['aria','aria-label'],['alt','alt']]){
      scope.querySelectorAll('[data-'+source+'-en]').forEach(element=>{
        const value=t(element.getAttribute('data-'+source+'-en'),element.getAttribute('data-'+source+'-zh'));
        element.setAttribute(attribute,value);
        if(attribute==='placeholder')element.placeholder=value;
      });
    }
    const title=document.querySelector('meta[name="ele-title"]');
    if(title)document.title=t(title.dataset.en,title.dataset.zh);
  }
  function setLanguage(locale){
    language=normalize(locale)||'en';
    if(typeof document!=='undefined'){
      document.documentElement.lang=language==='zh'?'zh-CN':language;
      document.querySelectorAll('[data-language]').forEach(control=>{control.value=language;});
      apply();
    }
    try {root.localStorage.setItem('ele-language',language);} catch {}
    if(typeof document!=='undefined')document.dispatchEvent(new Event('ele:languagechange'));
    return language;
  }
  root.ELE_I18N={t,apply,setLanguage,getLocale:()=>language,locales:[...locales]};
  if(typeof document==='undefined')return;
  document.querySelectorAll('[data-language]').forEach(control=>control.addEventListener('change',()=>setLanguage(control.value)));
  setLanguage(language);
})(typeof window==='undefined'?globalThis:window);
