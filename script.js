function generateMeme() {
    let topText = document.getElementById("topText").value;
    let bottomText = document.getElementById("bottomText").value;

    document.getElementById("top").innerText = topText;
    document.getElementById("bottom").innerText = bottomText;
}
