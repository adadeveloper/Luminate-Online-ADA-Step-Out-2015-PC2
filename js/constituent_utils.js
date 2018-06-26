/* constituent_utils.js
 * Copyright 2008, Convio
 *
 * Provides Convio Constituent utility functionality.
 * 
 * Depends on:
 * YUI Core, Cookies, Connection
 * convio_config.js,
 * constituent_rest.js
 *
 */
YAHOO.Convio.PC2.Component.Constituent = {
    loadUserCallback: {
        success: function(o) {
            YAHOO.namespace("YAHOO.Convio.PC2.Component.Constituent.User");
            YAHOO.Convio.PC2.Component.Constituent.User = YAHOO.lang.JSON.parse(o.responseText).getConsResponse;
            
            YAHOO.Convio.PC2.Data.User = YAHOO.Convio.PC2.Component.Constituent.User;
            
            if(YAHOO.Convio.PC2.Component.Constituent.Name) {
                var nameElm = YAHOO.util.Dom.get(YAHOO.Convio.PC2.Component.Constituent.Name);
                nameElm.innerHTML = YAHOO.Convio.PC2.Data.User.name.first + ' ' + YAHOO.Convio.PC2.Data.User.name.last;
            }
            
            // Do last callback method
            if(YAHOO.Convio.PC2.Component.Constituent.initalizationDone) {
                YAHOO.Convio.PC2.Component.Constituent.initalizationDone();
            }
            // Log sucess
            YAHOO.log('loadUser success', 'info', 'constituent_utils.js');
            
            // Fire the event
            YAHOO.Convio.PC2.Utils.publisher.fire("pc2:constituentLoaded", YAHOO.Convio.PC2.Data.User);
        },
        failure: function(o) {
            YAHOO.log(o.responseText, 'error', 'constituent_utils.js');
        },
        scope: YAHOO.Convio.PC2.Component.Constituent
    },
    
    initialize: function(oConfig) {
        YAHOO.log('Initializing Constituent', 'info', 'constituent_utils.js');
        if(oConfig.name) {
            YAHOO.log('Init: found name','info','constituent_utils.js');
            this.Name = oConfig.name;
        }
        
        if(oConfig.initDone) {
            YAHOO.log('Init: found initDone','info','constituent_utils.js');
            this.initalizationDone = oConfig.initDone;
        }
        
        YAHOO.Convio.PC2.Constituent.getUser(this.loadUserCallback);
    }
};
