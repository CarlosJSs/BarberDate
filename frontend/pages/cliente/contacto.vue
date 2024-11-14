<template>
  <div>
    <!-- "About Us" Block -->
    <div class="about-us">
      <!-- Centered Welcome Section with Background Image -->
      <section class="intro-block">
        <h1>Bienvenido a <span class="highlight">Barber</span></h1>
        <p>En <span class="highlight">Barber</span>, perfeccionamos el arte de la barbería, creando estilos que reflejan la personalidad de cada cliente. Nuestra misión es brindarte una experiencia única y de calidad en cada visita.</p>
      </section>

      <!-- Services Section -->
      <section class="services-block">
        <h2>Servicios Recomendados</h2>
        <div class="services">
          <div class="service-item">
            <h3>Corte Clásico</h3>
            <p>Un look profesional y elegante.</p>
          </div>
          <div class="service-item">
            <h3>Barba y Bigote</h3>
            <p>Estilos personalizados para barba y bigote.</p>
          </div>
          <div class="service-item">
            <h3>Estilos Modernos</h3>
            <p>Para quienes buscan algo fresco y único.</p>
          </div>
        </div>
      </section>

      <!-- Team Section -->
      <section class="team-block">
        <h2>Nuestro Equipo</h2>
        <p>Conoce a nuestros barberos expertos que harán de tu visita una experiencia única.</p>
        <div class="team-members">
          <div class="team-member">
            <h3>Juan Pérez</h3>
            <p>Especialista en cortes clásicos y modernos.</p>
          </div>
          <div class="team-member">
            <h3>María López</h3>
            <p>Experta en diseño de barba y bigote.</p>
          </div>
          <div class="team-member">
            <h3>Carlos Sánchez</h3>
            <p>Maestro en técnicas avanzadas de barbería.</p>
          </div>
        </div>
      </section>

      <!-- Contact Block -->
      <div class="contact-page">
        <header class="header">
          <h1>Contacto Barber</h1>
          <p>Estamos aquí para atender todas tus consultas.</p>
        </header>

        <div class="form-container">
          <h2>Contáctanos</h2>
          <form class="contact-form" @submit.prevent="submitForm">
            <div class="form-group">
              <label for="nombre">Nombre</label>
              <input
                id="nombre"
                v-model="contact.nombre"
                type="text"
                placeholder="Tu nombre completo"
                required
              >
            </div>

            <div class="form-group">
              <label for="email">Correo Electrónico</label>
              <input
                id="email"
                v-model="contact.email"
                type="email"
                placeholder="Tu correo electrónico"
                required
              >
            </div>

            <div class="form-group">
              <label for="telefono">Teléfono</label>
              <input
                id="telefono"
                v-model="contact.telefono"
                type="tel"
                placeholder="Tu número de teléfono"
              >
            </div>

            <div class="form-group">
              <label for="mensaje">Mensaje</label>
              <textarea
                id="mensaje"
                v-model="contact.mensaje"
                placeholder="Escribe tu mensaje"
                rows="5"
                required
              />
            </div>

            <button type="submit" class="btn-submit">
              Enviar Mensaje
            </button>
          </form>
        </div>
        <!-- Social Media Section -->
        <section class="social-media-block">
          <h2>Síguenos en Redes Sociales</h2>
          <p>Conéctate con nosotros para conocer las últimas tendencias y promociones exclusivas.</p>
          <div class="social-links">
            <a href="https://www.facebook.com/tu-barberia" target="_blank" class="social-icon facebook">Facebook</a>
            <a href="https://www.instagram.com/tu-barberia" target="_blank" class="social-icon instagram">Instagram</a>
            <a href="https://www.whatssap.com/tu-barberia" target="_blank" class="social-icon whasapp">Whatssap</a>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      contact: {
        nombre: '',
        email: '',
        telefono: '',
        mensaje: ''
      }
    }
  },
  methods: {
    submitForm () {
      alert('Formulario enviado. Nos pondremos en contacto contigo pronto.')
      this.resetForm()
    },
    resetForm () {
      this.contact = {
        nombre: '',
        email: '',
        telefono: '',
        mensaje: ''
      }
    }
  }
}
</script>

<style scoped>
/* General Styling */
body {
  font-family: 'Roboto', sans-serif;
  color: #fff;
  margin: 0;
  padding: 0;
  background-color: #1a1a1a;
}

/* Backgrounds and Typography */
.intro-block {
  background-image: url('https://www.peluker.com/blog/wp-content/uploads/2024/03/%C2%BFcuanto-cuesta-una-barberia.jpeg');
  background-size: cover;
  background-position: center;
  background-color: rgba(0, 0, 0, 0.5); /* Capa de color negro con 50% de opacidad */
  background-blend-mode: overlay; /* Mezcla la imagen de fondo con el color */
  color: #fff;
  padding: 100px 30px;
}

.services-block, .team-block, .social-media-block {
  background-color: #1a1a1a; /* Fondo negro */
  color: #fff;
  padding: 100px 30px;
  margin: 30px 0;
}

h1, h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5em;
  text-transform: uppercase;
}

p {
  font-size: 1.2rem;
  line-height: 1.8;
  color: #e0e0e0;
}

.highlight {
  color: #f9d342;
}

.service-item, .team-member {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 30px;
  border-radius: 8px;
  margin: 15px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.service-item:hover, .team-member:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

/* Social Media Links */
.social-links {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.social-icon {
  padding: 12px 24px;
  text-decoration: none;
  color: #fff;
  font-weight: bold;
  border-radius: 8px;
  transition: background-color 0.3s, transform 0.2s;
}

.social-icon:hover {
  transform: scale(1.1);
}

.facebook { background-color: #3b5998; }
.instagram { background-color: #e1306c; }
.whasapp { background-color: #23cc01; }

/* Contact Form */
.contact-page {
  background-color: #333;
  padding: 60px 20px;
}

.form-container {
  max-width: 600px;
  margin: auto;
  padding: 40px;
  background-color: #222;
  border-radius: 12px;
  box-shadow: 0px 10px 25px rgba(0, 0, 0, 0.2);
}

.contact-form input, .contact-form textarea {
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #555;
  border-radius: 8px;
  font-size: 1rem;
  background-color: #333;
  color: #ddd;
}

.btn-submit {
  background: linear-gradient(90deg, #1dbf73, #00a8e8);
  color: #fff;
  padding: 14px;
  width: 100%;
  border: none;
  border-radius: 8px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-submit:hover {
  background: linear-gradient(90deg, #00a8e8, #1dbf73);
}
</style>
