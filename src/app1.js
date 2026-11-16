'use strict';
/* ---------- 기본 도구 ---------- */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const QMAP=Object.fromEntries(D.Q.map(q=>[q.id,q]));
const CATS=[['intro','자기소개·지원동기'],['resume1','지원서 ① 직무 경험'],['resume2','지원서 ② AI 활용'],['pkg','PKG개발 지식'],['mfg','양산기술·공정 기초'],['fit','인성·SKMS·역량'],['company','회사·산업'],['closing','마무리']];
const CNAME=Object.fromEntries(CATS);
const INTERVIEW=new Date(2026,10,26);
const UA=navigator.userAgent||'';
const isMobile=/Android|iPhone|iPad|iPod/i.test(UA);
const inApp=/KAKAOTALK|NAVER\(inapp|Instagram|FBAN|FBAV|Line\/|DaumApps/i.test(UA);
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;

const store={
  get(k,d){try{const v=localStorage.getItem('hd.'+k);return v==null?d:JSON.parse(v)}catch(e){return d}},
  set(k,v){try{localStorage.setItem('hd.'+k,JSON.stringify(v))}catch(e){}},
  del(k){try{localStorage.removeItem('hd.'+k)}catch(e){}}
};
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const pick=(ids,n)=>shuffle(ids).slice(0,n);
const mmss=s=>{s=Math.max(0,Math.round(s));return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')};
const nchar=t=>t.replace(/\s/g,'').length;

function toast(msg,ms=3200){const el=$('#toast');el.textContent=msg;el.classList.remove('hidden');clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.add('hidden'),ms)}

/* 예시 답변 표시: **키워드** → 굵은 빨강, [직접 채울 것: …] → 노란 칸 */
function fmt(t){
  const inline=s=>s.replace(/\*\*(.+?)\*\*/g,'<b class="kw">$1</b>').replace(/\[직접 채울 것:?\s*([^\]]*)\]/g,'<mark class="fill">✎ 직접 채우기: $1</mark>');
  let html='',inList=false;
  for(const ln of esc(t).split('\n')){
    const s=ln.trim();
    if(!s){if(inList){html+='</ul>';inList=false}continue}
    if(s.startsWith('- ')){if(!inList){html+='<ul class="clean">';inList=true}html+='<li>'+inline(s.slice(2))+'</li>'}
    else{if(inList){html+='</ul>';inList=false}html+='<p>'+inline(s)+'</p>'}
  }
  return html+(inList?'</ul>':'');
}
const plain=t=>t.replace(/\*\*/g,'');
function srcHtml(keys){
  if(!keys||!keys.length)return '';
  return '<div class="srcs">근거: '+keys.map(k=>{const s=D.SRC[k];if(!s)return '';return s[1]?`<a href="${esc(s[1])}" target="_blank" rel="noopener noreferrer">${esc(s[0])}</a>`:esc(s[0])}).filter(Boolean).join(' · ')+'</div>';
}
function tagHtml(q){return `<span class="tag t-${esc(q.t||'예상')}">${esc(q.t||'예상')}</span>`+(q.c&&CNAME[q.c]?`<span class="tag">${esc(CNAME[q.c])}</span>`:'')}

/* ---------- 자동 채점 (참고용) ---------- */
const FILLER=/(^|[\s,.])(음+|어+|그+|저기|약간|뭔가|막|이제|그러니까|뭐랄까)(?=[\s,.]|$)/g;
const ABSOL=/완벽|100\s?%|백\s?퍼센트|무조건|절대로|압도|비약적|강력한 무기/g;
function scoreAnswer(q,text,sec){
  const t=(text||'').trim(), len=nchar(t), ks=q.k||[];
  const hits=ks.map(k=>{try{return new RegExp(k[1],'i').test(t)}catch(e){return false}});
  const nHit=hits.filter(Boolean).length;
  const core=ks.length?Math.round(55*nHit/ks.length):0;
  const first=(t.split(/[.!?\n]/)[0]||'').trim();
  const tail=t.slice(-90);
  const st=[
    ['첫 문장이 짧고 분명함',first.length>=6&&nchar(first)<=60],
    ['순서를 알려 주는 말(첫째·먼저·다음으로…)',/첫째|둘째|셋째|먼저|다음으로|마지막으로|[두세네] 가지|단계/.test(t)],
    ['이유·사례(…때문, 예를 들어, 당시…)',/때문|왜냐하면|예를 들어|당시|사례|근거|데이터|경험/.test(t)],
    ['마무리 문장(…하겠습니다, …생각합니다)',/하겠습니다|생각합니다|배웠습니다|기여|감사합니다/.test(tail)]
  ];
  const struct=st.filter(x=>x[1]).length*5;
  const target=Math.round((sec||q.sec||90)*5.2), ratio=target?len/target:0;
  let lenS=ratio>=.55&&ratio<=1.25?15:ratio<.55?Math.round(15*ratio/.55):Math.max(4,Math.round(15-(ratio-1.25)*20));
  const fill=(t.match(FILLER)||[]).length, abs=[...new Set((t.match(ABSOL)||[]).map(s=>s.trim()))];
  let expr=10-Math.min(6,Math.max(0,fill-2))-Math.min(4,abs.length*2);
  let total=core+struct+lenS+expr;
  const warns=[];
  if(len<40){total=Math.min(total,20);warns.push('답이 너무 짧아요. 최소 서너 문장으로 말해 보세요.')}
  if(ratio>1.25)warns.push('권장 시간보다 길어요. 배경 설명을 줄이고 결론을 앞에 두세요.');
  if(ratio<.55&&len>=40)warns.push('권장 분량보다 짧아요. 근거나 사례를 한 가지 더 붙여 보세요.');
  if(fill>2)warns.push(`군말(음·어·약간 등)이 ${fill}번 들어갔어요.`);
  if(abs.length)warns.push(`"${abs.join('", "')}" 같은 단정 표현은 근거를 묻는 꼬리질문을 부릅니다.`);
  if((q.c==='resume1'||q.c==='resume2')&&!/\d|퍼센트|배|절반/.test(t)&&len>=40)warns.push('숫자가 하나도 없어요. 상대값(몇 % 줄었다)이라도 넣어 보세요.');
  return {total:Math.max(0,Math.min(100,total)),core,struct,lenS,expr,hits,len,target,st,warns};
}
const GD_CHECK={
  first:[['입장을 분명히 말함',/생각합니다|봅니다|입장|라고 봅/],['근거 제시',/때문|왜냐하면|예를 들어|근거/],['조건·한계를 붙임',/다만|조건|경우|하지만/]],
  bridge:[['상대 의견을 받아 줌',/동의|공감|말씀|지적|맞습니다|일리/],['내 의견을 보완·수정',/그래서|덧붙|고치|보완|더하면|그렇다면/],['제안이나 질문으로 연결',/어떨까요|제안|라면|해 보면|할까요/]],
  wrap:[['논의를 요약함',/정리하면|정리하겠|모아|요약/],['공통점을 짚음',/공통|모두|모였|동의/],['결론·다음 단계',/결론|원칙|기준|하자는|으로 정리/]]
};
function scoreGd(kind,text){
  const t=(text||'').trim();const ch=(GD_CHECK[kind]||[]).map(([l,re])=>[l,re.test(t)]);
  return {ch,len:nchar(t),total:Math.round(100*ch.filter(x=>x[1]).length/Math.max(1,ch.length))};
}

/* ---------- 음성 인식 ---------- */
const V={rec:null,on:false,ta:null,base:'',cb:null,ui:null,quick:0,last:0};
function voiceStart(ta,cb){
  if(!SR){toast('이 브라우저에서는 음성 인식이 안 돼요. 키보드의 마이크(받아쓰기) 버튼을 눌러 말하면 글자로 들어갑니다.',6000);return false}
  if(V.on)voiceStop();
  V.ta=ta;V.cb=cb;V.on=true;V.quick=0;
  const begin=()=>{
    const r=new SR();r.lang='ko-KR';r.interimResults=true;r.continuous=!isMobile;r.maxAlternatives=1;
    V.rec=r;V.base=ta.value.replace(/\s+$/,'');V.last=Date.now();
    r.onresult=e=>{
      let txt='';
      if(isMobile){txt=e.results[e.results.length-1][0].transcript}
      else{for(let i=0;i<e.results.length;i++)txt+=e.results[i][0].transcript}
      ta.value=(V.base?V.base+' ':'')+txt.trim();cb&&cb();
    };
    r.onerror=e=>{
      if(['not-allowed','service-not-allowed','audio-capture'].includes(e.error)){
        V.on=false;toast('마이크를 쓸 수 없어요. 주소창 왼쪽의 자물쇠 → 마이크 허용을 확인해 주세요. 안 되면 키보드의 마이크 버튼을 쓰면 됩니다.',7000);
      }
    };
    r.onend=()=>{
      if(!V.on){V.ui&&V.ui();return}
      V.quick=(Date.now()-V.last<500)?V.quick+1:0;
      if(V.quick>4){V.on=false;V.ui&&V.ui();toast('음성 인식이 계속 끊겨요. 키보드의 마이크 버튼을 써 보세요.',6000);return}
      try{begin()}catch(err){V.on=false;V.ui&&V.ui()}
    };
    try{r.start()}catch(err){}
  };
  begin();V.ui&&V.ui();return true;
}
function voiceStop(){V.on=false;try{V.rec&&V.rec.stop()}catch(e){}V.ui&&V.ui()}

/* ---------- 내 목소리 녹음(다시 듣기) ---------- */
const R={mr:null,chunks:[],url:null,stream:null,on:false};
async function recStart(){
  if(R.on||!navigator.mediaDevices||!window.MediaRecorder)return false;
  try{
    R.stream=await navigator.mediaDevices.getUserMedia({audio:true});R.chunks=[];
    R.mr=new MediaRecorder(R.stream);
    R.mr.ondataavailable=e=>{if(e.data&&e.data.size)R.chunks.push(e.data)};
    R.mr.onstop=()=>{const b=new Blob(R.chunks,{type:R.mr.mimeType||'audio/webm'});if(R.url)URL.revokeObjectURL(R.url);R.url=URL.createObjectURL(b);R.stream.getTracks().forEach(t=>t.stop());R.on=false;const p=$('#player');if(p){p.src=R.url;p.classList.remove('hidden')}};
    R.mr.start();R.on=true;return true;
  }catch(e){R.on=false;return false}
}
function recStop(){try{if(R.mr&&R.mr.state!=='inactive')R.mr.stop()}catch(e){}}

/* ---------- 타이머 ---------- */
const T={id:null,t0:0,limit:0,mode:'up',onEnd:null,onTick:null};
function timerStart(o){
  timerStop();Object.assign(T,{t0:Date.now(),limit:o.sec||0,mode:o.mode||'up',onEnd:o.onEnd||null,onTick:o.onTick||null});
  const el=$('#timer');el.classList.remove('hidden','over','prep');if(o.prep)el.classList.add('prep');
  T.id=setInterval(timerTick,250);timerTick();
}
function timerTick(){
  const el=$('#timer'),e=(Date.now()-T.t0)/1000;
  if(T.mode==='down'){
    const left=Math.max(0,Math.ceil(T.limit-e));el.textContent=mmss(left);T.onTick&&T.onTick(left);
    if(T.limit-e<=0){const cb=T.onEnd;timerStop();cb&&cb()}
  }else{el.textContent=mmss(e)+' / '+mmss(T.limit);el.classList.toggle('over',T.limit>0&&e>T.limit)}
}
const timerElapsed=()=>T.t0?Math.round((Date.now()-T.t0)/1000):0;
function timerStop(){clearInterval(T.id);T.id=null;const el=$('#timer');if(el)el.classList.add('hidden')}

/* ---------- 연습용 그래프 (수치는 가상) ---------- */
function chartSvg(kind){
  const W=520,H=300,L=56,Rg=kind==='filler'?56:18,Tp=22,B=44,pw=W-L-Rg,ph=H-Tp-B;
  const mk=(x0,x1,y0,y1)=>({x:v=>L+(v-x0)/(x1-x0)*pw,y:v=>Tp+ph-(v-y0)/(y1-y0)*ph});
  const line=(pts,s,c,dash)=>`<polyline fill="none" stroke="${c}" stroke-width="2.5" ${dash?'stroke-dasharray="6 5"':''} points="${pts.map(p=>s.x(p[0]).toFixed(1)+','+s.y(p[1]).toFixed(1)).join(' ')}"/>`;
  const txt=(x,y,t,a='middle',c='currentColor',w=400)=>`<text x="${x}" y="${y}" text-anchor="${a}" font-size="12" fill="${c}" font-weight="${w}">${t}</text>`;
  const frame=`<rect x="${L}" y="${Tp}" width="${pw}" height="${ph}" fill="none" stroke="currentColor" stroke-opacity=".35"/>`;
  const xt=(s,vals,u='')=>vals.map(v=>txt(s.x(v),H-B+16,v+u)).join('');
  const yt=(s,vals,u='',right)=>vals.map(v=>txt(right?W-Rg+6:L-6,s.y(v)+4,v+u,right?'start':'end')).join('');
  let body='';
  if(kind==='warp'){
    const s=mk(25,260,-110,80);
    body=frame+`<line x1="${L}" x2="${L+pw}" y1="${s.y(0)}" y2="${s.y(0)}" stroke="currentColor" stroke-opacity=".5" stroke-dasharray="3 4"/>`
      +line([[25,60],[150,35],[200,-5],[260,-50]],s,'var(--acc)')+line([[25,45],[135,22],[200,-45],[260,-95]],s,'var(--kw)')
      +xt(s,[25,100,150,200,260],'℃')+yt(s,[-100,-50,0,50])
      +txt(s.x(236),s.y(-10),'소재 A','middle','var(--acc)',700)+txt(s.x(158),s.y(-62),'소재 B','middle','var(--kw)',700)
      +txt(L+pw/2,H-6,'온도')+txt(14,Tp+ph/2,'휨 (가상 단위, +는 위로 볼록)','middle','currentColor',400).replace('<text','<text transform="rotate(-90 14 '+(Tp+ph/2)+')"');
  }else if(kind==='filler'){
    const s=mk(80,92,6,15),s2=mk(80,92,0,300);
    body=frame+line([[80,14],[84,11.7],[88,9.3],[92,7]],s,'var(--acc)')
      +line([[80,40],[84,58],[86,75],[88,105],[89,130],[90,165],[91,215],[92,280]],s2,'var(--kw)')
      +xt(s,[80,84,88,92],'%')+yt(s,[7,9,11,13])+yt(s2,[0,100,200,300],'',true)
      +txt(s.x(81),s.y(14.3),'CTE','start','var(--acc)',700)+txt(s.x(87.6),s2.y(150),'점도','end','var(--kw)',700)
      +txt(L+pw/2,H-6,'필러 함량 (무게 %)')+txt(L,14,'CTE (가상 단위)','start','var(--acc)')+txt(W-Rg,14,'점도 (가상 단위)','end','var(--kw)');
  }else if(kind==='spc'){
    const s=mk(0,21,94,106),ys=[100.4,99.6,100.9,99.2,100.1,100.7,99.5,100.3,99.8,100.6,99.4,100.2,100.0,100.5,101.0,101.6,102.1,102.7,103.2,103.8];
    const hl=(v,lab,c)=>`<line x1="${L}" x2="${L+pw}" y1="${s.y(v)}" y2="${s.y(v)}" stroke="${c}" stroke-dasharray="6 5"/>`+txt(L+pw-4,s.y(v)-5,lab,'end',c,700);
    body=frame+hl(104.5,'관리 상한','var(--kw)')+hl(95.5,'관리 하한','var(--kw)')+hl(100,'중심선','currentColor')
      +line(ys.map((y,i)=>[i+1,y]),s,'var(--acc)')+ys.map((y,i)=>`<circle cx="${s.x(i+1)}" cy="${s.y(y)}" r="3.5" fill="var(--acc)"/>`).join('')
      +xt(s,[1,5,10,15,20])+yt(s,[96,98,100,102,104])+txt(L+pw/2,H-6,'측정 순서 (로트)')+txt(L,14,'두께 (가상 단위)','start');
  }else if(kind==='stack'){
    const s=mk(4,20,60,100),ns=[4,8,12,16,20],f=p=>ns.map(n=>[n,100*Math.pow(p,n)]);
    body=frame+line(f(.995),s,'var(--ok)')+line(f(.99),s,'var(--acc)')+line(f(.98),s,'var(--kw)')
      +xt(s,ns,'단')+yt(s,[60,70,80,90,100],'%')
      +[[.995,'접합 1회 수율 99.5%','var(--ok)'],[.99,'99%','var(--acc)'],[.98,'98%','var(--kw)']].map(([p,l,c])=>txt(s.x(12.2),s.y(100*Math.pow(p,12))-9,l,'start',c,700)).join('')
      +txt(L+pw/2,H-6,'적층 단수')+txt(L,14,'적층 수율 (계산값)','start');
  }
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="연습용 그래프">${body}</svg><p class="small" style="text-align:center">연습용으로 만든 가상 그래프입니다.</p>`;
}
