import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import adminRoutes from './routes/admin.js'
import barberRoutes from './routes/barbero.js'
import clienteRoutes from './routes/cliente.js'
import citasRoutes from './routes/citas.js'

// Iniciar el servidor
const app = express()

// Configuracion del cors
//    para que el server acepte peticiones entramtes
const corsOptions = {
  origin: '*', //Que se puedan conectar desde donde sea
  optionSuccessStatus: 200
}
app.use(cors(corsOptions))

app.use(bodyParser.json())

// Manejo de las rutas
app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/barber', barberRoutes)
app.use('/api/cliente', clienteRoutes)
app.use('/api/citas', citasRoutes)

// Definir el puerto de trabajo
const PORT = process.env.PORT || 1906

app.listen(PORT, () => {
  console.log(`Backend (BarberDdate) trabajando en el puerto ${PORT}`)
})