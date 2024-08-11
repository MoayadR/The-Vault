const addPasswordIcon = document.querySelector('.plus');
const deleteIcons = document.querySelectorAll('.delete-icon');

addPasswordIcon.addEventListener('click', () => messages.openCreateNewPassword())
const tbody = document.getElementById('tbody')


const makeTableRow = (passwordObj) => {
    let tr = document.createElement('tr');
    tr.setAttribute('class', 'table-row');

    let td1 = document.createElement('td');
    td1.innerText = passwordObj.detail;
    let td2 = document.createElement('td');
    td2.innerText = passwordObj.desc;
    let td3 = document.createElement('td');
    td3.innerText = passwordObj.password;
    let td4 = document.createElement('td');
    td4.setAttribute('class', 'fa fa-edit edit');
    let td5 = document.createElement('td');
    td5.setAttribute('class', "fa fa-trash-o delete-icon");

    td4.addEventListener('click', () => alert("edit leh kda"));
    td5.addEventListener('click', () => alert("delete leh kda"));

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

main();
