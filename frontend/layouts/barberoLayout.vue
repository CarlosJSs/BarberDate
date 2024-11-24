<template>
  <v-app dark>
    <div class="layout-container">
      <v-navigation-drawer
        permanent
        app
        class="navigation-drawer"
      >
        <v-list>
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            :to="item.to"
            router
            exact
            class="itemPage"
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-main class="scrollable-main">
        <v-container>
          <Nuxt />
        </v-container>
      </v-main>
      <v-footer
        :absolute="!fixed"
        app
      >
        <span>&copy; Powered by BarberDate {{ new Date().getFullYear() }}.</span>
      </v-footer>
    </div>
  </v-app>
</template>

<script>
export default {
  name: 'BarberoLayout',
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-monitor-dashboard',
          title: 'Dashboard',
          to: '/barbero'
        },
        {
          icon: 'mdi-calendar-range',
          title: 'Mis Citas',
          to: '/barbero/citas'
        },
        {
          icon: 'mdi-notebook-edit-outline',
          title: 'Solicitudes',
          to: '/barbero/solicitudes'
        },
        {
          icon: 'mdi-account-circle',
          title: 'Perfil',
          to: '/barbero/perfil'
        },
        {
          icon: 'mdi-logout',
          title: 'LogOut',
          to: '/'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js'
    }
  }
}
</script>

<style scoped>
.layout-container {
  display: flex;
  height: 100vh;
}
.navigation-drawer {
  position: fixed;
  height: 100%;
}
.scrollable-main {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}
.itemPage {
  margin-bottom: .8em;
  border: 1px solid #3b3b3b;
  border-radius: 16px;
}
</style>
