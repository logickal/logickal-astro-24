export function useIntersectionObserver(
  element: Element,
  callback: (el: Element) => void,
  options: IntersectionObserverInit = {}
): () => void {
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
