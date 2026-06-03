/* ============================================================
   FOR YOU — interactive love note
   ----------------------------------------------------------
   ✏️  PERSONALIZE EVERYTHING HERE  ✏️
   Edit the CONFIG object below — names, the date you met,
   the letter, the reasons, the photo captions, and the
   floating heart messages. Nothing else needs touching.
   ============================================================ */

const CONFIG = {
  // Her name — shown big on the opening screen
  herName: "My Love",

  // Your name — shown on the closing screen
  yourName: "Me",

  // The day it all began (YYYY, MM is 1-12, DD).
  // Powers the live "time together" counter.
  metDate: { year: 2021, month: 8, day: 14 },

  // The handwritten letter. Use blank lines for paragraph breaks.
  letter:
`My love,

I'm not always good with words out loud, so I tucked them in here where you can keep them.

Thank you for every ordinary day you turn extraordinary just by being in it — for your patience, your laughter, and the way you reach for my hand without even thinking.

I don't know what I did to deserve you. But I promise to spend every single day trying to be worthy of it.`,

  // Signed, in handwriting
  signature: "Always yours,",

  // Six reasons. title = front of card, text = the reveal on the back.
  reasons: [
    { title: "Your Laugh",    text: "The first thing I think of in the morning and the last sound I want to hear at night." },
    { title: "Your Kindness", text: "You make everyone around you feel seen — and you make me want to be better." },
    { title: "Your Eyes",     text: "I could get lost in them and never once want to find my way back." },
    { title: "Your Mind",     text: "The way you see the world turns every conversation into an adventure." },
    { title: "Your Heart",    text: "The warmest, bravest, most generous thing I have ever known." },
    { title: "Us",            text: "Whatever we are, wherever we go — it's my favorite place to be." },
  ],

  // Captions under each photo (handwriting style)
  captions: ["the beginning", "that morning", "just us", "golden hour", "my favorite smile", "always"],

  // Little notes that float up when she taps the heart
  heartMessages: [
    "I love you ❤", "you're my favorite", "forever & always",
    "my whole heart", "you + me", "always you", "te amo ❤", "my person",
  ],
};

/* ============================================================
   Below is the machinery — no need to edit.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  hydrateContent();
  initReveal();
  initCountdown();
  initFlipCards();
  initPetals();
  initCake();
  initMusic();
});

/* ---------- inject config into the DOM ---------- */
function hydrateContent() {
  document.querySelectorAll("[data-her-name]").forEach(el => el.textContent = CONFIG.herName);
  document.querySelectorAll("[data-your-name]").forEach(el => el.textContent = CONFIG.yourName);

  document.querySelector("[data-letter-body]").textContent = CONFIG.letter;
  document.querySelector("[data-letter-sign]").textContent = CONFIG.signature;

  // reasons -> flip cards
  const cards = document.getElementById("cards");
  CONFIG.reasons.forEach((r, i) => {
    const flip = document.createElement("div");
    flip.className = "flip";
    flip.innerHTML = `
      <div class="flip-inner">
        <div class="flip-face flip-front">
          <div class="flip-num">№ ${String(i + 1).padStart(2, "0")}</div>
          <div class="flip-title">${r.title}</div>
          <div class="flip-hint">tap to read</div>
        </div>
        <div class="flip-face flip-back"><p>${r.text}</p></div>
      </div>`;
    cards.appendChild(flip);
  });

  // gallery captions
  document.querySelectorAll(".polaroid .cap").forEach((c, i) => {
    if (CONFIG.captions[i]) c.textContent = CONFIG.captions[i];
  });
}

/* ---------- scroll reveal ---------- */
function initReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    els.forEach(e => e.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.18 });
  els.forEach(e => io.observe(e));
}

/* ---------- live countdown ---------- */
function initCountdown() {
  const start = new Date(CONFIG.metDate.year, CONFIG.metDate.month - 1, CONFIG.metDate.day, 0, 0, 0);
  const elD = document.getElementById("c-days");
  const elH = document.getElementById("c-hours");
  const elM = document.getElementById("c-mins");
  const elS = document.getElementById("c-secs");
  const since = document.getElementById("count-since-date");

  const readable = start.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  since.innerHTML = `since <b>${readable}</b>`;

  function tick() {
    let diff = Math.max(0, Date.now() - start.getTime());
    const days = Math.floor(diff / 86400000); diff -= days * 86400000;
    const hours = Math.floor(diff / 3600000); diff -= hours * 3600000;
    const mins = Math.floor(diff / 60000);    diff -= mins * 60000;
    const secs = Math.floor(diff / 1000);
    elD.textContent = days.toLocaleString();
    elH.textContent = String(hours).padStart(2, "0");
    elM.textContent = String(mins).padStart(2, "0");
    elS.textContent = String(secs).padStart(2, "0");
  }
  tick();
  setInterval(tick, 1000);
}

/* ---------- flip cards (tap support) ---------- */
function initFlipCards() {
  document.getElementById("cards").addEventListener("click", (e) => {
    const flip = e.target.closest(".flip");
    if (flip) flip.classList.toggle("flipped");
  });
}

/* ---------- floating petals on the hero ---------- */
function initPetals() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const layer = document.getElementById("petals");
  if (!layer) return;
  const glyphs = ["❀", "✿", "❁", "♥", "❤"];
  const COUNT = 16;

  for (let i = 0; i < COUNT; i++) {
    const p = document.createElement("span");
    p.className = "petal";
    p.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
    layer.appendChild(p);
    launchPetal(p);
  }

  function launchPetal(p) {
    const startX = Math.random() * 100;
    const drift = (Math.random() * 26 - 13);
    const dur = 9000 + Math.random() * 9000;
    const size = 12 + Math.random() * 22;
    const rot = Math.random() * 360;
    const hue = Math.random();
    p.style.left = startX + "vw";
    p.style.fontSize = size + "px";
    p.style.color = hue > .5 ? "rgba(201,110,115,.75)" : "rgba(195,154,78,.7)";
    const anim = p.animate([
      { transform: `translate(0,0) rotate(${rot}deg)`, opacity: 0 },
      { opacity: .9, offset: .12 },
      { opacity: .9, offset: .85 },
      { transform: `translate(${drift}vw, 112vh) rotate(${rot + 220}deg)`, opacity: 0 },
    ], { duration: dur, easing: "linear" });
    anim.onfinish = () => launchPetal(p);
  }
}

/* ---------- birthday cake candle blow ---------- */
function initCake() {
  const btn = document.getElementById("blow-btn");
  const cake = document.querySelector(".cake");
  if (!btn || !cake) return;

  btn.addEventListener("click", () => {
    cake.classList.remove("blown");
    void cake.offsetWidth;
    cake.classList.add("blown");
    btn.disabled = true;
    btn.textContent = "Wish made";
    spawnWind(cake);
    spawnConfetti();
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = "Blow again";
    }, 1800);
  });

  function spawnWind(target) {
    const rect = target.getBoundingClientRect();
    for (let i = 0; i < 5; i++) {
      const gust = document.createElement("span");
      gust.className = "wind";
      gust.style.left = rect.left - 120 + "px";
      gust.style.top = rect.top + rect.height * (0.14 + i * 0.055) + "px";
      document.body.appendChild(gust);
      const anim = gust.animate([
        { transform: "translateX(0) scaleX(.45)", opacity: 0 },
        { transform: "translateX(120px) scaleX(1)", opacity: .85, offset: .22 },
        { transform: "translateX(260px) scaleX(.55)", opacity: 0 },
      ], {
        duration: 720 + i * 70,
        delay: i * 45,
        easing: "cubic-bezier(.2,.7,.2,1)",
      });
      anim.onfinish = () => gust.remove();
    }
  }

  function spawnConfetti() {
    const colors = ["#C96E73", "#7C2E3B", "#C39A4E", "#E2C892", "#F6E9E0", "#DB8A8A"];
    const count = window.innerWidth < 720 ? 46 : 74;
    for (let i = 0; i < count; i++) {
      const piece = document.createElement("span");
      piece.className = "confetti";
      const fromLeft = i % 2 === 0;
      piece.style.left = (fromLeft ? Math.random() * 18 : 82 + Math.random() * 18) + "vw";
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.width = 6 + Math.random() * 8 + "px";
      piece.style.height = 10 + Math.random() * 12 + "px";
      document.body.appendChild(piece);

      const drift = (fromLeft ? 1 : -1) * (120 + Math.random() * 280);
      const fall = window.innerHeight + 90 + Math.random() * 180;
      const spin = (fromLeft ? 1 : -1) * (360 + Math.random() * 760);
      const anim = piece.animate([
        { transform: "translate(0,0) rotate(0deg)", opacity: 0 },
        { opacity: 1, offset: .08 },
        { transform: `translate(${drift}px, ${fall}px) rotate(${spin}deg)`, opacity: 0.95 },
      ], {
        duration: 2600 + Math.random() * 1700,
        delay: Math.random() * 280,
        easing: "cubic-bezier(.15,.65,.35,1)",
      });
      anim.onfinish = () => piece.remove();
    }
  }
}

/* ---------- background music ---------- */
function initMusic() {
  const toggle = document.getElementById("music-toggle");
  const audio = document.getElementById("bg-audio");
  if (!toggle || !audio) return;

  audio.volume = 0.55;
  // remembered preference: default OFF until she opts in
  let wantOn = localStorage.getItem("loveNoteMusic") === "on";

  function reflect() {
    toggle.classList.toggle("playing", !audio.paused);
  }

  async function tryPlay() {
    try { await audio.play(); } catch (_) { /* blocked until interaction */ }
    reflect();
  }

  toggle.addEventListener("click", async () => {
    if (audio.paused) {
      wantOn = true;
      localStorage.setItem("loveNoteMusic", "on");
      await tryPlay();
    } else {
      wantOn = false;
      localStorage.setItem("loveNoteMusic", "off");
      audio.pause();
      reflect();
    }
  });

  // if she previously turned it on, resume after first interaction
  if (wantOn) {
    const resume = () => { tryPlay(); window.removeEventListener("pointerdown", resume); };
    window.addEventListener("pointerdown", resume, { once: true });
  }
  reflect();
}
