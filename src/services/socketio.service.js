import { io } from 'socket.io-client';

class SocketioService {
    socket;
    constructor() {}

    setupSocketConnection() {
        this.socket = io(process.env.VUE_APP_SOCKET_ENDPOINT, {
            auth: { token: localStorage.getItem('token') },
        });
        // this.socket.emit('userID', id);
    }

    //получаем сообщение с сервера для дальнейшей отправки адресатам
    subscribeToMessages(cb) {
        if (!this.socket) return (true);
        this.socket.on('message', (newMessage) => {
            console.log(newMessage)
            return cb(null, newMessage);
        });
    }

    //отправляем сообщение на сервер
    sendMessage(newMessage) {
        if (this.socket) {
            this.socket.emit('message', newMessage);
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