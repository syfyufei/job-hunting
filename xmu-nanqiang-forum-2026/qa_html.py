"""问答准备 Markdown → HTML。用法：python3 qa_html.py"""
import subprocess
subprocess.run(["pandoc", "qa.md", "-s", "-o", "qa.html", "--css", "themes/qa.css", "--section-divs",
                "--embed-resources", "--metadata", "lang=zh-CN"], check=True, stderr=subprocess.DEVNULL)
h = open("qa.html", encoding="utf-8").read()
h = h.replace("<head>", '<head>\n<meta name="robots" content="noindex, nofollow">', 1)
js = """<script>
(function(){
  var b=document.getElementById('toggle'), qs=document.querySelectorAll('section.level2');
  document.getElementById('count').textContent='共 '+qs.length+' 题';
  b.addEventListener('click',function(){
    var on=document.body.classList.toggle('q-only');
    b.textContent=on?'显示全部回答':'只看问题';
    qs.forEach(function(s){s.classList.remove('open')});
  });
  qs.forEach(function(s){s.querySelector('h2').addEventListener('click',function(){
    if(document.body.classList.contains('q-only')) s.classList.toggle('open');});});
})();
</script>
</body>"""
h = h.replace("</body>", js, 1)
open("qa.html", "w", encoding="utf-8").write(h)
print("qa.html written")
