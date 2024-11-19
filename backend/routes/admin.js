import express from 'express'
import bcrypt from 'bcryptjs'
import FBadmin from 'firebase-admin'
import { verifyToken, generateToken } from './auth.js'

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

//----------------- Acciones sobre los admins ------------------
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
    password: passHashed,
    rol: 'admin'
  })

  // Mandar el mensaje de resultado OK
  res.status(201).json({
    message: 'success'
  })
})

// Eliminar un Admin
//  /api/admin/id
router.delete('/:id', authenticateToken, async(req, res) => {
	try{
		const adminID = req.params.id

		const myAdmin = await adminCollection.doc(adminID).get()
		if(!myAdmin.exists){
			return res.status(401).json({
				message: 'error, el admin no se encuentra'
			})
		}

		await adminCollection.doc(adminID).delete()
		res.status(200).json({
			message: 'El admin fue borrado con exito'
		})
	}catch(error){
		res.status(400).json({
			error: "No se puede borrar el admin mediante ID"
		})
	}
})

export default router