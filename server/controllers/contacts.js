let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

//create a reference to the model
let Contacts = require('../models/contacts');

module.exports.displayContactsList = (req, res, next) => {
    Contacts.find((err, contactsList) => {
        if(err)
        {
            return console.error(err);
        }
        else
        {
            //console.log(ContactsList);
            res.render('contacts/list', 
            {title: 'Contacts', 
            ContactsList: contactsList,
            displayName: req.user ? req.user.displayName : ''});
        }
    });
}

module.exports.displayAddPage = (req, res, next) => {
    res.render('contacts/add', {title: 'Add Contacts', 
    displayName: req.user ? req.user.displayName : ''})
}

module.exports.processAddPage = (req, res, next) => {
    let newContacts = contacts({
        "name": req.body.name,
        "number": req.body.number,
        "email": req.body.email
    });

    contacts.create(newContacts, (err, contacts) =>{
            if(err)
            {
                console.log(err);
                res.end(err);
            }
            else 
            {
                //refresh the contacts list
                res.redirect('/contacts-list');
            }
    });
};

module.exports.displayEditPage = (req, res, next) => {
    let id = req.params.id;

    contacts.findById(id, (err, contactsToEdit) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            //show the edit view
            res.render('contacts/edit', 
            {title: 'Edit Contacts', 
            contacts: contactsToEdit, 
            displayName: req.user ? req.user.displayName : ''})
        }
    });
};

module.exports.processEditPage = (req, res, next) => {
    let id = req.params.id

    let updatedContacts = contacts({
        "_id": id,
        "name": req.body.name,
        "number": req.body.number,
        "email": req.body.email
    });

    contacts.updateOne({_id: id}, updatedContacts, (err) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            //refresh the contacts list
            res.redirect('/contacts-list');
        }
    });
};

module.exports.performDelete = (req, res, next) => {
    let id = req.params.id;

    contacts.remove({_id: id}, (err) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            //refresh the contacts list
            res.redirect('/contacts-list');
        }
    });

};


