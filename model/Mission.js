const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/bd");

const MissionModel = sequelize.define("Missions", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descricao: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nivelDificuldade: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

module.exports = {
  list: async function () {
    const missions = await MissionModel.findAll();
    return missions;
  },
  save: async function (nome, descricao, nivelDificuldade) {
    const mission = await MissionModel.create({
      nome: nome,
      descricao: descricao,
      nivelDificuldade: nivelDificuldade,
    });
    return mission;
  },
  update: async (id, nome, descricao, nivelDificuldade) => {
    const mission = await MissionModel.findByPk(id);
    if (!mission) {
      return false;
    }
    await mission.update({
      nome: nome,
      descricao: descricao,
      nivelDificuldade: nivelDificuldade,
    });

    return mission;
  },
  delete: async function (id) {
    return await MissionModel.destroy({ where: { id: id } });
  },
  getById: async function (id) {
    return await MissionModel.findByPk(id);
  },
  getByName: async function (nome) {
    return await MissionModel.findOne({ where: { nome: nome } });
  },
  Model: MissionModel
};
