const masterPasswordInput = document.getElementById('password')

const createMasterPassword = () => {
    const password = masterPasswordInput.value;
    if (password.trim() !== '') {
        messages.createMasterPassword(password.trim());
    }
}

const createButton = document.getElementById('create-button');
createButton.addEventListener('click', createMasterPassword);