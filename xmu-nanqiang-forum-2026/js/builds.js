/* 点击动画：学术发表页的论文从列表移到雷达图。→ / 空格 / 单击前进，← 退回。 */
(function () {
  function activeSection() {
    return document.querySelector('svg.bespoke-marp-active section');
  }
  function gotoNext() {
    var b = document.querySelector('[data-bespoke-marp-osc="next"]');
    if (b) b.click();
  }
  function setupPubMap(sec) {
    var list = sec.querySelector('.pub-list');
    var map = sec.querySelector('.pub-map');
    if (!list || !map) return;
    var frame = map.querySelector('.pm-frame');
    var chips = Array.prototype.slice.call(map.querySelectorAll('[data-chip]'));
    var polys = Array.prototype.slice.call(map.querySelectorAll('.pm-poly'));
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
      frame.style.transition = 'none';
      frame.style.opacity = '0';
      chips.forEach(function (c) {
        c.style.transition = 'none';
        c.style.transform = 'none';
        var src = list.querySelector('[data-pub="' + c.getAttribute('data-chip') + '"]');
        if (src) {
          var a = src.getBoundingClientRect(), b = c.getBoundingClientRect();
          c.style.transform = 'translate(' + (a.left - b.left) / k + 'px,' + (a.top - b.top) / k + 'px)';
        } else {
          c.style.transform = 'scale(0.6)';  /* 列表里没有的成果：原地淡入 */
        }
        c.style.opacity = '0';
      });
      void map.offsetHeight;
      list.style.transition = 'opacity .35s';
      list.style.opacity = '0';
      chips.forEach(function (c, i) {
        var d = (list.querySelector('[data-pub="' + c.getAttribute('data-chip') + '"]') ? 150 : 900) + i * 60;
        c.style.transition = 'transform .9s cubic-bezier(.4,0,.2,1) ' + d + 'ms, opacity .25s ' + d + 'ms';
        c.style.transform = 'none';
        c.style.opacity = '1';
      });
      frame.style.transition = 'opacity .6s .4s';
      frame.style.opacity = '1';
      polys.forEach(function (p) {
        p.style.transition = 'none';
        p.style.transform = 'scale(0)';
      });
      void map.offsetHeight;
      polys.forEach(function (p) {
        p.style.transition = 'transform .8s cubic-bezier(.3,1.3,.5,1) 1.2s';
        p.style.transform = 'scale(1)';
      });
      state = 1;
      setTimeout(function () { busy = false; }, 2100);
      return true;
    };
    sec._retreat = function () {
      if (busy) return true;
      if (state === 0) return false;
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
    Array.prototype.forEach.call(document.querySelectorAll('.pub-list'), function (l) {
      var sec = l.closest('section');
      if (sec) setupPubMap(sec);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
