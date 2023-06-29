const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const { success, fail } = require("../helpers/resposta");
const CharDAO = require("../model/Char");
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
    const chars = await CharDAO.list()

    const paginatedChars = chars.slice(startIndex, endIndex)

    res.json(success(paginatedChars, "Listando"))
  } catch (error) {
    console.error(error)
    res.status(500).json(fail("Erro ao listar personagens"));
  }
})


router.get("/:id", validateToken, async (req, res) => {
  let character = await CharDAO.getById(req.params.id);
  if (character) {
    res.json(success(character));
  } else {
    res.status(500).json(fail("Não foi possível localizar o personagem"));
  }
});

router.post("/", validateToken, async (req, res) => {
  const { name, classe, nivel } = req.body;

  try {
    let character = await CharDAO.save(name, classe, nivel);
    res.json(success(character));
  } catch (error) {
    console.error(error);
    res.status(500).json(fail("Erro ao salvar o novo personagem"));
  }
});

router.put("/:id", validateToken, async (req, res) => {
  const { id } = req.params;
  const { name, classe, nivel } = req.body;

  let result = await CharDAO.update(id, name, classe, nivel);
  if (result) {
    res.json(success(result));
  } else {
    res.status(500).json(fail("Falha ao alterar o personagem"));
  }
});

router.delete("/:id", validateToken, async (req, res) => {
  let result = await CharDAO.delete(req.params.id);
  if (result) {
    res.json(success(result));
  } else {
    res.status(500).json(fail("Personagem não encontrado"));
  }
});

router.get("/quest/:name/:nome", async (req, res) => {
  const { name, nome } = req.params;

  try {
    const character = await CharDAO.getByName(name);
    if (!character) {
      return res.status(404).json(fail("Personagem não encontrado"));
    }

    const mission = await MissionDAO.getByName(nome);
    if (!mission) {
      return res.status(404).json(fail("Missão não encontrada"));
    }

    let result = "";
    if (character.nivel >= mission.nivelDificuldade) {
      result = "Seu herói completou a missão";
    } else {
      result = "Seu herói falhou";
    }

    const response = {
      result: result,
      descricao: mission.descricao
    };

    return res.json(success(response));
  } catch (error) {
    console.error(error);
    res.status(500).json(fail("Erro ao processar a requisição"));
  }
});


module.exports = router;
