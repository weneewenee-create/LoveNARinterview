
/* ---------- 홈 ---------- */
const view=()=>$('#view');
function leaveRun(){voiceStop();recStop();timerStop()}
function go(fn,...a){leaveRun();window.scrollTo(0,0);fn(...a)}
function ddayText(){
  const now=new Date(),a=new Date(now.getFullYear(),now.getMonth(),now.getDate()),n=Math.round((INTERVIEW-a)/864e5);
  return n>0?'면접 D-'+n:n===0?'면접 D-DAY':'면접 종료';
}
function openExternal(){
  const u=location.href;
  if(/KAKAOTALK/i.test(UA)){location.href='kakaotalk://web/openExternal?url='+encodeURIComponent(u);return}
  if(/Android/i.test(UA)){location.href='intent://'+u.replace(/^https?:\/\//,'')+'#Intent;scheme=https;package=com.android.chrome;end';return}
  toast('오른쪽 아래(또는 위)의 ··· 메뉴에서 "Safari로 열기"를 눌러 주세요.',6000);
}
function modeCard(no,id,title,desc,meta){return `<button class="mode" type="button" data-mode="${id}"><span class="no">${no}</span><h3>${title}</h3><p>${desc}</p><span class="meta">${meta}</span></button>`}
function infoRisk(){return `<details class="card"><summary>지원서에서 반드시 준비할 여섯 가지</summary><div class="body"><ul class="clean">
  <li><b>숫자가 없습니다.</b> "목표 스펙 이내"만 있습니다. 보안상 절댓값은 못 밝혀도, 상대값(몇 % 줄었다)과 판정 기준은 준비해야 합니다.</li>
  <li><b>단정 표현.</b> "완벽히 달성", "100% 전환", "강력한 무기", "비약적으로"는 근거를 묻는 질문을 부릅니다. 면접에서는 한 단계 낮춰 말하세요.</li>
  <li><b>오타.</b> "슬러지 조성"은 "슬러리 조성"입니다. 지적받으면 바로 인정하고 내용으로 넘어가세요.</li>
  <li><b>AI에 회사 데이터를 넣었다는 문장.</b> 실제로 어떤 환경에서 어떻게 썼는지 사실대로 답할 준비가 필요합니다.</li>
  <li><b>검증 방법.</b> 가설은 자세하지만 "어떻게 확인했는지"가 지원서에 없습니다. 가장 많이 파고들 지점입니다.</li>
  <li><b>압연과 몰딩의 차이.</b> 다른 점(선 접촉·연속 / 면 가압·열경화)을 먼저 인정한 뒤 공통점을 말해야 설득력이 생깁니다.</li>
  </ul><p class="small">각 항목은 "지원서 ①·②" 분야의 문항으로 연습할 수 있습니다.</p></div></details>`}
function infoHowto(){return `<details class="card"><summary>쓰는 법과 주의할 점</summary><div class="body"><ul class="clean">
  <li><b>말로 답하기</b>: PC는 Chrome, 아이폰은 Safari, 안드로이드는 Chrome에서 됩니다. 처음 누르면 마이크 허용을 묻습니다. 메신저 안에서 연 화면에서는 안 될 수 있습니다.</li>
  <li>음성 인식이 안 되면 답변 칸을 누르고 <b>키보드의 마이크 버튼</b>(받아쓰기)을 쓰세요. 결과는 같습니다.</li>
  <li><b>녹음해서 다시 듣기</b>는 PC에서 가장 잘 됩니다. 휴대폰에서는 음성 인식과 동시에 쓰면 한쪽이 끊길 수 있습니다.</li>
  <li>예시 답변의 <b class="kw">빨간 굵은 글씨</b>는 꼭 들어가야 할 핵심어, <mark class="fill">✎ 노란 칸</mark>은 본인 사실로 채워야 하는 부분입니다. 지원서에 없는 내용은 지어내지 않았습니다.</li>
  <li>예시 답변을 외우지 마세요. 핵심어만 기억하고 본인 말로 하는 편이 꼬리질문에 강합니다.</li>
  <li>연습이 끝나면 <b>답안 내보내기</b>로 복사해서 보내 주세요. 사람이 읽고 꼬리질문과 피드백을 더해 줄 수 있습니다.</li>
  <li>현 직장의 소재명, 조건값, 스펙 수치는 여기에도, 면접에서도 말하지 않는 것이 안전합니다.</li>
  </ul></div></details>`}

/* ---------- 질문·답안 노트 ---------- */
function bookItem(q,withPractice){
  const last=store.get('last.'+q.id);
  return `<details class="qitem" data-id="${q.id}"><summary><span class="qq">${esc(q.q)}<br><span class="tags" style="margin-top:6px">${tagHtml(q)}</span></span>${last?`<span class="last">${last.s}점</span>`:''}</summary>
  <div class="in">${q.chart?chartSvg(q.chart):''}
  ${(q.why||[]).length?`<div class="h4">면접관이 보려는 것</div>${q.why.map(w=>`<div class="why">${esc(w)}</div>`).join('')}`:''}
  ${(q.p||[]).length?`<div class="h4">답변 포인트</div><ul class="clean">${q.p.map(p=>`<li>${esc(p)}</li>`).join('')}</ul>`:''}
  <div class="h4">예시 답변 · 권장 ${mmss(q.sec)}</div><div class="model">${fmt(q.m)}</div>
  ${q.tip?`<div class="tip"><b>주의</b> ${esc(q.tip)}</div>`:''}
  ${(q.f||[]).length?`<div class="h4">이어질 수 있는 꼬리질문</div>${q.f.map(f=>`<div class="fq" style="cursor:default">${esc(f[0])}${f[1]?`<small>답변 방향: ${esc(f[1])}</small>`:''}</div>`).join('')}`:''}
  ${srcHtml(q.s)}
  ${withPractice?`<div class="row" style="margin-top:12px"><button class="btn pri" type="button" data-go="${q.id}">이 문항 연습하기</button></div>`:''}
  </div></details>`;
}
function catFilter(cur,withAll=true){return `<div class="filter">${withAll?`<button type="button" data-cat="all" class="${cur==='all'?'on':''}">전체</button>`:''}${CATS.map(([id,n])=>`<button type="button" data-cat="${id}" class="${cur===id?'on':''}">${n} ${D.Q.filter(q=>q.c===id).length}</button>`).join('')}</div>`}
function renderBook(){
  const st={cat:'all',kw:'',fill:false};
  view().innerHTML=`<section class="hero"><h1>질문·답안 노트</h1><p>전체 ${D.Q.length}문항입니다. 질문을 누르면 의도, 답변 포인트, 예시 답변이 펼쳐집니다.</p></section>
    <input class="search" id="bq" type="search" placeholder="질문이나 답변에서 찾기 (예: EMC, 휨, 갈등)" aria-label="질문 검색">
    <div id="bf"></div>
    <label class="small row" style="margin:2px 0 8px"><input type="checkbox" id="bfill"> 직접 채울 칸이 있는 문항만 보기</label>
    <div id="bl"></div>`;
  const draw=()=>{
    $('#bf').innerHTML=catFilter(st.cat);
    $$('#bf button').forEach(b=>b.onclick=()=>{st.cat=b.dataset.cat;draw()});
    const kw=st.kw.trim().toLowerCase();
    const list=D.Q.filter(q=>(st.cat==='all'||q.c===st.cat)&&(!kw||(q.q+q.m).toLowerCase().includes(kw))&&(!st.fill||/\[직접 채울 것/.test(q.m)));
    $('#bl').innerHTML=list.length?list.map(q=>bookItem(q,true)).join(''):'<p class="small">조건에 맞는 문항이 없습니다.</p>';
    $$('#bl [data-go]').forEach(b=>b.onclick=()=>startFree([b.dataset.go]));
  };
  $('#bq').oninput=e=>{st.kw=e.target.value;draw()};
  $('#bfill').onchange=e=>{st.fill=e.target.checked;draw()};
  draw();
}

/* ---------- 내 숫자 노트 ---------- */
const NOTE_ITEMS=[
  ['면접일 기준 재직 기간, 입사 가능 시기','예: 2년 ○개월 / 합격 후 ○주'],
  ['연신율 오차 건 — 지표 이름, 개선 전→후(상대값), 판정 기준(샘플 수·기간)','절댓값 대신 "약 ○○% 감소"처럼'],
  ['연신율 오차 건 — 가설을 확인한 방법(어떤 측정, 어떤 비교 실험)','지원서에 없어서 가장 많이 물을 부분'],
  ['EPC 게인 조정 건 — 내가 직접 한 것 / 협업한 것, 정렬 개선 폭(상대값)',''],
  ['Curl 건 — 검증 방법, 다단 압축 조건을 정한 근거, 개선 폭(상대값)',''],
  ['AI 사용 환경 — 도구 이름, 사내·외부 구분, 무엇을 입력했는지','보안 질문 대비. 사실대로'],
  ['AI의 답이 틀렸던 사례 한 가지와 걸러 낸 방법',''],
  ['파일럿 라인 — 주요 불량 유형, 1순위 불량, 초기 수율 개선 폭(상대값)',''],
  ['수분 관리 가이드라인 — 실제로 한 일과 전후 변화',''],
  ['신뢰성 평가 — 실제로 수행한 항목',''],
  ['반도체 공부 — 읽은 글·책·강의 이름, 가장 어려웠던 개념',''],
  ['인성 사례 — 갈등 / 실패 / 협업 / 남들이 꺼린 일 (한 줄씩)',''],
  ['부족한 점 한 가지와 지금 하고 있는 보완 방법',''],
  ['면접 직전 1주일의 반도체 뉴스 한 가지와 내 생각','면접 전날 채우기']
];
function renderNotes(){
  const n=store.get('notes',{});
  view().innerHTML=`<section class="hero"><h1>내 숫자 노트</h1><p>예시 답변의 노란 칸을 채우기 위한 준비 노트입니다. 여기 적은 내용은 이 기기의 브라우저에만 저장되고 어디로도 전송되지 않습니다. 그래도 현 직장의 절댓값·소재명 대신 상대값으로 적어 두세요.</p></section>
  ${NOTE_ITEMS.map((it,i)=>`<div class="card" style="margin:10px 0"><label for="n${i}" style="font-weight:700">${i+1}. ${esc(it[0])}</label><textarea class="sm" id="n${i}" placeholder="${esc(it[1])}" style="margin-top:8px">${esc(n[i]||'')}</textarea></div>`).join('')}
  <div class="row"><button class="btn pri" type="button" id="nCopy">노트 전체 복사</button><button class="btn" type="button" id="nHome">처음으로</button></div>`;
  $$('textarea',view()).forEach((ta,i)=>ta.oninput=()=>{const cur=store.get('notes',{});cur[i]=ta.value;store.set('notes',cur)});
  $('#nCopy').onclick=()=>copyText(NOTE_ITEMS.map((it,i)=>`${i+1}. ${it[0]}\n${(store.get('notes',{})[i]||'(비어 있음)')}`).join('\n\n'));
  $('#nHome').onclick=()=>go(renderHome);
}

/* ---------- 기록·내보내기 ---------- */
const MODE_NAME={deep:'심층 인터뷰',ask:'A!SK 모의',pt:'문제해결 PT',gd:'Group Discussion',free:'자유 연습'};
function exportText(sess){
  const d=new Date(sess.at),pad=n=>String(n).padStart(2,'0');
  let out=`[Half-Day 면접 연습 기록] ${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())} · ${sess.title}\n`;
  if(sess.avg!=null)out+=`자동 점수 평균 ${sess.avg}점 (참고용)\n`;
  if(sess.pt)out+=`\n[PT 준비 메모]\n${sess.pt}\n`;
  let n=0;
  for(const r of sess.items){
    out+='\n'+(r.follow?'  ↳ 꼬리질문: ':`Q${++n}. `)+r.q+'\n';
    out+=`${r.follow?'  ':''}(사용 ${mmss(r.used)} / 권장 ${mmss(r.sec)}${r.score!=null?` / 자동 점수 ${r.score}`:''})\n`;
    out+=`${r.follow?'  ':''}답변: ${r.text||'(답변 없음)'}\n`;
  }
  return out;
}
async function copyText(t){
  try{await navigator.clipboard.writeText(t);toast('복사했어요. 메신저에 붙여넣기 하면 됩니다.')}
  catch(e){const ta=document.createElement('textarea');ta.value=t;document.body.appendChild(ta);ta.select();try{document.execCommand('copy');toast('복사했어요.')}catch(e2){toast('복사가 안 돼요. 아래 내용을 길게 눌러 직접 복사해 주세요.')}ta.remove()}
}
async function shareText(t){if(navigator.share){try{await navigator.share({title:'면접 연습 기록',text:t});return}catch(e){if(e&&e.name==='AbortError')return}}copyText(t)}
function renderHist(){
  const h=store.get('hist',[]);
  view().innerHTML=`<section class="hero"><h1>연습 기록</h1><p>최근 연습 ${h.length}회가 이 기기에 남아 있습니다. 복사해서 보내면 답변을 읽고 피드백을 받을 수 있습니다.</p></section>
  ${h.length?h.map((s,i)=>`<div class="card" style="margin:10px 0"><div class="row"><b>${esc(s.title)}</b><span class="small">${new Date(s.at).toLocaleString('ko-KR',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'})} · ${s.items.length}개 답변${s.avg!=null?' · 평균 '+s.avg+'점':''}</span></div>
    <div class="row" style="margin-top:10px"><button class="btn pri" type="button" data-cp="${i}">복사</button><button class="btn" type="button" data-sh="${i}">공유</button><button class="btn ghost" type="button" data-rm="${i}">삭제</button></div></div>`).join(''):'<p class="small">아직 기록이 없습니다. 실전 모드를 한 번 끝내면 여기에 쌓입니다.</p>'}
  <div class="row" style="margin-top:14px"><button class="btn" type="button" id="hHome">처음으로</button>${h.length?'<button class="btn ghost" type="button" id="hAll">전체 복사</button>':''}</div>`;
  $$('[data-cp]').forEach(b=>b.onclick=()=>copyText(exportText(h[b.dataset.cp])));
  $$('[data-sh]').forEach(b=>b.onclick=()=>shareText(exportText(h[b.dataset.sh])));
  $$('[data-rm]').forEach(b=>b.onclick=()=>{if(confirm('이 기록을 지울까요?')){h.splice(+b.dataset.rm,1);store.set('hist',h);renderHist()}});
  $('#hHome').onclick=()=>go(renderHome);
  const a=$('#hAll');if(a)a.onclick=()=>copyText(h.map(exportText).join('\n\n==========\n\n'));
}
