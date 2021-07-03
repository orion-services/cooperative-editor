<template>
    <div :class="$vuetify.theme.dark ? 'atividades black' : 'atividades'">
        <v-container class="pt-15">
            <div class="d-flex justify-space-between">
                <p class="primary--text heading-1">Atividades</p>
                <v-btn depressed outlined color="primary" @click="$router.push('/activities/new')">Criar nova <v-icon>mdi-plus</v-icon></v-btn>
            </div>

            <v-row class="mt-10 mb-15 pb-5">
                <v-col cols="12" sm="6" md="4" :key="i">
                    <v-card v-for="activity in activities" class="darkbg card-radius" flat @click="$router.push('/activities/view')">
                        <v-card-text>
                            <v-row align="center" justify="center">
                                <v-col cols="10">
                                    <p class="darktext--text heading-4">{{ activity.objective }}</p>
                                    <v-avatar
                                        :color="$vuetify.theme.dark ? 'grey darken-2' : 'grey lighten-2'"
                                        size="28"
                                        v-for="i in 3"
                                        :key="i"
                                        class="mr-1"
                                        >
                                        <span class="white--text headline"><v-icon>mdi-account</v-icon></span>
                                    </v-avatar>
                                </v-col>
                                <v-col cols="2">
                                    <v-icon size="34" class="dark--text">mdi-dots-vertical</v-icon>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import api from '../api.js';

export default {
    name: "Activities",
    data() {
        return {
            activities: [
                //XXX: test data

                /*
                { id: 1, objective: "Atividade 1", url: "" },
                { id: 2, objective: "Atividade 2", url: "" },
                { id: 3, objective: "Atividade 3", url: "" },
                { id: 4, objective: "Atividade 4", url: "" },
                { id: 5, objective: "Atividade 5", url: "" },
                */
            ],
        }
    },
    created() { 
        api.doGet('/CooperativeEditor/webservice/list/productionList', (data) => {
            this.activities = data;
        });

        //TODO: handle errors
    },
    methods: {
    }
}
</script>

<style scoped>
.atividades {
    min-height: 100vh;
}
.card-radius {
    border-radius: 12px;
}
.card-radius:hover {
    cursor: pointer;
}
</style>
