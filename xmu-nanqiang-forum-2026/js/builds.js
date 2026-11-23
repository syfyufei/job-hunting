/* 点击动画（学术发表页）：第一次点击，成果从列表飞到“年份 × 研究取向”图上；
   第二次点击，依次凸显比较政治学、计算社会科学两侧。→ / 空格 / 单击前进，← 退回。 */
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
    var frame = map.querySelector('.pm-frame');
    var pts = all(map, '[data-chip]');
    var hls = all(map, '.pm-hl');
    var state = 0, busy = false;
    function scale() { return sec.getBoundingClientRect().width / 1280 || 1; }
    function place() {
      busy = true;
      var k = scale();
      map.style.transition = 'none';
      map.style.opacity = '1';
      map.style.visibility = 'visible';
      frame.style.transition = 'none';
      frame.style.opacity = '0';
      hls.forEach(function (h) { h.style.transition = 'none'; h.style.opacity = '0'; });
      pts.forEach(function (p) {
        p.style.transition = 'none';
        p.style.transform = 'none';
        var src = list.querySelector('[data-pub="' + p.getAttribute('data-chip') + '"]');
        if (src) {
          var a = src.getBoundingClientRect(), b = p.getBoundingClientRect();
          p.style.transform = 'translate(' + (a.left - b.left) / k + 'px,' + (a.top - b.top) / k + 'px)';
        } else {
          p.style.transform = 'scale(0.4)';
        }
        p.style.opacity = '0';
        p._fromList = !!src;
      });
      void map.offsetHeight;
      list.style.transition = 'opacity .4s';
      list.style.opacity = '0';
      frame.style.transition = 'opacity .6s .2s';
      frame.style.opacity = '1';
      pts.forEach(function (p, i) {
        var d = (p._fromList ? 150 : 1000) + i * 60;
        p.style.transition = 'transform .9s cubic-bezier(.4,0,.2,1) ' + d + 'ms, opacity .3s ' + d + 'ms';
        p.style.transform = 'none';
        p.style.opacity = '1';
      });
      state = 1;
      setTimeout(function () { busy = false; }, 1900);
    }
    function highlight() {
      busy = true;
      hls.forEach(function (h) {
        var step = +h.getAttribute('data-step');
        h.style.transition = 'opacity .6s ' + (step * 1000) + 'ms';
        h.style.opacity = '1';
      });
      state = 2;
      setTimeout(function () { busy = false; }, 1600);
    }
    sec._advance = function () {
      if (busy) return true;
      if (state === 0) { place(); return true; }
      if (state === 1) { highlight(); return true; }
      return false;
    };
    sec._retreat = function () {
      if (busy) return true;
      if (state === 0) return false;
      if (state === 2) {
        hls.forEach(function (h) { h.style.transition = 'opacity .3s'; h.style.opacity = '0'; });
        state = 1;
        return true;
      }
      busy = true;
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
