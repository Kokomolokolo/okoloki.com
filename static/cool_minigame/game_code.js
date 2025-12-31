const square = document.getElementById("moin");

square.addEventListener('mouseenter', () => {
    square.style.top = `${Math.random() * 1000}px`;  
    square.style.left = `${Math.random() * 2300}px`;
});
    