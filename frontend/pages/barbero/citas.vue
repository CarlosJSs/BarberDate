<template>
  <div class="container">
    <div class="calendar-container">
      <!-- Botones de filtros -->
      <div class="filter-buttons">
        <h2>Filtros:</h2>
        <button class="tab-button all" @click="setFilter('all')">Todas las Citas</button>
        <button class="tab-button upcoming" @click="setFilter('upcoming')">Próximas Citas</button>
        <button class="tab-button completed" @click="setFilter('completed')">Citas Completadas</button>
        <button class="tab-button not-completed" @click="setFilter('not-completed')">Citas No Concretadas</button>
        <button class="tab-button pending" @click="setFilter('pending')">Citas Pendientes</button>
      </div>

      <!-- Cabecera del calendario -->
      <h2 class="calendar-title">BarberShop: Calendario de citas</h2>
      <div id="calendarHeader">
        <button class="calendar-nav" @click="changeMonth(-1)">ANTERIOR</button>
        <span class="calendar-title">{{ currentMonthName }} {{ currentYear }}</span>
        <button class="calendar-nav" @click="changeMonth(1)">SIGUIENTE</button>
      </div>

      <!-- Días del calendario -->
      <div id="calendarDays">
        <div v-for="day in daysOfWeek" :key="day" class="day">{{ day }}</div>
        <div v-for="n in firstDay" :key="'empty' + n" class="date" />
        <div
          v-for="day in daysInMonth"
          :key="day"
          class="date"
          :data-status="getCitaStatus(day)"
          @mouseenter="showAppointmentTooltip(day)"
          @mouseleave="hideAppointmentTooltip"
        >
          {{ day }}
          <!-- Tooltip al lado -->
          <div v-if="tooltipVisible && tooltipDay === day" class="tooltip">
            <div v-for="(cita, index) in tooltipCita" :key="index" class="tooltip-cita">
              <p><strong>Estado:</strong> {{ getStatusLabel(cita.status) }}</p>
              <p><strong>Cliente:</strong> {{ clienteMap[cita.client] || 'Desconocido' }}</p>
              <p><strong>Hora:</strong> {{ cita.time }}</p>
              <hr v-if="index < tooltipCita.length - 1" />
            </div>
          </div>
        </div>
      </div>
    </div>

   <!-- Sidebar unificada con tarjetas -->
   <div class="sidebar">
      <h2>Detalles de la Cita:</h2>
      <div v-for="cita in filteredCitas" :key="cita.date + cita.time" class="cita-detalle">
        <p><strong>Fecha:</strong> {{ cita.date }}</p>
        <p><strong>Cliente:</strong> {{ clienteMap[cita.client] || 'Desconocido' }}</p>
        <p><strong>Estado:</strong> {{ getStatusLabel(cita.status) }}</p>
        <p><strong>Hora:</strong> {{ cita.time }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import dayjs from 'dayjs'

export default {
  name: 'CitasPageBarbero',
  layout: 'barberoLayout',
  middleware: [
    'detect-push',
    'auth-role'
  ],
  data () {
    return {
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      currentFilter: 'all',
      barberoID: Cookies.get('userID'),
      citas: [],
      clientes: [],
      daysOfWeek: ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SAB'],
      tooltipVisible: false,
      tooltipDay: null,
      tooltipCita: {}
    }
  },
  computed: {
    clienteMap () {
      return this.clientes.reduce((map, cliente) => {
        map[cliente.id] = cliente.nombre
        return map
      }, {})
    },
    currentMonthName () {
      const monthNames = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE']
      return monthNames[this.currentMonth]
    },
    daysInMonth () {
      return new Date(this.currentYear, this.currentMonth + 1, 0).getDate()
    },
    firstDay () {
      return new Date(this.currentYear, this.currentMonth, 1).getDay()
    },
    filteredCitas () {
      return this.citas.filter((cita) => {
        if (this.currentFilter === 'all') { return true }
        if (this.currentFilter === 'upcoming' && cita.status === 'upcoming') { return true }
        if (this.currentFilter === 'completed' && cita.status === 'completed') { return true }
        if (this.currentFilter === 'not-completed' && cita.status === 'not-completed') { return true }
        if (this.currentFilter === 'pending' && cita.status === 'pending') { return true }
        return false
      })
    }
  },
  mounted () {
    const cookieToken = Cookies.get('token')
    if (!cookieToken) {
      this.$router.push('/')
    }
    this.loadCitas()
    this.loadClientes()
  },
  methods: {
    loadCitas () {
      this.token = Cookies.get('token')

      this.$axios.get(`/citas/barbero/${this.barberoID}`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then((res) => {
        // eslint-disable-next-line no-console
        console.log('@@@ res => ', res.data)
        if (res.data.message === 'success') {
          this.citas = res.data.citas.map(cita => ({
            date: cita.fecha,
            time: cita.hora,
            client: cita.clienteID,
            status: this.defStatus(cita.status, cita.fecha, cita.hora)
          }))
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
    setFilter (filter) {
      this.currentFilter = filter
    },
    changeMonth (direction) {
      this.currentMonth += direction
      if (this.currentMonth < 0) {
        this.currentMonth = 11
        this.currentYear -= 1
      } else if (this.currentMonth > 11) {
        this.currentMonth = 0
        this.currentYear += 1
      }
    },
    getCitaStatus (day) {
      const date = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const citasDelDia = this.filteredCitas.filter(c => c.date === date)

      if (citasDelDia.length > 1) { return 'multiple' } // Por si hay varias citas en un día
      return citasDelDia.length ? citasDelDia[0].status : null
    },
    showAppointmentTooltip (day) {
      const date = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const citasDelDia = this.filteredCitas.filter(c => c.date === date)
      if (citasDelDia.length) {
        this.tooltipVisible = true
        this.tooltipDay = day
        this.tooltipCita = citasDelDia // almacenamos todas las citas del día
      }
    },
    hideAppointmentTooltip () {
      this.tooltipVisible = false
      this.tooltipDay = null
      this.tooltipCita = []
    },
    getStatusLabel (status) {
      return status === 'completed'
        ? 'Concretada'
        : status === 'upcoming'
          ? 'Próxima'
          : status === 'not-completed'
            ? 'No concretada'
            : status === 'pending'
              ? 'Pendiente de Aceptar/Declinar'
              : 'Desconocido'
    },
    defStatus (status, fecha, hora) {
      const ahora = dayjs()
      const citaTime = dayjs(`${fecha} ${hora}`)

      if (status === 'aproved' && citaTime.isAfter(ahora)) {
        return 'upcoming'
      }
      if (status === 'aproved' && citaTime.isBefore(ahora)) {
        return 'completed'
      }
      if (status === 'denied') {
        return 'not-completed'
      }
      if (status !== 'aproved' && status !== 'denied' && citaTime.isAfter(ahora)) {
        return 'pending' // Cita pendiente si no está aprobada ni denegada y es futura
      }
    }
  }
}

</script>

<style scoped>
/* Fondo completo */
body {
  margin: 0;
  padding: 0;
  background-image: url('https://i.pinimg.com/enabled_lo_mid/736x/b8/35/d6/b835d6d1d3af05ea0d7fea6db2688519.jpg');
  background-size: cover;
  background-position: center;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.container {
  background: rgba(152, 152, 152, 0.2);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  width: 90%;
  max-width: 1200px;
  margin: 20px auto;
  gap: 20px;
  align-items: center;
}

/* Calendario */
.calendar-container {
  width: 100%;
  text-align: center;
  background: linear-gradient(135deg, rgba(0, 106, 255, 0.518), #004bad85);
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  color: #fff;
}

#calendarHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.calendar-title {
  font-size: 2em;
  font-weight: bold;
  text-transform: uppercase;
  padding: 5px 15px;
  border-radius: 10px;
  background: linear-gradient(135deg, #002550, #003b7a);
  color: #fff;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
}

/* Días del calendario */
#calendarDays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  background: rgba(255, 255, 255, 0.1);
  padding: 10px;
  border-radius: 10px;
}

.day,
.date {
  text-align: center;
  padding: 10px;
  font-weight: bold;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
}

.date {
  border: 1px solid rgba(255, 255, 255, 0.3);
  height: 60px;
  line-height: 30px;
  position: relative;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.3s;
}

.date:hover {
  transform: scale(1.05);
  background: rgba(255, 255, 255, 0.3);
}

.date[data-status="completed"] {
  background-color: green;
}

.date[data-status="upcoming"] {
  background-color: rgb(183, 183, 14);
}

.date[data-status="not-completed"] {
  background-color: red;
}

.date[data-status="multiple"] {
  background-color: orangered;
}

.sidebar {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: space-evenly;
  background: linear-gradient(135deg, rgba(0, 106, 255, 0.518), #004bad85);
  color: #fff;
  padding: 20px;
  border-radius: 15px;
  max-height: 85vh;
  max-width: 1200px;
  overflow-y: auto;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.sidebar h2 {
  width: 100%;
  margin-bottom: 20px;
  font-size: 1.5em;
  text-align: center;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
}

.cita-detalle {
  flex: 1 1 300px;
  min-width: 300px;
  max-width: 400px;
  background: linear-gradient(135deg, #004aad, #007bff);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  padding: 15px;
  margin: 10px;
  color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.cita-detalle:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.cita-detalle p {
  margin: 5px 0;
  font-size: 1em;
}

/* Botones vistosos */
.calendar-nav {
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 15px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s ease;
}

.calendar-nav:hover {
  background-color: #0056b3;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Tooltip */
.tooltip {
  position: absolute;
  right: 110%;
  top: 0;
  background-color: #333;
  color: #fff;
  border-radius: 8px;
  padding: 10px;
  width: 220px;
  max-height: 250px;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 2;
}

/* Botones de filtros */
.filter-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  justify-content: center;
}

.tab-button {
  padding: 10px;
  font-size: 1em;
  cursor: pointer;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  text-transform: uppercase;
}

.tab-button.all {
  background-color: #007bff;
}

.tab-button.upcoming {
  background-color: yellow;
  color: black;
}

.tab-button.completed {
  background-color: green;
}

.tab-button.not-completed {
  background-color: red;
}

.tab-button.pending {
  background-color: gray;
}

</style>
