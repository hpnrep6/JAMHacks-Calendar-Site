require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const counter = require('./server/models/counter')
const formidable = require('express-formidable')

const app = express();
const router = express.Router();

const port = process.env.PORT || 3000;

const URI = process.env.URI;

async function initCounter(name) {
    await counter.exists({
        _id: name
    }, (err, result) => {
        if(err) {
            console.log('Error');
            console.log(err);
            return;
        }
        if(result) {
            console.log(name + ' exists, continuing...');
            return;
        }
        const userIncrement = new counter ({
            _id: name
        });
        userIncrement.save().then(result => {
            console.log(name + ' counter created');
        }).catch(error => {
            console.log('Error creating ' + name + ' counter: ');
            console.log(error);
        });
    });
}

mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then((res) => {
    console.log('Connected to Database')
    initCounter(process.env.USER_COUNTER)
    initCounter(process.env.TIMETABLE_COUNTER)
    initCounter(process.env.EVENT_COUNTER)
}).catch((err) => {
    console.log(err);
})

app.use(bodyParser.json());
app.use(formidable());

app.listen(port, ()=> {
    console.log('Server active at port ' + port)
})

app.use(express.static('public'));

const time =  require('./server/timetable')
app.use('/api/timetable', time);

const user =  require('./server/user')
app.use('/api/user', user);