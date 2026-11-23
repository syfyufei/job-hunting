/* 点击动画（学术发表页）：论文从列表移到左列，连线汇聚到两个研究方向，标题由“学术发表”变为“研究方向”。
   → / 空格 / 单击前进，← 退回。 */
(function () {
  function activeSection() { return document.querySelector('svg.bespoke-marp-active section'); }
  function gotoNext() {
    var b = document.querySelector('[data-bespoke-marp-osc="next"]');
    if (b) b.click();
  }
  function all(root, sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); }
  function swapTitle(el, text) {
    if (!el) return;
    el.style.transition = 'opacity .3s';
    el.style.opacity = '0';
    setTimeout(function () { el.textContent = text; el.style.opacity = '1'; }, 300);
  }
  function setupPubMap(sec) {
    var list = sec.querySelector('.pub-list');
    var map = sec.querySelector('.pub-map');
    if (!list || !map) return;
    var title = sec.querySelector('.pm-title');
    var t0 = title ? title.textContent : '', t1 = title ? title.getAttribute('data-alt') : '';
    var chips = all(map, '[data-chip]'), lines = all(map, '.pm-line'), nodes = all(map, '.pm-node');
    var state = 0, busy = false;
    function scale() { return sec.getBoundingClientRect().width / 1280 || 1; }
    sec._advance = function () {
      if (busy) return true;
      if (state === 1) return false;
      busy = true;
      var k = scale();
      map.style.transition = 'none';
      map.style.opacity = '1';
      map.style.visibility = 'visible';
      chips.forEach(function (c) {
        c.style.transition = 'none';
        c.style.transform = 'none';
        var src = list.querySelector('[data-pub="' + c.getAttribute('data-chip') + '"]');
        if (src) {
          var a = src.getBoundingClientRect(), b = c.getBoundingClientRect();
          c.style.transform = 'translate(' + (a.left - b.left) / k + 'px,' + (a.top - b.top) / k + 'px)';
        } else {
          c.style.transform = 'scale(0.6)';
        }
        c.style.opacity = '0';
        c._fromList = !!src;
      });
      lines.forEach(function (p) {
        var len = p.getTotalLength();
        p.style.transition = 'none';
        p.style.strokeDasharray = len;
        p.style.strokeDashoffset = len;
        p.style.opacity = '1';
      });
      nodes.forEach(function (n) { n.style.transition = 'none'; n.style.opacity = '0'; });
      void map.offsetHeight;
      list.style.transition = 'opacity .35s';
      list.style.opacity = '0';
      swapTitle(title, t1);
      chips.forEach(function (c, i) {
        var d = (c._fromList ? 150 : 800) + i * 50;
        c.style.transition = 'transform .8s cubic-bezier(.4,0,.2,1) ' + d + 'ms, opacity .25s ' + d + 'ms';
        c.style.transform = 'none';
        c.style.opacity = '1';
      });
      lines.forEach(function (p, i) {
        var d = 1300 + i * 70;
        p.style.transition = 'stroke-dashoffset .7s ease-out ' + d + 'ms';
        p.style.strokeDashoffset = '0';
        /* 画完后恢复虚线样式（第二方向的连线） */
        setTimeout(function () {
          var dash = p.getAttribute('stroke-dasharray');
          p.style.transition = 'none';
          p.style.strokeDasharray = dash ? dash : 'none';
          p.style.strokeDashoffset = '0';
        }, d + 750);
      });
      nodes.forEach(function (n) { n.style.transition = 'opacity .5s 1.8s'; n.style.opacity = '1'; });
      state = 1;
      setTimeout(function () { busy = false; }, 2800);
      return true;
    };
    sec._retreat = function () {
      if (busy) return true;
      if (state === 0) return false;
      busy = true;
      map.style.transition = 'opacity .35s';
      map.style.opacity = '0';
      swapTitle(title, t0);
      setTimeout(function () {
        map.style.visibility = 'hidden';
        list.style.transition = 'opacity .35s';
        list.style.opacity = '1';
        busy = false;
      }, 350);
      state = 0;
      return true;
    };
    sec.style.cursor = 'pointer';
    sec.addEventListener('click', function () { if (!sec._advance()) gotoNext(); });
  }
  document.addEventListener('keydown', function (e) {
    if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) return;
    var next = e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ';
    var prev = e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp';
    if (!next && !prev) return;
    var sec = activeSection();
    if (!sec) return;
    if ((next && sec._advance && sec._advance()) || (prev && sec._retreat && sec._retreat())) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }, true);
  function init() {
    all(document, '.pub-list').forEach(function (l) {
      var sec = l.closest('section');
      if (sec) setupPubMap(sec);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
