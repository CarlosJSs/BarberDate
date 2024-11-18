<template>
  <div>
    <h2>Aqui observaras la lista de barberos</h2>
  </div>
</template>

<script>

export default {
  name: 'CitasPageCliente',
  layout: 'clienteLayout',
  middleware: [
    'detect-push',
    'auth-role'
  ]
}
</script>

<style>
</style>
