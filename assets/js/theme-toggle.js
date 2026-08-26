(function() {
  var storageKey = "keranli-theme";
  var body = document.body;
  var button = document.getElementById("theme-toggle");
  if (!button) return;

  function setTheme(dark) {
    body.classList.toggle("theme-dark", dark);
    button.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    button.setAttribute("title", dark ? "Switch to light mode" : "Switch to dark mode");
    button.innerHTML = dark ? '<i class="fas fa-sun" aria-hidden="true"></i>' : '<i class="fas fa-moon" aria-hidden="true"></i>';
  }

  var saved = window.localStorage.getItem(storageKey);
  setTheme(saved === "dark");
  button.addEventListener("click", function() {
    var dark = !body.classList.contains("theme-dark");
    setTheme(dark);
    window.localStorage.setItem(storageKey, dark ? "dark" : "light");
  });
})();