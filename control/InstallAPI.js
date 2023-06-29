const express = require("express");
const router = express.Router();
const sequelize = require("../helpers/bd");
require("dotenv").config();
const jwt = require('jsonwebtoken');
const { fail, success } = require("../helpers/resposta");

const UserModel = require('../model/User');
const CharModel = require('../model/Char');
const MissionModel = require('../model/Mission');
const EquipModel = require('../model/Equip');
const SkillModel = require('../model/Skill');




router.get('/', async (req, res) => {
  await sequelize.sync({ force: true });

  let users = [
    { login: "admin", password: "admin", isAdmin: true},
    { login: "user1", password: "password2", isAdmin: false},
    { login: "user2", password: "password2", isAdmin: false },
    { login: "user3", password: "password3", isAdmin: false },
    { login: "user4", password: "password4", isAdmin: false },
    { login: "user5", password: "password5", isAdmin: false },
    { login: "user6", password: "password6", isAdmin: false }
  ];
  

  let characters = [
    { name: "Rufus Maximos", classe: "Barbaro", nivel: 10 },
    { name: "Adrian Rivolus", classe: "Bardo", nivel: 100 },
    { name: "Joe Silvian", classe: "Guerreiro", nivel: 15 },
    { name: "Noxus Tristen", classe: "Bruxo", nivel: 5 },
    { name: "Boris Lets", classe: "Ladino", nivel: 8 },
    { name: "Lissandra Aqua", classe: "Mago", nivel: 9 }
  ];

  let missions = [
    { nome: "Orcs", descricao: "Uma batalha contra orcs", nivelDificuldade: 7 },
    { nome: "Castelo", descricao: "Invadir o castelo", nivelDificuldade: 10 },
    { nome: "Taverna", descricao: "Roubar a bebida secreta da taverna", nivelDificuldade: 3 },
    { nome: "MagoTerrom", descricao: "Batalha contra um mago maligno", nivelDificuldade: 12 },
    { nome: "Goblin", descricao: "Matar goblins", nivelDificuldade: 2 }
  ];

  let equips = [
    { name: "Espada Longa", personagem: "Rufus Maximos" },
    { name: "Varinha Mágica", personagem: "Adrian Rivolus" },
    { name: "Arco e Flecha", personagem: "Joe Silvian" },
    { name: "Livro de Feitiços", personagem: "Noxus Tristen" },
    { name: "Adaga Envenenada", personagem: "Boris Lets" },
    { name: "Cajado Arcano", personagem: "Lissandra Aqua" }
  ];

  let skills = [
    { name: "Ataque Físico", descript: "Ataque físico básico", personagem: "Rufus Maximos" },
    { name: "Curar", descript: "Habilidade de cura", personagem: "Adrian Rivolus" },
    { name: "Flecha Flamejante", descript: "Dispara flechas em chamas", personagem: "Joe Silvian" },
    { name: "Bola de Fogo", descript: "Lança uma bola de fogo", personagem: "Noxus Tristen" },
    { name: "Golpe Sorrateiro", descript: "Ataque furtivo com adaga", personagem: "Boris Lets" },
    { name: "Raio de Gelo", descript: "Lança um raio de gelo", personagem: "Lissandra Aqua" }
  ];

  try {
    let createdUsers = [];
    for (let i = 0; i < users.length; i++) {
      let { login, password, isAdmin } = users[i];
      let createdUser = await UserModel.save(login, password, isAdmin);
      createdUsers.push(createdUser);
    }

    let createdCharacters = [];
    for (let i = 0; i < characters.length; i++) {
      let { name, classe, nivel } = characters[i];
      let createdChar = await CharModel.save(name, classe, nivel);
      createdCharacters.push(createdChar);
    }

    let createdMissions = [];
    for (let i = 0; i < missions.length; i++) {
      let { nome, descricao, nivelDificuldade } = missions[i];
      let createdMission = await MissionModel.save(nome, descricao, nivelDificuldade);
      createdMissions.push(createdMission);
    }

    let createdEquips = [];
    for (let i = 0; i < equips.length; i++) {
      let { name, personagem } = equips[i];
      let createdEquip = await EquipModel.save(name, personagem);
      createdEquips.push(createdEquip);
    }

    let createdSkills = [];
    for (let i = 0; i < skills.length; i++) {
      let { name, descript, personagem } = skills[i];
      let createdSkill = await SkillModel.save(name, descript, personagem);
      createdSkills.push(createdSkill);
    }

    res.json({
      users: createdUsers,
      characters: createdCharacters,
      missions: createdMissions,
      equips: createdEquips,
      skills: createdSkills
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar o install" });
  }
});

module.exports = router;
