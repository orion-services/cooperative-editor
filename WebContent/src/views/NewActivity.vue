<template>
    <div>
        <v-row justify="center" align="center" class="login mx-3">
            <v-col cols="12" md="12">
                <v-row class="px-2 mt-5">
                    <v-col cols="12">
                        <p class="heading-1 mt-10 primary--text">Nova atividade</p>
                    <v-col>
                    <v-col cols="12">
                        <v-text-field v-model="goal" label="Objetivo" color="primary" @blur="onGoalBlur()" :error-messages="errors.goal"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field type="number" min="1" v-model="minRounds" label="Mínimo de rodadas" @blur="onMinMaxRoundsBlur()" color="primary"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field type="number" min="1" v-model="maxRounds" label="Máximo de rodadas" @blur="onMinMaxRoundsBlur()" color="primary"></v-text-field>
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
                            hide-no-data
                            :items="participantsItems"
                            item-text="name"
                            item-value="id"
                            v-model="participantsValues"
                            :search-input.sync="participantsSearch"
                            :error-messages="errors.participants"
                            @blur="onParticipantsBlur()"
                            @change="onChangeParticipants()"
                            label="Participantes"
                            color="primary"
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row class="px-3">
                    <v-col cols="12" md="6" class="mt-3">
                        <v-btn color="primary" @click="saveActivity" :disabled="isSaving" depressed block rounded large>Salvar</v-btn>
                    </v-col>
                </v-row>
                <v-row class="px-3">
                    <!-- Prevent "save" button from getting hidden under the bottom navigation -->
                    <v-col cols="12" md="6" class="mt-3">
                        &nbsp;
                    </v-col>
                    <v-col cols="12" md="6" class="mt-3">
                        &nbsp;
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import api from '../api.js';

const API_URL = '/CooperativeEditor/webservice/form/';

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
            participantsValuesOld: [],
            evaluationCriteria: '',
            production: {},
            isSaving: false,
            errors: {
                goal: '',
                participants: '',
            },
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
            let removed = this.participantsValuesOld.filter(e => this.participantsValues.indexOf(e) === -1);
            let added = this.participantsValues.filter(e => this.participantsValuesOld.indexOf(e) === -1);
            let i;

            //Clone array
            this.participantsValuesOld = JSON.parse(JSON.stringify(this.participantsValues));

            for (i in removed) {
                let upcs = this.production.userProductionConfigurations;

                for (let j in upcs) {
                    if (upcs[j].user.id == removed[i]) {
                        this.requestDisconnectUserProductionConfiguration(upcs[j].id);
                    }
                }
            }

            for (i in added) {
                this.requestUserProductionConfiguration(added[i]);
            }
        },

        onGoalBlur() {
            if (this.goal.length > 0) {
                this.errors.goal = '';
            }
        },

        onMinMaxRoundsBlur() {
            if (!this.minRounds) {
                this.minRounds = 1;
            }

            this.minRounds = parseInt(this.minRounds, 10);

            if (this.minRounds < 1) {
                this.minRounds = 1;
            }

            if (!this.maxRounds) {
                this.maxRounds = 1;
            }

            this.maxRounds = parseInt(this.maxRounds, 10);

            if (this.maxRounds < this.minRounds) {
                this.maxRounds = this.minRounds;
            }
        },

        onParticipantsBlur() {
            if (this.participantsValues.length > 0) {
                this.errors.participants = '';
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

            api.doPost(API_URL + 'userProductionConfiguration', requestData, (ok, status, data, error) => {
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

        requestDisconnectUserProductionConfiguration(id) {
            api.doDelete(API_URL + 'disconnectUserProductionConfiguration/' + id, null, (ok, status, data, error) => {
                if (ok) {
                    let upcs = this.production.userProductionConfigurations;
                    let index = -1;

                    for (let i in upcs) {
                        if (upcs[i].id == id) {
                            index = i;
                            break;
                        }
                    }

                    if (index > -1) {
                        upcs.splice(index, 1);
                    }
                }
            });
        },

        requestPartialSubmitProduction() {
            this.production.participateInProduction = false;
            this.production.rubricProductionConfigurations = [];
            this.production.userProductionConfigurations = [];
            this.production.startOfProduction = this.convertDate();
            this.production.objective = this.goal;
            this.production.minimumTickets = this.minRounds;
            this.production.limitTickets = this.maxRounds;

            api.doPost(API_URL + 'partialSubmit', this.production, (ok, status, data, error) => {
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
            api.doGet(API_URL + 'peoplesuggestion/' + partialName, (ok, status, data, error) => {
                if (!ok) {
                    //TODO: handle errors
                    return;
                }

                this.participantsItems = data;
            });
        },

        requestSaveProduction() {
            this.production.participateInProduction = false;
            this.production.rubricProductionConfigurations = [];
            this.production.userProductionConfigurations = [];
            this.production.startOfProduction = this.convertDate();
            this.production.objective = this.goal;
            this.production.minimumTickets = this.minRounds;
            this.production.limitTickets = this.maxRounds;

            if (this.goal.length == 0) {
                this.errors.goal = 'Campo de preenchimento obrigatório';
                return;
            }
            this.errors.goal = '';

            if (this.participantsValues.length == 0) {
                this.errors.participants = 'Ao menos um participante deve ser selecionado';
                return;
            }
            this.errors.participants = '';

            this.isSaving = true;

            api.doPost(API_URL + 'saveProduction', this.production, (ok, status, data, error) => {
                if (ok && data.isProductionValid) {
                    this.$router.push('/activities/' + data.url);
                } else {
                    //TODO: handle errors
                    this.isSaving = false;
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
