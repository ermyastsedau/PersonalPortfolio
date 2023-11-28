const Contact = require('../models/contact.model');

exports.getMessages = async (req, res) => {

    const messages = await Contact.find();

    res.render("contact", {
        title: "Contact us",
        isAuthenticated: req.session.isAuthenticated,
        userRoles: req.session.userRoles,
        messages: messages
    });
};

exports.sendMessage = async (req, res) => {
    const contact = new Contact({
        fullname: req.body.fullname,
        email: req.body.email,
        phone: req.body.phone,
        message: req.body.message,
    });

    contact.save()
        .then(savedInstance => {
            req.session.message = {
                type: 'success',
                message: 'message sent successfully'
            };

            res.redirect('/contact');
        })
        .catch(err => {
            res.json({ message: err.message, type: 'danger' })
        });
};

