import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const CONFIG = {
  herName: "Mimosa",
  yourName: "Karthik",
  birthDate: { year: 2005, month: 6, day: 3 },
  letter: `My Dear Friend,

Wish you many more happy returns of the day pa🩷 enaku ketacha bestest friend athu nee mattum than 🫂.

Evalo naal oru ponnu evalo close and evlo time ente pesitu irukanga na athu nee mattum than🫵🏻 eppaume life long happy ahh iru na eppauve unaku oru nalla friend💗ahh irupen enaku enna sollurathunu therila eppaume onney onnu tha happy ahh iru I always with you 🫶🏻.`,
  signature: "Always your Best Friend,",
  reasons: [
    { title: "Your Laugh", text: "The first thing I think of in the morning and the last sound I want to hear at night." },
    { title: "Your Kindness", text: "You make everyone around you feel seen - and you make me want to be better." },
    { title: "Your Eyes", text: "I could get lost in them and never once want to find my way back." },
    { title: "Your Mind", text: "The way you see the world turns every conversation into an adventure." },
    { title: "Your Heart", text: "The warmest, bravest, most generous thing I have ever known." },
    { title: "Us", text: "Whatever we are, wherever we go - it's my favorite place to be." },
  ],
  photos: [
    "/photos/photo-1.jpeg",
    "/photos/photo-2.jpeg",
    "/photos/photo-3.jpeg",
    "/photos/photo-4.jpeg",
  ],
};

const scenes = [
  { id: "welcome", label: "Welcome", tone: "soft" },
  { id: "countdown", label: "Countdown", tone: "wine" },
  { id: "letter", label: "Letter", tone: "cream" },
  { id: "gallery", label: "Gallery", tone: "cream" },
  { id: "cake", label: "Cake", tone: "blush" },
  { id: "closing", label: "Closing", tone: "blush" },
];

function App() {
  const [index, setIndex] = useState(0);
  const [musicOn, setMusicOn] = useState(false);
  const audioRef = useRef(null);
  const scene = scenes[index];

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.55;
    if (musicOn) audio.play().catch(() => setMusicOn(false));
    else audio.pause();
  }, [musicOn]);

  const go = (nextIndex) => setIndex(Math.max(0, Math.min(scenes.length - 1, nextIndex)));

  return (
    <main className={`app-shell tone-${scene.tone}`}>
      <audio ref={audioRef} loop preload="none">
        <source src="/audio/song.mp3" type="audio/mpeg" />
      </audio>

      <MusicToggle playing={musicOn} onClick={() => setMusicOn((v) => !v)} />

      <div className="scene-frame" key={scene.id}>
        {scene.id === "welcome" && <Welcome />}
        {scene.id === "countdown" && <Countdown />}
        {scene.id === "letter" && <Letter />}
        {scene.id === "gallery" && <Gallery />}
        {scene.id === "cake" && <Cake />}
        {scene.id === "closing" && <Closing onRestart={() => go(0)} />}
      </div>

      <NavControls index={index} onPrev={() => go(index - 1)} onNext={() => go(index + 1)} onJump={go} />
    </main>
  );
}

function MusicToggle({ playing, onClick }) {
  return (
    <button className={`music-toggle ${playing ? "playing" : ""}`} onClick={onClick} aria-label="Toggle music" title="Play / pause music">
      <span className="eq" aria-hidden="true"><i /><i /><i /><i /></span>
      <svg className="muted-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 18V6l10-2v12" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="16" cy="16" r="3" />
        <line x1="3" y1="3" x2="21" y2="21" strokeWidth="1.6" />
      </svg>
    </button>
  );
}

function NavControls({ index, onPrev, onNext, onJump }) {
  return (
    <nav className="nav-controls" aria-label="Scene navigation">
      <button className="nav-btn" onClick={onPrev} disabled={index === 0}>Back</button>
      <div className="dots" role="tablist" aria-label="Sections">
        {scenes.map((scene, i) => (
          <button
            key={scene.id}
            className={`dot ${i === index ? "active" : ""}`}
            onClick={() => onJump(i)}
            aria-label={scene.label}
            aria-selected={i === index}
          />
        ))}
      </div>
      <button className="nav-btn" onClick={onNext} disabled={index === scenes.length - 1}>Next</button>
    </nav>
  );
}

function Welcome() {
  return (
    <section className="scene-content welcome">
      <Petals />
      <p className="kicker">A little something for</p>
      <h1 className="display welcome-name">{CONFIG.herName}</h1>
      <p className="lede">Made with my whole heart. Click through it slowly.</p>
    </section>
  );
}

function Countdown() {
  const elapsed = useElapsed(CONFIG.birthDate);
  const start = useMemo(
    () => new Date(CONFIG.birthDate.year, CONFIG.birthDate.month - 1, CONFIG.birthDate.day),
    []
  );
  return (
    <section className="scene-content">
      <p className="kicker">Birthday clock</p>
      <h2 className="display scene-title">The beautiful life<br />still going strong</h2>
      <div className="count-grid">
        <CountCell value={elapsed.days.toLocaleString()} label="Days" />
        <CountCell value={pad(elapsed.hours)} label="Hours" />
        <CountCell value={pad(elapsed.minutes)} label="Minutes" />
        <CountCell value={pad(elapsed.seconds)} label="Seconds" />
      </div>
      <p className="count-since">since her birthday, <b>{start.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}</b></p>
    </section>
  );
}

function useElapsed(metDate) {
  const getElapsed = () => {
    let diff = Math.max(0, Date.now() - new Date(metDate.year, metDate.month - 1, metDate.day).getTime());
    const days = Math.floor(diff / 86400000); diff -= days * 86400000;
    const hours = Math.floor(diff / 3600000); diff -= hours * 3600000;
    const minutes = Math.floor(diff / 60000); diff -= minutes * 60000;
    const seconds = Math.floor(diff / 1000);
    return { days, hours, minutes, seconds };
  };
  const [elapsed, setElapsed] = useState(getElapsed);
  useEffect(() => {
    const timer = window.setInterval(() => setElapsed(getElapsed()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  return elapsed;
}

function CountCell({ value, label }) {
  return <div className="count-cell"><span className="count-num">{value}</span><span className="count-label">{label}</span></div>;
}

function Letter() {
  const [open, setOpen] = useState(false);
  return (
    <section className="scene-content">
      <p className="kicker">In my own words</p>
      <h2 className="display scene-title">A letter for you</h2>
      <button className={`letter-envelope ${open ? "open" : ""}`} onClick={() => setOpen(true)} aria-expanded={open}>
        <span className="envelope-flap" />
        <span className="letter-paper">
          {open ? (
            <>
              <span className="letter-body">{CONFIG.letter}</span>
              <span className="letter-sign">{CONFIG.signature}</span>
              <span className="letter-name">{CONFIG.yourName}</span>
            </>
          ) : (
            <span className="sealed-note">Click to unfold</span>
          )}
        </span>
        <span className="letter-seal" aria-hidden="true">heart</span>
      </button>
    </section>
  );
}

function Reasons() {
  const [flipped, setFlipped] = useState({});
  return (
    <section className="scene-content">
      <p className="kicker">A few of so many</p>
      <h2 className="display scene-title">Reasons I'm crazy about you</h2>
      <div className="cards">
        {CONFIG.reasons.map((reason, i) => (
          <button
            className={`flip ${flipped[i] ? "flipped" : ""}`}
            key={reason.title}
            onClick={() => setFlipped((value) => ({ ...value, [i]: !value[i] }))}
          >
            <span className="flip-inner">
              <span className="flip-face flip-front">
                <span className="flip-num">No. {String(i + 1).padStart(2, "0")}</span>
                <span className="flip-title">{reason.title}</span>
                <span className="flip-hint">tap to read</span>
              </span>
              <span className="flip-face flip-back"><span>{reason.text}</span></span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

function Gallery() {
  const rotations = [-3, 2, -1.5, 2.5];
  return (
    <section className="scene-content">
      <p className="kicker">Moments I keep</p>
      <h2 className="display scene-title">Us</h2>
      <div className="gallery">
        {CONFIG.photos.map((src, i) => (
          <div className="polaroid" style={{ "--rot": `${rotations[i]}deg` }} key={src}>
            <img className="photo-card-img" src={src} alt="" />
          </div>
        ))}
      </div>
    </section>
  );
}

function ImageDrop({ id }) {
  const [src, setSrc] = useState(() => localStorage.getItem(id) || "");
  const inputRef = useRef(null);

  const readFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const value = reader.result;
      setSrc(value);
      localStorage.setItem(id, value);
    };
    reader.readAsDataURL(file);
  };

  return (
    <button
      className="image-drop"
      onClick={() => inputRef.current?.click()}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        readFile(event.dataTransfer.files?.[0]);
      }}
    >
      {src ? <img src={src} alt="" /> : <span>Drop a photo</span>}
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={(event) => readFile(event.target.files?.[0])} />
    </button>
  );
}

function Cake() {
  const [blown, setBlown] = useState(false);
  const [wind, setWind] = useState([]);
  const [confetti, setConfetti] = useState([]);
  const glitter = useMemo(() => Array.from({ length: 78 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * -9}s`,
    duration: `${7 + Math.random() * 8}s`,
    size: `${4 + Math.random() * 7}px`,
  })), []);
  const bulbs = useMemo(() => Array.from({ length: 26 }, (_, i) => ({
    id: i,
    color: ["#f7c948", "#f0718a", "#7bdff2", "#b2f7a8", "#ffffff"][i % 5],
    delay: `${(i % 6) * 180}ms`,
  })), []);

  const blow = () => {
    const now = Date.now();
    const windLines = Array.from({ length: 5 }, (_, i) => ({
      id: `w-${now}-${i}`,
      top: `calc(50% - 38px + ${i * 18}px)`,
      delay: `${i * 45}ms`,
      duration: `${720 + i * 70}ms`,
    }));
    const colors = ["#C96E73", "#7C2E3B", "#C39A4E", "#E2C892", "#F6E9E0", "#DB8A8A"];
    const paperCount = window.innerWidth < 720 ? 46 : 74;
    const papers = Array.from({ length: paperCount }, (_, i) => {
      const fromLeft = i % 2 === 0;
      return {
        id: `c-${now}-${i}`,
        left: `${fromLeft ? Math.random() * 18 : 82 + Math.random() * 18}vw`,
        drift: `${(fromLeft ? 1 : -1) * (120 + Math.random() * 280)}px`,
        fall: `${window.innerHeight + 90 + Math.random() * 180}px`,
        spin: `${(fromLeft ? 1 : -1) * (360 + Math.random() * 760)}deg`,
        delay: `${Math.random() * 280}ms`,
        duration: `${2600 + Math.random() * 1700}ms`,
        color: colors[Math.floor(Math.random() * colors.length)],
        width: `${6 + Math.random() * 8}px`,
        height: `${10 + Math.random() * 12}px`,
      };
    });

    setBlown(false);
    window.requestAnimationFrame(() => setBlown(true));
    setWind(windLines);
    setConfetti(papers);
    window.setTimeout(() => setWind([]), 1400);
    window.setTimeout(() => setConfetti([]), 4700);
  };

  return (
    <section className="scene-content cake-scene">
      <div className="string-lights" aria-hidden="true">
        {bulbs.map((bulb) => <span style={{ "--bulb": bulb.color, "--delay": bulb.delay }} key={bulb.id} />)}
      </div>
      <div className="glitter-rain" aria-hidden="true">
        {glitter.map((spark) => (
          <span
            style={{
              left: spark.left,
              animationDelay: spark.delay,
              animationDuration: spark.duration,
              width: spark.size,
              height: spark.size,
            }}
            key={spark.id}
          />
        ))}
      </div>
      <p className="kicker">One more thing</p>
      <h2 className="display scene-title">Make a wish</h2>
      <div className={`cake ${blown ? "blown" : ""}`} aria-label="Birthday cake with candles">
        <div className="candles" aria-hidden="true">
          <span className="candle"><i /></span>
          <span className="candle"><i /></span>
          <span className="candle"><i /></span>
        </div>
        <div className="cake-top" />
        <div className="cake-layer cake-layer-one" />
        <div className="cake-layer cake-layer-two" />
        <div className="plate" />
      </div>
      <div className={`birthday-lights ${blown ? "on" : ""}`} aria-hidden={!blown}>Happy Birthday</div>
      <button className="blow-btn" onClick={blow} type="button">
        {blown ? "Blow again" : "Blow candles"}
      </button>
      {wind.map((line) => (
        <span
          className="wind"
          style={{ top: line.top, animationDelay: line.delay, animationDuration: line.duration }}
          key={line.id}
        />
      ))}
      {confetti.map((piece) => (
        <span
          className="confetti"
          style={{
            left: piece.left,
            "--drift": piece.drift,
            "--fall": piece.fall,
            "--spin": piece.spin,
            animationDelay: piece.delay,
            animationDuration: piece.duration,
            background: piece.color,
            width: piece.width,
            height: piece.height,
          }}
          key={piece.id}
        />
      ))}
    </section>
  );
}

function Closing({ onRestart }) {
  return (
    <section className="scene-content closing-scene">
      <div className="closing-gif" aria-label="Cute birthday sticker">
        <img src="/photos/mad-transparent.gif" alt="" />
      </div>
      <p className="kicker">No matter what</p>
      <p className="closing-script">Forever, your BestFriend.</p>
      <p className="signature">Made with love<b>{CONFIG.yourName}</b></p>
      <button className="replay" onClick={onRestart}>Start over</button>
    </section>
  );
}

function Petals() {
  const petals = useMemo(() => Array.from({ length: 16 }, (_, i) => ({
    id: i,
    style: {
      "--left": `${Math.random() * 100}%`,
      "--delay": `${Math.random() * -12}s`,
      "--duration": `${9 + Math.random() * 9}s`,
      "--size": `${12 + Math.random() * 22}px`,
    },
  })), []);
  return <div className="petals" aria-hidden="true">{petals.map((p) => <span className="petal" style={p.style} key={p.id}>heart</span>)}</div>;
}

function pad(value) {
  return String(value).padStart(2, "0");
}

createRoot(document.getElementById("root")).render(<App />);
