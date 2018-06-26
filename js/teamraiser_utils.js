/* teamraiser_utils.js
 * Copyright 2008, Convio
 *
 * Provides Convio Utility functionality.
 * 
 * Depends on:
 * YUI Core, Cookies, Connection, Widget
 * convio_config.js, convio_utils.js
 *
 */
YAHOO.Convio.PC2.Component.Teamraiser = {
    loadRegCallback: {
        success: function(o) {
            YAHOO.namespace("Convio.PC2.Component.Teamraiser.Registration");
            YAHOO.Convio.PC2.Component.Teamraiser.Registration = YAHOO.lang.JSON.parse(o.responseText).getRegistrationResponse.registration;
            // Use Data namespace exclusively.
            YAHOO.Convio.PC2.Data.Registration = YAHOO.Convio.PC2.Component.Teamraiser.Registration;
            // Do last callback method
            if(YAHOO.Convio.PC2.Component.Teamraiser.initalizationDone) {
                YAHOO.Convio.PC2.Component.Teamraiser.initalizationDone();
            }
            // Log success
            YAHOO.log('loadReg success', 'info', 'teamraiser_utils.js');
            if(YAHOO.Convio.PC2.Component.Teamraiser.TeamPageLink && 
            		YAHOO.Convio.PC2.Component.Teamraiser.Registration.aTeamCaptain == 'true') {
            	YAHOO.util.Dom.removeClass(YAHOO.Convio.PC2.Component.Teamraiser.TeamPageLink, 'hidden-form');
            }
            if(
            		YAHOO.Convio.PC2.Component.Teamraiser.CompanyPageLink &&
            		YAHOO.Convio.PC2.Component.Teamraiser.Registration.companyInformation &&
            		YAHOO.Convio.PC2.Component.Teamraiser.Registration.companyInformation.isCompanyCoordinator == 'true' &&
            		YAHOO.Convio.PC2.Component.Teamraiser.Registration.companyInformation.companyType == 'LOCAL' && 
            		YAHOO.Convio.PC2.Component.Teamraiser.Registration.companyInformation.isRootCompany == 'true'	
            ) {
            	YAHOO.util.Dom.removeClass(YAHOO.Convio.PC2.Component.Teamraiser.CompanyPageLink, 'hidden-form');
            }
            
            // Fire the event
            YAHOO.Convio.PC2.Utils.publisher.fire("pc2:registrationLoaded", YAHOO.Convio.PC2.Data.Registration);
        },
        failure: function(o) {
            YAHOO.Convio.PC2.Config.redirectToHome();
            YAHOO.log(o.responseText, 'error', 'teamraiser_utils.js');
        },
        scope: YAHOO.Convio.PC2.Component.Teamraiser
    },
    
    /*
    loadTeamCaptainsCallback: {
        success: function(o) {
            var captain = YAHOO.lang.JSON.parse(o.responseText).getTeamCaptainsResponse.captain;
            var CAPTAIN_PREFIX = '\n<div class="team-captain">';
            var CAPTAIN_SUFFIX = '</div>';
            var captainsText = "";
            if(captain.length) {
                // Array
                var i;
                for(i = 0; i < captain.length; i++) {
                    captainsText += CAPTAIN_PREFIX
                        + captain[i].name.first + ' ' + captain[i].name.last
                        + CAPTAIN_SUFFIX;
                }
            } else {
                // Single entry
                captainsText += CAPTAIN_PREFIX
                        + captain.name.first + ' ' + captain.name.last
                        + CAPTAIN_SUFFIX;
            }
            YAHOO.Convio.PC2.Component.Teamraiser.TeamCaptains.setBody(captainsText);
            YAHOO.Convio.PC2.Component.Teamraiser.TeamCaptains.show();
            YAHOO.log('loadTeamCaptains success', 'info', 'teamraiser_utils.js');
        },
        failure: function(o) {
            YAHOO.log(o.responseText, 'error', 'teamraiser_utils.js');
        },
        scope: YAHOO.Convio.PC2.Component.Teamraiser
    },
    */
    updateProgressBar: function(selector, pct) {
        var percent = pct / 100;
        if (percent > 1) {
            percent = 1;
        }
        // get the width of the outer container;
        var outerWidth = jQuery(selector + ' .progress-bar-outer').css('width').slice(0, -2);
        var innerWidth = outerWidth * percent;
        var inner = jQuery(selector + ' .progress-bar-inner');
        jQuery(selector + ' .progress-bar-inner').width(innerWidth);
    },
    loadParticipantProgressCallback: {
        success: function(o) {
            var response = YAHOO.lang.JSON.parse(o.responseText).getParticipantProgressResponse;
            
            // TODO: Only store this data in the Convio.PC2.Data namespace.
            YAHOO.Convio.PC2.Component.Teamraiser.ProgressData = response;
            // Store the response for later use
            YAHOO.Convio.PC2.Data.ProgressData = response;
            
            var Progress = YAHOO.Convio.PC2.Component.Teamraiser.Progress;
            // Update progress image
            YAHOO.Convio.PC2.Component.Teamraiser.updateProgressBar('.fundraising-progress-bar-container', response.personalProgress.percent);
            // Update personal amount raised
            var pAmtRaisedElm = YAHOO.util.Dom.get(Progress.personalAmountValue);
            pAmtRaisedElm.innerHTML = YAHOO.Convio.PC2.Utils.formatCurrency(response.personalProgress.raised);
            // Update personal percent
            var pPercentElm = YAHOO.util.Dom.get(Progress.personalPercentValue);
            pPercentElm.innerHTML = response.personalProgress.percent + "%";
            // Update days left
            var daysLeftElm = YAHOO.util.Dom.get(Progress.daysLeft);
            daysLeftElm.innerHTML = response.daysLeft;
            // Update personal goal
            var pGoalElm = YAHOO.util.Dom.get(Progress.personalGoalValue);
            pGoalElm.innerHTML = YAHOO.Convio.PC2.Utils.formatCurrency(response.personalProgress.goal);
            // Update team goal and raised, if applicable
            // Store the response for later use
            YAHOO.Convio.PC2.Component.Teamraiser.TeamProgressData = response;
            
            var pGiftAidMatchDivElm = YAHOO.util.Dom.get(Progress.giftAidMatchDiv);
            var pGiftAidMatchValueElm = YAHOO.util.Dom.get(Progress.giftAidMatchValue);
            pGiftAidMatchValueElm.innerHTML = "+ " + YAHOO.Convio.PC2.Utils.formatCurrency(response.personalProgress.giftAidMatch);
            if (pGiftAidMatchDivElm) {
            	if(!YAHOO.Convio.PC2.Config.isUKLocale() || response.personalProgress.giftAidMatch == 0) {
            		pGiftAidMatchDivElm.style.display = 'none'; //Do not display Gift Aid section
            	}
            }
            
            if(YAHOO.Convio.PC2.Config.isUKLocale() && response.personalProgress.giftAidMatch != 0) {
            	YAHOO.util.Dom.addClass(Progress.personalAmountDiv,'progress-amt-raised-nopad');
            }
            
            var TeamProgress = YAHOO.Convio.PC2.Component.Teamraiser.TeamProgress;
            if(response.teamProgress) {
	            // Update progress image
	            YAHOO.Convio.PC2.Component.Teamraiser.updateProgressBar('.team-fundraising-progress-bar-container', response.teamProgress.percent);
	            // Update team amount raised
	            var pAmtRaisedElm = YAHOO.util.Dom.get(TeamProgress.teamAmountValue);
	            pAmtRaisedElm.innerHTML = YAHOO.Convio.PC2.Utils.formatCurrency(response.teamProgress.raised);
	            // Update team percent
	            var pPercentElm = YAHOO.util.Dom.get(TeamProgress.teamPercentValue);
	            pPercentElm.innerHTML = response.teamProgress.percent + "%";
	            // Update days left
	            var daysLeftElm = YAHOO.util.Dom.get(TeamProgress.daysLeft);
	            daysLeftElm.innerHTML = response.daysLeft;
	            // Update team goal
	            var pGoalElm = YAHOO.util.Dom.get(TeamProgress.teamGoalValue);
	            pGoalElm.innerHTML = YAHOO.Convio.PC2.Utils.formatCurrency(response.teamProgress.goal);
            }
            
            YAHOO.log('getParticipantProgress for team success', 'info', 'teamraiser_utils.js');
            
            var CompanyProgress = YAHOO.Convio.PC2.Component.Teamraiser.CompanyProgress;
            if(response.companyProgress) {
	            // Update progress image
	            YAHOO.Convio.PC2.Component.Teamraiser.updateProgressBar('.company-fundraising-progress-bar-container', response.companyProgress.percent);
	            // Update team amount raised
	            var pAmtRaisedElm = YAHOO.util.Dom.get(CompanyProgress.companyAmountValue);
	            pAmtRaisedElm.innerHTML = YAHOO.Convio.PC2.Utils.formatCurrency(response.companyProgress.raised);
	            // Update team percent
	            var pPercentElm = YAHOO.util.Dom.get(CompanyProgress.companyPercentValue);
	            pPercentElm.innerHTML = response.companyProgress.percent + "%";
	            // Update days left
	            var daysLeftElm = YAHOO.util.Dom.get(CompanyProgress.daysLeft);
	            daysLeftElm.innerHTML = response.daysLeft;
	            // Update team goal
	            var pGoalElm = YAHOO.util.Dom.get(CompanyProgress.companyGoalValue);
	            pGoalElm.innerHTML = YAHOO.Convio.PC2.Utils.formatCurrency(response.companyProgress.goal);
            }
            
            YAHOO.log('getParticipantProgress success', 'info', 'teamraiser_utils.js');
            
            YAHOO.Convio.PC2.Utils.publisher.fire("pc2:participantProgressLoaded", YAHOO.Convio.PC2.Data.ProgressData);
        },
        failure: function(o) {
            YAHOO.log(o.responseText, 'error', 'teamraiser_utils.js');
        },
        scope: YAHOO.Convio.PC2.Component.Teamraiser
    },
    
    /* Should not be called until after loadParticipantProgress is called */
    updateParticipantGoal: function(goal) {
        if(!this.ProgressData) {
            YAHOO.log('updateParticipantGoal did not succeed beacuse ProgressData is not set','error','teamraiser_utils.js');
            return;
        }
        var percentText = YAHOO.Convio.PC2.Utils.getPercentText(this.ProgressData.personalProgress.raised, goal);
        var pPercentElm = YAHOO.util.Dom.get(this.Progress.personalPercentValue);
        pPercentElm.innerHTML = percentText;

        var pct = this.ProgressData.personalProgress.raised / goal;
        if(isNaN(pct)) {
            pct = 0;
        }
        YAHOO.Convio.PC2.Component.Teamraiser.updateProgressBar('.fundraising-progress-bar-container', pct * 100);

    },
    
    loadWrapperCallback: {
        success: function(o) {
            var wrapper = YAHOO.lang.JSON.parse(o.responseText).getParticipantCenterWrapperResponse.wrapper;
            
            if(YAHOO.Convio.PC2.Component.Teamraiser.Wrapper && YAHOO.lang.isString(wrapper.content)) {
                var wrapperElm = YAHOO.util.Dom.get(YAHOO.Convio.PC2.Component.Teamraiser.Wrapper);
                wrapperElm.innerHTML = wrapper.content;
            }

            if(YAHOO.Convio.PC2.Component.Teamraiser.ConsProfileUrl) {
                var consProfileAnchorElm = YAHOO.util.Dom.get(YAHOO.Convio.PC2.Component.Teamraiser.ConsProfileUrl);
                consProfileAnchorElm.href = wrapper.consProfileUrl;
            }
            
            if(YAHOO.Convio.PC2.Component.Teamraiser.HelpLinkUrl) {
                var helpLinkAnchorElm = YAHOO.util.Dom.get(YAHOO.Convio.PC2.Component.Teamraiser.HelpLinkUrl);
                helpLinkAnchorElm.href = wrapper.helpLinkUrl;
            }
            
            if(YAHOO.Convio.PC2.Component.Teamraiser.PersonalPageUrl) {
               	// always store the url in the data:
               	YAHOO.Convio.PC2.Data.personalPageUrl = wrapper.personalPageUrl; 
                var personalPageAnchorElm = YAHOO.util.Dom.get(YAHOO.Convio.PC2.Component.Teamraiser.PersonalPageUrl);
                if (personalPageAnchorElm) {
                	personalPageAnchorElm.href = wrapper.personalPageUrl;
                }
            }
            
            if(YAHOO.Convio.PC2.Component.Teamraiser.TeamPageUrl && wrapper.teamPageUrl) {
               	// always store the url in the data:
               	YAHOO.Convio.PC2.Data.teamPageUrl = wrapper.teamPageUrl;
                var teamPageAnchorElm = YAHOO.util.Dom.get(YAHOO.Convio.PC2.Component.Teamraiser.TeamPageUrl);
                if (teamPageAnchorElm) {
                	teamPageAnchorElm.href = wrapper.teamPageUrl;
            	}
            }
            if(YAHOO.Convio.PC2.Component.Teamraiser.TeamPageContainer) {
                if(wrapper.teamPageUrl) {
                    var teamPageContainerElm = YAHOO.util.Dom.get(YAHOO.Convio.PC2.Component.Teamraiser.TeamPageContainer);
                    if (teamPageContainerElm) {
                    	teamPageContainerElm.style.display = 'inline';
                    }
                } 
            }
            
            if(YAHOO.Convio.PC2.Component.Teamraiser.CompanyPageUrl && wrapper.companyPageUrl) {
                var companyPageAnchorElm = YAHOO.util.Dom.get(YAHOO.Convio.PC2.Component.Teamraiser.CompanyPageUrl);
                companyPageAnchorElm.href = wrapper.companyPageUrl;
            }
            
            if(YAHOO.Convio.PC2.Component.Teamraiser.LogoutUrl) {
                var logoutAnchorElm = YAHOO.util.Dom.get(YAHOO.Convio.PC2.Component.Teamraiser.LogoutUrl);
                logoutAnchorElm.href = wrapper.logoutUrl;
            }
            
            if(YAHOO.Convio.PC2.Component.Teamraiser.SiteName) {
                var siteNameElm = YAHOO.util.Dom.get(YAHOO.Convio.PC2.Component.Teamraiser.SiteName);
                siteNameElm.innerHTML = wrapper.organizationName;
            }
            
            if(YAHOO.Convio.PC2.Component.Teamraiser.TeamName && wrapper.teamName) {
                var teamNameElm = YAHOO.util.Dom.get(YAHOO.Convio.PC2.Component.Teamraiser.TeamName);
                teamNameElm.innerHTML = wrapper.teamName;
            }
            
            if(wrapper.personalDonationUrl) {
            	YAHOO.Convio.PC2.Data.personalDonationUrl = wrapper.personalDonationUrl;
            }
            if(YAHOO.Convio.PC2.Component.Teamraiser.ShareContainer && wrapper.shareKey) {
            	
            	Y.use("pc2-social-functions", function(Y) {
	            	YAHOO.Convio.PC2.Data.sharingConf = {
	            			APIKey: wrapper.shareKey
	            	};
	            	YAHOO.Convio.PC2.Data.shareTitle = wrapper.shareTitle;
	            	YAHOO.Convio.PC2.Data.shareAction = wrapper.shareAction;
	            	YAHOO.Convio.PC2.Data.shareMessage = wrapper.shareMessage;
	            	YAHOO.Convio.PC2.Data.shareId = wrapper.shareId;
	            	// Bug 51457 - getElementsByClassName(c) does not work in IE7
	            	//var shareMessageElms = YAHOO.util.Dom.getElementsByClassName("shareDescription");
	            	var shareMessageElms = Y.all(".shareDescription")._nodes;
	            	for(var i=0; i < shareMessageElms.length; i++) {
	            		shareMessageElms[i].innerHTML = YAHOO.Convio.PC2.Data.shareMessage;
	    			}
	            	//var shareTitleElms = YAHOO.util.Dom.getElementsByClassName("shareTitle");
	            	var shareTitleElms = Y.all(".shareTitle")._nodes;
	            	for(var i=0; i < shareTitleElms.length; i++) {
	            		shareTitleElms[i].innerHTML = YAHOO.Convio.PC2.Data.shareTitle;
	    			}
	            	show_pc2_element(YAHOO.Convio.PC2.Component.Teamraiser.ShareContainer);
	            	
	            	var providers = YAHOO.Convio.PC2.Utils.ensureArray(wrapper.shareProvider);
	            	for(var i=0; i < providers.length; i++) {
	            		if(providers[i] == "FACEBOOK") {
	            			show_pc2_element("facebook_share_icon");
	            		} else if(providers[i] == "YAHOO") {
	            			show_pc2_element("yahoo_share_icon");
	            		} else if(providers[i] == "MYSPACE") {
	            			show_pc2_element("myspace_share_icon");
	            		} else if(providers[i] == "TWITTER") {
	            			show_pc2_element("twitter_share_icon");
	            		} else if(providers[i] == "LINKEDIN") {
	            			show_pc2_element("linkedin_share_icon");
	            		}
	            	}
	            });
            }
            
            if(YAHOO.Convio.PC2.Component.Teamraiser.WrapperCallback) {
            	WrapperCallback(o);
            }
            
            
            YAHOO.log('loadWrapper success', 'info', 'teamraiser_utils.js');
            
            YAHOO.Convio.PC2.Utils.publisher.fire("pc2:wrapperLoaded", wrapper);
        },
        failure: function(o) {
            YAHOO.Convio.PC2.Config.redirectToHome();
            YAHOO.log(o.responseText, 'error', 'teamraiser_utils.js');
        },
        scope: YAHOO.Convio.PC2.Component.Teamraiser,
        cache: false
    },
    
    getTeamraiserConfigCallback: {
    	success: function(o) {
    		var trConfig = YAHOO.Convio.PC2.Component.Teamraiser.TeamraiserConfig;
    		if(trConfig) {
                var teamraiserConfig = YAHOO.lang.JSON.parse(o.responseText).getTeamraiserConfigResponse.teamraiserConfig;
                    
                // Store it in a global variable
                YAHOO.Convio.PC2.Data.TeamraiserConfig = teamraiserConfig;
                YAHOO.Convio.PC2.Data.TeamraiserConfig.AdminNewsFeed = {};

            	YAHOO.Convio.PC2.Data.TeamraiserConfig.AdminNewsFeed.showAdminNewsFeed = teamraiserConfig.adminNewsFeedsEnabled;
            	YAHOO.Convio.PC2.Data.TeamraiserConfig.AdminNewsFeed.feedCount = 5;
            	YAHOO.Convio.PC2.Data.TeamraiserConfig.AdminNewsFeed.cycleInterval = 8000;
            	YAHOO.Convio.PC2.Data.TeamraiserConfig.AdminNewsFeed.maxTextLength = 100;
            	YAHOO.Convio.PC2.Data.TeamraiserConfig.AdminNewsFeed.showBelowProgress = false;

                // show personal page component only after registration and configuration have loaded
                YAHOO.Convio.PC2.Utils.require("pc2:registrationLoaded", "pc2:configurationLoaded", YAHOO.Convio.PC2.Component.Teamraiser.setShowPersonalPage);
				
    			if(YAHOO.lang.isUndefined(trConfig.callback) == false) {
    				trConfig.callback(o);
    			}
    			
    			YAHOO.Convio.PC2.Utils.publisher.fire("pc2:configurationLoaded", YAHOO.Convio.PC2.Data.TeamraiserConfig);
    		}
    	},
    	failure: function(o) {
    		YAHOO.log(o.responseText, 'error', 'teamraiser_utils.js');
    	},
    	scope: YAHOO.Convio.PC2.Component.Teamraiser
    },
    
    setShowPersonalPage: function(trConfig){
        var trConfig = YAHOO.Convio.PC2.Component.Teamraiser.TeamraiserConfig;
        if(trConfig) {
            if(YAHOO.lang.isString(trConfig.personalPageConfig)) {
                var teamraiserConfig = YAHOO.Convio.PC2.Data.TeamraiserConfig;
                var showPersonalPage = false;
                if(teamraiserConfig.personalPageEditing == 'PARTICIPANTS'
                        || YAHOO.Convio.PC2.Component.Teamraiser.Registration.teamId <= 0) {
                        showPersonalPage = true;
                } else if(teamraiserConfig.personalPageEditing == 'CAPTAINS' 
                        && YAHOO.Convio.PC2.Component.Teamraiser.Registration.aTeamCaptain == 'true') {
                        showPersonalPage = true;
                }
                // Save whether or not to show the personal page editing
                YAHOO.Convio.PC2.Data.TeamraiserConfig.showPersonalPage = showPersonalPage;
    
                if(showPersonalPage) {
                    YAHOO.util.Dom.removeClass(trConfig.personalPageConfig, 'hidden-form');
                    if(trConfig.personalPageConfig2) {
                        YAHOO.util.Dom.removeClass(trConfig.personalPageConfig2, 'hidden-form');
                    }
                }
            }
        }
    },
    
    /**
	 * Returns true if the user is allowed to view the team roster. 
	 * 
	 * Throws an exception if the YAHOO.Convio.PC2.Component.Teamraiser name space has not
	 * yet been initialized.
	 */
    isCanViewTeamRoster: function() {
    	
    	if (!YAHOO.Convio.PC2.Data.TeamraiserConfig) {
    		throw "Illegal state ... call initialze(..) first!";
    	}
    	
    	if (!this.Registration) {
    		throw "Illegal state ... call initialze(..) first!";
    	}
    	
    	// to view the team roster you must ...
    	return (
    			// be on a team ..
    			this.Registration.teamId > 0 
    			&&  
    			// and have security rights to the team roster list
    			(YAHOO.Convio.PC2.Data.TeamraiserConfig.teamRosterConfig === "MEMBERS" 
    				||
                (YAHOO.Convio.PC2.Data.TeamraiserConfig.teamRosterConfig === "CAPTAINS" && this.Registration.aTeamCaptain == "true"))
               );
    },
    
    /**
	 * Returns true if the user is a member of a team. 
	 * 
	 * Throws an exception if the YAHOO.Convio.PC2.Component.Teamraiser name space has not
	 * yet been initialized.
	 */
    isOnATeam: function() {
    	
    	if (!this.Registration) {
    		throw "Illegal state ... call initialze(..) first!";
    	}
    	
    	return (this.Registration.teamId > 0);
    },

    showAddressImportWizardTab: function(tab) {
    	jQuery('.addressbookimport-wizard-nav-selected').removeClass('addressbookimport-wizard-nav-selected').addClass('addressbookimport-wizard-nav-unselected');
    	jQuery('#addressbookimport-wizard-nav-'+tab).removeClass('addressbookimport-wizard-nav-unselected').addClass('addressbookimport-wizard-nav-selected');
    },
    showAddressImportWizardSelectSource: function() {
      YAHOO.Convio.PC2.Component.Teamraiser.showAddressImportWizardTab('selectsource');
    },
    showAddressImportWizardRetrieveContacts: function() {
      YAHOO.Convio.PC2.Component.Teamraiser.showAddressImportWizardTab('retrievecontacts');
    },
    showAddressImportWizardSelectContacts: function() {
      YAHOO.Convio.PC2.Component.Teamraiser.showAddressImportWizardTab('selectcontacts');
    },
    showAddressImportViewResults: function() {
      YAHOO.Convio.PC2.Component.Teamraiser.showAddressImportWizardTab('importresults');
    },
    
    initialize: function(oConfig) {
        // Start the extensions
        YAHOO.lang.extend(YAHOO.Convio.PC2.Component.Teamraiser.EditGoalDialog, YAHOO.Convio.PC2.Component.PC2Dialog);
        YAHOO.lang.extend(YAHOO.Convio.PC2.Component.Teamraiser.TeamCaptainMessageComponent, YAHOO.widget.Module);
        YAHOO.lang.extend(YAHOO.Convio.PC2.Component.Teamraiser.PrivacySettingsComponent, YAHOO.Convio.PC2.Component.PC2Dialog);
        
        YAHOO.namespace("Convio.PC2.Data");
        
        // Initialize the captains message
        YAHOO.log('Initializing TR', 'info', 'teamraiser_utils.js');
        if(oConfig.captainsMessage) {
            this.CaptainsMessage = new YAHOO.Convio.PC2.Component.Teamraiser.TeamCaptainMessageComponent(oConfig.captainsMessage);
            this.CaptainsMessage.render();
        }
        if(oConfig.teamCaptains) {
            this.TeamCaptains = new YAHOO.widget.Module(oConfig.teamCaptains, { visible: false });
            this.TeamCaptains.render();
        }
        if(oConfig.wrapper) {
            this.Wrapper = oConfig.wrapper;
        }
        if(oConfig.teamPageLink) {
        	this.TeamPageLink = oConfig.teamPageLink;
        }
        if(oConfig.companyPageLink) {
        	this.CompanyPageLink = oConfig.companyPageLink;
        }
        if(oConfig.consProfileUrl) {
        	this.ConsProfileUrl = oConfig.consProfileUrl;
        }
        if(oConfig.helpLinkUrl) {
        	this.HelpLinkUrl = oConfig.helpLinkUrl;
        }
        if(oConfig.personalPageUrl) {
            this.PersonalPageUrl = oConfig.personalPageUrl;
        }
        if(oConfig.teamPageUrl) {
            this.TeamPageUrl = oConfig.teamPageUrl; 
        }
        if(oConfig.teamPageContainer) {
            this.TeamPageContainer = oConfig.teamPageContainer;
        }
        if(oConfig.companyPageUrl) {
            this.CompanyPageUrl = oConfig.companyPageUrl;
        }
        if(oConfig.logoutUrl) {
            this.LogoutUrl = oConfig.logoutUrl;
        }
        if(oConfig.siteName) {
            this.SiteName = oConfig.siteName;
        }
        if(oConfig.teamName) {
            this.TeamName = oConfig.teamName;
        }
        if(oConfig.teamraiserConfig) {
        	this.TeamraiserConfig = oConfig.teamraiserConfig;
        }
        if(oConfig.wrapperCallback) {
        	this.WrapperCallback = oConfig.wrapperCallback;
        }
        if(oConfig.shareContainer) {
        	this.ShareContainer = oConfig.shareContainer;
        }
        // Get the registration and proceed with initialization
        if(oConfig.initDone) {
            YAHOO.log('Init: found initDone','info','teamraiser_utils.js');
            this.initalizationDone = oConfig.initDone;
        }
        
        if (YAHOO.Convio.PC2.Teamraiser.getParticipantCenterWrapper) {
        	YAHOO.Convio.PC2.Teamraiser.getParticipantCenterWrapper(this.loadWrapperCallback);
        }
        
        if (YAHOO.Convio.PC2.Teamraiser.getRegistration) {
        	YAHOO.Convio.PC2.Teamraiser.getRegistration(this.loadRegCallback);
        }
        
        if (YAHOO.Convio.PC2.Teamraiser.getTeamraiserConfig) {
        	YAHOO.Convio.PC2.Teamraiser.getTeamraiserConfig(this.getTeamraiserConfigCallback);
        }
        
        if(oConfig.progress) {
            this.Progress = oConfig.progress;
            if(oConfig.teamProgress) {
            	this.TeamProgress = oConfig.teamProgress;
            }
            if(oConfig.companyProgress) {
            	this.CompanyProgress = oConfig.companyProgress;
            }
            YAHOO.Convio.PC2.Teamraiser.getParticipantProgress(this.loadParticipantProgressCallback);
        }
        /*
		TODO use this?
        if(oConfig.adminNewsFeed) {
        	this.adminNewsfeed = oConfig.adminNewsfeed;
        }
		*/
        
        if (oConfig.privacySettings)
        {
        	this.PrivacySettings = new YAHOO.Convio.PC2.Component.Teamraiser.PrivacySettingsComponent(oConfig.privacySettings);
        }
        
    } 
};

// AddContact
YAHOO.Convio.PC2.Component.Teamraiser.EditGoalDialog = function(goalValue, formContainer, labels) {
    YAHOO.log('Creating EditGoalDialog','info','teamraiser_utils.js');
    
    try {
        this.EditGoalCallback = {
            success: function(o) {
                // Update the local presentation
                var goalValElm = YAHOO.util.Dom.get(this.parent.GoalValue);
                var data = this.parent.getData();
                var goal = YAHOO.Convio.PC2.Utils.parseCurrency(data.goal);
                goalValElm.innerHTML = YAHOO.Convio.PC2.Utils.formatCurrency(goal);
                YAHOO.Convio.PC2.Component.Teamraiser.updateParticipantGoal(goal);
                this.parent.hide();
            },
            
            failure: function(o) {
                var err = YAHOO.lang.JSON.parse(o.responseText).errorResponse.message;
                var errElm = YAHOO.util.Dom.get(this.parent.ErrorDiv);
                YAHOO.util.Dom.removeClass(errElm,"hidden-form");
                errElm.innerHTML = err;
                
                YAHOO.log(o.responseText, 'error', 'teamraiser_utils.js');
            },
            
            parent: this
        };
        
        // Define various event handlers for Dialog
        this.validate = function(){
            try {
                var data = this.getData();
                var reg = {
                    goal: YAHOO.Convio.PC2.Utils.parseCurrency(data.goal)
                };
                var valid = YAHOO.lang.isNumber(reg.goal);
                if(valid) {
                    var amountStr = '' + reg.goal;
                    var periodIdx = amountStr.indexOf('.');
                    if(periodIdx > -1) {
                        valid = false;
                    }
                }
                if(!valid) {
                    var errElm = YAHOO.util.Dom.get(this.ErrorDiv);
                    errElm.innerHTML = MsgCatProvider.getMsgCatValue('error_goal_invalid_number');
                    YAHOO.util.Dom.removeClass(errElm,"hidden-form");
                }
		
                return valid;
            } catch(e) {
                YAHOO.log('Error with EditGoalDialog.validate: ' + e, 'error', 'teamraiser_utils.js');
                return false;
            }
        };
	
        this.handleSubmit = function() {
            try {
                if(this.validate()){
                    var data = this.getData();
                    var reg = {
                        goal: YAHOO.Convio.PC2.Utils.parseCurrency(data.goal)
                    };
                    YAHOO.util.Dom.addClass(this.ErrorDiv, "hidden-form");
                    // Update the remote value asynchronously
                    YAHOO.Convio.PC2.Teamraiser.updateRegistration(this.EditGoalCallback, reg);		    
                }
            } catch(e) {
                YAHOO.log('Error with EditGoalDialog.handleSubmit: ' + e, 'error', 'teamraiser_utils.js');
            }
        };
        
        this.doSubmit = function() {
            this.handleSubmit();
        };

        this.handleCancel = function() {
            this.cancel();
            YAHOO.util.Dom.addClass(this.ErrorDiv, "hidden-form");
            this.form.reset();
        };
        
        // define config details for the dialog
        var MsgCatProvider = YAHOO.Convio.PC2.Component.Content;
        var dialogConfig = {
            width : "27em",
            modal: true, 
            visible : false, 
            close: false,
            hideaftersubmit: false,
            buttons : [ { text:MsgCatProvider.getMsgCatValue('dialog_cancel'), handler:this.handleCancel },
                        { text:MsgCatProvider.getMsgCatValue('dialog_submit'), handler:this.handleSubmit, isDefault:true } ]
        };
        
        // invoke parent constructor
        YAHOO.Convio.PC2.Component.Teamraiser.EditGoalDialog.superclass.constructor.call(
            this, 
            formContainer || YAHOO.util.Dom.generateId(), 
            dialogConfig
        );
        
        this.GoalValue = goalValue; 
        this.ErrorDiv = YAHOO.util.Dom.generateId();
        this.setHeader(labels.editGoal);
        this.setBody(  '<div class="hidden-form failure-message" id="'  + this.ErrorDiv + '">&nbsp;</div>'
                     + '<form action="javascript: void(0);">' 
                     + '<label for="goal">' + labels.goal + ': </label> <input type="textbox" name="goal" maxlength="9" size="9" />' 
                     + '</form>');
        this.render(document.body);
    } catch(e) {
        YAHOO.log('Error creating EditGoalDialog: ' + e, 'error', 'teamraiser_utils.js');
    }
};

YAHOO.Convio.PC2.Component.Teamraiser.TeamCaptainMessageComponent = function(comConfig) {
    var Config = comConfig;
    
    var loadCaptainsMessageCallback = {
        success: function(o) {
            var response = YAHOO.lang.JSON.parse(o.responseText).getCaptainsMessageResponse;
            var message = response.message;
            if(YAHOO.lang.isString(message)) {
                YAHOO.Convio.PC2.Component.Teamraiser.CaptainsMessage.setBody(message);
                var textElm = YAHOO.util.Dom.get(Config.editText);
                textElm.value = message;
            }
            if(response.editable == 'false') {
                //var editLinkElm = YAHOO.util.Dom.get(Config.editLinkContainer);
                //editLinkElm.style.display = 'none';
                hide_pc2_element(Config.editLinkContainer);
            }
            // If there's no message yet, and this participant can't edit the message
            // we should just hide the message.
            if(YAHOO.lang.isString(message)==false && response.editable == 'false') {
                YAHOO.Convio.PC2.Component.Teamraiser.CaptainsMessage.hide();
            } else {
                YAHOO.Convio.PC2.Component.Teamraiser.CaptainsMessage.show();
            }
            YAHOO.log('loadCaptainsMessage success', 'info', 'teamraiser_utils.js');
        },
        failure: function(o) {
            YAHOO.log(o.responseText, 'error', 'teamraiser_utils.js');
        },
        scope: YAHOO.Convio.PC2.Component.Teamraiser.TeamCaptainMessageComponent
    };
    
    var UpdateCaptainsMessageCallback = {
        success: function(o) {
            var textElm = YAHOO.util.Dom.get('captainsMessageEditText');
            YAHOO.Convio.PC2.Component.Teamraiser.CaptainsMessage.setBody(textElm.value);
            YAHOO.Convio.PC2.Component.Teamraiser.CaptainsMessage.show();
            YAHOO.log('updateCaptainsMessage success', 'info', 'dashboard.js');
        },
        failure: function(o) {
            YAHOO.log(o.responseText, 'error', 'dashboard.js');
        },
        scope: YAHOO.Convio.PC2.Component.Teamraiser
    };
    
    this.load = function() {
        YAHOO.Convio.PC2.Teamraiser.getCaptainsMessage(loadCaptainsMessageCallback);
    }
    
    this.showCaptainEdit = function() {
        show_pc2_element(Config.editContainer);
        hide_pc2_element(Config.emptyMessage);
        hide_pc2_element(Config.editLinkContainer);
    }

    this.saveCaptainMessage = function() {
    	hide_pc2_element(Config.editContainer);
    	show_pc2_element(Config.emptyMessage);
        var textElm = YAHOO.util.Dom.get(Config.editText);
        YAHOO.Convio.PC2.Teamraiser.updateCaptainsMessage(UpdateCaptainsMessageCallback, textElm.value);
        show_pc2_element(Config.editLinkContainer);
    }

    this.cancelCaptainEdit = function() {
    	hide_pc2_element(Config.editContainer);
    	show_pc2_element(Config.emptyMessage);
    	show_pc2_element(Config.editLinkContainer);
    }
    
    YAHOO.Convio.PC2.Component.Teamraiser.TeamCaptainMessageComponent.superclass.constructor.call(
        this, 
        comConfig.container, 
        {
            visible: false
        }
    );
    
    YAHOO.util.Event.addListener(Config.editLink, "click", this.showCaptainEdit);
    YAHOO.util.Event.addListener(Config.saveButton, "click", this.saveCaptainMessage);
    YAHOO.util.Event.addListener(Config.cancelLink, "click", this.cancelCaptainEdit);
};

YAHOO.Convio.PC2.Component.Teamraiser.PrivacySettingsComponent = function(objConfig) {
	var optionsAvailable = 0;
	var containerConfigured = false;
	var config = objConfig;
	var firstName;
	var lastName;
	var currentSelection;
	var currentScreenname;
	var screennameMaxLength;
	
	var UpdatePrivacySettingsCallback = {
			success: function(o) {
				YAHOO.Convio.PC2.Component.Teamraiser.PrivacySettings.hide();
				hide_pc2_element(YAHOO.Convio.PC2.Component.Teamraiser.PrivacySettings.ErrorDiv);
				YAHOO.Convio.PC2.Teamraiser.getRegistration(GetRegistrationCallback);
			},
			failure: function(o) {
				var err = YAHOO.lang.JSON.parse(o.responseText).errorResponse.message;
		        YAHOO.Convio.PC2.Component.Teamraiser.PrivacySettings.ErrorDiv.innerHTML = err;
		        show_pc2_element(YAHOO.Convio.PC2.Component.Teamraiser.PrivacySettings.ErrorDiv);
		        YAHOO.log(o.responseText, 'error', 'teamraiser_utils.js');
			},
			scope: YAHOO.Convio.PC2.Component.Teamraiser
	};
	
	var GetRegistrationCallback = {
			success: function(o) {
	            YAHOO.Convio.PC2.Component.Teamraiser.Registration = YAHOO.lang.JSON.parse(o.responseText).getRegistrationResponse.registration;
	            YAHOO.Convio.PC2.Data.Registration = YAHOO.Convio.PC2.Component.Teamraiser.Registration;
	            // Privacy Settings specific
	            YAHOO.Convio.PC2.Component.Teamraiser.PrivacySettings.parseRegistration(YAHOO.Convio.PC2.Data.Registration);
	            // Log sucess
	            YAHOO.log('update global registration data after privacy settings update success', 'info', 'teamraiser_utils.js');
	        },
	        failure: function(o) {
	            YAHOO.Convio.PC2.Config.redirectToHome();
	            YAHOO.log(o.responseText, 'error', 'teamraiser_utils.js');
	        },
	        scope: YAHOO.Convio.PC2.Component.Teamraiser	
	};
	
	this.configure = function (trConfig, reg, cons) {
		if (this.containerConfigured)
		{
			return;
		}
		
		containerConfigured = true;
		firstName = new String(cons.name.first);
		lastName = new String(cons.name.last);
		screennameMaxLength = parseInt(Number(trConfig.maxScreennameLengthAllowed));
		
		// Check to see if we need to display the radio options
		if (trConfig.standardRegistrationAllowed == 'true' ||
				trConfig.standardRegistrationAllowed == true)
		{
			optionsAvailable++;
		}
		if (trConfig.anonymousRegistrationAllowed == 'true' ||
				trConfig.anonymousRegistrationAllowed == true)
		{
			optionsAvailable++;
		}
		if (trConfig.screennameRegistrationAllowed == 'true' ||
				trConfig.screennameRegistrationAllowed == true)
		{
			optionsAvailable++;
		}
		
		// We only want to show the radio options when there is more than one option available
		if (optionsAvailable > 1)
		{
			if (trConfig.standardRegistrationAllowed == 'true' ||
					trConfig.standardRegistrationAllowed == true)
			{
				show_pc2_element(config.standardOption);
				show_pc2_element('standard_option_label');
			}
			if (trConfig.anonymousRegistrationAllowed == 'true' ||
					trConfig.anonymousRegistrationAllowed == true)
			{
				show_pc2_element(config.anonymousOption);
				show_pc2_element('anonymous_option_label');
			}
			if (trConfig.screennameRegistrationAllowed == 'true' ||
					trConfig.screennameRegistrationAllowed == true)
			{
				show_pc2_element(config.screennameOption);
				show_pc2_element(config.screennameField);
				show_pc2_element('screenname_option_label');
			}
			
			// show link
			show_pc2_element(config.dialogLink);
		}
		else if (optionsAvailable == 1 &&
				(trConfig.screennameRegistrationAllowed == 'true' ||
				trConfig.screennameRegistrationAllowed == true))
		{
			// if there's only one option available and it's screen name, display
			// just the screen name field
			show_pc2_element(config.screennameField);
			show_pc2_element('screenname_option_label');
			
			// show link
			show_pc2_element(config.dialogLink);
		}
		
		this.parseRegistration(reg);
	}
	
	this.parseRegistration = function(reg)
	{
		// preset privacy settings based on registration state
		if (reg.anonymous == true || reg.anonymous == 'true')
		{
			this.setSelection(config.anonymousOption, null);
		}
		else if (reg.screenname != '' && !YAHOO.lang.isNull(reg.screenname) &&
				!YAHOO.lang.isUndefined(reg.screenname))
		{
			this.setSelection(config.screennameOption, reg.screenname);
		}
		else
		{
			this.setSelection(config.standardOption, null);
		}
	}
	
	this.setSelection = function(option, screenname){
		if (option == config.standardOption)
		{
			var radio = document.getElementById(config.standardOption);
			radio.checked = true;
			var field = document.getElementById(config.screennameField);
			field.value = "";
			field.disabled = true;
			currentSelection = config.standardOption;
		}
		else if (option == config.anonymousOption)
		{
			var radio = document.getElementById(config.anonymousOption);
			radio.checked = true;
			var field = document.getElementById(config.screennameField);
			field.value = "";
			field.disabled = true;
			currentSelection = config.anonymousOption;
			
		}
		else if (option == config.screennameOption)
		{
			var radio = document.getElementById(config.screennameOption);
			radio.checked = true;
			var field = document.getElementById(config.screennameField);
			field.value = YAHOO.Convio.PC2.Utils.htmlUnescape(screenname);
			field.disabled = false;
			currentSelection = config.screennameOption;
			currentScreenname = screenname;
		}
	}
	
	this.trimScreenname = function(str) {
		return str.replace(/^\s*/, "").replace(/\s*$/, "");
	}
	
	this.validate = function() {
		var data = this.getData();
		var selectedOption = new String(data.privacyOptions);

		if (selectedOption.toString() == config.screennameOption.toString())
		{
			var errElm = document.getElementById(this.ErrorDiv);
			var suppliedScreenname = new String(data.screennameField);
			suppliedScreenname = this.trimScreenname(suppliedScreenname);
			var suppliedScreennameLength = parseInt(Number(suppliedScreenname.length));
			
			if (suppliedScreenname == '')
			{
                errElm.innerHTML = MsgCatProvider.getMsgCatValue('privacy_settings_error_no_screenname_specified');
                show_pc2_element(errElm);
                return false;
			}
			if (suppliedScreenname.toLowerCase().indexOf(firstName.toLowerCase()) > -1 
					&& suppliedScreenname.toLowerCase().indexOf(lastName.toLowerCase()) > -1)
			{
				errElm.innerHTML = MsgCatProvider.getMsgCatValue('privacy_settings_error_screenname_contains_name');
				show_pc2_element(errElm);
				return false;
			}
			if (suppliedScreennameLength > screennameMaxLength)
			{
				var errMsg = new String(MsgCatProvider.getMsgCatValue('privacy_settings_error_screenname_length'));
				errMsg = errMsg.replace("{0}", screennameMaxLength);
				errElm.innerHTML = errMsg;
				show_pc2_element(errElm);
				return false;
			}
		}
		
		// If somehow no selection was made, display an error message
		if (selectedOption.toString() != config.standardOption.toString() &&
				selectedOption.toString() != config.anonymousOption.toString() &&
				selectedOption.toString() != config.screennameOption.toString()) {
			
			errElm.innerHTM = MsgCatProvider.getMsgCatValue('privacy_settings_error_no_selection');
			show_pc2_element(errElm);
			return false;
		}
		return true;
	}
	
	this.handleSubmit = function() {
		if (this.validate())
		{
			var data = this.getData();
			var selectedOption = new String(data.privacyOptions);
			var suppliedScreenname = new String(data.screennameField);
			suppliedScreenname = this.trimScreenname(suppliedScreenname);
			
			if (selectedOption.toString() == currentSelection.toString())
			{
				if (selectedOption.toString() == config.screennameOption.toString() 
						&& suppliedScreenname.toString() != currentScreenname.toString())
				{
					var reg = {
						screenname: suppliedScreenname
					};
					YAHOO.Convio.PC2.Teamraiser.updateRegistration(UpdatePrivacySettingsCallback, reg);
				}
				else {
					// save was pressed but no actual changes have been made to privacy settings
					// it's the same as cancel
					this.handleCancel();
				}
			}
			else
			{
				if (selectedOption.toString() == config.standardOption.toString()) {
					var reg = {
							standardRegistration: 'true'
						};
					YAHOO.Convio.PC2.Teamraiser.updateRegistration(UpdatePrivacySettingsCallback, reg);
				}
				else if (selectedOption.toString() == config.anonymousOption.toString()) {
					var reg = {
						anonymousRegistration: 'true'
					};
					YAHOO.Convio.PC2.Teamraiser.updateRegistration(UpdatePrivacySettingsCallback, reg);
				}
				else if (selectedOption.toString() == config.screennameOption.toString()) {
					var reg = {
							screenname: suppliedScreenname
						};
					YAHOO.Convio.PC2.Teamraiser.updateRegistration(UpdatePrivacySettingsCallback, reg);
				}
			}
		}
	}
	
	this.handleCancel = function() {
		this.hide();
        YAHOO.util.Dom.addClass(this.ErrorDiv, "hidden-form");
        this.setSelection(currentSelection, currentScreenname);
	}
	
    var MsgCatProvider = YAHOO.Convio.PC2.Component.Content;
    var dialogConfig = {
    	width: "45em",
        modal: true, 
        visible : false, 
        close: false,
        fixedCenter: true,
        hideaftersubmit: false,
        buttons : [ { text:MsgCatProvider.getMsgCatValue('dialog_cancel'), handler:this.handleCancel },
                    { text:MsgCatProvider.getMsgCatValue('dialog_submit'), handler:this.handleSubmit, isDefault:true } ]
    };
    
    // invoke parent constructor
    YAHOO.Convio.PC2.Component.Teamraiser.PrivacySettingsComponent.superclass.constructor.call(
        this, 
        YAHOO.util.Dom.generateId(), 
        dialogConfig
    );

    this.setHeader('<h3 id="manage-display-name-title">'+ MsgCatProvider.getMsgCatValue(config.header) +'</h3>');
    this.ErrorDiv = "privacySettingsErrorDiv";
    this.setBody('<div id="'+ this.ErrorDiv +'" class="failure-message hidden-form"></div>'
    			+ '<form id="editPrivacySettings" action="javascript:void(0);">'
    				+ '<ul>'
    					+ '<li><input type="radio" id='+ config.standardOption +' name="privacyOptions" value=' + config.standardOption + ' class="hidden-form" onClick="'+ config.screennameField +'.disabled=true" /><span id='+ config.standardOptionLabel +' class="privacy-settings-radio-label hidden-form">'+ MsgCatProvider.getMsgCatValue(config.standardOptionLabelText) +'</span></li>'
    					+ '<li><input type="radio" id='+ config.anonymousOption +' name="privacyOptions" value=' + config.anonymousOption + ' class="hidden-form" onClick="'+ config.screennameField +'.disabled=true"/><span id='+ config.anonymousOptionLabel +' class="privacy-settings-radio-label hidden-form">'+ MsgCatProvider.getMsgCatValue(config.anonymousOptionLabelText) +'</span></li>'
    					+ '<li><input type="radio" id='+ config.screennameOption +' name="privacyOptions" value=' + config.screennameOption + ' class="hidden-form" onClick="'+ config.screennameField +'.disabled=false"/><span id='+ config.screennameOptionLabel +' class="privacy-settings-radio-label hidden-form">'+ MsgCatProvider.getMsgCatValue(config.screennameOptionLabelText) +'</span><span>&nbsp;&nbsp;</span><input type="textbox" id='+ config.screennameField +' name='+ config.screennameField +' class="hidden-form" maxlength="50" /></li>'
    				+ '</ul>'
    			+ '</form>');
    this.render(document.body);
}