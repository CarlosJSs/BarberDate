<template>
  <v-row justify="center" align="center">
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
  middleware: 'detect-push',
  mounted () {

  }
}
</script>
