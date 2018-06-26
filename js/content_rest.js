/* content_rest.js
 * Copyright 2008, Convio
 *
 * Provides Convio Address Book ReST call functionality.
 * 
 * Depends on:
 * YUI Core, Cookies, Connection
 * convio_config.js
 * convio_utils.js
 *
 */
YAHOO.Convio.PC2.Content = {
    
    getMessageBundle: function(callback, keys, bundle) {
        var params = "method=getMessageBundle&response_format=json";
        if (YAHOO.Convio.PC2.Config.getLocale() && YAHOO.Convio.PC2.Config.getLocale() != null && YAHOO.Convio.PC2.Config.getLocale() != '' && YAHOO.Convio.PC2.Config.isLocaleChanged()) {
        	params+= "&s_locale=" + encodeURIComponent(YAHOO.Convio.PC2.Config.getLocale());
        }
        params += YAHOO.Convio.PC2.Utils.getNoAuthRequestParams();
        
        params += "&keys=";
        if(keys.length) {
            var first = true;
            for(var i=0, keysLength = keys.length; i < keysLength; i++) {
                if(!first) {
                    params += ",";
                } else {
                    first = false;
                }
                params += encodeURIComponent(keys[i]);
            }
        } else {
            params += encodeURIComponent(keys);
        }
        if(!YAHOO.lang.isNull(bundle) && 
            !YAHOO.lang.isUndefined(bundle))
        {
            params += "&bundle=" + encodeURIComponent(bundle);
        } else {
            params += "&bundle=friendraiser_pc";
        }
        
        var url = YAHOO.Convio.PC2.Config.Content.getUrl(); // + "?" + params;
        
        YAHOO.log('Preparing XHR, url=' + url, 'info', 'content_rest.js');
        // This method supports get
        YAHOO.util.Connect.asyncRequest('POST', url, callback, params);
    },
    
    renderSTag: function(callback, stag) {
  
        var params = "method=getTagInfo&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += "&content=" + encodeURIComponent(stag);
        
        var url = YAHOO.Convio.PC2.Config.Content.getUrl();
        
        YAHOO.log('Preparing XHR, url=' + url + ', params=' + params, 'info', 'content_rest.js');
        // This method supports get
        YAHOO.util.Connect.asyncRequest('POST', url, callback, params);        
        
    },
    
    listSupportedLocales: function(callback) {
    	  
        var params = "method=listSupportedLocales&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        
        var url = YAHOO.Convio.PC2.Config.Content.getUrl();
        
        YAHOO.log('Preparing XHR, url=' + url + ', params=' + params, 'info', 'content_rest.js');
        // This method supports get
        YAHOO.util.Connect.asyncRequest('POST', url, callback, params);        
        
    },
    
    listCountries: function(callback) {
  	  
        var params = "method=listCountries&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        
        var url = YAHOO.Convio.PC2.Config.Content.getUrl();
        
        YAHOO.log('Preparing XHR, url=' + url + ', params=' + params, 'info', 'content_rest.js');
        // This method supports get
        YAHOO.util.Connect.asyncRequest('POST', url, callback, params);        
        
    }
};
