<template>
  <!-- Card principal con estilo oscuro tipo barbería, bordes redondeados y mayor tamaño -->
  <v-card color="#1E1E1E" width="600" class="elevation-12 rounded-barber">
    <v-row no-gutters>
      <!-- Columna izquierda para el espacio del logo, cubre toda la altura del card -->
      <v-col cols="5" class="logo-column d-flex align-center justify-center">
        <v-img src="https://cdn.dribbble.com/users/13059329/screenshots/20395671/brucesbarbershop-logo.png" max-width="150" alt="Barbería Logo" contain />
      </v-col>

      <!-- Columna derecha con el formulario de login -->
      <v-col cols="7">
        <!-- Título de la tarjeta con ícono de perfil en la parte superior -->
        <v-card-title class="text-h4 barber-title" style="background-color: #003366; position: relative;">
          <p class="text-center" style="width: 100%; color: #FFF;">
            BarberDate
          </p>
          <!-- Ícono de perfil en la esquina superior derecha -->
          <v-icon large color="white" style="position: absolute; top: 8px; right: 16px;">
            mdi-account-circle
          </v-icon>
        </v-card-title>

        <v-card-text>
          <v-row>
            <!-- Campo de texto para el nombre de usuario -->
            <v-text-field
              v-model="usuario"
              label="User"
              filled
              rounded
              dense
              color="blue darken-3"
              :prepend-inner-icon="!usuario ? 'mdi-account' : ''"
              outlined
              class="centered-label"
            />
          </v-row>
          <v-row>
            <!-- Campo de texto para la contraseña -->
            <v-text-field
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              label="Password"
              filled
              rounded
              dense
              color="red darken-3"
              :prepend-inner-icon="!password ? 'mdi-lock' : ''"
              outlined
              class="centered-label"
            >
              <!-- Ícono de ojo para mostrar/ocultar la contraseña -->
              <template #append>
                <v-icon @click="togglePasswordVisibility">
                  {{ showPassword ? 'mdi-eye-off' : 'mdi-eye' }}
                </v-icon>
              </template>
            </v-text-field>
          </v-row>

          <!-- Campos adicionales para el registro -->
          <v-row v-if="isSignUp">
            <v-text-field
              v-model="name"
              label="Full Name"
              filled
              rounded
              dense
              color="green darken-3"
              outlined
            />
          </v-row>
          <v-row v-if="isSignUp">
            <v-text-field
              v-model="email"
              label="Email"
              filled
              rounded
              dense
              color="green darken-3"
              outlined
            />
          </v-row>
          <v-row v-if="isSignUp">
            <v-text-field
              v-model="phone"
              label="Phone"
              filled
              rounded
              dense
              color="green darken-3"
              outlined
            />
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-row align="center" justify="center" class="mb-2 mt-2" style="width: 100%;">
            <!-- Botón de login o signup -->
            <v-btn color="blue darken-4" @click="handleSubmit">
              <span style="text-transform: none; color: white;">
                {{ isSignUp ? 'Crear cuenta' : 'Iniciar sesión' }}
              </span>
              <v-icon color="white" right>
                {{ isSignUp ? 'mdi-account-plus' : 'mdi-login' }}
              </v-icon>
            </v-btn>
          </v-row>

          <v-row align="center" justify="center" style="width: 100%;">
            <p
              style="font-size: 12px; text-align: center; color: #1976d2; margin: 0; width: auto;"
            >
              {{ isSignUp ? 'Ya tienes cuenta?' : '¿Nuevo cliente? Crea tu cuenta' }}
              <span
                style="text-decoration: underline; cursor: pointer;"
                @click="toggleSignUp"
              >
                {{ isSignUp ? 'Inicia sesión aquí' : 'Aquí' }}
              </span>
            </p>
          </v-row>
        </v-card-actions>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import Cookies from 'js-cookie'

export default {
  data () {
    return {
      usuario: '', // Nombre de usuario
      password: '', // Contraseña
      showPassword: false, // Control para mostrar u ocultar la contraseña
      isSignUp: false, // Indica si el formulario es de registro o login
      name: '', // Nombre completo (solo para signup)
      email: '', // Correo electrónico (solo para signup)
      phone: '' // Teléfono (solo para signup)
    }
  },
  methods: {
    // Función para manejar el submit (login o signup)
    handleSubmit () {
      if (this.isSignUp) {
        this.signUpBackend() // Si es signup, realiza el registro
      } else {
        this.loginBackend() // Si no, realiza el login
      }
    },
    // Función para cambiar entre signup y login
    toggleSignUp () {
      this.isSignUp = !this.isSignUp // Cambia el estado entre signup y login
    },
    // Función para login
    loginBackend () {
      if (!this.usuario || !this.password) {
        alert('Por favor ingresa usuario y contraseña.') // Verifica que usuario y contraseña estén presentes
        return
      }

      const body = {
        usuario: this.usuario,
        password: this.password
      }

      // Petición axios para el login
      this.$axios.post('auth/login', body)
        .then((res) => {
          if (res.data && res.data.token) {
            Cookies.set('token', res.data.token, { expires: 1, path: '/' })
            Cookies.set('role', res.data.role, { expires: 1, path: '/' })
            Cookies.set('userID', res.data.userID, { expires: 1, path: '/' })
            const role = res.data.role
            if (role === 'admin') {
              this.$router.push('/admin')
            } else if (role === 'barbero') {
              this.$router.push('/barbero')
            } else if (role === 'cliente') {
              this.$router.push('/cliente')
            } else {
              // eslint-disable-next-line no-console
              console.error('Rol desconocido: ', role)
            }
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error('@@ error => ', error)
          this.errorMessage = error.response?.data?.error || 'Error al iniciar sesion'
        })
    },
    // Función para signup
    signUpBackend () {
      if (!this.name || !this.email || !this.phone || !this.usuario || !this.password) {
        alert('Por favor completa todos los campos.') // Verifica que todos los campos del registro estén llenos
        return
      }

      const body = {
        nombre: this.name,
        correo: this.email,
        telefono: this.phone,
        usuario: this.usuario,
        password: this.password
      }

      // Petición axios para crear cliente
      this.$axios.post('/cliente/create', body, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-type': 'application/json'
        }
      }).then((res) => {
        // eslint-disable-next-line no-console
        console.log('@@ res new Cliente => ', res)
        if (res && res.data && res.data.message === 'success') {
          // eslint-disable-next-line no-console
          console.log('@@ res message => ', res.data.message)
          alert('Su cuenta se ha creado con exito')
          this.name = ''
          this.email = ''
          this.phone = ''
          this.usuario = ''
          this.password = ''
          this.toggleSignUp()
        }
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.error('@@ error => ', error)
      })
    },
    // Función para alternar la visibilidad de la contraseña
    togglePasswordVisibility () {
      this.showPassword = !this.showPassword
    }
  }
}
</script>

<style>
.rounded-barber {
  border-radius: 20px;
}

/* Estilo de la columna del logo para cubrir toda la altura */
.logo-column {
  background-color: #003366;
  min-height: 100%;
}

/* Tipografía para el título */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600&display=swap');
.barber-title {
  font-family: 'Poppins', sans-serif;
  font-size: 24px;
}

/* Centrado del label */
.centered-label .v-label {
  display: flex;
  justify-content: center;
  width: 100%;
  color: #FFF;
}
</style>
