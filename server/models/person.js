// model definition of 'person' table in 'fitlydb' database
module.exports = function(database, Sequelize) {
    // 'person' is the same name as the SQL table
    var Person = database.define('person', {
        // map everything here just like it is on table 'person'
            id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            email: {
                type: Sequelize.STRING(45),
                allowNull: false,
                unique: true,
                charset: 'utf8',
                collate: 'utf8_unicode_ci'
            },
            password: {
                type: Sequelize.STRING(64),
                allowNull: false,
                charset: 'utf8',
                collate: 'utf8_unicode_ci'
            },
            firstname: {
                type: Sequelize.STRING(45),
                allowNull: false,
                charset: 'utf8',
                collate: 'utf8_unicode_ci'
            },
            lastname: {
                type: Sequelize.STRING(45),
                allowNull: false,
                charset: 'utf8',
                collate: 'utf8_unicode_ci'
            },
            gender: {
                type: Sequelize.STRING(1),
                allowNull: true,
                charset: 'utf8',
                collate: 'utf8_unicode_ci'
            },
            age: {
                type: Sequelize.INTEGER(11),
                allowNull: true,
                defaultValue: 0
            },
            id_num: {
                type: Sequelize.STRING(10),
                allowNull: true,
                charset: 'utf8',
                collate: 'utf8_unicode_ci'
            },
            id_type: {
                type: Sequelize.STRING(1),
                allowNull: true,
                charset: 'utf8',
                collate: 'utf8_unicode_ci'
            },
            role: {
                type: Sequelize.INTEGER(1), // 0: admin, 1: trainer, 2: client
                allowNull: true          
            },
            status: {
                type: Sequelize.STRING(20),
                allowNull: true,
                defaultValue: 'Active'      // Values: 'Active', 'Inactive', 'Unavailable'
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
            // 'person' is the table name on the 'fitlydb' database
            tableName: 'person',
            // Allow timestamp attributes (updatedAt, createdAt)
            // By default, added to know when db entry added & last updated
            timestamps: true,
            paranoid: true

        }
    );
    return Person;
};