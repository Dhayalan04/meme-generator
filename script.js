// ----------------------
// Meme Generator Script
// ----------------------

const canvas = document.getElementById("meme-canvas");
const ctx = canvas.getContext("2d");

// Inputs
const inputTop = document.getElementById("input-top-text");
const inputBottom = document.getElementById("input-bottom-text");
const fontSizeInput = document.getElementById("font-size");
const fontColorInput = document.getElementById("font-color");
const fontStyleInput = document.getElementById("font-style");

const imageUpload = document.getElementById("image-upload");
const templateSelect = document.getElementById("template-select");
const templatePreview = document.getElementById("template-preview");

const generateBtn = document.getElementById("generate-btn");
const downloadBtn = document.getElementById("download-btn");
const randomBtn = document.getElementById("random-btn");
const toggleTheme = document.getElementById("toggleTheme");

// Meme data
let currentImage = new Image();
let memeTemplates = [];

// Text objects
let topText = { text: "TOP TEXT", x: 0, y: 0 };
let bottomText = { text: "BOTTOM TEXT", x: 0, y: 0 };

// ----------------------
// Load meme templates
// ----------------------
fetch("https://api.imgflip.com/get_memes")
  .then(res => res.json())
  .then(data => {
    memeTemplates = data.data.memes;
    memeTemplates.forEach(meme => {
      const option = document.createElement("option");
      option.value = meme.url;
      option.textContent = meme.name;
      templateSelect.appendChild(option);

      const thumb = document.createElement("img");
      thumb.src = meme.url;
      thumb.title = meme.name;
      thumb.addEventListener("click", () => loadImage(meme.url));
      templatePreview.appendChild(thumb);
    });
  });

const seeMoreBtn = document.getElementById("see-more-btn");
let expanded = false;

seeMoreBtn.addEventListener("click", () => {
  expanded = !expanded;

  if (expanded) {
    templatePreview.classList.add("expanded");
    seeMoreBtn.textContent = "Show Less";
  } else {
    templatePreview.classList.remove("expanded");
    seeMoreBtn.textContent = "See More";
  }
});
// ----------------------
// Theme toggle
// ----------------------
toggleTheme.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// ----------------------
// Load image
// ----------------------
function loadImage(src) {
  currentImage.src = src;
  currentImage.crossOrigin = "anonymous";
  currentImage.onload = () => {
    canvas.width = currentImage.width;
    canvas.height = currentImage.height;

    // Default positions
    topText.x = canvas.width / 2;
    topText.y = parseInt(fontSizeInput.value) + 10;

    bottomText.x = canvas.width / 2;
    bottomText.y = canvas.height - 10;

    drawMeme();
  };
}

// ----------------------
// Draw meme
// ----------------------
function drawMeme() {
  if (!currentImage.src) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(currentImage, 0, 0, canvas.width, canvas.height);

  const fontSize = parseInt(fontSizeInput.value);
  const fontColor = fontColorInput.value;
  const fontStyle = fontStyleInput.value;

  ctx.font = `${fontSize}px ${fontStyle}`;
  ctx.fillStyle = fontColor;
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.textAlign = "center";

  // Top text
  ctx.fillText(topText.text, topText.x, topText.y);
  ctx.strokeText(topText.text, topText.x, topText.y);

  // Bottom text
  ctx.fillText(bottomText.text, bottomText.x, bottomText.y);
  ctx.strokeText(bottomText.text, bottomText.x, bottomText.y);
}

// ----------------------
// Input listeners
// ----------------------
inputTop.addEventListener("input", () => {
  topText.text = inputTop.value || "TOP TEXT";
  drawMeme();
});

inputBottom.addEventListener("input", () => {
  bottomText.text = inputBottom.value || "BOTTOM TEXT";
  drawMeme();
});

fontSizeInput.addEventListener("input", drawMeme);
fontColorInput.addEventListener("input", drawMeme);
fontStyleInput.addEventListener("input", drawMeme);

// ----------------------
// FIXED DRAG SYSTEM
// ----------------------

let activeText = null;
let offsetX = 0;
let offsetY = 0;

function getCanvasPos(e) {
  const rect = canvas.getBoundingClientRect();
  const clientX = e.type.startsWith("touch") ? e.touches[0].clientX : e.clientX;
  const clientY = e.type.startsWith("touch") ? e.touches[0].clientY : e.clientY;

  return {
    x: (clientX - rect.left) * (canvas.width / rect.width),
    y: (clientY - rect.top) * (canvas.height / rect.height)
  };
}

function isTextHit(textObj, x, y) {
  const fontSize = parseInt(fontSizeInput.value);
  const textWidth = ctx.measureText(textObj.text).width;

  return (
    x > textObj.x - textWidth / 2 &&
    x < textObj.x + textWidth / 2 &&
    y > textObj.y - fontSize &&
    y < textObj.y + 10
  );
}

function startDrag(e) {
  e.preventDefault();
  const pos = getCanvasPos(e);

  if (isTextHit(topText, pos.x, pos.y)) {
    activeText = topText;
  } else if (isTextHit(bottomText, pos.x, pos.y)) {
    activeText = bottomText;
  } else {
    activeText = null;
    return;
  }

  offsetX = pos.x - activeText.x;
  offsetY = pos.y - activeText.y;
}

function drag(e) {
  if (!activeText) return;

  const pos = getCanvasPos(e);
  activeText.x = pos.x - offsetX;
  activeText.y = pos.y - offsetY;

  drawMeme();
}

function endDrag() {
  activeText = null;
}

canvas.addEventListener("mousedown", startDrag);
canvas.addEventListener("mousemove", drag);
canvas.addEventListener("mouseup", endDrag);

canvas.addEventListener("touchstart", startDrag);
canvas.addEventListener("touchmove", drag);
canvas.addEventListener("touchend", endDrag);

// ----------------------
// Download meme
// ----------------------
downloadBtn.addEventListener("click", () => {
  html2canvas(canvas).then(c => {
    const link = document.createElement("a");
    link.download = "meme.png";
    link.href = c.toDataURL();
    link.click();
  });
});

// ----------------------
// Buttons
// ----------------------
generateBtn.addEventListener("click", drawMeme);

templateSelect.addEventListener("change", () => {
  if (templateSelect.value) loadImage(templateSelect.value);
});

randomBtn.addEventListener("click", () => {
  const randomMeme = memeTemplates[Math.floor(Math.random() * memeTemplates.length)];
  templateSelect.value = randomMeme.url;
  loadImage(randomMeme.url);
});

imageUpload.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = event => loadImage(event.target.result);
  reader.readAsDataURL(file);
});
