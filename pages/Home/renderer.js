const addPasswordIcon = document.querySelector('.plus');
const deleteIcons = document.querySelectorAll('.delete-icon');
const searchInput = document.querySelector('.search-input');

addPasswordIcon.addEventListener('click', () => messages.openCreateNewPassword())
const tbody = document.getElementById('tbody')

const deletePassword = (id) => {
    res = confirm("Are you sure you want to delete the password");

    if (res) { messages.deletePassword(id) }
};


const makeTableRow = (passwordObj) => {
    let tr = document.createElement('tr');
    tr.setAttribute('class', 'table-row');

    let td1 = document.createElement('td');
    td1.innerText = passwordObj.detail;
    td1.setAttribute('class', 'copy');
    let td2 = document.createElement('td');
    td2.innerText = passwordObj.desc;
    td2.setAttribute('class', 'copy');
    let td3 = document.createElement('td');
    td3.innerText = passwordObj.password;
    td3.setAttribute('class', 'copy');
    let td4 = document.createElement('td');
    td4.setAttribute('class', 'fa fa-edit edit');
    let td5 = document.createElement('td');
    td5.setAttribute('class', "fa fa-trash-o delete-icon");

    td1.addEventListener('click', () => {
        navigator.clipboard.writeText(passwordObj.detail);
    });
    td2.addEventListener('click', () => {
        navigator.clipboard.writeText(passwordObj.desc);
    });
    td3.addEventListener('click', () => {
        navigator.clipboard.writeText(passwordObj.password);
    });

    td4.addEventListener('click', () => messages.openEditPassword(passwordObj));

    td5.addEventListener('click', () => deletePassword(passwordObj.id));


    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);

    tbody.appendChild(tr);
}

async function main() {
    const passwordObjects = await messages.getAllPasswords();

    for (let obj of passwordObjects) {
        makeTableRow(obj);
    }
}

searchInput.addEventListener('keyup', () => {
    const trElements = document.querySelectorAll('tbody tr');
    const searchValue = searchInput.value.trim().toLowerCase();

    for (let tr of trElements) {
        let status = false;
        for (let td of tr.children) {
            if (td.innerText.toLowerCase().includes(searchValue))
                status = true;
        }

        if (status) tr.style.display = "";
        else tr.style.display = "none";
    }
});

main();
