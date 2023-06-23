import { io } from 'socket.io-client';

class SocketioService {
    socket;
    constructor() {}

    setupSocketConnection() {
        this.socket = io(process.env.VUE_APP_SOCKET_ENDPOINT, {
            auth: { token: localStorage.getItem('token') },
        });

    }

    // socket.on('error', function(e){ console.log('error' + e); });

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

    //отправляем информацию на сервер о вошедшем на моя странице пользователе
    sendUserID(id) {
        if (this.socket) {
            this.socket.emit('enterUserMyPage', id);
        }
    }

    //получаем информацию о написанном посте для дальнейшей отправки всем кто находится на моей странице
    subscribeUsersID(cb) {
        if (!this.socket) return (true);
        this.socket.on('enterUserMyPage', (status_post) => {
            // console.log(body)
            return cb(null, status_post);
        });
    }

    //отправляем информацию о написаном посте на сервер для дальнейшей передачи этой информации всем кто в комнате
    sendInfoNewPost(status_post) {
        if (this.socket) {
            this.socket.emit('newPost', status_post);
        }
    }

    // прерываем соеденение
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
}

export default new SocketioService();