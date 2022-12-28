<script>

    import {mapStores} from 'pinia'
    import { useCinemaxxStore } from '../stores/cinemaxx'

    export default {
        data() {
            return {
                email: '',
                password: '',
            }
        },
        mounted() {
            google.accounts.id.initialize({
                client_id: "268771724902-2oinm8bb7m5bj6cnh90ls3mpv6js9u0n.apps.googleusercontent.com",
                callback: this.handleCredentialResponse
            });
            google.accounts.id.renderButton(
                document.getElementById("buttonDiv"),
                { theme: "outline", size: "large" }  // customization attributes
            );
        },
        computed: {
            ...mapStores(useCinemaxxStore)
        },
        methods: {
            async handleLogin() {
                const obj = {
                    email: this.email,
                    password: this.password,
                }
                this.cinemaxxStore.login(obj)
                this.email = ''
                this.password = ''
            },
            handleCredentialResponse(response) {
                this.cinemaxxStore.handleCredentialResponse(response)
            }

        }
    }

</script>

<template>

<section  class="section" id="login-section" >
    <div class="container" >
        <div class="shadow-lg row d-flex justify-content-center" id="login-div">
            <form @submit.prevent="handleLogin" class="text-white d-flex flex-column col-6" style="margin: 16px 0px 16px 0px" id="register-form">
                <section>
                    <div class="mb-3">
                    <label for="register-email" class="form-label">Email address</label>
                    <input type="email" class="form-control text-white border-gray bg-transparent" id="register-email" aria-describedby="register-email" required v-model="this.email" >
                    </div>
                    <div class="mb-3">
                    <label for="register-password" class="form-label">Password</label>
                    <input type="password" class="form-control text-white border-gray bg-transparent" id="register-password" required minlength="5" v-model="this.password">
                    </div>
                </section>
                <button type="submit" class="mx-auto mt-2 btn border-white text-warning btn-transparent col-3" >Sign In</button>
            </form>
        </div>

        <div class="row d-flex justify-content-center my-3">
            <div class="col-6 text-center">
                <h7 class="text-white">OR Sign-in with Google</h7>
            </div>
        </div>

        <div class="row d-flex justify-content-center">
            <div class="col-2">
                <div id="buttonDiv"></div>
            </div>
        </div> 
    </div>
    </section>


</template>