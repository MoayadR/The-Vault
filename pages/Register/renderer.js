const masterPasswordInput = document.getElementById('password')

const createMasterPassword = () => {
    const password = masterPasswordInput.value.trim();
    if (password !== '') {
        messages.createMasterPassword(password);
    }
}

const createButton = document.getElementById('create-button');
createButton.addEventListener('click', createMasterPassword);