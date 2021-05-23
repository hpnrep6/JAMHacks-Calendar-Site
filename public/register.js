let f = document.getElementById('form');
let n = document.getElementById('notif')

f.onsubmit = async (e) => {
    e.preventDefault();
    console.log(new FormData(f))
    fetch('./api/user/new', {
        method: 'POST',
        body: new FormData(f)
    }).then((response) => {
        return response.json()
    }).then((b) => {
        console.log(b)
        n.innerHTML = 'Registered!'
        f.reset();
    })
}