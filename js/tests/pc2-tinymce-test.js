/*
 * pc2-tinymce-test.js
 * 
 * Defines unit tests for YAHOO.Convio.PC2.TinyMCE
 * 
 * @see http://developer.yahoo.com/yui/3/test/
 * @see http://yuilibrary.com/forum/viewtopic.php?p=15478
 */

YUI.add("pc2-tinymce-test", function(Y){

	Y.namespace("Convio.PC2.Test");
	
	// define a test case object
	Y.Convio.PC2.Test.TinyMCE = new Y.Test.Case({ 
		
		name : "TinyMCE Initialization Test",

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
			useList : "#pc2_tinymce_results_list"
		},
		
	    testResolveWysiwygLanague_NonsenseLocale : function () {
	    	
			var originalLocale = YAHOO.Convio.PC2.Config.getLocale();
			
			// set a nonsensical locale
			var nonsenseLocale = 123;
			YAHOO.Convio.PC2.Config.setLocale(nonsenseLocale);
			
			// confirm that TinyMCE language resolves to english, even though user selected locale is fubar'ed 
			this.assertEqual('en', YAHOO.Convio.PC2.TinyMCE.resolveWysiwygLanague());
			
			// revert user selected locale
			YAHOO.Convio.PC2.Config.setLocale(originalLocale);
	    },
	    
	    testResolveWysiwyganague_UnexpectedlLocale : function () {
	    	
	    	var originalLocale = YAHOO.Convio.PC2.Config.getLocale();
			
			// set an unexpected locale
			var unexpectedLocale = 'sv_SE';
			YAHOO.Convio.PC2.Config.setLocale(unexpectedLocale);
			
			// confirm that TinyMCE language resolves to english, even though user selected locale is unexpected
			this.assertEqual('en', YAHOO.Convio.PC2.TinyMCE.resolveWysiwygLanague());
			
			// revert user selected locale
			YAHOO.Convio.PC2.Config.setLocale(originalLocale);
	    },
	    
	    testResolveWysiwygLanague_EnglishLocale : function () {
	    	YAHOO.Convio.PC2.Config.setLocale('en');
			this.assertEqual('en', YAHOO.Convio.PC2.TinyMCE.resolveWysiwygLanague());
	    	
			YAHOO.Convio.PC2.Config.setLocale('en_US');
			this.assertEqual('en', YAHOO.Convio.PC2.TinyMCE.resolveWysiwygLanague());
			
			YAHOO.Convio.PC2.Config.setLocale('en_CA');
			this.assertEqual('en', YAHOO.Convio.PC2.TinyMCE.resolveWysiwygLanague());
			
			YAHOO.Convio.PC2.Config.setLocale('en_GB');
			this.assertEqual('en', YAHOO.Convio.PC2.TinyMCE.resolveWysiwygLanague());
	    },
	    
	    testResolveWysiwygLanague_SpanishLocale : function () {
	    	YAHOO.Convio.PC2.Config.setLocale('es');
			this.assertEqual('es', YAHOO.Convio.PC2.TinyMCE.resolveWysiwygLanague());
	    	
	    	YAHOO.Convio.PC2.Config.setLocale('es_US');
			this.assertEqual('es', YAHOO.Convio.PC2.TinyMCE.resolveWysiwygLanague());
	    },
	    
	    testResolveWysiwygLanague_FrenchLocale : function () {
	    	YAHOO.Convio.PC2.Config.setLocale('fr');
			this.assertEqual('fr', YAHOO.Convio.PC2.TinyMCE.resolveWysiwygLanague());
	    	
	    	YAHOO.Convio.PC2.Config.setLocale('fr_CA');
			this.assertEqual('fr', YAHOO.Convio.PC2.TinyMCE.resolveWysiwygLanague());
	    },
	    
	    testInitWysiwygComponents_UndefinedInput : function () {
	    	
	    	var undefineDomElementList; 
	    	
	    	// passing in an undefined list should _not_ throw an exception
	    	YAHOO.Convio.PC2.TinyMCE.initWysiwygComponents(undefineDomElementList);
	    },
	    
	    testInitWysiwygComponents_NullInput : function () {
	    	var nullDomElementList = null; 
			
			// passing in a null list should _not_ throw an exception
	    	YAHOO.Convio.PC2.TinyMCE.initWysiwygComponents(nullDomElementList);
	    },
	    
	    testInitWysiwygComponents_BlankInput : function () {
	    	var blankDomElementList = ""; 
			
			// passing in a blank list should _not_ throw an exception
	    	YAHOO.Convio.PC2.TinyMCE.initWysiwygComponents(blankDomElementList);
	    },
	    
	    testInitWysiwygComponents_NoMatchingDomElements : function () {
	    	var blankDomElementList = "does_not_exist_in_dom"; 
			
			// passing in an invalid list should _not_ throw an exception
	    	YAHOO.Convio.PC2.TinyMCE.initWysiwygComponents(blankDomElementList);
	    },
	    
	    testInitWysiwygComponents_HasMatchingDomElements : function () {
	    	
	    	var that = this;
	    	
	    	var blankDomElementList = "test-rich-text-1, does_not_exist_in_dom, test-rich-text-2";
	    	
	    	function assertTinyMceNotApplied () {
	    		that.assertNull(YAHOO.util.Dom.get('test-rich-text-1_parent'));
	        	that.assertNull(YAHOO.util.Dom.get('test-rich-text-2_parent'));
	    	}
	    	
	    	function assertTinyMceApplied() {
	    		that.assertWellDefined(YAHOO.util.Dom.get('test-rich-text-1_parent'));
	        	that.assertWellDefined(YAHOO.util.Dom.get('test-rich-text-2_parent'));
	    	}
	    	
	    	// confirm that expected text areas exist in the dom
	    	this.assertWellDefined(YAHOO.util.Dom.get('test-rich-text-1'));
	    	this.assertWellDefined(YAHOO.util.Dom.get('test-rich-text-2'));
			
	    	// confirm that tiny mce has not yet been applied to text areas
	    	assertTinyMceNotApplied();
	    	
			// apply tiny mce to textareas
	    	YAHOO.Convio.PC2.TinyMCE.initWysiwygComponents(blankDomElementList);
	    	
	    	// wait a few seconds and then ...
	    	// confirm that tiny mce has now been applied to text areas
	    	this.wait(assertTinyMceApplied, 2 * 1000);
	    }	
		
	});

	// add test case to test runner
	Y.Test.Runner.add(Y.Convio.PC2.Test.TinyMCE);
},
"1.0",
{ requires: ['test', 'test-assertions'] }
);