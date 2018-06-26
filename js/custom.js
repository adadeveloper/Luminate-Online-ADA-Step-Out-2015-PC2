jQuery.noConflict();
var myFRID;
var myCID;
var ie;
var startWidth;
var wasdesktop;
var wasmobile;
var firstTime = 1;
var currToDo;

//YAHOO.Convio.PC2.Utils.LoadingMessage="Loading, please wait.";
//YAHOO.Convio.PC2.Utils.LoadingMessage_en_US="Loading, please wait.";

var loadCustomHandlers = function() {
    /*
     * This is an example for subscribing to the registrationLoaded event.
     * The single argument passed is the Registration object, which is also
     * saved to YAHOO.Convio.PC2.Data.Registration
     */
    //YAHOO.Convio.PC2.Utils.publisher.on("pc2:registrationLoaded", function(registration) {
    //    YAHOO.log("registrationId: " + registration.registrationId, "debug", "custom.js");
    //});
    
    /*
     * This is an example for subscribing to the constituentLoaded event.
     * The single argument passed is the user object, which is also
     * saved to YAHOO.Convio.PC2.Data.User
     */
   YAHOO.Convio.PC2.Utils.publisher.on("pc2:constituentLoaded", function(user) {
    //    YAHOO.log("name: " + user.name.first + ' ' + user.name.last, "debug", "custom.js");
	myCID = user.cons_id;
   });
   YAHOO.Convio.PC2.Utils.publisher.on("pc2:allContactsLoaded", function(user) {
	   /*if ( window.console && window.console.log ) {
			console.log("All Contact Loaded");			
		}*/		
   });
   
    /*
     * This is an example for subscribing to the wrapperLoaded event.
     * The single argument passed is the wrapper object.
     */
    //YAHOO.Convio.PC2.Utils.publisher.on("pc2:wrapperLoaded", function(wrapper) {
    //    YAHOO.log("personal page URL: " + wrapper.personalPageUrl, "debug", "custom.js");
    //});
    
    /*
     * This is an example for subscribing to the configurationLoaded event.
     * The single argument passed is the config object, which is also
     * saved to YAHOO.Convio.PC2.Data.TeamraiserConfig
     */
    //YAHOO.Convio.PC2.Utils.publisher.on("pc2:configurationLoaded", function(config) {
    //    YAHOO.log("Accepting donations: " + config.acceptingDonations, "debug", "custom.js");
	//    YAHOO.Convio.PC2.Data.TeamraiserConfig.AdminNewsFeed.showAdminNewsFeed = false;
	//    YAHOO.Convio.PC2.Data.TeamraiserConfig.AdminNewsFeed.feedCount = 1;
	//    YAHOO.Convio.PC2.Data.TeamraiserConfig.AdminNewsFeed.cycleInterval = 0;
	// 	  YAHOO.Convio.PC2.Data.TeamraiserConfig.AdminNewsFeed.maxTextLength = 50;
	// 	  YAHOO.Convio.PC2.Data.TeamraiserConfig.AdminNewsFeed.showBelowProgress = true;
    //});
    
    /*
     * This is an example for subscribing to the participantProgressLoaded event.
     * The single argument passed is the progressData object, which is also
     * saved to YAHOO.Convio.PC2.Data.ProgressData
     */
    //YAHOO.Convio.PC2.Utils.publisher.on("pc2:participantProgressLoaded", function(progressData) {
    //    YAHOO.log("Days left: " + progressData.daysLeft, "debug", "custom.js");
    //});
    
    /*
     * This is an example for subscribing to the viewChanged event.
     * The single argument passed is the viewChange object, which has 
     * these attributes.
     * 
     * oldView: the name of the old primary view.
     * oldSubview: the name of the old subview.
     * view: the name of the new primary view.
     * subview: the name of the new subview.
     */
    //YAHOO.Convio.PC2.Utils.publisher.on("pc2:viewChanged", function(viewChange) {
    //    YAHOO.log("View changed. Old was: " + viewChange.oldView + "-" + viewChange.oldSubview 
    //            + ". New is: " + viewChange.view + "-" + viewChange.subview + ".", "debug", "custom.js");
    //});
    
    /*
     * This is an example for subscribing to the contactAdded event.
     * The single argument passed is the contact, or array of contacts, added
     * by an explicit API call.
     * 
     * Note that this event will not fire if a contact is added as a 
     * side effect of another action such as processing an offline gift.
     */
    //YAHOO.Convio.PC2.Utils.publisher.on("pc2:contactAdded", function(contacts) {
    //    contacts = YAHOO.Convio.PC2.Utils.ensureArray(contacts);
    //    YAHOO.log("Number of contacts added: " + contacts.length, "debug", "custom.js");
    //});
    
    /*
     * This is an example for subscribing to the emailSent event.
     * The single argument passed is the JSON object containing a 
     * success flag.
     */
    //YAHOO.Convio.PC2.Utils.publisher.on("pc2:emailSent", function(response) {
    //    YAHOO.log("Email sent: " + response.success, "debug", "custom.js");
    //});
    
    /*
     * This is an example for subscribing to the personalPageUpdated event.
     * The single argument passed is the JSON object containing a 
     * success flag.
     */
    //YAHOO.Convio.PC2.Utils.publisher.on("pc2:personalPageUpdated", function(response) {
    //    YAHOO.log("Personal page updated: " + response.success, "debug", "custom.js");
    //});
	
	/*
     * This is an example for subscribing to the suggestionLoaded event.
     * The single argument passed is the Suggestion object.
     */
//    YAHOO.Convio.PC2.Utils.publisher.on("pc2:suggestionLoaded", function(suggestion) {
//    	
//        YAHOO.log("Loaded default 'what next?' suggestion: " + suggestion.success, "debug", "custom.js");
//        
//        // resolve a self-donation URL
//        var personalDonationUrl = YAHOO.Convio.PC2.Data.personalDonationUrl;
//        
//        // if users has self-donation URL and is not already a self-donor
//        if (personalDonationUrl && YAHOO.Convio.PC2.Data.Registration.selfDonor == 'false') {
//        	
//        	var el = YAHOO.util.Dom.get("what-next-answer");
//        	el.innerHTML = "<a href=\"" + personalDonationUrl + "\"> Make a self-donation.</a>";
//        	
//        	YAHOO.log("Overwrote default 'what next?' suggestion; self-donation message", "debug", "custom.js");
//        }
//        
//    });
}

/* Executes after new JS is dynamically loaded, 
 * and before new view load begins. */
var loadOverrides = function(view, subview) {
    // Override functions defined in external JS files
}

var loadCustom = function() {
    /*
     * You can execute a function once all of the specified
     * events have fired with the YAHOO.Convio.PC2.Utils.require
     * function. 
     */
    YAHOO.Convio.PC2.Utils.require("pc2:registrationLoaded", "pc2:constituentLoaded", "pc2:configurationLoaded", "pc2:wrapperLoaded", function() {
    //    YAHOO.log("Registration, Constituent, Configuration, and Wrapper are all loaded.", "debug", "custom.js");
    	renderADADashboardComponent();			
		renderADADebug();
	});
    YAHOO.Convio.PC2.Utils.require("pc2:allContactsLoaded", function() {
    	//jQuery('[id^=yuievtautoid-]').stacktable({hideOriginal:true});
	});
    /*
    var leftNav = document.createElement("div");
    leftNav.id = "custom_left_nav";
    
    var leftNavContent = document.createElement("p");
    leftNavContent.appendChild(document.createTextNode("Hello left nav"));
    leftNav.appendChild(leftNavContent);
    
    YAHOO.util.Dom.addClass(leftNav, "custom-left-nav");
    
    var firstChild = YAHOO.util.Dom.getFirstChild("yui-main");
    YAHOO.util.Dom.insertBefore(leftNav, firstChild);
    */
};

function renderADADashboardComponent(){
	myFRID = getURLParameter("fr_id");
	ie = getInternetExplorerVersion();		
	
	jQuery('#sidebar').insertAfter('#content');		
		
	jQuery('#ADAImportantMsg').load('../site/SPageServer?pagename=OUT_PC2_ImportantMsg_DH&fr_id='+myFRID+'&mycid='+myCID+'&pgwrap=n',function(){renderImportantMsg()});
	jQuery('#adaHomeLeft').load('../site/SPageServer?pagename=OUT_PC2_Home_Left_DH&fr_id='+myFRID+'&mycid='+myCID+'&pgwrap=n', function(){renderLeftHomeComponent()});
	jQuery('#adaToDoBox').load('../site/SPageServer?pagename=OUT_PC2_ToDoBox_DH&fr_id='+myFRID+'&mycid='+myCID+'&pgwrap=n',function(){taskRotator()});
	jQuery('#adaBadgesTopTen').load('../site/SPageServer?pagename=OUT_PC2_Home_Badge_TopTen_DH&fr_id='+myFRID+'&mycid='+myCID+'&pgwrap=n',function(){renderTopFundraisersAndTeam()});	
	jQuery('#s51-fundraising-tools').load('../site/SPageServer?pagename=OUT_PC2_FundraisingTool_DH&fr_id='+myFRID+'&mycid='+myCID+'&pgwrap=n',function(){customMenu()});
	jQuery('#adaFooter').load('../site/SPageServer?pagename=OUT_Footer_DH&pgwrap=n');
	
	
	customADALayoutConfiguration();	
	menuArrowHandler();
	customClickListener();
}

function customPopup(){	
	 if (getURLParameter("typop") == "y") {
        jQuery.magnificPopup.open({
            items: {
                src: "#tyRegPop"
            },
            type: "inline"
        });
		var mytotalamt = getURLParameter("totalamt");
		var myrevisedtotalamt = decodeURIComponent(mytotalamt.replace(/\+/g,  " "));
		var mymrkt = getURLParameter("mrkt");
		var myrevisedmrkt = decodeURIComponent(mymrkt.replace(/\+/g,  " "));
		var mydedct = getURLParameter("dedct");
		var myreviseddedct = decodeURIComponent(mydedct.replace(/\+/g,  " "));
		
        jQuery("#valT").text(myrevisedtotalamt);
        jQuery("#valM").text(myrevisedmrkt);
        jQuery("#valD").text(myreviseddedct)
    } else {
        if (/iPhone/i.test(navigator.userAgent)) {
            if (jQuery.cookie("soappvisited") != "y") {
                jQuery.magnificPopup.open({
                    items: {
                        src: "#iphoneApp"
                    },
                    type: "inline"
                });
                jQuery.cookie("soappvisited", "y")
            }
        }
		if (/iPad/i.test(navigator.userAgent)) {
            if (jQuery.cookie("soappvisited") != "y") {
                jQuery.magnificPopup.open({
                    items: {
                        src: "#ipadApp"
                    },
                    type: "inline"
                });
                jQuery.cookie("soappvisited", "y")
            }
        }
        if (/Android/i.test(navigator.userAgent)) {
            if (jQuery.cookie("soappvisited") != "y") {
                jQuery.magnificPopup.open({
                    items: {
                        src: "#droidApp"
                    },
                    type: "inline"
                });
                jQuery.cookie("soappvisited", "y")
            }
        }
    }
}

function customADALayoutConfiguration(){
	customLeftSideDivConfigure();
	customEmailConfigure();
	jQuery('.secondaryADALeftBox').prepend('<h1 style="margin-top:0px;">Related Actions</h1>');
	startWidth = jQuery(window).width();
	 if (jQuery(window).width() > 1015) { 
	      wasmobile="n";
		  wasdesktop="y";      
		  configureDesktop();		  
     } else {
		  wasmobile="y";
	      wasdesktop="n";	  	
          configureMobile();
     }
	 if (ie == 8) {
            document.body.onresize = function() {
				if(jQuery(window).width() != startWidth){
					 if(startWidth > 1015){
						wasmobile="n";
						wasdesktop="y";
					 }else {
						wasmobile="y";
						wasdesktop="n"; 
					 }
					 if (jQuery(window).width() > 1015) {						  
						  configureDesktop();
						  startWidth = jQuery(window).width();
					 } else {						  
						  configureMobile()
						  startWidth = jQuery(window).width();
					 }
				}
			}
		} else {
            jQuery(window).resize(function() {				
				if(jQuery(window).width() != startWidth){
					 if(startWidth > 1015){
						wasmobile="n";
						wasdesktop="y";
					 }else {
						wasmobile="y";
						wasdesktop="n"; 
					 }	
					if (jQuery(window).width() > 1015) {						  			
						  configureDesktop();
						  startWidth = jQuery(window).width();
					 } else {						  			 
						  configureMobile();
						  startWidth = jQuery(window).width();
					 }
				}
            });
		}        
}

function configureDesktop(){	
	jQuery('#ADAMAINPCNAV').show();
	jQuery('#ADAMsgNotif').append(jQuery('#ADAMsgNotifContent'));
	if(firstTime == 0){
		jQuery('#adaHomeLeft').append(jQuery('#homeADALeftBottom'));
	}
			
	if((wasmobile == 'y')||(firstTime == 1)){
		jQuery('.secondaryADALeftBox').each(function(){
			jQuery(this).insertBefore(jQuery(this).prev('.secondaryADARightBox')); 
		});	
		firstTime = 0;
	}
	jQuery('li','#hd-nav').click(function(){
		jQuery('#ADAMAINPCNAV').show();
	});
	jQuery('#hd-small-left').show();
	jQuery('#hd-small-right').show();
}
function configureMobile(){	
	jQuery('#ADAMAINPCNAV').hide();
	jQuery('#ADAMsgNotifContent').insertAfter(jQuery('#ADAMsgNotif'));
	if(firstTime == 0){
		jQuery('#homeADALeftBottom').insertAfter(jQuery('#bd-recent-activity'));	
	}
	
	if((wasdesktop == 'y')||(firstTime == 1)){
		jQuery('.secondaryADALeftBox').each(function(){
			jQuery(this).insertAfter(jQuery(this).next('.secondaryADARightBox')); 
		});	
		firstTime = 0;	
	}
	jQuery('li','#hd-nav').click(function(){
		jQuery('#ADAMAINPCNAV').hide();
	});
	
	jQuery('#email-wizard-preview').css('max-width',jQuery(window).width());
}

function customEmailConfigure(){	
	//initialize
		jQuery('#msg_cat_wizard_nav_configure').text('Message & Stationery');
		jQuery('#msg_cat_wizard_nav_compose').text('Write It!');
		jQuery('#msg_cat_wizard_nav_contacts').text('Who To?');
		jQuery('#msg_cat_wizard_nav_preview').text('Preview & Send');
		jQuery('#msg_cat_subnav_drafts_link_label').text('View Drafts');
		jQuery('#msg_cat_subnav_sent_link_label').text('View Sent');
		jQuery('#ADAEmailInstHeading').text('Message & Stationery');
		jQuery('#ADAEmailInstruction').html('<p><b>Select a pre-written email template below. You will have a chance to edit the content in the next step. Select "Blank Message" to compose your own.</b></p>.<p>Related actions: You may also restore a previously saved draft. To save what you\'ve done so far as a draft you must enter a subject line.</p>');		
		
}

function customLeftSideDivConfigure(){
	jQuery('#emailADALeft').append(jQuery('#email-sidebar'));
	jQuery('#emailADALeft').append(jQuery('#msg_cat_compose_save_draft_button_label'));
	jQuery('#emailADALeft').append(jQuery('#msg_cat_compose_save_template_button_label'));
	jQuery('#teampageADALeft').append(jQuery('#teampage-sidebar'));
	jQuery('#personalpageADALeft').append(jQuery('#personalpage-sidebar'));
	jQuery('#progresspageADALeft').append(jQuery('#report-sidebar'));
	jQuery('#companypageADALeft').append(jQuery('#companypage-sidebar'));
	jQuery('#msg_cat_team_page_company_name_title').text('Team Affiliation');
	jQuery('#msg_cat_team_edit_company_list_label').text('Team Affiliation');
	jQuery('#msg_cat_team_team_division_label').text('Team Type');
	jQuery('#msg_cat_team_team_division_edit_label').text('Team Type');
}

function customClickListener(){
	//mobile 
	jQuery('#mobileMyCenterBlock').click(function(){
		jQuery('#hd-small-left').toggle();
		jQuery('#hd-small-right').toggle();
	});
	/*jQuery('.email-wizard-recipients-actions-button').on('click',function(){
		 if(jQuery(this).text().match('Edit')){
     		jQuery("html, body").animate({ scrollTop: 0 }, "slow");  
    	}		
	});*/
	//left side movearound
	//home
	jQuery('#cstm-home-todofocus').click(function(){
		jQuery('#adaHomeLeft').append(jQuery('#homeADALeftTop'));
		if (jQuery(window).width() > 1015) {	
		jQuery('#adaHomeLeft').append(jQuery('#homeADALeftBottom'));
		}else{
		jQuery('#homeADALeftBottom').insertAfter(jQuery('#bd-recent-activity'));	
		}
		//jQuery('#homeADALeftTop').insertBefore(jQuery('#homeADALeftMiddle'));
		jQuery('#changeGoal').append(jQuery('#progress-change-goal-link'));
	});
	jQuery('#msg_cat_nav_overview').click(function(){
		jQuery('#adaHomeLeft').append(jQuery('#homeADALeftTop'));
		if (jQuery(window).width() > 1015) {	
		jQuery('#adaHomeLeft').append(jQuery('#homeADALeftBottom'));
		}else{
		jQuery('#homeADALeftBottom').insertAfter(jQuery('#bd-recent-activity'));	
		}
		//jQuery('#homeADALeftTop').insertBefore(jQuery('#homeADALeftMiddle'));
		jQuery('#changeGoal').append(jQuery('#progress-change-goal-link'));
	});	
	//progress	
	jQuery('#msg_cat_nav_reports').click(function(){
		jQuery('#progresspageADALeft').append(jQuery('#report-sidebar'));
		jQuery('#progresspageADALeft').append(jQuery('#homeADALeftTop'));
		jQuery('#progresspageADALeft').append(jQuery('#homeADALeftBottom'));
		jQuery('#msg_cat_progress_my_goal').append(jQuery('#progress-change-goal-link'));
		
	});
	jQuery('#msg_cat_personal_link_label').click(function(){
		jQuery('#progresspageADALeft').append(jQuery('#report-sidebar'));
		jQuery('#progresspageADALeft').append(jQuery('#homeADALeftTop'));
		jQuery('#progresspageADALeft').append(jQuery('#homeADALeftBottom'));
		jQuery('#msg_cat_progress_my_goal').append(jQuery('#progress-change-goal-link'));
		
	});
	jQuery('#msg_cat_team_link_label').click(function(){
		jQuery('#progressTeamCompanypageADALeft').append(jQuery('#report-sidebar'));
		jQuery('#progressTeamCompanypageADALeft').append(jQuery('#homeADALeftTop'));
		jQuery('#progressTeamCompanypageADALeft').append(jQuery('#homeADALeftBottom'));		
		jQuery('#msg_cat_progress_my_goal').append(jQuery('#progress-change-goal-link'));
	});
	jQuery('#msg_cat_company_link_label').click(function(){
		jQuery('#progressTeamCompanypageADALeft').append(jQuery('#report-sidebar'));
		jQuery('#progressTeamCompanypageADALeft').append(jQuery('#homeADALeftTop'));
		jQuery('#progressTeamCompanypageADALeft').append(jQuery('#homeADALeftBottom'));
		jQuery('#msg_cat_progress_my_goal').append(jQuery('#progress-change-goal-link'));		
	});
	
	//personal page
	jQuery('#msg_cat_nav_public_page').click(function(){
		jQuery('#personalpageADALeft').append(jQuery('#personalpage-sidebar'));
		jQuery('#personalpageADALeft').append(jQuery('#homeADALeftTop'));
		jQuery('#personalpageADALeft').append(jQuery('#homeADALeftBottom'));
		jQuery('#msg_cat_progress_my_goal').append(jQuery('#progress-change-goal-link'));
		
	});
	
	//team page
	jQuery('#msg_cat_nav_team_page').click(function(){
		jQuery('#teampageADALeft').append(jQuery('#teampage-sidebar'));
		jQuery('#teampageADALeft').append(jQuery('#homeADALeftTop'));
		jQuery('#teampageADALeft').append(jQuery('#homeADALeftBottom'));
		jQuery('#msg_cat_progress_my_goal').append(jQuery('#progress-change-goal-link'));		
	});	
	//company page
	jQuery('#msg_cat_nav_company_page').click(function(){
		jQuery('#companypageADALeft').append(jQuery('#companypage-sidebar'));
		jQuery('#companypageADALeft').append(jQuery('#homeADALeftTop'));
		jQuery('#companypageADALeft').append(jQuery('#homeADALeftBottom'));
		jQuery('#msg_cat_progress_my_goal').append(jQuery('#progress-change-goal-link'));		
	});
	//fundraising tools
	jQuery('#custom-fundraisetool-nav-link').click(function(){
		jQuery('#fundraiseADALeft').append(jQuery('#homeADALeftTop'));
		jQuery('#fundraiseADALeft').append(jQuery('#homeADALeftBottom'));
		jQuery('#msg_cat_progress_my_goal').append(jQuery('#progress-change-goal-link'));
	});
	
	//offline gift check overwrite
	jQuery('#gift_payment_type_check').click(function(){
		jQuery('#check_number').attr('value','0');
	});	
	jQuery('#dashboard-nav-link').click(function(){
		jQuery('#amtRaisedVal').text(jQuery('#progress-amt-raised-value').text());
		doThermo();
	});
	
	//email flow
	jQuery('#email-nav-link').click(function(){
		jQuery('#msg_cat_compose_save_draft_button_label').show();
		jQuery('#msg_cat_compose_save_template_button_label').show();
	});
	jQuery('#msg_cat_subnav_compose_link_label').click(function(){
		jQuery('#msg_cat_compose_save_draft_button_label').show();
		jQuery('#msg_cat_compose_save_template_button_label').show();
	});
	jQuery('#msg_cat_subnav_drafts_link_label').click(function(){
		jQuery('#msg_cat_compose_save_draft_button_label').hide();
		jQuery('#msg_cat_compose_save_template_button_label').hide();
	});
	jQuery('#msg_cat_subnav_sent_link_label').click(function(){
		jQuery('#msg_cat_compose_save_draft_button_label').hide();
		jQuery('#msg_cat_compose_save_template_button_label').hide();
	});
	jQuery('#msg_cat_subnav_contacts_link_label').click(function(){
		jQuery('#msg_cat_compose_save_draft_button_label').hide();
		jQuery('#msg_cat_compose_save_template_button_label').hide();
	});
		
	jQuery('#email-wizard-nav-configure').click(function(){
		jQuery('#ADAEmailInstHeading').text('Message & Stationery');
		jQuery('#ADAEmailInstruction').html('<p><b>Select a pre-written email template below. You will have a chance to edit the content in the next step. Select "Blank Message" to compose your own.</b></p>.<p>Related actions: You may also restore a previously saved draft. To save what you\'ve done so far as a draft you must enter a subject line.</p>');
	});
	
	jQuery('#email-wizard-nav-compose').click(function(){
		jQuery('#ADAEmailInstHeading').text('Write It!');
		jQuery('#ADAEmailInstruction').html('<p><b>Personalize your message.</b></p>.<p>Related actions: You may also restore a previously saved draft. To save what you\'ve done so far as a draft you must enter a subject line. To go back to previous steps, click on the step name above.</p><p>&nbsp;</p>');
	});
	
	jQuery('#email-wizard-nav-contacts').click(function(){
		jQuery('#ADAEmailInstHeading').text('Who To?');
		jQuery('#ADAEmailInstruction').html('<p><b>Select your recipients.</b></p>.<p>Related actions: You may select them individually, or filter by group. You may also restore a previously saved draft. To save what you\'ve done so far as a draft you must enter a subject line. To unselect your recipient either uncheck the checkbox associated to them or click on the remove button. To go back to previous steps, click on the step name above.</p><p>&nbsp;</p>');
	});
	jQuery('#email-wizard-nav-preview').click(function(){
		jQuery('#ADAEmailInstHeading').text('Preview & Send');
		jQuery('#ADAEmailInstruction').html('<p><b>You may send the email when you are ready. To go back to previous steps, click on the step name above.</b></p>.<p>&nbsp;</p>');
	});
	
	//nexts and send	
	jQuery('#email_wizard_compose_email_button').click(function(){
		jQuery('#ADAEmailInstHeading').text('Write It!');
		jQuery('#ADAEmailInstruction').html('<p><b>Personalize your message.</b></p>.<p>Related actions: You may also restore a previously saved draft. To save what you\'ve done so far as a draft you must enter a subject line. To go back to previous steps, click on the step name above.</p><p>&nbsp;</p>');
	});
	
	jQuery('#email_wizard_set_recipients_button').click(function(){
		jQuery('#ADAEmailInstHeading').text('Who To?');
		jQuery('#ADAEmailInstruction').html('<p><b>Select your recipients.</b></p>.<p>Related actions: You may select them individually, or filter by group. You may also restore a previously saved draft. To save what you\'ve done so far as a draft you must enter a subject line. To unselect your recipient either uncheck the checkbox associated to them or click on the remove button. To go back to previous steps, click on the step name above.</p><p>&nbsp;</p>');
	});
	jQuery('#email_wizard_preview_and_send_button').click(function(){
		jQuery('#ADAEmailInstHeading').text('Preview & Send');
		jQuery('#ADAEmailInstruction').html('<p><b>You may send the email when you are ready.</b></p>.<p>&nbsp;</p>');
	});
	jQuery('#msg_cat_compose_send_button_label').click(function(){
		jQuery('#ADAEmailInstHeading').text('Message & Stationery');
		jQuery('#ADAEmailInstruction').html('<p><b>Select a pre-written email template below. You will have a chance to edit the content in the next step. Select "Blank Message" to compose your own.</b></p>.<p>Related actions: You may also restore a previously saved draft. To save what you\'ve done so far as a draft you must enter a subject line.</p>');
	});
	
	//important message to you
	jQuery('#ADAMsgNotifHeading').click(function(){
		jQuery('#ADAMsgNotifContent').toggle(function(){
			if(jQuery('#ADAMsgNotifContent').is(':visible')){
				jQuery('#ADAMsgNotif').css('border','1px solid #D8D8D8');
				if(jQuery(window).width() > 1015){
				jQuery('#ADAMsgNotif').css('background-image','url("images/custom/msgnotif_expand.jpg")');
				}
			} else {
				jQuery('#ADAMsgNotif').css('border','0px');
				if(jQuery(window).width() > 1015){
				jQuery('#ADAMsgNotif').css('background-image','url("images/custom/msgnotif_collapse.jpg")');
				}
			}
		});		
	});
	
}

function renderImportantMsg(){	
	jQuery('#ADAMsgNotifContent').append(jQuery('#captainsMessage'));
	//auto hide vote survey
		var r = new Date(2015, 4, 19);
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        var i = new Date(yyyy, mm, dd);
        if (i > r) {
            jQuery("#sv2Msg").hide();
        } else {
            jQuery("#sv2Msg").show();
        }
}
function menuArrowHandler(){
	jQuery('#cstm-update-pg-nav-link').mouseover(function(){
	  navArrowSwap(jQuery('#cstm-update-pg-nav-link'),'y');
	});
	
	jQuery('#cstm-update-pg-nav-link').mouseout(function(){
	  if(jQuery('#cstm-update-pg-nav-link').parent().next('ul').length > 0) {					
	    navArrowSwap(jQuery('#cstm-update-pg-nav-link'),'y');	
	  }else {
	    navArrowSwap(jQuery('#cstm-update-pg-nav-link'),'n');				
	  }
	});		
}
function navArrowSwap(whichOne,whichMode){
	//reset
	jQuery('.fa-chevron-circle-right',whichOne).show();
	jQuery('.fa-chevron-circle-down',whichOne).hide();
	if(whichMode=='y'){
	jQuery('span:nth-child(2)',whichOne).hide();
	jQuery('span:nth-child(3)',whichOne).show();
	}else {
	jQuery('span:nth-child(2)',whichOne).show();
	jQuery('span:nth-child(3)',whichOne).hide();
	}
}
function renderADADebug(){
	if ( window.console && window.console.log ) {
  		console.log("FRID is "+myFRID);
		console.log("CONSID is "+myCID);
	}
}
WebFontConfig = {
    google: {
        families: ["Montserrat::latin"]
    }
};
function getURLParameter(name) {
        return decodeURI(
            (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]
        );
}
function renderLeftHomeComponent(){
	
	if (jQuery(window).width() > 1015) {	
		jQuery('#adaHomeLeft').append(jQuery('#homeADALeftBottom'));
	}else{
		jQuery('#homeADALeftBottom').insertAfter(jQuery('#bd-recent-activity'));	
	}
	jQuery('#changeGoal').append(jQuery('#progress-change-goal-link'));	
	doThermo();
	//jQuery("input[name='goal']","#yui-gen3_c").change(function(){	
	//go with when submit is hit instead.
	jQuery("#yui-gen6-button","#yui-gen3_c").on('click',function(){	
		var oriGoalInput = jQuery("#goalAmtVal").text();
		var rawGoalInput = jQuery("input[name='goal']","#yui-gen3_c").val();		
		var revisedGoalInput = rawGoalInput.replace('$','');
		if(isNaN(revisedGoalInput)){
		jQuery("#goalAmtVal").text(oriGoalInput);
		} else{
		jQuery("#goalAmtVal").text("$"+revisedGoalInput);
		doThermo();		
		}
	});
	
		
}
function doThermo(){
	//do thermo
	var mygoal = formatDollarAmout(jQuery('#goalAmtVal').text());
	var myraised = formatDollarAmout(jQuery('#amtRaisedVal').text());
	
	if (mygoal==0 || myraised==0) {
			var myprogress = 0;
	} else if (myraised >= mygoal) {
			var myprogress = -1;
	} else {
		var myprogress = Math.ceil((myraised/mygoal)*100);
	}
	if(myprogress != -1){
		jQuery('#pctValue').text(myprogress+'%');
		var progress_pct = myprogress+"%";
	} else {
		jQuery('#pctValue').html('<span style="color:#FFF;">Goal Surpassed!</span>');	
		var progress_pct = 100+"%";
	}	
	jQuery('#thermometer-progress-fill').animate({
				width: progress_pct
			}, 3500);
	
		
}
function formatDollarAmout(a) {		
		var parsed = a.split("$");			
		var amount = Math.floor(parsed[1].replace(/\,/g,''));		
		return parseInt(amount);
}
function renderTopFundraisersAndTeam(){
	//RS Badge	
	var isRS=jQuery('#isRS').text();
	var s = isRS.toLowerCase();
    if (s.indexOf("red strider") > -1) {
        jQuery("#RSBadge").show();
        jQuery("#RSBadgeTxt").show()
    } else {
        jQuery("#RSBadge").hide();
        jQuery("#RSBadgeTxt").hide()
    }
	
	var z = 1;
	jQuery('#hidden-teamlists ol').each(function(){
    jQuery(this).attr('id','toplisting'+z);
	z++;
  	});
	jQuery('#famfriend').append(jQuery('#toplisting1'));	
	jQuery('#corpteam').append(jQuery('#toplisting2'));
	jQuery('#cluborg').append(jQuery('#toplisting3'));
	//fix that missing badge image convio bug
	jQuery('#individuals li a').each(function(){
		jQuery(this).attr('class','participantLink');	
		jQuery(this).parent().prepend(this);
 	});
	jQuery('#individuals img').each(function(){	
			  var imgsrc = jQuery(this).attr('src');
			  var imgalt = jQuery(this).attr('alt');
			  
			  if (imgalt === 'Team Captain') {imgsrc = '../ws/so/so2013/img/milestone-badges/team_captain.png'; imgalt = 'Team Captain'; }
			  if (imgalt === 'Stop Diabetes')	{ imgsrc = '../ws/so/so2013/img/milestone-badges/self_donor.png'; imgalt = 'Made a Personal Donation'; }
			  if (imgalt === 'Hang the Banner')	{ imgsrc = '../ws/so/so2013/img/milestone-badges/level_350.png'; imgalt = '$350: Hang the Banner'; }
			  if (imgalt === 'Fast Walker')	{ imgsrc = '../ws/so/so2013/img/milestone-badges/level_200.png'; imgalt = '$200: Fast Walker'; }
			  if (imgalt === 'Shining Bright')	{ imgsrc = '../ws/so/so2013/img/milestone-badges/level_600.png'; imgalt = '$600: Shining Bright'; }
			  if (imgalt === 'Champion to Stop Diabetes')	{ imgsrc = '../ws/so/so2013/img/milestone-badges/level_1000.png'; imgalt = '$1,000: Champion to Stop Diabetes'; }
			  if (imgalt === 'Stacking Up')	{ imgsrc = '../ws/so/so2013/img/milestone-badges/level_2000.png'; imgalt = '$2,000: Stacking Up'; }
			  if (imgalt === 'Leading the Pack')	{ imgsrc = '../ws/so/so2013/img/milestone-badges/level_3000.png'; imgalt = '$3,000: Leading the Pack'; }
			  if (imgalt === 'Step Out Star')	{ imgsrc = '../ws/so/so2013/img/milestone-badges/level_5000.png'; imgalt = '$5,000: You\'re a Star'; }
			  if (imgalt === 'Trophy Worthy')	{ imgsrc = '../ws/so/so2013/img/milestone-badges/level_10000.png'; imgalt = '$10,000: Trophy Worthy'; }
			  
			  jQuery(this).attr('src',imgsrc);
			  jQuery(this).attr('alt',imgalt); 
	});
	jQuery('#top-riders-teams a').each(function(){
		jQuery(this).attr('target','_blank');	
	});
	
	jQuery(".magframebox").magnificPopup({
            disableOn: 0,
            type: "iframe",
            mainClass: "mfp-fade",
            removalDelay: 160,
            preloader: false,
            fixedContentPos: false
     }); 
     customPopup();
}
function taskRotator() {
    jQuery(".taskNavItem").click(function() {
        var e = parseInt(jQuery(".taskNavNum", this).text());
        for (var t = 1; t <= 3; t++) {
                if (t == e) {
                    jQuery("#wnTaskNav" + t).addClass("tnnactive");
                    jQuery("#task" + t + "Content").show()
                } else {
                    jQuery("#wnTaskNav" + t).removeClass("tnnactive");
                    jQuery("#task" + t + "Content").hide()
                }
         }        
    });
    jQuery(".todoHeader").click(function() {
		if((typeof currToDo == "undefined") || (currToDo != jQuery(this).prop("id"))){
			currToDo = jQuery(this).prop("id");		
			var e = jQuery(this).prop("id");
			var t = parseInt(e.substr(e.length - 1));
			for (var n = 1; n <= 7; n++) {
				if (n == t) {
					jQuery("#todoimg" + n).attr("src", "images/custom/chevron_todo_dn.png");
					jQuery("#todo" + n + "content").show()
				} else {
					jQuery("#todoimg" + n).attr("src", "images/custom/chevron_todo.png");
					jQuery("#todo" + n + "content").hide()
				}
			}
		} else {			
			var e = jQuery(this).prop("id");
			var t = parseInt(e.substr(e.length - 1));
			for (var n = 1; n <= 7; n++) {
				if (n == t) {					
					jQuery("#todo" + n + "content").toggle()
					if(jQuery("#todo" + n + "content").is(':visible')){
						jQuery("#todoimg" + n).attr("src", "images/custom/chevron_todo_dn.png");
					}else {
						jQuery("#todoimg" + n).attr("src", "images/custom/chevron_todo.png");
					}
				} else {
					jQuery("#todoimg" + n).attr("src", "images/custom/chevron_todo.png");
					jQuery("#todo" + n + "content").hide()
				}
			}
		}
    }); 
	
	jQuery('#myTaskLink3').click(function(){
		jQuery('#personalpageADALeft').append(jQuery('#personalpage-sidebar'));
		jQuery('#personalpageADALeft').append(jQuery('#homeADALeftTop'));
		jQuery('#personalpageADALeft').append(jQuery('#homeADALeftBottom'));
		jQuery('#progress-change-goal-link').hide();
	});
	jQuery('#myTodo1PersonalPage').click(function(){
		jQuery('#personalpageADALeft').append(jQuery('#personalpage-sidebar'));
		jQuery('#personalpageADALeft').append(jQuery('#homeADALeftTop'));
		jQuery('#personalpageADALeft').append(jQuery('#homeADALeftBottom'));
		jQuery('#progress-change-goal-link').hide();
	});
	jQuery('#myTodoTeamPage').click(function(){
		jQuery('#teampageADALeft').append(jQuery('#teampage-sidebar'));
		jQuery('#teampageADALeft').append(jQuery('#homeADALeftTop'));
		jQuery('#teampageADALeft').append(jQuery('#homeADALeftBottom'));
		jQuery('#progress-change-goal-link').hide();
	});	
	
	jQuery(".popup-youtube").magnificPopup({
            disableOn: 0,
            type: "iframe",
            mainClass: "mfp-fade",
            removalDelay: 160,
            preloader: false,
            fixedContentPos: false
     }); 
}


function customMenu() {
    var e = [{
        label: "Fundraising Tools",
        sid: "0",
        viewName: "fundraising",
        subViewName: "tools"
    }];
    for (var t = 0; t < e.length; t++) {
        createCustomView(e[t])
    }
}
function createCustomView(e) {
    YAHOO.Convio.PC2.Views.load[e.viewName] = function(t) {
        var n = YAHOO.Convio.PC2.Views.current;
        YAHOO.util.Dom.addClass(YAHOO.Convio.PC2.Views.current + "-content", "hidden-form");
        YAHOO.util.Dom.addClass(YAHOO.Convio.PC2.Views.current + "-sidebar", "hidden-form");
        YAHOO.util.Dom.addClass("dashboard-content", "hidden-form");
        YAHOO.util.Dom.addClass("dashboard-sidebar", "hidden-form");
        YAHOO.util.Dom.removeClass(e.viewName + "-content", "hidden-form");
        YAHOO.util.Dom.removeClass(e.viewName + "-" + t + "-content", "hidden-form");
        if (t == e.subViewName) {
            var r = YAHOO.util.Dom.get(e.viewName + "-content");
            if (r.childNodes.length < 3) {
                if (parent.document.getElementById("s51-" + e.viewName + "-" + e.subViewName)) {
                    r.innerHTML = parent.document.getElementById("s51-" + e.viewName + "-" + e.subViewName).innerHTML
                } else {
                    Y.use("io", function(t) {
                        function s(e, t, n) {
                            var i = document.body.appendChild(document.createElement("div"));
                            i.style.display = "none";
                            i.innerHTML = t.responseText.replace(/<base href="http:\/\/main\.diabetes\.org\/site\/" \/>/, "");
                            r.innerHTML = document.getElementById("FrNews_ArticlePage").innerHTML;
                            i.parentNode.removeChild(i)
                        }
                        t.io.header("X-Requested-With");
                        var n = YAHOO.util.Cookie.get("JServSessionIdr004");
                        var i = "../site/AjaxProxy?auth=" + YAHOO.Convio.PC2.Config.getAuth() + "&cnv_url=http%3A%2F%2Fmain.diabetes.org%2Fsite%2FTR%3Fpgwrap%3Dn%26type%3Dfr_informational%26pg%3Dinformational%26fr_id%3D" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId() + "%26sid%3D" + e.sid + "%26JServSessionIdr004%3D" + n;
                        var o = t.io(i, {
                            on: {
                                complete: s
                            }
                        })
                    })
                }
            }
        }
    };
    Y.use("node", function(t) {
        t.one("#content").append('<div id="' + e.viewName + '-content" class="hidden-form">' + '<h1 id="' + e.viewName + '_view_header">' + e.label + "</h1>" + '<div id="' + e.viewName + '-list-container" class="ux-block2">' + "</div>" + "</div>");
        t.one("#sidebar").append('<div id="' + e.viewName + '-sidebar" class="hidden-form"></div>');		
    })
}

//Get Internet Explorer Version 7 - 11
function getInternetExplorerVersion() {
        var rv = -1; // Return value assumes failure.
        var isIE11 = !!navigator.userAgent.match(/Trident.*rv[ :]*11\./);
        if (navigator.appName == 'Microsoft Internet Explorer') {
            var ua = navigator.userAgent;
            var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
            var re2 = new RegExp("MSIE ([10]{1,}[\.10]{0,})");
            if (re.exec(ua) != null) {
                rv = parseFloat(RegExp.$1);
            } else if (re2.exec(ua) != null) {
                rv = parseFloat(RegExp.$1);
            }
        }
        if (isIE11) {
            rv = 11;
        }
        return rv;
}
