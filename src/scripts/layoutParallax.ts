import SimpleParallax from 'simple-parallax-js/vanilla';

function initParallax() {
  const image = document.getElementsByClassName('parallax-img');
  new SimpleParallax(image as any, { scale: 1.8 });
}

document.addEventListener('DOMContentLoaded', () => {
  initParallax();
});

document.addEventListener('astro:after-swap', () => {
  initParallax();
});
