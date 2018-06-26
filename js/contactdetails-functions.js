var loadContactActivity = function(contactId) {
    YAHOO.namespace("Convio.PC2.Component.ContactActivity");

    YAHOO.Convio.PC2.Component.ContactActivity.formatType = function(elCell, oRecord, oColumn, sData) {
        elCell.innerHTML = sData;

        var styleName = 'contact-activity-unknown';
        if(sData == 'DONATION') {
            elCell.innerHTML = document.getElementById('msg_cat_activity_type_donation').innerHTML;
        } else if(sData == 'MESSAGE') {
            elCell.innerHTML = document.getElementById('msg_cat_activity_type_message').innerHTML;
        } else if(sData == 'RECRUIT') {
            elCell.innerHTML = document.getElementById('msg_cat_activity_type_recruit').innerHTML;
        }
    };

    YAHOO.Convio.PC2.Component.ContactActivity.formatFollowup = function(elCell, oRecord, oColumn, sData) {
        var cellText = sData;
        if(YAHOO.lang.isString(sData)) {
            var beginIndex = sData.indexOf("void(0);");
            if(beginIndex >= 0) {
                cellText = sData.substring(0, beginIndex);
                cellText += "sendMessageTo(" + oRecord.getData().contactId + ");";
                cellText += sData.substring(beginIndex+8, sData.length);
            }
        } else {
            cellText = "";
        }
        elCell.innerHTML = cellText;
    };

    YAHOO.Convio.PC2.Component.ContactActivity.columnDefs = [
        {key: "date", label:"Date", className: "contactdetails-activity-date"},
        {key:"type", label:"Activity", formatter: YAHOO.Convio.PC2.Component.ContactActivity.formatType},
        {key:"activity", label:"Description", className: "contactdetails-activity-detail"},
        {key:"followup", label:"Additional Info", className: "contactdetails-activity-followup", formatter: YAHOO.Convio.PC2.Component.ContactActivity.formatFollowup}
    ];
    YAHOO.Convio.PC2.Component.ContactActivity.DataSource = new YAHOO.util.XHRDataSource(YAHOO.Convio.PC2.Config.Teamraiser.getUrl());

    YAHOO.Convio.PC2.Component.ContactActivity.DataSource.responseType = YAHOO.util.DataSource.TYPE_JSON;
    YAHOO.Convio.PC2.Component.ContactActivity.DataSource.connXhrMode = "queueRequests";
    YAHOO.Convio.PC2.Component.ContactActivity.DataSource.connMethodPost = true;
    YAHOO.Convio.PC2.Component.ContactActivity.DataSource.responseSchema = {
        resultsList: "getContactActivityResponse.contactActivityRecord",
        fields: ["type","activity","followup","date","contactId"]
    };

    try {
        YAHOO.Convio.PC2.Component.ContactActivity.DataTable = new YAHOO.widget.DataTable(
            'contact_details_history',
            YAHOO.Convio.PC2.Component.ContactActivity.columnDefs,
            YAHOO.Convio.PC2.Component.ContactActivity.DataSource, {
                    initialRequest: YAHOO.Convio.PC2.Teamraiser.getContactActivityParams(contactId),
                    selectionMode:"none"
            }
        );
    } catch(e) {
        YAHOO.log(e, 'error', 'dashboard.js');
    }
};

var removeGroupCallback = {
    success: function(o) {
        var response = YAHOO.lang.JSON.parse(o.responseText).removeContactFromGroupResponse;
        
        var groups = YAHOO.Convio.PC2.ContactDetails.groups;
        for(var i=0; i < groups.length; i++) {
            if(groups[i].id == response.group_id) {
                groups[i] = { 
                    id: -1,
                    name: 'removed' 
                };
            }
        }
    },
    failure: function(o) {
        YAHOO.log("Error removing contact from group.", "error", "contact_details.js");
    },
    scope: this
};

var handleGroupFn = function(group) {
    var groupSpan = document.createElement("div");
    groupSpan.id="contact_detail_group_" + group.id;
    YAHOO.util.Dom.addClass(groupSpan, "contact-detail-group");
    
    var groupName = document.createTextNode(group.name + " ");
    
    groupSpan.appendChild(groupName);
    
    var groupDelete = document.createElement("img");
    groupDelete.src = "../images/trash.gif";
    
    groupSpan.appendChild(groupDelete);
    
    YAHOO.util.Event.addListener(
        groupDelete,
        "click", 
        function() {
            //alert("Stub\n\nDelete this group: " + group.id);
            YAHOO.Convio.PC2.AddressBook.removeContactFromGroup(removeGroupCallback, contactId, group.id);
            YAHOO.Convio.PC2.Views.emailContactsReset = true;
            YAHOO.Convio.PC2.Views.emailGroupsReset = true;
            var el = YAHOO.util.Dom.get("contact_detail_group_" + group.id);
            el.parentNode.removeChild(el);
        }, 
        null, 
        false);
    
    var contactGroupsEl = YAHOO.util.Dom.get("progress-contactdetails-goal-value");
    
    contactGroupsEl.appendChild(groupSpan);
    var spacingEl = document.createTextNode(" ");
    contactGroupsEl.appendChild(spacingEl);
    jQuery('#progress-contactdetails-goal-team').accordion({collapsible: true, autoHeight: false});
};

var getContactCallback = {
    success: function(o) {
        var contact = YAHOO.lang.JSON.parse(o.responseText).getTeamraiserAddressBookContactResponse.addressBookContact;
        YAHOO.Convio.PC2.Data.currentContact = contact;
        
        // Contact name
        var contactNameEl = YAHOO.util.Dom.get("contact_name");
        var contactFirstNameStr = YAHOO.lang.isString(contact.firstName) ? contact.firstName : "";
        var contactLastNameStr = YAHOO.lang.isString(contact.lastName) ? contact.lastName : "";
        contactNameEl.innerHTML = contactFirstNameStr + " " + contactLastNameStr;
        
        // Contact email
        var contactEmailEl = YAHOO.util.Dom.get("contact_email");
        if(YAHOO.lang.isString(contact.email)) {
            YAHOO.util.Dom.removeClass("msg_cat_contact_details_compose", "hidden-form");
            contactEmailEl.innerHTML = contact.email;

            // Fixed as part of Bug 45303: Only include the compose button if the contact has an email.                
            YAHOO.util.Event.addListener("msg_cat_contact_details_compose", "click", function() {
                YAHOO.Convio.PC2.Views.contactIds = contact.id;
                YAHOO.Convio.PC2.Utils.loadView("email","compose");
                return false;
                //window.location.href="compose.html?contact_ids=" + contactId;
            });
        } else {
            YAHOO.util.Dom.addClass("msg_cat_contact_details_compose", "hidden-form");
        }
        
        // Contact Address
        var contactAddressEl = YAHOO.util.Dom.get("contact_details_address");
        var addrStr = YAHOO.Convio.PC2.Config.isUKLocale() ? getUKAddressString(contact) : getUSAddressString(contact);
        contactAddressEl.innerHTML = addrStr;
        
        // Contact Phone
        var contactPhoneEl = YAHOO.util.Dom.get("contact_details_phone");
        if(contact.phone && YAHOO.lang.isString(contact.phone)) {
            contactPhoneEl.innerHTML = contact.phone;
        }
        else {
        	contactPhoneEl.innerHTML = "&nbsp;";
        }
        
        // Contact amount raised
        var contactAmtEl = YAHOO.util.Dom.get("progress-contactdetails-amt-raised-value");
        contactAmtEl.innerHTML = YAHOO.Convio.PC2.Utils.formatCurrency(contact.amountRaised);
        
        // Contact percent opened
        var contactOpensEl = YAHOO.util.Dom.get("progress-contactdetails-percent-value");
        contactOpensEl.innerHTML = YAHOO.Convio.PC2.Utils.getPercentText(contact.messagesOpened, contact.messagesSent); 
        
        // Contact clickthroughs
        var contactClicksEl = YAHOO.util.Dom.get("progress-contactdetails-days-left-value");
        contactClicksEl.innerHTML = contact.clickThroughs;
        
        
        
        // Contact groups
        //var contactGroupsEl = YAHOO.util.Dom.get("progress-goal-value");
        YAHOO.namespace("Convio.PC2.ContactDetails");
        
        if(contact.group) {
            contact.group = YAHOO.Convio.PC2.Utils.ensureArray(contact.group);
            YAHOO.Convio.PC2.ContactDetails.groups = contact.group;
            YAHOO.log("Found group or groups.");
            //var groupStr = "";
            
            // Array of groups
            for(var i=0; i < contact.group.length; i++) {
                handleGroupFn(contact.group[i]);
            }
        } else {
            YAHOO.Convio.PC2.ContactDetails.groups = [];
            YAHOO.log("Found NO groups.","info","contact_details.js");
        }
        
    },
    failure: function(o) {
        YAHOO.log("Error retrieving contact: " + o.responseText, "error", "contact_details.js");
    },
    cache: false,
    scope: this
};

var getUSAddressString = function(contact) {
	
	var addrStr = "";
	
    if(contact.street1 && YAHOO.lang.isString(contact.street1)) {
        addrStr += contact.street1 + "<br />";
    }
    if(contact.street2 && YAHOO.lang.isString(contact.street2)) {
        addrStr += contact.street2 + "<br />";
    }
    if(contact.city && YAHOO.lang.isString(contact.city)) {
        addrStr += contact.city;
        if(contact.state && YAHOO.lang.isString(contact.state)) {
            addrStr += ", ";
        }
    }
    if(contact.state && YAHOO.lang.isString(contact.state)) {
        addrStr += contact.state;
    }
    if(contact.zip && YAHOO.lang.isString(contact.zip)) {
        addrStr += " " + contact.zip;
    }
    
    return addrStr;
};

var getUKAddressString = function(contact) {
	
	var addrStr = "";
	
	if(contact.street1 && YAHOO.lang.isString(contact.street1)) {
        addrStr += contact.street1 + "<br />";
    }
    if(contact.street2 && YAHOO.lang.isString(contact.street2)) {
        addrStr += contact.street2 + "<br />";
    }
    if(contact.street3 && YAHOO.lang.isString(contact.street3)) {
        addrStr += contact.street3 + "<br />";
    }
    if(contact.city && YAHOO.lang.isString(contact.city)) {
        addrStr += contact.city + "<br />";;
    }
    if(contact.county && YAHOO.lang.isString(contact.county)) {
        addrStr += contact.county + "<br />";;
    }
    if(contact.zip && YAHOO.lang.isString(contact.zip)) {
        addrStr += " " + contact.zip + "<br />";
    }
    if(contact.country && YAHOO.lang.isString(contact.country)) {
        addrStr += " " + contact.country;
    }
    
    return addrStr;
    
};

/* BEGIN GROUPS MENU */
var detailsAddMembersToGroupCallback = {
    success: function(o){
        YAHOO.log("detailsAddMembersToGroupCallback success","info","contacts_utils.js");
        var response = YAHOO.lang.JSON.parse(o.responseText).addContactsToGroupResponse;
        detailsUpdateGroupMembership(response);
        YAHOO.Convio.PC2.Views.emailContactsReset = true;
        YAHOO.Convio.PC2.Views.emailGroupsReset = true;
    },
    failure: function(o){
        YAHOO.log("Error adding contacts to group: " + o.responseText, "error", "contacts_utils.js");
    },
    scope: this
};

var detailsAddContactsToGroup = function(groupId) {
    YAHOO.log("detailsAddContactsToGroup entry, groupId=" + groupId + ", contactId=" + contactId, "info", "contacts_utils.js");
    //var contacts = YAHOO.Convio.PC2.Component.Contacts.getSelectedContacts();
    YAHOO.Convio.PC2.AddressBook.addContactsToGroup(detailsAddMembersToGroupCallback, groupId, contactId);
};

var detailsAddGroupMenuItemsCallback = {
    success: function(o){
    
        var initialMenu = [
            { 
                text: document.getElementById("msg_cat_contacts_create_a_new_group").innerHTML, 
                value: "add_new_group", 
                onclick: { 
                    fn: function (p_sType, p_aArgs, p_oItem) {
                        YAHOO.Convio.PC2.Component.ContactDetails.detailsAddGroupInstance.show();
                    }
                }
            }
        ];
        var detailsGroupsMenuButton = YAHOO.Convio.PC2.Component.ContactDetails.DetailsGroupsMenuButton;
        var detailsGroupsMenuButtonMenu = detailsGroupsMenuButton.getMenu(); 
        detailsGroupsMenuButtonMenu.clearContent();
        detailsGroupsMenuButtonMenu.addItems(initialMenu);
        detailsGroupsMenuButtonMenu.render();
        
        var response = YAHOO.lang.JSON.parse(o.responseText).getAddressBookGroupsResponse;
        detailsAddGroupMenuItems(response.group);
        
    },
    failure: function(o){
        YAHOO.log("Error loading groups: " + o.responseText, "error", "contacts_utils.js");
    }
};

var detailsAddGroupMenuItems = function(group) {
    if(!group) {
        return;
    }
   
    var detailsGroupsMenuButton = YAHOO.Convio.PC2.Component.ContactDetails.DetailsGroupsMenuButton;
    var detailsGroupsMenuButtonMenu = detailsGroupsMenuButton.getMenu();
   
    var detailsBuildNewMenuItem = function(rGroup) {
        var newMenuItem = { text: rGroup.name, value: rGroup.id, onclick: { 
            fn: 
                function (p_sType, p_aArgs, p_oItem) {
                    detailsAddContactsToGroup(p_oItem.value);
                }
            }
        };
        return newMenuItem;
    };
   
    group = YAHOO.Convio.PC2.Utils.ensureArray(group);
    for(var i=0; i < group.length; i++) {
        var menuItem = detailsBuildNewMenuItem(group[i]);
        detailsGroupsMenuButtonMenu.addItem(menuItem);
    }
    
    detailsGroupsMenuButtonMenu.render();
};

var detailsUpdateGroupMembership = function(response) {
    YAHOO.log("Entering detailsUpdateGroupMembership","info","contacts_utils.js");
    var groups = YAHOO.Convio.PC2.Utils.ensureArray(YAHOO.Convio.PC2.ContactDetails.groups);
    var existingGroup = false;
    for(var i=0; i < groups.length; i++) {
        if(response.addressBookGroup.id == groups[i].id) {
            YAHOO.log("Not adding group because it already exists.", "info", "contact_details.js");
            existingGroup = true;
            break;
        }
    }
    if(!existingGroup) {
        YAHOO.Convio.PC2.ContactDetails.groups[YAHOO.Convio.PC2.ContactDetails.groups.length] = { 
            id: response.addressBookGroup.id,
            name: response.addressBookGroup.name
        };
        handleGroupFn(response.addressBookGroup);
    }
};
