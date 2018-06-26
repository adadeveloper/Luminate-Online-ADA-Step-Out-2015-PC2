/* address_book_import_dummy_retrieve_rest.js
 * Copyright 2010, Convio
 *
 * Provides Convio Address Book Import REST call functionality.
 * 
 * The functionality in this file is for a dummy address book import provider. It should only be used for testing purposes. 
 * 
 * Depends on:
 * address_book_import_job_status.js
 * 
 * See also YAHOO.Convio.PC2.AddressBookImport.ContactImportService
 */
YAHOO.Convio.PC2.AddressBookImport.ContactRetrieveService = function(){};
YAHOO.Convio.PC2.AddressBookImport.ContactRetrieveService.prototype = 
{
	OAUTH_URL: "http://oauth.net/",
	JOB_ID: 1,
	FAILED_JOB_ID: 0,
	PENDING_JOB_ID: 2,
	FAILED_SERVICE_JOB_ID: -1,
	TEST_SUCCESS_CALLS: 6,
		
	jobStatusCallCount: 0,
	
	fakeTestContacts: null,
	
	NUM_ERROR_CONTACTS_IN_EACH_CATEGORY: 15,
	NUM_TOTAL_CONTACTS: 500 + (3 * 15),
	
	fakeContactFirstNames: ["Bob", "Sally", "Stephen", "Raul", "Jolyon", "Destini", "Joseph", "Evangeline", "Carlton", "William", "Emilia", "Casey", "Dave", "Carlos", "Percy", "Eliza", "Harper", "Meghan", "Aubry", "Madeline", "April", "Natalie", "Joel"],
	
	fakeContactLastNames: ["Hanson", "Graves", "King", "Ortiz", "Thomas", "Radcliff", "Fieldman", "Karbashewsky-Smith", "Williams", "Johnston", "Dempsey", "Daugherty", "Fish", "Olmstead", "Chin", "D'Avila"],
	
	getFakeTestContacts: function()
	{
		if (this.fakeTestContacts === null) {
			this.fakeTestContacts = new Array();
			for (var i = 1; i <= this.NUM_TOTAL_CONTACTS; i++)
			{
				var fakeContactFirstName = this.fakeContactFirstNames[Math.floor(Math.random() * this.fakeContactFirstNames.length)];
				var fakeContactLastName = this.fakeContactLastNames[Math.floor(Math.random() * this.fakeContactLastNames.length)];
				this.fakeTestContacts.push(
					new YAHOO.Convio.PC2.AddressBookImport.Domain.Contact(fakeContactFirstName, fakeContactLastName, fakeContactFirstName + "." + fakeContactLastName + '@convio.com')
				);
			}
		}
		
		return this.fakeTestContacts;
	},
		
	// callback parameters are OAuth url and job id
	importOnlineAddressBook: function(provider, callback)
	{
		callback.success.call(callback.scope, this.OAUTH_URL, this.JOB_ID);
	},
	
	// callback parameter is job id
	importAddressBookFile: function(csvContent, callback)
	{
		callback.success.call(callback.scope, this.JOB_ID);
	},
		
	// callback parameter is jobStatus object
	getJobStatus: function(jobId, callback)
	{
		
		var fakeEventMsgs = [
		     '', /* dummy value to allow 1-based indexing */
		     'Waiting for your consent to download contacts from your email program.',
		     'Received your consent; downloading contacts now ...',
		     '35% complete.',
		     '82% complete.',
		     'Successfully downloaded ' + this.NUM_TOTAL_CONTACTS + ' contacts from your email program.'
		];
		
		// For testing purposes, simulate service failure
		if (jobId == this.FAILED_SERVICE_JOB_ID)
		{
			callback.failure.call(callback.scope, "Request to fetch current job status failed.  Current job status unknown.");
			return;
		}
		
		var js = new YAHOO.Convio.PC2.AddressBookImport.Domain.JobStatus();
		
		// For testing purposes, if the jobId is 0 pretend we failed
		if (jobId == this.FAILED_JOB_ID)
		{
			// simulate the scenario where rest call to fetch status was successful, but underlying import job failed.
			js.setStatus(js.FAILURE);
			callback.success.call(callback.scope, js);
			return;
		}
		
		// For testing purposes, if getJobStatus has only been called twice
		// pretend the job is pending
		this.jobStatusCallCount++;
		if (this.jobStatusCallCount < this.TEST_SUCCESS_CALLS)
		{
			if (fakeEventMsgs[this.jobStatusCallCount]) {
				js.addEvent(new YAHOO.Convio.PC2.AddressBookImport.Domain.Event(fakeEventMsgs[this.jobStatusCallCount]));
			}
			callback.success.call(callback.scope, js);
			return;
		}
		
		// For testing purposes, if getJobStatus has been called twice
		// pretend the job has completed successfully
		this.jobStatusCallCount = 0;
		js.setStatus(js.SUCCESS);
		callback.success.call(callback.scope, js);
	},
	
	// callback parameter is contacts object
	getAddressBook: function(jobId, callback)
	{
		// For testing purposes, if the jobId is 0 pretend we failed because the import failed
		if (jobId == this.FAILED_JOB_ID)
		{
			callback.failure.call(callback.scope, "Unexpected failure to get contacts from service.");
			return;
		}
		
		// For testing purposes, if the jobId is 2 pretend we failed because the import is pending
		if (jobId == this.PENDING_JOB_ID)
		{
			callback.failure.call(callback.scope, "Expected failure to get contacts from service.");
			return;
		}
		
		var fakeTestContacts = this.getFakeTestContacts();
		var addressBook = new YAHOO.Convio.PC2.AddressBookImport.Domain.AddressBook();
		// simulate a _large_ address book to assist UI definition
		for (var i = 0; i < fakeTestContacts.length; i++)
		{
			addressBook.addContact(this.fakeTestContacts[i]);
		}
		callback.success.call(callback.scope, addressBook);
	}
	
};