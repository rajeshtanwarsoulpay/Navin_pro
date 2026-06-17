import { useEffect, useRef } from 'react';

export default function ScrollAnimator() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
