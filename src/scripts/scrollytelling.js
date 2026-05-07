import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let initialized = false;

const motionTargets = [
  ".hero-grid",
  ".hero-copy",
  ".hero-blueprint",
  ".blueprint-explainer-section",
  ".blueprint-explainer-screen",
  ".explainer-panel",
  ".blueprint-step",
  ".map-node",
  ".outcome-card",
  "[data-horizontal-section]",
  "[data-horizontal-track]",
  ".stack-panel",
  ".section-heading",
  ".application-row",
  ".industry-card",
  ".packages-section",
  ".package-card",
  ".packages-cta",
  ".process-step",
  ".trust-card",
  ".contact-intake-section",
  ".oz-command-footer",
];

function removeStaleHeroClone() {
  document
    .querySelectorAll(".hero-blueprint-transition-clone")
    .forEach((clone) => clone.remove());
}

function cleanupScrollytelling() {
  ScrollTrigger.getAll().forEach((trigger) => {
    if (trigger.vars?.id?.startsWith("oz-")) {
      trigger.kill(true);
    }
  });

  removeStaleHeroClone();

  gsap.set(motionTargets, {
    clearProps:
      "transform,opacity,visibility,filter,clipPath,zIndex,pointerEvents",
  });
}

function isDesktop() {
  return window.matchMedia("(min-width: 769px)").matches;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function revealOnce(
  target,
  vars = {},
  triggerTarget = target,
  id = "oz-reveal",
) {
  gsap.from(target, {
    y: vars.y ?? 46,
    x: vars.x ?? 0,
    opacity: 0,
    scale: vars.scale ?? 1,
    rotateX: vars.rotateX ?? 0,
    rotateY: vars.rotateY ?? 0,
    transformPerspective: vars.transformPerspective ?? 1200,
    transformOrigin: vars.transformOrigin ?? "center center",
    ease: vars.ease ?? "power3.out",
    duration: vars.duration ?? 0.85,
    delay: vars.delay ?? 0,
    clearProps: "transform,opacity,visibility,filter,clipPath",
    scrollTrigger: {
      id,
      trigger: triggerTarget,
      start: vars.start ?? "top 86%",
      once: true,
    },
  });
}

function initHeroMotion() {
  removeStaleHeroClone();

  gsap.set(".hero-grid", {
    yPercent: 0,
    scale: 1,
    opacity: 1,
    filter: "blur(0px)",
  });

  gsap.set(".hero-blueprint", {
    opacity: 1,
    filter: "blur(0px)",
  });

  gsap.fromTo(
    ".hero-blueprint",
    {
      opacity: 0,
      filter: "blur(7px)",
    },
    {
      opacity: 1,
      filter: "blur(0px)",
      ease: "power2.out",
      duration: 0.6,
      clearProps: "filter",
    },
  );

  if (!isDesktop()) return;

  gsap.to(".hero-grid", {
    yPercent: -8,
    scale: 0.985,
    opacity: 0.08,
    filter: "blur(10px)",
    ease: "none",
    scrollTrigger: {
      id: "oz-hero-grid-soft-exit",
      trigger: "#s0",
      start: "top top",
      end: "bottom top",
      scrub: 1.05,
      invalidateOnRefresh: true,
    },
  });
}

function initBlueprintHorizontalStage() {
  const stage = document.querySelector(".blueprint-horizontal-stage");
  const blueprintLayer = stage?.querySelector(".blueprint-layer");
  const horizontalLayer = stage?.querySelector(".horizontal-layer");
  const blueprintScreen = stage?.querySelector(".blueprint-explainer-screen");
  const horizontalSection = stage?.querySelector("[data-horizontal-section]");
  const horizontalTrack = stage?.querySelector("[data-horizontal-track]");

  if (
    !stage ||
    !blueprintLayer ||
    !horizontalLayer ||
    !blueprintScreen ||
    !horizontalSection ||
    !horizontalTrack
  ) {
    return;
  }

  if (!isDesktop()) {
    revealOnce(
      blueprintLayer,
      {
        y: 42,
        scale: 0.98,
      },
      blueprintLayer,
      "oz-blueprint-mobile",
    );

    revealOnce(
      horizontalSection,
      {
        y: 42,
        scale: 0.98,
      },
      horizontalSection,
      "oz-horizontal-mobile",
    );

    return;
  }

  const panels = stage.querySelectorAll(".explainer-panel");
  const details = stage.querySelectorAll(
    ".blueprint-step, .map-node, .outcome-card",
  );

  const getHorizontalDistance = () => {
    return Math.max(0, horizontalTrack.scrollWidth - window.innerWidth);
  };

  const getScrollLength = () => {
    const distance = getHorizontalDistance();
    return `+=${Math.round(window.innerHeight * 2.4 + distance)}`;
  };

  gsap.set(stage, {
    height: "100vh",
    minHeight: "100vh",
    overflow: "hidden",
  });

  gsap.set(blueprintLayer, {
    xPercent: 0,
    autoAlpha: 1,
    zIndex: 2,
    pointerEvents: "none",
    filter: "blur(0px)",
  });

  gsap.set(blueprintScreen, {
    y: 34,
    scale: 0.975,
    autoAlpha: 0,
    filter: "blur(12px)",
    transformPerspective: 1400,
    transformOrigin: "center center",
  });

  gsap.set(horizontalLayer, {
    xPercent: 0,
    autoAlpha: 1,
    zIndex: 4,
    pointerEvents: "auto",
    filter: "blur(0px)",
  });

  gsap.set(horizontalSection, {
    autoAlpha: 1,
    width: "100%",
    height: "100vh",
    minHeight: "100vh",
    overflow: "hidden",
  });

  gsap.set(horizontalTrack, {
    x: 0,
    autoAlpha: 1,
  });

  gsap.set(stage.querySelectorAll(".stack-panel"), {
    autoAlpha: 1,
    clearProps: "filter,clipPath",
  });

  gsap.set(panels, {
    y: 28,
    opacity: 0,
    scale: 0.975,
    filter: "blur(8px)",
  });

  gsap.set(details, {
    y: 18,
    opacity: 0,
    scale: 0.975,
    filter: "blur(7px)",
  });

  const timeline = gsap.timeline({
    scrollTrigger: {
      id: "oz-blueprint-horizontal-stage",
      trigger: stage,
      start: "top top",
      end: getScrollLength,
      scrub: 1.05,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onRefresh: () => {
        gsap.set(horizontalLayer, {
          x: window.innerWidth,
          xPercent: 0,
          autoAlpha: 1,
        });

        gsap.set(horizontalTrack, {
          x: 0,
          autoAlpha: 1,
        });

        gsap.set(stage.querySelectorAll(".stack-panel"), {
          autoAlpha: 1,
        });
      },
    },
  });

  timeline
    .to(blueprintScreen, {
      y: 0,
      scale: 1,
      autoAlpha: 1,
      filter: "blur(0px)",
      ease: "none",
      duration: 0.8,
    })
    .to(
      panels,
      {
        y: 0,
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        stagger: 0.06,
        ease: "none",
        duration: 0.7,
      },
      0.15,
    )
    .to(
      details,
      {
        y: 0,
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        stagger: 0.025,
        ease: "none",
        duration: 0.65,
      },
      0.35,
    )
    .to(
      {},
      {
        duration: 1.05,
      },
    )
    .to(
      blueprintLayer,
      {
        xPercent: -105,
        autoAlpha: 0.18,
        filter: "blur(12px)",
        ease: "none",
        duration: 1.05,
      },
      ">",
    )
    .to(
      horizontalLayer,
      {
        x: 0,
        xPercent: 0,
        autoAlpha: 1,
        filter: "blur(0px)",
        ease: "none",
        duration: 1.15,
      },
      "<",
    )
    .set(blueprintLayer, {
      autoAlpha: 0,
    })
    .to(
      {},
      {
        duration: 0.45,
      },
    )
    .to(horizontalTrack, {
      x: () => -getHorizontalDistance(),
      ease: "none",
      duration: () =>
        Math.max(2.2, getHorizontalDistance() / window.innerWidth),
    });
}

function initHorizontalScroll() {
  const section = document.querySelector("[data-horizontal-section]");
  const track = section?.querySelector("[data-horizontal-track]");

  if (!section || !track) return;

  gsap.set(section, {
    autoAlpha: 1,
  });

  gsap.set(track, {
    x: 0,
    autoAlpha: 1,
  });

  gsap.set(section.querySelectorAll(".stack-panel"), {
    autoAlpha: 1,
    clearProps: "filter,clipPath",
  });

  if (!isDesktop()) {
    revealOnce(
      section,
      {
        y: 42,
        scale: 0.98,
      },
      section,
      "oz-horizontal-mobile",
    );

    return;
  }

  const getHorizontalDistance = () => {
    return Math.max(0, track.scrollWidth - window.innerWidth);
  };

  const getScrollLength = () => {
    const distance = getHorizontalDistance();
    return `+=${Math.round(distance + window.innerHeight * 0.9)}`;
  };

  gsap.to(track, {
    x: () => -getHorizontalDistance(),
    ease: "none",
    scrollTrigger: {
      id: "oz-horizontal-scroll",
      trigger: section,
      start: "top top",
      end: getScrollLength,
      scrub: 1.05,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onRefresh: () => {
        gsap.set(track, {
          x: 0,
          autoAlpha: 1,
        });

        gsap.set(section.querySelectorAll(".stack-panel"), {
          autoAlpha: 1,
        });
      },
    },
  });
}

function initSupportingSectionMotion() {
  if (!isDesktop()) {
    gsap.utils.toArray(".section-heading").forEach((heading, index) => {
      revealOnce(
        heading,
        {
          y: 42,
          scale: 0.985,
        },
        heading,
        `oz-section-heading-mobile-${index}`,
      );
    });

    gsap.utils.toArray(".application-row").forEach((row, index) => {
      revealOnce(
        row,
        {
          y: 42,
        },
        row,
        `oz-application-row-mobile-${index}`,
      );
    });

    gsap.utils.toArray(".industry-card").forEach((card, index) => {
      revealOnce(
        card,
        {
          y: 42,
          scale: 0.975,
          delay: index * 0.035,
        },
        card,
        `oz-industry-card-mobile-${index}`,
      );
    });

    gsap.utils.toArray(".package-card").forEach((card, index) => {
      revealOnce(
        card,
        {
          y: 42,
          scale: 0.975,
          delay: index * 0.04,
        },
        card,
        `oz-package-card-mobile-${index}`,
      );
    });

    gsap.utils.toArray(".process-step").forEach((step, index) => {
      revealOnce(
        step,
        {
          y: 42,
          scale: 0.975,
          delay: index * 0.04,
        },
        step,
        `oz-process-step-mobile-${index}`,
      );
    });

    gsap.utils.toArray(".trust-card").forEach((card, index) => {
      revealOnce(
        card,
        {
          y: 40,
          scale: 0.98,
          delay: index * 0.035,
        },
        card,
        `oz-trust-card-mobile-${index}`,
      );
    });

    revealOnce(
      ".packages-cta",
      {
        y: 36,
      },
      ".packages-cta",
      "oz-packages-cta-mobile",
    );

    revealOnce(
      ".contact-intake-section",
      {
        y: 46,
        scale: 0.98,
      },
      ".contact-intake-section",
      "oz-contact-intake-mobile",
    );

    revealOnce(
      ".oz-command-footer",
      {
        y: 46,
        scale: 0.98,
      },
      ".oz-command-footer",
      "oz-footer-reveal-mobile",
    );

    return;
  }

  const framedSections = gsap.utils.toArray(
    ".applications-section, .industries-section, .packages-section, .process-section, .trust-section, .contact-intake-section",
  );

  framedSections.forEach((section, index) => {
    gsap.fromTo(
      section,
      {
        y: 64,
        scale: 0.96,
        opacity: 0.78,
        clipPath: "inset(7% 5% round 1.5rem)",
        filter: "blur(7px)",
      },
      {
        y: 0,
        scale: 1,
        opacity: 1,
        clipPath: "inset(0% 0% round 0rem)",
        filter: "blur(0px)",
        ease: "none",
        scrollTrigger: {
          id: `oz-section-frame-${index}`,
          trigger: section,
          start: "top 94%",
          end: "top 42%",
          scrub: 1.05,
          invalidateOnRefresh: true,
        },
      },
    );
  });

  gsap.utils.toArray(".section-heading").forEach((heading, index) => {
    gsap.fromTo(
      heading,
      {
        y: 58,
        opacity: 0,
        scale: 0.95,
        filter: "blur(8px)",
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        ease: "none",
        scrollTrigger: {
          id: `oz-section-heading-${index}`,
          trigger: heading,
          start: "top 92%",
          end: "top 55%",
          scrub: 1,
        },
      },
    );
  });

  gsap.utils.toArray(".application-row").forEach((row, index) => {
    gsap.fromTo(
      row,
      {
        xPercent: index % 2 === 0 ? 8 : -8,
        y: 38,
        opacity: 0,
        scale: 0.94,
        rotateY: index % 2 === 0 ? -6 : 6,
        filter: "blur(7px)",
        transformPerspective: 1200,
      },
      {
        xPercent: 0,
        y: 0,
        opacity: 1,
        scale: 1,
        rotateY: 0,
        filter: "blur(0px)",
        ease: "none",
        scrollTrigger: {
          id: `oz-application-row-${index}`,
          trigger: row,
          start: "top 94%",
          end: "top 52%",
          scrub: 1.05,
        },
      },
    );
  });

  gsap.utils.toArray(".industry-card").forEach((card, index) => {
    gsap.fromTo(
      card,
      {
        y: 82,
        opacity: 0,
        scale: 0.9,
        rotateX: 10,
        filter: "blur(7px)",
        transformPerspective: 1200,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        rotateX: 0,
        filter: "blur(0px)",
        ease: "none",
        scrollTrigger: {
          id: `oz-industry-card-${index}`,
          trigger: card,
          start: "top 96%",
          end: "top 56%",
          scrub: 1.05,
        },
      },
    );
  });

  gsap.utils.toArray(".package-card").forEach((card, index) => {
    gsap.fromTo(
      card,
      {
        y: 82,
        opacity: 0,
        scale: 0.9,
        rotateX: 10,
        filter: "blur(7px)",
        transformPerspective: 1200,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        rotateX: 0,
        filter: "blur(0px)",
        ease: "none",
        scrollTrigger: {
          id: `oz-package-card-${index}`,
          trigger: card,
          start: "top 96%",
          end: "top 56%",
          scrub: 1.05,
        },
      },
    );
  });

  gsap.fromTo(
    ".packages-cta",
    {
      y: 56,
      opacity: 0,
      scale: 0.94,
      filter: "blur(7px)",
    },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      ease: "none",
      scrollTrigger: {
        id: "oz-packages-cta",
        trigger: ".packages-cta",
        start: "top 94%",
        end: "top 60%",
        scrub: 1,
      },
    },
  );

  gsap.utils.toArray(".process-step").forEach((step, index) => {
    gsap.fromTo(
      step,
      {
        y: 78,
        xPercent: index % 2 === 0 ? -4 : 4,
        opacity: 0,
        scale: 0.92,
        rotateY: index % 2 === 0 ? 5 : -5,
        filter: "blur(7px)",
        transformPerspective: 1200,
      },
      {
        y: 0,
        xPercent: 0,
        opacity: 1,
        scale: 1,
        rotateY: 0,
        filter: "blur(0px)",
        ease: "none",
        scrollTrigger: {
          id: `oz-process-step-${index}`,
          trigger: step,
          start: "top 96%",
          end: "top 56%",
          scrub: 1.05,
        },
      },
    );
  });

  gsap.utils.toArray(".trust-card").forEach((card, index) => {
    gsap.fromTo(
      card,
      {
        y: 68,
        opacity: 0,
        scale: 0.92,
        rotateX: 8,
        filter: "blur(7px)",
        transformPerspective: 1200,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        rotateX: 0,
        filter: "blur(0px)",
        ease: "none",
        scrollTrigger: {
          id: `oz-trust-card-${index}`,
          trigger: card,
          start: "top 94%",
          end: "top 58%",
          scrub: 1.05,
        },
      },
    );
  });

  gsap.fromTo(
    ".contact-intake-section",
    {
      y: 78,
      opacity: 0,
      scale: 0.93,
      clipPath: "inset(7% 6% round 1.5rem)",
      filter: "blur(8px)",
    },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      clipPath: "inset(0% 0% round 0rem)",
      filter: "blur(0px)",
      ease: "none",
      scrollTrigger: {
        id: "oz-contact-intake",
        trigger: ".contact-intake-section",
        start: "top 94%",
        end: "top 48%",
        scrub: 1.1,
      },
    },
  );

  gsap.fromTo(
    ".oz-command-footer",
    {
      y: 76,
      opacity: 0,
      scale: 0.93,
      rotateX: 6,
      filter: "blur(8px)",
      transformPerspective: 1200,
    },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      rotateX: 0,
      filter: "blur(0px)",
      ease: "power3.out",
      duration: 0.9,
      clearProps: "transform,opacity,filter",
      scrollTrigger: {
        id: "oz-footer-reveal",
        trigger: ".oz-command-footer",
        start: "top 88%",
        once: true,
      },
    },
  );
}


function initPostHorizontalHardStops() {
  if (!isDesktop()) return;

  const hardStopSections = [
    {
      selector: ".applications-section",
      id: "oz-hard-stop-applications",
      length: 0.85,
    },
    {
      selector: ".packages-section",
      id: "oz-hard-stop-packages",
      length: 0.62,
    },
    {
      selector: ".process-section",
      id: "oz-hard-stop-process",
      length: 0.78,
    },
  ];

  hardStopSections.forEach(({ selector, id, length }) => {
    const section = document.querySelector(selector);
    if (!section) return;

    gsap.set(section, {
      minHeight: "100vh",
    });

    ScrollTrigger.create({
      id,
      trigger: section,
      start: "top top",
      end: () => `+=${Math.round(window.innerHeight * length)}`,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    });
  });
}

function initScrollytelling() {
  if (initialized) return;
  initialized = true;

  cleanupScrollytelling();

  if (prefersReducedMotion()) {
    ScrollTrigger.refresh();
    return;
  }

  initHeroMotion();
  initBlueprintHorizontalStage();
  initSupportingSectionMotion();
  initPostHorizontalHardStops();

  ScrollTrigger.refresh();
}

function bootScrollytelling() {
  initialized = false;

  requestAnimationFrame(() => {
    requestAnimationFrame(initScrollytelling);
  });
}

window.addEventListener("resize", () => {
  initialized = false;
  cleanupScrollytelling();
  bootScrollytelling();
});

window.addEventListener(
  "load",
  () => {
    ScrollTrigger.refresh();
  },
  { passive: true },
);

document.addEventListener("DOMContentLoaded", bootScrollytelling);
document.addEventListener("astro:page-load", bootScrollytelling);

if (document.readyState !== "loading") {
  bootScrollytelling();
}
