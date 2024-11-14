<template>
  <v-container fluid class="dashboard-container pa-4">
    <!-- Verificación de token y bienvenida al dashboard de clientes -->
    <v-row justify="center" align="center" class="mb-5">
      <v-col cols="12" md="8" class="text-center white--text">
        <h1 class="display-2">
          Bienvenidos a Barbería Estilo
        </h1>
        <p class="headline">
          Ofrecemos cortes de alta calidad y una experiencia única para cada cliente.
        </p>
      </v-col>
    </v-row>

    <!-- Imagen y descripción de la barbería -->
    <v-row class="mb-5">
      <v-col cols="12" md="6">
        <v-img src="https://st2.depositphotos.com/1854227/10603/i/450/depositphotos_106030454-stock-photo-hairdresser-cutting-hair-of-young.jpg" max-height="400" contain alt="Imagen de la Barbería" />
      </v-col>

      <v-col cols="12" md="6" class="white--text">
        <h2 class="text-h5">
          Acerca de Nosotros
        </h2>
        <p>
          En Barbería Estilo, nuestro compromiso es brindar el mejor servicio de barbería en un ambiente relajado y
          amigable. Cada uno de nuestros barberos está altamente capacitado para ofrecer cortes de última moda y un
          servicio personalizado.
        </p>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Autem dicta similique veritatis quisquam dolorum
          fugit inventore sapiente corporis, aperiam odit id odio, facere cumque ipsa.
        </p>
        <v-img src="https://cdn.dribbble.com/users/13059329/screenshots/20395671/brucesbarbershop-logo.png" max-width="150" alt="Barbería Logo" contain />
      </v-col>
    </v-row>

    <!-- Sección de Reseñas -->
    <v-row class="reviews-section">
      <v-col cols="12" class="text-center">
        <h2 class="text-h4 white--text">
          Reseñas de Nuestros Clientes
        </h2>
      </v-col>

      <v-col v-for="(review, index) in reviews" :key="index" cols="12" md="4">
        <v-card class="review-card" color="#333333" dark>
          <v-card-text>
            <p>{{ review.text }}</p>
          </v-card-text>
          <v-card-actions>
            <v-rating :value="review.rating" color="yellow" dense readonly />
            <span class="ml-2">{{ review.name }}</span>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Cookies from 'js-cookie'

export default {
  name: 'DashboardCliente',
  layout: 'clienteLayout',
  middleware: [
    'detect-push',
    'auth-role'
  ],
  data () {
    return {
      reviews: [
        { name: 'Juan Pérez', rating: 5, text: 'Excelente servicio y ambiente. Definitivamente lo recomiendo!' },
        { name: 'María López', rating: 5, text: 'Los barberos son muy profesionales y amigables.' },
        { name: 'Carlos Sánchez', rating: 4, text: 'Muy buen corte, aunque la espera fue un poco larga.' },
        { name: 'Ana Fernández', rating: 5, text: 'Me encanta la atención y los resultados!' }
      ]
    }
  },
  mounted () {
    const cookieToken = Cookies.get('token')
    if (!cookieToken) {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  background-color: #464646;
  min-height: 100vh;
  color: #FFF;
}

.reviews-section {
  background-color: #333333;
  padding: 20px;
  border-radius: 10px;
}

.review-card {
  border-radius: 10px;
  margin-bottom: 20px;
}

.display-2 {
  font-weight: bold;
  color: #FFF;
}

.headline {
  color: #AAA;
}

.text-h4 {
  font-weight: bold;
  color: #FFF;
}
</style>
