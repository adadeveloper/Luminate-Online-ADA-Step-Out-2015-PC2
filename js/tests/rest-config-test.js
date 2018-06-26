/*
 * rest-config-test.js
 * 
 * Defines unit tests for YAHOO.Convio.PC2.RestConfig
 * 
 * @see http://developer.yahoo.com/yui/3/test/
 * @see http://yuilibrary.com/forum/viewtopic.php?p=15478
 */

YUI.add("rest-config-test", function(Y){

	Y.namespace("Convio.PC2.Test");
	
	// define a test case object
	Y.Convio.PC2.Test.RestConfig = new Y.Test.Case({ 
		
		name: "REST Config Test",

        setUp : function() {
            this.setupTestCount();
        	this.fakeCookies();
        },

        tearDown : function() {
            this.restoreCookies();
        },

        _should: {
            /*ignore: {
                testIgnore: true    
            }
            */
            useList: "#rest_config_results_list"                    
        },
        
        testInitializedAuth : function () {
        	YAHOO.Convio.PC2.RestConfig.initialize();
            this.assertWellDefined(YAHOO.Convio.REST.Config.getAuth());
        },
        
        testInitializedApiKey : function () {
        	YAHOO.Convio.PC2.RestConfig.initialize();
            this.assertWellDefined(YAHOO.Convio.REST.Config.getApiKey());
        },
        
        testInitializedVersion : function () {
        	YAHOO.Convio.PC2.RestConfig.initialize();
            this.assertWellDefined(YAHOO.Convio.REST.Config.getVersion());
        },
        
        testInitializedSetConfiguredFlag : function () {
        	YAHOO.Convio.PC2.RestConfig.initialize();
            this.assertWellDefined(YAHOO.Convio.REST.Config.isConfigured());
        },
        
        testInitializedAddressBookApiServletPath : function () {
        	YAHOO.Convio.PC2.RestConfig.initialize();
        	this.assertWellDefined(YAHOO.Convio.REST.Paths.getAddressBookApiServletPath());
        },
        
        testInitializedContentApiServletPath : function () {
        	YAHOO.Convio.PC2.RestConfig.initialize();
        	this.assertWellDefined(YAHOO.Convio.REST.Paths.getContentApiServletPath());
        },
        
        testInitializedConstituentApiServletPath : function () {
        	YAHOO.Convio.PC2.RestConfig.initialize();
        	this.assertWellDefined(YAHOO.Convio.REST.Paths.getConstituentApiServletPath());
        },
        
        testInitializedTeamraiserApiServletPath : function () {
        	YAHOO.Convio.PC2.RestConfig.initialize();
        	this.assertWellDefined(YAHOO.Convio.REST.Paths.getTeamraiserApiServletPath());
        },
        
        testInitializedUniqueApiServletPaths : function () {
        	var servletPaths = new Array(YAHOO.Convio.REST.Paths.getAddressBookApiServletPath(), YAHOO.Convio.REST.Paths.getContentApiServletPath(), 
        			YAHOO.Convio.REST.Paths.getConstituentApiServletPath(), YAHOO.Convio.REST.Paths.getTeamraiserApiServletPath());
        	
        	var sizeBeforeDuplicatesRemoved = servletPaths.length;
        	jQuery.unique(servletPaths);
        	var sizeAftereDuplicatesRemoved = servletPaths.length;
        	
        	this.assertEqual(sizeBeforeDuplicatesRemoved, sizeAftereDuplicatesRemoved);
        }
		
	});

	// add test case to test runner
	Y.Test.Runner.add(Y.Convio.PC2.Test.RestConfig);
},
"1.0",
{ requires: ['test', 'test-assertions'] }
);