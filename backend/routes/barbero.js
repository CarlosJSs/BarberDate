import express from 'express'
import bcrypt from 'bcryptjs'
import FBadmin from 'firebase-admin'
//import fs from 'fs'
//const serviceAccount = JSON.parse(fs.readFileSync('./config/firebaseServiceAccount.json', 'utf-8'))
//import serviceAccount from '../config/firebaseServiceAccount.json' assert { type: 'json' }
import { verifyToken, generateToken } from './auth.js'

// Inicializar firebase
//FBadmin.initializeApp({
//  credential: FBadmin.credential.cert(serviceAccount)
//})

// Acceder al realizar peticiones
const router = express.Router()

// Obtener la DB
const db = FBadmin.firestore()
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

// ------------- ENDPOINTS del BARBERO ------------------

// Login Barbero
router.post('/login', async (req, res) => {
  const { usuario, password } = req.body
  const findUser = await barberCollection.where('usuario', '==', usuario).get()

  if(findUser.empty){
    return res.status(400).json({
      error: 'El usuario No Existe'
    })
  }

  const barberDoc = findUser.docs[0]
  const barber = barberDoc.data()

  const validaPassword = await bcrypt.compare(password, barber.password)

  if(!validaPassword){
    return res.status(400).json({
      error: 'Contraseña invalida'
    })
  }

  const token = generateToken({
    id: barberDoc.id,
    usuario: barber.usuario
  })

  res.status(201).json({
    token
  })
})

// Obtener todos los admins
//    /api/barber/all
router.get('/all', async(req, res) => {
  const collBarber = await barberCollection.get()
  const barber = collBarber.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }))

  res.status(201).json({
    message: 'success',
    barber
  })
})

// Crear un barbero
//    /api/barber/create
router.post ('/create', async (req, res) => {

  // Definir el cuerpo de la info
  const {
    nombre,
    correo,
    usuario,
    password,
    rol
  } = req.body

  // Validar usuario
  const findUsuario = await barberCollection.where('usuario', '==', usuario).get()

  if(!findUsuario.empty){
    return res.status(400).json({
      error: 'El usuario ya existe'
    })
  }

  // Encriptar contraseña
  const passHashed = await bcrypt.hash(password, 10)

  // Agregar el nuevo admin
  await barberCollection.add({
    nombre,
    correo,
    usuario,
    password,
    rol
  })

  // Mandar el mensaje de resultado OK
  res.status(201).json({
    message: 'success'
  })
})

// Actualizar info del barbero por ID
//    /api/barber/id
router.put('/:id', async(req, res) => {
	try{
		const barberID = req.params.id
		const updateBarber = req.body

		const myBarber = await barberCollection.doc(barberID).get()
		if(!myBarber.exists){
			return res.status(401).json({
				message: 'error, el barbero no se encuentra'
			})
		}

		await barberCollection.doc(barberID).set(updateBarber, {
			merge: true
		})

		res.status(200).json({
			message: 'success',
			id: barberID,
			...updateBarber
		})

	}catch(error){
		res.status(400).json({
			error: 'No se puede actualizar el barbero mediante el ID' + error
		})
	}
})

// Obtener un barbero por su ID
router.get('/:id', async(req, res) => {
	const id = req.params.id

	//Indicamos el documento que queremos
	const collBarber = await barberCollection.doc(id).get()
	if(!collBarber.exists){
		return res.status(401).json({
			message: 'error, el barbero no se encuentra'
		})
	}
	res.status(201).json({
		message: 'succes',
		barbero: {
			id: collBarber.id,
			...collBarber.data()
		}
	})
})

// Eliminar un barbero
router.delete('/:id',  async(req, res) => {
	try{
		const barberID = req.params.id

		const myBarber = await barberCollection.doc(barberID).get()
		if(!myBarber.exists){
			return res.status(401).json({
				message: 'error, el barbero no se encuentra'
			})
		}

		await barberCollection.doc(barberID).delete()
		res.status(200).json({
			message: 'El barbero fue borrado con exito'
		})
	}catch(error){
		res.status(400).json({
			error: "No se puede borrar el barbero mediante ID"
		})
	}
})


export default router