<template>
  <div class="mainContainer">
    <v-container class="profile-page" fluid>
      <v-row justify="center" align="start" class="mt-10 ml-10">
        <!-- Card para el perfil del barbero -->
        <v-card class="profile-card" elevation="10" outlined>
          <v-row>
            <!-- Avatar del barbero -->
            <v-col cols="12" md="4" class="text-center">
              <v-avatar size="150" class="profile-avatar mb-4">
                <img
                  src="https://randomuser.me/api/portraits/men/1.jpg"
                  alt="Avatar Masculino"
                >
              </v-avatar>
            </v-col>

            <!-- Información del barbero -->
            <v-col cols="12" md="8" class="text-center text-md-left">
              <h2 class="text-uppercase profile-name">
                {{ user.nombre }}
              </h2>
              <p class="text-subtitle-1 profile-detail">
                Correo: {{ user.correo }}
              </p>
              <p class="text-subtitle-1 profile-detail">
                Usuario: {{ user.usuario }}
              </p>
              <p class="text-subtitle-1 profile-detail">
                Especialidad: {{ user.especialidad }}
              </p>
              <p class="text-subtitle-1 profile-detail">
                Experiencia: {{ user.experiencia }}
              </p>
            </v-col>
          </v-row>
        </v-card>

        <!-- Sección para actualizar información -->
        <div class="myContainer">
          <h2>Actualizar Tu Información</h2>
          <v-form ref="barberForm" v-model="valid">
            <!-- Especialidad -->
            <v-text-field
              v-model="formData.especialidad"
              label="Especialidad"
              outlined
              clearable
              :rules="[rules.required]"
            />

            <!-- Experiencia -->
            <v-text-field
              v-model="formData.experiencia"
              label="Años de Experiencia"
              type="number"
              outlined
              clearable
              :rules="[rules.required, rules.numeric]"
            />

            <!-- Horarios -->
            <v-card class="mb-4">
              <v-card-title>Tus horarios de trabajo</v-card-title>
              <v-divider />
              <v-card-text>
                <div class="horarios-container">
                  <v-row dense>
                    <v-col
                      v-for="(horario, index) in formData.horarios"
                      :key="index"
                      cols="6"
                      class="d-flex align-start"
                    >
                      <v-text-field
                        v-model="formData.horarios[index]"
                        label="Horario"
                        placeholder="Formato 24hrs"
                        outlined
                        dense
                        clearable
                        :rules="[rules.required]"
                      />
                      <v-btn
                        color="error"
                        icon
                        small
                        class="ml-2"
                        @click="removeHorario(index)"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </div>
                <v-btn color="primary" outlined @click="addHorario">
                  <v-icon left>
                    mdi-plus
                  </v-icon>
                  Agregar Horario
                </v-btn>
              </v-card-text>
            </v-card>

            <!-- Botón Guardar -->
            <v-btn :disabled="!valid" color="success" block @click="updateInfo">
              Guardar Cambios
            </v-btn>
          </v-form>
        </div>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Cookies from 'js-cookie'

export default {
  name: 'PerfilPageBarbero',
  layout: 'barberoLayout',
  middleware: [
    'detect-push',
    'auth-role'
  ],
  data () {
    return {
      user: {},
      barberoID: Cookies.get('userID'),
      valid: false,
      formData: {
        especialidad: '',
        experiencia: '',
        horarios: []
      },
      rules: {
        required: value => !!value || 'Este campo es obligatorio',
        numeric: value =>
          (!isNaN(value) && Number(value)) >= 0 || 'Debe ser un número válido'
      }
    }
  },
  mounted () {
    const cookieToken = Cookies.get('token')
    if (!cookieToken) {
      this.$router.push('/')
    }
    this.loadInfo()
  },
  methods: {
    loadInfo () {
      this.token = Cookies.get('token')

      this.$axios.get(`/barber/${this.barberoID}`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then((res) => {
        // eslint-disable-next-line no-console
        console.log('@@@ resBarbero => ', res.data)
        if (res.data.message === 'success') {
          this.user = res.data.barbero
          this.formData.horarios = this.user.horarios
          this.formData.especialidad = this.user.especialidad
          this.formData.experiencia = this.user.experiencia
        }
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.log('@@@ error => ', error)
      })
    },
    addHorario () {
      if (!this.formData.horarios) {
        this.formData.horarios = ['']
      }
      this.formData.horarios.push('')
    },
    removeHorario (index) {
      this.formData.horarios.splice(index, 1)
    },
    updateInfo () {
      if (this.$refs.barberForm.validate()) {
        // eslint-disable-next-line no-console
        console.log('Datos enviados:', this.formData)

        this.$axios.put(`/barber/${this.barberoID}`, this.formData, {
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-type': 'application/json'
          }
        }).then((res) => {
          // eslint-disable-next-line no-console
          console.log('@@ res update => ', res)
          if (res && res.data && res.data.message === 'success') {
            // eslint-disable-next-line no-console
            console.log('@@ res message => ', res.data.message)
            this.loadInfo()
          }
        }).catch((error) => {
          // eslint-disable-next-line no-console
          console.error('@@ error => ', error)
        })
      } else {
        // eslint-disable-next-line no-console
        console.warn('Formulario no válido')
      }
    }
  }
}
</script>

<style scoped>
/* Ajustes generales */
.profile-page {
  background-color: #222222;
  color: white;
  min-height: 100vh;
  padding-top: 20px;
}

.profile-card {
  max-width: 800px;
  background-color: #333333;
  border-radius: 15px;
  padding: 40px;
  width: 80%;
}

.profile-avatar img {
  border: 3px solid #007bff;
  border-radius: 50%;
}

.profile-name {
  font-size: 28px;
  font-weight: bold;
  color: #007bff;
}

.profile-detail {
  font-size: 18px;
}

.myContainer {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

/* Horarios dinámicos */
.horarios-container {
  max-height: 330px; /* Límite del scroll */
  overflow-y: auto; /* Scroll vertical */
  padding-right: 10px;
  padding-top: 6px;
}

.horarios-container::-webkit-scrollbar {
  width: 8px;
}

.horarios-container::-webkit-scrollbar-thumb {
  background-color: #007bff;
  border-radius: 4px;
}

.horarios-container::-webkit-scrollbar-track {
  background-color: #222222;
}

/* Botón de agregar horario */
.v-btn {
  margin-top: 6px;
}
</style>
