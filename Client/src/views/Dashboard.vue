<script>

import {mapStores} from 'pinia'
import { useCinemaxxStore } from '../stores/cinemaxx'
import MovieCard from './MovieCard.vue'

import Paginate from 'vuejs-paginate-next';

export default {
    components: {
        MovieCard,
        paginate: Paginate,
    },
    computed: {
        ...mapStores(useCinemaxxStore)
    },
    created() {
        this.checkAccessToken()
    },
    data() {
        return {
            currentGenre: '',
            currentPage: ''
        }
    },
    methods: {
        changeGenreAndOrPage(pageNum) {
            if(typeof pageNum !== 'number') {
                this.currentPage = 1
            }
            
            const obj = {
                genre: this.currentGenre,
                pageNumber: this.currentPage
            }

            this.cinemaxxStore.fetchMovies(obj)
        },
        checkAccessToken() {
            if(!localStorage.access_token || !this.cinemaxxStore.loginStatus) {
                this.currentGenre = ''
                this.currentPage = 1
            }
        }
    }
}
</script>


<template>

    <section id="dashboard-section" class="section">

    <div class="container">
        <div class="row d-flex justify-between align-items-end" style="margin-bottom:0">
            <div class="col-8">
                <h2 class="text-white" >MOVIES at Cinemaxx</h2>
            </div>
            <div class="col d-flex flex-row justify-content-end mt-3 text-white" style="gap:24px">
                <p>Now Playing</p>
                <p>Coming Soon</p>
                <p>On Demand</p>
            </div>
        </div>
        <hr style="height:3px; width:100%; border-width:0; color:white; background-color:white">
        <div class="row">
            <div class="dropdown d-flex align-items-center" style="gap:16px">
                <h6 class="text-muted" style="margin-top:1">Filter by genre</h6>
                <i class="fa-solid fa-filter" style="color:white"></i>
                <div>
                    <!-- <button class="btn btn-transparent text-white dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                        Genre
                    </button> -->

                    <select name="Genres" class="custom-select" v-model="this.currentGenre" @click="changeGenreAndOrPage" >
                        <option value="">All</option>
                        <option v-for="genre in cinemaxxStore.genres" :key="genre.id" v-text="genre.name" v-if="(cinemaxxStore.genres.length !== 0)"></option>
                    </select>

                    <!-- <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <li class="dropdown-item" v-for="genre in cinemaxxStore.genres" :key="genre.id" v-text="genre.name"></li>
                    </ul> -->
                </div>
            </div>
        </div>
    </div>

    <div class="container">

        <div class="row card-row" v-if="(cinemaxxStore.movies.length !== 0)">
            <MovieCard v-for="movie in cinemaxxStore.movies" :key="movie.id" :movie="movie" />
        </div>

    </div>

    <div class="container text-center" v-if="(cinemaxxStore.movies.length === 0)" style="margin-bottom: 600px; margin-top: 100px">
        <h1 class="text-white">There is only a cricket here ...</h1>
    </div>

    <div class="container mb-4">
        <div class="row justify-content-center">
            <div class="col-3">
                <paginate class="hover"
                    v-model="this.currentPage"
                    :page-count="20"
                    :page-range="3"
                    :margin-pages="2"
                    :click-handler="changeGenreAndOrPage"
                    :prev-text="'Prev'"
                    :next-text="'Next'"
                    :container-class="'pagination'"
                    :page-class="'page-item'"
                >
                </paginate>
            </div>
        </div>
    </div>

    </section>


</template>