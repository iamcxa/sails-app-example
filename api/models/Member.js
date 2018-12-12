module.exports = {
  attributes: {

    nickname: {
      type: Sequelize.STRING(127),
      allowNull: false,
    },
  },
  associations() {
  },
  options: {
    paranoid: true,
    timestamps: true,
    classMethods: {
      ...sails.config.models.classMethods.Member,
    },
    instanceMethods: {
      ...sails.config.models.instanceMethods.Member,
    },
    hooks: {
      ...sails.config.models.hooks.Member,
    },
  },
};
