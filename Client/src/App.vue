<script>
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'

import {mapStores, mapWritableState} from 'pinia'
import { useCinemaxxStore } from './stores/cinemaxx'


export default{
  components: {
    Navbar,
    Footer,
  },
  created() {
    this.checkAccessToken()
  },
  computed: {
    // other computed properties
    ...mapStores(useCinemaxxStore),
    ...mapWritableState(useCinemaxxStore, ['loginStatus'])
  },
  methods: {
    checkAccessToken() {
      this.cinemaxxStore.fetchGenres()
      this.cinemaxxStore.fetchMovies()
      if(localStorage.access_token) {
        this.cinemaxxStore.fetchBookmark()
        this.loginStatus = true
      } else {
        this.$router.push('/')
      }
    },
    clickCallback (pageNum) {
      console.log(pageNum)
    }
  }
}
</script>

<template>
  <Navbar />
  <router-view/>

  <Footer />
</template>