/* content_utils.js
 * Copyright 2008, Convio
 *
 * Provides Convio Utility functionality.
 * 
 * Depends on:
 * YUI Core, Cookies, Connection
 * convio_config.js,
 * content_rest.js
 *
 */
YAHOO.Convio.PC2.Component.Content = {
    MessageCatalogAssociativeArray : new Object(),
    
    getMsgCatValue: function(key) {
        return YAHOO.Convio.PC2.Component.Content.MessageCatalogAssociativeArray[key];
    },
    
    /**
     * Affixes a single key/value pair into the DOM.
     * 
     *  @see fixValues(values) 
     */
    fixValue: function(key, value) {
        if(key.indexOf('class') == 0) {
            var elms = YAHOO.util.Dom.getElementsByClassName('msg_cat_' + key);
            for(var i=0; i < elms.length; i++) {
                elms[i].innerHTML = value;
            }
        } else {
            var elm = YAHOO.util.Dom.get('msg_cat_' + key);
            if(elm) {
                elm.innerHTML = value;
            }
        }
    },
    
    /**
     * Affixes multiple values into the dom.  
     * 
     * For each DOM element with id="msg_cat_foo" or class="msg_cat_class_foo",
     * this method will affix any matching value from the values argument.
     * 
     * @see fixValue(key, value)
     */
    fixValues: function(values) {
    	
    	var msgCatIdPrefix = 'msg_cat';
    	
    	var toBeFixedById = jQuery('[id^=' + msgCatIdPrefix + ']');
    	toBeFixedById.each(
    		function(index, elem) {
    			var key = elem.id.substring(msgCatIdPrefix.length + 1);
    			
    			var value = values[key];
				if (value) {
					elem.innerHTML = value;
				}
    		}
    	);
    	
    	var msgCatClassPrefix = 'msg_cat_class';

    	var toBeFixedByClass = jQuery('[class*=' + msgCatClassPrefix + ']');
    	toBeFixedByClass.each(
    		function(index, elem) {
    			
    			var elemClasses = elem.className.split(' ');
    			
    			for (var i = 0; i < elemClasses.length; i++) {
    				
    				var clazz = elemClasses[i];
    				
    				if (clazz.match('^' + msgCatClassPrefix) != null) {
    					var key = clazz.substring(msgCatIdPrefix.length + 1);
    					
    					var value = values[key];
    					if (value) {
    						elem.innerHTML = value;
    					} else {
    						key = clazz.substring(msgCatClassPrefix.length + 1);
    						value = values[key];
    						if (value) {
    							elem.innerHTML = value;
    						}
    					}
    				}
    				
    			}
    			
    		}
    	);
    	
    },
    
    loadMsgCatalogResponseHandler: {
        success: function(o) {
            var response = YAHOO.lang.JSON.parse(o.responseText).getMessageBundleResponse;
            if(YAHOO.lang.isUndefined(response.values)) {
                YAHOO.log('Empty msg catalog', 'warn', 'content_utils.js');
            } else {
            	
            	var beginFixingMsgCatIntoDom = new Date();
                response.values = YAHOO.Convio.PC2.Utils.ensureArray(response.values);
                
                for(var i=0, responseValuesLength = response.values.length; i < responseValuesLength; i++) {
                
                    var msgCatKey = response.values[i].key;
                    var msgCatValue = response.values[i].value;
                    
                    // remember msg cat value for later use
                    YAHOO.Convio.PC2.Component.Content.MessageCatalogAssociativeArray[msgCatKey] = msgCatValue;
                }
                
                // affix values into the DOM
                YAHOO.Convio.PC2.Component.Content.fixValues(YAHOO.Convio.PC2.Component.Content.MessageCatalogAssociativeArray);
                
                var endFixingMsgCatIntoDom = new Date();
                
                var fixMsgCatIntoDomMilliseconds = endFixingMsgCatIntoDom.getTime() - beginFixingMsgCatIntoDom.getTime();
            	var fixMsgCatIntoDomLogMsg = 'Affixed ' + response.values.length + ' message catalog strings into the DOM in ' + fixMsgCatIntoDomMilliseconds + ' milliseconds.';
            	YAHOO.log(fixMsgCatIntoDomLogMsg, 'info', 'content_utils.js');
            }
        },
        failure: function(o) {
            YAHOO.log(o.responseText, 'error', 'content_utils.js');
        }
    },
    
    fixAllSpanValues: function(key, value) {
        var elements = YAHOO.util.Dom.getElementsByClassName(key, 'span');
        for(var i=0; i < elements.length; i++) {
            var elm = elements[i];
            if(elm) {
                elm.innerHTML = value;
            }
        }
    },
    
    loadSpanMsgCatResponseHandler: {
        success: function(o) {
            var response = YAHOO.lang.JSON.parse(o.responseText).getMessageBundleResponse;
            if(YAHOO.lang.isUndefined(response.values)) {
                YAHOO.log('Empty msg catalog', 'warn', 'content_utils.js');
            } else if(YAHOO.lang.isUndefined(response.values.length)) {
                YAHOO.Convio.PC2.Component.Content.fixValue(response.values.key, response.values.value);
            } else {
                for(var i=0; i < response.values.length; i++) {
                    
                    var msgCatKey = response.values[i].key;
                    var msgCatValue = response.values[i].value;
                    
                    // affix value into span
                    YAHOO.Convio.PC2.Component.Content.fixAllSpanValues(msgCatKey, msgCatValue);
                    
                    // remember msg cat value for later use
                    YAHOO.Convio.PC2.Component.Content.MessageCatalogAssociativeArray[msgCatKey] = msgCatValue;
                }
            }
        },
        
        failure: function(o) {
            YAHOO.log(o.responseText, 'error', 'content_utils.js');
        },
        
        scope: YAHOO.Convio.PC2.Component.Content
    },
    
    loadMsgCatalog: function(keys, bundle) {
        YAHOO.Convio.PC2.Content.getMessageBundle(this.loadMsgCatalogResponseHandler, keys, bundle);
    },

    // Will get all spans with a class matching one of the keys and sets the innerHTML of that span
    // to the corresponding message catalog value for that key.
    loadMsgCatalogBySpanAndClass: function(keys, bundle) {
        YAHOO.Convio.PC2.Content.getMessageBundle(this.loadSpanMsgCatResponseHandler, keys, bundle);
    },
    
    renderSTag: function(callback, stag) {
        YAHOO.Convio.PC2.Content.renderSTag(callback, stag);       
    },

    isMultiLocale: function() {
        var supportedLocales = YAHOO.Convio.PC2.Utils.ensureArray(this.Locales.supportedLocale)
        var multiLocaleEnabled =  (supportedLocales && this.Locales.supportedLocale.length > 1);
        return multiLocaleEnabled;
    },

    /**
     * Processes the response to a listSupportedLocales REST request. Response
     * is used to populate DOM elements, e.g. the locale selector.
     */
    loadSupportedLocalesCallback: {
        success: function(o) {
        
            // parse the REST response
            YAHOO.namespace("YAHOO.Convio.PC2.Component.Content.Locales");
            YAHOO.Convio.PC2.Component.Content.Locales = YAHOO.lang.JSON.parse(o.responseText).listSupportedLocalesResponse;
            
            // set the response into the global YAHOO.Convio.PC2.Data namespace 
            YAHOO.Convio.PC2.Data.Locales = YAHOO.Convio.PC2.Component.Content.Locales;
            
            // reveal locale selector?
            this.injectSupportedLocalesSelectorOptions(YAHOO.Convio.PC2.Component.Content.Locales);
            
            // Log locale load success
            YAHOO.log('loadSupportedLocales success', 'info', 'content_utils.js');
            
            // Fire the locale loaded event
            YAHOO.Convio.PC2.Utils.publisher.fire("pc2:localesLoaded", YAHOO.Convio.PC2.Data.Locales);
        },
        
        injectSupportedLocalesSelectorOptions: function(supportedLocalesList) {
            
            if (!supportedLocalesList || supportedLocalesList === null) {
                YAHOO.log('injectSupportedLocalesSelectorOptions: supportedLocalesList was undefined or null', 'warn', 'content_utils.js');
                return;
            }
            
            var currentlySelectedLocale = YAHOO.Convio.PC2.Config.getLocale();
            
            var supportedLocales = YAHOO.Convio.PC2.Utils.ensureArray(supportedLocalesList.supportedLocale);
            
            if (supportedLocales && supportedLocales.length > 1) {
                
                var selectorDomId = "hd-etc-locale-selector";
                var selectorDomElement = YAHOO.util.Dom.get(selectorDomId);
                
                if (selectorDomElement) {
                    for ( var i = 0; i < supportedLocales.length; i++) {
                        var supportedLocale = supportedLocales[i];
                        var optionDomElement = document.createElement("option");
                        optionDomElement.id = selectorDomId + "_" + supportedLocale.fullyQualifiedName;
                        optionDomElement.value = supportedLocale.fullyQualifiedName;
                        if (supportedLocale.fullyQualifiedName === currentlySelectedLocale) {
                            optionDomElement.selected = true;
                        }
                        optionDomElement.appendChild(document.createTextNode(supportedLocale.displayName));
                        selectorDomElement.appendChild(optionDomElement);
                    }
                    
                    YAHOO.util.Dom.removeClass("hd-etc-locale", "hidden-form");
                }
                
                // Log inject success
                YAHOO.log('injectSupportedLocalesSelectorOptions success', 'info', 'content_utils.js');
                
            } else if (supportedLocales && supportedLocales.length === 1) {
                YAHOO.log("Only one locale is supported by this site: " + supportedLocales[0], "info", "dashboard.js");
            } else {
                YAHOO.log("Unexpected: no locales are supported by this site", "warn", "dashboard.js");
            }
        },
        
        failure: function(o) {
            YAHOO.log(o.responseText, 'error', 'content_utils.js');
        },
        
        scope: YAHOO.Convio.PC2.Component.Content
    },
    
    /**
     * Processes the response to a listCountries REST request. Response
     * is used to populate DOM elements, e.g. the locale selector.
     */
    loadCountriesCallback: {
        success: function(o) {
        
            // parse the REST response
            YAHOO.namespace("YAHOO.Convio.PC2.Component.Content.Countries");
            YAHOO.Convio.PC2.Component.Content.Countries = YAHOO.lang.JSON.parse(o.responseText).listCountriesResponse;
            
            // set the response into the global YAHOO.Convio.PC2.Data namespace 
            YAHOO.Convio.PC2.Data.Countries = YAHOO.Convio.PC2.Component.Content.Countries;
            
            // populate country selector
            this.injectCountriesSelectorOptions(YAHOO.Convio.PC2.Component.Content.Countries);
            
            // Log country load success
            YAHOO.log('loadCountries success', 'info', 'content_utils.js');
            
            // Fire the country loaded event
            YAHOO.Convio.PC2.Utils.publisher.fire("pc2:countriesLoaded", YAHOO.Convio.PC2.Data.Countries);
        },
        
        injectCountriesSelectorOptions: function(CountriesList) {
            
            if (!CountriesList || CountriesList === null) {
                YAHOO.log('injectCountriesSelectorOptions: CountriesList was undefined or null', 'warn', 'content_utils.js');
                return;
            }
                        
            var defaultCountry = YAHOO.Convio.PC2.Component.Content.getMsgCatValue('default_country');
            
            var Countries = YAHOO.Convio.PC2.Utils.ensureArray(CountriesList.country);
            Countries.sort();
            
            if (Countries && Countries.length > 1) {
                
                var selectorDomId = "gift_country";
                var selectorDomElement = YAHOO.util.Dom.get(selectorDomId);
                selectorDomElement.appendChild(document.createElement("option"));
                
                if (selectorDomElement) {
                    for ( var i = 0; i < Countries.length; i++) {
                    	if (typeof Countries[i] != "string")
                    		continue;
                        var country = Countries[i];
                        var optionDomElement = document.createElement("option");
                        optionDomElement.id = selectorDomId + "_" + country;
                        optionDomElement.value = country;
                       	optionDomElement.selected = country == defaultCountry;
                        optionDomElement.appendChild(document.createTextNode(country));
                        selectorDomElement.appendChild(optionDomElement);
                    }
                }
                
                // Log inject success
                YAHOO.log('injectCountriesSelectorOptions success', 'info', 'content_utils.js');
                
            } else {
                YAHOO.log("Unexpected: no countries are in country list", "warn", "dashboard.js");
            }
        },
        
        failure: function(o) {
            YAHOO.log(o.responseText, 'error', 'content_utils.js');
        },
        
        scope: YAHOO.Convio.PC2.Component.Content
    },
    
    /**
     * Initializes PC2 DOM elements using general content fetched via rest
     * call(s).
     */
    initialize : function()
    {
        YAHOO.log('Initializing Content', 'info', 'content_utils.js');
        if (YAHOO.Convio.PC2.Data.TeamraiserConfig.singleLocaleEvent != "true")
        {
        	YAHOO.Convio.PC2.Content.listSupportedLocales(YAHOO.Convio.PC2.Component.Content.loadSupportedLocalesCallback);
        }
        if (YAHOO.Convio.PC2.Config.isUKLocale())
        	YAHOO.Convio.PC2.Content.listCountries(this.loadCountriesCallback);
    }
};
