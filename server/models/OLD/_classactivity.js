// model definition of 'classactivity' table in 'fitness' database
module.exports = function(database, Sequelize) {
    // 'classactivity' is the same name as the SQL database
    var Classactivity = database.define('classactivity', {
        // map everything here just like it is on SQL 'classactivity'
            class_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'Class',
                    key: 'kid'
                }
            },
            activity_id: {
                type: Sequelize.STRING(5),
                primaryKey: true,
                allowNull: false,
                charset: 'utf8',
                collate: 'utf8_unicode_ci',
                references: {
                    model: 'Activity',
                    key: 'q_code'
                }
            }
        }, {
            freezeTableName: true,
            // 'userqualify' is the table name on the 'fitness' database
            tableName: 'classactivity',
            // Allow timestamp attributes (updatedAt, createdAt)
            // By default, added to know when db entry added & last updated
            timestamps: false
        }
    );
    return Classactivity;
};