

var GetAdminNewsfeedCallback = {
		success: function(o) {
			var response = YAHOO.lang.JSON.parse(o.responseText).getNewsFeedsResponse;
			YAHOO.Convio.PC2.Teamraiser.AdminNewsfeed.populateAdminNewsfeed(response);
		},
		failure: function(o) {
			logFailure(o);
		},
		scope: YAHOO.Convio.PC2.Teamraiser
};

var GetAdminNewsfeedCallbackForPopup = {
		success: function(o) {
			var response = YAHOO.lang.JSON.parse(o.responseText).getNewsFeedsResponse;
			YAHOO.Convio.PC2.Teamraiser.AdminNewsfeed.populateAdminNewsfeedPopup(response);
		},
		
		failure: function(o) {
			logFailure(o);
		},
		scope: YAHOO.Convio.PC2.Teamraiser
};

var replaceParams = function() {
	var str = arguments[0];
	var args = arguments;
	return str.replace(/\{(\d+)\}/g, function() {
		var inner = args[new Number(arguments[1])+1];
		if(inner === undefined) {
			return "";
		}
		return inner;
	});
};

YAHOO.Convio.PC2.Teamraiser.AdminNewsfeed = {
		
		contentCriteria: {
				feed_count: -1,
				itemId: -1,
				sort_order: "MODIFY_DATE",
				lastPC2Login: 0
		},
		
		loadAdminNewsfeedContent: function(container) {
			YAHOO.log('Entry: loadAdminNewsfeedContent(' + container + ')', 'info', 'admin-newsfeed-functions.js');
			
			YAHOO.Convio.PC2.Teamraiser.AdminNewsfeed.contentCriteria.feed_count = YAHOO.Convio.PC2.Data.TeamraiserConfig.AdminNewsFeed.feedCount;
			
			YAHOO.Convio.PC2.Teamraiser.getAdminNewsfeedContent(GetAdminNewsfeedCallback, YAHOO.Convio.PC2.Teamraiser.AdminNewsfeed.contentCriteria);
			
			YAHOO.log('Exit: loadAdminNewsfeedContent(' + container + ')', 'info', 'admin-newsfeed-functions.js');
		},
		
		getAdminNewsfeedContentForPopup: function() {
			YAHOO.log('Entry: getAdminNewsfeedContentForPopup', 'info', 'admin-newsfeed-functions.js');
			
			YAHOO.Convio.PC2.Teamraiser.AdminNewsfeed.contentCriteria.feed_count = -1;
			
			YAHOO.Convio.PC2.Teamraiser.getAdminNewsfeedContent(GetAdminNewsfeedCallbackForPopup, YAHOO.Convio.PC2.Teamraiser.AdminNewsfeed.contentCriteria);
			
			YAHOO.log('Exit: getAdminNewsfeedContentForPopup', 'info', 'admin-newsfeed-functions.js');
		},
		
		populateAdminNewsfeed: function(response) {

	        if (! YAHOO.Convio.PC2.Teamraiser.AdminNewsFeedContainer) {
	        	YAHOO.Convio.PC2.Teamraiser.AdminNewsFeedContainer = YAHOO.util.Dom.get("newsfeed-container");
	        	if(YAHOO.Convio.PC2.Data.TeamraiserConfig.AdminNewsFeed.showBelowProgress) {
	        		YAHOO.util.Dom.insertAfter(YAHOO.Convio.PC2.Teamraiser.AdminNewsFeedContainer, YAHOO.util.Dom.get("bd-personal-progress"));
	        	} else {
	        		YAHOO.util.Dom.insertBefore(YAHOO.Convio.PC2.Teamraiser.AdminNewsFeedContainer, YAHOO.util.Dom.get("bd-personal-progress"));
	        	}
	        }
	        
			YAHOO.log('Entry: populateAdminNewsfeed(' + response + ')', 'info', 'admin-newsfeed-functions.js');
			var maxTextLength = YAHOO.Convio.PC2.Data.TeamraiserConfig.AdminNewsFeed.maxTextLength; 
			// response: { numberOfNewFeeds: 2, numberOfFeeds: 5, newsFeed: [ { }, { }, { } ] }
			var totalItems = response.numberOfFeeds;
			var newItems = response.numberOfNewFeeds;
			var newsItems = YAHOO.Convio.PC2.Utils.ensureArray(response.newsFeed);
			var returnedItems = newsItems.length;
			if(totalItems === undefined) {
				totalItems = newsItems.length;
			}
			if(totalItems > 0) {
				var newTotalContainer = YAHOO.util.Dom.get("msg_cat_admin_newsfeed_new_total_container");
				newTotalContainer.innerHTML = replaceParams(newTotalContainer.innerHTML, newItems, totalItems);
				
            	var getNewsItemChildWithClass = function(root, className) {
            		var retStr = "";
            		var foundElems = YAHOO.util.Dom.getElementsByClassName(className, null, root);
            		if(foundElems !== undefined && foundElems.length > 0) {
            			retStr = foundElems[0].innerHTML;
            		}
            		return retStr;
            	};
            	var getNewsItemImage = function(root) {
            		return getNewsItemChildWithClass(root, "newsitem-image");
            	};
            	var getNewsItemBody = function(root) {
            		return getNewsItemChildWithClass(root, "newsitem-body");
            	};
            	var adjustPageLinksClass = function() {
            		var tmp = YAHOO.util.Dom.getElementsByClassName("yui-pg-page", null, "carousel-paginator");
                    for(var j=0; j < tmp.length; j++) {
    					var isNew = newsItems[j].isNew;
    					if(isNew == true || isNew == "true" || isNew == "TRUE") {
    						YAHOO.util.Dom.addClass(tmp[j], "new");
    					}
                    }
            	}
            	
				// init carousel
				var numVisible = 1;
				var cycleInterval = YAHOO.Convio.PC2.Data.TeamraiserConfig.AdminNewsFeed.cycleInterval;
				
            	var imageContainer = YAHOO.util.Dom.get("newsitem-image-container");
            	var bodyContainer = YAHOO.util.Dom.get("newsitem-body-container");
                var carousel = new YAHOO.widget.Carousel("carousel-container",{
                	numVisible: numVisible,
                	isCircular: true,
                	autoPlayInterval: cycleInterval
                });
                
                carousel.on("itemSelected", function(index) {
                	var item = carousel.getElementForItem(index);
                	
                	var imageStr = getNewsItemImage(item);
                	imageContainer.innerHTML = imageStr;
                	
                	var bodyStr = getNewsItemBody(item);
                	bodyContainer.innerHTML = bodyStr;
                	YAHOO.util.Dom.getElementsByClassName("newsfeed-read-active", null, bodyContainer, function(o) {
                		YAHOO.util.Event.addListener(o, "click", YAHOO.Convio.PC2.Teamraiser.AdminNewsfeed.showAdminNewsfeedActiveMessage);
                	});
                });
                
				// add items
				for(var i=0; i < newsItems.length; i++) {
					
					var itemStr = YAHOO.Convio.PC2.Teamraiser.AdminNewsfeedCommons.buildNewsItemString(newsItems[i], maxTextLength);
					carousel.addItem(itemStr);
				}
				
				carousel.render();
				carousel.show();
				carousel.startAutoPlay();
				
				YAHOO.Convio.PC2.Teamraiser.AdminNewsfeed.carousel = carousel;
				
				// init paginator if there is more than one item
				if(returnedItems > 1) {
					var paginator = new YAHOO.widget.Paginator({
                    	containers: "carousel-paginator",
                    	template: "{PageLinks}",
                    	numItems: carousel.get("numItems"),
                    	rowsPerPage: 1,
                    	totalRecords: carousel.get("numItems")
                    });
                    
                    paginator.subscribe("changeRequest", function(state) {
                    	carousel.set("selectedItem", (state.page - 1) * numVisible);
                    	paginator.setState(state);
                    });

                    carousel.on("pageChange", function(page) {
                    	paginator.setPage(page+1,true);
                    	adjustPageLinksClass();
                    });

                    paginator.render();
                    
                    adjustPageLinksClass();
				}
				
				YAHOO.util.Dom.removeClass("newsfeed-container", "hidden-form");
			}
			YAHOO.log('Exit: populateAdminNewsfeed(' + response + ')', 'info', 'admin-newsfeed-functions.js');
		},
		
		populateAdminNewsfeedPopup: function(response) {
			YAHOO.log('Entry: populateAdminNewsfeedPopup(' + response + ')', 'info', 'admin-newsfeed-functions.js');
			var maxTextLength = YAHOO.Convio.PC2.Data.TeamraiserConfig.AdminNewsFeed.maxTextLength; 
			// response: { newItems: 2, totalItems: 5, newsItems: [ { }, { }, { } ] }
			var totalItems = response.numberOfFeeds;
			var newItems = response.numberOfNewFeeds;
			var newsItems = YAHOO.Convio.PC2.Utils.ensureArray(response.newsFeed);
			if(totalItems === undefined) {
				totalItems = newsItems.length;
			}
			
			var totalDiv = YAHOO.util.Dom.get("msg_cat_admin_newsfeed_list_header_total");
			totalDiv.innerHTML = replaceParams(totalDiv.innerHTML, totalItems);
			
			var newDiv = YAHOO.util.Dom.get("msg_cat_admin_newsfeed_list_header_new");
			newDiv.innerHTML = replaceParams(newDiv.innerHTML, newItems);
			
			var containerDiv = YAHOO.util.Dom.get("newsfeed-all-container");
			
			// clear out the existing list
			var listDiv = YAHOO.util.Dom.get("newsfeed-all-list");
			var numChildren = listDiv.childNodes.length;
			for(var i=0; i < numChildren; i++) {
				listDiv.removeChild(listDiv.firstChild);
			}
			
			for(var i=0; i < newsItems.length; i++) {
				var itemStr = YAHOO.Convio.PC2.Teamraiser.AdminNewsfeedCommons.buildNewsItemString(newsItems[i], maxTextLength, true);
				var itemDiv = document.createElement("div");
				YAHOO.util.Dom.setAttribute(itemDiv, 'id', 'newsfeed-list-item-'+newsItems[i].feedId);
				YAHOO.util.Dom.addClass(itemDiv, "newsfeed-list-item-container clearfix" + (i % 2 == 0 ? "" : " odd"));
				itemDiv.appendChild(itemStr);
				
				listDiv.appendChild(itemDiv);
			}
			
			YAHOO.util.Dom.getElementsByClassName("newsfeed-read-active", null, listDiv, function(o) {
				YAHOO.util.Event.addListener(o, "click", function() {
					YAHOO.Convio.PC2.Teamraiser.AdminNewsfeedPopupContainer.showAll = false;
					YAHOO.Convio.PC2.Teamraiser.AdminNewsfeed.updatePopupContainerContents(false,
							this.parentNode.parentNode.previousSibling, this.parentNode.parentNode);
				});
			});
			
			YAHOO.log('Exit: populateAdminNewsfeedPopup(' + response + ')', 'info', 'admin-newsfeed-functions.js');
		},
		
//		buildNewsItemString: function(newsItem, buildForPopup, maxTextLength, buildForPreview) {
//			/*
//			 * builds the following:
//			 * 
//       			<div class="newsitem-image">
//       				<img src="imagesource1" alt="alt image text1"/>
//       			</div>
//       			<div class="newsitem-body">
//           			<div class="newsitem-new-image"></div>
//           			<div class="newsitem-title">This is title #1</div>
//           			<div class="newsitem-date">Aug 20, 2010</div>
//           			<div class="newsitem-text">This is the main text of news item 1 ...
//           			<a href="javascript:doSomething(23);">Read More</a></div>
//       			</div>
//       			
//       			from:
//       			newsItem: { isNew: "true", imageSrc: "url/to/image.png", imageAlt: "alt image text", title: "titleText",
//       						text: "Body html text string that will be truncated",
//       						publishDate: "Aug 20, 2010", itemId: 23 }
//			 */
//			YAHOO.log('Entry: buildNewsItemString(' + newsItem + ')', 'info', 'admin-newsfeed-functions.js');
//			
//			var popupBuild = (buildForPopup !== undefined && (buildForPopup == true || buildForPopup == "true" || buildForPopup == "TRUE"));
//			
//			var previewBuild = (buildForPreview !== undefined && (buildForPreview == true || buildForPreview == "true" || buildForPreview == "TRUE"));
//			
//			var containerDiv = document.createElement("div");
//			
//			var imageContainer = document.createElement("div");
//			YAHOO.util.Dom.addClass(imageContainer, "newsitem-image" + (popupBuild ? " newsitem-image-container newsitem-container" : ""));
//			var image = document.createElement("img");
//			imageContainer.appendChild(image);
//			if(newsItem.imageSrc !== undefined && newsItem.imageSrc != null) {
//				YAHOO.util.Dom.setAttribute(image, "src", newsItem.imageSrc);
//			}
//			if(newsItem.imageAltText !== undefined && newsItem.imageAltText != null) {
//				YAHOO.util.Dom.setAttribute(image, "alt", newsItem.imageAltText);
//				YAHOO.util.Dom.setAttribute(image, 'title', newsItem.imageAltText);
//			}
//			containerDiv.appendChild(imageContainer);
//			
//			var bodyContainer = document.createElement("div");
//			YAHOO.util.Dom.addClass(bodyContainer, "newsitem-body" + (popupBuild ? " newsitem-main-container newsitem-container" : ""));
//
//			var newImage = document.createElement("div");
//			var classStr = "newsitem-new-image";
//			if(newsItem.isNew == "false" || newsItem.isNew == "FALSE" || newsItem.isNew == false) {
//				classStr += " hidden-form";
//			}
//			YAHOO.util.Dom.addClass(newImage, classStr);
//			newImage.innerHTML = YAHOO.util.Dom.get('msg_cat_admin_newsfeed_new').innerHTML;
//			bodyContainer.appendChild(newImage);
//			
//			var itemTitle = document.createElement("div");
//			YAHOO.util.Dom.addClass(itemTitle, "newsitem-title");
//			itemTitle.innerHTML = newsItem.feedTitle;
//			bodyContainer.appendChild(itemTitle);
//			
//			var itemDate = document.createElement("div");
//			YAHOO.util.Dom.addClass(itemDate, "newsitem-date");
//			itemDate.innerHTML = newsItem.lastModifiedDate;
//			bodyContainer.appendChild(itemDate);
//			
//			var itemText = document.createElement("div");
//			YAHOO.util.Dom.addClass(itemText, "newsitem-text");
//			
//			var maxTextLength = YAHOO.Convio.PC2.Data.TeamraiserConfig.AdminNewsFeed.maxTextLength;
//			if(newsItem.feedContent.length > maxTextLength) {
//				/*itemText.innerHTML = newsItem.feedContent.substr(0,maxTextLength-4) + "... ";*/
//				itemText.innerHTML = YAHOO.Convio.PC2.Teamraiser.AdminNewsfeed.buildPreviewSnippet(newsItem.feedContent, maxTextLength);
//			} else {
//				itemText.innerHTML = newsItem.feedContent;
//			}
//			
//			var itemLink;
//			if (previewBuild)
//			{
//				itemLink = document.createElement("div");
//				YAHOO.util.Dom.addClass(itemLink, "newsfeed-read-active");
//			}
//			else
//			{
//				alert("We're not building for preview");
//				itemLink = document.createElement("a");
//				YAHOO.util.Dom.addClass(itemLink, "newsfeed-read-active");
//				YAHOO.util.Dom.setAttribute(itemLink, "href","#");
//			}
//			
//			itemLink.innerHTML = YAHOO.util.Dom.get("msg_cat_admin_newsfeed_newsitem_read_more").innerHTML;
//			itemText.appendChild(itemLink);
//			bodyContainer.appendChild(itemText);
//			
//			var fullItemText = document.createElement("div");
//			YAHOO.util.Dom.addClass(fullItemText, "newsitem-text-full hidden-form");
//			fullItemText.innerHTML = newsItem.feedContent;
//			bodyContainer.appendChild(fullItemText);
//			
//			containerDiv.appendChild(bodyContainer);
//			
//			YAHOO.log('Exit: buildNewsItemString(' + newsItem + ')', 'info', 'admin-newsfeed-functions.js');
//			return containerDiv;
//		},
		
		showAdminNewsfeedAllMessages: function() {
			YAHOO.Convio.PC2.Teamraiser.AdminNewsfeed.showAdminNewsfeedPopupContainer(true);
		},
		
		showAdminNewsfeedActiveMessage: function() {
			YAHOO.Convio.PC2.Teamraiser.AdminNewsfeed.showAdminNewsfeedPopupContainer(false);
		},
		
		showAdminNewsfeedPopupContainer: function(showAll) {
	        if (! YAHOO.Convio.PC2.Teamraiser.AdminNewsfeedPopupContainer){
	            YAHOO.Convio.PC2.Teamraiser.AdminNewsfeed.initAdminNewsfeedPopupContainer();
	        }
	        if(showAll !== undefined) {
	        	YAHOO.Convio.PC2.Teamraiser.AdminNewsfeedPopupContainer.showAll = showAll;
	        }
	        YAHOO.Convio.PC2.Teamraiser.AdminNewsfeedPopupContainer.show();
		},
		
		initAdminNewsfeedPopupContainer: function() {
			var dialogConfig = {
				width: "700px",
				fixedCenter: true, 
				close: false,
				draggable: false,
				modal: true,
				visible: false
			};
			YAHOO.Convio.PC2.Component.SimpleDialogBuilder.decorateDialogConfigForPC2(dialogConfig);
			
			var panel = new YAHOO.widget.Panel("newsfeed", dialogConfig);
			
			YAHOO.Convio.PC2.Component.SimpleDialogBuilder.decorateDialogForPC2(panel);
			
			YAHOO.Convio.PC2.Teamraiser.AdminNewsfeedPopupContainer = panel;
			YAHOO.Convio.PC2.Teamraiser.AdminNewsfeedPopupContainer.showAll = false;
			
			panel.beforeShowEvent.subscribe(function() {
				YAHOO.Convio.PC2.Teamraiser.AdminNewsfeed.updatePopupContainerContents(true);
			});
			
			panel.showEvent.subscribe(function() {
				YAHOO.Convio.PC2.Teamraiser.AdminNewsfeed.carousel.stopAutoPlay();
			});
			
			panel.hideEvent.subscribe(function() {
				YAHOO.Convio.PC2.Teamraiser.AdminNewsfeed.carousel.startAutoPlay();
			});
			
			var headerDiv = YAHOO.util.Dom.get("newsfeed-popup-header");
            var footerDiv = YAHOO.util.Dom.get("newsfeed-popup-footer");

            YAHOO.util.Event.addListener("msg_cat_admin_newsfeed_header_view_all", "click", function() {
                YAHOO.Convio.PC2.Teamraiser.AdminNewsfeedPopupContainer.showAll = true;
                YAHOO.Convio.PC2.Teamraiser.AdminNewsfeed.updatePopupContainerContents(true);
            });

            YAHOO.util.Event.addListener("msg_cat_admin_newsfeed_header_close_window", "click", function() {
                YAHOO.Convio.PC2.Teamraiser.AdminNewsfeedPopupContainer.hide();
            });

            panel.setHeader(headerDiv);
            panel.setFooter(footerDiv);
            YAHOO.util.Dom.removeClass(headerDiv, "hidden-form");
            YAHOO.util.Dom.removeClass(footerDiv, "hidden-form");
			
			// build containers for single & multiple posts
			// TODO move these into dashboard.html so they aren't being built
			// in code
			var bodyContainer = YAHOO.util.Dom.get("newsfeed-messages-container");
//			var singleContainer = document.createElement("div");
//			YAHOO.util.Dom.setAttribute(singleContainer, "id", "newsfeed-single-container");
//			YAHOO.util.Dom.addClass(singleContainer, "hidden-form");
//			bodyContainer.appendChild(singleContainer);
			
//			var allContainer = document.createElement("div");
//			YAHOO.util.Dom.setAttribute(allContainer, "id", "newsfeed-all-container");
//			YAHOO.util.Dom.addClass(allContainer, "hidden-form");

			var allHeader = YAHOO.util.Dom.get("newsfeed-all-header");
//			allContainer.appendChild(allHeader);
			YAHOO.util.Dom.removeClass(allHeader, "hidden-form");
//
//			var allList = document.createElement("div");
//			YAHOO.util.Dom.setAttribute(allList, "id", "newsfeed-all-list");
//			allContainer.appendChild(allList);
			
			var sortSelect = YAHOO.util.Dom.get("newsfeed-sort-select");
			YAHOO.util.Event.addListener("newsfeed-sort-select", "change", function() {
				YAHOO.Convio.PC2.Teamraiser.AdminNewsfeed.contentCriteria.sort_order = this.value;
				YAHOO.Convio.PC2.Teamraiser.AdminNewsfeed.updatePopupContainerContents(true);
			});
			
//			bodyContainer.appendChild(allContainer);
			
			panel.setBody(bodyContainer);
			panel.render(document.body);
		},
		
		updatePopupContainerContents: function(refreshAll, srcImageElem, srcBodyElem) {
			var myPanel = YAHOO.Convio.PC2.Teamraiser.AdminNewsfeedPopupContainer;
			
			var doRefresh = refreshAll !== undefined && (refreshAll == true || refreshAll == "true" || refreshAll == "TRUE"); 
			
			var content;
			var other;
			if(myPanel.showAll) {
				content = YAHOO.util.Dom.get("newsfeed-all-container");
				other = YAHOO.util.Dom.get("newsfeed-single-container");
				
				if(doRefresh || YAHOO.util.Dom.get("newsfeed-all-list").childNodes.length < 1) {
					YAHOO.Convio.PC2.Teamraiser.AdminNewsfeed.getAdminNewsfeedContentForPopup();
				}
			} else {
				content = YAHOO.util.Dom.get("newsfeed-single-container");
				other = YAHOO.util.Dom.get("newsfeed-all-container");
				var srcImage = srcImageElem;
				var srcBody = srcBodyElem;
				if(srcImage === undefined || srcBody === undefined) {
					srcImage = YAHOO.util.Dom.get("newsitem-image-container");
					srcBody = YAHOO.util.Dom.get("newsitem-body-container");
				}
				YAHOO.Convio.PC2.Teamraiser.AdminNewsfeed.updatePopupSingleContainer(
						srcImage,
						srcBody);
			}
			YAHOO.util.Dom.removeClass(content, "hidden-form");
			YAHOO.util.Dom.addClass(other, "hidden-form");
			
			myPanel.render(document.body);
		},
		
		updatePopupSingleContainer: function(srcImageElem, srcBodyElem) {
			var content = YAHOO.util.Dom.get("newsfeed-single-container");
			var len = content.childNodes.length;
			for(var i=0; i < len; i++) {
				content.removeChild(content.firstChild);
			}

			var bodyContainer = document.createElement("div");
			YAHOO.util.Dom.addClass(bodyContainer, "clearfix");
			
			var tmpDiv = document.createElement("div");
			YAHOO.util.Dom.addClass(tmpDiv, "newsitem-container newsitem-image-container");
			tmpDiv.innerHTML = srcImageElem.innerHTML;
			
			bodyContainer.appendChild(tmpDiv);
			
			tmpDiv = document.createElement("div");
			YAHOO.util.Dom.addClass(tmpDiv, "newsitem-container newsitem-main-container");
			tmpDiv.innerHTML = srcBodyElem.innerHTML;
			
			YAHOO.util.Dom.getElementsByClassName("newsitem-text-full", null, tmpDiv, function(o) {
				YAHOO.util.Dom.removeClass(o, "hidden-form");
			});
			
			YAHOO.util.Dom.getElementsByClassName("newsitem-text", null, tmpDiv, function(o) {
				YAHOO.util.Dom.addClass(o, "hidden-form");
			});
			
			bodyContainer.appendChild(tmpDiv);
			content.appendChild(bodyContainer);
		}
};