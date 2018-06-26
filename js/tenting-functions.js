var tentmateId;

var UpdateTentingStatusCallback = {
	success: function(o) {
		var response = YAHOO.lang.JSON.parse(o.responseText).updateTentingStatusResponse;
		var tentmateStatus = response.tentmateStatus;
		updateTentingStatus(tentmateStatus);
        loadTentmate();
	},
	failure: function(o) {
	},
	scope: YAHOO.Convio.PC2.Teamraiser
};

var declineTent = function() {
	var updateInfo = new Object();
	updateInfo.updateType = "decline";
	YAHOO.Convio.PC2.Teamraiser.updateTentingStatus(UpdateTentingStatusCallback, updateInfo);
};

var randomTent = function() {
	var updateInfo = new Object();
	updateInfo.updateType = "random";
	YAHOO.Convio.PC2.Teamraiser.updateTentingStatus(UpdateTentingStatusCallback, updateInfo);
};

var resetTent = function() {
	var updateInfo = new Object();
	updateInfo.updateType = "reset";
	YAHOO.Convio.PC2.Teamraiser.updateTentingStatus(UpdateTentingStatusCallback, updateInfo);
};

var loadTentmate = function() {
    var getTentmateCallback = {
        success: function(o) {
            var tentmate = YAHOO.lang.JSON.parse(o.responseText).getTentmateResponse.record;
            if(tentmate != null) {
                var name = tentmate.name.first + " " + tentmate.name.last;
                var tentmateEl = YAHOO.util.Dom.get("tenting_your_tentmate");
                tentmateEl.innerHTML = '<a target="_blank" href="' + tentmate.personalPageUrl + '">' + name + '</a>';
                YAHOO.util.Dom.removeClass("tentmate-info","hidden-form");
            }
        },
        failure: function(o) {
            YAHOO.log("Caught error loading tentmate: " + o.responseText, "error", "tenting.js");
        },
        cache: false,
        scope: this
    };
    
    // Need to make this a new API call. Constituent won't let you access another user.
    YAHOO.Convio.PC2.Teamraiser.getTentmate(getTentmateCallback);
    
};

var tentmateSelect = function(selectedTentmateId) {
	tentmateId = selectedTentmateId
	clearTentmateSection();
	show_pc2_element('bd-tenting-invite');
	show_pc2_element('bd-tenting-invite2');
	show_pc2_element('bd-message-tent');
};

var tentmateReply = function() {
	show_pc2_element('bd-tenting-reply');
	show_pc2_element('bd-tenting-reply2');
	show_pc2_element('bd-message-tent');
};

var clearTentmateSection = function() {
	hide_pc2_element('bd-tenting-invite');
	hide_pc2_element('bd-tenting-reply');
	hide_pc2_element('bd-tenting-invite2');
	hide_pc2_element('bd-tenting-reply2');
	hide_pc2_element('tenting-search');
    hide_pc2_element('tenting-search-results');
    hide_pc2_element('tentmate-info');
	hide_pc2_element('bd-message-tent');
};

var sendTentInvite = function() {
	var updateInfo = new Object();
	updateInfo.updateType = "invite";
	updateInfo.message = getTentingMessageContent();
	updateInfo.tentmateId = tentmateId;
	YAHOO.Convio.PC2.Teamraiser.updateTentingStatus(UpdateTentingStatusCallback, updateInfo);
};

var cancelTentInvite = function() {
	clearTentmateSection();
	show_pc2_element('tenting-search');
    show_pc2_element('tenting-search-results');
};

var declineTentInvite = function() {
	var updateInfo = new Object();
	updateInfo.updateType = "reject";
	updateInfo.message = getTentingMessageContent();
	updateInfo.tentmateId = YAHOO.Convio.PC2.Data.Registration.tentmateConsId
	YAHOO.Convio.PC2.Teamraiser.updateTentingStatus(UpdateTentingStatusCallback, updateInfo);
};

var acceptTentInvite = function() {
	var updateInfo = new Object();
	updateInfo.updateType = "accept";
	updateInfo.message = getTentingMessageContent();
	updateInfo.tentmateId = YAHOO.Convio.PC2.Data.Registration.tentmateConsId
	YAHOO.Convio.PC2.Teamraiser.updateTentingStatus(UpdateTentingStatusCallback, updateInfo);
};

var getTentingMessageContent = function() {
	return YAHOO.util.Dom.get('tenting-message-content').value;
};

var updateTentingStatus = function(status) {
	hideAllTentingElements();
	
	var statusText = "Unknown";
    if(status == "0") {
        statusText = "Minimum not met";
    }
    else if(status == "1") {
        statusText = "Ready to select tentmate";
        show_pc2_element('bd-decline-tent');
    	show_pc2_element('bd-random-tent');
    	show_pc2_element('tenting-search');
        show_pc2_element('tenting-search-results');
    } 
    else if(status == "2") {
        statusText = "Tent declined";
    	show_pc2_element('bd-random-tent');
    	show_pc2_element('bd-reset-tent');
    }
    else if(status == "3") {
        statusText = "Random tent";
        show_pc2_element('bd-decline-tent');
    	show_pc2_element('bd-reset-tent');
    }
    else if(status == "4") {
        statusText = "Waiting for approval";
    }
    else if(status == "5") {
        statusText = "Request pending, fundraising minimum not met";
    }
    else if(status == "6") {
        statusText = "Request pending";
        tentmateReply();
    }
    else if(status == "7") {
        statusText = "Request accepted, fundraising minimum not met";
    }
    else if(status == "8") {
        statusText = "Tentmate not yet eligible";
    }
    else if(status == "9") {
        statusText = "Tentmate approved";
    }
    var tentingStatusEl = YAHOO.util.Dom.get("tenting_your_status");
    tentingStatusEl.innerHTML = statusText;
};

var hideAllTentingElements = function() {
	hide_pc2_element('tenting-search');
    hide_pc2_element('tenting-search-results');
	hide_pc2_element('bd-decline-tent');
	hide_pc2_element('bd-random-tent');
	hide_pc2_element('bd-reset-tent');
    clearTentmateSection();
};

YAHOO.Convio.PC2.Component.TentingSearch = {
	    
	updateTimestamp: function() {
	    YAHOO.Convio.PC2.Component.TentingSearch.contactsListCriteria.timestamp = new Date().getTime();
	},

	updateSearch: function(filter) {
	    YAHOO.log("Entered updateSearch","info","contacts.js");
	    
	
	    var el = null;
	    
	    el = YAHOO.util.Dom.get("search_first_name");
	    YAHOO.Convio.PC2.Component.TentingSearch.contactsListCriteria.firstName = el.value;
	    
	    el = YAHOO.util.Dom.get("search_last_name");
	    YAHOO.Convio.PC2.Component.TentingSearch.contactsListCriteria.lastName = el.value;
	    
	    el = YAHOO.util.Dom.get("search_email");
	    YAHOO.Convio.PC2.Component.TentingSearch.contactsListCriteria.email = el.value;
	    
	    el = YAHOO.util.Dom.get("search_race_number");
	    YAHOO.Convio.PC2.Component.TentingSearch.contactsListCriteria.raceNumber = el.value;
	        
	    
	    if(!YAHOO.Convio.PC2.Component.TentingSearch.DataTable) {
	        // Load the search table
	        YAHOO.Convio.PC2.Component.TentingSearch.loadContacts("tenting-contacts-list");
	    } else {
	        // Update the search params
	        if(YAHOO.Convio.PC2.Component.TentingSearch.Paginator.getTotalRecords() == 1) {
	            YAHOO.Convio.PC2.Component.TentingSearch.Paginator.fireEvent('changeRequest',YAHOO.Convio.PC2.Component.TentingSearch.Paginator.getState({'page':1}));
	        } else {
	            YAHOO.Convio.PC2.Component.TentingSearch.Paginator.setTotalRecords(1);
	        }
	    }
	},
	
	contactsListCriteria: {
		pageSize: 10,
		pageOffset: 0,
		sortColumn: 'last_name',
		isAscending: 'true',
		totalResult: 0
	},
	
	/**
	 * This method loads the gift history
	 */
	loadContacts: function(container) {
	    YAHOO.log('Entry: loadContacts(' + container + ')', 'info', 'contacts_utils.js');
	    var DataSource = YAHOO.util.DataSource,
	    DataTable  = YAHOO.widget.DataTable,
	    Paginator  = YAHOO.widget.Paginator;
	
	
	    /* Custom Cell Formatter */
	    this.formatName = function(elCell, oRecord, oColumn, sData) {
	        elCell.innerHTML = sData.first + ' ' + sData.last;
	        elCell.tabIndex = -1;
	        elCell.setAttribute('role','presentation');
	    };
	    
	    /* Custom Cell Formatter */
	    this.formatStatus = function(elCell, oRecord, oColumn, sData) {
	        elCell.innerHTML = YAHOO.util.Dom.get('msg_cat_tenting_status_' + sData).innerHTML;
	        elCell.tabIndex = -1;
	        elCell.setAttribute('role','presentation');
	    };
	    
	    this.formatView = function(elCell, oRecord, oColumn, sData) {
	        elCell.innerHTML = '<a target="_blank" href="' + sData + '">View</a>';
	        elCell.tabIndex = -1;
	        elCell.setAttribute('role','presentation');
	    };
	    
	    this.formatSelect = function(elCell, oRecord, oColumn, sData) {
	        elCell.innerHTML = '<a href="javascript:tentmateSelect(' + sData + ');">Select</a>';
	        elCell.tabIndex = -1;
	        elCell.setAttribute('role','presentation');
	    };
	
	    /* Column Definitions */
	    var myColumnDefs = [
	        {label:"Name", key:"name", formatter: this.formatName, className: "contact-list-name"},
	        {label:"Status", key:"tentmateStatus", formatter: this.formatStatus, className: "contact-list-status"},
	        {label:" ", key:"personalPageUrl", formatter: this.formatView, className: "contact-list-action"},
	        {label:" ", key:"consId", formatter: this.formatSelect, className: "contact-list-action"}
	    ];
	
	    YAHOO.Convio.PC2.Component.TentingSearch.DataSource = new YAHOO.util.XHRDataSource(YAHOO.Convio.PC2.Config.Teamraiser.getUrl());
	    YAHOO.Convio.PC2.Component.TentingSearch.DataSource.responseType = YAHOO.util.DataSource.TYPE_JSON;
	    YAHOO.Convio.PC2.Component.TentingSearch.DataSource.connXhrMode = "queueRequests";
	    YAHOO.Convio.PC2.Component.TentingSearch.DataSource.connMethodPost = true;
	    YAHOO.Convio.PC2.Component.TentingSearch.DataSource.responseSchema = {
	            resultsList: "getTentingSearchResponse.record",
	            metaFields: {
	                totalRecords: "getTentingSearchResponse.totalNumberResults"
	            },
	            fields: ["consId","name","eventId","tentmateStatus","personalPageUrl"]
	    };
	    
	    YAHOO.Convio.PC2.Component.TentingSearch.DataSource.doBeforeParseData = function (oRequest, oFullResponse, oCallback) {
		    if(YAHOO.lang.isUndefined(oFullResponse.getTentingSearchResponse.record)) {
		    	// hack: if messageItem does not exist, insert an empty list
		    	oFullResponse.getTentingSearchResponse.record = [];
		    }
		    return oFullResponse;	
		};
	
	    var buildQueryString = function(state, dt) {
	        YAHOO.Convio.PC2.Component.TentingSearch.contactsListCriteria.pageOffset = (state.pagination.page - 1);
	        return YAHOO.Convio.PC2.Teamraiser.getTentingSearchParams(YAHOO.Convio.PC2.Component.TentingSearch.contactsListCriteria);
	    };
	
	    var MsgCatProvider = YAHOO.Convio.PC2.Component.Content;
	    // For the love of all things good and true in this Universe, let's not copy/paste this code snippet anymore.
        // See YAHOO.Convio.PC2.Component.DataTableBuilder instead!
	    var myPaginator = new Paginator({
	        containers         : ['lower_tenting_contacts_pagination_block'],
	        pageLinks          : 5,
	        rowsPerPage        : YAHOO.Convio.PC2.Component.TentingSearch.contactsListCriteria.pageSize,
	        template           : "&nbsp;{FirstPageLink}&nbsp;{PreviousPageLink}&nbsp;{CurrentPageReport}&nbsp;{NextPageLink}&nbsp;{LastPageLink}",
	        firstPageLinkLabel: "&laquo;",
	        previousPageLinkLabel: "&lsaquo;",
	        nextPageLinkLabel: "&rsaquo;",
	        lastPageLinkLabel: "&raquo;",
	        pageReportTemplate: "<b>{startRecord}-{endRecord}</b> " + MsgCatProvider.getMsgCatValue('paginator_of') + " {totalRecords}"
	        //updateOnChange: true
	    });
	    
	    YAHOO.Convio.PC2.Component.TentingSearch.Paginator = myPaginator;
	
	    var myTableConfig = {
	            initialRequest         : YAHOO.Convio.PC2.Teamraiser.getTentingSearchParams(YAHOO.Convio.PC2.Component.TentingSearch.contactsListCriteria),
	            generateRequest        : buildQueryString,
	            paginationEventHandler : DataTable.handleDataSourcePagination,
	            paginator              : myPaginator,
	            dynamicData			   : true
	    };
	
	    try {
	        YAHOO.Convio.PC2.Component.TentingSearch.DataTable = new YAHOO.widget.DataTable(
	                container,
	                myColumnDefs,
	                YAHOO.Convio.PC2.Component.TentingSearch.DataSource, 
	                myTableConfig
	        );
	    } catch(e) {
	        YAHOO.log(e, 'error', 'contacts_utils.js');
	    }
	
	    YAHOO.Convio.PC2.Component.TentingSearch.DataTable.handleDataReturnPayload = function(oRequest, oResponse, oPayload) {
	        var totalRecords = oResponse.meta.totalRecords;
	        oPayload.totalRecords = totalRecords;
	        return oPayload;
	    };
	
	    YAHOO.log('Exit: loadContacts(' + container + ')', 'info', 'contacts_utils.js');
    }
};