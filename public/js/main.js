/* ==========================================================================
   DEEPAK BAGADA — PORTFOLIO & JOURNAL
   GSAP: Smooth intro, buttery scroll reveals, and non-blocking interactions
   ========================================================================== */
(function () {
    "use strict";

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lockScroll = () => {
        document.documentElement.classList.add("no-scroll");
        document.body.classList.add("no-scroll");
    };
    const unlockScroll = () => {
        document.documentElement.classList.remove("no-scroll");
        document.body.classList.remove("no-scroll");
    };
    const refreshScrollTriggers = () => {
        if (!window.ScrollTrigger) return;
        // double-rAF ensures layout has settled after display:none + scrollbar return
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                ScrollTrigger.refresh();
            });
        });
    };

    if (!window.gsap || prefersReduced) {
        unlockScroll();
        const preloader = document.getElementById("preloader");
        if (preloader) {
            preloader.classList.add("is-hidden");
            preloader.style.display = "none";
        }
        return;
    }

    document.documentElement.classList.add("js");
    const { gsap } = window;
    if (window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
    } else {
        // Failsafe: `.js [data-reveal]` starts hidden, so without ScrollTrigger
        // nothing would ever reveal them and the page would render blank.
        gsap.set("[data-reveal]", { opacity: 1, y: 0 });
    }

    const $ = (sel, ctx) => (ctx || document).querySelector(sel);
    const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

    const preloaderEl = $("#preloader");
    const heroTitle = $(".hero__title");
    const isHomePageWithPreloader = !!preloaderEl && !!heroTitle;

    /* ---------- Ensure scroll is always unlocked on non-homepage / reload ---------- */
    if (!isHomePageWithPreloader) {
        unlockScroll();
        if (preloaderEl) {
            preloaderEl.classList.add("is-hidden");
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

        lockScroll();
        // prevent scroll bleed / touchmove while locked (iOS)
        const preventTouch = (e) => e.preventDefault();
        document.addEventListener("touchmove", preventTouch, { passive: false });

        // Failsafe: only fires if intro somehow stalls — keep until intro truly ends
        const unlockFailsafe = setTimeout(() => {
            unlockScroll();
            document.removeEventListener("touchmove", preventTouch);
            if (preloaderEl) {
                preloaderEl.classList.add("is-hidden");
                preloaderEl.style.display = "none";
            }
            refreshScrollTriggers();
        }, 5000);

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
                document.removeEventListener("touchmove", preventTouch);
                if (preloaderEl) {
                    preloaderEl.classList.add("is-hidden");
                    preloaderEl.style.display = "none";
                }
                unlockScroll();
                // Force layout settle then refresh all ScrollTriggers — eliminates post-preloader "tuck"
                refreshScrollTriggers();
                // extra refresh after hero stagger settles
                setTimeout(refreshScrollTriggers, 280);
            }
        });

        intro
            .to(preloaderEl, { opacity: 0, duration: 0.5, ease: "power2.inOut" })
            .add(() => {
                // hide preloader visually but KEEP scroll locked until timeline fully completes
                if (preloaderEl) {
                    preloaderEl.classList.add("is-hidden");
                    preloaderEl.style.display = "none";
                }
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
        unlockScroll();
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
        const mmenuClose = $("#mmenu-close");
        const toggleMenu = (force) => {
            const open = force !== undefined ? force : !mmenu.classList.contains("is-open");
            if (open) {
                mmenu.style.display = "flex";
                // Trigger reflow for smooth transition
                mmenu.offsetHeight;
                mmenu.classList.add("is-open");
                burger.setAttribute("aria-expanded", "true");
                burger.textContent = "Close";
                lockScroll();
            } else {
                mmenu.classList.remove("is-open");
                burger.setAttribute("aria-expanded", "false");
                burger.textContent = "Menu";
                unlockScroll();
                setTimeout(() => {
                    if (!mmenu.classList.contains("is-open")) {
                        mmenu.style.display = "none";
                    }
                }, 300);
            }
            if (window.ScrollTrigger) requestAnimationFrame(() => ScrollTrigger.refresh());
        };
        burger.addEventListener("click", () => toggleMenu());
        if (mmenuClose) {
            mmenuClose.addEventListener("click", () => toggleMenu(false));
        }

        // Close menu on any link click inside mmenu
        mmenu.addEventListener("click", (e) => {
            const link = e.target.closest("a");
            if (link) {
                toggleMenu(false);
            }
        });

        // Close menu on Escape key
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && mmenu.classList.contains("is-open")) {
                toggleMenu(false);
            }
        });

        // Close menu if viewport resized to desktop width (> 1024px)
        window.addEventListener("resize", () => {
            if (window.innerWidth > 1024 && mmenu.classList.contains("is-open")) {
                toggleMenu(false);
            }
        });

        /* ---------- Mobile menu: expandable Tools submenu ---------- */
        $$(".mmenu__expand-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                const parent = btn.closest(".mmenu__expandable");
                if (!parent) return;
                const isOpen = parent.getAttribute("data-open") === "true";
                parent.setAttribute("data-open", String(!isOpen));
                btn.setAttribute("aria-expanded", String(!isOpen));
            });
        });
    }

    /* ---------- Desktop Floating Tools Popover ---------- */
    const toolsTrigger = $("#tools-trigger");
    const toolsPopover = $("#tools-popover");
    const toolsPopoverClose = $("#tools-popover-close");
    const toolsNavItem = $("#tools-nav-item");

    if (toolsTrigger && toolsPopover) {
        const openPopover = () => {
            if (window.innerWidth <= 1024) return;
            toolsPopover.classList.add("is-active");
            toolsTrigger.classList.add("is-active");
            toolsTrigger.setAttribute("aria-expanded", "true");
        };

        const closePopover = () => {
            toolsPopover.classList.remove("is-active");
            toolsTrigger.classList.remove("is-active");
            toolsTrigger.setAttribute("aria-expanded", "false");
        };

        // Click to toggle
        toolsTrigger.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (toolsPopover.classList.contains("is-active")) {
                closePopover();
            } else {
                openPopover();
            }
        });

        // Close button inside popover
        if (toolsPopoverClose) {
            toolsPopoverClose.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                closePopover();
            });
        }

        // Clicking anywhere outside closes popover
        document.addEventListener("click", (e) => {
            if (!toolsPopover.contains(e.target) && !toolsTrigger.contains(e.target)) {
                closePopover();
            }
        });

        // Escape key closes
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && toolsPopover.classList.contains("is-active")) {
                closePopover();
            }
        });

        // Clicking any link inside closes popover
        toolsPopover.addEventListener("click", (e) => {
            if (e.target.closest("a")) {
                closePopover();
            }
        });

        // Close on resize
        window.addEventListener("resize", () => {
            if (window.innerWidth <= 1024 && toolsPopover.classList.contains("is-active")) {
                closePopover();
            }
        });
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

    /* ---------- Smooth Anchor Scrolling (Homepage) ---------- */
    const isHomePage = window.location.pathname === "/" || window.location.pathname === "";
    if (isHomePage) {
        $$('a[href^="/#"], a[href^="#"]').forEach((link) => {
            link.addEventListener("click", (e) => {
                const href = link.getAttribute("href");
                const hashIndex = href.indexOf("#");
                if (hashIndex === -1) return;
                const targetId = href.substring(hashIndex);
                if (targetId === "#" || targetId === "") return;
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    e.preventDefault();
                    targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
                    history.pushState(null, "", targetId);
                }
            });
        });
    }

    /* ---------- Newsletter Modal Popup ---------- */
    const newsletterModal = $("#newsletter-modal");
    if (newsletterModal) {
        const openModal = () => {
            if (mmenu && mmenu.classList.contains("is-open")) {
                mmenu.classList.remove("is-open");
                if (burger) {
                    burger.setAttribute("aria-expanded", "false");
                    burger.textContent = "Menu";
                }
                setTimeout(() => {
                    mmenu.style.display = "none";
                }, 300);
            }
            newsletterModal.style.display = "flex";
            newsletterModal.offsetHeight;
            newsletterModal.classList.add("is-active");
            lockScroll();
            const input = newsletterModal.querySelector(".newsletter-form__input");
            if (input) {
                setTimeout(() => input.focus(), 150);
            }
        };

        const closeModal = () => {
            newsletterModal.classList.remove("is-active");
            unlockScroll();
            setTimeout(() => {
                if (!newsletterModal.classList.contains("is-active")) {
                    newsletterModal.style.display = "none";
                }
            }, 250);
        };

        document.addEventListener("click", (e) => {
            if (e.target.closest("[data-newsletter-trigger]")) {
                e.preventDefault();
                openModal();
            } else if (e.target.closest("[data-newsletter-close]")) {
                e.preventDefault();
                closeModal();
            }
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && newsletterModal.classList.contains("is-active")) {
                closeModal();
            }
        });
    }

    /* ---------- Newsletter Subscription (AJAX Progressive Enhancement) ---------- */
    document.addEventListener("submit", (e) => {
        const form = e.target.closest("[data-newsletter-form]");
        if (!form) return;

        e.preventDefault();

        const btn = form.querySelector(".newsletter-form__btn");
        const btnText = form.querySelector(".newsletter-form__btn-text");
        const btnLoading = form.querySelector(".newsletter-form__btn-loading");
        const feedback = form.querySelector(".newsletter-form__feedback");
        const input = form.querySelector(".newsletter-form__input");

        const setFeedback = (msg, type = "success") => {
            if (!feedback) return;
            feedback.innerHTML = `<p class="newsletter-form__message newsletter-form__message--${type}">${msg}</p>`;
        };

        if (btn) btn.disabled = true;
        if (btnText) btnText.style.display = "none";
        if (btnLoading) btnLoading.style.display = "inline";
        if (feedback) feedback.innerHTML = "";

        const formData = new FormData(form);

        fetch(form.action, {
            method: "POST",
            body: formData,
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "Accept": "application/json",
            },
        })
            .then(async (response) => {
                const data = await response.json().catch(() => ({}));
                if (response.ok && data.success) {
                    const isAlready = data.already_subscribed;
                    setFeedback(data.message || "Thank you for subscribing!", isAlready ? "info" : "success");
                    if (!isAlready && input) {
                        input.value = "";
                    }
                    if (typeof window.gtag === "function") {
                        window.gtag("event", "newsletter_subscribe", {
                            event_category: "engagement",
                            event_label: form.querySelector('[name="source"]')?.value || "website",
                        });
                    }
                } else {
                    const errorMsg = data.message || "Something went wrong. Please check your email and try again.";
                    setFeedback(errorMsg, "error");
                }
            })
            .catch(() => {
                setFeedback("Network connection error. Please try again later.", "error");
            })
            .finally(() => {
                if (btn) btn.disabled = false;
                if (btnText) btnText.style.display = "inline";
                if (btnLoading) btnLoading.style.display = "none";
            });
    });

    /* ---------- GA4 / DataLayer Custom Events ---------- */
    document.addEventListener("click", (e) => {
        const target = e.target.closest("[data-event]");
        if (target) {
            const eventName = target.getAttribute("data-event");
            const eventLabel = target.getAttribute("data-event-label") || target.innerText.trim();
            if (typeof window.gtag === "function") {
                window.gtag("event", eventName, {
                    event_category: "open_source_community",
                    event_label: eventLabel,
                });
            }
            if (window.dataLayer && Array.isArray(window.dataLayer)) {
                window.dataLayer.push({
                    event: eventName,
                    event_label: eventLabel,
                });
            }
        }
    });

    // Refresh triggers once page is fully loaded — double-rAF for post-preloader settle
    window.addEventListener("load", () => {
        refreshScrollTriggers();
        // iOS address-bar collapse changes viewport height — refresh after 400ms
        setTimeout(refreshScrollTriggers, 400);
    });
    // Handle bfcache / back-forward restore where preloader may be cached
    window.addEventListener("pageshow", () => {
        unlockScroll();
        refreshScrollTriggers();
    });
})();
