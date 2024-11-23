import express from 'express'
import bcrypt from 'bcryptjs'
import FBadmin from 'firebase-admin'
import fs from 'fs'
const serviceAccount = JSON.parse(fs.readFileSync('./config/firebaseServiceAccount.json', 'utf-8'))

// Inicializar firebase
FBadmin.initializeApp({
  credential: FBadmin.credential.cert(serviceAccount)
})

const router = express.Router()

// Importar el jsonwebtoken
import jwt from 'jsonwebtoken'
const top_secret = 'P4L4BR4_SUP3R_s3CR3T4'

// Generacion del token
export function generateToken(payload){
  return jwt.sign(payload, top_secret, {
    expiresIn: '1h'
  })
}

// Verificacion del token
export function verifyToken(token){
  return jwt.verify(token, top_secret)
}

const db = FBadmin.firestore()
const adminCollection = db.collection('admin')
const barberCollection = db.collection('barbero')
const clienteCollection = db.collection('cliente')

// ---------------------- Login General ---------------------------
router.post('/login', async (req, res) => {
  const { usuario, password } = req.body

  let user = null
  let role = null

  try {
    // Buscamos en cada collection
    let findUser = await adminCollection.where('usuario', '==', usuario).get()
    if(!findUser.empty){
      user = findUser.docs[0].data()
      role = 'admin'
    }

    if(!user){
      findUser = await barberCollection.where('usuario', '==', usuario).get()
      if(!findUser.empty){
        user = findUser.docs[0].data()
        role = 'barbero'
      }
    }

    if(!user){
      findUser = await clienteCollection.where('usuario', '==', usuario).get()
      if(!findUser.empty){
        user = findUser.docs[0].data()
        role = 'cliente'
      }
    }

    if(!user){
      return res.status(400).json({ error: 'El usuario no existe' })
    }

    const validaPassword = await bcrypt.compare(password, user.password)
    if(!validaPassword){
      return res.status(400).json({ error: 'Contraseña Invalida' })
    }

    const token = generateToken({
      id: findUser.docs[0].id,
      usuario: user.usuario,
      role
    })

    res.status(201).json({ token, role, userID: findUser.docs[0].id })
  } catch (error) {``
    res.status(500).json({ error: 'Error en el servidor', details: error.message })
  }
})

export default router