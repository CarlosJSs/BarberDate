<template>
  <div>
    <h2>Estas en el dashboard de los Clientes</h2>
  </div>
</template>

<script>
import Cookies from 'js-cookie'

export default {
  name: 'IndexPageCliente',
  layout: 'clienteLayout',
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
