// ----------------------
// Meme Generator Script
// ----------------------

const canvas = document.getElementById("meme-canvas");
const ctx = canvas.getContext("2d");

// Inputs & controls
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

// Text positions
let topTextPos = { x: 0, y: 0 };
let bottomTextPos = { x: 0, y: 0 };

// ----------------------
// Load meme templates
// ----------------------
fetch("https://api.imgflip.com/get_memes")
  .then(res => res.json())
  .then(data => {
    memeTemplates = data.data.memes;
    memeTemplates.forEach(meme => {
      // Dropdown options
      const option = document.createElement("option");
      option.value = meme.url;
      option.textContent = meme.name;
      templateSelect.appendChild(option);

      // Preview thumbnails
      const thumb = document.createElement("img");
      thumb.src = meme.url;
      thumb.title = meme.name;
      thumb.addEventListener("click", () => loadImage(meme.url));
      templatePreview.appendChild(thumb);
    });
  });

// ----------------------
// Theme toggle
// ----------------------
toggleTheme.addEventListener("click", () => document.body.classList.toggle("dark"));

// ----------------------
// Image handling
// ----------------------
function loadImage(src){
  currentImage.src = src;
  currentImage.crossOrigin = "anonymous";
  currentImage.onload = () => {
    canvas.width = currentImage.width;
    canvas.height = currentImage.height;

    // Default auto-position
    topTextPos = { x: canvas.width / 2, y: parseInt(fontSizeInput.value,10) + 10 };
    bottomTextPos = { x: canvas.width / 2, y: canvas.height - 10 };

    drawMeme();
  };
}

// Template selection
templateSelect.addEventListener("change", () => {
  if(templateSelect.value) loadImage(templateSelect.value);
});

// Random meme button
randomBtn.addEventListener("click", () => {
  const randomMeme = memeTemplates[Math.floor(Math.random() * memeTemplates.length)];
  templateSelect.value = randomMeme.url;
  loadImage(randomMeme.url);
});

// Image upload
imageUpload.addEventListener("change", e => {
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = event => loadImage(event.target.result);
  reader.readAsDataURL(file);
});

// ----------------------
// Draw meme function
// ----------------------
function drawMeme(){
  if(!currentImage.src) return;

  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.drawImage(currentImage,0,0,canvas.width,canvas.height);

  const fontSize = parseInt(fontSizeInput.value,10);
  const fontColor = fontColorInput.value;
  const fontStyle = fontStyleInput.value;

  ctx.font = `${fontSize}px ${fontStyle}`;
  ctx.fillStyle = fontColor;
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.textAlign = "center";

  // Top text
  ctx.fillText(inputTop.value || "TOP TEXT", topTextPos.x, topTextPos.y);
  ctx.strokeText(inputTop.value || "TOP TEXT", topTextPos.x, topTextPos.y);

  // Bottom text
  ctx.fillText(inputBottom.value || "BOTTOM TEXT", bottomTextPos.x, bottomTextPos.y);
  ctx.strokeText(inputBottom.value || "BOTTOM TEXT", bottomTextPos.x, bottomTextPos.y);
}

// ----------------------
// Input listeners
// ----------------------
[inputTop, inputBottom, fontSizeInput, fontColorInput, fontStyleInput].forEach(input => {
  input.addEventListener("input", drawMeme);
});

// ----------------------
// Drag & touch functionality
// ----------------------
function enableDrag(positionObj){
  let isDragging = false;
  let offset = { x:0, y:0 };

  function startDrag(e){
    isDragging = true;
    const clientX = e.type.startsWith("touch") ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.startsWith("touch") ? e.touches[0].clientY : e.clientY;
    offset.x = clientX - positionObj.x;
    offset.y = clientY - positionObj.y;
  }

  function drag(e){
    if(!isDragging) return;
    const clientX = e.type.startsWith("touch") ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.startsWith("touch") ? e.touches[0].clientY : e.clientY;
    positionObj.x = clientX - offset.x;
    positionObj.y = clientY - offset.y;
    drawMeme();
  }

  function endDrag(){ isDragging = false; }

  canvas.addEventListener("mousedown", startDrag);
  canvas.addEventListener("mousemove", drag);
  canvas.addEventListener("mouseup", endDrag);

  canvas.addEventListener("touchstart", startDrag);
  canvas.addEventListener("touchmove", drag);
  canvas.addEventListener("touchend", endDrag);
}

// Enable dragging for top & bottom
enableDrag(topTextPos);
enableDrag(bottomTextPos);

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
// Generate meme button (draw)
generateBtn.addEventListener("click", drawMeme);
