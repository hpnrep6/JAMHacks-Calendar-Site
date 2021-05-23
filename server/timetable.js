const mongoose = require('mongoose');
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const counter = require('./utils/counter')
const schema = require('./models/timetable')
const sanitise = require('./utils/sanitise')
const verify = require('./utils/verify')

const router = express.Router();

function error(res, message = '') {
    res.send('error: ' + message)
}

router.get('/get/:id', async (req, res) => {
    try {
        let id = parseInt(req.params.id.toString());

        let timetable = await schema.timetable.findById(id);

        res.status(200).json(timetable);
    } catch(e) {
        return error(res);
    }
})

router.post('/new', verify, async (req, res) => {
    try {
        let user = req.user.name;

        let name = req.fields.name;
       
        counter.countUp(process.env.TIMETABLE_COUNTER).then(count => {
            if(!count) {
                res.send('error')
                return
            }
            
            const table = new schema.timetable({
                _id: count,
                name: name,
                user: user
            })

            table.save().then(result => {
                res.status(200).json({
                    id: count,
                    message: 'Timetable created'
                })
            }).catch(err => {
                console.log(err)
                res.status(500).json({
                    message: 'Failed creating timetable'
                })
                return
            })
        }).catch(err => {
            res.send('error')
            console.log(err)
            return
        })
        
    } catch(e) {
        console.log(e);
        return error(res);
    }
})

router.post('/update/:id', verify, async (req, res) => {
    try {
        let id = parseInt(req.params.id.toString());

        let timetable = await schema.timetable.findById(id);

        // if(timetable.user != req.user.name) {
        //     res.status(404).json({
        //         message: 'Timetable does not belong to user'
        //     })
        //     return;
        // }

        let eventId = parseInt(req.fields.eventID.toString());
        let name = req.fields.name.toString();
        let desc = '';
        let start = parseInt(req.fields.start_time.toString())
        let end = parseInt(req.fields.end_time.toString())
        let mode = parseInt(req.fields.mode.toString());
        let day = parseInt(req.fields.day.toString())

        name = sanitise(name)

        switch(mode) {
            case 0:
                for(let i = 0; i < timetable.events.length; i++) {
                    let idCur = timetable.events[i]._id;
                    if(idCur == eventId) {

                        let ev = timetable.events[i];

                        ev.name = name;
                        ev.start = start;
                        ev.end = end;
                        ev.day = day;
                        
                        timetable.save().then(() => {
                            res.status(200).json(timetable)
                            return
                        }).catch(err => {
                            console.log(err)
                            res.send('error')
                        })
                        return;
                    }
                }
                // event id < 0 = add new event
                {
                    counter.countUp(process.env.EVENT_COUNTER).then(count => {
                        if(!count) {
                            res.send('error')
                            return
                        }
                        const event = new schema.event({
                            _id: count,
                            name: name,
                            description: desc,
                            start: start,
                            end: end,
                            day: day
                        })

                        timetable.events.push(event);
                        
                        timetable.save().then(() => {
                            res.status(200).json(timetable)
                            return
                        }).catch(err => {
                            console.log(err)
                            res.send('error')
                        })

                    }).catch(error => {
                        console.log(error)
                        res.send(error)
                        return
                    })
                }
                break;
            case 1:
                let found = false;
                for(let i = 0; i < timetable.events.length; i++) {
                    let idCur = timetable.events[i]._id;
                    if(idCur == eventId) {
                        timetable.events.splice(i, 1);

                        timetable.save().then(() => {
                            res.status(200).json(timetable)
                            return
                        }).catch(err => {
                            console.log(err)
                            res.send('error')
                        })
                        return;
                    }
                }
                res.status(404).json({
                    message: 'Event not found'
                })
        }
    } catch(e) {
        return error(res);
    }
});

module.exports = router;