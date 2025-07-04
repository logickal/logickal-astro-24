// src/assets/lib/intersectionObserver.ts
function useIntersectionObserver(element, callback, options = {}) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback(entry.target);
      }
    });
  }, options);
  observer.observe(element);
  return () => observer.disconnect();
}

// src/scripts/indexPage.ts
function handleIntersection(element) {
  element.classList.remove("opacity-0");
  element.classList.add("animate-fade");
}
function intersectionListener() {
  const elements = document.querySelectorAll(".intersect-full");
  elements.forEach((element) => {
    useIntersectionObserver(element, handleIntersection, {
      threshold: 0.1
    });
  });
}
document.addEventListener("DOMContentLoaded", intersectionListener);
document.addEventListener("astro:after-swap", intersectionListener);
