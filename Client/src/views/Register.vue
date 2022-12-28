<script>

    import {mapStores} from 'pinia'
    import { useCinemaxxStore } from '../stores/cinemaxx'

    export default {
        data() {
            return {
                username: '',
                email: '',
                password: '',
                phoneNumber: '',
                address: ''
            }
        },
        computed: {
            ...mapStores(useCinemaxxStore)
        },
        methods: {
            async handleRegister() {
                const obj = {
                    username: this.username,
                    email: this.email,
                    password: this.password,
                    phoneNumber: this.phoneNumber,
                    address: this.address
                }
                this.cinemaxxStore.register(obj)
                this.username = ''
                this.email = ''
                this.password = ''
                this.phoneNumber = ''
                this.address = ''
            }
        }
    }

</script>


<template>

    <section id="register-section" class="section" >
    <div class="container" >
        <div class=" row d-flex justify-content-center" id="register-div">
                <form class="text-white d-flex flex-column col-6" style="margin: 16px 0px 16px 0px" id="register-form" @submit.prevent="handleRegister" >
                    <section>
                        <div class="mb-3">
                            <label for="register-username" class="form-label">Username</label>
                            <input type="text" class="form-control text-white border-gray bg-transparent" id="register-username" aria-describedby="register-username" v-model="this.username" >
                        </div>
                        <div class="mb-3">
                        <label for="register-email" class="form-label">Email address</label>
                        <input type="email" class="form-control text-white border-gray bg-transparent" id="register-email" aria-describedby="register-email" required v-model="this.email">
                        </div>
                        <div class="mb-3">
                        <label for="register-password" class="form-label">Password</label>
                        <input type="password" class="form-control text-white border-gray bg-transparent" id="register-password" required minlength="5" v-model="this.password">
                        </div>
                        <div class="mb-3">
                            <label for="register-phoneNumber" class="form-label">Phone Number</label>
                            <input type="text" class="form-control text-white border-gray bg-transparent" id="register-phoneNumber" aria-describedby="register-phoneNumber" v-model="this.phoneNumber" >
                        </div>
                        <div class="mb-3">
                            <label for="register-address" class="form-label">Address</label>
                            <input type="text" class="form-control text-white border-gray bg-transparent" id="register-address" aria-describedby="register-address" v-model="this.address">
                        </div>
                        </section>
        
                        <button style="margin-top:32px" type="submit" class="mx-auto btn border-white text-warning btn-transparent col-3">Register</button>
                </form>
        </div>
    </div>
    </section>

</template>