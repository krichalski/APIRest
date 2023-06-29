const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const { success, fail } = require("../helpers/resposta");
const SkillDAO = require("../model/Skill");
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



router.get("/", (req, res) => {
  SkillDAO.list()
    .then((skills) => {
      res.json(success(skills, "listando"));
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(fail("Erro ao listar as habilidades"));
    });
});

router.get("/:id", validateToken,(req, res) => {
  SkillDAO.getById(req.params.id)
    .then((skill) => {
      res.json(success(skill));
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(fail("Não foi possível localizar a habilidade"));
    });
});

router.post("/", validateToken, (req, res) => {
  const { name, descript, personagem } = req.body;

  SkillDAO.save(name, descript, personagem)
    .then((skill) => {
      res.json(success(skill));
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(fail("Falha ao salvar nova habilidade"));
    });
});

router.put("/:id", validateToken, (req, res) => {
  const { id } = req.params;
  const { name, descript, personagem } = req.body;

  let obj = {};
  if (name) obj.name = name;
  if (descript) obj.descript = descript;
  if (personagem) obj.personagem = personagem;

  if (Object.keys(obj).length === 0) {
    return res.status(500).json(fail("Nenhum atributo foi modificado"));
  }

  SkillDAO.update(id, obj)
    .then((skill) => {
      if (skill) {
        res.json(success(skill));
      } else {
        res.status(500).json(fail("Habilidade não encontrada"));
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(fail("Falha ao alterar a habilidade"));
    });
});

router.delete("/:id", validateToken,(req, res) => {
  SkillDAO.delete(req.params.id)
    .then((skill) => {
      if (skill) {
        res.json(success(skill));
      } else {
        res.status(500).json(fail("Habilidade não encontrada"));
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(fail("Falha ao excluir a habilidade"));
    });
});

module.exports = router;
