(() => {
  const text = (en,zh,vars={}) => window.ELE_I18N ? window.ELE_I18N.t(en,zh,vars) : String(document.documentElement.lang === 'zh-CN' ? zh : en).replace(/\{([A-Za-z][A-Za-z0-9_]*)\}/g,(match,key)=>Object.hasOwn(vars,key)?String(vars[key]):match);
  let refreshForm = () => {};
  document.addEventListener('ele:languagechange',()=>refreshForm());
  document.querySelectorAll('[role="tablist"]').forEach(tablist=>{
    const tabs=Array.from(tablist.querySelectorAll('[role="tab"]'));
    function selectTab(tab) {
      tabs.forEach(item=>{const active=item===tab;item.setAttribute('aria-selected',String(active));item.tabIndex=active?0:-1;document.getElementById(item.getAttribute('aria-controls')).hidden=!active;});
    }
    tabs.forEach((tab,index)=>{
      tab.addEventListener('click',()=>selectTab(tab));
      tab.addEventListener('keydown',event=>{
        let next=index;if(event.key==='ArrowRight')next=(index+1)%tabs.length;else if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;else return;
        event.preventDefault();selectTab(tabs[next]);tabs[next].focus();
      });
    });
  });
  document.querySelectorAll('[data-figure-zoom]').forEach(button=>{
    button.addEventListener('click',()=>{
      const figure=button.closest('.experiment-figure');
      const expanded=button.getAttribute('aria-pressed')!=='true';
      button.setAttribute('aria-pressed',String(expanded));
      figure.classList.toggle('figure-expanded',expanded);
      if(!expanded)figure.querySelector('.experiment-image').scrollLeft=0;
    });
  });
  const config=window.ELE_CONFIG||{};
  const repositoryValid=/^[A-Za-z0-9][A-Za-z0-9_.-]*\/[A-Za-z0-9][A-Za-z0-9_.-]*$/.test(config.repository||'');
  if(repositoryValid){
    document.querySelectorAll('[data-github-link]').forEach(link=>{link.href='https://github.com/'+config.repository;link.hidden=false;});
    document.querySelectorAll('[data-github-issues]').forEach(link=>{link.href='https://github.com/'+config.repository+'/issues/new/choose';});
  }
  const form=document.getElementById('proposal-form');
  if(!form)return;
  const api=window.ELE_PROPOSAL;
  const channel=api.submissionChannel(config);
  const status=document.getElementById('form-status');
  const question=form.elements.namedItem('question');
  const routeControl=form.elements.namedItem('route');
  const preview=document.getElementById('draft-preview');
  const content=document.getElementById('draft-content');
  const continuation=document.getElementById('continue-submit');
  const clearButton=document.getElementById('clear-draft');
  const storageNote=document.getElementById('draft-storage-note');
  const storageKey='ele-contribution-draft-v1';
  let lastStatus=['',''];
  const values=()=>Object.fromEntries(new FormData(form));
  const draftOptions=()=>({locale:window.ELE_I18N?.getLocale()||(document.documentElement.lang==='zh-CN'?'zh':'en')});
  const setCopy=(id,en,zh,vars={})=>{
    const el=document.getElementById(id);
    el.dataset.en=en;el.dataset.zh=zh;el.textContent=text(en,zh,vars);
  };
  const notify=(en,zh)=>{lastStatus=[en,zh];status.textContent=text(en,zh);};
  try {
    const saved=JSON.parse(sessionStorage.getItem(storageKey));
    if(saved&&typeof saved==='object'&&Object.entries(saved).some(([key,value])=>key!=='route'&&typeof value==='string'&&value.trim())){
      for(const control of form.elements){
        if(control.name&&typeof saved[control.name]==='string'){
          control.value=saved[control.name].slice(0,control.maxLength>0?control.maxLength:12000);
        }
      }
      notify('Your draft has been restored in this tab.','已恢复当前标签页里的草稿。');
    }
  } catch {}
  const requestedRoute=new URLSearchParams(location.search).get('route');
  if(['idea','task','advisor'].includes(requestedRoute))routeControl.value=requestedRoute;
  if(!['idea','task','advisor'].includes(routeControl.value))routeControl.value='idea';
  refreshForm=()=>{
    const advisor=routeControl.value==='advisor';
    setCopy('proposal-heading',advisor?'Join the advisory team':'Recommend a research question',advisor?'加入学术顾问团队':'推荐一个研究问题');
    setCopy('proposal-intro',advisor?'Tell us about your research area and where you would like to advise the project.':'A few sentences are enough to start. We can work out the data, environment and evaluation together.',advisor?'说说您的研究方向，以及希望在哪些方面为项目提供建议。':'先用几句话说说想法。数据、运行环境和验收方式，我们可以一起完善。');
    setCopy('question-label',advisor?'Where would you like to contribute your expertise?':'What would you like an agent to investigate?',advisor?'您希望在哪些方向提供指导？':'您希望 Agent 研究什么问题？');
    setCopy('question-hint',advisor?'This is the only required field. You can add your name and affiliation below.':'This is the only required field. A research bottleneck or an unfinished idea is welcome.',advisor?'只需填写这一项，姓名与机构可在下方补充。':'只需填写这一项。可以是研究中遇到的难点，也可以是尚未成形的想法。');
    question.placeholder=advisor?text('Your research area and the questions you would like to help us explore.','您的研究方向，以及希望帮助项目探索的问题。'):text(question.dataset.placeholderEn,question.dataset.placeholderZh);
    const labels={local:['Prepare my contribution','整理投稿内容'],email:['Continue by email','通过邮件投稿'],github:['Continue on GitHub','在 GitHub 投稿'],portal:['Continue to submission','继续投稿']};
    setCopy('submit-label',...labels[channel.kind]);
    const notes={
      local:['The submission channel is not open yet. You can prepare and save your contribution here.','投稿接收渠道暂未开放，可先在这里整理并保存内容。'],
      email:['Review the draft in your mail app, then send it to {email}.','将在邮件客户端生成草稿，请检查后发送至 {email}。',{email:channel.email}],
      github:['You will review the draft on GitHub before publishing it as a public issue.','下一步在 GitHub 检查草稿，确认后才会公开发布。'],
      portal:['We will prepare your text to copy into the submission form.','先整理好内容，复制后即可带到投稿入口。']
    };
    setCopy('submission-note',...notes[channel.kind]);
    document.getElementById('email-note').hidden=channel.kind!=='github';
    clearButton.hidden=!Object.entries(values()).some(([key,value])=>key!=='route'&&String(value).trim());
    status.textContent=text(...lastStatus);
    if(question.validity.customError)question.setCustomValidity(text('Please describe your question or advisory interest.','请写下研究问题或顾问参与意向。'));
  };
  const validate=()=>{
    question.setCustomValidity(question.value.trim()?'':text('Please describe your question or advisory interest.','请写下研究问题或顾问参与意向。'));
    return form.reportValidity();
  };
  const showPreview=(body,url='',en='Continue to submission',zh='继续投稿')=>{
    content.value=body;preview.hidden=false;
    continuation.hidden=!url;
    if(url){continuation.href=url;setCopy('continue-label',en,zh);}else continuation.removeAttribute('href');
  };
  const saveDraft=()=>{
    question.setCustomValidity('');
    try {sessionStorage.setItem(storageKey,JSON.stringify(values()));storageNote.hidden=false;} catch {storageNote.hidden=true;}
    preview.hidden=true;notify('','');refreshForm();
  };
  form.addEventListener('input',saveDraft);
  routeControl.addEventListener('change',saveDraft);
  form.addEventListener('submit',event=>{
    event.preventDefault();
    if(!validate())return;
    const fields=values();
    if(channel.kind==='github'){
      const draft=api.githubDraft(channel.repository,fields,draftOptions());
      showPreview(api.markdown(fields,{...draftOptions(),includeEmail:false}),draft.url,'Open GitHub','打开 GitHub');
      if(draft.needsAttachment){
        notify('Copy the text below into a new GitHub issue. Your email field is left out.','内容较长，请复制下方正文并粘贴到 GitHub Issue。邮箱字段已排除。');
        preview.focus();
      }else{
        window.open(draft.url,'_blank','noopener,noreferrer');
        notify('Review the draft on GitHub and publish it when ready.','请在 GitHub 检查草稿，确认后发布。');
      }
    }else if(channel.kind==='email'){
      const draft=api.emailDraft(channel.email,fields,draftOptions());
      showPreview(draft.body,draft.url,'Open email draft','打开邮件草稿');
      if(draft.needsCopy){
        notify('Copy the text below, then open the email draft and paste it into the message.','内容较长，请复制下方正文，再打开邮件草稿粘贴并发送。');
        preview.focus();
      }else{
        location.href=draft.url;
        notify('Review and send the draft in your mail app. If it did not open, you can copy the text below.','请在邮件客户端检查并发送。如果未能打开，可复制下方内容。');
      }
    }else if(channel.kind==='portal'){
      showPreview(api.markdown(fields,draftOptions()),channel.url,'Open submission form','打开投稿入口');
      notify('Copy your text, then continue to the submission form.','复制下方内容，再前往投稿入口。');preview.focus();
    }else{
      showPreview(api.markdown(fields,draftOptions()));
      notify('Your contribution is ready to copy or save. Nothing has been sent.','内容已整理，可以复制或保存；尚未发送。');preview.focus();
    }
  });
  document.getElementById('download-draft').addEventListener('click',()=>{
    if(!validate())return;
    const url=URL.createObjectURL(new Blob([api.markdown(values(),draftOptions())],{type:'text/markdown;charset=utf-8'}));
    const link=document.createElement('a');link.href=url;link.download='earth-last-exam-proposal.md';document.body.append(link);link.click();link.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
    notify('A copy has been downloaded. Nothing has been sent.','草稿已下载，尚未发送。');
  });
  document.getElementById('copy-draft').addEventListener('click',async()=>{
    try {
      await navigator.clipboard.writeText(content.value);
      notify('Copied. You can paste it into your message or submission.','已复制，可粘贴到邮件或投稿入口。');
    } catch {
      content.focus();content.select();
      notify('The text is selected. Use your device’s Copy command.','已选中文本，请使用设备的复制操作。');
    }
  });
  clearButton.addEventListener('click',()=>{
    form.reset();routeControl.value=['idea','task','advisor'].includes(requestedRoute)?requestedRoute:'idea';
    question.setCustomValidity('');content.value='';preview.hidden=true;
    try {sessionStorage.removeItem(storageKey);} catch {}
    notify('Draft cleared.','草稿已清空。');refreshForm();question.focus();
  });
  document.getElementById('proposal-fields').disabled=false;
  try {sessionStorage.setItem(storageKey,JSON.stringify(values()));storageNote.hidden=false;} catch {}
  refreshForm();
})();
