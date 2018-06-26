var deleteMessageId;

var DeleteSentMessageCallback = {
	success: function(o){
		var response = YAHOO.lang.JSON.parse(o.responseText).deleteSentMessageResponse;
		var recSet = YAHOO.Convio.PC2.Teamraiser.SentMessages.myDataTable.getRecordSet();
		var records = YAHOO.Convio.PC2.Teamraiser.SentMessages.myDataTable.getRecordSet().getRecords();
		var messageId = response.messageId;
		for(var i=YAHOO.Convio.PC2.Teamraiser.SentMessages.Paginator.getStartIndex(); i<records.length; i++) {
			var record = records[i];
			if(YAHOO.lang.isUndefined(record) == false && 
					record.getData().message_id == messageId) {
				YAHOO.Convio.PC2.Teamraiser.SentMessages.myDataTable.deleteRow(i);
				break;
			}
		}
	},
	failure: function(o){
		logFailure(o);
	},
	scope: YAHOO.Convio.Teamraiser
};

function searchMessages() {
	var filters = YAHOO.util.Dom.get("search-filters").value;
	YAHOO.Convio.PC2.Teamraiser.SentMessages.listCriteria.filters = filters;
	var newRequest = YAHOO.Convio.PC2.Teamraiser.SentMessages.getSentMessagesParams(YAHOO.Convio.PC2.Teamraiser.SentMessages.listCriteria);
	// reset to page one
	YAHOO.Convio.PC2.Teamraiser.SentMessages.Paginator.fireEvent('changeRequest',YAHOO.Convio.PC2.Teamraiser.SentMessages.Paginator.getState({'page':1}));
};

function handleKeyPressedSearchMessages(keyPressEvent) {
	if (keyPressEvent && keyPressEvent.keyCode === 13) {
		searchMessages();
    }
};

var deleteSentMessage = function(messageId) {
	deleteMessageId = messageId;
	YAHOO.Convio.PC2.Teamraiser.SentMessages.DeleteConfirmDialog.show();
};

YAHOO.Convio.PC2.Teamraiser.SentMessages = {

	listCriteria: {
		pageSize: 50,
		pageOffset: 0,
		sortColumn: 'log.date_sent',
		isAscending: 'false',
		filters: ""
	},
	
	getSentMessagesParams: function(listCriteria) {
		var params = "method=getSentMessages&response_format=json";
		params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
		params += YAHOO.Convio.PC2.Utils.getListCriteriaParams(listCriteria);
		params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
		if(YAHOO.lang.isString(listCriteria.filters) && listCriteria.filters != "") {
			params += "&message_filters=" + encodeURIComponent(listCriteria.filters);
		}
		
		YAHOO.log("Returning params=" + params, 'info', 'sent.js');
		return params;
	},

	/**
	 * This method loads the sent messages
	 */
	loadSentMessages: function(container) {
		YAHOO.log('Entry: loadSentMessages(' + container + ')', 'info', 'sent.js');
		var DataSource = YAHOO.util.DataSource,
		DataTable  = YAHOO.widget.DataTable,
		Paginator  = YAHOO.widget.Paginator;


		this.formatRecipients = function(elCell, oRecord, oColumn, sData) {
			var recipients = oRecord.getData("recipients");
			elCell.innerHTML = recipients;
//			elCell.tabIndex = -1;
			elCell.setAttribute('role','presentation');
		};
		
		this.formatSubject = function(elCell, oRecord, oColumn, sData) {
			var subject = oRecord.getData("subject");
			elCell.innerHTML = (YAHOO.lang.isString(subject) ? subject : "");
//			elCell.tabIndex = -1;
			elCell.setAttribute('role','presentation');
		};

		this.formatDate = function(elCell, oRecord, oColumn, sData) {
			var dateObj = oRecord.getData("date");
			var datePair = dateObj.split('T');
			var myDate = new Date(datePair[0]);
			elCell.innerHTML = "<span class=\"date-item\">" + datePair[0] + "</span>";
//			elCell.tabIndex = -1;
			elCell.setAttribute('role','presentation');
		};
		
		this.formatTrashcan = function(elCell, oRecord, oColumn, sData) {
			var messageId = oRecord.getData("message_id");
			elCell.innerHTML = "<center><a href='javascript: deleteSentMessage(" + messageId + ");' class='delete'><img src='images/trash.gif' alt='Delete' /></a></center>";
//			elCell.tabIndex = -1;
			elCell.setAttribute('role', 'presentation');
		};

		/* Column Definitions */
		var MsgCatProvider = YAHOO.Convio.PC2.Component.Content;
		var myColumnDefs = [
		                    {key: 'date', label: MsgCatProvider.getMsgCatValue("sent_data_table_column_date"), 		 formatter: this.formatDate, className: 'cursor-pointer'},
		                    {key: 'subject', label: MsgCatProvider.getMsgCatValue("sent_data_table_column_subject"), 	 formatter: this.formatSubject, minWidth: 800, className: 'cursor-pointer blue-text'},
		                    {key: 'recipient', label: MsgCatProvider.getMsgCatValue("sent_data_table_column_recipients"), formatter: this.formatRecipients, minWidth: 300, className: 'cursor-pointer blue-text'},
		                    {key: 'delete', label: MsgCatProvider.getMsgCatValue("sent_data_table_column_delete"), 			 formatter: this.formatTrashcan}
		                    ];

		YAHOO.Convio.PC2.Teamraiser.SentMessages.myDataSource = new YAHOO.util.XHRDataSource(YAHOO.Convio.PC2.Config.Teamraiser.getUrl());
		YAHOO.Convio.PC2.Teamraiser.SentMessages.myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSON;
		YAHOO.Convio.PC2.Teamraiser.SentMessages.myDataSource.connXhrMode = "queueRequests";
		YAHOO.Convio.PC2.Teamraiser.SentMessages.myDataSource.connMethodPost = true;
		YAHOO.Convio.PC2.Teamraiser.SentMessages.myDataSource.responseSchema = {
				resultsList: "getSentMessagesResponse.messageItem",
				metaFields: {
					totalRecords: "getSentMessagesResponse.totalNumberResults"
				},
				fields: ["message_id", "recipients", "subject", "date"]
		};
		YAHOO.Convio.PC2.Teamraiser.SentMessages.myDataSource.doBeforeParseData = function (oRequest, oFullResponse, oCallback) {
		    if(YAHOO.lang.isUndefined(oFullResponse.getSentMessagesResponse.messageItem)) {
		    	// hack: if messageItem does not exist, insert an empty list
		    	oFullResponse.getSentMessagesResponse.messageItem = [];
		    }
		    return oFullResponse;	
		};
		
		var buildQueryString = function(state, dt) {
			if(state.pagination.page > 0) {
				YAHOO.Convio.PC2.Teamraiser.SentMessages.listCriteria.pageOffset = (state.pagination.page - 1);
			}
			return YAHOO.Convio.PC2.Teamraiser.SentMessages.getSentMessagesParams(YAHOO.Convio.PC2.Teamraiser.SentMessages.listCriteria);
		};

		var MsgCatProvider = YAHOO.Convio.PC2.Component.Content;
		// For the love of all things good and true in this Universe, let's not copy/paste this code snippet anymore.
        // See YAHOO.Convio.PC2.Component.DataTableBuilder instead!
		var myPaginator = new Paginator({
			containers         : ['lower-sent-messages-pagination-block'],
			pageLinks          : 5,
			rowsPerPage        : YAHOO.Convio.PC2.Teamraiser.SentMessages.listCriteria.pageSize,
			template           : "&nbsp;{FirstPageLink}&nbsp;{PreviousPageLink}&nbsp;{CurrentPageReport}&nbsp;{NextPageLink}&nbsp;{LastPageLink}",
			firstPageLinkLabel: "&laquo;",
            previousPageLinkLabel: "&lsaquo;",
            nextPageLinkLabel: "&rsaquo;",
            lastPageLinkLabel: "&raquo;",
			pageReportTemplate: "<b>{startRecord}-{endRecord}</b> " + MsgCatProvider.getMsgCatValue('paginator_of') + " {totalRecords}"
		});
		
		YAHOO.Convio.PC2.Teamraiser.SentMessages.Paginator = myPaginator;

		YAHOO.Convio.PC2.Teamraiser.SentMessages.Paginator = myPaginator;
		YAHOO.Convio.PC2.Teamraiser.SentMessages.Paginator.reset = function() {
            if(YAHOO.Convio.PC2.Teamraiser.SentMessages.Paginator.getTotalRecords() == 1) {
                YAHOO.Convio.PC2.Teamraiser.SentMessages.Paginator.fireEvent('changeRequest',YAHOO.Convio.PC2.Teamraiser.SentMessages.Paginator.getState({'page':1}));
            } else {
                YAHOO.Convio.PC2.Teamraiser.SentMessages.Paginator.setTotalRecords(1);
            }
        }
		var myTableConfig = {
				initialRequest         : YAHOO.Convio.PC2.Teamraiser.SentMessages.getSentMessagesParams(YAHOO.Convio.PC2.Teamraiser.SentMessages.listCriteria),
				generateRequest        : buildQueryString,
				paginationEventHandler : DataTable.handleDataSourcePagination,
				paginator              : myPaginator,
				dynamicData			   : true
		};

		try {
			YAHOO.Convio.PC2.Teamraiser.SentMessages.myDataTable = new YAHOO.widget.DataTable(
					container,
					myColumnDefs,
					YAHOO.Convio.PC2.Teamraiser.SentMessages.myDataSource, 
					myTableConfig
			);
			
		} catch(e) {
			YAHOO.log(e, 'error', 'sent.js');
		}
		
		YAHOO.Convio.PC2.Teamraiser.SentMessages.myDataTable.handleDataReturnPayload = function(oRequest, oResponse, oPayload) {
			var totalRecords = oResponse.meta.totalRecords;
			oPayload.totalRecords = totalRecords;
	    	return oPayload;
		};
		
		YAHOO.Convio.PC2.Teamraiser.SentMessages.myDataTable.onEventSelectCell = function(oArgs) {
			var target = oArgs.target;
            var column = YAHOO.Convio.PC2.Teamraiser.SentMessages.myDataTable.getColumn(target);
			var recordData = this.getRecord(target).getData();
			if(column.key == 'delete') {
				// is the trashcan, do nothing and move on
			} else {
				YAHOO.Convio.PC2.Teamraiser.getSentMessage(GetSentMessageCallback, recordData.message_id);
				YAHOO.Convio.PC2.Utils.loadView("email","compose");
				//window.location = "sentmessage.html?message_id=" + recordData.message_id;
			}
		};
		
		YAHOO.Convio.PC2.Teamraiser.SentMessages.myDataTable.subscribe("rowMouseoverEvent", YAHOO.Convio.PC2.Teamraiser.SentMessages.myDataTable.onEventHighlightRow);
		YAHOO.Convio.PC2.Teamraiser.SentMessages.myDataTable.subscribe("rowMouseoutEvent", YAHOO.Convio.PC2.Teamraiser.SentMessages.myDataTable.onEventUnhighlightRow);
		
		YAHOO.Convio.PC2.Teamraiser.SentMessages.myDataTable.setAttributeConfig("MSG_EMPTY", {value: document.getElementById('msg_cat_sent_no_sent_messages_found').innerHTML});
		YAHOO.Convio.PC2.Teamraiser.SentMessages.myDataTable.subscribe("cellClickEvent", YAHOO.Convio.PC2.Teamraiser.SentMessages.myDataTable.onEventSelectCell);
		
		YAHOO.log('Exit: loadSentMessages(' + container + ')', 'info', 'sent.js');
	}
};