/**
 * md5 加密
 * @param str
 * @returns {*}
 */
function md5(str) {
    let md5 = require('md5')
    return md5(str)
}
exports.md5 = md5

const moment = require('moment')
/**
 * 获取指定日期的时间戳，默认获取当前时间
 * @param times
 * @returns {number}
 */
function getTimestamp(times=null) {
    let timestamp = moment().unix()
    if (times != null) {
        timestamp = moment(times).unix()
    }
    return timestamp
}
exports.getTimestamp = getTimestamp

const jwt = require('jsonwebtoken')

/**
 * jwt 生成加密token
 * @param payload
 * @returns {*}
 */
function jwtSign(payload) {
    return jwt.sign(payload, global.config.jwt_secret)
}
exports.jwtSign = jwtSign

/**
 * jwt 解密token
 * @param token
 * @returns {*}
 */
function jwtVerify(token) {
    return jwt.verify(token, global.config.jwt_secret)
}
exports.jwtVerify = jwtVerify