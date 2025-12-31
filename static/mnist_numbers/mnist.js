

const canvas = document.getElementById("num_canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });

const tmpCanvas = document.getElementById("tmpCanvas");
const tmpctx = tmpCanvas.getContext("2d", { willReadFrequently: true });


let drawing = false;

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

ctx.strokeStyle = "white";
ctx.lineWidth = 10;
ctx.lineCap = "round";


canvas.addEventListener("mousedown", e => {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
})

canvas.addEventListener("mousemove", e => {
    if (!drawing) return;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
})

canvas.addEventListener("mouseleave", e => {
    drawing = false;
})

canvas.addEventListener("mouseup", e => {
    drawing = false;
    ask_bob()
})

function get_28x28_array1(){
    tmpctx.clearRect(0, 0, 28, 28);
    tmpctx.drawImage(canvas, 0, 0, 28, 28);

    let imgData = tmpctx.getImageData(0, 0, 28, 28); // Pixeldata aus tmpctx
    
    let pixels = [];
    for (let i = 0; i < imgData.data.length; i += 4) {
        let r = imgData.data[i];
        let g = imgData.data[i + 1];
        let b = imgData.data[i + 2];
        let gray = (0.299 * r + 0.587 * g + 0.114 * b);
        pixels.push(gray);
    }
    console.log(pixels);
    
    return pixels;
}
function get_28x28_array() {
    // Schritt 1: Finde die Bounding Box der Zeichnung auf der Haupt-Leinwand
    const mainCtx = canvas.getContext('2d');
    const imgData = mainCtx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    let minX = canvas.width, minY = canvas.height, maxX = -1, maxY = -1;

    // Gehe durch alle Pixel und finde die äußersten Ränder der Zeichnung
    // Wir prüfen den Alpha-Kanal (Transparenz), um gezeichnete Pixel zu finden
    for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] > 0) { // data[i+3] ist der Alpha-Wert
            const x = (i / 4) % canvas.width;
            const y = Math.floor((i / 4) / canvas.width);
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
        }
    }

    // Falls die Leinwand leer ist, gib ein leeres Array zurück
    if (maxX === -1) {
        return new Array(784).fill(0);
    }

    // Schritt 2: Berechne Dimensionen und Skalierungsfaktor
    const boxWidth = maxX - minX + 1;
    const boxHeight = maxY - minY + 1;
    
    // Die Zeichnung soll in eine 20x20 Box passen, um den MNIST-Daten zu ähneln
    const scale = 20 / Math.max(boxWidth, boxHeight);
    const newWidth = boxWidth * scale;
    const newHeight = boxHeight * scale;

    // Schritt 3: Zentriere die Zeichnung auf der temporären 28x28 Leinwand
    // Berechne die Ziel-Position (links oben), um das Bild zu zentrieren
    const destX = (28 - newWidth) / 2;
    const destY = (28 - newHeight) / 2;

    // Lösche die temporäre Leinwand und zeichne das zugeschnittene, skalierte Bild
    tmpctx.clearRect(0, 0, 28, 28);
    tmpctx.drawImage(
        canvas,      // Quell-Leinwand
        minX, minY,  // Startpunkt des Zuschneidens (linke obere Ecke der Bounding Box)
        boxWidth, boxHeight, // Größe des zugeschnittenen Bereichs
        destX, destY, // Ziel-Position auf der 28x28 Leinwand
        newWidth, newHeight // Endgültige Größe der Zeichnung
    );
    
    // Schritt 4: Extrahiere die Pixeldaten von der perfekt vorbereiteten 28x28 Leinwand
    let finalImgData = tmpctx.getImageData(0, 0, 28, 28);
    let pixels = [];
    for (let i = 0; i < finalImgData.data.length; i += 4) {
        // Wir nehmen nur den Rot-Kanal, da wir mit Weiß auf Schwarz zeichnen.
        // Das ist einfacher als die Graustufen-Formel und funktioniert hier genauso gut.
        let gray = finalImgData.data[i]; 
        pixels.push(gray);
    }
    
    // Gib das fertige Array zurück, das an den Server gesendet wird
    return pixels;
}
function ask_bob() {
    let pixels = get_28x28_array();

    fetch("/bobwasistdas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: pixels })
    })
    .then(res => res.json())
    .then(data => {
        console.log("Prediction:", data.predicted);
        console.log("Confidences:", data.confidences);
        
        let confidenceOfPrediction = data.confidences[data.predicted]
        console.log(`Das Model ist sich zu ${confidenceOfPrediction}% sicher.`);

        let confidenceText = "Alle Konfidenzwerte:\n";
        data.confidences.forEach((confidence, index) => {
            confidenceText += `Ziffer ${index}: ${(confidence * 100).toFixed(2)}%\n`;
        });
        console.log(confidenceText);
        
        // Optional: Anzeige im Browser
        const predictionElement = document.getElementById("prediction-output");
        const confidenceElement = document.getElementById("confidence-output");
        
        const predictedDigit = data.predicted;
        const confidenceValue = (data.confidences[predictedDigit] * 100).toFixed(2);

        // 3. Den Inhalt der HTML-Elemente aktualisieren
        predictionElement.textContent = predictedDigit;
        confidenceElement.textContent = `${confidenceValue}%`;
    });
}


function clear_canvas() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT)
}