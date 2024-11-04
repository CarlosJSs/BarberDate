<template>
  <div>
    <h1>Admin iniciando sesion usando el backend</h1>
  </div>
</template>

<script>
import Cookies from 'js-cookie'

export default {
  middleware: 'detect-push',
  mounted () {
    // const token = localStorage.getItem('token')
    const cookieToken = Cookies.get('token')
    // eslint-disable-next-line no-console
    if (!cookieToken) {
      this.$router.push('/')
    }
  }
}
</script>
