const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Story extends Model { }

Story.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    storyname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    submission_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'submission',
        key: 'id',
      },
    },
    //I think that we do not need this as it would create a many-to-many complexity that we do not need right now, but for scalability, will it hurt the project in the long run not having it?
    user_id: { //not needed now but for a stretch, story will belong to a user
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'story',
  }
);

module.exports = Story;
