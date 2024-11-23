<template>
  <div class="container">
    <div class="sidebar">
      <h2>Detalles de la Cita:</h2>
      <div v-for="cita in filteredCitas" :key="cita.date + cita.time" class="cita-detalle">
        <p><strong>Fecha:</strong>{{ cita.date }}</p>
        <p><strong>Cliente:</strong>{{ cita.client }}</p>
        <p><strong>Barbero:</strong>{{ cita.barber }}</p>
        <p><strong>Estado:</strong>{{ getStatusLabel(cita.status) }}</p>
        <p><strong>Hora:</strong>{{ cita.time }}</p>
      </div>
    </div>

    <div class="calendar-container">
      <div class="filter-buttons">
        <h2>Filtros:</h2>
        <button class="tab-button all" @click="setFilter('all')">
          Todas las Citas
        </button>
        <button class="tab-button upcoming" @click="setFilter('upcoming')">
          Próximas Citas
        </button>
        <button class="tab-button completed" @click="setFilter('completed')">
          Citas Completadas
        </button>
        <button class="tab-button not-completed" @click="setFilter('not-completed')">
          Citas No Concretadas
        </button>
      </div>

      <h2>BarberShop: Calendario de citas</h2>
      <div id="calendarHeader">
        <button @click="changeMonth(-1)">
          ANTERIOR
        </button>
        <span>{{ currentMonthName }} {{ currentYear }}</span>
        <button @click="changeMonth(1)">
          SIGUIENTE
        </button>
      </div>

      <div id="calendarDays">
        <div v-for="day in daysOfWeek" :key="day" class="day">
          {{ day }}
        </div>
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
          <div v-if="tooltipVisible && tooltipDay === day" class="tooltip">
            <div v-for="(cita, index) in tooltipCita" :key="index">
              <strong>Estado:</strong> {{ getStatusLabel(cita.status) }} <br>
              <strong>Cliente:</strong> {{ cita.client }} <br>
              <strong>Barbero:</strong> {{ cita.barber }} <br>
              <strong>Hora: </strong> {{ cita.time }}
              <hr v-if="index < tooltipCita.length - 1">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'

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
      loggedUser: { name: 'pedro', role: 'barber' }, /* Acá simulamos las citas obtenidas de
      un empleado llamado pedro (Esto se reemplazará por los datos del login en backend) */
      currentFilter: 'all',

      citas: [
        { date: '2024-11-05', time: '10:30', client: 'Luis Martínez', barber: 'pedro', status: 'completed' },
        { date: '2024-11-26', time: '14:00', client: 'Juan Luis', barber: 'pedro', status: 'upcoming' },
        { date: '2024-11-30', time: '16:20', client: 'Mariana Reyes', barber: 'pedro', status: 'upcoming' },
        { date: '2024-11-01', time: '12:00', client: 'Jesús Adrián', barber: 'pedro', status: 'not-completed' },
        { date: '2024-11-14', time: '8:00', client: 'Alberto', barber: 'pedro', status: 'completed' },
        { date: '2024-11-14', time: '16:00', client: 'Jesús', barber: 'pedro', status: 'upcoming' }
      ], /* Simulación de una ""Base de datos"" para probar la funcionalidad de los filtros */

      daysOfWeek: ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SAB'],
      tooltipVisible: false,
      tooltipDay: null,
      tooltipCita: {}
    }
  },

  computed: {
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
        if (this.loggedUser.role === 'barber' && cita.barber !== this.loggedUser.name) { return false } // Filtrado de citas para un barbero (para clientes solo se cambia el "barber" por la etiqueta que tenga asignada el cliente)
        if (this.currentFilter === 'all') { return true }
        if (this.currentFilter === 'upcoming' && cita.status === 'upcoming') { return true }
        if (this.currentFilter === 'completed' && cita.status === 'completed') { return true }
        if (this.currentFilter === 'not-completed' && cita.status === 'not-completed') { return true }
        return false
      })
    }
  },

  mounted () {
    const cookieToken = Cookies.get('token')
    if (!cookieToken) {
      this.$router.push('/')
    }
  },

  methods: {
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
          : 'No concretada'
    }

  }
}

</script>

<style scoped>
.container{
  display: flex;
  width: 90%;
  max-width: 1200px;
  margin: 20px auto;
  gap: 20px;
}

.sidebar {
  width: 25%;
  background-color: #333;
  color: #fff;
  padding: 15px;
  border-radius: 8px;

}

.sidebar h2 {
  margin-bottom: 20px;
  font-size: 1.2em;

}

.cita-detalle{
  max-height: 400px;
  overflow-y: auto;
  padding: 10px;
  background-color: #8b8b8b;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-top: 20px;

}

.calendar-container{
  width: 75%;
}

.filter-buttons{
  display: flex;
  gap: 10px;
  margin-bottom: 20px;

}

.tab-button{
  padding: 10px;
  font-size: 1em;
  cursor: pointer;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  text-transform: uppercase;

}

.tab-button.all {background-color: #007bff;}
.tab-button.upcoming{background-color: yellow; color: black}
.tab-button.completed{background-color: green;}
.tab-button.not-completed{background-color: red;}

#calendarHeader{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

#calendarDays{
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}

.day, .date{
  text-align: center;
  padding: 10px;
  font-weight: bold;
}

.date{
  border: 1px solid #ddd;
  height: 50px;
  line-height: 30px;
  position: relative;

}

.date[data-status="completed"]{background-color: green;}
.date[data-status="upcoming"]{background-color: rgb(183, 183, 14);}
.date[data-status="not-completed"]{background-color: red;}
.date[data-status="multiple"]{background-color: orangered;}

.tooltip {
  position: absolute;
  top: 100px;
  left: 0;
  background-color: #333;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  width: 180px;
  z-index: 1;
  font-size: 0.9em;
  max-height: auto;
  overflow-y: auto;

}

</style>
