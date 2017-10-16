// model definition of 'qualifications' table in 'fitness' database
module.exports = function(database, Sequelize) {
    // 'qualifications' is the same name as the SQL database
    var Qualification = database.define('qualifications', {
        // map everything here just like it is on SQL 'qualifications'
            q_code: {
                type: Sequelize.STRING(5),
                primaryKey: true,
                allowNull: false
            },
            q_name: {
                type: Sequelize.STRING(64),
                allowNull: false,
                charset: 'utf8',
                collate: 'utf8_unicode_ci'
            }
        }, {
            freezeTableName: true,
            // 'qualifications' is the table name on the 'fitness' database
            tableName: 'qualifications',
            // Allow timestamp attributes (updatedAt, createdAt)
            // By default, added to know when db entry added & last updated
            timestamps: false
        }
    );
    return Qualification;
};