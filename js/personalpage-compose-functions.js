// stores the prefix
var shortcutPrefix;
var shortcutText;
var shortcutDefault;

function setPersonalEditorContent(content) {
    var ed = tinyMCE.get('personal_page_rich_text');
    ed.setContent(content);
};

function getPersonalEditorContent() {
    var ed = tinyMCE.get('personal_page_rich_text');
    return ed.getContent();
};

function getBlogEnabled() {
    var el = YAHOO.util.Dom.get("pp-blog-enabled-check");
    return el.checked;
};

function setBlogEnabled(enabled) {
    var el = YAHOO.util.Dom.get("pp-blog-enabled-check");
    el.checked = enabled;
};

function getStatus1Content() {
    var el = YAHOO.util.Dom.get("pp-status-therm-check");
    if(el.checked) {
        return "participant_therm";
    }
    return "none_selected";
};

function setStatus1Content(content) {
    var el = YAHOO.util.Dom.get("pp-status-therm-check");
    el.checked = (content == "participant_therm");    
};

function getStatus2Content() {
    var enabledCheck = YAHOO.util.Dom.get("pp-honor-roll-check");
    if(enabledCheck.checked) {
        var donorsOnlyCheck = YAHOO.util.Dom.get("pp-honor-roll-donors-only");
        if(donorsOnlyCheck.checked) {
            return "donor_list";
        }
        return "top_gifts_list";
    }
    return "none_selected";
};

function setStatus2Content(content) {
    var enabledCheck = YAHOO.util.Dom.get("pp-honor-roll-check");
    var donorsOnlyCheck = YAHOO.util.Dom.get("pp-honor-roll-donors-only");
    if(content == "donor_list") {
        enabledCheck.checked = true;
        donorsOnlyCheck.checked = true;
    } else if(content == "top_gifts_list") {
        enabledCheck.checked = true;
        donorsOnlyCheck.checked = false;
    } else {
        enabledCheck.checked = false;
        donorsOnlyCheck.checked = false;
        donorsOnlyCheck.disabled = true;
        YAHOO.util.Dom.addClass("msg_cat_personal_page_honor_roll_donor_names_only", "disabled");
    }
};

function getPageLayout() {
    var el = YAHOO.util.Dom.get("personalpage_layout");
    if(YAHOO.Convio.PC2.Utils.hasValue(el)){
        var selIndex = el.selectedIndex;
        if(selIndex >= 0){
            var selected = el.options[ selIndex];
            return selected.value;
    	}
    }
};

var GetPersonalPageInfoCallback = {
    success: function(o) {
        var response = YAHOO.lang.JSON.parse(o.responseText).getPersonalPageResponse;
        if(YAHOO.lang.isUndefined(response.personalPage)) {
            YAHOO.log('Empty personal page info!', 'warn', 'personal_page.js');
        }

        var personalPage = response.personalPage; 
        var pageTitle = personalPage.pageTitle;
        if(YAHOO.lang.isUndefined(pageTitle) == false) {
            YAHOO.util.Dom.get("personal_page_title").value = pageTitle;
        }
        var richTextEnabled = "true" == personalPage.richTextEnabled;
    
    // Handle Layouts
    var availableLayouts = personalPage.availableLayouts;
	var selectedLayout = personalPage.selectedLayout;
	if (YAHOO.Convio.PC2.Data.TeamraiserConfig.personalPageLayoutAllowed == "true") {
		if (YAHOO.lang.isUndefined(availableLayouts) == false) {
			YAHOO.util.Dom.removeClass("personalpage_layout_block", "hidden-form");
			var inputEl = YAHOO.util.Dom.get("personalpage_layout");
			for ( var i = 0; i < availableLayouts.layout.length; i++) {
				var optionEl = document.createElement("option");
				optionEl.id = "layout_" + i;
				optionEl.value = availableLayouts.layout[i];
				if (selectedLayout == availableLayouts.layout[i]) {
					optionEl.selected = true;
				}
				optionEl.appendChild(document.createTextNode(availableLayouts.layout[i]));
				inputEl.appendChild(optionEl);
			}
		}
	}
        
        setStatus1Content(personalPage.status1);
        setStatus2Content(personalPage.status2);
        setBlogEnabled(personalPage.blogEnabled == "true");

        if(richTextEnabled == true) {
            var richText = personalPage.richText;
            if(YAHOO.lang.isUndefined(richText) == false && YAHOO.lang.isString(richText)) {
                setPersonalEditorContent(richText);
            }
        } else {
            var headline1 = personalPage.headline1;
            var text1 = personalPage.text1;
        
            if(YAHOO.lang.isUndefined(headline1) == false) {
                YAHOO.util.Dom.get("personal_page_headline1").innerHTML = headline1;
            }
            if(YAHOO.lang.isUndefined(text1) == false) {
                YAHOO.util.Dom.get("personal_page_text1").innerHTML = text1;
            }

            var headline2 = personalPage.headline2;
            var text2 = personalPage.text2;
        
            if(YAHOO.lang.isUndefined(headline2) == false) {
                YAHOO.util.Dom.get("personal_page_headline2").innerHTML = headline2;
            }
            if(YAHOO.lang.isUndefined(text2) == false) {
                YAHOO.util.Dom.get("personal_page_text2").innerHTML = text2;
            }

            var headline3 = personalPage.headline3;
            var text3 = personalPage.text3;

            if(YAHOO.lang.isUndefined(headline3) == false) {
                YAHOO.util.Dom.get("personal_page_headline3").innerHTML = headline3;
            }
            if(YAHOO.lang.isUndefined(text3) == false) {
                YAHOO.util.Dom.get("personal_page_text3").innerHTML = text3;
            }
        }
    },

    failure: function(o) {
        YAHOO.log(o.responseText, 'error', 'personal_page.js');
    }
};

var UpdatePersonalPageInfo = {
    buildPersonalPageInfo : function() {
        var personalpageinfo = new Object();
        personalpageinfo.pageTitle = YAHOO.util.Dom.get("personal_page_title").value;
        //personalpageinfo.headline1 = YAHOO.util.Dom.get("personal_page_headline1").innerHTML;
        //personalpageinfo.text1 = YAHOO.util.Dom.get("personal_page_text1").innerHTML;
        //personalpageinfo.headline2 = YAHOO.util.Dom.get("personal_page_headline2").innerHTML;
        //personalpageinfo.text2 = YAHOO.util.Dom.get("personal_page_text2").innerHTML
        //personalpageinfo.headline3 = YAHOO.util.Dom.get("personal_page_headline3").innerHTML;
        //personalpageinfo.text3 = YAHOO.util.Dom.get("personal_page_text3").innerHTML
        personalpageinfo.richText = getPersonalEditorContent();
        
        personalpageinfo.status1 = getStatus1Content();
        personalpageinfo.status2 = getStatus2Content();
        
        personalpageinfo.blogEnabled = getBlogEnabled();
    
        personalpageinfo.pageLayout = getPageLayout();
        
        return personalpageinfo;
    },

    execute: function() {
        clearPersonalPageMessages();
        var personalpageinfo = UpdatePersonalPageInfo.buildPersonalPageInfo();
        YAHOO.Convio.PC2.Teamraiser.updatePersonalPageInfo(UpdatePersonalPageInfoCallback, personalpageinfo);
    }
};

var UpdatePersonalPageInfoCallback = {
        success: function(o) {
            var response = YAHOO.lang.JSON.parse(o.responseText).updatePersonalPageResponse;
            var config = YAHOO.Convio.PC2.Data.TeamraiserConfig;
            
            // hide any previously revealed error messages
            hide_pc2_element('personalpage-compose-page-invalid-html-tag');
            hide_pc2_element('personalpage-compose-save-failure');
            hide_pc2_element('personalpage-components-save-failure');
            
            if(config.personalPageApprovalRequired == 'true') {
                YAHOO.util.Dom.removeClass("personalpage-compose-save-success-approval","hidden-form");
                YAHOO.util.Dom.removeClass("personalpage-components-save-success-approval","hidden-form");
            } else {
                YAHOO.util.Dom.removeClass("personalpage-compose-save-success","hidden-form");
                YAHOO.util.Dom.removeClass("personalpage-components-save-success","hidden-form");
            }
            
            YAHOO.Convio.PC2.Utils.publisher.fire("pc2:personalPageUpdated", response);
        },
        failure: function(o) {
            var response = YAHOO.lang.JSON.parse(o.responseText).errorResponse;
            if(response == undefined){
                response = YAHOO.lang.JSON.parse(o.responseText).teamraiserErrorResponse;
            }
            
            if(response.code == "2647") {
                show_pc2_element('personalpage-compose-page-invalid-html-tag');
                setPersonalEditorContent(response.body);
            } else {
                show_pc2_element('personalpage-compose-save-failure');
                show_pc2_element('personalpage-components-save-failure');
            }
        },
        scope: YAHOO.Convio.PC2.Teamraiser
        
};

var GetShortcutCallback = {
    success: function(o) {
        var response = YAHOO.lang.JSON.parse(o.responseText).getShortcutResponse;
        updateShortcut(response);
    },

    failure: function(o) {
        YAHOO.log(o.responseText, 'error', 'personal_page.js');
    }
};

var UpdateShortcutCallback = {
    success: function(o) {
        
        var response = YAHOO.lang.JSON.parse(o.responseText).updateShortcutResponse;
        if(YAHOO.lang.isUndefined(response.shortcutItem)) {
            YAHOO.log('Empty shortcut information', 'warn', 'personal_page.js');
        }
        updateShortcut(response);
        cancelShortcut();
        show_pc2_element("shortcut-save-success");
    },

    failure: function(o) {
        var error = YAHOO.lang.JSON.parse(o.responseText).errorResponse;
        YAHOO.util.Dom.get("shortcut-save-failure-message").innerHTML = error.message;
        show_pc2_element("shortcut-save-failure");
    },

    scope: YAHOO.Convio.PC2.Teamraiser
};

function updateShortcut(response) {
    if(YAHOO.lang.isUndefined(response.shortcutItem)) {
        YAHOO.log('Empty shortcut information', 'warn', 'personal_page.js');
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
    YAHOO.util.Dom.get("shortcut_link").innerHTML = displayValue;
    YAHOO.util.Dom.get("shortcut_text").innerHTML = shortcutText;
    YAHOO.util.Dom.get("shortcut_input").value = shortcutText;
    YAHOO.util.Dom.get("view_shortcut").href = displayValue + shortcutText;
    
    scope: YAHOO.Convio.PC2.Teamraiser
};

function editSettings() {
    hide_pc2_element('msg_cat_personal_page_shortcut_edit');
    show_pc2_element('msg_cat_personal_page_shortcut_edit2');
    hide_pc2_element('shortcut_text');
    if(YAHOO.lang.isUndefined(shortcutText) || shortcutText == "") {
        YAHOO.util.Dom.get("shortcut_link").innerHTML = shortcutPrefix;
    }
    // show the save/cancel links
    show_pc2_element('permalink_save_cancel');
    show_pc2_element('shortcut_input_block');
    
    // we will not want to show personal page privacy editing if their registration
    // is anonymous and their personal page is marked private
    var reg = YAHOO.Convio.PC2.Component.Teamraiser.Registration;
    if (reg && reg.anonymous == 'true' && reg.privatePage == 'true')
    {
    	// do nothing
    }
    else
    {
        hide_pc2_element('privacy-view-block');
        show_pc2_element('privacy-edit-block');
    }

};

function cancelSettings() {
    clearPersonalPageMessages();
    cancelShortcut();
    cancelPrivacy();
};

function cancelShortcut() {
    show_pc2_element('msg_cat_personal_page_shortcut_edit');
    hide_pc2_element('msg_cat_personal_page_shortcut_edit2');
    show_pc2_element('shortcut_text');
    YAHOO.util.Dom.get('shortcut_text').style.display = '';
    // hide the save/cancel links
    hide_pc2_element('permalink_save_cancel');
    hide_pc2_element('shortcut_input_block');
    if(YAHOO.lang.isUndefined(shortcutText) || shortcutText == "") {
        YAHOO.util.Dom.get("shortcut_link").innerHTML = shortcutDefault;
    }
    // replace the typed in text with the original text
    YAHOO.util.Dom.get('shortcut_input').value = shortcutText;
};

function cancelPrivacy() {
    show_pc2_element('privacy-view-block');
    hide_pc2_element('privacy-edit-block')
    updatePrivacy(YAHOO.Convio.PC2.Component.Teamraiser.Registration.privatePage == 'true');
};

function updatePrivacy(isPrivate) {
    if(isPrivate) {
        show_pc2_element('msg_cat_personal_page_privacy_private_label');
        hide_pc2_element('msg_cat_personal_page_privacy_public_label');
        YAHOO.util.Dom.get('page-private-setting').checked = 'true';
    } else {
        show_pc2_element('msg_cat_personal_page_privacy_public_label');
        hide_pc2_element('msg_cat_personal_page_privacy_private_label');
        YAHOO.util.Dom.get('page-public-setting').checked = 'true';
    }
};

function reconfigureURLSettingsDialog() {
	cancelShortcut();
	cancelPrivacy();
};

var UpdatePersonalPagePrivacyCallback = {
    success: function(o) {
        var response = YAHOO.lang.JSON.parse(o.responseText).updatePersonalPagePrivacyResponse;
        updatePrivacy(response.privatePage == "true");
        show_pc2_element('privacy-save-success');
        hide_pc2_element('privacy-edit-block');
        show_pc2_element('privacy-view-block');
    },
    failure: function(o) {
        show_pc2_element('privacy-save-failure');
        hide_pc2_element('privacy-edit-block');
        show_pc2_element('privacy-view-block');
    },
    scope: YAHOO.Convio.PC2.Teamraiser
};

function saveSettings() {
    clearPersonalPageMessages();
    var element = YAHOO.util.Dom.get("shortcut_input");
    var shortcutText = element.value;
    YAHOO.Convio.PC2.Teamraiser.updateShortcut(UpdateShortcutCallback, shortcutText);
    
    // we will not want to show personal page privacy editing if their registration
    // is anonymous and their personal page is marked private, therefore
    // we don't want to give off the impression that we're saving it
    var reg = YAHOO.Convio.PC2.Component.Teamraiser.Registration;
    if (reg && reg.anonymous == 'true' && reg.privatePage == 'true')
    {
    	// do nothing
    }
    else
    {
    	var isPrivate = YAHOO.util.Dom.get('page-private-setting').checked;
    	YAHOO.Convio.PC2.Teamraiser.updatePersonalPagePrivacy(UpdatePersonalPagePrivacyCallback, isPrivate);
    }
};

function handleKeyPressedPersonalShortcut(keyPressEvent) {
	if (keyPressEvent && keyPressEvent.keyCode === 13) {
		saveSettings();
    }
};

function personalPagePreview() {
    var personalpageinfo = UpdatePersonalPageInfo.buildPersonalPageInfo();
    YAHOO.Convio.PC2.Teamraiser.getPersonalPagePreview(PersonalPagePreviewCallback, personalpageinfo)
}

var PersonalPagePreviewCallback = {
    success: function(o) {
        var response = YAHOO.lang.JSON.parse(o.responseText).getPersonalPagePreviewResponse;
        var url = response.previewUrl;
        window.open(response.previewUrl, "preview");
    },
    failure: function(o) {
        var response = YAHOO.lang.JSON.parse(o.responseText).errorResponse;
        if(response == undefined){
            response = YAHOO.lang.JSON.parse(o.responseText).teamraiserErrorResponse;
        }
        
        if(response.code == "2647") {
            show_pc2_element('page-invalid-html-tag');
            setEditorContent(response.body)
        } else {
            show_pc2_element('preview-failure');
        }
    },
    scope: YAHOO.Convio.PC2.Teamraiser
};

var clearPersonalPageMessages = function() {
    hide_pc2_element("personalpage-compose-save-success");
    hide_pc2_element("personalpage-compose-save-success-approval");
    hide_pc2_element("personalpage-compose-save-failure");
    
    hide_pc2_element("personalpage-components-save-success");
    hide_pc2_element("personalpage-components-save-success-approval");
    hide_pc2_element("personalpage-components-save-failure");

    hide_pc2_element("shortcut-save-success");
    hide_pc2_element("shortcut-save-failure");
    hide_pc2_element('privacy-save-success');
    hide_pc2_element('privacy-save-failure');
};
