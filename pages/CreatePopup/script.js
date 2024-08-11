const passwordIcon = document.querySelector('.password-toggle-icon')

passwordIcon.addEventListener('click', () => {
    const passwordInput = document.querySelector('#password');
    passwordInput.setAttribute('type', passwordInput.type === 'password' ? 'text' : 'password');
});
