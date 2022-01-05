const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);

const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY,
    public_key: process.env.MAILGUN_PUBLIC_KEY
});

const sendWelcomeEmail = (email, name) => {
    mg.messages.create('sandbox276d71076e54409da3857befb2413b10.mailgun.org', {
        from: "Akshay Bandivadekar <mailgun@sandbox276d71076e54409da3857befb2413b10.mailgun.org>",
        to: [email],
        subject: "Thanks for joining in!",
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`,
        html: `<h1>Welcome to the app, ${name}. Let me know how you get along with the app.</h1>`
    }).then(msg => console.log(msg)) // logs response data
      .catch(err => console.log(err)); // logs any error
}

const sendCancelationEmail = (email, name) => {
    mg.messages.create('sandbox276d71076e54409da3857befb2413b10.mailgun.org', {
        from: "Akshay Bandivadekar <mailgun@sandbox276d71076e54409da3857befb2413b10.mailgun.org>",
        to: [email],
        subject: "Sorry to see you go!",
        text: `Goodbye, ${name}. I hope to see you back sometime soon.`,
        html: `<h1>Goodbye, ${name}. I hope to see you back sometime soon.</h1>`
    }).then(msg => console.log(msg)) // logs response data
      .catch(err => console.log(err)); // logs any error
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}