const detailInput = document.getElementById('detail');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

const createButton = document.getElementById('create');

createButton.addEventListener('click', () => {
    const data = {
        detail: detailInput.value,
        email: emailInput.value,
        password: passwordInput.value
    };

    messages.createPassword(data);
});