let employees = [];
let roles = [];

let selectedtem;

const listEl = document.querySelector('ul');
const formEl = document.querySelector('form');
const bDelete = document.getElementById('bDelete');
const bCancel = document.getElementById('bCancel');
const bSubmit = document.getElementById('bSubmit');

async function init() {
  [employees, roles] = await Promise.all([listEmployees(), listRoles()]);
  renderData();
  renderRoles();
  clearSelection();

  bCancel.addEventListener('click', clearSelection);
  formEl.addEventListener('submit', onSubmit);
  bDelete.addEventListener('click', onDelete);
}

init();

function selectItem(li, employee) {
  clearSelection();
  selectedtem = employee;
  console.log(selectedtem);
  li.classList.add('selected');

  formEl.name.value = employee.name;
  formEl.salary.valueAsNumber = employee.salary;
  formEl.role_id.value = employee.role_id;

  bDelete.style.display = 'inline';
  bCancel.style.display = 'inline';
  bSubmit.textContent = 'Update';
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
  bSubmit.textContent = 'Create';
}

async function onSubmit(evt) {
  evt.preventDefault();

  const employeeData = {
    name: formEl.name.value,
    salary: formEl.salary.valueAsNumber,
    role_id: +formEl.role_id.value,
  };

  if (!employeeData.name || !employeeData.salary || !employeeData.role_id) {
    showError('You must fill all from fields');
  } else {
    //atualizar
    if (selectedtem) {
      const updatedItem = await updateEmployee(selectedtem.id, employeeData);

      const i = employees.indexOf(selectedtem);
      employees[i] = updatedItem;
      renderData();
      selectItem(listEl.children[i], updatedItem);
    }
    // create
    else {
      const createdItem = await createEmployee(employeeData);
      employees.push(createdItem);
      renderData();
      const i = employees.indexOf(createdItem);
      selectItem(listEl.children[i], createdItem);
    }
  }
}

async function onDelete() {
  if (selectedtem) {
    await deleteEmployee(selectedtem.id);
    const i = employees.indexOf(selectedtem);
    employees.splice(i, 1);
    renderData();
    clearSelection();
  }
}

function renderData() {
  clearError();
  listEl.innerHTML = '';
  employees.sort((a, b) => {
    return a.name > b.name ? 1 : a.name < b.name ? -1 : 0;
  });
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

function showError(message, error) {
  document.getElementById('errors').textContent = message;
  if (error) {
    console.error(error);
  }
}

function clearError() {
  document.getElementById('errors').textContent = '';
}
