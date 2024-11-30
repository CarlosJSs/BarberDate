<template>
  <div class="container">
    <div class="calendar-container">
      <!-- Encabezado principal -->
      <header class="header-citas">
        <h1>MI AGENDA DE CITAS</h1>
      </header>
      <!-- Botones de filtros -->
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
        <button class="tab-button pending" @click="setFilter('pending')">
          Citas Pendientes
        </button>
      </div>
      <!-- Cabecera del calendario -->
      <div id="calendarHeader">
        <button class="calendar-nav" @click="changeMonth(-1)">
          ANTERIOR
        </button>
        <!-- Cambio de mes -->
        <span key="calendar-title" class="calendar-title">{{ currentMonthName }} DE {{ currentYear }}</span>
        <button class="calendar-nav" @click="changeMonth(1)">
          SIGUIENTE
        </button>
      </div>
      <!-- Días del calendario -->
      <div id="calendarDays" :key="currentMonth + '-' + currentYear">
        <div v-for="day in daysOfWeek" :key="day" class="day">
          {{ day }}
        </div>
        <div v-for="n in firstDay" :key="'empty' + n" class="date" />
        <div
          v-for="day in daysInMonth"
          :key="day"
          class="date"
          :class="{'today-highlight': isToday(day)}"
          :data-status="getCitaStatus(day)"
          @click="showAppointmentTooltip(day)"
        >
          {{ day }}
          <!-- Tooltip al lado -->
          <div v-if="isTooltipVisible(day)" class="tooltip">
            <div v-for="(cita, index) in tooltipCita" :key="index" class="tooltip-cita">
              <p><strong>Estado:</strong> {{ getStatusLabel(cita.status) }}</p>
              <p><strong>Cliente:</strong> {{ clienteMap[cita.client] || 'Desconocido' }}</p>
              <p><strong>Hora:</strong> {{ cita.time }}</p>
              <hr v-if="index < tooltipCita.length - 1"></hr>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sidebar unificada con tarjetas -->
    <div class="sidebar">
      <h2>Detalles de la Cita:</h2>
      <div v-for="cita in filteredCitas" :key="cita.date + cita.time" class="cita-detalle" :data-status="cita.status">
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
      tooltipCita: {},
      transitionDirection: 'next'
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
    },
    today () {
      const now = new Date()
      return {
        day: now.getDate(),
        month: now.getMonth(),
        year: now.getFullYear()
      }
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
    isToday (day) {
      return (
        this.today.day === day &&
        this.today.month === this.currentMonth &&
        this.today.year === this.currentYear
      )
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
      this.hideTooltip()
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
      this.hideTooltip()
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
      if (citasDelDia.length === 0) {
        this.hideTooltip()
        return
      }
      if (this.tooltipDay === day) {
        // Oculta el tooltip si se hace clic nuevamente en el mismo día
        this.hideTooltip()
      } else {
        // Muestra el tooltip para el día seleccionado
        this.tooltipDay = day
        this.tooltipCita = citasDelDia
      }
    },
    hideTooltip () {
      this.tooltipDay = null
      this.tooltipCita = []
    },
    isTooltipVisible (day) {
      return this.tooltipDay === day
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
  background-size: cover;
  background-position: center;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Primera barra (Donde van los filtros y el calendario) */
.container {
  background: rgba(152, 152, 152, 0.2);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  margin: 20px auto;
  gap: 20px;
  align-items: center;
}

/* Configuración del calendario */
.calendar-container {
  width: 100%;
  text-align: center;
  background: linear-gradient(135deg, #2b2c34, #004bad85);
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
  background: linear-gradient(135deg, #002550, #1b6fc9);
  color: #fff;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
}

/* Días del calendario */
#calendarDays {
  position: relative;
  height: auto;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  background: rgba(255, 255, 255, 0.1);
  padding: 10px;
  border-radius: 10px;
}

/*Configuración de estilos para las cuadriculas de los días (Colores)*/
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
  transition: transform 0.2s ease-in-out;
}

.date:hover {
  transform: scale(1.05);
  background: rgba(255, 255, 255, 0.3);
}

.date:hover .tooltip {
  opacity: 1;
  transform: scale(1);
  pointer-events: auto;
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

.date[data-status="pending"] {
  background-color: gray;
}

.date[data-status="multiple"] {
  background-color: rgb(14, 146, 255);
}

.header-citas {
  text-align: center;
  margin-bottom: 10px;
  color: #01b5f6;
}

/* Segunda barra (Donde estarán las tarjetas de los días individuales) */

.sidebar {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: space-evenly;
  background: linear-gradient(135deg, #2b2c34, #004bad85);
  color: #fff;
  padding: 20px;
  border-radius: 15px;
  max-height: 85vh;
  max-width: 1200px;
  overflow-y: auto;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  margin-top: 80px;
}

.sidebar h2 {
  width: 100%;
  margin-bottom: 20px;
  font-size: 1.5em;
  text-align: center;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
}

/* Diseños para cada tarjeta que obtendrá la información de una cita (Colores, opacidad, degradado...)*/

.cita-detalle {
  flex: 1 1 300px;
  min-width: 300px;
  max-width: 400px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s;
}

.cita-detalle:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.cita-detalle[data-status="completed"] {
  background: rgba(50, 205, 50, 0.5); /* Fondo verde con opacidad */
  background: linear-gradient(135deg, rgba(38, 188, 33, 0.5), rgba(50, 205, 50, 0.5)); /* Gradiente con opacidad */
  backdrop-filter: blur(10px); /* Efecto de vidrio (desenfoque) */
  border-radius: 10px; /* Bordes redondeados */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Sombra para darle profundidad */
  color: #fff; /* Texto blanco */
  padding: 10px; /* Espaciado interno. (Las mismas configuraciones se aplican para cada estado CON SU RESPECTIVO COLOR) */
}

.cita-detalle[data-status="completed"]:hover {
  box-shadow: 0 6px 20px rgba(0, 255, 0, 0.8);
}

.cita-detalle[data-status="upcoming"] {
  background: linear-gradient(135deg, rgba(187, 168, 0, 0.5), rgba(255, 230, 0, 0.5));
  backdrop-filter: blur(10px);
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  color: #fff;
  padding: 10px;
}

.cita-detalle[data-status="upcoming"]:hover {
  box-shadow: 0 6px 20px rgba(255, 255, 0, 0.8)
}

.cita-detalle[data-status="not-completed"] {
  background: linear-gradient(135deg, rgba(139, 0, 0, 0.5), rgba(255, 69, 0, 0.5));
  backdrop-filter: blur(10px);
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  color: #fff;
  padding: 10px;
}

.cita-detalle[data-status="not-completed"]:hover {
  box-shadow: 0 6px 20px rgba(255, 0, 0, 0.8);
}

.cita-detalle[data-status="pending"] {
  background: linear-gradient(135deg, rgba(68, 68, 68, 0.5), rgba(136, 136, 136, 0.5));
  backdrop-filter: blur(10px);
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  color: #fff;
  padding: 10px;
}

.cita-detalle[data-status="pending"]:hover {
  box-shadow: 0 6px 20px rgba(128, 128, 128, 0.8);
}

/* Botones del calendario Anterior y siguiente vistosos */
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

/* Indicador del día actual */
.today-highlight {
  background-color: #bbbbbb; /* Color de iluminación (Este solo se muestra solamente si en el día actual no hay citas) */
  color: #000; /* Texto oscuro (Como indicador extra para indicar el día*/
  font-weight: bold;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.9); /* Aura iluminada (También puesta como un indicador extra para señalizar el día actual) */
  transform: scale(1.1);
  transition: transform 0.2s ease, box-shadow 0.3s ease;
}

/* Tooltip (Objeto dedicado a mostrar las citas de un día seleccionado por el barbero) */
.tooltip {
  position: absolute;
  right: 110%;
  top: 0;
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  border-radius: 8px;
  padding: 10px;
  width: 220px;
  max-height: 170px;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgb(0, 0, 0);
  z-index: 1000;
}

/* Configuración de los botones de filtros en general */
.filter-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  justify-content: center;
}

/* Configuración de diseño individual para cada botón de filtro (Tanto colores como reflejos e iluminación)*/
.tab-button {
  padding: 12px 20px;
  border-radius: 10px;
  font-weight: bold;
  color: white;
  text-transform: uppercase;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.326), rgba(255, 255, 255, 0.101));
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition: 0.3s ease;
}

.tab-button:hover {
  transform: scale(1.1);
}

.tab-button.all {
  background-color: #007bff;
}

.tab-button.all:hover {
  box-shadow: 0 6px 20px rgba(0, 123, 255, 0.8);
}

.tab-button.upcoming {
  background-color: yellow;
  color: black;
}

.tab-button.upcoming:hover {
  box-shadow: 0 6px 20px rgba(255, 255, 0, 0.8);
}

.tab-button.completed {
  background-color: green;
}

.tab-button.completed:hover {
  box-shadow: 0 6px 20px rgba(0, 255, 0, 0.8);
}

.tab-button.not-completed {
  background-color: red;
}

.tab-button.not-completed:hover {
  box-shadow: 0 6px 20px rgba(255, 0, 0, 0.8);
}

.tab-button.pending {
  background-color: gray;
}

.tab-button.pending:hover {
  box-shadow: 0 6px 20px rgba(128, 128, 128, 0.8);
}

</style>
