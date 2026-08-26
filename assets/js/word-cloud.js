(function () {
  "use strict";
  var canvas = document.getElementById("word-cloud-canvas");
  if (!canvas) return;
  var words = [["Sedimentology",34],["Geoscience AI",30],["Computer Vision",28],["Machine Learning",26],["Foundation Models",24],["Geochemistry",22],["Deep Learning",21],["Carbonates",19],["Isotope Proxies",17],["Paleoenvironment",15],["Petrography",13],["Tibetan Plateau",12]];
  var colors = ["#147e9f", "#277f99", "#3c8292", "#526170", "#71808d"];
  function overlap(a, b) { return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom); }
  function draw() {
    var r = canvas.getBoundingClientRect(), dpr = window.devicePixelRatio || 1, w = Math.max(240, Math.floor(r.width)), h = Math.max(180, Math.floor(r.height));
    canvas.width = w * dpr; canvas.height = h * dpr;
    var ctx = canvas.getContext("2d"); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
    var dark = document.documentElement.classList.contains("theme-dark");
    var palette = dark ? ["#7ec8df", "#65b2c9", "#9ccbd7", "#b9c9d3", "#8fa3af"] : colors;
    var placed = [], scale = Math.min(w / 760, h / 330), max = Math.max(24, 42 * scale), min = Math.max(12, 15 * scale);
    words.forEach(function (item, i) {
      var baseSize = min + item[1] / 34 * (max - min), done = false;
      for (var shrink = 0; shrink < 7 && !done; shrink += 1) {
        var size = baseSize * Math.pow(0.88, shrink);
        var angle = i > 2 && i % 4 === 0 ? -Math.PI / 2 : 0;
        ctx.font = "600 " + size.toFixed(1) + "px SFMono-Regular, Consolas, Liberation Mono, monospace";
        var measured = ctx.measureText(item[0]).width;
        var tw = (Math.abs(angle) > 1 ? size * 1.15 : measured) + 12;
        var th = (Math.abs(angle) > 1 ? measured : size * 1.15) + 10;
        for (var t = 0; t < 5200; t += 1) {
          var a = t * 0.36, rad = 4.6 * Math.sqrt(t), x = w / 2 + Math.cos(a) * rad, y = h / 2 + Math.sin(a) * rad * 0.48;
          var box = { left:x-tw/2, right:x+tw/2, top:y-th/2, bottom:y+th/2 };
          if (box.left < 5 || box.right > w-5 || box.top < 5 || box.bottom > h-5 || placed.some(function (p) { return overlap(box,p); })) continue;
          ctx.save(); ctx.translate(x,y); ctx.rotate(angle); ctx.fillStyle = palette[i % palette.length]; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(item[0],0,0); ctx.restore(); placed.push(box); done = true; break;
        }
      }
    });
    canvas.dataset.renderedWords = String(placed.length);
    canvas.dataset.layoutSize = w + "x" + h;
  }
  new MutationObserver(draw).observe(document.documentElement, { attributes:true, attributeFilter:["class"] });
  window.addEventListener("resize", draw); draw();
}());
