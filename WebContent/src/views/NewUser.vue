<template>
    <div class="lightbg">
            <v-row justify="center" align="center" class="login mx-3">
                <v-col md="4" sm="8" cols="12" align-self="center">
                    <v-card flat class="card-radius logincardbg">
                        <v-card-text class="py-10">
                            <v-row class="px-2 mt-5">
                                <v-col cols="12">
                                    <v-text-field v-model="newUserName" label="Nome" color="primary"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field v-model="newUserEmail" label="E-mail" color="primary"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field v-model="newUserPassword" label="Senha" color="primary" type="password"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field v-model="newUserPasswordConfirm" label="Senha (confirmação)" color="primary" type="password"></v-text-field>
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
            <!-- <div style="height: 500px; overflow: hidden;" ><svg viewBox="0 0 500 150" preserveAspectRatio="none" style="height: 100%; width: 100%;"><path d="M0.00,49.98 C149.99,250.00 349.20,-109.98 500.00,49.98 L500.00,250.00 L0.00,150.00 Z" style="stroke: none; fill: #EBEBEB;opacity:0.25"></path></svg></div>
            <div style="height: 350px; overflow: hidden;margin-top: -350px" ><svg viewBox="0 0 500 150" preserveAspectRatio="none" style="height: 100%; width: 100%;"><path d="M0.00,49.98 C149.99,250.00 349.20,-109.98 500.00,49.98 L500.00,250.00 L0.00,150.00 Z" style="stroke: none; fill: #EBEBEB;opacity:0.5"></path></svg></div>
            <div style="height: 250px; overflow: hidden;margin-top:-190px" ><svg viewBox="0 0 500 150" preserveAspectRatio="none" style="height: 100%; width: 100%;"><path d="M0.00,49.98 C149.99,250.00 349.20,-109.98 500.00,49.98 L500.00,250.00 L0.00,150.00 Z" style="stroke: none; fill: #E8E8E8;"></path></svg></div>
         -->
    </div>
</template>

<script>
export default {
    name: "NewUser",
    data() {
        return {
            newUserName: '',
            newUserEmail: '',
            newUserPassword: '',
            newUserPasswordConfirm: '',
        }
    },
    methods: {
        createUser: function() {
            let options = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json; charset=UTF-8' },
                body: JSON.stringify({
                    name: this.newUserName,
                    email: this.newUserEmail,
                    password: this.newUserPassword
                })
            };

            fetch('/CooperativeEditor/login', options).then(async res => {
                let response = await res.json();

                //TODO:
                //Validate new user (including email, allowed password, and correct password confirmation
                //On success, display an alert/toast
                //On error, display an error message on the text fields
                //Properly handle status codes (200, 404, ...)

                if (response.isUserValid) {
                    alert('User created successfully.');
                    this.$router.push('/login');
                } else {
                    alert('Error: unable to create the user.');
                }
            });
        }
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
