<script>

    import {mapStores} from 'pinia'
    import { useCinemaxxStore } from '../stores/cinemaxx'

    export default {
        computed: {
            ...mapStores(useCinemaxxStore)
        },
        created() {
            this.fetchThisMovie()
        },  
        methods: {
            fetchThisMovie() {
                this.cinemaxxStore.getMovieById(this.$route.params.movieId)
            }
        }

    }

</script>

<template>

    <section class="section" style="margin-bottom: 100px">
        <div class="container" v-if="cinemaxxStore.movie">
            <div class="card bg-transparent">
                <div class="row">
                    <div class="col-4 mx-0" id="picture-holder">
                        <img :src="cinemaxxStore.movie.imgUrl" alt="movie-image">
                    </div>
                    <div class="col d-flex justify-content-between flex-column px-4 bg-white-transparent">
                        
                        <div class="d-flex justify-content-between">
                            <div class="d-flex flex-column mt-3" style="width: 80%; gap: 16px">
                                <div class="d-flex" style="gap: 8px">
                                    <i class="fa-solid fa-star text-gold" style="font-size: 20px"></i>
                                    <p class=text-gold>{{cinemaxxStore.movie.rating}} out of 10</p>
                                </div>
                                <h1 class="text-warning">{{cinemaxxStore.movie.title}}</h1>
                            </div>
                            <div class="d-flex align-items-start mt-3" style="gap:16px">
                                <!-- <a  class="link link-unstyled bookmark" style="font-size: 20px">
                                    <i class="fa-solid fa-bookmark"></i>
                                </a> -->
                                <img :src="cinemaxxStore.qrcode" alt="qrcode" id="qrcode">
                            </div>
                        </div>

                        <div class="text-white">
                            <div class="d-flex" style="gap:59px">
                                <h5>Genre: </h5>
                                <h5>{{cinemaxxStore.movie.Genre.name}}</h5>
                            </div>
                            <div class="d-flex" style="gap:50px">
                                <h5>Author: </h5>
                                <h5>{{cinemaxxStore.movie.User.username}}</h5>
                            </div>
                        </div>

                        <div class="d-flex justify-content-center">
                            <div class="text-center" style="width: 400px">
                                <hr style="height2px; width:100%; border-width:0; color:white; background-color:white">
                                <h4><a :href="cinemaxxStore.movie.trailerUrl" target="_blank" rel="noopener noreferrer">Watch Trailer</a></h4>
                                <hr style="height2px; width:100%; border-width:0; color:white; background-color:white">
                            </div>
                        </div>

                        <div style="margin-bottom: 32px">
                            <h3 class="text-warning">Synopsis</h3>
                            <p class="text-white">{{cinemaxxStore.movie.synopsis}}</p>
                        </div>

                    </div>
                </div>
            </div>
        </div>

        <div class="container text-center" v-if="(!cinemaxxStore.movie)" style="margin-bottom: 500px; margin-top: 100px">
            <h1 class="text-white">There is only a cricket here ...</h1>
        </div>

      </section>

</template>
