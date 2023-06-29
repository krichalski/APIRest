const express = require("express")
const router = express.Router()
const jwt = require('jsonwebtoken')
const { success, fail } = require("../helpers/resposta")
const EquipDAO = require("../model/Equip")
require("dotenv").config()


function validateToken(req, res, next) {
    const token = req.headers.authorization
    console.log('Received token:', token)
  
    if (!token) {
      return res.status(401).json(fail("Token de autenticação não fornecido"))
    }
  
    jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
      if (err) {
        console.log('Token verification error:', err);
        return res.status(401).json(fail("Token de autenticação inválido"))
      }
  
      req.user = decoded
      next()
    })
  }



  router.get("/", validateToken,  async (req, res) => {
    const limite = parseInt(req.query.limite) 
    const pagina = parseInt(req.query.pagina) 
  
    const startIndex = (pagina - 1) * limite
    const endIndex = pagina * limite
  
    try {
      const users = await UsersDAO.list()
  
      const paginatedUsers = users.slice(startIndex, endIndex)
  
      res.json(success(paginatedUsers, "Listando"))
    } catch (error) {
      console.error(error)
      res.status(500).json(fail("Erro ao listar usuários"));
    }
  })
  

router.get("/:id", (req, res) => {
    EquipDAO.getById(req.params.id).then(equip => {
        res.json(success(equip));
    }).catch(err => {
        console.log(err);
        res.status(500).json(fail("Não foi possível localizar o item"));
    });
});

router.post("/", validateToken,(req, res) => {
    const { name, personagem } = req.body;

    EquipDAO.save(name, personagem).then(equip => {
        res.json(success(equip));
    }).catch(err => {
        console.log(err);
        res.status(500).json(fail("Falha ao salvar novo item"));
    });
});

router.put("/:id",validateToken, (req, res) => {
    const { id } = req.params;
    const { name, personagem } = req.body;

    let obj = {};
    if (name) obj.name = name;
    if (personagem) obj.personagem = personagem;

    if (Object.keys(obj).length === 0) {
        return res.status(500).json(fail("Nenhum atributo foi modificado"));
    }

    EquipDAO.update(id, obj).then(equip => {
        if (equip) {
            res.json(success(equip));
        } else {
            res.status(500).json(fail("Item não encontrado"));
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json(fail("Falha ao alterar o item"));
    });
});

router.delete("/:id", validateToken,(req, res) => {
    EquipDAO.delete(req.params.id).then(equip => {
        if (equip) {
            res.json(success(equip));
        } else {
            res.status(500).json(fail("Item não encontrado"));
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json(fail("Falha ao excluir o item"));
    });
});

module.exports = router;
