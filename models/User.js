// models/User.js
import connection from '../db/connection.js';  // Your Sequelize connection
import Sequelize from 'sequelize';
import Post from './Post.js';  // Assuming the Post model is defined

// Define the User model
const User = connection.define('User', {
    user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    type: {
        type: Sequelize.ENUM('admin', 'client'),
        allowNull: false,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false,
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true,  // Ensures it's a valid email format
        },
    },
    phone: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    clinic_id: {
        type: Sequelize.INTEGER,
        allowNull: true,  // Clinic ID should be null for clients
        unique: false,
    },
    created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
    },
    updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
    }
}, {
    tableName: 'users',
    timestamps: false,  // Disable auto timestamps if you manage them manually
});

// Define a relationship to the Post model
User.hasMany(Post, { 
    foreignKey: { 
        allowNull: false 
    }, 
    onDelete: 'CASCADE' 
});

// Sync the model with the database
// sequelize.sync();  // Uncomment this line to sync

export default User;