
/* ---------- 모드별 준비 화면 ---------- */
const seg=(name,opts,cur)=>`<span class="seg" data-seg="${name}">${opts.map(([v,l])=>`<button type="button" data-v="${v}" class="${String(v)===String(cur)?'on':''}">${l}</button>`).join('')}</span>`;
function bindSeg(o){$$('[data-seg]').forEach(s=>$$('button',s).forEach(b=>b.onclick=()=>{$$('button',s).forEach(x=>x.classList.remove('on'));b.classList.add('on');o[s.dataset.seg]=b.dataset.v}))}
const backRow=`<div class="row" style="margin-top:16px"><button class="btn ghost" type="button" id="backHome">← 처음으로</button></div>`;
function renderSetup(mode){
  if(mode==='book')return renderBook(); if(mode==='notes')return renderNotes(); if(mode==='hist')return renderHist();
  const v=view(),o={};
  if(mode==='deep'){
    o.n='13';o.fb='now';
    v.innerHTML=`<section class="hero"><h1>심층 인터뷰</h1><p>자기소개부터 마지막 발언까지, 지원서를 파고드는 순서로 진행합니다. 답을 제출하면 꼬리질문을 골라 이어서 답할 수 있습니다.</p></section>
    <div class="card"><div class="h4" style="margin-top:0">문항 수</div>${seg('n',[['7','7문항 · 약 20분'],['13','13문항 · 약 40분']],o.n)}
    <div class="h4">피드백</div>${seg('fb',[['now','답할 때마다 보기'],['end','끝나고 한꺼번에 (실전처럼)']],o.fb)}
    <p class="small">심층 인터뷰의 실제 문항 수와 시간은 공개되지 않았습니다. 13문항·40분은 연습용 기준입니다.</p>
    <div class="row" style="margin-top:12px"><button class="btn pri" type="button" id="startBtn">시작하기</button></div></div>${backRow}`;
    $('#startBtn').onclick=()=>startSession('deep','심층 인터뷰',buildDeep(+o.n,o.fb==='end'),{});
  }else if(mode==='ask'){
    o.prep='20';o.scope='pkg';
    v.innerHTML=`<section class="hero"><h1>A!SK 모의</h1><p>질문이 뜨면 준비 시간 뒤에 답변 시간이 시작되고, 시간이 끝나면 다음 질문으로 자동으로 넘어갑니다. 채점과 예시 답변은 모두 끝난 뒤에 나옵니다.</p></section>
    <div class="card"><div class="h4" style="margin-top:0">문항당 준비 시간</div>${seg('prep',[['10','10초'],['20','20초'],['30','30초']],o.prep)}
    <div class="h4">직무 문항 범위</div>${seg('scope',[['pkg','PKG개발 중심'],['mfg','양산기술 포함']],o.scope)}
    <label class="row small" style="margin-top:12px"><input type="checkbox" id="autoMic" ${SR?'checked':'disabled'}> 답변 시간이 시작되면 음성 인식 자동으로 켜기</label>
    <p class="small">2026년 상반기 A!SK 후기(자기소개·지원동기 각 1분, 직무 문항, 시간이 지나면 자동 넘김, 마지막은 시각자료 해석)를 참고한 구성입니다. 실제 문항 수와 준비 시간은 다를 수 있습니다.</p>
    <div class="row" style="margin-top:12px"><button class="btn pri" type="button" id="startBtn">시작하기</button></div></div>${backRow}`;
    $('#startBtn').onclick=()=>startSession('ask','A!SK 모의',buildAsk({prep:+o.prep,mfg:o.scope==='mfg'}),{voiceAuto:$('#autoMic').checked});
  }else if(mode==='pt'){
    o.min='30';
    v.innerHTML=`<section class="hero"><h1>문제해결 PT</h1><p>시나리오를 고르면 준비 → 발표 → 면접관의 후속 질문 순서로 진행합니다. 실제 과제는 공개된 것이 없어, 직무 내용을 바탕으로 만든 예상 시나리오입니다.</p></section>
    <div class="card"><div class="h4" style="margin-top:0">준비 시간</div>${seg('min',[['15','15분'],['30','30분'],['40','40분']],o.min)}<p class="small">실제 준비 시간은 공개되지 않았습니다. 처음에는 30분, 익숙해지면 15분으로 줄여 보세요.</p></div>
    <div class="grid">${D.PT.map(p=>`<button class="mode" type="button" data-pt="${p.id}"><span class="no">${esc(p.job)}</span><h3>${esc(p.title)}</h3><p>${esc(p.brief.slice(0,74))}…</p><span class="meta">후속 질문 ${p.f.length}개${store.get('pt.'+p.id)?' · 작성 중인 메모 있음':''}</span></button>`).join('')}</div>${backRow}`;
    $$('[data-pt]').forEach(b=>b.onclick=()=>startPt(D.PT.find(p=>p.id===b.dataset.pt),+o.min));
  }else if(mode==='gd'){
    v.innerHTML=`<section class="hero"><h1>Group Discussion</h1><p>혼자서 토론의 세 장면을 연습합니다. 첫 발언, 다른 지원자의 의견을 받아 잇기, 정리 발언. 주제는 모두 예상 주제입니다.</p></section>
    <div class="row"><button class="btn pri" type="button" id="gdRand">아무 주제로 시작</button></div>
    <div class="grid">${D.GD.map(g=>`<button class="mode" type="button" data-gd="${g.id}" style="min-height:0"><h3 style="font-size:16.5px">${esc(g.topic)}</h3><p>${esc(g.bg)}</p></button>`).join('')}</div>${backRow}`;
    $('#gdRand').onclick=()=>startGd(pick(D.GD,1)[0]);
    $$('[data-gd]').forEach(b=>b.onclick=()=>startGd(D.GD.find(g=>g.id===b.dataset.gd)));
  }else if(mode==='free'){
    const st={cat:'resume1'};
    v.innerHTML=`<section class="hero"><h1>자유 연습</h1><p>분야를 고르고 문항을 누르면 바로 시작합니다. 점수는 가장 최근 연습의 자동 점수입니다.</p></section><div id="ff"></div>
    <div class="row" style="margin-bottom:8px"><button class="btn pri" type="button" id="fRand">이 분야에서 무작위 5문항</button><button class="btn" type="button" id="fWeak">점수 낮은 문항부터</button></div><div id="fl"></div>${backRow}`;
    const draw=()=>{
      $('#ff').innerHTML=catFilter(st.cat,false);$$('#ff button').forEach(b=>b.onclick=()=>{st.cat=b.dataset.cat;draw()});
      const list=D.Q.filter(q=>q.c===st.cat);
      $('#fl').innerHTML=list.map(q=>{const l=store.get('last.'+q.id);return `<button class="fq" type="button" data-q="${q.id}"><span class="tags" style="margin-bottom:4px">${tagHtml(q)}${l?`<span class="last">${l.s}점</span>`:''}</span>${esc(q.q)}</button>`}).join('');
      $$('#fl [data-q]').forEach(b=>b.onclick=()=>{const rest=list.map(q=>q.id).filter(id=>id!==b.dataset.q);startFree([b.dataset.q,...shuffle(rest)])});
    };
    $('#fRand').onclick=()=>startFree(pick(D.Q.filter(q=>q.c===st.cat).map(q=>q.id),5));
    $('#fWeak').onclick=()=>{const done=D.Q.filter(q=>store.get('last.'+q.id)).sort((a,b)=>store.get('last.'+a.id).s-store.get('last.'+b.id).s).slice(0,5).map(q=>q.id);if(!done.length){toast('아직 연습한 문항이 없어요.');return}startFree(done)};
    draw();
  }
  bindSeg(o);const bh=$('#backHome');if(bh)bh.onclick=()=>go(renderHome);
}
const qStep=(id,extra)=>Object.assign({type:'q',q:QMAP[id],sec:QMAP[id].sec},extra||{});
function buildDeep(n,defer){
  const ids=n===7
    ?['I01','I03','R102',...pick(['R105','R107'],1),...pick(['R201','R202'],1),...pick(['P03','P04','P05','P09','P10'],1),'E01']
    :['I01','I02','I03','R102',...pick(['R101','R104','R105','R106','R107'],2),'R201',...pick(['R202','R203','R204'],1),...pick(['P03','P04','P05','P09','P10','P13'],2),'I06',...pick(['F01','F02','F04','F05','F09','F11'],1),'E01'];
  return ids.map(id=>qStep(id,{defer:!!defer}));
}
function buildAsk(o){
  const p1=['I01','I02',...pick(['F01','F02','F04','F05'],1)];
  const tech=o.mfg?[...pick(['P01','P03','P04','P05','P09','P12'],2),...pick(['M01','M02','M04'],1)]:pick(['P01','P02','P03','P04','P05','P07','P09','P10','P12','P13'],3);
  const vis=pick(o.mfg?['V3','V4']:['V1','V2','V4'],1);
  const secOf=id=>(id==='I01'||id==='I02')?60:(QMAP[id].chart?120:90);
  return [...p1.map(id=>[id,'Part 1 · 인성']),...tech.map(id=>[id,'Part 2 · 직무']),...vis.map(id=>[id,'Part 2 · 직무 (시각자료 해석)'])]
    .map(([id,label])=>qStep(id,{sec:secOf(id),prep:o.prep,auto:true,defer:true,label}));
}
function startFree(ids){startSession('free','자유 연습',ids.map(id=>qStep(id)),{})}
function startPt(pt,min){
  const steps=[{type:'ptprep',pt,sec:min*60},
    {type:'q',q:{id:pt.id+'~pres',q:'준비한 내용을 3분 안에 발표해 보세요. 권고안(결론)부터 말하고, 근거 → 검증 계획 → 리스크 순서로.',ptPres:true},sec:180,defer:true,label:'발표'},
    ...pt.f.map((f,i)=>({type:'q',q:{id:pt.id+'~f'+i,q:f[0],hint:f[1],isFollow:true},sec:60,label:`면접관의 후속 질문 ${i+1} / ${pt.f.length}`}))];
  startSession('pt','문제해결 PT',steps,{pt});
}
function startGd(g){
  const opp=pick(g.opp,2),topic=`<div class="why"><b>주제</b> ${esc(g.topic)}</div>`;
  const card=t=>topic+`<div class="opp"><small>다른 지원자의 발언</small>${esc(t)}</div>`;
  const mk=(kind,n,q,sec,context,label)=>({type:'q',q:{id:g.id+'~'+n,q,gd:kind},sec,context,label});
  startSession('gd','Group Discussion',[{type:'think',g,sec:60},
    mk('first',1,'첫 발언입니다. 본인의 입장과 근거를 1분 안에 말해 보세요.',60,topic,'첫 발언'),
    mk('bridge',2,'이 의견을 받아서 이어 말해 보세요. 인정할 점을 먼저 말하고, 본인 의견을 보완하거나 제안으로 연결합니다.',60,card(opp[0]),'받아서 잇기 ①'),
    mk('bridge',3,'한 번 더, 이 의견을 받아서 이어 말해 보세요.',60,card(opp[1]||opp[0]),'받아서 잇기 ②'),
    mk('wrap',4,'토론을 마무리하는 정리 발언을 해 보세요. 나온 의견의 공통점과 결론을 40초 안에.',45,topic,'정리 발언')],{g});
}

/* ---------- 진행 ---------- */
const S={mode:'',title:'',steps:[],i:0,res:[],opts:{},saved:false,at:0};
function startSession(mode,title,steps,opts){Object.assign(S,{mode,title,steps,i:0,res:[],opts:opts||{},saved:false,at:Date.now()});go(renderStep)}
function headHtml(){const n=S.steps.length;return `<div class="row" style="margin-top:14px"><span class="qno">${esc(S.title)} · ${Math.min(S.i+1,n)} / ${n}</span><span class="sp"></span><button class="btn ghost" type="button" id="quitBtn" style="min-height:36px;padding:6px 10px">그만하고 결과 보기</button></div><div class="progress"><i style="width:${Math.round(100*S.i/n)}%"></i></div>`}
function bindHead(){const b=$('#quitBtn');if(b)b.onclick=()=>go(renderReview)}
function next(){S.i++;go(renderStep)}
function renderStep(){
  const st=S.steps[S.i];if(!st)return renderReview();
  if(st.type==='ptprep')return renderPtPrep(st);
  if(st.type==='think')return renderThink(st);
  const q=st.q,real=QMAP[q.id];
  let ctx=st.context||'';
  if(q.ptPres){const m=store.get('pt.'+S.opts.pt.id,[]);ctx=`<details class="small" open><summary>내 준비 메모 보기</summary>${PT_FIELDS.map((f,i)=>m[i]?`<p><b>${f[0]}</b><br>${esc(m[i]).replace(/\n/g,'<br>')}</p>`:'').join('')||'<p>적어 둔 메모가 없습니다.</p>'}</details>`}
  view().innerHTML=headHtml()+`<div class="run">
    <div class="card qside">
      <div class="row">${st.label?`<span class="stage">${esc(st.label)}</span>`:''}<span class="sp"></span><span class="tags">${real?tagHtml(real):q.isFollow?'<span class="tag">꼬리질문</span>':''}</span></div>
      ${ctx}
      <div class="qtext">${esc(q.q)}</div>
      ${q.chart?chartSvg(q.chart):''}
      ${real&&!st.defer&&(real.why||[]).length?`<details class="small"><summary>면접관이 보려는 것 (막히면 열어 보기)</summary>${real.why.map(w=>`<div class="why">${esc(w)}</div>`).join('')}</details>`:''}
      <p class="small">권장 답변 시간 ${mmss(st.sec)}${st.auto?' · 시간이 끝나면 자동으로 넘어갑니다':''}</p>
    </div>
    <div>
      <div class="card" id="ansCard">
        <div id="prepBox" class="prep-box hidden"><div class="small">준비 시간 — 질문을 읽고 첫 문장을 정하세요</div><div class="big" id="prepNum"></div><div class="row" style="justify-content:center;margin-top:12px"><button class="btn" type="button" id="skipPrep">바로 답하기</button></div></div>
        <div id="ansBox">
          <div class="voice-live" id="live"></div>
          <textarea id="ans" placeholder="말로 답하기를 누르고 말하거나, 직접 입력하세요." aria-label="답변"></textarea>
          <div class="meter"><span id="cnt">0자</span><span>권장 약 ${Math.round(st.sec*5.2)}자</span></div>
          <div class="row">
            <button class="btn pri" type="button" id="micBtn">🎤 말로 답하기</button>
            <button class="btn" type="button" id="clearBtn">지우기</button><span class="sp"></span>
            <button class="btn pri" type="button" id="submitBtn">${st.defer?'다음으로':'답변 제출'}</button>
          </div>
          ${st.defer?'':`<label class="small row" style="margin-top:10px"><input type="checkbox" id="recChk"> 내 목소리를 녹음해서 다시 듣기${isMobile?' (휴대폰에서는 음성 인식과 함께 쓰면 끊길 수 있어요)':''}</label>`}
        </div>
      </div>
      <div id="fb"></div>
    </div></div>`;
  bindHead();
  const ta=$('#ans'),cnt=()=>{$('#cnt').textContent=nchar(ta.value)+'자'};
  ta.value=store.get('draft.'+q.id,'');cnt();
  ta.oninput=()=>{cnt();store.set('draft.'+q.id,ta.value)};
  V.ui=()=>{const b=$('#micBtn'),l=$('#live');if(!b)return;b.textContent=V.on?'■ 말하기 멈춤':'🎤 말로 답하기';b.classList.toggle('rec',V.on);b.classList.toggle('pri',!V.on);l.innerHTML=V.on?'<span class="dot"></span>듣고 있어요. 평소 말하는 속도로 답하세요.':''};
  $('#micBtn').onclick=()=>{V.on?voiceStop():voiceStart(ta,ta.oninput)};
  $('#clearBtn').onclick=()=>{if(!ta.value||confirm('지금까지의 답변을 지울까요?')){const was=V.on;voiceStop();ta.value='';ta.oninput();if(was)voiceStart(ta,ta.oninput)}};
  $('#submitBtn').onclick=()=>submitAnswer(false);
  const rc=$('#recChk');
  if(rc){rc.checked=store.get('rec',!isMobile)&&!!window.MediaRecorder;rc.onchange=()=>{store.set('rec',rc.checked);rc.checked?recStart():recStop()}}
  const begin=()=>{
    $('#prepBox').classList.add('hidden');$('#ansBox').classList.remove('hidden');
    timerStart({sec:st.sec,mode:st.auto?'down':'up',onEnd:st.auto?()=>submitAnswer(true):null});
    if(S.opts.voiceAuto)voiceStart(ta,ta.oninput);
    if(rc&&rc.checked)recStart();
    if(!isMobile&&!S.opts.voiceAuto)ta.focus({preventScroll:true});
  };
  if(st.prep){
    $('#prepBox').classList.remove('hidden');$('#ansBox').classList.add('hidden');
    timerStart({sec:st.prep,mode:'down',prep:true,onTick:l=>{const e=$('#prepNum');if(e)e.textContent=l},onEnd:begin});
    $('#skipPrep').onclick=()=>{timerStop();begin()};
  }else begin();
}
function submitAnswer(auto){
  const st=S.steps[S.i],q=st.q,ta=$('#ans');if(!ta)return;
  const text=ta.value.trim();
  if(!auto&&!text&&!st.defer){toast('답변을 말하거나 적어 주세요.');return}
  const used=timerElapsed();voiceStop();recStop();timerStop();
  let sc=null;if(q.gd)sc=scoreGd(q.gd,text);else if(q.k&&q.k.length)sc=scoreAnswer(q,text,st.sec);
  const r={id:q.id,q:q.q,text,used,sec:st.sec,sc,gd:q.gd||null,follow:!!q.isFollow,hint:q.hint||'',parent:q.parent||null};
  S.res.push(r);store.del('draft.'+q.id);
  if(sc&&!q.gd&&QMAP[q.id])store.set('last.'+q.id,{s:sc.total,at:Date.now()});
  if(st.defer)return next();
  renderFeedback(r,st);
}
function fbHtml(r,full){
  const q=QMAP[r.id];let h='';
  if(r.sc&&!r.gd){
    const s=r.sc;
    h+=`<div class="score"><div class="num">${s.total}<small> / 100</small></div><div class="bars">${[['핵심 내용',s.core,55],['구조',s.struct,20],['분량',s.lenS,15],['표현',s.expr,10]].map(([l,v,m])=>`<div class="bar"><span>${l}</span><b><i style="width:${Math.round(100*v/m)}%"></i></b><span>${v}/${m}</span></div>`).join('')}</div></div>
    <div class="kws">${q.k.map((k,i)=>`<span class="kwchip ${s.hits[i]?'hit':'miss'}">${s.hits[i]?'✓':'–'} ${esc(k[0])}</span>`).join('')}</div>
    <div class="small">말한 분량 ${s.len}자 (권장 약 ${s.target}자) · 사용 시간 ${mmss(r.used)} / ${mmss(r.sec)}</div>`;
    const miss=s.st.filter(x=>!x[1]);
    if(miss.length)h+=`<div class="small">구조에서 빠진 것: ${miss.map(x=>esc(x[0])).join(' / ')}</div>`;
    if(s.warns.length)h+=`<ul class="clean warns">${s.warns.map(w=>`<li>${esc(w)}</li>`).join('')}</ul>`;
  }else if(r.gd){
    h+=`<div class="kws">${r.sc.ch.map(c=>`<span class="kwchip ${c[1]?'hit':'miss'}">${c[1]?'✓':'–'} ${esc(c[0])}</span>`).join('')}</div><div class="small">분량 ${r.sc.len}자 · 사용 시간 ${mmss(r.used)} / ${mmss(r.sec)}</div>`;
  }else h+=`<div class="small">분량 ${nchar(r.text)}자 · 사용 시간 ${mmss(r.used)} / ${mmss(r.sec)}</div>`;
  if(r.hint)h+=`<div class="h4">답변 방향</div><div class="model"><p>${esc(r.hint)}</p></div>`;
  if(q&&full){
    if((q.p||[]).length)h+=`<div class="h4">답변 포인트</div><ul class="clean">${q.p.map(p=>`<li>${esc(p)}</li>`).join('')}</ul>`;
    h+=`<div class="h4">예시 답변</div><div class="model">${fmt(q.m)}</div>`;
    if(q.tip)h+=`<div class="tip"><b>주의</b> ${esc(q.tip)}</div>`;
    h+=srcHtml(q.s);
  }
  return h;
}
function renderFeedback(r,st){
  const q=st.q,real=QMAP[q.id],parent=real||QMAP[q.parent];
  $('#ansCard').innerHTML=`<div class="h4" style="margin-top:0">내 답변</div><p style="white-space:pre-wrap">${esc(r.text)||'<span class="small">(답변 없음)</span>'}</p><audio id="player" controls class="hidden" style="width:100%;margin-top:6px"></audio>`;
  if(R.url&&!R.on){const p=$('#player');p.src=R.url;p.classList.remove('hidden')}
  S.usedF=S.usedF&&S.usedFor===(parent&&parent.id)?S.usedF:new Set();S.usedFor=parent&&parent.id;
  const fs=parent&&S.mode!=='pt'?(parent.f||[]):[];
  const last=S.i>=S.steps.length-1;
  $('#fb').innerHTML=`<div class="card fb">${fbHtml(r,true)}
    ${fs.length?`<div class="h4">꼬리질문 이어서 받기</div>${fs.map((f,i)=>`<button class="fq ${S.usedF.has(i)?'done':''}" type="button" data-f="${i}">${esc(f[0])}${S.usedF.has(i)?'<small>답변 완료</small>':''}</button>`).join('')}`:''}
    <div class="row" style="margin-top:14px"><button class="btn" type="button" id="retryBtn">다시 답하기</button><span class="sp"></span><button class="btn pri" type="button" id="nextBtn">${last?'결과 보기':'다음 질문 →'}</button></div></div>`;
  $$('#fb [data-f]').forEach(b=>b.onclick=()=>{
    const i=+b.dataset.f,f=fs[i];S.usedF.add(i);
    S.steps.splice(S.i+1,0,{type:'q',q:{id:parent.id+'~f'+i,q:f[0],hint:f[1],isFollow:true,parent:parent.id},sec:60,label:'꼬리질문'});next();
  });
  $('#retryBtn').onclick=()=>{S.res.pop();go(renderStep)};
  $('#nextBtn').onclick=next;
  $('#fb').scrollIntoView({behavior:'smooth',block:'start'});
}

/* ---------- 문제해결 PT: 준비 ---------- */
const PT_FIELDS=[['① 문제 정의','이 과제를 한 문장으로. 무엇을 언제까지 판단해야 하는가'],['② 원인 가설과 우선순위','가설마다 근거가 되는 자료를 함께'],['③ 검증 계획','가설이 맞다면 무엇이 보여야 하는가, 어떤 실험·분석으로 확인할 것인가'],['④ 권고안과 일정','결론부터. 주차별로 무엇을 할지'],['⑤ 전제와 리스크','내 판단이 틀릴 수 있는 지점, 남는 위험']];
function ptBrief(pt){return `<div class="stage">${esc(pt.job)} · 예상 시나리오</div><div class="qtext" style="font-size:19px">${esc(pt.title)}</div><p>${esc(pt.brief)}</p>
  <div class="kv">${pt.data.map(d=>`<div>${esc(d[0])}</div><div>${esc(d[1])}</div>`).join('')}</div><p class="small">표의 수치는 연습용 가상 값입니다.</p>
  <div class="h4">요구 사항</div><ul class="clean">${pt.ask.map(a=>`<li>${esc(a)}</li>`).join('')}</ul>`}
function renderPtPrep(st){
  const pt=st.pt,memo=store.get('pt.'+pt.id,[]);
  view().innerHTML=headHtml()+`<div class="run"><div class="card qside">${ptBrief(pt)}</div><div>
    <div class="card"><div class="h4" style="margin-top:0">답안 정리 — 준비 시간 ${Math.round(st.sec/60)}분</div>
    ${PT_FIELDS.map((f,i)=>`<label for="pf${i}" style="font-weight:700;display:block;margin-top:10px">${f[0]}</label><textarea class="sm" id="pf${i}" placeholder="${esc(f[1])}">${esc(memo[i]||'')}</textarea>`).join('')}
    <div class="row" style="margin-top:12px"><span class="sp"></span><button class="btn pri" type="button" id="toPres">발표하러 가기 →</button></div></div>
    <details class="card" style="margin-top:12px" open><summary>AI(LLM)는 이렇게 쓰세요</summary><div class="body"><ul class="clean">
      <li>실제 면접에서는 면접장 PC의 전용 LLM을 씁니다. <b>이 페이지에는 AI가 들어 있지 않으니</b>, 연습할 때는 평소 쓰는 AI 도구를 옆 창에 띄워 두세요.</li>
      <li>처음 5분은 AI 없이 ①과 ②를 직접 적습니다. 문제 정의는 본인이 해야 합니다.</li>
      <li>AI에게는 답을 묻지 말고 <b>"내가 놓친 원인"과 "내 논리의 약점"</b>을 물으세요.</li>
      <li>AI의 답은 주어진 자료와 맞는 것, 본인이 설명할 수 있는 것만 남깁니다. 버린 것과 이유를 기억해 두면 후속 질문에 쓸 수 있습니다.</li>
      <li>실제 제출 형식은 공개되지 않았습니다. 어떤 형식이든 결론 → 근거 → 검증 → 리스크 순서면 됩니다.</li></ul>${srcHtml(['half1','press'])}</div></details>
  </div></div>`;
  bindHead();
  $$('textarea',view()).forEach((ta,i)=>ta.oninput=()=>{const m=store.get('pt.'+pt.id,[]);m[i]=ta.value;store.set('pt.'+pt.id,m)});
  timerStart({sec:st.sec,mode:'down',onEnd:()=>toast('준비 시간이 끝났어요. 정리되는 대로 발표로 넘어가세요.',6000)});
  $('#toPres').onclick=next;
}
/* ---------- 토론: 생각 정리 ---------- */
function renderThink(st){
  const g=st.g;
  view().innerHTML=headHtml()+`<div class="run"><div class="card qside"><div class="stage">생각 정리 1분</div><div class="qtext">${esc(g.topic)}</div><p>${esc(g.bg)}</p>
    <textarea class="sm" id="gNote" placeholder="내 입장 한 줄, 근거 두 가지를 메모해 보세요. (선택)"></textarea>
    <div class="row" style="margin-top:12px"><span class="sp"></span><button class="btn pri" type="button" id="gGo">첫 발언 시작 →</button></div></div>
    <div><details class="card" open><summary>토론에서 보는 것과 쓸 수 있는 말</summary><div class="body"><ul class="clean">
      <li>공고 설명 기준으로, 정답을 맞히는지가 아니라 <b>다른 의견을 받아들이는 태도와 논의에 기여하는 역할</b>을 봅니다.</li>
      <li>받아 주기: "방금 말씀하신 ○○에 동의합니다. 거기에 하나 더하면…"</li>
      <li>잇기: "두 분 의견의 공통점은 ○○인 것 같습니다."</li>
      <li>질문하기: "혹시 ○○한 경우에는 어떻게 보시나요?"</li>
      <li>정리하기: "지금까지 나온 의견을 정리해 보면…"</li>
      <li>피할 것: 말 끊기, 같은 주장 반복, 혼자 길게 말하기, 이기려고 하기</li></ul>${srcHtml(['half1','press'])}</div></details></div></div>`;
  bindHead();
  timerStart({sec:st.sec,mode:'down',prep:true,onEnd:()=>toast('1분이 지났어요. 첫 발언으로 넘어가세요.')});
  $('#gGo').onclick=next;
}

/* ---------- 결과(복기) ---------- */
function saveHist(){
  if(S.saved||!S.res.length)return;S.saved=true;
  const scored=S.res.filter(r=>r.sc&&!r.gd&&r.sc.total!=null);
  const sess={at:S.at,mode:S.mode,title:S.title+(S.opts.pt?' · '+S.opts.pt.title:S.opts.g?' · '+S.opts.g.topic:''),avg:scored.length?Math.round(scored.reduce((a,r)=>a+r.sc.total,0)/scored.length):null,
    items:S.res.map(r=>({q:r.q,text:r.text,used:r.used,sec:r.sec,score:r.sc&&!r.gd?r.sc.total:null,follow:r.follow}))};
  if(S.opts.pt){const m=store.get('pt.'+S.opts.pt.id,[]);sess.pt=PT_FIELDS.map((f,i)=>f[0]+' '+(m[i]||'(비어 있음)')).join('\n')}
  const h=store.get('hist',[]);h.unshift(sess);store.set('hist',h.slice(0,20));S.sess=sess;
}
function renderReview(){
  leaveRun();saveHist();
  const scored=S.res.filter(r=>r.sc&&!r.gd),avg=scored.length?Math.round(scored.reduce((a,r)=>a+r.sc.total,0)/scored.length):null;
  const pt=S.opts.pt,g=S.opts.g;
  let extra='';
  if(pt)extra=`<div class="card" style="margin:12px 0"><div class="h4" style="margin-top:0">예시 접근 — ${esc(pt.title)}</div><div class="model">${fmt(pt.m)}</div>${srcHtml(pt.s)}
    <div class="h4">자기 점검</div><div class="chk">${['문제를 한 문장으로 정의하고 시작했다','원인 가설에 우선순위와 그 근거를 붙였다','가설마다 무엇으로 확인할지 말했다','반박에는 근거로 답했고, 모르는 것은 모른다고 했다','내 경험을 한 번 이상 연결했다','AI가 준 내용 중 버린 것과 그 이유를 설명할 수 있다'].map(c=>`<label><input type="checkbox">${c}</label>`).join('')}</div>
    <p class="small">공식 평가 기준이 아니라, 채용 설명 내용과 모의면접 평가 항목을 참고해 만든 점검표입니다.</p></div>`;
  if(g)extra=`<div class="card" style="margin:12px 0"><div class="h4" style="margin-top:0">${esc(g.topic)}</div><div class="two"><div><b>한쪽 입장</b><ul class="clean">${g.pro.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div><div><b>다른 입장</b><ul class="clean">${g.con.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div></div>
    <div class="h4">예시 발언</div><div class="model">${fmt(g.m)}</div><p class="small">어느 입장을 골랐는지는 중요하지 않습니다. 상대의 말을 받아서 본인 의견을 고치는 장면이 있었는지 확인하세요.</p></div>`;
  view().innerHTML=`<section class="hero"><h1>${esc(S.title)} 결과</h1><p>${S.res.length?`답변 ${S.res.length}개${avg!=null?` · 자동 점수 평균 <b>${avg}점</b> (참고용)`:''}. 아래에서 문항별로 내 답변과 예시 답변을 비교해 보세요.`:'제출한 답변이 없습니다.'}</p></section>
  ${S.res.length?`<div class="row"><button class="btn pri" type="button" id="expCopy">답안 내보내기 (복사)</button><button class="btn" type="button" id="expShare">공유</button></div>`:''}
  ${extra}
  ${S.res.map((r,i)=>`<details class="qitem" ${i===0?'open':''}><summary><span class="qq">${r.follow?'↳ ':''}${esc(r.q)}</span>${r.sc?`<span class="last">${r.sc.total}점</span>`:''}</summary><div class="in"><div class="h4">내 답변</div><p style="white-space:pre-wrap">${esc(r.text)||'<span class="small">(답변 없음)</span>'}</p>${fbHtml(r,true)}</div></details>`).join('')}
  <div class="row" style="margin-top:16px"><button class="btn" type="button" id="againBtn">같은 모드 다시</button><button class="btn" type="button" id="homeBtn2">처음으로</button></div>`;
  const ec=$('#expCopy');if(ec){ec.onclick=()=>copyText(exportText(S.sess));$('#expShare').onclick=()=>shareText(exportText(S.sess))}
  $('#againBtn').onclick=()=>go(renderSetup,S.mode==='free'?'free':S.mode);
  $('#homeBtn2').onclick=()=>go(renderHome);
}

/* ---------- 시작 ---------- */
(function init(){
  const root=document.documentElement,saved=store.get('theme',null);
  root.dataset.theme=saved||((window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light');
  $('#themeBtn').onclick=()=>{root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';store.set('theme',root.dataset.theme)};
  $('#dday').textContent=ddayText();
  $('#homeBtn').onclick=()=>{if(S.res.length&&!S.saved)saveHist();go(renderHome)};
  window.addEventListener('pagehide',()=>{if(S.res.length&&!S.saved)saveHist()});
  renderHome();
})();
