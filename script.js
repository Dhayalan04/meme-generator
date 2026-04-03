// ================= MEME GENERATOR =================
function generateMeme() {
  let topText = document.getElementById("topText").value;
  let bottomText = document.getElementById("bottomText").value;

  let top = document.getElementById("top");
  let bottom = document.getElementById("bottom");

  top.innerText = topText;
  bottom.innerText = bottomText;

  top.style.display = topText ? "block" : "none";
  bottom.style.display = bottomText ? "block" : "none";

  top.style.top = "10px";
  top.style.left = "50%";
  top.style.transform = "translateX(-50%)";

  bottom.style.bottom = "10px";
  bottom.style.left = "50%";
  bottom.style.transform = "translateX(-50%)";
}

// ================= IMAGE UPLOAD =================
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

// ================= DOWNLOAD =================
function downloadMeme() {
  const meme = document.querySelector(".meme");

  html2canvas(meme).then((canvas) => {
    const link = document.createElement("a");
    link.download = "meme.png";
    link.href = canvas.toDataURL();
    link.click();
  });
}

// ================= DRAG FEATURE =================
function makeDraggable(element) {
  let isDragging = false;
  let offsetX, offsetY;

  element.addEventListener("mousedown", startDrag);
  element.addEventListener("touchstart", startDrag);

  function startDrag(e) {
    isDragging = true;
    const event = e.touches ? e.touches[0] : e;

    element.style.transform = "none";

    offsetX = event.clientX - element.offsetLeft;
    offsetY = event.clientY - element.offsetTop;
  }

  document.addEventListener("mousemove", drag);
  document.addEventListener("touchmove", drag);

  function drag(e) {
    if (!isDragging) return;

    const event = e.touches ? e.touches[0] : e;

    element.style.left = event.clientX - offsetX + "px";
    element.style.top = event.clientY - offsetY + "px";
  }

  document.addEventListener("mouseup", () => (isDragging = false));
  document.addEventListener("touchend", () => (isDragging = false));
}

// Apply dragging
makeDraggable(document.getElementById("top"));
makeDraggable(document.getElementById("bottom"));

// ================= AI IMAGE GENERATION =================
async function generateAIImage() {
  try {
    const prompt = document.getElementById("aiPrompt").value;

    console.log("Button clicked:", prompt);

    const res = await fetch("https://meme-backend-n1g8.onrender.com/generate-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: prompt }),
    });

    const data = await res.json();

    console.log("AI response:", data);

    document.getElementById("aiImage").src = data.image;

  } catch (error) {
    console.error("Error:", error);
    alert("Failed to generate image");
  }
}
