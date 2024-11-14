<template>
<!--  <div>
    <h2>Estas en el dashboard de los barberos</h2>
  </div> -->

  <!-- Este de acá abajo corresponde al componente de previsualización de la cita (podemos ponerlo posteriormente en un archivo aparte)-->
  <div class="mini-tarjeta-barbero">
    <div class="header">
      <h3>📅 ¡Hola, {{cita.barber}}!</h3>
    </div>
  <div class="info">
    <p>Estos son los datos de tu<strong> próxima cita:</strong></p>
    <p><strong>Cliente:</strong> {{ cita.client }}</p>
    <p><strong>Fecha:</strong> {{ formatDate(cita.date) }}</p>
    <p><strong>Hora:</strong> {{ cita.time }}</p>
    <p><strong>Servicios:</strong> {{ cita.services.join(', ') }}</p>
    <p v-if="cita.duration"><strong>Duración:</strong> {{ cita.duration }} min</p>
    <p v-if="cita.notes"><strong>Notas:</strong> {{ cita.notes }}</p>
    <p :class="['status', statusClass]"><strong>Estado:</strong> {{ getStatusLabel(cita.status) }}</p>
  </div>
  </div>

</template>

<script>
import Cookies from 'js-cookie'

export default {
  name: 'IndexPageBarbero',
  layout: 'barberoLayout',

  data(){
    return{
      //Acá tenemos una simulación con los datos de la cita del barbero
      cita: {
        client: "Jesús",
        barber: "pedro",
        date: "2024-11-15",
        time: "16:00",
        services: ["Corte de Cabello", "Afeitado"],
        duration: 45,
        notes: "Prefiere un corte de estilo clásico y un afeitado limpio.",
        status: "upcoming"
      }
    };
  },


  computed:{
    statusClass(){
      return this.cita.status === "completed"
      ? "status-completed"
      : this.cita.status === "upcoming"
      ? "status-upcoming"
      : "status-not-completed";
    }


  },
  methods:{
    formatDate(date){
      const options = {year: "numeric", month: "long", day: "numeric", timeZone: "America/Mexico_City"};
      return new Date(date).toLocaleDateString("es-ES", options);
    },
    getStatusLabel(status){
      return status === "completed" ? "Concretada" :
      status === "upcoming" ? "Próxima" :
      "No concretada";
    }
  },

  middleware: [
    'detect-push',
    'auth-role'
  ],

  mounted () {
    const cookieToken = Cookies.get('token')
    if (!cookieToken) {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.mini-tarjeta-barbero{
  width: 300px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background-color: #f5f5f5;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
}

.header h3{
  margin: 0;
  font-size: 1.2em;
  color: #333;
}

.info p{
  margin: 8px 0;
  font-size: 0.95em;
}

.status{
  font-weight: bold;
}

.status-completed{
  color: green;
}

.status-upcoming{
  color: #b7b70e;
}

.status-not-completed{
  color: red;
}

</style>
