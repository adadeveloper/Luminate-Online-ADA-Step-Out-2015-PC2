/* teamraiser_rest.js
 * Copyright 2008, Convio
 *
 * Provides Convio TeamRaiser ReST call functionality.
 * 
 * Depends on:
 * YUI Core, Cookies, Connection
 * convio_config.js, convio_utils.js
 *
 */
YAHOO.Convio.PC2.Teamraiser = {
       
    /* 
     * Retrieves a registration object
     */
    getRegistration: function(callback) {
        var key = "registration";
        var store = YAHOO.Convio.PC2.Utils.StorageEngine;
        
        if(store) {
            var resp = store.getItem(key);
            if(resp != null) {       
                YAHOO.log('Retrieved registration from session storage.','info','teamraiser_rest.js');
                YAHOO.log('Response was: ' + resp, 'info', 'teamraiser_rest.js');
                callback.success( {responseText: resp} );
                return;
            }
        }
        var params = "method=getRegistration&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
        
        var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
        YAHOO.log('Preparing XHR, url=' + url + ', params=' + params, 'info', 'teamraiser_rest.js');
        YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
    },
    
    /*
     * Updates a registration
     */
    updateRegistration: function(callback, registration) {
        var params = "method=updateRegistration&response_format=json";
        
        // If there is a registration stored locally, clear it.
        /*var store = YAHOO.Convio.PC2.Utils.StorageEngine;
        if(store) {
            alert('test');
            store.removeItem("registration");   
        }*/
        
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();

        if( registration.flowStep != '' &&
            !YAHOO.lang.isNull(registration.flowStep) &&
            !YAHOO.lang.isUndefined(registration.flowStep))
        {
            params += "&flow_step=" + encodeURIComponent(registration.flowStep);
        }
        if( registration.emergencyName != '' &&
            !YAHOO.lang.isNull(registration.emergencyName) &&
            !YAHOO.lang.isUndefined(registration.emergencyName))
        {
            params += "&emergency_name=" + encodeURIComponent(registration.emergencyName);
        }
        
        if( registration.emergencyPhone != '' && 
            !YAHOO.lang.isNull(registration.emergencyPhone) &&
            !YAHOO.lang.isUndefined(registration.emergencyPhone)) 
        {
            params += "&emergency_phone=" + encodeURIComponent(registration.emergencyPhone);
        }
        if( !YAHOO.lang.isNull(registration.goal) &&
            !YAHOO.lang.isUndefined(registration.goal))
        {
            params += "&goal=" + encodeURIComponent(registration.goal);
        }
        if( registration.privatePage != '' &&
            !YAHOO.lang.isNull(registration.privatePage) &&
            !YAHOO.lang.isUndefined(registration.privatePage))
        {
            params += "&private_page=" + encodeURIComponent(registration.privatePage);
        }
        if( registration.receiveGiftNotification != '' &&
                !YAHOO.lang.isNull(registration.receiveGiftNotification) &&
                !YAHOO.lang.isUndefined(registration.receiveGiftNotification))
        {
        	params += "&receive_gift_notification=" + encodeURIComponent(registration.receiveGiftNotification);
        }
        if( registration.companyId != '' &&
        		!YAHOO.lang.isNull(registration.companyId) &&
        		!YAHOO.lang.isUndefined(registration.companyId)) 
        {
        	params += "&company_id=" + encodeURIComponent(registration.companyId);
        }
        if( registration.companyName != '' &&
        		!YAHOO.lang.isNull(registration.companyName) &&
        		!YAHOO.lang.isUndefined(registration.companyName))  
        {
       	 	params += "&company_name=" + encodeURIComponent(registration.companyName);
        }
        if ( registration.updateLastPC2Login != '' &&
            !YAHOO.lang.isNull(registration.updateLastPC2Login) &&
            !YAHOO.lang.isUndefined(registration.updateLastPC2Login)) {
        	
        	params += "&update_last_pc2_login=" + encodeURIComponent(registration.updateLastPC2Login);
        }
        if( registration.anonymousRegistration != '' && 
        		!YAHOO.lang.isNull(registration.anonymousRegistration) &&
                !YAHOO.lang.isUndefined(registration.anonymousRegistration))
        {
        	params += "&anonymous_registration=" + encodeURIComponent(registration.anonymousRegistration);
        }
        if( registration.standardRegistration != '' && 
        		!YAHOO.lang.isNull(registration.standardRegistration) &&
                !YAHOO.lang.isUndefined(registration.standardRegistration))
        {
        	params += "&standard_registration=" + encodeURIComponent(registration.standardRegistration);
        }
        if( registration.screenname != '' && 
        		!YAHOO.lang.isNull(registration.screenname) &&
                !YAHOO.lang.isUndefined(registration.screenname))
        {
        	params += "&screenname=" + encodeURIComponent(registration.screenname);
        }
        
        var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
        
        YAHOO.log('Preparing XHR, url=' + url + ', params=' + params, 'info', 'teamraiser_rest.js');
        YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
    },
    
    /*
     * Retrieve participant fundraising results.
     */
    getFundraisingResults: function(callback) {
        var params = "method=getFundraisingResults&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
        params += "&timestamp=" + new Date().getTime();
        var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
        
        YAHOO.log('Preparing XHR, url=' + url + ', params=' + params, 'info', 'teamraiser_rest.js');
        YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
    },
    
    /*
     * Get TeamRaiser gifts
     */
    getGifts: function(callback, listCriteria) {
        var params = "method=getGifts&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
        params += YAHOO.Convio.PC2.Utils.getListCriteriaParams(listCriteria);
        
        var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
        
        YAHOO.log('Preparing XHR, url=' + url + ', params=' + params, 'info', 'teamraiser_rest.js');
        YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
     },
     
     getGiftsParams: function(listCriteria) {
 		var params = "method=getGifts&response_format=json";
 		params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
 		params += YAHOO.Convio.PC2.Utils.getListCriteriaParams(listCriteria);
 		params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
 		
 		YAHOO.log("Returning params=" + params, 'info', 'teamraiser_rest.js');
 		return params;
 	},
 	
 	getTeamGiftsParams: function(listCriteria) {
 		var params = "method=getTeamGifts&response_format=json";
 		params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
 		params += YAHOO.Convio.PC2.Utils.getListCriteriaParams(listCriteria);
 		params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
 		
 		YAHOO.log("Returning params=" + params, 'info', 'teamraiser_rest.js');
 		return params;
 	},
     
     addGift: function(callback, gift) {
    	 var params = "method=addGift&response_format=json";
    	 params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
    	 params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
    	 params += "&first_name=" + encodeURIComponent(gift.firstName);
    	 params += "&last_name=" + encodeURIComponent(gift.lastName);
    	 params += "&email=" + encodeURIComponent(gift.email);
    	 params += "&gift_amount=" + encodeURIComponent(gift.giftAmount);
    	 params +="&gift_aid_status=" + encodeURIComponent(gift.giftAidStatus);
    	 params += "&payment_type=" + encodeURIComponent(gift.paymentType);
    	 if(gift.street1) {
    		 params += "&street1=" + encodeURIComponent(gift.street1);
    	 }
    	 if(gift.street2) {
    		 params += "&street2=" + encodeURIComponent(gift.street2);
    	 }
    	 if(gift.street3) {
    		 params += "&street3=" + encodeURIComponent(gift.street3);
    	 }
    	 if(gift.city) {
    		 params += "&city=" + encodeURIComponent(gift.city);
    	 }
    	 if(gift.state) {
    		 params += "&state=" + encodeURIComponent(gift.state);
    	 }
    	 if(gift.county) {
    		 params += "&county=" + encodeURIComponent(gift.county);
    	 }
    	 if(gift.zip) {
    		 params += "&zip=" + encodeURIComponent(gift.zip);
    	 }
    	 if(gift.country) {
    		 params += "&country=" + encodeURIComponent(gift.country);
    	 }
    	 if(gift.recognitionName) {
    		 params += "&gift_display_name=" + encodeURIComponent(gift.recognitionName);
    	 }
    	 if(gift.displayGift) {
    		 params += "&gift_display_personal_page=" + encodeURIComponent(gift.displayGift);
    	 }
    	 if(gift.checkNumber) {
    		 params += "&check_number=" + encodeURIComponent(gift.checkNumber);
    	 }
    	 
    	 if(gift.paymentType == 'credit') {
    		params += "&billing_first_name=" + encodeURIComponent(gift.billingFirstName);
 			params += "&billing_last_name=" + encodeURIComponent(gift.billingLastName);
 			params += "&billing_street1=" + encodeURIComponent(gift.billingStreet1);
 			if(gift.billingStreet2) {
 				params += "&billing_street2=" + encodeURIComponent(gift.billingStreet2);
 			}
 			params += "&billing_city=" + encodeURIComponent(gift.billingCity);
 			params += "&billing_state=" + encodeURIComponent(gift.billingState);
 			params += "&billing_zip=" + encodeURIComponent(gift.billingZip);
 			params += "&credit_card_number=" + encodeURIComponent(gift.billingCardNumber);
 			params += "&credit_card_verification_code=" + encodeURIComponent(gift.billingVerificationCode);
 			params += "&credit_card_month=" + encodeURIComponent(gift.billingMonth);
 			params += "&credit_card_year=" + encodeURIComponent(gift.billingYear);
    	 }
    	 if(YAHOO.lang.isUndefined(gift.teamGift) == false) {
    		 params += "&team_gift=" + encodeURIComponent(gift.teamGift);
    	 }
    	 if(YAHOO.lang.isUndefined(gift.giftCategoryId) == false) {
    		 params += "&gift_category_id=" + encodeURIComponent(gift.giftCategoryId);
    	 }
    	 
    	 var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
    	 YAHOO.log('Preparing XHR, url=' + url + ', params=' + params, 'info', 'teamraiser_rest.js');
    	 YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
     },
     
     deleteGift: function(callback, giftId) {
    	 deleteGift(callback, giftId, false);
     },
     
     deleteGift: function(callback, giftId, isTeamGift) {
    	 var params = "method=deleteGift&response_format=json";
    	 params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
    	 params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
    	 params += "&gift_id=" + encodeURIComponent(giftId);
    	 if(isTeamGift) {
    		 params += "&team_gift=" + encodeURIComponent(true);
    	 }
    	 
    	 var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
    	 YAHOO.log('Preparing XHR, url=' + url + ', params=' + params, 'info', 'teamraiser_rest.js');
    	 YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
     },
     
    /*
     * Get TeamRaiser gifts (params only)
     */
    getGiftsParams: function(listCriteria) {
        var params = "method=getGifts&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
        params += YAHOO.Convio.PC2.Utils.getListCriteriaParams(listCriteria);
        
        YAHOO.log("Returning params=" + params, 'info', 'teamraiser_rest.js');
        return params;
     },
     
    /*
     * Get Personal Shortcut
     */
    getShortcut: function(callback) {
        var params = "method=getShortcut&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
        
        var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
        
        YAHOO.log('Preparing XHR, url=' + url + ', params=' + params, 'info', 'teamraiser_rest.js');
        YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
    },
    
    /*
     * Get Personal Shortcut
     */
    updateShortcut: function(callback, shortcutText) {
        var params = "method=updateShortcut&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
        params += "&text=" + encodeURIComponent(shortcutText);
        
        var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
        
        YAHOO.log('Preparing XHR, url=' + url + ', params=' + params, 'info', 'teamraiser_rest.js');
        YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
    },
    
    /*
     * Get Team Shortcut
     */
    getTeamShortcut: function(callback) {
        var params = "method=getTeamShortcut&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
        
        var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
        
        YAHOO.log('Preparing XHR, url=' + url + ', params=' + params, 'info', 'teamraiser_rest.js');
        YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
    },
    
    /*
     * Get Team Shortcut
     */
    updateTeamShortcut: function(callback, shortcutText) {
        var params = "method=updateTeamShortcut&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
        params += "&text=" + encodeURIComponent(shortcutText);
        
        var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
        
        YAHOO.log('Preparing XHR, url=' + url + ', params=' + params, 'info', 'teamraiser_rest.js');
        YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
    },
    
    /*
     * Get Company Shortcut
     */
    getCompanyShortcut: function(callback) {
        var params = "method=getCompanyShortcut&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
        
        var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
        
        YAHOO.log('Preparing XHR, url=' + url + ', params=' + params, 'info', 'teamraiser_rest.js');
        YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
    },
    
    /*
     * Get Company Shortcut
     */
    updateCompanyShortcut: function(callback, shortcutText) {
        var params = "method=updateCompanyShortcut&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
        params += "&text=" + encodeURIComponent(shortcutText);
        
        var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
        
        YAHOO.log('Preparing XHR, url=' + url + ', params=' + params, 'info', 'teamraiser_rest.js');
        YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
    },
     
     /**
      * Retrieve personal page information.
      */
     getPersonalPageInfoResult: function(callback) {
     	var params = "method=getPersonalPageInfo&response_format=json";
     	params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
     	
     	var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
     	
     	YAHOO.log('Preparing XHR, url=' + url + ', params=' + params, 'info,', 'teamraiser_rest.js');
     	YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
     },
     
     /**
      * Retrieve team page information.
      */
     getTeamPageInfoResult: function(callback) {
     	var params = "method=getTeamPageInfo&response_format=json";
     	params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
     	
     	var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
     	
     	YAHOO.log('Preparing XHR, url=' + url + ' , params=' + params, 'info,', 'teamraiser_rest.js');
     	YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
     },
     
     /**
      * Retrieve company page information.
      */
     getCompanyPageInfoResult: function(callback) {
     	var params = "method=getCompanyPageInfo&response_format=json";
     	params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
     	
     	var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
     	
     	YAHOO.log('Preparing XHR, url=' + url + ' , params=' + params, 'info,', 'teamraiser_rest.js');
     	YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
     },
     
     /*
      * Updates the personal page information
      */
     updatePersonalPageInfo: function(callback, personalPageInfo) {
         var params = "method=updatePersonalPageInfo&response_format=json";
         params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
         params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();

         if( !YAHOO.lang.isNull(personalPageInfo.pageTitle) &&
             !YAHOO.lang.isUndefined(personalPageInfo.pageTitle))
         {
             params += "&page_title=" + encodeURIComponent(personalPageInfo.pageTitle);
         }
         if( !YAHOO.lang.isNull(personalPageInfo.headline1) &&
             !YAHOO.lang.isUndefined(personalPageInfo.headline1))
         {
             params += "&headline1=" + encodeURIComponent(personalPageInfo.headline1);
         }
         if( !YAHOO.lang.isNull(personalPageInfo.text1) &&
             !YAHOO.lang.isUndefined(personalPageInfo.text1))
         {
             params += "&text1=" + encodeURIComponent(personalPageInfo.text1);
         }
         if( !YAHOO.lang.isNull(personalPageInfo.headline2) &&
             !YAHOO.lang.isUndefined(personalPageInfo.headline2))
         {
             params += "&headline2=" + encodeURIComponent(personalPageInfo.headline2);
         }
         if( !YAHOO.lang.isNull(personalPageInfo.text2) &&
             !YAHOO.lang.isUndefined(personalPageInfo.text2))
         {
             params += "&text2=" + encodeURIComponent(personalPageInfo.text2);
         }
         if( !YAHOO.lang.isNull(personalPageInfo.headline3) &&
             !YAHOO.lang.isUndefined(personalPageInfo.headline3))
         {
             params += "&headline3=" + encodeURIComponent(personalPageInfo.headline3);
         }
         if( !YAHOO.lang.isNull(personalPageInfo.text3) &&
             !YAHOO.lang.isUndefined(personalPageInfo.text3))
         {
             params += "&text3=" + encodeURIComponent(personalPageInfo.text3);
         }
         if( !YAHOO.lang.isNull(personalPageInfo.richText) &&
             !YAHOO.lang.isUndefined(personalPageInfo.richText))
         {
             params += "&rich_text=" + encodeURIComponent(personalPageInfo.richText);
         }
         if( !YAHOO.lang.isNull(personalPageInfo.status1) &&
             !YAHOO.lang.isUndefined(personalPageInfo.status1))
         {
             params += "&status1=" + encodeURIComponent(personalPageInfo.status1);
         }
         if( !YAHOO.lang.isNull(personalPageInfo.status2) &&
             !YAHOO.lang.isUndefined(personalPageInfo.status2))
         {
             params += "&status2=" + encodeURIComponent(personalPageInfo.status2);
         }
         if( !YAHOO.lang.isNull(personalPageInfo.blogEnabled) &&
             !YAHOO.lang.isUndefined(personalPageInfo.blogEnabled))
         {
             params += "&blog_enabled=" + encodeURIComponent(personalPageInfo.blogEnabled);
         }
         if( !YAHOO.lang.isNull(personalPageInfo.pageLayout) &&
             !YAHOO.lang.isUndefined(personalPageInfo.pageLayout))
         {
             params += "&page_layout=" + encodeURIComponent(personalPageInfo.pageLayout);
         }
         
         var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
         
         YAHOO.log('Preparing XHR, url=' + url + ', params=' + params, 'info', 'teamraiser_rest.js');
         YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
     },
     
     /*
      * Updates the team page information
      */
     updateTeamPageInfo: function(callback, teamPageInfo) {
         var params = "method=updateTeamPageInfo&response_format=json";
         params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
         params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();

         if( !YAHOO.lang.isNull(teamPageInfo.richText) &&
             !YAHOO.lang.isUndefined(teamPageInfo.richText))
         {
             params += "&rich_text=" + encodeURIComponent(teamPageInfo.richText);
         }
         
         var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
         
         YAHOO.log('Preparing XHR, url=' + url + ', params=' + params, 'info', 'teamraiser_rest.js');
         YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
     },
     
     /*
      * Updates the company page information
      */
     updateCompanyPageInfo: function(callback, companyPageInfo) {
         var params = "method=updateCompanyPageInfo&response_format=json";
         params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
         params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();

         if( !YAHOO.lang.isNull(companyPageInfo.pageTitle) &&
             !YAHOO.lang.isUndefined(companyPageInfo.pageTitle))
         {
             params += "&page_title=" + encodeURIComponent(companyPageInfo.pageTitle);
         }
         if( !YAHOO.lang.isNull(companyPageInfo.headline1) &&
             !YAHOO.lang.isUndefined(companyPageInfo.headline1))
         {
             params += "&headline1=" + encodeURIComponent(companyPageInfo.headline1);
         }
         if( !YAHOO.lang.isNull(companyPageInfo.text1) &&
             !YAHOO.lang.isUndefined(companyPageInfo.text1))
         {
             params += "&text1=" + encodeURIComponent(companyPageInfo.text1);
         }
         if( !YAHOO.lang.isNull(companyPageInfo.headline2) &&
             !YAHOO.lang.isUndefined(companyPageInfo.headline2))
         {
             params += "&headline2=" + encodeURIComponent(companyPageInfo.headline2);
         }
         if( !YAHOO.lang.isNull(companyPageInfo.text2) &&
             !YAHOO.lang.isUndefined(companyPageInfo.text2))
         {
             params += "&text2=" + encodeURIComponent(companyPageInfo.text2);
         }
         if( !YAHOO.lang.isNull(companyPageInfo.headline3) &&
             !YAHOO.lang.isUndefined(companyPageInfo.headline3))
         {
             params += "&headline3=" + encodeURIComponent(companyPageInfo.headline3);
         }
         if( !YAHOO.lang.isNull(companyPageInfo.text3) &&
             !YAHOO.lang.isUndefined(companyPageInfo.text3))
         {
             params += "&text3=" + encodeURIComponent(companyPageInfo.text3);
         }
         if( !YAHOO.lang.isNull(companyPageInfo.richText) &&
             !YAHOO.lang.isUndefined(companyPageInfo.richText))
         {
             params += "&rich_text=" + encodeURIComponent(companyPageInfo.richText);
         }
         if( !YAHOO.lang.isNull(companyPageInfo.status1) &&
                 !YAHOO.lang.isUndefined(companyPageInfo.status1))
         {
        	 params += "&status1=" + encodeURIComponent(companyPageInfo.status1);
         }
         if( !YAHOO.lang.isNull(companyPageInfo.status3) &&
        		 !YAHOO.lang.isUndefined(companyPageInfo.status3))
         {
        	 params += "&status3=" + encodeURIComponent(companyPageInfo.status3);
         }

         var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
         
         YAHOO.log('Preparing XHR, url=' + url + ', params=' + params, 'info', 'teamraiser_rest.js');
         YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
     },
     
     /*
      * Retrieves a preview of the personal page
      */
     getPersonalPagePreview: function(callback, personalPageInfo) {
         var params = "method=getPersonalPagePreview&response_format=json";
         params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
         params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();

         if( !YAHOO.lang.isNull(personalPageInfo.pageTitle) &&
             !YAHOO.lang.isUndefined(personalPageInfo.pageTitle))
         {
             params += "&page_title=" + encodeURIComponent(personalPageInfo.pageTitle);
         }
         if( !YAHOO.lang.isNull(personalPageInfo.headline1) &&
             !YAHOO.lang.isUndefined(personalPageInfo.headline1))
         {
             params += "&headline1=" + encodeURIComponent(personalPageInfo.headline1);
         }
         if( !YAHOO.lang.isNull(personalPageInfo.text1) &&
             !YAHOO.lang.isUndefined(personalPageInfo.text1))
         {
             params += "&text1=" + encodeURIComponent(personalPageInfo.text1);
         }
         if( !YAHOO.lang.isNull(personalPageInfo.headline2) &&
             !YAHOO.lang.isUndefined(personalPageInfo.headline2))
         {
             params += "&headline2=" + encodeURIComponent(personalPageInfo.headline2);
         }
         if( !YAHOO.lang.isNull(personalPageInfo.text2) &&
             !YAHOO.lang.isUndefined(personalPageInfo.text2))
         {
             params += "&text2=" + encodeURIComponent(personalPageInfo.text2);
         }
         if( !YAHOO.lang.isNull(personalPageInfo.headline3) &&
             !YAHOO.lang.isUndefined(personalPageInfo.headline3))
         {
             params += "&headline3=" + encodeURIComponent(personalPageInfo.headline3);
         }
         if( !YAHOO.lang.isNull(personalPageInfo.text3) &&
             !YAHOO.lang.isUndefined(personalPageInfo.text3))
         {
             params += "&text3=" + encodeURIComponent(personalPageInfo.text3);
         }
         if( !YAHOO.lang.isNull(personalPageInfo.richText) &&
             !YAHOO.lang.isUndefined(personalPageInfo.richText))
         {
             params += "&rich_text=" + encodeURIComponent(personalPageInfo.richText);
         }
         if( !YAHOO.lang.isNull(personalPageInfo.status1) &&
             !YAHOO.lang.isUndefined(personalPageInfo.status1))
         {
             params += "&status1=" + encodeURIComponent(personalPageInfo.status1);
         }
         if( !YAHOO.lang.isNull(personalPageInfo.status2) &&
             !YAHOO.lang.isUndefined(personalPageInfo.status2))
         {
             params += "&status2=" + encodeURIComponent(personalPageInfo.status2);
         }
	 if( !YAHOO.lang.isNull(personalPageInfo.pageLayout) &&
             !YAHOO.lang.isUndefined(personalPageInfo.pageLayout))
         {
             params += "&page_layout=" + encodeURIComponent(personalPageInfo.pageLayout);
         }
         
         var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
         
         YAHOO.log('Preparing XHR, url=' + url + ', params=' + params, 'info', 'teamraiser_rest.js');
         YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
     },
     
     /*
      * Retrieves a preview of the team page
      */
     getTeamPagePreview: function(callback, teamPageInfo) {
         var params = "method=getTeamPagePreview&response_format=json";
         params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
         params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();

         if( !YAHOO.lang.isNull(teamPageInfo.richText) &&
             !YAHOO.lang.isUndefined(teamPageInfo.richText))
         {
             params += "&rich_text=" + encodeURIComponent(teamPageInfo.richText);
         }
         
         var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
         
         YAHOO.log('Preparing XHR, url=' + url + ', params=' + params, 'info', 'teamraiser_rest.js');
         YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
     },
     
     /*
      * Retrieves a preview of the company page
      */
     getCompanyPagePreview: function(callback, companyPageInfo) {
         var params = "method=getCompanyPagePreview&response_format=json";
         params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
         params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();

         if( !YAHOO.lang.isNull(companyPageInfo.pageTitle) &&
             !YAHOO.lang.isUndefined(companyPageInfo.pageTitle))
         {
             params += "&page_title=" + encodeURIComponent(companyPageInfo.pageTitle);
         }
         if( !YAHOO.lang.isNull(companyPageInfo.headline1) &&
             !YAHOO.lang.isUndefined(companyPageInfo.headline1))
         {
             params += "&headline1=" + encodeURIComponent(companyPageInfo.headline1);
         }
         if( !YAHOO.lang.isNull(companyPageInfo.text1) &&
             !YAHOO.lang.isUndefined(companyPageInfo.text1))
         {
             params += "&text1=" + encodeURIComponent(companyPageInfo.text1);
         }
         if( !YAHOO.lang.isNull(companyPageInfo.headline2) &&
             !YAHOO.lang.isUndefined(companyPageInfo.headline2))
         {
             params += "&headline2=" + encodeURIComponent(companyPageInfo.headline2);
         }
         if( !YAHOO.lang.isNull(companyPageInfo.text2) &&
             !YAHOO.lang.isUndefined(companyPageInfo.text2))
         {
             params += "&text2=" + encodeURIComponent(companyPageInfo.text2);
         }
         if( !YAHOO.lang.isNull(companyPageInfo.headline3) &&
             !YAHOO.lang.isUndefined(companyPageInfo.headline3))
         {
             params += "&headline3=" + encodeURIComponent(companyPageInfo.headline3);
         }
         if( !YAHOO.lang.isNull(companyPageInfo.text3) &&
             !YAHOO.lang.isUndefined(companyPageInfo.text3))
         {
             params += "&text3=" + encodeURIComponent(companyPageInfo.text3);
         }
         if( !YAHOO.lang.isNull(companyPageInfo.richText) &&
             !YAHOO.lang.isUndefined(companyPageInfo.richText))
         {
             params += "&rich_text=" + encodeURIComponent(companyPageInfo.richText);
         }
         if( !YAHOO.lang.isNull(companyPageInfo.status1) &&
                 !YAHOO.lang.isUndefined(companyPageInfo.status1))
         {
        	 params += "&status1=" + encodeURIComponent(companyPageInfo.status1);
         }
         if( !YAHOO.lang.isNull(companyPageInfo.status3) &&
        		 !YAHOO.lang.isUndefined(companyPageInfo.status3))
         {
        	 params += "&status3=" + encodeURIComponent(companyPageInfo.status3);
         }
         
         var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
         
         YAHOO.log('Preparing XHR, url=' + url + ', params=' + params, 'info', 'teamraiser_rest.js');
         YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
     },
     
     getCaptainsMessage: function(callback) {
         var params = "method=getCaptainsMessage&response_format=json";
         params += YAHOO.Convio.PC2.Utils.getNoAuthRequestParams();
         params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
         params += "&timestamp=" + new Date().getTime();
         
         var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl() + "?" + params;
         YAHOO.log('Preparing XHR, url=' + url, 'info', 'teamraiser_rest.js');
         YAHOO.Convio.PC2.Utils.asyncRequest('GET', url, callback);
     },
     
     getTeamCaptains: function(callback) {
         var params = "method=getTeamCaptains&response_format=json";
         params += YAHOO.Convio.PC2.Utils.getNoAuthRequestParams();
         params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
         
         var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl() + "?" + params;
         YAHOO.log('Preparing XHR, url=' + url, 'info', 'teamraiser_rest.js');
         YAHOO.Convio.PC2.Utils.asyncRequest('GET', url, callback);
     },
     
     updateCaptainsMessage: function(callback, message) {
         var params = "method=updateCaptainsMessage&response_format=json";
         params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
         params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
         params += "&captains_message=" + encodeURIComponent(message);
         
         var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
         YAHOO.log('Preparing XHR, url=' + url + ', params=' + params, 'info', 'teamraiser_rest.js');
         YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
     },
     
     getParticipantCenterWrapper: function(callback) {
         var params = "method=getParticipantCenterWrapper&response_format=json";
         params += YAHOO.Convio.PC2.Utils.getNoAuthRequestParams();
         params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
         
         var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl() + "?" + params;
         YAHOO.log('Preparing XHR, url=' + url, 'info', 'teamraiser_rest.js');
         YAHOO.Convio.PC2.Utils.asyncRequest('GET', url, callback);
     },
     
     getParticipantFBConnectInfo: function(callback) {
         var params = "method=getParticipantFBConnectInfo&response_format=json";
         params += YAHOO.Convio.PC2.Utils.getNoAuthRequestParams();
         params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
         
         var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl() + "?" + params;
         YAHOO.log('Preparing XHR, url=' + url, 'info', 'teamraiser_rest.js');
         YAHOO.Convio.PC2.Utils.asyncRequest('GET', url, callback);
     },     
     
     getOrganizationMessage: function(callback) {
    	 var params = "method=getOrganizationMessage&response_format=json";
    	 params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
    	 params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
    	 if (YAHOO.Convio.PC2.Config.getLocale() && YAHOO.Convio.PC2.Config.getLocale() != null && YAHOO.Convio.PC2.Config.getLocale() != '' && YAHOO.Convio.PC2.Config.isLocaleChanged()) {
         	params+= "&s_locale=" + encodeURIComponent(YAHOO.Convio.PC2.Config.getLocale());
         }

    	 var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl() + "?" + params;
         YAHOO.log('Preparing XHR, url=' + url + ', params=' + params, 'info', 'teamraiser_rest.js');
         YAHOO.Convio.PC2.Utils.asyncRequest('GET', url, callback);
     },
     
     getParticipantTopDonorsList: function(callback) {
    	 var params = "method=getTopDonors&response_format=json";
    	 params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
    	 params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
     	 params += "&timestamp=" + new Date().getTime();
    	 
    	 var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl() + "?" + params;
    	 YAHOO.log('Preparing XHR, url=' + url, 'info', 'teamraiser_rest.js');
    	 YAHOO.Convio.PC2.Utils.asyncRequest('GET', url, callback);
     },
     
     getTopTeamDonorsList: function(callback) {
    	 var params = "method=getTopTeamDonors&response_format=json";
    	 params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
    	 params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
    	 
    	 var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl() + "?" + params;
    	 YAHOO.log('Preparing XHR, url=' + url, 'info', 'teamraiser_rest.js');
    	 YAHOO.Convio.PC2.Utils.asyncRequest('GET', url, callback);
     },

     getRecentActivity: function(callback) {
         var params = "method=getRecentActivity&response_format=json";
    	 params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
    	 params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
    	 
    	 var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
    	 YAHOO.log('Preparing XHR, url=' + url, 'info', 'teamraiser_rest.js');
    	 YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
     },
     
     getRecentActivityParams: function() {
         var params = "method=getRecentActivity&response_format=json";
    	 params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
    	 params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
         
         YAHOO.log("Returning params=" + params, 'info', 'teamraiser_rest.js');
         return params;
     },

     getPersonalDonationByDay: function(callback) { 
    	 var params = "method=getPersonalDonationByDay&response_format=json";
    	 params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
    	 params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
    	 params += "&timestamp=" + new Date().getTime();
    	 var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl() + "?" + params;
    	 YAHOO.log('Preparing XHR, url=' + url, 'info', 'teamraiser_rest.js');
    	 YAHOO.Convio.PC2.Utils.asyncRequest('GET', url, callback);
     },
     
     getTeamDonationByDay: function(callback) { 
    	 var params = "method=getTeamDonationByDay&response_format=json";
    	 params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
    	 params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
    	 params += "&timestamp=" + new Date().getTime();
    	 
    	 var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl() + "?" + params;
    	 YAHOO.log('Preparing XHR, url=' + url, 'info', 'teamraiser_rest.js');
    	 YAHOO.Convio.PC2.Utils.asyncRequest('GET', url, callback);
     },
     
     getCompanyDonationByDay: function(callback) { 
    	 var params = "method=getCompanyDonationByDay&response_format=json";
    	 params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
    	 params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
    	 params += "&timestamp=" + new Date().getTime();
    	 
    	 var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl() + "?" + params;
    	 YAHOO.log('Preparing XHR, url=' + url, 'info', 'teamraiser_rest.js');
    	 YAHOO.Convio.PC2.Utils.asyncRequest('GET', url, callback);
     },
     
     getParticipantProgress: function(callback) {
         var params = "method=getParticipantProgress&response_format=json";
         params += YAHOO.Convio.PC2.Utils.getNoAuthRequestParams();
         params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
         
         params += "&timestamp=" + new Date().getTime();
         
         var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl() + "?" + params;
         YAHOO.log('Preparing XHR, url=' + url, 'info', 'teamraiser_rest.js');
         YAHOO.Convio.PC2.Utils.asyncRequest('GET', url, callback);
     },
     
     getEventDataParameter: function(callback, edpName, edpType) {
    	 var params = "method=getEventDataParameter&response_format=json";
    	 params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
    	 params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
    	 params += "&edp_type=" + edpType;
    	 params += "&edp_name=" + edpName;

    	 var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl() + "?" + params;
    	 YAHOO.log('Preparing XHR, url=' + url, 'info', 'teamraiser_rest.js');
    	 YAHOO.Convio.PC2.Utils.asyncRequest('GET', url, callback);
     },
     
     getTeamraiserConfig: function(callback) {
         var key = "teamraiserConfig"
         var store = YAHOO.Convio.PC2.Utils.StorageEngine;
         if(store) {
             var resp = store.getItem(key);
             if(resp != null) {
                
                 YAHOO.log('Retrieved Teamraiser Config from session storage.','info','teamraiser_rest.js');
                 YAHOO.log('Response was: ' + resp, 'info', 'teamraiser_rest.js');
                 callback.success( {responseText: resp} );
                 return;
             }
        }
    	var params = "method=getTeamraiserConfig&response_format=json";
    	params += YAHOO.Convio.PC2.Utils.getNoAuthRequestParams();
    	params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
    	params += "&include_download_url=true";
    	params += "&timestamp=" + new Date().getTime();
    	
    	var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl() + "?" + params;
        YAHOO.log('Preparing XHR, url=' + url, 'info', 'teamraiser_rest.js');
        YAHOO.Convio.PC2.Utils.asyncRequest('GET', url, callback);
    },
     
    sendMessage: function(callback, message) {
    	 var params = "method=sendTafMessage&response_format=json";
    	 params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
    	 params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
    	 
    	 params += "&taf_id=" + encodeURIComponent(message.messageId);
    	 params += "&subject=" + encodeURIComponent(message.subject);
    	 params += "&message_body=" + encodeURIComponent(message.body);
    	 params += "&recipients=" + encodeURIComponent(message.recipients);
    	 params += "&layout_id=" + encodeURIComponent(message.layoutId);
    	 params += "&prepend_salutation=" + encodeURIComponent(message.prepend_salutation);

    	 var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
       	 YAHOO.log('Preparing XHR, url=' + url + ', params=' + params, 'info', 'teamraiser_rest.js');
       	 YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
     },
     
     previewMessage: function(callback, message) {
    	 var params = "method=previewMessage&response_format=json";
    	 params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
    	 params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
    	 
    	 params += "&taf_id=" + encodeURIComponent(message.messageId);
    	 params += "&subject=" + encodeURIComponent(message.subject);
    	 params += "&message_body=" + encodeURIComponent(message.body);
    	 params += "&layout_id=" + encodeURIComponent(message.layoutId);
    	 params += "&prepend_salutation=" + encodeURIComponent(message.prepend_salutation);

    	 var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
       	 YAHOO.log('Preparing XHR, url=' + url, 'info', 'teamraiser_rest.js');
       	 YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
     },
     
     getMessageLayouts: function(callback) {
    	 var params = "method=getMessageLayouts&response_format=json";
    	 params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
    	 params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();

    	 var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl() + "?" + params;
    	 YAHOO.log('Preparing XHR, url=' + url, 'info', 'teamraiser_rest.js');
    	 YAHOO.Convio.PC2.Utils.asyncRequest('GET', url, callback);
     },
     
     getSuggestedMessages: function(callback) {
    	 var params = "method=getSuggestedMessages&response_format=json";
    	 params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
    	 params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();

    	 var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl() + "?" + params;
    	 YAHOO.log('Preparing XHR, url=' + url, 'info', 'teamraiser_rest.js');
    	 YAHOO.Convio.PC2.Utils.asyncRequest('GET', url, callback);
     },
     
     getSuggestedMessage: function(callback, messageId) {
    	 var params = "method=getSuggestedMessage&response_format=json";
    	 params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
    	 params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
    	 params += "&message_id=" + messageId;

    	 var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl() + "?" + params;
    	 YAHOO.log('Preparing XHR, url=' + url, 'info', 'teamraiser_rest.js');
    	 YAHOO.Convio.PC2.Utils.asyncRequest('GET', url, callback);
     },
     getDraft: function(callback, messageId) {
    	 var params = "method=getDraft&response_format=json";
    	 params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
    	 params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
    	 params += "&message_id=" + messageId;
    	 params += "&timestamp=" + new Date().getTime();

    	 var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl() + "?" + params;
    	 YAHOO.log('Preparing XHR, url=' + url, 'info', 'teamraiser_rest.js');
    	 YAHOO.Convio.PC2.Utils.asyncRequest('GET', url, callback);
     },
     getDrafts: function(callback) {
    	 var params = "method=getDrafts&response_format=json";
    	 params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
    	 params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();

    	 var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl() + "?" + params;
    	 YAHOO.log('Preparing XHR, url=' + url, 'info', 'teamraiser_rest.js');
    	 YAHOO.Convio.PC2.Utils.asyncRequest('GET', url, callback);
     },
     deleteDraft: function(callback, id) {
    	 var params = "method=deleteDraft&response_format=json";
    	 params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
    	 params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
    	 params += "&message_id=" + id;

    	 var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
    	 YAHOO.log('Preparing XHR, url=' + url, 'info', 'teamraiser_rest.js');
    	 YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
     },
     updateDraft: function(callback, messageInfo) {
    	 var params = "method=updateDraft&response_format=json";
    	 params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
    	 params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
    	 params += "&message_id=" + encodeURIComponent(messageInfo.messageId);
    	 params += "&subject=" + encodeURIComponent(messageInfo.subject);
    	 params += "&message_body=" + encodeURIComponent(messageInfo.body);
    	 params += "&message_name=" + encodeURIComponent(messageInfo.name);
    	 params += "&recipients=" + encodeURIComponent(messageInfo.recipients);
    	 params += "&layout_id=" + encodeURIComponent(messageInfo.layoutId);
    	 params += "&prepend_salutation=" + encodeURIComponent(messageInfo.prepend_salutation);

    	 var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
    	 YAHOO.log('Preparing XHR, url=' + url, 'info', 'teamraiser_rest.js');
    	 YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
     },
     addDraft: function(callback, messageInfo) {
    	 var params = "method=addDraft&response_format=json";
    	 params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
    	 params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
    	 params += "&subject=" + encodeURIComponent(messageInfo.subject);
    	 params += "&message_body=" + encodeURIComponent(messageInfo.body);
    	 params += "&message_name=" + encodeURIComponent(messageInfo.name);
    	 params += "&recipients=" + encodeURIComponent(messageInfo.recipients);
    	 params += "&layout_id=" + encodeURIComponent(messageInfo.layoutId);
    	 params += "&message_id=" + encodeURIComponent(messageInfo.messageId);
    	 params += "&prepend_salutation=" + encodeURIComponent(messageInfo.prepend_salutation);
    	 params += "&save_template=" + encodeURIComponent(messageInfo.save_template);

    	 var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
    	 YAHOO.log('Preparing XHR, url=' + url, 'info', 'teamraiser_rest.js');
    	 YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
     },
     getSentMessage: function(callback, messageId) {
    	 var params = "method=getSentMessage&response_format=json";
    	 params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
    	 params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
    	 params += "&message_id=" + messageId;

    	 var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl() + "?" + params;
    	 YAHOO.log('Preparing XHR, url=' + url, 'info', 'teamraiser_rest.js');
    	 YAHOO.Convio.PC2.Utils.asyncRequest('GET', url, callback);
     },
     deleteSentMessage: function(callback, messageId) {
    	 var params = "method=deleteSentMessage&response_format=json";
    	 params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
    	 params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
    	 params += "&message_id=" + messageId;

    	 var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
    	 YAHOO.log('Preparing XHR, url=' + url + ", params=" + params, 'info', 'teamraiser_rest.js');
    	 YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
     },
     getTeamRoster: function(callback, teamId) {
    	 getTeamRoster(callback, teamId, false, false);
     },
     getTeamRoster: function(callback, teamId, positiveOnly, includeDownloadUrl) {
    	 var params = "method=getTeamRoster&response_format=json&list_page_size=500";
    	 params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
    	 params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
    	 params += "&team_id=" + teamId;
    	 if(positiveOnly) {
    		 params += "&positive_amount_only=true"
    	 }
    	 if(includeDownloadUrl) {
    		 params += "&include_download_url=true";
    	 }
    	 params += "&timestamp=" + new Date().getTime();
    	 var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl() + "?" + params;
    	 YAHOO.log('Preparing XHR, url=' + url + ", params=" + params, 'info', 'teamraiser_rest.js');
    	 YAHOO.Convio.PC2.Utils.asyncRequest('GET', url, callback);
     },
     getCompanyTeams: function(callback, positiveOnly, includeDownloadUrl) {
    	 var params = "method=getCompanyTeams&response_format=json";
    	 params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
    	 params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
    	 if(positiveOnly) {
    		 params += "&positive_amount_only=true"
    	 }
    	 if(includeDownloadUrl) {
    		 params += "&include_download_url=true";
    	 }

    	 var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl() + "?" + params;
    	 YAHOO.log('Preparing XHR, url=' + url + ", params=" + params, 'info', 'teamraiser_rest.js');
    	 YAHOO.Convio.PC2.Utils.asyncRequest('GET', url, callback);
     },
     /**
      * captains parameter must be an array
      */
     setTeamCaptains: function(callback, captains) {
         var params = "method=setTeamCaptains&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
        var captainsStr = "";
        var first = true;
        for(var i=0; i < captains.length; i++) {
            if(first) {
                first = false;
            } else {
                captainsStr += ",";
            }
            captainsStr += captains[i];
        }
        params += "&captains=" + captainsStr; 
        
        var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
    	YAHOO.log('Preparing XHR, url=' + url, 'info', 'teamraiser_rest.js');
    	YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
     },
     getTeamMembers: function(callback) {
    	 var params = "method=getTeamMembers&response_format=json";
    	 params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
    	 params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
  
    	 var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl() + "?" + params;
    	 YAHOO.log('Preparing XHR, url=' + url + ", params=" + params, 'info', 'teamraiser_rest.js');
    	 YAHOO.Convio.PC2.Utils.asyncRequest('GET', url, callback);
     },
     
     getAddressBookContactsParams: function(listCriteria) {
        var params = "method=getTeamraiserAddressBookContacts&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += YAHOO.Convio.PC2.Utils.getListCriteriaParams(listCriteria);
        params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
        if(listCriteria != null && listCriteria.tr_ab_filter) {
            params += "&tr_ab_filter=" + listCriteria.tr_ab_filter;
        }
        
        YAHOO.log("Returning params=" + params, 'info', 'address_book_rest.js');
        return params;
    },
    getAddressBookContact: function(callback, contactId) {
    	 var params = "method=getTeamraiserAddressBookContact&response_format=json";
    	 params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
    	 params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
    	 params += "&contact_id=" + encodeURIComponent(contactId);

    	 var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl() + "?" + params;
    	 YAHOO.log('Preparing XHR, url=' + url, 'info', 'teamraiser_rest.js');
    	 YAHOO.Convio.PC2.Utils.asyncRequest('GET', url, callback);
    },
    getAddressBookFilters: function(callback, countContacts) {
         var params = YAHOO.Convio.PC2.Teamraiser.getAddressBookFiltersParams(countContacts);
         
         var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl() + "?" + params;
         YAHOO.log('Preparing XHR, url=' + url, 'info', 'teamraiser_rest.js');
         YAHOO.Convio.PC2.Utils.asyncRequest('GET', url, callback);
    },
    getAddressBookFiltersParams: function(countContacts) {
        var params = "method=getTeamraiserAddressBookFilters&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getNoAuthRequestParams();
        params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
		params += "&include_past_teammates_filters=true";
		params += "&include_returning_team_filters=true";
        if(countContacts) {
        	params += "&count_contacts=true"
        }
        return params;
   },
    getAddressBookGroupContacts: function(callback, groupId) {
    	var params = "method=getTeamraiserAddressBookGroupContacts&response_format=json";
    	params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
    	params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
    	params += "&group_ids=" + YAHOO.Convio.PC2.Utils.encodeMultipleIds(groupId);

    	var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl() + "?" + params;
    	YAHOO.log('Preparing XHR, url=' + url, 'info', 'teamraiser_rest.js');
    	YAHOO.Convio.PC2.Utils.asyncRequest('GET', url, callback);
    },
    getAddressBookContactsByIds: function(callback, contactIds) {
    	var params = "method=getTeamraiserAddressBookContactsByIds&response_format=json";
    	params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
    	params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
    	params += "&contact_ids=" + contactIds;

    	var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl() + "?" + params;
    	YAHOO.log('Preparing XHR, url=' + url, 'info', 'teamraiser_rest.js');
    	YAHOO.Convio.PC2.Utils.asyncRequest('GET', url, callback);
    },
    
    removeAddressBookContacts: function(callback, contactIds) {        
        var params = "method=deleteTeamraiserAddressBookContacts&response_format=json";
    	params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        
        /* Contacts */
        params += "&contact_ids=";
        params += YAHOO.Convio.PC2.Utils.encodeMultipleIds(contactIds);
        
        var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
        
        YAHOO.log('Preparing XHR, url=' + url + ', params=' + params, 'info', 'teamraiser_rest.js');
        YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
    },
    
    getContactActivity: function(callback, contactId) {
        var params = "method=getContactActivity&response_format=json";
    	params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
    	params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
    	params += "&contact_id=" + contactId;

    	var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl() + "?" + params;
    	YAHOO.log('Preparing XHR, url=' + url, 'info', 'teamraiser_rest.js');
    	YAHOO.Convio.PC2.Utils.asyncRequest('GET', url, callback);
    },

    getContactActivityParams: function(contactId) {
        var params = "method=getContactActivity&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
        params += "&contact_id=" + contactId;

        YAHOO.log("Returning params=" + params, 'info', 'teamraiser_rest.js');
        return params;
    },
    
    uploadPersonalPhoto: function(callback, formName, captionParam) {
    	//tells Connection Manager this is a file upload form
        YAHOO.util.Connect.setForm(formName, true);
    	var params = "method=uploadPersonalPhoto&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
        
        var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
        YAHOO.log('Preparing XHR, url=' + url + ',params=' + params, 'info', 'teamraiser_rest.js');
        YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
    },
    
    removePersonalPhoto: function(callback, formName) {
    	YAHOO.util.Connect.setForm(formName, true);
    	var params = "method=removePersonalPhoto&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
        
        var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
        YAHOO.log('Preparing XHR, url=' + url + ',params=' + params, 'info', 'teamraiser_rest.js');
        YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
    },
    
    updatePersonalVideoUrl: function(callback, videoUrl) {
        var params = "method=updatePersonalVideoUrl&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
        params += "&video_url=" + encodeURIComponent(videoUrl);
        
        var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
        YAHOO.log('Preparing XHR, url=' + url + ',params=' + params, 'info', 'teamraiser_rest.js');
        YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
    },  

    updatePersonalMediaLayout: function(callback, personalMediaLayout) {
        var params = "method=updatePersonalMediaLayout&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
        params += "&personal_media_layout=" + personalMediaLayout;
        
        var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
        YAHOO.log('Preparing XHR, url=' + url + ',params=' + params, 'info', 'teamraiser_rest.js');
        YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
    },        
    
    getPersonalVideoUrl: function(callback) {
        var params = "method=getPersonalVideoUrl&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
        
        var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
        YAHOO.log('Preparing XHR, url=' + url, 'info', 'teamraiser_rest.js');
        YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
    }, 
    
    getPersonalMediaLayout: function(callback) {
        var params = "method=getPersonalMediaLayout&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
        
        var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
        YAHOO.log('Preparing XHR, url=' + url, 'info', 'teamraiser_rest.js');
        YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
    },     
    
    getPersonalPhotos: function(callback) {
    	var params = "method=getPersonalPhotos&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
        
        var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
    	YAHOO.log('Preparing XHR, url=' + url, 'info', 'teamraiser_rest.js');
    	YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
    },
    
    uploadTeamPhoto: function(callback, formName, caption) {
    	//tells Connection Manager this is a file upload form
        YAHOO.util.Connect.setForm(formName, true);
        var params = "method=uploadTeamPhoto&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
        params += "&graphic_caption=" + encodeURIComponent(caption);
        
        var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
        YAHOO.log('Preparing XHR, url=' + url + ',params=' + params, 'info', 'teamraiser_rest.js');
        YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
    },
    
    removeTeamPhoto: function(callback, formName) {
    	YAHOO.util.Connect.setForm(formName, true);
    	var params = "method=removeTeamPhoto&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
        
        var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
        YAHOO.log('Preparing XHR, url=' + url + ',params=' + params, 'info', 'teamraiser_rest.js');
        YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
    },
    
    getTeamPhoto: function(callback) {
    	var params = "method=getTeamPhoto&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
        
        var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
    	YAHOO.log('Preparing XHR, url=' + url, 'info', 'teamraiser_rest.js');
    	YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
    },
    
    uploadCompanyPhoto: function(callback, formName, caption) {
    	//tells Connection Manager this is a file upload form
        YAHOO.util.Connect.setForm(formName, true);
        var params = "method=uploadCompanyPhoto&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
        params += "&photo1_text=" + encodeURIComponent(caption);
        
        var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
        YAHOO.log('Preparing XHR, url=' + url + ',params=' + params, 'info', 'teamraiser_rest.js');
        YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
    },
    
    removeCompanyPhoto: function(callback, formName) {
    	YAHOO.util.Connect.setForm(formName, true);
    	var params = "method=removeCompanyPhoto&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
        
        var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
        YAHOO.log('Preparing XHR, url=' + url + ',params=' + params, 'info', 'teamraiser_rest.js');
        YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
    },
    
    getCompanyPhoto: function(callback) {
    	var params = "method=getCompanyPhoto&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
        
        var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
    	YAHOO.log("Preparing XHR, url=" + url + ", params=" + params, "info", "teamraiser_rest.js");
    	YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
    },
    
    getSurveyResponses: function(callback) {
    	var params = "method=getSurveyResponses&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
        params += "&use_filters=true";
        params += "&timestamp=" + new Date().getTime();
        
        var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
        
    	YAHOO.log("Preparing XHR, url=" + url + ", params=" + params, "info", "teamraiser_rest.js");
    	YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
    },
    
    getTeamraiserSuggestion: function(callback) {
        var params = "method=getTeamraiserSuggestion&response_format=json";
         params += YAHOO.Convio.PC2.Utils.getNoAuthRequestParams();
         params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
         params += "&timestamp=" + new Date().getTime();
         params += "&show_all_suggestions=true";
         
         var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl() + "?" + params;
         YAHOO.log('Preparing XHR, url=' + url, 'info', 'teamraiser_rest.js');
         YAHOO.Convio.PC2.Utils.asyncRequest('GET', url, callback);
    },
    
    getCompanyList: function(callback) {
        var params = "method=getCompanyList&response_format=json";
         params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
         params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
         params += "&timestamp=" + new Date().getTime();
         
         var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl() + "?" + params;
         YAHOO.log('Preparing XHR, url=' + url, 'info', 'teamraiser_rest.js');
         YAHOO.Convio.PC2.Utils.asyncRequest('GET', url, callback);
    },
    
    updateTeamInformation: function(callback, teamInfo) {
        var params = "method=updateTeamInformation&response_format=json";
         params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
         params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
         if(YAHOO.lang.isUndefined(teamInfo.teamName) == false) {
        	 params += "&team_name=" + encodeURIComponent(teamInfo.teamName);
         }
         if(YAHOO.lang.isUndefined(teamInfo.companyId) == false) {
        	 params += "&company_id=" + teamInfo.companyId;
         }
         if(YAHOO.lang.isUndefined(teamInfo.companyName) == false) {
        	 params += "&company_name=" + encodeURIComponent(teamInfo.companyName);
         }
         if(YAHOO.lang.isUndefined(teamInfo.teamGoal) == false) {
        	 params += "&team_goal=" + encodeURIComponent(teamInfo.teamGoal);
         }
         if(YAHOO.lang.isUndefined(teamInfo.password) == false) {
        	 params += "&password=" + encodeURIComponent(teamInfo.password);
         }
         if(YAHOO.lang.isUndefined(teamInfo.division) == false) {
        	 params += "&division_name=" + encodeURIComponent(teamInfo.division);
         }
         if(YAHOO.lang.isUndefined(teamInfo.recruitingGoal) == false) {
        	 params += "&recruiting_goal=" + encodeURIComponent(teamInfo.recruitingGoal);
         }
         
         var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();;
         YAHOO.log('Preparing XHR, url=' + url, 'info', 'teamraiser_rest.js');
         YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
    },
    
    updateAddressBookContact: function(callback, contact) {        
        var params = "method=updateTeamraiserAddressBookContact&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
        /* Contact */
        params += "&first_name=" + encodeURIComponent(contact.firstName);
        params += "&last_name=" + encodeURIComponent(contact.lastName);
        params += "&email=" + encodeURIComponent(contact.email);
        params += "&contact_id=" + encodeURIComponent(contact.contactId);
        
        if(contact.street1) {
            params += "&street1=" + encodeURIComponent(contact.street1);
        }
        if(contact.street2) {
            params += "&street2=" + encodeURIComponent(contact.street2);
        }
        if(contact.street3) {
            params += "&street3=" + encodeURIComponent(contact.street3);
        }
        if(contact.city) {
            params += "&city=" + encodeURIComponent(contact.city);
        }
        if(contact.state) {
            params += "&state=" + encodeURIComponent(contact.state);
        }
        if(contact.county) {
            params += "&county=" + encodeURIComponent(contact.county);
        }
        if(contact.zip) {
            params += "&zip=" + encodeURIComponent(contact.zip);
        }
        if(contact.country) {
            params += "&country=" + encodeURIComponent(contact.country);
        }
        if(contact.phone) {
            params += "&phone=" + encodeURIComponent(contact.phone);
        }
        
        var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
        
        YAHOO.log('Preparing XHR, url=' + url + ', params=' + params, 'info', 'teamraiser_rest.js');
        YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
    },
    
    updatePersonalPagePrivacy: function(callback, isPrivate) {
    	var params = "method=updatePersonalPagePrivacy&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
        params += "&is_private=";
        if(isPrivate) {
        	params += "true";
        } else {
        	params += "false";
        }
        var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
        
        YAHOO.log('Preparing XHR, url=' + url + ', params=' + params, 'info', 'teamraiser_rest.js');
        YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
    },
    
    updateTeamPagePrivacy: function(callback, isPrivate) {
    	var params = "method=updateTeamPagePrivacy&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
        params += "&is_private=";
        if(isPrivate) {
        	params += "true";
        } else {
        	params += "false";
        }
        var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
        
        YAHOO.log('Preparing XHR, url=' + url + ', params=' + params, 'info', 'teamraiser_rest.js');
        YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
    },
    
    updateCompanyPagePrivacy: function(callback, isPrivate) {
    	var params = "method=updateCompanyPagePrivacy&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
        params += "&is_private=";
        if(isPrivate) {
        	params += "true";
        } else {
        	params += "false";
        }
        var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
        
        YAHOO.log('Preparing XHR, url=' + url + ', params=' + params, 'info', 'teamraiser_rest.js');
        YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
    },
    
    updateSurveyResponses: function(callback, responses) {
        var params = "method=updateSurveyResponses&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
        params += "&require_response=true";
        
        var responseArray = YAHOO.Convio.PC2.Utils.ensureArray(responses);
        for(var i=0; i < responseArray.length; i++) {
            params += "&question_" + responseArray[i].questionId + "=";
            params += encodeURIComponent(responseArray[i].value);
        }
        
        var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
        
        YAHOO.log('Preparing XHR, url=' + url + ', params=' + params, 'info', 'teamraiser_rest.js');
        YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
    },
    
    updateTentingStatus: function(callback, updateInfo) {
    	var params = "method=updateTentingStatus&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
        params += "&update_type=" + encodeURIComponent(updateInfo.updateType);
        if(updateInfo.message) {
        	params += "&message=" + encodeURIComponent(updateInfo.message);
        }
        if(updateInfo.tentmateId) {
        	params += "&tentmate_id=" + encodeURIComponent(updateInfo.tentmateId);
        }
        
        var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
        
        YAHOO.log('Preparing XHR, url=' + url + ', params=' + params, 'info', 'teamraiser_rest.js');
        YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
    },
    
    getTentingSearchParams: function(listCriteria) {
        var params = "method=getTentingSearch&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += YAHOO.Convio.PC2.Utils.getListCriteriaParams(listCriteria);
        params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
        
        if(listCriteria != null) {
            
            if(YAHOO.Convio.PC2.Utils.hasValue(listCriteria.firstName)) {
                params += "&search_first_name=" + encodeURIComponent(listCriteria.firstName);
            }
            
            if(YAHOO.Convio.PC2.Utils.hasValue(listCriteria.lastName)) {
                params += "&search_last_name=" + encodeURIComponent(listCriteria.lastName);
            }
            
            if(YAHOO.Convio.PC2.Utils.hasValue(listCriteria.email)) {
                params += "&search_email=" + encodeURIComponent(listCriteria.email);
            }
            
            if(YAHOO.Convio.PC2.Utils.hasValue(listCriteria.firstName)) {
                params += "&search_race_number=" + encodeURIComponent(listCriteria.raceNumber);
            }
        }
        
        YAHOO.log("Returning params=" + params, 'info', 'address_book_rest.js');
        return params;
    },
    
    getTentmate: function(callback) {
    	var params = "method=getTentmate&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
        
        var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl() + "?" + params;
        
    	YAHOO.log("Preparing XHR, url=" + url, "info", "teamraiser_rest.js");
    	YAHOO.Convio.PC2.Utils.asyncRequest('GET', url, callback);
    },
    
    /* 
     * Retrieves a gift categories object
     */
    getGiftCategories: function(callback) {
        var params = "method=getGiftCategories&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
        
        var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl() + "?" + params;
        
        YAHOO.log('Preparing XHR, url=' + url, 'info', 'teamraiser_rest.js');
        YAHOO.Convio.PC2.Utils.asyncRequest('GET', url, callback);
    },
    
    getTeamDivisions: function(callback) {
    	var params = "method=getTeamDivisions&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
        
        var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl() + "?" + params;
        
        YAHOO.log('Preparing XHR, url=' + url, 'info', 'teamraiser_rest.js');
        YAHOO.Convio.PC2.Utils.asyncRequest('GET', url, callback);
    },

    getTeamDivisionsMultiLocale: function(callback) {
        var params = "method=getTeamDivisionsMultiLocale&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();

        var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl() + "?" + params;

        YAHOO.log('Preparing XHR, url=' + url, 'info', 'teamraiser_rest.js');
        YAHOO.Convio.PC2.Utils.asyncRequest('GET', url, callback);
    },
    
    acknowledgeGiftResult: function(callback, contactId) {
     	var params = "method=acknowledgeGifts&response_format=json";
     	params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
        params += "&contact_id=" + encodeURIComponent(contactId);
     	
     	var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
     	
     	YAHOO.log('Preparing XHR, url=' + url + ', params=' + params, 'info,', 'teamraiser_rest.js');
     	YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
     },
     
     getAdminNewsfeedContent: function(callback, contentCriteria) {
    	 var params = "method=getNewsFeeds&response_format=json";
    	 params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
    	 params += "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
    	 if(contentCriteria != null) {
    		 params += "&feed_count=" + encodeURIComponent(contentCriteria.feed_count);
    		 params += "&item_id=" + encodeURIComponent(contentCriteria.itemId);
    		 params += "&list_sort_column=" + encodeURIComponent(contentCriteria.sort_order);
    		 params += "&last_pc2_login=" + encodeURIComponent(contentCriteria.lastPC2Login);
    	 }
    	 
    	 var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl();
    	 
    	 YAHOO.log('Preparing XHR, url=' + url + ', params=' + params, 'info', 'teamraiser_rest.js');
    	 YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
     }
};
