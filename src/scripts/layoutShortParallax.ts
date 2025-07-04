import SimpleParallax from 'simple-parallax-js/vanilla';

document.addEventListener('DOMContentLoaded', () => {
  const image = document.getElementsByClassName('parallax-img');
  new SimpleParallax(image as any, { scale: 3 });
});
