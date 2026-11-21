// =========================================
// 0. PASSCODE CHECK
// =========================================
function checkPasscode() {
  const secretCode = 'I_am_gay.26.11'; // <-- CHANGE THIS TO YOUR SECRET PASSWORD
  const inputEl = document.getElementById('passcodeInput');
  const errorEl = document.getElementById('passError');
  
  // .trim().toLowerCase() makes it ignore accidental spaces or capital letters
  if (inputEl.value.trim().toLowerCase() === secretCode.toLowerCase()) {
    errorEl.classList.add('hidden');
    startExperience(); // Unlocks Slide 1, starts music, and fires confetti!
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
const totalSlides = 7; // Slides 0 through 6
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
let isPlaying = false;

// =========================================
// 2. START EXPERIENCE & AUDIO CONTROL
// =========================================
function startExperience() {
  // Attempt to play the funny birthday song upon user tap
  bgMusic.volume = 0.7;
  bgMusic.play()
    .then(() => {
      isPlaying = true;
      musicToggle.innerText = '🔊';
    })
    .catch((err) => {
      // Fallback if audio file isn't uploaded yet
      console.log('Audio playback waiting for user file:', err);
      musicToggle.innerText = '🔇';
    });

  // Reveal the floating mute/unmute button and advance to Slide 1
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

// =========================================
// 3. MULTI-SLIDE NAVIGATION SYSTEM
// =========================================
function showSlide(index) {
  // Hide all slides
  for (let i = 0; i < totalSlides; i++) {
    const slideEl = document.getElementById(`slide-${i}`);
    if (slideEl) slideEl.classList.remove('active');
  }

  // Show target slide
  const targetSlide = document.getElementById(`slide-${index}`);
  if (targetSlide) {
    targetSlide.classList.add('active');
    currentSlideIndex = index;
  }
}

function nextSlide() {
  if (currentSlideIndex < totalSlides - 1) {
    showSlide(currentSlideIndex + 1);
  }
}

function restartSlides() {
  // Reset interactive states before restarting
  document.getElementById('candleFlame').classList.remove('blown-out');
  document.getElementById('blowBtn').classList.remove('hidden');
  document.getElementById('nextFromCake').classList.add('hidden');
  document.getElementById('cakeStatus').innerText = 'Make a wish and blow out your candle!';
  resetGiftQuestion();

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

  // Extinguish flame
  flame.classList.add('blown-out');
  statusText.innerText = 'Yay!! May all your wishes come true! ✨';

  // Swap buttons & celebrate
  blowBtn.classList.add('hidden');
  nextBtn.classList.remove('hidden');
  fireConfetti();
}

// =========================================
// 5. SLIDE 2: GIFT QUESTION & GRUMPY DUCK
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
// 6. CONFETTI HELPER
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
