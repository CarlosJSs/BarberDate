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
      <button class="add-button" @click="addAdmin">
        Agregar Admin
      </button>
    </div>

    <!-- Sección de la lista de administradores -->
    <div class="admin-section">
      <h2>Administradores en el Sistema</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Usuario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(admon, index) in administradores" :key="index">
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
  layout: 'adminLayout',
  middleware: [
    'detect-push',
    'auth-role'
  ],
  data () {
    return {
      admin: {
        nombre: '',
        usuario: '',
        contrasena: '',
        rol: ''
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
      this.$axios
        .get('/admin/all', {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })
        .then((res) => {
          if (res.data.message === 'success') {
            this.administradores = res.data.admin
          }
        })
        .catch((error) => {
          console.error(error)
        })
    },
    addAdmin () {
      if (this.admin.nombre && this.admin.usuario && this.admin.contrasena) {
        const body = {
          nombre: this.admin.nombre,
          usuario: this.admin.usuario,
          password: this.admin.contrasena
        }

        this.$axios
          .post('/admin/create', body, {
            headers: {
              Authorization: `Bearer ${this.token}`,
              'Content-type': 'application/json'
            }
          })
          .then((res) => {
            if (res.data.message === 'success') {
              this.loadAdmins()
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
    deleteAdmin (id) {
      this.$axios
        .delete(`/admin/${id}`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-type': 'application/json'
          }
        })
        .then(() => {
          this.loadAdmins()
        })
        .catch((error) => {
          console.error(error)
        })
    },
    clearForm () {
      this.admin = {
        nombre: '',
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
  align-items: flex-start;
  gap: 20px;
  padding: 20px;
  color: #ffffff;
}

/* Secciones */
.form-section, .admin-section {
  width: 48%;
  background: linear-gradient(145deg, #2b3745, #1c2431);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.form-section:hover, .admin-section:hover {
  transform: scale(1.02);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.5);
}

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

/* Formulario */
input[type="text"], input[type="password"] {
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
