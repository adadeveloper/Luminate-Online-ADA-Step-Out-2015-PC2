/* address_book_import_rest.js
 * Copyright 2010, Convio
 *
 * Provides Address Book Import ReST call functionality that is always used in PC2, 
 * regardless of the import service provider (e.g. Convio vs Cloudsponge). 
 * 
 * Functions in this file need not be changed if/when we select a different address book import service provider. 
 * 
 * Depends on:
 * address_book_import_domain.js
 * 
 * See also YAHOO.Convio.PC2.AddressBookImport.ContactRetrieveService
 */
YAHOO.Convio.PC2.AddressBookImport.ContactImportService = function(){};
YAHOO.Convio.PC2.AddressBookImport.ContactImportService.prototype = 
{
		
	saveContacts: function(contactsArray, callback)
	{
		var contactsToAdd = "";
		for (var i in contactsArray)
		{
			var contact = contactsArray[i];
			contactsToAdd += contact.toCsvString() + "\n"; 
		}
		
		var params = "method=importAddressBookContacts&response_format=json";
		params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
		params += '&contacts_to_add=' + encodeURIComponent(contactsToAdd);

		var url = YAHOO.Convio.PC2.Config.AddressBook.getUrl();

		YAHOO.log('Preparing XHR, url=' + url + ', params=' + params, 'info', 'address_book_import_convio_rest.js');
		YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, 
		{
			success: function(o)
			{
				var response = YAHOO.lang.JSON.parse(o.responseText).importAddressBookContactsResponse;
				var savedContacts = YAHOO.Convio.PC2.Utils.ensureArray(response.savedContact);
				var duplicateContacts = YAHOO.Convio.PC2.Utils.ensureArray(response.duplicateContact);
				var potentialDuplicateContacts = YAHOO.Convio.PC2.Utils.ensureArray(response.potentialDuplicateContact);
				var errorContacts = YAHOO.Convio.PC2.Utils.ensureArray(response.errorContact);
				
				var saveContactsResults = new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactsResults();
				
				for (var i in savedContacts)
				{
					var savedContact = savedContacts[i];
					var contact = savedContact.contact;
					var importContact = new YAHOO.Convio.PC2.AddressBookImport.Domain.Contact(contact.firstName, contact.lastName, contact.email);
					var result = new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactResult(importContact, "");
					saveContactsResults.addSavedContact(result);
				}
				
				for (var i in duplicateContacts)
				{
					var duplicateContactResult = duplicateContacts[i];
					var contact = duplicateContactResult.contact;
					var importContact = new YAHOO.Convio.PC2.AddressBookImport.Domain.Contact(contact.firstName, contact.lastName, contact.email);
					var dupe = duplicateContactResult.duplicateContact;
					var duplicateContact = new YAHOO.Convio.PC2.AddressBookImport.Domain.DuplicateContact(dupe.id, dupe.firstName, dupe.lastName, dupe.email);
					var result = new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactResult(importContact, "", duplicateContact);
					saveContactsResults.addDuplicateContact(result);
				}
				
				for (var i in potentialDuplicateContacts)
				{
					var potentialDuplicateContactResult = potentialDuplicateContacts[i];
					var contact = potentialDuplicateContactResult.contact;
					var importContact = new YAHOO.Convio.PC2.AddressBookImport.Domain.Contact(contact.firstName, contact.lastName, contact.email);
					var dupe = potentialDuplicateContactResult.duplicateContact;
					var duplicateContact = new YAHOO.Convio.PC2.AddressBookImport.Domain.DuplicateContact(dupe.id, dupe.firstName, dupe.lastName, dupe.email);
					var result = new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactResult(importContact, "", duplicateContact);
					saveContactsResults.addPotentialDuplicateContact(result);
				}
				
				for (var i in errorContacts)
				{
					var errorContactResult = errorContacts[i];
					var contact = errorContactResult.contact;
					var importContact = new YAHOO.Convio.PC2.AddressBookImport.Domain.Contact(contact.firstName, contact.lastName, contact.email);
					var message = errorContactResult.error;
					var result = new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactResult(importContact, message);
					saveContactsResults.addErrorContact(result);
				}

				// Log success
				YAHOO.log('saveContacts success', 'info', 'address_book_import_convio_rest.js');

				// Call the original callback
				callback.success(saveContactsResults);
			},
			failure: function(errMsg)
			{
				callback.failure(errMsg);
			},
			scope: callback.scope
		},			
	   	params);
	},
	
	savePossibleDupContactAsNew: function(singleContactToSaveAsNew, callback)
	{
		YAHOO.Convio.PC2.AddressBook.addAddressBookContact(		
		{
			success: function(o)
			{
			
				var response = YAHOO.lang.JSON.parse(o.responseText).addAddressBookContactResponse;
				var addressBookContact = response.addressBookContact;
	          
				// log success
				YAHOO.log('Added potential duplicate contact as a new contact with ID ' + addressBookContact.id, 'info', 'address_book_import_convio_rest.js');
			
				// Call the original callback
				callback.success();
				
			},
			failure: function(errMsg)
			{
				callback.failure(errMsg);
			},
			scope: callback.scope
		},			
		singleContactToSaveAsNew);
	},
	
	parseCsvContactsFile: function(formName, fileEncoding, callback)
	{
		
		//tells Connection Manager this is a file upload form
        YAHOO.util.Connect.setForm(formName, true);
        
        var params = "method=parseCsvContacts&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += '&file_encoding=' + encodeURIComponent(fileEncoding);
        
        var url = YAHOO.Convio.PC2.Config.AddressBook.getUrl();
        
        YAHOO.log('Preparing XHR, url=' + url + ',params=' + params, 'info', 'address_book_import_rest.js');
        YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, {
        	
        	upload: function(o)
			{
        		try {
		        	var beginIndex = o.responseText.indexOf("{");
		            var endIndex = o.responseText.indexOf("</pre>");
		            if(endIndex == -1) {
		                endIndex = o.responseText.indexOf("</PRE>");
		                if(endIndex == -1) {
		                    endIndex = o.responseText.length;
		                }
		            }
		            if(beginIndex == -1) {
		                beginIndex = 0;
		            }
		            var processedResponseText = o.responseText.substring(beginIndex, endIndex);
	        	
	        		// parse the JSON response
					var response = YAHOO.lang.JSON.parse(processedResponseText).parseCsvContactsResponse;
					var proposedCharacterEncoding = response.proposedCharacterEncoding;
					var responseHeaderLabels = response.columnHeaderLabels.columnHeaderLabel;
					var responseProposedMapping = response.proposedMapping;
					var responseDataRows = YAHOO.Convio.PC2.Utils.ensureArray(response.csvDataRows.csvDataRow);
					
					// marshal the response into an instance of YAHOO.Convio.PC2.AddressBookImport.Domain.CsvParseResult
					var orderedColumnHeaderLabels = responseHeaderLabels;
					var mappingConfidenceLevel = response.confidenceLevel;
					var csvMapping = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvMapping(
							orderedColumnHeaderLabels.length, 
							responseProposedMapping.firstNameColumnIndex, 
							responseProposedMapping.lastNameColumnIndex, 
							responseProposedMapping.emailColumnIndex
					);
					var csvParseResult = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvParseResult(orderedColumnHeaderLabels, proposedCharacterEncoding, mappingConfidenceLevel, csvMapping);
					for (var i = 0; i < responseDataRows.length; i++) {
						csvParseResult.addDataRow(responseDataRows[i].csvValue);
					}
					
					// Call the original callback
					callback.success(csvParseResult);
        		}
        		catch (e) {
        			callback.failure("File upload and parse failed: " + e);
        		}
			}
        	
        }, params);
		
	}
		
};