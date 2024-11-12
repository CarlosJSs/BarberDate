<template>
  <v-app dark>
    <v-navigation-drawer
      permanent
      absolute
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
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
    <v-main>
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
  </v-app>
</template>

<script>
export default {
  name: 'AdminLayout',
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-account',
          title: 'Dashboard',
          to: '/admin'
        },
        {
          icon: 'mdi-account',
          title: 'Barberos',
          to: '/admin/barberos'
        },
        {
          icon: 'mdi-account',
          title: 'Admins',
          to: '/admin/admins'
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
