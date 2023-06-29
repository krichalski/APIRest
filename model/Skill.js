const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/bd");
const Char = require("./Char");

const SkillModel = sequelize.define('Skill', {
  name: DataTypes.STRING,
  descript: DataTypes.STRING,
});

SkillModel.belongsTo(Char.Model, {
  foreignKey: 'personagem',
});

Char.Model.hasMany(SkillModel, {
  foreignKey: 'personagem',
});

module.exports = {
  list: async function () {
    const skills = await SkillModel.findAll({ include: Char.Model });
    return skills;
  },
  save: async function (name, descript, personagem) {
    if (personagem instanceof Char.Model) {
      personagem = personagem.id;
    } else if (typeof personagem === 'string') {
      const obj = await Char.getByName(personagem);
      if (!obj) {
        return null;
      }
      personagem = obj.id;
    }
    const skill = await SkillModel.create({
      name: name,
      descript: descript,
      personagem: personagem,
    });
    return skill;
  },
  update: async (id, name, descript) => {
    const skill = await SkillModel.findByPk(id);
    if (!skill) {
      return false;
    }
    await skill.update({
      name: name,
      descript: descript,
    });
    return skill;
  },
  delete: async function (id) {
    return await SkillModel.destroy({ where: { id: id } });
  },
  getById: async function (id) {
    return await SkillModel.findByPk(id);
  },
  getByName: async function (name) {
    return await SkillModel.findOne({ where: { name: name } });
  },
  Model: SkillModel,
};
