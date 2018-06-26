/*
 * convio_utils_test.js
 * 
 * Defines unit tests for YAHOO.Convio.PC2.Utils
 * 
 * @see http://developer.yahoo.com/yui/3/test/
 * @see http://yuilibrary.com/forum/viewtopic.php?p=15478
 */

YUI.add("convio_utils_test", function(Y){

	Y.namespace("Convio.PC2.Test");
	
	// define a test case object
	Y.Convio.PC2.Test.Utils = new Y.Test.Case({ 
		
		name: "Utils Test",

        setUp : function() {
    	   this.setupTestCount();
           this.fakeCookies();
        },

        tearDown : function() {
            this.restoreCookies();
        },

        _should: {
            useList: "#utils_results_list",
            	
            ignore: {
                testIgnore: true,
                testResetTimeout: ('true' === Y.History.getQueryStringParameter('htmlunit')),
                testProgressBar_initAndCompleteProgressBar: ('true' === Y.History.getQueryStringParameter('htmlunit'))
            }                    
        },
        
        testFormatCurrency_UnexpectedLocale : function () {
        	
        	var unexpectedLocales = ["sv_SE", "123", 123];
        	
        	for (var i = 0; i < unexpectedLocales.length; i++) {
        	
        		var unexpectedLocale = unexpectedLocales[i];
        		
        		YAHOO.Convio.PC2.Config.setLocale(unexpectedLocale);
        		this.assertEqual(unexpectedLocale, YAHOO.Convio.PC2.Config.getLocale());
        		
        		// expected values below taken from the output of Java unit test 
        		// LocaleUtilTest.testParseAndFormatConcurrencyAreInverseOperations()
        		
        		this.assertSame("$0.17", YAHOO.Convio.PC2.Utils.formatCurrency(17));
        		this.assertSame("$0.17", YAHOO.Convio.PC2.Utils.formatCurrency("17"));
        		
                this.assertSame("$12.34", YAHOO.Convio.PC2.Utils.formatCurrency(1234));
                this.assertSame("$12.34", YAHOO.Convio.PC2.Utils.formatCurrency("1234"));
                
                this.assertSame("($12.34)", YAHOO.Convio.PC2.Utils.formatCurrency(-1234));
                this.assertSame("($12.34)", YAHOO.Convio.PC2.Utils.formatCurrency("-1234"));
                
                this.assertSame("$54.00", YAHOO.Convio.PC2.Utils.formatCurrency(5400));
                this.assertSame("$54.00", YAHOO.Convio.PC2.Utils.formatCurrency("5400"));
                
                this.assertSame("($54.00)", YAHOO.Convio.PC2.Utils.formatCurrency(-5400));
                this.assertSame("($54.00)", YAHOO.Convio.PC2.Utils.formatCurrency("-5400"));
                
                this.assertSame("$2,345.67", YAHOO.Convio.PC2.Utils.formatCurrency(234567));
                this.assertSame("$2,345.67", YAHOO.Convio.PC2.Utils.formatCurrency("234567"));
                
                this.assertSame("($2,345.67)", YAHOO.Convio.PC2.Utils.formatCurrency(-234567));
                this.assertSame("($2,345.67)", YAHOO.Convio.PC2.Utils.formatCurrency("-234567"));
                
                this.assertSame("$3,456,789.00", YAHOO.Convio.PC2.Utils.formatCurrency(345678900));
                this.assertSame("$3,456,789.00", YAHOO.Convio.PC2.Utils.formatCurrency("345678900"));
                
                this.assertSame("($3,456,789.00)", YAHOO.Convio.PC2.Utils.formatCurrency(-345678900));
                this.assertSame("($3,456,789.00)", YAHOO.Convio.PC2.Utils.formatCurrency("-345678900"));
        	}
        },

        testParseCurrency_UnexpectedLocale : function() {
        	
        	var unexpectedLocales = ["sv_SE", "123", 123];
        	
        	for (var i = 0; i < unexpectedLocales.length; i++) {
            	
        		var unexpectedLocale = unexpectedLocales[i];
        		
        		YAHOO.Convio.PC2.Config.setLocale(unexpectedLocale);
        		this.assertEqual(unexpectedLocale, YAHOO.Convio.PC2.Config.getLocale());
        		
        		YAHOO.util.Cookie.set("currency_locale", "USER", {path: "/"});
        		this.assertEqual(unexpectedLocale, YAHOO.Convio.PC2.Config.getCurrencyLocale());
        	
        		// test ability to gracefully handle non-numeric value
                this.assertTrue(isNaN(YAHOO.Convio.PC2.Utils.parseCurrency('foo')));
                
                // test ability to gracefully handle null value
                var nullVal = null;
                this.assertTrue(isNaN(YAHOO.Convio.PC2.Utils.parseCurrency(nullVal)));
                
                // test ability to gracefully handle undefined value
                var undefinedVal;
                this.assertTrue(isNaN(YAHOO.Convio.PC2.Utils.parseCurrency(undefinedVal)));
        		
        		// expected values below taken from the output of Java unit test 
        		// LocaleUtilTest.testParseAndFormatConcurrencyAreInverseOperations()
        		
                this.assertSame(1234, YAHOO.Convio.PC2.Utils.parseCurrency("$12.34"));
                this.assertSame(-1234, YAHOO.Convio.PC2.Utils.parseCurrency("($12.34)"));
                this.assertSame(-1234, YAHOO.Convio.PC2.Utils.parseCurrency("-$12.34"));
                
                this.assertSame(123400, YAHOO.Convio.PC2.Utils.parseCurrency("$1234"));
                this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("($1234)"));
                this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("-$1234"));
                
                this.assertSame(123400, YAHOO.Convio.PC2.Utils.parseCurrency("$1,234"));
                this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("($1,234)"));
                this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("-$1,234"));
                
                this.assertSame(123400, YAHOO.Convio.PC2.Utils.parseCurrency("$1,234.00"));
                this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("($1,234.00)"));
                this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("-$1,234.00"));
                
                this.assertSame(123400, YAHOO.Convio.PC2.Utils.parseCurrency("1234"));
                this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("(1234)"));
                this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("-1234"));
                
                this.assertSame(123400, YAHOO.Convio.PC2.Utils.parseCurrency("1234.00"));
                this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("(1234.00)"));
                this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("-1234.00"));
                
                this.assertSame(123456789, YAHOO.Convio.PC2.Utils.parseCurrency("$1,234,567.89"));
                this.assertSame(-123456789, YAHOO.Convio.PC2.Utils.parseCurrency("($1,234,567.89)"));
                this.assertSame(-123456789, YAHOO.Convio.PC2.Utils.parseCurrency("-$1,234,567.89"));
                
                this.assertSame(11, YAHOO.Convio.PC2.Utils.parseCurrency("00.11"));
                this.assertSame(1025, YAHOO.Convio.PC2.Utils.parseCurrency("10.25"));
                this.assertSame(1033, YAHOO.Convio.PC2.Utils.parseCurrency("10.33"));
                this.assertSame(1066, YAHOO.Convio.PC2.Utils.parseCurrency("10.66"));
                this.assertSame(1067, YAHOO.Convio.PC2.Utils.parseCurrency("10.67"));
                
        	}
        },
        
        testFormatCurrency_English_US : function () {
        	
    		var englishLocale = "en_US";
    		
    		YAHOO.Convio.PC2.Config.setLocale(englishLocale);
    		this.assertEqual(englishLocale, YAHOO.Convio.PC2.Config.getLocale());
    		this.assertEqual(englishLocale, YAHOO.Convio.PC2.Config.getCurrencyLocale());
    		
    		// expected values below taken from the output of Java unit test 
    		// LocaleUtilTest.testParseAndFormatConcurrencyAreInverseOperations()
    		
            this.assertSame("$0.17", YAHOO.Convio.PC2.Utils.formatCurrency(17));
    		this.assertSame("$0.17", YAHOO.Convio.PC2.Utils.formatCurrency("17"));
    		
            this.assertSame("$12.34", YAHOO.Convio.PC2.Utils.formatCurrency(1234));
            this.assertSame("$12.34", YAHOO.Convio.PC2.Utils.formatCurrency("1234"));
            
            this.assertSame("($12.34)", YAHOO.Convio.PC2.Utils.formatCurrency(-1234));
            this.assertSame("($12.34)", YAHOO.Convio.PC2.Utils.formatCurrency("-1234"));
            
            this.assertSame("$54.00", YAHOO.Convio.PC2.Utils.formatCurrency(5400));
            this.assertSame("$54.00", YAHOO.Convio.PC2.Utils.formatCurrency("5400"));
            
            this.assertSame("($54.00)", YAHOO.Convio.PC2.Utils.formatCurrency(-5400));
            this.assertSame("($54.00)", YAHOO.Convio.PC2.Utils.formatCurrency("-5400"));
            
            this.assertSame("$2,345.67", YAHOO.Convio.PC2.Utils.formatCurrency(234567));
            this.assertSame("$2,345.67", YAHOO.Convio.PC2.Utils.formatCurrency("234567"));
            
            this.assertSame("($2,345.67)", YAHOO.Convio.PC2.Utils.formatCurrency(-234567));
            this.assertSame("($2,345.67)", YAHOO.Convio.PC2.Utils.formatCurrency("-234567"));
            
            this.assertSame("$3,456,789.00", YAHOO.Convio.PC2.Utils.formatCurrency(345678900));
            this.assertSame("$3,456,789.00", YAHOO.Convio.PC2.Utils.formatCurrency("345678900"));
            
            this.assertSame("($3,456,789.00)", YAHOO.Convio.PC2.Utils.formatCurrency(-345678900));
            this.assertSame("($3,456,789.00)", YAHOO.Convio.PC2.Utils.formatCurrency("-345678900"));
        },

        testParseCurrency_English_US : function() {
        	
    		var englishLocale = "en_US";
    		
    		YAHOO.Convio.PC2.Config.setLocale(englishLocale);
    		this.assertEqual(englishLocale, YAHOO.Convio.PC2.Config.getLocale());
    		
    		YAHOO.util.Cookie.set("currency_locale", "USER", {path: "/"});
    		this.assertEqual(englishLocale, YAHOO.Convio.PC2.Config.getCurrencyLocale());
    	
    		// test ability to gracefully handle non-numeric value
            this.assertTrue(isNaN(YAHOO.Convio.PC2.Utils.parseCurrency('foo')));
            
            // test ability to gracefully handle null value
            var nullVal = null;
            this.assertTrue(isNaN(YAHOO.Convio.PC2.Utils.parseCurrency(nullVal)));
            
            // test ability to gracefully handle undefined value
            var undefinedVal;
            this.assertTrue(isNaN(YAHOO.Convio.PC2.Utils.parseCurrency(undefinedVal)));
    		
    		// expected values below taken from the output of Java unit test 
    		// LocaleUtilTest.testParseAndFormatConcurrencyAreInverseOperations()
    		
    		this.assertSame(1234, YAHOO.Convio.PC2.Utils.parseCurrency("$12.34"));
            this.assertSame(-1234, YAHOO.Convio.PC2.Utils.parseCurrency("($12.34)"));
            this.assertSame(-1234, YAHOO.Convio.PC2.Utils.parseCurrency("-$12.34"));
            
            this.assertSame(123400, YAHOO.Convio.PC2.Utils.parseCurrency("$1234"));
            this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("($1234)"));
            this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("-$1234"));
            
            this.assertSame(123400, YAHOO.Convio.PC2.Utils.parseCurrency("$1,234"));
            this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("($1,234)"));
            this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("-$1,234"));
            
            this.assertSame(123400, YAHOO.Convio.PC2.Utils.parseCurrency("$1,234.00"));
            this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("($1,234.00)"));
            this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("-$1,234.00"));
            
            this.assertSame(123400, YAHOO.Convio.PC2.Utils.parseCurrency("1234"));
            this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("(1234)"));
            this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("-1234"));
            
            this.assertSame(123400, YAHOO.Convio.PC2.Utils.parseCurrency("1234.00"));
            this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("(1234.00)"));
            this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("-1234.00"));
            
            this.assertSame(123456789, YAHOO.Convio.PC2.Utils.parseCurrency("$1,234,567.89"));
            this.assertSame(-123456789, YAHOO.Convio.PC2.Utils.parseCurrency("($1,234,567.89)"));
            this.assertSame(-123456789, YAHOO.Convio.PC2.Utils.parseCurrency("-$1,234,567.89"));
            
            this.assertSame(11, YAHOO.Convio.PC2.Utils.parseCurrency("00.11"));
            this.assertSame(1025, YAHOO.Convio.PC2.Utils.parseCurrency("10.25"));
            this.assertSame(1033, YAHOO.Convio.PC2.Utils.parseCurrency("10.33"));
            this.assertSame(1066, YAHOO.Convio.PC2.Utils.parseCurrency("10.66"));
            this.assertSame(1067, YAHOO.Convio.PC2.Utils.parseCurrency("10.67"));
        },
        
        testFormatCurrency_English_GB : function () {
        	
    		var englishLocale = "en_GB";
    		
    		YAHOO.Convio.PC2.Config.setLocale(englishLocale);
    		this.assertEqual(englishLocale, YAHOO.Convio.PC2.Config.getLocale());
    		
    		YAHOO.util.Cookie.set("currency_locale", "USER", {path: "/"});
    		this.assertEqual(englishLocale, YAHOO.Convio.PC2.Config.getCurrencyLocale());
    		
    		// test ability to gracefully handle non-numeric value
            this.assertSame('foo', YAHOO.Convio.PC2.Utils.formatCurrency('foo'));
            
            // test ability to gracefully handle null value
            var nullVal = null;
            this.assertSame(nullVal, YAHOO.Convio.PC2.Utils.formatCurrency(nullVal));
            
            // test ability to gracefully handle undefined value
            var undefinedVal;
            this.assertSame(undefinedVal, YAHOO.Convio.PC2.Utils.formatCurrency(undefinedVal));
    		
    		// expected values below taken from the output of Java unit test 
    		// LocaleUtilTest.testParseAndFormatConcurrencyAreInverseOperations()
    		
    		this.assertSame("£0.17", YAHOO.Convio.PC2.Utils.formatCurrency(17));
    		this.assertSame("£12.34", YAHOO.Convio.PC2.Utils.formatCurrency(1234));
            this.assertSame("-£12.34", YAHOO.Convio.PC2.Utils.formatCurrency(-1234));
            this.assertSame("£54.00", YAHOO.Convio.PC2.Utils.formatCurrency(5400));
            this.assertSame("-£54.00", YAHOO.Convio.PC2.Utils.formatCurrency(-5400));
            this.assertSame("£2,345.67", YAHOO.Convio.PC2.Utils.formatCurrency(234567));
            this.assertSame("-£2,345.67", YAHOO.Convio.PC2.Utils.formatCurrency(-234567));
            this.assertSame("£3,456,789.00", YAHOO.Convio.PC2.Utils.formatCurrency(345678900));
            this.assertSame("-£3,456,789.00", YAHOO.Convio.PC2.Utils.formatCurrency(-345678900));
        },

        testParseCurrency_English_GB : function() {
        	
    		var englishLocale = "en_GB";
    		
    		YAHOO.Convio.PC2.Config.setLocale(englishLocale);
    		this.assertEqual(englishLocale, YAHOO.Convio.PC2.Config.getLocale());
    		
    		YAHOO.util.Cookie.set("currency_locale", "USER", {path: "/"});
    		this.assertEqual(englishLocale, YAHOO.Convio.PC2.Config.getCurrencyLocale());
    	
    		// test ability to gracefully handle non-numeric value
            this.assertTrue(isNaN(YAHOO.Convio.PC2.Utils.parseCurrency('foo')));
            
            // test ability to gracefully handle null value
            var nullVal = null;
            this.assertTrue(isNaN(YAHOO.Convio.PC2.Utils.parseCurrency(nullVal)));
            
            // test ability to gracefully handle undefined value
            var undefinedVal;
            this.assertTrue(isNaN(YAHOO.Convio.PC2.Utils.parseCurrency(undefinedVal)));
    		
    		// expected values below taken from the output of Java unit test 
    		// LocaleUtilTest.testParseAndFormatConcurrencyAreInverseOperations()
    		
    		this.assertSame(1234, YAHOO.Convio.PC2.Utils.parseCurrency("£12.34"));
            this.assertSame(-1234, YAHOO.Convio.PC2.Utils.parseCurrency("(£12.34)"));
            this.assertSame(-1234, YAHOO.Convio.PC2.Utils.parseCurrency("-£12.34"));
            
            this.assertSame(123400, YAHOO.Convio.PC2.Utils.parseCurrency("£1234"));
            this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("(£1234)"));
            this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("-£1234"));
            
            this.assertSame(123400, YAHOO.Convio.PC2.Utils.parseCurrency("£1,234"));
            this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("(£1,234)"));
            this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("-£1,234"));
            
            this.assertSame(123400, YAHOO.Convio.PC2.Utils.parseCurrency("£1,234.00"));
            this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("(£1,234.00)"));
            this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("-£1,234.00"));
            
            this.assertSame(123400, YAHOO.Convio.PC2.Utils.parseCurrency("1234"));
            this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("(1234)"));
            this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("-1234"));
            
            this.assertSame(123400, YAHOO.Convio.PC2.Utils.parseCurrency("1234.00"));
            this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("(1234.00)"));
            this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("-1234.00"));
            
            this.assertSame(123456789, YAHOO.Convio.PC2.Utils.parseCurrency("£1,234,567.89"));
            this.assertSame(-123456789, YAHOO.Convio.PC2.Utils.parseCurrency("(£1,234,567.89)"));
            this.assertSame(-123456789, YAHOO.Convio.PC2.Utils.parseCurrency("-£1,234,567.89"));
            
            this.assertSame(11, YAHOO.Convio.PC2.Utils.parseCurrency("00.11"));
            this.assertSame(1025, YAHOO.Convio.PC2.Utils.parseCurrency("10.25"));
            this.assertSame(1033, YAHOO.Convio.PC2.Utils.parseCurrency("10.33"));
            this.assertSame(1066, YAHOO.Convio.PC2.Utils.parseCurrency("10.66"));
            this.assertSame(1067, YAHOO.Convio.PC2.Utils.parseCurrency("10.67"));
        },
        
        testFormatCurrency_English_CA : function () {
        	
    		var englishLocale = "en_CA";
    		
    		YAHOO.Convio.PC2.Config.setLocale(englishLocale);
    		this.assertEqual(englishLocale, YAHOO.Convio.PC2.Config.getLocale());
    		
    		YAHOO.util.Cookie.set("currency_locale", "USER", {path: "/"});
    		this.assertEqual(englishLocale, YAHOO.Convio.PC2.Config.getCurrencyLocale());
    		
    		// expected values below taken from the output of Java unit test 
    		// LocaleUtilTest.testParseAndFormatConcurrencyAreInverseOperations()
    		
            this.assertSame("$0.17", YAHOO.Convio.PC2.Utils.formatCurrency(17));
    		this.assertSame("$0.17", YAHOO.Convio.PC2.Utils.formatCurrency("17"));
    		
            this.assertSame("$12.34", YAHOO.Convio.PC2.Utils.formatCurrency(1234));
            this.assertSame("$12.34", YAHOO.Convio.PC2.Utils.formatCurrency("1234"));
            
            this.assertSame("($12.34)", YAHOO.Convio.PC2.Utils.formatCurrency(-1234));
            this.assertSame("($12.34)", YAHOO.Convio.PC2.Utils.formatCurrency("-1234"));
            
            this.assertSame("$54.00", YAHOO.Convio.PC2.Utils.formatCurrency(5400));
            this.assertSame("$54.00", YAHOO.Convio.PC2.Utils.formatCurrency("5400"));
            
            this.assertSame("($54.00)", YAHOO.Convio.PC2.Utils.formatCurrency(-5400));
            this.assertSame("($54.00)", YAHOO.Convio.PC2.Utils.formatCurrency("-5400"));
            
            this.assertSame("$2,345.67", YAHOO.Convio.PC2.Utils.formatCurrency(234567));
            this.assertSame("$2,345.67", YAHOO.Convio.PC2.Utils.formatCurrency("234567"));
            
            this.assertSame("($2,345.67)", YAHOO.Convio.PC2.Utils.formatCurrency(-234567));
            this.assertSame("($2,345.67)", YAHOO.Convio.PC2.Utils.formatCurrency("-234567"));
            
            this.assertSame("$3,456,789.00", YAHOO.Convio.PC2.Utils.formatCurrency(345678900));
            this.assertSame("$3,456,789.00", YAHOO.Convio.PC2.Utils.formatCurrency("345678900"));
            
            this.assertSame("($3,456,789.00)", YAHOO.Convio.PC2.Utils.formatCurrency(-345678900));
            this.assertSame("($3,456,789.00)", YAHOO.Convio.PC2.Utils.formatCurrency("-345678900"));
        },

        testParseCurrency_English_CA : function() {
        	
    		var englishLocale = "en_CA";
    		
    		YAHOO.Convio.PC2.Config.setLocale(englishLocale);
    		this.assertEqual(englishLocale, YAHOO.Convio.PC2.Config.getLocale());
    		
    		YAHOO.util.Cookie.set("currency_locale", "USER", {path: "/"});
    		this.assertEqual(englishLocale, YAHOO.Convio.PC2.Config.getCurrencyLocale());
    	
    		// test ability to gracefully handle non-numeric value
            this.assertTrue(isNaN(YAHOO.Convio.PC2.Utils.parseCurrency('foo')));
            
            // test ability to gracefully handle null value
            var nullVal = null;
            this.assertTrue(isNaN(YAHOO.Convio.PC2.Utils.parseCurrency(nullVal)));
            
            // test ability to gracefully handle undefined value
            var undefinedVal;
            this.assertTrue(isNaN(YAHOO.Convio.PC2.Utils.parseCurrency(undefinedVal)));
    		
    		// expected values below taken from the output of Java unit test 
    		// LocaleUtilTest.testParseAndFormatConcurrencyAreInverseOperations()
    		
    		this.assertSame(1234, YAHOO.Convio.PC2.Utils.parseCurrency("$12.34"));
            this.assertSame(-1234, YAHOO.Convio.PC2.Utils.parseCurrency("($12.34)"));
            this.assertSame(-1234, YAHOO.Convio.PC2.Utils.parseCurrency("-$12.34"));
            
            this.assertSame(123400, YAHOO.Convio.PC2.Utils.parseCurrency("$1234"));
            this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("($1234)"));
            this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("-$1234"));
            
            this.assertSame(123400, YAHOO.Convio.PC2.Utils.parseCurrency("$1,234"));
            this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("($1,234)"));
            this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("-$1,234"));
            
            this.assertSame(123400, YAHOO.Convio.PC2.Utils.parseCurrency("$1,234.00"));
            this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("($1,234.00)"));
            this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("-$1,234.00"));
            
            this.assertSame(123400, YAHOO.Convio.PC2.Utils.parseCurrency("1234"));
            this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("(1234)"));
            this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("-1234"));
            
            this.assertSame(123400, YAHOO.Convio.PC2.Utils.parseCurrency("1234.00"));
            this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("(1234.00)"));
            this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("-1234.00"));
            
            this.assertSame(123456789, YAHOO.Convio.PC2.Utils.parseCurrency("$1,234,567.89"));
            this.assertSame(-123456789, YAHOO.Convio.PC2.Utils.parseCurrency("($1,234,567.89)"));
            this.assertSame(-123456789, YAHOO.Convio.PC2.Utils.parseCurrency("-$1,234,567.89"));
            
            this.assertSame(11, YAHOO.Convio.PC2.Utils.parseCurrency("00.11"));
            this.assertSame(1025, YAHOO.Convio.PC2.Utils.parseCurrency("10.25"));
            this.assertSame(1033, YAHOO.Convio.PC2.Utils.parseCurrency("10.33"));
            this.assertSame(1066, YAHOO.Convio.PC2.Utils.parseCurrency("10.66"));
            this.assertSame(1067, YAHOO.Convio.PC2.Utils.parseCurrency("10.67"));
        },

        testFormatCurrency_Spanish_US : function () {
        	
    		var spanishLocale = "es_US";
    		
    		YAHOO.Convio.PC2.Config.setLocale(spanishLocale);
    		this.assertEqual(spanishLocale, YAHOO.Convio.PC2.Config.getLocale());
    		
    		YAHOO.util.Cookie.set("currency_locale", "USER", {path: "/"});
    		this.assertEqual(spanishLocale, YAHOO.Convio.PC2.Config.getCurrencyLocale());
    		
    		// test ability to gracefully handle non-numeric value
            this.assertSame('foo', YAHOO.Convio.PC2.Utils.formatCurrency('foo'));
            
            // test ability to gracefully handle null value
            var nullVal = null;
            this.assertSame(nullVal, YAHOO.Convio.PC2.Utils.formatCurrency(nullVal));
            
            // test ability to gracefully handle undefined value
            var undefinedVal;
            this.assertSame(undefinedVal, YAHOO.Convio.PC2.Utils.formatCurrency(undefinedVal));
    		
    		// expected values below taken from the output of Java unit test 
    		// LocaleUtilTest.testParseAndFormatConcurrencyAreInverseOperations()
    		
    		this.assertSame("US$0.17", YAHOO.Convio.PC2.Utils.formatCurrency(17));
    		this.assertSame("US$12.34", YAHOO.Convio.PC2.Utils.formatCurrency(1234));
            this.assertSame("(US$12.34)", YAHOO.Convio.PC2.Utils.formatCurrency(-1234));
            this.assertSame("US$54.00", YAHOO.Convio.PC2.Utils.formatCurrency(5400));
            this.assertSame("(US$54.00)", YAHOO.Convio.PC2.Utils.formatCurrency(-5400));
            this.assertSame("US$2,345.67", YAHOO.Convio.PC2.Utils.formatCurrency(234567));
            this.assertSame("(US$2,345.67)", YAHOO.Convio.PC2.Utils.formatCurrency(-234567));
            this.assertSame("US$3,456,789.00", YAHOO.Convio.PC2.Utils.formatCurrency(345678900));
            this.assertSame("(US$3,456,789.00)", YAHOO.Convio.PC2.Utils.formatCurrency(-345678900));
        },

        testParseCurrency_Spanish_US : function() {
        	
    		var spanishLocale = "es_US";
    		
    		YAHOO.Convio.PC2.Config.setLocale(spanishLocale);
    		this.assertEqual(spanishLocale, YAHOO.Convio.PC2.Config.getLocale());
    		
    		YAHOO.util.Cookie.set("currency_locale", "USER", {path: "/"});
    		this.assertEqual(spanishLocale, YAHOO.Convio.PC2.Config.getCurrencyLocale());
    	
    		// test ability to gracefully handle non-numeric value
            this.assertTrue(isNaN(YAHOO.Convio.PC2.Utils.parseCurrency('foo')));
            
            // test ability to gracefully handle null value
            var nullVal = null;
            this.assertTrue(isNaN(YAHOO.Convio.PC2.Utils.parseCurrency(nullVal)));
            
            // test ability to gracefully handle undefined value
            var undefinedVal;
            this.assertTrue(isNaN(YAHOO.Convio.PC2.Utils.parseCurrency(undefinedVal)));
    		
    		// expected values below taken from the output of Java unit test 
    		// LocaleUtilTest.testParseAndFormatConcurrencyAreInverseOperations()
    		
    		this.assertSame(1234, YAHOO.Convio.PC2.Utils.parseCurrency("US$12.34"));
    		this.assertSame(1234, YAHOO.Convio.PC2.Utils.parseCurrency("$12.34"));
            this.assertSame(-1234, YAHOO.Convio.PC2.Utils.parseCurrency("(US$12.34)"));
            this.assertSame(-1234, YAHOO.Convio.PC2.Utils.parseCurrency("-US$12.34"));
            
            this.assertSame(123400, YAHOO.Convio.PC2.Utils.parseCurrency("US$1234"));
            this.assertSame(123400, YAHOO.Convio.PC2.Utils.parseCurrency("$1234"));            		
            this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("(US$1234)"));
            this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("-US$1234"));
            
            this.assertSame(123400, YAHOO.Convio.PC2.Utils.parseCurrency("US$1,234"));
            this.assertSame(123400, YAHOO.Convio.PC2.Utils.parseCurrency("$1,234"));
            this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("(US$1,234)"));
            this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("-US$1,234"));
            
            this.assertSame(123400, YAHOO.Convio.PC2.Utils.parseCurrency("US$1,234.00"));
            this.assertSame(123400, YAHOO.Convio.PC2.Utils.parseCurrency("$1,234.00"));
            this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("(US$1,234.00)"));
            this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("-US$1,234.00"));
            
            this.assertSame(123400, YAHOO.Convio.PC2.Utils.parseCurrency("1234"));
            this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("(1234)"));
            this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("-1234"));
            
            this.assertSame(123400, YAHOO.Convio.PC2.Utils.parseCurrency("1234.00"));
            this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("(1234.00)"));
            this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("-1234.00"));
            
            this.assertSame(123456789, YAHOO.Convio.PC2.Utils.parseCurrency("US$1,234,567.89"));
            this.assertSame(123456789, YAHOO.Convio.PC2.Utils.parseCurrency("$1,234,567.89"));
            this.assertSame(-123456789, YAHOO.Convio.PC2.Utils.parseCurrency("(US$1,234,567.89)"));
            this.assertSame(-123456789, YAHOO.Convio.PC2.Utils.parseCurrency("-US$1,234,567.89"));
            
            this.assertSame(11, YAHOO.Convio.PC2.Utils.parseCurrency("00.11"));
            this.assertSame(1025, YAHOO.Convio.PC2.Utils.parseCurrency("10.25"));
            this.assertSame(1033, YAHOO.Convio.PC2.Utils.parseCurrency("10.33"));
            this.assertSame(1066, YAHOO.Convio.PC2.Utils.parseCurrency("10.66"));
            this.assertSame(1067, YAHOO.Convio.PC2.Utils.parseCurrency("10.67"));
        },
        
        testFormatCurrency_French_CA : function () {
        	
    		var frenchLocale = "fr_CA";
    		
    		YAHOO.Convio.PC2.Config.setLocale(frenchLocale);
    		this.assertEqual(frenchLocale, YAHOO.Convio.PC2.Config.getLocale());
    		
    		YAHOO.util.Cookie.set("currency_locale", "USER", {path: "/"});
    		this.assertEqual(frenchLocale, YAHOO.Convio.PC2.Config.getCurrencyLocale());
    		
    		// test ability to gracefully handle non-numeric value
            this.assertSame('foo', YAHOO.Convio.PC2.Utils.formatCurrency('foo'));
            
            // test ability to gracefully handle null value
            var nullVal = null;
            this.assertSame(nullVal, YAHOO.Convio.PC2.Utils.formatCurrency(nullVal));
            
            // test ability to gracefully handle undefined value
            var undefinedVal;
            this.assertSame(undefinedVal, YAHOO.Convio.PC2.Utils.formatCurrency(undefinedVal));
    		
    		// expected values below taken from the output of Java unit test 
    		// LocaleUtilTest.testParseAndFormatConcurrencyAreInverseOperations()
    		
    		this.assertSame("12,34 $", YAHOO.Convio.PC2.Utils.formatCurrency(1234));
            this.assertSame("-12,34 $", YAHOO.Convio.PC2.Utils.formatCurrency(-1234));
            this.assertSame("54,00 $", YAHOO.Convio.PC2.Utils.formatCurrency(5400));
            this.assertSame("-54,00 $", YAHOO.Convio.PC2.Utils.formatCurrency(-5400));
            this.assertSame("2 345,67 $", YAHOO.Convio.PC2.Utils.formatCurrency(234567));
            this.assertSame("-2 345,67 $", YAHOO.Convio.PC2.Utils.formatCurrency(-234567));
            this.assertSame("3 456 789,00 $", YAHOO.Convio.PC2.Utils.formatCurrency(345678900));
            this.assertSame("-3 456 789,00 $", YAHOO.Convio.PC2.Utils.formatCurrency(-345678900));
        },

        testParseCurrency_French_CA : function() {
        	
    		var frenchLocale = "fr_CA";
    		
    		YAHOO.Convio.PC2.Config.setLocale(frenchLocale);
    		this.assertEqual(frenchLocale, YAHOO.Convio.PC2.Config.getLocale());
    		
    		YAHOO.util.Cookie.set("currency_locale", "USER", {path: "/"});
    		this.assertEqual(frenchLocale, YAHOO.Convio.PC2.Config.getCurrencyLocale());
    	
    		// test ability to gracefully handle non-numeric value
            this.assertTrue(isNaN(YAHOO.Convio.PC2.Utils.parseCurrency('foo')));
            
            // test ability to gracefully handle null value
            var nullVal = null;
            this.assertTrue(isNaN(YAHOO.Convio.PC2.Utils.parseCurrency(nullVal)));
            
            // test ability to gracefully handle undefined value
            var undefinedVal;
            this.assertTrue(isNaN(YAHOO.Convio.PC2.Utils.parseCurrency(undefinedVal)));
    		
    		// expected values below taken from the output of Java unit test 
    		// LocaleUtilTest.testParseAndFormatConcurrencyAreInverseOperations()
    		
    		this.assertSame(1234, YAHOO.Convio.PC2.Utils.parseCurrency("12,34 $"));
    		this.assertSame(1234, YAHOO.Convio.PC2.Utils.parseCurrency("12,34 $CA"));
            this.assertSame(-1234, YAHOO.Convio.PC2.Utils.parseCurrency("(12,34$)"));
            this.assertSame(-1234, YAHOO.Convio.PC2.Utils.parseCurrency("-12,34$"));
            
            this.assertSame(123400, YAHOO.Convio.PC2.Utils.parseCurrency("1234 $"));
            this.assertSame(123400, YAHOO.Convio.PC2.Utils.parseCurrency("1234 $CA"));
            this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("(1234$)"));
            this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("-1234$"));
            
            this.assertSame(123400, YAHOO.Convio.PC2.Utils.parseCurrency("1 234 $"));
            this.assertSame(123400, YAHOO.Convio.PC2.Utils.parseCurrency("1 234 $CA"));
            this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("(1 234$)"));
            this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("-1 234$"));
            
            this.assertSame(123400, YAHOO.Convio.PC2.Utils.parseCurrency("1 234,00 $"));
            this.assertSame(123400, YAHOO.Convio.PC2.Utils.parseCurrency("1 234,00 $CA"));
            this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("(1 234,00$)"));
            this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("-1 234,00$"));
            
            this.assertSame(123400, YAHOO.Convio.PC2.Utils.parseCurrency("1234"));
            this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("(1234)"));
            this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("-1234"));
            
            this.assertSame(123400, YAHOO.Convio.PC2.Utils.parseCurrency("1234,00"));
            this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("(1234,00)"));
            this.assertSame(-123400, YAHOO.Convio.PC2.Utils.parseCurrency("-1234,00"));
            
            this.assertSame(123456789, YAHOO.Convio.PC2.Utils.parseCurrency("1 234 567,89 $"));
            this.assertSame(123456789, YAHOO.Convio.PC2.Utils.parseCurrency("1 234 567,89 $CA"));
            this.assertSame(-123456789, YAHOO.Convio.PC2.Utils.parseCurrency("(1 234 567,89$)"));
            this.assertSame(-123456789, YAHOO.Convio.PC2.Utils.parseCurrency("-1 234 567,89$"));
            
            this.assertSame(11, YAHOO.Convio.PC2.Utils.parseCurrency("00,11"));
            this.assertSame(1025, YAHOO.Convio.PC2.Utils.parseCurrency("10,25"));
            this.assertSame(1033, YAHOO.Convio.PC2.Utils.parseCurrency("10,33"));
            this.assertSame(1066, YAHOO.Convio.PC2.Utils.parseCurrency("10,66"));
            this.assertSame(1067, YAHOO.Convio.PC2.Utils.parseCurrency("10,67"));
        },
        
        testFormatAndParseCurrencyAreInverseOperations : function() {
        	
        	// See also the LocaleUtilTest.testParseAndFormatConcurrencyAreInverseOperations() test class 
        	// which exercises the Java version of these methods
        	
    		var localesToTest = [ 'en', 'en_US', 'en_GB', 'en_CA', 'es', 'es_US', 'fr', 'fr_CA' ];

    		var amountsToTest = [ 0, 1, -1, 1234, -1234, 5400, -5400, 234567, -234567, 345678900, -345678900 ];

    		for (var i = 0; i < localesToTest.length; i++)
    		{
    			var locale = localesToTest[i];

    			YAHOO.Convio.PC2.Config.setLocale(locale);
        		this.assertEqual(locale, YAHOO.Convio.PC2.Config.getLocale());
        		
        		YAHOO.util.Cookie.set("currency_locale", "USER", {path: "/"});
        		this.assertEqual(locale, YAHOO.Convio.PC2.Config.getCurrencyLocale());

    			for (var j = 0; j < amountsToTest.length; j++)
    			{
    				var amount = amountsToTest[j];

    				var formattedCurrency = YAHOO.Convio.PC2.Utils.formatCurrency(amount);
    				this.assertWellDefined(formattedCurrency);
    				
    				var unformattedCurrency = YAHOO.Convio.PC2.Utils.parseCurrency(formattedCurrency);
    				this.assertWellDefined(unformattedCurrency);

    				this.assertEqual(amount, unformattedCurrency);
    			}

    		}
        },
        
        testCleanupCurrency : function() {
            // This method should add a $ to the beginning if necessary
            this.assertSame("$2,345.67", YAHOO.Convio.PC2.Utils.cleanupCurrency("2,345.67"));
            this.assertSame("$2,345.67", YAHOO.Convio.PC2.Utils.cleanupCurrency("$2,345.67"));

            // This method should add .00 if no floating point exists
            this.assertSame("$2,345.00", YAHOO.Convio.PC2.Utils.cleanupCurrency("$2,345"));
            
            // This method does NOT add nice commas
            this.assertNotSame("$2,345.67", YAHOO.Convio.PC2.Utils.cleanupCurrency("2345.67"));
        },

        testResetTimeout : function() {
            resetTimeout();
            var oldKeepAliveLoadTime = keepAliveLoadTime;
            this.wait(function() {
                resetTimeout();
            }, 100);
            
            Y.assert(oldKeepAliveLoadTime < keepAliveLoadTime, "The old time should be less than the new time.");
            clearTimeout(keepAliveForceTimer);
            clearTimeout(keepAliveDialogTimer);
            clearInterval(keepAliveTimer);
        },

        testMergeArrays : function() {
            var array1 = [ "abc", "def", "ghi" ];
            var array2 = [ "jkl", "mno" ];
            var array3 = YAHOO.Convio.PC2.Utils.mergeArrays(array1, array2);
            this.assertSame("abc", array3[0]);
            this.assertSame("def", array3[1]);
            this.assertSame("ghi", array3[2]);
            this.assertSame("jkl", array3[3]);
            this.assertSame("mno", array3[4]);

            delete array1;
            delete array2;
            delete array3;
        },

        testGetUrlParam : function() {
            var url = this.fakeBaseUrl + "FakeServlet?param1=abc&param2=123";
            this.assertSame("abc", YAHOO.Convio.PC2.Utils.getUrlParam("param1", url));
            this.assertSame("123", YAHOO.Convio.PC2.Utils.getUrlParam("param2", url));
        },

        testGetPercentText : function() {
        	this.assertSame("20%", YAHOO.Convio.PC2.Utils.getPercentText(1, 5));
        	this.assertSame("25%", YAHOO.Convio.PC2.Utils.getPercentText(1, 4));
            this.assertSame("33%", YAHOO.Convio.PC2.Utils.getPercentText(1, 3));
            this.assertSame("50%", YAHOO.Convio.PC2.Utils.getPercentText(1, 2));
        },

        testLoadPage : function() {
            var customLoaded = false;
            var showLoadingContainerLoaded = false;
            var hideLoadingContainerLoaded = false;
            var loadMessagesLoaded = false;
            
            var oldShowLoading = YAHOO.Convio.PC2.Utils.showLoadingContainer;
            var oldHideLoading = YAHOO.Convio.PC2.Utils.hideLoadingContainer;
            var oldLoadMessages = YAHOO.Convio.PC2.Utils.loadMessages;
            
            loadCustomHandlers = function() {
                customLoaded = true;
            }
            
            YAHOO.Convio.PC2.Utils.showLoadingContainer = function() {
                if(!showLoadingContainerLoaded) {
                    showLoadingContainerLoaded = true;
                } else {
                    Y.assert(false, "showLoadingContainer called multiple times.");
                }
            }
            YAHOO.Convio.PC2.Utils.hideLoadingContainer = function() {
                if(!hideLoadingContainerLoaded) {
                    hideLoadingContainerLoaded = true;
                } else {
                    Y.assert(false, "hideLoadingContainer called multiple times.");
                }
            }
            YAHOO.Convio.PC2.Utils.loadMessages = function() {
                if(!loadMessagesLoaded) {
                    loadMessagesLoaded = true;
                } else {
                    Y.assert(false, "loadMessages called multiple times.");
                }
            }
            
            YAHOO.Convio.PC2.Utils.loadPage();

            Y.assert(customLoaded, "Should have loaded custom.");
            Y.assert(showLoadingContainerLoaded, "Should have shown loading container.");
            Y.assert(loadMessagesLoaded, "Should have loaded messages.");
            Y.assert(!hideLoadingContainerLoaded, "Should not have hidden loading container yet.");

            YAHOO.Convio.PC2.Utils.publisher.fire("pc2:registrationLoaded");
            YAHOO.Convio.PC2.Utils.publisher.fire("pc2:constituentLoaded");
            YAHOO.Convio.PC2.Utils.publisher.fire("pc2:configurationLoaded");
            YAHOO.Convio.PC2.Utils.publisher.fire("pc2:wrapperLoaded");
            Y.assert(hideLoadingContainerLoaded, "Should have hidden loading container.");
            
            YAHOO.Convio.PC2.Utils.showLoadingContainer = oldShowLoading;
            YAHOO.Convio.PC2.Utils.hideLoadingContainer = oldHideLoading;
            YAHOO.Convio.PC2.Utils.loadMessages = oldLoadMessages;

            delete customLoaded;
            delete showLoadingContainerLoaded;
            delete hideLoadingContainerLoaded;
            delete loadMessagesLoaded;
        },

        testEncodeMultipleIds : function() {
            var testArray = [ "abc", "def", "ghi" ];
            this.assertSame("abc,def,ghi", YAHOO.Convio.PC2.Utils.encodeMultipleIds(testArray));
            testArray = "abc";
            this.assertSame("abc", YAHOO.Convio.PC2.Utils.encodeMultipleIds(testArray));
            testArray = null;
            this.assertSame("", YAHOO.Convio.PC2.Utils.encodeMultipleIds(testArray));
            testArray = [ "abc def", "ghi"];
            this.assertSame("abc%20def,ghi", YAHOO.Convio.PC2.Utils.encodeMultipleIds(testArray));

            delete testArray;
        },

        testFormatDate : function() {
            var testDate = new Date("May 25, 2010 13:23:00");
            this.assertSame("1:23 pm", formatTime(testDate));

            testDate = new Date("May 24, 2010 00:00:00");
            this.assertSame("12:00 am", formatTime(testDate));

            testDate = new Date("May 23, 2010 01:02:03");
            this.assertSame("1:02 am", formatTime(testDate));

            delete testDate;
        },

        testAsyncRequest : function() {
            var oldResetTimeout = resetTimeout;
            var resetTimeoutCalled = false;
            var asyncFailureMade = false;
            resetTimeout = function() {
                resetTimeoutCalled = true;
            }
            
            YAHOO.Convio.PC2.Utils.asyncRequest("GET", "http://localhost:0/no-response", {
                success: function(o) {
                	alert("Success!!");
                },
                failure: function(o) {
                	alert("Fail!");
                    asyncFailureMade = true;
                },
                scope: this
            });
            Y.assert(resetTimeoutCalled, "Reset should have been called.");
            this.wait(function() {
                Y.assert(asyncFailureMade, 'Call should have failed.');
            }, 500);
            resetTimeout = oldResetTimeout;
        },

        testGetListCriteriaParams : function() {
            var listCriteria = null;
            this.assertSame("", YAHOO.Convio.PC2.Utils.getListCriteriaParams(listCriteria));
            listCriteria = { 
            };
            this.assertSame("&list_page_size=10&list_page_offset=0", YAHOO.Convio.PC2.Utils.getListCriteriaParams(listCriteria));
            listCriteria = {
                filterText : "abc def",
                pageSize : 25,
                pageOffset : 1,
                isAscending : true,
                sortColumn : "name",
                timestamp : 100
            };
            this.assertSame(
                    "&list_filter_text=abc%20def&list_page_size=25&list_page_offset=1&list_ascending=true&list_sort_column=name&timestamp=100",
                    YAHOO.Convio.PC2.Utils.getListCriteriaParams(listCriteria));
            
        },

        testLoadMessages : function() {
            var oldGetMessageBundle = YAHOO.Convio.PC2.Content.getMessageBundle;
            YAHOO.Convio.PC2.Content.getMessageBundle = function(handler, keys, bundle) {
                Y.assert(handler.success.toString().indexOf("loadSecondStage()") > -1, "Success handler should load the second stage.");
            }
            YAHOO.Convio.PC2.Utils.loadMessages();
            YAHOO.Convio.PC2.Content.getMessageBundle = oldGetMessageBundle;
        },

        testGetCommonRequestParams : function() {
            this.assertSame("&api_key=fake_key_123&v=1.0&auth=fake_auth", YAHOO.Convio.PC2.Utils.getCommonRequestParams());
        },

        testGetNoAuthRequestParams : function() {
            this.assertSame("&api_key=fake_key_123&v=1.0", YAHOO.Convio.PC2.Utils.getNoAuthRequestParams());
        },

        testGetMonthString: function() {
            this.assertSame("Jan", getMonthString("01"));
            this.assertSame("Feb", getMonthString("02"));
            this.assertSame("Mar", getMonthString("03"));
            this.assertSame("Apr", getMonthString("04"));
            this.assertSame("May", getMonthString("05"));
            this.assertSame("Jun", getMonthString("06"));
            this.assertSame("Jul", getMonthString("07"));
            this.assertSame("Aug", getMonthString("08"));
            this.assertSame("Sep", getMonthString("09"));
            this.assertSame("Oct", getMonthString("10"));
            this.assertSame("Nov", getMonthString("11"));
            this.assertSame("Dec", getMonthString("12"));
            // Negative testing
            this.assertSame(undefined, getMonthString("13"));
            this.assertSame(undefined, getMonthString("Jan"));
            this.assertSame(undefined, getMonthString(null));
        },

        testLoadingContainer : function() {
            YAHOO.Convio.PC2.Utils.showLoadingContainer();
            this.wait(function() {
                YAHOO.Convio.PC2.Utils.hideLoadingContainer();
            }, 300);
            Y.assert(document.getElementById("wait").innerHTML.indexOf("Testing wait screen") > -1, "Should have our testing message.");
        },

        testTimingOutDialog : function() {
            initKeepAliveDialog();
            keepAliveLoadTime -= YAHOO.Convio.PC2.Config.getTimeoutWarning();
            showKeepAliveDialog();
            this.wait(function() {
                keepAliveDialog.hide();
            }, 500);
            Y.assert(document.getElementById("keepAlive").innerHTML.indexOf("session will expire in") > -1, "Should have info about session expiration");
            
        },

        testTimedOutDialog: function() {
            keepAliveLoadTime -= YAHOO.Convio.PC2.Config.getTimeoutExpiration();
            showKeepAliveDialog();
            this.wait(function() {
                keepAliveDialog.hide();
            }, 500);
            Y.assert(document.getElementById("keepAlive").innerHTML.indexOf("session expired at") > -1, "Should have info about session expiration");
        },

        testExtractJavascript : function() {
            var testHtml = "<html><script>\n<!-- //\n alert('hello'); \n // --><\/script><\/html>";
            Y.assert(YAHOO.Convio.PC2.Utils.extractJavaScriptFromHtml(testHtml)[0].indexOf("alert('hello');") > -1, "Should contain an alert.");
        },
        
        testIsIFrameDetected_NoFrame : function() {
            this.assertFalse(YAHOO.Convio.PC2.Utils.isIFrameDetected());
        },
        
        testIsIFrameDetected_InFrame : function() {
        	var inlineFrame = YAHOO.util.Dom.get('embeddedParticipantCenter');
        	this.assertWellDefined(inlineFrame);
        	this.assertTrue(inlineFrame.contentWindow.isIFrameDetected());
        },
        
        testResizeFrameForCurrentView_NoFrame : function() {
            // should not throw exception when calling resizeFrameForCurrentView() from non-iFrame context
        	YAHOO.Convio.PC2.Utils.resizeFrameForCurrentView();
        },
        
        testResizeFrameForCurrentView_InFrame : function() {
        	
        	// get the iFrame
        	var inlineFrame = YAHOO.util.Dom.get('embeddedParticipantCenter');
        	this.assertWellDefined(inlineFrame);
        	
        	// set the iFrame's height to zero
        	inlineFrame.height = 0;
        	this.assertFalse(inlineFrame.height > 0);
        	
        	// call resize on iFrame
        	inlineFrame.contentWindow.resizeFrameForCurrentView();
        	
        	// confirm that iFrame height is now greater than zero
        	var heightAfterResize = inlineFrame.height;
        	this.assertTrue(heightAfterResize > 0);
        	
        	// double the iFrame's height 
        	inlineFrame.height = heightAfterResize * 2;
        	this.assertNotEqual(heightAfterResize, inlineFrame.height);
        	
        	// call resize on iFrame
        	inlineFrame.contentWindow.resizeFrameForCurrentView();
        	
        	// confirm that iFrame height was reduced back down to reasonable size
        	this.assertEqual(heightAfterResize, inlineFrame.height);
        	
        	// call resize on iFrame several more times
        	for (var i = 0; i < 10; i++) {
        		inlineFrame.contentWindow.resizeFrameForCurrentView();
        	}
        	
        	// confirm that iFrame did not change
        	this.assertEqual(heightAfterResize, inlineFrame.height);
        	
        },
        
        testFormatPaymentType_Undefined : function() {
        	var undefinedVar;
        	this.assertEqual('',  YAHOO.Convio.PC2.Utils.formatPaymentType(undefinedVar));
        },
        
        testFormatPaymentType_Blank : function() {
        	this.assertEqual('',  YAHOO.Convio.PC2.Utils.formatPaymentType(''));
        },
        
        testFormatPaymentType_Null : function() {
        	this.assertEqual('',  YAHOO.Convio.PC2.Utils.formatPaymentType(null));
        },
        
        testFormatPaymentType_String_Upper : function() {
        	this.assertEqual('cash',  YAHOO.Convio.PC2.Utils.formatPaymentType('CASH'));
        	this.assertEqual('check',  YAHOO.Convio.PC2.Utils.formatPaymentType('CHECK'));
        	this.assertEqual('credit',  YAHOO.Convio.PC2.Utils.formatPaymentType('CREDIT'));
        },
        
        testFormatPaymentType_String_Lower : function() {
        	this.assertEqual('cash',  YAHOO.Convio.PC2.Utils.formatPaymentType('cash'));
        	this.assertEqual('check',  YAHOO.Convio.PC2.Utils.formatPaymentType('check'));
        	this.assertEqual('credit',  YAHOO.Convio.PC2.Utils.formatPaymentType('credit'));
        },
        
        testFormatPaymentType_String_Camel : function() {
        	this.assertEqual('cash',  YAHOO.Convio.PC2.Utils.formatPaymentType('Cash'));
        	this.assertEqual('check',  YAHOO.Convio.PC2.Utils.formatPaymentType('Check'));
        	this.assertEqual('credit',  YAHOO.Convio.PC2.Utils.formatPaymentType('Credit'));
        },
        
        testFormatPaymentType_UnrecognizedPaymentTypes : function() {
        	this.assertEqual('-1',  YAHOO.Convio.PC2.Utils.formatPaymentType(-1));
        	this.assertEqual('0',  YAHOO.Convio.PC2.Utils.formatPaymentType(0));
        	this.assertEqual('1',  YAHOO.Convio.PC2.Utils.formatPaymentType(1));
        	this.assertEqual('219387',  YAHOO.Convio.PC2.Utils.formatPaymentType(219387));
        	this.assertEqual('foo bar',  YAHOO.Convio.PC2.Utils.formatPaymentType('foo bar'));
        },
        
        testProgressBar_initAndCompleteProgressBar: function() {
        	
        	// init the progress bar and confirm that we have a valid reference
        	YAHOO.Convio.PC2.Utils.ProgressBar.initProgressBar();
        	this.assertWellDefined(YAHOO.Convio.PC2.Utils.ProgressBar.Instance);
        	
        	// initial value of progress bar should be zero or greater
        	var progressT1 = YAHOO.Convio.PC2.Utils.ProgressBar.getProgressBarValue()
        	this.assertTrue(progressT1 >= 0);
        	
        	// initialization should have started a background thread that 
        	// slowly increments the progress bar
        	this.wait(function() {
        		var progressT2 = YAHOO.Convio.PC2.Utils.ProgressBar.getProgressBarValue()
        		this.assertTrue(progressT2 > progressT1);
            }, 3 * 1000);
        	
        	// finalize the progress bar and assert expected side effects
        	YAHOO.Convio.PC2.Utils.ProgressBar.completeProgressBar();
        	this.assertEqual(100, YAHOO.Convio.PC2.Utils.ProgressBar.getProgressBarValue());
        	
        },
        
        testProgressBar_incrementProgressBarValue: function() {
        	var progressVal = YAHOO.Convio.PC2.Utils.ProgressBar.getProgressBarValue();
        	YAHOO.Convio.PC2.Utils.ProgressBar.incrementProgressBarValue();
        	this.assertEqual(Math.min(100, progressVal + 1), YAHOO.Convio.PC2.Utils.ProgressBar.getProgressBarValue()); 
        },
        
        testProgressBar_getAndSetProgressBarValue: function() {
        	
        	YAHOO.Convio.PC2.Utils.ProgressBar.setProgressBarValue(-1);
        	this.assertEqual(0, YAHOO.Convio.PC2.Utils.ProgressBar.getProgressBarValue());
        	this.assertEqual(100, YAHOO.Convio.PC2.Utils.ProgressBar.getRemainingWorkValue());
        	
        	YAHOO.Convio.PC2.Utils.ProgressBar.setProgressBarValue(0);
        	this.assertEqual(0, YAHOO.Convio.PC2.Utils.ProgressBar.getProgressBarValue());
        	this.assertEqual(100, YAHOO.Convio.PC2.Utils.ProgressBar.getRemainingWorkValue());
        	
        	YAHOO.Convio.PC2.Utils.ProgressBar.setProgressBarValue(1);
        	this.assertEqual(1, YAHOO.Convio.PC2.Utils.ProgressBar.getProgressBarValue());
        	this.assertEqual(99, YAHOO.Convio.PC2.Utils.ProgressBar.getRemainingWorkValue());
        	
        	YAHOO.Convio.PC2.Utils.ProgressBar.setProgressBarValue(50);
        	this.assertEqual(50, YAHOO.Convio.PC2.Utils.ProgressBar.getProgressBarValue());
        	this.assertEqual(50, YAHOO.Convio.PC2.Utils.ProgressBar.getRemainingWorkValue());
        	
        	YAHOO.Convio.PC2.Utils.ProgressBar.setProgressBarValue(100);
        	this.assertEqual(100, YAHOO.Convio.PC2.Utils.ProgressBar.getProgressBarValue());
        	this.assertEqual(0, YAHOO.Convio.PC2.Utils.ProgressBar.getRemainingWorkValue());
        	
        	YAHOO.Convio.PC2.Utils.ProgressBar.setProgressBarValue(101);
        	this.assertEqual(100, YAHOO.Convio.PC2.Utils.ProgressBar.getProgressBarValue());
        	this.assertEqual(0, YAHOO.Convio.PC2.Utils.ProgressBar.getRemainingWorkValue());
        	
        	YAHOO.Convio.PC2.Utils.ProgressBar.setProgressBarValue(50);
        	this.assertEqual(50, YAHOO.Convio.PC2.Utils.ProgressBar.getProgressBarValue());
        	this.assertEqual(50, YAHOO.Convio.PC2.Utils.ProgressBar.getRemainingWorkValue());
        	
        },
        
        testGetMsgCatKeys: function() {
        	var keys = YAHOO.Convio.PC2.Utils.getMsgCatKeys();
        	this.assertWellDefined(keys);
        },
        
        testGetMsgCatKeys_Performance: function() {
        	
        	Y.Profiler.registerFunction("YAHOO.Convio.PC2.Utils.getMsgCatKeys");
        	
        	var keys = YAHOO.Convio.PC2.Utils.getMsgCatKeys();
        	
        	var timeToGetKeys = Y.Profiler.getAverage("YAHOO.Convio.PC2.Utils.getMsgCatKeys");
        	
        	Y.Profiler.unregisterFunction("YAHOO.Convio.PC2.Utils.getMsgCatKeys");
        	
        	// time to construct array of msg cat keys should be quite small
        	this.assertNotMoreThan(timeToGetKeys, 20);
        },
        
        testConvertSpecialDoubleQuotesToRegularDoubleQuotes: function() {
        	var stringWithSpecialQuotes = "I am the 'Walrus'.  I am the \"Egg Man\". I am the \u201cResurrection\u201d. I am the Light.  I am Jack's “Complete Lack of Surprise”.  I am Jack's “Smirking Revenge”."; 
        	var expectedConversion = "I am the 'Walrus'.  I am the \"Egg Man\". I am the \"Resurrection\". I am the \"Light\".  I am Jack's \"Complete Lack of Surprise\".  I am Jack's \"Smirking Revenge\".";
        	this.assertEqual(expectedConversion, YAHOO.Convio.PC2.Utils.convertSpecialDoubleQuotesToRegularDoubleQuotes(stringWithSpecialQuotes));
        },
        
        testTruncateText: function() {
        	
        	// expect non-string values to just be returned
        	var obj = {};
        	this.assertEqual(obj, YAHOO.Convio.PC2.Utils.truncateText(obj));
        	this.assertEqual(123, YAHOO.Convio.PC2.Utils.truncateText(123));
        	
        	// test no truncation needed
        	this.assertEqual("Loveliest of trees, the cherry now is hung with bloom along the bough.", YAHOO.Convio.PC2.Utils.truncateText("Loveliest of trees, the cherry now is hung with bloom along the bough.", 200));
        	this.assertEqual("Loveliest of trees, the cherry now is hung with bloom along the bough.", YAHOO.Convio.PC2.Utils.truncateText("Loveliest of trees, the cherry now is hung with bloom along the bough.", 200, ', etc.'));
        	
        	// test vanilla truncation
        	this.assertEqual("Loveliest of tree...", YAHOO.Convio.PC2.Utils.truncateText("Loveliest of trees, the cherry now is hung with bloom along the bough."));
        	this.assertEqual("Loveliest of trees, the che...", YAHOO.Convio.PC2.Utils.truncateText("Loveliest of trees, the cherry now is hung with bloom along the bough.", 30));
        	this.assertEqual("Loveliest of trees, the , etc.", YAHOO.Convio.PC2.Utils.truncateText("Loveliest of trees, the cherry now is hung with bloom along the bough.", 30, ', etc.'));
        	
        	// test max length too short
        	this.assertEqual("Loveliest of tree...", YAHOO.Convio.PC2.Utils.truncateText("Loveliest of trees, the cherry now is hung with bloom along the bough.", 3));
        	this.assertEqual("Loveliest of t, etc.", YAHOO.Convio.PC2.Utils.truncateText("Loveliest of trees, the cherry now is hung with bloom along the bough.", 6, ', etc.'));
        }
        
        /*
        ,testFailure : function () {
            this.assertSame("foo", "foo");
        	this.assertSame("foo", "bar");
        }

        ,testIgnore : function() {
            Y.Assert.areSame("ignore","this");
        }
        */
		
	});

	// add test case to test runner
	Y.Test.Runner.add(Y.Convio.PC2.Test.Utils);
},
"1.0",
{ requires: ['test', 'test-assertions', 'history'] }
);