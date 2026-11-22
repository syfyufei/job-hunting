"""生成能力地图 SVG：figures/map-research.svg（研究层）和 figures/map-courses.svg（课程层）。
坐标：横轴 = 方法（质性 → 计算），纵轴 = 研究范围（中国地方 → 跨国比较）。"""
import json, sys, pathlib

W, H = 1240, 640
X0, X1, Y0, Y1 = 190, 1200, 40, 540   # plot area

METHODS = ["案例访谈", "调查实验", "因果推断", "多层模型", "网络分析", "文本分析", "机器学习", "大模型"]
SCOPES  = [("中国地方", 0.08), ("央地 · 香港", 0.36), ("东亚 · 日本", 0.62), ("跨国 · 美国 / 西巴尔干", 0.9)]

def px(u): return X0 + u * (X1 - X0)
def py(v): return Y1 - v * (Y1 - Y0)

RESEARCH = [
  # u, v, title, sub, status(top|pub|wip), anchor
  (0.06, 0.06, "条块发包与基层治理", "公共行政评论 2020", "pub", "start"),
  (0.14, 0.20, "助推型政策", "公共管理与政策评论 2021 · 通讯作者", "pub", "start"),
  (0.20, 0.36, "公共服务动机激发", "公共管理与政策评论 2025 · 学生一作", "pub", "start"),
  (0.42, 0.06, "地方治理的“能力空间”", "广州大学学报 2023 · 第一作者", "pub", "start"),
  (0.30, 0.93, "孔子学院关闭与国家形象", "CJIP 2022 · SSCI Q1 · 通讯作者", "pub", "start"),
  (0.80, 0.76, "西巴尔干五国：从“硬联通”到“心联通”", "《中国社会科学》拟录用 · 通讯作者", "top", "end"),
  (0.70, 0.50, "领导留言板：政府回应性", "与东京大学伊藤亚圣合作 · 大规模文本", "wip", "end"),
  (0.84, 0.22, "官话识别（Bureaucratese）", "BERT 模型 · 开源工具", "wip", "end"),
]

COURSES = json.loads(pathlib.Path(__file__).with_name("courses.json").read_text()) if pathlib.Path(__file__).with_name("courses.json").exists() else []

def svg(layer):
    o = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" font-family="PingFang SC, Microsoft YaHei, sans-serif">']
    # target zone
    o.append(f'<rect x="{px(0.5)}" y="{py(1)}" width="{px(1)-px(0.5)}" height="{py(0.5)-py(1)}" rx="6" fill="#0C62B0" fill-opacity="0.07"/>')
    o.append(f'<text x="{px(1)-12}" y="{py(0.5)-12}" text-anchor="end" font-size="16" font-weight="700" fill="#0C62B0" fill-opacity="0.85">计算政治学 × 比较政治学</text>')
    # grid
    for i in range(len(METHODS)):
        x = px((i + 0.5) / len(METHODS))
        o.append(f'<line x1="{x}" y1="{Y0}" x2="{x}" y2="{Y1}" stroke="#E3E8EF" stroke-width="1"/>')
    for _, v in SCOPES:
        o.append(f'<line x1="{X0}" y1="{py(v)}" x2="{X1}" y2="{py(v)}" stroke="#E3E8EF" stroke-width="1"/>')
    # axes
    o.append(f'<line x1="{X0}" y1="{Y1}" x2="{X1+14}" y2="{Y1}" stroke="#4A5568" stroke-width="1.6"/>')
    o.append(f'<path d="M{X1+14} {Y1-6} L{X1+26} {Y1} L{X1+14} {Y1+6}z" fill="#4A5568"/>')
    o.append(f'<line x1="{X0}" y1="{Y1}" x2="{X0}" y2="{Y0-12}" stroke="#4A5568" stroke-width="1.6"/>')
    o.append(f'<path d="M{X0-6} {Y0-12} L{X0} {Y0-24} L{X0+6} {Y0-12}z" fill="#4A5568"/>')
    # method chips (x axis)
    for i, m in enumerate(METHODS):
        x = px((i + 0.5) / len(METHODS)); w = 18 * len(m) + 18
        hot = i >= 4
        o.append(f'<rect x="{x-w/2}" y="{Y1+14}" width="{w}" height="28" rx="14" fill="{"#0C62B0" if hot else "#FFFFFF"}" stroke="#0C62B0" stroke-width="1.2"/>')
        o.append(f'<text x="{x}" y="{Y1+33}" text-anchor="middle" font-size="15" font-weight="600" fill="{"#FFFFFF" if hot else "#0C62B0"}">{m}</text>')
    o.append(f'<text x="{(X0+X1)/2}" y="{Y1+76}" text-anchor="middle" font-size="16" font-weight="700" fill="#0A3F78">方法能力：从质性到计算 →</text>')
    # scope labels (y axis)
    for s, v in SCOPES:
        parts = s.split(" · ") if len(s) > 6 else [s]
        for k, p in enumerate(parts):
            o.append(f'<text x="{X0-14}" y="{py(v)+5+(k-(len(parts)-1)/2)*20}" text-anchor="end" font-size="17" font-weight="600" fill="#4A5568">{p}</text>')
    o.append(f'<text x="22" y="{(Y0+Y1)/2}" text-anchor="middle" font-size="16" font-weight="700" fill="#0A3F78" transform="rotate(-90 22 {(Y0+Y1)/2})">研究范围：从中国到比较 →</text>')

    fade = 0.28 if layer == "courses" else 1
    o.append(f'<g opacity="{fade}">')
    for u, v, t, sub, st, anc in RESEARCH:
        x, y = px(u), py(v)
        if st == "top":
            o.append(f'<circle cx="{x}" cy="{y}" r="17" fill="none" stroke="#A8742C" stroke-width="2.5"/>')
            o.append(f'<circle cx="{x}" cy="{y}" r="11" fill="#0C62B0"/>')
        elif st == "pub":
            o.append(f'<circle cx="{x}" cy="{y}" r="11" fill="#0C62B0"/>')
        elif st == "wip":
            o.append(f'<circle cx="{x}" cy="{y}" r="11" fill="#FFFFFF" stroke="#0C62B0" stroke-width="3"/>')
        else:
            o.append(f'<circle cx="{x}" cy="{y}" r="11" fill="none" stroke="#8A94A6" stroke-width="2" stroke-dasharray="4 3"/>')
        dx = (26 if st == "top" else 20) * (1 if anc == "start" else -1)
        col = "#8A94A6" if st == "thesis" else "#0A3F78"
        o.append(f'<text x="{x+dx}" y="{y-2}" text-anchor="{anc}" font-size="19" font-weight="700" fill="{col}">{t}</text>')
        o.append(f'<text x="{x+dx}" y="{y+20}" text-anchor="{anc}" font-size="15" fill="#4A5568">{sub}</text>')
    o.append('</g>')

    if layer == "courses":
        for c in COURSES:
            x, y = px(c["u"]), py(c["v"]); t = c["title"]; w = sum(10 if ord(ch) < 128 else 19 for ch in t) + 34
            core = c.get("core", False)
            o.append(f'<rect x="{x-w/2}" y="{y-19}" width="{w}" height="38" rx="19" fill="{"#A8742C" if core else "#FFFFFF"}" stroke="#A8742C" stroke-width="1.6"/>')
            o.append(f'<text x="{x}" y="{y+6}" text-anchor="middle" font-size="18" font-weight="700" fill="{"#FFFFFF" if core else "#A8742C"}">{t}</text>')
        legend = [("#A8742C", "fill", "可开设课程（重点）"), ("#A8742C", "line", "可开设课程")]
    else:
        legend = [("#0C62B0", "fill", "已发表 / 已录用"), ("#0C62B0", "line", "进行中 / 开源工具")]
    lx = X0 + 20
    for col, kind, lab in legend:
        if kind == "fill": o.append(f'<circle cx="{lx}" cy="{Y0+12}" r="7" fill="{col}"/>')
        else: o.append(f'<circle cx="{lx}" cy="{Y0+12}" r="7" fill="#FFFFFF" stroke="{col}" stroke-width="2.5"/>')
        o.append(f'<text x="{lx+14}" y="{Y0+17}" font-size="13" fill="#4A5568">{lab}</text>')
        lx += 30 + 14 * len(lab)
    o.append('</svg>')
    return "\n".join(o)

out = pathlib.Path(__file__).parent.parent / "figures"
(out / "map-research.svg").write_text(svg("research"))
(out / "map-courses.svg").write_text(svg("courses"))
print("ok", len(COURSES), "courses")
