const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const user = require('../models/user')

async function verifyUser(req, res, next) {
    try{
        let token;

        if(req.body.token) {
            token = req.body.token;
        } else if (req.fields.token) {
            token = req.fields.token
        } else {
            res.status(500).json({
                message: 'error verifying'
            })
            return;
        }

        

        token = jwt.verify(token, process.env.TOKEN)

        let id = parseInt(token.uid);
   
        await user.findById(id, async (err, user) => {
            if(err || !user) {
                res.status(500).send('user not found')
                return
            }

            req.user = user;
            next();
        })
    } catch(err) {
        res.send(err)
    }
}

module.exports = verifyUser