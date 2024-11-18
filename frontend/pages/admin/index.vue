<template>
  <div>
    <h2>Dashboard de Admins - Citas Programadas</h2>
    <!-- Filtros -->
    <v-row>
      <v-col cols="12" md="6">
        <v-select
          v-model="filtroBarbero"
          :items="barberos"
          label="Seleccionar Barbero"
          item-text="nombre"
          item-value="id"
          clearable
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-date-picker v-model="filtroFecha" label="Seleccionar Fecha" @input="filtrarCitas" />
      </v-col>
    </v-row>
    <!-- Lista de Citas Filtradas -->
    <v-row v-if="citasFiltradas.length">
      <v-col
        v-for="cita in citasFiltradas"
        :key="cita.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card>
          <v-card-title>{{ cita.nombre }}</v-card-title>
          <v-card-subtitle>{{ cita.fecha }}</v-card-subtitle>
          <v-card-text>
            Hora: {{ cita.hora }}<br>
            Barbero: {{ barberosMap[cita.barberoID] || 'Barbero desconocido' }}<br>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <!-- Mensaje si no hay citas -->
    <p v-else>
      No hay citas programadas para esta selección.
    </p>
  </div>
</template>

<script>
import Cookies from 'js-cookie'

export default {
  name: 'AdminDashboard',
  layout: 'adminLayout',
  middleware: [
    'detect-push',
    'auth-role'
  ],
  data () {
    return {
      citas: [],
      barberos: [],
      filtroBarbero: null,
      filtroFecha: null,
      citasFiltradas: []
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
  watch: {
    filtroBarbero () {
      this.filtrarCitas()
    },
    filtroFecha () {
      this.filtrarCitas()
    }
  },
  mounted () {
    const cookieToken = Cookies.get('token')
    if (!cookieToken) {
      this.$router.push('/')
    }
    this.loadCitas()
    this.loadBarberos()
  },
  methods: {
    filtrarCitas () {
      this.citasFiltradas = this.citas.filter((cita) => {
        const coincideBarbero = this.filtroBarbero ? cita.barberoID === this.filtroBarbero : true
        const coincideFecha = this.filtroFecha ? cita.fecha === this.filtroFecha : true
        return coincideBarbero && coincideFecha
      })
    },
    loadCitas () {
      this.token = Cookies.get('token')

      this.$axios.get('/citas/all', {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then((res) => {
        // eslint-disable-next-line no-console
        console.log('@@@ resCitas => ', res.data)
        if (res.data.message === 'success') {
          this.citas = res.data.cita
          this.citasFiltradas = this.citas
        }
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.log('@@@ error => ', error)
      })
    },
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
    }
  }
}
</script>

<style scoped>
h2 {
  text-align: center;
  margin-bottom: 20px;
}

</style>
