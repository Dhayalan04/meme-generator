const canvas = document.getElementById("meme-canvas");
const ctx = canvas.getContext("2d");
const topTextDiv = document.getElementById("top-text");
const bottomTextDiv = document.getElementById("bottom-text");

const inputTop = document.getElementById("input-top-text");
const inputBottom = document.getElementById("input-bottom-text");
const fontSizeInput = document.getElementById("font-size");
const fontColorInput = document.getElementById("font-color");
const fontStyleInput = document.getElementById("font-style");

const imageUpload = document.getElementById("image-upload");
const templateSelect = document.getElementById("template-select");
const generateBtn = document.getElementById("generate-btn");
const downloadBtn = document.getElementById("download-btn");
const randomBtn = document.getElementById("random-btn");
const toggleTheme = document.getElementById("toggleTheme");
const templatePreview = document.getElementById("template-preview");

let currentImage = new Image();
let topText = "TOP TEXT";
let bottomText = "BOTTOM TEXT";
let memeTemplates = [];

// Fetch meme templates
fetch("https://api.imgflip.com/get_memes")
  .then(res => res.json())
  .then(data => {
    memeTemplates = data.data.memes;
    memeTemplates.forEach((meme, index) => {
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

// Theme toggle
toggleTheme.addEventListener("click", () => document.body.classList.toggle("dark"));

// Handle template selection
templateSelect.addEventListener("change", () => {
  if (templateSelect.value) loadImage(templateSelect.value);
});

// Handle image upload
imageUpload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => loadImage(event.target.result);
  reader.readAsDataURL(file);
});

// Text updates
inputTop.addEventListener("input", () => {
  topText = inputTop.value;
  topTextDiv.textContent = topText;
});
inputBottom.addEventListener("input", () => {
  bottomText = inputBottom.value;
  bottomTextDiv.textContent = bottomText;
});
fontSizeInput.addEventListener("input", drawMeme);
fontColorInput.addEventListener("input", drawMeme);
fontStyleInput.addEventListener("input", drawMeme);

// Buttons
generateBtn.addEventListener("click", drawMeme);
downloadBtn.addEventListener("click", () => {
  html2canvas(document.getElementById("meme-container")).then(canvas => {
    const link = document.createElement("a");
    link.download = "meme.png";
    link.href = canvas.toDataURL();
    link.click();
  });
});

randomBtn.addEventListener("click", () => {
  const randomMeme = memeTemplates[Math.floor(Math.random() * memeTemplates.length)];
  templateSelect.value = randomMeme.url;
  loadImage(randomMeme.url);
});

// Drag & drop
function dragElement(el) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  el.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    el.style.top = (el.offsetTop - pos2) + "px";
    el.style.left = (el.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

dragElement(topTextDiv);
dragElement(bottomTextDiv);

// Load image
function loadImage(src) {
  currentImage.src = src;
  currentImage.crossOrigin = "anonymous";
  currentImage.onload = () => {
    canvas.width = currentImage.width;
    canvas.height = currentImage.height;
    topTextDiv.style.top = "10px";
    bottomTextDiv.style.top = canvas.height - 60 + "px";
    topTextDiv.style.left = "0px";
    bottomTextDiv.style.left = "0px";
    drawMeme();
  };
}

// Draw meme
function drawMeme() {
  if (!currentImage.src) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(currentImage, 0, 0, canvas.width, canvas.height);

  const fontSize = parseInt(fontSizeInput.value, 10);
  const fontColor = fontColorInput.value;
  const fontStyle = fontStyleInput.value;

  ctx.font = `${fontSize}px ${fontStyle}`;
  ctx.fillStyle = fontColor;
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.textAlign = "center";

  // Top text
  ctx.fillText(topTextDiv.textContent, canvas.width / 2, parseInt(topTextDiv.style.top || 50) + fontSize);
  ctx.strokeText(topTextDiv.textContent, canvas.width / 2, parseInt(topTextDiv.style.top || 50) + fontSize);

  // Bottom text
  ctx.fillText(bottomTextDiv.textContent, canvas.width / 2, parseInt(bottomTextDiv.style.top || (canvas.height - 50)) + fontSize);
  ctx.strokeText(bottomTextDiv.textContent, canvas.width / 2, parseInt(bottomTextDiv.style.top || (canvas.height - 50)) + fontSize);
}
