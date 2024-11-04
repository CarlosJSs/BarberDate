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