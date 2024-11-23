<!-- eslint-disable vue/html-self-closing -->
<template>
  <div class="myStatusCont">
    <div class="card">
      <div class="btn1"></div>
      <div class="btn2"></div>
      <div class="btn3"></div>
      <div class="btn4"></div>
      <div class="card-int">
        <div class="hello">
          Próxima cita
          <span class="hidden">
            Cliente: {{ cita.client }}<br>
            Fecha: {{ cita.date }}<br>
            Hora: {{ cita.time }}<br>
            Comentarios: {{ cita.notes }}
          </span>
        </div>
      </div>
      <div class="top">
        <div class="camera">
          <div class="int"></div>
        </div>
        <div class="speaker"></div>
      </div>
    </div>

    <div class="watch">
      <div class="frame">
        <div class="text">
          <div>status:</div>
          <div>ocupado</div>
        </div>
      </div>
      <div class="sideBtn"></div>
      <div class="powerBtn"></div>
      <div class="dots">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'

export default {
  name: 'IndexPageBarbero',
  layout: 'barberoLayout',

  middleware: [
    'detect-push',
    'auth-role'
  ],

  data () {
    return {
      // Acá tenemos una simulación con los datos de la cita del barbero
      cita: {
        client: 'Jesús',
        barber: 'pedro',
        date: '2024-11-15',
        time: '16:00',
        services: ['Corte de Cabello', 'Afeitado'],
        duration: 45,
        notes: 'Prefiere un corte de estilo clásico y un afeitado limpio.',
        status: 'upcoming'
      }
    }
  },

  computed: {
    statusClass () {
      return this.cita.status === 'completed'
        ? 'status-completed'
        : this.cita.status === 'upcoming'
          ? 'status-upcoming'
          : 'status-not-completed'
    }

  },

  mounted () {
    const cookieToken = Cookies.get('token')
    if (!cookieToken) {
      this.$router.push('/')
    }
  },
  methods: {
    formatDate (date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Mexico_City' }
      return new Date(date).toLocaleDateString('es-ES', options)
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

.myStatusCont {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 4em;
}

.card {
  width: 315px;
  height: 600px;
  background: black;
  border-radius: 35px;
  border: 2px solid rgb(40, 40, 40);
  padding: 9px;
  position: relative;
  box-shadow: 2px 5px 15px rgba(0, 0, 0, 0.486);
  cursor: pointer;
}

.card-int {
  background-image: linear-gradient(to right bottom, #ff0000, #ff0045, #ff0078, #ea00aa, #b81cd7, #8a3ad6, #5746cf, #004ac2, #003d94, #002e66, #001d3a, #020812);
  background-size: 200% 200%;
  background-position: 0% 0%;
  height: 100%;
  border-radius: 25px;
  transition: all 0.6s ease-out;
  overflow: hidden;
}

.card:hover .card-int {
  background-position: 100% 100%;
}

.top {
  position: absolute;
  top: 0px;
  right: 50%;
  transform: translate(50%, 0%);
  width: 35%;
  height: 18px;
  background-color: black;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

.speaker {
  position: absolute;
  top: 2px;
  right: 50%;
  transform: translate(50%, 0%);
  width: 40%;
  height: 2px;
  border-radius: 2px;
  background-color: rgb(20, 20, 20);
}

.camera {
  position: absolute;
  top: 6px;
  right: 84%;
  transform: translate(50%, 0%);
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.048);
}

.int {
  position: absolute;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  top: 50%;
  right: 50%;
  transform: translate(50%, -50%);
  background-color: rgba(0, 0, 255, 0.212);
}

.btn1, .btn2, .btn3, .btn4 {
  position: absolute;
  width: 2px;
}

.btn1, .btn2, .btn3 {
  height: 45px;
  top: 30%;
  right: -4px;
  background-image: linear-gradient(to right, #111111, #222222, #333333, #464646, #595959);
}

.btn2, .btn3 {
  transform: scale(-1);
  left: -4px;
}

.btn2, .btn3 {
  transform: scale(-1);
  height: 30px;
}

.btn2 {
  top: 26%
}

.btn3 {
  top: 36%
}

.hello {
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  line-height: 35px;
  height: 100%;
  transition: 0.5s ease-in-out;
}

.hidden {
  display: block;
  opacity: 0;
  transition: all 0.3s ease-in;
  font-size: .44em;
  padding-left: 3em;
  padding-top: 3em;
  text-align: start;
}

.card:hover .hidden {
  opacity: 1;
}

.card:hover .hello {
  transform: translateY(-20px);
}

.watch {
  position: relative;
  transform: scale(0.7);
}
.watch::after,
.watch::before {
  content: "";
  width: 10rem;
  height: 200px;
  background: radial-gradient(circle at 200px, rgb(0, 0, 0), rgb(48, 48, 48));
  box-shadow: inset 0px -10px 18px #ffffffb9, 10px 0px 30px #00000071;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0%);
}
.watch::before {
  content: "";
  width: 10rem;
  height: 200px;
  background: radial-gradient(circle at 200px, rgb(0, 0, 0), rgb(48, 48, 48));
  box-shadow: inset 0px 10px 18px #ffffffb9, 10px 0px 30px #00000071;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -100%);
}
.dots {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 140%);
  padding: 3px;
  z-index: 20;
}
.dots .dot {
  width: 17px;
  aspect-ratio: 1;
  background-color: #000000;
  border-radius: 100px;
  display: block;
  margin-bottom: 50px;
  box-shadow: inset 2px 0 5px #ffffff48;
}
.frame {
  background: #0d0d0d;
  border-radius: 92px;
  box-shadow: inset 0 0 24px 1px #0d0d0d, inset 0 0 0 12px #606c78,
    0 20px 30px #00000071;
  height: 380px;
  margin: 0 20px;
  padding: 28px 26px;
  position: relative;
  width: 20rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.text {
  color: #dddf8f;
  font-size: 4em;
  font-family: serif;
  font-weight: bolder;
  line-height: 0.8;
  text-shadow: 0 0 40px #d7d886c7;
}
.frame::before {
  border: 1px solid #0d0d0d;
  border-radius: 80px;
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.5),
    inset 0 0 12px 2px rgba(255, 255, 255, 0.75);
  content: "";
  height: 356px;
  left: 12px;
  position: absolute;
  top: 12px;
  width: 18.625rem;
}
.sideBtn {
  background: #606c78;
  border-left: 1px solid #000;
  border-radius: 8px 6px 6px 8px / 20px 6px 6px 20px;
  box-shadow: inset 8px 0 8px 0 #1c1f23, inset -2px 0 6px #272c31,
    -4px 0 8px #0d0d0d40;
  height: 72px;
  position: absolute;
  right: 6px;
  top: 108px;
  width: 18px;
  z-index: 9;
}
.sideBtn::before {
  background: #272c31;
  border-radius: 20%;
  box-shadow: 0 -30px rgba(62, 70, 77, 0.75), 0 -27px #272c31, 0 -25px #000,
    0 -21px rgba(62, 70, 77, 0.75), 0 -18px #272c31, 0 -16px #000,
    0 -12px rgba(62, 70, 77, 0.75), 0 -9px #272c31, 0 -7px #000,
    0 -3px rgba(62, 70, 77, 0.75), 0 0 #272c31, 0 2px #000,
    0 6px rgba(62, 70, 77, 0.75), 0 9px #272c31, 0 11px #000,
    0 15px rgba(62, 70, 77, 0.75), 0 18px #272c31, 0 20px #000,
    0 24px rgba(62, 70, 77, 0.75), 0 27px #272c31, 0 29px #000;
  content: "";
  height: 3px;
  margin-top: -2px;
  position: absolute;
  right: 2px;
  top: 50%;
  width: 10px;
  z-index: 9;
}
.sideBtn::after {
  background: #16181b;
  border-radius: 2px 4px 4px 2px / 20px 8px 8px 20px;
  box-shadow: inset -2px 0 2px 0 #000, inset -6px 0 18px #272c31;
  content: "";
  height: 72px;
  position: absolute;
  right: 0;
  top: 0;
  width: 6px;
}

.powerBtn {
  background: #272c31;
  border-radius: 2px 4px 4px 2px / 2px 8px 8px 2px;
  box-shadow: inset 0 0 2px 1px #101315;
  height: 72px;
  position: absolute;
  right: 18px;
  top: 212px;
  width: 4px;
}

</style>
