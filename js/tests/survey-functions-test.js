/*
 * survey-functions-test.js
 * 
 * Defines unit tests for functions defined in survey-functions.js
 * 
 * @see http://developer.yahoo.com/yui/3/test/
 * @see http://yuilibrary.com/forum/viewtopic.php?p=15478
 */

YUI.add("survey-functions-test", function(Y){

	Y.namespace("Convio.PC2.Test");
	
	// define a test case object
	Y.Convio.PC2.Test.pc2_survey_functions = new Y.Test.Case({ 
		
		name : "Survey Functions Test",

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
			useList : "#pc2_survey_functions_results_list"

			,
			ignore : {
				testIgnore : true
			}
		},

		testBuildDateSurveyQuestion : function()
		{
			var surveyQuestionParentDiv = YAHOO.util.Dom.get("surveyQuestionParentDiv");
			
			var mockDateQuestionResponse = { responseValue: "12/28/2007", questionId: "123", questionText: "Date Survey Example:" };
			
			var dateInputElement = buildDateSurveyQuestion(mockDateQuestionResponse, surveyQuestionParentDiv);
			
			// click on date input element to reveal yui component
			Y.one("#" + dateInputElement.id).simulate("click");
			
			// assert that we picked up a reference to yui component
			this.assertWellDefined(YAHOO.Convio.PC2.Component.Survey.lastDatePickerPanelShown);
			
			// hide the yui date picker
			YAHOO.Convio.PC2.Component.Survey.lastDatePickerPanelShown.hide();
		}	
		
	});

	// add test case to test runner
	Y.Test.Runner.add(Y.Convio.PC2.Test.pc2_survey_functions);
},
"1.0",
{ requires: ['test', 'test-assertions'] }
);