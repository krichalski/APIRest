const express = require("express");
const router = express.Router();
const sequelize = require("../helpers/bd");

const UserModel = require('../model/User');
const CharModel = require('../model/Char');

router.get('/', async (req, res) => {
  await sequelize.sync({ force: true });

  let users = [
    { login: "teste", password: "teste", isAdmin: true },
    { login: "Gustavo", password: "leozinho123", isAdmin: false }
  ];

  let characters = [
    { name: "Personagem 1", classe: "Classe 1", nivel: 10 },
    { name: "Personagem 2", classe: "Classe 2", nivel: 20 },
    { name: "Personagem 3", classe: "Classe 3", nivel: 15 },
    { name: "Personagem 4", classe: "Classe 1", nivel: 5 },
    { name: "Personagem 5", classe: "Classe 2", nivel: 8 }
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

    res.json({ users: createdUsers, characters: createdCharacters });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar usuários e personagens" });
  }
});

module.exports = router;
