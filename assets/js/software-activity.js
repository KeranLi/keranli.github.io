(function () {
  "use strict";
  var charts = document.querySelectorAll("[data-activity-chart]");
  if (!charts.length) return;

  function draw(chart, weeks) {
    var width = 260, height = 48, pad = 4, max = Math.max.apply(null, weeks.map(function (week) { return week.total; }).concat([1]));
    var points = weeks.map(function (week, i) {
      var x = pad + i * (width - pad * 2) / Math.max(weeks.length - 1, 1);
      var y = height - pad - (week.total / max) * (height - pad * 2);
      return x.toFixed(1) + "," + y.toFixed(1);
    }).join(" ");
    var bars = weeks.map(function (week, i) {
      var x = pad + i * (width - pad * 2) / weeks.length + 1;
      var barWidth = Math.max(2, (width - pad * 2) / weeks.length - 2);
      var barHeight = Math.max(2, (week.total / max) * (height - pad * 2));
      return '<rect x="' + x.toFixed(1) + '" y="' + (height - pad - barHeight).toFixed(1) + '" width="' + barWidth.toFixed(1) + '" height="' + barHeight.toFixed(1) + '" rx="1.5" />';
    }).join("");
    chart.innerHTML = '<svg viewBox="0 0 ' + width + ' ' + height + '" role="img" aria-label="Recent weekly GitHub commit activity"><g class="software-entry__activity-bars">' + bars + '</g><polyline class="software-entry__activity-line" points="' + points + '" /></svg>';
  }

  function load(repo, attempt) {
    return fetch("https://api.github.com/repos/" + repo + "/stats/commit_activity", { headers: { Accept: "application/vnd.github+json" } })
      .then(function (response) {
        if (response.status === 202 && attempt < 3) {
          return new Promise(function (resolve) { setTimeout(function () { resolve(load(repo, attempt + 1)); }, 1400); });
        }
        if (!response.ok) throw new Error("GitHub activity unavailable");
        return response.json();
      })
      .catch(function () {
        // The stats endpoint may remain in GitHub's 202 processing state.
        // Fall back to the regular commits endpoint and aggregate locally.
        return fetch("https://api.github.com/repos/" + repo + "/commits?per_page=100", { headers: { Accept: "application/vnd.github+json" } })
          .then(function (response) {
            if (!response.ok) throw new Error("GitHub commits unavailable");
            return response.json();
          })
          .then(function (commits) {
            var now = new Date();
            var start = new Date(now.getTime() - 12 * 7 * 24 * 60 * 60 * 1000);
            var weeks = Array.from({ length: 12 }, function () { return { total: 0 }; });
            commits.forEach(function (commit) {
              var stamp = commit && commit.commit && commit.commit.author && commit.commit.author.date;
              if (!stamp) return;
              var date = new Date(stamp);
              if (date < start) return;
              var index = Math.min(11, Math.floor((date - start) / (7 * 24 * 60 * 60 * 1000)));
              weeks[index].total += 1;
            });
            return weeks;
          });
      });
  }

  charts.forEach(function (chart) {
    var repo = chart.parentElement.getAttribute("data-repo") || chart.closest("[data-repo]").getAttribute("data-repo");
    if (!repo) return;
    load(repo, 0)
      .then(function (weeks) {
        if (!Array.isArray(weeks) || !weeks.length) throw new Error("No activity data");
        draw(chart, weeks.slice(-12));
      })
      .catch(function () {
        chart.parentElement.classList.add("software-entry__activity--unavailable");
        chart.innerHTML = '<span class="software-entry__activity-empty">Activity unavailable</span>';
      });
  });
}());
