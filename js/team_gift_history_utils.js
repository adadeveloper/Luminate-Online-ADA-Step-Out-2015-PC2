YAHOO.Convio.PC2.Component.TeamGiftHistory = {

	
	defaultGHListCriteria: {
		pageSize: 10,
		pageOffset: 0,
		sortColumn: 'date_recorded',
		isAscending: 'false',
		totalResult: 0
	},
	
	updateTimestamp: function() {
		YAHOO.Convio.PC2.Component.TeamGiftHistory.defaultGHListCriteria.timestamp = new Date().getTime();
    },
	
	loadContact: function(contactId) {
    	YAHOO.Convio.PC2.Views.contactIds = contactId;
    	YAHOO.Convio.PC2.Utils.loadView("email","compose");
	},
	
	loadContactView: function(id) {
		contactId = id;
    	YAHOO.Convio.PC2.Utils.loadView("email","contactDetails");
	},
	
	/**
	 * load gift history using default criteria
	 */
	loadDefaultTeamGiftHistory: function(container) {
		return YAHOO.Convio.PC2.Component.TeamGiftHistory.loadTeamGiftHistory(container, YAHOO.Convio.PC2.Component.TeamGiftHistory.defaultGHListCriteria, true, true);
	},
	
	/**
	 * load gift history using custom criteria
	 */
	loadCustomTeamGiftHistory: function(container, listCriteria, incluldeDeleteColumn) {
		return YAHOO.Convio.PC2.Component.TeamGiftHistory.loadTeamGiftHistory(container, listCriteria, incluldeDeleteColumn, false);
	},
	
    /**
     * This method loads the gift history
     */
    loadTeamGiftHistory: function(container, listCriteria, incluldeDeleteColumn, includeContactNameLinks) {
        YAHOO.log('Entry: loadTeamGiftHistory(' + container + ')', 'info', 'team_gift_history_utils.js');
            var DataSource = YAHOO.util.DataSource,
            DataTable  = YAHOO.widget.DataTable,
            Paginator  = YAHOO.widget.Paginator;
        
            this.formatName = function(elCell, oRecord, oColumn, sData) {
                var myName = oRecord.getData("name");
                var contactId = oRecord.getData().contactId;
                var name = myName.first + ' ' + myName.last;
                
                // Bug 49465 - Deleted Contacts Names should not be links in Gift History
                var myContactsMap = YAHOO.Convio.PC2.Utils.ensureArray(YAHOO.Convio.PC2.Data.ContactsMap);
                if(includeContactNameLinks
		            && YAHOO.lang.isUndefined(contactId) == false 
                            && YAHOO.lang.isNull(contactId) == false
                            && myContactsMap[contactId]) {
                    //var innerHtml = '<span onclick="YAHOO.Convio.PC2.Component.TeamGiftHistory.loadContactView(' + contactId + ');" class="name-item">' + name + "</span>";
                	var innerHtml = '<span class="name-item">' + name + '</span>';
                    var email = oRecord.getData().email;
    	            if(email && email != '') {
    	            	innerHtml += '<br/><div class="set-width no-wrap"><a class="email-address" href="javascript: YAHOO.Convio.PC2.Component.TeamGiftHistory.loadContact(' + contactId + ');" title="' + email + '">' + email + '</a></div>';
    	            }
                    elCell.innerHTML = innerHtml;
                } else {
                    elCell.innerHTML = name;
                }
                elCell.tabIndex = -1;
                elCell.setAttribute('role','presentation');
            };
        
            this.formatDate = function(elCell, oRecord, oColumn, sData) {
                var dateObj = oRecord.getData("date");
                elCell.innerHTML = "<span class=\"date-item\">" + formatDateFromMillis(dateObj) + "</span>";
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
                    elCell.innerHTML = "<a href=\"javascript: deleteTeamGift(" + oRecord.getData().id +");\"><img src=\"images/trash.gif\" /></a>";
                    elCell.tabIndex = -1;
                    elCell.setAttribute('role', 'presentation');
                }
            };
        
            /* Column Definitions */
            var myTeamDonColumnDefs = [];
            myTeamDonColumnDefs[0] = {label: YAHOO.Convio.PC2.Component.Content.getMsgCatValue('report_donor_label'), formatter: this.formatName};
            myTeamDonColumnDefs[1] = {label: YAHOO.Convio.PC2.Component.Content.getMsgCatValue('report_amount_label'), formatter: this.formatAmount};
            myTeamDonColumnDefs[2] = {label: YAHOO.Convio.PC2.Component.Content.getMsgCatValue('report_notes_label'), key:"giftMessage", minWidth: 800};
            myTeamDonColumnDefs[3] = {label: YAHOO.Convio.PC2.Component.Content.getMsgCatValue('report_date_label'), formatter: this.formatDate, minWidth: 100};
            if (incluldeDeleteColumn && YAHOO.Convio.PC2.Component.Teamraiser.Registration.aTeamCaptain == 'true') {
                    myTeamDonColumnDefs[4] = {label:"", formatter: this.formatTrashcan};
            }
                                
        
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
                             "paymentType", "contactId", "id",
                             "email"
                             ]
            };
            YAHOO.Convio.PC2.Component.TeamGiftHistory.myDataSource.doBeforeParseData = function (oRequest, oFullResponse, oCallback) {
                        if(YAHOO.lang.isUndefined(oFullResponse.getGiftsResponse.gift)) {
                            // hack: if gift does not exist, insert an empty list
                            oFullResponse.getGiftsResponse.gift = [];
                        }
                        return oFullResponse;	
                    };
        
            var buildTeamGiftQueryString = function(state, dt) {
            	try {
            		YAHOO.Convio.PC2.Component.TeamGiftHistory.updateTimestamp();
            		listCriteria.pageOffset = (state.pagination.page - 1);
            		return YAHOO.Convio.PC2.Teamraiser.getTeamGiftsParams(listCriteria);
                } catch(e) {
                	YAHOO.log(e, 'error', 'team_gift_history_utils.js');
                }
            };
        
            var MsgCatProvider = YAHOO.Convio.PC2.Component.Content;
            // For the love of all things good and true in this Universe, let's not copy/paste this code snippet anymore.
            // See YAHOO.Convio.PC2.Component.DataTableBuilder instead!
            var myTeamDonPaginator = new Paginator({
                containers         : ['lower_team_donation_history_pagination_block'],
                pageLinks          : 5,
                rowsPerPage        : listCriteria.pageSize,
                template           : "&nbsp;{FirstPageLink}&nbsp;{PreviousPageLink}&nbsp;{CurrentPageReport}&nbsp;{NextPageLink}&nbsp;{LastPageLink}",
                firstPageLinkLabel: "&laquo;",
                previousPageLinkLabel: "&lsaquo;",
                nextPageLinkLabel: "&rsaquo;",
                lastPageLinkLabel: "&raquo;",
                pageReportTemplate: "<b>{startRecord}-{endRecord}</b> " + MsgCatProvider.getMsgCatValue('paginator_of') + " {totalRecords}"
            });
            
            YAHOO.Convio.PC2.Component.TeamGiftHistory.Paginator = myTeamDonPaginator;
            YAHOO.Convio.PC2.Component.TeamGiftHistory.Paginator.reset = function() {
                    if(YAHOO.Convio.PC2.Component.TeamGiftHistory.Paginator.getTotalRecords() == 1) {
                            YAHOO.Convio.PC2.Component.TeamGiftHistory.Paginator.fireEvent("changeRequest", YAHOO.Convio.PC2.Component.TeamGiftHistory.Paginator.getState({"page":1}));
                } else {
                    YAHOO.Convio.PC2.Component.TeamGiftHistory.Paginator.setTotalRecords(1);
                }
            };
        
            var myTeamDonTableConfig = {
                    initialRequest         : YAHOO.Convio.PC2.Teamraiser.getTeamGiftsParams(listCriteria),
                    generateRequest        : buildTeamGiftQueryString,
                    paginationEventHandler : DataTable.handleDataSourcePagination,
                    paginator              : myTeamDonPaginator,
                    dynamicData			   : true
            };
        
        
        this.loadTable = function(){
            try {
                YAHOO.Convio.PC2.Component.TeamGiftHistory.myDataTable = new YAHOO.widget.DataTable(
                    container,
                    myTeamDonColumnDefs,
                    YAHOO.Convio.PC2.Component.TeamGiftHistory.myDataSource, 
                    myTeamDonTableConfig
                );
            } catch(e) {
                YAHOO.log(e, 'error', 'team_gift_history_utils.js');
            }
			
            YAHOO.Convio.PC2.Component.TeamGiftHistory.myDataTable.handleDataReturnPayload = function(oRequest, oResponse, oPayload) {
                var totalRecords = oResponse.meta.totalRecords;
                oPayload.totalRecords = totalRecords;
                return oPayload;
            };
			
            YAHOO.Convio.PC2.Component.TeamGiftHistory.myDataTable.setAttributeConfig("MSG_EMPTY", {value: YAHOO.Convio.PC2.Component.Content.getMsgCatValue('report_no_donations_found')});
	    }

	if(includeContactNameLinks){
		// Bug 49465 - Deleted Contacts Names should not be links in Gift History
        // if the user has not been to the compose page load all the contacts now
        if(includeContactNameLinks) {
            Y.use("pc2-compose-functions", function(Y) {
            	ensureContactsLoaded();
            });
        }
        YAHOO.Convio.PC2.Utils.require("pc2:allContactsLoaded", this.loadTable);
    } else {
        this.loadTable();
    }
	
        YAHOO.log('Exit: loadTeamGiftHistory(' + container + ')', 'info', 'team_gift_history_utils.js');
    }
};
