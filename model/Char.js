const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/bd");

const CharModel = sequelize.define("Characters", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  classe: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nivel: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

module.exports = {
  list: async function () {
    const characters = await CharModel.findAll();
    return characters;
  },
  save: async function (name, classe, nivel) {
    const character = await CharModel.create({
      name: name,
      classe: classe,
      nivel: nivel,
    });
    return character;
  },
  update: async (id, name, classe, nivel) => {
    const character = await CharModel.findByPk(id);
    if (!character) {
      return false;
    }
    await character.update({
      name: name,
      classe: classe,
      nivel: nivel,
    });

    return character;
  },

  delete: async function (id) {
    return await CharModel.destroy({ where: { id: id } });
  },

  getById: async function (id) {
    return await CharModel.findByPk(id);
  },

  getByName: async function (name) {
    return await CharModel.findOne({ where: { name: name } });
  },

  Model: CharModel    
 
};
