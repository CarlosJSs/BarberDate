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
      <div class="form-group">
        <label>Foto del Barbero</label>
        <input type="file" @change="onFileChange">
        <img v-if="barbero.imagen" :src="barbero.imagen" class="preview-image">
      </div>
      <button @click="addBarbero" class="add-button">Agregar Barbero</button>
    </div>

    <!-- Sección de la lista de barberos -->
    <div class="barbero-section">
      <h2>Barberos en el Sistema</h2>
      <table>
        <thead>
          <tr>
            <th>Foto</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Usuario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(barbero, index) in barberos" :key="index">
            <td><img :src="barbero.imagen" class="table-image" v-if="barbero.imagen"></td>
            <td>{{ barbero.nombre }}</td>
            <td>{{ barbero.correo }}</td>
            <td>{{ barbero.usuario }}</td>
            <td>
              <button @click="editBarbero(index)" class="edit-button">Editar</button>
              <button @click="deleteBarbero(index)" class="delete-button">Borrar</button>
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
  middleware: 'detect-push',
  data () {
    return {
      barbero: {
        nombre: '',
        correo: '',
        usuario: '',
        contrasena: '',
        imagen: ''
      },
      barberos: []
    }
  },
  mounted () {
    const cookieToken = Cookies.get('token')
    if (!cookieToken) {
      this.$router.push('/')
    }
  },
  methods: {
    addBarbero () {
      if (this.barbero.nombre && this.barbero.correo && this.barbero.usuario && this.barbero.contrasena) {
        this.barberos.push({ ...this.barbero })
        this.clearForm()
      } else {
        alert('Por favor, completa todos los campos.')
      }
    },
    editBarbero (index) {
      this.barbero = { ...this.barberos[index] }
      this.barberos.splice(index, 1)
    },
    deleteBarbero (index) {
      this.barberos.splice(index, 1)
    },
    clearForm () {
      this.barbero = {
        nombre: '',
        correo: '',
        usuario: '',
        contrasena: '',
        imagen: ''
      }
    },
    onFileChange (e) {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.barbero.imagen = e.target.result
        }
        reader.readAsDataURL(file)
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
