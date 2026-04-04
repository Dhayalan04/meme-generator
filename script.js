function generateMeme() {
  let topText = document.getElementById("topText").value;
  let bottomText = document.getElementById("bottomText").value;

  let top = document.getElementById("top");
  let bottom = document.getElementById("bottom");

  top.innerText = topText;
  bottom.innerText = bottomText;

  top.style.display = topText ? "block" : "none";
  bottom.style.display = bottomText ? "block" : "none";

  // Positioning
  top.style.top = "10px";
  top.style.left = "50%";
  top.style.transform = "translateX(-50%)";

  bottom.style.bottom = "10px";
  bottom.style.left = "50%";
  bottom.style.transform = "translateX(-50%)";
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
    };

    reader.readAsDataURL(file);
  }
});

// -------------------- DOWNLOAD MEME --------------------

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

  element.addEventListener("mousedown", startDrag);

  function startDrag(e) {
    isDragging = true;
    offsetX = e.clientX - element.offsetLeft;
    offsetY = e.clientY - element.offsetTop;
  }

  document.addEventListener("mousemove", function (e) {
    if (!isDragging) return;

    element.style.left = e.clientX - offsetX + "px";
    element.style.top = e.clientY - offsetY + "px";
  });

  document.addEventListener("mouseup", () => (isDragging = false));
}

makeDraggable(document.getElementById("top"));
makeDraggable(document.getElementById("bottom"));

// -------------------- FREE AI IMAGE GENERATOR --------------------

function generateAIImage() {
  const prompt = document.getElementById("aiPrompt").value;
  const img = document.getElementById("aiImage");
  const loading = document.getElementById("loading");

  if (!prompt.trim()) {
    alert("Please enter a prompt!");
    return;
  }

  // Show loading
  if (loading) loading.style.display = "block";
  img.style.display = "none";

  // FREE AI IMAGE (no backend, no API key)
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

  // Load image
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
