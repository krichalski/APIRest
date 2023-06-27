const express = require("express")
const router = express.Router()

const {success, fail} = require("../helpers/resposta")
const UsersDAO = require("../model/User")

router.get("/", async (req,res) =>{
    let users = await UsersDAO.list();
    res.json(success(users, "list"))
})

router.get("/:id", async (req, res) =>{
    let obj = await UsersDAO.getById(req.params.id)
    if (obj) res.json(success(obj))
    else res.status(500).json(fail("Não foi possivel localizar o usuário"))
})

router.post("/", async (req, res) =>{
    const {name, password, isAdmin} = req.body

    try {
        let obj = await UsersDAO.save(name, password, isAdmin)
        if(obj){
            res.json(success(obj))
        } else{
            res.status(500).json(fail("Falha ao salvar o novo usuário"));
        }
    } catch (error){
        console.error(error);
        res.status(500).json(fail("Erro ao salvar o novo usuario"));
    }
})

router.put("/:id", async(req, res) =>{
    const {id} = req.params
    const {login, password, isAdmin} = req.body

    let[result] = await UsersDAO.update
    (id, login, password,isAdmin)
    console.log(result)
    if (result)
        res.json(success(result))
        else
        res.status(500).json(fail("Falha ao alterar o usuário"))
})

router.delete("/:id", async (req, res) =>{
    let result = await UsersDAO.delete
    (req.params.id)
    if(result)
        res.json(success(result))
        else 
            res.status(500).json(fail("Usuário não encontrado"))
})

module.exports = router;