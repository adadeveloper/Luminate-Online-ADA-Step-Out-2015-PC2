/*
 * teammates-functions-test.js
 * 
 * Defines unit tests for functions defined in teammates-functions.js
 * 
 * @see http://developer.yahoo.com/yui/3/test/
 * @see http://yuilibrary.com/forum/viewtopic.php?p=15478
 */

YUI.add("teammates-functions-test", function(Y){

	Y.namespace("Convio.PC2.Test");
	
	// define a test case object
	Y.Convio.PC2.Test.pc2_teammates_functions = new Y.Test.Case({ 
		
		name : "Teammates Functions Test",

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
			useList : "#pc2_teammates_functions_results_list"

			,
			ignore : {
				testIgnore : true
			}
		},

		testInjectTeamRosterRelatedLinks_UndefinedInput : function()
		{
			var undefineResponse; 
			
			// passing in an undefined response should _not_ throw an exception
			injectTeamRosterRelatedLinks(undefineResponse);
		},
		
		testInjectTeamRosterRelatedLinks_NullInput : function()
		{
			var nullResponse = null; 
			
			// passing in a null response should _not_ throw an exception
			injectTeamRosterRelatedLinks(nullResponse);
		},
		
		testInjectTeamRosterRelatedLinks_EmptyInput : function()
		{
			var emptyResponse = {}; 
			
			// passing in an empty response should _not_ throw an exception
			injectTeamRosterRelatedLinks(emptyResponse);
		},
		
		testInjectTeamRosterRelatedLinks : function()
		{
			var domLinkIds = ["msg_cat_teammates_download_members", "msg_cat_teammates_download_donations", "msg_cat_teammates_download_stats"];
			
			var targetUrlForTest = "http://www.google.com/";
			
			var validResponse = { teamRosterDownloadUrl: targetUrlForTest, teamDonationsDownloadUrl: targetUrlForTest, teamStatsDownloadUrl: targetUrlForTest };
			
			// expect that test page DOM does not, by default, contain related DOM link elements
			for (i = 0; i < domLinkIds.length; i++) {
				this.assertNull(YAHOO.util.Dom.get(domLinkIds[i]));
			}
			
			// missing DOM elements should not cause error when injectTeamRosterRelatedLinks(..) is invoked. 
			injectTeamRosterRelatedLinks(validResponse);
			
			// create missing DOM elements
			var testResultsContainer = YAHOO.util.Dom.get("pc2_teammates_functions_results_list");
			this.assertWellDefined(testResultsContainer);
			for (i = 0; i < domLinkIds.length; i++) {
				
				var linkElement = document.createElement("a");
				this.assertWellDefined(linkElement);
				
				linkElement.appendChild(document.createTextNode("Download Link: " + domLinkIds[i]));
				
				linkElement.id = domLinkIds[i];
				this.assertEqual(linkElement.id, domLinkIds[i]);
				
				YAHOO.util.Dom.setStyle(YAHOO.util.Dom.insertAfter(linkElement, testResultsContainer), 'display', 'none');
			}
			
			// assert that test page DOM now contains pertinent DOM link elements, but with blank link targets 
			for (i = 0; i < domLinkIds.length; i++) {
				this.assertWellDefined(YAHOO.util.Dom.get(domLinkIds[i]));
				this.assertEqual('', YAHOO.util.Dom.get(domLinkIds[i]).href);
			}

			// calling injectTeamRosterRelatedLinks(..) should now actually set link targets on DOM elements 
			injectTeamRosterRelatedLinks(validResponse);
			
			for (i = 0; i < domLinkIds.length; i++) {
				this.assertWellDefined(YAHOO.util.Dom.get(domLinkIds[i]));
				this.assertNotEqual('', YAHOO.util.Dom.get(domLinkIds[i]).href);
				this.assertEqual(targetUrlForTest, YAHOO.util.Dom.get(domLinkIds[i]).href);
			}
			
		}	
		
	});

	// add test case to test runner
	Y.Test.Runner.add(Y.Convio.PC2.Test.pc2_teammates_functions);
},
"1.0",
{ requires: ['test', 'test-assertions'] }
);