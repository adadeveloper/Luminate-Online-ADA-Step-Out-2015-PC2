/*
 * address_book_import_dummy_retrieve_rest_test.js
 * 
 * Defines unit tests for functions defined in address_book_import_dummy_retrieve_rest.js
 * 
 * @see http://developer.yahoo.com/yui/3/test/
 * @see http://yuilibrary.com/forum/viewtopic.php?p=15478
 */

YUI.add("address_book_import_dummy_retrieve_rest_test", function(Y){

	Y.namespace("Convio.PC2.Test");
	FIRST_NAME = "Joe";
	LAST_NAME = "Convio";
	EMAIL = "devnull+jconvio@convio.com";
	
	// define a test case object
	Y.Convio.PC2.Test.pc2_address_book_import_dummy_rest = new Y.Test.Case({ 
		
		name : "Address Book Import (Dummy) REST Test",

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
			useList : "#address_book_import_dummy_rest_results_list"

			,
			ignore : {
				testIgnore : true
			}
		},
		
		testImportOnlineAddressBook: function()
		{
			var that = this;
			var abImport = new YAHOO.Convio.PC2.AddressBookImport.ContactRetrieveService();
			var callback = 
			{
				success: function(url, jobId)
				{
					that.resume(function()
					{
						this.assertEqual(abImport.OAUTH_URL, url);
						this.assertEqual(abImport.JOB_ID, jobId);
					});
				},
				failure: function(errMsg)
				{
					that.resume(function()
					{
						that.fail("importOnlineAddressBook failed but was supposed to succeed");
					});
				},
				scope: this
			};
			abImport.importOnlineAddressBook("gmail", callback);
			this.wait();
		},
		
		testImportAddressBookFile: function()
		{
			var that = this;
			var abImport = new YAHOO.Convio.PC2.AddressBookImport.ContactRetrieveService();
			var callback =
			{
				success: function(jobId)
				{
					that.resume(function()
					{
						this.assertEqual(abImport.JOB_ID, jobId);
					});
				},
				failure: function(errMsg)
				{
					that.resume(function()
					{
						that.fail("importAddressBookFile failed but was supposed to succeed");
					});
				},
				scope: this
			};
			abImport.importAddressBookFile("", callback);
			this.wait();
		},
		
		testGetJobStatusFailure: function()
		{
			var that = this;
			var abImport = new YAHOO.Convio.PC2.AddressBookImport.ContactRetrieveService();
			var callback =
			{
				success: function(jobStatus)
				{
					that.resume(function()
					{
						that.fail("getJobStatus succeeded but was supposed to fail");
					});
				},
				failure: function(errMsg)
				{
					that.resume(function()
					{
						this.assertWellDefined(errMsg);
					});
				},
				scope: this
			};
			abImport.getJobStatus(abImport.FAILED_SERVICE_JOB_ID, callback);
			this.wait();
		},
		
		// Test when the actual job fails, not the method call
		testGetJobStatusFailure2ThisTimeItsSerious: function()
		{
			var that = this;
			var abImport = new YAHOO.Convio.PC2.AddressBookImport.ContactRetrieveService();
			var callback =
			{
				success: function(jobStatus)
				{
					that.resume(function()
					{
						this.assertWellDefined(jobStatus);
						this.assertEqual(jobStatus.FAILURE, jobStatus.getStatus());
					});
				},
				failure: function(errMsg)
				{
					that.resume(function()
					{
						that.fail("getJobStatus failed but was supposed to succeed");
					});
				},
				scope: this
			};
			abImport.getJobStatus(abImport.FAILED_JOB_ID, callback);
			this.wait();
		},
		
		testGetJobStatusPending: function()
		{
			var that = this;
			var abImport = new YAHOO.Convio.PC2.AddressBookImport.ContactRetrieveService();
			var callback =
			{
				success: function(jobStatus)
				{
					that.resume(function()
					{
						this.assertWellDefined(jobStatus);
						this.assertEqual(jobStatus.PENDING, jobStatus.getStatus());
					});
				},
				failure: function(errMsg)
				{
					that.resume(function()
					{
						that.fail("getJobStatus failed but was supposed to succeed");
					});
				},
				scope: this
			};
			abImport.getJobStatus(abImport.JOB_ID, callback);
			this.wait();
		},
		
		testGetJobStatusSuccess: function()
		{
			var that = this;
			var abImport = new YAHOO.Convio.PC2.AddressBookImport.ContactRetrieveService();
			var pendingCallback =
			{
				success: function(jobStatus)
				{
				},
				failure: function(errMsg)
				{
				},
				scope: this
			};
			var successCallback =
			{
				success: function(jobStatus)
				{
					that.resume(function()
					{
						this.assertWellDefined(jobStatus);
						this.assertEqual(jobStatus.SUCCESS, jobStatus.getStatus());
					});
				},
				failure: function(errMsg)
				{
					that.resume(function()
					{
						that.fail("getJobStatus failed but was supposed to succeed");
					});
				},
				scope: this
			};
			for (var i = 1; i <= abImport.TEST_SUCCESS_CALLS; i++)
			{
				if (i < abImport.TEST_SUCCESS_CALLS)
				{
					abImport.getJobStatus(abImport.JOB_ID, pendingCallback);
				}
				else
				{
					abImport.getJobStatus(abImport.JOB_ID, successCallback);
					this.wait();
				}
			}
		},
		
		testGetAddressBookFailedJob: function()
		{
			var that = this;
			var abImport = new YAHOO.Convio.PC2.AddressBookImport.ContactRetrieveService();
			var callback =
			{
				success: function(addressBook)
				{
					that.resume(function()
					{
						that.fail("getAddressBook should haved failed but it succeeded");
					});
				},
				failure: function(errMsg)
				{
					that.resume(function()
					{
						this.assertTrue(true);
					});
				},
				scope: this
			};
			abImport.getAddressBook(abImport.FAILED_JOB_ID, callback);
			this.wait();
		},
		
		testGetAddressBookPendingJob: function()
		{
			var that = this;
			var abImport = new YAHOO.Convio.PC2.AddressBookImport.ContactRetrieveService();
			var callback =
			{
				success: function(addressBook)
				{
					that.resume(function()
					{
						that.fail("getAddressBook should have failed but it succeeded");
					});
				},
				failure: function(errMsg)
				{
					that.resume(function()
					{
						this.assertTrue(true);
					});
				},
				scope: this
			};
			abImport.getAddressBook(abImport.PENDING_JOB_ID, callback);
			this.wait();
		},
		
		testGetAddressBookSuccessJob: function()
		{
			var that = this;
			var abImport = new YAHOO.Convio.PC2.AddressBookImport.ContactRetrieveService();
			var fakeTestContacts = abImport.getFakeTestContacts();
			var callback =
			{
				success: function(addressBook)
				{
					that.resume(function()
					{
						var contactsArray = addressBook.getContacts();
						this.assertEqual(fakeTestContacts.length, contactsArray.length);
						for (var i in contactsArray)
						{
							var contact = contactsArray[i];
							this.assertEqual(fakeTestContacts[i].firstName, contact.getFirstName());
							this.assertEqual(fakeTestContacts[i].lastName, contact.getLastName());
							this.assertEqual(fakeTestContacts[i].email, contact.getEmail());
						}
					});
				},
				failure: function(errMsg)
				{
					that.resume(function()
					{
						that.fail("getAddressBook should have succeeded but it failed");
					});
				},
				scope: this
			};
			abImport.getAddressBook(abImport.JOB_ID, callback);
			this.wait();
		}
		
	});

	// add test case to test runner
	Y.Test.Runner.add(Y.Convio.PC2.Test.pc2_address_book_import_dummy_rest);
},
"1.0",
{ requires: ['test', 'test-assertions', 'address-book-import-retrieve-service-dummy'] }
);