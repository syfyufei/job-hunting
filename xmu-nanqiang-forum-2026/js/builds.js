/* 点击动画：学术发表页的成果从列表移到左列，连线汇聚到研究方向；再点一次落到坐标图上。→ / 空格 / 单击前进，← 退回。 */
(function () {
  function activeSection() { return document.querySelector('svg.bespoke-marp-active section'); }
  function gotoNext() {
    var b = document.querySelector('[data-bespoke-marp-osc="next"]');
    if (b) b.click();
  }
  function all(root, sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); }
  function setupPubMap(sec) {
    var list = sec.querySelector('.pub-list');
    var map = sec.querySelector('.pub-map');
    if (!list || !map) return;
    var chips = all(map, '[data-chip]'), lines = all(map, '.pm-line'), nodes = all(map, '.pm-node');
    var map2 = sec.querySelector('.pub-map2');
    var dots = map2 ? all(map2, '.pm2-dot') : [], frame2 = map2 ? map2.querySelector('.pm2-frame') : null;
    function toScatter() {
      busy = true;
      map.style.transition = 'opacity .4s';
      map.style.opacity = '0';
      map2.style.transition = 'none';
      map2.style.opacity = '1';
      map2.style.visibility = 'visible';
      frame2.style.transition = 'none';
      frame2.style.opacity = '0';
      dots.forEach(function (d) { d.style.transition = 'none'; d.style.opacity = '0'; d.style.transform = 'scale(0.3)'; });
      void map2.offsetHeight;
      frame2.style.transition = 'opacity .5s .3s';
      frame2.style.opacity = '1';
      dots.forEach(function (d, i) {
        var t = 700 + i * 140;
        d.style.transition = 'opacity .35s ' + t + 'ms, transform .45s cubic-bezier(.3,1.4,.5,1) ' + t + 'ms';
        d.style.opacity = '1';
        d.style.transform = 'scale(1)';
      });
      var t2 = 700 + dots.length * 140 + 200;
      setTimeout(function () { map.style.visibility = 'hidden'; }, 400);
      state = 2;
      setTimeout(function () { busy = false; }, t2);
    }
    var state = 0, busy = false;
    function scale() { return sec.getBoundingClientRect().width / 1280 || 1; }
    sec._advance = function () {
      if (busy) return true;
      if (state === 2) return false;
      if (state === 1) { if (!map2) return false; toScatter(); return true; }
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
      chips.forEach(function (c, i) {
        var d = (c._fromList ? 150 : 700) + i * 50;
        c.style.transition = 'transform .8s cubic-bezier(.4,0,.2,1) ' + d + 'ms, opacity .25s ' + d + 'ms';
        c.style.transform = 'none';
        c.style.opacity = '1';
      });
      lines.forEach(function (p, i) {
        p.style.transition = 'stroke-dashoffset .7s ease-out ' + (1300 + i * 80) + 'ms';
        p.style.strokeDashoffset = '0';
      });
      nodes.forEach(function (n) { n.style.transition = 'opacity .5s 1.9s'; n.style.opacity = '1'; });
      state = 1;
      setTimeout(function () { busy = false; }, 2600);
      return true;
    };
    sec._retreat = function () {
      if (busy) return true;
      if (state === 0) return false;
      busy = true;
      if (state === 2) {
        map2.style.transition = 'opacity .35s';
        map2.style.opacity = '0';
        map.style.visibility = 'visible';
        map.style.transition = 'opacity .35s';
        map.style.opacity = '1';
        setTimeout(function () { map2.style.visibility = 'hidden'; busy = false; }, 350);
        state = 1;
        return true;
      }
      map.style.transition = 'opacity .35s';
      map.style.opacity = '0';
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
