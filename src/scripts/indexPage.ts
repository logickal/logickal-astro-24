import { useIntersectionObserver } from '../assets/lib/intersectionObserver';

function handleIntersection(element: Element) {
  element.classList.remove('opacity-0');
  element.classList.add('animate-fade');
}

function intersectionListener() {
  const elements = document.querySelectorAll('.intersect-full');
  elements.forEach((element) => {
    useIntersectionObserver(element as Element, handleIntersection, {
      threshold: 0.1,
    });
  });
}

document.addEventListener('DOMContentLoaded', intersectionListener);
document.addEventListener('astro:after-swap', intersectionListener);
