const title = document.querySelector('.title');

const titleString = "The Vault";

let index = 0;
const typeWriter = setInterval(() => {
    if (index == titleString.length) {
        clearInterval(typeWriter);
        return;
    }
    title.textContent = title.textContent + titleString[index++];
}, 700);