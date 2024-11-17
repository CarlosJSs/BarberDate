<template>
  <v-row justify="center" align="center" class="index-background">
    <loginUser />
  </v-row>
</template>

<script>
import loginUser from '@/components/loginUser.vue'

export default {
  name: 'IndexPage',
  components: {
    loginUser
  },
  layout: 'login',
  middleware: 'detect-push'
}
</script>

<style scoped>
.index-background {
  background-color: #464646;
  width: 100vw;
  height: 100vh;
}
</style>
