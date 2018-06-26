// stores the prefix
var shortcutPrefix;
var shortcutText;
var shortcutDefault;
var origTeamName;
var origCompanyName;
var origTeamDivision;
var origTeamPassword;
var origRecruitingGoal;

function setTeamEditorContent(content) {
    var ed = tinyMCE.get("team_page_rich_text");
    ed.setContent(content);
};

function getTeamEditorContent() {
    var ed = tinyMCE.get("team_page_rich_text");
    return ed.getContent();
};

var GetTeamPageInfoCallback = {
    success: function(o) {
        var response = YAHOO.lang.JSON.parse(o.responseText).getTeamPageResponse;
        if(YAHOO.lang.isUndefined(response.teamPage)) {
            YAHOO.log("Empty team page info!", "warn", "team_page.js");
        }

        var teamPage = response.teamPage; 
        var pageTitle = teamPage.pageTitle;
        if(YAHOO.lang.isUndefined(pageTitle) == false) {
            YAHOO.util.Dom.get("team_page_title").value = pageTitle;
        }
        var richTextEnabled = "true" == teamPage.richTextEnabled;

        if(richTextEnabled == true) {
            var richText = teamPage.richText;
            if(YAHOO.lang.isUndefined(richText) == false && YAHOO.lang.isString(richText)) {
                setTeamEditorContent(richText);
            }
        } else {
            var headline1 = teamPage.headline1;
            var text1 = teamPage.text1;
        
            if(YAHOO.lang.isUndefined(headline1) == false) {
                YAHOO.util.Dom.get("team_page_headline1").innerHTML = headline1;
            }
            if(YAHOO.lang.isUndefined(text1) == false) {
                YAHOO.util.Dom.get("team_page_text1").innerHTML = text1;
            }

            var headline2 = teamPage.headline2;
            var text2 = teamPage.text2;
        
            if(YAHOO.lang.isUndefined(headline2) == false) {
                YAHOO.util.Dom.get("team_page_headline2").innerHTML = headline2;
            }
            if(YAHOO.lang.isUndefined(text2) == false) {
                YAHOO.util.Dom.get("team_page_text2").innerHTML = text2;
            }

            var headline3 = teamPage.headline3;
            var text3 = teamPage.text3;

            if(YAHOO.lang.isUndefined(headline3) == false) {
                YAHOO.util.Dom.get("team_page_headline3").innerHTML = headline3;
            }
            if(YAHOO.lang.isUndefined(text3) == false) {
                YAHOO.util.Dom.get("team_page_text3").innerHTML = text3;
            }
        }
    },

    failure: function(o) {
        logFailure(o);
    },

    scope: YAHOO.Convio.PC2.Teamraiser
};

var UpdateTeamPageInfo = {
    buildTeamPageInfo : function() {
        var teampageinfo = new Object();
        teampageinfo.richText = getTeamEditorContent();
        return teampageinfo;
    },

    execute: function() {
        var teampageinfo = UpdateTeamPageInfo.buildTeamPageInfo();
        YAHOO.Convio.PC2.Teamraiser.updateTeamPageInfo(UpdateTeamPageInfoCallback, teampageinfo);
    }
};

var UpdateTeamPageInfoCallback = {
    success: function(o) {
	
		// hide any previously revealed error messages
		updateTeamMessages();
	
        updateTeamMessages("teampage-save-success");
    },
    failure: function(o) {
        logFailure(o);
        var response = YAHOO.lang.JSON.parse(o.responseText).errorResponse;
        if(response == undefined){
            response = YAHOO.lang.JSON.parse(o.responseText).teamraiserErrorResponse;
        }
        
        if(response.code == "2647") {
            updateTeamMessages("teampage-page-invalid-html-tag");
            setTeamEditorContent(response.body);
        } else {
            updateTeamMessages("teampage-save-failure");
        }
    },
    scope: YAHOO.Convio.PC2.Teamraiser
};

var teampageMessages = ["teampage-save-success","teampage-save-failure","teampage-shortcut-save-success","teampage-shortcut-save-failure",
                "teampage-preview-failure","teampage-page-invalid-html-tag"];
var updateTeamMessages = function(message) {
    for(var i=0; i<teampageMessages.length; i++) {
        var messageName = teampageMessages[i];
        if(messageName == message) {
            YAHOO.util.Dom.removeClass(messageName, "hidden-form");
        } else {
            YAHOO.util.Dom.addClass(messageName, "hidden-form");
        }
    }
};

var GetTeamShortcutCallback = {
    success: function(o) {
        var response = YAHOO.lang.JSON.parse(o.responseText).getTeamShortcutResponse;
        updateTeamShortcut(response);
    },

    failure: function(o) {
        logFailure(o);
    },

    scope: YAHOO.Convio.PC2.Teamraiser
};

var UpdateTeamShortcutCallback = {
    success: function(o) {
        
        var response = YAHOO.lang.JSON.parse(o.responseText).updateTeamShortcutResponse;
        if(YAHOO.lang.isUndefined(response.shortcutItem)) {
            YAHOO.log("Empty shortcut information", "warn", "team_page.js");
        }
        updateTeamShortcut(response);
        cancelTeamShortcut();
        
        updateTeamMessages("teampage-shortcut-save-success");
    },

    failure: function(o) {
        var error = YAHOO.lang.JSON.parse(o.responseText).errorResponse;
        YAHOO.util.Dom.get("teampage-shortcut-save-failure-message").innerHTML = error.message;
        updateTeamMessages("teampage-shortcut-save-failure");
    },

    scope: YAHOO.Convio.PC2.Teamraiser
};

function updateTeamShortcut(response) {
    if(YAHOO.lang.isUndefined(response.shortcutItem)) {
        YAHOO.log("Empty shortcut information", "warn", "team_page.js");
    }
    shortcutPrefix = response.shortcutItem.prefix;
    var prefixText = response.shortcutItem.text;
    
    shortcutText = "";
    shortcutDefault = response.shortcutItem.defaultUrl
    var displayValue = shortcutDefault;
    if(YAHOO.lang.isUndefined(prefixText) == false && YAHOO.lang.isString(prefixText)) {
        displayValue = shortcutPrefix;
        shortcutText = prefixText;
    }
    YAHOO.util.Dom.get("teampage_shortcut_link").innerHTML = displayValue;
    YAHOO.util.Dom.get("teampage_shortcut_text").innerHTML = shortcutText;
    YAHOO.util.Dom.get("teampage_shortcut_input").value = shortcutText;
    YAHOO.util.Dom.get("teampage_view_shortcut").href = displayValue + shortcutText;
};

function editTeamShortcut() {
    // hide the edit link
    YAHOO.util.Dom.addClass("teampage_permalink_edit", "hidden-form");
    YAHOO.util.Dom.removeClass("msg_cat_team_page_shortcut_edit2", "hidden-form");
    YAHOO.util.Dom.addClass("teampage_shortcut_text", "hidden-form");
    if(YAHOO.lang.isUndefined(shortcutText) || shortcutText == "") {
        YAHOO.util.Dom.get("teampage_shortcut_link").innerHTML = shortcutPrefix;
    }
    // show the save/cancel links
    YAHOO.util.Dom.removeClass("teampage_permalink_save_cancel", "hidden-form");
    YAHOO.util.Dom.removeClass("teampage_shortcut_input_block", "hidden-form");
        
};

function cancelTeamShortcut() {
    // show the edit link
    YAHOO.util.Dom.removeClass("teampage_permalink_edit", "hidden-form");
    YAHOO.util.Dom.addClass("msg_cat_team_page_shortcut_edit2", "hidden-form");
    YAHOO.util.Dom.removeClass("teampage_shortcut_text", "hidden-form");
    // hide the save/cancel links
    YAHOO.util.Dom.addClass("teampage_permalink_save_cancel", "hidden-form");
    YAHOO.util.Dom.addClass("teampage_shortcut_input_block", "hidden-form");
    if(YAHOO.lang.isUndefined(shortcutText) || shortcutText == "") {
        YAHOO.util.Dom.get("teampage_shortcut_link").innerHTML = shortcutDefault;
    }
    // replace the typed in text with the original text
    YAHOO.util.Dom.get("teampage_shortcut_input").value = shortcutText;
};

function saveTeamShortcut() {
    var element = YAHOO.util.Dom.get("teampage_shortcut_input");
    var shortcutText = element.value;
    YAHOO.Convio.PC2.Teamraiser.updateTeamShortcut(UpdateTeamShortcutCallback, shortcutText);
};

function hendleKeyPressedTeamShortcut(keyPressEvent) {
    if (keyPressEvent && keyPressEvent.keyCode === 13) {
    	saveTeamShortcut();
    }
};

var updateTeamPhotoError = function(err) {
    YAHOO.util.Dom.get("team_photo_upload_error_message").innerHTML = err;
    if("" == err) {
        hide_pc2_element("team_photo_upload_error_message");
    } else {
        show_pc2_element("team_photo_upload_error_message");
    }
}

// Team Photo Methods
var UploadTeamPhotoCallback = {
    upload: function(o) {
      try {
        var text = o.responseText;
        var beginIndex = text.indexOf("{");
        var endIndex = text.indexOf("</pre>");
        if(endIndex == -1) {
            endIndex = o.responseText.indexOf("</PRE>");
            if(endIndex == -1) {
                endIndex = o.responseText.length;
            }
        }
        if(beginIndex == -1) {
            beginIndex = 0;
        }
        var responseText = o.responseText.substring(beginIndex, endIndex);

        var response = YAHOO.lang.JSON.parse(responseText).uploadTeamPhotoResponse;
        if(YAHOO.lang.isUndefined(response.photoItem) || YAHOO.lang.isNull(response.photoItem)) {
        	updateTeamPhotoError(response.message);
        } else {
            var uploadFile = YAHOO.util.Dom.get("teampage-photo-upload-block");
            if(YAHOO.lang.isUndefined(uploadFile) == false && uploadFile != null) {
                uploadFile.innerHTML = uploadFile.innerHTML;
            }
            YAHOO.util.Dom.removeClass("msg_cat_team_photo_upload_success", "hidden-form");
            YAHOO.Convio.PC2.Teamraiser.getTeamPhoto(GetTeamPhotoCallback);
        }
      }catch(e) {
          YAHOO.util.Dom.removeClass("msg_cat_team_photo_upload_generic_error", "hidden-form");
      }
    }
};

var GetTeamPhotoCallback = {
    success: function(o) {
        var response = YAHOO.lang.JSON.parse(o.responseText).getTeamPhotoResponse;
        var img = null;
        var removeSection = null;
        if(response.photoItem.id == "1") {
            TeamUpdatePhoto(response.photoItem);
        }
    },
    failure: function(o) {
        logFailure(o);
    },
    scope: YAHOO.Convio.PC2.Teamraiser
};

var RemoveTeamPhotoCallback = {
    upload: function(o) {
        var beginIndex = o.responseText.indexOf("{");
        var endIndex = o.responseText.indexOf("</pre>");
        if(endIndex == -1) {
            endIndex = o.responseText.indexOf("</PRE>");
            if(endIndex == -1) {
                endIndex = o.responseText.length;
            }
        }
        if(beginIndex == -1) {
            beginIndex = 0;
        }
        var responseText = o.responseText.substring(beginIndex, endIndex);
        var response = YAHOO.lang.JSON.parse(responseText).removeTeamPhotoResponse;
        var img = null;
        var removeSection;
        var captionSection = null;
        if(response.photoItem.id == "1") {
            TeamUpdatePhoto(null);
            YAHOO.util.Dom.removeClass("msg_cat_team_photo_upload_success", "hidden-form");
            var uploadFile = YAHOO.util.Dom.get("teampage-photo-upload-block");
            if(YAHOO.lang.isUndefined(uploadFile) == false && uploadFile != null) {
                uploadFile.innerHTML = uploadFile.innerHTML;
            }
        }
    }
};

var TeamUpdatePhoto = function(photoItem) {
    var img = YAHOO.util.Dom.get("teampage-photo-thumbnail-example");
    var isPhotoItemUrlDefined = 
        (photoItem != null) && 
        (!YAHOO.lang.isUndefined(photoItem.thumbnailUrl) || !YAHOO.lang.isUndefined(photoItem.originalUrl) || !YAHOO.lang.isUndefined(photoItem.customUrl));
        
    if(img != null && isPhotoItemUrlDefined) {
        // prefer the thumbnail URL if available
    	var photoUrl = !YAHOO.lang.isUndefined(photoItem.originalUrl) ? photoItem.originalUrl : photoItem.customUrl;
        img.src = !YAHOO.lang.isUndefined(photoItem.thumbnailUrl) ? photoItem.thumbnailUrl : photoUrl;
        YAHOO.util.Dom.removeClass("teampage-photo-remove-section", "hidden-form");
        YAHOO.util.Dom.removeClass("teampage-photo-thumbnail-example", "hidden-form");
        YAHOO.util.Dom.addClass("msg_cat_team_photo_upload_no_image", "hidden-form");
        if(YAHOO.lang.isString(photoItem.caption)) {
            YAHOO.util.Dom.get("teampage_graphic_caption").value = photoItem.caption;
        }
    } 
    else {
        img.src = "";
        YAHOO.util.Dom.addClass("teampage-photo-remove-section", "hidden-form");
        YAHOO.util.Dom.addClass("teampage-photo-thumbnail-example", "hidden-form");
        YAHOO.util.Dom.removeClass("msg_cat_team_photo_upload_no_image", "hidden-form");
        YAHOO.util.Dom.get("teampage_graphic_caption").value = "";
    }
};

var onTeamUploadButtonClick = function(e){
    var caption = YAHOO.util.Dom.get("teampage_graphic_caption").value;
    hide_pc2_element("msg_cat_team_photo_upload_success");
    hide_pc2_element("msg_cat_team_photo_upload_content_type_error");
    hide_pc2_element("msg_cat_team_photo_upload_dimensions_error");
    hide_pc2_element("msg_cat_team_photo_upload_generic_error");
    updateTeamPhotoError("");
    YAHOO.Convio.PC2.Teamraiser.uploadTeamPhoto(UploadTeamPhotoCallback, "teampage-photo-upload-form", caption);
};

var onTeamRemoveButtonClick = function(e) {
    hide_pc2_element("msg_cat_team_photo_upload_success");
    hide_pc2_element("msg_cat_team_photo_upload_content_type_error");
    hide_pc2_element("msg_cat_team_photo_upload_dimensions_error");
    hide_pc2_element("msg_cat_team_photo_upload_generic_error");
    updateTeamPhotoError("");
    YAHOO.Convio.PC2.Teamraiser.removeTeamPhoto(RemoveTeamPhotoCallback, "graphic-upload-remove-form");
};

var teamEditClick = function(e) {
    YAHOO.util.Dom.removeClass("edit-team-info-block", "hidden-form");
    YAHOO.util.Dom.addClass("team-info-block", "hidden-form");
};

var UpdateTeamInformationCallback = {
    success: function(o) {
        var response = YAHOO.lang.JSON.parse(o.responseText).updateTeamInformationResponse;
        origTeamName = response.teamName;
        if(YAHOO.Convio.PC2.Component.Teamraiser.TeamName) {
            var teamNameField1 = YAHOO.util.Dom.get(YAHOO.Convio.PC2.Component.Teamraiser.TeamName);
            teamNameField1.innerHTML = origTeamName;
        }
        var teamNameField2 = YAHOO.util.Dom.get("team-name-field");
        teamNameField2.innerHTML = origTeamName;
        
        var companyNameField = YAHOO.util.Dom.get("company-name-field");
        if(YAHOO.lang.isString(response.companyName)) {
            origCompanyName = response.companyName;
            companyNameField.innerHTML = origCompanyName;
        } else {
            origCompanyName = "";
            companyNameField.innerHTML = origCompanyName;
        }
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
            YAHOO.Convio.PC2.Teamraiser.getCompanyList(GetCompanyListCallback);
        }
        if(YAHOO.lang.isUndefined(response.password) == false && YAHOO.lang.isNull(response.password) == false) {
            if(YAHOO.lang.isString(response.password)) {
                origTeamPassword = response.password;
            } else {
                origTeamPassword = "";
            }
            YAHOO.util.Dom.get("team-password").innerHTML = origTeamPassword;
        }
        if(YAHOO.lang.isString(response.divisionName)) {
            origDivisionName = response.divisionName;

            var newDivision = YAHOO.util.Dom.get("team-divisions-list");
            var config = YAHOO.Convio.PC2.Data.TeamraiserConfig;
            if(config.teamDivisionsEnabled == "true" && YAHOO.lang.isUndefined(newDivision) == false
                    && YAHOO.lang.isNull(newDivision) == false) {
                origDivisionName = newDivision.options[newDivision.selectedIndex].innerHTML;
            }

            YAHOO.util.Dom.get("team-division").innerHTML = origDivisionName;
        }
        if(YAHOO.lang.isString(response.recruitingGoal)) {
            origRecruitingGoal = response.recruitingGoal;
            YAHOO.util.Dom.get("recruiting-goal").innerHTML = origRecruitingGoal;
        }
        cancelTeamUpdate();
    },
    failure: function(o) {
        logFailure(o);

    	var response = YAHOO.lang.JSON.parse(o.responseText).errorResponse;
    	// if we had a duplicate name, show an error message in the update team name section
    	if (response && (response.code == "2682" || response.code == "2630") ) {
    		YAHOO.util.Dom.removeClass("msg_cat_team_name_duplicate_error", "hidden-form");
    	}
    },
    scope: YAHOO.Convio.PC2.Teamraiser
};

var teamUpdateSubmit = function(e) {
    // hide error messages
    YAHOO.util.Dom.addClass("msg_cat_team_edit_not_number_error", "hidden-form");
    YAHOO.util.Dom.addClass("msg_cat_team_name_duplicate_error", "hidden-form");

    var teamInfo = new Object();
    var valid = true;

    var newTeamName = YAHOO.util.Dom.get("new-team-name").value;
    teamInfo.teamName = newTeamName;

    var newCompanyId = YAHOO.util.Dom.get("company-select-list");
    if(YAHOO.lang.isUndefined(newCompanyId) == false && YAHOO.lang.isNull(newCompanyId) == false) {
        var newCompanyName = YAHOO.util.Dom.get("new-company-name");
        if(YAHOO.lang.isString(newCompanyName.value) && newCompanyName.value != "") {
            teamInfo.companyName = newCompanyName.value;
        } else {
            teamInfo.companyId = newCompanyId.options[newCompanyId.selectedIndex].value;
        }
    } else {
        var newCompanyName = YAHOO.util.Dom.get("new-company-name");
        if(YAHOO.lang.isString(newCompanyName.value) && newCompanyName.value != "") {
            teamInfo.companyName = newCompanyName.value;
        }
    }

    var config = YAHOO.Convio.PC2.Data.TeamraiserConfig;
    var newTeamPassword = YAHOO.util.Dom.get("new-team-password");
    if(config.teamPasswordAllowed == "true" && YAHOO.lang.isUndefined(newTeamPassword) == false
            && YAHOO.lang.isNull(newTeamPassword) == false) {
        teamInfo.password = newTeamPassword.value;
    }

    var newDivision = YAHOO.util.Dom.get("team-divisions-list");
    if(config.teamDivisionsEnabled == "true" && YAHOO.lang.isUndefined(newDivision) == false
            && YAHOO.lang.isNull(newDivision) == false) {
        teamInfo.division = newDivision.options[newDivision.selectedIndex].value;
    }

    var newRecruitingGoal = YAHOO.util.Dom.get("new-recruiting-goal");
    if(config.recruitingGoalsEnabled == "true" && YAHOO.lang.isUndefined(newRecruitingGoal) == false
            && YAHOO.lang.isNull(newRecruitingGoal) == false) {
        if(isNaN(newRecruitingGoal.value)) {
            valid = false;
            YAHOO.util.Dom.removeClass("msg_cat_team_edit_not_number_error", "hidden-form");
        } else {
            teamInfo.recruitingGoal = newRecruitingGoal.value;
        }
    }

    if(valid) {
        YAHOO.Convio.PC2.Teamraiser.updateTeamInformation(UpdateTeamInformationCallback, teamInfo);
    }
};

function handleKeyPressedTeamOptionsUpdate(keyPressEvent) {
	if (keyPressEvent && keyPressEvent.keyCode === 13) {
		teamUpdateSubmit();
    }
};

var teamUpdateCancel = function(e) {
    cancelTeamUpdate();
};

function cancelTeamUpdate() {
    YAHOO.util.Dom.addClass("edit-team-info-block", "hidden-form");
    YAHOO.util.Dom.removeClass("team-info-block", "hidden-form");
    YAHOO.util.Dom.addClass("msg_cat_team_edit_not_number_error", "hidden-form");
    YAHOO.util.Dom.addClass("msg_cat_team_name_duplicate_error", "hidden-form");
    
    var teamNameField = YAHOO.util.Dom.get("new-team-name");
    teamNameField.value = origTeamName;
    
    var companyNameField = YAHOO.util.Dom.get("new-company-name");
    companyNameField.value = "";
    
    if(YAHOO.Convio.PC2.Utils.hasValue(origTeamPassword)) {
        var passwordField = YAHOO.util.Dom.get("new-team-password");
        passwordField.value = origTeamPassword;
    }
    
    if(YAHOO.Convio.PC2.Utils.hasValue(origRecruitingGoal)) {
        var recruitingGoalField = YAHOO.util.Dom.get("new-recruiting-goal");
        recruitingGoalField.value = origRecruitingGoal;
    }
};

var GetCompanyListCallback = {
    success: function(o) {
        var response = YAHOO.lang.JSON.parse(o.responseText).getCompanyListResponse;
        var div = "<select id=\"company-select-list\" name=\"company-select-list\">";
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
        var companyListSection = YAHOO.util.Dom.get("company-list-section");
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

var GetTeamDivisionsMultiLocaleCallback = {
    success: function(o) {
        var response = YAHOO.lang.JSON.parse(o.responseText).getTeamDivisionsMultiLocaleResponse;
        var div = "<select id=\"team-divisions-list\" name=\"team-divisions-list\">";
        var locale = YAHOO.Convio.PC2.Config.getLocale();
        var teamDivisions = response.teamDivisionMultiLocale;

        if(YAHOO.lang.isArray(teamDivisions)) {
            for(var i=0; i< teamDivisions.length; i++) {
                if(teamDivisions[i] && teamDivisions[i].divisionLocale === locale){
                    div += addMultiLocaleTeamDivision(teamDivisions[i].divisionName, teamDivisions[i].divisionLocaleName);
                }
            }
        }

        div += "</select>";
        var teamDivisionListSection = YAHOO.util.Dom.get("team-divisions-list-section");
        teamDivisionListSection.innerHTML = div;
    },
    failure: function(o) {
        logFailure(o);
    },
    scope: YAHOO.Convio.PC2.Teamraiser
};


var GetTeamDivisionsCallback = {
     success: function(o) {
         var response = YAHOO.lang.JSON.parse(o.responseText).getTeamDivisionsResponse;
         var div = "<select id=\"team-divisions-list\" name=\"team-divisions-list\">";

         if(YAHOO.lang.isArray(response.divisionName)) {
             for(var i=0; i<response.divisionName.length; i++) {
                 div += addTeamDivision(response.divisionName[i])
             }
         } else {
             if(YAHOO.lang.isUndefined(response.divisionName) == false) {
                 div += addTeamDivision(response.divisionName);
             }
         }

         div += "</select>";
         var teamDivisionListSection = YAHOO.util.Dom.get("team-divisions-list-section");
         teamDivisionListSection.innerHTML = div;
     },
     failure: function(o) {
         logFailure(o);
     },
     scope: YAHOO.Convio.PC2.Teamraiser
};

function addTeamDivision(divisionName) {
    var div = "<option value=\"" + divisionName + "\";";

    if(YAHOO.Convio.PC2.Component.Teamraiser.Registration.teamInformation.divisionName &&
         YAHOO.Convio.PC2.Component.Teamraiser.Registration.teamInformation.divisionName == divisionName) {
     div += " selected=\"selected\"";
    }

    div += ">";
    div += divisionName;
    div += "</option>";
    return div;
};

function addMultiLocaleTeamDivision(divisionName, divisionMultiLocaleName) {
    var div = "<option value=\"" + divisionName + "\";";

    if(YAHOO.Convio.PC2.Component.Teamraiser.Registration.teamInformation.divisionName &&
          YAHOO.Convio.PC2.Component.Teamraiser.Registration.teamInformation.divisionName == divisionName) {
      div += " selected=\"selected\"";
      YAHOO.util.Dom.get('team-division').innerHTML = divisionMultiLocaleName;
    }

    div += ">";
    div += divisionMultiLocaleName;
    div += "</option>";
    return div;
};

function teamPagePreview() {
    var teampageinfo = UpdateTeamPageInfo.buildTeamPageInfo();
    YAHOO.Convio.PC2.Teamraiser.getTeamPagePreview(TeamPagePreviewCallback, teampageinfo);
};

var TeamPagePreviewCallback = {
    success: function(o) {
        var response = YAHOO.lang.JSON.parse(o.responseText).getTeamPagePreviewResponse;
        var url = response.previewUrl;
        window.open(url);
    },
    failure: function(o) {
        logFailure(o);
        var response = YAHOO.lang.JSON.parse(o.responseText).errorResponse;
        if(response == undefined){
            response = YAHOO.lang.JSON.parse(o.responseText).teamraiserErrorResponse;
        }
        
        if(response.code == "2647") {
            updateTeamMessages("teampage-page-invalid-html-tag");
            setTeamEditorContent(response.body);
        } else {
            updateTeamMessages("teampage-preview-failure");
        }
    },
    scope: YAHOO.Convio.PC2.Teamraiser
};

var clearTeamPageMessages = function() {
	hide_pc2_element("msg_cat_team_photo_upload_success");
    hide_pc2_element("msg_cat_team_photo_upload_content_type_error");
    hide_pc2_element("msg_cat_team_photo_upload_dimensions_error");
    hide_pc2_element("msg_cat_team_photo_upload_generic_error");
    hide_pc2_element("teampage-save-success");
    hide_pc2_element("teampage-save-failure");
    hide_pc2_element("teampage-shortcut-save-success");
    hide_pc2_element("teampage-shortcut-save-failure");
    hide_pc2_element("teampage-preview-failure");
    hide_pc2_element("teampage-page-invalid-html-tag");
    updateTeamPhotoError("");
};

var teamPageResetCompanyInfo = function() {
	var companyName = YAHOO.util.Dom.get('new-company-name');
	companyName.value = '';
};