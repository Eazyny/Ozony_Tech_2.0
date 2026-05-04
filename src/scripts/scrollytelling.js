import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let initialized = false;

function cleanupScrollytelling() {
  ScrollTrigger.getAll().forEach((trigger) => {
    if (trigger.vars?.id?.startsWith("oz-")) {
      trigger.kill(true);
    }
  });

  gsap.set("[data-horizontal-track]", { clearProps: "transform" });
}

function initScrollytelling() {
  if (initialized) return;
  initialized = true;

  cleanupScrollytelling();

  const desktopQuery = window.matchMedia("(min-width: 769px)");

  if (!desktopQuery.matches) {
    ScrollTrigger.refresh();
    return;
  }

  const horizontalSections = document.querySelectorAll(
    "[data-horizontal-section]",
  );

  horizontalSections.forEach((section, index) => {
    const track = section.querySelector("[data-horizontal-track]");
    if (!track) return;

    const getDistance = () => {
      return Math.max(0, track.scrollWidth - window.innerWidth);
    };

    gsap.to(track, {
      x: () => -getDistance(),
      ease: "none",
      scrollTrigger: {
        id: `oz-horizontal-${index}`,
        trigger: section,
        start: "top top",
        end: () => `+=${getDistance()}`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });
  });

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

document.addEventListener("DOMContentLoaded", bootScrollytelling);
document.addEventListener("astro:page-load", bootScrollytelling);

if (document.readyState !== "loading") {
  bootScrollytelling();
}
