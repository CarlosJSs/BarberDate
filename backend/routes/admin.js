import express from 'express'
import bcrypt from 'bcryptjs'
import FBadmin from 'firebase-admin'
import serviceAccount from '../config/firebaseServiceAccount.json' assert { type: 'json' }
import { verifyToken, generateToken } from './auth.js'

// Inicializar firebase
FBadmin.initializeApp({
  credential: FBadmin.credential.cert(serviceAccount)
})

// Acceder al realizar peticiones
const router = express.Router()

// Obtener la DB
const db = FBadmin.firestore()
const adminCollection = db.collection('admin')

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

// Login Admin
router.post('/login', async (req, res) => {
  const { usuario, password } = req.body
  const findUser = await adminCollection.where('usuario', '==', usuario).get()

  if(findUser.empty){
    return res.status(400).json({
      error: 'El usuario No Existe'
    })
  }

  const adminDoc = findUser.docs[0]
  const admin = adminDoc.data()

  const validaPassword = await bcrypt.compare(password, admin.password)

  if(!validaPassword){
    return res.status(400).json({
      error: 'Contraseña invalida'
    })
  }

  const token = generateToken({
    id: adminDoc.id,
    usuario: admin.usuario
  })

  res.status(201).json({
    token
  })
})

// Obtener todos los admins
//    /api/admin/all
router.get('/all', authenticateToken, async(req, res) => {
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
router.post ('/create', authenticateToken, async (req, res) => {

  // Definir el cuerpo de la info
  const {
    nombre,
    usuario,
    password
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
    password: passHashed
  })

  // Mandar el mensaje de resultado OK
  res.status(201).json({
    message: 'success'
  })
})

export default router