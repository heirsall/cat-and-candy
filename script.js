// Tombol terimakasih membuka link website
const terimakasihButton = document.getElementById("terimakasih-button");
if (terimakasihButton) {
  terimakasihButton.addEventListener("click", () => {
    window.open("https://heirsall.github.io/for-terimakaashi/", "_blank"); // Ganti dengan link tujuan
  });
}
const gameFrame = document.getElementById("game-frame");
const cat = document.getElementById("cat");
const infoBox = document.getElementById("info-box");
const infoText = document.getElementById("info-text");
const infoButton = document.getElementById("info-button");

const bgm = document.getElementById("bgm");
const sfxFood = document.getElementById("sfx-food");
const sfxBomb = document.getElementById("sfx-bomb");
const sfxWin = document.getElementById("sfx-win");

let catPosition = 42.5;
let score = 0;
let fallingSpeed = 2;
let intervalId;
let isGameOver = false;
let gameStarted = false;

// Keyboard controls
document.addEventListener("keydown", (e) => {
  if (!gameStarted || isGameOver) return;
  if (e.key === "ArrowLeft" && catPosition > 0) {
    catPosition -= 5;
  } else if (e.key === "ArrowRight" && catPosition < 85) {
    catPosition += 5;
  }
  cat.style.left = catPosition + "%";
});

// Start / restart button
infoButton.addEventListener("click", () => {
  if (!gameStarted) {
    gameStarted = true;
    startGame();
    infoBox.classList.remove("active");
  } else if (isGameOver) {
    restartGame();
  }
});

function updateScore() {
  document.getElementById("score").textContent = score;
}

function spawnItem() {
  const item = document.createElement("div");
  const type = Math.random() < 0.8 ? "food" : "bomb";
  item.classList.add(type);
  item.style.left = Math.floor(Math.random() * 90) + "%";
  gameFrame.appendChild(item);

  let topPos = 0;
  const fallInterval = setInterval(() => {
    if (isGameOver) {
      clearInterval(fallInterval);
      item.remove();
      return;
    }

    topPos += fallingSpeed;
    item.style.top = topPos + "%";

    const catRect = cat.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();

    const collision = !(
      catRect.right < itemRect.left ||
      catRect.left > itemRect.right ||
      catRect.bottom < itemRect.top ||
      catRect.top > itemRect.bottom
    );

    if (collision) {
      clearInterval(fallInterval);
      item.remove();

      if (type === "food") {
        sfxFood.play();
        score++;
        updateScore();
        if (score >= 37) {
          endGame(true);
        } else {
          fallingSpeed = Math.min(fallingSpeed + 0.3, 3);
        }
      } else {
        endGame(false);
      }
    }

    if (topPos > 100) {
      item.remove();
      clearInterval(fallInterval);
    }
  }, 50);
}

function startGame() {
  score = 0;
  updateScore();
  fallingSpeed = 2;
  isGameOver = false;
  catPosition = 42.5;
  cat.style.left = catPosition + "%";
  infoBox.classList.remove("active");

  bgm.currentTime = 0;
  bgm.play();

  intervalId = setInterval(() => {
    if (!isGameOver) spawnItem();
  }, 1000);
}

function endGame(win) {
  isGameOver = true;
  clearInterval(intervalId);
  bgm.pause();
  bgm.currentTime = 0;

  if (win) {
    sfxWin.play();
    infoText.innerHTML =
      "Haiii oliliooooo :) 🙋🏻‍♂️ semoga game ini bikin kamu senang ya! Seperti biasa, terima kasih sudah berusaha, untuk apapun yang sedang kamu hadapi, lagi-lagi, <i>so proud of you.</i> <i>Take your time</i> 💪🏻 untuk apapun yang kamu butuhkan, you matter 🙂‍↕️ dengan segala keunikannya, dengan segala keanehannya, dengan segala keistimewaannya, you matter 🙆🏻‍♂️";
    infoText.innerHTML +=
      "<br><br><i>Indeed, We have adorned the lowest heaven with the stars for decoration</i> 🌟✨ <br> Quran 37:6";
  } else {
    sfxBomb.play();
    infoText.innerHTML =
      "Yah kasian kucingnya <b>minum racun</b> 🥲 Sayang gaaa sii sama kucingnyaa! 😺";
  }

  infoButton.textContent = "Main Lagi!";
  infoBox.classList.add("active");
}

function restartGame() {
  document.querySelectorAll(".food, .bomb").forEach((el) => el.remove());
  gameStarted = false;
  score = 0;
  updateScore();
  infoText.innerHTML = "<b>Welcome to Cat & Candy!</b> Main lagi ya? 😺";
  infoButton.textContent = "Start";
  infoBox.classList.add("active");
}

// Touch and mouse drag controls
let isDragging = false;
let dragStartX = 0;
let catStartPos = 0;

// Touch events for mobile
cat.addEventListener("touchstart", (e) => {
  if (!gameStarted || isGameOver) return;
  isDragging = true;
  dragStartX = e.touches[0].clientX;
  catStartPos = catPosition;
});

document.addEventListener("touchmove", (e) => {
  if (!isDragging) return;
  const deltaX = e.touches[0].clientX - dragStartX;
  // Assume gameFrame width is 100% of screen, so 1% = gameFrame.offsetWidth / 100
  const percentDelta = (deltaX / gameFrame.offsetWidth) * 100;
  let newPos = catStartPos + percentDelta;
  newPos = Math.max(0, Math.min(85, newPos));
  catPosition = newPos;
  cat.style.left = catPosition + "%";
});

document.addEventListener("touchend", () => {
  isDragging = false;
});

// Mouse drag for desktop
cat.addEventListener("mousedown", (e) => {
  if (!gameStarted || isGameOver) return;
  isDragging = true;
  dragStartX = e.clientX;
  catStartPos = catPosition;
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  const deltaX = e.clientX - dragStartX;
  const percentDelta = (deltaX / gameFrame.offsetWidth) * 100;
  let newPos = catStartPos + percentDelta;
  newPos = Math.max(0, Math.min(85, newPos));
  catPosition = newPos;
  cat.style.left = catPosition + "%";
});

document.addEventListener("mouseup", () => {
  isDragging = false;
});
