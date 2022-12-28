<script>
    import {mapStores} from 'pinia'
    import { useCinemaxxStore } from '../stores/cinemaxx'

    export default {
        props: ['bookmark'],
        computed: {
            ...mapStores(useCinemaxxStore)
        }
    }

</script>

<template>

<div class="col-4 card-col">
    <div class="card bg-transparent text-white">
        <img @click="cinemaxxStore.getMovieById(bookmark.Movie.id)" :src="bookmark.Movie.imgUrl" alt="movie pic" class="card-img-top movie-image" >
        <div class="card-body">
            <div class="row">
                <div class="col-9">
                    <div class="card-title" >
                        <h4 v-text="bookmark.Movie.title"></h4>
                    </div>
                </div>
                <div class="col d-flex justify-content-between" style="font-size: 20px">
                    <div>
                        <i class="fa-solid fa-star text-gold"></i>
                        {{bookmark.Movie.rating}}
                    </div>
                    <div>
                        <a @click="cinemaxxStore.deleteFromBookmark(bookmark.Movie.id)" class="link link-unstyled bookmark" >
                            <i class="fa-solid fa-bookmark"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

        
        

</template>