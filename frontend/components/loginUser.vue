<template>
  <div class="login-background">
    <div class="login-container">
      <div class="logo-section">
        <v-img
          src="https://i.pinimg.com/474x/52/72/e1/5272e1d139193872760ab684002bec21.jpg"
          max-width="200"
          contain
          alt="Barbería Logo"
        />
        <h1 class="logo-title">
          BarberDate
        </h1>
      </div>

      <!-- Sección derecha para el formulario -->
      <div class="form-section">
        <div class="form-card">
          <v-icon large class="profile-icon">
            mdi-account-circle
          </v-icon>
          <h2 class="form-title">
            {{ isSignUp ? 'Sign Up' : 'Login' }}
          </h2>

          <v-form>
            <!-- Campo Usuario -->
            <v-text-field
              v-model="usuario"
              label="Usuario"
              filled
              rounded
              dense
              :prepend-inner-icon="!usuario ? 'mdi-account' : ''"
              outlined
              class="form-input"
            />

            <!-- Campo Contraseña -->
            <v-text-field
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              label="Password"
              filled
              rounded
              dense
              :prepend-inner-icon="!password ? 'mdi-lock' : ''"
              outlined
              class="form-input"
            >
              <template #append>
                <v-icon @click="togglePasswordVisibility">
                  {{ showPassword ? 'mdi-eye-off' : 'mdi-eye' }}
                </v-icon>
              </template>
            </v-text-field>

            <!-- Campos adicionales para Sign Up -->
            <v-text-field
              v-if="isSignUp"
              v-model="name"
              label="Full Name"
              filled
              rounded
              dense
              outlined
              class="form-input"
            />
            <v-text-field
              v-if="isSignUp"
              v-model="email"
              label="Email"
              filled
              rounded
              dense
              outlined
              class="form-input"
            />
            <v-text-field
              v-if="isSignUp"
              v-model="phone"
              label="Phone"
              filled
              rounded
              dense
              outlined
              class="form-input"
            />

            <!-- Botón Login o Sign Up -->
            <v-btn block color="black" class="submit-btn" @click="handleSubmit">
              {{ isSignUp ? 'Sign Up' : 'Next' }}
            </v-btn>

            <!-- Separador y alternancia entre Login y Sign Up -->
            <div class="divider">
              or
            </div>
            <v-btn block outlined color="black" class="sign-up-btn" @click="toggleSignUp">
              {{ isSignUp ? 'Login' : 'Sign Up' }}
            </v-btn>
          </v-form>

          <p class="terms">
            By registering, you agree to the
            <span class="link">Terms, Conditions</span> and
            <span class="link">Policies</span> of BarberDate.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'

export default {
  data () {
    return {
      usuario: '',
      password: '',
      showPassword: false,
      isSignUp: false,
      name: '',
      email: '',
      phone: ''
    }
  },
  methods: {
    togglePasswordVisibility () {
      this.showPassword = !this.showPassword
    },
    toggleSignUp () {
      this.isSignUp = !this.isSignUp
    },
    handleSubmit () {
      if (this.isSignUp) {
        this.signUpBackend()
      } else {
        this.loginBackend()
      }
    },
    loginBackend () {
      if (!this.usuario || !this.password) {
        alert('Por favor ingresa usuario y contraseña.')
        return
      }

      const body = {
        usuario: this.usuario,
        password: this.password
      }

      this.$axios
        .post('auth/login', body)
        .then((res) => {
          if (res.data && res.data.token) {
            Cookies.set('token', res.data.token, { expires: 1, path: '/' })
            Cookies.set('role', res.data.role, { expires: 1, path: '/' })
            Cookies.set('userID', res.data.userID, { expires: 1, path: '/' })

            const role = res.data.role
            if (role === 'admin') {
              this.$router.push('/admin')
            } else if (role === 'barbero') {
              this.$router.push('/barbero')
            } else if (role === 'cliente') {
              this.$router.push('/cliente')
            } else {
              console.error('Rol desconocido: ', role)
            }
          }
        })
        .catch((error) => {
          console.error('@@ error => ', error)
          this.errorMessage =
            error.response?.data?.error || 'Error al iniciar sesión'
        })
    },
    signUpBackend () {
      if (!this.name || !this.email || !this.phone || !this.usuario || !this.password) {
        alert('Por favor completa todos los campos.')
        return
      }

      const body = {
        nombre: this.name,
        correo: this.email,
        telefono: this.phone,
        usuario: this.usuario,
        password: this.password
      }

      this.$axios
        .post('/cliente/create', body, {
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-type': 'application/json'
          }
        })
        .then((res) => {
          if (res && res.data && res.data.message === 'success') {
            alert('Su cuenta se ha creado con éxito')
            this.name = ''
            this.email = ''
            this.phone = ''
            this.usuario = ''
            this.password = ''
            this.toggleSignUp()
          }
        })
        .catch((error) => {
          console.error('@@ error => ', error)
        })
    }
  }
}
</script>

<style scoped>
/* Fondo */
.login-background {
  background-image: url('https://www.peluker.com/blog/wp-content/uploads/2024/03/%C2%BFcuanto-cuesta-una-barberia.jpeg');
  background-size: cover; /* Asegura que la imagen cubra todo el fondo */
  background-repeat: no-repeat; /* Evita que la imagen se repita */
  background-position: center; /* Centra la imagen en el fondo */
  width: 100vw; /* Asegura que ocupe el ancho completo */
  height: 100vh; /* Asegura que ocupe el alto completo */
  display: flex; /* Mantiene el layout de flexbox */
  align-items: center;
  justify-content: center;
}

/* Contenedor Principal */
.login-container {
  display: flex;
  max-width: 1000px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.3);
}

/* Sección del Logo */
.logo-section {
  flex: 1;
  background-color: #000000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: white;
}
.logo-title {
  font-size: 32px;
  font-weight: bold;
  margin-top: 20px;
  color: white;
  text-transform: uppercase;
}

/* Sección del Formulario */
.form-section {
  flex: 1.5;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(214, 214, 214);
  padding: 30px;
}

.form-card {
  max-width: 400px;
  width: 100%;
  background-color: #0000002e;
  padding: 30px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
}

.profile-icon {
  font-size: 60px;
  color: #1a1a1a;
}

.form-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #1a1a1a;
}

.form-input {
  margin-bottom: 20px;
}

.submit-btn {
  background-color: #1a1a1a;
  color: white;
  font-weight: bold;
  margin-bottom: 10px;
}

.sign-up-btn {
  color: #1a1a1a;
  font-weight: bold;
}

.divider {
  margin: 20px 0;
  font-size: 14px;
  color: #000000;
}

.terms {
  font-size: 12px;
  color: #888;
  margin-top: 20px;
}

.terms .link {
  text-decoration: underline;
  cursor: pointer;
  color: #1a1a1a;
}
</style>
