<template>
  <!-- Card principal con estilo oscuro tipo barbería, bordes redondeados -->
  <v-card color="#1E1E1E" width="400" class="elevation-12 rounded-barber">
    <!-- Título de la tarjeta en azul oscuro, con estilo centralizado y texto en blanco -->
    <v-card-title class="text-h4 barber-title" style="background-color: #003366;">
      <p class="text-center" style="width: 100%; color: #FFF;">
        BarberDate
      </p>
    </v-card-title>
    <v-card-text>
      <v-row>
        <!-- Campo de texto para el nombre de usuario, ícono solo aparece si el campo está vacío -->
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
        <!-- Campo de texto para la contraseña, ícono de ojo para mostrar/ocultar -->
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
          <!-- Ícono de ojo que permite mostrar/ocultar el texto de la contraseña -->
          <template #append>
            <v-icon @click="togglePasswordVisibility">
              {{ showPassword ? 'mdi-eye-off' : 'mdi-eye' }}
            </v-icon>
          </template>
        </v-text-field>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <!-- Botón de login centrado, con color azul oscuro y texto blanco -->
      <v-row align="center" justify="center" style="width: 100%;" class="mb-2 mt-2">
        <v-btn color="blue darken-4" @click="loginBackend">
          <span style="text-transform: none; color: white;">
            Go
          </span>
          <v-icon color="white" right>
            mdi-login
          </v-icon>
        </v-btn>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  data () {
    return {
      usuario: '',
      password: '',
      showPassword: false // Control para mostrar u ocultar la contraseña
    }
  },
  methods: {
    loginBackend () {
      const body = {
        usuario: this.usuario,
        password: this.password
      }

      // Peticion axios para el login
      this.$axios.post('auth/login', body)
        .then((res) => {
          if (res.data && res.data.token) {
            // Guardar el token en las cookies, expira en un día y es accesible desde toda la raíz
            Cookies.set('token', res.data.token, { expires: 1, path: '/' })
            // Guardamos el rol
            Cookies.set('role', res.data.role, { expires: 1, path: '/' })

            // Redirigir a la página de administración después de iniciar sesión
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
    togglePasswordVisibility () {
      this.showPassword = !this.showPassword
    }
  }
}
</script>

<style>
/* Borde redondeado personalizado para el v-card */
.rounded-barber {
  border-radius: 20px;
}

/* Tipografía para el título */
@import url('https://fonts.googleapis.com/css2?family=Lobster&display=swap');
.barber-title {
  font-family: 'Lobster', cursive;
  font-size: 1.5em;
  text-align: center;
}

/* Centrado del label */
.centered-label .v-label {
  display: flex;
  justify-content: center;
  width: 100%;
  color: #FFF; /* Cambia el color si necesitas */
}
</style>
