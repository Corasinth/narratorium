const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');

class User extends Model {
    /**
     * Compares a plain text password against this User's encrypted password.
     * 
     * @param {string} loginPw   The plain text password
     * @returns {boolean}        true if `loginPw` matches, false otherwise
     */
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password);
    }
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        // User's username - must be unique
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            unique: true,
        },
        // User's email - must be unique and a valid email
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        // User's password - must be longer than 8 characters
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [8],
            },
        },
        // Number of characters a User has left for submissions
        character_limit: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        // Number of words a User has left for deletions
        delete_limit: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        // Timestamp the User last logged in
        last_logged_in: {
            type: DataTypes.DATE,
        }
    },
    {
        // hooks for hashing passwords before inserting into the database
        hooks: {
            beforeCreate: async (newUserData) => {
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData;
            },
            beforeUpdate: async (updatedUserData) => {
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;
            },
        },
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'user',
    }
);

module.exports = User;
