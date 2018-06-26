/**
 * Closes this window.
 * @member Utils
 */
//TODO DSW Vernon 42928 Move this method to a common js library file?
function closeWin() {
	var isIE = (navigator.appName.indexOf("Microsoft") != -1 && navigator.appName.indexOf("Mac") == -1);

	if (isIE) {
		window.close();
	} else {
		self.close();
	}
};

function addLogger() {
    if(YAHOO.Convio.PC2.Config.isLoggingEnabled()) {
        var myLogReader = new YAHOO.widget.LogReader("yui-logging");
    }
};

function doValidation() {
    
};

var messageBundleCallback = {
    success: function(o) {
        YAHOO.Convio.PC2.Component.Content.loadMsgCatalogResponseHandler.success(o);
        
        var labels = {
                donor: document.getElementById("msg_cat_donations_donor_label").innerHTML,
                amount: document.getElementById("msg_cat_donations_amount_label").innerHTML,
                notes: document.getElementById("msg_cat_donations_notes_label").innerHTML,
                date: document.getElementById("msg_cat_donations_date_label").innerHTML,
                msgEmpty: document.getElementById("msg_cat_donations_no_donations_found").innerHTML
        }
        var customListCriteria = {
					pageSize : 500,
					pageOffset : 0,
					sortColumn : 'date_recorded',
					isAscending : 'false',
					totalResult : 0
        };
        YAHOO.Convio.PC2.Component.GiftHistory.loadCustomPersonalGiftHistory("personal-donations-block", customListCriteria, false, labels, false);
    },
    failure: function(o) {
        YAHOO.Convio.PC2.Component.Content.loadMsgCatalogResponseHandler.failure(o);
    }
}

function loadComponents() {
	
    var keys = [
                'donations_heading','donations_close', 'donations_donor_label', 'donations_amount_label', 'donations_notes_label', 'donations_date_label','view_receipt_label'
    ];
    YAHOO.Convio.PC2.Content.getMessageBundle(messageBundleCallback, keys, 'trpc');
    
    var trConfig = {
        initDone: function() {
            YAHOO.log('TR init finished','info','donations.js');
            YAHOO.Convio.PC2.Utils.hideLoadingContainer();
        }
    };
    YAHOO.Convio.PC2.Component.Teamraiser.initialize(trConfig);

    var consConfig = {
        name: 'hd-user-name'
    };
    
};