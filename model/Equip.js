const {DataTypes} = require("sequelize")
const sequelize = require("../helpers/bd")
const Char = require("./Char")

const EquipModel = sequelize.define('Equip',{
    name: DataTypes.STRING,
})

EquipModel.belongsTo(Char.Model,{
    foreingKey: 'personagem'
})

Char.Model.hasMany(EquipModel, {
    foreingKey: 'personagem'
})

module.exports = {
    list: async function(){
        const equips = await EquipModel.findAll({include: Char.Model})
        return equips
    },
    save: async function(name,personagem){
        if(personagem instanceof Char.Model){
            personagem = personagem.id
        } else if (typeof personagem === 'string')
        {
            obj = await Char.getByName(personagem)
            console.log(obj)
            if (!obj) {
                return null
            }
            personagem = obj.id
        }const equip = await EquipModel.create({
            name: name,
            personagem: personagem,
          
        })
        return equip
   
    },
    update: async (id, name) => {
        const equip = await EquipModel.findByPk(id);
        if (!equip) {
          return false;
        }
    
        await equip.update({
          name: name,
        
        });
    
        return equip;
      },
      delete: async function(id) {
        return await EquipModel.destroy({ where: { id: id } });
      },
    
      getById: async function(id) {
        return await EquipModel.findByPk(id);
      },
    
      getByName: async function(name) {
        return await EquipModel.findOne({ where: { name: name } });
      },
      
    
      Model: EquipModel

}