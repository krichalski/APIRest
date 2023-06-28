const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const { success, fail } = require("../helpers/resposta");
const UsersDAO = require("../model/User");
require("dotenv").config();

function validateToken(req, res, next) { 
  const token = req.headers.authorization;
  console.log('Received token:', token); 

  if (!token) {
    return res.status(401).json(fail("Token de autenticação não fornecido"));
  }

  jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
    if (err) {
      console.log('Token verification error:', err); 
      return res.status(401).json(fail("Token de autenticação inválido"));
    }

    req.user = decoded;
    next();
  });
}

router.post("/login", async (req, res) => {
  const { login, password } = req.body;

  const user = await UsersDAO.getByLogin(login);
  if (user && user.password === password) {
    const token = jwt.sign({ login }, process.env.TOKEN_KEY, { expiresIn: '1h' });
    console.log('Generated token:', token); // Adicione esta linha para verificar o valor do token gerado
    res.json(success({ token }));
  } else {
    res.status(401).json(fail("Credenciais inválidas"));
  }
});

router.get("/", validateToken, async (req, res) => {
  let users = await UsersDAO.list();
  res.json(success(users, "list"));
});

router.get("/:id", validateToken, async (req, res) => {
  let obj = await UsersDAO.getById(req.params.id);
  if (obj) {
    res.json(success(obj));
  } else {
    res.status(500).json(fail("Não foi possível localizar o usuário"));
  }
});

router.post("/", validateToken, async (req, res) => {
  const { login, password, isAdmin } = req.body;

  try {
    let obj = await UsersDAO.save(login, password, isAdmin);
    if (obj) {
      res.json(success(obj));
    } else {
      res.status(500).json(fail("Falha ao salvar o novo usuário"));
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(fail("Erro ao salvar o novo usuário"));
  }
});

router.put("/:id", validateToken, async (req, res) => {
  const { id } = req.params;
  const { login, password, isAdmin } = req.body;

  let result = await UsersDAO.update(id, login, password, isAdmin);
  if (result) {
    res.json(success(result));
  } else {
    res.status(500).json(fail("Falha ao alterar o usuário"));
  }
});

router.delete("/:id", validateToken, async (req, res) => {
  let result = await UsersDAO.delete(req.params.id);
  if (result) {
    res.json(success(result));
  } else {
    res.status(500).json(fail("Usuário não encontrado"));
  }
});

module.exports = router;
