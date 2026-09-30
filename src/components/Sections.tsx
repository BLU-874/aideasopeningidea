import { useRevealRoot } from './Editorial';

const PROJECTS = [
  { tag: 'Computer Vision', title: 'Project title — editable', text: 'One concise sentence about what this prototype does.', tech: ['Python', 'OpenCV'] },
  { tag: 'NLP', title: 'Project title — editable', text: 'One concise sentence about what this prototype does.', tech: ['Transformers', 'APIs'] },
  { tag: 'Automation', title: 'Project title — editable', text: 'One concise sentence about what this prototype does.', tech: ['Scripts', 'Bots'] },
  { tag: 'Robotics', title: 'Project title — editable', text: 'One concise sentence about what this prototype does.', tech: ['ROS', 'Sensors'] },
];

const FORMATS = ['Workshops', 'Hackathons', 'Project Nights', 'Guest Sessions', 'Competitions'];
const PILLARS = ['OPEN TO BEGINNERS', 'PROJECT-FIRST LEARNING', 'STUDENT-LED', 'BUILD IN PUBLIC'];

export function ProjectsSection() {
  const ref = useRevealRoot<HTMLElement>();
  return (
    <section ref={ref} id="work" className="ed-section">
      <div className="wrap">
        <div className="ed-kicker" data-reveal>Projects</div>
        <h2 className="ed-h2" data-reveal>WHAT WE&rsquo;RE<br />WORKING ON.</h2>
        <p className="ed-body" data-reveal>Some are polished. Some are prototypes. Some are still held together by questionable code. That&rsquo;s part of the process.</p>
        <div className="ed-list">
          {PROJECTS.map((p) => (
            <article key={p.tag} className="ed-row" data-reveal>
              <div>
                <div className="ed-row-tag">{p.tag}</div>
                <h3 className="ed-row-title">{p.title}</h3>
                <p className="ed-row-text">{p.text}</p>
                <div className="ed-row-tech">{p.tech.join('  ·  ')}</div>
              </div>
              <span className="ed-row-link">View project →</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function EventsSection() {
  const ref = useRevealRoot<HTMLElement>();
  return (
    <section ref={ref} id="events" className="ed-section ed-section--soft">
      <div className="wrap">
        <div className="ed-kicker" data-reveal>Learn + build</div>
        <h2 className="ed-h2" data-reveal>LEARN SOMETHING.<br />THEN BUILD SOMETHING.</h2>
        <p className="ed-body" data-reveal>Workshops are only useful if you leave wanting to open your laptop and try it yourself.</p>
        <div className="ed-formats" data-reveal>
          {FORMATS.map((f) => (<span key={f} className="ed-format">{f}</span>))}
        </div>
        <div className="ed-pillars">
          {PILLARS.map((p) => (<div key={p} className="ed-pillar" data-reveal>{p}</div>))}
        </div>
      </div>
    </section>
  );
}

export function PeopleSection() {
  const ref = useRevealRoot<HTMLElement>();
  return (
    <section ref={ref} id="team" className="ed-section">
      <div className="wrap">
        <div className="ed-kicker" data-reveal>People</div>
        <h2 className="ed-h2" data-reveal>THE PEOPLE<br />BEHIND THE PROJECTS.</h2>
        <p className="ed-body" data-reveal>Different interests. Different skill levels. One shared habit of trying things. Add real member photos, names and roles here — no placeholders with fake people.</p>
        <div className="ed-people">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="ed-person" data-reveal>
              <div className="ed-avatar">Add photo</div>
              <div className="ed-person-name">Member name</div>
              <div className="ed-person-role">Role — editable</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function JoinSection() {
  const ref = useRevealRoot<HTMLElement>();
  return (
    <section ref={ref} id="join" className="ed-join">
      <div className="wrap">
        <div className="ed-kicker" data-reveal>Join</div>
        <h2 className="ed-giant" data-reveal>YOU DON&rsquo;T HAVE<br />TO BE AN EXPERT.<br /><span className="seq-amber">YOU JUST HAVE TO START.</span></h2>
        <p className="ed-body" data-reveal>If you&rsquo;re curious about AI, bring that curiosity. We&rsquo;ll figure out the rest together.</p>
        <div className="seq-hero-actions" data-reveal>
          <a href="/contact" className="btn btn-primary">Join the Club</a>
          <a href="/contact" className="btn btn-ghost seq-ghost">Talk to us</a>
        </div>
      </div>
    </section>
  );
}
