const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const { success, fail } = require("../helpers/resposta");
const MissionDAO = require("../model/Mission");
require("dotenv").config();

function validateToken(req, res, next) {
  const token = req.headers.authorization;
  
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

router.get("/", validateToken,  async (req, res) => {
  const limite = parseInt(req.query.limite) 
  const pagina = parseInt(req.query.pagina) 

  const startIndex = (pagina - 1) * limite
  const endIndex = pagina * limite

  try {
    const missions = await UsersDAO.list()

    const paginatedMissions = missions.slice(startIndex, endIndex)

    res.json(success(paginatedMissions, "Listando"))
  } catch (error) {
    console.error(error)
    res.status(500).json(fail("Erro ao listar usuários"));
  }
})


router.get("/:id", validateToken, async (req, res) => {
  let mission = await MissionDAO.getById(req.params.id);
  if (mission) {
    res.json(success(mission));
  } else {
    res.status(500).json(fail("Não foi possível localizar a missão"));
  }
});

router.post("/", validateToken, async (req, res) => {
  const { nome, descricao, nivelDificuldade } = req.body;

  try {
    let mission = await MissionDAO.save(nome, descricao, nivelDificuldade);
    res.json(success(mission));
  } catch (error) {
    console.error(error);
    res.status(500).json(fail("Erro ao salvar a nova missão"));
  }
});

router.put("/:id", validateToken, async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, nivelDificuldade } = req.body;

  let result = await MissionDAO.update(id, nome, descricao, nivelDificuldade);
  if (result) {
    res.json(success(result));
  } else {
    res.status(500).json(fail("Falha ao alterar a missão"));
  }
});

router.delete("/:id", validateToken, async (req, res) => {
  let result = await MissionDAO.delete(req.params.id);
  if (result) {
    res.json(success(result));
  } else {
    res.status(500).json(fail("Missão não encontrada"));
  }
});

module.exports = router;
