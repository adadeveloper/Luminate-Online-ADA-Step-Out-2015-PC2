/* address_book_import_convio_retrieve_rest.js
 * Copyright 2010, Convio
 *
 * Provides Convio Address Book Import REST call functionality.
 * 
 * The functionality in this file is for Convio's address book import provider. 
 * 
 * Depends on:
 * address_book_import_domain.js
 * 
 * See also YAHOO.Convio.PC2.AddressBookImport.ContactImportService
 */
YAHOO.Convio.PC2.AddressBookImport.ContactRetrieveService = function(){};
YAHOO.Convio.PC2.AddressBookImport.ContactRetrieveService.prototype = 
{
	JOB_ID: 1,
		
	// callback parameters are OAuth url and job id
	importOnlineAddressBook: function(provider, callback)
	{
		var href = window.location.href;
		var path = href.substring(0, href.lastIndexOf('/') + 1);
		var callbackUrl = path + 'address_book_import_oauth_callback_handler.html';
		
        var params = "method=startOnlineAddressBookImport&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += '&import_source=' + encodeURIComponent(provider);
        params += '&callback_url=' + encodeURIComponent(callbackUrl);
        
        var url = YAHOO.Convio.PC2.Config.AddressBook.getUrl();
        
        YAHOO.log('Preparing XHR, url=' + url + ', params=' + params, 'info', 'address_book_import_convio_retrieve_rest.js');
        YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, 
        {
			success: function(o)
			{
	            var response = YAHOO.lang.JSON.parse(o.responseText).startOnlineAddressBookImportResponse;
	            var oauthUrl = response.oauthUrl;
	            var jobId = response.jobId;
	            
	            // Log sucess
	            YAHOO.log('importOnlineAddressBook success', 'info', 'address_book_import_convio_retrieve_rest.js');
	            
	            // Call the original callback
	            callback.success(oauthUrl, jobId);
			},
			failure: function(errMsg)
			{
				callback.failure(errMsg);
			},
			scope: callback.scope
        },			
   		params);
	},
	
	// callback parameter is job id
	importAddressBookFile: function(csvContent, callback)
	{
		callback.success.call(callback.scope, this.JOB_ID);
	},
		
	// callback parameter is jobStatus object
	getJobStatus: function(jobId, callback)
	{
        var params = "method=getAddressBookImportJobStatus&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += '&import_job_id=' + encodeURIComponent(jobId);
        
        var url = YAHOO.Convio.PC2.Config.AddressBook.getUrl();
        
        YAHOO.log('Preparing XHR, url=' + url + ', params=' + params, 'info', 'address_book_import_convio_retrieve_rest.js');
        YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, 
        {
			success: function(o)
			{
	            var response = YAHOO.lang.JSON.parse(o.responseText).getAddressBookImportJobStatusResponse;
	            var jobStatus = new YAHOO.Convio.PC2.AddressBookImport.Domain.JobStatus();
	            jobStatus.setStatus(response.jobStatus);
	            var events = YAHOO.Convio.PC2.Utils.ensureArray(response.events.event);
	            for (var i in events)
	            {
	            	jobStatus.addEvent(new YAHOO.Convio.PC2.AddressBookImport.Domain.Event(events[i]));
	            }
	            
	            // Log sucess
	            YAHOO.log('getJobStatus success', 'info', 'address_book_import_convio_retrieve_rest.js');
	            
	            // Call the original callback
	            callback.success(jobStatus);
			},
			failure: function(errMsg)
			{
				callback.failure(errMsg);
			},
			scope: callback.scope
        },			
   		params);
	},
	
	// callback parameter is contacts object
	getAddressBook: function(jobId, callback)
	{
        var params = "method=getAddressBookImportContacts&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();	
        params += '&import_job_id=' + encodeURIComponent(jobId);
        
        var url = YAHOO.Convio.PC2.Config.AddressBook.getUrl();
        
        YAHOO.log('Preparing XHR, url=' + url + ', params=' + params, 'info', 'address_book_import_convio_retrieve_rest.js');
        YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, 
        {
			success: function(o)
			{
	            var response = YAHOO.lang.JSON.parse(o.responseText).getAddressBookImportContactsResponse;
	            var addressBook = new YAHOO.Convio.PC2.AddressBookImport.Domain.AddressBook();
	            var contacts = response.contact;
	            for (var i in contacts)
	            {	
	            	var contact = contacts[i];
	            	addressBook.addContact(new YAHOO.Convio.PC2.AddressBookImport.Domain.Contact(contact.firstName, contact.lastName, contact.email));
	            }
	            
	            // Log sucess
	            YAHOO.log('getAddressBook success', 'info', 'address_book_import_convio_retrieve_rest.js');
	            
	            // Call the original callback
	            callback.success(addressBook);
			},
			failure: function(errMsg)
			{
				callback.failure(errMsg);
			},
			scope: callback.scope
        },			
   		params);
	}
	
};