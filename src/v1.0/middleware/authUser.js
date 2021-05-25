'use strict'

const jwt = require('jsonwebtoken')

exports.handle = async (req, authorization) => {
    try {
        req.token = await jwt.verify(authorization, global.config.jwt_secret)
        return {status:1}
    } catch (err) {
        return {status:0, msg:err.message}
    }
}