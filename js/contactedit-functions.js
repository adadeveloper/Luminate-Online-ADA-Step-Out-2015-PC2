var contactEditLoadSafe = function() {
	if(YAHOO.Convio.PC2.Data.currentContact) {
		contactEditLoadContact();
	} else {
		var editContactGetDetailsCallback = {
			success: function(o) {
				getContactCallback.success(o);
				contactEditLoadContact();
			},
			failure: function(o) {
				getContactCallback.failure(o);
			}
		};
		YAHOO.Convio.PC2.Teamraiser.getAddressBookContact(editContactGetDetailsCallback, contactId);
	}
}

var contactEditLoadContact = function() {
	var contact = YAHOO.Convio.PC2.Data.currentContact;
	var el;

	el = YAHOO.util.Dom.get("contactedit_first_name");
    if(contact.firstName && YAHOO.lang.isString(contact.firstName)) {
        el.value = YAHOO.Convio.PC2.Utils.htmlUnescape(contact.firstName);
    }
    else {
    	el.value = '';
    }

    el = YAHOO.util.Dom.get("contactedit_last_name");
    if(contact.lastName && YAHOO.lang.isString(contact.lastName)) {
        el.value = YAHOO.Convio.PC2.Utils.htmlUnescape(contact.lastName);
    }
    else {
    	el.value = '';
    }

    el = YAHOO.util.Dom.get("contactedit_email");
    if(contact.email && YAHOO.lang.isString(contact.email)) {
        el.value = YAHOO.Convio.PC2.Utils.htmlUnescape(contact.email);
    }
    else {
    	el.value = '';
    }

    el = YAHOO.util.Dom.get("contactedit_address1");
    if(contact.street1 && YAHOO.lang.isString(contact.street1)) {
        el.value = YAHOO.Convio.PC2.Utils.htmlUnescape(contact.street1);
    }
    else {
    	el.value = '';
    }

    el = YAHOO.util.Dom.get("contactedit_address2");
    if(contact.street2 && YAHOO.lang.isString(contact.street2)) {
        el.value = YAHOO.Convio.PC2.Utils.htmlUnescape(contact.street2);
    }
    else {
    	el.value = '';
    }
    
    el = YAHOO.util.Dom.get("contactedit_address3");
    if(contact.street3 && YAHOO.lang.isString(contact.street3)) {
        el.value = YAHOO.Convio.PC2.Utils.htmlUnescape(contact.street3);
    }
    else {
    	el.value = '';
    }
    
    el = YAHOO.util.Dom.get("contactedit_city");
    if(contact.city && YAHOO.lang.isString(contact.city)) {
        el.value = YAHOO.Convio.PC2.Utils.htmlUnescape(contact.city);
    }
    else {
    	el.value = '';
    }

    el = YAHOO.util.Dom.get("contactedit_state");
    if(contact.state && YAHOO.lang.isString(contact.state)) {
        el.value = YAHOO.Convio.PC2.Utils.htmlUnescape(contact.state);
    }
    else {
    	el.value = '';
    }

    el = YAHOO.util.Dom.get("contactedit_county");
    if(contact.county && YAHOO.lang.isString(contact.county)) {
        el.value = YAHOO.Convio.PC2.Utils.htmlUnescape(contact.county);
    }
    else {
    	el.value = '';
    }
    
    el = YAHOO.util.Dom.get("contactedit_zip");
    if(contact.zip && YAHOO.lang.isString(contact.zip)) {
        el.value = YAHOO.Convio.PC2.Utils.htmlUnescape(contact.zip);
    }
    else {
    	el.value = '';
    }
    
    el = YAHOO.util.Dom.get("contactedit_country");
    if(contact.country && YAHOO.lang.isString(contact.country)) {
        el.value = YAHOO.Convio.PC2.Utils.htmlUnescape(contact.country);
    }
    else {
    	el.value = '';
    }
    
    el = YAHOO.util.Dom.get("contactedit_phone");
    if(contact.phone && YAHOO.lang.isString(contact.phone)) {
        el.value = YAHOO.Convio.PC2.Utils.htmlUnescape(contact.phone);
    }
    else {
    	el.value = '';
    }
}

var saveContactCallback = {
    success: function(o) {
        YAHOO.log("Saved contact.","info","contact_edit.js");
        var saveResponseContactId = YAHOO.lang.JSON.parse(o.responseText).updateTeamraiserAddressBookContactResponse.contact_id;
        if(!YAHOO.lang.isUndefined(window.myContactsMap)) {
	        var contact = myContactsMap[saveResponseContactId];
	        	
	        if (contact) {
		        var fNameEl = YAHOO.util.Dom.get("contactedit_first_name");
		        var lNameEl = YAHOO.util.Dom.get("contactedit_last_name");
		        var emailEl = YAHOO.util.Dom.get("contactedit_email");
		        var street1El = YAHOO.util.Dom.get("contactedit_address1");
		        var street2El = YAHOO.util.Dom.get("contactedit_address2");
		        var street3El = YAHOO.util.Dom.get("contactedit_address3");
		        var cityEl = YAHOO.util.Dom.get("contactedit_city");
		        var stateEl = YAHOO.util.Dom.get("contactedit_state");
		        var countyEl = YAHOO.util.Dom.get("contactedit_county");
		        var zipEl = YAHOO.util.Dom.get("contactedit_zip");
		        var countryEl = YAHOO.util.Dom.get("contactedit_country");
		        var phoneEl = YAHOO.util.Dom.get("contactedit_phone");
		        
		        contact.firstName = fNameEl.value,
		        contact.lastName = lNameEl.value,
		        contact.email = emailEl.value,
		        contact.street1 = street1El.value,
		        contact.street2 = street2El.value,
		        contact.street3 = street3El.value,
		        contact.city = cityEl.value,
		        contact.state = stateEl.value,
		        contact.county = countyEl.value,
		        contact.zip = zipEl.value,
		        contact.country = countryEl.value,
		        contact.phone = phoneEl.value
	        } else {
	        	YAHOO.Convio.PC2.Component.Contacts.Paginator.reset();
	        }
        }
        YAHOO.Convio.PC2.Views.emailContactsReset = true;
        
        contactId = saveResponseContactId;
        YAHOO.Convio.PC2.Utils.loadView("email", "contactdetails");
    },
    failure: function(o) {
        YAHOO.log("Error saving contact.","error","contact_edit.js");
        updateEditContactError(YAHOO.lang.JSON.parse(o.responseText).errorResponse.message); 
    },
    scope: this
};

var updateEditContactError = function(message) {
    YAHOO.util.Dom.get("contactedit-error").innerHTML = message;
    if(message == "") {
        hide_pc2_element("contactedit-error");
    } else {
        show_pc2_element("contactedit-error");
    }
};

var saveEditedContact = function() {
    var fNameEl = YAHOO.util.Dom.get("contactedit_first_name");
    var lNameEl = YAHOO.util.Dom.get("contactedit_last_name");
    var emailEl = YAHOO.util.Dom.get("contactedit_email");
    var street1El = YAHOO.util.Dom.get("contactedit_address1");
    var street2El = YAHOO.util.Dom.get("contactedit_address2");
    var street3El = YAHOO.util.Dom.get("contactedit_address3");
    var cityEl = YAHOO.util.Dom.get("contactedit_city");
    var stateEl = YAHOO.util.Dom.get("contactedit_state");
    var countyEl = YAHOO.util.Dom.get("contactedit_county");
    var zipEl = YAHOO.util.Dom.get("contactedit_zip");
    var countryEl = YAHOO.util.Dom.get("contactedit_country");
    var phoneEl = YAHOO.util.Dom.get("contactedit_phone");
    var contact = {
        contactId: contactId,
        firstName: fNameEl.value,
        lastName: lNameEl.value,
        email: emailEl.value,
        street1: street1El.value,
        street2: street2El.value,
        street3: street3El.value,
        city: cityEl.value,
        state: stateEl.value,
        county: countyEl.value,
        zip: zipEl.value,
        country: countryEl.value,
        phone: phoneEl.value
    };
    YAHOO.Convio.PC2.Teamraiser.updateAddressBookContact(saveContactCallback, contact);
};

var contactEditGoBack = function() {
	YAHOO.Convio.PC2.Utils.loadView("email", "contactdetails");
};

var configureDisplayForLocale = function() {
	
	// The editcontact section of dashboard.html is set up for en_US by default. Any locale 
	// specific hiding / displaying of fields should happen here.
		
	if (YAHOO.Convio.PC2.Config.isUKLocale())
	{
		hide_pc2_element("contactedit_state_section");
		show_pc2_element("contactedit_address3_section");
		show_pc2_element("contactedit_county_section");
	}
	
};