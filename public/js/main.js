/* ==========================================================================
   DEEP BAGADA — PORTFOLIO VOL. 01
   GSAP: preloader intro, scroll reveals, marquee-less restrained motion
   ========================================================================== */
(function () {
    "use strict";

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!window.gsap || prefersReduced) {
        return;
    }

    document.documentElement.classList.add("js");
    const { gsap } = window;
    gsap.registerPlugin(ScrollTrigger);

    const $ = (sel, ctx) => (ctx || document).querySelector(sel);
    const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

    const hasPreloader = !!$("#preloader");

    /* ---------- Split headline words ---------- */
    $$(".split-lines").forEach((el) => {
        const words = el.textContent.trim().split(/\s+/);
        el.setAttribute("aria-label", words.join(" "));
        el.textContent = "";
        words.forEach((w) => {
            const word = document.createElement("span");
            word.className = "word";
            const inner = document.createElement("span");
            inner.className = "word-inner";
            inner.textContent = w;
            word.appendChild(inner);
            el.appendChild(word);
            el.appendChild(document.createTextNode(" "));
        });
    });

    if (hasPreloader) {
        /* ---------- Preloader counter ---------- */
        const counter = { v: 0 };
        const countEl = $("#preloader-count");
        const fillEl = $("#preloader-fill");
        gsap.to(counter, {
            v: 100,
            duration: 1.8,
            ease: "power2.inOut",
            onUpdate: () => {
                countEl.textContent = String(Math.round(counter.v)).padStart(3, "0");
                fillEl.style.width = counter.v + "%";
            },
        });

        document.body.classList.add("no-scroll");

        /* ---------- Intro timeline (runs after preloader) ---------- */
        const heroTitle = $(".hero__title");

        gsap.set(".masthead", { yPercent: -110 });
        gsap.set(".hero__title .word-inner", { yPercent: 115, rotate: 1.5 });
        gsap.set([".hero__kicker", ".hero__roles", ".hero__lede", ".hero__cta", ".hero__figure", ".hero__scroll"], { opacity: 0 });
        gsap.set([".burst", ".speech--hero"], { opacity: 0 });
        gsap.set(".hero__rule", { scaleX: 0 });

        const intro = gsap.timeline({ delay: 1.95 });

        intro
            .to("#preloader", { opacity: 0, duration: 0.6, ease: "power2.inOut" })
            .add(() => {
                $("#preloader").style.display = "none";
            })
            .fromTo(".masthead", { yPercent: -110 }, { yPercent: 0, duration: 0.7, ease: "power3.out" }, "-=0.35")
            .fromTo(".hero__kicker", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, "-=0.4")
            .fromTo(
                heroTitle.querySelectorAll(".word-inner"),
                { yPercent: 115, rotate: 1.5 },
                { yPercent: 0, rotate: 0, duration: 1, ease: "power4.out", stagger: 0.08 },
                "-=0.35"
            )
            .fromTo(".hero__roles", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, "-=0.55")
            .fromTo(".hero__rule", { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power3.inOut" }, "-=0.4")
            .fromTo(".hero__lede", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.5")
            .fromTo(".hero__cta", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.45")
            .fromTo(".hero__figure", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.85")
            .fromTo(".burst", { scale: 0, rotate: -24 }, { scale: 1, rotate: -10, duration: 0.7, ease: "back.out(2.4)" }, "-=0.5")
            .fromTo(".speech--hero", { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)" }, "-=0.35")
            .fromTo(".hero__scroll", { opacity: 0 }, { opacity: 1, duration: 0.6 }, "-=0.4")
            .add(() => {
                document.body.classList.remove("no-scroll");
                ScrollTrigger.refresh();
            });
    } else {
        gsap.set(".masthead", { yPercent: -110 });
        gsap.to(".masthead", { yPercent: 0, duration: 0.7, ease: "power3.out", delay: 0.15 });
    }

    /* ---------- Generic scroll reveals ---------- */
    const reveals = $$("[data-reveal]").filter((el) => !el.closest(".hero, .masthead"));
    reveals.forEach((el) => {
        gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            delay: parseFloat(el.dataset.delay || 0),
            scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
        });
    });

    /* ---------- Split-line titles (below the fold) ---------- */
    $$(".split-lines")
        .filter((el) => !el.closest(".hero"))
        .forEach((el) => {
            gsap.fromTo(
                el.querySelectorAll(".word-inner"),
                { yPercent: 110 },
                {
                    yPercent: 0,
                    duration: 0.9,
                    ease: "power4.out",
                    stagger: 0.05,
                    scrollTrigger: { trigger: el, start: "top 88%", once: true },
                }
            );
        });

    /* ---------- Skill lines ---------- */
    $$(".skill__line span").forEach((line) => {
        const level = line.style.getPropertyValue("--level").trim();
        gsap.to(line, {
            width: level,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: { trigger: line, start: "top 94%", once: true },
        });
    });

    /* ---------- Animated stat counters ---------- */
    $$("[data-count]").forEach((el) => {
        const target = parseInt(el.dataset.count, 10) || 0;
        const obj = { val: 0 };
        gsap.to(obj, {
            val: target,
            duration: 1.6,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
            onUpdate: () => {
                el.textContent = Math.round(obj.val);
            },
        });
    });

    /* ---------- Hero video scroll trigger (9:16 reel shrinks & dims on scroll) ---------- */
    const heroVideo = $(".hero__video-el");
    if (heroVideo) {
        gsap.fromTo(
            heroVideo,
            { scale: 1, yPercent: 0, opacity: 1 },
            {
                scale: 0.9,
                yPercent: 16,
                opacity: 0.4,
                ease: "none",
                scrollTrigger: { trigger: "#top", start: "top top", end: "bottom top", scrub: true },
            }
        );
    }

    /* ---------- Subtle parallax on figures ---------- */
    $$("[data-parallax]").forEach((el) => {
        const amt = parseFloat(el.dataset.parallax) || 0.04;
        gsap.fromTo(
            el,
            { yPercent: amt * 40 },
            {
                yPercent: amt * -40,
                ease: "none",
                scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
            }
        );
    });

    /* ---------- Mobile menu ---------- */
    const burger = $("#burger");
    const mmenu = $("#mmenu");
    const toggleMenu = (force) => {
        const open = typeof force === "boolean" ? force : !mmenu.classList.contains("is-open");
        mmenu.classList.toggle("is-open", open);
        burger.setAttribute("aria-expanded", String(open));
        burger.textContent = open ? "Close" : "Menu";
        document.body.classList.toggle("no-scroll", open);
    };
    burger.addEventListener("click", () => toggleMenu());
    $$(".mmenu a").forEach((a) => a.addEventListener("click", () => toggleMenu(false)));

    /* ---------- Magnetic buttons (desktop) ---------- */
    if (window.matchMedia("(pointer: fine)").matches) {
        $$(".btn").forEach((btn) => {
            const xTo = gsap.quickTo(btn, "x", { duration: 0.3, ease: "power3" });
            const yTo = gsap.quickTo(btn, "y", { duration: 0.3, ease: "power3" });
            btn.addEventListener("mousemove", (e) => {
                const r = btn.getBoundingClientRect();
                xTo((e.clientX - (r.left + r.width / 2)) * 0.14);
                yTo((e.clientY - (r.top + r.height / 2)) * 0.18);
            });
            btn.addEventListener("mouseleave", () => {
                xTo(0);
                yTo(0);
            });
        });
    }
})();
