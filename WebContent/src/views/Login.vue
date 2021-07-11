<template>
    <div class="lightbg">
            <v-row justify="center" align="center" class="login mx-3">
                <v-col md="4" sm="8" cols="12" align-self="center">
                    <v-card flat class="card-radius logincardbg">
                        <v-card-text class="py-10">
                            <v-row justify="center" no-gutters align="center" class="mt-10">
                                <v-col cols="3 text-center" align-self="center">
                                    <div class="logo">
                                        <h3 class="primary--text">ORION</h3>
                                    </div>
                                </v-col>
                            </v-row>
                            <v-row class="px-2 mt-5">
                                <v-col cols="12">
                                    <v-text-field label="E-mail" color="primary" v-model="email" :error-messages="errors.email" @blur="onEmailBlur()"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field label="Senha" color="primary" v-model="password" type="password" :error-messages="errors.password" @blur="onPasswordBlur()"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row class="px-3">
                                <v-col cols="12" md="6" class="mt-3">
                                    <v-btn color="primary" @click="login()" depressed block rounded large>Entrar</v-btn>
                                </v-col>
                                <v-col cols="12" md="6" class="mt-3">
                                    <v-btn color="primary" @click="$router.push('/new-user')" depressed block rounded outlined large>Cadastre-se</v-btn>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <!-- <div style="height: 500px; overflow: hidden;" ><svg viewBox="0 0 500 150" preserveAspectRatio="none" style="height: 100%; width: 100%;"><path d="M0.00,49.98 C149.99,250.00 349.20,-109.98 500.00,49.98 L500.00,250.00 L0.00,150.00 Z" style="stroke: none; fill: #EBEBEB;opacity:0.25"></path></svg></div>
            <div style="height: 350px; overflow: hidden;margin-top: -350px" ><svg viewBox="0 0 500 150" preserveAspectRatio="none" style="height: 100%; width: 100%;"><path d="M0.00,49.98 C149.99,250.00 349.20,-109.98 500.00,49.98 L500.00,250.00 L0.00,150.00 Z" style="stroke: none; fill: #EBEBEB;opacity:0.5"></path></svg></div>
            <div style="height: 250px; overflow: hidden;margin-top:-190px" ><svg viewBox="0 0 500 150" preserveAspectRatio="none" style="height: 100%; width: 100%;"><path d="M0.00,49.98 C149.99,250.00 349.20,-109.98 500.00,49.98 L500.00,250.00 L0.00,150.00 Z" style="stroke: none; fill: #E8E8E8;"></path></svg></div>
         -->
    </div>
</template>

<script>
import api from '../api.js';

export default {
    name: "Login",
    data() {
        return {
            email: '',
            password: '',
            errors: {
                email: '',
                password: '',
            },
        }
    },
    methods: {
        login() {
            if (this.email.length == 0) {
                this.errors.email = 'Campo de preenchimento obrigatório';
                return;
            }
            this.errors.email = '';

            if (this.password.length == 0) {
                this.errors.password = 'Campo de preenchimento obrigatório';
                return;
            }
            this.errors.password = '';

            let requestData = {
                useremail: this.email,
                password: this.password
            };

            api.doPost('/CooperativeEditor/login-api', requestData, (ok, status, data, error) => { 
                if (ok) {
                    if (data.isLoginValid) {
                        this.$root.isLoggedIn = true;
                        this.$router.push('/');
                    } else {
                        this.errors.email = this.errors.password = 'Usuário ou senha incorreto';
                    }
                } else {
                    //TODO:
                    //check status code (404, 500, ...)
                    //Display a snackbar
                    alert('Error: invalid user.');
                }
            });
        },

        onEmailBlur() {
            if (this.email.length > 0) {
                this.errors.email = '';
            }
        },

        onPasswordBlur() {
            if (this.password.length > 0) {
                this.errors.password = '';
            }
        },
    }
}
</script>

<style scoped>
.login {
    min-height: 100vh !important;
}
.card-radius {
    border-radius: 20px !important;
}
</style>
