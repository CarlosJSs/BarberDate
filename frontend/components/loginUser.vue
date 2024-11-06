<template>
  <!-- Card principal con estilo oscuro tipo barbería -->
  <v-card color="#1E1E1E" width="400" class="elevation-12">
    <!-- Título de la tarjeta en azul oscuro, con estilo centralizado y texto en blanco -->
    <v-card-title class="text-h4" style="background-color: #003366;">
      <p class="text-center" style="width: 100%; color: #FFF;">
        BarberDate
      </p>
    </v-card-title>
    <v-card-text>
      <v-row>
        <!-- Campo de texto para el nombre de usuario, con ícono de usuario y borde azul oscuro -->
        <v-text-field
          v-model="usuario"
          label="Username"
          filled
          rounded
          dense
          color="blue darken-3"
          prepend-inner-icon="mdi-account"
          outlined
        />
      </v-row>
      <v-row>
        <!-- Campo de texto para la contraseña, con ícono de candado y borde rojo oscuro -->
        <v-text-field
          v-model="password"
          label="Password"
          filled
          rounded
          dense
          color="red darken-3"
          prepend-inner-icon="mdi-lock"
          outlined
          type="password"
        />
        <!--  :rules="[emptyField, specialChars, sizePassword]"  -->
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
      password: '' /*,
      emptyField:
        value => !!value || 'No puede estar vacio',
      specialChars:
        value => (value && /^[A-Za-z0-9]/.test(value)) || 'Minimo un cracter especial',
      sizePassword:
        value => (value && value.length > 6) || 'Minimo 6 caracteres' */
    }
  },
  methods: {
    loginBackend () {
      const body = {
        usuario: this.usuario,
        password: this.password
      }

      // Peticion axios para el login
      this.$axios.post('/login', body)
        .then((res) => {
          if (res.data && res.data.token) {
            // Guardar el token en las cookies, expira en un día y es accesible desde toda la raíz
            Cookies.set('token', res.data.token, { expires: 1, path: '/' })
            // Redirigir a la página de administración después de iniciar sesión
            this.$router.push('/admin')
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error('@@ error => ', error)
        })
    }
  }
}
</script>

<style>
</style>
