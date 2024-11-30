<template>
  <div class="container">
    <!-- Sección del formulario -->
    <div class="form-section">
      <h2>Agregar Barbero</h2>
      <div class="form-group">
        <label>Nombre del Barbero</label>
        <input v-model="barbero.nombre" type="text" placeholder="Ingrese el nombre">
      </div>
      <div class="form-group">
        <label>Correo</label>
        <input v-model="barbero.correo" type="email" placeholder="Ingrese el correo">
      </div>
      <div class="form-group">
        <label>Usuario</label>
        <input v-model="barbero.usuario" type="text" placeholder="Ingrese el usuario">
      </div>
      <div class="form-group">
        <label>Contraseña</label>
        <input v-model="barbero.contrasena" type="password" placeholder="Ingrese la contraseña">
      </div>
      <button class="add-button" @click="addBarbero">
        Agregar Barbero
      </button>
    </div>

    <!-- Sección de la lista de barberos -->
    <div class="barbero-section">
      <h2>Barberos en el Sistema</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Usuario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(myBarber, index) in barberos" :key="index">
            <td>{{ myBarber.nombre }}</td>
            <td>{{ myBarber.correo }}</td>
            <td>{{ myBarber.usuario }}</td>
            <td>
              <button class="delete-button" @click="deleteBarbero(myBarber.id)">
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'

export default {
  layout: 'adminLayout',
  middleware: [
    'detect-push',
    'auth-role'
  ],
  data () {
    return {
      barbero: {
        nombre: '',
        correo: '',
        usuario: '',
        contrasena: ''
      },
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
      this.$axios
        .get('/barber/all', {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })
        .then((res) => {
          if (res.data.message === 'success') {
            this.barberos = res.data.barber
          }
        })
        .catch((error) => {
          console.error(error)
        })
    },
    addBarbero () {
      if (this.barbero.nombre && this.barbero.correo && this.barbero.usuario && this.barbero.contrasena) {
        const body = {
          nombre: this.barbero.nombre,
          correo: this.barbero.correo,
          usuario: this.barbero.usuario,
          password: this.barbero.contrasena,
          horarios: []
        }

        this.$axios
          .post('/barber/create', body, {
            headers: {
              Authorization: `Bearer ${this.token}`,
              'Content-type': 'application/json'
            }
          })
          .then((res) => {
            if (res.data.message === 'success') {
              this.loadBarberos()
            }
          })
          .catch((error) => {
            console.error(error)
          })

        this.clearForm()
      } else {
        alert('Por favor, completa todos los campos.')
      }
    },
    deleteBarbero (id) {
      this.$axios
        .delete(`/barber/${id}`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-type': 'application/json'
          }
        })
        .then(() => {
          this.loadBarberos()
        })
        .catch((error) => {
          console.error(error)
        })
    },
    clearForm () {
      this.barbero = {
        nombre: '',
        correo: '',
        usuario: '',
        contrasena: ''
      }
    }
  }
}
</script>

<style scoped>
/* General */
.container {
  display: flex; /* Alineación en fila */
  justify-content: space-between; /* Espaciado entre los contenedores */
  align-items: flex-start; /* Alinea los elementos al inicio */
  padding: 20px;
  color: #ffffff;
  gap: 20px; /* Espaciado entre los contenedores */
}

/* Secciones */
.form-section {
  width: 40%; /* Ajusta según el diseño deseado */
  min-width: 300px; /* Asegúrate de que no sea demasiado pequeño */
  background: linear-gradient(145deg, #2b3745, #1c2431);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.barbero-section {
  width: 55%; /* El espacio restante */
  min-width: 400px;
  background: linear-gradient(145deg, #2b3745, #1c2431);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.form-section:hover, .barbero-section:hover {
  transform: scale(1.02);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.5);
}

/* Títulos */
h2 {
  color: #ffffff;
  font-weight: 600;
  font-size: 1.5rem;
  margin-bottom: 20px;
  background: linear-gradient(90deg, #00c6ff, #0072ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* Formularios */
input[type="text"], input[type="email"], input[type="password"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #444444;
  border-radius: 5px;
  background-color: #222222;
  color: #ffffff;
}

input:focus {
  border-color: #00c6ff;
  box-shadow: 0 0 8px rgba(0, 198, 255, 0.5);
}

/* Botones */
.add-button {
  background: linear-gradient(90deg, #00c851, #007e33);
  color: #ffffff;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease, box-shadow 0.3s ease;
  margin-top: 20px;
  width: 100%;
}

.add-button:hover {
  background: linear-gradient(90deg, #007e33, #00c851);
  box-shadow: 0 4px 10px rgba(0, 200, 81, 0.5);
}

.delete-button {
  background: linear-gradient(90deg, #ff4444, #cc0000);
  color: #ffffff;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

.delete-button:hover {
  background: linear-gradient(90deg, #cc0000, #ff4444);
  box-shadow: 0 4px 10px rgba(255, 68, 68, 0.5);
}

/* Tabla */
table {
  width: 100%;
  border-collapse: collapse;
  color: #ffffff;
  background-color: #2c2f36;
  border-radius: 10px;
  overflow: hidden;
}

thead {
  background: linear-gradient(90deg, #00c6ff, #0072ff);
}

th, td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #444444;
}

tbody tr:nth-child(even) {
  background-color: #2a2d34;
}

tbody tr:hover {
  background-color: #3a3d45;
  transition: background-color 0.3s ease;
}
</style>
