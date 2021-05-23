{ 
    let lo = document.getElementById('logout')

    let ln = document.getElementById('login')

    let rg = document.getElementById('register')
    console.log(document.cookie)

    lo.addEventListener('click', (e) => {
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 'table=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    })

    if(document.cookie) {
        ln.remove();
        rg.remove()
    } else {
        lo.remove()
    }
}

class Course {
    start
    end
    name
    day
    id
    constructor(n, s, e, d, i) {
        this.start= s;
        this.end = e;
        this.name = n;
        this.day = d;
        this.id = i;
    }
}

var events = [];

let f = document.getElementById('form')

f.onsubmit = async (e) => {
    e.preventDefault();
    
    let id = document.cookie.substring(document.cookie.indexOf('table='))
    id = id.substring(id.indexOf('=') + 1)

    let form = new FormData(f);

    let token = document.cookie.substring(document.cookie.indexOf('token='))
    token = token.substring(0, token.indexOf('table=') == -1 ? token.length : token.indexOf('table='))

    token = token.substring(token.indexOf('=') + 1)

    form.append('token', token)
    form.append('mode', 0)
    form.append('eventID', -1)

    fetch('../api/timetable/update/' + id, {
        method: 'POST',
        body: form
    }).then((response) => {
        console.log(response)
        return response.json()
    }).then((b) => {
        console.log(b)
        let ev = b.events;

        for(let i = 0; i < ev.length; i++) {
            let cu = ev[i];
            let eve = new Course(cu.name, cu.start, cu.end, cu.day, cu._id)
            events.push(eve)
        }
        draw();
    })
}

let c = document.getElementById('table')
let ct = c.getContext('2d')
ct.fillStyle='#000'

function clear() {
    ct.beginPath();
    ct.lineWidth = 2;
    ct.rect(0,0, c.width, c.height)
    ct.fillStyle="#eee"
    ct.fill()
}

function rect(x, y, w, h, cc = '#000') {
    ct.fillStyle=cc
    ct.lineWidth = 0;
    ct.beginPath();
    ct.rect(x, y, w, h)
    ct.fill()
}

function text(text, x, y, s = 14) {
    ct.fillStyle='#000'
    ct.font=s + "px Arial"
    ct.fillText(text, x, y)
}

clear();

let w = c.width
let h = c.height

function line(x, y, x2, y2) {
    ct.fillStyle='#000'
    ct.beginPath()
    ct.lineWidth = 2;
    ct.moveTo(x, y)
    ct.lineTo(x2, y2)
    ct.stroke()
}

line(0,0,0,0) // init, doesn't work without for some reason

const setup = () => {
    rect(0,0,w,h, '#eee')
    let gap = w /6
    let a =[
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday'
    ]
    
    text('Time', 20, 36)

    for(let i = 1; i < 6; i++) {
        line(gap * i, 0, gap * i, h)
        text(a[i-1], gap * i + 20, 36)
        console.log(gap * i)
    }
  
    gap = h/15;
    for(let i = 1, s = 8; i < 15; i++, s++) {
        line(0, gap * i, w, gap * i);
    
        text(s + ":00 - " + (s+1) + ":00", 20, gap * (i+1) - 10)
    }
}   

setup();

// from https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function componentToHex(cc) {
    var hex = cc.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(rr, gg, bb) {
    return "#" + componentToHex(rr) + componentToHex(gg) + componentToHex(bb);
}

const add = (day, start, end, name) => {
    let s = start - 7;
    let e = end - start;

    let x1 = (w / 6) * day ;
    let x2 = w/6
    let y1 = (h / 15 ) * s ;
    let y2 = (h / 15) * e;

    let r = 200 - parseInt(Math.random() * 12312 % 60);
    let g = 250 - parseInt(Math.random() * 12312 % 90);
    let b = 250 - parseInt(Math.random() * 12312 % 90);
    console.log('e ' + x1)
    let he = rgbToHex(g, r, b)

    rect(x1, y1, x2, y2, he)

    let mid = y1 + y2 /2
    
    text(name, (x1 + x2 / 12), mid, 18)

    let diff = end - start;
    let gap = diff > 1 ? mid + 30 : mid + 17
    text(start + ':00 - ' + end + ":00", x1 + x2 /11, gap, 15)
}

{
    let id = document.cookie.substring(document.cookie.indexOf('table='))
    id = id.substring(id.indexOf('=') + 1)

    fetch('../api/timetable/get/' + id, {
        method: 'GET'
    }).then((response) => {
        console.log(response)
        return response.json()
    }).then((b) => {
        console.log(b)
        let username = b.user;

        document.getElementById('uname').innerHTML = username;

        let ev = b.events;

        for(let i = 0; i < ev.length; i++) {
            let cu = ev[i];
            let eve = new Course(cu.name, cu.start, cu.end, cu.day, cu._id)
            events.push(eve)
        }
        draw();
    })

}

function draw() {
    setup();

    for(let i = 0; i < events.length; i++) {
        let cur = events[i];
        add(cur.day, cur.start, cur.end, cur.name)
    }
}