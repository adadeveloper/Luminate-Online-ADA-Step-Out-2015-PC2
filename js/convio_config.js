/* convio_config.js
 * Copyright 2008, Convio
 *
 * Provides Convio common configuration functionality.
 * 
 * Depends on:
 * YUI Core, Cookies
 *
 */
YAHOO.namespace("Convio.PC2");
YAHOO.namespace("Convio.PC2.Component");

YAHOO.namespace("Convio.PC2.Config.AddressBook");
YAHOO.namespace("Convio.PC2.Config.Constituent");
YAHOO.namespace("Convio.PC2.Config.Content");
YAHOO.namespace("Convio.PC2.Config.Progress");
YAHOO.namespace("Convio.PC2.Config.Teamraiser");

YAHOO.namespace("Convio.PC2.AddressBook");
YAHOO.namespace("Convio.PC2.AddressBookImport");
YAHOO.namespace("Convio.PC2.Constituent");
YAHOO.namespace("Convio.PC2.Content");
YAHOO.namespace("Convio.PC2.GoogleChart");
YAHOO.namespace("Convio.PC2.Teamraiser");
YAHOO.namespace("Convio.PC2.Component.Teamraiser");
YAHOO.namespace("Convio.PC2.Data");

YAHOO.namespace("Convio.PC2.Facebook.Connect");


YAHOO.Convio.PC2.Config = {
    
    isStorageEnabled: function() {
        var enabled = YAHOO.util.Cookie.get("storageEnabled");
        return enabled == "true";
    },
    
    disableStorage: function() {
        // Disable attempting to use storage for the rest of the session.
        YAHOO.util.Cookie.set("storageEnabled","false", {path: "/"} );
        YAHOO.log("Storage disabled for session.","info","convio_config.js");
    },
        
    isStorageClean: function() {
        var clean = YAHOO.util.Cookie.get("storageClean");
        return clean == "true";
    },
    
    markStorageClean: function() {
        YAHOO.util.Cookie.set("storageClean","true", {path: "/"} );
    },
    
    getAuth: function() {
        return YAHOO.util.Cookie.get("auth");
    },
    
    getApiKey: function() {
        return YAHOO.util.Cookie.get("apiKey");
    },
    
    getBaseUrl: function() {
        return YAHOO.util.Cookie.get("baseUrl");
    },
    
    getSecurePath: function() {
        return YAHOO.util.Cookie.get("securePath");
    },
    
    getTimeoutWarning: function() {
        var timeoutWarning = YAHOO.util.Cookie.get("timeoutWarning");
        
        if (!timeoutWarning || timeoutWarning === null) {
        	timeoutWarning = 900 * 1000; // default to 15 minutes
        }
        
        return timeoutWarning;
    },
    
    getTimeoutExpiration: function() {
        var timeoutExpiration = YAHOO.util.Cookie.get("timeoutExpiration");
        
        if (!timeoutExpiration || timeoutExpiration === null) {
        	timeoutExpiration = 1200 * 1000; // default to 20 minutes
        }
        
        return timeoutExpiration;
    },
    
    getSessionKey: function() {
        return YAHOO.util.Cookie.get("sessionKey");
    },
    
    getProgressImageId: function() {
    	return YAHOO.util.Cookie.get("progressImageId");
   	},
    
    getSessionId: function() {
        var key = YAHOO.Convio.PC2.Config.getSessionKey();
        return YAHOO.util.Cookie.get(key);
    },
    
    getVersion: function() {
        return '1.0';
    },
    
    getMceVersionString: function() {
        return YAHOO.util.Cookie.get("mceVersionString");
    },
    
    getGigyaAPIKey: function()
    {
       	return YAHOO.util.Cookie.get("gigyaAPIKey");
    },
    
    getCurrencyLocale: function(){
    	var currencyLocale = YAHOO.util.Cookie.get("currency_locale");
    	
        if (!currencyLocale || currencyLocale === null || currencyLocale === 'null' || currencyLocale === '') {
        	// currency locale is not well defined
           return this.getLocale();
        }
        else if (currencyLocale === "USER") {
        	// follow the user's locale
            return this.getLocale();
        }
        else {
        	// use the currency-specific locale
        	return currencyLocale;
        }
    },

    getLocale: function(){
        return YAHOO.util.Cookie.get("locale");
    },
    
    setLocale: function(newLocaleValue) {
    	
    	// set the new locale value
    	if (newLocaleValue && newLocaleValue != null) {
    		YAHOO.util.Cookie.set('locale', newLocaleValue, {path: '/'});
    	}
    	
    	// return the new locale value
        return this.getLocale();
    },
    
    isLoggingEnabled: function() {
        var debugEnabled = YAHOO.util.Cookie.get("debug");
        return debugEnabled == "true";
    },
    
    setLocaleChanged: function(changed)
    {
    	return YAHOO.util.Cookie.set('localeChanged', changed);
    },

    isLocaleChanged: function()
    {
    	return YAHOO.util.Cookie.get('localeChanged') == "true";        
    },

    isPcCookieLoginEnabled: function()
    {
        return YAHOO.util.Cookie.get("pcCookieLoginEnabled");
    },

    getLoginCookie: function()
    {
        return YAHOO.util.Cookie.get("CV_LOGIN_");
    },
    
    /**
     * @return true if we have valid config details needed to load a PC2 page: base URL & fr_id 
     */
    isValid: function() {
    	return  !YAHOO.lang.isNull(YAHOO.Convio.PC2.Config.getBaseUrl()) && 
        !YAHOO.lang.isUndefined(YAHOO.Convio.PC2.Config.getBaseUrl()) &&
        !YAHOO.lang.isNull(YAHOO.Convio.PC2.Config.Teamraiser.getFrId()) && 
        !YAHOO.lang.isUndefined(YAHOO.Convio.PC2.Config.Teamraiser.getFrId())
    },
    
    redirectToHome: function() {
        if(YAHOO.Convio.PC2.Config.isValid()) 
        {
            var url = "../site/UserLogin?NEXTURL=" + escape(YAHOO.Convio.PC2.Config.getBaseUrl() + "TRSC?pg=center2&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId());
            
            if (YAHOO.Convio.PC2.Utils.isIFrameDetected()) {
            	window.parent.location.href = url;
            }
            else {
            	window.location.href = url;
            }
            
        } else {
            window.location.href='../site/PageServer';
        }
    },

    getUKLocale: function() {
    	return "en_GB";
    },

    getUSLocale_en: function() {
        return "en_US";
    },

    getUSLocale_es: function() {
        return "es_US";
    },

    isUSLocale: function() {
        return this.getUSLocale_en() == this.getLocale() || this.getUSLocale_es() == this.getLocale();
    },

    isUKLocale: function() {
    	return this.getUKLocale() == this.getLocale();
    }
};

YAHOO.Convio.PC2.Config.Teamraiser = {
    getFrId: function() {
        return YAHOO.util.Cookie.get("frId");
    },
    
    getUrl: function() {
        return YAHOO.Convio.PC2.Config.getBaseUrl() + "CRTeamraiserAPI";
    }
};

YAHOO.Convio.PC2.Config.AddressBook = {
    
    getUrl: function() {
        return YAHOO.Convio.PC2.Config.getBaseUrl() + "CRAddressBookAPI";
    }
};

YAHOO.Convio.PC2.Config.Content = {
    
    getUrl: function() {
        return YAHOO.Convio.PC2.Config.getBaseUrl() + "CRContentAPI";
    }
};


YAHOO.Convio.PC2.Config.Constituent = {
    
    getUrl: function() {
        return YAHOO.Convio.PC2.Config.getBaseUrl() + "CRConsAPI";
    }
};

YAHOO.Convio.PC2.Config.Progress = {
    
    getUrl: function() {
        return YAHOO.Convio.PC2.Config.getBaseUrl() + "DynImg";
    },
    
    getProgressImageId: function() {
        return YAHOO.Convio.PC2.Config.getProgressImageId();
    },
    
    getProgressUrl: function(percent) {
        var url = YAHOO.Convio.PC2.Config.Progress.getUrl();
        url += "?pi=" + YAHOO.Convio.PC2.Config.Progress.getProgressImageId();
        url += "&percent=" + percent;
        return url;
    }
};
