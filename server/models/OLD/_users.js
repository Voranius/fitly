// model definition of 'users' table in 'fitness' database
module.exports = function(database, Sequelize) {
    // 'fitness' is the same name as the SQL database
    var User = database.define('users', {
        // map everything here just like it is on table 'users'
            uid: {
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
            role: {
                type: Sequelize.INTEGER(1),
                allowNull: false,
                defaultValue: 1  // 0: admin, 1: trainer, 2: client
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
            status: {
                type: Sequelize.INTEGER(1),
                allowNull: false,
                defaultValue: 0 // 0: active, 1: unavailable, 2: inactive
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
            // 'users' is the table name on the 'fitness' database
            tableName: 'users',
            // Allow timestamp attributes (updatedAt, createdAt)
            // By default, added to know when db entry added & last updated
            timestamps: true,
            paranoid: true

        }
    );
    return User;
};