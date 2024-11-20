<template>
  <div class="container">
    <!--Este es el sidebar de filtros de citas (Proximas y completadas)-->
    <div class="sidebar">
      <h2>Filtros: </h2>
      <button class="tab-button" @click="showTab('proximas')">
        Próximas Citas
      </button>
      <button class="tab-button" @click="showTab('completadas')">
        Citas Completadas
      </button>
      <div id="citaDetalle" class="cita-detalle">
        <h3>Detalles de la Cita</h3>
        <p><strong>Fecha:</strong> - </p>
        <p><strong>Cliente/Barbero:</strong> - </p>
        <p><strong>Estado: </strong> - </p>
      </div>
    </div>

    <!-- Contenedor para el calendario...-->>
    <div class="calendar-container">
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
            <strong>Estado:</strong> {{ tooltipCita.status === "completed" ? "Concretada" : "Próxima" }} <br>
            <strong>Cliente:</strong> {{ tooltipCita.client }} <br>
            <strong>Barbero:</strong> {{ tooltipCita.barber }} <br>
            <strong>Hora:</strong> {{ tooltipCita.time }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      userRole: 'cliente', // Aquí se fuerza el rol de cliente pero puede ser 'cliente', 'barbero' o 'admin'

      citas: [
        { date: '2024-11-05', time: '10:30', client: 'Luis Martínez', barber: 'Carlos', status: 'completed' },
        { date: '2024-11-09', time: '14:00', client: 'Ana Pérez', barber: 'Carlos', status: 'upcoming' },
        { date: '2024-11-10', time: '16:30', client: 'Luis Martínez', barber: 'Juan', status: 'upcoming' },
        { date: '2024-10-30', time: '12:00', client: 'Carlos Gómez', barber: 'Luis', status: 'completed' }
      ], // Simulación para un perfil 'x' que pertenece a un cliente en este caso
      daysOfWeek: ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SAB'],
      tooltipVisible: false,
      tooltipDay: null,
      tooltipCita: {}
    }
  },

  computed: {
    currentMonthName () {
      const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
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
        if (this.userRole === 'cliente') {
          return cita.client === 'Luis Martínez' // Supongamos que un cliente Ej: Luis Martínez inició sesión...
        } else if (this.userRole === 'barbero') {
          return cita.barber === 'Carlos' // O supongamos que el empleado Carlos inició sesión
        } else {
          return true
        }
      })
    }

  },

  methods: {
    showTab (tabId) {
      const estado = tabId === 'proximas' ? 'Próxima' : 'Concretada'
      const detalleCita = document.getElementById('citaDetalle')
      detalleCita.innerHTML = `<h3>Detalles de las Citas</h3><p><strong>Estado:</strong> ${estado}</p>`
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
      const cita = this.filteredCitas.find(c => c.date === date)
      return cita ? cita.status : null
    },

    showAppointmentTooltip (day) {
      const date = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const cita = this.filteredCitas.find(c => c.date === date)
      if (cita) {
        this.tooltipVisible = true
        this.tooltipDay = day
        this.tooltipCita = cita
      }
    },

    hideAppointmentTooltip () {
      this.tooltipVisible = false
      this.tooltipDay = null
      this.tooltipCita = {}
    }
  }

}
</script>

<style scoped>

    *{
        box-sizing : border-box;
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
    }

    .container {
        display: flex;
        width: 90%;
        max-width: 1200px;
        margin : 20px auto;
        gap: 20px;
    }

    .sidebar{
        width: 25%;
        background-color: #f3f3f3;
        padding : 20px;
        border-radius: 8px;
    }

    .sidebar h2{
        margin-bottom: 20px;
        font-size: 1.2em;
    }

    .tab-button{
        display: block;
        width: 100%;
        padding: 10px;
        margin-bottom: 10px;
        font-size: 1em;
        cursor: pointer;
        color: #fff;
        background-color: #007bff;
        border: none;
        border-radius: 5px;
        text-align: left;
    }

    .cita-detalle{
        margin-top: 20px;
        padding : 10px;
        background-color: #fff;
        border: 1px solid #ddd;
        border-radius: 5px;
    }

    .cita-detalle h3{
        font-size: 1.1em;
        margin-bottom: 10px;
    }

    .calendar-container{
        width: 75%;
    }

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

    .day,
    .date{
        text-align: center;
        padding: 10px;
        font-weight: bold;
    }

    .day{
        background-color: #ddd;
    }

    .date{
        border: 1px solid #ddd;
        height: 50px;
        line-height: 30px;
        position: relative;
    }

    .date[data-status="completed"]{
        background-color: lightgreen;
    }

    .date[data-status="upcoming"]{
        background-color: yellow;
    }

    /*Este último corresponde a la ventana emergente que muestra
    los detalles de la cita */

    .tooltip{
        position: absolute;
        top: 60px;
        left: 20px;
        background-color: rgba(0, 0, 0, 0.8);
        color: #fff;
        padding: 8px;
        border-radius: 5px;
        font-size: 0.8em;
        width: 150px;
        z-index: 10;

    }

</style>
