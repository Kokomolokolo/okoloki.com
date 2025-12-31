let clickedImages = [];
let clickedCounter = 0;
let limit = 14
let isComparing = undefined
let tries = 0

async function fetchImage() {
    const response = await fetch("/cat")
    const data = await response.json();
    let images = data
    console.log("data fetched")
    images = images.concat(images)
    mix(images)
    asignImages(images)
}

function asignImages(element){
    let container = document.getElementById("image-container")
        container.innerHTML = ""
    
    element.forEach(x => {
        let imgElement = document.createElement("img")
        imgElement.dataset.url = x.url; // Save the real URL here
        imgElement.dataset.id = x.id;
        imgElement.src = "static/textures/PLAY-4891-P3DXmm01_BackgroundPattern_v01.1765155c.jpg"; // black placeholder
        imgElement.classList.add("hidden");
        container.appendChild(imgElement);
        imgElement.addEventListener("click", () => {
            HandleClick(imgElement)
            console.log(imgElement.dataset.id)
        })
    }
)}

function mix(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function HandleClick(image) {
    if (isComparing || !image.classList.contains("hidden")) return;
    
    image.src = image.dataset.url;
    image.classList.remove("hidden");

    clickedImages.push(image);

    if (clickedImages.length == 2) {
        isComparing = true;
        CompareClick()
    } 
    else if (clickedImages.length === 3) {
        // Flip back the first two images
        clickedImages[0].src = "static/textures/PLAY-4891-P3DXmm01_BackgroundPattern_v01.1765155c.jpg";
        clickedImages[1].src = "static/textures/PLAY-4891-P3DXmm01_BackgroundPattern_v01.1765155c.jpg";
        clickedImages[0].classList.add("hidden");
        clickedImages[1].classList.add("hidden");
        clickedImages.splice(0, 2);
    }
}

function CompareClick() {
    if (clickedImages.length < 2) {
        isComparing = false;
        return;
    }
    
    console.log(clickedImages)
    if (clickedImages[0].dataset.id === clickedImages[1].dataset.id) {
        console.log("images match");

        clickedImages.splice(0, 2)
        // Keep them revealed
    } else {
        console.log("images don't match");
        // clickedImages[0].src = "images/PLAY-4891-P3DXmm01_BackgroundPattern_v01.1765155c.jpg";
        // clickedImages[1].src = "images/PLAY-4891-P3DXmm01_BackgroundPattern_v01.1765155c.jpg";
        // clickedImages[0].classList.add("hidden");
        // clickedImages[1].classList.add("hidden");
    }
    isComparing = false;
    tries++
} 
