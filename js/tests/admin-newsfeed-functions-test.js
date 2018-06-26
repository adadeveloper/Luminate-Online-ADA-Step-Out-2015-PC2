
YAHOO.Convio.PC2.Teamraiser.getAdminNewsfeedContent = function(callback, contentCriteria) {
	 var tmpText = "{ \"getNewsFeedsResponse\" : { \"numberOfFeeds\":4, \"numberOfNewFeeds\":2, \"newsFeed\" : [ " +
	 	" { \"isNew\":\"true\", \"imageSrc\":\"/images/accept.gif\", \"imageAlt\":\"Alt image1 text\", " +
		"\"feedTitle\":\"This is the title\", " +
		"\"feedContent\": \"This is the text of the first item, let me know what you think about it and whether or not it might need to be shorter or longer or more progressive or conservative or less of a run-on sentence or more of a run-on sentence and whether or not the soy milk might turn out alright today because it really should not have spoiled in such a short amount of time especially since it was in the fridge the whole time.\", " +
		"\"feedContentWithLink\": \"This is the text of the first item, let me know what you think about it and whether or not it might need to be shorter or longer or more progressive or conservative or less of a run-on sentence or more of a run-on sentence and whether or not the soy milk might turn out alright today because it really should not have spoiled in such a short amount of time especially since it was in the fridge the whole time.\", " +
		"\"lastModifiedDate\":\"Aug 21, 2010\", \"feedId\":23 }," +
		" { \"isNew\":\"true\", \"imageSrc\":\"/images/accept.gif\", \"imageAlt\":\"Alt image2 text\", " +
		"\"feedTitle\":\"This is the 2nd title\", " +
		"\"feedContent\": \"Did you know that there is a pretty cool event going on right now? If you didn't you really should because it's going to be just about the best thing evar! Yes I mean evar and <b>not</b> ever. duh.\", " +
		"\"feedContentWithLink\": \"Did you know that there is a pretty cool event going on right now? If you didn't you really should because it's going to be just about the best thing evar! Yes I mean evar and <b>not</b> ever. duh.\", " +
		"\"lastModifiedDate\":\"Aug 20, 2010\", \"feedId\":24 }, " +
		" { \"isNew\":\"false\", \"imageSrc\":\"/images/accept.gif\", \"imageAlt\":\"Alt image3 text\", " +
		"\"feedTitle\":\"This is the 3rd title\", " +
		"\"feedContent\": \"Did you know that there is a pretty cool event going on right now? If you didn't you really should because it's going to be just about the best thing evar! Yes I mean evar and <b>not</b> ever. duh.\", " +
		"\"feedContentWithLink\": \"Did you know that there is a pretty cool event going on right now? If you didn't you really should because it's going to be just about the best thing evar! Yes I mean evar and <b>not</b> ever. duh.\", " +
		"\"lastModifiedDate\":\"Aug 20, 2010\", \"feedId\":25 }, " +
		" { \"isNew\":\"false\", \"imageSrc\":\"/images/accept.gif\", \"imageAlt\":\"Alt image4 text\", " +
		"\"feedTitle\":\"This is the 4th title\", " +
		"\"feedContent\": \"Did you know that there is a <b>pretty</b> cool event going on right now? If you didn't you really should because it's going to be just about the best thing evar! Yes I mean evar and <b>not</b> ever. duh.\", " +
		"\"feedContentWithLink\": \"Did you know that there is a <b>pretty</b> cool event going on right now? If you didn't you really should because it's going to be just about the best thing evar! Yes I mean evar and <b>not</b> ever. duh.\", " +
		"\"lastModifiedDate\":\"Aug 20, 2010\", \"feedId\":26 } " +
		"] } }";
	 var tmp = {
			 responseText : tmpText
	 };
	 try {
	 	callback.success(tmp);
	 }
	 catch (exception) {
		 console.error('Failed during simulated asynchronous request: ' + exception);
	 }
};
	
YUI.add("pc2-admin-newsfeed-functions-test", function(Y) {
	
	Y.namespace("Convio.PC2.Test");
	
	// define the test case object
	Y.Convio.PC2.Test.pc2_admin_newsfeed_functions = new Y.Test.Case({
		
		name : "Admin News Feed Functions Test",
		
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
			useList : "#pc2_admin_newsfeed_functions_results_list",

			/*
			ignore : {
			}

			error : {
			}
			*/
		},
		
		testContentCriteriaWellDefined : function()
		{
			var tmpContentCriteria = YAHOO.Convio.PC2.Teamraiser.AdminNewsfeed.contentCriteria;
			this.assertWellDefined(tmpContentCriteria);
		},
		
		testBuildNewsItemString : function()
		{
			var validNewsItem = {
					isNew : "true",
					imageSrc : "/images/accept.gif",
					imageAltText : "imageAltText",
					feedTitle : "News Item Title Text",
					feedContent : "New Item body",
					lastModifiedDate : "Aug 20, 2010",
					itemId : 2000,
					feedContentWithLink : "Lorem <a href=\"dolor\">ipsum</a>"
			};
			
			YAHOO.Convio.PC2.Data.TeamraiserConfig = {};
			YAHOO.Convio.PC2.Data.TeamraiserConfig.AdminNewsFeed = {};
			var maxTextLength = 20;
			
			var returnedDiv;
			
			returnedDiv = YAHOO.Convio.PC2.Teamraiser.AdminNewsfeedCommons.buildNewsItemString(validNewsItem, maxTextLength, false);
			this.validateNewsItemString(validNewsItem, maxTextLength, returnedDiv, false);
			
			// test when "buildForPopup" == true
			returnedDiv = YAHOO.Convio.PC2.Teamraiser.AdminNewsfeedCommons.buildNewsItemString(validNewsItem, maxTextLength, true);
			this.validateNewsItemString(validNewsItem, maxTextLength, returnedDiv, true);
			
			// test "isNew" == "false" and "buildForPopup" == true
			validNewsItem.isNew = "false";
			returnedDiv = YAHOO.Convio.PC2.Teamraiser.AdminNewsfeedCommons.buildNewsItemString(validNewsItem, maxTextLength, false);
			this.validateNewsItemString(validNewsItem, maxTextLength, returnedDiv, false);

			// test when "isNew" == "false" and "buildForPopup" == true
			returnedDiv = YAHOO.Convio.PC2.Teamraiser.AdminNewsfeedCommons.buildNewsItemString(validNewsItem, maxTextLength, true);
			this.validateNewsItemString(validNewsItem, maxTextLength, returnedDiv, true);
		},
		
		testPopulateAdminNewsfeed : function()
		{
			
			YAHOO.Convio.PC2.Teamraiser.AdminNewsfeed.populateAdminNewsfeed({numberOfNewFeeds: 0, numberOfFeeds: 0, newsFeed : [] });
			Y.Assert.isTrue(YAHOO.util.Dom.hasClass("newsfeed-container", "hidden-form"),
					"newsfeed-container should be hidden when no feeds are returned");
			
			// response: { numberOfNewFeeds: 2, numberOfFeeds: 5, newsFeed: [ { }, { }, { } ] }
			var testResponse =
			{
					numberOfNewFeeds: 3,
					numberOfFeeds: 5,
					newsFeed : [
			            {
			            	isNew : "true",
			            	imageSrc : "/images/accept.gif",
			            	imageAltText : "Image1 Alt Text",
			            	feedTitle : "Feed1 Title",
			            	feedContent : "Feed 1 content that should be sufficiently long in order for it to be cut off after a few characters",
			            	lastModifiedDate : "August 20, 2010",
			            	itemId : 1000,
			            	feedContentWithLink : "Lorem <a href=\"dolor\">ipsum</a>"
			            }
		            ]
			};
			
			YAHOO.Convio.PC2.Teamraiser.AdminNewsfeed.populateAdminNewsfeed(testResponse);
			Y.Assert.isFalse(YAHOO.util.Dom.hasClass("newsfeed-container", "hidden-form"),
					"newsfeed-container should not be hidden");
			Y.Assert.areSame(YAHOO.util.Dom.get("carousel-paginator").childNodes.length, 0,
					"carousel paginator should not show with only one news item");
			
			testResponse.newsFeed[1] = {
	            	isNew : "true",
	            	imageSrc : "/images/accept.gif",
	            	imageAltText : "Image2 Alt Text",
	            	feedTitle : "Feed2 Title",
	            	feedContent : "Feed 2 content that should be sufficiently long in order for it to be cut off after a few characters",
	            	lastModifiedDate : "August 20, 2010",
	            	itemId : 1001,
	            	feedContentWithLink : "Lorem <a href=\"dolor\">ipsum</a>"
			};
			
			testResponse.newsFeed[2] = {
					isNew : "false",
					imageSrc : "/images/accept.gif",
					imageAltText : "Image3 Alt Text",
	            	feedTitle : "Feed3 Title",
	            	feedContent : "Feed 3 content that should be sufficiently long in order for it to be cut off after a few characters",
	            	lastModifiedDate : "August 20, 2010",
	            	itemId : 1002,
	            	feedContentWithLink : "Lorem <a href=\"dolor\">ipsum</a>"
			};
			
			YAHOO.Convio.PC2.Teamraiser.AdminNewsfeed.populateAdminNewsfeed(testResponse);
			Y.Assert.areNotSame(YAHOO.util.Dom.get("carousel-paginator").childNodes.length, 0,
					"carousel paginator should show with more than one news item");
			Y.Assert.areSame(YAHOO.util.Dom.getElementsByClassName("yui-pg-page", null, "carousel-paginator").length, 3,
					"carousel paginator should show 3 page links");
			Y.Assert.areSame(YAHOO.util.Dom.getElementsByClassName("new", null, "carousel-paginator").length, 2,
					"carousel paginator should have 2 \"new\" page links");
		},
		
		testPopupAllMessages : function()
		{
			YAHOO.Convio.PC2.Teamraiser.AdminNewsfeed.showAdminNewsfeedAllMessages();
			
			Y.Assert.isFalse(YAHOO.util.Dom.hasClass("newsfeed_c", "yui-overlay-hidden"), "newsfeed popup should not be hidden");
			// make sure the popup is visible
			// make sure there are 4 of the popup-specific newsfeed containers
			this.validateSingleAllPopup(1, true, 4);
			
			// switch to the single-item popup view
			Y.one(YAHOO.util.Dom.getElementsByClassName("newsfeed-read-active", null, "newsfeed-all-container")[0]).simulate("click");
			this.validateSingleAllPopup(2, false);
			
			YAHOO.Convio.PC2.Teamraiser.AdminNewsfeedPopupContainer.hide()
			Y.Assert.isTrue(YAHOO.util.Dom.hasClass("newsfeed_c", "yui-overlay-hidden"), "newsfeed popup should be hidden");
		},
		
		testPopupSingleMessage : function()
		{
			YAHOO.Convio.PC2.Teamraiser.AdminNewsfeed.showAdminNewsfeedActiveMessage();

			Y.Assert.isFalse(YAHOO.util.Dom.hasClass("newsfeed_c", "yui-overlay-hidden"), "newsfeed popup should not be hidden");
			this.validateSingleAllPopup(3, false);
			
			YAHOO.Convio.PC2.Teamraiser.AdminNewsfeedPopupContainer.hide();
			Y.Assert.isTrue(YAHOO.util.Dom.hasClass("newsfeed_c", "yui-overlay-hidden"), "newsfeed popup should be hidden");
		},
		
		validateSingleAllPopup : function(id, allVisible, allTotal)
		{
			Y.Assert.areSame(YAHOO.util.Dom.hasClass("newsfeed-single-container", "hidden-form"), allVisible,
					id+" newsfeed-single-container should "+(allVisible ? "" : "not ")+"be hidden");
			Y.Assert.areSame(YAHOO.util.Dom.hasClass("newsfeed-all-container", "hidden-form"), !allVisible,
					id+" newsfeed-all-container should "+(allVisible ? "not " : "")+"be hidden");
			if(allVisible) {
				Y.Assert.areSame(YAHOO.util.Dom.getElementsByClassName("newsfeed-list-item-container", null, "newsfeed-all-container").length,
						allTotal, id+" there should be "+allTotal+" newsfeed-list-item-container elements but there are "+
						YAHOO.util.Dom.getElementsByClassName("newsfeed-list-item-container").length);
			} else {
				Y.Assert.areSame(YAHOO.util.Dom.get("newsfeed-single-container").childNodes.length, 1,
						id+" newsfeed-single-container should have exactly 1 child node but has "+
						YAHOO.util.Dom.get("newsfeed-single-container").childNodes.length);
			}
		},
		
		validateNewsItemString : function(origNewsItem, maxTextLength, newNewsItem, builtForPopup)
		{
			var newsItemImage, newsItemBody, itemImg;
			
			this.assertWellDefined(newNewsItem);
			
			newsItemImage = jQuery(newNewsItem).children('div.newsitem-image')[0]; 
			this.assertWellDefined(newsItemImage);
			Y.Assert.areSame(YAHOO.util.Dom.hasClass(newsItemImage, "newsitem-image-container"), builtForPopup,
					"newsitem-image should"+(builtForPopup ? "" : " not")+" have class newsitem-image-container");
			Y.Assert.areSame(YAHOO.util.Dom.hasClass(newsItemImage, "newsitem-container"), builtForPopup,
					"newsitem-image should"+(builtForPopup ? "" : " not")+" have class newsitem-container");
			
			itemImg = jQuery(newsItemImage).children('img')[0];
			Y.Assert.isTrue(itemImg.src.indexOf(origNewsItem.imageSrc) !== -1, "invalid image source string - found: "+itemImg.src+" expected: " +origNewsItem.imageSrc);
			Y.Assert.areSame(itemImg.alt, origNewsItem.imageAltText, "invalid image alt text - found: "+itemImg.alt+" expected: "+origNewsItem.imageAltText);
			Y.Assert.areSame(itemImg.title, origNewsItem.imageAltText, "invalid image title - found: "+itemImg.title+" expected: "+origNewsItem.imageAltText);
			
			newsItemBody = jQuery(newNewsItem).children('div.newsitem-body')[0]; 
			this.assertWellDefined(newsItemBody);
			Y.Assert.isTrue(newsItemBody.childNodes.length === 5, "news item body should have exactly 5 child elements but has "+newsItemBody.childNodes.length);
			Y.Assert.areSame(YAHOO.util.Dom.hasClass(newsItemBody, "newsitem-main-container"), builtForPopup,
					"newsitem-body should"+(builtForPopup ? "" : " not")+" have class newsitem-main-container");
			Y.Assert.areSame(YAHOO.util.Dom.hasClass(newsItemBody, "newsitem-container"), builtForPopup,
					"newsitem-body should"+(builtForPopup ? "" : " not")+" have class newsitem-container");
			
			var newsItemBodyNewImage = jQuery(newsItemBody).children('div.newsitem-new-image')[0];
			this.assertWellDefined(newsItemBodyNewImage);
			Y.Assert.isTrue(YAHOO.util.Dom.hasClass(newsItemBodyNewImage, "hidden-form") !=
				(origNewsItem.isNew.toLowerCase() == "true" ? true : false),
				"newsitem-new-image container should"+(origNewsItem.isNew.toLowerCase() == "true" ? "" : " not")+" be hidden");
			
			var newsItemBodyTitle = jQuery(newsItemBody).children('div.newsitem-title')[0];
			this.assertWellDefined(newsItemBodyTitle);
			Y.Assert.areSame(newsItemBodyTitle.innerHTML, origNewsItem.feedTitle, "invalid newsitem-title text - found: "+newsItemBodyTitle.innerHTML+
					" expected: "+origNewsItem.feedTitle);
			
			var newsItemBodyDate = jQuery(newsItemBody).children('div.newsitem-date')[0];
			this.assertWellDefined(newsItemBodyDate);
			Y.Assert.areSame(newsItemBodyDate.innerHTML, origNewsItem.lastModifiedDate, "invalid newsitem-date - found: "+
					newsItemBodyDate.innerHTML+" expected: "+origNewsItem.lastModifiedDate);
			
			var newsItemBodyText = jQuery(newsItemBody).children('div.newsitem-text')[0];
			this.assertWellDefined(newsItemBodyText);
			Y.Assert.isTrue(newsItemBodyText.firstChild.data.length <= maxTextLength,
					"newsitem-body text length "+newsItemBodyText.innerHTML.length+" is longer than maximum configured length "+
					maxTextLength);
			if(origNewsItem.feedContent.length > maxTextLength) {
				Y.Assert.isTrue(newsItemBodyText.firstChild.data.indexOf("... ") !== -1, 
						"newsitem-body text length should end in \"... \"");
			}
			
			var newsItemBodyTextReadMoreLink = jQuery(newsItemBodyText).children('a.newsfeed-read-active')[0];
			this.assertWellDefined(newsItemBodyTextReadMoreLink);
			
			var newsItemTextFull = jQuery(newsItemBody).children('div.newsitem-text-full')[0];
			this.assertWellDefined(newsItemTextFull);
			Y.Assert.isTrue(YAHOO.util.Dom.hasClass(newsItemTextFull, "hidden-form"),
					"newsitem-full-text does not have class hidden-form");
			Y.Assert.areSame(newsItemTextFull.innerHTML, origNewsItem.feedContent,
					"invalid newsitem-full-text - found: "+newsItemTextFull.innerHTML+" expected: "+origNewsItem.feedContent);
			
		}
	});
	
	Y.Test.Runner.add(Y.Convio.PC2.Test.pc2_admin_newsfeed_functions);
},
"1.0",
{ requires: ['test', 'test-assertions', 'teamraiser-config', 'pc2-admin-newsfeed-functions', 'pc2-admin-newsfeed-common-functions'] }
);