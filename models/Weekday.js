import connection from '../db/connection.js';  // Your Sequelize connection
import Sequelize from 'sequelize';
import DayRange from './DayRange.js';
import Specialist from './Specialist.js'; 

const WeekDay = connection.define('WeekDay', {
  day: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  enabled: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  specialityId: {
    type: Sequelize.INTEGER,
    references: {
      model: Specialist, // This references the Speciality model
      key: 'id',         // Referencing the 'id' column of Speciality
    },
    allowNull: true, // If a WeekDay doesn't have a speciality, it's fine
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
  indexes: [
    {
      unique: true,
      fields: ['specialityId', 'day']  // Ensure uniqueness of the combination of specialityId and day
    }
  ]
});

// Relationship: WeekDay belongs to Speciality
WeekDay.belongsTo(Speciality, { foreignKey: 'specialityId', onDelete: 'SET NULL' });

// Relationship: Speciality can have many WeekDays
Speciality.hasMany(WeekDay, { foreignKey: 'specialityId' });

// Each WeekDay has many DayRanges
WeekDay.hasMany(DayRange, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

export default WeekDay;
