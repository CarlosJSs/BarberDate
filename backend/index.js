import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import adminRoutes from './routes/admin.js'

// Iniciar el servidor
const app = express()
//HOLA PROFE
// Configuracion del cors
//    para que el server acepte peticiones entramtes
const corsOptions = {
  origin: '*', //Que se puedan conectar desde donde sea
  optionSuccessStatus: 200
}
app.use(cors(corsOptions))

app.use(bodyParser.json())

// Manejo de las rutas
app.use('/api/admin', adminRoutes)

// Definir el puerto de trabajo
const PORT = process.env.PORT || 1906

app.listen(PORT, () => {
  console.log(`Backend (BarberDdate) trabajando en el puerto ${PORT}`)
})