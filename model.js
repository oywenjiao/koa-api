const {Sequelize, Op, DataTypes} = require('sequelize')

const sequelize = new Sequelize({
    database: 'demo',
    username: 'root',
    password: 'root',
    host: '127.0.0.1',
    dialect: 'mysql',
    define: {
        timestamps: false
    }
})

class Model {
    constructor(name) {
        let fun = require('./models/' + name + '.js')
        return fun(sequelize, DataTypes)
    }
}

module.exports =  () => {
    return new Promise((resolve, reject) => {
        Model.Op = Op
        resolve(Model)
    })
}