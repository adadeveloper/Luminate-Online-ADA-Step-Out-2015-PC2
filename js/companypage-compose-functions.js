// stores the prefix
var shortcutPrefix;
var shortcutText;
var shortcutDefault;

function setCompanyEditorContent(content) {
    var ed = tinyMCE.get("company_page_rich_text");
    ed.setContent(content);
};

function getCompanyEditorContent() {
    var ed = tinyMCE.get("company_page_rich_text");
    return ed.getContent();
};

function getCompanyStatus1Content() {
    var el = YAHOO.util.Dom.get("companypage-status-indicator1-check");
    if(el.checked) {
        return "top_10_teams_by_company_list";
    }
    return "none_selected";
}

function setCompanyStatus1Content(content) {
    var el = YAHOO.util.Dom.get("companypage-status-indicator1-check");
    el.checked = (content == "top_10_teams_by_company_list");    
}

function getCompanyStatus3Content() {
    var enabledCheck = YAHOO.util.Dom.get("companypage-status-indicator3-check");
    if(enabledCheck.checked) {
        return "company_therm";
    }
    return "none_selected";
}

function setCompanyStatus3Content(content) {
    var enabledCheck = YAHOO.util.Dom.get("companypage-status-indicator3-check");
    enabledCheck.check = (content == "company_therm");
}

var GetCompanyPageInfoCallback = {
    success: function(o) {
        var response = YAHOO.lang.JSON.parse(o.responseText).getCompanyPageResponse;
        if(YAHOO.lang.isUndefined(response.companyPage)) {
            YAHOO.log("Empty company page info!", "warn", "company_page.js");
        }

        var companyPage = response.companyPage; 
        var pageTitle = companyPage.pageTitle;
        if(YAHOO.lang.isUndefined(pageTitle) == false) {
            YAHOO.util.Dom.get("company_page_title").value = pageTitle;
        }
        setCompanyStatus1Content(companyPage.status1);
        setCompanyStatus3Content(companyPage.status3);
        
        var richTextEnabled = "true" == companyPage.richTextEnabled;

        if(richTextEnabled == true) {
            var richText = companyPage.richText;
            if(YAHOO.lang.isUndefined(richText) == false && YAHOO.lang.isString(richText)) {
                setCompanyEditorContent(richText);
            }
        } else {
            var headline1 = companyPage.headline1;
            var text1 = companyPage.text1;
        
            if(YAHOO.lang.isUndefined(headline1) == false) {
                YAHOO.util.Dom.get("company_page_headline1").innerHTML = headline1;
            }
            if(YAHOO.lang.isUndefined(text1) == false) {
                YAHOO.util.Dom.get("company_page_text1").innerHTML = text1;
            }

            var headline2 = companyPage.headline2;
            var text2 = companyPage.text2;
        
            if(YAHOO.lang.isUndefined(headline2) == false) {
                YAHOO.util.Dom.get("company_page_headline2").innerHTML = headline2;
            }
            if(YAHOO.lang.isUndefined(text2) == false) {
                YAHOO.util.Dom.get("company_page_text2").innerHTML = text2;
            }

            var headline3 = companyPage.headline3;
            var text3 = companyPage.text3;

            if(YAHOO.lang.isUndefined(headline3) == false) {
                YAHOO.util.Dom.get("company_page_headline3").innerHTML = headline3;
            }
            if(YAHOO.lang.isUndefined(text3) == false) {
                YAHOO.util.Dom.get("company_page_text3").innerHTML = text3;
            }
        }
    },

    failure: function(o) {
        logFailure(o);
    },

    scope: YAHOO.Convio.PC2.Teamraiser
};

var UpdateCompanyPageInfo = {
    buildCompanyPageInfo : function() {
        var companypageinfo = new Object();
        companypageinfo.richText = getCompanyEditorContent();
        companypageinfo.pageTitle = YAHOO.util.Dom.get("company_page_title").value;
        companypageinfo.status1 = getCompanyStatus1Content();
        companypageinfo.status3 = getCompanyStatus3Content();
        return companypageinfo;
    },

    execute: function() {
        var companypageinfo = UpdateCompanyPageInfo.buildCompanyPageInfo();
        YAHOO.Convio.PC2.Teamraiser.updateCompanyPageInfo(UpdateCompanyPageInfoCallback, companypageinfo);
    }
};

var UpdateCompanyPageInfoCallback = {
        success: function(o) {
	
			// hide any previously revealed error messages
			updateCompanyMessages();
			
            show_pc2_element("companypage-save-success");
            show_pc2_element("companypage-save-components-success");
        },
        failure: function(o) {
            var response = YAHOO.lang.JSON.parse(o.responseText).errorResponse;
            if(response == undefined){
                response = YAHOO.lang.JSON.parse(o.responseText).teamraiserErrorResponse;
            }
            
            if(response.code == "2647") {
                updateCompanyMessages("companypage-page-invalid-html-tag");
                setCompanyEditorContent(response.body);
            } else {
                show_pc2_element("companypage-save-failure");
                show_pc2_element("companypage-save-components-failure");
            }
        },
        scope: YAHOO.Convio.PC2.Teamraiser
        
};

var GetCompanyShortcutCallback = {
    success: function(o) {
        var response = YAHOO.lang.JSON.parse(o.responseText).getCompanyShortcutResponse;
        updateCompanyShortcut(response);
    },

    failure: function(o) {
        logFailure(o);
    },

    scope: YAHOO.Convio.PC2.Teamraiser
};

var UpdateCompanyShortcutCallback = {
        success: function(o) {
            
            var response = YAHOO.lang.JSON.parse(o.responseText).updateCompanyShortcutResponse;
            if(YAHOO.lang.isUndefined(response.shortcutItem)) {
                YAHOO.log("Empty shortcut information", "warn", "company_page.js");
            }
            updateCompanyShortcut(response);
            cancelCompanyShortcut();
            
            updateCompanyMessages("companypage-shortcut-save-success");
        },

        failure: function(o) {
            updateCompanyMessages("companypage-shortcut-save-failure");
        },

        scope: YAHOO.Convio.PC2.Teamraiser
    };

function updateCompanyShortcut(response) {
    if(YAHOO.lang.isUndefined(response.shortcutItem)) {
        YAHOO.log("Empty shortcut information", "warn", "company_page.js");
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
    YAHOO.util.Dom.get("companypage_shortcut_link").innerHTML = displayValue;
    YAHOO.util.Dom.get("companypage_shortcut_text").innerHTML = shortcutText;
    YAHOO.util.Dom.get("companypage_shortcut_input").value = shortcutText;
    YAHOO.util.Dom.get("companypage_view_shortcut").href = displayValue + shortcutText;
    
    scope: YAHOO.Convio.PC2.Teamraiser
};

function editCompanyShortcut() {
    // hide the edit link
    hide_pc2_element("companypage_permalink_edit");
    show_pc2_element("msg_cat_company_page_shortcut_edit2");
    hide_pc2_element("companypage_shortcut_text");
    if(YAHOO.lang.isUndefined(shortcutText) || shortcutText == "") {
        YAHOO.util.Dom.get("companypage_shortcut_link").innerHTML = shortcutPrefix;
    }
    // show the save/cancel links
    show_pc2_element("companypage_permalink_save_cancel");
    show_pc2_element("companypage_shortcut_input_block");
        
};

function cancelCompanyShortcut() {
    // show the edit link
    show_pc2_element("companypage_permalink_edit");
    hide_pc2_element("msg_cat_company_page_shortcut_edit2");
    show_pc2_element("companypage_shortcut_text");
    // hide the save/cancel links
    hide_pc2_element("companypage_permalink_save_cancel");
    hide_pc2_element("companypage_shortcut_input_block");
    if(YAHOO.lang.isUndefined(shortcutText) || shortcutText == "") {
        YAHOO.util.Dom.get("companypage_shortcut_link").innerHTML = shortcutDefault;
    }
    // replace the typed in text with the original text
    YAHOO.util.Dom.get("companypage_shortcut_input").value = shortcutText;
};

function saveCompanyShortcut() {
    var element = YAHOO.util.Dom.get("companypage_shortcut_input");
    var shortcutText = element.value;
    YAHOO.Convio.PC2.Teamraiser.updateCompanyShortcut(UpdateCompanyShortcutCallback, shortcutText);
};

function handleKeyPressedCompanyShortcut(keyPressEvent) {
	if (keyPressEvent && keyPressEvent.keyCode === 13) {
		saveCompanyShortcut();
    }
};

var updateCompanyPhotoError = function(err) {
    YAHOO.util.Dom.get("company_photo_upload_error_message").innerHTML = err;
    if("" == err) {
        hide_pc2_element("company_photo_upload_error_message");
    } else {
        show_pc2_element("company_photo_upload_error_message");
    }
}

// Company Photo Methods
var UploadCompanyPhotoCallback = {
        upload: function(o) {
          try {
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
            var response = YAHOO.lang.JSON.parse(responseText).uploadCompanyPhotoResponse;
            if(YAHOO.lang.isUndefined(response.photoItem) || YAHOO.lang.isNull(response.photoItem)) { 
                updateCompanyPhotoError(response.message);
            } else {
                var uploadFile = YAHOO.util.Dom.get("companypage-photo-upload-block");
                if(YAHOO.lang.isUndefined(uploadFile) == false && uploadFile != null) {
                    uploadFile.innerHTML = uploadFile.innerHTML;
                }
                show_pc2_element("msg_cat_company_photo_upload_success");
                YAHOO.Convio.PC2.Teamraiser.getCompanyPhoto(GetCompanyPhotoCallback);
            }
          }catch(e) {
              show_pc2_element("msg_cat_company_photo_upload_generic_error");
          }
        }
};

var GetCompanyPhotoCallback = {
    success: function(o) {
        var response = YAHOO.lang.JSON.parse(o.responseText).getCompanyPhotoResponse;
        var img = null;
        var removeSection = null;
        if(response.photoItem.id == "1") {
            UpdateCompanyPhoto(response.photoItem);
        }
    },
    failure: function(o) {
        logFailure(o);
    },
    scope: YAHOO.Convio.PC2.Teamraiser
};

var RemoveCompanyPhotoCallback = {
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
        var response = YAHOO.lang.JSON.parse(responseText).removeCompanyPhotoResponse;
        var img = null;
        var removeSection;
        var captionSection = null;
        if(response.photoItem.id == "1") {
            UpdateCompanyPhoto(response.photoItem);
            show_pc2_element("msg_cat_company_photo_upload_success");
            var uploadFile = YAHOO.util.Dom.get("companypage-photo-upload-block");
            if(YAHOO.lang.isUndefined(uploadFile) == false && uploadFile != null) {
                uploadFile.innerHTML = uploadFile.innerHTML;
            }
        }
    }
};

var UpdateCompanyPhoto = function(photoItem) {
    
    var img = YAHOO.util.Dom.get("companypage-photo-thumbnail-example");
    var isPhotoItemUrlDefined = 
        (photoItem != null) && 
        (!YAHOO.lang.isUndefined(photoItem.thumbnailUrl) || !YAHOO.lang.isUndefined(photoItem.originalUrl));
    
    if(img != null && isPhotoItemUrlDefined) {
        // prefer the thumbnail URL if available
        img.src = !YAHOO.lang.isUndefined(photoItem.thumbnailUrl) ? photoItem.thumbnailUrl : photoItem.originalUrl;
        show_pc2_element("companypage-photo-remove-section");
        show_pc2_element("companypage-photo-thumbnail-example");
        hide_pc2_element("msg_cat_companypage_photo_upload_no_image");
        if(YAHOO.lang.isString(photoItem.caption)) {
            YAHOO.util.Dom.get("companypage_graphic_caption").value = photoItem.caption;
        }
    } else {
        img.src = "";
        hide_pc2_element("companypage-photo-remove-section");
        hide_pc2_element("companypage-photo-thumbnail-example");
        show_pc2_element("msg_cat_companypage_photo_upload_no_image");
        YAHOO.util.Dom.get("companypage_graphic_caption").value = "";
    }
};

var onCompanyUploadButtonClick = function(e){
    var caption = YAHOO.util.Dom.get("companypage_graphic_caption").value;
    hide_pc2_element("msg_cat_company_photo_upload_success");
    hide_pc2_element("msg_cat_company_photo_upload_content_type_error");
    hide_pc2_element("msg_cat_company_photo_upload_generic_error");
    hide_pc2_element("msg_cat_company_photo_upload_dimensions_error");
    updateCompanyPhotoError("");
    YAHOO.Convio.PC2.Teamraiser.uploadCompanyPhoto(UploadCompanyPhotoCallback, "companypage-photo-upload-form", caption);
};

var onCompanyRemoveButtonClick = function(e) {
    hide_pc2_element("msg_cat_company_photo_upload_success");
    hide_pc2_element("msg_cat_company_photo_upload_content_type_error");
    hide_pc2_element("msg_cat_company_photo_upload_generic_error");
    hide_pc2_element("msg_cat_company_photo_upload_dimensions_error");
    updateCompanyPhotoError("");
    YAHOO.Convio.PC2.Teamraiser.removeCompanyPhoto(RemoveCompanyPhotoCallback, "companypage-graphic-upload-remove-form");
};

var clearCompanyMessages = function() {
    hide_pc2_element("msg_cat_company_photo_upload_success");
    hide_pc2_element("msg_cat_company_photo_upload_content_type_error");
    hide_pc2_element("msg_cat_company_photo_upload_generic_error");
    hide_pc2_element("msg_cat_company_photo_upload_dimensions_error");
    hide_pc2_element("companypage-save-success");
    hide_pc2_element("companypage-save-failure");
    hide_pc2_element("companypage-save-components-success");
    hide_pc2_element("companypage-save-components-failure");
    hide_pc2_element("companypage-page-invalid-html-tag");
    hide_pc2_element("companypage-shortcut-save-success");
    hide_pc2_element("companypage-shortcut-save-failure");
    updateCompanyPhotoError("");
};

function companyPagePreview() {
    var companypageinfo = UpdateCompanyPageInfo.buildCompanyPageInfo();
    YAHOO.Convio.PC2.Teamraiser.getCompanyPagePreview(CompanyPagePreviewCallback, companypageinfo)
}

var CompanyPagePreviewCallback = {
    success: function(o) {
        var response = YAHOO.lang.JSON.parse(o.responseText).getCompanyPagePreviewResponse;
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
            updateCompanyMessages("companypage-page-invalid-html-tag");
            setCompanyEditorContent(response.body);        
        } else {
            updateCompanyMessages("companypage-preview-failure");
        }
    },
    scope: YAHOO.Convio.PC2.Teamraiser
}

var companyMessages = ["companypage-save-components-success","companypage-save-components-failure","companypage-save-success","companypage-save-failure","companypage-shortcut-save-success","companypage-shortcut-save-failure",
                "msg_cat_company_photo_upload_content_type_error","msg_cat_company_photo_upload_generic_error",
                "companypage-preview-failure","companypage-page-invalid-html-tag","msg_cat_company_photo_dimensions_error"];
var updateCompanyMessages = function(message) {
    for(var i=0; i<companyMessages.length; i++) {
        var messageName = companyMessages[i];
        if(messageName == message) {
            YAHOO.util.Dom.removeClass(messageName, "hidden-form");
        } else {
            YAHOO.util.Dom.addClass(messageName, "hidden-form");
        }
    }
};