const wordContainer = document.querySelector(".word");
const wrongLetters = document.querySelector(".wrong-letter");
const svg = document.querySelector("svg");
const buttons = document.querySelectorAll("button");
const finalWord = document.querySelector(".final-word");

const svgNS = "http://www.w3.org/2000/svg";

// 工具函数：创建SVG元素
function createSVG(tag, attrs) {
  const el = document.createElementNS(svgNS, tag);
  for (let [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, value);
  }
  el.classList.add("hangman-part");
  return el;
}

// 所有小人部件
const parts = [
  createSVG("circle", {
    cx: "150",
    cy: "87",
    r: "25",
    fill: "none",
    stroke: "lightgoldenrodyellow",
    "stroke-width": "5",
  }),
  createSVG("line", {
    x1: "150",
    y1: "112",
    x2: "150",
    y2: "160",
    stroke: "lightgoldenrodyellow",
    "stroke-width": "5",
    "stroke-linecap": "round",
  }),
  createSVG("line", {
    x1: "150",
    y1: "112",
    x2: "127",
    y2: "143",
    stroke: "lightgoldenrodyellow",
    "stroke-width": "5",
    "stroke-linecap": "round",
  }),
  createSVG("line", {
    x1: "150",
    y1: "112",
    x2: "173",
    y2: "143",
    stroke: "lightgoldenrodyellow",
    "stroke-width": "5",
    "stroke-linecap": "round",
  }),
  createSVG("line", {
    x1: "150",
    y1: "160",
    x2: "127",
    y2: "188",
    stroke: "lightgoldenrodyellow",
    "stroke-width": "5",
    "stroke-linecap": "round",
  }),
  createSVG("line", {
    x1: "150",
    y1: "160",
    x2: "173",
    y2: "188",
    stroke: "lightgoldenrodyellow",
    "stroke-width": "5",
    "stroke-linecap": "round",
  }),
];

const words = ["mayhem", "artpop", "absolute", "whiplash", "midnight"];

let word, array, display, wrongLetter;

// 随机取单词
function getRandomWord() {
  const index = Math.floor(Math.random() * words.length);
  return words[index];
}

// 渲染当前猜测的单词
function renderWord() {
  wordContainer.innerHTML = display
    .map((ch) => `<span class='letter'>${ch !== "_" ? ch : ""}</span>`)
    .join("");
}

// 绘制 hangman 部件
function hangMan() {
  const wrongCount = wrongLetter.length;
  if (wrongCount > 0 && wrongCount <= parts.length) {
    svg.appendChild(parts[wrongCount - 1]);
  }
}

// 获取键盘字母
function getLetter(e) {
  const key = e.key.toLowerCase();
  return key >= "a" && key <= "z" ? key : null;
}

// 游戏失败
function gameOver() {
  finalWord.innerText = word;
  document.querySelector(".game-over").classList.remove("hidden");
}

// 游戏成功
function gameWon() {
  document.querySelector(".win-message").classList.remove("hidden-winmsg");
}

// 重复点击同一字母
function alertMessage() {
  const alertBox = document.querySelector(".alert-message");
  alertBox.classList.remove("hidden-msg");

  clearTimeout(alertBox.hideTimer);

  alertBox.hideTimer = setTimeout(() => {
    alertBox.classList.add("hidden-msg");
  }, 1000);
}

// 重置游戏
function resetGame() {
  // 重新选择单词
  word = getRandomWord();
  array = word.split("");
  display = Array(word.length).fill("_");
  wrongLetter = [];

  // 清空错误显示 & 重绘
  wrongLetters.textContent = "";
  renderWord();

  // 移除 hangman 小人
  document.querySelectorAll(".hangman-part").forEach((el) => el.remove());

  // 隐藏 game over or win 提示
  document.querySelector(".game-over").classList.add("hidden");
  document.querySelector(".win-message").classList.add("hidden-winmsg");
}

// 键盘事件
document.addEventListener("keydown", (e) => {
  const letter = getLetter(e);
  if (!letter) return;

  // 已经猜过了（正确 or 错误）
  if (display.includes(letter) || wrongLetter.includes(letter)) {
    alertMessage();
  }

  if (array.includes(letter)) {
    // 猜对了
    array.forEach((ch, index) => {
      if (ch === letter) display[index] = letter;
    });

    if (display.join("") === word) {
      gameWon();
    }
  } else {
    // 猜错了
    if (!wrongLetter.includes(letter)) {
      wrongLetter.push(letter);
      wrongLetters.textContent = wrongLetter.join(", ");

      if (wrongLetter.length === parts.length) {
        gameOver();
      }
    }
  }

  renderWord();
  hangMan();
});

// 点击按钮重置
buttons.forEach((button) => button.addEventListener("click", resetGame));

// 初始化游戏
resetGame();
