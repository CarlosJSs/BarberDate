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

//  Solicitar una cita
//    /api/citas/request
router.post ('/request', async (req, res) => {
  // Definir el cuerpo de la info
  const {
    nombre,
    fecha,
    hora,
    barberoID,
    clienteID,
    coments
  } = req.body

  // Agregar el nuevo admin
  await citasCollection.add({
    nombre,
    fecha,
    hora,
    barberoID,
    clienteID,
    coments,
    status: 'pending',
  })

  // Mandar el mensaje de resultado OK
  res.status(201).json({
    message: 'success'
  })
})

//  Aprobar, Negar o Terminar una cita
//    /api/citas/status/:id
router.put ('/status/:id', async (req, res) => {
  try {
    const citaID = req.params.id
    const updateCita = req.body

    const myCita = await citasCollection.doc(citaID).get()
    if (!myCita.exists) {
      return res.status(401).json({
        message: 'error, la cita no se encuentra'
      })
    }

    await citasCollection.doc(citaID).set(updateCita, {
      merge: true
    })

    res.status(200).json({
      message: 'success',
      id: citaID,
      ...updateCita
    })
  } catch (error) {
    res.status(400).json({
      error: 'No se puede actualizar la cita mediante el ID ' + error
    })
  }
})

//  Eliminar una cita por ID
//    /api/citas/:id
router.delete ('/:id', async (req, res) => {
  try {
    const citaID = req.params.id

    const myCita = await citasCollection.doc(citaID).get()
    if(!myCita.exists){
      return res.status(401).json({
        message: 'error, la cita no se encuentra'
      })
    }

    await citasCollection.doc(citaID).delete()
    res.status(200).json({
      message: 'La cita fue borrada con exito'
    })
  } catch (error) {
    res.status(400).json({
      error: 'No se puede borrar la cita mediante el ID'
    })
  }
})

// Obtener citas por clienteID
//    /api/citas/cliente/:clienteID
router.get('/cliente/:clienteID', async (req, res) => {
  const clienteID = req.params.clienteID

  try {
    const snapshot = await citasCollection.where('clienteID', '==', clienteID).get()

    if (snapshot.empty) {
      return res.status(404).json({
        message: 'No se encontraron citas para este cliente'
      })
    }

    const citas = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    res.status(200).json({
      message: 'success',
      citas
    })
  } catch (error) {
    console.error('Error obteniendo citas:', error)
    res.status(500).json({
      message: 'Error del servidor al obtener citas',
      error: error.message
    })
  }
})

// Obtener citas por barberoID
//    /api/citas/barbero/:barberoID
router.get('/barbero/:barberoID', async (req, res) => {
  const barberoID = req.params.barberoID

  try {
    const snapshot = await citasCollection.where('barberoID', '==', barberoID).get()

    if (snapshot.empty) {
      return res.status(404).json({
        message: 'No se encontraron citas para este barbero'
      })
    }

    const citas = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    res.status(200).json({
      message: 'success',
      citas
    })
  } catch (error) {
    console.error('Error obteniendo citas:', error)
    res.status(500).json({
      message: 'Error del servidor al obtener citas',
      error: error.message
    })
  }
})

export default router