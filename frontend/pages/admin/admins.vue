<template>
  <div class="container">
    <!-- Sección del formulario -->
    <div class="form-section">
      <h2>Agregar / Modificar Administradores</h2>
      <div class="form-group">
        <label>Nombre del Admin</label>
        <input v-model="admin.nombre" type="text" placeholder="Ingrese el nombre">
      </div>
      <div class="form-group">
        <label>Usuario</label>
        <input v-model="admin.usuario" type="text" placeholder="Ingrese el usuario">
      </div>
      <div class="form-group">
        <label>Contraseña</label>
        <input v-model="admin.contrasena" type="password" placeholder="Ingrese la contraseña">
      </div>
      <div class="form-group">
        <label>Foto del Admin</label>
        <input type="file" @change="onFileChange">
        <img v-if="admin.imagen" :src="admin.imagen" class="preview-image">
      </div>
      <button class="add-button" @click="addAdmin">
        Agregar Admin
      </button>
    </div>

    <!-- Sección de la lista de barberos -->
    <div class="admin-section">
      <h2>Adminitradores en el Sistema</h2>
      <table>
        <thead>
          <tr>
            <th>Foto</th>
            <th>Nombre</th>
            <th>Usuario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(admon, index) in administradores" :key="index">
            <td><img v-if="admon.imagen" :src="admon.imagen" class="table-image"></td>
            <td v-show="false">
              {{ admon.id }}
            </td>
            <td>{{ admon.nombre }}</td>
            <td>{{ admon.usuario }}</td>
            <td>
              <button class="delete-button" @click="deleteAdmin(admon.id)">
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
  middleware: 'detect-push',
  data () {
    return {
      admin: {
        nombre: '',
        usuario: '',
        contrasena: '',
        rol: '',
        imagen: ''
      },
      administradores: []
    }
  },
  mounted () {
    const cookieToken = Cookies.get('token')
    if (!cookieToken) {
      this.$router.push('/')
    }
    this.loadAdmins()
  },
  methods: {
    loadAdmins () {
      this.token = Cookies.get('token')

      // Utilizamos Axios para el endpoint
      this.$axios.get('/admin/all', {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then((res) => {
        // eslint-disable-next-line no-console
        console.log('@@@ res => ', res.data)
        if (res.data.message === 'success') {
          this.administradores = res.data.admin
        }
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.log('@@@ error => ', error)
      })
    },
    addAdmin () {
      if (this.admin.nombre && this.admin.usuario && this.admin.contrasena) {
        const body = {
          nombre: this.admin.nombre,
          usuario: this.admin.usuario,
          password: this.admin.contrasena,
          rol: 'admin'
        }

        // Peticion a axios
        this.$axios.post('/admin/create', body, {
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
            this.loadAdmins()
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
    deleteAdmin (id) {
      // Peticion con axios
      this.$axios.delete(`/admin/${id}`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-type': 'application/json'
        }
      }).then((res) => {
        this.loadAdmins()
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.error('@@ error => ', error)
      })
    },
    clearForm () {
      this.admin = {
        nombre: '',
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
          this.admin.imagen = e.target.result
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

.form-section, .admin-section {
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
