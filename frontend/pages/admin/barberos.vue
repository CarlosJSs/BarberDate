<template>
  <div class="container">
    <!-- Sección del formulario -->
    <div class="form-section">
      <h2>Agregar / Modificar Barbero</h2>
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
            <td v-show="false">
              {{ myBarber.id }}
            </td>
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

      // Utilizamos Axios para el endpoint
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

        // Peticion a axios
        this.$axios.post('/barber/create', body, {
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-type': 'application/json'
          }
        }).then((res) => {
          // eslint-disable-next-line no-console
          console.log('@@ res 1 => ', res)
          if (res && res.data && res.data.message === 'success') {
            // eslint-disable-next-line no-console
            console.log('@@ res message => ', res.data.message)
            this.loadBarberos()
          }
        }).catch((error) => {
          // eslint-disable-next-line no-console
          console.error('@@ error => ', error)
        })

        this.clearForm()
      } else {
        alert('Por favor, completa todos los campos.')
      }
    },
    deleteBarbero (id) {
      // Peticion con axios
      this.$axios.delete(`/barber/${id}`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-type': 'application/json'
        }
      }).then((res) => {
        this.loadBarberos()
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.error('@@ error => ', error)
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
.container {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  color: #ffffff;
}

.form-section, .barbero-section {
  width: 48%;
  background-color: #333333;
  padding: 20px;
  border-radius: 8px;
}

h2 {
  color: #ffffff;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

input[type="text"], input[type="email"], input[type="password"], input[type="file"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #444444;
  border-radius: 5px;
  background-color: #222222;
  color: #ffffff;
}

.add-button, .edit-button, .delete-button {
  padding: 10px 15px;
  margin-right: 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.add-button {
  background-color: #28a745;
  color: #ffffff;
}

.edit-button {
  background-color: #ffc107;
  color: #ffffff;
}

.delete-button {
  background-color: #dc3545;
  color: #ffffff;
}

table {
  width: 100%;
  border-collapse: collapse;
  color: #ffffff;
}

th, td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #444444;
}

th {
  background-color: #555555;
}

.table-image, .preview-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 50%;
}
</style>
