function animationEventListener() {
  const img = document.getElementById('parallax-bg') as HTMLImageElement | null;
  const hero = document.getElementById('home-title') as HTMLElement | null;
  const title = document.getElementById('title') as HTMLElement | null;
  const subtitle = document.getElementById('subtitle') as HTMLElement | null;

  function addRemoveClasses(item: HTMLElement | null, addClasses: string[]) {
    item?.classList.add(...addClasses);
    item?.classList.remove('opacity-0');
  }

  function addAnimationClasses() {
    addRemoveClasses(hero, [
      'animate-fade',
      'animate-duration-[5000ms]',
      'animate-ease-linear',
    ]);
    addRemoveClasses(title, [
      'animate-fade',
      'animate-duration-[5000ms]',
      'animate-delay-[1500ms]',
      'animate-ease-linear',
    ]);
    addRemoveClasses(subtitle, [
      'animate-fade',
      'animate-duration-[5000ms]',
      'animate-delay-[3500ms]',
      'animate-ease-linear',
    ]);
  }

  if (img && img.complete) {
    addAnimationClasses();
  } else if (img) {
    img.addEventListener('load', addAnimationClasses);
  }
}

document.addEventListener('DOMContentLoaded', animationEventListener);
document.addEventListener('astro:after-swap', animationEventListener);
