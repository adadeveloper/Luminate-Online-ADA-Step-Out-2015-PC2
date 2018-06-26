/*
 * convio_config_test.js
 * 
 * Defines unit tests for YAHOO.Convio.PC2.Config
 * 
 * @see http://developer.yahoo.com/yui/3/test/
 * @see http://yuilibrary.com/forum/viewtopic.php?p=15478
 */

YUI.add("convio_config_test", function(Y){

	Y.namespace("Convio.PC2.Test");
	
	// define a test case object
	Y.Convio.PC2.Test.Config = new Y.Test.Case({ 
		
        name: "Config Test",

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
            useList: "#config_results_list"                    
        },
        
        testGetApiKey : function () {

            this.assertSame(this.fakeApiKey, YAHOO.Convio.PC2.Config.getApiKey());
        },

        testTeamraiserUrl : function() {
            this.assertSame(this.fakeBaseUrl + "CRTeamraiserAPI", YAHOO.Convio.PC2.Config.Teamraiser.getUrl());
        },

        testAddressBookUrl : function() {
            this.assertSame(this.fakeBaseUrl + "CRAddressBookAPI", YAHOO.Convio.PC2.Config.AddressBook.getUrl());
        },

        testContentUrl : function() {
            this.assertSame(this.fakeBaseUrl + "CRContentAPI", YAHOO.Convio.PC2.Config.Content.getUrl());
        },

        testConstituentUrl : function() {
            this.assertSame(this.fakeBaseUrl + "CRConsAPI", YAHOO.Convio.PC2.Config.Constituent.getUrl());
        },

        testProgressUrl : function() {
            this.assertSame(this.fakeBaseUrl + "DynImg", YAHOO.Convio.PC2.Config.Progress.getUrl());
        },

        testProgressId : function() {
            this.assertSame("23", YAHOO.Convio.PC2.Config.Progress.getProgressImageId());
        },

        testProgressImageUrl : function() {
            this.assertSame(this.fakeBaseUrl + "DynImg?pi=23&percent=34", YAHOO.Convio.PC2.Config.Progress.getProgressUrl(34));
            this.assertSame(this.fakeBaseUrl + "DynImg?pi=23&percent=45", YAHOO.Convio.PC2.Config.Progress.getProgressUrl(45));
        },

        testVersion : function() {
        	this.assertSame("1.0", YAHOO.Convio.PC2.Config.getVersion());
        },
        
        testSetLocale_Undefined : function() {
        	YAHOO.Convio.PC2.Config.setLocale('en_US');
        	var initialLocale = YAHOO.Convio.PC2.Config.getLocale();
        	this.assertWellDefined(initialLocale);
        	
        	var undefinedLocale;
        	YAHOO.Convio.PC2.Config.setLocale(undefinedLocale);
        	
        	this.assertEqual(initialLocale, YAHOO.Convio.PC2.Config.getLocale());
        },
        
        testSetLocale_Null : function() {
        	YAHOO.Convio.PC2.Config.setLocale('en_US');
        	var initialLocale = YAHOO.Convio.PC2.Config.getLocale();
        	this.assertWellDefined(initialLocale);
        	
        	var nullLocale = null;
        	YAHOO.Convio.PC2.Config.setLocale(nullLocale);
        	
        	this.assertEqual(initialLocale, YAHOO.Convio.PC2.Config.getLocale());
        },
        
        testSetLocale_Valid : function() {
        	YAHOO.Convio.PC2.Config.setLocale('en_US');
        	var initialLocale = YAHOO.Convio.PC2.Config.getLocale();
        	this.assertWellDefined(initialLocale);
        	
        	var newLocale = (initialLocale === 'en_US') ? 'es_US' : 'en_US';
        	this.assertNotEqual(initialLocale, newLocale);
        	YAHOO.Convio.PC2.Config.setLocale(newLocale);
        	
        	this.assertEqual(newLocale, YAHOO.Convio.PC2.Config.getLocale());
        },
        
        testGetCurrencyLocale : function() {
        	
        	/* Fake a multidimensional array with form ['locale' cookie, 'currency_locale' cookie, expected currency locale] */
        	var testScenarios =  new Array(5);
        	testScenarios[0] = new Array('en_US', 'es_US', 'es_US'); // should use the currency locale
        	testScenarios[1] = new Array('en_US', 'USER', 'en_US'); // should use the user's locale
        	testScenarios[2] = new Array('fr_CA', 'en_GB', 'en_GB'); // should use the currency locale
        	testScenarios[3] = new Array('fr_CA', 'USER', 'fr_CA'); // should use the user's locale
        	testScenarios[4] = new Array('en_CA', null, 'en_CA'); // should use the user's locale
        	
        	for (var testScenarioName in testScenarios) {
        		
        		if(testScenarios.hasOwnProperty(testScenarioName)) {
        		
            		var testScenario = testScenarios[testScenarioName];
            		
            		YAHOO.util.Cookie.set("locale", testScenario[0], {path: "/"});
            		this.assertEqual(testScenario[0], YAHOO.Convio.PC2.Config.getLocale());
            		
                	YAHOO.util.Cookie.set("currency_locale", testScenario[1], {path: "/"});
                	this.assertEqual(testScenario[2], YAHOO.Convio.PC2.Config.getCurrencyLocale());
                	
            	}
        		
        	}
        	
        },
        
        testIsValid : function() {
        	
        	for (var i = 0; i < 3; i++) {
        		this.restoreCookies();
	        	this.assertTrue(YAHOO.Convio.PC2.Config.isValid());
        		
	        	this.fakeCookies();
	        	this.assertTrue(YAHOO.Convio.PC2.Config.isValid());
        	}
        	
        }
		
	});

	// add test case to test runner
	Y.Test.Runner.add(Y.Convio.PC2.Test.Config);
},
"1.0",
{ requires: ['test', 'test-assertions'] }
);