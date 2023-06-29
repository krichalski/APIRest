const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const { success, fail } = require("../helpers/resposta");
const UsersDAO = require("../model/User");
require("dotenv").config();

function checkAdmin(req, res, next) {
  const { isAdmin } = req.user;

  console.log('isAdmin:', isAdmin); // Adicionando console.log para verificar o valor de isAdmin

  if (isAdmin) {
    next();
  } else {
    res.status(403).json(fail("Acesso negado. O usuário não é um administrador."));
  }
}


function validateToken(req, res, next) {
  const token = req.headers.authorization;
  console.log('Received token:', token);

  if (!token) {
    return res.status(401).json(fail("Token de autenticação não fornecido"));
  }

  jwt.verify(token, process.env.TOKEN_KEY, async (err, decoded) => {
    if (err) {
      console.log('Token verification error:', err);
      return res.status(401).json(fail("Token de autenticação inválido"));
    }

    try {
      
      const user = await UsersDAO.getByLogin(decoded.login);

      if (!user) {
        return res.status(401).json(fail("Usuário não encontrado"));
      }

      
      req.user = {
        id: user.id,
        login: user.login,
        isAdmin: user.isAdmin
        // Adicione outras propriedades do usuário conforme necessário
      };

      next();
    } catch (error) {
      console.error(error);
      return res.status(500).json(fail("Erro ao obter informações do usuário"));
    }
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

router.get("/", validateToken,checkAdmin, async (req, res) => {
  let users = await UsersDAO.list();
  res.json(success(users, "listando"));
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
