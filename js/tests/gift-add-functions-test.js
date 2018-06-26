/*
 * gift-add-functions-test.js
 * 
 * Defines unit tests for functions defined in gift-add-functions.js
 * 
 * @see http://developer.yahoo.com/yui/3/test/
 * @see http://yuilibrary.com/forum/viewtopic.php?p=15478
 */

YUI.add("gift-add-functions-test", function(Y){

	Y.namespace("Convio.PC2.Test");
	
	// define a test case object
	Y.Convio.PC2.Test.pc2_gift_add_functions = new Y.Test.Case({ 
		
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
			useList : "#pc2_gift_add_functions_results_list"

			,
			ignore : {
				testIgnore : true
			}
		},

		testIsGiftPaymentTypeCredit : function()
		{
			for (var i = 0; i < 3; i++) {
				jQuery('input:radio[name=gift_payment_type]').filter("[value=check]").attr('checked', true);
				this.assertFalse(isGiftPaymentTypeCredit());
				
				jQuery('input:radio[name=gift_payment_type]').filter("[value=credit]").attr('checked', true);
				this.assertTrue(isGiftPaymentTypeCredit());
			}
			
		},	
		
		testIsGiftPaymentTypeCheck : function()
		{
			for (var i = 0; i < 3; i++) {
				jQuery('input:radio[name=gift_payment_type]').filter("[value=check]").attr('checked', true);
				this.assertTrue(isGiftPaymentTypeCheck());
				
				jQuery('input:radio[name=gift_payment_type]').filter("[value=credit]").attr('checked', true);
				this.assertFalse(isGiftPaymentTypeCheck());
			}
		},
		
		testIsSubmitMultipleGifts : function()
		{
			for (var i = 0; i < 3; i++) {
				setSubmitMultipleGifts();
				this.assertTrue(isSubmitMultipleGifts());
				
				setSubmitSingleGift();
				this.assertFalse(isSubmitMultipleGifts());
			}
		}
		
	});

	// add test case to test runner
	Y.Test.Runner.add(Y.Convio.PC2.Test.pc2_gift_add_functions);
},
"1.0",
{ requires: ['test', 'test-assertions'] }
);