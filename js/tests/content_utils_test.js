/*
 * content_utils_test.js
 * 
 * Defines unit tests for YAHOO.Convio.PC2.Component.Content
 * 
 * @see http://developer.yahoo.com/yui/3/test/
 * @see http://yuilibrary.com/forum/viewtopic.php?p=15478
 */

YUI.add("content_utils_test", function(Y){

	Y.namespace("Convio.PC2.Test");
	Y.namespace("Convio.PC2.Test.Component");
	
	// define a test case object
	Y.Convio.PC2.Test.Component.Content = new Y.Test.Case({ 
		
		name : "Content Utils Test",

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
			useList : "#content_utils_results_list"

			,
			ignore : {
				testIgnore : true
			}
		},
		
		localeSelectorContainerDomId : 'hd-etc-locale',
		
		localeSelectorDomId : 'hd-etc-locale-selector',

		setupInjectSupportedLocalesSelectorOptions : function()
		{
			// expect locale selector container to be present in the dom
			var localeSelectorContainerDomElement = YAHOO.util.Dom.get(this.localeSelectorContainerDomId);
	    	this.assertWellDefined(localeSelectorContainerDomElement);
	    	
	    	// ensure that locale selector container is hidden
	    	jQuery('#' + this.localeSelectorContainerDomId).addClass('hidden-form');
	    	this.assertTrue(jQuery('#' + this.localeSelectorContainerDomId).hasClass('hidden-form'));
			
			// expect locale selector to be present in the dom
			var localeSelectorDomElement = YAHOO.util.Dom.get(this.localeSelectorDomId);
	    	this.assertWellDefined(localeSelectorDomElement);
	    	
	    	// ensure that we're starting with zero options in the select list
	    	jQuery('#' + this.localeSelectorDomId).empty();
	    	this.assertEqual(0, jQuery('#' + this.localeSelectorDomId + ' option').size());
		},
		
		testInjectSupportedLocalesSelectorOptions_undefined : function()
		{
			this.setupInjectSupportedLocalesSelectorOptions();
			
	    	// invoke method under test
			var supportedLocalesList;
			YAHOO.Convio.PC2.Component.Content.loadSupportedLocalesCallback.injectSupportedLocalesSelectorOptions(supportedLocalesList);
			
			// locale selector container should still be hidden
	    	this.assertTrue(jQuery('#' + this.localeSelectorContainerDomId).hasClass('hidden-form'));
			
			// should still be zero options in the locale select list
			this.assertEqual(0, jQuery('#' + this.localeSelectorDomId + ' option').size());
		},

		testInjectSupportedLocalesSelectorOptions_null : function()
		{
			this.setupInjectSupportedLocalesSelectorOptions();
			
			// invoke method under test
			var supportedLocalesList = null;
			YAHOO.Convio.PC2.Component.Content.loadSupportedLocalesCallback.injectSupportedLocalesSelectorOptions(supportedLocalesList);
			
			// locale selector container should still be hidden
	    	this.assertTrue(jQuery('#' + this.localeSelectorContainerDomId).hasClass('hidden-form'));
			
			// should still be zero options in the locale select list
			this.assertEqual(0, jQuery('#' + this.localeSelectorDomId + ' option').size());
		},

		testInjectSupportedLocalesSelectorOptions_SingleLocale : function()
		{
			this.setupInjectSupportedLocalesSelectorOptions();
			
			// invoke method under test
			var jsonString = '{"listSupportedLocalesResponse":{"supportedLocale":[{"variant":{},"country":{},"fullyQualifiedName":"ar","displayCountry":{},"displayVariant":{},"language":"ar","defaultLocale":"false","displayLanguage":"Arabic","displayName":"Arabic"}]}}';
			var supportedLocalesList = eval('(' + jsonString + ')').listSupportedLocalesResponse;
			YAHOO.Convio.PC2.Component.Content.loadSupportedLocalesCallback.injectSupportedLocalesSelectorOptions(supportedLocalesList);
			
			// locale selector container should still be hidden
	    	this.assertTrue(jQuery('#' + this.localeSelectorContainerDomId).hasClass('hidden-form'));
			
			// should still be zero options in the locale select list
			this.assertEqual(0, jQuery('#' + this.localeSelectorDomId + ' option').size());
		},

		testInjectSupportedLocalesSelectorOptions_MultipleLocales : function()
		{
			this.setupInjectSupportedLocalesSelectorOptions();
			
			// invoke method under test
			var jsonString = '{"listSupportedLocalesResponse":{"supportedLocale":[{"variant":{},"country":{},"fullyQualifiedName":"ar","displayCountry":{},"displayVariant":{},"language":"ar","defaultLocale":"false","displayLanguage":"Arabic","displayName":"Arabic"},{"variant":{},"country":"DZ","fullyQualifiedName":"ar_DZ","displayCountry":"Algeria","displayVariant":{},"language":"ar","defaultLocale":"false","displayLanguage":"Arabic","displayName":"Arabic (Algeria)"}]}}';
			var supportedLocalesList = eval('(' + jsonString + ')').listSupportedLocalesResponse;
			YAHOO.Convio.PC2.Component.Content.loadSupportedLocalesCallback.injectSupportedLocalesSelectorOptions(supportedLocalesList);
			
			// locale selector container should no longer be hidden
	    	this.assertFalse(jQuery('#' + this.localeSelectorContainerDomId).hasClass('hidden-form'));
			
			// should now be two options in the locale select list
			this.assertEqual(2, jQuery('#' + this.localeSelectorDomId + ' option').size());
		},
		
		testFixValues_ById : function()
		{
			
			var valuesById = {
					h3: 'These values fixed into the DOM by ID',
					div: 'Div Content: Duis tincidunt, ligula ut aliquam ornare, orci felis iaculis nibh, nec aliquam odio ante et nibh.',
					span: 'Span Content: Quisque id massa libero, a iaculis nunc.',
					p: 'Paragraph Content: Suspendisse sagittis venenatis ultricies. Nunc ultrices vestibulum ante at tincidunt.',
					a: 'Link Content: Donec interdum justo erat.'
			}
			
			// confirm that values have not yet been fixed into the DOM
			var that = this;
			for (var key in valuesById) {
				jQuery('#msg_cat_' + key).each(
					function(index, elem) {
						that.assertNotEqual(valuesById[key], elem.innerHTML);
					}
				);
			}
			
			// affix values into the DOM by ID
			YAHOO.Convio.PC2.Component.Content.fixValues(valuesById);
			
			// confirm that values have now been fixed into the DOM
			var that = this;
			for (var key in valuesById) {
				jQuery('#msg_cat_' + key).each(
					function(index, elem) {
						that.assertEqual(valuesById[key], elem.innerHTML);
					}
				);
			}
			
		},
		
		testFixValues_ByClass : function()
		{
			var valuesByClass = {
					class_h3: 'These values fixed into the DOM by CLASS',
					class_div: 'Div Content: Duis tincidunt, ligula ut aliquam ornare, orci felis iaculis nibh, nec aliquam odio ante et nibh.',
					class_span: 'Span Content: Quisque id massa libero, a iaculis nunc.',
					class_p: 'Paragraph Content: Suspendisse sagittis venenatis ultricies. Nunc ultrices vestibulum ante at tincidunt.',
					class_a: 'Link Content: Donec interdum justo erat.'
			}
			
			// confirm that values have not yet been fixed into the DOM
			var that = this;
			for (var key in valuesByClass) {
				jQuery('#testFixValues_ByClass .msg_cat_' + key).each(
					function(index, elem) {
						that.assertNotEqual(valuesByClass[key], elem.innerHTML);
					}
				);
			}
			
			// affix values into the DOM by CLASS
			YAHOO.Convio.PC2.Component.Content.fixValues(valuesByClass);
			
			// confirm that values have now been fixed into the DOM
			var that = this;
			for (var key in valuesByClass) {
				jQuery('#testFixValues_ByClass .msg_cat_' + key).each(
					function(index, elem) {
						that.assertEqual(valuesByClass[key], elem.innerHTML);
					}
				);
			}
			
		}
		
	});

	// add test case to test runner
	Y.Test.Runner.add(Y.Convio.PC2.Test.Component.Content);
},
"1.0",
{ requires: ['test', 'test-assertions'] }
);