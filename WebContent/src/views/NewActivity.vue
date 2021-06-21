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
                                    <v-autocomplete chips deletable-chips multiple :items="participantsItems" v-model="participantsValues" label="Participantes" color="primary"></v-text-field>
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
export default {
    name: "NewActivity",
    data() {
        return {
            goal: '',
            minRounds: 1,
            maxRounds: 1,
            startDate: '',
            startTime: '',
            participantsItems: [ //TODO: load actual participants
                { value: 1, text: 'Foo' },
                { value: 2, text: 'Bar' },
                { value: 3, text: 'Baz' },
                { value: 4, text: 'Quux' },
            ],
            participantsValues: [],
            evaluationCriteria: '',
        }
    },
    methods: {
        requestRubricProductionConfiguration: function() {
        },

        requestUserProductionConfiguration: function() {
        },

        requestDisconnectRubric: function() {
        },

        requestGetProduction: function() {
        },

        requestDisconnectUserProductionConfiguration: function() {
        },

        requestPartialSubmitProduction: function() {
        },

        requestPeopleSuggestion: function() {
        },

        requestSaveProduction: function() {
            let options = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json; charset=UTF-8' },
                body: JSON.stringify({
                    goal: this.goal,
                    //TODO: complete
                })
            };

            fetch('/CooperativeEditor/webservice/form/saveProduction', options).then(async res => {
                let data = await res.json();

                if (res.ok) {
                    //TODO
                } else {
                    //TODO:
                    //Check status code (404, 500, ...)
                    //Display an error message on the text fields
                    alert('Error: unable to create the user.');
                }
            }).catch(error => {
                //TODO: handle network errors
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
