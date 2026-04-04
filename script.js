// -------------------- GLOBAL --------------------

let selectedTemplate = null;

// -------------------- MEME TEXT --------------------

function generateMeme() {
  let topText = document.getElementById("topText").value;
  let bottomText = document.getElementById("bottomText").value;

  let top = document.getElementById("top");
  let bottom = document.getElementById("bottom");

  top.innerText = topText;
  bottom.innerText = bottomText;

  top.style.display = topText ? "block" : "none";
  bottom.style.display = bottomText ? "block" : "none";

  // Position reset
  top.style.top = "10px";
  top.style.left = "50%";
  top.style.transform = "translateX(-50%)";

  bottom.style.bottom = "10px";
  bottom.style.left = "50%";
  bottom.style.transform = "translateX(-50%)";
}

// -------------------- LOAD IMGFLIP TEMPLATES --------------------

async function loadTemplates() {
  try {
    const res = await fetch("https://api.imgflip.com/get_memes");
    const data = await res.json();

    const memes = data.data.memes;
    const container = document.getElementById("templateContainer");

    container.innerHTML = "";

    memes.slice(0, 20).forEach(meme => {
      const img = document.createElement("img");
      img.src = meme.url;

      img.onclick = () => {
        selectTemplate(meme, img);
      };

      container.appendChild(img);
    });

  } catch (error) {
    console.error(error);
    alert("Failed to load templates");
  }
}

// -------------------- SELECT TEMPLATE --------------------

function selectTemplate(meme, imgElement) {
  selectedTemplate = meme;

  const preview = document.getElementById("memeImage");
  preview.src = meme.url;
  preview.style.display = "block";

  // Remove previous selection highlight
  document.querySelectorAll(".template-grid img").forEach(img => {
    img.style.border = "none";
  });

  // Highlight selected
  imgElement.style.border = "3px solid #ffb347";
}

// -------------------- IMAGE UPLOAD --------------------

document.getElementById("imageInput").addEventListener("change", function (event) {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const img = document.getElementById("memeImage");
      img.src = e.target.result;
      img.style.display = "block";

      selectedTemplate = null; // remove template selection
    };

    reader.readAsDataURL(file);
  }
});

// -------------------- DOWNLOAD --------------------

function downloadMeme() {
  const meme = document.querySelector(".meme");

  html2canvas(meme).then((canvas) => {
    const link = document.createElement("a");
    link.download = "meme.png";
    link.href = canvas.toDataURL();
    link.click();
  });
}

// -------------------- DRAG TEXT --------------------

function makeDraggable(element) {
  let isDragging = false;
  let offsetX, offsetY;

  element.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - element.offsetLeft;
    offsetY = e.clientY - element.offsetTop;
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    element.style.left = e.clientX - offsetX + "px";
    element.style.top = e.clientY - offsetY + "px";
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });
}

makeDraggable(document.getElementById("top"));
makeDraggable(document.getElementById("bottom"));

// -------------------- OPTIONAL AI (KEEP OR REMOVE) --------------------

function generateAIImage() {
  const prompt = document.getElementById("aiPrompt").value;
  const img = document.getElementById("aiImage");
  const loading = document.getElementById("loading");

  if (!prompt.trim()) {
    alert("Please enter a prompt!");
    return;
  }

  if (loading) loading.style.display = "block";
  img.style.display = "none";

  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

  img.onload = () => {
    if (loading) loading.style.display = "none";
    img.style.display = "block";
  };

  img.onerror = () => {
    if (loading) loading.style.display = "none";
    alert("Failed to load AI image");
  };

  img.src = url;
}
