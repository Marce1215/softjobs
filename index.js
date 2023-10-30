const express = require('express')
const app = express()
const cors = require('cors')
const jwt = require("jsonwebtoken")
const { muestraUsuario, verificarCredenciales, registrarUsuario } = require('./consultas')

app.listen(3001, console.log("SERVER ON"))
app.use(cors())
app.use(express.json())



app.get("/usuario/:id", async (req, res) => {
    try {
        const { id } = req.params
        const Authorization = req.header("Authorization")
        const token = Authorization.split("Bearer ")[1]
        jwt.verify(token, "az_AZ")
        const { email } = jwt.decode(token)
        await muestraUsuario(id)

        //const usuario = await muestraUsuario(id)
        //res.json(usuario)
        res.send(`El usuario ${email} ha sido encontrado  id ${id}`)
    } catch (error) {
        res.status(error.code || 500).send(error)
    }
})

app.post("/usuarios", async (req, res) => {
    try {
        const usuario = req.body
        await registrarUsuario(usuario)
        res.send("Usuario creado con éxito")
    } catch (error) {
        res.status(500).send(error)
    }
})

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        await verificarCredenciales(email, password)
        const token = jwt.sign({ email }, "az_AZ")
        res.send(token)
    } catch (error) {
        console.log(error)
        res.status(error.code || 500).send(error)
    }
})



