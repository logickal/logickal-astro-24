// src/assets/lib/useIntersectionObserver.js
export function useIntersectionObserver(element, callback, options = {}) {
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