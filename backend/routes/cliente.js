import express from 'express'
import bcrypt from 'bcryptjs'
import FBadmin from 'firebase-admin'
import { verifyToken, generateToken } from './auth.js'

// Acceder al realizar peticiones
const router = express.Router()

// Obtener la DB
const db = FBadmin.firestore()
const clienteCollection = db.collection('cliente')

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

// ------------- ENDPOINTS del BARBERO ------------------

// Obtener todos los clientes
//    /api/cliente/all
router.get('/all', authenticateToken, async(req, res) => {
  const collCliente = await clienteCollection.get()
  const cliente = collCliente.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }))

  res.status(201).json({
    message: 'success',
    cliente
  })
})

// Crear un cliente
//    /api/cliente/create
router.post ('/create', authenticateToken, async (req, res) => {

  // Definir el cuerpo de la info
  const {
    nombre,
    correo,
    telefono,
    usuario,
    password
  } = req.body

  // Validar usuario
  const findUsuario = await clienteCollection.where('usuario', '==', usuario).get()

  if(!findUsuario.empty){
    return res.status(400).json({
      error: 'El usuario ya existe'
    })
  }

  // Encriptar contraseña
  const passHashed = await bcrypt.hash(password, 10)

  // Agregar el nuevo admin
  await clienteCollection.add({
    nombre,
    correo,
    telefono,
    usuario,
    password: passHashed,
    rol: 'cliente'
  })

  // Mandar el mensaje de resultado OK
  res.status(201).json({
    message: 'success'
  })
})

// Actualizar info del cliente por ID
//    /api/cliente/id
router.put('/:id', authenticateToken, async(req, res) => {
	try{
		const clienteID = req.params.id
		const updateCliente = req.body

		const myCliente = await clienteCollection.doc(clienteID).get()
		if(!myCliente.exists){
			return res.status(401).json({
				message: 'error, el cliente no se encuentra'
			})
		}

		await clienteCollection.doc(clienteID).set(updateCliente, {
			merge: true
		})

		res.status(200).json({
			message: 'success',
			id: clienteID,
			...updateCliente
		})

	}catch(error){
		res.status(400).json({
			error: 'No se puede actualizar el cliente mediante el ID' + error
		})
	}
})

// Obtener un cliente por su ID
router.get('/:id', authenticateToken, async(req, res) => {
	const id = req.params.id

	//Indicamos el documento que queremos
	const collCliente = await clienteCollection.doc(id).get()
	if(!collCliente.exists){
		return res.status(401).json({
			message: 'error, el cliente no se encuentra'
		})
	}
	res.status(201).json({
		message: 'succes',
		cliente: {
			id: collCliente.id,
			...collCliente.data()
		}
	})
})

// Eliminar un cliente
router.delete('/:id', authenticateToken, async(req, res) => {
	try{
		const clienteID = req.params.id

		const myCliente = await clienteCollection.doc(clienteID).get()
		if(!myCliente.exists){
			return res.status(401).json({
				message: 'error, el cliente no se encuentra'
			})
		}

		await clienteCollection.doc(clienteID).delete()
		res.status(200).json({
			message: 'El cliente fue borrado con exito'
		})
	}catch(error){
		res.status(400).json({
			error: "No se puede borrar el cliente mediante ID"
		})
	}
})

export default router