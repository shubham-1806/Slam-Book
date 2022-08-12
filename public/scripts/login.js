const token = document.getElementById('token').innerText;
const id = document.getElementById('id').innerText;
window.localStorage.setItem('token',token);

window.location.href = `/user/${id}`

