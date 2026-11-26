'use client';

import {useEffect} from 'react';

const easeOut = 'cubic-bezier(.22, 1, .36, 1)';

export function StorefrontMotion() {
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const entrances = new Set<Animation>();
    const disclosures = new Map<HTMLDetailsElement, {animation: Animation; opening: boolean}>();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        if (preference.matches) continue;
        const animation = entry.target.animate(
          [{opacity: .18, transform: 'translateY(16px)'}, {opacity: 1, transform: 'translateY(0)'}],
          {duration: 460, easing: easeOut},
        );
        entrances.add(animation);
        animation.onfinish = () => entrances.delete(animation);
      }
    });
    for (const section of document.querySelectorAll('main > section:not(.hero)')) {
      if (section.getBoundingClientRect().top >= window.innerHeight) observer.observe(section);
    }

    function toggle(event: MouseEvent) {
      if (event.defaultPrevented || preference.matches || !(event.target instanceof Element)) return;
      const summary = event.target.closest('summary');
      const details = summary?.parentElement;
      if (!(details instanceof HTMLDetailsElement) || !summary) return;
      event.preventDefault();
      const previous = disclosures.get(details);
      const opening = previous ? !previous.opening : !details.open;
      const start = details.getBoundingClientRect().height;
      previous?.animation.cancel();
      details.open = opening;
      const end = details.getBoundingClientRect().height;
      // Keep the content visible until a collapsing panel reaches its summary.
      details.open = true;
      const animation = details.animate(
        [{height: start + 'px', overflow: 'clip'}, {height: end + 'px', overflow: 'clip'}],
        {duration: 280, easing: easeOut},
      );
      disclosures.set(details, {animation, opening});
      animation.onfinish = () => {
        details.open = opening;
        disclosures.delete(details);
      };
    }

    function finishMotion() {
      for (const animation of entrances) animation.cancel();
      entrances.clear();
      for (const [details, {animation, opening}] of disclosures) {
        animation.cancel();
        details.open = opening;
      }
      disclosures.clear();
    }

    document.addEventListener('click', toggle);
    preference.addEventListener('change', finishMotion);
    return () => {
      observer.disconnect();
      document.removeEventListener('click', toggle);
      preference.removeEventListener('change', finishMotion);
      finishMotion();
    };
  }, []);

  return null;
}
