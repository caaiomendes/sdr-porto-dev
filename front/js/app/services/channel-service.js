/* global angular, Pusher, appConfig */

angular.module('principal')
    .factory('ChannelService', ['$pusher', '$localStorage', ChannelService]);
    
function ChannelService($pusher, $localStorage) {
    return {
        subscribe(channelName) {
            let client = new Pusher('f5993080e4cb2deaa742', {
                authEndpoint: GLOBAL.barramento + "/api/v1/pusher/auth",
                encrypted: true,
                auth: {
                    params: {
                        username: $localStorage.nome
                    }
                }
            });

            let pusher = $pusher(client);
            this.channel = pusher.subscribe(channelName);

            return this.channel;
        },
        getMembersCount() {
            return this.channel.members.count;
        }
    };
}
