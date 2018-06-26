/*
 * simple_dialog_builder_test.js
 * 
 * Defines unit tests for YAHOO.Convio.PC2.Component.SimpleDialogBuilder
 * 
 * @see http://developer.yahoo.com/yui/3/test/
 * @see http://yuilibrary.com/forum/viewtopic.php?p=15478
 */

YUI.add("simple_dialog_builder_test", function(Y){

	Y.namespace("Convio.PC2.Test");
	
	// define a test case object
	Y.Convio.PC2.Test.SimpleDialogBuilder = new Y.Test.Case({ 
		
		name : "Simple Dialog Builder Test",
		
		delayBeforeDialogHide: 1 * 1000 / 2,

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
			useList : "#simple_dialog_builder_results_list"
		},
		
		testBuildConfirmDialog : function() {
			
			var headlessExecutionMode = ('true' === Y.History.getQueryStringParameter('htmlunit'));
			
			var confirmDialog = YAHOO.Convio.PC2.Component.SimpleDialogBuilder.buildConfirmDialog('confirmDialog', {});
	    	this.assertWellDefined(confirmDialog);
	    	
	    	// render and show the dialog
	    	confirmDialog.setHeader("Confirm Dialog");
	    	confirmDialog.render(document.body);
	    	confirmDialog.show();
	    	
	    	// dialog should be entirely within the viewport
	    	this.assertTrue(headlessExecutionMode || confirmDialog.fitsInViewport());
	    	
	    	// hide the dialog
	    	this.wait(function() {
				confirmDialog.hide();
			}, this.delayBeforeDialogHide);
	    	
	    	// manually move the dialog position offscreen 
	    	confirmDialog.moveTo(-1000, -1000);
	    	this.assertFalse(confirmDialog.fitsInViewport());
	    	
	    	// call show on the dialog again & confirm that it was repositioned into the viewport
	    	confirmDialog.show();
	    	this.assertTrue(headlessExecutionMode || confirmDialog.fitsInViewport());
	    	
	    	// hide the dialog
	    	this.wait(function() {
				confirmDialog.hide();
			}, this.delayBeforeDialogHide);
	    	
	    	
	    },
	    
	    testBuildBasicDialog : function() {
	    	
	    	var headlessExecutionMode = ('true' === Y.History.getQueryStringParameter('htmlunit'));
	    	
	    	var basicDialog = YAHOO.Convio.PC2.Component.SimpleDialogBuilder.buildBasicDialog('basicDialog', {});
	    	this.assertWellDefined(basicDialog);
	    	
	    	// render and show the dialog
	    	basicDialog.setHeader("Basic Dialog");
	    	basicDialog.render(document.body);
	    	basicDialog.show();
	    	
	    	// dialog should be entirely within the viewport
	    	this.assertTrue(headlessExecutionMode || basicDialog.fitsInViewport());
	    	
	    	// hide the dialog
	    	this.wait(function() {
				basicDialog.hide();
			}, this.delayBeforeDialogHide);
	    	
	    	// manually move the dialog position offscreen 
	    	basicDialog.moveTo(-1000, -1000);
	    	this.assertFalse(basicDialog.fitsInViewport());
	    	
	    	// call show on the dialog again & confirm that it was repositioned into the viewport
	    	basicDialog.show();
	    	this.assertTrue(headlessExecutionMode || basicDialog.fitsInViewport());
	    	
	    	// hide the dialog
	    	this.wait(function() {
				basicDialog.hide();
			}, this.delayBeforeDialogHide);
	    }
		
	});

	// add test case to test runner
	Y.Test.Runner.add(Y.Convio.PC2.Test.SimpleDialogBuilder);
},
"1.0",
{ requires: ['test', 'test-assertions', 'pc2-simple-dialog-builder'] }
);