/* address_book_utils.js
 * Copyright 2008, Convio
 *
 * Provides Convio Address Book Component functionality.
 * 
 * Depends on:
 * YUI Core, Cookies, Connection
 * convio_config.js
 * address_book_rest.js
 *
 */

// TODO DSW Snowbird Is this dead code?  I get no external hits when I search PC2 for "YAHOO.Convio.PC2.Component.AddressBook."

YAHOO.Convio.PC2.Component.AddressBook = {
    
    abListCriteria: {
            pageSize: 100,
            pageOffset: 0
    },
    
    /* This method creates a dialog
     * for adding address book contacts.
     */
    loadAddContactDialog: function(container, addButton) {
        YAHOO.Convio.PC2.Component.AddressBook.addContactDialog = new YAHOO.Convio.PC2.Component.AddressBook.AddContactDialog('addContactDialog');
        YAHOO.Convio.PC2.Component.AddressBook.addContactDialog.render();
        
        var addButtonButton = new YAHOO.widget.Button(addButton);
        
        YAHOO.util.Event.addListener(
            addButton,
            "click", 
            YAHOO.Convio.PC2.Component.AddressBook.addContactDialog.show, 
            YAHOO.Convio.PC2.Component.AddressBook.addContactDialog, 
            true);
    },
    
    /* This method creates a SimpleDialog
     * to confirm deleting address book
     * contacts.
     */
    loadRemoveContactDialog: function() {
        
        var RemoveContactCallback = {
            success: function(o) {
                YAHOO.Convio.PC2.Component.AddressBook.myDataTable.deleteRow(YAHOO.Convio.PC2.Component.AddressBook.deleteRecordDialog.target);
            },
            
            failure: function(o) {
                alert(o.responseText);
            },
            
            scope: YAHOO.Convio.PC2.AddressBook
        };
        
        /* Begin Delete Dialog */
        // Define various event handlers for Dialog
        var handleYes = function() {
            var record = YAHOO.Convio.PC2.Component.AddressBook.myDataTable.getRecord(this.target);           
            YAHOO.Convio.PC2.AddressBook.removeAddressBookContact(RemoveContactCallback, record.getData("id"));
            this.hide();
            YAHOO.Convio.PC2.Component.AddressBook.myDataTable.unselectAllRows();
            YAHOO.Convio.PC2.Component.AddressBook.myDataTable.getTbodyEl().tabIndex = 0;
            YAHOO.Convio.PC2.Component.AddressBook.myDataTable.getTbodyEl().focus();
        };
        var handleNo = function() {
            var record = YAHOO.Convio.PC2.Component.AddressBook.myDataTable.getRecord(this.target);
            this.hide();
            YAHOO.Convio.PC2.Component.AddressBook.myDataTable.getTbodyEl().tabIndex = 0;
            var row = YAHOO.Convio.PC2.Component.AddressBook.myDataTable.getTrEl(record);
            row.tabIndex = 0;
            row.focus();
        };
    
        // Instantiate the Dialog
        YAHOO.Convio.PC2.Component.AddressBook.deleteRecordDialog = 
			YAHOO.Convio.PC2.Component.SimpleDialogBuilder.buildConfirmDialog(
				"deleteRecordDialog",
				[ /* dialog buttons */
        		  { text:"Yes", handler:handleYes, isDefault:true },
                  { text:"No",  handler:handleNo } 
        		],
				{ /* config overrides */
					text: "Do you want to continue?",
					icon: YAHOO.widget.SimpleDialog.ICON_HELP
				}
    	   );
        YAHOO.Convio.PC2.Component.AddressBook.deleteRecordDialog.setHeader("Confirm delete");
        YAHOO.Convio.PC2.Component.AddressBook.deleteRecordDialog.render(document.body);
        YAHOO.Convio.PC2.Component.AddressBook.deleteRecordDialog.updateText = function(record) {
            this.setBody("Really delete " + record.getData("firstName") + " " + record.getData("lastName") + "?");
        }
    },
    
    /* 
     * This method loads the address book table.
     */
    loadAddressBook: function(container) {
        YAHOO.lang.extend(YAHOO.Convio.PC2.Component.AddressBook.AddContactDialog, YAHOO.Convio.PC2.Component.PC2Dialog);
        YAHOO.lang.extend(YAHOO.Convio.PC2.Component.AddressBook.EditContactDialog, YAHOO.Convio.PC2.Component.PC2Dialog);
        
        YAHOO.log('Entry: loadAddressBook(' + container + ')', 'info', 'address_book_utils.js');
        
        YAHOO.Convio.PC2.Component.AddressBook.editContactDialog = new YAHOO.Convio.PC2.Component.AddressBook.EditContactDialog('editContactDialog');

        
        /* Custom Cell Formatter */
        this.formatName = function(elCell, oRecord, oColumn, sData) {
            elCell.innerHTML = oRecord.getData("firstName") + ' ' + sData;
            elCell.tabIndex = -1;
            elCell.setAttribute('role','presentation');
        };
        
        this.focusRemover = function(elCell, oRecord, oColumn, sData) {
            if(!YAHOO.lang.isUndefined(sData)) {
                elCell.innerHTML = sData;
            }
            elCell.tabIndex = -1;
            elCell.setAttribute('role','presentation');
        }
    
        /* Column Definitions */
        var myColumnDefs = [
            {key:'delete', label:' ', className:'delete-button', formatter:this.focusRemover}, 
            /*{key:"Id"},*/
            {key:"lastName", label:"Name", formatter:this.formatName, sortable:true},
            {key:"email", sortable:true, formatter:this.focusRemover}
        ];
    
        /* Data Source */
        YAHOO.Convio.PC2.Component.AddressBook.myDataSource = new YAHOO.util.XHRDataSource(YAHOO.Convio.PC2.Config.AddressBook.getUrl());
        YAHOO.Convio.PC2.Component.AddressBook.myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSON;
        YAHOO.Convio.PC2.Component.AddressBook.myDataSource.connXhrMode = "queueRequests";
        YAHOO.Convio.PC2.Component.AddressBook.myDataSource.connMethodPost = true;
        YAHOO.Convio.PC2.Component.AddressBook.myDataSource.responseSchema = {
            resultsList: "getAddressBookContactsResponse.addressBookContact",
            fields: ["id","firstName","lastName","email"]
        };
    
        try {
            YAHOO.Convio.PC2.Component.AddressBook.myDataTable = new YAHOO.widget.DataTable(
                container,
                myColumnDefs,
            YAHOO.Convio.PC2.Component.AddressBook.myDataSource, {
                        initialRequest: YAHOO.Convio.PC2.AddressBook.getAddressBookContactsParams(YAHOO.Convio.PC2.Component.AddressBook.abListCriteria), 
                        selectionMode:"single"
                }
            );
        } catch(e) {
            YAHOO.log(e, 'error', 'address_book_utils.js');
        }
        
        var showDeletePanel = function(target) {
            var record = YAHOO.Convio.PC2.Component.AddressBook.myDataTable.getRecord(target);
                YAHOO.Convio.PC2.Component.AddressBook.deleteRecordDialog.target = target;
                YAHOO.Convio.PC2.Component.AddressBook.deleteRecordDialog.updateText(record);
                YAHOO.Convio.PC2.Component.AddressBook.deleteRecordDialog.show();
        };
        
        var showEditPanel = function(target) {
            var record = YAHOO.Convio.PC2.Component.AddressBook.myDataTable.getRecord(target);
                YAHOO.Convio.PC2.Component.AddressBook.editContactDialog.record = record;
                YAHOO.Convio.PC2.Component.AddressBook.editContactDialog.updateText(record);
                YAHOO.Convio.PC2.Component.AddressBook.editContactDialog.show();
        };
        
        // Subscribe to events for row selection
        YAHOO.Convio.PC2.Component.AddressBook.myDataTable.subscribe("rowMouseoverEvent", YAHOO.Convio.PC2.Component.AddressBook.myDataTable.onEventHighlightRow);
        YAHOO.Convio.PC2.Component.AddressBook.myDataTable.subscribe("rowMouseoutEvent", YAHOO.Convio.PC2.Component.AddressBook.myDataTable.onEventUnhighlightRow);
        YAHOO.Convio.PC2.Component.AddressBook.myDataTable.subscribe("rowSelectEvent", function(oArgs) {
            var recordSet = YAHOO.Convio.PC2.Component.AddressBook.myDataTable.getRecordSet();
            YAHOO.log('recordSet.length=' + recordSet.getLength(),'info','address_book_utils.js');
            for(var i=0; i < recordSet.getLength(); i++) {
                var currentRow = YAHOO.Convio.PC2.Component.AddressBook.myDataTable.getTrEl(recordSet.getRecord(i));
                if(currentRow == null) {
                    //YAHOO.log('CurrentRow=null','info','address_book_utils.js');  
                } else if(currentRow != oArgs.el) {
                    //YAHOO.log('Disallowing tab for row ' + i,'info','address_book_utils.js');
                    YAHOO.Convio.PC2.Component.AddressBook.myDataTable.unselectRow(currentRow);
                    currentRow.tabIndex=-1;
                    currentRow.setAttribute('aria-selected', false);
                    currentRow.setAttribute('role','row');
                }
            }
            
            var body = YAHOO.Convio.PC2.Component.AddressBook.myDataTable.getTbodyEl();
            body.tabIndex = 0;
            //body.focus();
                
            var el = oArgs.el;
            var record = oArgs.record;
            YAHOO.log('focus to ' + el, 'info', 'address_book_utils.js');
            el.tabIndex = 0;
            el.setAttribute('aria-selected',true);
            YAHOO.Convio.PC2.Component.AddressBook.myDataTable.getTableEl().activedescendant=el;
            el.focus();
        });
        
        YAHOO.Convio.PC2.Component.AddressBook.myDataTable.subscribe("tbodyKeyEvent", function(oArgs) {
            var event = oArgs.event;
            var keyCode = event.keyCode;
            YAHOO.log('KeyPress: code=' + keyCode, 'info', 'address_book_utils.js');
            
            
            var rows = YAHOO.Convio.PC2.Component.AddressBook.myDataTable.getSelectedRows();
            
            /* Enter key */
            if(keyCode == 13) {
                showEditPanel(document.getElementById(rows));
            }
            
            /* Backspace and Delete */
            if(keyCode == 8 || keyCode == 46) {
                showDeletePanel(document.getElementById(rows));
            }
        });
        

        
        YAHOO.Convio.PC2.Component.AddressBook.myDataTable.subscribe('cellClickEvent',function(oArgs) {
            var target = oArgs.target;
            var column = YAHOO.Convio.PC2.Component.AddressBook.myDataTable.getColumn(target);
            if (column.key == 'delete') {
                showDeletePanel(target);
            } else {
                showEditPanel(target);
            }
        });
        
        YAHOO.Convio.PC2.Component.AddressBook.myDataTable.subscribe("tbodyFocusEvent", function(oArgs) {
            var rows = YAHOO.Convio.PC2.Component.AddressBook.myDataTable.getSelectedRows();
            if(rows == '') {
                YAHOO.Convio.PC2.Component.AddressBook.myDataTable.selectRow(0);
                rows = YAHOO.Convio.PC2.Component.AddressBook.myDataTable.getSelectedRows();
            }
            /*
            YAHOO.log('TBodyFocus1, rows=' + rows,'info','address_book_utils.js');
            var record = YAHOO.Convio.PC2.Component.AddressBook.myDataTable.getRecord(document.getElementById(rows));
            YAHOO.log('TBodyFocus1.5, record=' + record,'info','address_book_utils.js');
            var trElm = YAHOO.Convio.PC2.Component.AddressBook.myDataTable.getTrEl(record);
            if(trElm) {
                YAHOO.log('TBodyFocus2, trElm=' + trElm,'info','address_book_utils.js');
                trElm.tabIndex = 0
                trElm.setAttribute('aria-selected',true);
                YAHOO.Convio.PC2.Component.AddressBook.myDataTable.getTableEl().activedescendant=trElm;
                trElm.focus();
            }*/
        });
        
        YAHOO.Convio.PC2.Component.AddressBook.myDataTable.getTbodyEl().setAttribute('aria-labelledby','addr_body_label');
        YAHOO.Convio.PC2.Component.AddressBook.myDataTable.getTbodyEl().setAttribute('aria-describedby','addr_body_description');
        YAHOO.Convio.PC2.Component.AddressBook.myDataTable.getTableEl().setAttribute('role','grid');
        
        YAHOO.log('Exit: loadAddressBook(' + container + ')', 'info', 'address_book_utils.js');
    },
    
    addPlaxoAddresses: function(contacts) {
        YAHOO.log('Entry: addPlaxoAddresses', 'info', 'address_book_utils.js');
        
        var myCallback = function(oRequest, oResults, oPayload) {
            if(oResults.error) {
                YAHOO.log("Error: no data returned.", "error", "address_book_utils.js");
                return;
            }
            
            this.set("sortedBy", null);
            this.onDataReturnAppendRows.apply(this,arguments);
        };
        
        var callback1 = {
            success : myCallback,
            failure : myCallback,
            scope : YAHOO.Convio.PC2.Component.AddressBook.myDataTable
        };
        
        try {
            YAHOO.Convio.PC2.Component.AddressBook.myDataSource.sendRequest(
                YAHOO.Convio.PC2.AddressBook.addPlaxoAddressesParams(contacts),
                callback1);
        } catch(e) {
            YAHOO.log(e, 'error', 'address_book_utils.js');
        }
        
        YAHOO.log('Exit: addPlaxoAddresses', 'info', 'address_book_utils.js');
    }
};

// AddContact
YAHOO.Convio.PC2.Component.AddressBook.AddContactDialog = function(id) {
    YAHOO.log('Creating AddContactDialog','info','address_book_utils.js');
    
    try {
        this.AddContactCallback = {
            success: function(o) {
                var contact = YAHOO.lang.JSON.parse(o.responseText).addAddressBookContactResponse.addressBookContact;
                YAHOO.Convio.PC2.Component.AddressBook.myDataTable.addRow(contact);
            },
            
            failure: function(o) {
                alert(o.responseText);
            },
            
            scope: YAHOO.Convio.PC2.AddressBook
        };
        
        // Define various event handlers for Dialog
        this.handleSubmit = function() {
            try {
                var data = this.getData();
                var contact = {
                    firstName: data.firstname,
                    lastName: data.lastname,
                    email: data.email
                };
                
                YAHOO.Convio.PC2.AddressBook.addAddressBookContact(this.AddContactCallback, contact);
                this.hide();
                this.form.reset();
            } catch(e) {
                YAHOO.log('Error with AddContactDialog.handleSubmit: ' + e, 'error', 'address_book_utils.js');
            }
        };
        
        this.handleCancel = function() {
            this.cancel();
        };
        
        // define config details for the dialog
        var MsgCatProvider = YAHOO.Convio.PC2.Component.Content;
        var dialogConfig = {
            width : "27em",
            modal: true, 
            visible : false, 
            close: false,
            buttons : [ { text:MsgCatProvider.getMsgCatValue('dialog_submit'), handler:this.handleSubmit, isDefault:true },
                        { text:MsgCatProvider.getMsgCatValue('dialog_cancel'), handler:this.handleCancel } ]
        };
        
        // invoke the super class constructor
        YAHOO.Convio.PC2.Component.AddressBook.AddContactDialog.superclass.constructor.call(
            this, 
            id || YAHOO.util.Dom.generateId(), 
            dialogConfig
        );
        
        this.setHeader('Add a new contact');
        this.setBody('<form action="javascript: void(0);">' +
                        '<label for="firstname">First Name:</label><input type="textbox" name="firstname" />' + 
                        '<label for="lastname">Last Name:</label><input type="textbox" name="lastname" />' + 
                        '<label for="email">E-mail:</label><input type="textbox" name="email" />' + 
                     '</form>');
        this.render(document.body);
    } catch(e) {
        YAHOO.log('Error creating AddContactDialog: ' + e, 'error', 'address_book_utils.js');
    }
};


// EditContact
YAHOO.Convio.PC2.Component.AddressBook.EditContactDialog = function(id) {
    YAHOO.log('Creating EditContactDialog','info','address_book_utils.js');
    
    try {
        this.EditContactCallback = {
            success: function(o) {
                var data = this.getData();
                var record = this.record;
                var row = YAHOO.Convio.PC2.Component.AddressBook.myDataTable.getRow(record);
                var contact = {
                    id: record.getData("id"),
                    firstName: data.firstname,
                    lastName: data.lastname,
                    email: data.email
                };
                YAHOO.Convio.PC2.Component.AddressBook.myDataTable.updateRow(row, contact);
            },
            
            failure: function(o) {
                alert(o.responseText);
            },
            
            scope: this
        };
            
        // Define various event handlers for Dialog
        this.handleSubmit = function() {
            try {
                var data = this.getData();
                var contact = {
                    firstName: data.firstname,
                    lastName: data.lastname,
                    email: data.email,
                    contactId: this.record.getData("id")
                };
                this.hide();
                YAHOO.Convio.PC2.AddressBook.updateAddressBookContact(this.EditContactCallback, contact);
                //* Reset focus to table */
                YAHOO.Convio.PC2.Component.AddressBook.myDataTable.getTbodyEl().tabIndex = 0;
                var row = YAHOO.Convio.PC2.Component.AddressBook.myDataTable.getTrEl(this.record);
                row.tabIndex = 0;
                row.focus();
            } catch(e) {
                YAHOO.log('Error with EditContactDialog.handleSubmit: ' + e, 'error', 'address_book_utils.js');
            }
        };
        
        this.handleCancel = function() {
            this.cancel();
            //* Reset focus to table */
            YAHOO.Convio.PC2.Component.AddressBook.myDataTable.getTbodyEl().tabIndex = 0;
            var row = YAHOO.Convio.PC2.Component.AddressBook.myDataTable.getTrEl(this.record);
            row.tabIndex = 0;
            row.focus();
        };
        
        this.updateText = function(record) {
            this.form.firstname.value = record.getData("firstName");
            this.form.lastname.value = record.getData("lastName");
            this.form.email.value = record.getData("email");
        };
        
        // define config for the dialog
        var MsgCatProvider = YAHOO.Convio.PC2.Component.Content;
        var dialogConfig = {
            width : "27em",
            modal: true, 
            close : false,
            visible : false, 
            buttons : [ { text:MsgCatProvider.getMsgCatValue('dialog_submit'), handler:this.handleSubmit, isDefault:true },
                        { text:MsgCatProvider.getMsgCatValue('dialog_cancel'), handler:this.handleCancel } ]
        };
        
        // invoke the super class constructor
        YAHOO.Convio.PC2.Component.AddressBook.EditContactDialog.superclass.constructor.call(
            this, 
            id || YAHOO.util.Dom.generateId(), 
            dialogConfig
        );
        
        this.setHeader('Update an existing contact');
        this.setBody('<form action="javascript: void(0);">' +
                        '<label for="firstname">First Name:</label><input type="textbox" name="firstname" />' + 
                        '<label for="lastname">Last Name:</label><input type="textbox" name="lastname" />' + 
                        '<label for="email">E-mail:</label><input type="textbox" name="email" />' + 
                     '</form>');
        
        this.render(document.body);
        
    } catch(e) {
        YAHOO.log('Error creating AddContactDialog: ' + e, 'error', 'address_book_utils.js');
    }
};


