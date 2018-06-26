/* convio_utils.js
 * Copyright 2008, Convio
 *
 * Provides Convio Utility functionality.
 * 
 * Depends on:
 * YUI Core, pc2-core-service-dependencies
 * convio_config.js, content_utils.js
 *
 */
var loadCustomHandlers = function() {};
var loadCustom = function() {};
var loadOverrides = function() {};

Function.prototype.bind = function(scope) {
  var _function = this;
  
  return function() {
    return _function.apply(scope, arguments);
  }
}

YAHOO.Convio.PC2.Utils = {
    /**
     * Safely make an asyncRequest request, handling any exception that
     * might be thrown.
     */
    asyncRequest: function (method , uri , callback , postData) {

        // warn about undefined callback function, which will cause YUI to
        // fail
        if(typeof(callback) == "undefined"){
            YAHOO.log('Callback function is undefined.', 'warn', 'convio_utils.js');
        }

        
        // Q: Are we really wrapping a call to an async request with setTimeout()?  
    	//    Why in the world would we do that?
    	// A: Because in IE6 the asyncRequest(..) call is only asynchronous-ish ... 
    	//    wrapping in setTimeout(..) convinces ie6 that it should continue to
    	//    render dom changes while waiting for ajax calls.
    	setTimeout(function() {
    		
    		
    		try {
    			YAHOO.util.Connect.asyncRequest(method , uri , callback , postData);
    		}
            catch (exception) {
                YAHOO.log('Failed asynchronous request: ' + exception, 'error', 'convio_utils.js');
                throw exception;
            }
            
        	
        }, 1 /* do it asynchronously, but start right away*/);
        
        // We need to reset timeouts with each API call.
        resetTimeout();
        
    },
    
    /*
     * Formats a number (in cents) into a string value
     */
    formatCurrency: function(amountInCentsAsStringOrNumber) {
        YAHOO.log('formatCurrency: Cents=' + amountInCentsAsStringOrNumber, 'info', 'convio_utils.js');
        
        var amount = parseFloat(amountInCentsAsStringOrNumber);
        if (isNaN(amount)) {
        	YAHOO.log('formatCurrency(..) cannot format non-numeric input: ' + amount, 'warn', 'convio_utils.js');
        	return amountInCentsAsStringOrNumber;
        }
        
        var currencyLocale = YAHOO.Convio.PC2.Config.getCurrencyLocale();
        
        // use a private, self-invoking function to derive the value for currencySymbol
        var currencySymbol =
        	(function getCurrencySymbolForLocale(currencyLocale) {
            	if (currencyLocale === 'en_US') {
        	    	return '$'; 
        	    }
        	    else if (currencyLocale === 'en_CA') {
        	    	return '$';
        	    }
        	    else if (currencyLocale === 'en_GB') {
        	    	return '£';
        	    }
        	    else if (currencyLocale === 'es_US') {
        	    	return 'US$';
        	    }
        	    else if (currencyLocale === 'fr_CA') {
        	    	return ' $';
        	    }
        	    else {
        	    	YAHOO.log('getCurrencySymbolForLocale(..) received unexpected currency locale: ' + currencyLocale, 'warn', 'convio_utils.js');
        	    	return '$';
        	    }
            })(currencyLocale);
        
        // use a private, self-invoking function to determine whether 
        // the currency symbol should appear before or after the amount
        var isCurrencySymbolPrefix =
        	(function isCurrencySymbolPrefix(currencyLocale) {
            	if (currencyLocale === 'en_US') {
        	    	return true; 
        	    }
        	    else if (currencyLocale === 'en_CA') {
        	    	return true;
        	    }
        	    else if (currencyLocale === 'en_GB') {
        	    	return true;
        	    }
        	    else if (currencyLocale === 'es_US') {
        	    	return true;
        	    }
        	    else if (currencyLocale === 'fr_CA') {
        	    	return false;
        	    }
        	    else {
        	    	YAHOO.log('isCurrencySymbolPrefix(..) received unexpected currency locale: ' + currencyLocale, 'warn', 'convio_utils.js');
        	    	return true;
        	    }
            })(currencyLocale);
        	
        var isAmountNegative = amount !== Math.abs(amount);
        
        // use a private, self-invoking function to format numeric currency as a string
        var retVal =
        	(function formatCurrencyAmount(amount) {
                var tempVal = new String(amount/100);
                var delimiter = ',';
                var returnVal = '';
                var decChrIdx = tempVal.indexOf('.');
                if(decChrIdx > -1) {
                    remainder = tempVal.substr(decChrIdx);
                    tempVal = tempVal.substr(0, decChrIdx);
                    if(remainder.length == 2) { //i.e. .5, only valid lengths are 2 and 3 (.2 or .23)
                    	remainder += '0';
                    }
                } else {
                    remainder = '.00';
                }
                while(tempVal.length > 3) {
                    returnVal = delimiter + tempVal.substr(tempVal.length-3) + returnVal;
                    tempVal = tempVal.substr(0, tempVal.length-3);
                }
                tempVal = tempVal + returnVal + remainder;
                return tempVal;
            })(Math.abs(amount));
        
        if (currencyLocale === 'fr_CA') {
        	// special processing for fr_CA locale
        	retVal = retVal.replace(/,/g," ");
        	retVal = retVal.replace(/\./g,",");
        }
        
        if (isCurrencySymbolPrefix) {
        	retVal = currencySymbol + retVal;
        }
        else {
        	retVal = retVal + currencySymbol;
        }
        
        if (isAmountNegative) {
        	// use a private, self-invoking function to apply expected formatting for negative value 
        	retVal = 
        		(function(currencyString, currencyLocale) {
        	    	if (currencyLocale === 'en_US') {
        		    	return '(' + currencyString + ')'; 
        		    }
        		    else if (currencyLocale === 'en_CA') {
        		    	return '(' + currencyString + ')';
        		    }
        		    else if (currencyLocale === 'en_GB') {
        		    	return '-' + currencyString;
        		    }
        		    else if (currencyLocale === 'es_US') {
        		    	return '(' + currencyString + ')';
        		    }
        		    else if (currencyLocale === 'fr_CA') {
        		    	return '-' + currencyString;
        		    }
        		    else {
        		    	YAHOO.log('formatNegativeForLocale(..) received unexpected currency locale: ' + currencyLocale, 'warn', 'convio_utils.js');
        		    	return '(' + currencyString + ')';
        		    }
        	    })(retVal, currencyLocale); 
        }
	    
        YAHOO.log('formatCurrency: String=' + retVal, 'info', 'convio_utils.js');
        
        return retVal;
    },
    
    /*
     * Parses a string currency value into cents
     */
    parseCurrency: function(curr) {
        YAHOO.log('parseCurrency: String=' + curr, 'info', 'convio_utils.js');
        
        if (!curr) {
        	YAHOO.log('parseCurrency(..) cannot parse a null or undefined currency string: ' + curr, 'warn', 'convio_utils.js');
        	return NaN;
        }
        
        // use a private, self-invoking function to strip out monetary/country symbols
        curr = 
        	(function removeCurrencySymbols(curr){
        		var countryCodes = [ 'US', 'GB', 'CA' ];
                var currencySymbols = [ '$', '£' ];
                for (var i = 0; i < countryCodes.length; i++) {
                	var countryCode = countryCodes[i];
                	for (var j = 0; j < currencySymbols.length; j++) {
                		var currencySymbol = currencySymbols[j];
                		curr = curr.replace(countryCode + currencySymbol, '').replace(currencySymbol + countryCode, '');
                	}
                }
                for (var i = 0; i < currencySymbols.length; i++) {
            		var currencySymbol = currencySymbols[i];
            		// only replace solitary currency symbol at the end
            		curr = curr.replace(currencySymbol, '');
            	}
                return curr;
        	})(curr);
        
        
        // trim whitespace on currency input
        //
        // Make use of YUI's trim function since IE6 does not 
        // support native .trim() function 
        curr = YAHOO.lang.trim(curr);
        
        // strip out any '-' character  
        var negativeSignDetectedAndRemoved = (curr.match(/^-.*$/g) != null);
        if (negativeSignDetectedAndRemoved) {
        	curr = curr.replace(/-(.*)/g,"$1");
        }
        
        // strip out any surrounding '(' and ')' characters 
        var accountantNegativeSignDetectedAndRemoved = (curr.match(/^\(.*\)$/g) != null);
        if (accountantNegativeSignDetectedAndRemoved) {
        	curr = curr.replace(/\((.*)\)/g,"$1");
        }
        
        var currencyLocale = YAHOO.Convio.PC2.Config.getCurrencyLocale();
        if (currencyLocale === 'fr_CA') {
        	// special processing for fr_CA locale
        	curr = curr.replace(/,/g,".");
        	curr = curr.replace(/\s/g,",");
        }
       
        curr = curr.replace(/,/g,"");
        
        var retVal = curr;
        retVal = Math.round(retVal * 100);
        retVal = retVal * ((negativeSignDetectedAndRemoved) ? -1 : 1) * ((accountantNegativeSignDetectedAndRemoved) ? -1 : 1);
        
        YAHOO.log('parseCurrency: Cents=' + retVal, 'info', 'convio_utils.js');
        
        return retVal;
    },
    
    /**
     * Don't use this!
     * @deprecated This method does not properly handle multi-locale
     * @see YAHOO.Convio.PC2.Config.getCurrencyLocale()
     */
    cleanupCurrency: function(curr) {
        var retVal = curr;
        var currChrIdx = retVal.indexOf('$');
        if(currChrIdx == -1) {
            retVal = '$' + retVal;
        }
        if(retVal.indexOf('.') == -1) {
            retVal += '.00';
        }
        return retVal;
    },
    
    /**
     * Handles formatting and multi-locale concerns for payment type names in the UI.
     * @return A string representation of the paymentType appropriate to the user's current locale.
     * @see com.convio.friendraiser.extensions.handler.utils.getPaymentType(int)
     * @see com.convio.friendraiser.bean.GiftPaymentType
     */
    formatPaymentType: function(paymentType) {
    	
    	if (YAHOO.lang.isUndefined(paymentType) || paymentType === null) {
    		YAHOO.log('Cannot format an undefined or null paymentType string ... returning blank string.', 'formatPaymentType', 'convio_utils.js');
    		return "";
    	}
    	
    	var MsgCatProvider = YAHOO.Convio.PC2.Component.Content;
    	var msgCatLabelForPaymentType;
    	
    	if (String(paymentType).toLowerCase() === 'cash') {
    		msgCatLabelForPaymentType = MsgCatProvider.getMsgCatValue('gift_payment_type_cash');
    	}
    	else if (String(paymentType).toLowerCase() === 'check') {
    		msgCatLabelForPaymentType = MsgCatProvider.getMsgCatValue('gift_payment_type_check');
    	}
    	else if (String(paymentType).toLowerCase() === 'later') {
    		msgCatLabelForPaymentType = MsgCatProvider.getMsgCatValue('gift_payment_type_later');
    	}
    	else if (String(paymentType).toLowerCase() === 'credit') {
    		msgCatLabelForPaymentType = MsgCatProvider.getMsgCatValue('gift_payment_type_credit');
    	}
    	else if (String(paymentType).toLowerCase() === 'ach') {
    		msgCatLabelForPaymentType = MsgCatProvider.getMsgCatValue('gift_payment_type_ach');
    	}
    	else {
    		YAHOO.log('Received request to format an unexpected paymentType: ' + paymentType, 'formatPaymentType', 'convio_utils.js');
    		msgCatLabelForPaymentType = "" + paymentType;
    	}
    	
    	return (msgCatLabelForPaymentType) ? msgCatLabelForPaymentType.toLowerCase() : String(paymentType).toLowerCase();
    	
    },
    
    getCommonRequestParams: function() {
        var params = "&api_key=" + YAHOO.Convio.PC2.Config.getApiKey();
        params += "&v=" + YAHOO.Convio.PC2.Config.getVersion();
        params += "&auth=" + YAHOO.Convio.PC2.Config.getAuth();
            
        return params;
    },
    
    getNoAuthRequestParams: function() {
        var params = "&api_key=" + YAHOO.Convio.PC2.Config.getApiKey();
        params += "&v=" + YAHOO.Convio.PC2.Config.getVersion();
            
        return params;
    },
    
    getListCriteriaParams: function(listCriteria) {
        var params = "";
        
        if(listCriteria == null) {
            return params;
        }
        
        if (listCriteria.noPage && listCriteria.noPage === true) {
        	return params;
        }
        
        /* List Criteria */
        var pageSize = listCriteria.pageSize;
        if(YAHOO.lang.isNull(pageSize) || YAHOO.lang.isUndefined(pageSize)) {
            pageSize = 10;
        }
        var pageOffset = listCriteria.pageOffset;
        if(YAHOO.lang.isNull(pageOffset) || YAHOO.lang.isUndefined(pageOffset)) {
            pageOffset = 0;
        }

        var filterText = listCriteria.filterText;
        if(YAHOO.lang.isUndefined(filterText) == false && YAHOO.lang.isNull(filterText) == false) {
            params += "&list_filter_text=" + encodeURIComponent(filterText);
        }
        
        var isAscending = listCriteria.isAscending;
        var sortColumn = listCriteria.sortColumn;
        params += "&list_page_size=" + pageSize;
        params += "&list_page_offset=" + (pageOffset < 0 ? 0 : pageOffset);
        if(YAHOO.lang.isUndefined(isAscending) == false && YAHOO.lang.isNull(isAscending) == false && 
                YAHOO.lang.isUndefined(sortColumn) == false && YAHOO.lang.isNull(sortColumn) == false) {
            params += "&list_ascending=" + isAscending;
            params += "&list_sort_column=" + sortColumn;
        }
        
        if(YAHOO.lang.isUndefined(listCriteria.timestamp) == false && YAHOO.lang.isNull(listCriteria.timestamp) == false) {
            params += "&timestamp=" + listCriteria.timestamp; 
        }
        
        return params;
    },
    
    /**
     * Use this method with caution ... operating on large input arrays is quite expensive.
     * 
     * @return a third array containing elements in the first two ... duplicates are _not_ excluded.
     */
    mergeArrays: function(array1, array2) {
       var array3 = [];
       for(var i=0, array1Length = array1.length; i < array1Length; i++) {
           array3[i] = array1[i];
       }
       for(var j=0, array2Length = array2.length; j < array2Length; j++) {
           array3[i++] = array2[j];
       }
       YAHOO.log('mergeArrays: ' + array3, 'info', 'convio_utils.js');
       return array3;
    },
    
    /**
     * @return a string that is no longer than maxLength, including the ellipsis characters
     */
    truncateText: function(str, maxLength, ellipsis) {
    	
    	// sanity check on input string
    	if (!YAHOO.lang.isString(str)) {
    		return str;
    	}
    	
    	// default ellipsis string if needed
    	if (!YAHOO.lang.isString(ellipsis)) {
    		ellipsis = '...';
    	}
    	
    	// sanitize maxLength for truncation
    	if (!maxLength || maxLength < (ellipsis.length + 1)) {
    		maxLength = 20;
    	}
    	
    	// return the string
    	if (str.length <= maxLength) {
    		return str;
    	}
    	else {
    		return str.substring(0, (maxLength - ellipsis.length)) + ellipsis;
    	}
    	
    },
    
    /**
     * This function is useful when constructing a CSV string (since all double quotes in CSV values need to be escaped). 
     * @return the original string with all "smart" double quote characters replaced with a standard double quote
     */
    convertSpecialDoubleQuotesToRegularDoubleQuotes: function(str) {
    	var specialQuoteCharsToReplace = new Array( '\u201c', '\u201d', '', '' );
    	var result = str;
    	for (var i = 0; i < specialQuoteCharsToReplace.length; i++) {
    		var regexpToMatch = new RegExp(specialQuoteCharsToReplace[i], "g");
    		result = result.replace(regexpToMatch, '"');
    	}
    	return result;
    },
    
    getUrlParam: function(name, url) {
        if(!YAHOO.Convio.PC2.Utils.hasValue(url)) {
            url = window.location.href;
        }
        name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");  
        var regexS = "[\\?&]"+name+"=([^&#]*)";  
        var regex = new RegExp( regexS );  
        var results = regex.exec( url );  
        if( results == null )
            return "";  
        else
            return results[1];
    },    
    
    getPercentText: function(numerator, denominator) {
        YAHOO.log("getPercentText(" + numerator + ", " + denominator +")", "info", "convio_utils.js");
        
        var percent;
        if(denominator == 0) {
            percent = 0;
        } else {
            percent = numerator / denominator * 100;
        }
        var percentText = "" + percent;
        if(percentText.indexOf(".") > -1) {
            percentText = percentText.substr(0, percentText.indexOf("."));
        }
        if(percent > 100) {
            percentText = "100";
        }
        percentText += "%";
        
        return percentText;
    },
    
    ensureArray:  function (pArray) {
        if ( YAHOO.lang.isArray(pArray)) {
            return pArray;
        } else if ( YAHOO.Convio.PC2.Utils.hasValue(pArray) ){
            return [ pArray ];
        } else {
            return [];
        }
    },
    
    hasValue: function (value) {
        return (YAHOO.lang.isUndefined(value) == false 
                && YAHOO.lang.isNull(value) == false 
                && YAHOO.lang.isFunction(value) == false); 
    },
    
    stateChangeHandler: function (state) {
        var views = state.split("-");
        if(views.length != 2) {
            YAHOO.log("Error changing state", "convio_util.js", "warn");
        } else {
            YAHOO.Convio.PC2.Utils.realLoadView(views[0], views[1]);
        }
        
    },
    
    require: function() {
        var customLoader = {
            loaded : [],
            req : [],
            checkReqs : function() {
                var done = true;
                for(var i=0; i < this.req.length; i++) {
                    if(!this.loaded[this.req[i]]) {
                        done = false;
                        break;
                    }
                }
            
                return done;
            }
        };
        
        for( var i = 0; i < arguments.length; i++ ) {
            
            if(i+1 == arguments.length && typeof(arguments[i]) == "function") {
                // last argument is a function
                customLoader.exec = arguments[i];
            } else {
                customLoader.req[i] = arguments[i];
                var myLoader = {
                    name : arguments[i],
                    loader : customLoader,
                    fn : function(){
                        this.loader.loaded[this.name] = true;
                        if(this.loader.checkReqs() && typeof(this.loader.exec) == "function") {
                            this.loader.exec();
                        }
                    }
                };
                var fx = myLoader.fn.bind(myLoader);
                
                YAHOO.Convio.PC2.Utils.publisher.on(arguments[i], fx);
            }
        }
    },
    
    loadPage: function() {
        
    	// make sure we have the basic info needed to load PC2
    	if (YAHOO.Convio.PC2.Config.isValid() === false) {
    		YAHOO.Convio.PC2.Config.redirectToHome();
    	}
    	
        YAHOO.namespace("Convio.PC2.Views");
        YAHOO.Convio.PC2.Views.current = "dashboard";
        YAHOO.Convio.PC2.Views.load = [];
        
        // define a constructor:
        function Publisher() {
            // create a custom event.  it is not necessary to explicitly publish an event
            // unless you need to override the default configuration
            this.publish("pc2:registrationLoaded", {
                // configuration options for this event
                fireOnce: true
            });
            
            this.publish("pc2:constituentLoaded", {
                // configuration options for this event
                fireOnce: true
            });
            
            this.publish("pc2:participantProgressLoaded", {
                // configuration options for this event
                fireOnce: true
            });
            
            this.publish("pc2:wrapperLoaded", {
                // configuration options for this event
                fireOnce: true
            });
            
            this.publish("pc2:configurationLoaded", {
                // configuration options for this event
                fireOnce: true
            });
            
            this.publish("pc2:suggestionLoaded", {
            	// configuration options for this event
                fireOnce: true
            });
            
            this.publish("pc2:viewChanged", {
                // configuration
            });
            
            this.publish("pc2:giftAdded", {
                // configuration
            });
            
            this.publish("pc2:contactAdded", {
                // configuration
            });
            
            this.publish("pc2:emailSent", {
                // configuration
            });
            
            this.publish("pc2:personalPageUpdated", {
                // configuration
            });
            
            this.publish("pc2:localesLoaded", {
                // configuration options for this event
                fireOnce: true
            });
            
            this.publish("pc2:allContactsLoaded", {
                // configuration options for this event
                fireOnce: true
            });

            this.publish("pc2:contactDeleted", {
                // configuration
            });
            
        };
        // if you accept the default configuration, augmenting EventTarget looks like this:
        Y.augment(Publisher, Y.EventTarget);
        YAHOO.Convio.PC2.Utils.publisher = new Publisher();
        
        if(YAHOO.lang.isFunction(loadCustomHandlers)) {
            loadCustomHandlers();
        }
        
        // define required page load events
        var requiredLoadEvents = ["pc2:registrationLoaded", "pc2:constituentLoaded", "pc2:configurationLoaded", "pc2:wrapperLoaded"];
        
        // make sure we've displayed the page loading container
        YAHOO.Convio.PC2.Utils.showLoadingContainer();
        
        // Update previously started progress bar with required loading events
        YAHOO.Convio.PC2.Utils.ProgressBar.registerLoadEvents(requiredLoadEvents);
        
        // Tear down the loading container once needed page load events have completed
        this.require.apply(this, YAHOO.Convio.PC2.Utils.mergeArrays(requiredLoadEvents, 
        		[ 
        		  function () 
        		  {
        			// Hide the "loading" panel after required events have fired
                    YAHOO.Convio.PC2.Utils.hideLoadingContainer();
        		  } 
        		]
        ));
        
        // After the message catalog is loaded, loadSecondStage will be called.
        YAHOO.Convio.PC2.Utils.loadMessages();

        return;
    },
    
    loadSecondStage: function() {
        var myModuleBookmarkedState = Y.History.getBookmarkedState("pc2");
        var myModuleInitialState = myModuleBookmarkedState || "dashboard-home";
        Y.History.register("pc2", myModuleInitialState).on(
                "history:moduleStateChange", YAHOO.Convio.PC2.Utils.stateChangeHandler);

        Y.History.on("history:ready", function () {
            var currentState = Y.History.getCurrentState("pc2");
            YAHOO.Convio.PC2.Utils.stateChangeHandler(currentState);
        });

        Y.History.initialize('#yui-history-field', '#yui-history-iframe');
        YAHOO.log('Storage engine disabled by site.', 'warn', 'convio_utils.js');
        
        Y.use('jquery-validate', function() {
        	// setup locale-appropriate jQuery form validator messages
	        jQuery.extend(jQuery.validator.messages, {
	        	required: YAHOO.Convio.PC2.Component.Content.getMsgCatValue('validator_required'),
	        	email: YAHOO.Convio.PC2.Component.Content.getMsgCatValue('validator_email')
	        });
        });
        
        loadComponents();
        
        YAHOO.Convio.PC2.Config.setLocaleChanged(false);
    },
    
    getMsgCatKeys: function() {
    	
	      var keys = [
	          'recent_activity_header','captains_message_empty','captains_message_edit_link',
	          'captains_message_save_button','captains_message_cancel_link','captains_message_header',
	          'change_goal_link','team_captains_manage_link','team_captains_header',
	          'dashboard_send_message_button','overview_label','nav_view_reports',
	          'nav_add_contacts','nav_setup_page','class_nav_or','what_next_question',
	          'nav_view_team','nav_email_team','nav_oci_link','nav_edit_survey_link','nav_edit_tenting_link',
	          'nav_manage_event_link','nav_add_gift',
	          'nav_manage_company_link','goal_edit_goal','goal_goal','activity_type_donation', 
	          'activity_type_message','activity_type_recruit','dialog_delete_label','dialog_cancel_label', 
	          'dialog_acknowledge_label', 'dialog_acknowledge_email_label', 'dialog_okay_label',
	          'dialog_save_label','class_cancel', 'class_whats_this', 'dashboard_enter_gift_button', 'data_table_message_empty',
	          'data_table_click_sort_asc', 'data_table_click_sort_desc',
	          //'data_table_message_loading', 
	          'dialog_submit', 'dialog_cancel', 'error_goal_invalid_number',
	          'data_table_contacts_per_page', 'captain_title', 'paginator_of', 'validator_required', 
	          'validator_email', 'dashboard_company_name_title', 'dashboard_company_edit_label', 
	          'dashboard_edit_company_list_label', 'dashboard_edit_company_name_label',
	          'dashboard_company_submit_label', 'dashboard_company_edit_or_label',
	          'dashboard_company_cancel_label', 'dashboard_company_null_label', 'company_select_none',
	          /* --------------- Report keys --------------- */
	          'gift_status_online_label',
	          'gift_status_offline_label','gift_status_unconfirmed_label','gift_status_confirmed_label',
	          'gift_confirm_delete_header','gift_confirm_delete_body',
	          'gift_notification_label','gift_notification_on_label','gift_notification_off_label',
	          'gift_notification_on_button_label','gift_notification_off_button_label',
	          'report_personal_donations_download', 'report_personal_donations_or', 'report_personal_donations_view_all',
	          'report_donated_on', 'report_donor_label', 'report_amount_label', 'report_notes_label', 'report_date_label',
	          'report_actions_label', 'report_no_donations_found','view_receipt_label',
	          'top_donors_label','report_add_gift_button_label','chart_gift_amount_label','team_chart_gift_amount_label','company_chart_gift_amount_label',
	          'report_donation_history_label','team_link_label','company_link_label','personal_link_label',
	          'personal_report_label', 'flash_player_required_personal',
	          /* --------------- Team Report keys --------------- */
	          'team_report_label','team_progress_bar_title','team_progress_fundraised_label',
	          'team_progress_goal_label','team_progress_to_goal_label','team_progress_days_left_label',
	          'team_report_add_gift_button_label','team_report_top_donors_label','team_report_donation_history_label',
	          'team_report_team_members_label','team_report_team_members_desc','team_report_team_members_view_all',
	          'team_report_team_members_or','team_report_team_members_download','team_report_change_goal_link',
	          'team_report_team_donations_download','team_report_team_donations_or', 'team_report_team_donations_view_all',
	          'team_goal_edit_goal', 'team_goal_goal','team_report_team_stats_download',
	          'team_gift_confirm_delete_header','team_gift_confirm_delete_body', 'flash_player_required_team',
	          'error_team_goal_invalid_number',
	          /* --------------- Company Report keys --------------- */
	          'company_report_label','company_progress_bar_title','company_progress_fundraised_label',
	          'company_progress_goal_label','company_progress_to_goal_label','company_progress_days_left_label',
	          'chart_gift_amount_label','company_report_teams_label','company_report_teams_desc',
	          'company_report_teams_download','company_report_teams_open_paren','company_report_teams_close_paren',
	          'flash_player_required_company',
	          /* --------------- Email keys --------------- */
	          'compose_message_label','compose_subject_label','save_template_hint','class_or_label',
	          'email_compose_use_template_label','email_compose_use_template_hint',
	          'compose_to_label','suggested_messages_label','suggested_messages_personal_label','compose_send_button_label',
	          'compose_save_draft_button_label','compose_delete_button_label','compose_preview_button_label',
	          'layout_select_label','layout_done_select_label',
	          'message_send_success','message_send_failure','message_save_success',
	          'message_save_failure','draft_draft_label', 'back_to_drafts_label',
	          'compose_preview_send_label','compose_preview_or_label','compose_preview_edit_label',
	          'message_no_subject_failure','compose_replace_message','compose_to_hint',
	          'message_invalid_html_tag_failure','message_no_body_failure','message_no_recipients_failure',
	          'message_invalid_email_address_failure','compose_prepend_salutation_label', 'compose_salutation_hint',
	          'message_null_email_addresses_removed','compose_save_template_button_label',
	          'message_template_save_success','compose_template_header','compose_to_contacts_link',
	          'compose_current_layout_label','email_compose_hide_template_label','templates_your_templates',
	          'templates_suggested_messages','templates_confirm_delete_body','templates_confirm_delete_header',
	          'email_template_radio_thanks_label','email_template_radio_recruit_label','email_template_radio_solicit_label',
	          'email_template_radio_other_label','email_template_radio_custom_label','email_template_radio_blank_label',
	          /* --------------- Sent keys --------------- */
	          'sent_sent_label', 'sent_sent_messages_search_label', 'sent_search_label',
	          'sent_confirm_delete_header', 'sent_confirm_delete_body', 'sent_no_sent_messages_found',
	          'sent_data_table_column_delete',
	          /* --------------- Drafts keys --------------- */
	          'drafts_drafts_label', 'drafts_confirm_delete_header', 'drafts_confirm_delete_body', 'drafts_no_drafts_found',
	          /* --------------- Contacts keys --------------- */
	          'contacts_label','contacts_send_message_button','contacts_add_to_group_button',
	          'contacts_delete_button','contacts_select_label','contacts_select_all_link',
	          'contacts_select_none_link','contacts_search_button','contacts_groups_all',
	          'contacts_view_by_label','contacts_new_group_dialog','contacts_new_group_name_label',
	          'contacts_warn_delete_failure_header','contacts_warn_delete_failure_body',
	          'add_contact_first_name_label','add_contact_last_name_label','add_contact_email_label',
	          'add_contact_button_label','add_contacts_cancel_link','nav_or','add_contact_submit_button',
	          'contacts_import_contacts','contacts_confirm_delete_body','contacts_confirm_delete_header',
	          'contacts_confirm_delete_groups_header', 'contacts_confirm_delete_groups_body', 
	          'contacts_confirm_delete_groups_error_header', 'contacts_confirm_delete_groups_error_body',
	          'contacts_acknowledge_contact_gift_header', 'contacts_acknowledge_contact_gift_body',
		  'contacts_progress_acknowledge_contact_gift_header', 'contacts_progress_acknowledge_contact_gift_body',
	          'contacts_acknowledge_contact_gift_no_email_header', 'contacts_acknowledge_contact_gift_no_email_body',
		  'contacts_progress_acknowledge_contact_gift_no_email_header', 'contacts_progress_acknowledge_contact_gift_no_email_body',
	          'search_contacts_text','contact_add_success','contacts_add_group_failure',
	          'contacts_add_group_success','contacts_delete_success','contacts_email_all_button',
	          'contacts_name_label', 'contacts_email_label', 'contacts_amount_label', 'contacts_previous_amount_label', 
	          'contacts_groups_label', 'contacts_groups_header_label', 'contacts_contact_remove_group_title',
	          'contacts_contacts_table_loading',
	          'contacts_contacts_table_summary_desc', 'contacts_groups_table_summary_desc',
	          'contacts_email_sent_label', 'contacts_email_opened_label', 'contacts_page_visits_label', 
	          'contacts_acknowledge_gift_title_label', 'report_delete_gift_title_label', 'report_acknowledge_gift_title_label',
	          'contacts_add_to_group', 'contacts_create_a_new_group','contacts_sidebar_add_contact_header', 'contacts_donations_label',
	          'contacts_individuals_view_label', 'contacts_groups_view_label', 'contacts_groups_members_label',
	          'contacts_groups_selected', 'contacts_remove_group_contact_success',
						'contact_add_failure_email', 'contact_add_failure_unknown',
	          'filter_show_more','filter_show_less','filter_show_all','contact_no_name_label',
	          'filter_email_rpt_show_donors','filter_email_rpt_show_nondonors',
	          'filter_email_rpt_show_unthanked_donors','filter_email_rpt_show_teammates',
	          'filter_email_rpt_show_company_coordinator_captains', 'filter_email_rpt_show_company_coordinator_participants',
	          'filter_email_rpt_show_nonteammates','filter_email_rpt_show_ly_teammates',
	          'filter_email_rpt_show_never_emailed','filter_email_rpt_show_nondonors_followup',
	          'filter_email_rpt_show_lybunt_donors','filter_email_rpt_show_ly_donors',
	          'filter_email_rpt_show_ly_unreg_teammates','filter_email_rpt_show_rt_teammates',
	          'filter_email_rpt_show_rt_unreg_teammates','filter_top_email_rpt_show_unthanked_donors',
	          'filter_top_email_rpt_show_nondonors_followup','filter_top_email_rpt_show_never_emailed',
	          'filter_top_email_rpt_show_teammates','filter_top_email_rpt_show_donors',
	          'filters_system_groups','filters_your_groups','contacts_view_only','contacts_selected',
	          'csv_contacts_upload','contacts_upload_contacts','csv_upload_contacts','contacts_upload_generic_error',
	          'contacts_upload_zero_processed_warn', 'import_address_book_button_label', 'add_group_button_label',
	          /* --------------- Address Book Import keys --------------- */
	          'addressbookimport_header', 
	          'addressbookimport_column_first_name', 'addressbookimport_column_last_name', 'addressbookimport_column_email',
	          'addressbookimport_column_proposed_first_name', 'addressbookimport_column_proposed_last_name', 'addressbookimport_column_proposed_email',
	          'addressbookimport_column_dup_details', 'addressbookimport_column_error_details',
	          'addressbookimport_column_third_party_contact', 'addressbookimport_column_participant_center_contact',
	          'class_next_button', 'class_cancel_link', 'class_finished_link',
	          'addressbookimport_selectsource_title', 'addressbookimport_selectsource_info_1', 'addressbookimport_selectsource_info_2',
	          'addressbookimport_selectsource_info_3', 'addressbookimport_selectsource_info_4',
	          'addressbookimport_selectsource_nav_next', 'addressbookimport_selectsource_nav_previous',
	          'addressbookimport_selectsource_none_selected_failure', 'addressbookimport_selectsource_unexpected_failure',
	          'addressbookimport_selectsource_csv_parse_failure',
	          'addressbookimport_thirdpartystatus_title', 'addressbookimport_thirdpartystatus_info', 
	          'addressbookimport_retrievecontacts_nav_next', 'addressbookimport_retrievecontacts_nav_previous',
	          'addressbookimport_thirdpartystatus_service_failure', 'addressbookimport_thirdpartystatus_unexpected_jobstatus_failure',
	          'addressbookimport_thirdpartystatus_unexpected_fetch_failure',
	          'addressbookimport_selectcontacts_title', 'addressbookimport_selectcontacts_info',
	          'addressbookimport_selectcontacts_option_all_1', 'addressbookimport_selectcontacts_option_all_2', 
	          'addressbookimport_selectcontacts_option_some', 'addressbookimport_selectcontacts_unexpected_save_failure', 'addressbookimport_selectcontacts_none_selected_failure',
	          'addressbookimport_importcandidatecontacts_list_select_label_top', 'addressbookimport_importcandidatecontacts_list_select_label_bottom',
	          'addressbookimport_importcandidatecontacts_list_select_all_label_top', 'addressbookimport_importcandidatecontacts_list_select_all_label_bottom',
	          'addressbookimport_importcandidatecontacts_list_select_none_label_top', 'addressbookimport_importcandidatecontacts_list_select_none_label_bottom',
	          'addressbookimport_selectcontacts_nav_next', 'addressbookimport_selectcontacts_nav_previous',
	          'addressbookimport_importresults_title', 'addressbookimport_importresults_info', 
	          'addressbookimport_importresults_nav_next', 'addressbookimport_importresults_nav_previous',
	          'addressbookimport_importresults_section_added_header',
	          'addressbookimport_importresults_section_suspected_duplicates_header',
	          'addressbookimport_importresults_section_summary_success', 'addressbookimport_importresults_section_summary_new_clause', 
	          'addressbookimport_importresults_section_summary_suspected_duplicate',
	          'addressbookimport_importresults_section_summary_suspected_duplicate_resolved','addressbookimport_importresults_section_summary_error',
	          'addressbookimport_importresults_section_added_info', 'addressbookimport_importresults_section_suspected_duplicates_info', 
	          'addressbookimport_importresults_section_errors_header', 'addressbookimport_importresults_section_errors_info',
	          'addressbookimport_tooltip_merge_action_wait',
	          'addressbookimport_tooltip_merge_action_success', 'addressbookimport_tooltip_merge_action_fail',
	          'addressbookimport_tooltip_add_as_new_action_wait',
	          'addressbookimport_tooltip_add_as_new_action_success', 'addressbookimport_tooltip_add_as_new_action_fail',
	          'addressbookimport_tooltip_ignore_action_wait',
	          'addressbookimport_tooltip_ignore_action_success', 'addressbookimport_tooltip_ignore_action_fail',
	          'addressbookimport_tooltip_and', 'addressbookimport_tooltip_instead',
	          'addressbookimport_tooltip_moreover', 'addressbookimport_tooltip_add_as_new_button_header',
	          'addressbookimport_tooltip_add_as_new_button_contact_resolution', 'addressbookimport_tooltip_add_as_new_button_dupContact_resolution',
	          'addressbookimport_tooltip_merge_button_header', 'addressbookimport_tooltip_merge_button_contact_resolution',
	          'addressbookimport_tooltip_merge_button_dupContact_resolution', 'addressbookimport_tooltip_ignore_button_header',
	          'addressbookimport_tooltip_ignore_button_contact_resolution', 'addressbookimport_tooltip_ignore_button_dupContact_resolution',
	          'addressbookimport_tooltip_select_source_gmail',
	          // TODO DSW Snowbird Remove this code block once we've confirmed that we can't access Hotmail via web service.
	          //'addressbookimport_tooltip_select_source_hotmail',
	          'addressbookimport_tooltip_select_source_yahoo', 
	          //'addressbookimport_tooltip_select_source_csv',
	          'addressbookimport_tooltip_select_source_mac', 'addressbookimport_tooltip_select_source_outlook',
	          'addressbookimport_tooltip_select_source_hotmail',
	          'addressbookimport_tooltip_select_source_aol', 'addressbookimport_tooltip_select_source_generic',
	          'addressbookimport_confirm_finished_header', 'addressbookimport_confirm_finished_body_1',
	          'addressbookimport_confirm_finished_body_2', 'addressbookimport_confirm_finished_body_3',
	          'addressbookimport_confirm_finished_button',
	          'addressbookimport_selectsource_help_link', 
	          'addressbookimport_selectcontacts_help_link', 'addressbookimport_importresults_help_link',
	          'addressbookimport_thirdpartystatus_consent_link',
	          'addressbookimport_column_actions_label',
	          'addressbookimport_column_add_action', 'addressbookimport_column_add_action_tooltip',
	          'addressbookimport_column_merge_action', 'addressbookimport_column_merge_action_tooltip', 
	          'addressbookimport_column_ignore_action', 'addressbookimport_column_ignore_action_tooltip',
	          'addressbookimport_selectsource_csv_source_label', 'addressbookimport_selectsource_csv_source_details',
	          'addressbookimport_csvmapping_help_link', 'addressbookimport_csvmapping_info', 'addressbookimport_csvmapping_title',
	          'addressbookimport_csvmapping_preview_make_changes_blurb', 'addressbookimport_csvmapping_preview_make_changes_blurb_2', 
	          'addressbookimport_csvmapping_preview_make_changes_link',
	          'addressbookimport_csvmapping_preview_before_num_omitted', 'addressbookimport_csvmapping_preview_after_num_omitted',
	          'addressbookimport_selectsource_csv_help_link', 'addressbookimport_csvmapping_encoding_selector_label',
	          'addressbookimport_csvmapping_unexpected_failure', 'addressbookimport_csvmapping_confirm_duplicate_column_mapping',
	          /* --------------- Contact Details keys --------------- */
	          'contact_details_compose','contact_details_add_to_group',
	          'contact_details_edit_info','contact_details_total_donated',
	          'contact_details_open_emails','contact_details_part_of_groups','contact_details_groups_header',
	          'contact_details_clickthroughs','contact_details_contact_info_hdr',
	          'contact_details_phone_label','contact_details_address_label',
	          'contact_details_history_label','contact_details_new_group_dialog',
	          /* --------------- Contact Edit keys --------------- */
	          'contact_edit_first_name_label','contact_edit_last_name_label',
	          'contact_edit_email_label','contact_edit_address1_label',
	          'contact_edit_address2_label','contact_edit_address3_label','contact_edit_city_label',
	          'contact_edit_state_label', 'contact_edit_county_label', 'contact_edit_zip_label',
	          'contact_edit_country_label','contact_edit_phone_label',
	          'contact_edit_cancel_link','contact_edit_save_button',
	          /* --------------- Personal Page keys --------------- */
	          'personal_page_title','personal_page_message_body','personal_page_permalink',
	          'personal_page_shortcut_edit','personal_page_shortcut_save','personal_page_shortcut_cancel',
	          'personal_page_shortcut_view','personal_page_content_save','personal_page_content_preview',
	          'personal_page_components_save','personal_page_components_preview',
	          'personal_page_content_label','personal_page_save_success','personal_page_save_failure',
	          'personal_page_save_success_approval','personal_page_save_components_success',
	          'personal_page_save_components_failure','personal_page_save_components_success_approval',
	          'shortcut_save_success','shortcut_save_failure','personal_page_components_label',
	          'personal_page_status_thermometer_label','personal_page_status_thermometer_hint',
	          'personal_page_honor_roll_label','personal_page_honor_roll_hint',
	          'personal_page_honor_roll_donor_names_only','personal_page_blog_enabled_label',
	          'personal_page_blog_enabled_hint','personal_page_privacy_prefix_desc','personal_page_privacy_public_label',
	          'personal_page_privacy_private_label','personal_page_view_label','personal_page_privacy_public_desc',
	          'personal_page_privacy_private_desc','personal_page_privacy_save_success','personal_page_privacy_save_failure',
	          'personal_page_setting_save_or_label','personal_page_shortcut_edit2',
	          'personal_page_preview_failure','personal_page_invalid_html_tag',
	          'personal_page_content_preview_desc','personal_page_components_preview_desc',
	          'personal_page_layout', 
	          /* --------------- Personal Page Media keys --------------- */
	          'personal_page_photos_label','photo_upload_button_label','photo_upload_or_label',
	          'photo_upload_remove_label','photo_upload_caption_label','photo_upload2_button_label',
	          'photo_upload2_or_label','photo_upload2_remove_label','photo_upload2_caption_label',
	          'photo_upload_generic_error',
	          'photo_upload2_generic_error','personal_video_url_label','personal_video_url_example_label',
	          'personal_video_url_save_button_label','personal_video_url_saved','personal_video_url_generic_error',
	          'personal_video_url_unset_error','personal_photo_preview_or_label','photo_upload_no_image',
	          'photo_upload2_no_image','media_upload_no_video',
	          'photo_upload2_dimensions_error','personal_page_photo_video_select_label','photo_upload_success',
	          'photo_upload_image_types',
	          'photo_upload_success_approval','photo_upload2_success','photo_upload2_success_approval',
	          'personal_video_url_saved_approval', 'use_media_type_video_label', 'use_media_type_photos_label',
	          'personal_video_url_format_error','photo_upload2_layout_caution', 'photo_upload2_image_types',
	          /* --------------- Team Page keys --------------- */
	          'team_page_message_body','team_page_permalink','team_page_shortcut_edit',
	          'team_page_shortcut_save','team_page_shortcut_cancel','team_page_shortcut_view',
	          'team_page_save','team_page_preview','team_page_content_label',
	          'team_page_save_success','team_page_save_failure','teampage_shortcut_save_success',
	          'teampage_shortcut_save_failure','team_photo_upload_caption_label','team_photo_upload_button_label',
	          'team_photo_upload_or_label','team_photo_upload_remove_label','team_page_photo',
	          'team_photo_upload_image_types',
	          'team_page_team_name_title','team_page_company_name_title','team_page_team_edit_label',
	          'team_edit_team_name_label','team_edit_company_name_label','team_edit_company_list_label',
	          'team_update_submit_label','team_update_cancel_label','team_page_preview_close_label',
	          'team_photo_upload_generic_error',
	          'team_page_setting_save_or_label','team_page_shortcut_edit2',
	          'team_page_preview_failure','team_page_invalid_html_tag','team_recruiting_label',
	          'team_recruiting_edit_label','team_team_division_label','team_team_division_edit_label',
	          'team_password_label','team_password_edit_label', 'team_name_duplicate_error',
	          'team_edit_not_number_error','team_page_preview_desc','team_edit_or_label',
	          'team_photo_upload_success','team_photo_upload_no_image',
	          /* --------------- Company Page keys --------------- */
	          'company_page_message_body','company_page_permalink','company_page_shortcut_edit',
	          'company_page_shortcut_save','company_page_shortcut_cancel','company_page_shortcut_view',
	          'company_page_save','company_page_preview','company_page_content_label',
	          'company_page_components_save','company_page_components_preview','company_page_components_preview_desc',
	          'company_page_save_success','company_page_save_failure','company_page_shortcut_save_success',
	          'company_page_shortcut_save_failure','company_photo_upload_caption_label','company_photo_upload_button_label',
	          'company_photo_upload_or_label','company_photo_upload_remove_label','company_page_photo',
	          'company_page_title','company_page_preview_close_label',
	          'company_photo_upload_generic_error','company_page_components_label','company_page_setting_save_or_label',
	          'company_photo_upload_image_types',
	          'company_page_shortcut_edit2','company_page_preview_failure','company_page_invalid_html_tag',
	          'company_page_status_indicator1_label','company_page_status_indicator1_hint','company_page_status_indicator3_hint',
	          'company_page_status_indicator3_label','photo_upload_no_image',
	          'company_page_preview_desc','company_photo_upload_success','company_page_save_components_success',
	          'company_page_save_components_failure',
	          /* --------------- Gift keys --------------- */
	          'gift_label','team_gift_label','report_add_gift_button_label',
	          'gift_first_name_label','gift_last_name_label','gift_email_label',
	          'gift_amount_label','gift_payment_type_label','gift_payment_type_cash', 'gift_payment_type_ach',
	          'gift_aid_label','gift_aid_declaration',
	          'gift_payment_type_check','gift_payment_type_credit','gift_check_number_label',
	          'gift_addl_options_label','gift_street1_label','gift_street2_label','gift_street3_label',
	          'gift_city_label','gift_state_label','gift_county_label','gift_zip_label','gift_postcode_label','gift_country_label','gift_addl_options_disable_label',
	          'gift_recongition_name_label','gift_add_another_button_label','gift_add_button_label','class_gift_or_label',
	          'gift_cancel_label','gift_error_text','personal_report_label','change_goal_link',
	          'gift_payment_type_later','gift_credit_card_number_label','gift_credit_verification_code_label',
	          'gift_credit_what_is_this_label','gift_credit_expiration_date_label','gift_billing_first_name_label',
	          'gift_billing_last_name_label','gift_billing_street1_label','gift_billing_street2_label',
	          'gift_billing_city_label','gift_billing_state_label','gift_billing_zip_label',
	          'gift_submission_error','billing_information_label','gift_gift_category_label',
	          'gift_card_submission_error',
	          'gift_back_to_progress_label','team_gift_back_to_progress_label',
	          'gift_error_amount_too_small','gift_display_personal_page_label','gift_submit_success', 'enter_new_gift_label',
	          /* --------------- Teammates keys --------------- */
	          'manage_team_captains_header','captains_save_button',
	          'captains_save_success','captains_save_failure',
	          'subnav_view_teammates','subnav_manage_captains',
	          'not_on_team','view_teammates_header',
	          'teammates_download_members', 'teammates_download_donations', 
	          'teammates_download_stats',
	          /* --------------- Survey keys --------------- */
	          'edit_survey_responses_header','subnav_edit_survey_responses','survey_cancel_label',
	          'survey_save_responses_button','survey_save_success',
	          'survey_save_failure','survey_date_save_failure',
	          /* --------------- Groups keys --------------- */
	          'email_groups_header', 'groups_name_label', 'groups_contact_count_email_label',
	          'groups_edit_group_link','groups_send_message_to_selected','groups_delete_selected',
	          'groups_add_group_button','groups_confirm_delete_header','groups_confirm_delete_body',
	          'groups_dialog_edit_group_header','groups_dialog_add_group_header','groups_dialog_group_name_label','group_name_update_empty_error',
	          /* --------------- Tenting keys --------------- */
	          'tenting_header','tenting_your_status_label','tenting_search_first_name_label',
	          'tenting_search_last_name_label','tenting_search_email_label',
	          'tenting_search_race_number_label','tenting_search_button','tenting_your_tentmate_label',
	          'tenting_decline_label','tenting_decline_hint','tenting_decline_button_label',
	          'tenting_random_label','tenting_random_hint','tenting_random_button_label',
	          'tenting_reset_label','tenting_reset_hint','tenting_reset_button_label',
	          'tenting_cancel_button_label','tenting_send_button_label','tenting_decline_invite_button_label',
	          'tenting_share_button_label','tenting_personal_message_label','tenting_invite_label',
	          'tenting_invite_hint','tenting_reply_label','tenting_reply_hint',
	          'tenting_status_0','tenting_status_1','tenting_status_2',
	          'tenting_status_3','tenting_status_4','tenting_status_5',
	          'tenting_status_6','tenting_status_7','tenting_status_8',
	          'tenting_status_9',
	          /* --------------- Social keys --------------- */
	          'social_share_link_text','class_social_share_button','class_social_share_cancel','social_share_on_facebook','social_share_on_yahoo',
	          'social_share_on_myspace','social_share_on_twitter','social_share_on_linkedin','social_share_finished_button',
	          'social_share_twitter_url_text','social_share_success','social_share_fail','social_connection_error',
	          'class_social_share_action','class_social_share_description', 'social_share_as, social_share_limit_reached', 
	          'social_share_facebook', 'social_share_linkedin', 'social_share_myspace', 'social_share_twitter', 'social_share_yahoo',
	          'social_share_on', 'social_share_not_you', 'social_share_disconnect_failure_part1', 'social_share_disconnect_failure_part2',
	          'social_share_disconnect_success_part1', 'social_share_disconnect_success_part2', 'social_share_disconnect_success_part3',
	          'social_share_finish_button',
	          /* --------------- Personal keys --------------- */
	          'content_link_label','media_link_label','quick_posts_link_label','components_link_label',
	          /* --------------- Team keys --------------- */
	          'team_content_link_label','team_components_link_label',
	          /* --------------- Company keys --------------- */
	          'company_content_link_label','company_components_link_label',
	          /* --------------- Common keys --------------- */
	          'nav_overview','nav_messaging','nav_reports','nav_public_page',
	          'hdr_welcome','hdr_visit_public','hdr_personal_page_link',
	          'hdr_profile_link','hdr_team_page_link',
	          'hdr_logout_link','nav_team_page',
	          'nav_company_page','nav_help_link',
	          /* --------------- Progress keys --------------- */
	          'progress_funds_raised','progress_funds_percent','progress_days_left',
	          'progress_my_goal','progress_team_progress','progress_team_goal',
	          'progress_bar_title','progress_gift_aid_match',
	          /* --------------- Messaging keys --------------- */
	          'subnav_compose_link_label','subnav_drafts_link_label',
	          'subnav_sent_link_label','subnav_contacts_link_label','subnav_groups_link_label',
	          /* --------------- Data Table keys --------------- */
	          'drafts_data_table_column_recipients', 'drafts_data_table_column_subject', 'drafts_data_table_column_date',
	          'sent_data_table_column_recipients', 'sent_data_table_column_subject', 'sent_data_table_column_date',
	          /* --------------- Admin Newsfeed Keys --------------- */
	          'admin_newsfeed_bar_title', 'admin_newsfeed_view_all', 'admin_newsfeed_new_total_container',
	          'admin_newsfeed_list_header_all_messages', 'admin_newsfeed_list_header_total', 'admin_newsfeed_list_header_new',
	          //'admin_newsfeed_sort_by_date', 'admin_newsfeed_sort_by_title', 
	          'admin_newsfeed_newsitem_read_more',
	          'admin_newsfeed_header_h1', 'admin_newsfeed_header_view_all', 'admin_newsfeed_header_close_window',
	          'admin_newsfeed_new',
	          /* ---------------- Privacy Settings keys ---------------*/
	          'nav_manage_privacy_settings_link', 'privacy_settings_anonymous_option', 
	          'privacy_settings_screenname_option', 'privacy_settings_standard_option',
	          'privacy_settings_radio_label', 'privacy_settings_error_screenname_contains_name',
	          'privacy_settings_error_no_screenname_specified', 'privacy_settings_error_screenname_length',
	          'privacy_settings_error_no_selection', 'privacy_setting_team_roster_anonymous',
	          'privacy_setting_team_roster_screenname',
	          /* --------------- Session Timeout keys  ---------------*/
			  'session_timeout_header', 'session_timeout_minute', 'session_timeout_minute_less_than_one',
			  'session_timeout_minutes', 'session_timeout_expired_content', 'session_timeout_expiring_content1',
			  'session_timeout_expiring_content2', 'session_timeout_log_back_in', 'session_timeout_log_out',
			  'session_timeout_continue_working',
			  /* --------------- General Paginator keys --------------*/
			  'paginator_first_page_title', 'paginator_previous_page_title',
			  'paginator_next_page_title', 'paginator_last_page_title',
			  /* --------------- UK Address lookup keys --------------*/
			  'united_kingdom', 'address_lookup_server_error', 'address_lookup_not_in_list', 'processing', 
			  'find_address_button', 'default_country',
			  /* --------------- Manage Team Membership keys --------------*/
			  'manage_membership_leave_team_radio_text', 'manage_membership_join_team_radio_text', 
			  'manage_membership_leave_team_explanation_text', 'manage_membership_search_results',
			  'nav_manage_membership', 'manage_membership_header_text', 'manage_membership_label',
			  'manage_membership_search_result_company_label', 'manage_membership_search_result_captain_label',
			  'manage_membership_search_result_join_team', 'manage_membership_find_team', 
			  'manage_membership_team_name', 'manage_membership_team_company',
			  'manage_membership_captain_last_name', 'manage_membership_captain_first_name',
			  'manage_membership_sidebar_label', 'manage_membership_search_result_team_label',
			  'manage_membership_search_explanation', 'manage_membership_join_team_password_label',
			  'manage_membership_join_team_captain_label', 'manage_membership_join_team_company_label',
			  'manage_membership_join_team_team_label', 'manage_membership_confirm_join_team_button',
			  'manage_membership_join_team', 'manage_membership_leave_team', 'manage_membership_continue_button',
			  'manage_membership_search_button', 'manage_membership_confirm_leave_team_button',
			  'manage_membership_team_label', 'manage_membership_search_failure', 
			  'manage_membership_team_search_results_found', 'manage_membership_team_search_results_count',
			  'manage_membership_team_search_results_hint','leave_membership_label', 'join_membership_label',
			  /* --------------- Email Wizard keys --------------*/
			  'wizard_nav_configure', 'wizard_nav_compose', 'wizard_nav_contacts', 'wizard_nav_preview',
			  'wizard_add_contacts', 'wizard_import_contacts',
			  'wizard_contact_edit_link',
			  'what_next_setup_your_personal_page_header', 'what_next_add_contacts_header', 'what_next_send_email_header',
              'what_next_reach_out_header', 'what_next_set_goal_header', 'what_next_send_thanks_header', 'what_next_followup_header',
			  'prev'
	      ];

	      return keys;
    },
    
    loadMessages: function() {
    	
    	var keys = this.getMsgCatKeys();
        
        var initHandler = { 
            success: function(o) {
                YAHOO.Convio.PC2.Component.Content.loadMsgCatalogResponseHandler.success(o);
                YAHOO.Convio.PC2.Utils.loadSecondStage();
            },
            failure: function(o) {
                YAHOO.Convio.PC2.Component.Content.loadMsgCatalogResponseHandler.failure(o);
                // bug 54841 let continue so a redirect to login screen occurs
                YAHOO.Convio.PC2.Utils.loadSecondStage();
            }
        };
        YAHOO.Convio.PC2.Content.getMessageBundle(initHandler, keys, 'trpc');
    },
    
    encodeMultipleIds: function(ids) {
        params = "";
        
        if(ids) {
            ids = YAHOO.Convio.PC2.Utils.ensureArray(ids);
            var first = true;
            for(var i=0, idsLength = ids.length; i < idsLength; i++) {
                if(!first) {
                    params += ",";
                } else {
                    first = false;
                }
                params += encodeURIComponent(ids[i]);
            }
        }
        return params;
    },
    
    /**
     * A utility function that uses regular expressions to extract javascript
     * content from an HTML string. This function can be used to extract and
     * eval() javascript content that is returned by an AJAX call.
     * 
     * Note that as of 12/04/2009 this function was only prototyped while
     * working on bug 44397. It has not been extensively tested.
     * 
     * To make use of this function you might do something like this:
     *     <code>
     *      var scripts = YAHOO.Convio.PC2.Utils.extractJavaScriptFromHtml(response.message);
     *   if (scripts != null) {
     *       for (var i = 0; i < scripts.length; i++) {
     *           eval(scripts[i]);
     *       }
     *   }
     *  </code> 
     * 
     */
    extractJavaScriptFromHtml: function (html) {
        
        var jsSingleLineCommentRegExp = '\/\/.*\n';
        var sanitizedHtml = html.replace(new RegExp(jsSingleLineCommentRegExp, 'gi'), '').replace(/\s/ig,' ');
        
        var beginScriptRegExp = '(<script[^>]*>)';
        var endScriptRegExp = '(<\/script>)';
        var scriptRegExp = new RegExp(beginScriptRegExp + '(.+?)' + endScriptRegExp, 'ig'); 
            
        var matches = sanitizedHtml.match(scriptRegExp);
        if (matches != null) {
            for (var i = 0; i < matches.length; i++) {
                
                var beginHTMLComentRegExp = '<!\-\-';
                var endHTMLComentRegExp = '\-\->';
                
                matches[i] = matches[i]
                                           .replace(new RegExp(beginScriptRegExp, 'ig'), '')
                                           .replace(new RegExp(endScriptRegExp, 'ig'), '') 
                                           .replace(new RegExp(beginHTMLComentRegExp, 'igm'), '')
                                           .replace(new RegExp(endHTMLComentRegExp, 'igm'), '');
            }
        }
        
        return matches;
    },
    
    loadView: function(view, subview) {
    	window.location.hash = "pc2=" + view + "-" + subview;
        if(!Y.History.navigate("pc2", view + '-' + subview)) {
            window.location.hash = "pc2=" + view + "-" + subview;
        }
        
        // close out any stray TinyMCE spellcheck menu
        YAHOO.namespace("Convio.TinyMCE.SpellChecker");
        if (YAHOO.Convio.TinyMCE.SpellChecker.lastMenuShown) {
        	YAHOO.Convio.TinyMCE.SpellChecker.lastMenuShown.hideMenu();
        }
        
        // close out any stray YUI date picker menu
        YAHOO.namespace("YAHOO.Convio.PC2.Component.Survey");
        if (YAHOO.Convio.PC2.Component.Survey.lastDatePickerPanelShown) {
        	YAHOO.Convio.PC2.Component.Survey.lastDatePickerPanelShown.hide();
        }
        
        // bug 50133
        // make a backup call to resizeFrameForCurrentView() in case interval 
        // thread started in dashboard.html is blocked
        var resizeTimeoutsInMilliseconds = [ 10, 100, 500, 1000, 3000, 5000 ];
        for (var i = 0; i < resizeTimeoutsInMilliseconds.length; i++) {
        	setTimeout(YAHOO.Convio.PC2.Utils.resizeFrameForCurrentView, resizeTimeoutsInMilliseconds[i]);
        }
        
        // bug 51338
        // cancel any currently running address book import "thread"
        if (YAHOO.Convio.PC2.Component.AddressBookImport && YAHOO.Convio.PC2.Component.AddressBookImport.importEventsAndStatusThreadId) {
       		clearInterval(YAHOO.Convio.PC2.Component.AddressBookImport.importEventsAndStatusThreadId);
        }
    },
    
    realLoadView: function(view, subview) {
    	jQuery('#hd-nav li.selected').removeClass('selected');
        YAHOO.util.Dom.addClass(view + '-nav-link', 'selected');
        
        if(YAHOO.Convio.PC2.Views.load[view]) {
            YAHOO.Convio.PC2.Views.load[view](subview);
        }
        var viewChange = { 
                oldView : YAHOO.Convio.PC2.Views.current,
                oldSubview : YAHOO.Convio.PC2.Views.current_subview,
                view : view,
                subview : subview
        };
        YAHOO.Convio.PC2.Utils.publisher.fire("pc2:viewChanged", viewChange);
        
        YAHOO.Convio.PC2.Views.current = view;
        YAHOO.Convio.PC2.Views.current_subview = subview;
        /*window.location.hash = view + '-' + subview; */
    },
    
    // This is the text that will appear in the loading panel.  By default, Convio provides no
    // text for this.  Please over-ride this in custom.js by adding a line such as:
    // YAHOO.Convio.PC2.Utils.LoadingMessage="Loading, please wait.";
    LoadingMessage: "Loading, please wait...",
    LoadingMessage_en_US: "Loading, please wait...",
    LoadingMessage_en_GB: "Loading, please wait...",
    LoadingMessage_en_CA: "Loading, please wait...",
    LoadingMessage_fr_CA: "Chargement, s'il vous pla&icirc;t attendre...",
    LoadingMessage_es_US: "Cargando, espere por favor...",
    
    getLoadingMessage: function(){
        if (YAHOO.Convio.PC2.Utils.hasValue(YAHOO.Convio.PC2.Config.getLocale()) == false){
            return this.LoadingMessage;
        } else {
            switch(YAHOO.Convio.PC2.Config.getLocale()){
            case "en_US":
                return this.LoadingMessage_en_US;
            case "en_GB":
                return this.LoadingMessage_en_GB;
            case "en_CA":
                return this.LoadingMessage_en_CA;
            case "fr_CA":
                return this.LoadingMessage_fr_CA;
            case "es_US":
                return this.LoadingMessage_es_US;
            default:
                return this.LoadingMessage;
            }
        }
    },
    
    LegacyBrowserWarningMessage: "Consider upgrading your web browser to one of these options to take full advantage of your Participant Center experience.",
    LegacyBrowserWarningMessage_en_US: "Consider upgrading your web browser to one of these options to take full advantage of your Participant Center experience.",
    LegacyBrowserWarningMessage_en_GB: "Consider upgrading your web browser to one of these options to take full advantage of your Participant Center experience.",
    LegacyBrowserWarningMessage_en_CA: "Consider upgrading your web browser to one of these options to take full advantage of your Participant Center experience.",
    LegacyBrowserWarningMessage_fr_CA: "Veuillez considérer mettre à niveau votre navigateur Web vers l'une de ces options pour profiter au maximum de votre expérience du Centre des participants.",
    LegacyBrowserWarningMessage_es_US: "Considere actualizar su explorador web a una de estas opciones para aprovechar al máximo su experiencia en el Centro para el participante.",
    
    getLegacyBrowserWarningMessage: function(){
        if (YAHOO.Convio.PC2.Utils.hasValue(YAHOO.Convio.PC2.Config.getLocale()) == false){
            return this.LegacyBrowserWarningMessage;
        } else {
            switch(YAHOO.Convio.PC2.Config.getLocale()){
	            case "en_US":
	                return this.LegacyBrowserWarningMessage_en_US;
	            case "en_GB":
	                return this.LegacyBrowserWarningMessage_en_GB;
	            case "en_CA":
	                return this.LegacyBrowserWarningMessage_en_CA;
	            case "fr_CA":
	                return this.LegacyBrowserWarningMessage_fr_CA;
	            case "es_US":
	                return this.LegacyBrowserWarningMessage_es_US;
	            default:
	                return this.LegacyBrowserWarningMessage;
            }
        }
    },
    
    OptimalBrowserMessage: "Note that this Participant Center is a Rich Internet Application and will work best with the following web browsers:",
    OptimalBrowserMessage_en_US: "Note that this Participant Center is a Rich Internet Application and will work best with the following web browsers:",
    OptimalBrowserMessage_en_GB: "Note that this Participant Center is a Rich Internet Application and will work best with the following web browsers:",
    OptimalBrowserMessage_en_CA: "Note that this Participant Center is a Rich Internet Application and will work best with the following web browsers:",
    OptimalBrowserMessage_fr_CA: "Veuillez noter que ce Centre des participants est une application Internet avancée qui fonctionnera mieux avec les navigateurs suivants:",
    OptimalBrowserMessage_es_US: "Tenga en cuenta que este Centro para el participante es una valiosa aplicación en línea y funcionará mejor con los siguientes exploradores:",
    
    getOptimalBrowserMessage: function(){
        if (YAHOO.Convio.PC2.Utils.hasValue(YAHOO.Convio.PC2.Config.getLocale()) == false){
            return this.OptimalBrowserMessage;
        } else {
            switch(YAHOO.Convio.PC2.Config.getLocale()){
	            case "en_US":
	                return this.OptimalBrowserMessage_en_US;
	            case "en_GB":
	                return this.OptimalBrowserMessage_en_GB;
	            case "en_CA":
	                return this.OptimalBrowserMessage_en_CA;
	            case "fr_CA":
	                return this.OptimalBrowserMessage_fr_CA;
	            case "es_US":
	                return this.OptimalBrowserMessage_es_US;
	            default:
	                return this.OptimalBrowserMessage;
            }
        }
    },
    
    OrHigherMessage: "or higher",
    OrHigherMessage_en_US: "or higher",
    OrHigherMessage_en_GB: "or higher",
    OrHigherMessage_en_CA: "or higher",
    OrHigherMessage_fr_CA: "ou une version ultérieure",
    OrHigherMessage_es_US: "o posteriores",
    
    getOrHigherMessage: function(){
        if (YAHOO.Convio.PC2.Utils.hasValue(YAHOO.Convio.PC2.Config.getLocale()) == false){
            return this.OrHigherMessage;
        } else {
            switch(YAHOO.Convio.PC2.Config.getLocale()){
	            case "en_US":
	                return this.OrHigherMessage_en_US;
	            case "en_GB":
	                return this.OrHigherMessage_en_GB;
	            case "en_CA":
	                return this.OrHigherMessage_en_CA;
	            case "fr_CA":
	                return this.OrHigherMessage_fr_CA;
	            case "es_US":
	                return this.OrHigherMessage_es_US;
	            default:
	                return this.OrHigherMessage;
            }
        }
    },
    
    getOptimalBrowserDom: function(){
        var domSnippet = '<div id="optimalBrowserDiv">';
        domSnippet += '<p><b>' + this.getOptimalBrowserMessage() + '</b></p>';
        domSnippet += '<ul id="optimalBrowserList">';
        domSnippet += '<li>Microsoft Internet Explorer 8.0 ' + this.getOrHigherMessage() + '</li>';
        domSnippet += '<li>Google Chrome 6.0 ' + this.getOrHigherMessage() + '</li>';
        domSnippet += '<li>Mozilla Firefox 3.6 ' + this.getOrHigherMessage() + '</li>';
        domSnippet += '</ul>';
        domSnippet += '<br/>';
        domSnippet += '<p>' + this.getLegacyBrowserWarningMessage() + '</p>';
        domSnippet += '</div>';
        return domSnippet;
    },
    
    initLoadingContainer: function(){
        YAHOO.Convio.PC2.Utils.LoadingContainer = new YAHOO.widget.Panel("wait",
            { width:"240px",
              fixedcenter:true,
              close:false,
              draggable:false,
              zindex:4,
              modal:true,
              visible:false
            });
        
        YAHOO.Convio.PC2.Utils.LoadingContainer.beginLoadingOn = new Date();
        
        YAHOO.Convio.PC2.Utils.LoadingContainer.setHeader(this.getLoadingMessage());
        
        var loadingContainerBody = '<div id="loading_progressbar"></div>';
        if (this.isEvilWebClient()) {
        	loadingContainerBody += this.getOptimalBrowserDom();
        }
       	YAHOO.Convio.PC2.Utils.LoadingContainer.setBody(loadingContainerBody);
        
        YAHOO.Convio.PC2.Utils.LoadingContainer.render(document.body);
        YAHOO.Convio.PC2.Utils.LoadingContainer.show();
        
        // initialize the progress bar for loading container
		YAHOO.Convio.PC2.Utils.ProgressBar.initProgressBar();
    },

    showLoadingContainer: function(){
        if (YAHOO.Convio.PC2.Utils.LoadingContainer){
            YAHOO.Convio.PC2.Utils.LoadingContainer.show();
        } else {
            YAHOO.Convio.PC2.Utils.initLoadingContainer();
        }
    },

    hideLoadingContainer: function(){
    	
    	YAHOO.Convio.PC2.Utils.ProgressBar.completeProgressBar();
    	
    	setTimeout(function() {
    		YAHOO.Convio.PC2.Utils.LoadingContainer.hide();
    	}, 800);
    	
    	// log time that user waited for page load
    	YAHOO.Convio.PC2.Utils.LoadingContainer.completedLoadingOn = new Date();
    	var loadingDurationMilliseconds = YAHOO.Convio.PC2.Utils.LoadingContainer.completedLoadingOn.getTime() - YAHOO.Convio.PC2.Utils.LoadingContainer.beginLoadingOn.getTime();
    	var loadingDurationLogMsg = 'Initial PC2 loading took ' + loadingDurationMilliseconds + ' milliseconds.';
    	YAHOO.log(loadingDurationLogMsg, 'info', 'convio_utils.js');
    	(typeof console !== "undefined") && console.info && console.info(loadingDurationLogMsg);
    	
    },
    
    isIFrameDetected: function(){
        return window.parent != window.self;
    },
    
    /**
     * Resizes a participant center frame's height to a value 
     * appropriate for the current view's content.
     */
    resizeFrameForCurrentView: function(){
    	
    	if (!YAHOO.Convio.PC2.Utils.isIFrameDetected()) {
    		YAHOO.log('Ingored call to resizeFrameForCurrentView() b/c this participant center does not appear to be embedded into an iFrame.', 'warn', 'convio_utils.js');
    		return;
    	}
    	
    	// get the viewable height of the current PC2 view  
    	var iFrameDocumentBody = document.body;
    	var viewableHeightForIFrameContent = iFrameDocumentBody.offsetHeight + 20;
    	
    	// get reference to the parent window's iFrame element
    	var iFrameElement = window.parent.document.getElementById('embeddedParticipantCenter');
    	if (!iFrameElement) {
    		YAHOO.log('Function resizeFrameForCurrentView() failed to find iFrame element in parent window.', 'error', 'convio_utils.js');
    		return;
    	}
    	
    	if (iFrameElement.height != viewableHeightForIFrameContent) {
    		iFrameElement.height = viewableHeightForIFrameContent;
    		YAHOO.log('Function resizeFrameForCurrentView() set iFrame height to ' + iFrameElement.height + '.', 'info', 'convio_utils.js');
    	}
    	
    },
    
    /**
     * @return a boolean indicating whether the client browser is known to play poorly with PC2
     */
    isEvilWebClient: function(){
    	
    	if (YAHOO.env.ua.ie > 0 && YAHOO.env.ua.ie < 8) {
    		// detected msie with version prior to 8
    		return true;
    	}

    	// user client didn't meet any "black list" criteria
    	return false;
    },
    
    /**
     * A progress bar that provides both time-based and event-based 
     * feedback to the user during the PC2 page load process.
     */
    ProgressBar: {
    	
    	initProgressBar: function() {
	    	YAHOO.Convio.PC2.Utils.ProgressBar.Instance = 
	    		jQuery("#loading_progressbar").progressbar({
	    			value: 1
	    		});
	    	
	    	// use a worker "thread" to advance the progress bar in a time-based fashion
			YAHOO.Convio.PC2.Utils.LoadingContainerWorkerId = setInterval(function() {
				
				// this type of progress happens with decreasing likelihood 
				// as we approach the end of the load process
				var randomPercentage = Math.floor(Math.random() * 100);
				var progressBarValue = YAHOO.Convio.PC2.Utils.ProgressBar.getProgressBarValue();
				var remainingWorkValue = YAHOO.Convio.PC2.Utils.ProgressBar.getRemainingWorkValue();
				var advanceThreshold = progressBarValue
					// this clause makes time-based progress advancement even less likely in the 
					// last 1/4 of the progress bar
					+ ((progressBarValue < 75) ? 0 :((progressBarValue/100) * remainingWorkValue) );
				
				if ( randomPercentage > advanceThreshold) {
					YAHOO.Convio.PC2.Utils.ProgressBar.incrementProgressBarValue();
				}
			},
			/* 
			 * a faster interval will help to fake a 'responsive' initial page load... but a too-fast 
			 * interval will overwhelm an already taxed browser ... so the value for this interval 
			 * represents a tradeoff between perceived performance and actual performance 
			 */
			20);
			
	    },
	    
	    registerLoadEvents: function(loadingContainerEvents) {
	    	
	    	// each completed event represents the completion of a portion of the work to be done
	    	var progressEventPercentage = 1 / Math.max(1, loadingContainerEvents.length);
	    	
			for (var eventIndex = 0; eventIndex < loadingContainerEvents.length; eventIndex++) {
				
				var loadingContainerEvent = loadingContainerEvents[eventIndex];
				
				YAHOO.Convio.PC2.Utils.require(loadingContainerEvent, function() {
					
					if (YAHOO.Convio.PC2.Utils.ProgressBar.Instance) {
					
						// for this completed event, how far should we advance the progress bar?
						// ... a well-defined percentage of the remaining progress area at the time the event was fired; this
						//     value could be different for the various load events that are completed asynchronously
						var progressEventStepsToAdvance = Math.round(progressEventPercentage * YAHOO.Convio.PC2.Utils.ProgressBar.getRemainingWorkValue());
						
						for (var progressIncrementStep = 0; progressIncrementStep < progressEventStepsToAdvance; progressIncrementStep++) {
							setTimeout(function() { YAHOO.Convio.PC2.Utils.ProgressBar.incrementProgressBarValue(); }, progressIncrementStep * 50);
						} 
					
					}
		        });
			}
	    },
	    
	    getProgressBarValue: function() {
	    	
	    	if (!YAHOO.Convio.PC2.Utils.ProgressBar.Instance) {
	    		throw "Illegal state ... call initProgressBar(..) first!";
	    	}
	    	
	    	var currentProgressValue = Math.max(0, YAHOO.Convio.PC2.Utils.ProgressBar.Instance.progressbar("option", "value"));
			return currentProgressValue;
	    },
	    
	    getRemainingWorkValue: function() {
	    	return 100 - YAHOO.Convio.PC2.Utils.ProgressBar.getProgressBarValue();
	    },
	    
	    setProgressBarValue: function(newValue) {
	    	
	    	if (!YAHOO.Convio.PC2.Utils.ProgressBar.Instance) {
	    		throw "Illegal state ... call initProgressBar(..) first!";
	    	}
	    	
	    	YAHOO.Convio.PC2.Utils.ProgressBar.Instance.progressbar("option", "value", Math.max(0, Math.min(100, newValue)));
	    },
	    
	    incrementProgressBarValue: function() {
			var currentProgressValue = YAHOO.Convio.PC2.Utils.ProgressBar.getProgressBarValue();
			var nextProgressValue = Math.min(100, currentProgressValue + 1);
			YAHOO.Convio.PC2.Utils.ProgressBar.setProgressBarValue(nextProgressValue);
		},
		
		completeProgressBar: function() {
			
			// stop the worker "thread" used to smooth out the  progress bar
	    	if (YAHOO.Convio.PC2.Utils.LoadingContainerWorkerId) {
	    		clearInterval(YAHOO.Convio.PC2.Utils.LoadingContainerWorkerId);
	    	}
	    	
	    	// move progress bar to 100%
	    	YAHOO.Convio.PC2.Utils.ProgressBar.setProgressBarValue(100);
			
		}
    	
    }, // end YAHOO.Convio.PC2.Utils.ProgressBar
    
    htmlUnescape: function(escaped){
      if(escaped==='')
        return escaped;
    	var elm = YAHOO.util.Dom.get("html-unescape-div");
    	if (!elm) {
    		YAHOO.log("Error: Unable to find HTML unescape div.  Please add the div back to dashboard.html.", "error", "convio_utils.js");
    		return "";
    	}
    	elm.innerHTML = escaped;
    	return elm.childNodes.length === 0 ? "" : elm.childNodes[0].nodeValue;
    }
    
}; // end YAHOO.Convio.PC2.Utils

function formatTime(date) {

    var hours = date.getHours();
    if (hours == 0) {
        hours = 12;
    }
    else if (hours > 12) {
        hours = hours - 12;
    }

    var minutes = date.getMinutes();
    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    var ampm = date.getHours() < 12 ? 'am' : 'pm';

    return hours + ':' + minutes + ' ' + ampm;
}

function formatDateFromMillis(dateObj) {
    var datePair = dateObj.split('T');
    var dateItems = datePair[0].split('-');
    return getMonthString(dateItems[1]) + ' ' + dateItems[2];
}

function getMonthString(month) {
    var monthString;
    switch(month) {
    case '01':
        monthString = 'Jan';
        break;
    case '02':
        monthString = 'Feb';
        break;
    case '03':
        monthString = 'Mar';
        break;
    case '04':
        monthString = 'Apr';
        break;
    case '05':
        monthString = 'May';
        break;
    case '06':
        monthString = 'Jun';
        break;
    case '07':
        monthString = 'Jul';
        break;
    case '08':
        monthString = 'Aug';
        break;
    case '09':
        monthString = 'Sep';
        break;
    case '10':
        monthString = 'Oct';
        break;
    case '11':
        monthString = 'Nov';
        break;
    case '12':
        monthString = 'Dec';
        break;
    }
    return monthString;
}

var keepAliveDialog;
var keepAliveTimer;
var keepAliveForceTimer;
var keepAliveDialogTimer;
var keepAliveLoadTime = new Date().getTime();

function initKeepAliveDialog() {
    if (!keepAliveDialog) {
        keepAliveDialog = 
        	YAHOO.Convio.PC2.Component.SimpleDialogBuilder.buildBasicDialog(
        		'keepAlive',
				{ /* no config overrides */ }
    	   );
        // use YUI so that unit tests don't fail
        var header = YAHOO.util.Dom.get('msg_cat_session_timeout_header');
        if(header) {
          keepAliveDialog.setHeader(header.innerHTML);
        }
    }
}

function showTimingOutDialog(expireText) {
    keepAliveDialog.cfg.queueProperty('icon', YAHOO.widget.SimpleDialog.ICON_WARN);

    keepAliveDialog.setBody(expireText);

    var logOut = function() {
        var logoutUrl = YAHOO.Convio.PC2.Config.getBaseUrl() + "UserLogin?logout=true";
        window.location.href = logoutUrl;
        this.hide();
        
    };

    var continueWorking = function() {
        clearInterval(keepAliveTimer);
        forceKeepAlive2();
        resetTimeout();
        this.hide();
    };

    var continueWorkingText = jQuery('#msg_cat_session_timeout_continue_working').html();
	var logOutText = jQuery('#msg_cat_session_timeout_log_out').html();
    var buttons = [ { text: logOutText, handler:logOut }, { text: continueWorkingText, handler:continueWorking, isDefault: true } ];
    keepAliveDialog.cfg.queueProperty('buttons', buttons);

    keepAliveDialog.render(document.body);
    keepAliveDialog.show();
}

function showTimedOutDialog(expireText) {

    keepAliveDialog.cfg.queueProperty('icon', YAHOO.widget.SimpleDialog.ICON_WARN);

    keepAliveDialog.setBody(expireText);

    keepAliveDialog.cfg.queueProperty('close', true);

    var logIn = function() {
    	window.location.reload(); // redirect to login page, then back where they were
        this.hide();
    } 

    // make the dialog closable in case they have unsaved text on the page
    keepAliveDialog.cfg.queueProperty('close', 'true');

    var loginText = jQuery('#msg_cat_session_timeout_log_back_in').html();
    var buttons = [ { text: loginText, handler:logIn } ];
    keepAliveDialog.cfg.queueProperty('buttons', buttons);

    keepAliveDialog.render(document.body);
    keepAliveDialog.show();
}

function showKeepAliveDialog() {
    var expireTime = keepAliveLoadTime + (1 * YAHOO.Convio.PC2.Config.getTimeoutExpiration());
    var warningTime = (1 * YAHOO.Convio.PC2.Config.getTimeoutWarning());
    var remainingDuration = expireTime - new Date().getTime();
    if (remainingDuration > warningTime) {
        if (keepAliveDialog) {
            keepAliveDialog.hide();
        }
    }
    else if (remainingDuration > 0) {
        var remainingMinutes = Math.floor(remainingDuration / (60 * 1000));
        var remainingText;        
        if (remainingMinutes < 1) {
        	remainingText = jQuery('#msg_cat_session_timeout_minute_less_than_one').html();
        }
        else if (remainingMinutes == 1) {
        	remainingText = '1 ' + jQuery('#msg_cat_session_timeout_minute').html();
        }
        else  {
        	remainingText = remainingMinutes + ' ' + jQuery('#msg_cat_session_timeout_minutes').html();
        }
        var expireText = jQuery('#msg_cat_session_timeout_expiring_content1').html() + ' ' + remainingText
			+ ' '+ jQuery('#msg_cat_session_timeout_expiring_content2').html();
        showTimingOutDialog(expireText);
    }
    else {
        clearInterval(keepAliveTimer);
        var expireText = jQuery('#msg_cat_session_timeout_expired_content').html() + ' ' 
        	+ formatTime(new Date(expireTime)) + '.';
        showTimedOutDialog(expireText);
    }
}

/**
 * Web 2.0 version of keepAlive
 */
function keepAlive2() {
    initKeepAliveDialog();
    var pollExpression = 'showKeepAliveDialog();';
    eval(pollExpression);
    keepAliveTimer = setInterval(pollExpression, 1000);
}

/**
 * Web 2.0 version of forceKeepAlive
 */
function forceKeepAlive2() {
    var params = "timestamp=" + new Date().getTime();
    var url = YAHOO.Convio.PC2.Config.getBaseUrl() + "AjaxHelper" + "?" + params;
    
    var callback = {};
    
    YAHOO.util.Connect.asyncRequest('GET', url, callback);
    YAHOO.log("Ajax force keep alive called.", "debug", "convio_utils.js");
    keepAliveLoadTime = new Date().getTime();
}

function resetTimeout()
{
    // If PC Cookie Login SDP is enabled we don't worry about timeouts
    if (YAHOO.Convio.PC2.Config.isPcCookieLoginEnabled().toLowerCase() === 'true' && YAHOO.Convio.PC2.Config.getLoginCookie() != null)
    {
        return;
    }

    keepAliveLoadTime = new Date().getTime();
    YAHOO.log("Reset timeout at " + new Date().getTime(), "debug", "convio_utils.js");
    
    clearTimeout(keepAliveForceTimer);
    clearTimeout(keepAliveDialogTimer);
    clearInterval(keepAliveTimer);
    
    keepAliveForceTimer = setTimeout("forceKeepAlive2();", (1 * YAHOO.Convio.PC2.Config.getTimeoutWarning()));
    keepAliveDialogTimer = setTimeout("keepAlive2();", (2 * YAHOO.Convio.PC2.Config.getTimeoutWarning()));
}
