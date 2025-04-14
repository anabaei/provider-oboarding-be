import connection from '../db/connection.js';  // Your Sequelize connection
import Sequelize from 'sequelize';
import Clinic from './Clinic.js';  // Assuming Clinic model exists

// Define the Specialist model
const Specialist = connection.define('Specialist', {
    specialist_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    phone: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true,  // Ensures it's a valid email format
        }
    },
    image: {
        type: Sequelize.STRING,  // Assuming URL for image
        allowNull: true,
    },
    clinic_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'clinics',  // The referenced table name
            key: 'clinic_id',  // The referenced column
        },
        onDelete: 'CASCADE', // If the associated clinic is deleted, delete the specialist
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
    tableName: 'specialists',  // Ensure the table name matches
    timestamps: false,         // Disable auto timestamps if you manage them manually
});

// Define the relationship between Specialist and Clinic (foreign key)
Specialist.belongsTo(Clinic, {
    foreignKey: 'clinic_id',   // FK in Specialist table
    onDelete: 'CASCADE',       // Action when the clinic is deleted
});

// Sync the model with the database
// sequelize.sync();  // Uncomment this line to sync

export default Specialist;
