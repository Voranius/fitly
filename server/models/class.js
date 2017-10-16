// model definition of 'class' table in 'fitlydb' database
module.exports = function(database, Sequelize) {
    // 'class' is the same name as the SQL table
    var Class = database.define('class', {
        // map everything here just like it is on table 'class'
            id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: Sequelize.STRING(45),
                allowNull: false,
                charset: 'utf8',
                collate: 'utf8_unicode_ci'
            },
            details: {
                type: Sequelize.STRING(255),
                allowNull: true,
                charset: 'utf8',
                collate: 'utf8_unicode_ci'
            },
            category: {
                type: Sequelize.STRING(10),
                allowNull: true,
                charset: 'utf8',
                collate: 'utf8_unicode_ci'
            },
            creator_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                references: {
                    model: 'Trainer',
                    key: 'id'
                }
            },
            status: {
                type: Sequelize.INTEGER(1),
                allowNull: true
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
            // 'class' is the table name on the 'fitlydb' database
            tableName: 'class',
            // Allow timestamp attributes (updatedAt, createdAt)
            // By default, added to know when db entry added & last updated
            timestamps: true,
            paranoid: true
        }
    );
    return Class;
};