import {
    io
} from 'socket.io-client';

class SocketioService {
    socket;
    constructor() {}

    setupSocketConnection() {
        this.socket = io(process.env.VUE_APP_SOCKET_ENDPOINT, {
            auth: {
                token: localStorage.getItem('token')
            },
        });

    }

    // --------------------------------------------------------------------------------
    //получаем сообщение с сервера для дальнейшей отправки адресатам
    subscribeToMessages(cb) {
        if (!this.socket) return (true);
        this.socket.on('message', (newMessage) => {
            return cb(null, newMessage);
        });
    }

    //отправляем сообщение на сервер
    sendMessage(newMessage) {
            if (this.socket) {
                this.socket.emit('message', newMessage);
            }
        }
        // --------------------------------------------------------------------------------

    // --------------------------------------------------------------------------------   
    //получаем фотографии из сообщения с сервера для дальнейшей отправки адресату
    subscribeToMessagesPhotos(cb) {
        if (!this.socket) return (true);
        this.socket.on('photos', (newMessagePhotos) => {
            return cb(null, newMessagePhotos);
        });
    }

    //отправляем фотографии из сообщения на сервер
    sendMessagePhotos(newMessagePhotos) {
            if (this.socket) {
                this.socket.emit('photos', newMessagePhotos);
            }
        }
        // --------------------------------------------------------------------------------

    // --------------------------------------------------------------------------------
    //отправляем уведомление на сервер для дальнейшей передачи его адресату
    sendNotice(newNotice) {
        if (this.socket) {
            this.socket.emit('notice', newNotice);
        }
    }

    //получаем уведомление с сервера для дальнейшей отправки адресатам
    subscribeToNotice(cb) {
            if (!this.socket) return (true);
            this.socket.on('notice', (newNotice) => {
                // console.log(newNotice)
                return cb(null, newNotice);
            });
        }
        // --------------------------------------------------------------------------------

    // прерываем соеденение
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }

    exitRoom(id) {
        if (this.socket) {
            this.socket.emit('exitRoom', id);
        }
    }
}

export default new SocketioService();