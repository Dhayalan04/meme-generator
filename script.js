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

function downloadMeme() {
  const meme = document.querySelector(".meme");

  html2canvas(meme).then((canvas) => {
    const link = document.createElement("a");
    link.download = "meme.png";
    link.href = canvas.toDataURL();
    link.click();
  });
}

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

async function generateAIImage() {
  try {
    const prompt = document.getElementById("aiPrompt").value;

    const res = await fetch("https://meme-generator-fp80.onrender.com/generate-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: prompt }),
    });

    const data = await res.json();

    document.getElementById("aiImage").src = data.image;

  } catch (error) {
    console.error(error);
    alert("Failed to generate image");
  }
}
