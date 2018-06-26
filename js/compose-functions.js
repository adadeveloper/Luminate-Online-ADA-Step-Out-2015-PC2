// stores the rich text editor after it has been initialized
var initialSubject = "";
var initialMessage = "";
var initialRecipients = "";
var messageId = -1;
var draftId = -1;
var defaultLayoutId = -1;
var chosenLayoutId = -1;
var lightBox;
var defaultMessageId = -1;
var myContacts;
var myContactsMap = [];
var myContactsPositionById = [];
var composeAutoComplete;
var gThanksTemplateArray = new Array();
var gRecruitTemplateArray = new Array();
var gSolicitTemplateArray = new Array();
var gOtherTemplateArray = new Array();
var gCustomTemplateArray = new Array();


function chooseLayout(layoutId) {
    
    if(YAHOO.lang.isUndefined(layoutId)) {
        return;
    }
    if(chosenLayoutId != -1 && YAHOO.lang.isUndefined(YAHOO.util.Dom.get('layout-' + chosenLayoutId)) == false) {
        YAHOO.util.Dom.removeClass('layout-' + chosenLayoutId, 'selected');
    }
    chosenLayoutId = layoutId;
    YAHOO.util.Dom.addClass('layout-' + chosenLayoutId, 'selected');
    
    var chosenLayoutLabel = YAHOO.util.Dom.get("layout-label-" + chosenLayoutId);
    if(chosenLayoutLabel) {
        var masterLayoutLabel = YAHOO.util.Dom.get("compose_selected_layout");
        masterLayoutLabel.innerHTML = chosenLayoutLabel.innerHTML;
    }
    
};

function getComposeEditorContent() {
    var ed = tinyMCE.get('compose-rich-text');
    return ed.getContent();
}

function setComposeEditorContent(content) {
    var ed = tinyMCE.get('compose-rich-text');
    if(content == '') {
    	window.focus();
    	ed.focus();
    }
    ed.setContent(content);
}

function saveMessage() {
    var message = new Object();
    message.recipients = YAHOO.util.Dom.get("email-addresses").value;
    // bug 52310 allow semi-colon as email address delimeter
    message.recipients = message.recipients.replace(/;/g,',');
    message.subject = YAHOO.util.Dom.get("email-subject").value;
    message.prepend_salutation = YAHOO.util.Dom.get("prepend-salutation").checked;
    message.body = getComposeEditorContent();
    message.messageId = messageId;
    message.name = message.subject;
    message.layoutId = chosenLayoutId;
    return message;
};

function sendMessage() {
    // clear the message
    updatePageStatus("");
    var sendButton = YAHOO.util.Dom.get('msg_cat_compose_send_button_label');
    sendButton.disabled = true;
    var message = saveMessage();
    if(draftId > 0) {
        message.messageId = draftId;
    }
    YAHOO.Convio.PC2.Teamraiser.sendMessage(SendMessageCallback, message);
};

function previewMessage() {
    var message = saveMessage();
    YAHOO.Convio.PC2.Teamraiser.previewMessage(PreviewMessageCallback, message);
};

function previewTemplate(messageId) {
  YAHOO.Convio.PC2.Teamraiser.getSuggestedMessage(GetSuggestedMessageForPreviewCallback, messageId);
}

function saveDraft() {
    var saveButton = YAHOO.util.Dom.get('msg_cat_compose_save_draft_button_label');
    saveButton.disabled = true;
    var message = saveMessage();
    if(draftId > 0) {
        // ensure the suggested messages aren't saved over
        message.messageId = draftId;
        YAHOO.Convio.PC2.Teamraiser.updateDraft(SaveDraftCallback, message);
    } else {
        // load the original message id
        message.messageId = messageId;
        YAHOO.Convio.PC2.Teamraiser.addDraft(SaveDraftCallback, message);
    }
};

function saveTemplate() {
    var saveButton = YAHOO.util.Dom.get('msg_cat_compose_save_template_button_label');
    saveButton.disabled = true;
    var message = saveMessage();
    message.save_template = true;
    if(draftId > 0) {
        // ensure the suggested messages aren't saved over
        message.messageId = draftId;
        YAHOO.Convio.PC2.Teamraiser.updateDraft(UpdateTemplateCallback, message);
    } else {
        // load the original message id
        message.messageId = messageId;
        YAHOO.Convio.PC2.Teamraiser.addDraft(AddTemplateCallback, message);
    }
};

var UpdateTemplateCallback = {
	    success: function(o) {
			var data = YAHOO.lang.JSON.parse(o.responseText).updateDraftResponse.message;        
			saveTemplateSuccess(o, data);    
	    },
	    failure: function(o) {
	    	saveTemplateFailure(o);
	    },
	    scope: YAHOO.Convio.PC2.Teamraiser
	};

var AddTemplateCallback = {
	    success: function(o) {
			var data = YAHOO.lang.JSON.parse(o.responseText).addDraftResponse.message;        
			saveTemplateSuccess(o, data);       

	    },
	    failure: function(o) {
	    	saveTemplateFailure(o);
	    },
	    scope: YAHOO.Convio.PC2.Teamraiser
	};

function saveTemplateSuccess(o, data) {
	updatePageStatus('save-template-success');	    
	var saveButton = YAHOO.util.Dom.get('msg_cat_compose_save_template_button_label');
	saveButton.disabled = false;        
	// add new template to global array                        
	data.name = data.messageName;
	// currently all saved templates will go to "your saved templates" category.        
	data.personal = "true";
	data.messateType = "OTHER";        
	var templateArray = getTemplateArray("custom");
	var l = templateArray.length;
	templateArray[l] = data;
	showEmailTemplates();
};


function saveTemplateFailure(o) {
    var response = YAHOO.lang.JSON.parse(o.responseText).errorResponse;
    if(response == undefined){
        response = YAHOO.lang.JSON.parse(o.responseText).teamraiserErrorResponse;
    }
            
    if(response.code == "2645") {
        updatePageStatus('no-subject-failure');
    } else if(response.code == "2647") {
        updatePageStatus('invalid-html-tag-failure');
        setComposeEditorContent(response.body);
    } else if(response.code == "2622") {
        updatePageStatus('invalid-email-address-failure');
    } else {
        updatePageStatus('save-failure');
    }
    var saveButton = YAHOO.util.Dom.get('msg_cat_compose_save_template_button_label');
    saveButton.disabled = false;
    logFailure(o);
};


var SaveDraftCallback = {
    success: function(o) {
        updatePageStatus('save-success');
        var saveButton = YAHOO.util.Dom.get('msg_cat_compose_save_draft_button_label');
        saveButton.disabled = false;

        // clear the message
        clearMessage();
        //switch back to dashboard
        YAHOO.Convio.PC2.Utils.loadView("dashboard", "home");

        // update the drafts list
        if(YAHOO.Convio.PC2.Teamraiser.Drafts && YAHOO.Convio.PC2.Teamraiser.Drafts.Paginator) {
            YAHOO.Convio.PC2.Teamraiser.Drafts.Paginator.reset();
        }
    },
    failure: function(o) {
        var response = YAHOO.lang.JSON.parse(o.responseText).errorResponse;
        if(response == undefined){
            response = YAHOO.lang.JSON.parse(o.responseText).teamraiserErrorResponse;
        }
                
        if(response.code == "2645") {
            updatePageStatus('no-subject-failure');
        } else if(response.code == "2647") {
            updatePageStatus('invalid-html-tag-failure');
            setComposeEditorContent(response.body);
        } else if(response.code == "2622") {
            updatePageStatus('invalid-email-address-failure');
        } else {
            updatePageStatus('save-failure');
        }
        var saveButton = YAHOO.util.Dom.get('msg_cat_compose_save_draft_button_label');
        saveButton.disabled = false;
        logFailure(o);
    },
    scope: YAHOO.Convio.PC2.Teamraiser
};

var GetEventDataParameterCallback = {
  success: function(o) {
    var response = YAHOO.lang.JSON.parse(o.responseText).getEventDataParameterResponse;
    if (response.booleanValue == "true") {
      YAHOO.util.Dom.removeClass("salutation-block", "hidden-form");
    }
  },
  failure: function(o) {
    logFailure(o);
  },
  scope: YAHOO.Convio.PC2.Teamraiser
};

function showLayouts() {
    toggleLayouts(true);
};

function hideLayouts() {
    toggleLayouts(false);
};

function lockLayouts(){
    hideLayouts();
    YAHOO.util.Event.removeListener("msg_cat_layout_done_select_label", "click", hideLayouts);
    YAHOO.util.Event.removeListener("msg_cat_layout_select_label", "click", showLayouts);
    YAHOO.util.Dom.addClass("layout-select", "hidden-form");
};

function unlockLayouts(){
    YAHOO.util.Event.addListener("msg_cat_layout_select_label", "click", showLayouts);
    YAHOO.util.Event.addListener("msg_cat_layout_done_select_label", "click", hideLayouts);
    showLayouts();
};

function toggleLayouts(isShow) {
    if(isShow) {
        hide_pc2_element("layout-select");
        hide_pc2_element("layout-closed")
        show_pc2_element("layout-open");
        show_pc2_element("layout-done-select");
        show_pc2_element("layout-list");
    } else {
        show_pc2_element("layout-select");
        show_pc2_element("layout-closed")
        hide_pc2_element("layout-open");
        hide_pc2_element("layout-done-select");
        hide_pc2_element("layout-list");
    }
};

function clearMessage() {
    YAHOO.util.Dom.get("email-addresses").value = "";
    clearWizardRecipients();
    YAHOO.util.Dom.get("email-subject").value = "";
    YAHOO.util.Dom.get("prepend-salutation").checked = false;
    jQuery('#email-wizard-preview-subject').empty();
    jQuery('#email-wizard-preview-body').empty();
    jQuery('input[name=email-wizard-template-radio]:checked').attr('checked',false);
    showWizardConfigure();
    initialSubject = "";
    setComposeEditorContent('');
    initialMessage = "";
    var initialRecipients = "";
    if(chosenLayoutId && chosenLayoutId != -1) {
        YAHOO.util.Dom.removeClass('layout-' + chosenLayoutId, 'selected');
    }
    if(defaultLayoutId && defaultLayoutId > 0) {
        unlockLayouts();
        chooseLayout(defaultLayoutId);
    }
    messageId = defaultMessageId;
};

function resetDraftInfo() {
    if(draftId > 0) {
        YAHOO.util.Dom.addClass("msg_cat_compose_delete_button_label","hidden-form");
        YAHOO.util.Dom.removeClass("msg_cat_compose_message_label", "hidden-form")
        YAHOO.util.Dom.addClass("draft-info-block", "hidden-form")
        YAHOO.util.Dom.addClass("compose-li-item", "selected");
        YAHOO.util.Dom.removeClass("drafts-li-item", "selected");
        draftId = -1;
    }
}

var SendMessageCallback = {
    success: function(o) {
        var sendButton = YAHOO.util.Dom.get('msg_cat_compose_send_button_label');
        sendButton.disabled = false;
        var response = YAHOO.lang.JSON.parse(o.responseText).sendMessageResponse;
        if(draftId && draftId > 0) {
            deleteDraft();
        } else {
            clearMessage();
        }
        // Reset the sent message paginator
        if(YAHOO.Convio.PC2.Teamraiser.SentMessages != null && YAHOO.Convio.PC2.Teamraiser.SentMessages.Paginator != null) {
            YAHOO.Convio.PC2.Teamraiser.SentMessages.Paginator.reset();
        }
        // force refresh of contacts next time it loads
        YAHOO.Convio.PC2.Views.emailContactsReset = true;
        YAHOO.Convio.PC2.Views.reportPersonalReset = true;
        
        YAHOO.Convio.PC2.Utils.publisher.fire("pc2:emailSent", response);

        //switch back to the configure tab for next time
        showWizardConfigure();

        //switch back to dashboard
        YAHOO.Convio.PC2.Utils.loadView("dashboard", "home");

        //then show send success message for a few seconds
        updatePageStatus('send-success');
        setTimeout( function() {
          updatePageStatus('none');
        }, 3000);

        //also update the suggestions
        loadSuggestion();
    },
    failure: function(o) {
        var response = YAHOO.lang.JSON.parse(o.responseText).errorResponse;
        if(response == undefined){
            response = YAHOO.lang.JSON.parse(o.responseText).teamraiserErrorResponse;
        }

        if(response.code == "2645") {
            updatePageStatus('no-subject-failure');
        //} else if(response.code == "2622") {
        //    updatePageStatus('invalid-email-address-failure');
        } else if(response.code == "2647") {
            updatePageStatus('invalid-html-tag-failure');
            setComposeEditorContent(response.body);
        } else if(response.code == "2652") {
            updatePageStatus('no-body-failure');
        } else if(response.code == "2653") {
            updatePageStatus('no-recipients-failure');
				}
				// Code = 5 is METHOD_INVALID which is most likely from a dropped session. 
				// Show them the timed out dialog.
				else if (response.code == "5")
				{
						clearInterval(keepAliveTimer);
						// Subtract a minute from current time so it looks like their session just expired. 
						// We know it didn't but we don't want to explain dropped sessions to end users.
						var expiryTime = new Date();
						expiryTime.setMinutes(expiryTime.getMinutes() - 1);
						var expireText = jQuery('#msg_cat_session_timeout_expired_content').html() + ' ' + formatTime(expiryTime) + '.';
						initKeepAliveDialog();
						showTimedOutDialog(expireText);
				}
        else {
            //updatePageStatus('send-failure');
            updatePageStatus('unknown-failure', response.message);
        }
        var sendButton = YAHOO.util.Dom.get('msg_cat_compose_send_button_label');
        sendButton.disabled = false;
        logFailure(o);
    },
    scope: YAHOO.Convio.PC2.Teamraiser
};

var GetMessageLayoutsCallback = {
    success: function(o) {
        var config = YAHOO.Convio.PC2.Data.TeamraiserConfig;
        var response = YAHOO.lang.JSON.parse(o.responseText).getMessageLayoutsResponse;
        var layouts = response.layout;
        if(YAHOO.lang.isArray(layouts)) {
            var layoutsString = '';    // = "<ul>";
            
            for(var i=0; i<layouts.length; i++) {
                var layout = response.layout[i];
                var column = '';
                if (i % 4 == 0) {
                    column = " class='column-1'";
                }
                var layoutString = "<li id='layout-" + layout.layoutId + "'" + column + ">";
                layoutString += "<a href='javascript: chooseLayout(" + layout.layoutId + ");' id='layout-inner-" + layout.layoutId + "'>";
                if(layout.thumbnailUrl.indexOf("stationery/no_image.jpg") != -1) {
                    layout.thumbnailUrl = 'images/stationarythumb-squarish.gif';
                }
                layoutString += "<img src='" + layout.thumbnailUrl + "' />";
                layoutString += "<span class='desc'><label id=\"layout-label-" + layout.layoutId + "\">" + layout.name + "</label></span>";
                layoutString += "</a>";
                layoutString += "</li>";
                layoutsString += layoutString;
            }
            var layoutId = config.defaultStationeryId;
            if(layoutId <= 0) {
	        	layoutId = layouts[0].layoutId;
		    }
            //layoutsString += "</ul>";
            var layoutList = YAHOO.util.Dom.get("layout-list");
            layoutList.innerHTML = layoutsString;
            defaultLayoutId = layoutId;
            chooseLayout(layoutId);
        } else {
            var layout = response.layout;
            if(layout && layout.layoutId) { 
              layoutId = layout.layoutId;
              defaultLayoutId = layoutId;
              chooseLayout(layoutId);
            }
        }
        getDraft();
    },
    failure: function(o) {
        logFailure(o);
        getDraft();
    },
    scope: YAHOO.Convio.PC2.Teamraiser
};

var PreviewMessageCallback = {
        success: function(o) {
            updatePageStatus('');
            var response = YAHOO.lang.JSON.parse(o.responseText).getMessagePreviewResponse;
            if(YAHOO.lang.isString(response.subject)) {
                var subject = YAHOO.util.Dom.get("preview-header");
                subject.innerHTML = response.subject;
                jQuery('#email-wizard-preview-subject').html(response.subject);
            }
            var body = YAHOO.util.Dom.get("preview-body");
            body.innerHTML = response.message;
            jQuery('#email-wizard-preview-body').html(response.message);
            if( !jQuery('#email-wizard-nav-preview').hasClass('email-wizard-nav-selected') ) {
              //only show the light box if we're not on the preview tab
              lightBox.show();
            }
        },
        failure: function(o) {
            var response = YAHOO.lang.JSON.parse(o.responseText).errorResponse;
            if(response == undefined) {
                response = YAHOO.lang.JSON.parse(o.responseText).teamraiserErrorResponse;
            }
            
            if(response.code == "2647") {
                updatePageStatus('invalid-html-tag-failure');
                setComposeEditorContent(response.body);
            } else {
                updatePageStatus('');
            }
                
            logFailure(o);
        },
        scope: YAHOO.Convio.PC2.Teamraiser
};

function sendPreviewMessage() {
    closePreviewMessage();
    sendMessage();
};

function closePreviewMessage() {
    var subject = YAHOO.util.Dom.get("preview-header");
    subject.innerHTML = "";
    var body = YAHOO.util.Dom.get("preview-body");
    body.innerHTML = "";
    lightBox.hide();
};

function getTemplateArray(type) {
	if (type == "thanks" ) return gThanksTemplateArray;
	else if (type == "solicit" ) return gSolicitTemplateArray;
	else if (type == "recruit" ) return gRecruitTemplateArray;
	else if (type == "other" ) return gOtherTemplateArray;
	else if (type == "custom" ) return gCustomTemplateArray;
	else return new Array();
};

function showEmailTemplates() {
	var indexToActivate = typeof YAHOO.Convio.PC2.Views.emailTemplateTypeDefault==='number'?YAHOO.Convio.PC2.Views.emailTemplateTypeDefault:3;
    if( !jQuery(jQuery('#email-template-container h3')[indexToActivate]).is(':visible') )
      indexToActivate = 3;
	jQuery('#email-template-container').accordion('activate',indexToActivate);
	showEmailTemplate("thanks", gThanksTemplateArray);
	showEmailTemplate("recruit", gRecruitTemplateArray);
	showEmailTemplate("solicit", gSolicitTemplateArray);
	showEmailTemplate("other", gOtherTemplateArray);
	showEmailTemplate("custom", gCustomTemplateArray);
	jQuery('#email-template-container').accordion('resize');
};

// TODO: change to locale mami
function getEmailTemplateLabel(type, len) {
    var el = YAHOO.util.Dom.get("msg_cat_email_template_radio_" + type + "_label");
    if (el) {
    	var txt = el.innerHTML;    
    	return el.innerHTML + " (" + len + ")";
    } else {
    	return "";
    }
};

function showEmailTemplate(type, templateArray) {
  jQuery('#email_template_radio_'+type+'_label').html( getEmailTemplateLabel(type, templateArray.length) );
  jQuery('#email-template-'+type+'-list-container').html( getEmailTemplateList(type) );

  if (templateArray.length > 0 ) {
    jQuery('#email_template_radio_'+type+'_label').show();
  } else {
    jQuery('#email_template_radio_'+type+'_label').hide();
    jQuery('#email-template-'+type+'-list-container').hide();
  }
};



function showEmailTemplateList(element) {
	YAHOO.util.Dom.addClass(YAHOO.util.Dom.get(element.parentNode), "email-template-row-selected");
	var value = element.value;
	var listContainer = YAHOO.util.Dom.get("email-template-list");	
	listContainer.innerHTML = getEmailTemplateList(value);
};

function getEmailTemplateList(value) {
	var templateArray = getTemplateArray(value);
	var returnValue = "";
    for(var i=0; i<templateArray.length; i++) {
    	var data = templateArray[i];
    	var messageName = data.name;
      var isPersonal = (data.personal == "true");
      var loadSnippet = "loadSuggestedMessage(" + data.messageId +", "+isPersonal+")";

      var templateDiv = "<div class=\"email-template-row\" id=\"email-template-row-" + data.messageId + "\"";
      var templateLi = "<li id=\"personal_message_" + data.messageId + "\" class=\"templateHighlight\">";
      var templateRadio = "";
      var templateName = "";
      var templatePreview = "";
      var templateDelete = "";

      templateDiv += ">";
      var radioId = "email-wizard-template-id-"+data.messageId;
      templateName = "<label for=\""+radioId+"\">"+messageName+"</label>";
      templateRadio = "<input type=\"radio\" id=\""+radioId+"\" name=\"email-wizard-template-radio\" onclick=\""+loadSnippet+"\">";

      templatePreview = " (<a href=\"javascript: previewTemplate("+data.messageId+")\"><span class=\"email-wizard-preview-link\">"+jQuery('#msg_cat_compose_preview_button_label').html()+"</span></a>)";

      if( isPersonal ) {
        templateDelete = " (<a href=\"javascript: deleteSuggestedMessage(" + data.messageId + ");\"><img class='delete-image' src='images/trash.gif' alt='Delete' /></a>)";
      }

      row = templateDiv + templateLi + templateRadio + templateName + templatePreview + templateDelete + "</li></div>";
      returnValue += row;
    }
    return returnValue;
};

var GetSuggestedMessagesCallback = {
    success: function(o) {
        jQuery('#email-compose-templates .loader').hide();
        var divString = "";
        var personalDivString = "";
        var response = YAHOO.lang.JSON.parse(o.responseText).getSuggestedMessagesResponse;
        if(YAHOO.lang.isUndefined(response.suggestedMessage) == false) {
            response.suggestedMessage = YAHOO.Convio.PC2.Utils.ensureArray(response.suggestedMessage);
            for(var i=0; i<response.suggestedMessage.length; i++) {
                var data = response.suggestedMessage[i];
                var messageName = data.name
                var messageType = data.messageType.toLowerCase();
                if(data.personal == "true") {
                	messageType = "custom";
                }
                // create global variables for template email arrays
                var templateArray = getTemplateArray(messageType);
                var l = templateArray.length;
                templateArray[l] = data;
             }
             showEmailTemplates();
      
        }
        YAHOO.Convio.PC2.Utils.publisher.fire("pc2:suggestedMessagesLoaded", myContacts);
    },
    failure: function(o) {
        jQuery('#email-compose-templates .loader').hide();
        logFailure(o);
    },
    scope: YAHOO.Convio.PC2.Teamraiser
};


var GetSuggestedMessageCallback = {
    success: function(o) {
        var divString = "";
        var response = YAHOO.lang.JSON.parse(o.responseText).getSuggestedMessageResponse;
        YAHOO.util.Dom.get("email-subject").value = response.messageInfo.subject;
        messageId = response.messageInfo.messageId;
        
        selectTemplate(messageId);
                
        initialSubject = response.messageInfo.subject;
        var messageBody = "";
        if(YAHOO.lang.isString(response.messageInfo.messageBody)) {
            messageBody = response.messageInfo.messageBody;
        }
        // Bug 42191 - Suggested Messgages Not Constrained to the specified stationery
        var layoutId = response.messageInfo.layoutId;
        if(YAHOO.lang.isValue(layoutId) && layoutId > 0){
            chooseLayout(layoutId);
            lockLayouts();
        } else {
            unlockLayouts();
            chooseLayout(defaultLayoutId);
        }
        setComposeEditorContent(messageBody);
        initialMessage = messageBody;
    },
    failure: function(o) {
        logFailure(o);
    },
    scope: YAHOO.Convio.PC2.Teamraiser
};

var GetSuggestedMessageForPreviewCallback = {
    success: function(o) {
        var response = YAHOO.lang.JSON.parse(o.responseText).getSuggestedMessageResponse;

        //get the current message state
        var message = saveMessage();
        //add in the template message
        message.subject = response.messageInfo.subject;
        if(YAHOO.lang.isString(response.messageInfo.messageBody)) {
            message.body = response.messageInfo.messageBody;
        }
        YAHOO.Convio.PC2.Teamraiser.previewMessage(PreviewMessageCallback, message);
    },
    failure: function(o) {
        logFailure(o);
    },
    scope: YAHOO.Convio.PC2.Teamraiser
};

var GetPersonalMessageCallback = {
    success: function(o) {
        var divString = "";
        var response = YAHOO.lang.JSON.parse(o.responseText).getSuggestedMessageResponse;
        
        YAHOO.util.Dom.get("email-subject").value = response.messageInfo.subject;
        messageId = response.messageInfo.messageId;
        
        selectTemplate(messageId);
        
        initialSubject = response.messageInfo.subject;
        var messageBody = "";
        if(YAHOO.lang.isString(response.messageInfo.messageBody)) {
            messageBody = response.messageInfo.messageBody;
        }
        var layoutId = response.messageInfo.layoutId;
        if(YAHOO.lang.isValue(layoutId) && layoutId > 0){
            unlockLayouts();
            chooseLayout(layoutId);
        } else {
            unlockLayouts();
            chooseLayout(defaultLayoutId);
        }
        setComposeEditorContent(messageBody);
        initialMessage = messageBody;
    },
    failure: function(o) {
        logFailure(o);
    },
    scope: YAHOO.Convio.PC2.Teamraiser
};

function loadSuggestedMessage( messageId, personal) {
    updatePageStatus("");
    var currentMessage = saveMessage();
    YAHOO.Convio.PC2.Views.contentHasBeenViewed = false;
    if ( (currentMessage.body == "" && currentMessage.subject == "") ||
            (currentMessage.body == initialMessage && currentMessage.subject == initialSubject)) 
    {
        if(personal) {
            YAHOO.Convio.PC2.Teamraiser.getSuggestedMessage(GetPersonalMessageCallback, messageId);
        } else {
            YAHOO.Convio.PC2.Teamraiser.getSuggestedMessage(GetSuggestedMessageCallback, messageId);
        }
    } 
    else {
        var confirmMessage = YAHOO.util.Dom.get('msg_cat_compose_replace_message');
        var confirmDialog = confirm(confirmMessage.innerHTML);
        if(confirmDialog) {
            if(personal) {
                YAHOO.Convio.PC2.Teamraiser.getSuggestedMessage(GetPersonalMessageCallback, messageId);
            } else {
                YAHOO.Convio.PC2.Teamraiser.getSuggestedMessage(GetSuggestedMessageCallback, messageId);
            }
        }
    }
};

function getDraft() {
    if(draftId > 0) {
        YAHOO.Convio.PC2.Teamraiser.getDraft(GetDraftCallback, draftId);
    }
};

var GetDraftCallback = {
    success: function(o) {
        var divString = "";
        var response = YAHOO.lang.JSON.parse(o.responseText).getDraftResponse;
            
        YAHOO.util.Dom.get("email-subject").value = response.messageInfo.subject;
        loadedMessageId = response.messageInfo.messageId;
        messageName = response.messageInfo.messageName;
        var messageBody = "";
        if(YAHOO.lang.isString(response.messageInfo.messageBody)) {
            messageBody = response.messageInfo.messageBody;
        }
        setComposeEditorContent(messageBody);
        
        var recipients = YAHOO.Convio.PC2.Utils.ensureArray(response.messageInfo.recipient);
        var recipientsString = "";
        for(var i=0; i<recipients.length; i++) {
            var recipient = recipients[i];
            recipientsString += getContactString(recipient);
        }
        YAHOO.util.Dom.get("email-addresses").value = recipientsString;
        syncWizardContactPicker();
        YAHOO.util.Dom.get("prepend-salutation").checked = (response.messageInfo.prependsalutation === 'true');
        var layoutId = response.messageInfo.layoutId;
        chooseLayout(layoutId);
    },
    failure: function(o) {
        logFailure(o);
    },
    scope: YAHOO.Convio.PC2.Teamraiser
};

var deleteSuggestedMessage = function(messageId) {
    YAHOO.Convio.PC2.Component.EmailCompose.DeleteConfirmDialog.showFor(messageId);
}

var deleteSuggestedMessageConfirmed = function(messageId) {
    var elm = document.getElementById("email-template-row-" + messageId);
    if(elm) {
        elm.parentNode.removeChild(elm);
    }
    YAHOO.Convio.PC2.Teamraiser.deleteDraft(DeleteSuggestedMessageCallback, messageId);
    clearTemplateArrays();
    //jQuery('#email-compose-templates .loader').show();
    YAHOO.Convio.PC2.Teamraiser.getSuggestedMessages(GetSuggestedMessagesCallback);
}

function clearTemplateArrays() {
    // clear all arrays
    gThanksTemplateArray = new Array();
    gRecruitTemplateArray = new Array();
    gSolicitTemplateArray = new Array();
    gOtherTemplateArray = new Array();
    gCustomTemplateArray = new Array();
}

var DeleteSuggestedMessageCallback = {
    success: function(o) {
        
    },
    failure: function(o) {
        logFailure(o);
    },
    scope: YAHOO.Convio.PC2.Teamraiser
};

function deleteDraft() {
    YAHOO.Convio.PC2.Teamraiser.deleteDraft(DeleteDraftCallback, draftId);
};

var DeleteDraftCallback = {
    success: function(o) {
        clearMessage();
        resetDraftInfo();
        // Make sure the paginator is updated.
        YAHOO.Convio.PC2.Teamraiser.Drafts.Paginator.reset();
    },
    failure: function(o) {
        logFailure(o);
    },
    scope: YAHOO.Convio.PC2.Teamraiser
};

function redirectToDrafts() {
    YAHOO.Convio.PC2.Utils.loadView("email", "drafts");
};

var pageStatusList = ['send-success','send-failure','save-success','save-template-success',
                      'save-failure','save-subject-failure','no-subject-failure',
                      'no-body-failure','no-recipients-failure','invalid-html-tag-failure',
                      'invalid-email-address-failure', 'null-email-addresses-removed', 'unknown-failure'];
function updatePageStatus(showItem, message) {
    for(var i=0; i<pageStatusList.length; i++) {
        var item = pageStatusList[i];
        if(item == showItem) {
            YAHOO.util.Dom.removeClass(item, "hidden-form");
            if(message) {
                YAHOO.util.Dom.get(item).innerHTML = message;
            }
        } else {
            YAHOO.util.Dom.addClass(item, "hidden-form");
        }
    }
};

function getMessageLayouts() {
    YAHOO.Convio.PC2.Teamraiser.getMessageLayouts(GetMessageLayoutsCallback);
};

var GetAddressBookContactsFromGroupsForEmailCallback = {
	success: function(o) {
		var response = YAHOO.lang.JSON.parse(o.responseText).getTeamraiserAddressBookContactsResponse;
        var contactArray = YAHOO.Convio.PC2.Utils.ensureArray(response.addressBookContact);
        var groupContactIds = [];
        for(var i=0; i< contactArray.length; i++) {
        	groupContactIds[i] = contactArray[i].id;
        }
        YAHOO.Convio.PC2.Views.contactIds = groupContactIds;
        YAHOO.Convio.PC2.Utils.loadView("email","compose");
	},
	failure: function(o) {
		logFailure(o);
	},
	scope: YAHOO.Convio.PC2.Teamraiser
};

var GetAddressBookContactsFromGroupsForCreateGroupCallback = {
		success: function(o) {
			var response = YAHOO.lang.JSON.parse(o.responseText).getTeamraiserAddressBookContactsResponse;
	        var contactArray = YAHOO.Convio.PC2.Utils.ensureArray(response.addressBookContact);
	        var contactIds = [];
	        for(var i=0; i< contactArray.length; i++) {
	        	contactIds[i] = contactArray[i].id;
	        }
	        if(GetAddressBookContactsFromGroupsForCreateGroupCallback.groupId != null) {
	        	YAHOO.Convio.PC2.AddressBook.addContactsToGroup(GetAddressBookContactsFromGroupsForCreateGroupCallback.callback, GetAddressBookContactsFromGroupsForCreateGroupCallback.groupId, contactIds);
	        } else {
	        	// create group
	        	YAHOO.Convio.PC2.AddressBook.createGroupForContacts(GetAddressBookContactsFromGroupsForCreateGroupCallback.callback, GetAddressBookContactsFromGroupsForCreateGroupCallback.groupName, contactIds);
	        }
	        // reset items 
	        GetAddressBookContactsFromGroupsForCreateGroupCallback.callback = null;
	        GetAddressBookContactsFromGroupsForCreateGroupCallback.groupName = null;
	        GetAddressBookContactsFromGroupsForCreateGroupCallback.groupId = null;
		},
		failure: function(o) {
			logFailure(o);
		},
		scope: YAHOO.Convio.PC2.Teamraiser,
		groupName: null,
		groupId: null,
		callback: null
	};

var emailContactsGroup = function(filterText) {
	loadGroupContacts(filterText, GetAddressBookContactsFromGroupsForEmailCallback);
};

var createGroupFromContactsGroup = function(filterText) {
	loadGroupContacts(filterText, GetAddressBookContactsFromGroupsForCreateGroupCallback);
};

var loadGroupContacts = function(filterText, callback) {
	// load a list of _all_ contacts based on the filter text
	var params = YAHOO.Convio.PC2.Teamraiser.getAddressBookContactsParams(null);
	params += "&skip_groups=true&tr_ab_filter=" + filterText;
	var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
	YAHOO.log('Preparing XHR, url=' + url + ", params=" + params, 'info', 'compose.js');
	YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
};

// auto complete 
var GetAddressBookAllContactsCallback = {
    success: function(o) {
        var response = YAHOO.lang.JSON.parse(o.responseText).getTeamraiserAddressBookContactsResponse;
        myContacts = YAHOO.Convio.PC2.Utils.ensureArray(response.addressBookContact);
        YAHOO.namespace("Convio.PC2.Data");
        YAHOO.Convio.PC2.Data.Contacts = myContacts;
        
        for(var i=0; i < myContacts.length; i++) {
            myContactsMap[myContacts[i].id] = myContacts[i]; 
        }
        YAHOO.Convio.PC2.Data.ContactsMap = myContactsMap;
        
        addContactsById(YAHOO.Convio.PC2.Views.contactIds);
        YAHOO.Convio.PC2.Views.contactIds = [];
        
        YAHOO.Convio.PC2.AddressBook.getAddressBookGroups(GetAddressBookGroupsCallback);
        
        addContactsById(YAHOO.Convio.PC2.Views.contactIds);
        YAHOO.Convio.PC2.Views.contactIds = [];
        
        YAHOO.Convio.PC2.Utils.publisher.fire("pc2:allContactsLoaded", myContacts);
        // since we have loaded contacts into Memory, attach a deleteContactHandler
        // to the pc2:contactDeleted event
        Y.use("pc2-contacts-functions", function(Y) {
            YAHOO.Convio.PC2.Utils.publisher.on("pc2:contactDeleted", deleteContactHandler);
        });
    },
    failure: function(o) {
        logFailure(o);
    },
    scope: YAHOO.Convio.PC2.Teamraiser
};

var ensureContactsLoaded = function() {
	
	// were contacts previously loaded?
	if (!myContacts || myContacts === null) {
		
		// load a list of _all_ contacts
	    var params = YAHOO.Convio.PC2.Teamraiser.getAddressBookContactsParams(null);
	    params += "&skip_groups=true";
	    var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
	    YAHOO.log('Preparing XHR, url=' + url + ", params=" + params, 'info', 'compose.js');
	    YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, GetAddressBookAllContactsCallback, params);
	    
	}
    
};

var clearCachedContacts = function() {
	myContacts = null;
	myContactsMap = [];
};

var GetContactsByIdsCallback = {
    success: function(o) {
        var response = YAHOO.lang.JSON.parse(o.responseText).getTeamraiserAddressBookContactsByIdsResponse;
        var contacts = YAHOO.Convio.PC2.Utils.ensureArray(response.addressBookContact);
        
        // Be sure they are in the appropriate data structures.
        for(var i=0; i < contacts.length; i++) {
            var curr = contacts[i];

            if(!myContactsMap[curr.id]) {
                if (!YAHOO.lang.isString(curr.email)) delete curr['email'];
                myContacts[myContacts.length] = curr;
                myContactsMap[curr.id] = curr;
            }
        }
    },
    failure: function(o) {
        logFailure(o);
    },
    scope: YAHOO.Convio.PC2.Teamraiser
};

var GetGroupContactsCallback = {
    success: function(o) {
        var response = YAHOO.lang.JSON.parse(o.responseText).getTeamraiserAddressBookGroupContactsResponse;
        var contacts =  YAHOO.Convio.PC2.Utils.ensureArray(response.addressBookContact);
        addContacts(contacts);
    },
    failure: function(o) {
        logFailure(o);
    },
    scope: YAHOO.Convio.PC2.Teamraiser
};

var addContacts = function(contacts) {
    var emailAddys = YAHOO.util.Dom.get("email-addresses");
    if(emailAddys) {
        var contactsString = "";

        for(var i = 0; i < contacts.length; i++) {
            var contact = contacts[i];
            var email = contact.email;

            if ( !isValidEmail(email) ) continue;

            if( emailAddys.value.indexOf( email ) == -1 || emailAddys.value.indexOf(contacts[i].id) == -1 ) {
                contactsString += getContactString( contact );
            }

            var contactName = contact.firstName + contact.lastName;
            addEmailToWizardRecipientList(email, contactName);
        }

        emailAddys.value = emailAddys.value + contactsString;
    }
};

function removeContacts(contacts) {
  for( var i=0; i<contacts.length; i++ ) {
    var contact = contacts[i];

    //remove them from the to line
    jQuery('#email-addresses').val( jQuery('#email-addresses').val().replace( getContactString(contact),'' ) );

    //make sure the checkbox is unchecked from wizard contact picker
    jQuery('#contact-picker-'+contact.id).attr('checked',false);
  }
  //remove them from the recipient list
  syncWizardContactPicker();
}

function removeContactsById(contactIds) {
  contactIds = YAHOO.Convio.PC2.Utils.ensureArray(contactIds);
  var contacts = [];
  for(var i=0; i < contactIds.length; i++) {
      var contact = myContactsMap[contactIds[i]];
      if(contact != null) {
        contacts[i] = contact;
      }
  }
  removeContacts(contacts);
}

function clearWizardRecipients() {
  YAHOO.Convio.PC2.Data.Recipients = [];
  jQuery('#email-wizard-recipients-table tbody').empty();
}

function populateEmailWizardContactPicker() {
  var contactTbl = jQuery('#email-wizard-contacts-table tbody');
  contactTbl.empty();
  myContactsPositionByEmail = [];
  myContactsPositionById = [];

  //there's a weird timing issue where sometimes myContacts isn't loaded yet.
  if( !myContacts ) {
    setTimeout( populateEmailWizardContactPicker, 500 );
    return;
  }

  for( var i = 0; i< myContacts.length; i++ ) {
    //it's still possible for address book contacts to not have an email address, i.e. entering an offline gift.
    //for this reason, we should check to see if the email address is not null or empty before rendering it in
    //the recipient list when composing an email
    var contact = myContacts[i];

    if( isValidEmail(contact.email) ) {
      var contactRow = "<tr><td class='email-wizard-contacts-checkbox'><input id=\"contact-picker-"+myContacts[i].id+"\"onclick=\"if(this.checked){addContactsById('"+myContacts[i].id+"');} else {removeContactsById('"+myContacts[i].id+"')}\" type='checkbox'></td>";
      var name = getContactName(myContacts[i]);
      contactRow += "<td class='email-wizard-contacts-name' title='"+name+"'>"+name+"</td>";
      contactRow += "<td class='email-wizard-contacts-email' title='"+myContacts[i].email+"'>"+myContacts[i].email+"</td>";
      contactRow += "</tr>";
      contactTbl.append(contactRow);
      myContactsPositionById[myContacts[i].id] = i;

      //make sure the contact is selected in the contact picker
     if( jQuery('#email-addresses').val().indexOf( getContactString(contact) ) != -1 ) {
        jQuery('#contact-picker-'+myContacts[i].id).attr('checked','checked');
     }
    }
  }
}

function isValidEmail (email) {
    if (!email) return false;
    return email.replace(/^\s+|\s+$/gm,'').length > 0;
}

function updateContactPickerSearchResults() {
  var searchTerm = jQuery('#email-wizard-contact-search').val().trim().replace(/'/g,'');
  if( !searchTerm ) {
    jQuery("#email-wizard-contacts-table tr").show();
    jQuery("#email-wizard-groups-table tr").show();
  } else {
    jQuery("#email-wizard-contacts-table tbody tr").hide();
    jQuery("#email-wizard-groups-table tbody tr").hide();
    //filter
    jQuery(".email-wizard-contacts-name:containsIgnoreCase('"+searchTerm+"')").closest('tr').show();
    jQuery(".email-wizard-contacts-email:containsIgnoreCase('"+searchTerm+"')").closest('tr').show();
    jQuery(".email-wizard-groups-name:containsIgnoreCase('"+searchTerm+"')").closest('tr').show();
  }
}

function syncWizardContactPicker() {
  var emailStr = jQuery('#email-addresses').val() || '';
  emailStr = emailStr.replace(/;/g,',').replace(/\s+/g,'');
  var emails = emailStr.split(/,/);

  var emailsAdded = [];
  clearWizardRecipients();
  for( var i=0; i<emails.length; i++ ) {
    var email = emails[i];
    var name = emails[i];
    if( !isValidEmail(email) )
      continue;
    if( email.match(/<.*>/) ) {
        email = email.substring(email.indexOf('<') + 1, email.indexOf('>'));
        name = name.substring(0, name.indexOf('<'));
    }
    addEmailToWizardRecipientList(email, name);
    emailsAdded.push(email);
  }
}

function getContactIdByEmail(email) {
  var contact = getContactByEmail(email);
  if(contact)
    return contact.id;
  else
    return null;
}
function getContactByEmail(email) {
  if(!myContacts)
    return null;
  for( var i=0; i<myContacts.length; i++ ) {
    var contact = myContacts[i];
    if(contact.email==email)
      return contact;
  }
}

function getContactByEmailAndName(email, name){
    if(!myContacts)
        return null;
    for( var i=0; i<myContacts.length; i++ ) {
        var contact = myContacts[i];
        var contactName = contact.firstName +  contact.lastName;
        if(contact.email==email && contactName == name)
            return contact;
    }
}

function getNewRecipientPositionInList( contact, list ) {
  //binary search the sorted list for the contact
  if(!list || list.length===0)
    return 0;

  var contactVal = myContactsPositionById[contact.id];
  var startIndex  = 0,
      stopIndex   = list.length - 1,
      middle      = Math.floor((stopIndex + startIndex)/2);

  while( myContactsPositionById[list[middle].id] != contactVal && startIndex < stopIndex ) {
    var middleVal = myContactsPositionById[list[middle].id];
    if( contactVal < middleVal ) {
      stopIndex = middle - 1;
    } else if( contactVal > middleVal ) {
      startIndex = middle + 1;
    }
    //recalculate middle
    middle = Math.floor((stopIndex + startIndex)/2);
    if( middle < 0 )
      middle = 0;
    if( middle>= list.length )
      middle = list.length-1;
  }

  if(middle<0)
    return 0;

  if( middle===list.length-1 && contactVal>myContactsPositionById[list[middle].id] )
    return middle+1;
  else
    return middle;
}

function getContactEditLink(contact) {
  return '<button class="email-wizard-recipients-actions-button" onclick="showEditContactDialog(\''+contact.id+'\')">'+jQuery('#msg_cat_wizard_contact_edit_link').html()+'</button>';
}
function getRecipientRemoveButton(contact) {
  return '<button class="email-wizard-recipients-actions-button" onclick="removeContactsById(\''+contact.id+'\')">X</button>';
}
function getContactName(contact) {
    var str = '';
    if( contact && contact.firstName )
        str += contact.firstName;
    if( contact && contact.lastName ) {
        if( str )
            str += ' ';
        str += contact.lastName;
    }
    if(!str)
        str = '&lt;no name&gt;';
    return str;
}
function addEmailToWizardRecipientList(email, name) {
  var contact = getContactByEmailAndName(email, name);
  if(!contact)
    return;

  if(!YAHOO.Convio.PC2.Data.Recipients)
    YAHOO.Convio.PC2.Data.Recipients = [];

  var n = getNewRecipientPositionInList( contact, YAHOO.Convio.PC2.Data.Recipients );
  
  //see if the contact is already in the list
  if( YAHOO.Convio.PC2.Data.Recipients[n] && YAHOO.Convio.PC2.Data.Recipients[n].id==contact.id )
    return;

  YAHOO.Convio.PC2.Data.Recipients.splice(n,0,contact);

  //add the DOM stuff
  var tr = '<tr>';
  var name = getContactName(contact);
  tr += '<td class="email-wizard-recipients-name" title="'+name+'">'+name+'</td>';
  tr += '<td class="email-wizard-recipients-email" title="'+contact.email+'">'+contact.email+'</td>';
  tr += '<td class="email-wizard-recipients-actions">'+getContactEditLink(contact)+getRecipientRemoveButton(contact)+'</td>';
  tr += '</tr>';
  if(n==0)
    jQuery('#email-wizard-recipients-table tbody').prepend(tr);
  else
    jQuery(jQuery('#email-wizard-recipients-table tbody tr')[n-1]).after(tr);

  //make sure the contact is selected in the contact picker
  jQuery('#contact-picker-'+contact.id).attr('checked','checked');
}
function toggleAllWizardRecipients(checked) {
  var searchEnabled = jQuery.trim( jQuery('#email-wizard-contact-search').val() ) !== '';
  if( searchEnabled ) {
    var contactIds = [];
    //find list of contact ids that need to be flipped
    jQuery('#email-wizard-contacts-table tbody input:visible').each( function(i,el) {
        if( jQuery(el).attr('checked') !== checked ) {
            var contactId = el.id.substring(15);
            contactIds.push(contactId);
        }
    });
    if(checked)
        addContactsById(contactIds);
    else
        removeContactsById(contactIds);
  } else {
      if(checked) {
        jQuery('#email-wizard-contacts-table tbody input').attr('checked','checked');
        jQuery('#email-wizard-groups-table tbody input').attr('checked','checked');
        addContactsById('all');
      } else {
        jQuery('#email-wizard-contacts-table tbody input').attr('checked',false);
        jQuery('#email-wizard-groups-table tbody input').attr('checked',false);
        jQuery('#email-addresses').val('');
        clearWizardRecipients();
      }
  }
}

function showEmailWizardContactsPicker() {
  jQuery('#email-wizard-groups-table-header').hide();
  jQuery('#email-wizard-groups-table-container').hide();
  jQuery('#email-wizard-contacts-table-header').show();
  jQuery('#email-wizard-contacts-table-container').show();
}

function toggleGroup( filterValue, selected ) {
  console.log('loading contacts from '+filterValue+' : '+selected);
  if(selected) {
    addContactsBySystemDefinedFilter(filterValue);
  } else {
    removeContactsBySystemDefinedFilter(filterValue);
  }
}
var emailWizardGroupsCallback = {
  success: function(o) {
    var response = YAHOO.lang.JSON.parse(o.responseText).getTeamraiserAddressBookFiltersResponse;
    for(var i=0; i < response.filterGroup.length; i++) {
      response.filterGroup[i].filter = YAHOO.Convio.PC2.Utils.ensureArray(response.filterGroup[i].filter);
      for(var j=0; j < response.filterGroup[i].filter.length; j++) {
        var filterValue = response.filterGroup[i].filter[j].filterValue;
        var filterName = response.filterGroup[i].filter[j].filterName;
        if( response.filterGroup[i].filter[j].filterValue.indexOf("email_rpt_group_") < 0 ) {
          //built-in group
          var filterElementId = "msg_cat_filter_" + response.filterGroup[i].filter[j].filterValue;
          var filterElement = YAHOO.util.Dom.get(filterElementId);
          if (!filterElement) {
            YAHOO.log('Failed to find expected DOM element with ID "' + filterElementId + '"', 'warn', 'compose-functions.js');
            continue;
          }
          filterName = filterElement.innerHTML;
        }
        //add groups to table
        var tr = '<tr>';
        tr += '<td><input type="checkbox" onclick="toggleGroup(\''+filterValue+'\',this.checked)"></td>';
        tr += '<td class="email-wizard-groups-name" title="'+filterName+'">'+filterName+'</td>';
        tr += '</tr>';
        jQuery('#email-wizard-groups-table tbody').append(tr);
      }
    }
  },
  failure: function(o) {
    YAHOO.log("Error with getting address book filters: " + o.responseText, "error", "compose-functions.js");
  },
  cache: false
};

function showEmailWizardGroupsPicker() {
  jQuery('#email-wizard-contacts-table-header').hide();
  jQuery('#email-wizard-contacts-table-container').hide();
  jQuery('#email-wizard-groups-table-header').show();
  jQuery('#email-wizard-groups-table-container').show();
  if( typeof YAHOO.Convio.PC2.Data.Groups === 'undefined' ) {
    jQuery('#email-wizard-groups-table tbody').empty();
    //TODO: put in a loading spinner
    //load the groups
    YAHOO.Convio.PC2.Teamraiser.getAddressBookFilters( emailWizardGroupsCallback, false );
  }
}

function getContactStringSortable(contact) {
    if(YAHOO.lang.isUndefined(contact)) {
      return "";
    }
    var returnString = "";
    if(YAHOO.lang.isString(contact.lastName)) {
      var lName = contact.lastName.replace(/,/g,"");
      returnString += YAHOO.Convio.PC2.Utils.htmlUnescape(lName);
    }
    if(YAHOO.lang.isString(contact.firstName)) {
      if(returnString != "") {
          returnString += " ";
      }
      var fName = contact.firstName.replace(/,/g,"");
      returnString += YAHOO.Convio.PC2.Utils.htmlUnescape(fName);
    }
    if(YAHOO.lang.isString(contact.email)) {
      if(returnString != "") {
          returnString += " ";
      }
      returnString += YAHOO.Convio.PC2.Utils.htmlUnescape(contact.email);
    }
    return returnString.toLowerCase();
}

function getContactString(contact) {
    if(!contact || !isValidEmail(contact.email) ) return "";

    var returnString = "";

    if(YAHOO.lang.isString(contact.firstName)) {
        var fName = YAHOO.Convio.PC2.Utils.htmlUnescape(contact.firstName);
        returnString += fName.replace(/(,|<|>)/g,"");
    }

    if(YAHOO.lang.isString(contact.lastName)) {
        if(returnString != "") {
            returnString += " ";
        }
        var lName = YAHOO.Convio.PC2.Utils.htmlUnescape(contact.lastName);
        returnString += lName.replace(/(,|<|>)/g,"");
    }

    if(returnString == "") {
        returnString += YAHOO.Convio.PC2.Utils.htmlUnescape(contact.email) + ", ";
    } else {
    	var email = YAHOO.Convio.PC2.Utils.htmlUnescape(contact.email);
        returnString += " <" + email + ">, ";
    }

    return returnString;
};

var GetAddressBookGroupsCallback = {
    success: function(o) {
        var response = YAHOO.lang.JSON.parse(o.responseText).getAddressBookGroupsResponse;
        response.group =  YAHOO.Convio.PC2.Utils.ensureArray(response.group);
        var contactsLength = myContacts.length;
        for(var i=0; i< response.group.length; i++) {
            var group = response.group[i];
            myContacts[contactsLength++] = group;
        }
        
        // avoid wiring in multiple auto-complete components
        if (!composeAutoComplete || composeAutoComplete === null) {
        	
	        var matchNames = function(sQuery) {
	            if(YAHOO.lang.isUndefined(myContacts)) {
	                return "";
	            }
	            // Case insensitive matching
	            var query = sQuery.toLowerCase(),
	                contact,
	                i=0,
	                l=myContacts.length,
	                matches = [];
	            // Match against each name of each contact
	            for(; i<l; i++) {
	                contact = myContacts[i];
	                if( (YAHOO.lang.isUndefined(contact.email) == false && YAHOO.lang.isNull(contact.email) == false && 
	                        YAHOO.lang.isString(contact.email) && contact.email != "" && contact.email.indexOf('@') > -1 &&
	                    ((YAHOO.lang.isString(contact.firstName)&& contact.firstName.toLowerCase().indexOf(query) == 0) ||
	                    (YAHOO.lang.isString(contact.lastName) && contact.lastName.toLowerCase().indexOf(query) == 0) ||
	                    (contact.email && (contact.email.toLowerCase().indexOf(query) == 0)))) ||
	                    (YAHOO.lang.isString(contact.name) && contact.name && (contact.name.toLowerCase().indexOf(query) == 0))
	                    ) {
	                    matches[matches.length] = contact;
	                }
	            }
	            return matches;
	        };
	        
	        // Use a FunctionDataSource
	        var oDS = new YAHOO.util.FunctionDataSource(matchNames);
	        oDS.responseSchema = {
	            fields: ["id", "firstName", "lastName", "email", "name"]
	        }
	
	        // Instantiate AutoComplete
	        var oAC = new YAHOO.widget.AutoComplete("email-addresses", "email-addresses-container", oDS);
	        composeAutoComplete = oAC;
	        oAC.useShadow = true;
	        oAC.resultTypeList = false;
	        
	        
	        // Custom formatter to highlight the matching letters
	        oAC.formatResult = function(oResultData, sQuery, sResultMatch) {
	        	
	            var query = sQuery.toLowerCase(),
	                firstName = (YAHOO.lang.isString(oResultData.firstName)) ? oResultData.firstName : "", // Guard against null value & non-string value
	                lastName = (YAHOO.lang.isString(oResultData.lastName)) ? oResultData.lastName : "", // Guard against null value & non-string value
	                email = oResultData.email || "", // Guard against null value
	                groupName = oResultData.name || "", // Guard against null value
	                query = sQuery.toLowerCase(),
	                firstNameMatchIndex = firstName.toLowerCase().indexOf(query),
	                lastNameMatchIndex = lastName.toLowerCase().indexOf(query),
	                emailMatchIndex = email.toLowerCase().indexOf(query),
	                groupNameMatchIndex = groupName.toLowerCase().indexOf(query),
	                displayFirstName, displayLastName, displayEmail, displayGroupName;
	                
	            if(firstNameMatchIndex == 0) {
	                displayFirstName = highlightMatch(firstName, query, firstNameMatchIndex);
	            }
	            else {
	                displayFirstName = firstName;
	            }
	
	            if(lastNameMatchIndex == 0) {
	                displayLastName = highlightMatch(lastName, query, lastNameMatchIndex);
	            }
	            else {
	                displayLastName = lastName;
	            }
	
	            if(emailMatchIndex == 0) {
	                displayEmail = "&lt;" + highlightMatch(email, query, emailMatchIndex) + "&gt;";
	            }
	            else {
	                displayEmail = email ? "&lt;" + email + "&gt;" : "";
	            }
	            
	            if(groupNameMatchIndex == 0) {
	                displayGroupName = highlightMatch(groupName, query, groupNameMatchIndex);
	            }
	            else {
	                displayGroupName = groupName; 
	            }
	
	            var returnString = "";
	            if(groupName == "") {
	                if(displayFirstName != "" || displayLastName != "") {
	                    returnString += displayFirstName + " " + displayLastName + " ";
	                }
	                returnString += displayEmail;
	            } else {
	                returnString = displayGroupName;
	            }
	            return returnString;
	            
	        };
	        
	        // Helper function for the formatter
	        var highlightMatch = function(full, snippet, matchindex) {
	            return full.substring(0, matchindex) + 
	                    "<span class='match'>" + 
	                    full.substr(matchindex, snippet.length) + 
	                    "</span>" +
	                    full.substring(matchindex + snippet.length);
	        };
	
	        // Define an event handler to populate a hidden form field
	        // when an item gets selected and populate the input field
	        var myHandler = function(sType, aArgs) {
	            var myAC = aArgs[0]; // reference back to the AC instance
	            var elLI = aArgs[1]; // reference to the selected LI element
	            var oData = aArgs[2]; // object literal of selected item's result data
	            
	            var emailAddresses = YAHOO.util.Dom.get("email-addresses").value;
	            emailAddresses = emailAddresses.substring(0, emailAddresses.lastIndexOf(oData.id));
	            var newAddress = "";
	            var hasName = true;
	            if(YAHOO.lang.isString(oData.firstName)) {
	                newAddress += YAHOO.Convio.PC2.Utils.htmlUnescape(oData.firstName);
	                if(YAHOO.lang.isString(oData.lastName)) {
	                    newAddress += " " + YAHOO.Convio.PC2.Utils.htmlUnescape(oData.lastName);
	                }
	            } else if(YAHOO.lang.isString(oData.lastName)) {
	                newAddress += YAHOO.Convio.PC2.Utils.htmlUnescape(oData.lastName);
	            } else {
	                hasName = false;
	            }
	            
	            if(YAHOO.lang.isString(oData.email)) {
	                if(hasName) {
	                    newAddress += " <" + YAHOO.Convio.PC2.Utils.htmlUnescape(oData.email) + ">";
	                } else {
	                    newAddress += YAHOO.Convio.PC2.Utils.htmlUnescape(oData.email);
	                }
	            }
	            
	            if(YAHOO.lang.isString(oData.name)) {
	                YAHOO.Convio.PC2.Teamraiser.getAddressBookGroupContacts(GetGroupContactsCallback, oData.id);
	            }
	    
	            myAC.getInputEl().value = emailAddresses + newAddress + (newAddress == "" ? "" : ", ");//oData.firstName + " " + oData.lastName + (oData.email ? " (" + oData.email + ")" : "");
	        };
	        oAC.delimChar = [",",";"]; // Enable comma and semi-colon delimiters
	        
	//        var myHandler2 = function(sType, aArgs) {
	//            oAC.sendQuery("");
	//        };
	        oAC.itemSelectEvent.subscribe(myHandler);
	        
	        addContactsByGroup(YAHOO.Convio.PC2.Views.groupIds)
	        YAHOO.Convio.PC2.Views.groupIds = [];
	        
	        return {
	            oDS: oDS,
	            oAC: oAC 
	        };
	        
        }
        
    },
    failure: function(o) {
        logFailure(o);
    },
    scope: YAHOO.Convio.PC2.Teamraiser
};

var GetSentMessageCallback = {
    success: function(o) {
        var divString = "";
        var response = YAHOO.lang.JSON.parse(o.responseText).getSentMessageResponse;

        YAHOO.util.Dom.get("email-subject").value = response.messageInfo.subject;
        messageName = response.messageInfo.messageName;
        var messageBody = "";
        if(YAHOO.lang.isString(response.messageInfo.messageBody)) {
            messageBody = response.messageInfo.messageBody;
        }
        setComposeEditorContent(messageBody);
    },
    failure: function(o) {
        logFailure(o);
    },
    scope: YAHOO.Convio.PC2.Teamraiser
};
/*
var mceInitInstance = function() {
    var sentMessageId = YAHOO.Convio.PC2.Utils.getUrlParam("sent_message_id");
    if(draftId == -1 && YAHOO.lang.isUndefined(sentMessageId) == false && sentMessageId > 0) {
        YAHOO.Convio.PC2.Teamraiser.getSentMessage(GetSentMessageCallback, sentMessageId);
    }
    getMessageLayouts();
};
*/


var parseRecipient = function(recipient) {
    var returnString = "";
    if(YAHOO.lang.isUndefined(recipient.firstName) || recipient.firstName == null || YAHOO.lang.isUndefined(recipient.lastName) || recipient.lastName == null) {
        returnString += recipient.email;
    } else {
        returnString += recipient.firstName + ' ' + recipient.lastName;
    }
    return returnString;
};

var addContactsById = function(contactIds) {
    if(contactIds == "all") {
        addContacts(myContacts);
    } 
    else if(contactIds == "teammates") {
    	addContactsBySystemDefinedFilter('email_rpt_show_teammates');
    } 
    else {
        contactIds = YAHOO.Convio.PC2.Utils.ensureArray(contactIds);
        var added = [];
        for(var i=0; i < contactIds.length; i++) {
            var contact = myContactsMap[contactIds[i]];
            if(contact != null) {
                added[i] = contact;
            }
        }
        addContacts(added);
    }
};

var getContactsBySystemDefinedFilter = function( systemDefinedFilterName, callback ) {
  // define REST request details needed to fetch collection of contacts
  // that are members of a system defined group
  var params = YAHOO.Convio.PC2.Teamraiser.getAddressBookContactsParams(
    {
      // filter by system-defined group name
      tr_ab_filter: systemDefinedFilterName,
      // fetch all values with a single REST call
      noPage: true
    }
  );
  params += "&skip_groups=true";
  var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
    
  // asynchronously execute REST request & handle response 
  YAHOO.log('Preparing XHR, url=' + url + ", params=" + params, 'info', 'compose.js');
  //start loader
  jQuery('.email-wizard-recipients-header .loader').show();
  YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, {
      success: function(o) {
        var response = YAHOO.lang.JSON.parse(o.responseText).getTeamraiserAddressBookContactsResponse;
        var contacts =  YAHOO.Convio.PC2.Utils.ensureArray(response.addressBookContact);
        callback(contacts);
        //stop loader
        jQuery('.email-wizard-recipients-header .loader').hide();
     },
      failure: function(o) {
          logFailure(o);
          //stop loader
          jQuery('.email-wizard-recipients-header .loader').hide();
      },
      scope: YAHOO.Convio.PC2.Teamraiser
    },
    params
  );
}

/**
 * Asynchronously fetches all contacts in a system-defined filter 
 * group and populates them into the "To" field of the email-compose view.
 */
var addContactsBySystemDefinedFilter = function(systemDefinedFilterName) {
  getContactsBySystemDefinedFilter( systemDefinedFilterName, addContacts );
}

var removeContactsBySystemDefinedFilter = function(systemDefinedFilterName) {
  getContactsBySystemDefinedFilter( systemDefinedFilterName, removeContacts );
}

var addContactsByGroup = function(groupIds) {
    groupIds = YAHOO.Convio.PC2.Utils.ensureArray(groupIds);
    if(groupIds.length > 0) {
        YAHOO.Convio.PC2.Teamraiser.getAddressBookGroupContacts(GetGroupContactsCallback, groupIds);
    }
};

var selectTemplate = function(templateId) {
    YAHOO.util.Dom.removeClass("personal_message_" + YAHOO.Convio.PC2.Data.selectedMessageId, "selected");
    YAHOO.util.Dom.addClass("personal_message_" + templateId, "selected");
    YAHOO.Convio.PC2.Data.selectedMessageId = templateId;
};

var redirectToContacts = function() { 
    YAHOO.Convio.PC2.Utils.loadView("email", "contacts"); 
};

var highlightTemplate = function(templateId) {
    YAHOO.util.Dom.addClass("personal_message_" + templateId, "templateHighlight");
};
var unhighlightTemplate = function(templateId) {
    YAHOO.util.Dom.removeClass("personal_message_" + templateId, "templateHighlight");
};
