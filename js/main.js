(function () {
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    if (reduceMotion.matches) {
      revealEls.forEach(function (el) {
        el.classList.add("is-visible");
      });
    } else {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          });
        },
        { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
      );
      revealEls.forEach(function (el) {
        io.observe(el);
      });
    }
  }

  var GITHUB_USER = "mobasshirshamsi";
  var FEATURED_REPO_SLUGS = ["liveschool", "efficient-page-replacement-algorithm-simulator-1"];

  function isFeaturedRepo(name) {
    var n = String(name).toLowerCase();
    return FEATURED_REPO_SLUGS.indexOf(n) !== -1;
  }

  function initGitHubProjects() {
    var grid = document.getElementById("github-projects-grid");
    var statusEl = document.getElementById("github-projects-status");
    if (!grid || !statusEl) return;

    fetch(
      "https://api.github.com/users/" +
        encodeURIComponent(GITHUB_USER) +
        "/repos?per_page=100&sort=updated&direction=desc"
    )
      .then(function (res) {
        if (!res.ok) throw new Error("GitHub API request failed");
        return res.json();
      })
      .then(function (repos) {
        if (!Array.isArray(repos)) throw new Error("Invalid response");
        var others = repos.filter(function (repo) {
          if (!repo.name || isFeaturedRepo(repo.name)) return false;
          if (repo.fork) return false;
          return true;
        });
        statusEl.textContent = "";
        if (!others.length) {
          statusEl.textContent = "No other public repositories to show.";
          return;
        }
        statusEl.setAttribute("hidden", "");
        grid.removeAttribute("hidden");
        others.forEach(function (repo) {
          var card = document.createElement("a");
          card.className = "project-card project-card--repo";
          card.href = repo.html_url;
          card.target = "_blank";
          card.rel = "noopener noreferrer";

          var title = document.createElement("h3");
          title.className = "project-card__title project-card__title--repo";
          title.textContent = repo.name.replace(/-/g, " ");

          var desc = document.createElement("p");
          desc.className = "project-card__desc";
          desc.textContent = repo.description
            ? repo.description
            : "No description provided.";

          card.appendChild(title);
          card.appendChild(desc);

          if (repo.language) {
            var lang = document.createElement("span");
            lang.className = "project-card__lang";
            lang.textContent = repo.language;
            card.appendChild(lang);
          }

          grid.appendChild(card);
        });
      })
      .catch(function () {
        statusEl.textContent =
          "Could not load repositories. You can still browse projects on GitHub.";
      });
  }

  initGitHubProjects();

  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".site-nav");
  if (!toggle || !nav || !header) return;

  function setOpen(open) {
    header.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  toggle.addEventListener("click", function () {
    setOpen(!header.classList.contains("is-open"));
  });

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      setOpen(false);
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setOpen(false);
  });
})();
