/**
 * Run The Day — Homepage interactions
 * Navbar, reveals, counters, forms, FAQ, subtle parallax
 */

(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Year */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* Sticky navbar blur */
  const header = document.getElementById("site-header");
  const onScrollHeader = () => {
    if (!header) return;
    header.dataset.scrolled = window.scrollY > 24 ? "true" : "false";
  };
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  /* Mobile nav */
  const toggle = document.querySelector(".nav__toggle");
  const menu = document.getElementById("nav-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      toggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
      menu.classList.toggle("is-open", !open);
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
        menu.classList.remove("is-open");
      });
    });
  }

  /* Active nav link via IntersectionObserver */
  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...document.querySelectorAll(".nav__link")];
  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    const map = new Map(navLinks.map((l) => [l.getAttribute("href")?.slice(1), l]));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          navLinks.forEach((l) => l.removeAttribute("aria-current"));
          const active = map.get(id);
          if (active) active.setAttribute("aria-current", "true");
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => io.observe(s));
  }

  /* Scroll reveal */
  const reveals = document.querySelectorAll("[data-reveal]");
  if (reduceMotion) {
    reveals.forEach((el) => el.classList.add("is-visible"));
  } else if ("IntersectionObserver" in window) {
    const revIo = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => revIo.observe(el));
  }

  /* Number counters */
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count || "0");
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const duration = 1200;
    const start = performance.now();

    if (reduceMotion) {
      el.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`;
      return;
    }

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = target * eased;
      el.textContent = `${prefix}${value.toFixed(decimals)}${suffix}`;
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`;
    };
    requestAnimationFrame(tick);
  };

  const counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window) {
    const countIo = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCount(entry.target);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((el) => countIo.observe(el));
  } else {
    counters.forEach(animateCount);
  }

  /* Soft particles in hero */
  const particles = document.getElementById("particles");
  if (particles && !reduceMotion) {
    const count = window.innerWidth < 768 ? 12 : 22;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const s = document.createElement("span");
      s.style.left = `${Math.random() * 100}%`;
      s.style.animationDuration = `${10 + Math.random() * 14}s`;
      s.style.animationDelay = `${Math.random() * 10}s`;
      s.style.width = s.style.height = `${2 + Math.random() * 3}px`;
      frag.appendChild(s);
    }
    particles.appendChild(frag);
  }

  /* Hero ready state + subtle mouse parallax */
  const hero = document.querySelector(".hero");
  if (hero) {
    requestAnimationFrame(() => hero.classList.add("is-ready"));

    const media = hero.querySelector("[data-parallax]");
    if (media && !reduceMotion && window.matchMedia("(pointer: fine)").matches) {
      let raf = 0;
      let tx = 0;
      let ty = 0;
      hero.addEventListener("mousemove", (e) => {
        const rect = hero.getBoundingClientRect();
        tx = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
        ty = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
        if (!raf) {
          raf = requestAnimationFrame(() => {
            media.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
            raf = 0;
          });
        }
      });
    }
  }

  /* Soft tilt on mockups */
  if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll("[data-tilt]").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "";
      });
    });
  }

  /* Button ripple */
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if (reduceMotion) return;
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      btn.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    });
  });

  /* FAQ tabs */
  const tabs = document.querySelectorAll("[data-faq-tab]");
  const panels = document.querySelectorAll("[data-faq-panel]");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const id = tab.dataset.faqTab;
      tabs.forEach((t) => {
        t.classList.toggle("is-active", t === tab);
        t.setAttribute("aria-selected", String(t === tab));
      });
      panels.forEach((panel) => {
        panel.hidden = panel.dataset.faqPanel !== id;
      });
    });
  });

  /* Demo form validation + success */
  const form = document.getElementById("demo-form");
  if (form) {
    const fields = {
      name: { el: form.querySelector("#name"), msg: "Please enter your name." },
      email: {
        el: form.querySelector("#email"),
        msg: "Enter a valid email.",
        test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      },
      race: { el: form.querySelector("#race"), msg: "Tell us your race or organization." },
      runners: { el: form.querySelector("#runners"), msg: "Select expected runners." },
    };

    const validateField = (key) => {
      const field = fields[key];
      if (!field?.el) return true;
      const wrap = field.el.closest(".field");
      const error = wrap?.querySelector(".field__error");
      const value = (field.el.value || "").trim();
      const ok = value && (!field.test || field.test(value));
      wrap?.classList.toggle("is-invalid", !ok);
      if (error) error.textContent = ok ? "" : field.msg;
      return ok;
    };

    Object.keys(fields).forEach((key) => {
      fields[key].el?.addEventListener("blur", () => validateField(key));
      fields[key].el?.addEventListener("input", () => {
        if (fields[key].el.closest(".field")?.classList.contains("is-invalid")) {
          validateField(key);
        }
      });
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const ok = Object.keys(fields).every(validateField);
      if (!ok) return;

      const btn = form.querySelector('button[type="submit"]');
      const success = form.querySelector(".form-success");
      const loadingText = btn?.dataset.loadingText || "Sending…";
      const original = btn?.innerHTML;

      if (btn) {
        btn.classList.add("is-loading");
        btn.setAttribute("aria-busy", "true");
        btn.innerHTML = loadingText;
      }

      await new Promise((r) => setTimeout(r, 900));

      if (btn) {
        btn.classList.remove("is-loading");
        btn.removeAttribute("aria-busy");
        if (original) btn.innerHTML = original;
      }
      if (success) {
        success.hidden = false;
        form.setAttribute("aria-hidden", "true");
      }
    });
  }

  /* Newsletter (lightweight) */
  const newsletter = document.getElementById("newsletter-form");
  newsletter?.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = newsletter.querySelector("input");
    if (!input?.value) return;
    input.value = "";
    input.placeholder = "Subscribed — thank you!";
  });
})();
