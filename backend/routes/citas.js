import express from 'express'
import bcrypt from 'bcryptjs'
import FBadmin from 'firebase-admin'
import { verifyToken, generateToken } from './auth.js'

// Acceder al realizar peticiones
const router = express.Router()

// Obtener la DB
const db = FBadmin.firestore()
const citasCollection = db.collection('citas')

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

//------------------- Acciones sobre las citas --------------------
//  /api/citas/all
router.get('/all', async(req, res) => {
  const collCitas = await citasCollection.get()
  const cita = collCitas.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }))

  res.status(201).json({
    message: 'success',
    cita
  })
})

// Crear una cita
//    /api/citas/create
router.post ('/create', async (req, res) => {

  // Definir el cuerpo de la info
  const {
    nombre,
    fecha,
    hora,
    barberoID,
    clienteID
  } = req.body

  // Validar cita
  const findCita = await citasCollection.where('nombre', '==', nombre).get()

  if(!findCita.empty){
    return res.status(400).json({
      error: 'El nombre de la cita ya existe'
    })
  }

  // Agregar el nuevo admin
  await citasCollection.add({
    nombre,
    fecha,
    hora,
    barberoID,
    clienteID
  })

  // Mandar el mensaje de resultado OK
  res.status(201).json({
    message: 'success'
  })
})

export default router