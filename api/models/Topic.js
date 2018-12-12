module.exports = {
  attributes: {

    title: {
      type: Sequelize.STRING(190),
      allowNull: true,
    },

    content: {
      type: Sequelize.STRING(767),
      allowNull: true,
    },
  },
  associations() {
    Topic.belongsTo(Member);
    Member.hasMany(Topic);
  },
  options: {
    onDelete: 'cascade',
    paranoid: true,
    timestamps: true,
    classMethods: {
      ...sails.config.models.classMethods.Topic,
    },
    instanceMethods: {
      ...sails.config.models.instanceMethods.Topic,
    },
    hooks: {
      ...sails.config.models.hooks.Topic,
    },
  },
};
