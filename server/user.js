const mongoose = require('mongoose');
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const counter = require('./utils/counter')
const userSchema = require('./models/user')
const sanitise = require('./utils/sanitise')

const router = express.Router();

function error(res, message = '') {
    res.status(500).json( {
        message: 'Error: ' + message
    })
}
// router.get('/get/:id', async (req, res) => {
//     try{
//         let id = req.params.id.toString()
//         let int = parseInt(id);

//         let table = await 
//     } catch(e) {
//         res.send(e);
//     }
// })

router.post('/new', async (req,res) => {
    try{
        let password = req.fields.password.toString();
        let username = req.fields.username.toString();
        
        username = sanitise(username)

        await userSchema.findOne({username: username}, async(err, found) =>{
            if(err) {
                res.status(500).json( {
                    message: 'Error: ' + err
                })
            }
            if(found) {
                res.status(401).json({
                    message: 'User already exists.'
                })
                return;
            }

            await bcrypt.hash(password, 7, (error, hash) => {
                if(error) {
                    res.status(500).json( {
                        message: 'Error: ' + error
                    })
                    return;
                }

                counter.countUp(process.env.USER_COUNTER).then(count => {
                    const user = new userSchema({
                        _id: count,
                        name: username,
                        password: hash
                    })
                    
                    user.save().then(result => {
                        res.status(200).json({
                            message: 'User registered!'
                        })
                    }).catch(errorr => {
                        res.status(500).json( {
                            message: 'Error: ' + errorr
                        })
                    })
                })
            })

        })
    } catch(error) {
        res.status(500).json( {
            message: 'Error: ' + error
        })
    }
})

router.post('/login', async (req, res) => {
    try {
        let username;
        let password;

        if(!req) {
            error(res);
            return;
        }

        if(!req.fields) {
            return error(res);
        }

        // if(!req.body) {
        //     return error(res)
        // }

        username = req.fields.username.toString();
        password = req.fields.password.toString();

        username = sanitise(username);

        await userSchema.findOne({name: username}, (err, user) => {
            if(err) {
                res.status(500).json( {
                    message: 'Error: ' + error
                })
                return;
            } 
            if(!user) {
                return res.status(404).json({
                    message:'User not found.'});
            }
            bcrypt.compare(password, user.password, (e, resp) => {
                if(e) {
                    res.status(500).json( {
                        message: 'Error: ' + error
                    })
                    return;
                }

                if(resp) {
                    const token = jwt.sign({
                        uid: user._id
                    }, process.env.TOKEN, {
                        expiresIn: "7d"
                    });
                    res.status(200).json({
                        message: 'Signed in!',
                        token: token
                    })
                } else {
                    res.status(401).json( {
                        message: 'Incorrect password!'
                    })
                    return;
                }
            })
        })
    } catch(e) {
        res.status(500).json( {
            message: 'Error: ' + error
        })
        return;
    }
})

module.exports = router;