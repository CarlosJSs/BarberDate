<template>
    <div class="contact-page">
      <header class="header">
        <h1>Contacto Barbería</h1>
        <p>Estamos aquí para atender todas tus consultas.</p>
      </header>
      <div class="form-container">
        <h2>Contáctanos</h2>
        <form @submit.prevent="submitForm" class="contact-form">
          <div class="form-group">
            <label for="nombre">Nombre</label>
            <input v-model="contact.nombre" type="text" id="nombre" placeholder="Tu nombre completo" required />
          </div>
          <div class="form-group">
            <label for="email">Correo Electrónico</label>
            <input v-model="contact.email" type="email" id="email" placeholder="Tu correo electrónico" required />
          </div>
          <div class="form-group">
            <label for="telefono">Teléfono</label>
            <input v-model="contact.telefono" type="tel" id="telefono" placeholder="Tu número de teléfono" />
          </div>
          <div class="form-group">
            <label for="mensaje">Mensaje</label>
            <textarea v-model="contact.mensaje" id="mensaje" placeholder="Escribe tu mensaje" rows="5" required></textarea>
          </div>
          <button type="submit" class="btn-submit">Enviar Mensaje</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        contact: {
          nombre: '',
          email: '',
          telefono: '',
          mensaje: ''
        }
      };
    },
    methods: {
      submitForm() {
        alert('Formulario enviado. Nos pondremos en contacto contigo pronto.');
        this.resetForm();
      },
      resetForm() {
        this.contact = {
          nombre: '',
          email: '',
          telefono: '',
          mensaje: ''
        };
      }
    }
  };
  </script>
  
  <style scoped>
  .contact-page {
    font-family: 'Arial', sans-serif;
    background-color: #f3f4f6;
    color: #333;
    padding: 20px;
  }
  
  .header {
    text-align: center;
    margin-bottom: 30px;
  }
  
  .header h1 {
    font-size: 2.5rem;
    color: #222;
  }
  
  .header p {
    font-size: 1.2rem;
    color: #555;
  }
  
  .form-container {
    max-width: 600px;
    margin: 0 auto;
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .contact-form h2 {
    text-align: center;
    margin-bottom: 20px;
    color: #111;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  .form-group input,
  .form-group textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  .form-group textarea {
    resize: none;
  }
  
  .btn-submit {
    width: 100%;
    background-color: #1d72b8;
    color: #fff;
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .btn-submit:hover {
    background-color: #145a86;
  }
  </style>