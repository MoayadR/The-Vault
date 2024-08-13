const detailInput = document.getElementById('detail');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

const button = document.getElementById('edit');
let localPasswordObj;

messages.recievePasswordObj((passwordObj) => {
    detailInput.value = passwordObj.detail;
    emailInput.value = passwordObj.desc;
    passwordInput.value = passwordObj.password;
    localPasswordObj = passwordObj;
})

button.addEventListener('click', () => {
    localPasswordObj.detail = detailInput.value
    localPasswordObj.email = emailInput.value
    localPasswordObj.password = passwordInput.value

    messages.editPassword(localPasswordObj);
});