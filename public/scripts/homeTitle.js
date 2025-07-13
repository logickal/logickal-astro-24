// src/scripts/homeTitle.ts
function animationEventListener() {
  const img = document.getElementById("parallax-bg");
  const hero = document.getElementById("home-title");
  const title = document.getElementById("title");
  const subtitle = document.getElementById("subtitle");
  function addRemoveClasses(item, addClasses) {
    item?.classList.add(...addClasses);
    item?.classList.remove("opacity-0");
  }
  function addAnimationClasses() {
    addRemoveClasses(hero, [
      "animate-fade",
      "animate-duration-[5000ms]",
      "animate-ease-linear"
    ]);
    addRemoveClasses(title, [
      "animate-fade",
      "animate-duration-[5000ms]",
      "animate-delay-[1500ms]",
      "animate-ease-linear"
    ]);
    addRemoveClasses(subtitle, [
      "animate-fade",
      "animate-duration-[5000ms]",
      "animate-delay-[3500ms]",
      "animate-ease-linear"
    ]);
  }
  if (img && img.complete) {
    addAnimationClasses();
  } else if (img) {
    img.addEventListener("load", addAnimationClasses);
  }
}
document.addEventListener("DOMContentLoaded", animationEventListener);
document.addEventListener("astro:after-swap", animationEventListener);
