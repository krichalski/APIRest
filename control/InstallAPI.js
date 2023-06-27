const express = require("express");
const router = express.Router();
const sequelize = require("../helpers/bd");

const UserModel = require('../model/User');

router.get('/', async (req, res) => {
    await sequelize.sync({ force: true });
  
    let users = [
      { login: "teste", password: "teste", isAdmin: true },
      { login: "Gustavo", password: "leozinho123", isAdmin: false }
    ];
  
    try {
      let createdUsers = [];
      for (let i = 0; i < users.length; i++) {
        let { login, password, isAdmin } = users[i];
        let createdUser = await UserModel.save(login, password, isAdmin);
        createdUsers.push(createdUser);
      }
  
      res.json(createdUsers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao criar usuários" });
    }
  });
  

module.exports = router