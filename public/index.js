
let lo = document.getElementById('logout')

let ln = document.getElementById('login')

let rg = document.getElementById('register')

lo.addEventListener('click', (e) => {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'table=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    console.log(document.cookie)
})

if(document.cookie) {
    ln.remove();
    rg.remove()
} else {
    lo.remove()
}


let t = document.getElementById('navbar__logo')

t.addEventListener('click', (e) => {
    e.preventDefault();
    let request = new XMLHttpRequest();
    request.open('POST', './api/timetable/new')

    let token = document.cookie.substring(document.cookie.indexOf('token='))
    token = token.substring(0, token.indexOf('table=') == -1 ? token.length : token.indexOf('table='))

    token = token.substring(token.indexOf('=') + 1)
    let form = new FormData();
    form.append('token', token)
    form.append('name', 'My Timetable')

    request.send(form);

    request.onload = (e) => {
        let js = JSON.parse(e.target.response);

        if(document.cookie.indexOf('table=') == -1) {
            document.cookie += 'table=' + js.id + ';';
        }
        
        window.location.href = window.location.href.substring(0, window.location.href.indexOf('/')) + 'timetable.html'
    }
})
