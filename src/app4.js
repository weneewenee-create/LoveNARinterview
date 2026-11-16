
/* ================= 면접 흐름 안내 · 풀코스 · AI 활용 훈련 ================= */
const TIER={A:'공식 자료',B:'담당자 설명 보도',C:'다른 전형 응시 후기',D:'추정'};
const tier=(k,t,src)=>`<li><span class="tier ${k}">${TIER[k]}</span>${t}${src?' '+src.split(',').map(x=>{const s=D.SRC[x];return s&&s[1]?`<a class="small" href="${esc(s[1])}" target="_blank" rel="noopener noreferrer">[출처]</a>`:''}).join(''):''}</li>`;
const FLOW=[
 {n:'0',t:'도착과 안내',mode:null,
  known:[['A','면접은 11월 중 진행하고, 자세한 내용은 면접 대상자에게 따로 안내한다고 공고에 적혀 있습니다.','gong'],['B','이천과 청주를 나누지 않고 통합해서 선발하며, 근무지는 2순위까지 반영한다고 설명했습니다.','econo']],
  unknown:['장소, 집합 시간, 전체 소요 시간, 조 편성, 복장','네 구성의 실제 순서와 구성별 시간. 아래 순서는 공고와 설명회에서 소개한 순서입니다'],
  tips:['면접 안내 메일을 다시 읽고 장소, 시간, 준비물을 확인하세요. 이 페이지와 다르면 메일이 맞습니다.','반나절 동안 집중해야 합니다. 전날이 아니라 이틀 전쯤 풀코스 리허설을 한 번 해 보면 어디서 지치는지 알 수 있습니다.']},
 {n:'1',t:'문제해결 PT — 과제 풀기',mode:'pt',
  known:[['A','면접장에 비치된 PC에서 AI 에디터를 기반으로 LLM을 활용해 직무 시나리오 과제를 수행합니다.','nr_thw'],['B','PC에 직무 시나리오가 제시되면 전용 LLM 등을 써서 해결 방안을 내고 답안을 제출합니다.','etnews'],['B','평가의 핵심은 AI를 얼마나 능숙하게 쓰는지가 아니라, 문제를 정확히 정의하고 본질을 파악해 논리적으로 해결하는 과정이라고 했습니다.','etnews,inews'],['B','신입에게 대단한 직무 역량이나 AI 활용 능력을 기대하지 않으며, 가진 지식을 넓혀 문제 해결에 쓸 수 있는지를 본다고 했습니다.','econo']],
  unknown:['과제의 수와 유형, 준비 시간','LLM의 종류, 질문 횟수 제한, 인터넷 검색 가능 여부','답안의 형식(문서인지 슬라이드인지)'],
  tips:['처음 몇 분은 AI 없이 문제를 한 문장으로 정의하고 내 가설을 먼저 적습니다.','AI에게는 답이 아니라 "내가 놓친 원인"과 "내 논리의 약점"을 묻습니다.','AI의 답에 나온 숫자는 과제 자료와 하나씩 대조합니다. 버린 답과 이유를 기억해 두면 질의응답에 씁니다.']},
 {n:'2',t:'심층 인터뷰 — PT 발표와 지원서 질문',mode:'deep',
  known:[['B','제출한 답안을 간략히 발표하고 질의응답을 합니다. 이어서 지원서에 쓴 경험을 깊이 묻습니다.','etnews,econo'],['B','지원서에 적은 경험, 연구, 수상, 경력, 어학까지 종합해서 본다고 설명회에서 소개했습니다.','half1'],['A','석사·박사는 이 단계에서 PT 발표를 합니다. 학사는 해당하지 않습니다.','gong'],['C','이전 통합 면접(2026 상반기)은 면접관 3명에 지원자 1명, 30~40분이었다는 정리가 있습니다. 이번 인원과 시간은 확인되지 않았습니다.','linkhd']],
  unknown:['면접관 수와 시간, PT 발표에 주어지는 시간'],
  tips:['PT 질문은 "왜 그렇게 정의했나, 왜 그 순서인가, AI의 답 중 무엇을 버렸나"로 모일 가능성이 높습니다.','지원서의 모든 문장에 "어떻게 확인했나, 수치는, 본인이 한 부분은"을 준비합니다.','모르는 것은 모른다고 말하고, 아는 데서 출발해 생각을 이어 가는 모습을 보여 주세요.']},
 {n:'3',t:'Group Discussion',mode:'gd',
  known:[['A','정답이 없는 인문학 주제로 그룹 토론을 합니다.','nr_thw'],['B','다양한 관점, 시너지, 협업에서의 역할을 평가한다고 했습니다.','etnews'],['B','서로 다른 의견을 어떻게 받아들이고 협업으로 시너지를 만드는지를 본다고 했습니다.','inews']],
  unknown:['조 인원, 시간, 주제','찬반을 지정하는지, 사회자가 있는지'],
  tips:['이기는 자리가 아닙니다. 다른 사람의 말을 받아서 내 의견을 고치는 장면이 한 번은 있어야 합니다.','받아 주기 → 잇기 → 정리하기의 세 가지 말을 준비합니다.','말이 적은 사람에게 기회를 넘기는 것도 협업 역할입니다.']},
 {n:'4',t:'A!SK — 화면 앞에서 혼자 답하기',mode:'ask',
  known:[['A','면접장에 마련된 별도 공간에서 비대면 영상 인터뷰를 봅니다.','gong'],['B','직무 기초 지식과 인성 질문에 답하며, 정답보다 가진 지식으로 풀어 가는 과정을 본다고 했습니다. 이전에는 집에서 봤지만 이번에는 면접의 일부입니다.','etnews,econo'],['C','2026 상반기 후기: 공통 3문항과 전공 4문항. 질문마다 준비 1분(건너뛸 수 있음), 답변은 공통 30초~1분, 전공 30초~3분. 전공은 직무기술서 수준의 개념 질문이었고 전체 약 15분이 걸렸습니다.','ask26'],['C','2025 하반기 후기: 준비 90초, 답변은 문항에 따라 1~3분.','ask25']],
  unknown:['이번에도 문항 수와 시간이 이전과 같은지'],
  tips:['적어 둔 답을 읽지 말고 화면을 보고 말합니다.','시간이 끝나면 잘리므로 결론을 첫 문장에 둡니다.','모르는 문제가 나오면 아는 개념에서 출발해 추론하는 과정을 말합니다.']},
 {n:'5',t:'끝난 뒤',mode:null,
  known:[['C','이전 채용에서는 면접 약 2주 뒤에 결과가 나온 사례가 많았다는 정리가 있습니다. 공식 발표일은 공개되지 않았습니다.','linkhd'],['A','입사일은 2027년 1월 4일입니다.','gong']],
  unknown:['이번 결과 발표일'],
  tips:['끝난 날 저녁에 받은 질문을 모두 적어 두세요. 다음 기회에도 쓰입니다.']}
];
function renderFlow(){
  view().innerHTML=`<section class="hero"><h1>면접 흐름 따라가기</h1><p>도착부터 A!SK까지, 반나절이 어떻게 흘러가는지 순서대로 정리했습니다. 문장마다 근거의 종류를 표시했습니다. <span class="tier A">공식 자료</span>는 공고와 뉴스룸, <span class="tier B">담당자 설명 보도</span>는 채용 담당자의 설명을 옮긴 기사, <span class="tier C">다른 전형 응시 후기</span>는 이전 면접이나 해커톤 예선을 본 사람의 경험담입니다.</p></section>
  <div class="notice"><b>실제 Half-Day 면접 후기는 아직 찾지 못했습니다.</b> 올해 하반기에 처음 생긴 방식이라 ${esc(D.built)} 기준으로 공개된 응시 후기가 없습니다. 아래에서 "아직 모르는 것"으로 적은 내용은 면접 안내 메일로 확인해야 합니다.</div>
  <div class="tl">${FLOW.map(f=>`<div class="tl-item card" data-n="${f.n}"><h3>${esc(f.t)}</h3>
    <div class="h4">확인된 것</div><ul class="clean">${f.known.map(k=>tier(k[0],esc(k[1]),k[2])).join('')}</ul>
    <div class="h4">아직 모르는 것</div><ul class="clean">${f.unknown.map(u=>`<li>${esc(u)}</li>`).join('')}</ul>
    <div class="h4">이렇게 준비</div><ul class="clean">${f.tips.map(u=>`<li>${esc(u)}</li>`).join('')}</ul>
    ${f.mode?`<div class="row" style="margin-top:10px"><button class="btn pri" type="button" data-mode="${f.mode}">이 단계 연습하기</button></div>`:''}</div>`).join('')}</div>
  <div class="sec-title">AI는 어떤 식으로 나올까 — 근거와 판단</div>
  <div class="card"><div class="h4" style="margin-top:0">확인된 것</div><ul class="clean">
    ${tier('A','과제는 전용 LLM이 들어 있는 AI 에디터에서 풀고, 답안을 낸 뒤 발표와 질의응답을 합니다.','nr_thw,etnews')}
    ${tier('A','회사는 올해 AI 해커톤 온라인 예선에서 평가 도구를 써서 문제 정의, AI 활용, 결과 검증 과정을 함께 본다고 밝혔습니다.','hack')}
    ${tier('B','그 도구 가운데 하나는 보도에 따르면 대화와 프롬프트, 검증 기록까지 수집해 과정을 평가합니다. 면접에 같은 도구를 쓰는지는 확인되지 않았습니다.','cofa')}
    ${tier('C','그 예선의 한 응시자는 질문 횟수 제한(70회), 질문 사이 대기(약 30초), 최근 대화 10개만 기억, 엉뚱한 답을 겪었다고 적었습니다. 면접의 LLM이 같다는 근거는 없습니다.','hackblog')}
    ${tier('B','회사가 생산 현장에서 그리는 방식은, 이상이 생기면 AI가 원인과 대응 방안을 내놓고 사람은 마지막 판단을 맡는 것입니다.','forum')}
    ${tier('A','장비 이력을 요약해 불량 조치를 안내하는 AI를 이미 현장에서 쓰고 있다고 소개했습니다.','gaia')}
    ${tier('C','예전 PT 면접은 주제를 받고 약 30분 준비한 뒤 발표하고 질문을 받는 방식이었다는 후기가 있습니다.','oldpt')}
    </ul><div class="h4">여기서 나온 판단 <span class="tier D">추정</span></div><ul class="clean">
    <li><b>과제 유형은 다섯 가지 안에서 나올 가능성이 높습니다.</b> ① 불량 원인 분석 ② 여러 안 중 의사결정 ③ 평가·실험 계획 ④ 표나 기록 해석 ⑤ 낯선 기술을 빨리 파악해 보고. 문제해결 PT 연습의 시나리오 6개가 이 다섯 유형에 하나씩 대응합니다.</li>
    <li><b>LLM이 만능이 아닐 수 있습니다.</b> 질문 횟수나 시간이 제한될 수 있고, 일반론이나 틀린 수치를 줄 수 있습니다. 질문을 아껴 쓰고, 조건을 매번 다시 넣고, 답을 검증하는 연습이 필요합니다.</li>
    <li><b>AI와 주고받은 과정이 질문거리가 될 수 있습니다.</b> "무엇을 물었고 무엇을 버렸는지"를 설명할 수 있게, 기록이 남는다고 생각하고 쓰는 편이 안전합니다.</li>
    <li><b>AI에게 답안을 통째로 쓰게 하는 것이 가장 위험합니다.</b> 과제를 어떻게 정의하고 푸는지를 보겠다고 했으므로, 문제 정의와 우선순위, 최종 판단은 본인의 말이어야 합니다.</li></ul>
    <div class="row" style="margin-top:10px"><button class="btn pri" type="button" data-mode="aiv">AI 답 검증 훈련</button><button class="btn" type="button" data-mode="prm">질문 쓰기 연습</button><button class="btn" type="button" data-mode="full">풀코스 리허설</button></div></div>${backRow}`;
  $$('[data-mode]',view()).forEach(b=>b.onclick=()=>go(renderSetup,b.dataset.mode));
  $('#backHome').onclick=()=>go(renderHome);
}

/* ---------- 카메라(내 모습 보기, 녹화·전송 없음) ---------- */
const CAM={s:null};
async function camOn(){if(CAM.s)return CAM.s;try{CAM.s=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'},audio:false})}catch(e){CAM.s=null;toast('카메라를 켤 수 없어요. 권한을 확인하거나 이 옵션을 끄고 시작해 주세요.',5000)}return CAM.s}
function camOff(){if(CAM.s){CAM.s.getTracks().forEach(t=>t.stop());CAM.s=null}}
function camAttach(){if(!S.opts.cam)return;camOn().then(s=>{const v=$('#cam');if(v&&s)v.srcObject=s})}

/* ---------- 홈(새 구성) ---------- */
function renderHome(){
  camOff();
  const nLast=D.Q.filter(q=>store.get('last.'+q.id)).length;
  view().innerHTML=`
  <section class="hero"><h1>반나절 면접, 구성 그대로 연습하기</h1>
    <p>Half-Day 면접이 어떻게 흘러가는지 먼저 파악하고, 문제해결 PT · 심층 인터뷰 · Group Discussion · A!SK를 순서대로 연습합니다. 로그인은 필요 없고, 답변은 이 기기에만 저장됩니다.</p></section>
  ${inApp?`<div class="notice"><b>지금 메신저 안에서 열려 있어요.</b> 이 상태에서는 "말로 답하기"가 안 될 수 있습니다. Chrome이나 Safari에서 열어 주세요.<div class="row" style="margin-top:8px"><button class="btn pri" id="extBtn" type="button">기본 브라우저로 열기</button></div></div>`:''}
  ${!SR&&!inApp?`<div class="notice"><b>이 브라우저는 음성 인식을 지원하지 않아요.</b> 답변 칸을 누른 뒤 키보드의 마이크(받아쓰기) 버튼으로 말하면 똑같이 연습할 수 있습니다. PC에서는 Chrome을 권장합니다.</div>`:''}
  <div class="sec-title">먼저 — 면접이 어떻게 흘러가는지</div>
  <div class="grid">
    ${modeCard('안내','flow','면접 흐름 따라가기','도착부터 A!SK까지 순서대로. 확인된 것과 아직 모르는 것을 나눠서, AI가 어떻게 나올지에 대한 판단까지 정리했습니다.','공고 · 뉴스룸 · 담당자 설명 · 후기 구분')}
    ${modeCard('리허설','full','풀코스 리허설','PT 과제 → 발표와 질의 → 지원서 질문 → 토론 → A!SK를 쉬지 않고 한 번에 해 봅니다.','약 60~80분 · 결과는 끝난 뒤 한꺼번에')}
  </div>
  <div class="sec-title">단계별 연습</div>
  <div class="grid">
    ${modeCard('STEP 1','pt','문제해결 PT','직무 시나리오를 읽고 모의 AI와 함께 답안을 정리한 뒤, 발표하고 면접관의 반박에 답합니다.','시나리오 '+D.PT.length+'개 · 준비 15~40분 · 발표 3분 · 후속 질문')}
    ${modeCard('STEP 2','deep','심층 인터뷰','지원서를 파고드는 질문과 꼬리질문. 답할 때마다 채점과 예시 답변을 봅니다.','7문항 약 20분 · 13문항 약 40분')}
    ${modeCard('STEP 3','gd','Group Discussion','첫 발언 → 상대 의견 받아 잇기 → 충돌 중재 → 정리 발언을 혼자 연습합니다.','주제 '+D.GD.length+'개 · 약 8분')}
    ${modeCard('STEP 4','ask','A!SK 모의','질문 → 준비 시간 → 답변, 시간이 끝나면 자동으로 넘어갑니다. 이전 응시 후기의 방식에 맞췄습니다.','공통 3 + 직무 4문항 · 약 15~20분')}
  </div>
  <div class="sec-title">AI 활용 훈련</div>
  <div class="grid">
    ${modeCard('검증','aiv','AI 답 검증 훈련','AI의 답에서 틀린 문장, 근거 없는 수치, 비약을 찾아냅니다. "AI가 틀린 적 있나" 질문의 재료가 됩니다.',D.AIV.length+'문제 · 문제당 2~3분')}
    ${modeCard('질문','prm','질문 쓰기 연습','같은 과제라도 질문에 따라 답이 달라집니다. 나쁜 질문과 좋은 질문을 비교하며 직접 써 봅니다.',D.PRM.length+'개 상황')}
  </div>
  <div class="sec-title">공부 모드</div>
  <div class="grid">
    ${modeCard('연습','free','자유 연습','분야를 골라 한 문항씩. 약한 분야만 반복할 때 씁니다.','전체 '+D.Q.length+'문항 · 연습한 문항 '+nLast+'개')}
    ${modeCard('읽기','book','질문·답안 노트','모든 질문의 의도, 답변 포인트, 예시 답변(핵심어는 빨간 굵은 글씨)을 한눈에.','기출 · 단골 · 지원서 · 예상 구분')}
    ${modeCard('준비','notes','내 숫자 노트','예시 답변의 노란 칸(직접 채울 것)을 미리 정리해 두는 곳입니다.','이 기기에만 저장')}
    ${modeCard('기록','hist','연습 기록·내보내기','지난 연습의 답변을 복사해서 보내면 피드백을 받을 수 있습니다.','최근 20회 보관')}
  </div>
  <div class="sec-title">먼저 읽어 두기</div>
  ${infoRisk()}${infoHowto()}${infoLimits()}
  <div class="foot">이 페이지는 검색에 노출되지 않도록 설정되어 있고, 입력한 내용은 어디로도 전송되지 않습니다. 자동 채점은 핵심어와 길이를 보는 참고용이며, 실제 평가 기준이 아닙니다. · 자료 정리일 ${esc(D.built)}</div>`;
  $$('.mode').forEach(b=>b.onclick=()=>go(renderSetup,b.dataset.mode));
  const e=$('#extBtn');if(e)e.onclick=openExternal;
}
function infoLimits(){return `<details class="card"><summary>이 자료의 근거와 한계</summary><div class="body"><ul class="clean">
  <li>면접 방식에 대한 설명은 <span class="tier A">공식 자료</span>(채용 공고, 뉴스룸), <span class="tier B">담당자 설명 보도</span>, <span class="tier C">다른 전형 응시 후기</span>로 나눠 표시했습니다. 취업 사이트와 학원의 예측 글은 근거로 쓰지 않았습니다.</li>
  <li>Half-Day 면접은 2026년 하반기에 처음 도입되어, 정리 시점까지 <b>실제 응시 후기는 찾지 못했습니다</b>. PT 시나리오, 토론 주제, 모의 AI의 답, 그래프 문항은 모두 직접 만든 예상입니다.</li>
  <li>질문의 <span class="tag t-기출">기출</span>은 이전 면접 후기에서 확인된 질문, <span class="tag t-단골">단골</span>은 현직자가 자주 나온다고 꼽은 주제, <span class="tag t-지원서">지원서</span>는 제출한 지원서에서 만든 질문, <span class="tag t-예상">예상</span>은 올해 바뀐 방식에 맞춰 만든 질문입니다.</li>
  <li>기술 설명은 SK하이닉스 뉴스룸의 공개 글과 일반 전공 지식을 근거로 했습니다. 실제 라인의 설비와 조건은 공개되지 않았으니 단정해서 말하지 마세요.</li>
  <li>회사 소식(투자, 양산 일정 등)은 바뀔 수 있습니다. 면접 전날 뉴스룸에서 다시 확인하세요.</li>
  </ul></div></details>`}

/* ---------- A!SK: 이전 응시 후기의 방식에 맞춘 구성 ---------- */
function buildAsk(o){
  const p1=['I01',...pick(['I02','F01','F04','F05'],2)];
  const tech=o.mfg?[...pick(['P01','P03','P04','P05','P09','P12'],2),...pick(['M01','M02','M04'],1)]:pick(['P01','P02','P03','P04','P05','P07','P09','P10','P12','P13','P17'],3);
  const vis=pick(o.mfg?['V3','V4']:['V1','V2','V4'],1);
  return [...p1.map(id=>[id,'Part 1 · 공통',60,60]),...tech.map(id=>[id,'Part 2 · 직무',180,90]),...vis.map(id=>[id,'Part 2 · 직무 (그래프 해석)',180,120])]
    .map(([id,label,sec,scoreSec])=>qStep(id,{sec,scoreSec,prep:o.prep,auto:true,defer:true,label,minSec:o.lock?30:0}));
}

/* ---------- 문제해결 PT: 단계 구성과 모의 AI ---------- */
const PT_AIQ=[
 ['과제를 풀 때 AI에게 가장 먼저 무엇을 물었고, 왜 그 질문이었습니까?','문제를 먼저 정의하고 내 가설을 준 뒤 빈틈을 물었다는 순서로. 답을 통째로 맡기지 않았다는 점.'],
 ['AI의 답 중 받아들이지 않은 것이 있습니까? 이유는 무엇입니까?','자료와 다른 수치, 근거 없는 단정, 기한을 무시한 계획처럼 구체적인 예와 버린 이유.'],
 ['AI 없이 같은 과제를 풀었다면 결과가 어떻게 달라졌겠습니까?','가설의 폭은 줄었겠지만 판단 기준과 결론은 같다. AI는 폭을 넓히는 데, 판단은 본인이.'],
 ['AI의 답이 맞는지는 어떻게 확인했습니까?','과제 자료의 수치와 대조, 아는 원리와 맞는지 확인, 계산은 직접 다시. 확인하지 못한 것은 발표에 쓰지 않았다.']];
function ptStepsOf(pt,min,nScen,nAi,deferAll){
  const fs=[...pick(pt.f,Math.min(nScen,pt.f.length)).map(f=>[f,pt.id]),...pick(PT_AIQ,nAi).map(f=>[f,'AIQ'])];
  return [{type:'ptprep',pt,sec:min*60},
    {type:'q',q:{id:pt.id+'~pres',q:'준비한 내용을 3분 안에 발표해 보세요. 권고안(결론)부터 말하고, 근거 → 검증 계획 → 리스크 순서로.',ptPres:true},sec:180,defer:true,label:'발표'},
    ...fs.map(([f,src],i)=>({type:'q',q:{id:pt.id+'~f'+i,q:f[0],hint:f[1],isFollow:true},sec:60,defer:!!deferAll,label:`면접관의 후속 질문 ${i+1} / ${fs.length}${src==='AIQ'?' · AI 사용 과정':''}`}))];
}
function startPt(pt,min){startSession('pt','문제해결 PT',ptStepsOf(pt,min,4,2,false),{pt,aiLog:[]})}
let AI_DELAY=2200;const AI_LIMIT=10;
const AI_KIND={ok:'쓸 만한 답',num:'자료와 다른 수치',sure:'근거 없는 단정',limit:'조건을 무시한 답',gen:'일반론'};
const AI_FALLBACK=['','', 'gen','질문이 넓어서 일반적인 답만 드릴 수 있습니다. 문제를 풀 때는 현상을 정리하고, 원인을 분석하고, 대책을 세우는 순서가 일반적입니다.','질문에 과제의 조건이 없으면 실제 LLM도 이런 일반론을 줍니다. 자료의 수치와 알고 싶은 것을 넣어 다시 물어보세요.'];
function ptAiHtml(pt){
  if(!pt.ai)return '';
  return `<div class="card" style="margin-top:12px"><div class="h4" style="margin-top:0">모의 AI — 남은 질문 <span id="aiLeft">${AI_LIMIT}</span>회</div>
  <p class="small">실제 LLM이 아니라 미리 써 둔 답이 나옵니다. 일부 답에는 일부러 틀린 수치, 근거 없는 단정, 조건 무시를 섞었습니다. 답마다 "쓴다 / 그대로는 안 쓴다"를 골라 두면, 끝난 뒤에 어떤 답이 함정이었는지 알려 드립니다.</p>
  <div class="tags" style="margin:8px 0">${pt.ai.map((a,i)=>`<button class="btn" type="button" data-ai="${i}" style="min-height:38px;padding:6px 10px;font-size:14px;font-weight:500">${esc(a[1])}</button>`).join('')}</div>
  <div class="row"><input class="search" id="aiQ" style="flex:1;min-width:0" placeholder="직접 질문 입력 (가장 가까운 답을 찾아 줍니다)" aria-label="모의 AI에게 질문"><button class="btn" id="aiAsk" type="button">묻기</button></div><div id="aiLog"></div></div>`;
}
function bindPtAi(pt){
  if(!pt.ai)return;const log=S.opts.aiLog||(S.opts.aiLog=[]);
  const draw=()=>{$('#aiLeft').textContent=Math.max(0,AI_LIMIT-log.length);
    $('#aiLog').innerHTML=log.slice().reverse().map((e,ri)=>{const i=log.length-1-ri;return `<div class="ai-msg"><div class="q">나: ${esc(e.q)}</div>${e.wait?'<span class="small">답을 만드는 중…</span>':`<div>${esc(e.a[3])}</div><div class="row" style="margin-top:8px"><button class="btn ${e.use===true?'pri':''}" type="button" data-use="${i}:1" style="min-height:34px;padding:4px 10px;font-size:13px">쓴다</button><button class="btn ${e.use===false?'pri':''}" type="button" data-use="${i}:0" style="min-height:34px;padding:4px 10px;font-size:13px">그대로는 안 쓴다</button></div>`}</div>`}).join('');
    $$('#aiLog [data-use]').forEach(b=>b.onclick=()=>{const [i,v]=b.dataset.use.split(':');log[+i].use=v==='1';draw()})};
  const ask=(q,a)=>{if(log.length>=AI_LIMIT){toast('질문 횟수를 다 썼어요. 실제 면접에서도 질문 수가 제한될 수 있습니다.');return}
    if(log.some(e=>e.wait)){toast('앞 질문의 답을 기다리는 중이에요.');return}
    const e={q,a,wait:true,use:null};log.push(e);draw();setTimeout(()=>{e.wait=false;if($('#aiLog'))draw()},AI_DELAY)};
  $$('[data-ai]').forEach(b=>b.onclick=()=>ask(pt.ai[+b.dataset.ai][1],pt.ai[+b.dataset.ai]));
  const free=()=>{const el=$('#aiQ'),q=el.value.trim();if(!q)return;const hit=pt.ai.find(a=>{try{return new RegExp(a[0],'i').test(q)}catch(e){return false}});ask(q,hit||AI_FALLBACK);el.value=''};
  $('#aiAsk').onclick=free;$('#aiQ').onkeydown=e=>{if(e.key==='Enter')free()};draw();
}
function aiLogHtml(){
  const log=(S.opts.aiLog||[]).filter(e=>!e.wait);if(!S.opts.pt||!S.opts.pt.ai)return '';
  if(!log.length)return `<div class="card" style="margin:12px 0"><div class="h4" style="margin-top:0">모의 AI 사용 기록</div><p class="small">이번에는 모의 AI에게 질문하지 않았습니다. 실제 면접에서 AI를 쓰지 않아도 되지만, 한 번쯤은 "내가 놓친 원인"을 물어보는 연습을 해 보세요.</p></div>`;
  const judged=log.filter(e=>e.use!==null),right=judged.filter(e=>(e.a[2]==='ok')===e.use).length;
  return `<div class="card" style="margin:12px 0"><div class="h4" style="margin-top:0">모의 AI 사용 기록 — 질문 ${log.length}회${judged.length?` · 판단 ${right} / ${judged.length} 적중`:''}</div>
  ${log.map(e=>{const ok=e.a[2]==='ok',mine=e.use===null?'판단 안 함':(e.use?'쓴다':'그대로는 안 쓴다'),hit=e.use!==null&&ok===e.use;
    return `<div class="ai-msg"><div class="q">${esc(e.q)}</div><div class="small" style="margin-bottom:4px">${esc(e.a[3])}</div><span class="kwchip ${ok?'hit':'miss'}" style="${ok?'':'border-color:var(--kw);color:var(--kw);border-style:solid;font-weight:700'}">${esc(AI_KIND[e.a[2]])}</span> <span class="small">내 판단: ${mine}${e.use!==null?(hit?' ✓':' — 다시 보기'):''}</span><p style="margin:6px 0 0">${esc(e.a[4])}</p></div>`}).join('')}
  <p class="small">"쓸 만한 답"도 그대로 옮기라는 뜻은 아닙니다. 자료와 대조하고 본인 말로 바꿔야 합니다.</p></div>`;
}

/* ---------- Group Discussion: 중재 장면 추가 ---------- */
GD_CHECK.mediate=[['양쪽 의견을 각각 요약함',/A|B|한쪽|다른 쪽|두 분|말씀|의견은/],['공통점이나 접점을 찾음',/공통|둘 다|모두|같은|접점|함께/],['다음 논의를 제안함',/어떨까요|제안|정하|나눠|기준|먼저/]];
function gdStepsOf(g,deferAll){
  const opp=pick(g.opp,2),topic=`<div class="why"><b>주제</b> ${esc(g.topic)}</div>`;
  const card=(t,who)=>`<div class="opp"><small>${who||'다른 지원자의 발언'}</small>${esc(t)}</div>`;
  const mk=(kind,n,q,sec,context,label)=>({type:'q',q:{id:g.id+'~'+n,q,gd:kind},sec,context,label,defer:!!deferAll});
  return [{type:'think',g,sec:60},
    mk('first',1,'첫 발언입니다. 본인의 입장과 근거를 1분 안에 말해 보세요.',60,topic,'첫 발언'),
    mk('bridge',2,'이 의견을 받아서 이어 말해 보세요. 인정할 점을 먼저 말하고, 본인 의견을 보완하거나 제안으로 연결합니다.',60,topic+card(opp[0]),'받아서 잇기 ①'),
    mk('bridge',3,'한 번 더, 이 의견을 받아서 이어 말해 보세요.',60,topic+card(opp[1]||opp[0]),'받아서 잇기 ②'),
    mk('mediate',4,'두 지원자의 의견이 맞서고 있습니다. 양쪽을 요약하고 접점을 찾아 논의를 앞으로 보내 보세요.',60,topic+card(g.pro[0],'지원자 A')+card(g.con[0],'지원자 B'),'충돌 중재'),
    mk('wrap',5,'토론을 마무리하는 정리 발언을 해 보세요. 나온 의견의 공통점과 결론을 40초 안에.',45,topic,'정리 발언')];
}
function startGd(g){startSession('gd','Group Discussion',gdStepsOf(g,false),{g})}

/* ---------- 풀코스 리허설 ---------- */
MODE_NAME.full='풀코스 리허설';
const stage=(no,t,b)=>({type:'stage',no,t,b});
function renderStage(st){
  view().innerHTML=headHtml()+`<div class="card" style="margin-top:14px;padding:26px 18px"><div class="stage" style="text-align:center">${esc(st.no)}</div><h2 style="margin:8px 0 12px;text-align:center">${esc(st.t)}</h2><ul class="clean" style="max-width:36em;margin:0 auto">${st.b.map(x=>`<li>${x}</li>`).join('')}</ul><div class="row" style="justify-content:center;margin-top:18px"><button class="btn pri" type="button" id="stGo">시작 →</button></div></div>`;
  bindHead();$('#stGo').onclick=next;
}
function renderFullSetup(){
  const o={min:'20',pt:'rand'};
  view().innerHTML=`<section class="hero"><h1>풀코스 리허설</h1><p>네 구성을 공고에 나온 순서대로 이어서 진행합니다. 중간에 채점을 보여 주지 않고, 모두 끝난 뒤 한꺼번에 돌아봅니다. 조용한 곳에서 물 한 잔 준비하고 시작하세요.</p></section>
  <div class="card"><table class="t"><tr><th>1. 문제해결 PT</th><td>과제 풀기 → 3분 발표 → 후속 질문 3개</td></tr><tr><th>2. 심층 인터뷰</th><td>지원서 질문 6개 (꼬리질문 없이 이어서)</td></tr><tr><th>3. Group Discussion</th><td>주제 1개, 발언 5번</td></tr><tr><th>4. A!SK</th><td>공통 3문항 + 직무 4문항, 자동 넘김</td></tr></table>
  <div class="h4">PT 준비 시간</div>${seg('min',[['15','15분'],['20','20분'],['30','30분']],o.min)}
  <div class="h4">PT 시나리오</div>${seg('pt',[['rand','무작위'],...D.PT.map((p,i)=>[p.id,String(i+1)])],o.pt)}
  <p class="small">${D.PT.map((p,i)=>`${i+1}. ${esc(p.title)}`).join(' · ')}</p>
  <p class="small">실제 면접의 구성별 시간과 순서는 공개되지 않았습니다. 이 리허설의 시간 배분은 연습용입니다.</p>
  <div class="row" style="margin-top:12px"><button class="btn pri" type="button" id="startBtn">리허설 시작</button></div></div>${backRow}`;
  bindSeg(o);$('#backHome').onclick=()=>go(renderHome);
  $('#startBtn').onclick=()=>{
    const pt=o.pt==='rand'?pick(D.PT,1)[0]:D.PT.find(p=>p.id===o.pt),g=pick(D.GD,1)[0];
    const deep=['I03','R102',...pick(['R105','R107'],1),...pick(['R201','R202','R203'],1),'I06','E01'].map(id=>qStep(id,{defer:true}));
    startSession('full','풀코스 리허설',[
      stage('1 / 4','문제해결 PT',['실제 면접에서는 면접장 PC의 AI 에디터로 과제를 풉니다. 여기서는 모의 AI로 답을 검증하는 연습을 함께 합니다.','처음 몇 분은 AI 없이 문제를 한 문장으로 정의하세요.','준비 시간이 끝나면 발표와 후속 질문으로 넘어갑니다.']),
      ...ptStepsOf(pt,+o.min,2,1,true),
      stage('2 / 4','심층 인터뷰',['PT 질의에 이어 지원서에 쓴 경험을 묻는 단계입니다.','질문 6개가 이어집니다. 채점은 끝난 뒤에 봅니다.','숫자는 상대값으로, 현 직장의 기밀은 말하지 않습니다.']),
      ...deep,
      stage('3 / 4','Group Discussion',['정답이 없는 주제입니다. 이기려 하지 말고, 다른 의견을 받아서 본인 의견을 고치는 장면을 한 번은 만드세요.','1분 생각 정리 뒤 발언 5번이 이어집니다.']),
      ...gdStepsOf(g,true),
      stage('4 / 4','A!SK',['화면에 질문이 뜨고 준비 시간 뒤 답변이 시작됩니다. 시간이 끝나면 자동으로 넘어갑니다.','적어 둔 것을 읽지 말고 화면을 보고 말하세요. 모르는 문제는 아는 데서 출발해 풀어 가는 과정을 말합니다.']),
      ...buildAsk({prep:60,mfg:false,lock:true})],{pt,g,aiLog:[]});
  };
}

/* ---------- AI 답 검증 훈련 ---------- */
function renderAiv(){
  view().innerHTML=`<section class="hero"><h1>AI 답 검증 훈련</h1><p>AI의 답을 읽고 <b>그대로 쓰면 안 되는 문장</b>을 모두 고르세요. 틀린 문장만이 아니라 근거 없는 수치, 조건을 무시한 제안, 비약도 포함입니다. AI의 답은 훈련용으로 직접 만든 것입니다.</p></section>
  ${D.AIV.map((a,i)=>{const b=store.get('aiv.'+a.id);return `<button class="fq" type="button" data-av="${i}"><b>${i+1}. ${esc(a.title)}</b>${b!=null?` <span class="last">${b}점</span>`:''}<small>${esc(a.ctx.slice(0,60))}${a.ctx.length>60?'…':''}</small></button>`}).join('')}${backRow}`;
  $$('[data-av]').forEach(b=>b.onclick=()=>go(runAiv,+b.dataset.av));$('#backHome').onclick=()=>go(renderHome);
}
function runAiv(idx){
  const it=D.AIV[idx],sel=new Set();
  view().innerHTML=`<div class="row" style="margin-top:14px"><span class="qno">AI 답 검증 · ${idx+1} / ${D.AIV.length}</span><span class="sp"></span><button class="btn ghost" type="button" id="avList" style="min-height:36px;padding:6px 10px">목록</button></div>
  <div class="card" style="margin-top:10px"><div class="stage">${esc(it.title)}</div><p>${esc(it.ctx)}</p><div class="h4">AI의 답 — 그대로 쓰면 안 되는 문장을 모두 누르세요</div>
  <div id="avLines">${it.line.map((l,i)=>`<button class="aiv-line" type="button" data-l="${i}">${esc(l[1])}</button>`).join('')}</div>
  <div class="row" style="margin-top:12px"><span class="sp"></span><button class="btn pri" type="button" id="avCheck">확인하기</button></div><div id="avRes"></div></div>`;
  $('#avList').onclick=()=>go(renderAiv);
  $$('#avLines .aiv-line').forEach(b=>b.onclick=()=>{const i=+b.dataset.l;sel.has(i)?sel.delete(i):sel.add(i);b.classList.toggle('sel',sel.has(i))});
  $('#avCheck').onclick=()=>{
    let caught=0,bad=0,falseAl=0;
    $$('#avLines .aiv-line').forEach(b=>{const i=+b.dataset.l,l=it.line[i],isBad=l[0]!=='o',picked=sel.has(i);b.disabled=true;
      if(isBad){bad++;if(picked)caught++}else if(picked)falseAl++;
      b.classList.remove('sel');b.classList.add(isBad?'bad':'good');
      b.innerHTML=esc(l[1])+`<span class="res"><b style="color:${isBad?'var(--kw)':'var(--ok)'}">${l[0]==='x'?'틀린 문장':l[0]==='q'?'근거 없는 수치·단정':'맞는 문장'}</b> · ${picked?(isBad?'잘 골랐어요':'맞는 문장인데 골랐어요'):(isBad?'놓쳤어요':'')}${l[2]?'<br>'+esc(l[2]):''}</span>`});
    const score=Math.max(0,Math.round(100*(caught-falseAl*.5)/bad));const prev=store.get('aiv.'+it.id);if(prev==null||score>prev)store.set('aiv.'+it.id,score);
    $('#avCheck').disabled=true;
    $('#avRes').innerHTML=`<div class="h4">결과</div><p><b>${bad}개 중 ${caught}개</b>를 찾았습니다${falseAl?`. 맞는 문장 ${falseAl}개를 잘못 골랐습니다`:''}. (${score}점)</p>
      <div class="h4">면접에서는 이렇게 말하기</div><div class="model"><p>${esc(it.say)}</p></div>${srcHtml(it.s)}
      <div class="row" style="margin-top:12px"><button class="btn" type="button" id="avBack">목록</button><span class="sp"></span>${idx<D.AIV.length-1?'<button class="btn pri" type="button" id="avNext">다음 문제 →</button>':''}</div>`;
    $('#avBack').onclick=()=>go(renderAiv);const n=$('#avNext');if(n)n.onclick=()=>go(runAiv,idx+1);
  };
}

/* ---------- 질문(프롬프트) 쓰기 연습 ---------- */
const PR_CHECK=[['과제의 자료·수치를 넣었다',/\d|자료|표|데이터|조건|메모/],['원하는 답의 형태를 정했다',/표로|목록|가지|순서|우선순위|문장으로|나눠|구분|정리해|목차/],['제약이나 기준을 알렸다',/기한|주 안|분 뒤|분 안|시간|제약|기준|한 장|까지만|최대|이내|납기/],['근거·불확실성을 요구했다',/근거|가정|불확실|확인 필요|확인 방법|검증|모르면|지어내|출처|대조|표시해/],['내 생각을 먼저 주고 빈틈을 물었다',/내 가설|제 가설|내 생각|내가 아는|내 결론|내 권고|내가 쓴|놓친|약점|반박|빠진/]];
function renderPrm(){
  view().innerHTML=`<section class="hero"><h1>질문 쓰기 연습</h1><p>AI에게 던질 첫 질문을 직접 써 보고, 다섯 가지 기준으로 점검합니다. 실제 면접의 LLM 화면과 성능은 알 수 없지만, 질문에 조건과 내 생각을 넣는 습관은 어떤 도구에서도 통합니다.</p></section>
  ${D.PRM.map((a,i)=>`<button class="fq" type="button" data-pr="${i}"><b>${i+1}. ${esc(a.title)}</b>${store.get('prm.'+a.id)!=null?` <span class="last">${store.get('prm.'+a.id)} / 5</span>`:''}<small>${esc(a.goal)}</small></button>`).join('')}${backRow}`;
  $$('[data-pr]').forEach(b=>b.onclick=()=>go(runPrm,+b.dataset.pr));$('#backHome').onclick=()=>go(renderHome);
}
function runPrm(idx){
  const it=D.PRM[idx];
  view().innerHTML=`<div class="row" style="margin-top:14px"><span class="qno">질문 쓰기 · ${idx+1} / ${D.PRM.length}</span><span class="sp"></span><button class="btn ghost" type="button" id="prList" style="min-height:36px;padding:6px 10px">목록</button></div>
  <div class="card" style="margin-top:10px"><div class="stage">${esc(it.title)}</div><p>${esc(it.ctx)}</p><p><b>${esc(it.goal)}</b></p>
  <textarea id="prTa" placeholder="AI에게 보낼 질문을 그대로 써 보세요.">${esc(store.get('draft.'+it.id,''))}</textarea>
  <div class="row" style="margin-top:10px"><span class="sp"></span><button class="btn pri" type="button" id="prCheck">점검하기</button></div><div id="prRes"></div></div>`;
  $('#prList').onclick=()=>go(renderPrm);const ta=$('#prTa');ta.oninput=()=>store.set('draft.'+it.id,ta.value);
  $('#prCheck').onclick=()=>{
    const t=ta.value.trim();if(!t){toast('질문을 먼저 써 보세요.');return}
    const ch=PR_CHECK.map(([l,re])=>[l,re.test(t)]),n=ch.filter(c=>c[1]).length;store.set('prm.'+it.id,n);
    $('#prRes').innerHTML=`<div class="h4">점검 결과 — ${n} / 5</div><div class="kws">${ch.map(c=>`<span class="kwchip ${c[1]?'hit':'miss'}">${c[1]?'✓':'–'} ${esc(c[0])}</span>`).join('')}</div>
      <p class="small">낱말을 보고 판단하는 간단한 점검입니다. 아래 예시와 직접 비교해 보세요.</p>
      <div class="h4">약한 질문</div><pre class="prompt">${esc(it.bad)}</pre><p class="small">${esc(it.badwhy)}</p>
      <div class="h4">좋은 질문의 예</div><pre class="prompt">${esc(it.good)}</pre><p class="small">${esc(it.goodwhy)}</p>
      <div class="row" style="margin-top:12px"><button class="btn" type="button" id="prBack">목록</button><span class="sp"></span>${idx<D.PRM.length-1?'<button class="btn pri" type="button" id="prNext">다음 상황 →</button>':''}</div>`;
    $('#prBack').onclick=()=>go(renderPrm);const nx=$('#prNext');if(nx)nx.onclick=()=>go(runPrm,idx+1);
  };
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
