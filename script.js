const auth = firebase.auth();
const db = firebase.database();
const storage = firebase.storage();

function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            document.getElementById('login-page').style.display = 'none';
            document.getElementById('dashboard').style.display = 'block';
            loadFiles();
        })
        .catch(err => alert(err.message));
}

function logout() {
    auth.signOut().then(() => {
        document.getElementById('login-page').style.display = 'block';
        document.getElementById('dashboard').style.display = 'none';
    });
}

function uploadFile() {
    const file = document.getElementById('pdfFile').files[0];
    if (!file) return alert("Pilih file PDF terlebih dahulu");
    const ref = storage.ref('pdfs/' + file.name);
    ref.put(file).then(() => {
        ref.getDownloadURL().then(url => {
            db.ref('files').push({ name: file.name, url: url });
            loadFiles();
        });
    });
}

function loadFiles() {
    const fileList = document.getElementById('file-list');
    fileList.innerHTML = '';
    db.ref('files').on('value', snapshot => {
        fileList.innerHTML = '';
        snapshot.forEach(child => {
            const data = child.val();
            fileList.innerHTML += `<div><a href="${data.url}" target="_blank">${data.name}</a></div>`;
        });
    });
}
