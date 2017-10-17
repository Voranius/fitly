// model definition of 'transaction' table in 'fitlydb' database
module.exports = function(database, Sequelize) {
    // 'transaction' is the same name as the SQL table
    var Transaction = database.define('transaction', {
        // map everything here just like it is on table 'transaction'
            id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            class_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                references: {
                    model: 'Class',
                    key: 'id'
                }
            },
            client_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                references: {
                    model: 'Person',
                    key: 'id'
                }
            },
            trainer_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                references: {
                    model: 'Person',
                    key: 'id'
                }
            },
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
            // 'transaction' is the table name on the 'fitlydb' database
            tableName: 'transaction',
            // Allow timestamp attributes (updatedAt, createdAt)
            // By default, added to know when db entry added & last updated
            timestamps: true
        }
    );
    return Transaction;
};