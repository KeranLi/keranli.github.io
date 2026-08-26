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
    var placed = [], scale = Math.min(w / 720, h / 330), max = Math.max(20, 46 * scale), min = Math.max(11, 16 * scale);
    words.forEach(function (item, i) {
      var size = min + item[1] / 34 * (max - min), angle = i % 5 === 0 ? -0.12 : (i % 7 === 0 ? 0.12 : 0);
      ctx.font = "600 " + size.toFixed(1) + "px SFMono-Regular, Consolas, Liberation Mono, monospace";
      var tw = ctx.measureText(item[0]).width + 8, th = size * 1.25 + 8;
      for (var t = 0; t < 900; t += 1) {
        var a = t * 0.42, rad = 1.8 * Math.sqrt(t), x = w / 2 + Math.cos(a) * rad, y = h / 2 + Math.sin(a) * rad * 0.58;
        var box = { left:x-tw/2, right:x+tw/2, top:y-th/2, bottom:y+th/2 };
        if (box.left < 5 || box.right > w-5 || box.top < 5 || box.bottom > h-5 || placed.some(function (p) { return overlap(box,p); })) continue;
        ctx.save(); ctx.translate(x,y); ctx.rotate(angle); ctx.fillStyle = colors[i % colors.length]; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(item[0],0,0); ctx.restore(); placed.push(box); break;
      }
    });
  }
  new MutationObserver(draw).observe(document.documentElement, { attributes:true, attributeFilter:["class"] });
  window.addEventListener("resize", draw); draw();
}());
