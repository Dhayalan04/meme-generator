function generateMeme() {
    let topText = document.getElementById("topText").value;
    let bottomText = document.getElementById("bottomText").value;

    document.getElementById("top").innerText = topText;
    document.getElementById("bottom").innerText = bottomText;
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

    element.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.offsetX;
        offsetY = e.offsetY;
    });

    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            element.style.left = (e.pageX - element.parentElement.offsetLeft - offsetX) + "px";
            element.style.top = (e.pageY - element.parentElement.offsetTop - offsetY) + "px";
        }
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
    });
}

// Apply to both texts
makeDraggable(document.getElementById("top"));
makeDraggable(document.getElementById("bottom"));
