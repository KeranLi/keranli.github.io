(function () {
  "use strict";
  var button = document.querySelector(".js-wechat-share");
  var modal = document.querySelector("[data-wechat-modal]");
  if (!button || !modal) return;
  var qr = modal.querySelector("[data-wechat-qr]");
  var status = modal.querySelector("[data-wechat-status]");
  var pageUrl = window.location.href;
  var close = function () { modal.hidden = true; document.body.classList.remove("wechat-share-open"); button.focus(); };
  var open = function () {
    qr.src = "https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=12&data=" + encodeURIComponent(pageUrl);
    modal.hidden = false;
    document.body.classList.add("wechat-share-open");
    modal.querySelector(".wechat-share-modal__close").focus();
  };
  button.addEventListener("click", open);
  modal.querySelectorAll("[data-wechat-close]").forEach(function (element) { element.addEventListener("click", close); });
  modal.querySelector("[data-wechat-copy]").addEventListener("click", function () {
    if (!navigator.clipboard) { status.textContent = "Copy is unavailable; use the QR code instead."; return; }
    navigator.clipboard.writeText(pageUrl).then(function () { status.textContent = "Link copied."; }, function () { status.textContent = "Copy is unavailable; use the QR code instead."; });
  });
  document.addEventListener("keydown", function (event) { if (!modal.hidden && event.key === "Escape") close(); });
}());
