<template>
    <div class="lightbg">
            <v-row justify="center" align="center" class="login mx-3">
                <v-col md="4" sm="8" cols="12" align-self="center">
                    <v-card flat class="card-radius logincardbg">
                        <v-card-text class="py-10">
                            <v-row class="px-2 mt-5">
                                <v-col cols="12">
                                    <v-text-field v-model="goal" label="Objetivo" color="primary"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field v-model="minRounds" label="Mínimo de rodadas" color="primary"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field v-model="maxRounds" label="Máximo de rodadas" color="primary"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <!-- Data de início -->
                                    <v-date-picker v-model="startDate" color="primary"></v-date-picker>
                                </v-col>
                                <v-col cols="12">
                                    <!-- Horário de início -->
                                    <v-time-picker v-model="startTime" color="primary"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-autocomplete
                                        chips
                                        deletable-chips
                                        multiple
                                        hide-details
                                        hide-no-data
                                        :items="participantsItems"
                                        item-text="name"
                                        item-value="id"
                                        v-model="participantsValues"
                                        :search-input.sync="participantsSearch"
                                        v-on:change="onChangeParticipants();"
                                        label="Participantes"
                                        color="primary"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field v-model="evaluationCriteria" label="Critérios de avaliação" color="primary"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row class="px-3">
                                <v-col cols="12" md="6" class="mt-3">
                                    <v-btn color="primary" @click="saveActivity" depressed block rounded large>Salvar</v-btn>
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
    name: "NewActivity",
    data() {
        let now = new Date(Date.now());

        let year = String(now.getFullYear()).padStart(4, '0');
        let month = String(now.getMonth() + 1).padStart(2, '0');
        let day = String(now.getDate()).padStart(2, '0');
        let hour = String(now.getHours()).padStart(2, '0');
        let minute = String(now.getMinutes()).padStart(2, '0');

        return {
            goal: '',
            minRounds: 1,
            maxRounds: 1,
            startDate: year + '-' + month + '-' + day,
            startTime: hour + ':' + minute,
            participantsSearch: '',
            participantsItems: [],
            participantsValues: [],
            evaluationCriteria: '',
            production: {},
        }
    },
    watch: {
        goal(val) {
            //TODO: decide which other properties to watch while doing partial
            //submits
            this.requestPartialSubmitProduction();
        },

        participantsSearch(val) {
            if (val) {
                this.requestPeopleSuggestion(val);
            }
        },
    },
    methods: {
        saveActivity() {
            this.requestSaveProduction();
        },

        onChangeParticipants() {
            //TODO:
            //Allow participants to be removed
            //Prevent repetition of user production configuration items

            for (let i in this.participantsItems) {
                if (!this.production.userProductionConfigurations) {
                    break;
                }

                for (let j in this.production.userProductionConfigurations) {
                    if (this.production.userProductionConfigurations[j].id == this.participantsItems[i]) {
                        return;
                    }
                }

                this.requestUserProductionConfiguration(this.participantsItems[i].id);
            }
        },

        convertDate() {
            let year = parseInt(this.startDate.substring(0, 4), 10);
            let month = parseInt(this.startDate.substring(5, 7), 10) - 1;
            let day = parseInt(this.startDate.substring(8, 10), 10);
            let hour = parseInt(this.startTime.substring(0, 2), 10);
            let minute = parseInt(this.startTime.substring(3, 5), 10);

            return (new Date(year, month, day, hour, minute)).getTime();
        },

        requestRubricProductionConfiguration() {
        },

        requestUserProductionConfiguration(userId) {
            let requestData = {
	        production: { id: this.production.id },
	        user: { id: userId },
            }

            api.doPost('/CooperativeEditor/webservice/form/userProductionConfiguration', requestData, (data) => {
                let index = -1;

                for (let i in this.production.userProductionConfigurations) {
                    if (this.production.userProductionConfigurations[i].id == data.id) {
                        index = i;
                        break;
                    }
                }

                if (index == -1) {
                    this.production.userProductionConfigurations.push(data);
                } else {
                    this.production.userProductionConfigurations.splice(index, 1, data);
                }

                //TODO:
                //Check status code (404, 500, ...)
                //Display an error message on the text fields
            });

        },

        requestDisconnectRubric() {
        },

        requestGetProduction() {
        },

        requestDisconnectUserProductionConfiguration() {
        },

        requestPartialSubmitProduction() {
            this.production.participatInProduction = false; //XXX: typo
            this.production.rubricProductionConfigurations = [];
            this.production.userProductionConfigurations = [];
            this.production.startOfProduction = this.convertDate();
            this.production.objective = this.goal;
            this.production.minimumTickets = this.minRounds;
            this.production.limitTickets = this.maxRounds;

            api.doPost('/CooperativeEditor/webservice/form/partialSubmit', this.production, (data) => {
                if (data.id != this.production.id) {
                    this.production.id = data.id;
                }

                //TODO:
                //Check status code (404, 500, ...)
                //Display an error message on the text fields
            });
        },

        requestPeopleSuggestion(partialName) {
            api.doGet('/CooperativeEditor/webservice/form/peoplesuggestion/' + partialName, (data) => {
                this.participantsItems = data;

                //TODO:
                //Check status code (404, 500, ...)
                //Display an error message on the text fields
            });
        },

        requestSaveProduction() {
            this.production.participatInProduction = false; //XXX: typo
            this.production.rubricProductionConfigurations = [];
            this.production.userProductionConfigurations = [];
            this.production.startOfProduction = this.convertDate();
            this.production.objective = this.goal;
            this.production.minimumTickets = this.minRounds;
            this.production.limitTickets = this.maxRounds;

            //TODO: validate entered data
            api.doPost('/CooperativeEditor/webservice/form/saveProduction', this.production, (data) => {
                if (data.isProductionValid) {
                    //TODO: Redirect to the new production URL
                    this.$router.push('/activities');
                }

                //TODO:
                //Check status code (404, 500, ...)
                //Display an error message on the text fields
            });
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
