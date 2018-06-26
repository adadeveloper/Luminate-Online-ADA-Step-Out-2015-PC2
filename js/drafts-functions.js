var deleteMessageId;
var DeleteDraftConfirmCallback = {
	success: function(o){
		var response = YAHOO.lang.JSON.parse(o.responseText).deleteDraftResponse;
		var recSet = YAHOO.Convio.PC2.Teamraiser.Drafts.myDataTable.getRecordSet();
		var records = YAHOO.Convio.PC2.Teamraiser.Drafts.myDataTable.getRecordSet().getRecords();
		var messageId = response.messageId;
		for(var i=YAHOO.Convio.PC2.Teamraiser.Drafts.Paginator.getStartIndex(); i<records.length; i++) {
			var record = records[i];
			if(YAHOO.lang.isUndefined(record) == false && 
					record.getData().message_id == messageId) {
				YAHOO.Convio.PC2.Teamraiser.Drafts.myDataTable.deleteRow(i);
				break;
			}
		}
	},
	failure: function(o){
		logFailure(o);
	},
	scope: YAHOO.Convio.Teamraiser
}

var deleteDraftConfirm = function(messageId) {
	deleteMessageId = messageId;
	YAHOO.Convio.PC2.Teamraiser.Drafts.DeleteConfirmDialog.show();
};

YAHOO.Convio.PC2.Teamraiser.Drafts = {

	listCriteria: {
		pageSize: 50,
		pageOffset: 0,
		sortColumn: 'modify_date',
		isAscending: 'false'
	},
	
	getDraftsParams: function(listCriteria) {
		var params = "method=getDrafts&response_format=json";
		params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
		params += YAHOO.Convio.PC2.Utils.getListCriteriaParams(listCriteria);
		params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
		params += "&timestamp=" + new Date().getTime();
		
		YAHOO.log("Returning params=" + params, 'info', 'drafts.js');
		return params;
	},

	/**
	 * This method loads the drafts
	 */
	loadDrafts: function(container) {
		YAHOO.log('Entry: loadDrafts(' + container + ')', 'info', 'drafts.js');
		var DataSource = YAHOO.util.DataSource,
		DataTable  = YAHOO.widget.DataTable,
		Paginator  = YAHOO.widget.Paginator;


		this.formatRecipients = function(elCell, oRecord, oColumn, sData) {
			var recipients = oRecord.getData("recipients");
			
			//elCell.innerHTML = "<div class=\"no-wrap\">" + recipients + "</div>";
			elCell.innerHTML = (YAHOO.lang.isString(recipients) ? recipients : "");
//			elCell.tabIndex = -1;
			elCell.setAttribute('role','presentation');
		};
		
		this.formatSubject = function(elCell, oRecord, oColumn, sData) {
			var subject = oRecord.getData("subject");
			elCell.innerHTML = YAHOO.lang.isString(subject) ? subject : "";
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
			elCell.innerHTML = "<a href='javascript: deleteDraftConfirm(" + messageId + ");' class='delete'><img src='images/trash.gif' alt='Delete' /></a>";
//			elCell.tabIndex = -1;
			elCell.setAttribute('role', 'presentation');
		};

		/* Column Definitions */
		var MsgCatProvider = YAHOO.Convio.PC2.Component.Content;
		var myColumnDefs = [
		                    {key: 'recipient', label: MsgCatProvider.getMsgCatValue("drafts_data_table_column_recipients"), formatter: this.formatRecipients, minWidth: 300, className: 'cursor-pointer blue-text'}, 
		                    {key: 'subject', label: MsgCatProvider.getMsgCatValue("drafts_data_table_column_subject"), 	   formatter: this.formatSubject, minWidth: 800, className: 'cursor-pointer blue-text'},
		                    {key: 'date', label: MsgCatProvider.getMsgCatValue("drafts_data_table_column_date"), 		   formatter: this.formatDate, className: 'cursor-pointer'},
		                    {key: 'delete', label:"", 			   formatter: this.formatTrashcan}
		                    ];

		YAHOO.Convio.PC2.Teamraiser.Drafts.myDataSource = new YAHOO.util.XHRDataSource(YAHOO.Convio.PC2.Config.Teamraiser.getUrl());
		YAHOO.Convio.PC2.Teamraiser.Drafts.myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSON;
		YAHOO.Convio.PC2.Teamraiser.Drafts.myDataSource.connXhrMode = "queueRequests";
		YAHOO.Convio.PC2.Teamraiser.Drafts.myDataSource.connMethodPost = true;
		YAHOO.Convio.PC2.Teamraiser.Drafts.myDataSource.responseSchema = {
				resultsList: "getDraftsResponse.messageItem",
				metaFields: {
					totalRecords: "getDraftsResponse.totalNumberResults"
				},
				fields: ["message_id", "recipients", "subject", "date"]
		};
		YAHOO.Convio.PC2.Teamraiser.Drafts.myDataSource.doBeforeParseData = function (oRequest, oFullResponse, oCallback) {
		    if(YAHOO.lang.isUndefined(oFullResponse.getDraftsResponse.messageItem)) {
		    	// hack: if messageItem does not exist, insert an empty list
		    	oFullResponse.getDraftsResponse.messageItem = [];
		    }
		    return oFullResponse;	
		};
		
		var buildQueryString = function(state, dt) {
			YAHOO.Convio.PC2.Teamraiser.Drafts.listCriteria.pageOffset = (state.pagination.page - 1);
			return YAHOO.Convio.PC2.Teamraiser.Drafts.getDraftsParams(YAHOO.Convio.PC2.Teamraiser.Drafts.listCriteria);
		};

		var MsgCatProvider = YAHOO.Convio.PC2.Component.Content;
		// For the love of all things good and true in this Universe, let's not copy/paste this code snippet anymore.
        // See YAHOO.Convio.PC2.Component.DataTableBuilder instead!
		var myPaginator = new Paginator({
			containers         : ['upper_drafts_pagination_block','lower_drafts_pagination_block'],
			pageLinks          : 5,
			rowsPerPage        : YAHOO.Convio.PC2.Teamraiser.Drafts.listCriteria.pageSize,
			template           : "&nbsp;{FirstPageLink}&nbsp;{PreviousPageLink}&nbsp;{CurrentPageReport}&nbsp;{NextPageLink}&nbsp;{LastPageLink}",
			firstPageLinkLabel: "&laquo;",
			previousPageLinkLabel: "&lsaquo;",
			nextPageLinkLabel: "&rsaquo;",
			lastPageLinkLabel: "&raquo;",
			pageReportTemplate: "<b>{startRecord}-{endRecord}</b> " + MsgCatProvider.getMsgCatValue('paginator_of') + " {totalRecords}"
		});
		
		YAHOO.Convio.PC2.Teamraiser.Drafts.Paginator = myPaginator;
		YAHOO.Convio.PC2.Teamraiser.Drafts.Paginator.reset = function() {
			if(YAHOO.Convio.PC2.Teamraiser.Drafts.Paginator.getTotalRecords() == 1) {
				YAHOO.Convio.PC2.Teamraiser.Drafts.Paginator.fireEvent('changeRequest',YAHOO.Convio.PC2.Teamraiser.Drafts.Paginator.getState({'page':1}));
			} else {
				YAHOO.Convio.PC2.Teamraiser.Drafts.Paginator.setTotalRecords(1);
			}
		};
		var myTableConfig = {
				initialRequest         : YAHOO.Convio.PC2.Teamraiser.Drafts.getDraftsParams(YAHOO.Convio.PC2.Teamraiser.Drafts.listCriteria),
				generateRequest        : buildQueryString,
				paginationEventHandler : DataTable.handleDataSourcePagination,
				paginator              : myPaginator,
				dynamicData			   : true
		};

		try {
			YAHOO.Convio.PC2.Teamraiser.Drafts.myDataTable = new YAHOO.widget.DataTable(
					container,
					myColumnDefs,
					YAHOO.Convio.PC2.Teamraiser.Drafts.myDataSource, 
					myTableConfig
			);
			
		} catch(e) {
			YAHOO.log(e, 'error', 'drafts.js');
		}
		
		YAHOO.Convio.PC2.Teamraiser.Drafts.myDataTable.handleDataReturnPayload = function(oRequest, oResponse, oPayload) {
			var totalRecords = oResponse.meta.totalRecords;
			oPayload.totalRecords = totalRecords;
	    	return oPayload;
		};
		
		YAHOO.Convio.PC2.Teamraiser.Drafts.myDataTable.onEventSelectCell = function(oArgs) {
			var target = oArgs.target;
			var column = YAHOO.Convio.PC2.Teamraiser.Drafts.myDataTable.getColumn(target);
			var recordData = this.getRecord(target).getData();
			if(column.key == 'delete') {
				// is the trashcan, do nothing and move on
			} else {
				draftId = recordData.message_id;
				YAHOO.Convio.PC2.Teamraiser.getDraft(GetDraftCallback, recordData.message_id);
				YAHOO.Convio.PC2.Utils.loadView("email", "compose");
				//window.location = "compose.html?message_id=" + recordData.message_id;
			}
		};
		
		YAHOO.Convio.PC2.Teamraiser.Drafts.myDataTable.subscribe("rowMouseoverEvent", YAHOO.Convio.PC2.Teamraiser.Drafts.myDataTable.onEventHighlightRow);
		YAHOO.Convio.PC2.Teamraiser.Drafts.myDataTable.subscribe("rowMouseoutEvent", YAHOO.Convio.PC2.Teamraiser.Drafts.myDataTable.onEventUnhighlightRow);
		YAHOO.Convio.PC2.Teamraiser.Drafts.myDataTable.subscribe("cellClickEvent", YAHOO.Convio.PC2.Teamraiser.Drafts.myDataTable.onEventSelectCell);
		YAHOO.Convio.PC2.Teamraiser.Drafts.myDataTable.setAttributeConfig("MSG_EMPTY", {value: document.getElementById('msg_cat_drafts_no_drafts_found').innerHTML});
		
		YAHOO.log('Exit: loadDrafts(' + container + ')', 'info', 'drafts.js');
	}
};
