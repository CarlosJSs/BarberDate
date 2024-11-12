<template>
  <div>
    <h2>Estas en las citas del barbero</h2>
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
