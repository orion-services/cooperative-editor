<template>
    <div>
        <!-- Desktop Layout -->
        <div v-if="$vuetify.breakpoint.mdAndUp">
            <v-row justify="center" :class="$vuetify.theme.dark ? 'black view-activity' : 'view-activity'">
                <v-col cols="12" md="12">
                    <v-container class="mt-10">
                        <span class="heading-4">
                            <router-link to="/activities" class="router-link primary--text heading-4">
                                <v-icon size="40" color="primary">mdi-chevron-left</v-icon> Sair da atividade
                            </router-link>
                        </span>

                        <p class="heading-1 mt-10 primary--text">Editor</p>
                        <p class="primary--text"><strong>Objetivo:</strong> {{ objective }}</p>

                        <v-textarea rows="10" class="mt-10" outlined v-model="content" :readonly="!isContributing"></v-textarea>
                        <v-btn @click="onClickContribute()" :disabled="isBlocked">{{ isContributing ? 'Finalizar' : 'Contribuir' }}</v-btn>

                        <v-card flat class="py-5" color="transparent">
                            <v-card-text>
                                <v-row justify="center">
                                    <v-card v-for="user in onlineUsers" outlined class="py-md-10 py-lg-12 px-lg-10 text-capitalize" :class="getUserCardClass(user.id)">
                                        <v-row no-gutters>
                                            <v-col cols="12">
                                                {{ user.name }}
                                            </v-col>
                                            <v-col cols="12" class="pt-2">
                                                <v-icon v-if="$vuetify.theme.dark" color="white">mdi-pencil</v-icon>
                                                <v-icon v-else color="black">mdi-pencil</v-icon>
                                            </v-col>
                                        </v-row>
                                    </v-card>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-container>
                </v-col>
                <v-col md="2">
                    <ChatSidebar :current-user="currentUser.name" :messages="chatMessages" :on-send="sendChatMessage" />
                </v-col>
            </v-row>
        </div>

        <!-- Mobile Layout -->
        <div v-if="$vuetify.breakpoint.smAndDown">
            <v-row no-gutters :class="$vuetify.theme.dark ? 'darkbg px-3' : 'white px-3'">
                <v-col cols="6" class="pt-3">
                    <span class="heading-4">
                        <router-link to="/activities" class="router-link primary--text heading-4">
                            <v-icon size="35" color="primary">mdi-chevron-left</v-icon> Sair
                        </router-link>
                    </span>
                </v-col>
                <v-col cols="6" class="text-right pt-3">
                    <v-btn class="primary--text text-capitalize" depressed text @click="openChatDialog = true">
                        Ver chat <v-icon size="35" color="primary">mdi-message-text-outline</v-icon>
                    </v-btn>
                </v-col>
                <v-col cols="12" class="pt--5">
                    <p class="heading-1 mt-10 primary--text">Editor</p>
                </v-col>
            </v-row>

            <ChatSidebar :dialog="openChatDialog" :current-user="currentUser.name" :messages="chatMessages" :on-send="sendChatMessage" :on-close="closeChatDialog" />

            <v-row class="px-3 editor-area lightbg">
                <v-col cols="12">
                    <p class="primary--text"><strong>Objetivo:</strong> {{ objective }}</p>
                </v-col>

                <v-col cols="12">
                    <v-textarea rows="10" class="mt-10" outlined v-model="content" :readonly="!isContributing"></v-textarea>
                    <v-btn @click="onClickContribute()" :disabled="isBlocked">{{ isContributing ? 'Finalizar' : 'Contribuir' }}</v-btn>
                </v-col>

                <v-col cols="12">
                    <v-card flat class="py-5" color="transparent">
                        <v-card-text>
                            <v-row justify="center">
                                <v-col cols="6" sm="3" v-for="user in onlineUsers">
                                    <v-card outlined class="py-md-10 py-lg-12 px-lg-10 text-capitalize" :class="getUserCardClass(user.id)">
                                        <v-row no-gutters>
                                            <v-col cols="12">
                                                {{ user.name }}
                                            </v-col>
                                            <v-col cols="12" class="pt-2">
                                                <v-icon v-if="$vuetify.theme.dark" color="white">mdi-pencil</v-icon>
                                                <v-icon v-else color="black">mdi-pencil</v-icon>
                                            </v-col>
                                        </v-row>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </div>
    </div>
</template>

<script>
import ChatSidebar from '@/components/ChatSidebar'

export default {
    name: "ViewActivity",
    components: {
        ChatSidebar
    },
    created() {
        let pathname = window.location.href;
        let hash = pathname.substr(pathname.lastIndexOf("/"));
        let wsUrl = 'ws://' + window.location.host + '/CooperativeEditor/editorws' + hash;

        this.ws = new WebSocket(wsUrl);
        this.ws.onmessage = this.receiveMessage;
        this.ws.onerror = this.onSocketError;
    },
    beforeRouteLeave(to, from, next) {
        this.ws.close();
        next();
    },
    data() {
        return {
            openChatDialog: false,
            currentUser: {},
            isContributing: false, //Is current user contributing?
            isBlocked: false, //Is current user blocked?
            onlineUsers: [],
            contributingUserId: -1, //Id of the currently contributing user (-1 if none)
            contributions: [],
            currentContribution: -1,
            userProductionConfigurations: null,
            objective: '',
            content: '',
            chatMessages: [],
        }
    },
    methods: {
        receiveMessage(ev) {
            let data = JSON.parse(ev.data);
            console.log('Received message', data);

            if (ev.data.isLoggedIn) {
                return;
            }

            switch(data.type){
                case 'ACK_LOAD_INFORMATION':
                    for (let i in data.uPCsConnected) {
                        this.onUserConnect(data.uPCsConnected[i].user);
                    }

                    this.currentUser = data.user;
                    this.userProductionConfigurations = data.production.userProductionConfigurations;
                    this.contributions = data.production.contributions; 
                    this.currentContribution = this.contributions.length - 1;
                    this.objective = data.production.objective;

                    if (this.currentContribution > -1) {
                        this.content = this.contributions[this.currentContribution].content;
                    }

                    for (let i in data.messages) {
                        this.addChatMessage(data.messages[i].user, data.messages[i].textMessage);
                    }

                    break;

                case 'ACK_NEW_CONNECTED':
                    this.onUserConnect(data.userProductionConfiguration.user);
                    //TODO: display a snackbar
                    break;

                case 'ACK_DISCONNECTION':
                    this.onUserDisconnect(data.disconnected);
                    this.userProductionConfigurations = data.userProductionConfigurations;
                    break;

                case 'ACK_FINISH_PARTICIPATION':
                    this.isContributing = false;
                    this.contributions.push(data.contribution);
                    this.currentContribution = this.contributions.length - 1;
                    this.content = this.contributions[this.currentContribution].content;
                    this.userProductionConfigurations = data.userProductionConfigurations;
                    this.checkUserSituation();
                    this.contributingUserId = -1;
                    //TODO: play end participation sound
                    break;

                case 'ACK_REQUEST_PARTICIPATION':
                    this.userProductionConfigurations = data.userProductionConfigurations;
                    this.checkUserSituation();
                    this.contributingUserId = data.author.id;
                    break;

                case 'ACK_SEND_MESSAGE':
                    this.addChatMessage(data.user, data.message);
                    break;
            }
        },

        sendMessage(json) {
            this.ws.send(JSON.stringify(json));
        },

        onSocketError(ev) {
            //TODO: improve error handling
            alert('Erro de conexão');
        },

        getUserCardClass(id) {
            if (id == this.contributingUserId) {
                return this.$vuetify.theme.dark ? 'greenBtn black--text' : 'greenBtn white--text';
            }

            return '';
        },

        onUserConnect(user) {
            this.onlineUsers.push(user);
        },

        onUserDisconnect(id) {
            for (let i in this.onlineUsers) {
                if (this.onlineUsers[i].id == id) {
                    this.onlineUsers.splice(i, 1); //Remove user
                    break;
                }
            }
        },

        checkUserSituation() {
            for (let i in this.userProductionConfigurations) {
                let upc = this.userProductionConfigurations[i];

                if (upc.user.id == this.currentUser.id) {
                    if (upc.situation == 'FREE') {
                        this.isContributing = false;
                        this.isBlocked = false;
                    } else if (upc.situation == 'BLOCKED') {
                        this.isContributing = false;
                        this.isBlocked = true;
                    } else if (upc.situation == 'CONTRIBUTING') {
                        this.isContributing = true;
                        this.isBlocked = false;
                    }

                    break;
                }
            }
        },

        onClickContribute() {
            if (!this.isContributing) {
                this.sendMessage({ type: 'REQUEST_PARTICIPATION' });
            } else {
                let content = { text: this.jsonEscape(this.content) };
                this.sendMessage({ type: 'FINISH_PARTICIPATION', content: content });
            }
        },

        jsonEscape(str) {
            return str ? str.replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t").replace(/\"/g, "'") : '';
        },

        sendChatMessage(msg) {
            this.sendMessage({ type: 'SEND_MESSAGE', textMessage: msg });
        },

        addChatMessage(sender, msg) {
            let received = !(sender == this.currentUser.name);
            this.chatMessages.push({ message: msg, received: received, sender: sender });
        },

        closeChatDialog() {
            this.openChatDialog = false;
        },
    },
}
</script>

<style scoped>
.view-activity {
    height: 100vh;
    min-height: 100vh;
    padding: 2% 11%;
    overflow: hidden;
}
.editor-area {
    min-height: 100vh;
}
.heading-4 {
    margin-left: -5px;
}
.text-capitalize {
    font-size: 16px;
    color: #7572A3;;
}
</style>
