#!/usr/bin/env python3
"""src/data/*.txt + app.css + app.html + app*.js  ->  ../index.html (단일 파일)"""
import json, re, sys, pathlib, datetime

SRC_DIR = pathlib.Path(__file__).resolve().parent
OUT = SRC_DIR.parent / "index.html"

SOURCES = {
    "app": ["제출한 지원서(경력·경험기술서)", ""],
    "half1": ["SK Careers Journal — 2026 하반기 채용 설명회 정리", "https://www.skcareersjournal.com/3665"],
    "press": ["Half-Day 면접 관련 언론 보도(2026년 8~10월, 전자신문·아이뉴스24 등)", ""],
    "job1": ["SK하이닉스 뉴스룸 — 앰버서더 JOB로그 1편 '양산기술'", "https://news.skhynix.co.kr/ambassador-job-log-ep1/"],
    "jobrep2": ["SK하이닉스 뉴스룸 — JOB리포트 2편 'PKG개발'(2026-06-23)", ""],
    "col": ["SK하이닉스 뉴스룸 — '반도체 후공정' 칼럼 시리즈(전 11편)", ""],
    "col6": ["SK하이닉스 뉴스룸 — 후공정 칼럼 6편: 컨벤셔널 패키지 공정", "https://news.skhynix.co.kr/post/seominsuk-column-types-of-packages-6"],
    "col8": ["SK하이닉스 뉴스룸 — 후공정 칼럼: 웨이퍼 레벨 패키지 공정(TSV·KGSD)", "https://news.skhynix.co.kr/seominsuk-column-wafer-level-package-2/"],
    "col9": ["SK하이닉스 뉴스룸 — 후공정 칼럼: 패키지 재료 1(EMC 등)", "https://news.skhynix.co.kr/seominsuk-column-package-role-material-1/"],
    "col10": ["SK하이닉스 뉴스룸 — 후공정 칼럼: 패키지 재료 2(언더필 등)", "https://news.skhynix.co.kr/seominsuk-column-package-role-material-2/"],
    "col11": ["SK하이닉스 뉴스룸 — 후공정 칼럼 11편: 패키지 신뢰성", "https://news.skhynix.co.kr/seominsuk-column-package-reliability/"],
    "hbm3": ["SK하이닉스 뉴스룸 — 12단 HBM3 개발 주역 인터뷰(어드밴스드 MR-MUF)", "https://news.skhynix.co.kr/sk-hynix-12-layer-hbm3-interview"],
    "pt7": ["SK하이닉스 뉴스룸 — 청주 첨단 패키징 팹 P&T7 투자 설명(2026-01)", "https://news.skhynix.co.kr/?p=57925"],
    "hbm4": ["2026년 2분기 실적 발표 보도 — HBM4 양산 공급·수율(MTN, 2026-07-29)", "https://news.mtn.co.kr/news-detail/2026072911343843325"],
    "hotchips": ["Hot Chips 2026 발표 보도 — HBM 패키징·하이브리드 본딩(TechNews, 2026-08-24)", "https://technews.tw/2026/08/24/sk-hynix-hot-chips-2026-hbm/"],
    "seal": ["SK하이닉스 뉴스룸 — 몰딩(봉지) 공정 소개 칼럼", ""],
    "notice": ["2026 하반기 채용 공고의 지원서 작성 안내(조사 기록 기준 — 정확한 문구는 공고에서 다시 확인하세요)", ""],
    "gong": ["SK Careers — '26년 하반기 Talent hy-way 기술사무직 신입 공고", "https://www.skcareers.com/Recruit/Detail/R261762"],
    "nr_thw": ["SK하이닉스 뉴스룸 — 채용설명회 현장 스케치(2026-08)", "https://news.skhynix.co.kr/talent-hy-way-recruiting-2026/"],
    "nr_press": ["SK하이닉스 뉴스룸 — 반나절 심층면접 도입 보도자료(2026-07-30)", "https://news.skhynix.co.kr/ai-talent-recruit-2026-02/"],
    "etnews": ["전자신문 — 채용설명회 전형 안내 보도(2026-08-19)", "https://www.etnews.com/20260819000196"],
    "inews": ["아이뉴스24 — 신입 채용 담당자 설명 보도(2026-08-27)", "https://inews24.com/view/1999139"],
    "econo": ["이코노믹리뷰 — SEDEX 2026 약식 채용설명회 보도(2026-10-14)", "https://www.econovill.com/news/articleView.html?idxno=753633"],
    "thub": ["SK hynix Talent Hub — 채용 절차 안내", "https://talent.skhynix.com/hub/ko/apply/process"],
    "ask26": ["링커리어 — 2026 상반기 A!SK 응시 후기", "https://community.linkareer.com/pass-review/5867336"],
    "ask25": ["링커리어 — 2025 하반기 SKCT·A!SK 응시 후기", "https://community.linkareer.com/pass-review/5586566"],
    "hack": ["SK하이닉스 뉴스룸 — AI 해커톤 2026 안내", "https://news.skhynix.co.kr/ai-hackathon-2026/"],
    "hackblog": ["AI 해커톤 온라인 예선 응시자 후기(개인 블로그, 2026-10-18)", "https://ruby-kim.github.io/2026/10/18/Retrospect/Hackathon/26-sk-ai/"],
    "cofa": ["머니투데이 — AI 협업 평가 솔루션 보도(2026-08-28)", "https://www.mt.co.kr/tech/2026/08/28/2026082810491742468"],
    "gaia": ["SK하이닉스 뉴스룸 — GaiA 기반 AI Agent 소개", "https://news.skhynix.co.kr/gaia_ep1_biz_ai_agent/"],
    "forum": ["EBN — SK하이닉스 2026 미래포럼 보도", "https://www.ebn.co.kr/news/articleView.html?idxno=1723533"],
    "oldpt": ["잡코리아 — 과거 SK하이닉스 PT 면접 후기 모음", "https://www.jobkorea.co.kr/Starter/review/view?C_Idx=42&Ctgr_Code=3"],
    "linkhd": ["링커리어 — Half-Day 면접 정리 글(2026-10)", "https://community.linkareer.com/employment_data/6655411"],
    "comm": ["취업 커뮤니티의 면접 후기·현직자 답변(잡플래닛·코멘토 등, 이전 통합 면접 시기 포함)", ""],
    "gen": ["교과서 수준의 일반 전공 지식 — 면접 전에 본인이 한 번 더 확인하세요", ""],
}

LIST_FIELDS = {"why", "p", "k", "f", "s", "data", "ask", "pro", "con", "opp", "line", "ai"}


def parse(path):
    recs, cur, field = [], None, None
    for raw in path.read_text(encoding="utf-8").splitlines():
        if raw.startswith("#"):
            continue
        m = re.match(r"^@(\w+)\s?(.*)$", raw)
        if m:
            key, val = m.group(1), m.group(2).strip()
            if key == "id":
                cur = {"id": val}
                recs.append(cur)
                field = None
                continue
            if cur is None:
                raise SystemExit(f"{path.name}: field before @id: {raw}")
            if key in LIST_FIELDS:
                cur.setdefault(key, []).append(val)
            else:
                if key in cur:
                    raise SystemExit(f"{path.name}: duplicate @{key} in {cur['id']}")
                cur[key] = val
            field = key
        else:
            if cur is None or field is None:
                continue
            if field in LIST_FIELDS:
                cur[field][-1] += "\n" + raw
            else:
                cur[field] += "\n" + raw
    for r in recs:
        for k, v in list(r.items()):
            if isinstance(v, str):
                r[k] = v.strip()
            else:
                r[k] = [x.strip() for x in v]
    return recs


def main():
    Q, PT, GD, AIV, PRM, XA = [], [], [], [], [], []
    for f in sorted((SRC_DIR / "data").glob("*.txt")):
        for r in parse(f):
            rid = r["id"]
            if rid.startswith("PT"):
                PT.append(r)
            elif rid.startswith("PR"):
                PRM.append(r)
            elif rid.startswith("AV"):
                AIV.append(r)
            elif rid.startswith("XA"):
                XA.append(r)
            elif rid.startswith("G"):
                GD.append(r)
            else:
                Q.append(r)
    errors, ids = [], set()
    for r in Q + PT + GD:
        if r["id"] in ids:
            errors.append(f"duplicate id {r['id']}")
        ids.add(r["id"])
    for r in Q:
        for need in ("c", "t", "sec", "q", "m"):
            if need not in r:
                errors.append(f"{r['id']}: missing @{need}")
        r["sec"] = int(r.get("sec", 90))
        ks = []
        for k in r.get("k", []):
            if "::" not in k:
                errors.append(f"{r['id']}: bad @k {k}")
                continue
            label, pat = [x.strip() for x in k.split("::", 1)]
            try:
                re.compile(pat)
            except re.error as e:
                errors.append(f"{r['id']}: regex {pat}: {e}")
            ks.append([label, pat])
        r["k"] = ks
        if not ks:
            errors.append(f"{r['id']}: no @k")
        fs = []
        for f in r.get("f", []):
            a, _, b = f.partition("||")
            fs.append([a.strip(), b.strip()])
        r["f"] = fs
        for s in r.get("s", []):
            if s not in SOURCES:
                errors.append(f"{r['id']}: unknown source {s}")
    for r in PT:
        r["f"] = [[a.strip(), b.strip()] for a, _, b in (x.partition("||") for x in r.get("f", []))]
        r["data"] = [[a.strip(), b.strip()] for a, _, b in (x.partition("|") for x in r.get("data", []))]
        for s in r.get("s", []):
            if s not in SOURCES:
                errors.append(f"{r['id']}: unknown source {s}")
    ptmap = {r["id"]: r for r in PT}
    for x in XA:
        ents = []
        for e in x.get("ai", []):
            head, *rest = e.split("\n")
            parts = [t.strip() for t in head.split("::")]
            if len(parts) != 3 or parts[2] not in ("ok", "num", "sure", "limit", "gen"):
                errors.append(f"{x['id']}: bad @ai head: {head}")
                continue
            try:
                re.compile(parts[0])
            except re.error as ex:
                errors.append(f"{x['id']}: regex {parts[0]}: {ex}")
            ans = " ".join(l.strip() for l in rest if l.strip() and not l.startswith(">>"))
            note = " ".join(l[2:].strip() for l in rest if l.startswith(">>"))
            if not ans or not note:
                errors.append(f"{x['id']}: @ai needs answer and note: {head}")
            ents.append([parts[0], parts[1], parts[2], ans, note])
        if x.get("for") not in ptmap:
            errors.append(f"{x['id']}: unknown @for {x.get('for')}")
        else:
            ptmap[x["for"]]["ai"] = ents
    for r in AIV:
        lines = []
        for l in r.get("line", []):
            mark, _, rest = l.partition(" ")
            text, _, note = rest.partition("::")
            if mark not in ("o", "x", "q") or (mark != "o" and not note.strip()):
                errors.append(f"{r['id']}: bad @line {l[:30]}")
            lines.append([mark, text.strip(), note.strip()])
        r["line"] = lines
        for need in ("title", "ctx", "say"):
            if need not in r:
                errors.append(f"{r['id']}: missing @{need}")
        for sk in r.get("s", []):
            if sk not in SOURCES:
                errors.append(f"{r['id']}: unknown source {sk}")
    for r in PRM:
        for need in ("title", "ctx", "goal", "bad", "badwhy", "good", "goodwhy"):
            if need not in r:
                errors.append(f"{r['id']}: missing @{need}")
    if errors:
        print("\n".join(errors))
        sys.exit(1)

    blob = "\n".join(json.dumps(x, ensure_ascii=False) for x in Q + PT + GD + AIV + PRM)
    for bad in ("아령", "삼성SDI", "삼성 SDI", "노아령", "weneewenee@"):
        if bad in blob:
            sys.exit(f"개인정보 문자열 발견: {bad}")

    data = {"Q": Q, "PT": PT, "GD": GD, "AIV": AIV, "PRM": PRM, "SRC": SOURCES,
            "built": datetime.date.today().isoformat()}
    js = "".join((SRC_DIR / n).read_text(encoding="utf-8") for n in ("app1.js", "app2.js", "app3.js", "app4.js"))
    css = (SRC_DIR / "app.css").read_text(encoding="utf-8")
    body = (SRC_DIR / "app.html").read_text(encoding="utf-8")
    payload = json.dumps(data, ensure_ascii=False).replace("</", "<\\/")
    html = f"""<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex,nofollow,noarchive">
<meta name="referrer" content="no-referrer">
<title>Half-Day 면접 연습실</title>
<style>
{css}
</style>
</head>
<body>
{body}
<script>
const D = {payload};
{js}
</script>
</body>
</html>
"""
    OUT.write_text(html, encoding="utf-8")
    print(f"OK  Q={len(Q)} PT={len(PT)} GD={len(GD)} AIV={len(AIV)} PRM={len(PRM)}  -> {OUT} ({len(html.encode('utf-8'))//1024} KB)")
    cats = {}
    for r in Q:
        cats[r["c"]] = cats.get(r["c"], 0) + 1
    print(cats)


if __name__ == "__main__":
    main()
