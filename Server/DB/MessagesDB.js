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
            message text NOT NULL,
            date varchar(50) NOT NULL,
            photos varchar(10) default 'false'
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
        (conv_id, sender, addressee, readed, sender_delete, addressee_delete, message, date, photos) VALUES (?, ?, ?, '0', '0', '0', ?, ?, ?)`, params, (err, row_messages) => {
            callback(err, row_messages);
        });
    }

    //возвращаем написанное сообщение клиенту
    get_last_message_DB(id_message, callback) {
        return this.connection.execute(`SELECT 
        M.id,
        M.date,
        M.message,
        M.sender,
        M.conv_id,
        U.name,
        U.surname,
        U.ava FROM messages M LEFT JOIN users U ON M.sender = U.userID  WHERE M.id = ?`, id_message, (err, newMessage) => {
            callback(err, newMessage);
        })
    }

    //обновление таблицы с диалогами
    update_conversation_id_DB(params, callback) {
        return this.connection.execute(`UPDATE conversation C SET
        C.last_message_id = ?,
        C.sender = ?,
        C.first = ?,
        C.second = ?,
        C.first_delete = '0',
        C.second_delete = '0',
        C.unread = (SELECT COUNT(*) FROM messages M WHERE
        M.conv_id = ? AND 
        M.readed = '0' AND 
        M.sender = ?) WHERE
        id = ?`, params, (err) => {
            callback(err);
        });
    }

    //получаем диалоги пользователя
    get_all_conversation_DB(body, callback) {
        return this.connection.execute(`SELECT
        M.id,
        U.userID,
        U.name,
        U.surname,
        U.ava,
        C.id as convId,
        C.sender,
        C.unread,
        M.message,
        M.date
            FROM 
                users U, conversation C
                LEFT JOIN messages M ON (C.id = M.conv_id)
                    WHERE (M.sender = ${body.tokenID} OR M.addressee = ${body.tokenID})
                        AND CASE 
                            WHEN M.sender = ${body.tokenID}
                        THEN M.sender_delete = '0' AND M.addressee = U.userID 
                            WHEN M.addressee = ${body.tokenID}
                        THEN M.addressee_delete = '0' AND M.sender = U.userID 
                    END
                    AND M.id IN (SELECT
                        MAX(M.id) as last_message
                            FROM users U, conversation C
                            LEFT JOIN messages M ON (C.id = M.conv_id)
                                WHERE (M.sender = ${body.tokenID} OR M.addressee = ${body.tokenID})
                                AND CASE 
                                WHEN M.sender = ${body.tokenID}
                                    THEN M.sender_delete = '0' AND M.addressee = U.userID 
                                WHEN M.addressee = ${body.tokenID}
                                    THEN M.addressee_delete = '0' AND M.sender = U.userID 
                                END
                                GROUP BY U.userID
                            ORDER BY last_message DESC) 
                        ORDER BY  M.id  DESC LIMIT ${body._count}, ${body._limit}`, (err, dialogs) => {
            callback(err, dialogs)
        })
    }

    //получаем переписку с конкретным пользователем
    get_messages_user_DB(params, callback) {
        return this.connection.execute(`SELECT
        M.id,
        M.date,
        M.message,
        M.sender,
        U.name,
        U.surname,
        M.conv_id,
        M.photos,
       	(SELECT unread FROM conversation WHERE id = ? AND CASE WHEN sender = ? THEN unread = 0 ELSE unread END) as unread,
        U.ava FROM messages M LEFT JOIN users U ON M.sender = U.userID  LEFT JOIN conversation C ON C.id = M.conv_id
        WHERE M.conv_id = ?
        AND CASE
            WHEN M.sender = ?
                THEN sender_delete = '0'
            WHEN M.addressee = ?
                THEN addressee_delete = '0'
            END ORDER BY id DESC LIMIT ?, ?`, params, (err, messages_user) => {
            callback(err, messages_user)
        })
    }

    //загрузка фотографий к сообщениям 
    load_photos_messages_DB(params, callback) {
        return this.connection.execute(`SELECT 
        users.name, 
        users.surname, 
        users.ava, 
        users.userID,
        photos.date, 
        messages.id, 
        photos.photo_name,
        photos.id as photoID
        FROM messages 
        INNER JOIN photos ON photos.message_id_photo = messages.id 
        INNER JOIN users ON photos.userID = users.userID 
        WHERE messages.id = ?`, params, (err, row) => {
            callback(err, row)
        });
    }

    //обновляем флаг просмотра сообщений в таблице сообщений
    update_flag_unread_messages(id, callback) {
        return this.connection.execute(`UPDATE LOW_PRIORITY messages
        SET readed = '1'
        WHERE conv_id = ? AND addressee = ?`, id, (err) => {
            callback(err)
        })
    }

    //получаем количество непрочитанных сообщений перед выходм из переписки
    // get_unread_messages(body, callback) {
    //     return this.connection.execute(`SELECT COUNT(*) as count FROM messages M WHERE
    //     M.conv_id = ? AND 
    //     M.readed = '0' AND 
    //     M.addressee = ?`, body, (err, row) => {
    //         callback(err, row[0])
    //     })
    // }

    //обновляем флаг просмотра сообщений в таблице диалогов
    update_flag_unread_conersation(id, callback) {
        return this.connection.execute(`UPDATE LOW_PRIORITY conversation
        SET unread = (SELECT COUNT(*) FROM messages M WHERE
        M.conv_id = ? AND 
        M.readed = '0' AND 
        M.addressee = ?) 
        WHERE id = ? AND second = ?`, id, (err, row) => {
            callback(err, row)
        })
    }

    //обновляем флаг просмотра сообщений в таблице диалогов
    // update_flag_unread_conersation_exit(id, callback) {
    //     return this.connection.execute(`UPDATE LOW_PRIORITY conversation
    //         SET unread = (SELECT COUNT(*) FROM messages M WHERE
    //         M.conv_id = ? AND 
    //         M.readed = '0' AND 
    //         M.addressee = ?) 
    //         WHERE id = ?`, id, (err, row) => {
    //         callback(err, row)
    //     })
    // }


    //проверяем наличие сообщения для удаления
    get_message(params, callback) {
        return this.connection.execute(`SELECT id FROM messages WHERE 
            id = ? AND (sender = ? OR addressee = ?)`, params, (err, message) => {
            callback(err, message[0])
        })
    }

    //обновляем флаг удаления сообщения у пользователя
    update_message_flag_delete(params, callback) {
        return this.connection.execute(`UPDATE messages SET
        sender_delete =
            CASE sender
                WHEN ?
                    THEN '1'
                ELSE
                    sender_delete
                END,
        addressee_delete = 
            CASE addressee
                WHEN ?
                    THEN '1'
                ELSE
                    addressee_delete
                END
        WHERE id = ?`, params, (err) => {
            callback(err)
        })
    }

    //обновляем флаги удаления для всех сообщений в диалоге у пользователя
    update_messages_flag_delete(params, callback) {
        return this.connection.execute(`UPDATE messages SET
        sender_delete =
            CASE sender
                WHEN ?
                    THEN '1'
                ELSE
                    sender_delete
                END,
        addressee_delete = 
            CASE addressee
                WHEN ?
                    THEN '1'
                ELSE
                    addressee_delete
                END
        WHERE conv_id = ?`, params, (err) => {
            callback(err)
        })
    }

    //обновляем флаги удаления для всех сообщений во всех диалоах у пользователя перед удалением профиля
    update_all_messages_flag_delete(params, callback) {
        return this.connection.execute(`UPDATE messages SET
        sender_delete =
            CASE sender
                WHEN ?
                    THEN '1'
                ELSE
                    sender_delete
                END,
        addressee_delete = 
            CASE addressee
                WHEN ?
                    THEN '1'
                ELSE
                    addressee_delete
                END`, params, (err) => {
            callback(err)
        })
    }

    //обновляем флаг удаления для диалога у пользователя что бы он не отображался
    update_conversation_flag_delete(params, callback) {
        return this.connection.execute(`UPDATE conversation SET
        first_delete = 
            CASE first
                WHEN ?
                    THEN '1'
                ELSE
                    first_delete
                END,
        second_delete = 
            CASE second
                WHEN ?
                    THEN '1'
                ELSE
                    second_delete
                END
        WHERE id = ?`, params, (err) => {
            callback(err)
        })
    }

    //обновляем флаг удаления для всех диалогов у пользователя что бы он не отображался перед удалением профиля 
    update_all_conversation_flag_delete(params, callback) {
        return this.connection.execute(`UPDATE conversation SET
        first_delete = 
            CASE first
                WHEN ?
                    THEN '1'
                ELSE
                    first_delete
                END,
        second_delete = 
            CASE second
                WHEN ?
                    THEN '1'
                ELSE
                    second_delete
                END`, params, (err) => {
            callback(err)
        })
    }

    //проверяем наличие диалога для его удаления
    get_conversation(params, callback) {
        return this.connection.execute(`SELECT id FROM conversation WHERE 
            id = ? AND (first = ? OR second = ?)`, params, (err, dialog) => {
            callback(err, dialog[0])
        })
    }

    //проверяем на удаление сообщения обоими пользователями
    check_message_flag_delete(id, callback) {
        return this.connection.execute(`SELECT (CASE WHEN sender_delete=1 AND addressee_delete=1 THEN 'true' ELSE 'false' END) as bool FROM messages WHERE id = ?`, id, (err, message_flag) => {
            callback(err, message_flag[0])
        })
    }

    //проверяем на удаление диалога обоими пользователями
    check_dialog_flag_delete(id, callback) {
        return this.connection.execute(`SELECT (CASE WHEN first_delete=1 AND second_delete=1 THEN 'true' ELSE 'false' END) as bool FROM conversation WHERE id = ?`, id, (err, message_flag) => {
            callback(err, message_flag[0])
        })
    }

    //удаляем сообщение из БД
    delete_message(id, callback) {
        return this.connection.execute(`DELETE FROM messages WHERE id=?`, id, (err) => {
            callback(err)
        })
    }

    //удаляем диалог из БД
    delete_dialog(id, callback) {
        return this.connection.execute(`DELETE FROM conversation WHERE id=?`, id, (err) => {
            callback(err)
        })
    }

    //удаляем все сообщения из диалога
    delete_all_message_dialog(id, callback) {
        return this.connection.execute(`DELETE FROM messages WHERE conv_id=?`, id, (err) => {
            callback(err)
        })
    }

    //получаем массив фотографий из сообщения при удалении
    message_photos_DB(id, callback) {
        return this.connection.execute(`SELECT id, photo_name FROM photos WHERE message_id_photo=?`, [id], (err, photosArray) => {
            callback(err, photosArray);
        })
    }

    //получаем массив фотографий из диалога при удалении
    dialog_photos_DB(id, callback) {
        return this.connection.execute(`SELECT id, photo_name FROM photos WHERE message_id_photo IN (SELECT id FROM messages WHERE conv_id=?)`, [id], (err, photosArray) => {
            callback(err, photosArray);
        })
    }

}
module.exports = MessagesDB;