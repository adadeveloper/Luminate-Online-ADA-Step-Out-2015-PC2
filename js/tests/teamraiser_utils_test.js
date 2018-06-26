/*
 * teamraiser_utils_test.js
 * 
 * Defines unit tests for YAHOO.Convio.PC2.Component.Teamraiser
 * 
 * @see http://developer.yahoo.com/yui/3/test/
 * @see http://yuilibrary.com/forum/viewtopic.php?p=15478
 */

YUI.add("teamraiser_utils_test", function(Y){

	Y.namespace("Convio.PC2.Test");
	Y.namespace("Convio.PC2.Test.Component");
	
	// define a test case object
	Y.Convio.PC2.Test.Component.Teamraiser = new Y.Test.Case({ 
		
		name : "TeamRaiser Utils Test",

		setUp : function()
		{
			this.setupTestCount();
			this.fakeCookies();
		},

		tearDown : function()
		{
			this.restoreCookies();
		},

		_should : {
			/*
			 * ignore: { testIgnore: true }
			 */
			useList : "#teamraiser_utils_results_list",
			error : {
				testIsCanViewTeamRoster_Uninitialized: true,
				testIsOnATeam_Uninitialized: true
			}
		},
	    
	    testInitialize_Empty : function () {
			
			this.assertWellDefined(YAHOO.Convio.PC2.Component.Teamraiser);
			
			var emptyConfig = {};
			YAHOO.Convio.PC2.Component.Teamraiser.initialize(emptyConfig);
	    },
		
	    testIsCanViewTeamRoster_Uninitialized : function () {
			
			this.assertWellDefined(YAHOO.Convio.PC2.Component.Teamraiser);
			
			// this line should throw an exception ... see _should.error property
			YAHOO.Convio.PC2.Component.Teamraiser.isCanViewTeamRoster();
	    },
	    
	    testIsCanViewTeamRoster_Initialized : function () {
	    	/**
	    	 * TODO DSW Olympus 
	         * Note: no "happy path" test of the isCanViewTeamRoster() method because the initialize() 
	         * method is too difficult to invoke in the context of a unit test.
	         */
	    },
		
	    testIsOnATeam_Uninitialized : function () {
			
			this.assertWellDefined(YAHOO.Convio.PC2.Component.Teamraiser);
			
			// this line should throw an exception ... see _should.error property
			YAHOO.Convio.PC2.Component.Teamraiser.isCanViewTeamRoster();
	    },
	    
	    testIsOnATeam_Initialized : function () {
	    	/**
	    	 * TODO DSW Olympus 
	         * Note: no "happy path" test of the isOnATeam() method because the initialize() 
	         * method is too difficult to invoke in the context of a unit test.
	         */
	    }	
		
	});

	// add test case to test runner
	Y.Test.Runner.add(Y.Convio.PC2.Test.Component.Teamraiser);
},
"1.0",
{ requires: ['test', 'test-assertions'] }
);