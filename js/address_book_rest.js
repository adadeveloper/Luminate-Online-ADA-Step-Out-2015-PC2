/* address_book_rest.js
 * Copyright 2008, Convio
 *
 * Provides Convio Address Book ReST call functionality.
 * 
 * Depends on:
 * YUI Core, Cookies, Connection
 * convio_config.js
 * convio_utils.js
 *
 */
YAHOO.Convio.PC2.AddressBook = {
    
    updateAddressBookContact: function(callback, contact) {        
        var params = "method=updateAddressBookContact&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        
        /* Contact */
        params += "&contact_id=" + encodeURIComponent(contact.contactId);
        
        if(YAHOO.lang.isString(contact.firstName)) {
        	params += "&first_name=" + encodeURIComponent(contact.firstName);
        }
        if(YAHOO.lang.isString(contact.lastName)) {
        	params += "&last_name=" + encodeURIComponent(contact.lastName);
        }
        if(YAHOO.lang.isString(contact.email)) {
        	params += "&email=" + encodeURIComponent(contact.email);
        }
        if(contact.street1) {
            params += "&street1=" + encodeURIComponent(contact.street1);
        }
        if(contact.street2) {
            params += "&street2=" + encodeURIComponent(contact.street2);
        }
        if(contact.city) {
            params += "&city=" + encodeURIComponent(contact.city);
        }
        if(contact.state) {
            params += "&state=" + encodeURIComponent(contact.state);
        }
        if(contact.zip) {
            params += "&zip=" + encodeURIComponent(contact.zip);
        }
        if(contact.country) {
            params += "&country=" + encodeURIComponent(contact.country);
        }
        if(contact.phone) {
            params += "&phone=" + encodeURIComponent(contact.phone);
        }
        
        var url = YAHOO.Convio.PC2.Config.AddressBook.getUrl();
        
        YAHOO.log('Preparing XHR, url=' + url + ', params=' + params, 'info', 'address_book_rest.js');
        YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
    },
    
    addAddressBookContact: function(callback, contact) {        
        var params = "method=addAddressBookContact&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        
        /* Contact */
        if(YAHOO.lang.isString(contact.firstName)) {
	        params += "&first_name=" + encodeURIComponent(contact.firstName);
        }
        if(YAHOO.lang.isString(contact.lastName)) {
	        params += "&last_name=" + encodeURIComponent(contact.lastName);
        }
        if(YAHOO.lang.isString(contact.email)) {    
	        params += "&email=" + encodeURIComponent(contact.email);
        }
        
        var url = YAHOO.Convio.PC2.Config.AddressBook.getUrl();
        
        YAHOO.log('Preparing XHR, url=' + url + ', params=' + params, 'info', 'address_book_rest.js');
        YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
    },
    
    addPlaxoAddresses: function(callback, contacts) {        
        var params = "method=addAddressBookContacts&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        
        /* Contact */
        params += "&contacts_to_add=" + encodeURIComponent(contacts);
        
        var url = YAHOO.Convio.PC2.Config.AddressBook.getUrl();
        
        YAHOO.log('Preparing XHR, url=' + url + ', params=' + params, 'info', 'address_book_rest.js');
        YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
    },
    
    uploadContacts: function(callback, formName) {
        //tells Connection Manager this is a file upload form
        YAHOO.util.Connect.setForm(formName, true);
        var params = "method=addAddressBookContacts&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        
        var url = YAHOO.Convio.PC2.Config.AddressBook.getUrl();
        
        YAHOO.log('Preparing XHR, url=' + url + ',params=' + params, 'info', 'address_book_rest.js');
        YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
    },
    
    addPlaxoAddressesParams: function(contacts) {
        var params = "method=addAddressBookContacts&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        
        /* Contact */
        params += "&contacts_to_add=" + encodeURIComponent(contacts);
        
        YAHOO.log("Returning params=" + params, 'info', 'address_book_rest.js');
        return params;
    },
    
    removeAddressBookContacts: function(callback, contactIds) {        
        var params = "method=deleteAddressBookContacts&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        
        /* Contacts */
        params += this.encodeContactIds(contactIds);
        
        var url = YAHOO.Convio.PC2.Config.AddressBook.getUrl();
        
        YAHOO.log('Preparing XHR, url=' + url + ', params=' + params, 'info', 'address_book_rest.js');
        YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
    },
    
    getAddressBookContactsParams: function(listCriteria) {
        var params = "method=getAddressBookContacts&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += YAHOO.Convio.PC2.Utils.getListCriteriaParams(listCriteria);
        
        YAHOO.log("Returning params=" + params, 'info', 'address_book_rest.js');
        return params;
    },
    
    getAddressBookContacts: function(callback, listCriteria) {
        var params = "method=getAddressBookContacts&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += YAHOO.Convio.PC2.Utils.getListCriteriaParams(listCriteria);
        
        var url = YAHOO.Convio.PC2.Config.AddressBook.getUrl();
        
        YAHOO.log('Preparing XHR, url=' + url + ', params=' + params, 'info', 'address_book_rest.js');
        YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
    },
    
    getAddressBookGroups: function(callback) {
        var params = "method=getAddressBookGroups&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += "&timestamp=" + new Date().getTime();
        
        var url = YAHOO.Convio.PC2.Config.AddressBook.getUrl() + "?" + params;
        
        YAHOO.log('Preparing XHR, url=' + url , 'info', 'address_book_rest.js');
        YAHOO.Convio.PC2.Utils.asyncRequest('GET', url, callback);
    },
    
    getAddressBookGroupsParams: function(config) {
        var params = "method=getAddressBookGroups&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += "&timestamp=" + new Date().getTime();
        if(config.count_contacts) {
        	params +="&count_contacts=true";
        }
        YAHOO.log("Returning XHR params: " + params, "info", "address_book_rest.js");
        return params;
    },
    
    encodeContactIds: function(contactIds) {
        params = "";
        
        if(contactIds) {
            params += "&contact_ids=";
            contactIds = YAHOO.Convio.PC2.Utils.ensureArray(contactIds);
            var first = true;
            for(var i=0; i < contactIds.length; i++) {
                if(!first) {
                    params += ",";
                } else {
                    first = false;
                }
                params += encodeURIComponent(contactIds[i]);
            }
        }
        return params;
    },
    
    createGroupForContacts: function(callback, groupName, contactIds) {
        var params = "method=addAddressBookGroup&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += "&group_name=" + encodeURIComponent(groupName);
        
        params += this.encodeContactIds(contactIds);
        
        var url = YAHOO.Convio.PC2.Config.AddressBook.getUrl();
        
        YAHOO.log('Preparing XHR, url=' + url + ', params=' + params, 'info', 'address_book_rest.js');
        YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
    },
    
    addContactsToGroup: function(callback, groupId, contactIds) {
        var params = "method=addContactsToGroup&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += "&group_id=" + encodeURIComponent(groupId);
        
        params += this.encodeContactIds(contactIds);
        
        var url = YAHOO.Convio.PC2.Config.AddressBook.getUrl();
        
        YAHOO.log('Preparing XHR, url=' + url + ', params=' + params, 'info', 'address_book_rest.js');
        YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
    },
    
    deleteGroups: function(callback, groupIds) {
    	var params = "method=deleteAddressBookGroups&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += "&group_ids=" + YAHOO.Convio.PC2.Utils.encodeMultipleIds(groupIds);
        
        var url = YAHOO.Convio.PC2.Config.AddressBook.getUrl();
        
        YAHOO.log('Preparing XHR, url=' + url + ', params=' + params, 'info', 'address_book_rest.js');
        YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
    },
    
    addGroup: function(callback, groupName) {
    	var params = "method=addAddressBookGroup&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += "&group_name=" + encodeURIComponent(groupName);
        
        var url = YAHOO.Convio.PC2.Config.AddressBook.getUrl();
        
        YAHOO.log('Preparing XHR, url=' + url + ', params=' + params, 'info', 'address_book_rest.js');
        YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
    },
    
    updateGroup: function(callback, groupId, groupName) {
    	var params = "method=updateAddressBookGroup&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += "&group_id=" + encodeURIComponent(groupId);
        params += "&group_name=" + encodeURIComponent(groupName);
        
        var url = YAHOO.Convio.PC2.Config.AddressBook.getUrl();
        
        YAHOO.log('Preparing XHR, url=' + url + ', params=' + params, 'info', 'address_book_rest.js');
        YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
    },
    
    removeContactFromGroup: function(callback, contactId, groupId) {
        var params = "method=removeContactFromGroup&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += "&group_id=" + encodeURIComponent(groupId);
        params += "&contact_id=" + encodeURIComponent(contactId);
        
        var url = YAHOO.Convio.PC2.Config.AddressBook.getUrl();
        
        YAHOO.log('Preparing XHR, url=' + url + ', params=' + params, 'info', 'address_book_rest.js');
        YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
    }
};