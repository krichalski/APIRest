const { DataTypes } = require('sequelize');
const sequelize = require('../helpers/bd');

const UserModel = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  login: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    
  },
});

module.exports = {
  list: async function() {
    const users = await UserModel.findAll();
    return users;
  },

  save: async function(login, password, isAdmin) {
    const user = await UserModel.create({
      login: login,
      password: password,
      isAdmin: isAdmin,
    });
    return user;
  },

  update: async (id, login, password, isAdmin) => {
    const user = await UserModel.findByPk(id);
    if (!user) {
      return false;
    }

    await user.update({
      login: login,
      password: password,
      isAdmin: isAdmin,
    });

    return user;
  },

  delete: async function(id) {
    return await UserModel.destroy({ where: { id: id } });
  },

  getById: async function(id) {
    return await UserModel.findByPk(id);
  },

  getByLogin: async function(login) {
    return await UserModel.findOne({ where: { login: login } });
  },

  Model: UserModel

};
