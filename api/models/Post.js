module.exports = {
  attributes: {
    content: {
      type: Sequelize.STRING(767),
      allowNull: true,
    },
  },
  associations() {
    Topic.hasMany(Post);
    Post.belongsTo(Topic);

    Post.belongsTo(Member);
    Member.hasMany(Post);
  },
  options: {
    onDelete: 'cascade',
    paranoid: true,
    timestamps: true,
    classMethods: {
      ...sails.config.models.classMethods.Post,
    },
    instanceMethods: {
      ...sails.config.models.instanceMethods.Post,
    },
    hooks: {
      ...sails.config.models.hooks.Post,
    },
  },
};
