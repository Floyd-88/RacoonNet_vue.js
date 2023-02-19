const mysql = require('mysql2');
const config = require('./config')

class MessagesDB {
    constructor() {
        this.connection = mysql.createConnection(config); // подключаем базу данных
        this.createTableMessages();
        this.createTableСonversation();
    }

    //Создаем таблицу с диалогами
    createTableСonversation() {
        const sql = `CREATE TABLE IF NOT EXISTS conversation (
            id integer PRIMARY KEY AUTO_INCREMENT,
            first integer NOT NULL,
            second integer NOT NULL,
            last_message_id integer NOT NULL,
            sender integer NOT NULL,
            first_delete integer(1) NOT NULL,
            second_delete integer(1) NOT NULL,
            unread integer NOT NULL
        )`;
        return this.connection.execute(sql);
    }

    //создаем таблицу БД с сообщениями
    createTableMessages() {
        const sql = `CREATE TABLE IF NOT EXISTS messages (
            id integer PRIMARY KEY AUTO_INCREMENT,
            conv_id integer NOT NULL,
            sender integer NOT NULL,
            addressee integer NOT NULL,
            readed integer(1) NOT NULL,
            sender_delete integer(1) NOT NULL,
            addressee_delete integer(1) NOT NULL,
            message text,
            date timestamp not null DEFAULT CURRENT_TIMESTAMP
        )`
        return this.connection.execute(sql);
    }

    //получаем id диалога между пользователями если он есть 
    get_conversation_id_DB(params, callback) {
        return this.connection.execute(`SELECT
        id, unread FROM conversation WHERE
        (first = ? AND second = ?)
            OR
        (first = ? AND second = ?)`, params, (err, row_conversation) => {
            callback(err, row_conversation)
        });
    }

    //создаем диалог между пользователями если его нету
    add_conversation_DB(params, callback) {
        return this.connection.execute(`INSERT INTO conversation
        (first, second, last_message_id, sender, first_delete, second_delete, unread) VALUES (?, ?, '0', ?, '0', '0', '0')`, params, (err, last_conversation) => {
            callback(err, last_conversation);
        });
    }

    //добавление сообщение в базу данных
    add_message_DB(params, callback) {
        return this.connection.execute(`INSERT INTO messages
        (conv_id, sender, addressee, readed, sender_delete, addressee_delete, message) VALUES (?, ?, ?, '0', '0', '0', ?)`, params, (err, row_messages) => {
            callback(err, row_messages);
        });
    }

    //обновление таблицы с диалогами
    update_conversation_id_DB(params, callback) {
        return this.connection.execute(`UPDATE conversation C SET
        C.last_message_id = ?,
        C.sender = ?,
        C.unread = (SELECT COUNT(*) FROM messages M WHERE
        M.conv_id = ? AND 
        M.readed = '0' AND 
        M.sender = ?) WHERE
        id = ?`, params, (err) => {
            callback(err);
        });
    }

    //получаем диалоги пользователя
    get_all_conversation_DB(tokenID, callback) {
        return this.connection.execute(`SELECT
    U.userID,
    U.name,
    U.surname,
    C.id as convId,
    C.sender,
    C.unread,
    M.message,
    M.date 
        FROM users U, conversation C
        LEFT JOIN messages M ON (C.last_message_id = M.id)
        WHERE (C.first = ${tokenID} OR C.second = ${tokenID})
        AND CASE 
        WHEN C.first = ${tokenID}
            THEN C.second = U.userID AND C.first_delete = '0'
        WHEN C.second = ${tokenID}
            THEN C.first = U.userID AND C.second_delete = '0'
        END
        ORDER BY C.unread DESC`, (err, dialogs) => {
            callback(err, dialogs)
        })
    }

    //получаем переписку с конкретным пользователем
    get_messages_user_DB(params, callback) {
        return this.connection.execute(`SELECT
        id,
        date,
        message,
        sender FROM messages WHERE conv_id = ?
        AND CASE
            WHEN sender = ?
                THEN sender_delete = '0'
            WHEN addressee = ?
                THEN addressee_delete = '0'
            END ORDER BY id ASC`, params, (err, messages_user) => {
            callback(err, messages_user)
        })
    }

    //обновляем флаг просмотра сообщений в таблице сообщений
    update_flag_unread_messages(id, callback) {
        return this.connection.execute(`UPDATE LOW_PRIORITY messages
        SET readed = '1'
        WHERE conv_id = ? AND addressee = ?`, id, (err) => {
            callback(err)
        })
    }

    //обновляем флаг просмотра сообщений в таблице диалогов
    update_flag_unread_conersation(id, callback) {
        return this.connection.execute(`UPDATE LOW_PRIORITY conversation
        SET unread = (SELECT COUNT(*) FROM messages M WHERE
        M.conv_id = ? AND 
        M.readed = '0' AND 
        M.sender = ?) 
        WHERE id = ?`, id, (err) => {
            callback(err)
        })
    }

    //создаем таблицу БД с сообщениями
    // createTableMessages() {
    //     const sql = `CREATE TABLE IF NOT EXISTS messages (
    //         messageID integer PRIMARY KEY AUTO_INCREMENT,
    //         date timestamp not null DEFAULT CURRENT_TIMESTAMP, 
    //         messageText text not null, 
    //         destinationID integer not null,
    //         authorMessage integer not null,
    //         FOREIGN KEY (authorMessage) REFERENCES users (userID) ON DELETE CASCADE)`;
    //     return this.connection.execute(sql);
    // }

    // загрузка всех сообщений пользователя
    // load_all_messages_DB(tokenID, callback) {
    //     return this.connection.execute(`SELECT 
    //     messages.messageID, 
    //     users.ava, 
    //     messages.date, 
    //     messages.messageText, 
    //     users.name, 
    //     users.surname,
    //     messages.destinationID FROM messages 
    //     INNER JOIN users ON messages.destinationID = users.userID 
    //     WHERE authorMessage = tokenID OR destinationID = tokenID ORDER BY messageID DESC`, tokenID, (err, row) => {
    //         callback(err, row)
    //     });
    // }


    // загрузка последних сообщений из всех преписок из базы данны
    // load_end_message_DB(params, callback) {
    //     return this.connection.execute(`SELECT 
    //     messages.messageID, 
    //     messages.date, 
    //     messages.messageText, 
    //     users.name, 
    //     users.surname,
    //     messages.authorPost FROM messages 
    //     INNER JOIN users ON messages.authorPost = users.userID 
    //     WHERE destinationID = ? ORDER BY messageID DESC`, params, (err, row) => {
    //         callback(err, row)
    //     });
    // }

    // загрузка одного сообщения из базы данных
    // load_message_DB(messageID, callback) {
    //     return this.connection.execute(`SELECT 
    //         messages.messageID, 
    //         users.ava, 
    //         messages.date, 
    //         messages.messageText, 
    //         users.name, 
    //         users.surname,
    //         messages.destinationID FROM messages 
    //         INNER JOIN users ON messages.destinationID = users.userID 
    //         WHERE messageID = ?`, [messageID], (err, row) => {
    //         console.log(row)
    //         callback(err, row[0])
    //     });
    // }

    // //добавление сообщения в базу данных
    // add_message_DB(message, callback) {
    //     return this.connection.execute(`INSERT INTO messages (messageText, destinationID, authorMessage) VALUES (?,?,?)`, message, (err, row) => {
    //         callback(err, row);
    //     });
    // }

    // // // редактирование поста
    // edit_post_DB(body, callback) {
    //     return this.connection.execute(`UPDATE posts SET postText=?, date=? WHERE id =?`, body, (err) => {
    //         callback(err);
    //     });
    // }

    // // // удаление поста
    // remove_post_DB(postID, callback) {
    //     return this.connection.execute(`DELETE from posts WHERE id = ?`, [postID], (err) => {
    //         callback(err);
    //     });
    // }

}
module.exports = MessagesDB;