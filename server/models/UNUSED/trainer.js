// model definition of 'trainer' table in 'fitlydb' database
module.exports = function(database, Sequelize) {
    // 'trainer' is the same name as the SQL table
    var Trainer = database.define('trainer', {
        // map everything here just like it is on table 'trainer'
            id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            status: {
                type: Sequelize.INTEGER(1),
                allowNull: true,
                defaultValue: 0
            },
            person_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                references: {
                    model: 'Person',
                    key: 'id'
                }
            },
            // a user can be accorded roles at different stages of use
            // a trainer today may want to sign up for classes as a client tomorrow
            createdAt: {
                type: Sequelize.DATE,
                allowNull: true
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: true
            },
            deletedAt: {
                type: Sequelize.DATE,
                allowNull: true
            }
        }, {
            freezeTableName: true,
            // 'trainer' is the table name on the 'fitlydb' database
            tableName: 'trainer',
            // Allow timestamp attributes (updatedAt, createdAt)
            // By default, added to know when db entry added & last updated
            timestamps: true
        }
    );
    return Trainer;
};