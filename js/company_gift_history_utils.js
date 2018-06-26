YAHOO.Convio.PC2.Component.TeamGiftHistory = {

	ghListCriteria: {
		pageSize: 25,
		pageOffset: 0,
		sortColumn: 'date_recorded',
		isAscending: 'false',
		totalResult: 0
	},
	
	loadContact: function(contactId) {
		window.location = "contact_details.html?contact_id=" + contactId;
	},
	
    /**
     * This method loads the gift history
     */
    loadTeamGiftHistory: function(container) {
        YAHOO.log('Entry: loadTeamGiftHistory(' + container + ')', 'info', 'team_gift_history_utils.js');
        var DataSource = YAHOO.util.DataSource,
        DataTable  = YAHOO.widget.DataTable,
        Paginator  = YAHOO.widget.Paginator;
    
    
        this.formatName = function(elCell, oRecord, oColumn, sData) {
            var myName = oRecord.getData("name");
            var name = myName.first + ' ' + myName.last;
            elCell.innerHTML = "<a href=\"javascript: YAHOO.Convio.PC2.Component.TeamGiftHistory.loadContact(" + oRecord.getData().contactId + ");\" class=\"name-item\">" + name + "</a>";
            elCell.tabIndex = -1;
            elCell.setAttribute('role','presentation');
        };
    
        this.formatDate = function(elCell, oRecord, oColumn, sData) {
            var dateObj = oRecord.getData("date");
            var datePair = dateObj.split('T');
            var dateItems = datePair[0].split('-');
            elCell.innerHTML = "<span class=\"date-item\">" + dateItems[1]+'-'+dateItems[2]+'-'+dateItems[0] + "</span>";
            elCell.tabIndex = -1;
            elCell.setAttribute('role','presentation');
        };
    
        this.formatAmount = function(elCell, oRecord, oColumn, sData) {
            var amount = YAHOO.Convio.PC2.Utils.formatCurrency(oRecord.getData("giftAmount"));
            elCell.innerHTML = amount;
            var isRecurring = oRecord.getData("isRecurring") == "true";
            if(isRecurring) {
                elCell.innerHTML = elCell.innerHTML + "&nbsp;<img src=\"images/recurring.gif\"/>";
            }
            var paymentType = oRecord.getData("paymentType");
            if(paymentType != "CREDIT" && paymentType != "E_PAYMENT") {
                elCell.innerHTML = elCell.innerHTML + "&nbsp;(<span class=\"misc-item\">" 
                	+ YAHOO.Convio.PC2.Utils.formatPaymentType(paymentType.toLowerCase()) 
                	+ "</span>)";
            }
            elCell.tabIndex = -1;
            elCell.setAttribute('role', 'presentation');
        };
        
        this.formatTrashcan = function(elCell, oRecord, oColumn, sData) {
            var isConfirmed = oRecord.getData("confirmed");
            if(isConfirmed == "false") {
                elCell.innerHTML = "<a href=\"javascript: void(0);\"><img src=\"images/trash.gif\" /></a>";
                elCell.tabIndex = -1;
                elCell.setAttribute('role', 'presentation');
            }
        };
    
        /* Column Definitions */
        var myColumnDefs = [
                            {label:"Donor", formatter: this.formatName}, 
                            {label:"Amount", formatter: this.formatAmount},
                            {label:"Notes", key:"giftMessage", minWidth: 800},
                            {label:"Date", formatter: this.formatDate, minWidth: 100},
                            {label:"", formatter: this.formatTrashcan}
                            ];
    
        YAHOO.Convio.PC2.Component.TeamGiftHistory.myDataSource = new YAHOO.util.XHRDataSource(YAHOO.Convio.PC2.Config.Teamraiser.getUrl());
        YAHOO.Convio.PC2.Component.TeamGiftHistory.myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSON;
        YAHOO.Convio.PC2.Component.TeamGiftHistory.myDataSource.connXhrMode = "queueRequests";
        YAHOO.Convio.PC2.Component.TeamGiftHistory.myDataSource.connMethodPost = true;
        YAHOO.Convio.PC2.Component.TeamGiftHistory.myDataSource.responseSchema = {
                resultsList: "getGiftsResponse.gift",
                metaFields: {
                    totalRecords: "getGiftsResponse.totalNumberResults"
                },
                fields: ["name",{key: "giftAmount", parser: "currency"},"giftMessage",
                         "date", "confirmed", "isRecurring",
                         "paymentType", "contactId"
                         ]
        };
        YAHOO.Convio.PC2.Component.TeamGiftHistory.myDataSource.doBeforeParseData = function (oRequest, oFullResponse, oCallback) {
		    if(YAHOO.lang.isUndefined(oFullResponse.getGiftsResponse.gift)) {
		    	// hack: if gift does not exist, insert an empty list
		    	oFullResponse.getGiftsResponse.gift = [];
		    }
		    return oFullResponse;	
		};
    
        var buildQueryString = function(state, dt) {
            YAHOO.Convio.PC2.Component.TeamGiftHistory.ghListCriteria.pageOffset = (state.pagination.page - 1);
            return YAHOO.Convio.PC2.Teamraiser.getTeamGiftsParams(YAHOO.Convio.PC2.Component.TeamGiftHistory.ghListCriteria);
        };
    
        var MsgCatProvider = YAHOO.Convio.PC2.Component.Content;
        // For the love of all things good and true in this Universe, let's not copy/pasting this code snippet anymore.
        // See YAHOO.Convio.PC2.Component.DataTableBuilder instead!
        var myPaginator = new Paginator({
            containers         : ['lower_donation_history_pagination_block'],
            pageLinks          : 5,
            rowsPerPage        : YAHOO.Convio.PC2.Component.TeamGiftHistory.ghListCriteria.pageSize,
            template           : "&nbsp;{FirstPageLink}&nbsp;{PreviousPageLink}&nbsp;{CurrentPageReport}&nbsp;{NextPageLink}&nbsp;{LastPageLink}",
            firstPageLinkLabel: "&laquo;",
            previousPageLinkLabel: "&lsaquo;",
            nextPageLinkLabel: "&rsaquo;",
            lastPageLinkLabel: "&raquo;",
            pageReportTemplate: "<b>{startRecord}-{endRecord}</b> " + MsgCatProvider.getMsgCatValue('paginator_of') + " {totalRecords}"
        });
    
        var myTableConfig = {
                initialRequest         : YAHOO.Convio.PC2.Teamraiser.getTeamGiftsParams(YAHOO.Convio.PC2.Component.TeamGiftHistory.ghListCriteria),
                generateRequest        : buildQueryString,
                paginationEventHandler : DataTable.handleDataSourcePagination,
                paginator              : myPaginator,
                dynamicData			   : true
        };
    
        try {
            YAHOO.Convio.PC2.Component.TeamGiftHistory.myDataTable = new YAHOO.widget.DataTable(
                    container,
                    myColumnDefs,
                    YAHOO.Convio.PC2.Component.TeamGiftHistory.myDataSource, 
                    myTableConfig
            );
        } catch(e) {
            YAHOO.log(e, 'error', 'team_gift_history_utils.js');
        }
    
        YAHOO.Convio.PC2.Component.TeamGiftHistory.myDataTable.handleDataReturnPayload = function(oRequest, oResponse, oPayload) {
            var totalRecords = oResponse.meta.totalRecords;
            oPayload.totalRecords = totalRecords;
            return oPayload;
        };
        
        YAHOO.Convio.PC2.Component.TeamGiftHistory.myDataTable.setAttributeConfig("MSG_EMPTY", {value: "No donations found."});
        YAHOO.log('Exit: loadTeamGiftHistory(' + container + ')', 'info', 'team_gift_history_utils.js');
    }
};
