YAHOO.Convio.PC2.Component.GiftHistory = {
	
	includeDeleteColumn: true,
	includeIconColumn: true,
	
	defaultGHListCriteria: {
		pageSize: 10,
		pageOffset: 0,
		sortColumn: 'date_recorded',
		isAscending: 'false',
		totalResult: 0
	},
	
	updateTimestamp: function() {
		YAHOO.Convio.PC2.Component.GiftHistory.defaultGHListCriteria.timestamp = new Date().getTime();
    },
	
	loadContact: function(contactId) {
    	YAHOO.Convio.PC2.Views.contactIds = contactId;
    	YAHOO.Convio.PC2.Utils.loadView("email","compose");
	},
	
	loadContactView: function(id) {
    	contactId = id;
    	YAHOO.Convio.PC2.Utils.loadView("email", "contactdetails");
    },
	
	/**
	 * load gift history using default criteria
	 */
	loadDefaultPersonalGiftHistory: function(container, labels) {
		return YAHOO.Convio.PC2.Component.GiftHistory.loadPersonalGiftHistory(container, YAHOO.Convio.PC2.Component.GiftHistory.defaultGHListCriteria, true, labels, true);
	},
	
	/**
	 * load gift history using custom criteria
	 */
	loadCustomPersonalGiftHistory: function(container, listCriteria, includeDeleteColumn, labels, includeIconColumn) {
		YAHOO.Convio.PC2.Component.GiftHistory.includeIconColumn = includeIconColumn;
		return YAHOO.Convio.PC2.Component.GiftHistory.loadPersonalGiftHistory(container, listCriteria, includeDeleteColumn, labels, false);
	},
	
    /**
     * This method loads the gift history
     */
    loadPersonalGiftHistory: function(container, listCriteria, includeDeleteColumn, labels, includeContactNameLinks) {
        YAHOO.log('Entry: loadPersonalGiftHistory(' + container + ')', 'info', 'gift_history_utils.js');
            YAHOO.Convio.PC2.Component.GiftHistory.includeDeleteColumn = includeDeleteColumn;
	        var DataSource = YAHOO.util.DataSource,
	        DataTable  = YAHOO.widget.DataTable,
	        Paginator  = YAHOO.widget.Paginator;
	    
	        /* Custom Cell Formatter */
	        this.formatName = function(elCell, oRecord, oColumn, sData) {
	        	
	        	var myName = oRecord.getData("name");
	            var name = myName.first + ' ' + myName.last;
	            var id = oRecord.getData().contactId;
	            var innerHtml = '<span class="name-item" onclick="YAHOO.Convio.PC2.Component.GiftHistory.loadContactView(' + id + ');">' + name + '</span>';
	            
	            var email = oRecord.getData().email;
	            if(email && email != null) {
	            	innerHtml += '<br/><div class="set-width no-wrap"><a class="email-address" href="javascript: YAHOO.Convio.PC2.Component.GiftHistory.loadContact(' + id + ');" title="' + email + '>' + email + '</a></div>';
	            }
	            elCell.innerHTML = '<div class="set-width">' + innerHtml + '</div>';
	            // Bug 49465 - Deleted Contacts Names should not be links in Gift History
	            var myContactsMap = YAHOO.Convio.PC2.Utils.ensureArray(YAHOO.Convio.PC2.Data.ContactsMap);
	            if(includeContactNameLinks
                       && myContactsMap[oRecord.getData().contactId]){
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
	            var rejected= oRecord.getData("rejected");
	            if(rejected == "true") {
	                YAHOO.util.Dom.addClass(elCell,'rejected-gift');
	            }
	
	            var isRecurring = oRecord.getData("isRecurring") == "true";
	            if(isRecurring) {
	                elCell.innerHTML = elCell.innerHTML + "&nbsp;<img src=\"images/recurring.gif\"/>";
	            }
	            var paymentType = oRecord.getData("paymentType");
	            if(paymentType != "CREDIT" && paymentType != "E_PAYMENT") {
	                elCell.innerHTML = elCell.innerHTML + "&nbsp;<span class='misc-item'>(" 
	                	+ YAHOO.Convio.PC2.Utils.formatPaymentType(paymentType.toLowerCase()) 
	                	+ ")</span>";
	            }
	            var receiptUrl = oRecord.getData("receiptUrl");
	            if(receiptUrl != null) {
	                elCell.innerHTML = elCell.innerHTML + "&nbsp;<span class='misc-item'>(<a target='_new' href='" 
	                    + receiptUrl + "'>" + YAHOO.util.Dom.get('msg_cat_view_receipt_label').innerHTML + "</a>)</span>";
	            }
	            
	            elCell.tabIndex = -1;
	            elCell.setAttribute('role', 'presentation');
	        };
	        
	        this.formatUnconfirmed = function(elCell, oRecord, oColumn, sData) {
	        	var isOnline = oRecord.getData('isOnlineGift');
	        	var isConfirmed = oRecord.getData('confirmed');
	        	var item = YAHOO.util.Dom.get('msg_cat_gift_status_online_label').innerHTML;
	        	if(isOnline == 'false') {
	        		item = YAHOO.util.Dom.get('msg_cat_gift_status_offline_label').innerHTML;
	        		if(isConfirmed == "true") {
	        			item += ' '+ YAHOO.util.Dom.get('msg_cat_gift_status_confirmed_label').innerHTML;
	        		} else {
	        			item += ' '+ YAHOO.util.Dom.get('msg_cat_gift_status_unconfirmed_label').innerHTML;
	        		}
	        	}
	        	elCell.innerHTML = item;
	        	elCell.tabIndex = -1;
	        	elCell.setAttribute('role', 'presentation');
	        };
	        
	        this.formatIcons = function(elCell, oRecord, oColumn, sData) {
	            var isConfirmed = oRecord.getData("confirmed");
	            var isAcknowledged = oRecord.getData("acknowledged");
	            var id = oRecord.getData("id");
	            var innerHtml = "";
	            var email = oRecord.getData('email'); 
	            var MsgCatProvider = YAHOO.Convio.PC2.Component.Content;
	            if(isAcknowledged && isAcknowledged == "false") {
	            	var contactId = oRecord.getData("contactId");
	            	var acknowledgeGiftTitle = MsgCatProvider.getMsgCatValue('report_acknowledge_gift_title_label');
	            	innerHtml += '<span class="follow-up icon-align" id="acknowledge-' + contactId + '-' + id + '"><a href="javascript:YAHOO.Convio.PC2.Component.GiftHistory.acknowledgeGift(' + contactId;
	            	if(!YAHOO.lang.isUndefined(email) && email != null) {
	            		innerHtml += ', true';
	            	}
	            	innerHtml += ');">';
	            	innerHtml += '<img src="images/followup.png" title="' + acknowledgeGiftTitle + '" onmouseout="this.src=\'images/followup.png\';" onmouseover="this.src=\'images/followup-hover.png\';" alt="Follow Up" /></a></span>';
	            }
	            if(YAHOO.Convio.PC2.Component.GiftHistory.includeDeleteColumn) {
	            	if(isConfirmed == "false") {
	            		var deleteGiftTitle = MsgCatProvider.getMsgCatValue('report_delete_gift_title_label');
	            		innerHtml += '<span class="icon-align"><a href="javascript: deleteGift(' + oRecord.getData().id +');" class="delete">';
	            		innerHtml += '<img src="images/trash.gif" title="' + deleteGiftTitle + '" alt="Delete" /></a></span>';
	            	}
	        	}
	            elCell.innerHTML = innerHtml;
	            elCell.tabIndex = -1;
                elCell.setAttribute('role', 'presentation');
	        };
	    
	        /* Column Definitions */
	        var myColumnDefs = [];
	        var index = 0;
	        myColumnDefs[index++] = {label: labels.donor, formatter: this.formatName, minWidth: 130}; 
	        myColumnDefs[index++] = {label: labels.amount, formatter: this.formatAmount};
	        myColumnDefs[index++] = {label: labels.notes, key:"giftMessage", minWidth: 250};
	        myColumnDefs[index++] = {label: labels.date, formatter: this.formatDate, minWidth: 56};
	        if(YAHOO.Convio.PC2.Data.TeamraiserConfig && YAHOO.Convio.PC2.Data.TeamraiserConfig.indicateUnconfirmed == 'true') {
	        	myColumnDefs[index++] = {label:"", formatter: this.formatUnconfirmed, key: "confirmed", minWidth: 0};
	        }
	        if(YAHOO.Convio.PC2.Component.GiftHistory.includeIconColumn) {
	          myColumnDefs[index++] = {label: labels.actions, formatter: this.formatIcons};
	        }
	    
	        YAHOO.Convio.PC2.Component.GiftHistory.myDataSource = new YAHOO.util.XHRDataSource(YAHOO.Convio.PC2.Config.Teamraiser.getUrl());
	        YAHOO.Convio.PC2.Component.GiftHistory.myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSON;
	        YAHOO.Convio.PC2.Component.GiftHistory.myDataSource.connXhrMode = "queueRequests";
	        YAHOO.Convio.PC2.Component.GiftHistory.myDataSource.connMethodPost = true;
	        YAHOO.Convio.PC2.Component.GiftHistory.myDataSource.responseSchema = {
	                resultsList: "getGiftsResponse.gift",
	                metaFields: {
	                    totalRecords: "getGiftsResponse.totalNumberResults"
	                },
	                fields: ["name",{key: "giftAmount", parser: "currency"},"giftMessage",
	                         "date", "confirmed", "rejected", "isRecurring",
	                         "paymentType", "contactId", "id", "isOnlineGift","receiptUrl", 
	                         "contactId", "acknowledged", "email"
	                         ]
	        };
	        YAHOO.Convio.PC2.Component.GiftHistory.myDataSource.doBeforeParseData = function (oRequest, oFullResponse, oCallback) {
			    if(YAHOO.lang.isUndefined(oFullResponse.getGiftsResponse.gift)) {
			    	// hack: if gift does not exist, insert an empty list
			    	oFullResponse.getGiftsResponse.gift = [];
			    }
			    return oFullResponse;	
			};
	    
	        var buildQueryString = function(state, dt) {
	            listCriteria.pageOffset = (state.pagination.page - 1);
	            return YAHOO.Convio.PC2.Teamraiser.getGiftsParams(listCriteria);
	        };
	    
	        var MsgCatProvider = YAHOO.Convio.PC2.Component.Content;
	        // For the love of all things good and true in this Universe, let's not copy/paste this code snippet anymore.
	        // See YAHOO.Convio.PC2.Component.DataTableBuilder instead!
	        var myPaginator = new Paginator({
	            containers         : ['lower_donation_history_pagination_block'],
	            pageLinks          : 5,
	            rowsPerPage        : listCriteria.pageSize,
	            template           : "&nbsp;{FirstPageLink}&nbsp;{PreviousPageLink}&nbsp;{CurrentPageReport}&nbsp;{NextPageLink}&nbsp;{LastPageLink}",
	            firstPageLinkLabel: "&laquo;",
	            previousPageLinkLabel: "&lsaquo;",
	            nextPageLinkLabel: "&rsaquo;",
	            lastPageLinkLabel: "&raquo;",
	            pageReportTemplate: "<b>{startRecord}-{endRecord}</b> " + MsgCatProvider.getMsgCatValue('paginator_of') + " {totalRecords}"
	        });
	        
	        YAHOO.Convio.PC2.Component.GiftHistory.Paginator = myPaginator;
	        YAHOO.Convio.PC2.Component.GiftHistory.Paginator.reset = function() {
	        	if(YAHOO.Convio.PC2.Component.GiftHistory.Paginator.getTotalRecords() == 1) {
	        		YAHOO.Convio.PC2.Component.GiftHistory.Paginator.fireEvent("changeRequest", YAHOO.Convio.PC2.Component.GiftHistory.Paginator.getState({"page":1}));
	            } else {
	            	YAHOO.Convio.PC2.Component.GiftHistory.Paginator.setTotalRecords(1);
	            }
	        };
	    
	        var myTableConfig = {
	                initialRequest         : YAHOO.Convio.PC2.Teamraiser.getGiftsParams(listCriteria),
	                generateRequest        : buildQueryString,
	                paginationEventHandler : DataTable.handleDataSourcePagination,
	                paginator              : myPaginator,
	                dynamicData			   : true
	        };
                
        this.loadTable = function(){
            try {
                YAHOO.Convio.PC2.Component.GiftHistory.myDataTable = new YAHOO.widget.DataTable(
                        container,
                        myColumnDefs,
                        YAHOO.Convio.PC2.Component.GiftHistory.myDataSource, 
                        myTableConfig
                );
            } catch(e) {
                YAHOO.log(e, 'error', 'gift_history_utils.js');
            }
        
            YAHOO.Convio.PC2.Component.GiftHistory.myDataTable.handleDataReturnPayload = function(oRequest, oResponse, oPayload) {
                var totalRecords = oResponse.meta.totalRecords;
                oPayload.totalRecords = totalRecords;
                return oPayload;
            };

            YAHOO.Convio.PC2.Component.GiftHistory.myDataTable.setAttributeConfig("MSG_EMPTY", {value: YAHOO.Convio.PC2.Component.Content.getMsgCatValue('report_no_donations_found')});
	}

        if(includeContactNameLinks){
            // Bug 49465 - Deleted Contacts Names should not be links in Gift History
            // if the user has not been to the compose page load all the contacts now
            Y.use("pc2-compose-functions", function(Y) {
                    ensureContactsLoaded();
            });
            YAHOO.Convio.PC2.Utils.require("pc2:allContactsLoaded", this.loadTable);
        } else {
            this.loadTable();
        }
        
	YAHOO.log('Exit: loadPersonalGiftHistory(' + container + ')', 'info', 'gift_history_utils.js');
    }
};
