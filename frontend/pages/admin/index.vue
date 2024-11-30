<template>
  <div class="dashboard-container">
    <h2>Dashboard de Admins - Visualizador de citas</h2> <br>
    <!-- Selector de Barberos -->
    <div class="centered-container">
      <p class="instruction-text">Si desea filtrar las citas por barbero, selecciónelo a continuación:</p>
      <v-select
        v-model="filtroBarbero"
        :items="barberos"
        label="Seleccionar Barbero"
        item-text="nombre"
        item-value="id"
        clearable
        outlined
        class="filter-element"
      />
    </div>

    <div class="centered-container">
      <v-btn @click="restaurarFiltros" color="primary" outlined>Restaurar filtros</v-btn>
    </div>

    <!-- Calendario -->
    <div class="centered-container">
      <p class="instruction-text">Por favor, indique la fecha:</p>
      <v-date-picker
        v-model="filtroFecha"
        label="Seleccionar Fecha"
        @input="filtrarCitas"
        class="filter-element date-picker-custom"
      />
    </div>

    <p class="resultados">
      <span v-if="!filtroBarbero && !filtroFecha">
        No se ha seleccionado fecha o barbero. Mostrando todas las citas ({{ citasFiltradas.length }} citas):
      </span>
      <span v-else>
        Se han encontrado {{ citasFiltradas.length }} citas:
      </span>
    </p>
    <!-- Lista de Citas Filtradas -->
    <v-row v-if="citasFiltradas.length" class="citas-container">
      <v-col
        v-for="cita in citasFiltradas"
        :key="cita.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card class="cita-card">
          <v-card-title>Nombre de la cita: {{ cita.nombre }}</v-card-title>
          <v-card-text>
            <strong>Agendada para el:</strong> {{ cita.fecha }}<br>
            <strong>Hora:</strong> {{ cita.hora }}<br>
            <strong>Barbero: </strong> {{ barberosMap[cita.barberoID] || 'Barbero desconocido' }}<br>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Mensaje si no hay citas -->
    <p v-else class="no-citas-text">
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
    restaurarFiltros () {
      this.filtroBarbero = null
      this.filtroFecha = null
      this.citasFiltradas = this.citas
    },
    loadCitas () {
      this.token = Cookies.get('token')

      this.$axios.get('/citas/all', {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then((res) => {
        if (res.data.message === 'success') {
          this.citas = res.data.cita
          this.citasFiltradas = this.citas
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    loadBarberos () {
      this.token = Cookies.get('token')

      this.$axios.get('/barber/all', {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then((res) => {
        if (res.data.message === 'success') {
          this.barberos = res.data.barber
        }
      }).catch((error) => {
        console.log(error)
      })
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  background: linear-gradient(135deg, #52525285, #2b2c34);
  font-size: 32px;
  color: #01b5f6 ;
  text-align: center;
  padding: 20px;
  margin-bottom: 50px;
}

.centered-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.cita-card {
  background: linear-gradient(135deg, #2b2c34, #004bad85);
  color: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.cita-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.date-picker-custom {
  background: linear-gradient(135deg, #2b2c34, #004bad85);
  color: #fff;
  border-radius: 16px;
  padding: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.date-picker-custom:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

/* Ajuste para los textos internos del date picker */
.date-picker-custom .v-input__control {
  color: #fff;
}

/* Ajuste del borde en los campos seleccionables */
.date-picker-custom .v-input {
  border: none;
}

.date-picker-custom .v-picker__actions button {
  background-color: rgba(255, 255, 255, 0.2);
  color: #fff;
  transition: background-color 0.3s ease;
}

.date-picker-custom .v-picker__actions button:hover {
  background-color: rgba(255, 255, 255, 0.4);
}

.instruction-text {
  color: rgb(255, 255, 255);
  font-size: 16px;
  font-weight: bold;
  margin: 30px 0 20px;
}

.resultados {
  color: #fff;
  font-size: 24px;
  font-weight: bold;
  margin-top: 60px;
  margin-bottom: 60px;
}

.filter-element {
  max-width: 400px;
  width: 100%;
}

.citas-container {
  margin-top: 20px;
}

.no-citas-text {
  margin-top: 20px;
  font-size: 18px;
  color: gray;
}
</style>
