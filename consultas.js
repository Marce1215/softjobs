const { Pool } = require('pg')
const jwt = require("jsonwebtoken")
const bcrypt = require('bcryptjs')



const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'marce1215',
    database: 'softjobs',
    port: 5432, // El puerto predeterminado de PostgreSQL es 5432.
    allowExitOnIdle: true
})



const registrarUsuario = async (usuario) => {
    let { email, password,rol,lenguaje } = usuario
    const passwordEncriptada = bcrypt.hashSync(password)
    password = passwordEncriptada
    const values = [email, passwordEncriptada,rol,lenguaje]
    const consulta = "INSERT INTO usuarios values (DEFAULT, $1, $2, $3, $4)"
    await pool.query(consulta, values)
}

const verificarCredenciales = async (email, password) => {
    const values = [email]
    const consulta = "SELECT * FROM usuarios WHERE email = $1"
    const { rows: [usuario], rowCount } = await pool.query(consulta, values)
    const { password: passwordEncriptada } = usuario
    const passwordEsCorrecta = bcrypt.compareSync(password, passwordEncriptada)
    if (!passwordEsCorrecta || !rowCount)
        throw { code: 401, message: "Email o contraseña incorrecta" }
}

const muestraUsuario = async (id) => {
    const consulta = "SELECT FROM usuarios WHERE id = $1"
    const values = [id]
    const { rowCount } = await pool.query(consulta, values)
    
    if (!rowCount) throw { 
        code: 404, message: "No se encontró ningún evento con este ID" 
    }
    else {
        const { rows: [usuario] } = await pool.query(consulta, values)
        return usuario      
    }
}




module.exports = {muestraUsuario, verificarCredenciales,  registrarUsuario, verificarCredenciales }



