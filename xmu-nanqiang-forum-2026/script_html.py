"""script.md → script.html：pandoc 生成后把【…】动作提示和〔可删〕标记加上样式。"""
import re, subprocess
subprocess.run(["pandoc", "script.md", "-s", "-o", "script.html", "--css", "themes/script.css",
                "--embed-resources", "--metadata", "lang=zh-CN"], check=True)
h = open("script.html", encoding="utf-8").read()
body_start = h.index("<body")
head, body = h[:body_start], h[body_start:]
body = re.sub(r"【([^】]*)】", r'<span class="cue">\1</span>', body)
body = body.replace("〔可删〕", '<span class="cut">可删</span>')
open("script.html", "w", encoding="utf-8").write(head + body)
print("script.html written")
