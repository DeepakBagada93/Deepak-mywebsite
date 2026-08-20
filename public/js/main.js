/* ==========================================================================
   DEEPAK BAGADA — PORTFOLIO & JOURNAL
   GSAP: Smooth intro, buttery scroll reveals, and non-blocking interactions
   ========================================================================== */
(function () {
    "use strict";

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!window.gsap || prefersReduced) {
        document.body.classList.remove("no-scroll");
        const preloader = document.getElementById("preloader");
        if (preloader) preloader.style.display = "none";
        return;
    }

    document.documentElement.classList.add("js");
    const { gsap } = window;
    if (window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
    }

    const $ = (sel, ctx) => (ctx || document).querySelector(sel);
    const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

    const preloaderEl = $("#preloader");
    const heroTitle = $(".hero__title");
    const isHomePageWithPreloader = !!preloaderEl && !!heroTitle;

    /* ---------- Ensure scroll is always unlocked on non-homepage / reload ---------- */
    if (!isHomePageWithPreloader) {
        document.body.classList.remove("no-scroll");
        if (preloaderEl) {
            preloaderEl.style.display = "none";
        }
    }

    /* ---------- Split headline words (only where split-lines exist) ---------- */
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

    if (isHomePageWithPreloader) {
        /* ---------- Preloader counter ---------- */
        const counter = { v: 0 };
        const countEl = $("#preloader-count");
        const fillEl = $("#preloader-fill");
        
        document.body.classList.add("no-scroll");

        // Failsafe timer to guarantee scroll is never permanently locked
        const unlockFailsafe = setTimeout(() => {
            document.body.classList.remove("no-scroll");
            if (preloaderEl) preloaderEl.style.display = "none";
            if (window.ScrollTrigger) ScrollTrigger.refresh();
        }, 2600);

        gsap.to(counter, {
            v: 100,
            duration: 1.5,
            ease: "power2.inOut",
            onUpdate: () => {
                if (countEl) countEl.textContent = String(Math.round(counter.v)).padStart(3, "0");
                if (fillEl) fillEl.style.width = counter.v + "%";
            },
        });

        /* ---------- Hero Intro Timeline ---------- */
        gsap.set(".masthead", { yPercent: -100, opacity: 0 });
        gsap.set(".hero__title .word-inner", { yPercent: 110, rotate: 1 });
        gsap.set([".hero__kicker", ".hero__roles", ".hero__lede", ".hero__cta", ".hero__figure", ".hero__scroll"], { opacity: 0 });
        gsap.set(".hero__rule", { scaleX: 0 });

        const intro = gsap.timeline({
            delay: 1.6,
            onComplete: () => {
                clearTimeout(unlockFailsafe);
                document.body.classList.remove("no-scroll");
                if (window.ScrollTrigger) ScrollTrigger.refresh();
            }
        });

        intro
            .to(preloaderEl, { opacity: 0, duration: 0.5, ease: "power2.inOut" })
            .add(() => {
                if (preloaderEl) preloaderEl.style.display = "none";
                document.body.classList.remove("no-scroll");
            })
            .to(".masthead", { yPercent: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, "-=0.2")
            .to(".hero__kicker", { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, "-=0.3")
            .to(
                heroTitle.querySelectorAll(".word-inner"),
                { yPercent: 0, rotate: 0, duration: 0.9, ease: "power4.out", stagger: 0.06 },
                "-=0.3"
            )
            .to(".hero__roles", { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, "-=0.5")
            .to(".hero__rule", { scaleX: 1, duration: 0.7, ease: "power2.inOut" }, "-=0.4")
            .to(".hero__lede", { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.4")
            .to(".hero__cta", { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.4")
            .to(".hero__figure", { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.7")
            .to(".hero__scroll", { opacity: 1, duration: 0.5 }, "-=0.3");

    } else {
        /* ---------- Smooth Subpage Entrance ---------- */
        document.body.classList.remove("no-scroll");
        gsap.set(".masthead", { yPercent: -100, opacity: 0 });
        gsap.to(".masthead", { yPercent: 0, opacity: 1, duration: 0.5, ease: "power2.out" });
        gsap.fromTo("main", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", delay: 0.08 });
    }

    /* ---------- Silky Smooth Scroll Reveals ---------- */
    if (window.ScrollTrigger) {
        const reveals = $$("[data-reveal]").filter((el) => !el.closest(".hero, .masthead"));
        reveals.forEach((el) => {
            gsap.fromTo(
                el,
                { opacity: 0, y: 24 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    delay: parseFloat(el.dataset.delay || 0),
                    scrollTrigger: {
                        trigger: el,
                        start: "top 88%",
                        toggleActions: "play none none none",
                        once: true
                    },
                }
            );
        });

        /* ---------- Split-line titles (below the fold) ---------- */
        $$(".split-lines")
            .filter((el) => !el.closest(".hero"))
            .forEach((el) => {
                const words = el.querySelectorAll(".word-inner");
                if (words.length > 0) {
                    gsap.fromTo(
                        words,
                        { yPercent: 110 },
                        {
                            yPercent: 0,
                            duration: 0.8,
                            ease: "power3.out",
                            stagger: 0.05,
                            scrollTrigger: { trigger: el, start: "top 88%", once: true },
                        }
                    );
                }
            });

        /* ---------- Skill progress lines ---------- */
        $$(".skill__line span").forEach((line) => {
            const level = line.style.getPropertyValue("--level").trim();
            gsap.to(line, {
                width: level,
                duration: 1.1,
                ease: "power2.out",
                scrollTrigger: { trigger: line, start: "top 92%", once: true },
            });
        });

        /* ---------- Animated stat counters ---------- */
        $$("[data-count]").forEach((el) => {
            const target = parseInt(el.dataset.count, 10) || 0;
            const obj = { val: 0 };
            gsap.to(obj, {
                val: target,
                duration: 1.4,
                ease: "power2.out",
                scrollTrigger: { trigger: el, start: "top 92%", once: true },
                onUpdate: () => {
                    el.textContent = Math.round(obj.val);
                },
            });
        });

        /* ---------- Hero video scroll shrink ---------- */
        const heroVideo = $(".hero__video-el");
        if (heroVideo && $("#top")) {
            gsap.fromTo(
                heroVideo,
                { scale: 1, yPercent: 0, opacity: 1 },
                {
                    scale: 0.92,
                    yPercent: 12,
                    opacity: 0.5,
                    ease: "none",
                    scrollTrigger: { trigger: "#top", start: "top top", end: "bottom top", scrub: 0.5 },
                }
            );
        }

        /* ---------- Parallax on figures ---------- */
        $$("[data-parallax]").forEach((el) => {
            const amt = parseFloat(el.dataset.parallax) || 0.03;
            gsap.fromTo(
                el,
                { yPercent: amt * 30 },
                {
                    yPercent: amt * -30,
                    ease: "none",
                    scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.5 },
                }
            );
        });
    }

    /* ---------- Mobile navigation menu ---------- */
    const burger = $("#burger");
    const mmenu = $("#mmenu");
    if (burger && mmenu) {
        const toggleMenu = (force) => {
            const open = typeof force === "boolean" ? force : !mmenu.classList.contains("is-open");
            mmenu.classList.toggle("is-open", open);
            burger.setAttribute("aria-expanded", String(open));
            burger.textContent = open ? "Close" : "Menu";
            document.body.classList.toggle("no-scroll", open);
        };
        burger.addEventListener("click", () => toggleMenu());
        $$(".mmenu a").forEach((a) => a.addEventListener("click", () => toggleMenu(false)));
    }

    /* ---------- Magnetic buttons (Desktop) ---------- */
    if (window.matchMedia("(pointer: fine)").matches) {
        $$(".btn").forEach((btn) => {
            const xTo = gsap.quickTo(btn, "x", { duration: 0.25, ease: "power2.out" });
            const yTo = gsap.quickTo(btn, "y", { duration: 0.25, ease: "power2.out" });
            btn.addEventListener("mousemove", (e) => {
                const r = btn.getBoundingClientRect();
                xTo((e.clientX - (r.left + r.width / 2)) * 0.12);
                yTo((e.clientY - (r.top + r.height / 2)) * 0.15);
            });
            btn.addEventListener("mouseleave", () => {
                xTo(0);
                yTo(0);
            });
        });
    }

    // Refresh triggers once page is fully loaded
    window.addEventListener("load", () => {
        if (window.ScrollTrigger) ScrollTrigger.refresh();
    });
})();
