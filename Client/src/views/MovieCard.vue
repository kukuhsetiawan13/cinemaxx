<script>
    import {mapStores} from 'pinia'
    import { useCinemaxxStore } from '../stores/cinemaxx'

    export default {
        props: ['movie'],
        computed: {
            ...mapStores(useCinemaxxStore)
        },
        

    }

</script>


<template>

<div class="col-4 card-col" >
    <div class="card bg-transparent text-white">
        <img @click="cinemaxxStore.getMovieById(movie.id)" :src="movie.imgUrl" alt="movie pic" class="card-img-top movie-image" >
        <div class="card-body">
            
            <div class="d-flex justify-content-between" style="margin-bottom:8px">
                <div class="text-gold">
                    <i class="fa-solid fa-star text-gold"></i>
                    {{movie.rating}} / 10
                </div>
                <a @click="cinemaxxStore.addToBookmark(movie.id)" class="link link-unstyled bookmark" style="font-size: 20px">
                    <i class="fa-regular fa-bookmark"></i>
                </a>
                <!-- <a class="link link-unstyled bookmark">
                    <i class="fa-solid fa-bookmark"></i>
                </a> -->
            </div>

            <div class="card-title" >
                <h4 v-text="movie.title"></h4>
            </div>

        </div>
    </div>
</div>

</template>