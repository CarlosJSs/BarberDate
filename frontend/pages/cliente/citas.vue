<template>
  <div class="container">
    <!-- Sección del formulario -->
    <div class="form-section">
      <h2>Gestionar tus citas</h2>
      <div class="form-group">
        <label>Nombre de la cita</label>
        <input v-model="cita.nombre" type="text" placeholder="ej: primer sesion">
      </div>
      <div class="form-group">
        <v-select
          v-model="cita.barberoID"
          clearable
          label="Barbero"
          :items="barberos"
          item-text="nombre"
          item-value="id"
          variant="outlined"
        />
      </div>
      <div class="form-group">
        <label>Fecha</label>
        <input id="" v-model="cita.fecha" type="date" name="">
      </div>
      <div class="form-group">
        <v-select
          v-model="cita.hora"
          clearable
          label="Horario"
          :items="['8:30', '9:00', '14:00', '16:00']"
          variant="outlined"
        />
      </div>
      <div class="form-group">
        <label>Comentarios</label>
        <input v-model="cita.coments" type="text">
      </div>
      <button class="add-button" @click="requestCita">
        Solicitar cita
      </button>
    </div>

    <!-- Sección de la lista de barberos -->
    <div class="admin-section">
      <h2>Tus citas</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Barbero</th>
            <th>Estatus</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(myCita, index) in citasCliente" :key="index">
            <td>{{ myCita.nombre }}</td>
            <td>{{ myCita.fecha }}</td>
            <td>{{ myCita.hora }}</td>
            <td>{{ barberosMap[myCita.barberoID] || 'Desconocido' }}</td>
            <td>{{ myCita.status }}</td>
            <td>
              <button class="delete-button">
                Cancelar
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
  name: 'CitasPageCliente',
  layout: 'clienteLayout',
  middleware: [
    'detect-push',
    'auth-role'
  ],
  data () {
    return {
      barberos: [],
      citasCliente: [],
      cita: {
        nombre: '',
        fecha: '',
        hora: '',
        barberoID: '',
        coments: ''
      },
      clienteID: Cookies.get('userID')
    }
  },
  computed: {
    barberosMap () {
      return this.barberos.reduce((map, barbero) => {
        map[barbero.id] = barbero.nombre
        return map
      }, {})
    }
  },
  mounted () {
    const cookieToken = Cookies.get('token')
    if (!cookieToken) {
      this.$router.push('/')
    }
    this.loadBarberos()
    this.loadMisCitas()
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
        console.log('@@@ resBarber => ', res.data)
        if (res.data.message === 'success') {
          this.barberos = res.data.barber
        }
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.log('@@@ error => ', error)
      })
    },
    requestCita () {
      if (this.cita.nombre && this.cita.fecha && this.cita.hora && this.cita.barberoID && this.cita.coments) {
        const body = {
          nombre: this.cita.nombre,
          fecha: this.cita.fecha,
          hora: this.cita.hora,
          barberoID: this.cita.barberoID,
          clienteID: this.clienteID,
          status: 'pending',
          coments: this.cita.coments
        }

        this.$axios.post('/citas/request', body, {
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
            this.loadMisCitas()
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
    loadMisCitas () {
      this.token = Cookies.get('token')

      this.$axios.get(`/citas/cliente/${this.clienteID}`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then((res) => {
        // eslint-disable-next-line no-console
        console.log('@@@ resCitas => ', res.data)
        if (res.data.message === 'success') {
          this.citasCliente = res.data.citas
        }
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.log('@@@ error => ', error)
      })
    },
    clearForm () {
      this.cita = {
        nombre: '',
        fecha: '',
        hora: '',
        barberoID: '',
        coments: ''
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
