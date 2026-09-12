/* ============================================================
   HAIM'S BIRTHDAY WEBSITE — SCRIPT
   Organized into clearly labeled sections. Read the comments —
   they tell you exactly what each part does and where to make
   changes (passcode, messages, timings, etc).
   ============================================================ */

/* ---------------------------------------------------------
   1. CHANGE THE PASSCODE HERE 🔐
   Replace "CHANGE_ME" with whatever secret word or numbers
   you want. Keep the quotes around it.
   Example: const SECRET_PASSCODE = "haim2024";
--------------------------------------------------------- */
const SECRET_PASSCODE = "1324";


/* ---------------------------------------------------------
   2. SCENE ORDER
   This is the order the story plays in. If you ever want to
   reorder scenes, change this list (and the data-next
   attributes in index.html) to match.
--------------------------------------------------------- */
const SCENE_ORDER = ["scene1", "scene2", "scene3", "sceneHeart", "scene4", "scene5", "scene6", "scene7"];


/* ---------------------------------------------------------
   3. BACKGROUND STARS + FLOATING PARTICLES
   Fills the fixed background layers with twinkling stars and
   soft rising particles. Runs once when the page loads.
--------------------------------------------------------- */
function createStars(container, count) {
  for (let i = 0; i < count; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.style.left = Math.random() * 100 + "vw";
    star.style.top = Math.random() * 100 + "vh";
    star.style.animationDelay = (Math.random() * 3) + "s";
    star.style.width = star.style.height = (Math.random() * 2 + 1) + "px";
    container.appendChild(star);
  }
}

function createBackgroundParticles(container, count) {
  const colors = ["#ff8fc7", "#ffd89e", "#c9b6ff", "#ffc9a8"];
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    const size = Math.random() * 5 + 3;
    p.style.width = size + "px";
    p.style.height = size + "px";
    p.style.left = Math.random() * 100 + "vw";
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.animationDuration = (Math.random() * 10 + 10) + "s";
    p.style.animationDelay = (Math.random() * 10) + "s";
    container.appendChild(p);
  }
}

createStars(document.getElementById("bgStars"), 70);
createBackgroundParticles(document.getElementById("bgParticles"), 24);


/* ---------------------------------------------------------
   4. FLOATING HEARTS ON THE PASSCODE SCREEN
--------------------------------------------------------- */
function createFloatingHearts(container, count) {
  const hearts = ["💗", "💕", "💖", "💓"];
  for (let i = 0; i < count; i++) {
    const h = document.createElement("div");
    h.className = "heart-particle";
    h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    h.style.left = Math.random() * 100 + "%";
    h.style.animationDuration = (Math.random() * 6 + 8) + "s";
    h.style.animationDelay = (Math.random() * 8) + "s";
    container.appendChild(h);
  }
}
createFloatingHearts(document.getElementById("passcodeHearts"), 14);


/* ---------------------------------------------------------
   5. CONFETTI BURST (reused across several scenes)
--------------------------------------------------------- */
function launchConfetti(amount = 60) {
  const colors = ["#ff8fc7", "#ffd89e", "#c9b6ff", "#ffc9a8", "#fff7ef"];
  for (let i = 0; i < amount; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = (Math.random() * 2 + 2.5) + "s";
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 5000);
  }
}


/* ---------------------------------------------------------
   6. PASSCODE SCREEN LOGIC
--------------------------------------------------------- */
const passcodeScreen = document.getElementById("passcodeScreen");
const passcodeCard = document.getElementById("passcodeCard");
const passcodeInput = document.getElementById("passcodeInput");
const passcodeButton = document.getElementById("passcodeButton");
const passcodeMessage = document.getElementById("passcodeMessage");
const unlockOverlay = document.getElementById("unlockOverlay");
const storyContainer = document.getElementById("storyContainer");
const sceneProgress = document.getElementById("sceneProgress");

function checkPasscode() {
  const value = passcodeInput.value.trim();

  if (value.length === 0) {
    passcodeMessage.textContent = "Please type the passcode 💭";
    return;
  }

  if (value === SECRET_PASSCODE) {
    playUnlockAnimation();
  } else {
    passcodeMessage.textContent = "Oops! Try again 💕";
    passcodeCard.classList.remove("shake");
    // Force reflow so the shake animation can replay
    void passcodeCard.offsetWidth;
    passcodeCard.classList.add("shake");
    passcodeInput.value = "";
  }
}

function playUnlockAnimation() {
  unlockOverlay.classList.add("playing");
  launchConfetti(30);

  setTimeout(() => {
    passcodeScreen.classList.add("fade-out");
    storyContainer.classList.add("visible");
    sceneProgress.classList.add("visible");
    unlockOverlay.classList.remove("playing");
    goToScene("scene1", false);
  }, 1400);
}

passcodeButton.addEventListener("click", checkPasscode);
passcodeInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") checkPasscode();
});

/* ---------- 6b. PIN DOTS + TAP KEYPAD ---------- */
// Shows up to 8 glowing dots that fill in as characters are typed.
const pinDots = document.getElementById("pinDots");
const MAX_DOTS = 8;

for (let i = 0; i < MAX_DOTS; i++) {
  const dot = document.createElement("div");
  dot.className = "dot-pin";
  pinDots.appendChild(dot);
}

function updatePinDots() {
  const dots = document.querySelectorAll(".pin-dots .dot-pin");
  const len = passcodeInput.value.length;
  dots.forEach((dot, i) => dot.classList.toggle("filled", i < len));
}

passcodeInput.addEventListener("input", updatePinDots);

// Keypad buttons just type into the same input box
document.getElementById("keypad").addEventListener("click", (e) => {
  const btn = e.target.closest(".key");
  if (!btn) return;
  const key = btn.dataset.key;

  if (key === "back") {
    passcodeInput.value = passcodeInput.value.slice(0, -1);
  } else if (key === "clear") {
    passcodeInput.value = "";
  } else {
    passcodeInput.value += key;
  }
  updatePinDots();
  passcodeInput.focus();
});


/* ---------------------------------------------------------
   7. SCENE NAVIGATION + PROGRESS DOTS
--------------------------------------------------------- */
// Build the progress dots once
SCENE_ORDER.forEach((id, index) => {
  const dot = document.createElement("div");
  dot.className = "dot";
  dot.dataset.scene = id;
  sceneProgress.appendChild(dot);
});

function updateProgressDots(activeId) {
  document.querySelectorAll(".scene-progress .dot").forEach((dot) => {
    dot.classList.toggle("active", dot.dataset.scene === activeId);
  });
}

function goToScene(sceneId, withConfetti = true) {
  document.querySelectorAll(".scene").forEach((scene) => {
    scene.classList.remove("active");
  });
  const target = document.getElementById(sceneId);
  target.classList.add("active");
  updateProgressDots(sceneId);
  window.scrollTo({ top: 0, behavior: "smooth" });

  if (withConfetti) launchConfetti(45);

  // Trigger scene-specific entrance animations
  if (sceneId === "scene3") growBouquet();
  if (sceneId === "sceneHeart") buildTextHeart();
  if (sceneId === "scene5") playMessageSequence();
  if (sceneId === "scene6") revealGallery();
  if (sceneId === "scene7") launchBalloons();
}

// Wire up every "next scene" button using its data-next attribute
document.querySelectorAll("[data-next]").forEach((btn) => {
  btn.addEventListener("click", () => {
    goToScene(btn.dataset.next);
  });
});


/* ---------------------------------------------------------
   8. SCENE 1 — GIFT BOX OPEN
--------------------------------------------------------- */
const giftBox = document.getElementById("giftBox");
document.querySelector('[data-next="scene2"]').addEventListener("click", () => {
  giftBox.classList.add("opened");
});


/* ---------------------------------------------------------
   9. SCENE 2 — MAKE A WISH (candle blows out + confetti)
--------------------------------------------------------- */
const cakeWrap = document.getElementById("cakeWrap");
const wishBtn = document.getElementById("wishBtn");
wishBtn.addEventListener("click", () => {
  cakeWrap.classList.add("wished");
});


/* ---------------------------------------------------------
   10. SCENE 3 — BOUQUET OF FLOWERS + FALLING PETALS
--------------------------------------------------------- */
let bouquetGrown = false;
function growBouquet() {
  if (bouquetGrown) return; // only build it once
  bouquetGrown = true;

  const bouquet = document.getElementById("bouquet");
  const colors = ["#ff8fc7", "#c9b6ff", "#ffc9a8", "#ffd89e"];
  const flowerCount = 5;

  for (let i = 0; i < flowerCount; i++) {
    const flower = document.createElement("div");
    flower.className = "flower";
    flower.style.animationDelay = (i * 0.2) + "s";

    const color = colors[i % colors.length];
    for (let p = 0; p < 5; p++) {
      const petal = document.createElement("div");
      petal.className = "petal";
      petal.style.background = color;
      flower.appendChild(petal);
    }
    const center = document.createElement("div");
    center.className = "center";
    flower.appendChild(center);

    const stem = document.createElement("div");
    stem.className = "stem";
    flower.appendChild(stem);

    bouquet.appendChild(flower);
  }

  // Gently falling petals for the rest of the scene
  const scene3 = document.getElementById("scene3");
  const petalEmojis = ["🌸", "🌷", "💮"];
  const petalInterval = setInterval(() => {
    if (!scene3.classList.contains("active")) {
      clearInterval(petalInterval);
      return;
    }
    const petal = document.createElement("div");
    petal.className = "petal-fall";
    petal.textContent = petalEmojis[Math.floor(Math.random() * petalEmojis.length)];
    petal.style.left = Math.random() * 100 + "%";
    petal.style.animationDuration = (Math.random() * 3 + 4) + "s";
    scene3.appendChild(petal);
    setTimeout(() => petal.remove(), 7000);
  }, 900);
}


/* ---------------------------------------------------------
   11. SCENE 4 — ENVELOPE + LETTER
--------------------------------------------------------- */
const envelope = document.getElementById("envelope");
const openLetterBtn = document.getElementById("openLetterBtn");
const letterNextBtn = document.getElementById("letterNextBtn");

openLetterBtn.addEventListener("click", () => {
  envelope.classList.add("open");
  openLetterBtn.classList.add("hidden");
  letterNextBtn.classList.remove("hidden");
  spawnMiniHearts(envelope);
});

function spawnMiniHearts(anchorEl) {
  const rect = anchorEl.getBoundingClientRect();
  for (let i = 0; i < 10; i++) {
    const h = document.createElement("div");
    h.className = "heart-particle";
    h.textContent = "💕";
    h.style.position = "fixed";
    h.style.left = (rect.left + Math.random() * rect.width) + "px";
    h.style.top = (rect.top + rect.height / 2) + "px";
    h.style.animationDuration = "3.5s";
    h.style.zIndex = 30;
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 3600);
  }
}


/* ---------------------------------------------------------
   12. SCENE 5 — MESSAGES APPEARING ONE BY ONE
   Edit the text directly in index.html under #messageStack
   if you want to change these lines.
--------------------------------------------------------- */
let messagesPlayed = false;
function playMessageSequence() {
  if (messagesPlayed) return;
  messagesPlayed = true;

  const messages = document.querySelectorAll("#messageStack .floating-message");
  messages.forEach((msg, index) => {
    setTimeout(() => {
      messages.forEach((m) => m.classList.remove("show"));
      msg.classList.add("show");
    }, index * 2200);
  });
}


/* ---------------------------------------------------------
   12b. SCENE 5 — TAP ANYWHERE TO SEND A LITTLE HEART
--------------------------------------------------------- */
const scene5 = document.getElementById("scene5");
scene5.addEventListener("click", (e) => {
  const heart = document.createElement("div");
  heart.className = "tap-heart";
  heart.textContent = ["💗", "💖", "💕", "✨"][Math.floor(Math.random() * 4)];
  heart.style.left = e.clientX + "px";
  heart.style.top = e.clientY + "px";
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 1500);
});


/* ---------------------------------------------------------
   13. SCENE 6 — GALLERY REVEAL (staggered entrance)
--------------------------------------------------------- */
let galleryRevealed = false;
function revealGallery() {
  if (galleryRevealed) return;
  galleryRevealed = true;

  document.querySelectorAll(".photo-card").forEach((card, index) => {
    setTimeout(() => card.classList.add("show"), index * 150);
  });
}


/* ---------------------------------------------------------
   14. SCENE 7 — BALLOONS + RESTART
--------------------------------------------------------- */
function launchBalloons() {
  const balloonsContainer = document.getElementById("balloons");
  balloonsContainer.innerHTML = ""; // clear any previous balloons
  const colors = ["#ff8fc7", "#c9b6ff", "#ffd89e", "#ffc9a8"];

  for (let i = 0; i < 14; i++) {
    const balloon = document.createElement("div");
    balloon.className = "balloon";
    balloon.style.left = Math.random() * 100 + "vw";
    balloon.style.background = colors[Math.floor(Math.random() * colors.length)];
    balloon.style.animationDuration = (Math.random() * 6 + 8) + "s";
    balloon.style.animationDelay = (Math.random() * 4) + "s";
    balloonsContainer.appendChild(balloon);
  }

  launchConfetti(80);
}

document.getElementById("restartBtn").addEventListener("click", () => {
  // Reset one-time animation flags so the story can play again
  bouquetGrown = false;
  messagesPlayed = false;
  galleryRevealed = false;
  document.getElementById("bouquet").innerHTML = "";
  document.querySelectorAll(".photo-card").forEach((c) => c.classList.remove("show"));
  document.querySelectorAll("#messageStack .floating-message").forEach((m) => m.classList.remove("show"));
  giftBox.classList.remove("opened");
  cakeWrap.classList.remove("wished");
  envelope.classList.remove("open");
  openLetterBtn.classList.remove("hidden");
  letterNextBtn.classList.add("hidden");

  goToScene("scene1");
});


/* ---------------------------------------------------------
   15. BACKGROUND MUSIC CONTROLS
   Put your own mp3 file in the "music" folder and name it
   "birthday-song.mp3" (or update the src in index.html).
--------------------------------------------------------- */
const bgMusic = document.getElementById("bgMusic");
const playMusicBtn = document.getElementById("playMusicBtn");
const pauseMusicBtn = document.getElementById("pauseMusicBtn");

playMusicBtn.addEventListener("click", () => {
  bgMusic.play().catch(() => {
    // If the browser blocks playback or the file is missing, fail quietly
    console.log("Music could not be played. Make sure your mp3 file is in the music folder.");
  });
  playMusicBtn.classList.add("hidden");
  pauseMusicBtn.classList.remove("hidden");
});

pauseMusicBtn.addEventListener("click", () => {
  bgMusic.pause();
  pauseMusicBtn.classList.add("hidden");
  playMusicBtn.classList.remove("hidden");
});
