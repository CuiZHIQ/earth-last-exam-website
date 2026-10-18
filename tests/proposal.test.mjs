import test from 'node:test';
import assert from 'node:assert/strict';
await import('../src/proposal.js');
const {markdown,githubDraft,submissionChannel,emailDraft}=globalThis.ELE_PROPOSAL;
const proposal={name:'研究者',email:'private@example.org',field:'大气 & 海洋',route:'advisor',question:'Can a model distinguish A & B?\n保留换行。'};
test('GitHub draft preserves Unicode and text without publishing the contact email',()=>{
  const result=githubDraft('example/earth-last-exam',proposal);
  const url=new URL(result.url);
  assert.equal(url.origin,'https://github.com');
  assert.equal(url.pathname,'/example/earth-last-exam/issues/new');
  assert.match(url.searchParams.get('title'),/^\[Advisor\] 大气 & 海洋$/);
  assert.ok(url.searchParams.get('body').includes(proposal.question));
  assert.ok(!url.searchParams.get('body').includes(proposal.email));
  assert.ok(markdown(proposal).includes(proposal.email));
});
test('long submissions fall back to an attachment workflow instead of a broken URL',()=>{
  const result=githubDraft('example/earth-last-exam',{...proposal,question:'科学'.repeat(5000)});
  assert.equal(result.needsAttachment,true);
  assert.equal(result.url,'https://github.com/example/earth-last-exam/issues/new/choose');
});
test('missing or malformed repository cannot activate a submission destination',()=>{
  for(const repo of ['', 'https://evil.example', 'user/repo/extra', '../..', 'a/b?x']){
    assert.equal(githubDraft(repo,proposal),null);
  }
});
test('a question alone produces a short proposal without empty paperwork',()=>{
  const result=markdown({question:'  Why does the storm turn?\r\nTest two explanations.  ',route:'idea'});
  assert.ok(result.includes('Why does the storm turn?\nTest two explanations.'));
  assert.ok(!result.includes('## Name'));
  assert.ok(!result.includes('## Scientific outcome'));
  assert.ok(!result.includes('\n\n—'));
  assert.ok(!result.includes('\n\nidea'));
  assert.ok(result.length<260);
});
test('configured delivery prefers a portal or email and falls back to GitHub or a local draft',()=>{
  assert.equal(submissionChannel({}).kind,'local');
  assert.equal(submissionChannel({repository:'example/ele'}).kind,'github');
  assert.equal(submissionChannel({repository:'example/ele',contactEmail:' team@example.org '}).kind,'email');
  assert.equal(submissionChannel({contactEmail:'team@example.org',submissionUrl:'https://example.org/form'}).kind,'portal');
  for(const submissionUrl of ['javascript:alert(1)','http://example.org','https://user:password@example.org','https://']){
    assert.equal(submissionChannel({submissionUrl}).kind,'local');
  }
});
test('email drafts preserve the proposal and do not allow extra recipients or header injection',()=>{
  const values={question:'观测与模拟不一致。',source:'https://example.org/paper?x=1&y=2'};
  const draft=emailDraft('team@example.org',values);
  assert.equal(draft.needsCopy,false);
  const url=new URL(draft.url);
  assert.equal(url.protocol,'mailto:');
  assert.equal(decodeURIComponent(url.pathname),'team@example.org');
  assert.ok(url.searchParams.get('body').includes(values.question));
  assert.ok(url.searchParams.get('body').includes(values.source));
  for(const email of ['a@example.org,b@example.org','a@example.org?bcc=b@example.org','a@example.org\r\nBcc:b@example.org']){
    assert.equal(emailDraft(email,values),null);
  }
});
test('long email drafts retain their complete copyable content without an oversized mailto body',()=>{
  const values={question:'科学'.repeat(5000)};
  const draft=emailDraft('team@example.org',values);
  assert.equal(draft.needsCopy,true);
  assert.ok(draft.body.includes(values.question));
  assert.equal(new URL(draft.url).searchParams.has('body'),false);
});
