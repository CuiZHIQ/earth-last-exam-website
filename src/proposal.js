// Shared by the browser and the submission tests; no network requests.
(function(root){
  const labels={question:['Research question or advisory interest','研究问题或顾问意向'],source:['Related links','相关链接'],name:['Name','姓名'],affiliation:['Affiliation','单位'],field:['Field','方向'],materials:['Available materials','已有材料'],evaluation:['Outcome and verification','结果与验证'],support:['Collaboration needed','希望获得的协助']};
  const text=(en,zh,locale)=>root.ELE_I18N?root.ELE_I18N.t(en,zh,{},locale):['zh','zh-CN'].includes(locale)?zh:en;
  const heading=route=>route==='advisor'?['Advisory interest','顾问参与意向']:route==='task'?['Task collaboration','共同出题']:['Research idea','研究问题'];
  const clean=value=>String(value||'').replace(/\r\n/g,'\n').trim();
  const validRepository=value=>/^[A-Za-z0-9][A-Za-z0-9_.-]*\/[A-Za-z0-9][A-Za-z0-9_.-]*$/.test(value||'');
  const validEmail=value=>/^[A-Za-z0-9.!#$%&'*+\/=^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)+$/.test(value);
  function markdown(values,{includeEmail=true,locale}={}){
    const fields={...labels};
    if(includeEmail)fields.email=['Email','邮箱'];
    return '# Earth Last Exam — '+text(...heading(values.route),locale)+'\n\n'+Object.entries(fields).filter(([key])=>clean(values[key])).map(([key,label])=>'## '+text(...label,locale)+'\n\n'+clean(values[key])).join('\n\n')+'\n';
  }
  function submissionChannel(config={}){
    try {
      const url=new URL(config.submissionUrl);
      if(url.protocol==='https:'&&!url.username&&!url.password)return {kind:'portal',url:url.href};
    } catch {}
    const email=clean(config.contactEmail);
    if(validEmail(email))return {kind:'email',email};
    if(validRepository(config.repository))return {kind:'github',repository:config.repository};
    return {kind:'local'};
  }
  function emailDraft(email,values,{locale}={}){
    if(!validEmail(clean(email)))return null;
    const body=markdown(values,{locale});
    const url=new URL('mailto:'+encodeURIComponent(clean(email)));
    url.searchParams.set('subject','Earth Last Exam — '+text(...heading(values.route),locale));
    url.searchParams.set('body',body);
    const needsCopy=url.href.length>1800;
    if(needsCopy)url.searchParams.delete('body');
    return {url:url.href.replaceAll('+','%20'),body,needsCopy};
  }
  function githubDraft(repository,values,{locale}={}){
    if(!validRepository(repository))return null;
    const prefix='['+(values.route==='advisor'?text('Advisor','顾问',locale):text('Task proposal','任务投稿',locale))+']';
    const title=prefix+' '+String(values.field||values.question||text('Research contribution','研究投稿',locale)).replace(/\s+/g,' ').slice(0,100);
    const url=new URL('https://github.com/'+repository+'/issues/new');
    url.searchParams.set('title',title);
    url.searchParams.set('body',markdown(values,{includeEmail:false,locale}));
    return url.href.length>7500?{url:'https://github.com/'+repository+'/issues/new/choose',needsAttachment:true}:{url:url.href,needsAttachment:false};
  }
  root.ELE_PROPOSAL={markdown,githubDraft,submissionChannel,emailDraft};
})(typeof window==='undefined'?globalThis:window);
