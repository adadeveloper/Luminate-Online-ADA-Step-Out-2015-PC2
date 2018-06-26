var origCompanyName;

var registrationEditClick = function(e) {
    YAHOO.util.Dom.removeClass("edit-participant-info-block", "hidden-form");
    YAHOO.util.Dom.addClass("participant-info-block-container", "hidden-form");
};

function handleKeyPressedRegistrationOptionsUpdate(keyPressEvent) {
	if (keyPressEvent && keyPressEvent.keyCode === 13) {
		registrationUpdateSubmit();
    }
};

var registrationUpdateCancel = function(e) {
    cancelRegistrationUpdate();
};

function cancelRegistrationUpdate() {
	YAHOO.util.Dom.addClass("edit-participant-info-block", "hidden-form");
    YAHOO.util.Dom.removeClass("participant-info-block-container", "hidden-form");
};

var UpdateRegistrationCallback = {
    success: function(o) {
        var response = YAHOO.lang.JSON.parse(o.responseText).updateRegistrationResponse;
        var companyNameField = YAHOO.util.Dom.get("participant-company-name-field");
        
        // handle display of company selection
        if(YAHOO.lang.isString(response.companyName)) {
            origCompanyName = response.companyName;
            companyNameField.innerHTML = origCompanyName;
        } else {
        	// set to msg cat value for no company selection per UX suggestion
            origCompanyName = YAHOO.Convio.PC2.Component.Content.getMsgCatValue("dashboard_company_null_label");
            companyNameField.innerHTML = origCompanyName;
        }
        
        // handle updating of getRegistration API response object
        if(YAHOO.Convio.PC2.Component.Teamraiser.Registration.companyInformation) {
            YAHOO.Convio.PC2.Component.Teamraiser.Registration.companyInformation.companyId = response.companyId;
        } else {
            // set the company information
            YAHOO.Convio.PC2.Component.Teamraiser.Registration.companyInformation = {
                companyId: response.companyId,
                companyType: "LOCAL",
                isCompanyCoordinator: "false"
            }
        }
        
        // if the response contains a company Id, reload the Company List
        if(response.companyId){
            YAHOO.Convio.PC2.Teamraiser.getCompanyList(GetParticipantCompanyListCallback);
        }
        
        cancelRegistrationUpdate();
    },
    failure: function(o) {
        logFailure(o);
    },
    scope: YAHOO.Convio.PC2.Teamraiser
};

var registrationUpdateSubmit = function(e) {
    var regInfo = new Object();
    var valid = true;
    var newCompanyId = YAHOO.util.Dom.get("participant-company-select-list");
    var newCompanyName = YAHOO.util.Dom.get("participant-new-company-name");
    if(YAHOO.lang.isUndefined(newCompanyId) == false && YAHOO.lang.isNull(newCompanyId) == false) {
        if(YAHOO.lang.isString(newCompanyName.value) && newCompanyName.value != "") {
            regInfo.companyName = newCompanyName.value;
        } else {
            regInfo.companyId = newCompanyId.options[newCompanyId.selectedIndex].value;
        }
    } else if (YAHOO.lang.isString(newCompanyName.value) && newCompanyName.value != "") {
        regInfo.companyName = newCompanyName.value;
    } 
    if(valid) {
        YAHOO.Convio.PC2.Teamraiser.updateRegistration(UpdateRegistrationCallback, regInfo);
    }
};

var GetParticipantCompanyListCallback = {
    success: function(o) {
        var response = YAHOO.lang.JSON.parse(o.responseText).getCompanyListResponse;
        var div = "<select id=\"participant-company-select-list\" name=\"participant-company-select-list\">";
        if(YAHOO.lang.isUndefined(YAHOO.Convio.PC2.Component.Teamraiser.Registration.companyInformation) ||
                YAHOO.lang.isNull(YAHOO.Convio.PC2.Component.Teamraiser.Registration.companyInformation) || 
                YAHOO.Convio.PC2.Component.Teamraiser.Registration.companyInformation.companyId <= 0) {
            div += "<option id=\"msg_cat_company_select_none\" value=\"-1\" selected=\"selected\" value=\"-1\">Choose an existing value</option>";
        } else {
            div += "<option id=\"msg_cat_company_select_none\" value=\"-1\" value=\"-1\">Choose an existing value</option>";
        }
        // national
        if(YAHOO.lang.isArray(response.nationalItem)) {
            div += addCompanyOption("National Companies");
            for(var i=0; i<response.nationalItem.length; i++) {
                div += addCompanyItem(response.nationalItem[i])
            }
            div += addCompanyOptionEnd();
        } else {
            if(YAHOO.lang.isUndefined(response.nationalItem) == false) {
                div += addCompanyOption("National Companies");
                div += addCompanyItem(response.nationalItem);
                div += addCompanyOptionEnd();
            }
        }
        // regional
        if(YAHOO.lang.isArray(response.regionalItem)) {
            div += addCompanyOption("Regional Companies");
            for(var i=0; i<response.regionalItem.length; i++) {
                div += addCompanyItem(response.regionalItem[i])
            }
            div += addCompanyOptionEnd();
        } else {
            if(YAHOO.lang.isUndefined(response.regionalItem) == false) {
                div += addCompanyOption("Regional Companies");
                div += addCompanyItem(response.regionalItem);
                div += addCompanyOptionEnd();
            }
        }
        // local
        if(YAHOO.lang.isArray(response.companyItem)) {
            div += addCompanyOption("Local Companies");
            for(var i=0; i<response.companyItem.length; i++) {
                div += addCompanyItem(response.companyItem[i])
            }
            div += addCompanyOptionEnd();
        } else {
            if(YAHOO.lang.isUndefined(response.companyItem) == false) {
                div += addCompanyOption("Local Companies");
                div += addCompanyItem(response.companyItem);
                div += addCompanyOptionEnd();
            }
        }
        div += "</select>";
        var companyListSection = YAHOO.util.Dom.get("participant-company-list-section");
        companyListSection.innerHTML = div;
        /* This is now loaded convio_utils.getMsgCatKeys() */
        // load message catalogs
//        var keys = ["company_select_none"];
//        YAHOO.Convio.PC2.Component.Content.loadMsgCatalog(keys,"trpc");
    },
    failure: function(o) {
        logFailure(o);
    },
    scope: YAHOO.Convio.PC2.Teamraiser
};

function addCompanyOption(title) {
	return "<optgroup label=\"" + title + "\">";
};

function addCompanyOptionEnd() {
	return "</optgroup>";
};

function addCompanyItem(companyItem) {
	var div = "<option value=\"" + companyItem.companyId + "\";";
	if(YAHOO.Convio.PC2.Component.Teamraiser.Registration.companyInformation &&
			YAHOO.Convio.PC2.Component.Teamraiser.Registration.companyInformation.companyId == companyItem.companyId) {
		div += " selected=\"selected\"";
	}
	div += ">";
	div += companyItem.companyName;
	div += "</option>";
	return div;
};