const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    pool: true,
    host: 'smtp.mail.ru',
    port: 465,
    secure: true,
    auth: {
        user: 'raccoonnet@mail.ru',
        pass: 'nYEiqERnPH3teEhiB9MB'
    },
}, {
    from: "RaccoonNet <raccoonnet@mail.ru>",
})

//проверка подключения к почтовому серверу
transporter.verify((error, success) => {
    error ? console.log(error) :
        console.log('Server is ready to take our messages: ', success)
})

const mailer = message => {
    transporter.sendMail(message, (err, info) => {
        if (err) return console.log(err)
        console.log('Email sent: ', info)
    })
}

module.exports = mailer;