(function() {

    //Helper Functions
    function $(elem) {
        return document.querySelectorAll(elem);
    }

    function $hasClass(elem, className) {
        return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
    }

    function $addClass(elem, cl) {
        elem.className += (elem.className ? " " : "")+cl;
    }

    function $removeClass(elem, className) {
        var newClass = ' ' + elem.className.replace( /[\t\r\n]/g, ' ') + ' ';
        if ($hasClass(elem, className)) {
            while (newClass.indexOf(' ' + className + ' ') >= 0 ) {
                newClass = newClass.replace(' ' + className + ' ', ' ');
            }
            elem.className = newClass.replace(/^\s+|\s+$/g, '');
        }
    }

    //Local Storage for data persistence
    function LocalStorage() {

        var name = "hall-contact-list";

        //Create new localstorage object for app if it doesn't exist.
        if(!localStorage[name]) {
            var data = {
                contacts: []
            }

            localStorage[name] = JSON.stringify(data);
        }

        //Save model to localstorage
        this.save = function(contact) {
            contact.id = new Date().getTime();

            var data = JSON.parse(localStorage[name])
            var contacts = data.contacts;
            contacts.push(contact);

            localStorage[name] = JSON.stringify(data);
        }

        //find and remove model from local storage by id
        this.remove = function(contactId) {
            var data = JSON.parse(localStorage[name]);
            var contacts = data.contacts;

            for(i=0;0<contacts.length;i++) {
                if(contacts[i].id == contactId) {
                    contacts.splice(i,1);
                    break;
                }
            }

            localStorage[name] = JSON.stringify(data);
        }

        //find model in localstorage by id.
        this.find = function(id) {

            var data = JSON.parse(localStorage[name]);
            var contacts = data.contacts;

            var matchedContacts = contacts.filter(function(contact) {
                if(contact.id == id) {
                    return true;
                }
                else {
                    return false;
                }
            });

            return matchedContacts[0];
        }

        this.replace = function(data) {
            localStorage[name] = JSON.stringify(data);
        }

        //return all models in local storage
        this.findAll = function() {
            return JSON.parse(localStorage[name]).contacts;
        }
    }

    //Contact Model
    function ContactModel(storage) {
        var self = this;

        this.storage = storage;

        this.create = function(firstName, lastName, phoneNumber) {
            var newContact = {
                "firstName": firstName,
                "lastName": lastName,
                "phoneNumber": phoneNumber
            }
            self.storage.save(newContact);
        }
        this.destroy = function(id) {
            self.storage.remove(id)
        }

        this.find = function(id) {
            return self.storage.find(id);
        }

        this.findAll = function() {
            return self.storage.findAll();
        }

        this.replace = function(data) {
            self.storage.replace(data);
        }
    }


    //Contact View
    function ContactView() {
        var self = this;

        this.contactList = $('.list__contact')[0];
        this.exportButton = $('.button__export')[0]
        this.importButton = $('.button__import')[0];
        this.addContactButton = $('.button__add-contact')[0];
        this.contactView = $('.view-contact')[0];
        this.addContactForm = $('#add-contact')[0];
        this.debugView = $('.view-debug')[0];

        this.inputFirstName = $('input[name="first-name"]')[0];
        this.inputLastName = $('input[name="last-name"]')[0];
        this.inputPhoneNumber = $('input[name="phone-number"]')[0];

        this.render = function(view, data) {

            var renderMap = {
                "contactList": function(data) {
                    var contacts = data;
                    self.contactList.innerHTML = "";
                    for(i=0; i<contacts.length; i++) {
                        var contact = contacts[i];
                        var contactItem = document.createElement('li');
                        
                        var removeButton = document.createElement('div');
                        removeButton.className = "button__remove-contact";

                        contactItem.setAttribute('data-id', contact.id);
                        contactItem.innerHTML = contact.firstName + " " + contact.lastName;
                        contactItem.appendChild(removeButton);
                        self.contactList.appendChild(contactItem);
                    }
                },
                "contact": function(data) {
                    self.contactView.innerHTML = "";
                    var contact = data;
                    if(contact) {
                        var name = document.createElement('h2');
                        name.innerHTML = contact.firstName + " " + contact.lastName;

                        var number = document.createElement('p');
                        number.className = 'phone-number';
                        number.innerHTML = contact.phoneNumber;
                        self.contactView.appendChild(name);
                        self.contactView.appendChild(number);
                    }

                },
                'export': function(data) {
                    var contactJSON = data;
                    var exportArea = $('.dialogue__export textarea')[0];
                    exportArea.value = JSON.stringify(contactJSON);
                }
            }

            renderMap[view](data);

        }

        this.bind = function(event, handler) {
            eventMap = {
                "addContact": function() {
                    self.addContactForm.addEventListener("submit", function(e) {
                        e.preventDefault();

                        //Generate contact object from values in form
                        var contact = {
                            "firstName": self.inputFirstName.value,
                            "lastName": self.inputLastName.value,
                            "phoneNumber": self.inputPhoneNumber.value
                        }
                        var dialogueContainer = $('.dialogues-container')[0];
                        var dialogues = $('section[class*="dialogue"]');
                        $removeClass(dialogueContainer, 'show');
                        for(i=0;i<dialogues.length;i++) {
                            $removeClass(dialogues[i], 'show');
                        }
                        self.logEvent('Contact Added.')
                        handler(contact);
                    })
                },

                "clickContact": function() {
                    var contactItems = $('.list__contact li');
                    for(i=0; i<contactItems.length; i++) {
                        contactItems[i].addEventListener('click', function(e) {
                            var contactId = e.target.getAttribute('data-id');
                            self.logEvent('Contact selected.');
                            handler(contactId);
                        });
                    }                    
                },

                "removeContact": function() {
                    var removeButtons = $('.button__remove-contact');
                    for(i=0; i<removeButtons.length; i++) {
                        removeButtons[i].addEventListener('click', function(e) {
                            var contactId = e.target.parentNode.getAttribute('data-id');
                            self.logEvent('Contact deleted.');
                            handler(contactId);
                        });
                    } 
                },
                "addContactButton": function() {
                    var addContactButton = $('.button__add-contact')[0];
                    addContactButton.addEventListener('click', function(e) {
                        e.preventDefault();
                        var dialoguesContainer = $('.dialogues-container')[0];
                        var addContactDialogue = $('.dialogue__add-contact')[0];
                        $addClass(dialoguesContainer, 'show');
                        $addClass(addContactDialogue, 'show');
                        self.logEvent('Add Contact Button pressed.');
                    })
                },
                "importButton": function() {
                    var importButton = $('.button__import')[0];
                    importButton.addEventListener('click', function(e) {
                        e.preventDefault();
                        var dialoguesContainer = $('.dialogues-container')[0];
                        var importDialogue = $('.dialogue__import')[0];
                        $addClass(dialoguesContainer, 'show');
                        $addClass(importDialogue, 'show');
                        self.logEvent('Import Button pressed.')
                    })
                },
                "exportButton": function() {
                    var exportButton = $('.button__export')[0];
                    exportButton.addEventListener('click', function(e) {
                        e.preventDefault();
                        var dialoguesContainer = $('.dialogues-container')[0];
                        var exportDialogue = $('.dialogue__export')[0];
                        $addClass(dialoguesContainer, 'show');
                        $addClass(exportDialogue, 'show');
                        self.logEvent('Export Button pressed.')
                        handler();
                    })
                },
                "dialogueContainer": function() {
                    var dialogueContainer = $('.dialogues-container')[0];
                    var dialogues = $('section[class*="dialogue"]');
                    dialogueContainer.addEventListener('click', function(e) {
                        if($hasClass(e.target, 'dialogues-container')) {
                            $removeClass(this, 'show');
                            for(i=0;i<dialogues.length;i++) {
                                $removeClass(dialogues[i], 'show');
                            }
                            self.logEvent('Dismissing dialogue.');
                        }
                    });
                },
                "importForm": function() {
                    var importForm = $('#import-contacts')[0];
                    importForm.addEventListener('submit', function(e) {
                        var importData = $('#import-area')[0].value;
                        e.preventDefault();
                        self.logEvent('Replacing contact list with imported JSON.');
                        handler(importData);
                        var dialogueContainer = $('.dialogues-container')[0];
                        var dialogues = $('section[class*="dialogue"]');
                        $removeClass(dialogueContainer, 'show');
                        for(i=0;i<dialogues.length;i++) {
                            $removeClass(dialogues[i], 'show');
                        }
                        $('#import-area')[0].value = "";
                    });

                }
            }

            eventMap[event]();

        }

        this.logEvent = function(msg) {
            var msgItem = document.createElement('p');
            msgItem.innerHTML = '- ' + msg;
            self.debugView.appendChild(msgItem);
        }
    }

    //Contact Controller
    function ContactController(view, model) {
        var self = this;

        this.view = view;
        this.model = model;

        //On addcontact event, update model and view
        this.addContact = function(contact) {
            self.model.create(contact.firstName, contact.lastName, contact.phoneNumber);
            self.view.render('contactList', self.model.findAll());
            self.bindContactListEvents();
        }

        this.removeContact = function(contactId) {
            self.model.destroy(contactId);
            self.view.render('contactList', self.model.findAll())
            self.bindContactListEvents();
        }

        this.bindContactListEvents = function() {
            this.view.bind('clickContact', function(contactId) {
                self.view.render('contact', self.model.find(contactId))
            })

            this.view.bind('removeContact', function(contactId) {
                self.removeContact(contactId);
                //TODO: if the current detail view is deleted user, remove.
            })
        }

        //Initial rendering
        this.view.render('contactList', self.model.findAll());
        this.view.render('contact', self.model.findAll()[0]); //renders first contact

        //Initial binding of events
        this.view.bind('addContact', function(contact) {
            self.addContact(contact);
        });
        this.bindContactListEvents();
        this.view.bind('addContactButton', function() {});
        this.view.bind('importButton', function() {});
        this.view.bind('exportButton', function() {
            self.view.render('export', self.model.findAll());
        });
        this.view.bind('dialogueContainer', function() {});
        this.view.bind('importForm', function(data) {
            self.model.replace(JSON.parse(data));
            self.view.render('contactList', self.model.findAll());
            self.view.render('contact', self.model.findAll()[0]); //renders first contact
            self.bindContactListEvents();

        })
    }

    //Contact App
    function ContactList() {
        var self = this;
        this.boot = function() {
            self.storage = new LocalStorage();
            self.model = new ContactModel(self.storage);
            self.view = new ContactView();
            self.controller = new ContactController(self.view, self.model);
        }

    }

    window.contactList = new ContactList();
    window.contactList.boot();

})();