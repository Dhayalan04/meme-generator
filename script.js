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
            document.getElementById("memeImage").src = e.target.result;
        };
        
        reader.readAsDataURL(file);
    }
});
