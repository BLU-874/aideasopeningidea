import { useEffect, useRef } from 'react';

export function useRevealRoot<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -8% 0px' },
    );
    const els = root.querySelectorAll<HTMLElement>('[data-reveal]');
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return ref;
}

export function EditorialStatement() {
  const ref = useRevealRoot<HTMLElement>();
  return (
    <section ref={ref} className="ed-statement" aria-label="Club statement">
      <div className="wrap">
        <div className="ed-kicker" data-reveal>What we believe</div>
        <h2 className="ed-giant" data-reveal>
          WE&rsquo;RE NOT HERE<br />TO JUST TALK<br />ABOUT AI.
        </h2>
        <p className="ed-muted" data-reveal>WE BUILD WITH IT.</p>
      </div>
    </section>
  );
}

export function AboutClub() {
  const ref = useRevealRoot<HTMLElement>();
  return (
    <section ref={ref} id="about" className="ed-about">
      <div className="wrap ed-about-grid">
        <div>
          <div className="ed-kicker" data-reveal>About us</div>
          <h2 className="ed-h2" data-reveal>A PLACE TO<br />TRY THINGS.</h2>
        </div>
        <div className="ed-about-copy" data-reveal>
          <p>We&rsquo;re a student-run AI community built around learning by doing.</p>
          <p>We run sessions, build projects, experiment with new tools, take part in competitions and help each other figure things out along the way.</p>
          <p className="ed-dim">You don&rsquo;t need to know everything before joining. You just need to be interested enough to start.</p>
        </div>
      </div>
    </section>
  );
}

export function HumanMachines() {
  const ref = useRevealRoot<HTMLElement>();
  return (
    <section ref={ref} className="ed-human">
      <div className="wrap ed-human-grid">
        <div>
          <div className="ed-kicker" data-reveal>Humans × Machines</div>
          <h2 className="ed-h2" data-reveal>THE INTERESTING<br />PART IS WHAT<br />HAPPENS BETWEEN.</h2>
          <p className="ed-body" data-reveal>Models can recognize patterns. People decide which problems are worth solving. We care about both.</p>
        </div>
        <figure className="ed-human-visual" data-reveal>
          <img src="/assets/img/logo-icon.png" alt="aiDEAS mark" loading="lazy" />
          <figcaption>Curiosity in, capability out.</figcaption>
        </figure>
      </div>
    </section>
  );
}
