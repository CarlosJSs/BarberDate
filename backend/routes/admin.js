import express from 'express'
import bcrypt from 'bcryptjs'
import FBadmin from 'firebase-admin'
import { verifyToken, generateToken } from './auth.js'

// Acceder al realizar peticiones
const router = express.Router()

// Obtener la DB
const db = FBadmin.firestore()
const adminCollection = db.collection('admin')
const barberCollection = db.collection('barbero')

// Middleware
function authenticateToken(req, res, next){
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if(!token){
    return res.status(401).json({
      message: 'No autorizado'
    })
  }

  try {
    const user = verifyToken(token)
    req.user = user
    next()
  } catch (error) {
    res.sendStatus(403)
  }
}

// ------------- ENDPOINTS del ADMIN ------------------

//----------------- Acciones sobre los admins ------------------
// Obtener todos los admins
//    /api/admin/all
router.get('/all', async(req, res) => {
  const collAdmin = await adminCollection.get()
  const admin = collAdmin.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }))

  res.status(201).json({
    message: 'success',
    admin
  })
})

// Crear un admin
//    /api/admin/create
router.post ('/create', async (req, res) => {

  // Definir el cuerpo de la info
  const {
    nombre,
    usuario,
    password,
    rol
  } = req.body

  // Validar usuario
  const findUsuario = await adminCollection.where('usuario', '==', usuario).get()

  if(!findUsuario.empty){
    return res.status(400).json({
      error: 'El usuario ya existe'
    })
  }

  // Encriptar contraseña
  const passHashed = await bcrypt.hash(password, 10)

  // Agregar el nuevo admin
  await adminCollection.add({
    nombre,
    usuario,
    password: passHashed,
    rol
  })

  // Mandar el mensaje de resultado OK
  res.status(201).json({
    message: 'success'
  })
})

export default router