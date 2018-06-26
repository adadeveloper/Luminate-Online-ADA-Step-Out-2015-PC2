/*
 * address_book_import_domain_test.js
 * 
 * Defines unit tests for functions defined in address_book_import_domain.js
 * 
 * @see http://developer.yahoo.com/yui/3/test/
 * @see http://yuilibrary.com/forum/viewtopic.php?p=15478
 */

YUI.add("address_book_import_domain_test", function(Y){

	Y.namespace("Convio.PC2.Test");
	FIRST_NAME = "Joe";
	LAST_NAME = "Convio";
	EMAIL = "devnull+jconvio@convio.com";
	
	// define a test case object
	Y.Convio.PC2.Test.pc2_address_book_import = new Y.Test.Case({ 
		
		name : "Address Book Import Test",

		setUp : function()
		{
			this.setupTestCount();
			this.fakeCookies();
		},

		tearDown : function()
		{
			this.restoreCookies();
		},

		_should : {
			useList : "#address_book_import_results_list"

			,
			ignore : {
				testIgnore : true
			},
			
			error: {
				// define names of tests that should throw an exception
				testAddSavedContactToSaveContactsResults_Illegal_1: true,
				testAddSavedContactToSaveContactsResults_Illegal_2: true,
				testAddSavedContactToSaveContactsResults_Illegal_3: true,
				testAddSavedContactToSaveContactsResults_Illegal_4: true,
				testAddDuplicateContactToSaveContactsResults_Illegal_1: true,
				testAddDuplicateContactToSaveContactsResults_Illegal_2: true,
				testAddDuplicateContactToSaveContactsResults_Illegal_3: true,
				testAddDuplicateContactToSaveContactsResults_Illegal_4: true,
				testAddDuplicateContactToSaveContactsResults_Illegal_5: true,
				testAddDuplicateContactToSaveContactsResults_Illegal_6: true,
				testAddPotentialDuplicateContactToSaveContactsResults_Illegal_1: true,
				testAddPotentialDuplicateContactToSaveContactsResults_Illegal_2: true,
				testAddPotentialDuplicateContactToSaveContactsResults_Illegal_3: true,
				testAddPotentialDuplicateContactToSaveContactsResults_Illegal_4: true,
				testAddPotentialDuplicateContactToSaveContactsResults_Illegal_5: true,
				testAddPotentialDuplicateContactToSaveContactsResults_Illegal_6: true,
				testAddErrorContactToSaveContactsResults_Illegal_1: true,
				testAddErrorContactToSaveContactsResults_Illegal_2: true,
				testAddErrorContactToSaveContactsResults_Illegal_3: true,
				testAddErrorContactToSaveContactsResults_Illegal_4: true,
				testAddContactToAddressBook_Illegal_1: true,
				testAddContactToAddressBook_Illegal_2: true,
				testAddContactToAddressBook_Illegal_3: true,
				testAddContactToAddressBook_Illegal_4: true,
				testNewSaveContactResult_Illegal_1: true,
				testNewSaveContactResult_Illegal_2: true,
				testNewSaveContactResult_Illegal_3: true,
				testNewSaveContactResult_Illegal_4: true,
				testNewDuplicateContact_Illegal: true,
				testNewCsvMapping_Illegal_FirstNameIndex_Negative: true,
				testNewCsvMapping_Illegal_NumCsvColumns_Negative: true,
				testNewCsvMapping_Illegal_FirstNameIndex_Undefined: true,
				testNewCsvMapping_Illegal_FirstNameIndex_NonInteger: true,
				testNewCsvMapping_Illegal_FirstNameIndex_OutOfBounds: true,
				testNewCsvMapping_Illegal_LastNameIndex_Negative: true,
				testNewCsvMapping_Illegal_LastNameIndex_Undefined: true,
				testNewCsvMapping_Illegal_LastNameIndex_NonInteger: true,
				testNewCsvMapping_Illegal_LastNameIndex_OutOfBounds: true,
				testNewCsvMapping_Illegal_EmailIndex_Negative: true,
				testNewCsvMapping_Illegal_EmailIndex_Undefined: true,
				testNewCsvMapping_Illegal_EmailIndex_NonInteger: true,
				testNewCsvMapping_Illegal_EmailIndex_OutOfBounds: true,
				testNewCsvParseResult_Illegal_ProposedCharacterEncoding: true,
				testNewCsvParseResult_Illegal_OrderedColumnHeaderLabels_Undefined: true,
				testNewCsvParseResult_Illegal_OrderedColumnHeaderLabels_Null: true,
				testNewCsvParseResult_Illegal_OrderedColumnHeaderLabels_NonArray: true,
				testNewCsvParseResult_Illegal_OrderedColumnHeaderLabels_NonStringLabelInArray: true,
				testNewCsvParseResult_Illegal_OrderedColumnHeaderLabels_TooFewColumnHeaderLabels: true,
				testNewCsvParseResult_Illegal_OrderedColumnHeaderLabels_TooManyColumnHeaderLabels: true,
				testNewCsvParseResult_Illegal_MappingConfidenceLevel_Undefined: true,
				testNewCsvParseResult_Illegal_MappingConfidenceLevel_Null: true,
				testNewCsvParseResult_Illegal_MappingConfidenceLevel_UnexpectedValue: true,
				testNewCsvParseResult_Illegal_CsvMapping_Undefined: true,
				testNewCsvParseResult_Illegal_CsvMapping_Null: true,
				testNewCsvParseResult_Illegal_CsvMapping_UnexpectedObjectType: true,
				testAddDataRow_Illegal_TooFewColumns: true,
				testAddDataRow_Illegal_TooManyColumns: true,
				testAddDataRow_Illegal_NotAnArray: true,
				testAddDataRow_Illegal_ArrayOfNonStrings: true
			}
			
		},

		testNewEvent: function()
		{
			var event = new YAHOO.Convio.PC2.AddressBookImport.Domain.Event("foo");
			this.assertWellDefined(event);
			this.assertEqual("foo", event.getEventDescription());
		},
		
		testSetAndGetEventDescription: function()
		{
			var event = new YAHOO.Convio.PC2.AddressBookImport.Domain.Event("foo");
			this.assertWellDefined(event);
			
			event.setEventDescription("bar");
			this.assertEqual("bar", event.getEventDescription());
		},
		
		testNewJob: function()
		{
			var js = new YAHOO.Convio.PC2.AddressBookImport.Domain.JobStatus();
			this.assertEqual(js.PENDING, js.getStatus());
		},
		
		testSetStatus: function()
		{
			var js = new YAHOO.Convio.PC2.AddressBookImport.Domain.JobStatus();
			js.setStatus(js.SUCCESS);
			this.assertEqual(js.SUCCESS, js.getStatus());
		},
		
		testIsStatusPending: function()
		{
			var js = new YAHOO.Convio.PC2.AddressBookImport.Domain.JobStatus();
			js.setStatus(js.PENDING);
			this.assertTrue(js.isStatusPending());
			js.setStatus(js.SUCCESS);
			this.assertFalse(js.isStatusPending());
			js.setStatus(js.FAILURE);
			this.assertFalse(js.isStatusPending());
		},
		
		testIsStatusSuccess: function()
		{
			var js = new YAHOO.Convio.PC2.AddressBookImport.Domain.JobStatus();
			js.setStatus(js.SUCCESS);
			this.assertTrue(js.isStatusSuccess());
			js.setStatus(js.PENDING);
			this.assertFalse(js.isStatusSuccess());
			js.setStatus(js.FAILURE);
			this.assertFalse(js.isStatusSuccess());
		},
		
		testIsStatusFailure: function()
		{
			var js = new YAHOO.Convio.PC2.AddressBookImport.Domain.JobStatus();
			js.setStatus(js.FAILURE);
			this.assertTrue(js.isStatusFailure());
			js.setStatus(js.PENDING);
			this.assertFalse(js.isStatusFailure());
			js.setStatus(js.SUCCESS);
			this.assertFalse(js.isStatusFailure());
		},
		
		testAddAndGetEvents: function()
		{
			var js = new YAHOO.Convio.PC2.AddressBookImport.Domain.JobStatus();
			this.assertWellDefined(js);
			
			this.assertWellDefined(js.getEvents());
			this.assertEqual(0, js.getEvents().length);
			
			js.addEvent(new YAHOO.Convio.PC2.AddressBookImport.Domain.Event("foo"));
			this.assertWellDefined(js.getEvents());
			this.assertEqual(1, js.getEvents().length);
			this.assertEqual("foo", js.getEvents()[0].getEventDescription());
			
			js.addEvent(new YAHOO.Convio.PC2.AddressBookImport.Domain.Event("bar"));
			this.assertWellDefined(js.getEvents());
			this.assertEqual(2, js.getEvents().length);
			this.assertEqual("foo", js.getEvents()[0].getEventDescription());
			this.assertEqual("bar", js.getEvents()[1].getEventDescription());
		},
		
		testNewContact: function()
		{
			var contact = new YAHOO.Convio.PC2.AddressBookImport.Domain.Contact(FIRST_NAME, LAST_NAME, EMAIL);
			this.assertEqual(FIRST_NAME, contact.getFirstName());
			this.assertEqual(LAST_NAME, contact.getLastName());
			this.assertEqual(EMAIL, contact.getEmail());
		},
		
		testNewContact_BlankValues: function()
		{
			var contact = new YAHOO.Convio.PC2.AddressBookImport.Domain.Contact("", "", "");
			this.assertEqual("", contact.getFirstName());
			this.assertEqual("", contact.getLastName());
			this.assertEqual("", contact.getEmail());
		},
		
		testNewContact_GarbageValues: function()
		{
			var undefinedVariable;
			var garbageValues = [{}, {foo: "bar"}, null, undefinedVariable, 12345, 192.45, new Array()];
			
			for (var i = 0; i < garbageValues.length; i++) {
				var garbage = garbageValues[i];
				var contact = new YAHOO.Convio.PC2.AddressBookImport.Domain.Contact(garbage, garbage, garbage);
				this.assertEqual(null, contact.getFirstName());
				this.assertEqual(null, contact.getLastName());
				this.assertEqual(null, contact.getEmail());
			}
		},
		
		testNewContacts: function()
		{
			var addressBook = new YAHOO.Convio.PC2.AddressBookImport.Domain.AddressBook();
			this.assertEqual(0, addressBook.getContacts().length);
		},
		
		testContactToHtmlString: function()
		{
			var contact = new YAHOO.Convio.PC2.AddressBookImport.Domain.Contact(FIRST_NAME, LAST_NAME, EMAIL);
			var contactAsHtml = contact.toHtmlString();
			this.assertWellDefined(contactAsHtml);
			this.assertTrue(contactAsHtml.indexOf(contact.getFirstName()) > -1);
			this.assertTrue(contactAsHtml.indexOf(contact.getLastName()) > -1);
			this.assertTrue(contactAsHtml.indexOf(contact.getEmail()) > -1);
		},
		
		testContactToCsvString_RegularContent: function()
		{
			var regularContent = new YAHOO.Convio.PC2.AddressBookImport.Domain.Contact('firstName', 'lastName', 'emailAddress');
			this.assertEqual('"firstName","lastName","emailAddress"', regularContent.toCsvString());
			
		},
		
		testContactToCsvString_WhitespaceInContent: function()
		{
			var whitespaceInContent = new YAHOO.Convio.PC2.AddressBookImport.Domain.Contact('first name', 'last name', 'email address');
			this.assertEqual('"first name","last name","email address"', whitespaceInContent.toCsvString());
		},
		
		testContactToCsvString_QuotesInContent: function()
		{
			var quotesInContent = new YAHOO.Convio.PC2.AddressBookImport.Domain.Contact('first "name"', 'last "name"', 'email "address"');
			this.assertEqual('"first ""name""","last ""name""","email ""address"""', quotesInContent.toCsvString());
		},
		
		testContactToCsvString_NullContent: function()
		{
			var nullContent = new YAHOO.Convio.PC2.AddressBookImport.Domain.Contact(null, null, null);
			this.assertEqual(',,', nullContent.toCsvString());
		},
		
		testContactToCsvString_BlankContent: function()
		{
			var blankContent = new YAHOO.Convio.PC2.AddressBookImport.Domain.Contact("", "", "");
			this.assertEqual('"","",""', blankContent.toCsvString());
		},
		
		testContactToCsvString_SpecialQuotes: function()
		{
			// note the use of special left and right quote characters in this example
			var specialContent = new YAHOO.Convio.PC2.AddressBookImport.Domain.Contact("Dave", "the “bug killer” Wingate", "devnull+dw@convio.com");
			this.assertEqual('"Dave","the ""bug killer"" Wingate","devnull+dw@convio.com"', specialContent.toCsvString());
		},
		
		testAddContactToAddressBook: function()
		{
			var NUM_CONTACTS = 3;
			var addressBook = new YAHOO.Convio.PC2.AddressBookImport.Domain.AddressBook();
			for (var i = 1; i <= NUM_CONTACTS; i++)
			{
				var newContact = new YAHOO.Convio.PC2.AddressBookImport.Domain.Contact(FIRST_NAME, LAST_NAME, EMAIL);
				addressBook.addContact(newContact);
				this.assertEqual(i, addressBook.getContacts().length);
				this.assertEqual(newContact, addressBook.getContacts()[newContact.addressBookIndex]);
			}
		},
		
		testAddContactToAddressBook_Illegal_1: function()
		{
			var addressBook = new YAHOO.Convio.PC2.AddressBookImport.Domain.AddressBook();
			// this call should throw an exception
			addressBook.addContact();
		},
		
		testAddContactToAddressBook_Illegal_2: function()
		{
			var addressBook = new YAHOO.Convio.PC2.AddressBookImport.Domain.AddressBook();
			// this call should throw an exception
			addressBook.addContact(null);
		},
		
		testAddContactToAddressBook_Illegal_3: function()
		{
			var addressBook = new YAHOO.Convio.PC2.AddressBookImport.Domain.AddressBook();
			// this call should throw an exception
			addressBook.addContact("foo");
		},
		
		testAddContactToAddressBook_Illegal_4: function()
		{
			var addressBook = new YAHOO.Convio.PC2.AddressBookImport.Domain.AddressBook();
			// this call should throw an exception
			addressBook.addContact(382);
		},
		
		testNewSaveContactResult: function()
		{
			var contact = new YAHOO.Convio.PC2.AddressBookImport.Domain.Contact(FIRST_NAME, LAST_NAME, EMAIL);
			var result = "Duplicate of " + FIRST_NAME + " " + LAST_NAME + " (" + EMAIL + ")";
			var duplicateContact = new YAHOO.Convio.PC2.AddressBookImport.Domain.DuplicateContact(1234, FIRST_NAME, LAST_NAME, EMAIL);
			
			var saveContactResult = new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactResult(contact, result, duplicateContact);
			this.assertEqual(contact, saveContactResult.getContact());
			this.assertEqual(result, saveContactResult.getResult());
			this.assertEqual(duplicateContact, saveContactResult.getDuplicateContact());
		},
		
		testNewSaveContactResult_Illegal_1: function()
		{
			var contact;
			// this constructor call should fail!
			new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactResult(contact, "foo bar");
		},
		
		testNewSaveContactResult_Illegal_2: function()
		{
			var contact = null;
			// this constructor call should fail!
			new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactResult(contact, "foo bar");
		},
		
		testNewSaveContactResult_Illegal_3: function()
		{
			var contact = "unexpected string";
			// this constructor call should fail!
			new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactResult(contact, "foo bar");
		},
		
		testNewSaveContactResult_Illegal_4: function()
		{
			var contact = new YAHOO.Convio.PC2.AddressBookImport.Domain.Contact(FIRST_NAME, LAST_NAME, EMAIL);
			var result = "a totally legal value ... blah blah blah";
			var duplicateContact = 1234;
			// this constructor call should fail!
			new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactResult(contact, result, duplicateContact);
		},
		
		testNewSaveContactsResults: function()
		{
			var result = new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactsResults();
			this.assertEqual(result.getSavedContacts().length, 0);
			this.assertEqual(result.getDuplicateContacts().length, 0);
			this.assertEqual(result.getPotentialDuplicateContacts().length, 0);
			this.assertEqual(result.getErrorContacts().length, 0);
		},
		
		testAddSavedContactToSaveContactsResults: function()
		{
			var result = new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactsResults();
			for (var i = 1; i <= 3; i++)
			{
				var contact = new YAHOO.Convio.PC2.AddressBookImport.Domain.Contact(FIRST_NAME, LAST_NAME, EMAIL);
				result.addSavedContact(new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactResult(contact, "foo bar"));
				this.assertEqual(i, result.getSavedContacts().length);
				this.assertEqual(i, result.countSavedContacts());
			}
		},
		
		testAddSavedContactToSaveContactsResults_Illegal_1: function()
		{
			var results = new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactsResults();
			// this call should throw an exception
			results.addSavedContact(new String());
		},
		
		testAddSavedContactToSaveContactsResults_Illegal_2: function()
		{
			var results = new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactsResults();
			// this call should throw an exception
			results.addSavedContact(null);
		},
		
		testAddSavedContactToSaveContactsResults_Illegal_3: function()
		{
			var results = new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactsResults();
			// this call should throw an exception
			results.addSavedContact();
		},
		
		testAddSavedContactToSaveContactsResults_Illegal_4: function()
		{
			var results = new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactsResults();
			// this call should throw an exception
			results.addSavedContact(new YAHOO.Convio.PC2.AddressBookImport.Domain.Contact("wrong", "object type", "wrong@object.type"));
		},
		
		testAddDuplicateContactToSaveContactsResults: function()
		{
			var result = new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactsResults();
			for (var i = 1; i <= 3; i++)
			{
				var contact = new YAHOO.Convio.PC2.AddressBookImport.Domain.Contact(FIRST_NAME, LAST_NAME, EMAIL);
				var dupContact = new YAHOO.Convio.PC2.AddressBookImport.Domain.DuplicateContact(123456, FIRST_NAME, LAST_NAME, EMAIL);
				result.addDuplicateContact(new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactResult(contact, "foo bar", dupContact));
				this.assertEqual(i, result.getDuplicateContacts().length);
				this.assertEqual(i, result.countDuplicateContacts());
			}
		},
		
		testGetSavedAndDuplicateContacts: function()
		{
			var result = new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactsResults();
			for (var i = 1; i <= 3; i++)
			{
				var contact = new YAHOO.Convio.PC2.AddressBookImport.Domain.Contact(FIRST_NAME, LAST_NAME, EMAIL);
				var dupContact = new YAHOO.Convio.PC2.AddressBookImport.Domain.DuplicateContact(123456, FIRST_NAME, LAST_NAME, EMAIL);
				
				result.addSavedContact(new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactResult(contact, "foo bar"));
				this.assertEqual((2 * i) - 1, result.getSavedAndDuplicateContacts().length);
				this.assertEqual((2 * i) - 1, result.getSavedAndDuplicateContacts().length);
				
				result.addDuplicateContact(new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactResult(contact, "foo bar", dupContact));
				
				this.assertEqual((2 * i), result.countSavedAndDuplicateContacts());
				this.assertEqual((2 * i), result.countSavedAndDuplicateContacts());
			}
		},
		
		testAddDuplicateContactToSaveContactsResults_Illegal_1: function()
		{
			var results = new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactsResults();
			// this call should throw an exception
			results.addDuplicateContact(new String());
		},
		
		testAddDuplicateContactToSaveContactsResults_Illegal_2: function()
		{
			var results = new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactsResults();
			// this call should throw an exception
			results.addDuplicateContact(null);
		},
		
		testAddDuplicateContactToSaveContactsResults_Illegal_3: function()
		{
			var results = new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactsResults();
			// this call should throw an exception
			results.addDuplicateContact();
		},
		
		testAddDuplicateContactToSaveContactsResults_Illegal_4: function()
		{
			var results = new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactsResults();
			// this call should throw an exception
			results.addDuplicateContact(new YAHOO.Convio.PC2.AddressBookImport.Domain.Contact("wrong", "object type", "wrong@object.type"));
		},
		
		testAddDuplicateContactToSaveContactsResults_Illegal_5: function()
		{
			var results = new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactsResults();
			var dupContact; /* undefined */
			// this call should throw an exception
			results.addDuplicateContact(
				new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactResult(
						new YAHOO.Convio.PC2.AddressBookImport.Domain.Contact("foo", "bar", "foo.bar@convio.com"), "some valid result message", dupContact
				)
			);
		},
		
		testAddDuplicateContactToSaveContactsResults_Illegal_6: function()
		{
			var results = new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactsResults();
			var dupContact = null;
			// this call should throw an exception
			results.addDuplicateContact(
				new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactResult(
					new YAHOO.Convio.PC2.AddressBookImport.Domain.Contact("foo", "bar", "foo.bar@convio.com"), "some valid result message", dupContact
				)
			);
		},
		
		testAddPotentialDuplicateContactToSaveContactsResults: function()
		{
			var result = new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactsResults();
			for (var i = 1; i <= 3; i++)
			{
				var contact = new YAHOO.Convio.PC2.AddressBookImport.Domain.Contact(FIRST_NAME, LAST_NAME, EMAIL);
				var dupContact = new YAHOO.Convio.PC2.AddressBookImport.Domain.DuplicateContact(3882, FIRST_NAME, LAST_NAME, EMAIL);
				result.addPotentialDuplicateContact(new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactResult(contact, "foo bar", dupContact));
				this.assertEqual(i, result.getPotentialDuplicateContacts().length);
				this.assertEqual(i, result.countPotentialDuplicateContacts());
			}
		},
		
		testAddPotentialDuplicateContactToSaveContactsResults_Illegal_1: function()
		{
			var results = new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactsResults();
			// this call should throw an exception
			results.addPotentialDuplicateContact(new String());
		},
		
		testAddPotentialDuplicateContactToSaveContactsResults_Illegal_2: function()
		{
			var results = new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactsResults();
			// this call should throw an exception
			results.addPotentialDuplicateContact(null);
		},
		
		testAddPotentialDuplicateContactToSaveContactsResults_Illegal_3: function()
		{
			var results = new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactsResults();
			// this call should throw an exception
			results.addPotentialDuplicateContact();
		},
		
		testAddPotentialDuplicateContactToSaveContactsResults_Illegal_4: function()
		{
			var results = new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactsResults();
			// this call should throw an exception
			results.addPotentialDuplicateContact(new YAHOO.Convio.PC2.AddressBookImport.Domain.Contact("wrong", "object type", "wrong@object.type"));
		},
		
		testAddPotentialDuplicateContactToSaveContactsResults_Illegal_5: function()
		{
			var results = new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactsResults();
			var dupContact;
			// this call should throw an exception
			results.addPotentialDuplicateContact(
				new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactResult(
					new YAHOO.Convio.PC2.AddressBookImport.Domain.Contact("foo", "bar", "foo.bar@convio.com"), "some valid result message", dupContact
				)
			);
		},
		
		testAddPotentialDuplicateContactToSaveContactsResults_Illegal_6: function()
		{
			var results = new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactsResults();
			var dupContact = null;
			// this call should throw an exception
			results.addPotentialDuplicateContact(
				new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactResult(	
					new YAHOO.Convio.PC2.AddressBookImport.Domain.Contact("foo", "bar", "foo.bar@convio.com"), "some valid result message", dupContact
				)
			);
		},
		
		testAddErrorContactToSaveContactsResults: function()
		{
			var result = new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactsResults();
			for (var i = 1; i <= 3; i++)
			{
				var contact = new YAHOO.Convio.PC2.AddressBookImport.Domain.Contact(FIRST_NAME, LAST_NAME, EMAIL);
				result.addErrorContact(new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactResult(contact, "foo bar"));
				this.assertEqual(i, result.getErrorContacts().length);
				this.assertEqual(i, result.countErrorContacts());
			}
		},
		
		testAddErrorContactToSaveContactsResults_Illegal_1: function()
		{
			var results = new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactsResults();
			// this call should throw an exception
			results.addErrorContact(new String());
		},
		
		testAddErrorContactToSaveContactsResults_Illegal_2: function()
		{
			var results = new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactsResults();
			// this call should throw an exception
			results.addErrorContact(null);
		},
		
		testAddErrorContactToSaveContactsResults_Illegal_3: function()
		{
			var results = new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactsResults();
			// this call should throw an exception
			results.addErrorContact();
		},
		
		testAddErrorContactToSaveContactsResults_Illegal_4: function()
		{
			var results = new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactsResults();
			// this call should throw an exception
			results.addErrorContact(new YAHOO.Convio.PC2.AddressBookImport.Domain.Contact("wrong", "object type", "wrong@object.type"));
		},
		
		testNewDuplicateContact: function()
		{
			var dupId = 823893;
			var dupContact = new YAHOO.Convio.PC2.AddressBookImport.Domain.DuplicateContact(dupId, FIRST_NAME, LAST_NAME, EMAIL);
			this.assertEqual(dupId, dupContact.getId());
			this.assertEqual(FIRST_NAME, dupContact.getFirstName());
			this.assertEqual(LAST_NAME, dupContact.getLastName());
			this.assertEqual(EMAIL, dupContact.getEmail());
		},
		
		testNewDuplicateContact_Illegal: function()
		{
			var dupId; /* undefined */
			
			// this call should throw an exception
			var dupContact = new YAHOO.Convio.PC2.AddressBookImport.Domain.DuplicateContact(dupId, FIRST_NAME, LAST_NAME, EMAIL);
		},
		
		testNewDuplicateContact_blankValues: function()
		{
			var dupId = 823893;
			var dupContact = new YAHOO.Convio.PC2.AddressBookImport.Domain.DuplicateContact(dupId, "", "", "");
			this.assertEqual(dupId, dupContact.getId());
			this.assertEqual("", dupContact.getFirstName());
			this.assertEqual("", dupContact.getLastName());
			this.assertEqual("", dupContact.getEmail());
		},
		
		testNewDuplicateContact_GarbageValues: function()
		{
			var undefinedVariable;
			var garbageValues = [{}, {foo: "bar"}, null, undefinedVariable, 12345, 192.45, new Array()];
			
			for (var i = 0; i < garbageValues.length; i++) {
				var garbage = garbageValues[i];
				var contact = new YAHOO.Convio.PC2.AddressBookImport.Domain.DuplicateContact(123, garbage, garbage, garbage);
				this.assertEqual(null, contact.getFirstName());
				this.assertEqual(null, contact.getLastName());
				this.assertEqual(null, contact.getEmail());
			}
		},
		
		testDuplicateContactToHtmlString: function()
		{
			var dupId = 823893;
			var dupContact = new YAHOO.Convio.PC2.AddressBookImport.Domain.DuplicateContact(dupId, FIRST_NAME, LAST_NAME, EMAIL);
			var dupContactAsHtml = dupContact.toHtmlString();
			this.assertWellDefined(dupContactAsHtml);
			this.assertTrue(dupContactAsHtml.indexOf(dupContact.getFirstName()) > -1);
			this.assertTrue(dupContactAsHtml.indexOf(dupContact.getLastName()) > -1);
			this.assertTrue(dupContactAsHtml.indexOf(dupContact.getEmail()) > -1);
		},
		
		testNewCsvMapping: function()
		{
			var csvMapping = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvMapping(3, 0, 1, 2);
			this.assertEqual(3, csvMapping.getNumCsvColumns());
			this.assertEqual(0, csvMapping.getFirstNameColumnIndex());
			this.assertEqual(1, csvMapping.getLastNameColumnIndex());
			this.assertEqual(2, csvMapping.getEmailColumnIndex());
		},
		
		testNewCsvMapping_Illegal_NumCsvColumns_Negative: function()
		{
			var csvMapping = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvMapping(-1, 0, 1, 2);
		},
		
		testNewCsvMapping_Illegal_FirstNameIndex_Negative: function()
		{
			var csvMapping = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvMapping(3, -1, 1, 2);
		},
		
		testNewCsvMapping_Illegal_FirstNameIndex_Undefined: function()
		{
			var thisIsUndefined;
			var csvMapping = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvMapping(3, thisIsUndefined, 1, 2);
		},
		
		testNewCsvMapping_Illegal_FirstNameIndex_NonInteger: function()
		{
			var csvMapping = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvMapping(3, 'foo', 1, 2);
		},
		
		testNewCsvMapping_Illegal_FirstNameIndex_OutOfBounds: function()
		{
			var csvMapping = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvMapping(3, 3, 1, 2);
		},
		
		testNewCsvMapping_Illegal_LastNameIndex_Negative: function()
		{
			var csvMapping = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvMapping(3, 0, -1, 2);
		},
		
		testNewCsvMapping_Illegal_LastNameIndex_Undefined: function()
		{
			var thisIsUndefined;
			var csvMapping = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvMapping(3, 0, thisIsUndefined, 2);
		},
		
		testNewCsvMapping_Illegal_LastNameIndex_NonInteger: function()
		{
			var csvMapping = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvMapping(3, 0, 'foo', 2);
		},
		
		testNewCsvMapping_Illegal_LastNameIndex_OutOfBounds: function()
		{
			var csvMapping = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvMapping(3, 0, 3, 2);
		},
		
		testNewCsvMapping_Illegal_EmailIndex_Negative: function()
		{
			var csvMapping = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvMapping(3, 0, 1, -1);
		},
		
		testNewCsvMapping_Illegal_EmailIndex_Undefined: function()
		{
			var thisIsUndefined;
			var csvMapping = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvMapping(3, 0, 1, thisIsUndefined);
		},
		
		testNewCsvMapping_Illegal_EmailIndex_NonInteger: function()
		{
			var csvMapping = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvMapping(3, 0, 1, 'foo');
		},
		
		testNewCsvMapping_Illegal_EmailIndex_OutOfBounds: function()
		{
			var csvMapping = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvMapping(3, 0, 1, 3);
		},
		
		testIsUniqueMapping: function() {
			this.assertTrue(new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvMapping(3, 0, 1, 2).isUniqueMapping());
			this.assertFalse(new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvMapping(3, 0, 0, 2).isUniqueMapping());
			this.assertFalse(new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvMapping(3, 0, 1, 1).isUniqueMapping());
			this.assertFalse(new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvMapping(3, 0, 1, 0).isUniqueMapping());
		},
		
		testNewCsvParseResult: function()
		{
			var orderedColumnHeaderLabels = ["first_name", "last_name", "email_address"];
			var proposedCharacterEncoding = "ASCII";
			var mappingConfidenceLevel = "LOW";
			var csvMapping = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvMapping(3, 0, 1, 2);
			var csvParseResult = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvParseResult(orderedColumnHeaderLabels, proposedCharacterEncoding, mappingConfidenceLevel, csvMapping);
			
			this.assertEqual(orderedColumnHeaderLabels, csvParseResult.getOrderedColumnHeaderLabels());
			this.assertEqual(mappingConfidenceLevel, csvParseResult.getMappingConfidenceLevel());
			this.assertEqual(csvMapping, csvParseResult.getCsvMapping());
			this.assertEqual(proposedCharacterEncoding, csvParseResult.getProposedCharacterEncoding());
		},
		
		testNewCsvParseResult_Illegal_ProposedCharacterEncoding: function()
		{
			var orderedColumnHeaderLabels;
			var proposedCharacterEncoding = 123;
			var mappingConfidenceLevel = "LOW";
			var csvMapping = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvMapping(3, 0, 1, 2);
			var csvParseResult = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvParseResult(orderedColumnHeaderLabels, proposedCharacterEncoding, mappingConfidenceLevel, csvMapping);
		},
		
		testNewCsvParseResult_Illegal_OrderedColumnHeaderLabels_Undefined: function()
		{
			var orderedColumnHeaderLabels;
			var proposedCharacterEncoding = "ASCII";
			var mappingConfidenceLevel = "LOW";
			var csvMapping = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvMapping(3, 0, 1, 2);
			var csvParseResult = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvParseResult(orderedColumnHeaderLabels, proposedCharacterEncoding, mappingConfidenceLevel, csvMapping);
		},
		
		testNewCsvParseResult_Illegal_OrderedColumnHeaderLabels_Null: function()
		{
			var orderedColumnHeaderLabels = null;
			var proposedCharacterEncoding = "ASCII";
			var mappingConfidenceLevel = "LOW";
			var csvMapping = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvMapping(3, 0, 1, 2);
			var csvParseResult = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvParseResult(orderedColumnHeaderLabels, proposedCharacterEncoding, mappingConfidenceLevel, csvMapping);
		},
		
		testNewCsvParseResult_Illegal_OrderedColumnHeaderLabels_NonArray: function()
		{
			var orderedColumnHeaderLabels = 'foo';
			var proposedCharacterEncoding = "ASCII";
			var mappingConfidenceLevel = "LOW";
			var csvMapping = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvMapping(3, 0, 1, 2);
			var csvParseResult = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvParseResult(orderedColumnHeaderLabels, proposedCharacterEncoding, mappingConfidenceLevel, csvMapping);
		},
		
		testNewCsvParseResult_Illegal_OrderedColumnHeaderLabels_NonStringLabelInArray: function()
		{
			var orderedColumnHeaderLabels = ["first_name", 1234, "email_address"];
			var proposedCharacterEncoding = "ASCII";
			var mappingConfidenceLevel = "LOW";
			var csvMapping = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvMapping(3, 0, 1, 2);
			var csvParseResult = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvParseResult(orderedColumnHeaderLabels, proposedCharacterEncoding, mappingConfidenceLevel, csvMapping);
		},
		
		testNewCsvParseResult_Illegal_OrderedColumnHeaderLabels_TooFewColumnHeaderLabels: function()
		{
			var orderedColumnHeaderLabels = ["first_name", "last_name"];
			var proposedCharacterEncoding = "ASCII";
			var mappingConfidenceLevel = "LOW";
			var csvMapping = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvMapping(3, 0, 1, 2);
			var csvParseResult = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvParseResult(orderedColumnHeaderLabels, proposedCharacterEncoding, mappingConfidenceLevel, csvMapping);
		},
		
		testNewCsvParseResult_Illegal_OrderedColumnHeaderLabels_TooManyColumnHeaderLabels: function()
		{
			var orderedColumnHeaderLabels = ["first_name", "last_name", "email_address", "where'd this come from?"];
			var proposedCharacterEncoding = "ASCII";
			var mappingConfidenceLevel = "LOW";
			var csvMapping = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvMapping(3, 0, 1, 2);
			var csvParseResult = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvParseResult(orderedColumnHeaderLabels, proposedCharacterEncoding, mappingConfidenceLevel, csvMapping);
		},
		
		testNewCsvParseResult_Illegal_MappingConfidenceLevel_Undefined: function()
		{
			var orderedColumnHeaderLabels = ["first_name", "last_name", "email_address"];
			var proposedCharacterEncoding = "ASCII";
			var mappingConfidenceLevel;
			var csvMapping = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvMapping(3, 0, 1, 2);
			var csvParseResult = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvParseResult(orderedColumnHeaderLabels, proposedCharacterEncoding, mappingConfidenceLevel, csvMapping);
		},
		
		testNewCsvParseResult_Illegal_MappingConfidenceLevel_Null: function()
		{
			var orderedColumnHeaderLabels = ["first_name", "last_name", "email_address"];
			var proposedCharacterEncoding = "ASCII";
			var mappingConfidenceLevel = null;
			var csvMapping = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvMapping(3, 0, 1, 2);
			var csvParseResult = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvParseResult(orderedColumnHeaderLabels, proposedCharacterEncoding, mappingConfidenceLevel, csvMapping);
		},
		
		testNewCsvParseResult_Illegal_MappingConfidenceLevel_UnexpectedValue: function()
		{
			var orderedColumnHeaderLabels = ["first_name", "last_name", "email_address"];
			var proposedCharacterEncoding = "ASCII";
			var mappingConfidenceLevel = "JavaScript will let me do anything I want";
			var csvMapping = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvMapping(3, 0, 1, 2);
			var csvParseResult = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvParseResult(orderedColumnHeaderLabels, proposedCharacterEncoding, mappingConfidenceLevel, csvMapping);
		},
		
		testNewCsvParseResult_Illegal_CsvMapping_Undefined: function()
		{
			var orderedColumnHeaderLabels = ["first_name", "last_name", "email_address"];
			var proposedCharacterEncoding = "ASCII";
			var mappingConfidenceLevel = "LOW";
			var csvMapping;
			var csvParseResult = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvParseResult(orderedColumnHeaderLabels, proposedCharacterEncoding, mappingConfidenceLevel, csvMapping);
		},
		
		testNewCsvParseResult_Illegal_CsvMapping_Null: function()
		{
			var orderedColumnHeaderLabels = ["first_name", "last_name", "email_address"];
			var proposedCharacterEncoding = "ASCII";
			var mappingConfidenceLevel = "LOW";
			var csvMapping = null;
			var csvParseResult = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvParseResult(orderedColumnHeaderLabels, proposedCharacterEncoding, mappingConfidenceLevel, csvMapping);
		},
		
		testNewCsvParseResult_Illegal_CsvMapping_UnexpectedObjectType: function()
		{
			var orderedColumnHeaderLabels = ["first_name", "last_name", "email_address"];
			var proposedCharacterEncoding = "ASCII";
			var mappingConfidenceLevel = "LOW";
			var csvMapping = new Array();
			var csvParseResult = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvParseResult(orderedColumnHeaderLabels, proposedCharacterEncoding, mappingConfidenceLevel, csvMapping);
		},
		
		testAddDataRow: function()
		{
			var orderedColumnHeaderLabels = ["first_name", "last_name", "email_address"];
			var proposedCharacterEncoding = "ASCII";
			var mappingConfidenceLevel = "LOW";
			var csvMapping = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvMapping(3, 0, 1, 2);
			var csvParseResult = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvParseResult(orderedColumnHeaderLabels, proposedCharacterEncoding, mappingConfidenceLevel, csvMapping);
			
			this.assertEqual(0, csvParseResult.toAddressBook().getContacts().length)
			
			for (var i = 1; i <= 200; i++) {
				var dataRow = new Array();
				dataRow.push("bob");
				dataRow.push("smith");
				dataRow.push("bsmith@convio.com");
				csvParseResult.addDataRow(dataRow);
				this.assertEqual(i, csvParseResult.toAddressBook().getContacts().length)
			}
		},
		
		testAddDataRow_Illegal_TooFewColumns: function()
		{
			var orderedColumnHeaderLabels = ["first_name", "last_name", "email_address"];
			var proposedCharacterEncoding = "ASCII";
			var mappingConfidenceLevel = "LOW";
			var csvMapping = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvMapping(3, 0, 1, 2);
			var csvParseResult = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvParseResult(orderedColumnHeaderLabels, proposedCharacterEncoding, mappingConfidenceLevel, csvMapping);
			
			this.assertEqual(0, csvParseResult.toAddressBook().getContacts().length)
			
			var dataRow = new Array();
			dataRow.push("bob");
			dataRow.push("smith");
			// this should fail
			csvParseResult.addDataRow(dataRow);
		},
		
		testAddDataRow_Illegal_TooManyColumns: function()
		{
			var orderedColumnHeaderLabels = ["first_name", "last_name", "email_address"];
			var proposedCharacterEncoding = "ASCII";
			var mappingConfidenceLevel = "LOW";
			var csvMapping = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvMapping(3, 0, 1, 2);
			var csvParseResult = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvParseResult(orderedColumnHeaderLabels, proposedCharacterEncoding, mappingConfidenceLevel, csvMapping);
			
			this.assertEqual(0, csvParseResult.toAddressBook().getContacts().length)
			
			var dataRow = new Array();
			dataRow.push("bob");
			dataRow.push("smith");
			dataRow.push("smith");
			dataRow.push("extra column");
			// this should fail
			csvParseResult.addDataRow(dataRow);
		},
		
		testAddDataRow_Illegal_NotAnArray: function()
		{
			var orderedColumnHeaderLabels = ["first_name", "last_name", "email_address"];
			var proposedCharacterEncoding = "ASCII";
			var mappingConfidenceLevel = "LOW";
			var csvMapping = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvMapping(3, 0, 1, 2);
			var csvParseResult = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvParseResult(orderedColumnHeaderLabels, proposedCharacterEncoding, mappingConfidenceLevel, csvMapping);
			
			this.assertEqual(0, csvParseResult.toAddressBook().getContacts().length)
			
			var dataRow = {};
			csvParseResult.addDataRow(dataRow);
		},
		
		testAddDataRow_Illegal_ArrayOfNonStrings: function()
		{
			var orderedColumnHeaderLabels = ["first_name", "last_name", "email_address"];
			var proposedCharacterEncoding = "ASCII";
			var mappingConfidenceLevel = "LOW";
			var csvMapping = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvMapping(3, 0, 1, 2);
			var csvParseResult = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvParseResult(orderedColumnHeaderLabels, proposedCharacterEncoding, mappingConfidenceLevel, csvMapping);
			
			this.assertEqual(0, csvParseResult.toAddressBook().getContacts().length)
			
			var dataRow = new Array();
			dataRow.push(123);
			dataRow.push(456);
			dataRow.push(789);
			csvParseResult.addDataRow(dataRow);
		},
		
		testToAddressBook_NoRows: function() {
			
			var orderedColumnHeaderLabels = ["first_name", "last_name", "email_address"];
			var proposedCharacterEncoding = "ASCII";
			var mappingConfidenceLevel = "LOW";
			var csvMapping = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvMapping(3, 0, 1, 2);
			var csvParseResult = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvParseResult(orderedColumnHeaderLabels, proposedCharacterEncoding, mappingConfidenceLevel, csvMapping);
			
			var addrBook = csvParseResult.toAddressBook();
			
			this.assertWellDefined(addrBook);
			this.assertEqual(0, addrBook.getContacts().length);
			
		},
		
		testToAddressBook_Vanilla_SingleRow: function() {
			
			var orderedColumnHeaderLabels = ["first_name", "last_name", "email_address"];
			var proposedCharacterEncoding = "ASCII";
			var mappingConfidenceLevel = "LOW";
			var csvMapping = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvMapping(3, 0, 1, 2);
			var csvParseResult = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvParseResult(orderedColumnHeaderLabels, proposedCharacterEncoding, mappingConfidenceLevel, csvMapping);
			
			var firstName = "Bob";
			var lastName = "Smith";
			var email = "devnull+bsmith@convio.com";
			csvParseResult.addDataRow([firstName, lastName, email]);
			
			var addrBook = csvParseResult.toAddressBook();
			
			this.assertWellDefined(addrBook);
			this.assertEqual(1, addrBook.getContacts().length);
			
			var contact = addrBook.getContacts()[0];
			this.assertEqual(firstName, contact.getFirstName());
			this.assertEqual(lastName, contact.getLastName());
			this.assertEqual(email, contact.getEmail());
			
		},
		
		testToAddressBook_Vanilla_MultipleRow: function() {
			
			var numRows = 250;
			
			var orderedColumnHeaderLabels = ["first_name", "last_name", "email_address"];
			var proposedCharacterEncoding = "ASCII";
			var mappingConfidenceLevel = "LOW";
			var csvMapping = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvMapping(3, 0, 1, 2);
			var csvParseResult = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvParseResult(orderedColumnHeaderLabels, proposedCharacterEncoding, mappingConfidenceLevel, csvMapping);
			
			var firstNameBase = "Foo";
			var lastNameBase = "Bar";
			
			for (var i = 0; i < numRows; i++) {
				var firstName = firstNameBase + i;
				var lastName = lastNameBase + i;
				var email = "devnull+" + firstName + "." + lastName + "@convio.com";
				csvParseResult.addDataRow([firstName, lastName, email]);
			}
			
			var addrBook = csvParseResult.toAddressBook();
			
			this.assertWellDefined(addrBook);
			this.assertEqual(numRows, addrBook.getContacts().length);
			
			for (var i = 0; i < addrBook.getContacts().length; i++) {
				var contact = addrBook.getContacts()[i];
				this.assertEqual(firstNameBase + i, contact.getFirstName());
				this.assertEqual(lastNameBase + i, contact.getLastName());
				this.assertEqual("devnull+" + firstNameBase + i + "." + lastNameBase + i + "@convio.com", contact.getEmail());
			}
			
		},
		
		testToAddressBook_NullValues: function() {
			
			var orderedColumnHeaderLabels = ["first_name", "last_name", "email_address"];
			var proposedCharacterEncoding = "ASCII";
			var mappingConfidenceLevel = "LOW";
			var csvMapping = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvMapping(3, 0, 1, 2);
			var csvParseResult = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvParseResult(orderedColumnHeaderLabels, proposedCharacterEncoding, mappingConfidenceLevel, csvMapping);
			
			var firstName = null;
			var lastName = null;
			var email = null;
			csvParseResult.addDataRow([firstName, lastName, email]);
			
			var addrBook = csvParseResult.toAddressBook();
			
			this.assertWellDefined(addrBook);
			this.assertEqual(1, addrBook.getContacts().length);
			
			var contact = addrBook.getContacts()[0];
			this.assertEqual(firstName, contact.getFirstName());
			this.assertEqual(lastName, contact.getLastName());
			this.assertEqual(email, contact.getEmail());
			
		},
		
		testToAddressBook_BlankValues: function() {
			
			var orderedColumnHeaderLabels = ["first_name", "last_name", "email_address"];
			var proposedCharacterEncoding = "ASCII";
			var mappingConfidenceLevel = "LOW";
			var csvMapping = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvMapping(3, 0, 1, 2);
			var csvParseResult = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvParseResult(orderedColumnHeaderLabels, proposedCharacterEncoding, mappingConfidenceLevel, csvMapping);
			
			var firstName = "";
			var lastName = "";
			var email = "";
			csvParseResult.addDataRow([firstName, lastName, email]);
			
			var addrBook = csvParseResult.toAddressBook();
			
			this.assertWellDefined(addrBook);
			this.assertEqual(1, addrBook.getContacts().length);
			
			var contact = addrBook.getContacts()[0];
			this.assertEqual(firstName, contact.getFirstName());
			this.assertEqual(lastName, contact.getLastName());
			this.assertEqual(email, contact.getEmail());
			
		},
		
		testToAddressBook_SpecialCharacterValues: function() {
			
			var orderedColumnHeaderLabels = ["first_name", "last_name", "email_address"];
			var proposedCharacterEncoding = "ASCII";
			var mappingConfidenceLevel = "LOW";
			var csvMapping = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvMapping(3, 0, 1, 2);
			var csvParseResult = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvParseResult(orderedColumnHeaderLabels, proposedCharacterEncoding, mappingConfidenceLevel, csvMapping);
			
			var firstName = "\"Beastly\" Bób";
			var lastName = "Smith, Jr.";
			var email = "dévnull+bsmith@convio.com";
			csvParseResult.addDataRow([firstName, lastName, email]);
			
			var addrBook = csvParseResult.toAddressBook();
			
			this.assertWellDefined(addrBook);
			this.assertEqual(1, addrBook.getContacts().length);
			
			var contact = addrBook.getContacts()[0];
			this.assertEqual(firstName, contact.getFirstName());
			this.assertEqual(lastName, contact.getLastName());
			this.assertEqual(email, contact.getEmail());
		},
		
		testToAddressBook_PostColumnMappingChange: function() {
			
			var orderedColumnHeaderLabels = ["first_name", "last_name", "email_address"];
			var proposedCharacterEncoding = "ASCII";
			var mappingConfidenceLevel = "LOW";
			var csvMapping = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvMapping(3, 0, 1, 2);
			var csvParseResult = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvParseResult(orderedColumnHeaderLabels, proposedCharacterEncoding, mappingConfidenceLevel, csvMapping);
			
			var firstName = "Bob";
			var lastName = "Smith";
			var email = "devnull+bsmith@convio.com";
			csvParseResult.addDataRow([firstName, lastName, email]);
			
			var addrBook = csvParseResult.toAddressBook();
			
			this.assertWellDefined(addrBook);
			this.assertEqual(1, addrBook.getContacts().length);
			
			var contact = addrBook.getContacts()[0];
			this.assertEqual(firstName, contact.getFirstName());
			this.assertEqual(lastName, contact.getLastName());
			this.assertEqual(email, contact.getEmail());
			
			csvMapping.setFirstNameColumnIndex(1);
			csvMapping.setLastNameColumnIndex(2);
			csvMapping.setEmailColumnIndex(0);
			
			addrBook = csvParseResult.toAddressBook();
			
			this.assertWellDefined(addrBook);
			this.assertEqual(1, addrBook.getContacts().length);
			
			contact = addrBook.getContacts()[0];
			this.assertEqual(lastName, contact.getFirstName());
			this.assertEqual(email, contact.getLastName());
			this.assertEqual(firstName, contact.getEmail());
			
		}
		
	});

	// add test case to test runner
	Y.Test.Runner.add(Y.Convio.PC2.Test.pc2_address_book_import);
},
"1.0",
{ requires: ['test', 'test-assertions', 'address-book-import-domain'] }
);