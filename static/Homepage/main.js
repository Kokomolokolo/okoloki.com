function redirectToPage(subdomain) {
    window.location.href = `${subdomain}`;
}

function nichtDa(){
    alert("Working on it!!!")
}

const usericon = document.querySelector(".usericon")
const dropdown = document.querySelector(".dropdown")

usericon.addEventListener('click', () => {
    dropdown.style.display = "block";
    dropdown.style.color = "black";
    dropdown.style.padding = "10px";
});
document.addEventListener("click", (event) => {
    // Check if the click is outside the usericon and dropdown
    if (!usericon.contains(event.target) && !dropdown.contains(event.target)) {
      dropdown.style.display = "none";
    }
});


// Animation leaving
const button = document.querySelector('#button');


button.addEventListener('mouseleave', () => {
    button.style.animation = 'flash 0.5s reverse';
});




// lösung für animation bei maus enter im css file

// const buttons = document.querySelectorAll("buttons");

// let size = 1.05;

// buttons.forEach((button) => {
//     button.addEventListener('mouseenter', () => {
//         // Animate the specific button being hovered
//         button.animate([
//             { transform: 'scale(1)' },
//             { transform: `scale(${size})` } // Corrected string interpolation
//         ], {
//             duration: 100,
//             fill: 'forwards' // Ensures the button remains scaled after the animation
//         });
//         button.style.transform = `scale(${size})`; // Corrected string interpolation
//     });
buttons.forEach((button) => {
    button.addEventListener('mouseleave', () => {
        button.animate([
            { transform: `scale(1)` },
            { transform: 'scale(0.95)' }
        ], {
             duration: 100,
             fill: 'forwards'
        });
        button.style.transform = 'scale(1)'; // Reset the scaling
    });
});

// habs gefixt
