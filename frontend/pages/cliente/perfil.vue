<template>
  <v-container class="profile-page" fluid>
    <v-row justify="center" align="center" class="mt-10">
      <!-- Card para el perfil del usuario -->
      <v-card class="profile-card" elevation="10" outlined>
        <v-row>
          <!-- Avatar del usuario -->
          <v-col cols="12" md="4" class="text-center">
            <v-avatar size="150" class="profile-avatar mb-4">
              <img
                src="https://randomuser.me/api/portraits/men/1.jpg"
                alt="Avatar Masculino"
              >
            </v-avatar>
          </v-col>

          <!-- Información del usuario -->
          <v-col cols="12" md="8" class="text-center text-md-left">
            <h2 class="text-uppercase profile-name">
              {{ user.nombre }}
            </h2>
            <p class="text-subtitle-1 profile-detail">
              Usuario: {{ user.usuario }}
            </p>
            <p class="text-subtitle-1 profile-detail">
              Correo: {{ user.correo }}
            </p>
            <p class="text-subtitle-1 profile-detail">
              Teléfono: {{ user.telefono }}
            </p>
          </v-col>
        </v-row>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import Cookies from 'js-cookie'

export default {
  name: 'PerfilPageCliente',
  layout: 'clienteLayout',
  middleware: [
    'detect-push',
    'auth-role'
  ],
  data () {
    return {
      user: {},
      clienteID: Cookies.get('userID')
    }
  },
  mounted () {
    const cookieToken = Cookies.get('token')
    if (!cookieToken) {
      this.$router.push('/')
    }
    this.loadInfo()
  },
  methods: {
    loadInfo () {
      this.token = Cookies.get('token')

      this.$axios.get(`/cliente/${this.clienteID}`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then((res) => {
        // eslint-disable-next-line no-console
        console.log('@@@ resCliente => ', res.data)
        if (res.data.message === 'success') {
          this.user = res.data.cliente
        }
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.log('@@@ error => ', error)
      })
    }
  }
}
</script>

<style scoped>
.profile-page {
  background-color: #222222; /* Un tono gris oscuro para el fondo */
  color: white;
  min-height: 100vh;
  padding-top: 20px;
}

.profile-card {
  max-width: 800px; /* Tamaño grande de la tarjeta */
  background-color: #333333; /* Fondo oscuro para la tarjeta */
  border-radius: 15px;
  padding: 40px;
  width: 80%; /* Ancho de la tarjeta, cubriendo un 80% de la pantalla */
}

.profile-avatar img {
  border: 3px solid #007bff; /* Azul para bordear la imagen */
  border-radius: 50%;
}

.profile-name {
  font-size: 28px;
  font-weight: bold;
  color: #007bff; /* Azul */
}

.profile-detail {
  font-size: 18px;
}
</style>
