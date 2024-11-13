<template>
  <!-- Card principal con estilo oscuro tipo barbería, bordes redondeados y mayor tamaño -->
  <v-card color="#1E1E1E" width="600" class="elevation-12 rounded-barber">
    <v-row no-gutters>
      <!-- Columna izquierda para el logo de la barbería -->
      <v-col cols="5" class="d-flex align-center justify-center" style="background-color: #003366;">
        <v-img src="path/to/logo.png" max-width="150" alt="Barbería Logo" />
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
        </v-card-text>

        <v-card-actions>
          <!-- Botón de login centrado -->
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
      </v-col>
    </v-row>
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
            Cookies.set('token', res.data.token, { expires: 1, path: '/' })
            Cookies.set('role', res.data.role, { expires: 1, path: '/' })
            const role = res.data.role
            if (role === 'admin') {
              this.$router.push('/admin')
            } else if (role === 'barbero') {
              this.$router.push('/barbero')
            } else if (role === 'cliente') {
              this.$router.push('/cliente')
            } else {
              console.error('Rol desconocido: ', role)
            }
          }
        })
        .catch((error) => {
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
  color: #FFF;
}
</style>
