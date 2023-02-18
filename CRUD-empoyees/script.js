let employees = [];
let roles = [];

let selectedtem;

const listEl = document.querySelector('ul');
const formEl = document.querySelector('form');
const bDelete = document.getElementById('bDelete');
const bCancel = document.getElementById('bCancel');
const bSubmit = document.getElementById('bSubmit');

async function init() {
  try {
    [employees, roles] = await Promise.all([listEmployees(), listRoles()]);
    renderData();
    renderRoles();

    clearSelection();
    bCancel.addEventListener('click', clearSelection);
  } catch (error) {
    showError(error);
  }
}

init();

function selectItem(li, employee) {
  clearSelection();
  selectedtem = employee;
  li.classList.add('selected');

  formEl.name.value = employee.name;
  formEl.salary.valueAsNumber = employee.salary;
  formEl.role_id.value = employee.role_id;

  bDelete.style.display = 'inline';
  bCancel.style.display = 'inline';
}

function clearSelection() {
  selectedtem = undefined;
  const li = listEl.querySelector('.selected');
  if (li) {
    li.classList.remove('selected');
  }

  formEl.name.value = '';
  formEl.salary.value = '';
  formEl.role_id.value = '';

  bDelete.style.display = 'none';
  bCancel.style.display = 'none';
}

function renderData() {
  for (const employee of employees) {
    let role = roles.find(role => role.id === employee.role_id);

    const li = document.createElement('li');
    const divName = document.createElement('div');
    const divRole = document.createElement('div');

    divName.textContent = employee.name;
    divRole.textContent = role.name;

    li.appendChild(divName);
    li.appendChild(divRole);

    li.addEventListener('click', () => selectItem(li, employee));
    listEl.appendChild(li);
  }
}

function renderRoles() {
  for (const role of roles) {
    const option = document.createElement('option');

    option.textContent = role.name;
    option.value = role.id;

    formEl.role_id.appendChild(option);
  }
}

function showError(error) {
  document.getElementById(
    'errors'
  ).textContent = `Erro ao carregar dados <br>${error}`;
}
