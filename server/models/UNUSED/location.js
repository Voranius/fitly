// model definition of 'location' table in 'fitlydb' database
module.exports = function(database, Sequelize) {
    // 'location' is the same name as the SQL table
    var Location = database.define('location', {
        // map everything here just like it is on table 'location'
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
            address1: {
                type: Sequelize.STRING(45),
                allowNull: false,
                charset: 'utf8',
                collate: 'utf8_unicode_ci'
            },
            address2: {
                type: Sequelize.STRING(45),
                allowNull: true,
                charset: 'utf8',
                collate: 'utf8_unicode_ci'
            },
            postcode: {
                type: Sequelize.STRING(6),
                allowNull: true,
                charset: 'utf8',
                collate: 'utf8_unicode_ci'
            },
            neighbourhood: {
                type: Sequelize.STRING(20),
                allowNull: true,
                charset: 'utf8',
                collate: 'utf8_unicode_ci'
            },
            longtitude: {
                type: Sequelize.DECIMAL(9,6),
                allowNull: true
            },
            latitude: {
                type: Sequelize.DECIMAL(9,6),
                allowNull: true
            }
        }, {
            freezeTableName: true,
            // 'location' is the table name on the 'fitlydb' database
            tableName: 'location',
            // Allow timestamp attributes (updatedAt, createdAt)
            // By default, added to know when db entry added & last updated
            timestamps: false,
            paranoid: true

        }
    );
    return Location;
};