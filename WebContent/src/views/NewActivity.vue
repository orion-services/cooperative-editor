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
                                    <v-text-field type="number" min="1" v-model="minRounds" label="Mínimo de rodadas" @blur="onMinRoundsBlur()" color="primary"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field type="number" min="1" v-model="maxRounds" label="Máximo de rodadas" @blur="onMaxRoundsBlur()" color="primary"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-menu v-model="showStartDatePicker" :close-on-content-click="false" offset-y min-width="auto">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field v-model="startDate" label="Data de início" readonly v-bind="attrs" v-on="on" color="primary"></v-text-field>
                                        </template>
                                        <v-date-picker v-model="startDate" color="primary" @input="showStartDatePicker = false"></v-date-picker>
                                    </v-menu>
                                </v-col>
                                <v-col cols="12">
                                    <v-menu v-model="showStartTimePicker" :close-on-content-click="false" offset-y min-width="auto">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field v-model="startTime" label="Horário de início" readonly v-bind="attrs" v-on="on" color="primary"></v-text-field>
                                        </template>
                                        <v-time-picker v-model="startTime" color="primary" @input="showStartTimePicker = false"></v-date-picker>
                                    </v-menu>
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
            showStartDatePicker: false,
            showStartTimePicker: false,
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

        onMinRoundsBlur() {
            if (!this.minRounds) {
                this.minRounds = 1;
            }

            this.minRounds = parseInt(this.minRounds, 10);

            if (this.minRounds < 1) {
                this.minRounds = 1;
            }

            if (this.maxRounds < this.minRounds) {
                this.maxRounds = this.minRounds;
            }
        },

        onMaxRoundsBlur() {
            if (!this.maxRounds) {
                this.maxRounds = 1;
            }
            this.maxRounds = parseInt(this.maxRounds, 10);

            if (this.maxRounds < this.minRounds) {
                this.maxRounds = this.minRounds;
            }
        },


        //This method converts date and time strings to the number of
        //milliseconds since January 1, 1970
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

            api.doPost('/CooperativeEditor/webservice/form/userProductionConfiguration', requestData, (ok, status, data, error) => {
                if (!ok) {
                    //TODO: handle errors
                    return;
                }

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

            api.doPost('/CooperativeEditor/webservice/form/partialSubmit', this.production, (ok, status, data, error) => {
                if (!ok) {
                    //TODO: handle errors
                    return;
                }

                if (data.id != this.production.id) {
                    this.production.id = data.id;
                }
            });
        },

        requestPeopleSuggestion(partialName) {
            api.doGet('/CooperativeEditor/webservice/form/peoplesuggestion/' + partialName, (ok, status, data, error) => {
                if (!ok) {
                    //TODO: handle errors
                    return;
                }

                this.participantsItems = data;
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
            api.doPost('/CooperativeEditor/webservice/form/saveProduction', this.production, (ok, status, data, error) => {
                if (ok && data.isProductionValid) {
                    //TODO: Redirect to the new production URL
                    this.$router.push('/activities');
                } else {
                    //TODO: handle errors
                }
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
