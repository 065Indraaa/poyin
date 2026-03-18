import { useEffect } from 'react';

export function useScrollReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.06 }
    );

    // Observe all .reveal elements
    const refresh = () => {
      document.querySelectorAll('.reveal:not(.in)').forEach((el) => obs.observe(el));
    };

    refresh();

    // Re-run on DOM changes (new panel content)
    const mutObs = new MutationObserver(refresh);
    mutObs.observe(document.body, { childList: true, subtree: true });

    return () => {
      obs.disconnect();
      mutObs.disconnect();
    };
  }, []);
}
