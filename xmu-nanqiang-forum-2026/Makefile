# 用法: make html / make pdf / make png / make all
M := marp slides.md --theme-set themes/defense.css --html --allow-local-files
html:
	$(M) -o slides.html < /dev/null
	python3 inline_images.py slides.html
	python3 inject_js.py slides.html
pdf:
	$(M) --pdf -o slides.pdf < /dev/null
pptx:
	$(M) --pptx -o slides.pptx < /dev/null
png:
	mkdir -p preview && $(M) --images png -o preview/slide.png < /dev/null
script:
	pandoc script.md -o script.docx
	pandoc script.md -o script.pdf --pdf-engine=xelatex -V CJKmainfont="Songti SC" -V geometry:margin=2.2cm
	python3 script_html.py
all: html pdf pptx script
