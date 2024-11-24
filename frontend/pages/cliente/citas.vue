<template>
  <div class="container">
    <!-- Sección del formulario -->
    <div class="form-section">
      <h2>Agendar una cita</h2>
      <div class="form-group">
        <label>Nombre de la cita</label>
        <input v-model="cita.nombre" type="text" placeholder="">
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
      <div class="form-group date-time-section">
        <div class="date-container">
          <label>Fecha</label>
          <v-date-picker
            v-model="cita.fecha"
            :min="fechaActual"
          />
        </div>
        <div class="time-container">
          <label>Horario</label>
          <v-select
            v-model="cita.hora"
            clearable
            label="Horario"
            :items="horariosBarbero"
            variant="outlined"
          />
        </div>
      </div>
      <div class="form-group">
        <label>Comentarios</label>
        <input v-model="cita.coments" type="text">
      </div>
      <div class="form-group">
        <button class="add-button" @click="requestCita">
          Solicitar cita
        </button>
      </div>
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
          <tr v-for="(myCita, index) in citasClienteFiltradas" :key="index">
            <td>{{ myCita.nombre }}</td>
            <td>{{ myCita.fecha }}</td>
            <td>{{ myCita.hora }}</td>
            <td>{{ barberosMap[myCita.barberoID] || 'Desconocido' }}</td>
            <td>{{ myCita.status }}</td>
            <td>
              <button v-if="myCita.status === 'pending'" class="cancel-button" @click="cancelCita(myCita.id)">
                Cancelar
              </button>
              <button v-else-if="myCita.status === 'denied'" class="delete-button" @click="deleteCita(myCita.id)">
                Eliminar
              </button>
              <button v-else class="archivar-button" @click="archivarCita(myCita)">
                Archivar
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
      clienteID: Cookies.get('userID'),
      fechaActual: new Date().toISOString().substr(0, 10)
    }
  },
  computed: {
    barberosMap () {
      return this.barberos.reduce((map, barbero) => {
        map[barbero.id] = barbero.nombre
        return map
      }, {})
    },
    horariosBarbero () {
      const barberSelected = this.barberos.find(barbero => barbero.id === this.cita.barberoID)
      return barberSelected ? barberSelected.horarios : []
    },
    citasClienteFiltradas () {
      return this.citasCliente.filter(cita => !cita.archivado)
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
    },
    archivarCita (cita) {
      cita.archivado = true

      this.$axios.put(`/citas/status/${cita.id}`, { archivado: true }, {
        headers: { Authorization: `Bearer ${this.token}` }
      }).then((res) => {
        if (res.data.message === 'success') {
          // eslint-disable-next-line no-console
          console.log('Cita archivada correctamente')
          this.loadMisCitas()
        }
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Error al archivar la cita:', error)
      })
    },
    cancelCita (id) {
      const body = {
        status: 'denied'
      }

      this.$axios.put(`/citas/status/${id}`, body, {
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
    },
    deleteCita (citaID) {
      this.$axios.delete(`/citas/${citaID}`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-type': 'application/json'
        }
      }).then((res) => {
        this.loadMisCitas()
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.error('@@ error => ', error)
      })
    }
  }
}
</script>

<style scoped>
/* General */
.container {
  display: flex;
  justify-content: space-between;
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
input[type="text"], input[type="date"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #444444;
  border-radius: 5px;
  background-color: #222222;
  color: #ffffff;
}

input[type="text"]:focus, input[type="date"]:focus {
  border-color: #00c6ff;
  box-shadow: 0 0 8px rgba(0, 198, 255, 0.5);
}

.date-time-section {
  display: flex;
  justify-content: space-between;
}

.date-container,
.time-container {
  width: 48%;
}

.date-container input,
.time-container .v-select {
  width: 100%;
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
  display: block;
  text-align: center;
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

.cancel-button {
  background: linear-gradient(90deg, #ffe344, #ccb800);
  color: #ffffff;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

.cancel-button:hover {
  background: linear-gradient(90deg, #ccbe00, #ffec44);
  box-shadow: 0 4px 10px rgba(255, 252, 68, 0.5);
}

.archivar-button {
  background: linear-gradient(90deg, #44ff44, #07cc00);
  color: #ffffff;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

.archivar-button:hover {
  background: linear-gradient(90deg, #07cc00, #44ff44);
  box-shadow: 0 4px 10px rgba(99, 255, 68, 0.5);
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
