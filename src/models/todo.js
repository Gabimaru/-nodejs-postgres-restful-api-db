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
            unique: true,
            //autoIncrement: true,
        },
        task: {
            type: DataTypes.TEXT,
            // unique: true,
            allowNull: false,
        },
        done: {
            type: DataTypes.BOOLEAN,
            defaultValue: null,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    })

    return Todo
}
