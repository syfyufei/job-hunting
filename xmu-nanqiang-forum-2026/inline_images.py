"""把 slides.html 里引用的本地图片内嵌为 data URI，使单个 HTML 文件可独立打开。"""
import base64, mimetypes, os, re, sys
path = sys.argv[1] if len(sys.argv) > 1 else "slides.html"
html = open(path, encoding="utf-8").read()
def repl(m):
    src = m.group(2)
    if src.startswith(("data:", "http:", "https:")) or not os.path.exists(src):
        return m.group(0)
    mime = mimetypes.guess_type(src)[0] or "image/png"
    data = base64.b64encode(open(src, "rb").read()).decode()
    return f'{m.group(1)}data:{mime};base64,{data}{m.group(3)}'
html, n = re.subn(r'(<img[^>]*?src=")([^"]+)(")', repl, html)
open(path, "w", encoding="utf-8").write(html)
print(f"{path}: {n} images inlined")
