const mysql = require('mysql2');
const config = require('./config')

class PostsDB {
    constructor() {
        this.connection = mysql.createConnection(config); // подключаем базу данных
        this.createTablePosts();
        this.createTablePostsLikes();
    }

    //создаем таблицу БД с постами
    createTablePosts() {
        const sql = `CREATE TABLE IF NOT EXISTS posts (
            id integer PRIMARY KEY AUTO_INCREMENT,
            date varchar(50), 
            postText text, 
            page_userID integer,
            authorPost integer,
            likes integer default 0,
            photos varchar(10) default 'false',
            CONSTRAINT FK_Posts_Users FOREIGN KEY (authorPost) REFERENCES users (userID) ON DELETE CASCADE)`;
        this.connection.execute(sql);
    }

    //создаем таблицу БД с лайками к постам
    createTablePostsLikes() {
        const sql = `CREATE TABLE IF NOT EXISTS posts_likes (
            id integer PRIMARY KEY AUTO_INCREMENT,
            post_id integer, 
            author_likes_post integer,
            CONSTRAINT FK_PostID_Posts FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE, CONSTRAINT FK_AuthorLike_Users  FOREIGN KEY (author_likes_post) REFERENCES users (userID) ON DELETE CASCADE)`;
        this.connection.execute(sql);
    }

    // загрузка постов из базы данны
    load_posts_DB(params, callback) {
        return this.connection.execute(`SELECT 
        posts.id, 
        users.ava, 
        posts.date, 
        posts.postText, 
        posts.likes,
        users.name, 
        users.surname,
        posts.authorPost,
        posts.photos,
        SUM(CASE WHEN posts_likes.author_likes_post = ? THEN 1 ELSE 0 END) as like_post
        FROM posts 
        INNER JOIN users ON posts.authorPost = users.userID LEFT JOIN posts_likes ON posts_likes.post_id = posts.id
        WHERE page_userID = ? GROUP BY 
        posts.id, 
        users.ava, 
        posts.date, 
        posts.postText, 
        posts.likes,
        users.name, 
        users.surname,
        posts.authorPost,
        posts.photos
        ORDER BY posts.id DESC LIMIT ?, ?`, params, (err, row) => {
            callback(err, row)
        });
    }

    //загрузка фотографий к постам 
    load_photos_posts_DB(params, callback) {
        return this.connection.execute(`SELECT 
        photos.category, 
        users.name, 
        users.surname, 
        users.ava, 
        users.userID,
        photos.date, 
        photos.likes,
        SUM(CASE WHEN photos_likes.author_likes_photo = ? THEN 1 ELSE 0 END) as like_photo, 
        posts.id, 
        photos.photo_name,
        photos.id as photoID
        FROM posts 
        INNER JOIN photos ON photos.post_id_photo = posts.id INNER JOIN users ON photos.userID = users.userID LEFT JOIN photos_likes ON photos_likes.photo_id = photos.id
        WHERE posts.id = ? AND
        pageID = ? GROUP BY 
        photos.id, 
        photos.photo_name, 
        photos.category, 
        users.name, 
        users.surname, 
        users.userID,
        users.ava, 
        photos.date, 
        photos.likes,
        photos.id
        `, params, (err, row) => {
            callback(err, row)
        });
    }

    // получение новостной ленты от друзей
    load_news_friens_DB(params, callback) {
        return this.connection.execute(`SELECT 
        posts.id, 
        users.ava, 
        posts.date, 
        posts.postText, 
        users.name, 
        users.surname,
        posts.authorPost, 
        posts.likes,
        posts.photos,
        SUM(CASE WHEN posts_likes.author_likes_post = ? THEN 1 ELSE 0 END) as like_post
        FROM posts 
        INNER JOIN users ON posts.authorPost = users.userID LEFT JOIN posts_likes ON posts_likes.post_id = posts.id
        WHERE page_userID IN (SELECT 
                             U.userID FROM users U 
                             INNER JOIN friends F ON 
                                 CASE
                             WHEN addressee_user_id = ?
                                 THEN
                                U.userID=sender_user_id
                                 WHEN
                             sender_user_id = ?
                                 THEN
                             U.userID=addressee_user_id
                                 END
                             WHERE (confirm_addressee=1 AND confirm_sender=1))
         AND posts.authorPost = page_userID 
         GROUP BY 
         posts.id, 
         users.ava, 
         posts.date, 
         posts.postText, 
         posts.likes,
         users.name, 
         users.surname,
         posts.authorPost,
         posts.photos
         ORDER BY posts.id DESC LIMIT ?, ?`, params, (err, row) => {
            callback(err, row)
        });
    }

    // загрузка одного пота из базы данных
    load_one_post_DB(postID, callback) {
        return this.connection.execute(`SELECT 
            posts.id, 
            users.ava, 
            posts.date, 
            posts.postText, 
            users.name, 
            users.surname,
            posts.authorPost FROM posts 
            INNER JOIN users ON posts.authorPost = users.userID 
            WHERE id = ?`, [postID], (err, row) => {
            callback(err, row[0])
        });
    }

    //добавление поста в базу данных
    add_post_DB(body, callback) {
        return this.connection.execute(`INSERT INTO posts (date, postText, page_userID, authorPost, photos) VALUES (?,?,?,?,?)`, body, (err, row) => {
            callback(err, row);
        });
    }

    // редактирование поста
    edit_post_DB(body, callback) {
        return this.connection.execute(`UPDATE posts SET postText=?, date=? WHERE id =?`, body, (err) => {
            callback(err);
        });
    }


    // удаление лайков поста
    remove_post_likes_DB(postID, callback) {
        return this.connection.execute(`DELETE from posts_likes WHERE post_id = ?`, [postID], (err) => {
            callback(err);
        });
    }

    // удаление поста
    remove_post_DB(postID, callback) {
        return this.connection.execute(`DELETE from posts WHERE id = ?`, [postID], (err) => {
            callback(err);
        });
    }

    // удаление постов на странице пользователя перед удалением профиля
    remove_all_posts_DB(user, callback) {
        return this.connection.execute(`DELETE from posts WHERE page_userID = ?`, [user], (err) => {
            callback(err);
        });
    }

    //поверяем на повторный лайк поста
    not_double_likes_post_author(params, callback) {
        return this.connection.execute(`SELECT id FROM posts_likes WHERE post_id=? AND author_likes_post = ?`, params, (err, row) => {
            callback(err, row)
        });
    }

    //добавляем автора лайка поста в БД
    add_author_likes_post(params, callback) {
        return this.connection.execute(`INSERT INTO posts_likes (post_id, author_likes_post) VALUES (?,?)`, params, (err) => {
            callback(err);
        })
    };

    //убираем автора лайка поста при повторном клике
    remove_author_like_post(id, callback) {
        return this.connection.execute(`DELETE from posts_likes WHERE id = ?`, id, (err) => {
            callback(err);
        });
    }

    // лайкаем пост
    add_count_likes(params, callback) {
        return this.connection.execute(`UPDATE posts SET likes = likes + 1 WHERE id=?`, params, (err) => {
            callback(err);
        })
    }

    // отменяем лайк поста
    remove_count_likes(params, callback) {
        return this.connection.execute(`UPDATE posts SET likes = likes - 1 WHERE id=?`, params, (err) => {
            callback(err);
        })
    }

    //получаем количество лайков у поста
    get_count_likes_post(id, callback) {
        return this.connection.execute(`SELECT likes FROM posts WHERE id=?`, id, (err, likes) => {
            callback(err, likes[0]);
        })
    }

    //получаем пользоватей лайкнувших пост
    get_users_likes(postID, callback) {
        return this.connection.execute(`SELECT author_likes_post, ava, name, surname FROM posts_likes INNER JOIN users ON author_likes_post = userID WHERE post_id=?`, postID, (err, users) => {
            callback(err, users);
        })
    }

}
module.exports = PostsDB;