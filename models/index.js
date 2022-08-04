const User = require('./user')
const Story = require('./story')
const Submission = require('./submission')

User.hasMany(Submission, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

Submission.belongsTo(User, {
  foreignKey: 'user_id'
});

Submission.belongsTo(Story, {
  foreignKey: 'story-id',
  onDelete: 'CASCADE'
})

Story.hasMany(Submission, {
  foreignKey: 'story_id',
  onDelete: 'CASCADE'
});

module.exports = { User, Story, Submission };