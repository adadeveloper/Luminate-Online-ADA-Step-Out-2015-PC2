/* address_book_import_functions.js
 * Copyright 2010, Convio
 *
 * Provides DOM and event handler functions for address book import views. 
 * 
 * Dependencies declared in modules.js.
 *
 */
YAHOO.Convio.PC2.Component.AddressBookImport = {

	retrievalServiceInstance: new YAHOO.Convio.PC2.AddressBookImport.ContactRetrieveService(),
	
	importServiceInstance: new YAHOO.Convio.PC2.AddressBookImport.ContactImportService(),
		
	context: null,
	
	COLUMN_WIDTHS: {
		firstName_Narrow: 100,
		firstName_Wide: 155,
		lastName_Narrow: 100,
		lastName_Wide: 155,
		email_Narrow: 140,
		email_Wide: 190,
		errorMsg: 180,
		nameAndEmail_Narrow: 190,
		nameAndEmail_Wide: 240,
		action: 40,
		check: 20
	},
	
	cancelImportEventHandler: function()
	{
		// stop any currently running worker "thread" ... we're done waiting on status change
		clearInterval(YAHOO.Convio.PC2.Component.AddressBookImport.importEventsAndStatusThreadId);
		
		// return to wherever you were
    var subview = YAHOO.Convio.PC2.Views.importReferer || 'contacts';
		YAHOO.Convio.PC2.Utils.loadView('email',subview);
		
		return false;
	},
	
	hideSelectSourceErrors: function() {
		// hide any error messages for the subview that might need to be revealed later
    	YAHOO.util.Dom.addClass("msg_cat_addressbookimport_selectsource_none_selected_failure", "hidden-form");
    	YAHOO.util.Dom.addClass("msg_cat_addressbookimport_selectsource_csv_parse_failure", "hidden-form");
    	YAHOO.util.Dom.addClass("msg_cat_addressbookimport_selectsource_unexpected_failure", "hidden-form");
	},
	
	enableNextButtonAndThen: function(subviewName, callbackFunction) {
		
		if (!callbackFunction) {
			callbackFunction = jQuery.noop;
		}
		
		// replace the throbber image with the enabled next button
		jQuery('#addressbookimport-' + subviewName + '-next-throbber').fadeOut(0.25 * 1000, function() {
			jQuery('#addressbookimport-' + subviewName + '-next').removeAttr('disabled').show(0 * 1000, function() {
				
				// invoke the callback function
				callbackFunction.call(this);
			});
		});
			
	},
	
	disableNextButtonAndThen: function(subviewName, callbackFunction) {
		
		// disable the next button and replace with a throbber image
		jQuery('#addressbookimport-' + subviewName + '-next').attr('disabled', 'disabled').fadeOut(0.25 * 1000, function() {
			jQuery('#addressbookimport-' + subviewName + '-next-throbber').show(0 * 1000, function() {
				
				// invoke the callback function
				callbackFunction.call(this);
			});
		});
	},
	
	selectSourceNextEventHandler: function() {
		
		YAHOO.Convio.PC2.Component.AddressBookImport.disableNextButtonAndThen('selectsource', function() {
			
			// instantiate a new import context object 
			YAHOO.Convio.PC2.Component.AddressBookImport.context = new YAHOO.Convio.PC2.Component.AddressBookImport.Context();
			
			var context = YAHOO.Convio.PC2.Component.AddressBookImport.context;
			var retrievalServiceInstance = YAHOO.Convio.PC2.Component.AddressBookImport.retrievalServiceInstance;
			var importServiceInstance = YAHOO.Convio.PC2.Component.AddressBookImport.importServiceInstance;
			
			// if using the test service, clear out any previous fake test contacts
			if (retrievalServiceInstance.fakeTestContacts) {
				retrievalServiceInstance.fakeTestContacts = null;
			}
			
			// hide any error messages that were revealed by previous interactions
			YAHOO.Convio.PC2.Component.AddressBookImport.hideSelectSourceErrors();
			
			// get the user's selection for address book import source
			var source = jQuery('#addressbookimport-selectsource-options input:radio:checked').val();
			
			if (YAHOO.lang.isUndefined(source) || source === '' || source === null) {
				
				YAHOO.Convio.PC2.Component.AddressBookImport.enableNextButtonAndThen('selectsource', function() {
					// user did not pick an address book source
					YAHOO.util.Dom.removeClass("msg_cat_addressbookimport_selectsource_none_selected_failure", "hidden-form");
					YAHOO.Convio.PC2.Component.Teamraiser.showAddressImportWizardSelectSource();
				});
			}
			else {
				
				// capture the user's source selection
				context.setSource(source);
				
				// csv or web?
				if (source === 'csv') {
					
					// Start CSV-based import ...
					
					// try to parse the user's CSV file to derive a probable column mapping
					var formName = 'addressbookimport_csv_form';
					importServiceInstance.parseCsvContactsFile(formName, null /* let ReST method select the most likely encoding*/, {
						
						success: function(csvParseResult)
						{
							// capture csv parse details
							var context = YAHOO.Convio.PC2.Component.AddressBookImport.context;
							context.setCsvParseResult(csvParseResult);
							
							YAHOO.log('Successfully parsed a csv file.', 'info', 'address_book_import_functions.js');
							
							// advance to next step of the import process
							YAHOO.Convio.PC2.Utils.loadView('addressbookimport','csvmapping');
							
							// re-enable the next button on the subview that we just left
							YAHOO.Convio.PC2.Component.AddressBookImport.enableNextButtonAndThen('selectsource');
						},
						failure: function(errMsg)
						{
							YAHOO.log('Request to parse CSV file FAILED: ' + errMsg, 'error', 'address_book_import_functions.js');
							
							YAHOO.Convio.PC2.Component.AddressBookImport.enableNextButtonAndThen('selectsource', function() {
								// unexpected error
								YAHOO.util.Dom.removeClass("msg_cat_addressbookimport_selectsource_csv_parse_failure", "hidden-form");
								YAHOO.Convio.PC2.Component.Teamraiser.showAddressImportWizardSelectSource();
							});
						},
						scope: this
						
					});
					
				}
				else {
				
					// Start Web-based import ...	
					
					// initiate import job with third-party service
					retrievalServiceInstance.importOnlineAddressBook(source, {
						
						success: function(oAuthUrl, jobId)
						{
							// capture import job details
							context.setOAuthUrl(oAuthUrl);
							context.setJobId(jobId);
							
							YAHOO.log('Successfully initiated a new address book import job.', 'info', 'address_book_import_functions.js');
							
							// advance to next step of the import process
							YAHOO.Convio.PC2.Utils.loadView('addressbookimport','thirdpartystatus');
							
							// re-enable the next button on the subview that we just left
							YAHOO.Convio.PC2.Component.AddressBookImport.enableNextButtonAndThen('selectsource');
						},
						failure: function(errMsg)
						{
							YAHOO.log('Request to initiate a new address book import job FAILED: ' + errMsg, 'error', 'address_book_import_functions.js');
							
							YAHOO.Convio.PC2.Component.AddressBookImport.enableNextButtonAndThen('selectsource', function() {
								// unexpected error
								YAHOO.util.Dom.removeClass("msg_cat_addressbookimport_selectsource_unexpected_failure", "hidden-form");
								YAHOO.Convio.PC2.Component.Teamraiser.showAddressImportWizardSelectSource();
							});
						},
						scope: this
						
					});
					
				}
				
			}
				
		});	
		
		return false;
	},
	
	displayOpenAuthWindow: function() {
		var width = 600;
	    var height = 400;
	    var left = parseInt((screen.availWidth/2) - (width/2));
	    var top = parseInt((screen.availHeight/2) - (height/2));
	    var windowFeatures = 'width=' + width + ', height=' + height + ',top=' + top + ', screenX=' + left + ', screenY=' + top +  ', toolbar=0, menubar-0, height=400, width=600';
		window.open(YAHOO.Convio.PC2.Component.AddressBookImport.context.getOAuthUrl(), '_blank', windowFeatures);
	},
	
	importEventsAndStatusThreadId: null,
	importEventsAndStatusThreadExecutionCount: 0,
	
	startImportEventsAndStatusThread: function() {
		
		// clear any previously started "thread"
		clearInterval(YAHOO.Convio.PC2.Component.AddressBookImport.importEventsAndStatusThreadId);
		
		// reset the execution counter
		YAHOO.Convio.PC2.Component.AddressBookImport.importEventsAndStatusThreadExecutionCount = 0;
		
		// start a new thread that polls the AddressBookImport service
		YAHOO.Convio.PC2.Component.AddressBookImport.importEventsAndStatusThreadId = setInterval(function() {  
			
			// check to see if the thread should be stopped after this execution
			// this is just a safety measure to catch any runaway thread
			if (YAHOO.Convio.PC2.Component.AddressBookImport.importEventsAndStatusThreadExecutionCount++ > 1000) {
				clearInterval(YAHOO.Convio.PC2.Component.AddressBookImport.importEventsAndStatusThreadId);
			}
			
			var context = YAHOO.Convio.PC2.Component.AddressBookImport.context;
			var retrievalServiceInstance = YAHOO.Convio.PC2.Component.AddressBookImport.retrievalServiceInstance;
			var importServiceInstance = YAHOO.Convio.PC2.Component.AddressBookImport.importServiceInstance;
			
			// get the current job status (asynchronously) and then process
			retrievalServiceInstance.getJobStatus(context.getJobId(), {
				
				success: function(jobStatus)
				{
					// process any events and insert into DOM
					var eventsLength = jobStatus.getEvents().length;
					for (var i = 0; i < eventsLength; i++) {
						var event = jobStatus.getEvents()[i];
						jQuery('#addressbookimport-thirdpartystatus-events').append('<div>' + event.getEventDescription() + '</div>');
					}
				
					// take appropriate action for job status
					if (jobStatus.isStatusPending()) {
						YAHOO.log('Waiting for third-party address book import service.', 'info', 'address_book_import_functions.js');
					}
					else if (jobStatus.isStatusSuccess()) {
						
						// stop the worker "thread" ... we're done waiting on status change
						clearInterval(YAHOO.Convio.PC2.Component.AddressBookImport.importEventsAndStatusThreadId);
						
						// manipulate DOM, allowing user to advance to next step
						jQuery("#addressbookimport-thirdpartystatus-throbber").fadeOut(1.0 * 1000, function() {
							jQuery('#addressbookimport-thirdpartystatus-next').removeAttr('disabled');
						});
					}
					else if (jobStatus.isStatusFailure()) {
						
						// stop the worker "thread" ... we're done waiting on status change
						clearInterval(YAHOO.Convio.PC2.Component.AddressBookImport.importEventsAndStatusThreadId);
						
						YAHOO.log('Third-party address book import service failed.', 'info', 'address_book_import_functions.js');
						
						YAHOO.Convio.PC2.Component.AddressBookImport.enableNextButtonAndThen('thirdpartystatus', function() {
							// service failure
							YAHOO.util.Dom.removeClass("msg_cat_addressbookimport_thirdpartystatus_service_failure", "hidden-form");
							YAHOO.Convio.PC2.Component.Teamraiser.showAddressImportWizardRetrieveContacts();
						});
						
					}
					else {
						throw "Unexpected job status: " + jobStatus.getStatus();
					}
				},
				failure: function(errMsg)
				{
					YAHOO.log('Request to fetch the latest job status FAILED: ' + errMsg, 'error', 'address_book_import_functions.js');
					
					YAHOO.Convio.PC2.Component.AddressBookImport.enableNextButtonAndThen('thirdpartystatus', function() {
						// unexpected error
						YAHOO.util.Dom.removeClass("msg_cat_addressbookimport_thirdpartystatus_unexpected_jobstatus_failure", "hidden-form");
						YAHOO.Convio.PC2.Component.Teamraiser.showAddressImportWizardRetrieveContacts();
					});
				},
				scope: this
				
			});
			
			
		}, 1 * 1000);
		
	},
	
	hideCsvMappingErrors: function() {
		// hide any error messages for the subview that might need to be revealed later
		YAHOO.util.Dom.addClass("msg_cat_addressbookimport_csvmapping_unexpected_failure", "hidden-form");
	},
	
	csvMappingChangeCsvParseHandler: function() {
		
		// reveal the combo boxes
		jQuery('#addressbookimport-csvmapping-preview-list .addressbookimport_csv_column_selector').slideDown(0.25 * 1000, function() {
			// then, display the file encoding selector
			jQuery('#addressbookimport-csvmapping-preview-select-encoding-block').fadeIn(0.25 * 1000);
		});
		
	},
	
	csvMappingChangeEncodingHandler: function() {
		
		YAHOO.Convio.PC2.Component.AddressBookImport.hideCsvMappingErrors();
		
		// get the user-selected file encoding
		var userSelectedFileEncoding = jQuery('#addressbookimport-csvmapping-encoding-selector').val();
		
		// re-parse the csv file
		var importServiceInstance = YAHOO.Convio.PC2.Component.AddressBookImport.importServiceInstance;
		var formName = 'addressbookimport_csv_form';
		importServiceInstance.parseCsvContactsFile(formName, userSelectedFileEncoding, {
			
			success: function(csvParseResult)
			{
				// capture csv parse details
				var context = YAHOO.Convio.PC2.Component.AddressBookImport.context;
				context.setCsvParseResult(csvParseResult);
				
				YAHOO.log('Successfully parsed a csv file.', 'info', 'address_book_import_functions.js');
				
				YAHOO.Convio.PC2.Component.AddressBookImport.reBuildCsvMappingPreviewList();
			},
			failure: function(errMsg)
			{
				YAHOO.log('Request to parse CSV file FAILED: ' + errMsg, 'error', 'address_book_import_functions.js');
				
				// hide the previously built table (for previous encoding)
				jQuery('#addressbookimport-csvmapping-preview-list').fadeOut(0.25 * 1000, function() {
					
					// clear out num omitted
					jQuery('#addressbookimport_csvmapping_preview_num_omitted').html(0);
					
					// display error message
					YAHOO.util.Dom.removeClass("msg_cat_addressbookimport_csvmapping_unexpected_failure", "hidden-form");
					YAHOO.Convio.PC2.Component.Teamraiser.showAddressImportWizardRetrieveContacts();
				});
			},
			scope: this
			
		});
		
	},
	
	csvMappingNextEventHandler: function() {
		
		YAHOO.Convio.PC2.Component.AddressBookImport.disableNextButtonAndThen('csvmapping', function() {
		
			var context = YAHOO.Convio.PC2.Component.AddressBookImport.context;
			
			// apply csv mapping to generate an AddressBookObject
			context.setAddressBook(context.getCsvParseResult().toAddressBook());
			
			// need to confirm duplicate column mapping?
			var needToConfirmDuplicateMapping = !context.getCsvParseResult().getCsvMapping().isUniqueMapping();
			if (needToConfirmDuplicateMapping) {
				if (confirm(YAHOO.Convio.PC2.Component.Content.getMsgCatValue('addressbookimport_csvmapping_confirm_duplicate_column_mapping'))) {
					
					// advance to next view
					YAHOO.Convio.PC2.Utils.loadView('addressbookimport','selectcontacts');
					
					// re-enable the next button on the subview that we just left
					YAHOO.Convio.PC2.Component.AddressBookImport.enableNextButtonAndThen('csvmapping');
					
				}
				else {
					
					// re-enable the next button ... the user declined to proceed with duplicate column mapping
					YAHOO.Convio.PC2.Component.AddressBookImport.enableNextButtonAndThen('csvmapping');
					
				}
			}
			else {
				
				// advance to next view
				YAHOO.Convio.PC2.Utils.loadView('addressbookimport','selectcontacts');
				
				// re-enable the next button on the subview that we just left
				YAHOO.Convio.PC2.Component.AddressBookImport.enableNextButtonAndThen('csvmapping');
				
			}
				
		});
		 
		return false;
	},
	
	buildCsvMappingPreviewList: function() {
		
		var container = 'addressbookimport-csvmapping-preview-list';
		var context = YAHOO.Convio.PC2.Component.AddressBookImport.context;
		
		// clear out any previously rendered list
		jQuery('#' + container).html('');
		
		// start a name space for the data table
		YAHOO.namespace("Convio.PC2.Component.AddressBookImport.CsvMappingPreviewList");
		
		YAHOO.Convio.PC2.Component.AddressBookImport.CsvMappingPreviewList.numToPreview = 10;
			
		// generate an address book object from the current CSV mapping
		var addrBook = context.getCsvParseResult().toAddressBook();
		
		// we only want to show a _preview_ of the first n contacts
		var numToPreview = YAHOO.Convio.PC2.Component.AddressBookImport.CsvMappingPreviewList.numToPreview;
		var previewContacts = addrBook.getContacts().slice(0, Math.min((addrBook.getContacts().length), numToPreview));
		
		// wrap the address book as a YUI data source
		YAHOO.Convio.PC2.Component.AddressBookImport.CsvMappingPreviewList.dataSource = new YAHOO.util.LocalDataSource(previewContacts);
		YAHOO.Convio.PC2.Component.AddressBookImport.CsvMappingPreviewList.dataSource.responseType = YAHOO.util.XHRDataSource.TYPE_JSARRAY;

		// define data table columns to be displayed
		YAHOO.Convio.PC2.Component.AddressBookImport.CsvMappingPreviewList.columnDefs = [
            //key names here come from YAHOO.Convio.PC2.AddressBookImport.Contact fields
            { 
            	key: "firstName", 
            	label: YAHOO.Convio.PC2.Component.AddressBookImport.buildProposedFirstNameColumnLabel(), 
            	sortable: false,
            	formatter: 'text', className: 'breakWord',
            	width: YAHOO.Convio.PC2.Component.AddressBookImport.COLUMN_WIDTHS.firstName_Wide
            },
            { 
            	key: "lastName", 
            	label: YAHOO.Convio.PC2.Component.AddressBookImport.buildProposedLastNameColumnLabel(), 
            	sortable: false,
            	formatter: 'text', className: 'breakWord',
            	width: YAHOO.Convio.PC2.Component.AddressBookImport.COLUMN_WIDTHS.lastName_Wide
            },
            { 
            	key: "email", 
            	label: YAHOO.Convio.PC2.Component.AddressBookImport.buildProposedEmailColumnLabel(),
            	sortable: false,
            	formatter: 'text', className: 'breakWord',
            	width: YAHOO.Convio.PC2.Component.AddressBookImport.COLUMN_WIDTHS.email_Wide
            }
        ];
		
		// define collaborators for new data table
		YAHOO.Convio.PC2.Component.AddressBookImport.CsvMappingPreviewList.dataTable = YAHOO.Convio.PC2.Component.DataTableBuilder.buildDataTable(
				container,
				YAHOO.Convio.PC2.Component.AddressBookImport.CsvMappingPreviewList.columnDefs, 
                YAHOO.Convio.PC2.Component.AddressBookImport.CsvMappingPreviewList.dataSource,
                {},
                YAHOO.Convio.PC2.Component.Content,
                false
        );
		
		// finally, render the data table
		YAHOO.Convio.PC2.Component.AddressBookImport.CsvMappingPreviewList.dataTable.render();
		
		// wire change handlers into the column index select combo boxes
		jQuery('#addressbookimport_csv_first_name_index_selector').change(function() {
			var context = YAHOO.Convio.PC2.Component.AddressBookImport.context;
			var csvMapping = context.getCsvParseResult().getCsvMapping();
			
			// update the column mapping index
			var newlySelectedIndex = jQuery('#addressbookimport_csv_first_name_index_selector').val();
			csvMapping.setFirstNameColumnIndex(newlySelectedIndex);
			
			// rebuild the table
			YAHOO.Convio.PC2.Component.AddressBookImport.reBuildCsvMappingPreviewList();
		});
		jQuery('#addressbookimport_csv_last_name_index_selector').change(function() {
			var context = YAHOO.Convio.PC2.Component.AddressBookImport.context;
			var csvMapping = context.getCsvParseResult().getCsvMapping();
			
			// update the column mapping index
			var newlySelectedIndex = jQuery('#addressbookimport_csv_last_name_index_selector').val();
			csvMapping.setLastNameColumnIndex(newlySelectedIndex);
			
			// rebuild the table
			YAHOO.Convio.PC2.Component.AddressBookImport.reBuildCsvMappingPreviewList();
		});
		jQuery('#addressbookimport_csv_email_index_selector').change(function() {
			var context = YAHOO.Convio.PC2.Component.AddressBookImport.context;
			var csvMapping = context.getCsvParseResult().getCsvMapping();
			
			// update the column mapping index
			var newlySelectedIndex = jQuery('#addressbookimport_csv_email_index_selector').val();
			csvMapping.setEmailColumnIndex(newlySelectedIndex);
			
			// rebuild the table
			YAHOO.Convio.PC2.Component.AddressBookImport.reBuildCsvMappingPreviewList();
		});
		
	},
	
	reBuildCsvMappingPreviewList: function() {
		// fade out the current table
		jQuery('#addressbookimport-csvmapping-preview-list').fadeOut(0.25 * 1000, function() {
			
			// rebuild the table
			YAHOO.Convio.PC2.Component.AddressBookImport.buildCsvMappingPreviewList();
			
			// show column index combo boxes in re-built table
			jQuery('#addressbookimport-csvmapping-preview-list .addressbookimport_csv_column_selector').show(0 * 1000);
			
			// fade the new table back in
			jQuery('#addressbookimport-csvmapping-preview-list').fadeIn(0.25 * 1000);
			
		});
	},
	
	buildProposedFirstNameColumnLabel: function() {
		
		var MsgCatProvider = YAHOO.Convio.PC2.Component.Content;
		var context = YAHOO.Convio.PC2.Component.AddressBookImport.context;
		var csvParseResult = context.getCsvParseResult();
		var csvColumnHeaderLabels = csvParseResult.getOrderedColumnHeaderLabels();
		
		var label = '';
		
		label += '<span class="bold-item">' + MsgCatProvider.getMsgCatValue('addressbookimport_column_proposed_first_name') + '</span>';
		
		label += '<br/>';
		
		label += '<select id="addressbookimport_csv_first_name_index_selector" class="addressbookimport_csv_column_selector">';
		for (var i = 0; i < csvColumnHeaderLabels.length; i++) {
			var csvColumnHeaderLabel = csvColumnHeaderLabels[i];
			var isSelected = (i === csvParseResult.getCsvMapping().getFirstNameColumnIndex());
			label += '<option value="' + i + '"' + (isSelected ? ' selected' : '') +  '>' + '(' + (i+1) + ') ' + YAHOO.Convio.PC2.Utils.truncateText(csvColumnHeaderLabel, 17) + '</option>'
		}
		label += '</select>';
		
		return label;
	},
	
	buildProposedLastNameColumnLabel: function() {
		
		var MsgCatProvider = YAHOO.Convio.PC2.Component.Content;
		var context = YAHOO.Convio.PC2.Component.AddressBookImport.context;
		var csvParseResult = context.getCsvParseResult();
		var csvColumnHeaderLabels = csvParseResult.getOrderedColumnHeaderLabels();
		
		var label = '';
		
		label += '<span class="bold-item">' + MsgCatProvider.getMsgCatValue('addressbookimport_column_proposed_last_name') + '</span>';
		
		label += '<br/>';
		
		label += '<select id="addressbookimport_csv_last_name_index_selector" class="addressbookimport_csv_column_selector">';
		for (var i = 0; i < csvColumnHeaderLabels.length; i++) {
			var csvColumnHeaderLabel = csvColumnHeaderLabels[i];
			var isSelected = (i === csvParseResult.getCsvMapping().getLastNameColumnIndex())
			label += '<option value="' + i + '"' + (isSelected ? ' selected' : '') +  '>' + '(' + (i+1) + ') ' + YAHOO.Convio.PC2.Utils.truncateText(csvColumnHeaderLabel, 17) + '</option>'
		}
		label += '</select>';
		
		return label;
	},
	
	buildProposedEmailColumnLabel: function() {
		
		var MsgCatProvider = YAHOO.Convio.PC2.Component.Content;
		var context = YAHOO.Convio.PC2.Component.AddressBookImport.context;
		var csvParseResult = context.getCsvParseResult();
		var csvColumnHeaderLabels = csvParseResult.getOrderedColumnHeaderLabels();
		
		var label = '';
		
		label += '<span class="bold-item">' + MsgCatProvider.getMsgCatValue('addressbookimport_column_proposed_email') + '</span>';
		
		label += '<br/>';
		
		label += '<select id="addressbookimport_csv_email_index_selector" class="addressbookimport_csv_column_selector">';
		for (var i = 0; i < csvColumnHeaderLabels.length; i++) {
			var csvColumnHeaderLabel = csvColumnHeaderLabels[i];
			var isSelected = (i === csvParseResult.getCsvMapping().getEmailColumnIndex());
			label += '<option value="' + i + '"' + (isSelected ? ' selected' : '') +  '>' + '(' + (i+1) + ') ' + YAHOO.Convio.PC2.Utils.truncateText(csvColumnHeaderLabel, 17) + '</option>'
		}
		label += '</select>';
		
		return label;
	},
	
	hideThirdPartyStatusErrors: function() {
		// hide any error messages for the subview that might need to be revealed later
		YAHOO.util.Dom.addClass("msg_cat_addressbookimport_thirdpartystatus_service_failure", "hidden-form");
    	YAHOO.util.Dom.addClass("msg_cat_addressbookimport_thirdpartystatus_unexpected_jobstatus_failure", "hidden-form");
    	YAHOO.util.Dom.addClass("msg_cat_addressbookimport_thirdpartystatus_unexpected_fetch_failure", "hidden-form");
	},
	
	thirdPartyStatusNextEventHandler: function() {
		
		YAHOO.Convio.PC2.Component.AddressBookImport.disableNextButtonAndThen('thirdpartystatus', function() {
		
			var context = YAHOO.Convio.PC2.Component.AddressBookImport.context;
			var retrievalServiceInstance = YAHOO.Convio.PC2.Component.AddressBookImport.retrievalServiceInstance;
			var importServiceInstance = YAHOO.Convio.PC2.Component.AddressBookImport.importServiceInstance;
			
			retrievalServiceInstance.getAddressBook(context.getJobId(), {
				
				success: function(addressBook)
				{
					// capture the address book imported from third-party service to be used later
					context.setAddressBook(addressBook);
				
					// advance to next view
					YAHOO.Convio.PC2.Utils.loadView('addressbookimport','selectcontacts');
					
					// re-enable the next button on the subview that we just left
					YAHOO.Convio.PC2.Component.AddressBookImport.enableNextButtonAndThen('thirdpartystatus');
				},
				failure: function(errMsg)
				{
					YAHOO.log('Request to fetch contacts from third-party service FAILED: ' + errMsg, 'error', 'address_book_import_functions.js');
					
					YAHOO.Convio.PC2.Component.AddressBookImport.enableNextButtonAndThen('thirdpartystatus', function() {
						// unexpected error
						YAHOO.util.Dom.removeClass("msg_cat_addressbookimport_thirdpartystatus_unexpected_fetch_failure", "hidden-form");
						YAHOO.Convio.PC2.Component.Teamraiser.showAddressImportWizardRetrieveContacts();
					});
				},
				scope: this
			});
		
		});
		 
		return false;
	},
	
	buildImportCandidateContactsList: function() {
		
		var container = 'addressbookimport-importcandidatecontacts-list';
		var context = YAHOO.Convio.PC2.Component.AddressBookImport.context;
		
		// clear out any previously rendered list
		jQuery('#' + container).html('');
		
		// start a name space for the data table
		YAHOO.namespace("Convio.PC2.Component.AddressBookImport.ImportSelectList");
			
		// wrap the address book as a YUI data source
		YAHOO.Convio.PC2.Component.AddressBookImport.ImportSelectList.dataSource = new YAHOO.util.LocalDataSource(context.getAddressBook().getContacts());
		YAHOO.Convio.PC2.Component.AddressBookImport.ImportSelectList.dataSource.responseType = YAHOO.util.XHRDataSource.TYPE_JSARRAY;

		// define data table columns to be displayed
		var MsgCatProvider = YAHOO.Convio.PC2.Component.Content;
		YAHOO.Convio.PC2.Component.AddressBookImport.ImportSelectList.columnDefs = [
            //key names here come from YAHOO.Convio.PC2.AddressBookImport.Contact fields
            { 
            	key: "checked", label: " ", 
            	formatter:'checkbox', className: 'breakWord',
            	width: YAHOO.Convio.PC2.Component.AddressBookImport.COLUMN_WIDTHS.check
            },
            { 
            	key: "firstName", label: MsgCatProvider.getMsgCatValue('addressbookimport_column_first_name'), sortable: true,
            	formatter: 'text', className: 'breakWord',
            	width: YAHOO.Convio.PC2.Component.AddressBookImport.COLUMN_WIDTHS.firstName_Wide
            },
            { 
            	key: "lastName", label: MsgCatProvider.getMsgCatValue('addressbookimport_column_last_name'), sortable: true,
            	formatter: 'text', className: 'breakWord',
            	width: YAHOO.Convio.PC2.Component.AddressBookImport.COLUMN_WIDTHS.lastName_Wide
            },
            { 
            	key: "email", label: MsgCatProvider.getMsgCatValue('addressbookimport_column_email'), sortable: true,
            	formatter: 'text', className: 'breakWord',
            	width: YAHOO.Convio.PC2.Component.AddressBookImport.COLUMN_WIDTHS.email_Wide
            }
        ];
		
		// define collaborators for new data table
		YAHOO.Convio.PC2.Component.AddressBookImport.ImportSelectList.dataTable = YAHOO.Convio.PC2.Component.DataTableBuilder.buildDataTable(
				container,
				YAHOO.Convio.PC2.Component.AddressBookImport.ImportSelectList.columnDefs, 
                YAHOO.Convio.PC2.Component.AddressBookImport.ImportSelectList.dataSource,
                {
    				height: "16em"
                },
                YAHOO.Convio.PC2.Component.Content,
                true
        );
		
		// subscribe to checkbox click events generated by the table
		YAHOO.Convio.PC2.Component.AddressBookImport.ImportSelectList.dataTable.subscribe("checkboxClickEvent", function(oArgs){
			
            var elCheckbox = oArgs.target;
            var oRecord = YAHOO.Convio.PC2.Component.AddressBookImport.ImportSelectList.dataTable.getRecord(elCheckbox);
            YAHOO.Convio.PC2.Component.AddressBookImport.setContactAndDataTableRecordChecked(oRecord, elCheckbox.checked);
            
        });
		
		// finally, render the data table
		YAHOO.Convio.PC2.Component.AddressBookImport.ImportSelectList.dataTable.render();
		
	},
	
	setContactAndDataTableRecordChecked: function(oRecord, newCheckValue) {
		
		var context = YAHOO.Convio.PC2.Component.AddressBookImport.context;
		
		// get the contact related to the data table record
        var addressBookIndex = oRecord.getData("addressBookIndex");
        var contact = context.getAddressBook().getContacts()[addressBookIndex];
        
        // update the datatable's record
        oRecord.setData("checked", newCheckValue);
        
        // update the underlying array of imported contact records
        // the YUI DataTable does _not_ handle this for us :(
        contact.checked = newCheckValue;
	},
	
	selectAllImportCandidateContactsList: function() {
		var dataTable = YAHOO.Convio.PC2.Component.AddressBookImport.ImportSelectList.dataTable;
		var recordSet = dataTable.getRecordSet();
		var records = recordSet.getRecords();
		for (var i = 0; i < records.length; i++) {
			var record = records[i];
			YAHOO.Convio.PC2.Component.AddressBookImport.setContactAndDataTableRecordChecked(record, true);
		}
		dataTable.refreshView();
		return false;
	},
	
	selectNoneImportCandidateContactsList: function() {
		var dataTable = YAHOO.Convio.PC2.Component.AddressBookImport.ImportSelectList.dataTable;
		var recordSet = dataTable.getRecordSet();
		var records = recordSet.getRecords();
		for (var i = 0; i < records.length; i++) {
			var record = records[i];
			YAHOO.Convio.PC2.Component.AddressBookImport.setContactAndDataTableRecordChecked(record, false);
		}
		dataTable.refreshView();
		return false;
	},
	
	hideSelectContactsErrors: function() {
		// hide any error messages for the subview that might need to be revealed later
    	YAHOO.util.Dom.addClass("msg_cat_addressbookimport_selectcontacts_unexpected_save_failure", "hidden-form");
    	YAHOO.util.Dom.addClass("msg_cat_addressbookimport_selectcontacts_none_selected_failure", "hidden-form");
	},
	
	getSelectedImportCandidateContacts: function() {
		
		var context = YAHOO.Convio.PC2.Component.AddressBookImport.context;
		
		var selectedContacts = new Array();
		
		for (var i = 0; i < context.getAddressBook().getContacts().length; i++) {
			var candidateContact = context.getAddressBook().getContacts()[i];
			if (candidateContact.checked) {
				selectedContacts.push(candidateContact);
			}
		}
		
		return selectedContacts;
		
	},
	
	selectContactsNextEventHandler: function() {
		
		YAHOO.Convio.PC2.Component.AddressBookImport.disableNextButtonAndThen('selectcontacts', function() {
		
			var context = YAHOO.Convio.PC2.Component.AddressBookImport.context;
			var retrievalServiceInstance = YAHOO.Convio.PC2.Component.AddressBookImport.retrievalServiceInstance;
			var importServiceInstance = YAHOO.Convio.PC2.Component.AddressBookImport.importServiceInstance;
			
			// hide any error messages that were revealed by previous interactions
			YAHOO.Convio.PC2.Component.AddressBookImport.hideSelectContactsErrors();
			
			var importAll = jQuery('#addressbookimport_selectcontacts_options input:radio:checked').val() === 'all';
			
			var contactsToSave;
			
			if (importAll) {
				YAHOO.log('Will attempt to import _all_ address book contacts.', 'info', 'address_book_import_functions.js');
				
				contactsToSave = context.getAddressBook().getContacts();
			}
			else {
				YAHOO.log('Will attempt to import only _checked_ address book contacts.', 'info', 'address_book_import_functions.js');
				
				contactsToSave = YAHOO.Convio.PC2.Component.AddressBookImport.getSelectedImportCandidateContacts();
			}
			
			if (contactsToSave.length <= 0) {
				YAHOO.Convio.PC2.Component.AddressBookImport.enableNextButtonAndThen('selectcontacts', function() {
					// no contacts to import ... did user forget to select?
					YAHOO.util.Dom.removeClass("msg_cat_addressbookimport_selectcontacts_none_selected_failure", "hidden-form");
					YAHOO.Convio.PC2.Component.Teamraiser.showAddressImportWizardSelectContacts();
				});
			}
			else {
			
				importServiceInstance.saveContacts(contactsToSave, {
					
					success: function(saveContactsResult)
					{
						// capture the saveContactsResult to be used later
						context.setSaveContactsResult(saveContactsResult);
					
						// mark contact cache as stale?
						if (context.getSaveContactsResult().savedContacts.length > 0) {
							Y.use('pc2-contacts-functions', function() {
								YAHOO.Convio.PC2.Component.Contacts.markCachedContactsAsDirty();
								Y.use("pc2-compose-functions", function(Y) {
									clearCachedContacts();
								});
							});
						}
						
						// advance to next view
						YAHOO.Convio.PC2.Utils.loadView('addressbookimport','importresults');
						
						// re-enable the next button on the subview that we just left
						YAHOO.Convio.PC2.Component.AddressBookImport.enableNextButtonAndThen('selectcontacts');
					},
					failure: function(errMsg)
					{
						YAHOO.log('Request to save contacts FAILED: ' + errMsg, 'error', 'address_book_import_functions.js');
						
						YAHOO.Convio.PC2.Component.AddressBookImport.enableNextButtonAndThen('selectcontacts', function() {
							// unexpected error
							YAHOO.util.Dom.removeClass("msg_cat_addressbookimport_selectcontacts_unexpected_save_failure", "hidden-form");
							YAHOO.Convio.PC2.Component.Teamraiser.showAddressImportWizardSelectContacts();
						});
					},
					scope: this
				});
			
			}
			
		});
		 
		return false;
	},
	
	populateSaveCounts: function() {
		
		var context = YAHOO.Convio.PC2.Component.AddressBookImport.context;
		var saveContactsResults = context.getSaveContactsResult();
		
		jQuery('#addressbookimport_importresults_section_summary_success_count').html('<b>' + saveContactsResults.countSavedAndDuplicateContacts() + '</b>');
		jQuery('#addressbookimport_importresults_section_summary_new_count').html(saveContactsResults.countSavedContacts());
		jQuery('#addressbookimport_importresults_section_summary_suspected_duplicate_count').html('<b>' + saveContactsResults.countPotentialDuplicateContacts() + '</b>');
		jQuery('#addressbookimport_importresults_section_summary_error_count').html('<b>' + saveContactsResults.countErrorContacts() + '</b>');
		
		jQuery('#addressbookimport_importresults_section_added_header_count').html(saveContactsResults.countSavedAndDuplicateContacts());
		jQuery('#addressbookimport_importresults_section_suspected_duplicates_header_count').html(saveContactsResults.countPotentialDuplicateContacts());
		jQuery('#addressbookimport_importresults_section_errors_header_count').html(saveContactsResults.countErrorContacts());
	},
	
	populateResolvedCounts: function() {
		jQuery('#addressbookimport_importresults_section_summary_suspected_resolved_duplicate_count')
		.html(YAHOO.Convio.PC2.Component.AddressBookImport.getNumberOfResolvedPotentialDuplicateContacts());
	},
	
	showAndHideResultDivs: function() {
		
		var context = YAHOO.Convio.PC2.Component.AddressBookImport.context;
		var saveContactsResults = context.getSaveContactsResult();
		
		// show or hide saved newly saved contacts section?
		if (saveContactsResults.countSavedAndDuplicateContacts() > 0) {
			jQuery('#addressbookimport_importresults_section_summary_success_li').show();
			jQuery('#addressbookimport_importresults_section_added_header').show();
			// no need to call show on the content section ... accordion should take care of that when appropriate
		}
		else {
			jQuery('#addressbookimport_importresults_section_summary_success_li').hide();
			jQuery('#addressbookimport_importresults_section_added_header').hide();
			jQuery('#addressbookimport_importresults_section_added').hide();
		}
		
		// show or hide potential duplicate contacts section?
		if (saveContactsResults.countPotentialDuplicateContacts() > 0) {
			jQuery('#addressbookimport_importresults_section_summary_suspected_duplicate_li').show();
			jQuery('#addressbookimport_importresults_section_suspected_duplicates_header').show();
			// no need to call show on the content section ... accordion should take care of that when appropriate
		}
		else {
			jQuery('#addressbookimport_importresults_section_summary_suspected_duplicate_li').hide();
			jQuery('#addressbookimport_importresults_section_suspected_duplicates_header').hide();
			jQuery('#addressbookimport_importresults_section_suspected_duplicates').hide();
		}
		
		// show or hide error section?
		if (saveContactsResults.countErrorContacts() > 0) {
			jQuery('#addressbookimport_importresults_section_summary_error_li').show();
			jQuery('#addressbookimport_importresults_section_errors_header').show();
			// no need to call show on the content section ... accordion should take care of that when appropriate
		}
		else {
			jQuery('#addressbookimport_importresults_section_summary_error_li').hide();
			jQuery('#addressbookimport_importresults_section_errors_header').hide();
			jQuery('#addressbookimport_importresults_section_errors').hide();
		}
		
	},
	
	buildResultsAccordion: function() {
		
		var context = YAHOO.Convio.PC2.Component.AddressBookImport.context;
		var saveContactsResults = context.getSaveContactsResult();
		
        // set counts into DOM for various save result types
    	YAHOO.Convio.PC2.Component.AddressBookImport.populateSaveCounts();
    	YAHOO.Convio.PC2.Component.AddressBookImport.populateResolvedCounts();
    	
    	// remove any previously applied accordion widget
    	if (YAHOO.Convio.PC2.Component.AddressBookImport.addressBookImportResultsAccordion) {
    		YAHOO.Convio.PC2.Component.AddressBookImport.addressBookImportResultsAccordion.accordion("destroy");
    	}
    	
    	// apply accordion widget
    	var addressBookImportResultsAccordion = jQuery('#addressbookimport-importresults-accordion').accordion({ 
    		autoHeight: false
    	});
    	
    	// save a reference to the current accordion
    	YAHOO.Convio.PC2.Component.AddressBookImport.addressBookImportResultsAccordion = addressBookImportResultsAccordion;
    	
    	// wire in links from summary to other accordion views
    	YAHOO.util.Event.addListener("addressbookimport_importresults_section_summary_success_count", "click", function() {
    		addressBookImportResultsAccordion.accordion('activate', '#addressbookimport_importresults_section_added_header');
    	});
    	YAHOO.util.Event.addListener("addressbookimport_importresults_section_summary_suspected_duplicate_count", "click", function() {
    		addressBookImportResultsAccordion.accordion('activate', '#addressbookimport_importresults_section_suspected_duplicates_header');
    	});
    	YAHOO.util.Event.addListener("addressbookimport_importresults_section_summary_error_count", "click", function() {
    		addressBookImportResultsAccordion.accordion('activate', '#addressbookimport_importresults_section_errors_header');
    	});
    	
    	// listen for change events on the accordion to refresh inner UI elements
    	jQuery('.ui-accordion').bind('accordionchange', function(event, ui) {
    		// tell datatables to check their column widths
    		YAHOO.Convio.PC2.Component.AddressBookImport.NewlyAddedList.dataTable.onShow();
    		YAHOO.Convio.PC2.Component.AddressBookImport.SuspectedDuplicatesList.dataTable.onShow();
    		YAHOO.Convio.PC2.Component.AddressBookImport.ErrorsList.dataTable.onShow();
    	});
    	
    	// auto select the appropriate first view in the accordion
    	if (saveContactsResults.countSavedAndDuplicateContacts() > 0) {
    		addressBookImportResultsAccordion.accordion('activate', '#addressbookimport_importresults_section_added_header');
		}
		else if (saveContactsResults.countPotentialDuplicateContacts() > 0) {
			addressBookImportResultsAccordion.accordion('activate', '#addressbookimport_importresults_section_suspected_duplicates_header');
		}
		else if (saveContactsResults.countErrorContacts() > 0) {
			addressBookImportResultsAccordion.accordion('activate', '#addressbookimport_importresults_section_errors_header');
		}
		
    	// hide accordion sections that have no content
        YAHOO.Convio.PC2.Component.AddressBookImport.showAndHideResultDivs();
    	
	},
	
	buildNewlyAddedContactsList: function() {
		
		var container = 'addressbookimport-importresults-newly-added-list';
		var context = YAHOO.Convio.PC2.Component.AddressBookImport.context;
		var saveContactsResults = context.getSaveContactsResult();
		
		// clear out any previously rendered list
		jQuery('#' + container).html('');
		
		// start a name space for the data table
		YAHOO.namespace("Convio.PC2.Component.AddressBookImport.NewlyAddedList");
			
		// wrap the address book as a YUI data source
		YAHOO.Convio.PC2.Component.AddressBookImport.NewlyAddedList.dataSource = new YAHOO.util.LocalDataSource(saveContactsResults.getSavedAndDuplicateContacts());
		YAHOO.Convio.PC2.Component.AddressBookImport.NewlyAddedList.dataSource.responseType = YAHOO.util.XHRDataSource.TYPE_JSARRAY;

		// define data table columns to be displayed
		var MsgCatProvider = YAHOO.Convio.PC2.Component.Content;
		YAHOO.Convio.PC2.Component.AddressBookImport.NewlyAddedList.columnDefs = [
            //key names here come from YAHOO.Convio.PC2.AddressBookImport.Contact fields
            { 
            	key: "firstName", label: MsgCatProvider.getMsgCatValue('addressbookimport_column_first_name'), sortable: true,
            	formatter: function (elCell, oRecord, oColumn, oData) {
            		var firstName = oRecord.getData('contact').getFirstName();
            		elCell.innerHTML = (!firstName || firstName === null) ? "" : firstName; 
            	},
            	className: 'breakWord',
            	width: YAHOO.Convio.PC2.Component.AddressBookImport.COLUMN_WIDTHS.firstName_Wide
            },
            { 
            	key: "lastName", label: MsgCatProvider.getMsgCatValue('addressbookimport_column_last_name'), sortable: true,
            	formatter: function (elCell, oRecord, oColumn, oData) { 
            		var lastName = oRecord.getData('contact').getLastName();
            		elCell.innerHTML =  (!lastName || lastName === null) ? "" : lastName; 
            	},
            	className: 'breakWord',
            	width: YAHOO.Convio.PC2.Component.AddressBookImport.COLUMN_WIDTHS.lastName_Wide
            },
            { 
            	key: "email", label: MsgCatProvider.getMsgCatValue('addressbookimport_column_email'), sortable: true,
            	formatter: function (elCell, oRecord, oColumn, oData) { 
	            	var email = oRecord.getData('contact').getEmail();
	        		elCell.innerHTML = (!email || email === null) ? "" : email; 
            	},
            	className: 'breakWord',
            	width: YAHOO.Convio.PC2.Component.AddressBookImport.COLUMN_WIDTHS.email_Wide
            }
        ];
		
		// define collaborators for new data table
		YAHOO.Convio.PC2.Component.AddressBookImport.NewlyAddedList.dataTable = YAHOO.Convio.PC2.Component.DataTableBuilder.buildDataTable(
				container,
				YAHOO.Convio.PC2.Component.AddressBookImport.NewlyAddedList.columnDefs, 
                YAHOO.Convio.PC2.Component.AddressBookImport.NewlyAddedList.dataSource,
                {
    				height: "12em"
                },
                YAHOO.Convio.PC2.Component.Content,
                true
        );
		
		// finally, render the data table
		YAHOO.Convio.PC2.Component.AddressBookImport.NewlyAddedList.dataTable.render();
	},
	
	buildSuspectedDuplicateContactsList: function() {
		
		var container = 'addressbookimport-importresults-suspected-duplicates-list';
		var context = YAHOO.Convio.PC2.Component.AddressBookImport.context;
		var saveContactsResults = context.getSaveContactsResult();
		
		// clear out any previously rendered list
		jQuery('#' + container).html('');
		
		// start a name space for the data table
		YAHOO.namespace("Convio.PC2.Component.AddressBookImport.SuspectedDuplicatesList");
			
		// wrap the address book as a YUI data source
		YAHOO.Convio.PC2.Component.AddressBookImport.SuspectedDuplicatesList.dataSource = new YAHOO.util.LocalDataSource(saveContactsResults.getPotentialDuplicateContacts());
		YAHOO.Convio.PC2.Component.AddressBookImport.SuspectedDuplicatesList.dataSource.responseType = YAHOO.util.XHRDataSource.TYPE_JSARRAY;

		// construct label for third party contact column
		var MsgCatProvider = YAHOO.Convio.PC2.Component.Content;
		var thirdPartyContactLabel = '';
		if (context.getSource() === 'csv') {
			// special capitalization rules for CSV source
			thirdPartyContactLabel += '<span style="text-transform: uppercase;">' + context.getSource() + '</span> '
		}
		else {
			thirdPartyContactLabel += '<span style="text-transform: capitalize;">' + context.getSource() + '</span> '
		}
		thirdPartyContactLabel += MsgCatProvider.getMsgCatValue('addressbookimport_column_third_party_contact');
		
		// define data table columns to be displayed
		YAHOO.Convio.PC2.Component.AddressBookImport.SuspectedDuplicatesList.columnDefs = [
			{
				key: "thirdPartyContact", 
				label: thirdPartyContactLabel,
				sortable: true,
				formatter: function (elCell, oRecord, oColumn, oData) {
					jQuery(elCell).html(oRecord.getData('contact').toHtmlString());
				}, 
				className: 'breakWord',
				width: YAHOO.Convio.PC2.Component.AddressBookImport.COLUMN_WIDTHS.nameAndEmail_Narrow
			},
			{
				key: "participantCenterContact", label: MsgCatProvider.getMsgCatValue('addressbookimport_column_participant_center_contact'), sortable: true,
				formatter: function (elCell, oRecord, oColumn, oData) {
					jQuery(elCell).html(oRecord.getData('duplicateContact').toHtmlString());
				}, 
				className: 'breakWord',
				width: YAHOO.Convio.PC2.Component.AddressBookImport.COLUMN_WIDTHS.nameAndEmail_Narrow
			},
			{
				label: '<span>' + MsgCatProvider.getMsgCatValue('addressbookimport_column_actions_label') + "</span>", 
				children:
				[
					{
						key: "addAction", 
						label: '<span class="resolvePossibleDupActionLabel" title="' + MsgCatProvider.getMsgCatValue('addressbookimport_column_add_action_tooltip') + '">' + MsgCatProvider.getMsgCatValue('addressbookimport_column_add_action') + '</span>', 
						sortable: false,
						formatter: function (elCell, oRecord, oColumn, oData) {
						
						    	var addButton = 
									'<div class="dataTableActionButtonContainer">'
									+ '<button class="dupResolutionButton" name="add" id="addAsNewActionButton_' + oRecord.getId() + '" title="' + MsgCatProvider.getMsgCatValue('addressbookimport_tooltip_add_as_new_button') + '" type="button">'
									+ '<img src="images/add_contact.png" height="22" />'
									+ '</button>'
									+ '<img id="addAsNewActionThrobber_' + oRecord.getId() + '" style="display: none;" src="images/circle-throbber-tiny.gif" alt="" title="' + MsgCatProvider.getMsgCatValue('addressbookimport_tooltip_add_as_new_action_wait') + '"  />'
									+ '<img id="addAsNewActionSuccess_' + oRecord.getId() + '" style="display: none;" src="images/check.gif" alt="" title="' + MsgCatProvider.getMsgCatValue('addressbookimport_tooltip_add_as_new_action_success') + '"  />'
									+ '<img id="addAsNewActionError_' + oRecord.getId() + '" style="display: none;" src="images/error.png" alt="" title="' + MsgCatProvider.getMsgCatValue('addressbookimport_tooltip_add_as_new_action_fail') + '"  />';	
									+ '</div>';
								
								elCell.innerHTML = addButton;
						},
						width: YAHOO.Convio.PC2.Component.AddressBookImport.COLUMN_WIDTHS.action
					},
					{
						key: "mergeAction",
						label: '<span class="resolvePossibleDupActionLabel" title="' + MsgCatProvider.getMsgCatValue('addressbookimport_column_merge_action_tooltip') + '">' + MsgCatProvider.getMsgCatValue('addressbookimport_column_merge_action') + '</span>', 
						sortable: false,
						formatter: function (elCell, oRecord, oColumn, oData) {
						
								var mergeButton = 
									'<div class="dataTableActionButtonContainer">'	
									+ '<button class="dupResolutionButton" name="merge" id="mergeActionButton_' + oRecord.getId() + '" title="' + MsgCatProvider.getMsgCatValue('addressbookimport_tooltip_merge_button') + '" type="button">' 
									+ '<img src="images/merge_contact.png" height="22" />' 
									+ '</button>'
									+ '<img id="mergeActionThrobber_' + oRecord.getId() + '" style="display: none;" src="images/circle-throbber-tiny.gif" alt="" title="' + MsgCatProvider.getMsgCatValue('addressbookimport_tooltip_merge_action_wait') + '"  />'
									+ '<img id="mergeActionSuccess_' + oRecord.getId() + '" style="display: none;" src="images/check.gif" alt="" title="' + MsgCatProvider.getMsgCatValue('addressbookimport_tooltip_merge_action_success') + '"  />'
									+ '<img id="mergeActionError_' + oRecord.getId() + '" style="display: none;" src="images/error.png" alt="" title="' + MsgCatProvider.getMsgCatValue('addressbookimport_tooltip_merge_action_fail') + '"  />';
									+ '</div>';
								
								elCell.innerHTML = mergeButton;
						},
						width: YAHOO.Convio.PC2.Component.AddressBookImport.COLUMN_WIDTHS.action
					},
					{
						key: "ignoreAction",
						label: '<span class="resolvePossibleDupActionLabel" title="' + MsgCatProvider.getMsgCatValue('addressbookimport_column_ignore_action_tooltip') + '">' + MsgCatProvider.getMsgCatValue('addressbookimport_column_ignore_action') + '</span>', 
						sortable: false,
						formatter: function (elCell, oRecord, oColumn, oData) {
						
								var ignoreButton = 
									'<div class="dataTableActionButtonContainer">'
									+ '<button class="dupResolutionButton" name="ignore" id="ignoreActionButton_' + oRecord.getId() + '" title="' + MsgCatProvider.getMsgCatValue('addressbookimport_tooltip_ignore_button') + '" type="button">'
									+ '<img src="images/ignore.png" height="22" />'
									+ '</button>'
									+ '<img id="ignoreActionThrobber_' + oRecord.getId() + '" style="display: none;" src="images/circle-throbber-tiny.gif" alt="" title="' + MsgCatProvider.getMsgCatValue('addressbookimport_tooltip_ignore_action_wait') + '"  />'
									+ '<img id="ignoreActionSuccess_' + oRecord.getId() + '" style="display: none;" src="images/check.gif" alt="" title="' + MsgCatProvider.getMsgCatValue('addressbookimport_tooltip_ignore_action_success') + '"  />'
									+ '<img id="ignoreActionError_' + oRecord.getId() + '" style="display: none;" src="images/error.png" alt="" title="' + MsgCatProvider.getMsgCatValue('addressbookimport_tooltip_ignore_action_fail') + '"  />';	
									+ '</div>';
								
								elCell.innerHTML = ignoreButton;
						},
						width: YAHOO.Convio.PC2.Component.AddressBookImport.COLUMN_WIDTHS.action
					}
				]
			}
		];
		
		// define collaborators for new data table
		YAHOO.Convio.PC2.Component.AddressBookImport.SuspectedDuplicatesList.dataTable = YAHOO.Convio.PC2.Component.DataTableBuilder.buildDataTable(
				container,
				YAHOO.Convio.PC2.Component.AddressBookImport.SuspectedDuplicatesList.columnDefs, 
                YAHOO.Convio.PC2.Component.AddressBookImport.SuspectedDuplicatesList.dataSource,
                {
    				height: "12em"
                },
                YAHOO.Convio.PC2.Component.Content,
                true
        );
		
		// subscribe to cell click events to wire in functionality for action buttons 
		YAHOO.Convio.PC2.Component.AddressBookImport.SuspectedDuplicatesList.dataTable.subscribe("buttonClickEvent", function(oArgs){
			var target = oArgs.target;
		    var column = YAHOO.Convio.PC2.Component.AddressBookImport.SuspectedDuplicatesList.dataTable.getColumn(target);
		    var oRecord = YAHOO.Convio.PC2.Component.AddressBookImport.SuspectedDuplicatesList.dataTable.getRecord(target);
		    
		    var actionName = target.name;
		    
	    	// disable buttons on this row
	    	jQuery('#mergeActionButton_' + oRecord.getId()).attr("disabled", true).attr("name", "disabled");
	    	jQuery('#addAsNewActionButton_' + oRecord.getId()).attr("disabled", true).attr("name", "disabled");
	    	jQuery('#ignoreActionButton_' + oRecord.getId()).attr("disabled", true).attr("name", "disabled");
	    	
		    if (actionName == 'merge') {
		    	// fade the conflicting record to indicate it is being resolved
		    	jQuery('tr#' + oRecord.getId() + ' td.yui-dt-col-participantCenterContact').fadeTo(1 * 1000, 0.25);
		    	
		    	// fade buttons on this row, then reveal spinner, then make ajax call
		    	jQuery('#addAsNewActionButton_' + oRecord.getId()).fadeTo(1 * 1000, 0.25);
		    	jQuery('#mergeActionButton_' + oRecord.getId()).fadeOut(1 * 1000, function() {
		    		jQuery('#mergeActionThrobber_' + oRecord.getId()).show(0 * 1000, function() {
		    			YAHOO.Convio.PC2.Component.AddressBookImport.mergePotentialDuplicateContact(oRecord);
		    		});
		    	});
		    	jQuery('#ignoreActionButton_' + oRecord.getId()).fadeTo(1 * 1000, 0.25);
		    }
		    else if (actionName == 'add') {
		    	// fade the conflicting record to indicate it is being resolved
		    	jQuery('tr#' + oRecord.getId() + ' td.yui-dt-col-participantCenterContact').fadeTo(1 * 1000, 0.25);
		    	
		    	// fade buttons on this row, then reveal spinner, then make ajax call
		    	jQuery('#addAsNewActionButton_' + oRecord.getId()).fadeOut(1 * 1000, function() {
		    		jQuery('#addAsNewActionThrobber_' + oRecord.getId()).show(0 * 1000, function() {
		    			YAHOO.Convio.PC2.Component.AddressBookImport.addPotentialDuplicateContactAsNew(oRecord);
		    		});
		    	});
		    	jQuery('#mergeActionButton_' + oRecord.getId()).fadeTo(1 * 1000, 0.25);
		    	jQuery('#ignoreActionButton_' + oRecord.getId()).fadeTo(1 * 1000, 0.25);
		    }
		    else if (actionName == 'ignore') {
		    	// fade the conflicting record to indicate it is being resolved
		    	jQuery('tr#' + oRecord.getId() + ' td.yui-dt-col-participantCenterContact').fadeTo(1 * 1000, 0.25);
		    	jQuery('tr#' + oRecord.getId() + ' td.yui-dt-col-thirdPartyContact').fadeTo(1 * 1000, 0.25);
		    	
		    	// fade buttons on this row, then reveal spinner, then make ajax call
		    	jQuery('#addAsNewActionButton_' + oRecord.getId()).fadeTo(1 * 1000, 0.25);
		    	jQuery('#mergeActionButton_' + oRecord.getId()).fadeTo(1 * 1000, 0.25);
		    	jQuery('#ignoreActionButton_' + oRecord.getId()).fadeOut(1 * 1000, function() {
		    		jQuery('#ignoreActionThrobber_' + oRecord.getId()).show(0 * 1000, function() {
		    			YAHOO.Convio.PC2.Component.AddressBookImport.ignorePotentialDuplicateContact(oRecord);
		    		});
		    	});
		    }
        });

		// subscribe to the tables's postRender event to apply custom tooltips to dup resolution buttons
		YAHOO.Convio.PC2.Component.AddressBookImport.SuspectedDuplicatesList.dataTable.subscribe("postRenderEvent", function() {
			
			Y.use('jquery-tooltip', function() {
				
				// note use of .tooltipApplied class to avoid applying tooltip function to same button twice
				jQuery('button.dupResolutionButton:not(.tooltipApplied)').addClass('tooltipApplied').tooltip({ 
					extraClass: "pc2Tooltip", 
					delay: 750,
					track: true,
            	    showURL: false,
					bodyHandler: function() {

						var tooltipParentButton = this;
					
						var recordId = tooltipParentButton.id.split("_")[1];
						var oRecord = YAHOO.Convio.PC2.Component.AddressBookImport.SuspectedDuplicatesList.dataTable.getRecord(recordId);
						
						if (oRecord) {
					
							var contact = oRecord.getData('contact');
							var dupContact = oRecord.getData('duplicateContact');
						
							var actionName = tooltipParentButton.name;
							
							if (actionName == 'merge') {
								return YAHOO.Convio.PC2.Component.AddressBookImport.buildMergeTooltip(contact, dupContact);
							}
							else if (actionName == 'add') {
								return YAHOO.Convio.PC2.Component.AddressBookImport.buildAddAsNewTooltip(contact, dupContact);
							}
							else if (actionName == 'ignore') {
								return YAHOO.Convio.PC2.Component.AddressBookImport.buildIgnoreTooltip(contact, dupContact);
							}
							
						}
						
					}
				});
				
			});
			
		});
		
		// finally, render the data table
		YAHOO.Convio.PC2.Component.AddressBookImport.SuspectedDuplicatesList.dataTable.render();
		
	},
	
	buildAddAsNewTooltip: function(contact, dupContact) {
		var MsgCatProvider = YAHOO.Convio.PC2.Component.Content;
		
		var tooltip = "<h3>" + MsgCatProvider.getMsgCatValue('addressbookimport_tooltip_add_as_new_button_header') + "</h3>";
		
		tooltip += "<ul>";
		
		if (contact) {
			tooltip += "<li>" + MsgCatProvider.getMsgCatValue('addressbookimport_tooltip_add_as_new_button_contact_resolution') + "<br/>"
			+ contact.toHtmlString() + "</li>";
		}
		if (dupContact) {
			tooltip += "<li>" + MsgCatProvider.getMsgCatValue('addressbookimport_tooltip_add_as_new_button_dupContact_resolution') + "<br/>"
			+ dupContact.toHtmlString() + "</li>";
		}
		
		tooltip += "</ul>";
		
		return tooltip;
	},
	
	buildMergeTooltip: function(contact, dupContact) {
		var MsgCatProvider = YAHOO.Convio.PC2.Component.Content;
		
		var tooltip = "<h3>" + MsgCatProvider.getMsgCatValue('addressbookimport_tooltip_merge_button_header') + "</h3>";
		
		tooltip += "<ul>";
		
		if (contact) {
			tooltip += "<li>" + MsgCatProvider.getMsgCatValue('addressbookimport_tooltip_merge_button_contact_resolution') + "</li>";
		}
		if (dupContact) {
			tooltip += "<li>" + MsgCatProvider.getMsgCatValue('addressbookimport_tooltip_merge_button_dupContact_resolution') + "<br/>";
			
			var mergeData = YAHOO.Convio.PC2.Component.AddressBookImport.buildContactUpdateDataForMerge(contact, dupContact)
			tooltip += new YAHOO.Convio.PC2.AddressBookImport.Domain.Contact(mergeData.firstName, mergeData.lastName, mergeData.email).toHtmlString() + "</li>";
		}
		
		tooltip += "</ul>";
		
		return tooltip;
	},
	
	buildIgnoreTooltip: function(contact, dupContact) {
		var MsgCatProvider = YAHOO.Convio.PC2.Component.Content;
		
		var tooltip = "<h3>" + MsgCatProvider.getMsgCatValue('addressbookimport_tooltip_ignore_button_header') + "</h3>";
		
		tooltip += "<ul>";
		
		if (contact) {
			tooltip += " <li>" + MsgCatProvider.getMsgCatValue('addressbookimport_tooltip_ignore_button_contact_resolution') + "</li>";
		}
		if (dupContact) {
			tooltip += " <li>" + MsgCatProvider.getMsgCatValue('addressbookimport_tooltip_ignore_button_dupContact_resolution') + "<br/>"
			+ dupContact.toHtmlString() + "</li>";
		}
		
		tooltip += "</ul>";
		
		return tooltip;
	},
	
	buildContactUpdateDataForMerge: function(contactToMerge, dupContactToMergeWith) {
		var contactUpdateData = {
			contactId: dupContactToMergeWith.getId(),
			firstName: (YAHOO.lang.isString(contactToMerge.getFirstName()) && contactToMerge.getFirstName() != '') ? contactToMerge.getFirstName() : dupContactToMergeWith.getFirstName(),
			lastName: (YAHOO.lang.isString(contactToMerge.getLastName()) && contactToMerge.getLastName() != '') ?  contactToMerge.getLastName() : dupContactToMergeWith.getLastName(),
			email: (YAHOO.lang.isString(contactToMerge.getEmail()) && contactToMerge.getEmail() != '') ?  contactToMerge.getEmail() : dupContactToMergeWith.getEmail()
		};
		
		return contactUpdateData;
	},
	
	mergePotentialDuplicateContact: function(oRecord) {
		
		var context = YAHOO.Convio.PC2.Component.AddressBookImport.context;
		var index = parseInt(oRecord.getData("saveContactsResultsIndex"));
		var saveContactsResults = context.getSaveContactsResult();
		var contactSaveResult = saveContactsResults.getPotentialDuplicateContacts()[index]; 
		var contactToMerge = contactSaveResult.getContact();
		var dupContactToMergeWith = contactSaveResult.getDuplicateContact();
		
		// create a data collection that combines the details of contactToMerge & dupContactToMergeWith
		var contactUpdateData = YAHOO.Convio.PC2.Component.AddressBookImport.buildContactUpdateDataForMerge(contactToMerge, dupContactToMergeWith);
		
		// use the updateAddressBookContact(..) method, which doesn't do any duplicate detection
		YAHOO.Convio.PC2.AddressBook.updateAddressBookContact({
			
			success: function(o) {
			
	          YAHOO.log('Merged potential duplicate into contact with ID ' + contactUpdateData.contactId, 'info', 'address_book_import_functions.js');
	          
			   // Need to refresh cached contact data 
	           Y.use('pc2-contacts-functions', function() {
	        	   YAHOO.Convio.PC2.Component.Contacts.markCachedContactsAsDirty();
	        	   Y.use("pc2-compose-functions", function(Y) {
	        		   clearCachedContacts();
	        	   });
	           });
	           
	           // mark potential duplicate contact as resolved
	           contactSaveResult.markResolved();
			       
			   // no event to fire for contact update
			   
			   // Update UI to signal that potential duplicate has been resolved ...
			   // hide throbber and display result icon
			   jQuery('#mergeActionThrobber_' + oRecord.getId()).fadeOut(0.25 * 1000, function() {
				   jQuery('#mergeActionSuccess_' + oRecord.getId()).fadeIn(0.25 * 1000);
			   });
			   
			   // update the resolved duplicate count
			   YAHOO.Convio.PC2.Component.AddressBookImport.populateResolvedCounts();
			   
		   },
		   failure: function(o) {
			   
			   YAHOO.log('Request to save duplicate contact as new FAILED: ' + o.responseText, 'error', 'address_book_import_functions.js');
				
			   // Update UI to signal that potential duplicate could not be resolved ...
			   // hide throbber and display result icon
			   jQuery('#mergeActionThrobber_' + oRecord.getId()).fadeOut(0.25 * 1000, function() {
				   jQuery('#mergeActionError_' + oRecord.getId()).fadeIn(0.25 * 1000);
			   });
		   },
		   scope: this
			
		}, contactUpdateData);
		
	},
	
	addPotentialDuplicateContactAsNew: function(oRecord) {
		
		var retrievalServiceInstance = YAHOO.Convio.PC2.Component.AddressBookImport.retrievalServiceInstance;
		var importServiceInstance = YAHOO.Convio.PC2.Component.AddressBookImport.importServiceInstance;
		
		var context = YAHOO.Convio.PC2.Component.AddressBookImport.context;
		var index = parseInt(oRecord.getData("saveContactsResultsIndex"));
		var saveContactsResults = context.getSaveContactsResult();
		var contactSaveResult = saveContactsResults.getPotentialDuplicateContacts()[index]; 
		var contactToSaveAsNew = contactSaveResult.getContact();
		var dupContact = contactSaveResult.getDuplicateContact();
		
		importServiceInstance.savePossibleDupContactAsNew(contactToSaveAsNew, {
				
			success: function(o) {
			
	          YAHOO.log('Added potential duplicate contact as a new contact.', 'info', 'address_book_import_functions.js');
			       
			  // Need to refresh cached contact data 
	          Y.use('pc2-contacts-functions', function() {
	        	  YAHOO.Convio.PC2.Component.Contacts.markCachedContactsAsDirty();
	        	  Y.use("pc2-compose-functions", function(Y) {
	        		  clearCachedContacts();
	        	  });
	          });
			       
	          // mark potential duplicate contact as resolved
	          contactSaveResult.markResolved();
			   
			   // Update UI to signal that potential duplicate has been resolved ...
			   // hide throbber and display result icon
			   jQuery('#addAsNewActionThrobber_' + oRecord.getId()).fadeOut(0.25 * 1000, function() {
				   jQuery('#addAsNewActionSuccess_' + oRecord.getId()).fadeIn(0.25 * 1000);
			   });
			   
			   // update the resolved duplicate count
			   YAHOO.Convio.PC2.Component.AddressBookImport.populateResolvedCounts();
			   
		   },
		   failure: function(errMsg) {
			   
			   YAHOO.log('Request to save duplicate contact as new FAILED: ' + errMsg, 'error', 'address_book_import_functions.js');
				
			   /// Update UI to signal that potential duplicate could not be resolved ...
			   // hide throbber and display result icon
			   jQuery('#addAsNewActionThrobber_' + oRecord.getId()).fadeOut(0.25 * 1000, function() {
				   jQuery('#addAsNewActionError_' + oRecord.getId()).fadeIn(0.25 * 1000);
			   });
		   },
		   scope: this
			
		});
		
	},
	
	ignorePotentialDuplicateContact: function(oRecord) {
		
		var context = YAHOO.Convio.PC2.Component.AddressBookImport.context;
		var index = parseInt(oRecord.getData("saveContactsResultsIndex"));
		var saveContactsResults = context.getSaveContactsResult();
		var contactSaveResult = saveContactsResults.getPotentialDuplicateContacts()[index]; 
		var contactToIgnore = contactSaveResult.getContact();
		var dupContact = contactSaveResult.getDuplicateContact();
		
		YAHOO.log('Ignored potential duplicate of contact with ID ' + dupContact.getId(), 'info', 'address_book_import_functions.js');
		
		// mark potential duplicate contact as resolved
		contactSaveResult.markResolved();
		
		// Update UI to signal that potential duplicate has been resolved ...
		// hide throbber and display result icon
		jQuery('#ignoreActionThrobber_' + oRecord.getId()).fadeOut(0.25 * 1000, function() {
			jQuery('#ignoreActionSuccess_' + oRecord.getId()).fadeIn(0.25 * 1000);
		});
		
		// update the resolved duplicate count
		YAHOO.Convio.PC2.Component.AddressBookImport.populateResolvedCounts();
		
	},
	
	buildErrorContactsList: function() {
		
		var container = 'addressbookimport-importresults-errors-list';
		var context = YAHOO.Convio.PC2.Component.AddressBookImport.context;
		var saveContactsResults = context.getSaveContactsResult();
		
		// clear out any previously rendered list
		jQuery('#' + container).html('');
		
		// start a name space for the data table
		YAHOO.namespace("Convio.PC2.Component.AddressBookImport.ErrorsList");
			
		// wrap the address book as a YUI data source
		YAHOO.Convio.PC2.Component.AddressBookImport.ErrorsList.dataSource = new YAHOO.util.LocalDataSource(saveContactsResults.getErrorContacts());
		YAHOO.Convio.PC2.Component.AddressBookImport.ErrorsList.dataSource.responseType = YAHOO.util.XHRDataSource.TYPE_JSARRAY;

		// define data table columns to be displayed
		var MsgCatProvider = YAHOO.Convio.PC2.Component.Content;
		YAHOO.Convio.PC2.Component.AddressBookImport.ErrorsList.columnDefs = [
            //key names here come from YAHOO.Convio.PC2.AddressBookImport.Contact fields
            { 
            	key: "firstName", label: MsgCatProvider.getMsgCatValue('addressbookimport_column_first_name'), sortable: true,
            	formatter: function (elCell, oRecord, oColumn, oData) {
            		var firstName = oRecord.getData('contact').getFirstName();
            		elCell.innerHTML = (!firstName || firstName === null) ? "" : firstName; 
            	},
            	className: 'breakWord',
            	width: YAHOO.Convio.PC2.Component.AddressBookImport.COLUMN_WIDTHS.firstName_Narrow
            },
            { 
            	key: "lastName", label: MsgCatProvider.getMsgCatValue('addressbookimport_column_last_name'), sortable: true,
            	formatter: function (elCell, oRecord, oColumn, oData) { 
            		var lastName = oRecord.getData('contact').getLastName();
            		elCell.innerHTML =  (!lastName || lastName === null) ? "" : lastName;
            	},
            	className: 'breakWord',
            	width: YAHOO.Convio.PC2.Component.AddressBookImport.COLUMN_WIDTHS.lastName_Narrow
            },
            { 
            	key: "email", label: MsgCatProvider.getMsgCatValue('addressbookimport_column_email'), sortable: true,
            	formatter: function (elCell, oRecord, oColumn, oData) {
            		var email = oRecord.getData('contact').getEmail();
            		elCell.innerHTML = (!email || email === null) ? "" : email;
            	},
            	className: 'breakWord',
            	width: YAHOO.Convio.PC2.Component.AddressBookImport.COLUMN_WIDTHS.email_Narrow
            },
            { 
            	key: "result", label: MsgCatProvider.getMsgCatValue('addressbookimport_column_error_details'), sortable: true,
            	formatter: 'text', className: 'breakWord',
            	width: YAHOO.Convio.PC2.Component.AddressBookImport.COLUMN_WIDTHS.errorMsg
            }
        ];
		
		// define collaborators for new data table
		YAHOO.Convio.PC2.Component.AddressBookImport.ErrorsList.dataTable = YAHOO.Convio.PC2.Component.DataTableBuilder.buildDataTable(
				container,
				YAHOO.Convio.PC2.Component.AddressBookImport.ErrorsList.columnDefs, 
                YAHOO.Convio.PC2.Component.AddressBookImport.ErrorsList.dataSource,
                {
    				height: "12em"
                },
                YAHOO.Convio.PC2.Component.Content,
                true
        );
		
		// finally, render the data table
		YAHOO.Convio.PC2.Component.AddressBookImport.ErrorsList.dataTable.render();
	},
	
	buildConfirmFinishedDialog: function() {
		
		YAHOO.Convio.PC2.Component.AddressBookImport.confirmImportFinishedDialog = 
			new Y.Convio.widget.Boxinator('#addressbookImportConfirmFinishedDialog', Y.Convio.widget.Boxinator.DIALOG, null, document.body);
    	
		YAHOO.util.Event.addListener("addressbookimport_confirm_finished_suspected_duplicate_link", "click", function() {
    		this.hide();
    		jQuery('#addressbookimport-importresults-accordion').accordion('activate', '#addressbookimport_importresults_section_suspected_duplicates_header');
    	}, null, YAHOO.Convio.PC2.Component.AddressBookImport.confirmImportFinishedDialog);
		
		YAHOO.util.Event.addListener("cancelAddressBookImportFinishedLink", "click", function() {
    		this.hide();
    	}, null, YAHOO.Convio.PC2.Component.AddressBookImport.confirmImportFinishedDialog);
		
    	YAHOO.util.Event.addListener('confirmAddressBookImportFinishedButton', 'click', function() {
			this.hide();
      // return to wherever you were
      var subview = YAHOO.Convio.PC2.Views.importReferer || 'contacts';
      YAHOO.Convio.PC2.Utils.loadView('email',subview);

		}, null, YAHOO.Convio.PC2.Component.AddressBookImport.confirmImportFinishedDialog);
    	
	},
	
	getNumberOfUnresolvedPotentialDuplicateContacts: function() {
		
		var context = YAHOO.Convio.PC2.Component.AddressBookImport.context;
		var saveContactsResults = context.getSaveContactsResult();
		
		var numUnresolvedDuplicates = 0;
		
		var potentialDupicateContacts = saveContactsResults.getPotentialDuplicateContacts();
		
		for (var i = 0; i < potentialDupicateContacts.length; i++) {
			if (!potentialDupicateContacts[i].isResolved()) {
				numUnresolvedDuplicates++;
			}
		}
		
		return numUnresolvedDuplicates;
	},
	
	getNumberOfResolvedPotentialDuplicateContacts: function() {
		
		var context = YAHOO.Convio.PC2.Component.AddressBookImport.context;
		var saveContactsResults = context.getSaveContactsResult();
		
		var numResolvedDups = saveContactsResults.countPotentialDuplicateContacts() - YAHOO.Convio.PC2.Component.AddressBookImport.getNumberOfUnresolvedPotentialDuplicateContacts();
		
		return numResolvedDups;
	},
	
	importResultsNextEventHandler: function() {
		
		// note: we're intentionally _not_ calling disableNextButtonAndThen(..) for this last "nest" button 
		
		var numUnresolvedDuplicates = YAHOO.Convio.PC2.Component.AddressBookImport.getNumberOfUnresolvedPotentialDuplicateContacts();
		
		if (numUnresolvedDuplicates > 0) {
			// reveal the confirm dialog
			jQuery('#addressbookimport_confirm_finished_suspected_duplicate_count').html('<b>' + numUnresolvedDuplicates + '</b>');
			YAHOO.Convio.PC2.Component.AddressBookImport.confirmImportFinishedDialog.show();
		}
		else {
			// just change the PC2 view
      // return to wherever you were
      var subview = YAHOO.Convio.PC2.Views.importReferer || 'contacts';
      YAHOO.Convio.PC2.Utils.loadView('email',subview);
		}
		
		
		return false;
	},
	
	updateSummaryListItemStyles: function() {
		
		var context = YAHOO.Convio.PC2.Component.AddressBookImport.context;
		var saveContactsResults = context.getSaveContactsResult();
		
    	// clear any previously applied summary list item styles
    	jQuery('div#addressbookimport_importresults_section_summary_list_container ul li').removeClass('addressBookImportSummarySuccess').removeClass('addressBookImportSummaryError');
    	
    	// apply appropriate style to summary list items
    	jQuery('#addressbookimport_importresults_section_summary_success_li').addClass(
    			((saveContactsResults.countSavedAndDuplicateContacts() > 0) ? 'addressBookImportSummarySuccess' : 'addressBookImportSummaryError')
    	);
    	jQuery('#addressbookimport_importresults_section_summary_suspected_duplicate_li').addClass(
    			((saveContactsResults.countPotentialDuplicateContacts() > 0) ? 'addressBookImportSummaryError' : 'addressBookImportSummarySuccess')
    	);
    	jQuery('#addressbookimport_importresults_section_summary_error_li').addClass(
    			((saveContactsResults.countErrorContacts() > 0) ? 'addressBookImportSummaryError' : 'addressBookImportSummarySuccess')
    	);
    	
	}

}; 

/**
 * A context object that tracks the user's choices during the address book import process.
 */
YAHOO.Convio.PC2.Component.AddressBookImport.Context = function()
{
	// common properties
	this.source =null;
	
	// csv-based import properties
	this.csvParseResult = null;
	
	// web-based import properties
	this.jobId = null;
	this.oAuthUrl = null;
	this.addressBook = null;
	this.saveContactsResult = null;
};
YAHOO.Convio.PC2.Component.AddressBookImport.Context.prototype = 
{
	getSource: function() { return this.source; },
	setSource: function(source) {
		if (!YAHOO.lang.isString(source)) {
			throw "Expected instance of String.";
		}
		this.source = source;
	},
	getCsvParseResult: function() { return this.csvParseResult; },
	setCsvParseResult: function(csvParseResult) {
		if (!(csvParseResult instanceof YAHOO.Convio.PC2.AddressBookImport.Domain.CsvParseResult)) {
			throw "Expected instance of YAHOO.Convio.PC2.AddressBookImport.Domain.CsvParseResult.";
		}
		this.csvParseResult = csvParseResult; 
	},
	getJobId: function() { return this.jobId; },
	setJobId: function(jobId) { this.jobId = jobId; },
	getOAuthUrl: function() { return this.oAuthUrl; },
	setOAuthUrl: function(oAuthUrl) {
		if (!YAHOO.lang.isString(oAuthUrl) || oAuthUrl === "") {
			throw "Expected a non-empty instance of String.";
		}
		this.oAuthUrl = oAuthUrl;
	},
	getAddressBook: function() { return this.addressBook; },
	setAddressBook: function(addressBook) {
		if (!(addressBook instanceof YAHOO.Convio.PC2.AddressBookImport.Domain.AddressBook)) {
			throw "Expected instance of YAHOO.Convio.PC2.AddressBookImport.Domain.AddressBook.";
		}
		this.addressBook = addressBook; 
	},
	getSaveContactsResult: function() { return this.saveContactsResult; },
	setSaveContactsResult: function(saveContactsResult) {
		if (!(saveContactsResult instanceof YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactsResults)) {
			throw "Expected instance of YAHOO.Convio.PC2.AddressBookImport.Domain.SaveContactsResults.";
		}
		this.saveContactsResult = saveContactsResult; 
	}
}