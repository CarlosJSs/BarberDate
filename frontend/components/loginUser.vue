<template>
  <v-card color="#69F0AE" width="400">
    <v-card-title class="text-h4">
      <p class="text-center" style="width: 100%; color: white;">
        Bienvenido a BarberDate
      </p>
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-text-field
          v-model="usuario"
          label="Username"
          filled
          rounded
          dense
        />
      </v-row>
      <v-row>
        <v-text-field
          v-model="password"
          label="Password"
          filled
          rounded
          dense
          type="password"
        />
        <!--  :rules="[emptyField, specialChars, sizePassword]"  -->
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-row align="center" justify="center" style="width: 100%;" class="mb-2 mt-2">
        <v-btn @click="loginBackend">
          <span style="text-transform: none; color: black;">
            Ingresar
          </span>
          <v-icon color="black">
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

      // Peticion axios
      this.$axios.post('/login', body)
        .then((res) => {
          if (res.data && res.data.token) {
            // Expira en un dia y es accesible desde toda la raiz
            Cookies.set('token', res.data.token, { expires: 1, path: '/' })
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
