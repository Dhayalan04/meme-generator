function generateMeme() {
    let topText = document.getElementById("topText").value;
    let bottomText = document.getElementById("bottomText").value;

    let top = document.getElementById("top");
    let bottom = document.getElementById("bottom");

    // Set text
    top.innerText = topText;
    bottom.innerText = bottomText;

    // Show only if text exists
    top.style.display = topText ? "block" : "none";
    bottom.style.display = bottomText ? "block" : "none";

    // Auto position
    top.style.top = "10px";
    top.style.left = "50%";
    top.style.transform = "translateX(-50%)";

    bottom.style.bottom = "10px";
    bottom.style.left = "50%";
    bottom.style.transform = "translateX(-50%)";
}
document.getElementById("imageInput").addEventListener("change", function(event) {
    const file = event.target.files[0];
    
    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
           const img = document.getElementById("memeImage");
            img.src = e.target.result;
            img.style.display = "block"; 
        };
        reader.readAsDataURL(file);
    }
});
function downloadMeme() {
    const meme = document.querySelector(".meme");

    html2canvas(meme).then(canvas => {
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
    element.addEventListener("touchstart", startDrag);

    function startDrag(e) {
        isDragging = true;

        const event = e.touches ? e.touches[0] : e;

        // remove center transform when dragging starts
        element.style.transform = "none";

        offsetX = event.clientX - element.offsetLeft;
        offsetY = event.clientY - element.offsetTop;
    }

    document.addEventListener("mousemove", drag);
    document.addEventListener("touchmove", drag);

    function drag(e) {
        if (!isDragging) return;

        const event = e.touches ? e.touches[0] : e;

        element.style.left = (event.clientX - offsetX) + "px";
        element.style.top = (event.clientY - offsetY) + "px";
    }

    document.addEventListener("mouseup", () => isDragging = false);
    document.addEventListener("touchend", () => isDragging = false);
}

// Apply to both texts
makeDraggable(document.getElementById("top"));
makeDraggable(document.getElementById("bottom"));
function makeDraggable(element) {
    let isDragging = false;
    let offsetX, offsetY;

    element.addEventListener("mousedown", startDrag);
    element.addEventListener("touchstart", startDrag);

    function startDrag(e) {
        isDragging = true;
        const event = e.touches ? e.touches[0] : e;
        offsetX = event.clientX - element.offsetLeft;
        offsetY = event.clientY - element.offsetTop;
    }

    document.addEventListener("mousemove", drag);
    document.addEventListener("touchmove", drag);

    function drag(e) {
        if (!isDragging) return;
        const event = e.touches ? e.touches[0] : e;

        element.style.left = (event.clientX - offsetX) + "px";
        element.style.top = (event.clientY - offsetY) + "px";
    }

    document.addEventListener("mouseup", () => isDragging = false);
    document.addEventListener("touchend", () => isDragging = false);
}
async function generateAIImage() {
  const prompt = document.getElementById("aiPrompt").value;

  const res = await fetch("https://meme-backend-n1g8.onrender.com/generate-image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  const data = await res.json();

  document.getElementById("aiImage").src = data.image;
}
console.log("Button clicked");
