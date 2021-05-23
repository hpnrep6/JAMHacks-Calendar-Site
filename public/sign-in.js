let f = document.getElementById('form');
let n = document.getElementById('notif')

f.onsubmit = async (e) => {
    e.preventDefault();
    console.log(new FormData(f))
    fetch('./api/user/login', {
        method: 'POST',
        body: new FormData(f)
    }).then((response) => {
        return response.json()
    }).then((b) => {
        console.log(b)
        n.innerHTML = b.message;
        f.reset();

        if(b.message == 'Signed in!') {
            let cookie = b.token;
            document.cookie = 'token=' + cookie + ';path=/;'

            
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
        }
    })
}