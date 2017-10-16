// model definition of 'run' table in 'fitlydb' database
module.exports = function(database, Sequelize) {
    // 'run' is the same name as the SQL table
    var Run = database.define('run', {
        // map everything here just like it is on table 'run'
            id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            start_time: {
                type: Sequelize.DATE,
                allowNull: true
            },
            duration: {
                type: Sequelize.INTEGER(11),
                allowNull: true
            },
            minsize: {
                type: Sequelize.INTEGER(11),
                allowNull: true
            },
            maxsize: {
                type: Sequelize.INTEGER(11),
                allowNull: true
            },
            instructions: {
                type: Sequelize.STRING(255),
                allowNull: true,
                charset: 'utf8',
                collate: 'utf8_unicode_ci'
            },
            status: {
                type: Sequelize.INTEGER(1),
                allowNull: true
            },
            class_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                references: {
                    model: 'Class',
                    key: 'id'
                }
            },
            location_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                references: {
                    model: 'Location',
                    key: 'id'
                }
            },
            backup_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                references: {
                    model: 'Trainer',
                    key: 'id'
                }
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false
            },
            deletedAt: {
                type: Sequelize.DATE,
                allowNull: false
            }
        }, {
            // 'run' is the table name on the 'fitlydb' database
            tableName: 'run',
            // Allow timestamp attributes (updatedAt, createdAt)
            // By default, added to know when db entry added & last updated
            timestamps: true,
            paranoid: true
        }
    );
    return Run;
};