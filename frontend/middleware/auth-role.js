import Cookies from 'js-cookie'

export default function ({ route, redirect }) {
  const token = Cookies.get('token')
  // Accedemos al rol que se guardo en las cookies al hacer login
  const role = Cookies.get('role')

  // Si no hay token, redirigir al login
  if (!token) {
    return redirect('/')
  }

  // Definimos las rutas permitidas por cada rol
  const roleRoutes = {
    admin: ['/admin', '/admin/barberos', '/admin/admins'],
    barbero: ['/barbero', '/barbero/citas', '/barbero/perfil'],
    cliente: ['/cliente', '/cliente/citas', '/cliente/perfil']
  }

  // Validamos si el rol actual tiene acceso a la ruta
  const allowedRoutes = roleRoutes[role] || []
  if (!allowedRoutes.includes(route.path)) {
    // Enviar a pagina para roles no autorizados
    return redirect('/unauthorized')
  }
}
