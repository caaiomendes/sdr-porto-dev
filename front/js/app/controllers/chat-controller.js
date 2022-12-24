/* global angular */

angular.module('principal')
    .controller('ChatController', ['$scope', '$http', '$sessionStorage', '$localStorage', '$filter', '$location', '$anchorScroll', 'ChannelService', '$rootScope', ChatController]);

function ChatController($scope, $http, $sessionStorage, $localStorage, $filter, $location, $anchorScroll, ChannelService, $rootScope) {
    this.sessionStorage = $sessionStorage;
    this.$storage = $localStorage;
    // this.messages = [];
    this.users = [];


    $http.get(GLOBAL.barramento + '/api/v1/messages').success((messages) => {
        this.messages = messages;
    });

    // When the username is set bind channel events
    $scope.$watch('chat.$storage.nome', (newValue) => {
        if (newValue !== undefined) {
            // Populate username in case it's already in session storage
            this.setUsername();
            this.bindChannelEvents();
        }
    });

    // When the receiver is set receiver will be changed
    //este watch é acionado quando selecionamos um profissional para iniciar uma conversa
    $scope.$watch('chat.$storage.chat_user', (newValue) => {
        if (newValue !== undefined) {
            // Populate username in case it's already in session storage
            this.setUsername();
        }
    });

    $scope.closeChat = () => {
        this.$storage.is_chatting = false;
    }

    /**
     * Publish new message to chat room
     *
     * @return {void}
     */
    this.sendMessage = () => {
        var message = {
            username: $scope.username,
            message: this.message,
            receiver: $scope.receiver,
            sender_apelido: this.$storage.sender_apelido
        };

        // Update message list for author
        this.messages.push(message);
        $http.post(GLOBAL.barramento + '/api/v1/messages', message);

        this.message = '';
    };

    /**
     * Save username in session storage for persistency
     *
     * @return {void}
     */
    this.setUsername = () => {
        $scope.username = this.$storage.nome;

        if(this.$storage.chat_user){
            $scope.receiver = this.$storage.chat_user.nome;
        }
    };

    /**
     * Bind pusher channel events
     *
     * @return {void}
     */
    this.bindChannelEvents = () => {
        let channel = ChannelService.subscribe('presence-chat');

        channel.bind('App\\Events\\MessagePublished', (response) => {
            //TODO: remover
            // response.sender_apelido = this.$storage.apelido;

            // Update message list for everyone except the message author
            if (response.message.username !== $scope.username) {
                if (response.message.id !== this.messages[this.messages.length - 1].id) {
                    this.messages.push(response.message);
                    
                    //mensagem chegou...
                    $scope.$emit('chat.novaMensagem', response);
                    setTimeout(this.scrollDown, 2000);
                }
            }
        });

        channel.bind('pusher:subscription_succeeded', (users) => {
            this.memberCount = ChannelService.getMembersCount();
            this.updateUsers(users.members);
        });

        channel.bind('pusher:member_added', (user) => {
            this.memberCount = ChannelService.getMembersCount();
            this.addUser(user);
        });

        channel.bind('pusher:member_removed', (user) => {
            this.memberCount = ChannelService.getMembersCount();
            this.removeUser(user);
        });
    };

    /**
     * Add a single user to chat room
     *
     * @param {Object} user
     */
    this.addUser = (user) => {
        this.users.push({
            id: user.id,
            username: user.info.username
        });
    };

    /**
     * Update user list
     *
     * @param {Object} users
     */
    this.updateUsers = (users) => {
        this.users = [];

        angular.forEach(users, (value, key) => {
            this.users.push({
                id: key,
                username: value.username
            });
        });
    };

    /**
     * Remove user from chat room
     *
     * @param  {Object} user
     * @return {void}
     */
    this.removeUser = (user) => {
        this.users = $filter('filter')(this.users, { id: '!' + user.id });
    };

    this.scrollDown = () => {        
        var div = document.getElementById("chat-panel-body");
        $('#' + "chat-panel-body").animate({
            scrollTop: div.scrollHeight - div.clientHeight
        }, 500);
    };
}
