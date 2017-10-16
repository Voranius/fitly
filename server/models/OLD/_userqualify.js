// model definition of 'userqualify' table in 'fitness' database
module.exports = function(database, Sequelize) {
    // 'userqualify' is the same name as the SQL database
    var Userqualify = database.define('userqualify', {
        // map everything here just like it is on SQL 'userqualify'
            user_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'User',
                    key: 'uid'
                }
            },
            qualify_id: {
                type: Sequelize.STRING(5),
                primaryKey: true,
                allowNull: false,
                charset: 'utf8',
                collate: 'utf8_unicode_ci',
                references: {
                    model: 'Qualification',
                    key: 'q_code'
                }
            }
        }, {
            freezeTableName: true,
            // 'userqualify' is the table name on the 'fitness' database
            tableName: 'userqualify',
            // Allow timestamp attributes (updatedAt, createdAt)
            // By default, added to know when db entry added & last updated
            timestamps: false
        }
    );
    return Userqualify;
};