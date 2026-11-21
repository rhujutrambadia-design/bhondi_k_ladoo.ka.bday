// =========================================
// 0. PASSCODE CHECK
// =========================================
function checkPasscode() {
  const secretCode = 'I.am.gay.'; // Change to any secret code if desired
  const inputEl = document.getElementById('passcodeInput');
  const errorEl = document.getElementById('passError');

  if (inputEl.value.trim().toLowerCase() === secretCode.toLowerCase()) {
    errorEl.classList.add('hidden');
    startExperience();
  } else {
    errorEl.classList.remove('hidden');
    inputEl.value = '';
    inputEl.focus();
  }
}

// =========================================
// 1. STATE VARIABLES & ELEMENTS
// =========================================
let currentSlideIndex = 0;
const totalSlides = 9; // Slides 0 through 8
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
let isPlaying = false;

// =========================================
// 2. START EXPERIENCE & AUDIO CONTROL
// =========================================
function startExperience() {
  bgMusic.volume = 0.7;
  bgMusic.play()
    .then(() => {
      isPlaying = true;
      musicToggle.innerText = '🔊';
    })
    .catch((err) => {
      console.log('Audio playback waiting for user file:', err);
      musicToggle.innerText = '🔇';
    });

  musicToggle.classList.remove('hidden');
  nextSlide();
  fireConfetti();
}

function toggleMusic() {
  if (isPlaying) {
    bgMusic.pause();
    musicToggle.innerText = '🔇';
    isPlaying = false;
  } else {
    bgMusic.play();
    musicToggle.innerText = '🔊';
    isPlaying = true;
  }
}

function pauseBgForSpotify() {
  if (isPlaying) {
    bgMusic.pause();
    musicToggle.innerText = '🔇';
    isPlaying = false;
  }
}

// =========================================
// 3. MULTI-SLIDE NAVIGATION SYSTEM
// =========================================
function showSlide(index) {
  for (let i = 0; i < totalSlides; i++) {
    const slideEl = document.getElementById(`slide-${i}`);
    if (slideEl) slideEl.classList.remove('active');
  }

  const targetSlide = document.getElementById(`slide-${index}`);
  if (targetSlide) {
    targetSlide.classList.add('active');
    currentSlideIndex = index;

    // Initialize scratch canvas when landing on Slide 4
    if (index === 4) {
      initScratchCard();
    }
  }
}
function nextSlide() {
  if (currentSlideIndex < totalSlides - 1) {
    showSlide(currentSlideIndex + 1);
  }
}

function prevSlide() {
  // Stops at Slide 1 so he doesn't accidentally go back to the passcode lock screen
  if (currentSlideIndex > 1) {
    showSlide(currentSlideIndex - 1);
  }
}

function restartSlides() {
  document.getElementById('candleFlame').classList.remove('blown-out');
  document.getElementById('blowBtn').classList.remove('hidden');
  document.getElementById('nextFromCake').classList.add('hidden');
  document.getElementById('cakeStatus').innerText = 'Make a wish and blow out the candle!';
  resetGiftQuestion();

  // Reset FUT card flip & scratch layer
  document.getElementById('futFlipper').classList.remove('flipped');
  document.getElementById('flipFutBtn').classList.add('hidden');
  const canvas = document.getElementById('scratchCanvas');
  canvas.classList.remove('hidden');
  scratchRevealed = false;

  showSlide(1);
}

// =========================================
// 4. SLIDE 1: BLOW THE CANDLE INTERACTION
// =========================================
function blowCandle() {
  const flame = document.getElementById('candleFlame');
  const blowBtn = document.getElementById('blowBtn');
  const nextBtn = document.getElementById('nextFromCake');
  const statusText = document.getElementById('cakeStatus');

  flame.classList.add('blown-out');
  statusText.innerText = 'Yay!! May all your wishes come true! ✨';

  blowBtn.classList.add('hidden');
  nextBtn.classList.remove('hidden');
  fireConfetti();
}

// =========================================
// 5. SLIDE 3: GIFT QUESTION & GRUMPY CAT
// =========================================
function acceptGift() {
  fireConfetti();
  nextSlide();
}

function rejectGift() {
  document.getElementById('giftQuestionState').classList.add('hidden');
  document.getElementById('grumpyDuckState').classList.remove('hidden');
}

function resetGiftQuestion() {
  document.getElementById('grumpyDuckState').classList.add('hidden');
  document.getElementById('giftQuestionState').classList.remove('hidden');
}

// =========================================
// 6. SLIDE 4: SCRATCH-OFF TOTY FUT CARD
// =========================================
let scratchRevealed = false;

function initScratchCard() {
  const canvas = document.getElementById('scratchCanvas');
  if (!canvas || scratchRevealed) return;

  const ctx = canvas.getContext('2d');
  let isDrawing = false;

  // Draw metallic gold/blue TOTY scratch foil
  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0, '#fbbf24');
  grad.addColorStop(0.5, '#f59e0b');
  grad.addColorStop(1, '#d97706');

  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Foil border & text
  ctx.strokeStyle = '#27272a';
  ctx.lineWidth = 6;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#1e3a8a';
  ctx.font = 'bold 22px Fredoka, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('⚽ TOTY PACK ⚽', canvas.width / 2, 145);
  ctx.font = '600 15px Fredoka, sans-serif';
  ctx.fillText('Scratch here to reveal!', canvas.width / 2, 180);

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  function scratch(e) {
    if (!isDrawing) return;
    e.preventDefault();
    const pos = getPos(e);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 24, 0, Math.PI * 2);
    ctx.fill();
    checkScratchPercentage();
  }

  function checkScratchPercentage() {
    if (scratchRevealed) return;
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparent = 0;
    for (let i = 3; i < pixels.length; i += 32) {
      if (pixels[i] === 0) transparent++;
    }
    if (transparent / (pixels.length / 32) > 0.45) {
      scratchRevealed = true;
      canvas.classList.add('hidden');
      document.getElementById('flipFutBtn').classList.remove('hidden');
      document.getElementById('scratchHint').innerText = '69 OVR Unlocked! Tap Flip Card to read the back 👇';
      fireConfetti();
    }
  }

  canvas.onmousedown = () => { isDrawing = true; };
  canvas.onmouseup = () => { isDrawing = false; };
  canvas.onmousemove = scratch;

  canvas.ontouchstart = () => { isDrawing = true; };
  canvas.ontouchend = () => { isDrawing = false; };
  canvas.ontouchmove = scratch;
}

function flipFutCard() {
  document.getElementById('futFlipper').classList.toggle('flipped');
}

// =========================================
// 7. SLIDE 5: "OPEN WHEN..." LETTERS DATA
//    (CUSTOMIZE PHOTOS, NOTES & SPOTIFY LINKS BELOW!)
// =========================================
const openWhenLetters = {
  happy: {
    title: "Open When You're Happy 🥳",
    photo: "happy.jpg", // Change to your custom photo filename!
    message: "Call me and tell me what made you so happy!!You look so good when you smile, I can look at you all day and night. Keep shining, celebrating your wins, and being the happiest boy! I'm always cheering the loudest for you.",
    songUrl: "https://open.spotify.com/track/21GnahdCIuTImpiiEG6V96?si=4ac6fd6da5fb4209" // Paste your Spotify track link here!
  },
  down: {
    title: "Open When You're Feeling Down 🌧️",
    photo: "down.png",
    message: "Hey, take a deep breath. I am here. Bad days don't last, and you never have to carry anything alone. Text or call me right now, let me be your safe space, no matter what.",
    songUrl: "https://open.spotify.com/track/0WQiDwKJclirSYG9v5tayI?si=cea077f4a0da4d84"
  },
  horny: {
    title: "Open When You're Horny 🔥",
    photo: "horny.JPG",
    message: "You know I can't keep my hands off you either. Call me and we'll do more, idhar itna hi.",
    songUrl: "https://open.spotify.com/track/4zkl1JMviMNQKgaUYiSQfb?si=ae40695af40f4b05"
  },
  hug: {
    title: "Open When You Need a Hug 🫂",
    photo: "hug.png",
    message: "Call me and I'll give you the tightest, longest bear hug through the screen right now. Close your eyes and imagine me squishing you until all your worries disappear.",
    songUrl: "https://open.spotify.com/track/0dLbrlAVPPjpPqnYfmJsWk?si=f020d08def4649ac"
  },
  excited: {
    title: "Open When You're Feeling Lonely ☹️",
    photo: "lonely.jpg",
    message: "I LOVE THIS ENERGY!! Tell me everything right now—I want to hear you yap about it for hours. So proud of you, baby!",
    songUrl: "https://open.spotify.com/track/0bYDMpQ94LnF38FiOlc8K9?si=2a972da22df944e1"
  },
  stressed: {
    title: "Open When You're Stressed 😵‍💫",
    photo: "stress.jpeg",
    message: "Hey, don't let whatever is stressing you out make you forget how capable, smart, and unstoppable you are. You've handled 100% of your hardest days so far, and you're going to crush this too. One step at a time! Call me and I'll help you relieve stress",
    songUrl: "https://open.spotify.com/track/0XF0D8HL9gk2sr9tlFOee3?si=a5d6799b2cad450f"
  },
  miss: {
    title: "Open When You Miss Me 🥺",
    photo: "miss.jpg",
    message: "I'm missing you even more right now! Look at us, we're the cutest. Count down the days until I get to steal your blanket and annoy you in person.",
    songUrl: "https://open.spotify.com/track/7eQl3Yqv35ioqUfveKHitE?si=79cfb2f8fa9c4f48"
  },
  naraz: {
    title: "Open When You Feel Hurt By Me 😾",
    photo: "fight.jpeg",
    message: "Hey, I am sorry. My dumbass would have said something that is not true at all. I know you won't tell me know but just tell me later. We'll figure it out. I love you to the moon and back. Now smile and text me so I can make it up to you!",
    songUrl: "https://open.spotify.com/track/1oghlB7Tm7Xo3M2BviDnic?si=5ed2ab028f764add"
  }
};

function openLetter(key) {
  const data = openWhenLetters[key];
  if (!data) return;

  document.getElementById('modalTitle').innerText = data.title;
  document.getElementById('modalPhoto').src = data.photo;
  document.getElementById('modalMessage').innerText = data.message;
  document.getElementById('modalSongLink').href = data.songUrl;

  document.getElementById('letterModal').classList.remove('hidden');
}

function closeLetter(e) {
  if (!e || e.target.id === 'letterModal') {
    document.getElementById('letterModal').classList.add('hidden');
  }
}

// =========================================
// 8. CONFETTI HELPER
// =========================================
function fireConfetti() {
  confetti({
    particleCount: 75,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#ef4444', '#fde047', '#3b82f6', '#fbcfe8']
  });
}

function celebrateFinal() {
  fireConfetti();
}
