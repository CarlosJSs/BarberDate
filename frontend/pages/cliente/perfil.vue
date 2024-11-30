<template>
  <div class="perfil-container">
    <v-container class="profile-page" fluid>
      <v-row justify="center" align="center">
        <!-- Tarjeta para el perfil -->
        <v-card class="profile-card" elevation="10" outlined>
          <!-- Avatar flotante -->
          <div class="profile-avatar-wrapper">
            <v-avatar class="profile-avatar">
              <!-- Imagen con URL dinámica -->
              <img :src="randomAvatar" alt="Avatar Masculino">
            </v-avatar>
          </div>

          <!-- Contenido de la tarjeta -->
          <div class="profile-details">
            <h2 class="profile-name">
              {{ user.nombre }}
            </h2>
            <!-- Redes sociales -->
            <div class="social-icons">
              <a href="https://facebook.com" target="_blank" class="social-icon facebook" />
              <a href="https://instagram.com" target="_blank" class="social-icon instagram" />
              <a href="https://x.com" target="_blank" class="social-icon twitter" />
            </div>
            ㅤ
            ㅤ
            <p class="profile-detail">
              {{ user.usuario }} - {{ user.correo }}
            </p>
            ㅤ
            <p class="profile-detail">
              {{ user.telefono }}
            </p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo provident ab, alias quo quibusdam tempore deserunt possimus eos laborum dolor!
          </div>
        </v-card>
      </v-row>
    </v-container>
  </div>
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
      clienteID: Cookies.get('userID'),
      // Inicializa randomAvatar con una URL aleatoria
      randomAvatar: this.getRandomAvatar()
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
        if (res.data.message === 'success') {
          this.user = res.data.cliente
        }
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.log('@@@ error => ', error)
      })
    },
    getRandomAvatar () {
      // Genera un número aleatorio entre 1 y 10
      const randomNum = Math.floor(Math.random() * 10) + 1
      return `https://randomuser.me/api/portraits/lego/${randomNum}.jpg` // URL con número aleatorio
    }
  }
}
</script>

<style scoped>
/* Fondo general */
.perfil-container {
  background-image: url('https://i.pinimg.com/enabled_lo_mid/736x/b8/35/d6/b835d6d1d3af05ea0d7fea6db2688519.jpg');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 30px; /* Espaciado desde el tope */
}

/* Tarjeta de perfil */
.profile-card {
  position: relative;
  max-width: 900px;
  width: 85%;
  background-color: #333333;
  border-radius: 30px;
  padding: 20px 40px;
  text-align: center;
  margin-top: 100px; /* Espaciado desde la parte superior de la pantalla */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  padding-top: 80px; /* Espacio superior dentro de la tarjeta */
  padding-bottom: 200px;
}

/* Avatar flotante */
.profile-avatar-wrapper {
  position: absolute;
  top: -50px; /* Ajusta la posición del avatar sobre la tarjeta */
  left: 50%;
  transform: translateX(-50%);
}

.profile-avatar {
  width: 150px !important;
  height: 150px !important;
  border: 5px solid #007bff; /* Borde azul */
  border-radius: 50%;
  overflow: hidden;
  background-color: white; /* Fondo blanco */
}

/* Imagen dentro del avatar */
.profile-avatar img {
  width: 100%;
  height: auto;
}

/* Detalles del perfil */
.profile-details {
  margin-top: 60px; /* Espacio para el avatar */
}

.profile-name {
  font-size: 28px;
  font-weight: bold;
  margin: 20px 0 10px;
  color: #007bff;
}

.profile-detail {
  font-size: 18px;
  margin: 5px 0;
  color: #ddd;
}

/* Redes sociales */
.social-icons {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 20px;
}

.social-icon {
  display: inline-block;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #007bff;
  background-size: cover;
  background-position: center;
  transition: transform 0.3s;
}

.social-icon:hover {
  transform: scale(1.1);
}

.social-icon.facebook {
  background-image: url('https://cdn-icons-png.flaticon.com/512/733/733547.png');
}

.social-icon.instagram {
  background-image: url('https://cdn-icons-png.flaticon.com/512/2111/2111463.png');
}

.social-icon.twitter {
  background-image: url('https://img.freepik.com/vector-gratis/nuevo-diseno-icono-x-logotipo-twitter-2023_1017-45418.jpg');
}
</style>
