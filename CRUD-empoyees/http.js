function fetchJson(url) {
  return fetch(url).then(r => {
    if (r.ok) {
      return r.json();
    } else {
      throw new Error(r.statusText);
    }
  });
}

function listEmployees() {
  return fetchJson('http://localhost:3000/employees');
}

function listRoles() {
  return fetchJson('http://localhost:3000/roles');
}
