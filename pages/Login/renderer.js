const masterPasswordInput = document.getElementById('password');
const enterButton = document.getElementById('enter');

enterButton.addEventListener('click', async () => {
    const masterPassword = masterPasswordInput.value.trim();

    const status = await messages.verifyMasterPassword(masterPassword);

    if (!status) console.log("HAHAH Nice Try!");

});