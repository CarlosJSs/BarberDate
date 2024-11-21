<template>
  <div class="barberos-container">
    <h2>Barberos Disponibles</h2>
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
          nombre: 'Salvador Ortiz',
          especialidad: 'Barbas y nenas',
          experiencia: 8,
          rating: 5.0,
          imagen: 'https://static.vecteezy.com/system/resources/previews/000/439/863/original/vector-users-icon.jpg'
        }
      ]
    }
  }
}
</script>

<style scoped>
/* Contenedor principal */
/* Contenedor principal */
.barberos-container {
  background-image: url('https://i.pinimg.com/originals/31/c0/9d/31c09d8d455f5289c718c6796bed8a69.jpg');
  background-size: cover;
  background-position: center;
  padding: 30px; /* Aumentar el padding para más espacio */
  min-height: 100vh;
  color: #fff;
}

/* Título */
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
  grid-template-columns: repeat(2, 1fr); /* Dos columnas */
  grid-template-rows: repeat(2, 1fr); /* Dos filas */
  gap: 30px; /* Aumentar el espacio entre los elementos */
  max-width: 800px; /* Tamaño máximo de la cuadrícula */
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
  max-width: 350px;
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
