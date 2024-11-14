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
            Hora: {{ cita.hora }}<br />
            Barbero: {{ cita.barbero }}<br />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Mensaje si no hay citas -->
    <p v-else>No hay citas programadas para esta selección.</p>
  </div>
</template>

<script>
export default {
  name: 'AdminDashboard',
  data () {
    return {
      citas: [
        { id: 1, nombre: 'Cita 1', fecha: '2024-11-15', hora: '10:00 AM', barbero: 1 },
        { id: 2, nombre: 'Cita 2', fecha: '2024-11-16', hora: '12:00 PM', barbero: 2 },
        { id: 3, nombre: 'Cita 3', fecha: '2024-11-17', hora: '02:00 PM', barbero: 3 }
      ],
      barberos: [
        { id: 1, nombre: 'Juan' },
        { id: 2, nombre: 'Carlos' },
        { id: 3, nombre: 'Luis' }
      ],
      filtroBarbero: null,
      filtroFecha: null,
      citasFiltradas: []
    }
  },
  methods: {
    filtrarCitas () {
      this.citasFiltradas = this.citas.filter((cita) => {
        const coincideBarbero = this.filtroBarbero ? cita.barbero === this.filtroBarbero : true
        const coincideFecha = this.filtroFecha ? cita.fecha === this.filtroFecha : true
        return coincideBarbero && coincideFecha
      })
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
    this.citasFiltradas = this.citas // Inicialmente mostramos todas las citas
  }
}
</script>

<style scoped>
h2 {
  text-align: center;
  margin-bottom: 20px;
}
</style>
