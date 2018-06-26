/* address_book_import_domain.js
 * Copyright 2010, Convio
 *
 * Objects and functions for importing address books
 * 
 * Depends on:
 *
 */

YAHOO.namespace("Convio.PC2.AddressBookImport.Domain");

/**
 * A domain object that models the status of an address book import job that 
 * was previously initiated with a third party service (e.g. cloudsponge, gigya, 
 * Convio's roll-your-own, etc.).
 */
YAHOO.Convio.PC2.AddressBookImport.Domain.JobStatus = function()
{
	this.status = this.PENDING;
	this.events = new Array();
};
YAHOO.Convio.PC2.AddressBookImport.Domain.JobStatus.prototype = 
{
	PENDING: "PENDING",
	SUCCESS: "SUCCESS",
	FAILURE: "FAILURE",

	setStatus: function(newStatus)
	{
		this.status = newStatus;
	},
	
	getStatus: function()
	{
		return this.status;
	},
	
	isStatusPending: function()
	{
		return this.PENDING === this.status;
	},
	
	isStatusSuccess: function()
	{
		return this.SUCCESS === this.status;
	},
	
	isStatusFailure: function()
	{
		return this.FAILURE === this.status;
	},
	
	getEvents: function()
	{
		return this.events;
	},
	
	addEvent: function(event)
	{
		this.events.push(event); 
	}
	
};

/**
 * A domain object that models an event reported by a third-party address book import service.
 */
YAHOO.Convio.PC2.AddressBookImport.Domain.Event = function(eventDescription)
{
	this.eventDescription = eventDescription;
};
YAHOO.Convio.PC2.AddressBookImport.Domain.Event.prototype = 
{
		
	setEventDescription: function(newEventDescription)
	{
		this.eventDescription = newEventDescription;
	},
	
	getEventDescription: function()
	{
		return this.eventDescription;
	}
	
};

/**
 * A domain object that models a single contact retrieved from a 
 * remote (non-Convio) address book.
 */
YAHOO.Convio.PC2.AddressBookImport.Domain.Contact = function(firstName, lastName, email)
{
	
	if (YAHOO.lang.isString(firstName)) {
		this.firstName = firstName;
	}
	else {
		this.firstName = null;
		YAHOO.log('Ignoring non-string value for firstName: ' + firstName, 'warn', 'address_book_import_domain.js');
	}
	
	if (YAHOO.lang.isString(lastName)) {
		this.lastName = lastName;
	}
	else {
		this.lastName = null;
		YAHOO.log('Ignoring non-string value for lastName: ' + lastName, 'warn', 'address_book_import_domain.js');
	}
	
	if (YAHOO.lang.isString(email)) {
		this.email = email;
	}
	else {
		this.email = null;
		YAHOO.log('Ignoring non-string value for email: ' + email, 'warn', 'address_book_import_domain.js');
	}
		
	this.checked = false;
	this.addressBookIndex = -1;
};
YAHOO.Convio.PC2.AddressBookImport.Domain.Contact.prototype =
{
	getFirstName: function(){return this.firstName;},
	getLastName: function(){return this.lastName;},
	getEmail: function(){return this.email;},
	
	toHtmlString: function(){
		
		var asString = '';
		
		asString += '<span class="contactName">';
		
		if (this.firstName) {
			asString += this.firstName;
		}
		
		if (this.lastName) {
			if (asString.length > 0) {
				asString += ' ';
			}
			asString += this.lastName;
		}
		
		asString += '</span>';
		
		asString += '<span class="contactEmail">';
		
		if (this.email) {
			if (asString.length > 0) {
				asString += ' ';
			}
			asString += this.email;
		}
		
		asString += '</span>';
		
		return asString;
		
	},
	
	toCsvString: function(){
		
		var asString = '';
		
		if (YAHOO.lang.isString(this.firstName)) {
			asString += '"' + YAHOO.Convio.PC2.Utils.convertSpecialDoubleQuotesToRegularDoubleQuotes(this.firstName).replace(/"/g, '""') + '"';
		}
		
		asString += ',';
			
		if (YAHOO.lang.isString(this.lastName)) {
			asString += '"' + YAHOO.Convio.PC2.Utils.convertSpecialDoubleQuotesToRegularDoubleQuotes(this.lastName).replace(/"/g, '""') + '"';
		}
		
		asString += ',';
		
		if (YAHOO.lang.isString(this.email)) {
			asString += '"' + YAHOO.Convio.PC2.Utils.convertSpecialDoubleQuotesToRegularDoubleQuotes(this.email).replace(/"/g, '""') + '"';
		}
		
		return asString;
		
	}
}

/**
 * A domain object that collects multiple YAHOO.Convio.PC2.AddressBookImport.Domain.Contact 
 * objects that were retrieved together from a remote (non-Convio) address book.
 */
YAHOO.Convio.PC2.AddressBookImport.Domain.AddressBook = function()
{
	this.contacts = new Array(0);
};
YAHOO.Convio.PC2.AddressBookImport.Domain.AddressBook.prototype =
{
	addContact: function(contact)
	{
		if (!(contact instanceof YAHOO.Convio.PC2.AddressBookImport.Domain.Contact)) {
			throw "Only instances of YAHOO.Convio.PC2.AddressBookImport.Domain.Contact can be added to this collection.";
		}
	
		contact.addressBookIndex = this.contacts.length; 
		this.contacts.push(contact);
	},
	
	getContacts: function()
	{
		return this.contacts;
	}
};

/**
 * A domain object that models the result of attempting to save a single contact 
 * (obtained from a third-party) as a new contact in the user's Convio address book.
 */
YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactResult = function(contact, result, duplicateContact)
{
	if (!(contact instanceof YAHOO.Convio.PC2.AddressBookImport.Domain.Contact)) {
		throw "The contact argument must be an instance of YAHOO.Convio.PC2.AddressBookImport.Domain.Contact";
	}
	
	if (duplicateContact && !(duplicateContact instanceof YAHOO.Convio.PC2.AddressBookImport.Domain.DuplicateContact)) {
		throw "The optional duplicateContact argument must be an instance of YAHOO.Convio.PC2.AddressBookImport.Domain.DuplicateContact";
	}
	
	// the AddressBookImport.Contact that the user attempted to save
	this.contact = contact;
	
	// a human readable description of the save operation's result
	this.result = (result) ? result : "";
	
	// an optional data structure to be used by save operations that 
	// failed due to existing duplicate contact
	this.duplicateContact = duplicateContact;
	
	this.resolved = false;
	
	this.saveContactsResultsIndex = -1;
};
YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactResult.prototype =
{
	getContact: function() {return this.contact;},
	getResult: function() {return this.result;},
	getDuplicateContact: function() {return this.duplicateContact;},
	isResolved: function() {return this.resolved;},
	markResolved: function() {this.resolved = true;}
};

/**
 * A domain object that models the details of a Convio address book contact with 
 * which an instance of YAHOO.Convio.PC2.AddressBookImport.Domain.Contact collided.
 */
YAHOO.Convio.PC2.AddressBookImport.Domain.DuplicateContact = function(id, firstName, lastName, email)
{
	if (id) {
		this.id = id;
	}
	else {
		throw "DuplicateContact id is a mandatory argument.";
	}
	
	if (YAHOO.lang.isString(firstName)) {
		this.firstName = firstName;
	}
	else {
		this.firstName = null;
		YAHOO.log('Ignoring non-string value for firstName: ' + firstName, 'warn', 'address_book_import_domain.js');
	}
	
	if (YAHOO.lang.isString(lastName)) {
		this.lastName = lastName;
	}
	else {
		this.lastName = null;
		YAHOO.log('Ignoring non-string value for lastName: ' + lastName, 'warn', 'address_book_import_domain.js');
	}
	
	if (YAHOO.lang.isString(email)) {
		this.email = email;
	}
	else {
		this.email = null;
		YAHOO.log('Ignoring non-string value for email: ' + email, 'warn', 'address_book_import_domain.js');
	}
};
YAHOO.Convio.PC2.AddressBookImport.Domain.DuplicateContact.prototype =
{
	getId: function(){return this.id;},		
	getFirstName: function(){return this.firstName;},
	getLastName: function(){return this.lastName;},
	getEmail: function(){return this.email;},
	
	toHtmlString: function(){
		var asString = '';
		
		asString += '<span class="contactName">';
		
		if (this.firstName) {
			asString += this.firstName;
		}
		
		if (this.lastName) {
			if (asString.length > 0) {
				asString += ' ';
			}
			asString += this.lastName;
		}
		
		asString += '</span>';
		
		asString += '<span class="contactEmail">';
		
		if (this.email) {
			if (asString.length > 0) {
				asString += ' ';
			}
			asString += this.email;
		}
		
		asString += '</span>';
		
		return asString;
	}
};

/**
 * A domain object that collects one or more YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactResult 
 * objects that were submitted in the same batch.
 */
YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactsResults = function()
{
	this.savedContacts = new Array(0);
	this.duplicateContacts = new Array(0);
	this.potentialDuplicateContacts = new Array(0);
	this.errorContacts = new Array(0);
};
YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactsResults.prototype =
{
	addSavedContact: function(contactSaveResult)
	{
		if (!(contactSaveResult instanceof YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactResult)) {
			throw "Only instances of YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactResult can be added to this collection.";
		}
	
		contactSaveResult.saveContactsResultsIndex = this.savedContacts.length;
		this.savedContacts.push(contactSaveResult);
	},
	
	/**
	 * @return an array of YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactResult objects
	 */
	getSavedContacts: function()
	{
		return this.savedContacts;
	},
	
	countSavedContacts: function()
	{
		return this.savedContacts.length
	},
	
	addDuplicateContact: function(contactSaveResult)
	{
		if (!(contactSaveResult instanceof YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactResult)) {
			throw "Only instances of YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactResult can be added to this collection.";
		}
		
		if (!contactSaveResult.getDuplicateContact()) {
			throw "Cannot add a duplicate ContactSaveResult w/o the details of the duplicate contact found in the user's address book.";
		}
		
		contactSaveResult.saveContactsResultsIndex = this.duplicateContacts.length;
		this.duplicateContacts.push(contactSaveResult);
	},
	
	/**
	 * @return an array of YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactResult objects
	 */
	getDuplicateContacts: function()
	{
		return this.duplicateContacts;
	},
	
	countDuplicateContacts: function()
	{
		return this.duplicateContacts.length;
	},
	
	/**
	 * Note that, unlike other getter methods in this class, 
	 * this method returns a copy of the data, and not the underlying data collection.
	 */
	getSavedAndDuplicateContacts: function()
	{
		return YAHOO.Convio.PC2.Utils.mergeArrays(this.savedContacts, this.duplicateContacts);
	},
	
	countSavedAndDuplicateContacts: function()
	{
		return this.countSavedContacts() + this.countDuplicateContacts();
	},
	
	addPotentialDuplicateContact: function(contactSaveResult)
	{
		if (!(contactSaveResult instanceof YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactResult)) {
			throw "Only instances of YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactResult can be added to this collection.";
		}
		
		if (!contactSaveResult.getDuplicateContact()) {
			throw "Cannot add a duplicate ContactSaveResult w/o the details of the duplicate contact found in the user's address book.";
		}
		
		contactSaveResult.saveContactsResultsIndex = this.potentialDuplicateContacts.length;
		this.potentialDuplicateContacts.push(contactSaveResult);
	},
	
	/**
	 * @return an array of YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactResult objects
	 */
	getPotentialDuplicateContacts: function()
	{
		return this.potentialDuplicateContacts;
	},
	
	countPotentialDuplicateContacts: function()
	{
		return this.potentialDuplicateContacts.length;
	},
	
	addErrorContact: function(contactSaveResult)
	{
		if (!(contactSaveResult instanceof YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactResult)) {
			throw "Only instances of YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactResult can be added to this collection.";
		}
		
		contactSaveResult.saveContactsResultsIndex = this.errorContacts.length;
		this.errorContacts.push(contactSaveResult);
	},
	
	/**
	 * @return an array of YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactResult objects
	 */
	getErrorContacts: function()
	{
		return this.errorContacts;
	},
	
	countErrorContacts: function()
	{
		return this.errorContacts.length;
	}
};

/**
 * A domain object that represents a proposed column mapping for a CSV file.
 */
YAHOO.Convio.PC2.AddressBookImport.Domain.CsvMapping = function(numCsvColumns, firstNameColumnIndex, lastNameColumnIndex, emailColumnIndex) 
{
	// validate & initialize the num columns value
	var parsedNumCsvColumnsAsInt = parseInt(numCsvColumns);
	if (!YAHOO.lang.isNumber(parsedNumCsvColumnsAsInt) || parsedNumCsvColumnsAsInt < 0) {
		throw "Unexpected type: parsedNumCsvColumnsAsInt should be a non-negative integer.";
	}
	this.numCsvColumns = parsedNumCsvColumnsAsInt;
	
	// validate & initialize the column mapping index values
	this.setFirstNameColumnIndex(firstNameColumnIndex);
	this.setLastNameColumnIndex(lastNameColumnIndex);
	this.setEmailColumnIndex(emailColumnIndex);
}; 
YAHOO.Convio.PC2.AddressBookImport.Domain.CsvMapping.prototype = 
{
	getNumCsvColumns: function() {
		return this.numCsvColumns;
	},
		
	getFirstNameColumnIndex: function() { return this.firstNameColumnIndex; },
	
	setFirstNameColumnIndex: function(firstNameColumnIndex) {  
		var parsedFirstNameIndexAsInt = parseInt(firstNameColumnIndex);
		if (!YAHOO.lang.isNumber(parsedFirstNameIndexAsInt) || parsedFirstNameIndexAsInt < 0) {
			throw "Unexpected type: firstNameColumnIndex should be a non-negative integer.";
		}
		if (parsedFirstNameIndexAsInt >= this.numCsvColumns) {
			throw "Column index out of bounds.";
		}
		this.firstNameColumnIndex = parsedFirstNameIndexAsInt;
	},
	
	getLastNameColumnIndex: function() { return this.lastNameColumnIndex; },
	
	setLastNameColumnIndex: function(lastNameColumnIndex) {  
		var parsedLastNameIndexAsInt = parseInt(lastNameColumnIndex);
		if (!YAHOO.lang.isNumber(parsedLastNameIndexAsInt) || parsedLastNameIndexAsInt < 0) {
			throw "Unexpected type: lastNameColumnIndex should be a non-negative integer.";
		}
		if (parsedLastNameIndexAsInt >= this.numCsvColumns) {
			throw "Column index out of bounds.";
		}
		this.lastNameColumnIndex = parsedLastNameIndexAsInt;
	},
	
	getEmailColumnIndex: function() { return this.emailColumnIndex; },
	
	setEmailColumnIndex: function(emailColumnIndex) {  
		var parsedEmailIndexAsInt = parseInt(emailColumnIndex);
		if (!YAHOO.lang.isNumber(parsedEmailIndexAsInt) || parsedEmailIndexAsInt < 0) {
			throw "Unexpected type: emailColumnIndex should be a non-negative integer.";
		}
		if (parsedEmailIndexAsInt >= this.numCsvColumns) {
			throw "Column index out of bounds.";
		}
		this.emailColumnIndex = parsedEmailIndexAsInt;
	},
	
	isUniqueMapping: function() {
		return this.firstNameColumnIndex != this.lastNameColumnIndex &&  this.firstNameColumnIndex != this.emailColumnIndex && this.lastNameColumnIndex != this.emailColumnIndex;
	}
};


/**
 * A domain object that represents the result of a request to parse a CSV file and suggest a probable column mapping.
 */
YAHOO.Convio.PC2.AddressBookImport.Domain.CsvParseResult = function(orderedColumnHeaderLabels, proposedCharacterEncoding, mappingConfidenceLevel, csvMapping)
{
	// initialize the multi-dimensional sample data array
	this.dataRows = new Array();
	
	// validate & initialize the collection of ordered column header labels
	if (!YAHOO.lang.isArray(orderedColumnHeaderLabels)) {
		throw "Unexpected type: orderedColumnHeaderLabels should be an array.";
	}
	for (var i = 0; i < orderedColumnHeaderLabels.length; i++) {
		var columnHeaderLabel = orderedColumnHeaderLabels[i];
		if (!YAHOO.lang.isString(columnHeaderLabel) && columnHeaderLabel != null) {	
			throw "Unexpected type: orderedColumnHeaderLabels should be a _string_ array.";
		}
	}
	this.orderedColumnHeaderLabels = orderedColumnHeaderLabels;
	
	// validate & initialize proposedCharacterEncoding
	if (!YAHOO.lang.isString(proposedCharacterEncoding)) {
		throw "Unexpected type: proposedCharacterEncoding should be a non-null string.";
	}
	this.proposedCharacterEncoding = proposedCharacterEncoding;
	
	// validate & initialize the mapping confidence level value
	if (mappingConfidenceLevel === this.MAPPING_CONFIDENCE_LOW 
			|| mappingConfidenceLevel === this.MAPPING_CONFIDENCE_HIGH 
			|| mappingConfidenceLevel === this.MAPPING_CONFIDENCE_UNKNOWN) 
	{
		this.mappingConfidenceLevel = mappingConfidenceLevel;
	}
	else {
		throw "Unexpected confidence value: " + mappingConfidenceLevel;
	}

	// validate and initialize csv mapping object
	if (!(csvMapping instanceof YAHOO.Convio.PC2.AddressBookImport.Domain.CsvMapping)) {
		throw "The csvMapping argument must be an instance of YAHOO.Convio.PC2.AddressBookImport.Domain.CsvMapping.";
	}
	this.csvMapping = csvMapping;

	// sundry sanity checks
	if (csvMapping.getNumCsvColumns() != this.orderedColumnHeaderLabels.length) {
		throw "Failed to agree on number of columns in CSV file."
	}
};

YAHOO.Convio.PC2.AddressBookImport.Domain.CsvParseResult.prototype = 
{
	MAPPING_CONFIDENCE_UNKNOWN: "UNKNOWN",
	MAPPING_CONFIDENCE_LOW: "LOW",
	MAPPING_CONFIDENCE_HIGH: "HIGH",
	
	addDataRow: function(dataRow) {
		if (!YAHOO.lang.isArray(dataRow)) {
			throw "Unexpected type: dataRow should be an array.";
		}
		if (dataRow.length != this.orderedColumnHeaderLabels.length) {
			throw "Unexpected number of data columns.";
		}
		if (dataRow.length != this.csvMapping.getNumCsvColumns()) {
			throw "Unexpected number of data columns.";
		}
		for (var i = 0; i < dataRow.length; i++) {
			var value = dataRow[i];
			if (!YAHOO.lang.isString(value) && value != null) {
				throw "Unexpected type: dataRow should be an array of arrays of strings.";
			}
		}
		this.dataRows.push(dataRow);
	},
	
	countDataRows: function() {
		return this.dataRows.length;
	},
	
	toAddressBook: function() {
		
		var addrBook = new YAHOO.Convio.PC2.AddressBookImport.Domain.AddressBook();
		
		var dataRowsLength = this.dataRows.length;
		for (var i = 0; i < dataRowsLength; i++) {
			var csvDataRow = this.dataRows[i];
			var csvDataRowAsContact = new YAHOO.Convio.PC2.AddressBookImport.Domain.Contact
			(
					csvDataRow[this.csvMapping.getFirstNameColumnIndex()], 
					csvDataRow[this.csvMapping.getLastNameColumnIndex()], 
					csvDataRow[this.csvMapping.getEmailColumnIndex()]
			);
			addrBook.addContact(csvDataRowAsContact)
		}
		
		return addrBook;
		
	},
	
	getProposedCharacterEncoding: function() { return this.proposedCharacterEncoding; },
	
	getCsvMapping: function() { return this.csvMapping; },
	
	getOrderedColumnHeaderLabels: function() { return this.orderedColumnHeaderLabels; },
	
	getMappingConfidenceLevel: function() { return this.mappingConfidenceLevel; }
};