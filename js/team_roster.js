YAHOO.Convio.PC2.Component.Teamraiser.TeamRoster = {

	listCriteria: {
		pageSize: 50,
		pageOffset: 0,
		sortColumn: 'log.date_sent',
		isAscending: 'false',
		filters: ""
	},
	
	getTeamRosterParams: function(listCriteria) {
		var params = "method=getTeamRoster&response_format=json";
		params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
		params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
		params += "&team_id=" + YAHOO.Convio.PC2.Component.Teamraiser.Registration.teamId;
		params += "&list_page_size=500";
		
		YAHOO.log("Returning params=" + params, 'info', 'sent.js');
		return params;
	},

	/**
	 * This method loads the sent messages
	 */
	loadTeamRoster: function(container) {
		YAHOO.log('Entry: loadTeamRoster(' + container + ')', 'info', 'sent.js');
		var DataSource = YAHOO.util.DataSource,
		DataTable  = YAHOO.widget.DataTable,
		Paginator  = YAHOO.widget.Paginator;


		this.formatName = function(elCell, oRecord, oColumn, sData) {
			var fName = oRecord.getData("firstName");
			var lName = oRecord.getData("lastName");
			var privacySettingStr = "";
			
			// show indication of anonymous registration or screen name if necessary
			var anonymous = oRecord.getData("anonymous");
			var screenname = oRecord.getData("screenname");
				
			if (anonymous && anonymous == 'true')
			{
				privacySettingStr = MsgCatProvider.getMsgCatValue('privacy_setting_team_roster_anonymous');
			}
			else if (screenname && screenname != '')
			{
				privacySettingStr = MsgCatProvider.getMsgCatValue('privacy_setting_team_roster_screenname');
				privacySettingStr = privacySettingStr.replace("{0}", screenname);
			}
			
			var nameStr = fName + " " + lName;
			if (privacySettingStr != "")
			{
				nameStr += " " + privacySettingStr;
			}
			
			elCell.innerHTML = nameStr;
//			elCell.tabIndex = -1;
			elCell.setAttribute('role','presentation');
		};
		
		this.formatNumGifts = function(elCell, oRecord, oColumn, sData) {
			var numGifts = oRecord.getData("numGifts");
			elCell.innerHTML = numGifts;
//			elCell.tabIndex = -1;
			elCell.setAttribute('role','presentation');
		};

		this.formatAmount = function(elCell, oRecord, oColumn, sData) {
			var amountObj = oRecord.getData("amount");
			elCell.innerHTML = YAHOO.Convio.PC2.Utils.formatCurrency(amountObj);
//			elCell.tabIndex = -1;
			elCell.setAttribute('role','presentation');
		};
		
		this.formatTrashcan = function(elCell, oRecord, oColumn, sData) {
			var messageId = oRecord.getData("message_id");
			elCell.innerHTML = "<a href=\"javascript: YAHOO.Convio.PC2.Teamraiser.deleteSentMessage(this.DeleteSentMessageCallback," +  messageId + ");\"><img src=\"images/trash.gif\" /></a>";
			elCell.setAttribute('role', 'presentation');
		};

		/* Column Definitions */
		var myColumnDefs = [
		                    {key: 'firstName', label:"Name", formatter: this.formatName}, 
		                    {key: 'numGifts', label:"Number of Gifts", 	 formatter: this.formatNumGifts},
		                    {key: 'amount', label:"Amount", 		 formatter: this.formatAmount}
		                    ];

		YAHOO.Convio.PC2.Component.Teamraiser.TeamRoster.myDataSource = new YAHOO.util.XHRDataSource(YAHOO.Convio.PC2.Config.Teamraiser.getUrl());
		YAHOO.Convio.PC2.Component.Teamraiser.TeamRoster.myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSON;
		YAHOO.Convio.PC2.Component.Teamraiser.TeamRoster.myDataSource.connXhrMode = "queueRequests";
		YAHOO.Convio.PC2.Component.Teamraiser.TeamRoster.myDataSource.connMethodPost = true;
		YAHOO.Convio.PC2.Component.Teamraiser.TeamRoster.myDataSource.responseSchema = {
				resultsList: "getTeamRosterResponse.teamMember",
				fields: ["firstName", "lastName", "numGifts", "amount", "anonymous", "screenname"]
		};
//		YAHOO.Convio.PC2.Component.Teamraiser.TeamRoster.myDataSource.doBeforeParseData = function (oRequest, oFullResponse, oCallback) {
//		    if(YAHOO.lang.isUndefined(oFullResponse.getSentMessagesResponse.messageItem)) {
//		    	// hack: if messageItem does not exist, insert an empty list
//		    	oFullResponse.getSentMessagesResponse.messageItem = [];
//		    }
//		    return oFullResponse;	
//		};
		
		var buildQueryString = function(state, dt) {
			if(state.pagination.page > 0) {
				YAHOO.Convio.PC2.Component.Teamraiser.TeamRoster.listCriteria.pageOffset = (state.pagination.page - 1);
			}
			return YAHOO.Convio.PC2.Component.Teamraiser.TeamRoster.getTeamRosterParams(YAHOO.Convio.PC2.Component.Teamraiser.TeamRoster.listCriteria);
		};

		var MsgCatProvider = YAHOO.Convio.PC2.Component.Content;
		var myPaginator = new Paginator({
			containers         : ['upper-sent-messages-pagination-block','lower-sent-messages-pagination-block'],
			pageLinks          : 5,
			rowsPerPage        : YAHOO.Convio.PC2.Component.Teamraiser.TeamRoster.listCriteria.pageSize,
			template           : "&nbsp;{FirstPageLink}&nbsp;{PreviousPageLink}&nbsp;{CurrentPageReport}&nbsp;{NextPageLink}&nbsp;{LastPageLink}",
			firstPageLinkLabel: "&lt;&lt;",
			previousPageLinkLabel: "&lt;",
			nextPageLinkLabel: "&gt;",
			lastPageLinkLabel: "&gt;&gt;",
			pageReportTemplate: "<b>{startRecord}-{endRecord}</b> " + MsgCatProvider.getMsgCatValue('paginator_of') + " {totalRecords}"
		});
		
		YAHOO.Convio.PC2.Component.Teamraiser.TeamRoster.Paginator = myPaginator;

		var myTableConfig = {
				initialRequest         : YAHOO.Convio.PC2.Component.Teamraiser.TeamRoster.getTeamRosterParams(YAHOO.Convio.PC2.Component.Teamraiser.TeamRoster.listCriteria),
				generateRequest        : buildQueryString,
				paginationEventHandler : DataTable.handleDataSourcePagination,
				paginator              : myPaginator,
				dynamicData			   : true
		};

		try {
			YAHOO.Convio.PC2.Component.Teamraiser.TeamRoster.myDataTable = new YAHOO.widget.DataTable(
					container,
					myColumnDefs,
					YAHOO.Convio.PC2.Component.Teamraiser.TeamRoster.myDataSource, 
					myTableConfig
			);
			
		} catch(e) {
			YAHOO.log(e, 'error', 'sent.js');
		}
		
		YAHOO.Convio.PC2.Component.Teamraiser.TeamRoster.myDataTable.handleDataReturnPayload = function(oRequest, oResponse, oPayload) {
			var totalRecords = oResponse.meta.totalRecords;
			oPayload.totalRecords = totalRecords;
	    	return oPayload;
		};
		
		YAHOO.Convio.PC2.Component.Teamraiser.TeamRoster.myDataTable.subscribe("rowMouseoverEvent", YAHOO.Convio.PC2.Component.Teamraiser.TeamRoster.myDataTable.onEventHighlightRow);
		YAHOO.Convio.PC2.Component.Teamraiser.TeamRoster.myDataTable.subscribe("rowMouseoutEvent", YAHOO.Convio.PC2.Component.Teamraiser.TeamRoster.myDataTable.onEventUnhighlightRow);
		
		YAHOO.Convio.PC2.Component.Teamraiser.TeamRoster.myDataTable.setAttributeConfig("MSG_EMPTY", {value: "No sent messages found."});
		YAHOO.Convio.PC2.Component.Teamraiser.TeamRoster.myDataTable.subscribe("cellClickEvent", YAHOO.Convio.PC2.Component.Teamraiser.TeamRoster.myDataTable.onEventSelectCell);
		
		YAHOO.log('Exit: loadTeamRoster(' + container + ')', 'info', 'sent.js');
	}
};

/**
 * Closes this window.
 * @member Utils
 */
function closeWin() {
	var isIE = (navigator.appName.indexOf("Microsoft") != -1 && navigator.appName.indexOf("Mac") == -1);

	if (isIE) {
		window.close();
	} else {
		self.close();
	}
};

function addLogger() {
    if(YAHOO.Convio.PC2.Config.isLoggingEnabled()) {
        var myLogReader = new YAHOO.widget.LogReader("yui-logging");
    }
};

function doValidation() {
    YAHOO.Convio.PC2.Config.validate();
    //YAHOO.Convio.PC2.Config.Teamraiser.validate();
    //YAHOO.Convio.PC2.Config.AddressBook.validate();
};

function loadComponents() {
    
    var keys = [
                'team_roster_heading','team_roster_close'
    ];
    YAHOO.Convio.PC2.Component.Content.loadMsgCatalog(keys,'trpc');
    
    var trConfig = {
        initDone: function() {
            if(YAHOO.Convio.PC2.Component.Teamraiser.Registration.teamId > 0) {
            	YAHOO.Convio.PC2.Component.Teamraiser.TeamRoster.loadTeamRoster("team-roster-block");
            }
            YAHOO.Convio.PC2.Utils.hideLoadingContainer();
            YAHOO.log('TR init finished','info','report.js');
        }
//        wrapper: 'hd-branding',
//        teamPageUrl: 'hd-teampage-link',
//        teamPageContainer: 'hd-teampage-container',
//        personalPageUrl: 'hd-personalpage-link',
//        logoutUrl: 'hd-logout-link',
//        teamName: 'hd-team-name',
//        teamProgress: {
//        	image: 'fundraising-progress-image',
//        	teamAmountValue: 'team-progress-amt-raised-value',
//        	teamGoalValue: 'team-progress-goal-value',
//        	teamPercentValue: 'team-progress-percent-value',
//        	daysLeft: 'team-progress-days-left-value'
//        }
    
    };
    YAHOO.Convio.PC2.Component.Teamraiser.initialize(trConfig);

    var consConfig = {
        name: 'hd-user-name'
    };
    //YAHOO.Convio.PC2.Component.Constituent.initialize(consConfig);
    
};