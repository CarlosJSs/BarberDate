<template>
  <div>
    <h2>Estas en el dashboard de los barberos</h2>
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
  mounted () {
    const cookieToken = Cookies.get('token')
    if (!cookieToken) {
      this.$router.push('/')
    }
  }
}
</script>

<style>
</style>
