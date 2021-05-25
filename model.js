const {Sequelize, Op, DataTypes} = require('sequelize')

// 读取数据库配置
const db = global.config.db.mysql_db

const sequelize = new Sequelize({
    database: db.database,
    username: db.username,
    password: db.password,
    host: db.host,
    port: db.port,
    dialect: db.dialect,
    define: {
        // 关闭时间戳
        timestamps: false
    },
    pool: {
        max: 5,
        min: 1,
        idle: 10000
    },
})

class Model {
    constructor(name) {
        let fun = require('./models/' + name + '.js')
        let m = fun(sequelize, DataTypes)
        m.Op = Op
        return m
    }
}

module.exports =  () => {
    return Model
}