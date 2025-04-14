// models/SpecialistAvailability.js
import connection from '../db/connection.js';  // Your Sequelize connection
import Sequelize from 'sequelize';

const SpecialistAvailability = connection.define('SpecialistAvailability', {
    specialist_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'specialists', // Assuming the specialist table already exists
            key: 'specialist_id', // Reference the `specialist_id` field in specialists table
        },
        onDelete: 'CASCADE',
    },
    enabled:{
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: true
    },
    day: {
        type: Sequelize.STRING, // Use a string like "Mon, Tue, Wed" or a JSON array
        allowNull: false,
    },
    start_time: {
        type: Sequelize.TIME,
        allowNull: true,
    },
    end_time: {
        type: Sequelize.TIME,
        allowNull: true,
    },
}, {
    tableName: 'specialist_availabilities',
    timestamps: false,
    indexes: [
        {
          unique: true,
          fields: ['specialist_id', 'day']  // Ensure uniqueness of the combination of specialityId and day
        }
      ]
});

export default SpecialistAvailability;
