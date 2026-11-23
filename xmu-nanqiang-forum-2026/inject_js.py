"""把 js/builds.js 插入 slides.html 末尾，提供点击动画。"""
import sys
path = sys.argv[1] if len(sys.argv) > 1 else "slides.html"
html = open(path, encoding="utf-8").read()
js = open("js/builds.js", encoding="utf-8").read()
i = html.rindex("</body>")
html = html[:i] + "<script>\n" + js + "\n</script>" + html[i:]
open(path, "w", encoding="utf-8").write(html)
print(f"{path}: builds.js injected")
