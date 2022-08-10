const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Submission extends Model {}

Submission.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    // Text content of the submission
    submission: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Position of the submission relative to other words in the story
    position: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    // ID of this submission's author 
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id',
      },
    },
    // ID of the story this submission belongs to
    story_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'story',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'submission',
  }
);

module.exports = Submission;
