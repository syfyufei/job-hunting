"""逐字稿 Markdown → HTML：pandoc 生成后把【…】动作提示和〔可删〕标记加上样式。
用法：python3 script_html.py [输入.md] [输出.html]，默认 script.md → script.html。"""
import re, subprocess, sys
src = sys.argv[1] if len(sys.argv) > 1 else "script.md"
dst = sys.argv[2] if len(sys.argv) > 2 else "script.html"
subprocess.run(["pandoc", src, "-s", "-o", dst, "--css", "themes/script.css",
                "--embed-resources", "--metadata", "lang=zh-CN"], check=True,
               stderr=subprocess.DEVNULL)
h = open(dst, encoding="utf-8").read()
i = h.index("<body")
head, body = h[:i], h[i:]
body = re.sub(r"【([^】]*)】", r'<span class="cue">\1</span>', body)
body = body.replace("〔可删〕", '<span class="cut">可删</span>')
open(dst, "w", encoding="utf-8").write(head + body)
print(dst, "written")
