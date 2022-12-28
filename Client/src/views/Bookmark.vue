<script>

    import BookmarkCard from './BookmarkCard.vue'
    import {mapStores} from 'pinia'
    import { useCinemaxxStore } from '../stores/cinemaxx'

    export default {
        components: {
            BookmarkCard
        },
        computed: {
            ...mapStores(useCinemaxxStore)
        }
    }

</script>

<template>


<section class="section">
    
    <div class="container">

        <div class="row card-row" >
            <BookmarkCard v-for="bookmark in cinemaxxStore.bookmarks" :key="bookmark.id" :bookmark="bookmark"/>
        </div>

        <div class="container text-center" v-if="(cinemaxxStore.bookmarks.length === 0)" style="margin-bottom: 800px">
            <h1 class="text-white">Looks like you haven't added a movie to your bookmark ...</h1>
        </div>

    </div>

    
</section>

</template>