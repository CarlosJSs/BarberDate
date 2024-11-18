<template>
  <div class="container">
    <!-- Sección de la lista de solicitudes -->
    <div class="solicitudes-section">
      <h2>Tus solicitudes de citas</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Cliente</th>
            <th>Estatus</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(solicitud, index) in soliPendientes" :key="index">
            <td>{{ solicitud.nombre }}</td>
            <td>{{ solicitud.fecha }}</td>
            <td>{{ solicitud.hora }}</td>
            <td>{{ clienteMap[solicitud.clienteID] || 'Desconocido' }}</td>
            <td>{{ solicitud.status }}</td>
            <td>
              <button class="agree-button" @click="respondRequest(solicitud.id, 'aproved')">
                Aceptar
              </button>
              <button class="delete-button" @click="respondRequest(solicitud.id, 'denied')">
                Declinar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Sección de la lista de solicitudes negadas -->
    <div class="solicitudes-section">
      <h2>Tus citas negadas</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Cliente</th>
            <th>Estatus</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(soliN, index) in soliNegadas" :key="index">
            <td>{{ soliN.nombre }}</td>
            <td>{{ soliN.fecha }}</td>
            <td>{{ soliN.hora }}</td>
            <td>{{ clienteMap[soliN.clienteID] || 'Desconocido' }}</td>
            <td>{{ soliN.status }}</td>
            <td>
              <button class="delete-button" @click="deleteCitaN(soliN.id)">
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
  name: 'SolicitudesPageBarbero',
  layout: 'barberoLayout',
  middleware: [
    'detect-push',
    'auth-role'
  ],
  data () {
    return {
      solicitudes: [],
      soliNegadas: [],
      soliPendientes: [],
      clientes: [],
      barberoID: Cookies.get('userID')
    }
  },
  computed: {
    clienteMap () {
      return this.clientes.reduce((map, cliente) => {
        map[cliente.id] = cliente.nombre
        return map
      }, {})
    }
  },
  watch: {
    solicitudes: {
      handler (newSolicitudes) {
        this.soliNegadas = newSolicitudes.filter(solicitud => solicitud.status === 'denied')
        this.soliPendientes = newSolicitudes.filter(solicitud => solicitud.status === 'pending')
      },
      inmediate: true
    }
  },
  mounted () {
    const cookieToken = Cookies.get('token')
    if (!cookieToken) {
      this.$router.push('/')
    }
    this.loadMisSolicitudes()
    this.loadClientes()
  },
  methods: {
    loadMisSolicitudes () {
      this.token = Cookies.get('token')

      this.$axios.get(`/citas/barbero/${this.barberoID}`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then((res) => {
        // eslint-disable-next-line no-console
        console.log('@@@ res => ', res.data)
        if (res.data.message === 'success') {
          this.solicitudes = res.data.citas
        }
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.log('@@@ error => ', error)
      })
    },
    loadClientes () {
      this.token = Cookies.get('token')

      this.$axios.get('/cliente/all', {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then((res) => {
        // eslint-disable-next-line no-console
        console.log('@@@ resClientes => ', res.data)
        if (res.data.message === 'success') {
          this.clientes = res.data.cliente
        }
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.log('@@@ error => ', error)
      })
    },
    respondRequest (id, response) {
      const body = {
        status: response
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
          this.loadMisSolicitudes()
        }
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.error('@@ error => ', error)
      })
    },
    deleteCitaN (id) {
      this.$axios.delete(`/citas/${id}`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-type': 'application/json'
        }
      }).then((res) => {
        this.loadMisSolicitudes()
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.error('@@ error => ', error)
      })
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

.form-section, .solicitudes-section {
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

.add-button, .agree-button, .delete-button {
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

.agree-button {
  background-color: #28a745;
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
