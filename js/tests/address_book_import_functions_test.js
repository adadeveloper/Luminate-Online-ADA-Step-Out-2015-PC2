/*
 * address_book_import_functions_test.js
 * 
 * Defines unit tests for functions defined in address_book_import_functions.js
 * 
 * @see http://developer.yahoo.com/yui/3/test/
 * @see http://yuilibrary.com/forum/viewtopic.php?p=15478
 */

YUI.add("address_book_import_functions_test", function(Y){

	Y.namespace("Convio.PC2.Test");
	
	// define a test case object
	Y.Convio.PC2.Test.pc2_address_book_import_functions = new Y.Test.Case({ 
		
		name : "Address Book Import Functions Test",

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
			useList : "#pc2_address_book_import_functions_results_list"

			,
			ignore : {
			},
			error: {
				testContextSetSource_Illegal_1: true,
				testContextSetSource_Illegal_2: true,
				testContextSetOAuthUrl_Illegal_1: true,
				testContextSetOAuthUrl_Illegal_2: true,
				testContextSetOAuthUrl_Illegal_3: true,
				testContextSetAddressBook_Illegal_1: true,
				testContextSetAddressBook_Illegal_2: true,
				testContextSetAddressBook_Illegal_3: true,
				testContextSetSaveContactsResult_Illegal_1: true,
				testContextSetSaveContactsResult_Illegal_2: true,
				testContextSetSaveContactsResult_Illegal_3: true,
				testContextSetCsvParseResult_Illegal_1: true,
				testContextSetCsvParseResult_Illegal_2: true,
				testContextSetCsvParseResult_Illegal_3: true
			}
		},

		testNewContext : function()
		{
			var ctx = new YAHOO.Convio.PC2.Component.AddressBookImport.Context();
			
			this.assertWellDefined(ctx);
			
			this.assertNull(ctx.getSource());
			this.assertNull(ctx.getJobId());
			this.assertNull(ctx.getOAuthUrl());
			this.assertNull(ctx.getAddressBook());
			this.assertNull(ctx.getSaveContactsResult());
		},
		
		testContextGettersAndSetters : function()
		{
			var ctx = new YAHOO.Convio.PC2.Component.AddressBookImport.Context();
			
			var foo;
			
			foo = 'foo1';
			ctx.setSource(foo);
			this.assertEqual(foo, ctx.getSource());
			
			var orderedColumnHeaderLabels = new Array();
			orderedColumnHeaderLabels.push("first_name");
			orderedColumnHeaderLabels.push("last_name");
			orderedColumnHeaderLabels.push("email_address");
			var proposedCharacterEncoding = "ASCII";
			var mappingConfidenceLevel = "LOW";
			var csvMapping = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvMapping(3, 0, 1, 2);
			var csvParseResult = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvParseResult(orderedColumnHeaderLabels, proposedCharacterEncoding, mappingConfidenceLevel, csvMapping);
			foo = csvParseResult; 
			ctx.setCsvParseResult(foo);
			this.assertEqual(foo, ctx.getCsvParseResult());
			
			foo = 'foo2';
			ctx.setJobId(foo);
			this.assertEqual(foo, ctx.getJobId());
			
			foo = 'foo3';
			ctx.setOAuthUrl(foo);
			this.assertEqual(foo, ctx.getOAuthUrl());
			
			foo = new YAHOO.Convio.PC2.AddressBookImport.Domain.AddressBook();
			ctx.setAddressBook(foo);
			this.assertEqual(foo, ctx.getAddressBook());
			
			foo = new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactsResults(); 
			ctx.setSaveContactsResult(foo);
			this.assertEqual(foo, ctx.getSaveContactsResult());
		},
		
		testContextSetCsvParseResult_Illegal_1: function() {
			var ctx = new YAHOO.Convio.PC2.Component.AddressBookImport.Context();
			ctx.setCsvParseResult({});
		},
		
		testContextSetCsvParseResult_Illegal_2: function() {
			var ctx = new YAHOO.Convio.PC2.Component.AddressBookImport.Context();
			ctx.setCsvParseResult("Eudora"); /* feeling my age here*/
		},
		
		testContextSetCsvParseResult_Illegal_3: function() {
			var ctx = new YAHOO.Convio.PC2.Component.AddressBookImport.Context();
			ctx.setCsvParseResult(123);
		},
		
		
		testContextSetSource_Illegal_1: function() {
			var ctx = new YAHOO.Convio.PC2.Component.AddressBookImport.Context();
			ctx.setSource({});
		},
		
		testContextSetSource_Illegal_2: function() {
			var ctx = new YAHOO.Convio.PC2.Component.AddressBookImport.Context();
			ctx.setSource(123);
		},
		
		testContextSetOAuthUrl_Illegal_1: function() {
			var ctx = new YAHOO.Convio.PC2.Component.AddressBookImport.Context();
			ctx.setOAuthUrl({});
		},
		
		testContextSetOAuthUrl_Illegal_2: function() {
			var ctx = new YAHOO.Convio.PC2.Component.AddressBookImport.Context();
			ctx.setOAuthUrl("");
		},
		
		testContextSetOAuthUrl_Illegal_3: function() {
			var ctx = new YAHOO.Convio.PC2.Component.AddressBookImport.Context();
			ctx.setOAuthUrl(123);
		},
		
		testContextSetAddressBook_Illegal_1: function() {
			var ctx = new YAHOO.Convio.PC2.Component.AddressBookImport.Context();
			ctx.setAddressBook({});
		},
		
		testContextSetAddressBook_Illegal_2: function() {
			var ctx = new YAHOO.Convio.PC2.Component.AddressBookImport.Context();
			ctx.setAddressBook(123);
		},
		
		testContextSetAddressBook_Illegal_3: function() {
			var ctx = new YAHOO.Convio.PC2.Component.AddressBookImport.Context();
			ctx.setAddressBook("blah blah");
		},
		
		testContextSetSaveContactsResult_Illegal_1: function() {
			var ctx = new YAHOO.Convio.PC2.Component.AddressBookImport.Context();
			ctx.setSaveContactsResult({});
		},
		
		testContextSetSaveContactsResult_Illegal_2: function() {
			var ctx = new YAHOO.Convio.PC2.Component.AddressBookImport.Context();
			ctx.setSaveContactsResult(213);
		},
		
		testContextSetSaveContactsResult_Illegal_3: function() {
			var ctx = new YAHOO.Convio.PC2.Component.AddressBookImport.Context();
			ctx.setSaveContactsResult("blah blah");
		},
		
		testBuildAndReBuildCsvMappingPreviewList: function() {
			// assert expected starting state
			this.assertUndefined(YAHOO.Convio.PC2.Component.AddressBookImport.CsvMappingPreviewList);
			
			// establish an import context
			var ctx = new YAHOO.Convio.PC2.Component.AddressBookImport.Context();
			YAHOO.Convio.PC2.Component.AddressBookImport.context = ctx;
			
			// insert a fake CSV parse response into the context
			var orderedColumnHeaderLabels = ["first_name", "last_name", "email_address"];
			var proposedCharacterEncoding = "ASCII";
			var mappingConfidenceLevel = "LOW";
			var csvMapping = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvMapping(3, 0, 1, 2);
			var csvParseResult = new YAHOO.Convio.PC2.AddressBookImport.Domain.CsvParseResult(orderedColumnHeaderLabels, proposedCharacterEncoding, mappingConfidenceLevel, csvMapping);
			ctx.setCsvParseResult(csvParseResult);
			
			// build the table
			YAHOO.Convio.PC2.Component.AddressBookImport.buildCsvMappingPreviewList();
			var dataTable = YAHOO.Convio.PC2.Component.AddressBookImport.CsvMappingPreviewList.dataTable;
			
			// assert expected ending state
			this.assertWellDefined(dataTable);
			this.assertEqual(0, dataTable.getRecordSet().getLength());
			
			// add a data row to csv parse results
			csvParseResult.addDataRow(["foo", "bar", "devnull+fbar@convio.com"]);
			
			// rebuild the table synchronously
			YAHOO.Convio.PC2.Component.AddressBookImport.buildCsvMappingPreviewList();
			dataTable = YAHOO.Convio.PC2.Component.AddressBookImport.CsvMappingPreviewList.dataTable;
			
			// assert expected ending state
			this.assertWellDefined(dataTable);
			this.assertEqual(1, dataTable.getRecordSet().getLength());
			
			// add another data row to csv parse results
			csvParseResult.addDataRow(["Guy", "Noir", "devnull+gn@convio.com"]);
			
			// rebuild the table asynchronously
			YAHOO.Convio.PC2.Component.AddressBookImport.reBuildCsvMappingPreviewList();
			
			this.wait(function() {
				var rebuiltDataTable = YAHOO.Convio.PC2.Component.AddressBookImport.CsvMappingPreviewList.dataTable;
				
				// assert expected ending state
				this.assertWellDefined(rebuiltDataTable);
				this.assertEqual(2, rebuiltDataTable.getRecordSet().getLength());
			}, 1 * 1000);
			
		},
		
		testBuildImportCandidateContactsList: function() {
			// assert expected starting state
			this.assertUndefined(YAHOO.Convio.PC2.Component.AddressBookImport.ImportSelectList);
			
			// establish an import context
			var ctx = new YAHOO.Convio.PC2.Component.AddressBookImport.Context();
			YAHOO.Convio.PC2.Component.AddressBookImport.context = ctx;
			
			// insert a fake address book into the context
			var addressBook = new YAHOO.Convio.PC2.AddressBookImport.Domain.AddressBook();
			addressBook.addContact(new YAHOO.Convio.PC2.AddressBookImport.Domain.Contact("foo", "bar", "foo.bar@convio.com"));
			ctx.setAddressBook(addressBook);
			
			// build the table
			YAHOO.Convio.PC2.Component.AddressBookImport.buildImportCandidateContactsList();
			var dataTable = YAHOO.Convio.PC2.Component.AddressBookImport.ImportSelectList.dataTable;
			
			// assert expected ending state
			this.assertWellDefined(dataTable);
			this.assertEqual(addressBook.getContacts().length, dataTable.getRecordSet().getLength());
		},
		
		testSelectAllOrNone: function() {
			// establish an import context
			var ctx = new YAHOO.Convio.PC2.Component.AddressBookImport.Context();
			YAHOO.Convio.PC2.Component.AddressBookImport.context = ctx;
			
			// insert a fake address book into the context
			var addressBook = new YAHOO.Convio.PC2.AddressBookImport.Domain.AddressBook();
			addressBook.addContact(new YAHOO.Convio.PC2.AddressBookImport.Domain.Contact("foo", "bar", "foo.bar@convio.com"));
			addressBook.addContact(new YAHOO.Convio.PC2.AddressBookImport.Domain.Contact("fuu", "baz", "fuu.baz@convio.com"));
			ctx.setAddressBook(addressBook);
			
			// build the table
			YAHOO.Convio.PC2.Component.AddressBookImport.buildImportCandidateContactsList();
			var dataTable = YAHOO.Convio.PC2.Component.AddressBookImport.ImportSelectList.dataTable;
			
			// assert expected checked state on table creation
			this.assertEqual(0, YAHOO.Convio.PC2.Component.AddressBookImport.getSelectedImportCandidateContacts().length);
			
			// select all
			YAHOO.Convio.PC2.Component.AddressBookImport.selectAllImportCandidateContactsList();
			
			// assert all selected
			this.assertEqual(2, YAHOO.Convio.PC2.Component.AddressBookImport.getSelectedImportCandidateContacts().length);
			
			// select none
			YAHOO.Convio.PC2.Component.AddressBookImport.selectNoneImportCandidateContactsList();
			
			// assert none selected
			this.assertEqual(0, YAHOO.Convio.PC2.Component.AddressBookImport.getSelectedImportCandidateContacts().length);
		},
		
		testBuildNewlyAddedContactsList: function() {
			// assert expected starting state
			this.assertUndefined(YAHOO.Convio.PC2.Component.AddressBookImport.NewlyAddedList);
			
			// establish an import context
			var ctx = new YAHOO.Convio.PC2.Component.AddressBookImport.Context();
			YAHOO.Convio.PC2.Component.AddressBookImport.context = ctx;
			
			// insert a fake save results object into the context
			var saveResults = new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactsResults();
			
			saveResults.addSavedContact(new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactResult(
					new YAHOO.Convio.PC2.AddressBookImport.Domain.Contact("foo", "bar", "foo.bar@convio.com"),
					"no problems here",
					null
			));
			
			saveResults.addDuplicateContact(new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactResult(
					new YAHOO.Convio.PC2.AddressBookImport.Domain.Contact("foo", "bar", "foo.bar@convio.com"),
					"exact duplicate",
					new YAHOO.Convio.PC2.AddressBookImport.Domain.DuplicateContact(123, "foo", "bar", "foo.bar@convio.com")
			));
			
			ctx.setSaveContactsResult(saveResults);
			
			// build the table
			YAHOO.Convio.PC2.Component.AddressBookImport.buildNewlyAddedContactsList();
			var dataTable = YAHOO.Convio.PC2.Component.AddressBookImport.NewlyAddedList.dataTable;
			
			// assert expected ending state
			this.assertWellDefined(dataTable);
			this.assertEqual(saveResults.countSavedAndDuplicateContacts(), dataTable.getRecordSet().getLength());
		},
		
		testBuildSuspectedDuplicateContactsList: function() {
			// assert expected starting state
			this.assertUndefined(YAHOO.Convio.PC2.Component.AddressBookImport.SuspectedDuplicatesList);
			
			// establish an import context
			var ctx = new YAHOO.Convio.PC2.Component.AddressBookImport.Context();
			YAHOO.Convio.PC2.Component.AddressBookImport.context = ctx;
			
			// insert a fake save results object into the context
			var saveResults = new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactsResults();
			saveResults.addPotentialDuplicateContact(new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactResult(
					new YAHOO.Convio.PC2.AddressBookImport.Domain.Contact("foo", "bar", "foo.bar@convio.com"),
					"potential duplicate",
					new YAHOO.Convio.PC2.AddressBookImport.Domain.DuplicateContact(123, "fooo", "baaaar", "foo.bar@convio.com")
			));
			ctx.setSaveContactsResult(saveResults);
			
			// build the table
			YAHOO.Convio.PC2.Component.AddressBookImport.buildSuspectedDuplicateContactsList();
			var dataTable = YAHOO.Convio.PC2.Component.AddressBookImport.SuspectedDuplicatesList.dataTable;
			
			// assert expected ending state
			this.assertWellDefined(dataTable);
			this.assertEqual(saveResults.getPotentialDuplicateContacts().length, dataTable.getRecordSet().getLength());
		},
		
		testBuildErrorContactsList: function() {
			// assert expected starting state
			this.assertUndefined(YAHOO.Convio.PC2.Component.AddressBookImport.ErrorsList);
			
			// establish an import context
			var ctx = new YAHOO.Convio.PC2.Component.AddressBookImport.Context();
			YAHOO.Convio.PC2.Component.AddressBookImport.context = ctx;
			
			// insert a fake save results object into the context
			var saveResults = new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactsResults();
			saveResults.addErrorContact(new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactResult(
					new YAHOO.Convio.PC2.AddressBookImport.Domain.Contact("foo", "bar", "foo.bar@convio.com"),
					"error contact :(",
					null
			));
			ctx.setSaveContactsResult(saveResults);
			
			// build the table
			YAHOO.Convio.PC2.Component.AddressBookImport.buildErrorContactsList();
			var dataTable = YAHOO.Convio.PC2.Component.AddressBookImport.ErrorsList.dataTable;
			
			// assert expected ending state
			this.assertWellDefined(dataTable);
			this.assertEqual(saveResults.getErrorContacts().length, dataTable.getRecordSet().getLength());
		},
		
		testGetNumberOfResolvedAndUnresolvedPotentialDuplicateContacts: function() {
			
			// establish an import context
			var ctx = new YAHOO.Convio.PC2.Component.AddressBookImport.Context();
			YAHOO.Convio.PC2.Component.AddressBookImport.context = ctx;
			
			// set some (unresolved) potential duplicates into the context
			var numPotentialDuplicates = 10;
			var saveResults = new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactsResults();
			for (var i = 0; i < numPotentialDuplicates; i++) {
				saveResults.addPotentialDuplicateContact(new YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactResult(
						new YAHOO.Convio.PC2.AddressBookImport.Domain.Contact("foo", "bar" + i, "foo.bar@convio.com"),
						"potential duplicate",
						new YAHOO.Convio.PC2.AddressBookImport.Domain.DuplicateContact(123, "fooo", "baaaar" + i, "foo.bar@convio.com")
				));
			}
			ctx.setSaveContactsResult(saveResults);
			
			// assert expected numbers of resolved and unresolved potential duplicate contacts
			this.assertEqual(0, YAHOO.Convio.PC2.Component.AddressBookImport.getNumberOfResolvedPotentialDuplicateContacts());
			this.assertEqual(numPotentialDuplicates, YAHOO.Convio.PC2.Component.AddressBookImport.getNumberOfUnresolvedPotentialDuplicateContacts());
			
			// resolve a potential duplicate
			saveResults.getPotentialDuplicateContacts()[numPotentialDuplicates - 1].markResolved();
			
			// assert expected numbers of resolved and unresolved potential duplicate contacts
			this.assertEqual(1, YAHOO.Convio.PC2.Component.AddressBookImport.getNumberOfResolvedPotentialDuplicateContacts());
			this.assertEqual(numPotentialDuplicates - 1, YAHOO.Convio.PC2.Component.AddressBookImport.getNumberOfUnresolvedPotentialDuplicateContacts());
			
			// resolve another potential duplicate
			saveResults.getPotentialDuplicateContacts()[0].markResolved();
			
			// assert expected numbers of resolved and unresolved potential duplicate contacts
			this.assertEqual(2, YAHOO.Convio.PC2.Component.AddressBookImport.getNumberOfResolvedPotentialDuplicateContacts());
			this.assertEqual(numPotentialDuplicates - 2, YAHOO.Convio.PC2.Component.AddressBookImport.getNumberOfUnresolvedPotentialDuplicateContacts());
			
		},
		
		testSetContactAndDataTableRecordChecked: function() {
			
			// establish an import context
			var ctx = new YAHOO.Convio.PC2.Component.AddressBookImport.Context();
			YAHOO.Convio.PC2.Component.AddressBookImport.context = ctx;
			
			// insert a fake address book into the context
			var addressBook = new YAHOO.Convio.PC2.AddressBookImport.Domain.AddressBook();
			var numContactsInAddressBook = 10000 /* this value should be greater than the default page size for the table */
			for (var i = 0; i < numContactsInAddressBook; i++) {
				addressBook.addContact(new YAHOO.Convio.PC2.AddressBookImport.Domain.Contact("foo", "bar" + i, "foo.bar@convio.com"));
			}
			ctx.setAddressBook(addressBook);
			
			// build a table of potential import contacts
			YAHOO.Convio.PC2.Component.AddressBookImport.buildImportCandidateContactsList();
			var dataTable = YAHOO.Convio.PC2.Component.AddressBookImport.ImportSelectList.dataTable;
			
			// get the first row from the table
			var firstRow = dataTable.getRecordSet().getRecord(0);
			var contactForFirstRow = ctx.getAddressBook().getContacts()[firstRow.getData("addressBookIndex")];
			
			// get the last row from the table
			var lastRow = dataTable.getRecordSet().getRecord(numContactsInAddressBook - 1);
			var contactForLastRow = ctx.getAddressBook().getContacts()[lastRow.getData("addressBookIndex")];
			
			// assert expected starting states (not checked)
			this.assertFalse(contactForFirstRow.checked);
			this.assertFalse(contactForLastRow.checked);
			
			// check first and last rows
			YAHOO.Convio.PC2.Component.AddressBookImport.setContactAndDataTableRecordChecked(firstRow, true);
			YAHOO.Convio.PC2.Component.AddressBookImport.setContactAndDataTableRecordChecked(lastRow, true);
			
			// assert new expected state for contacts
			this.assertTrue(contactForFirstRow.checked);
			this.assertTrue(contactForLastRow.checked);
			
			// uncheck first and last rows
			YAHOO.Convio.PC2.Component.AddressBookImport.setContactAndDataTableRecordChecked(firstRow, false);
			YAHOO.Convio.PC2.Component.AddressBookImport.setContactAndDataTableRecordChecked(lastRow, false);
			
			// assert new expected state for contacts
			this.assertFalse(contactForFirstRow.checked);
			this.assertFalse(contactForLastRow.checked);
		}, 
		
		testbuildContactUpdateDataForMerge: function() {
			var contactToMerge = new YAHOO.Convio.PC2.AddressBookImport.Domain.Contact('foo1', 'bar1', 'foo1.bar1@convio.com');
			var dupContactToMergeWith = new YAHOO.Convio.PC2.AddressBookImport.Domain.DuplicateContact(12345, 'foo2', 'bar2', 'foo2.bar2@convio.com');
			
			var updateDataForMerge = YAHOO.Convio.PC2.Component.AddressBookImport.buildContactUpdateDataForMerge(contactToMerge, dupContactToMergeWith);
			
			this.assertEqual(dupContactToMergeWith.getId(), updateDataForMerge.contactId);
			this.assertEqual(contactToMerge.getFirstName(), updateDataForMerge.firstName);
			this.assertEqual(contactToMerge.getLastName(), updateDataForMerge.lastName);
			this.assertEqual(contactToMerge.getEmail(), updateDataForMerge.email);
		},
		
		testbuildContactUpdateDataForMerge_BlankValues: function() {
			var contactToMerge = new YAHOO.Convio.PC2.AddressBookImport.Domain.Contact('', '', '');
			var dupContactToMergeWith = new YAHOO.Convio.PC2.AddressBookImport.Domain.DuplicateContact(12345, 'foo', 'bar', 'foo.bar@convio.com');
			
			var updateDataForMerge = YAHOO.Convio.PC2.Component.AddressBookImport.buildContactUpdateDataForMerge(contactToMerge, dupContactToMergeWith);
			
			this.assertEqual(dupContactToMergeWith.getId(), updateDataForMerge.contactId);
			this.assertEqual(dupContactToMergeWith.getFirstName(), updateDataForMerge.firstName);
			this.assertEqual(dupContactToMergeWith.getLastName(), updateDataForMerge.lastName);
			this.assertEqual(dupContactToMergeWith.getEmail(), updateDataForMerge.email);
		},
		
		testbuildContactUpdateDataForMerge_NullValues: function() {
			var contactToMerge = new YAHOO.Convio.PC2.AddressBookImport.Domain.Contact(null, null, null);
			var dupContactToMergeWith = new YAHOO.Convio.PC2.AddressBookImport.Domain.DuplicateContact(12345, 'foo', 'bar', 'foo.bar@convio.com');
			
			var updateDataForMerge = YAHOO.Convio.PC2.Component.AddressBookImport.buildContactUpdateDataForMerge(contactToMerge, dupContactToMergeWith);
			
			this.assertEqual(dupContactToMergeWith.getId(), updateDataForMerge.contactId);
			this.assertEqual(dupContactToMergeWith.getFirstName(), updateDataForMerge.firstName);
			this.assertEqual(dupContactToMergeWith.getLastName(), updateDataForMerge.lastName);
			this.assertEqual(dupContactToMergeWith.getEmail(), updateDataForMerge.email);
		},
		
		testbuildContactUpdateDataForMerge_NonStringValues: function() {
			var contactToMerge = new YAHOO.Convio.PC2.AddressBookImport.Domain.Contact({}, {}, {});
			var dupContactToMergeWith = new YAHOO.Convio.PC2.AddressBookImport.Domain.DuplicateContact(12345, 'foo', 'bar', 'foo.bar@convio.com');
			
			var updateDataForMerge = YAHOO.Convio.PC2.Component.AddressBookImport.buildContactUpdateDataForMerge(contactToMerge, dupContactToMergeWith);
			
			this.assertEqual(dupContactToMergeWith.getId(), updateDataForMerge.contactId);
			this.assertEqual(dupContactToMergeWith.getFirstName(), updateDataForMerge.firstName);
			this.assertEqual(dupContactToMergeWith.getLastName(), updateDataForMerge.lastName);
			this.assertEqual(dupContactToMergeWith.getEmail(), updateDataForMerge.email);
		},
		
		hideErrors: function() {
			// confirm that hide error message methods can execute w/o error regardless of missing DOM elements
			YAHOO.Convio.PC2.Component.AddressBookImport.hideSelectSourceErrors();
			YAHOO.Convio.PC2.Component.AddressBookImport.hideCsvMappingErrors();
			YAHOO.Convio.PC2.Component.AddressBookImport.hideThirdPartyStatusErrors();
			YAHOO.Convio.PC2.Component.AddressBookImport.hideSelectContactsErrors();
		},
		
		testBuildTooltips: function() {
			var contact = new YAHOO.Convio.PC2.AddressBookImport.Domain.Contact("foo", "bar", "foo.bar@convio.com");
			var dupContact = new YAHOO.Convio.PC2.AddressBookImport.Domain.DuplicateContact(123, "fooo", "baaaar", "foo.bar@convio.com");
			
			this.assertWellDefined(YAHOO.Convio.PC2.Component.AddressBookImport.buildAddAsNewTooltip());
			this.assertWellDefined(YAHOO.Convio.PC2.Component.AddressBookImport.buildAddAsNewTooltip(contact, dupContact));
			
			this.assertWellDefined(YAHOO.Convio.PC2.Component.AddressBookImport.buildMergeTooltip());
			this.assertWellDefined(YAHOO.Convio.PC2.Component.AddressBookImport.buildMergeTooltip(contact, dupContact));
			
			this.assertWellDefined(YAHOO.Convio.PC2.Component.AddressBookImport.buildIgnoreTooltip());
			this.assertWellDefined(YAHOO.Convio.PC2.Component.AddressBookImport.buildIgnoreTooltip(contact, dupContact));
		}
		
	});

	// add test case to test runner
	Y.Test.Runner.add(Y.Convio.PC2.Test.pc2_address_book_import_functions);
	
},
"1.0",
{ requires: ['test', 'test-assertions', 'pc2-addressbookimport-functions'] }
);