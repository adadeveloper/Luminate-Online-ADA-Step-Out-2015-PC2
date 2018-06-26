var shareFacebookDialog,
	shareMySpaceDialog,
	shareYahooDialog,
	shareTwitterDialog,
	shareLinkedInDialog,
	shareFinishedDialog,
	disconnectDialog,
	disconnectFinishedButton,
	userInfoResponse;
Y.use('gigya', 'boxinator', 'yui2-button', 'yui2-connection', function()
{
	var TWITTER_MSG_LENGTH = 140;
	var SHORT_URL_LENGTH = 23;
	MAX_COMMENTS_LENGTH = TWITTER_MSG_LENGTH - SHORT_URL_LENGTH;
	 	
	shareFacebookDialog = new Y.Convio.widget.Boxinator('#shareFacebookDialog', Y.Convio.widget.Boxinator.DIALOG, null, document.body);
	var shareFacebookButton = new YAHOO.widget.Button('shareFacebookButton');
	shareFacebookButton.subscribe('click', share, 'facebook', shareFacebookDialog);
	
	shareYahooDialog = new Y.Convio.widget.Boxinator('#shareYahooDialog', Y.Convio.widget.Boxinator.DIALOG, null, document.body);
	var shareYahooButton = new YAHOO.widget.Button('shareYahooButton');
	shareYahooButton.subscribe('click', share, 'yahoo', shareFacebookDialog);
	
	shareMySpaceDialog = new Y.Convio.widget.Boxinator('#shareMySpaceDialog', Y.Convio.widget.Boxinator.DIALOG, null, document.body);
	var shareMySpaceButton = new YAHOO.widget.Button('shareMySpaceButton');
	shareMySpaceButton.subscribe('click', share, 'myspace', shareFacebookDialog);
	
	shareTwitterDialog = new Y.Convio.widget.Boxinator('#shareTwitterDialog', Y.Convio.widget.Boxinator.DIALOG, null, document.body);
	document.getElementById('shareTwitterCharacters').value = MAX_COMMENTS_LENGTH;
	var shareTwitterButton = new YAHOO.widget.Button('shareTwitterButton');
	shareTwitterButton.subscribe('click', share, 'twitter', shareFacebookDialog);
	
	shareLinkedInDialog = new Y.Convio.widget.Boxinator('#shareLinkedInDialog', Y.Convio.widget.Boxinator.DIALOG, null, document.body);
	var shareLinkedInButton = new YAHOO.widget.Button('shareLinkedInButton');
	shareLinkedInButton.subscribe('click', share, 'linkedin', shareFacebookDialog);
	
	shareFinishedDialog = new Y.Convio.widget.Boxinator('#shareFinishedDialog', Y.Convio.widget.Boxinator.DIALOG, null, document.body);
	var shareFinishedButton = new YAHOO.widget.Button('shareFinishedButton');
	shareFinishedButton.subscribe('click', shareFinishedDialog.onEventHide, null, shareFinishedDialog);
	
	disconnectDialog = new Y.Convio.widget.Boxinator('#disconnectDialog', Y.Convio.widget.Boxinator.DIALOG, null, document.body);
	disconnectFinishedButton = new YAHOO.widget.Button('disconnectFinishedButton');
});

function textCounter(field, cntfield, maxlimit)
{
	// if too long...trim it!
 	if (field.value.length > maxlimit)
 	{
 		field.value = field.value.substring(0, maxlimit);
 	}
 	// otherwise, update 'characters left' counter
 	else
 	{
 		cntfield.value = maxlimit - field.value.length;
 	}	 	 	
 }

/*
YAHOO.Convio.PC2.Data.sharingConf =
{
	APIKey: '[[S100:SNS_GIGYA_API_KEY]]'
};
*/

function publishUserActionCallback(response)
{
	YAHOO.log("publishUserActionCallback: " + YAHOO.lang.dump(response), "debug", "share-functions.js");
	
	var provider = response.context.provider;
	var userID = response.context.userID;

	var dialog = getDialog(provider);
 	dialog.hide();

	if (response.status == "OK")
	{
		// Swap out the share info with a success message
 	 	shareFinishedDialog.setBody(YAHOO.util.Dom.get("msg_cat_social_share_success").innerHTML);
 	 	logShare(userID,provider);
	}
	else if (response.status == "LIMIT_REACHED")
	{
		YAHOO.log(YAHOO.lang.dump(response), "info", "share-functions.js");
		shareFinishedDialog.setBody(YAHOO.util.Dom.get("msg_cat_social_share_limit_reached").innerHTML);
	}
 	else
 	{
 		YAHOO.log(YAHOO.lang.dump(response), "info", "share-functions.js");
 	 	shareFinishedDialog.setBody(YAHOO.util.Dom.get("msg_cat_social_share_fail").innerHTML);
 	}
 	shareFinishedDialog.show();
}

function connectCallback(response)
{
	YAHOO.log("conectCallback: " + YAHOO.lang.dump(response), "debug", "share-functions.js");
	
	var provider = response.context;
	if (response.status == "OK" && typeof(response.user) !== 'undefined' && response.user != null)
	{
		var fullContext = { provider: provider, userID: response.user.UID };

		var action = getUserAction(provider);
		gigya.services.socialize.publishUserAction(
			{
				userAction: action, 
				callback: publishUserActionCallback, 
				enabledProviders: provider, 
				context: fullContext
			}
		);
	}
	else 
	{
		var dialog = getDialog(provider);
		dialog.hide();
		YAHOO.log(YAHOO.lang.dump(response), "info", "share-functions.js");
		shareFinishedDialog.setBody(YAHOO.util.Dom.get("msg_cat_social_connection_error").innerHTML);
		shareFinishedDialog.show();
	}		
}

function getUserAction(provider)
{
		var action = new gigya.services.socialize.UserAction();
		var shareAction = YAHOO.Convio.PC2.Data.shareAction;
		if (shareAction != '')
		{
			action.addActionLink(shareAction, getDonateLink());
		}
		action.setUserMessage(getComments(provider));
		
		var shareTitle = YAHOO.Convio.PC2.Data.shareTitle;
		if (shareTitle != '')
		{
 			if (provider == 'twitter')
 			{
 	 			// Don't set a title for twitter
 			}
 			else
 			{
				action.setTitle(shareTitle);
 			}
		}
		var shareMessage = YAHOO.Convio.PC2.Data.shareMessage;
		if (shareMessage != '')
		{
			action.setDescription(shareMessage);
		}
		action.setLinkBack(getLink());
		return action;
}
	
function getComments(provider)
{
 	switch (provider)
 	{
 	case 'facebook': 
 	 	return document.getElementById('shareFacebookMessage').value;
 	 	break;
 	case 'yahoo':
 		return document.getElementById('shareYahooMessage').value;
 	 	break;
 	case 'myspace':
 		return document.getElementById('shareMySpaceMessage').value;
 	 	break;
 	case 'twitter':
 		return document.getElementById('shareTwitterMessage').value;
 	 	break;
 	case 'linkedin':
 		return document.getElementById('shareLinkedInMessage').value;
 	 	break;
 	}
}

function getDialog(provider)
{
 	switch (provider)
 	{
 	case 'facebook':
 	 	return  shareFacebookDialog;
 	case 'yahoo':
 	 	return  shareYahooDialog;
 	case 'myspace':
 	 	return  shareMySpaceDialog;
 	case 'twitter':
 	 	return  shareTwitterDialog;
 	case 'linkedin':
 	 	return  shareLinkedInDialog;
 	}
}

function getProviderName(provider)
{
	switch (provider)
 	{
 	case 'facebook':
 	 	return  YAHOO.util.Dom.get("msg_cat_social_share_facebook").innerHTML;
 	case 'yahoo':
 		return  YAHOO.util.Dom.get("msg_cat_social_share_yahoo").innerHTML;
 	case 'myspace':
 		return  YAHOO.util.Dom.get("msg_cat_social_share_myspace").innerHTML;
 	case 'twitter':
 		return  YAHOO.util.Dom.get("msg_cat_social_share_twitter").innerHTML;
 	case 'linkedin':
 		return  YAHOO.util.Dom.get("msg_cat_social_share_linkedin").innerHTML;
 	}
}


function showShareDialog(provider)
{
	// See if the user is connected to this provider
	gigya.services.socialize.getUserInfo( 
			{context: provider,
			 callback: function(response)
			 {
				YAHOO.log("getUserInfoCallback: " + YAHOO.lang.dump(response), "debug", "share-functions.js"); 
				
				userInfoResponse = response;
				
				var showLoggedInAs = false;
				var nickname = "";
				
				if (response.status == "OK" && response.user.isConnected && response.user.identities[provider] != null)
				{
					showLoggedInAs = true;
					nickname = response.user.identities[provider].nickname;
					if (nickname == "")
					{
						nickname = response.user.identities[provider].firstName + " " + response.user.identities[provider].lastName;
					}
					if (nickname == " ")
					{
						nickname = response.user.identities[provider].email;
					}
					if (nickname == "")
					{
						showLoggedInAs = false;
					}
				}
				
				var dialog = getDialog(provider);
				if (showLoggedInAs)
				{
					dialog.header.innerHTML = YAHOO.util.Dom.get("msg_cat_social_share_on").innerHTML + ' ' + getProviderName(provider) + ' ' +
						YAHOO.util.Dom.get("msg_cat_social_share_as").innerHTML + ' ' + nickname;
					dialog.header.innerHTML += ' (<a href="#" onclick="disconnect(\'' + provider + '\'); return false;">' +
						YAHOO.util.Dom.get("msg_cat_social_share_not_you").innerHTML + '</a>)';
				}
				dialog.show();
			 }
			});
}

function disconnect(provider)
{
	gigya.services.socialize.disconnect({'provider': provider, 
		callback: function(response)
		{
			YAHOO.log("disconnectCallback: " + YAHOO.lang.dump(response), "debug", "share-functions.js");
			
			var dialog = getDialog(provider);
			dialog.hide();
			disconnectFinishedButton.subscribe('click', 
				function()
				{
					disconnectDialog.hide();
					dialog.show(); 
				},
				null, disconnectDialog);
			var providerName = getProviderName(provider);

			if (response.errorCode == 0)
			{
				disconnectDialog.body.innerHTML = 
					YAHOO.util.Dom.get("msg_cat_social_share_disconnect_success_part1").innerHTML + ' ' + providerName +
					YAHOO.util.Dom.get("msg_cat_social_share_disconnect_success_part2").innerHTML + ' ' + providerName +
					YAHOO.util.Dom.get("msg_cat_social_share_disconnect_success_part3").innerHTML;
				dialog.header.innerHTML = YAHOO.util.Dom.get("msg_cat_social_share_on").innerHTML + ' ' + providerName;
				userInfoResponse = null;
			}
			else
			{
				YAHOO.log(YAHOO.lang.dump(response), "info", "share-functions.js");
				disconnectDialog.body.innerHTML = YAHOO.util.Dom.get("msg_cat_social_share_disconnect_failure_part1").innerHTML + ' ' + providerName + 
					YAHOO.util.Dom.get("msg_cat_social_share_disconnect_failure_part2").innerHTML;
			}
			disconnectDialog.show();				
		}
	});
 }

function share(event, provider)
{
	var response = userInfoResponse;
		
	if (response != null && response.status == "OK" && typeof(response.user) !== 'undefined' && response.user != null && response.user.isConnected && response.user.identities[provider] != null) 
	{
	    var fullContext = { provider: provider, userID: response.user.UID };
	      
		var action = getUserAction(provider);
		gigya.services.socialize.publishUserAction({userAction: action, callback: publishUserActionCallback, enabledProviders: provider, context: fullContext});
	}
	else 
	{
		gigya.services.socialize.connect({useFacebookConnect: true, 'provider': provider, context: provider, callback: connectCallback, sessionExpiration: '0'});
	}
}

function logShare(userID, provider) 
{
    var logShareCallback = {
        success: function(o) {
            YAHOO.log("Successfully recorded share for userID=" + userID + ", provider=" + provider, "info", "share-functions.js");
        },
        failure: function(o) {
        	YAHOO.log("Failed to record share for userID=" + userID + ", provider=" + provider, "info", "share-functions.js");
        }
    };
    YAHOO.Convio.PC2.Constituent.logShare(userID, provider, logShareCallback);
}

function getLink(link)
{
    return YAHOO.Convio.PC2.Data.personalPageUrl;
}

function getDonateLink(link)
{
    return YAHOO.Convio.PC2.Data.personalDonationUrl;
}