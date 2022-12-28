<script>

    import {mapStores} from 'pinia'
    import { useCinemaxxStore } from '../stores/cinemaxx'

    export default {
        computed: {
            ...mapStores(useCinemaxxStore)
        },
        methods: {
            async moveToBookmarks() {
                await this.cinemaxxStore.fetchBookmark()
                this.$router.push('/bookmark')
            },
            async moveToDashboard() {
                await this.cinemaxxStore.fetchMovies()
                await this.cinemaxxStore.fetchGenres()
                this.$router.push('/')
            },
        }
    }

</script>



<template>
    <nav class="navbar navbar-expand bg-black-transparent position-sticky top-30 start-0 shadow">
        <div class="container">
            <a class="navbar-brand hover"><img @click="moveToDashboard" id="logo" src="../assets/pictures/cinemaxx-logo.png" alt="logo" ></a>
            <ul class="navbar-nav d-flex align-items-center" v-if="cinemaxxStore.loginStatus">
                <li class="nav-item">
                    <a @click="moveToDashboard" class="nav-link fs-4 text-white" >Home</a>
                </li>
                <li class="nav-item">
                    <a @click="moveToBookmarks" class="nav-link fs-4 text-white" >Bookmarks</a>
                </li>
            </ul>

            <div class="navbar-text" v-if="!cinemaxxStore.loginStatus">
                <button class="btn bg-gold"  >
                    <router-link to="/login" class="text-dark undecorated-link">Sign In</router-link>
                </button>
                <button class="btn bg-gold" >
                    <router-link to="/register" class="text-dark undecorated-link">Register</router-link>
                </button>  
            </div>
            <div class="navbar-text" id="navbar-logout" v-if="cinemaxxStore.loginStatus">
                <button class="btn bg-gold" >
                    <a @click="cinemaxxStore.logout" class="text-dark undecorated-link">Log Out</a>
                </button>
            </div>
        </div>
    </nav>
    <hr class="mb-1">
</template>