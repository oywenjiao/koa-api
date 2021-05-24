module.exports = function (sequelize, DataTypes) {
    return sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        password: {
            type: DataTypes.STRING(32),
            allowNull: true
        },
        create_time: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            defaultValue: '0'
        }
    }, {
        tableName: 'user'
    })
}