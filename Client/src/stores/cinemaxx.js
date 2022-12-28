import { ref, computed } from "vue";
import { defineStore } from "pinia";
import axios from 'axios'
import swal from 'sweetalert';


export const useCinemaxxStore = defineStore('cinemaxx', {
  state: () => ({ 
    baseUrl: 'http://localhost:3000',
    genres: [],
    movies: [],
    bookmarks: [],
    moviesParam: {
        page: '',
        genre: ''
    },
    movie: {},
    qrcode: '',
    loginStatus: false
  }),
  getters: {
    doubleCount: (state) => state.count * 2,
  },
  actions: {
    async fetchGenres() {
        try {
            const {data} = await axios({
                method: 'get',
                url: this.baseUrl + '/genres/pub'
              });

            this.genres = data

        } catch(err) {
            if(err.response.data.message) {
                const error = err.response.data.message
                if(typeof error === 'string') {
                    swal({
                        title: error,
                        icon: "error",
                    });
                } else if (typeof error === 'object') {
                    swal({
                        title: error[0],
                        icon: "error",
                    });
                }
            } else {
                swal({
                    title: 'Internal Server Error',
                    icon: "error",
                });
            }
        }
    },
    async fetchMovies(obj) {
        try {
            let genre = ''
            let pageNumber = 1

            if(obj) {
                genre = obj.genre
                pageNumber = obj.pageNumber
            }

            const option = {
                method: 'get',
                url: this.baseUrl + '/movies/pub',
                params: {
                    page: {
                        size: 9,
                        number: pageNumber
                    },
                    filter: {
                        genre 
                    }
                }
            }

            const {data} = await axios(option);

            this.movies = data

        } catch(err) {
            if(err.response.data.message) {
                const error = err.response.data.message
                if(typeof error === 'string') {
                    swal({
                        title: error,
                        icon: "error",
                    });
                } else if (typeof error === 'object') {
                    swal({
                        title: error[0],
                        icon: "error",
                    });
                }
            } else {
                swal({
                    title: 'Internal Server Error',
                    icon: "error",
                });
            }
        }
    },
    async addToBookmark(movieId) {
        try {
            if (!this.loginStatus || !localStorage.access_token) {
                return swal({
                    title: "Please register or login first!",
                    icon: "error",
                });
            }

            const {data} = await axios({
                method: 'post',
                url: this.baseUrl + `/wishlists/pub/addToBookmark/${movieId}`,
                headers: {
                    access_token: localStorage.access_token
                }
            })

            swal({
                title: data,
                icon: "success",
            });
            await this.fetchBookmark()
            this.router.push('/bookmark')

        } catch (err) {
            if(err.response.data.message) {
                const error = err.response.data.message
                if(typeof error === 'string') {
                    swal({
                        title: error,
                        icon: "error",
                    });
                } else if (typeof error === 'object') {
                    swal({
                        title: error[0],
                        icon: "error",
                    });
                }
            } else {
                swal({
                    title: 'Internal Server Error',
                    icon: "error",
                });
            }
        }
    },
    async deleteFromBookmark(movieId) {
        try {
            const {data} = await axios({
                method: 'delete',
                url: this.baseUrl + `/wishlists/pub/deleteFromBookmark/${movieId}`,
                headers: {
                    access_token: localStorage.access_token
                }
            })

            swal({
                title: data,
                icon: "success",
            });

            await this.fetchBookmark()
            this.router.push('/bookmark')

        } catch (err) {
            const error = err.response.data.message

            swal({
                title: error,
                icon: "warning",
            });
        }
    },
    async fetchBookmark() {
        try {
            const {data} = await axios({
                method: 'get',
                url: this.baseUrl + `/wishlists/pub`,
                headers: {
                    access_token: localStorage.access_token
                }
            })

            this.bookmarks = data
        } catch(err) {
            if(err.response.data.message) {
                const error = err.response.data.message
                if(typeof error === 'string') {
                    swal({
                        title: error,
                        icon: "error",
                    });
                } else if (typeof error === 'object') {
                    swal({
                        title: error[0],
                        icon: "error",
                    });
                }
            } else {
                swal({
                    title: 'Internal Server Error',
                    icon: "error",
                });
            }
        }
    },
    async register(obj) {
        try {
            const {username, email, password, phoneNumber, address} = obj

            const {data} = await axios({
                method: 'post',
                url: this.baseUrl + '/users/pub/register',
                data: {
                    username,
                    email,
                    password, 
                    phoneNumber,
                    address
                }
            });

            swal({
                title: data.message,
                icon: "success",
            });

            localStorage.setItem('access_token', data.access_token)
            this.loginStatus = true

            await this.fetchGenres()
            await this.fetchMovies()
            await this.fetchBookmark()

            this.router.push('/')

        } catch(err) {
            if(err.response.data.message) {
                const error = err.response.data.message
                if(typeof error === 'string') {
                    swal({
                        title: error,
                        icon: "error",
                    });
                } else if (typeof error === 'object') {
                    swal({
                        title: error[0],
                        icon: "error",
                    });
                }
            } else {
                swal({
                    title: 'Internal Server Error',
                    icon: "error",
                });
            }
        }
    },
    async login(obj) {
        try {
            const {email, password} = obj

            const {data} = await axios({
                method: 'post',
                url: this.baseUrl + '/users/pub/login',
                data: {
                    email,
                    password, 
                }
            });

            swal({
                title: 'You are logged in',
                icon: "success",
            });

            this.loginStatus = true
            localStorage.access_token = data.access_token

            await this.fetchGenres()
            await this.fetchMovies()
            await this.fetchBookmark()

            this.router.push('/')
        } catch(err) {
            if(err.response.data.message) {
                const error = err.response.data.message
                if(typeof error === 'string') {
                    swal({
                        title: error,
                        icon: "error",
                    });
                } else if (typeof error === 'object') {
                    swal({
                        title: error[0],
                        icon: "error",
                    });
                }
            } else {
                swal({
                    title: 'Internal Server Error',
                    icon: "error",
                });
            }
        }

    },
    async handleCredentialResponse(response) {
        try {
            const {data} = await axios({
                method: 'POST',
                url: this.baseUrl + '/users/pub/google-login',
                headers: {
                    'google-oauth-token': response.credential
                }
            })

            swal({
                title: "You have succesfully log in!",
                icon: "success",
            });
            
            this.loginStatus = true
            localStorage.access_token = data.access_token
            
            await this.fetchGenres()
            await this.fetchMovies()
            await this.fetchBookmark()

            this.router.push('/')

        } catch (err) {
            if(err.response.data.message) {
                const error = err.response.data.message
                if(typeof error === 'string') {
                    swal({
                        title: error,
                        icon: "error",
                    });
                } else if (typeof error === 'object') {
                    swal({
                        title: error[0],
                        icon: "error",
                    });
                }
            } else {
                swal({
                    title: 'Internal Server Error',
                    icon: "error",
                });
            }
        }
    },
    async logout() {
        localStorage.clear()
        this.loginStatus = false

        swal({
            title: 'You have logged out!',
            icon: "success",
        });

        await this.fetchGenres()
        await this.fetchMovies()

        window.location.reload();

        this.router.replace('/')
    },
    async getMovieById(movieId) {
        try {

            const {data} = await axios({
                method: 'get',
                url: this.baseUrl + `/movies/pub/find/${movieId}`,
            });

            const result = await axios({
                method: 'get',
                url: `https://api.happi.dev/v1/qrcode`,
                params: {
                    data: 'https://cinemaxx-cwa.web.app' + `/movie-detail/${data.id}`
                },
                headers: {
                    'x-happi-key': '2f40a1nZQxEQ7VbP2dz2mKXqTGNgYNYa6INen1UwyNSJpTZdxpIZyWV1'
                }
            });

            this.qrcode = result.data.qrcode

            this.movie = data
            this.router.push(`/movie-detail/${data.id}`)

        } catch(err) {
            this.movie = ''
            if(err.response.data.message) {
                const error = err.response.data.message
                if(typeof error === 'string') {
                    swal({
                        title: error,
                        icon: "error",
                    });
                } else if (typeof error === 'object') {
                    swal({
                        title: error[0],
                        icon: "error",
                    });
                }
            } else {
                swal({
                    title: 'Internal Server Error',
                    icon: "error",
                });
            }
        }
    },
    

  },
})