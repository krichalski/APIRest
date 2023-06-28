const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const { success, fail } = require("../helpers/resposta");
const CharModel = require("../model/Char");
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

router.get("/", validateToken, async (req, res) => {
  let characters = await CharModel.list();
  res.json(success(characters, "list"));
});

router.get("/:id", validateToken, async (req, res) => {
  let character = await CharModel.getById(req.params.id);
  if (character) {
    res.json(success(character));
  } else {
    res.status(500).json(fail("Não foi possível localizar o personagem"));
  }
});

router.post("/", validateToken, async (req, res) => {
  const { name, classe, nivel } = req.body;

  try {
    let character = await CharModel.save(name, classe, nivel);
    res.json(success(character));
  } catch (error) {
    console.error(error);
    res.status(500).json(fail("Erro ao salvar o novo personagem"));
  }
});

router.put("/:id", validateToken, async (req, res) => {
  const { id } = req.params;
  const { name, classe, nivel } = req.body;

  let result = await CharModel.update(id, name, classe, nivel);
  if (result) {
    res.json(success(result));
  } else {
    res.status(500).json(fail("Falha ao alterar o personagem"));
  }
});

router.delete("/:id", validateToken, async (req, res) => {
  let result = await CharModel.delete(req.params.id);
  if (result) {
    res.json(success(result));
  } else {
    res.status(500).json(fail("Personagem não encontrado"));
  }
});

module.exports = router;
