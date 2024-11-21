<template>
  <div class="barberos-container">
    <h2>Lista de Barberos</h2>
    <div class="barberos-grid">
      <div v-for="barbero in barberos" :key="barbero.id" class="barbero-item">
        <img :src="barbero.imagen" :alt="barbero.nombre" class="barbero-imagen" />
        <div class="barbero-info">
          <h3>{{ barbero.nombre }}</h3>
          <p><strong>Especialidad:</strong> {{ barbero.especialidad }}</p>
          <p><strong>Experiencia:</strong> {{ barbero.experiencia }} años</p>
          <p><strong>Rating:</strong> {{ barbero.rating }} ⭐</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BarberosList',
  data () {
    return {
      barberos: [
        {
          id: 1,
          nombre: 'Juan Pérez',
          especialidad: 'Cortes clásicos',
          experiencia: 5,
          rating: 4.5,
          imagen: 'https://static.vecteezy.com/system/resources/previews/000/439/863/original/vector-users-icon.jpg'
        },
        {
          id: 2,
          nombre: 'Carlos Gómez',
          especialidad: 'Estilos modernos',
          experiencia: 3,
          rating: 4.7,
          imagen: 'https://static.vecteezy.com/system/resources/previews/000/439/863/original/vector-users-icon.jpg'
        },
        {
          id: 3,
          nombre: 'Luis Martínez',
          especialidad: 'Barbas y cuidados',
          experiencia: 7,
          rating: 4.9,
          imagen: 'https://static.vecteezy.com/system/resources/previews/000/439/863/original/vector-users-icon.jpg'
        },
        {
          id: 4,
          nombre: 'Mario López',
          especialidad: 'Cortes urbanos',
          experiencia: 4,
          rating: 4.6,
          imagen: 'https://static.vecteezy.com/system/resources/previews/000/439/863/original/vector-users-icon.jpg'
        }
      ]
    }
  }
}
</script>

<style scoped>
/* Contenedor principal */
.barberos-container {
  background-image: url('https://www.salonsdirect.com/blog/wp-content/uploads/2019/01/nathon-oski-EW_rqoSdDes-unsplash-1536x1020.jpg');
  background-size: cover;
  background-position: center;
  padding: 20px;
  min-height: 100vh;
  color: #fff;
}

/* Título */
h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #fff;
}

/* Estilo para la cuadrícula */
.barberos-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  max-width: 800px;
  margin: 0 auto;
}

/* Estilo para cada elemento de barbero */
.barbero-item {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  background-color: rgba(255, 255, 255, 0.9); /* Fondo semitransparente */
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

/* Imagen de barbero */
.barbero-imagen {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 16px;
}

/* Información del barbero */
.barbero-info h3 {
  margin: 0;
  font-size: 1.2em;
  color: #333;
}

.barbero-info p {
  margin: 8px 0;
  font-size: 0.9em;
  color: #555;
}
</style>
