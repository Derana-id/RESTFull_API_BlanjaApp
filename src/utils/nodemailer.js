const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const {
  HOST_STMP,
  PORT_STMP,
  EMAIL_AUTH_STMP,
  PASS_AUTH_STMP,
} = require('../helpers/env');

module.exports = {
  activation: (data) =>
    new Promise((resolve, reject) => {
      let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: EMAIL_AUTH_STMP,
          pass: PASS_AUTH_STMP,
        },
      });

      transporter.use(
        'compile',
        hbs({
          viewEngine: {
            extname: '.html',
            partialsDir: path.resolve('./src/templates/email'),
            defaultLayout: false,
          },
          viewPath: path.resolve('./src/templates/email'),
          extName: '.html',
        })
      );

      const emailOptions = {
        from: data.form,
        to: data.to,
        subject: data.subject,
        text: data.text,
        template: data.template,
        context: data.context,
      };

      transporter.sendMail(emailOptions, (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve(info);
        }
      });
    }),
  resetPassword: (data) =>
    new Promise((resolve, reject) => {
      let transporter = nodemailer.createTransport({
        host: HOST_STMP,
        port: PORT_STMP,
        secure: false,
        auth: {
          user: EMAIL_AUTH_STMP,
          pass: PASS_AUTH_STMP,
        },
      });

      transporter.use(
        'compile',
        hbs({
          viewEngine: {
            extname: '.html',
            partialsDir: path.resolve('./src/templates/email'),
            defaultLayout: false,
          },
          viewPath: path.resolve('./src/templates/email'),
          extName: '.html',
        })
      );

      const emailOptions = {
        from: data.form,
        to: data.to,
        subject: data.subject,
        text: data.text,
        template: data.template,
        context: data.context,
      };

      transporter.sendMail(emailOptions, (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve(info);
        }
      });
    }),
};
