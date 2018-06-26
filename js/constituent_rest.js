/* constituent_rest.js
 * Copyright 2008, Convio
 *
 * Provides Convio Constituent ReST call functionality.
 * 
 * Depends on:
 * YUI Core, Cookies, Connection
 * convio_config.js
 * convio_utils.js
 *
 */
YAHOO.Convio.PC2.Constituent = {
    
    getUser: function(callback) {
        var key = "constituent";
        
        var params = "method=getUser&response_format=json";
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        /* cons_id doesn't work for non-administrative users
        if(consId) {
            params += "&cons_id=" + consId;
        }*/
        
        var url = YAHOO.Convio.PC2.Config.Constituent.getUrl();
        
        YAHOO.log('Preparing XHR, url=' + url + ', params=' + params, 'info', 'constituent_rest.js');
        YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, callback, params);
    },
    
    logShare: function(userID, provider, callback) {
        var urlBase = YAHOO.Convio.PC2.Config.Constituent.getUrl();
        var params = 'method=logSocialShare&response_format=json';
        params += YAHOO.Convio.PC2.Utils.getCommonRequestParams();
        params += '&social_uid=' + encodeURIComponent(userID);
        params += '&social_site=' + provider;
        params += '&share_url=' + encodeURIComponent(window.location.href);
        if(YAHOO.Convio.PC2.Data.shareId != null) {
            params += '&share_id=' + encodeURIComponent(YAHOO.Convio.PC2.Data.shareId);
        } else {
            params += '&share_id=' + encodeURIComponent('TR-' + YAHOO.Convio.PC2.Config.Teamraiser.getFrId());
        }
        
        var sep = (urlBase.indexOf('?') > -1 ? '&' : '?');
        YAHOO.Convio.PC2.Utils.asyncRequest('GET', urlBase + sep + params, callback);
    }
};
