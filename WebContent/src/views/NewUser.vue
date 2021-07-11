<template>
    <div class="lightbg">
            <v-row justify="center" align="center" class="login mx-3">
                <v-col md="4" sm="8" cols="12" align-self="center">
                    <v-card flat class="card-radius logincardbg">
                        <v-card-text class="py-10">
                            <v-row class="px-2 mt-5">
                                <v-col cols="12">
                                    <v-text-field v-model="name" label="Nome" color="primary" :error-messages="errors.name" @blur="onNameBlur()"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field v-model="email" label="E-mail" color="primary" :error-messages="errors.email" @blur="onEmailBlur()"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field v-model="password" label="Senha" color="primary" type="password" :error-messages="errors.password" @blur="onPasswordBlur()"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field v-model="passwordConfirm" label="Senha (confirmação)" color="primary" type="password" :error-messages="errors.passwordConfirm" @blur="onPasswordConfirmBlur()"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row class="px-3">
                                <v-col cols="12" md="6" class="mt-3">
                                    <v-btn color="primary" @click="createUser" depressed block rounded large>Criar usuário</v-btn>
                                </v-col>
                                <v-col cols="12" md="6" class="mt-3">
                                    <v-btn color="primary" @click="$router.push('/login')" depressed block rounded outlined large>Cancelar</v-btn>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
    </div>
</template>

<script>
import api from '../api.js';

export default {
    name: "NewUser",
    data() {
        return {
            name: '',
            email: '',
            password: '',
            passwordConfirm: '',
            errors: {
                name: '',
                email: '',
                password: '',
                passwordConfirm: '',
            },
        }
    },
    methods: {
        createUser() {
            if (this.name.length == 0) {
                this.errors.name = 'Campo de preenchimento obrigatório';
                return;
            }
            this.errors.name = '';

            if (this.email.length == 0) {
                //TODO: actually validate an email address
                this.errors.email = 'Campo de preenchimento obrigatório';
                return;
            }
            this.errors.email = '';

            if (this.password.length < 4) {
                this.errors.password = 'A senha deve conter pelo menos 4 caracteres';
                return;
            }
            this.errors.password = '';

            if (this.passwordConfirm != this.password) {
                this.errors.passwordConfirm = 'As senhas não correspondem';
                return;
            }
            this.errors.passwordConfirm = '';

            let requestData = {
                name: this.name,
                email: this.email,
                password: this.password
            };

            api.doPut('/CooperativeEditor/login-api', requestData, (ok, status, data, error) => {
               if (ok && data.isUserValid) {
                    //TODO:
                    //Validate new user (including email, allowed password, and correct password confirmation
                    //Display a toast (or similar) instead of an alert
                    alert('User created successfully.');
                    this.$router.push('/login');
                } else {
                    //TODO:
                    //Check status code (404, 500, ...)
                    //Display an error message on the text fields
                    alert('Error: unable to create the user.');
                }
            });
        },

        onNameBlur() {
            if (this.name.length > 0) {
                this.errors.name = '';
            }
        },

        onEmailBlur() {
            if (this.email.length > 0) {
                //TODO: actually validate an email address
                this.errors.email = '';
            }
        },

        onPasswordBlur() {
            if (this.password.length >= 4) {
                this.errors.password = '';
            }
        },

        onPasswordConfirmBlur() {
            if (this.passwordConfirm == this.password) {
                this.errors.passwordConfirm = '';
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
