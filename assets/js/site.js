/* KASPERPHI — comportements du site (vanilla JS, aucune dépendance) */
(function () {
  "use strict";

  /* ---- Menu burger (mobile) ---- */
  var burger = document.querySelector(".burger");
  var nav = document.querySelector("nav.main-nav");
  if (burger && nav) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.textContent = open ? "✕ Fermer" : "☰ Menu";
    });
    // Referme le menu quand on clique un lien (navigation interne)
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
        burger.textContent = "☰ Menu";
      });
    });
  }

  /* ---- Filtres de la page Créations ---- */
  var filterBar = document.querySelector(".filters");
  if (filterBar) {
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-cat]"));
    var emptyNote = document.querySelector(".empty-note");

    function applyFilter(want) {
      var shown = 0;
      filterBar.querySelectorAll(".filter").forEach(function (b) {
        var on = b.getAttribute("data-filter") === want;
        b.classList.toggle("active", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
      cards.forEach(function (c) {
        var match = want === "all" || c.getAttribute("data-cat") === want;
        c.style.display = match ? "" : "none";
        if (match) shown++;
      });
      if (emptyNote) emptyNote.style.display = shown === 0 ? "block" : "none";
    }

    filterBar.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter");
      if (!btn) return;
      applyFilter(btn.getAttribute("data-filter"));
    });

    // Pré-filtrage via le hash : creations.html#filtre=chansons
    var m = (location.hash || "").match(/filtre=([\w-]+)/);
    if (m) {
      var valid = filterBar.querySelector('[data-filter="' + m[1] + '"]');
      if (valid) applyFilter(m[1]);
    }
  }

  /* ---- Formulaire de contact (validation côté client, sans backend) ---- */
  var form = document.querySelector("form.contact");
  if (form) {
    var note = form.querySelector(".form-note");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll("[required]").forEach(function (input) {
        var field = input.closest(".field");
        var valid = input.value.trim().length > 0;
        if (input.type === "email") {
          valid = valid && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
        }
        field.classList.toggle("invalid", !valid);
        if (!valid) ok = false;
      });
      if (ok && note) {
        note.classList.add("show");
        note.textContent =
          "Merci. Votre message est noté dans le grand cahier. Kasperphi vous répondra, à sa manière, et sans rancune.";
        form.reset();
      }
    });
    // efface l'erreur en cours de frappe
    form.querySelectorAll("[required]").forEach(function (input) {
      input.addEventListener("input", function () {
        input.closest(".field").classList.remove("invalid");
      });
    });
  }
})();
