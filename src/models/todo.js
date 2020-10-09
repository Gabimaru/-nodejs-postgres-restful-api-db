import DataTypes from 'sequelize'
export default (sequelize) => {
    const Todo = sequelize.define('todos', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        owner_id: {
            type: DataTypes.INTEGER,
        },
        task: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        done: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        date: {
            type: DataTypes.DATE,
        },
    })

    return Todo
}
