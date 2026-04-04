document.addEventListener("DOMContentLoaded", () => {

  console.log("JS Loaded ✅");

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

    top.style.top = "10px";
    top.style.left = "50%";
    top.style.transform = "translateX(-50%)";

    bottom.style.bottom = "10px";
    bottom.style.left = "50%";
    bottom.style.transform = "translateX(-50%)";
  }

  window.generateMeme = generateMeme;

  // -------------------- LOAD TEMPLATES --------------------
  async function loadTemplates() {
    console.log("Loading templates...");

    try {
      const res = await fetch("https://api.imgflip.com/get_memes");
      const data = await res.json();

      const memes = data.data.memes;
      const container = document.getElementById("templateContainer");

      container.innerHTML = "";

      memes.slice(0, 12).forEach(meme => {
        const img = document.createElement("img");
        img.src = meme.url;

        img.onclick = () => {
          document.getElementById("memeImage").src = meme.url;
          document.getElementById("memeImage").style.display = "block";
        };

        container.appendChild(img);
      });

    } catch (err) {
      console.error(err);
    }
  }

  window.loadTemplates = loadTemplates;

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

  window.downloadMeme = downloadMeme;

  // -------------------- DRAG --------------------
  function makeDraggable(element) {
    if (!element) return;

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

});
