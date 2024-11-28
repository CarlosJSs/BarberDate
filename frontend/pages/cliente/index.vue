<template>
  <v-container fluid class="dashboard-container pa-4">
    <v-row justify="center" align="center" class="mb-5">
      <v-col cols="12" md="8" class="text-center">
        <h1 class="display-2 gradient-text">
          BIENVENIDOS A BRUCE'S BARBERS SHOP
        </h1>
        <p class="headline">
          Cortes de alta calidad y una atención única, porque tu estilo y satisfacción son nuestra prioridad.
        </p>
      </v-col>
    </v-row>

    <v-row class="about-section mb-5">
      <v-col cols="12" md="6">
        <v-img
          src="https://st2.depositphotos.com/1854227/10603/i/450/depositphotos_106030454-stock-photo-hairdresser-cutting-hair-of-young.jpg"
          max-height="400"
          contain
          alt="Imagen de la Barbería"
          class="rounded-image"
        />
      </v-col>

      <v-col cols="12" md="6" class="text-section">
        <h2 class="about-us-title">ACERCA DE NOSOTROS</h2>
        <p>
          En Bruce's Barber Shop, nos enorgullece ofrecerte un servicio excepcional en un ambiente cómodo y amigable.
          Nuestros barberos altamente capacitados están comprometidos con brindarte cortes de última tendencia y un trato personalizado
          que asegura que salgas de nuestra barbería sintiéndote renovado y con una sonrisa.
          Nos especializamos en brindar una experiencia única a cada cliente, adaptándonos a tus gustos y estilo. Ya sea que busques un corte clásico o moderno,
          tenemos el conocimiento y la experiencia para hacerlo realidad. ¡Tu satisfacción es nuestra mayor prioridad!
        </p>
      </v-col>
    </v-row>

    <v-row class="reviews-section">
      <v-col cols="12" class="text-center">
        <h2 class="reviews-title">Reseñas de nuestros clientes</h2>
      </v-col>

      <v-col v-for="(review, index) in reviews" :key="index" cols="12" md="4">
        <v-card class="review-card elevation-2">
          <v-card-text>
            <p class="review-text">{{ review.text }}</p>
          </v-card-text>
          <v-card-actions>
            <v-rating :value="review.rating" color="amber" dense readonly />
            <span class="ml-2 reviewer-name">{{ review.name }}</span>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="contact-section text-center mt-5">
      <v-col cols="12">
        <h2 class="contact-title">¡Contáctanos!</h2>
        <p>Si tienes alguna pregunta o necesitas más información, no dudes en comunicarte con nosotros a través de los siguientes canales:</p>
        <v-btn
          href="https://wa.me/1234567890"
          target="_blank"
          class="contact-btn"
          color="green"
        >
          <v-icon left>mdi-whatsapp</v-icon>
          WhatsApp
        </v-btn>
        <v-btn
          href="https://www.facebook.com/brucebarbershop"
          target="_blank"
          class="contact-btn"
          color="blue"
        >
          <v-icon left>mdi-facebook</v-icon>
          Facebook
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Cookies from 'js-cookie'

export default {
  name: 'DashboardCliente',
  layout: 'clienteLayout',
  middleware: ['detect-push', 'auth-role'],
  data () {
    return {
      reviews: [
        { name: 'Juan Pérez', rating: 5, text: 'Excelente servicio y ambiente. Definitivamente lo recomiendo!' },
        { name: 'María López', rating: 5, text: 'Los barberos son muy profesionales y amigables.' },
        { name: 'Carlos Sánchez', rating: 4, text: 'Muy buen corte, aunque la espera fue un poco larga.' },
        { name: 'Ana Fernández', rating: 5, text: 'Me encanta la atención y los resultados!' },
        { name: 'Sofía Ramírez', rating: 4, text: 'Buen ambiente, aunque me gustaría que ampliaran sus horarios.' },
        { name: 'Luis Gómez', rating: 5, text: 'La mejor barbería de la ciudad. Calidad y atención insuperables.' }
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
  background: #2c2c2c;
  background-image: url('https://www.toptal.com/designers/subtlepatterns/patterns/dark-mosaic.png');
  color: #ffffff;
  min-height: 100vh;
  padding: 20px;
}

.display-2 {
  font-weight: bold;
  color: #ffd700;
}

.gradient-text {
  font-family: 'Roboto', sans-serif;
  font-size: 4rem;
  font-weight: bold;
  background: linear-gradient(135deg, #00c6ff, #0072ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.7);
  letter-spacing: 3px;
  transition: transform 0.3s ease-in-out, color 0.3s ease-in-out;
}

.gradient-text:hover {
  transform: scale(1.1);
  color: #ff6347;
}

.headline {
  color: white;
  font-size: 1.2rem;
}

.about-us-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  text-align: center;
  letter-spacing: 1px;
}

.about-section .text-section {
  color: white;
}

.reviews-section {
  background-color: #212121;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  margin-top: 30px;
}

.reviews-section:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
}

.review-card {
  border-radius: 10px;
  background-color: #333333;
  color: white;
  padding: 20px;
  margin-bottom: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.review-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
}

.reviewer-name {
  font-weight: bold;
  font-size: 1rem;
  color: #ffd700;
  margin-bottom: 10px;
}

.review-text {
  font-size: 1rem;
  line-height: 1.5;
  color: white;
}

.reviews-title {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(to right, #ffcc00, #ffb900, #f1a800);
  -webkit-background-clip: text;
  color: transparent;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  margin-bottom: 15px;
  text-align: center;
  letter-spacing: 1px;
}

.contact-section {
  background-color: #2c2c2c;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  margin-top: 40px;
}

.contact-title {
  font-size: 2rem;
  font-weight: 700;
  color: #ffd700;
  margin-bottom: 20px;
}

.contact-description {
  font-size: 1.2rem;
  color: white;
  margin-bottom: 20px;
}

.contact-btn {
  margin: 10px;
  padding: 12px 25px;
  border-radius: 5px;
}

.contact-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

</style>
