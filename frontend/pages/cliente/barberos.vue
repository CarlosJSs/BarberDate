<template>
  <div class="barberos-container">
    <h2>Barberos Disponibles</h2>
    <div class="barberos-grid">
      <div v-for="barbero in barberos" :key="barbero.id" class="barbero-item">
        <img src="https://img.freepik.com/vector-gratis/craneo-barbero-barba-bigote_225004-204.jpg?semt=ais_hybrid" :alt="barbero.nombre" class="barbero-imagen">
        <div class="barbero-info">
          <h3>{{ barbero.nombre }}</h3>
          <p><strong>Especialidad:</strong> {{ barbero.especialidad }}</p>
          <p><strong>Experiencia:</strong> {{ barbero.experiencia }} años</p>
          <p><strong>Descripcion:</strong> {{ barbero.descripcion }} </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'

export default {
  name: 'BarberosList',
  layout: 'clienteLayout',
  middleware: [
    'detect-push',
    'auth-role'
  ],
  data () {
    return {
      barberos: []
    }
  },
  mounted () {
    const cookieToken = Cookies.get('token')
    if (!cookieToken) {
      this.$router.push('/')
    }
    this.loadBarberos()
  },
  methods: {
    loadBarberos () {
      this.token = Cookies.get('token')

      this.$axios.get('/barber/all', {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then((res) => {
        // eslint-disable-next-line no-console
        console.log('@@@ res => ', res.data)
        if (res.data.message === 'success') {
          this.barberos = res.data.barber
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
/* Contenedor principal */
.barberos-container {
  background-image: url('https://i.pinimg.com/enabled_lo_mid/736x/b8/35/d6/b835d6d1d3af05ea0d7fea6db2688519.jpg');
  background-size: cover;
  background-position: center;
  padding: 30px; /* Aumentar el padding para más espacio */
  min-height: 100vh;
  color: #fff;
}
/* Título */
h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #fff;
  font-size: 2.5em; /* Título más grande */
  font-weight: bold; /* Negrita */
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; /* Tipografía más moderna */
  text-transform: uppercase; /* Letras en mayúsculas */
  letter-spacing: 2px; /* Espaciado entre letras */
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.6); /* Sombra para darle más profundidad */
}
/* Estilo para la cuadrícula */
.barberos-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Dos columnas */
  grid-template-rows: repeat(2, 1fr); /* Dos filas */
  gap: 30px; /* Aumentar el espacio entre los elementos */
  margin: 0 auto;
  justify-items: center; /* Centrar los elementos dentro de la cuadrícula */
}
/* Estilo para cada elemento de barbero */
.barbero-item {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 24px;
  background: linear-gradient(135deg, #4e4e4e, #2c2c2c); /* Degradado gris a negro */
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  max-width: 85%;
  width: 100%;
}
/* Efecto al pasar el ratón por encima de la tarjeta */
.barbero-item:hover {
  transform: translateY(-5px);
  box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.15);
}
/* Imagen de barbero */
.barbero-imagen {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-right: 24px;
}
/* Información del barbero */
.barbero-info h3 {
  margin: 0;
  font-size: 1.5em;
  color: #fff;
  font-weight: bold;
}
.barbero-info p {
  margin: 10px 0;
  font-size: 1em;
  color: #e0e0e0;
}
.barbero-info strong {
  color: #fff;
}
</style>
