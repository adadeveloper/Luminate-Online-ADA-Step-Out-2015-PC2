var testdbg;
var isTeamGift;
var isAddAnother;
var contactId;
var myContactsMap;
var PersonalGoalEdit;
var deleteGiftId;
var deleteTeamGiftId;
var acknowledgeContactId;

//fix IE8 dumbness
if(typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, ''); 
  }
}

var updatePageStatus = function(status) { };

var GetOrganizationMessageCallback = {
    success: function(o) {
        var response = YAHOO.lang.JSON.parse(o.responseText).getOrganizationMessageResponse;
        var textElm = YAHOO.util.Dom.get("organization_message");
        if(YAHOO.lang.isString(response.message)) {
            textElm.innerHTML = response.message;
            YAHOO.util.Dom.removeClass("bd-org-html", "hidden-form");
        }
        YAHOO.log("getOrganizationMessage success", "info", "dashboard.js");
    },
    failure: function(o) {
        YAHOO.log(o.responseText, "error", "dashboard.js");
    },
    scope: YAHOO.Convio.PC2.Component.Teamraiser
};

function logFailure(o) {
    YAHOO.log(o.responseText, "error", "dashboard.js");
};

function show_pc2_element(objId) {
    YAHOO.util.Dom.removeClass(objId, "hidden-form");
}

function hide_pc2_element(objId) {
    YAHOO.util.Dom.addClass(objId, "hidden-form");
}

var ConfigAndRegReady = function() {
    var config = YAHOO.Convio.PC2.Data.TeamraiserConfig;
    var reg = YAHOO.Convio.PC2.Data.Registration;
    if(config.personalGoalAllowed == "true") {
        YAHOO.util.Dom.removeClass("progress-change-goal-link", "hidden-form");
    }
    if(config.eventManageUrl != null && typeof config.eventManageUrl==='string') {
        var manageEventLink = YAHOO.util.Dom.get("msg_cat_nav_manage_event_link");
        manageEventLink.href = config.eventManageUrl;
        YAHOO.util.Dom.removeClass("subnav_manage_event","hidden-form");
    }
    if(config.companyManageUrl != null && typeof config.companyManageUrl==='string') {
        var manageEventLink = YAHOO.util.Dom.get("msg_cat_nav_manage_company_link");
        manageEventLink.href = config.companyManageUrl;
        YAHOO.util.Dom.removeClass("subnav_manage_company","hidden-form");
    }
    if(config.personalPageSecondPhoto == "true") {
        YAHOO.util.Dom.removeClass("photo2","hidden-form");
    }

    var url = config.personalDonationsDownloadUrl;
    var teamDonationsDl = YAHOO.util.Dom.get("msg_cat_report_personal_donations_download");
    teamDonationsDl.href = url;

    if(reg.tentingAllowed == "true") {
        YAHOO.util.Dom.removeClass("subnav_edit_tenting","hidden-form");
    }
    if(config.ociEnabled == "true" && YAHOO.lang.isString(config.ociBaseUrl)) {
        YAHOO.util.Dom.removeClass("subnav_oci_link","hidden-form");
        YAHOO.util.Event.addListener("msg_cat_nav_oci_link", "click", function() {
                var baseUrl = config.ociBaseUrl;
                if(baseUrl.indexOf("?") > -1) {
                    baseUrl += "&";
                } else {
                    baseUrl += "?";
                }
                baseUrl += "fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();
                baseUrl += "&auth=" + YAHOO.Convio.PC2.Config.getAuth();
                
                window.open(baseUrl);
        });
    }
    if(config.personalSurveyEditAllowed == "true") {
        YAHOO.util.Dom.removeClass("subnav_edit_survey","hidden-form");
    }
    if(config.acceptingDonations == "true" &&
            config.personalOfflineGiftsAllowed == "true") {
        show_pc2_element("add-gift-link");
        show_pc2_element("add-quick-gift-block");
    }

    // can this user access the "View Team Roster" link?
    if(YAHOO.Convio.PC2.Component.Teamraiser.isCanViewTeamRoster()) 
    {
        YAHOO.util.Dom.removeClass("subnav_team_view_link", "hidden-form");
    }

    // can this user access the "Email Team" link? 
    if(YAHOO.Convio.PC2.Component.Teamraiser.isOnATeam()) 
    {
    	 // define sub_nav click handlers
        Y.use("pc2-contacts-functions", function(Y) {
        	var emailTeamClick = function() {
                YAHOO.Convio.PC2.Views.contactIds = "teammates";
                YAHOO.Convio.PC2.Views.groupIds = [];
                YAHOO.Convio.PC2.Utils.loadView("email","compose");
                return false;
            }

        	YAHOO.util.Event.addListener("msg_cat_nav_email_team", "click", emailTeamClick);
        	YAHOO.util.Dom.removeClass("subnav_team_email_link", "hidden-form");
        });
    }

    YAHOO.Convio.PC2.Teamraiser.getEventDataParameter(participantCanSelfManageEDPCallback, "F2F_PC2_PARTICIPANT_CAN_SELF_MANAGE_TEAM", 'boolean');
};

var PersonalGoalEdit;

var addLogger = function() {
    if(YAHOO.Convio.PC2.Config.isLoggingEnabled()) {
        var myLogReader = new YAHOO.widget.LogReader("yui-logging");
    }
};

var doValidation = function() {

};

var showGoalEdit = function() {
    PersonalGoalEdit.show();
};

var localeSelectorChange = function() {
	var newLocale = YAHOO.Convio.PC2.Config.setLocale(this.options[this.selectedIndex].value);
	YAHOO.log("Switching locale to: " + newLocale, "info", "dashboard.js");
	YAHOO.Convio.PC2.Config.setLocaleChanged(true);
	window.location.reload();
};

var sendMessageTo = function(contactId) {
    //alert('FIX ME! - sendMessageTo(' + contactId + ')');
    YAHOO.Convio.PC2.Views.contactIds = contactId;
    YAHOO.Convio.PC2.Utils.loadView("email","compose");
    //window.location = "compose.html?contact_ids=" + contactId;
};

var getCircledNum = function(n) {
  if( n > 0 && n <= 10 )
    return '&#' + (10101 + n);
  else
    return n;
}

function loadComposeViewWithTemplate(template) {
  YAHOO.Convio.PC2.Views.emailTemplateTypeDefault = template;
  YAHOO.Convio.PC2.Utils.loadView("email","compose");
  setTimeout(function() {
    var indexToActivate = typeof YAHOO.Convio.PC2.Views.emailTemplateTypeDefault==='number'?YAHOO.Convio.PC2.Views.emailTemplateTypeDefault:3;
    if( !jQuery(jQuery('#email-template-container h3')[indexToActivate]).is(':visible') )
      indexToActivate = 3;
    jQuery('#email-template-container').accordion('activate',indexToActivate);
    jQuery('#email-template-container').accordion('resize');
  }, 500);
}
var EMAIL_TEMPLATE_TYPE_COMPOSE = 3;    //OTHER
var EMAIL_TEMPLATE_TYPE_OTHER = 3;      //OTHER
var EMAIL_TEMPLATE_TYPE_REMINDER = 3;   //OTHER
var EMAIL_TEMPLATE_TYPE_THANKS = 0;     //THANKS

var addSuggestion = function( suggestion, n ) {
  var statusIcon = getCircledNum(n+1);
  var whatNextCompletionClass = 'what-next-uncompleted';
  var clickHandler = '';
  var whatNextType = '';

  var CHECKMARK = '&#10004';

  if( suggestion.completed==='true' ) {
    statusIcon = CHECKMARK;
    whatNextCompletionClass = 'what-next-completed';
  }

  if(suggestion.type === "GOAL") {
    clickHandler = 'showGoalEdit()';
    whatNextType = jQuery('#msg_cat_what_next_set_goal_header').html();
  } else if(suggestion.type === "PERSONAL_PAGE") {
    clickHandler = 'YAHOO.Convio.PC2.Utils.loadView("personalpage","compose")';
    whatNextType = jQuery('#msg_cat_what_next_setup_your_personal_page_header').html();
  } else if(suggestion.type === "CONTACTS") {
    clickHandler = 'YAHOO.Convio.PC2.Utils.loadView("email","contacts")';
    whatNextType = jQuery('#msg_cat_what_next_add_contacts_header').html();
  } else if(suggestion.type === "COMPOSE") {
    clickHandler = 'loadComposeViewWithTemplate(EMAIL_TEMPLATE_TYPE_COMPOSE)';
    whatNextType = jQuery('#msg_cat_what_next_send_email_header').html();
  } else if(suggestion.type === "COMPOSE_OTHER") {
    clickHandler = 'loadComposeViewWithTemplate(EMAIL_TEMPLATE_TYPE_OTHER)';
    whatNextType = jQuery('#msg_cat_what_next_reach_out_header').html();
  } else if(suggestion.type === "COMPOSE_REMINDER") {
    clickHandler = 'loadComposeViewWithTemplate(EMAIL_TEMPLATE_TYPE_REMINDER)';
    whatNextType = jQuery('#msg_cat_what_next_followup_header').html();
  } else if(suggestion.type === "COMPOSE_THANKS") {
    clickHandler = 'loadComposeViewWithTemplate(EMAIL_TEMPLATE_TYPE_THANKS)';
    whatNextType = jQuery('#msg_cat_what_next_send_thanks_header').html();
  } else if(suggestion.type === "NONE") {
    clickHandler = '';
    whatNextType = '';
  }

  var str = "<div class='what-next-answer-item "+whatNextCompletionClass+"' onclick='"+clickHandler+"'>";
  str +=      "<div class='what-next-icon'>"+statusIcon+"</div>";
  str +=      "<div class='what-next-message-container'>";
  str +=         "<div class='what-next-type'>"+whatNextType+"</div>";
  str +=         "<div class='what-next-message'>"+suggestion.message+"</div>";
  str +=      "</div>";
  str +=    "</div>";
  jQuery('#what-next-answer').append(str);
}

var loadSuggestion = function() {
    var loadSuggestionCallback = {
        success: function(o) {
            var suggestions = YAHOO.lang.JSON.parse(o.responseText).getTeamraiserSuggestionResponse.allSuggestions.suggestion;
            if( !suggestions || suggestions.length==0 )
              return;

            jQuery('#what-next-answer').empty();
            var nextSuggestionSelected = false;
            for( var i=0; i<suggestions.length; i++ ) {
              addSuggestion(suggestions[i],i);
            }
            if( jQuery('#what-next-answer .what-next-uncompleted').length>0 ) {
              jQuery('#what-next-answer .what-next-uncompleted')[0].id = 'what-next-selected-item';
            }
            jQuery('#bd-what-next').show();

            YAHOO.Convio.PC2.Utils.publisher.fire("pc2:suggestionLoaded", suggestions);
        },
        failure: function(o) {
            YAHOO.log("Error calling getTeamraiserSuggestion: " + o.responseText, "error", "dashboard.js");
        },
        scope: this
    }
    YAHOO.Convio.PC2.Teamraiser.getTeamraiserSuggestion(loadSuggestionCallback);
};

var loadRecentActivity = function() {
    YAHOO.namespace("Convio.PC2.Component.RecentActivity");

    YAHOO.Convio.PC2.Component.RecentActivity.formatType = function(elCell, oRecord, oColumn, sData) {
        elCell.innerHTML = sData;
        
        var styleName = 'recent-activity-unknown';
        if(sData == 'DONATION') {
            elCell.innerHTML = document.getElementById('msg_cat_activity_type_donation').innerHTML;
        } else if(sData == 'MESSAGE') {
            elCell.innerHTML = document.getElementById('msg_cat_activity_type_message').innerHTML;
        } else if(sData == 'RECRUIT') {
            elCell.innerHTML = document.getElementById('msg_cat_activity_type_recruit').innerHTML;
        }
    };

    YAHOO.Convio.PC2.Component.RecentActivity.formatFollowup = function(elCell, oRecord, oColumn, sData) {
        var cellText = sData;
        if(YAHOO.lang.isString(sData)) {
            var beginIndex = sData.indexOf("void(0);");
            if(beginIndex >= 0) {
                cellText = sData.substring(0, beginIndex);
                cellText += "sendMessageTo(" + oRecord.getData().contactId + ");";
                cellText += sData.substring(beginIndex+8, sData.length);
            }
        } else {
            cellText = "";
        }
        elCell.innerHTML = cellText;
    };

    YAHOO.Convio.PC2.Component.RecentActivity.columnDefs = [
        {key: "date", label:"Date", className: "recent-activity-date"},
        {key:"type", label:"Activity", formatter: YAHOO.Convio.PC2.Component.RecentActivity.formatType},
        {key:"activity", label:"Description", className: "recent-activity-detail"},
        {key:"followup", label:"Additional Info", className: "recent-activity-followup", formatter: YAHOO.Convio.PC2.Component.RecentActivity.formatFollowup}
    ];
    YAHOO.Convio.PC2.Component.RecentActivity.DataSource = new YAHOO.util.XHRDataSource(YAHOO.Convio.PC2.Config.Teamraiser.getUrl()); 

    YAHOO.Convio.PC2.Component.RecentActivity.DataSource.responseType = YAHOO.util.DataSource.TYPE_JSON;
    YAHOO.Convio.PC2.Component.RecentActivity.DataSource.connXhrMode = "queueRequests";
    YAHOO.Convio.PC2.Component.RecentActivity.DataSource.connMethodPost = true;
    YAHOO.Convio.PC2.Component.RecentActivity.DataSource.responseSchema = {
        resultsList: "getRecentActivityResponse.activityRecord",
        fields: ["type","activity","followup","date","contactId"]
    };

    try {
        YAHOO.Convio.PC2.Component.RecentActivity.DataTable = new YAHOO.widget.DataTable(
            'bd-recent-activity-detail',
            YAHOO.Convio.PC2.Component.RecentActivity.columnDefs,
            YAHOO.Convio.PC2.Component.RecentActivity.DataSource, {
                    initialRequest: YAHOO.Convio.PC2.Teamraiser.getRecentActivityParams(), 
                    selectionMode:"none"
            }
        );
    } catch(e) {
        YAHOO.log(e, 'error', 'dashboard.js');
    }
};

function clickAddlGiftOptions(e) {
    // stop the default event from the link
    YAHOO.util.Event.stopEvent(e);
    if(YAHOO.Convio.PC2.Views.current_subview == "team") {
        YAHOO.Convio.PC2.Utils.loadView("gift", "team");
    } else {
        YAHOO.Convio.PC2.Utils.loadView("gift", "add");
    }
};

var UpdateLastPC2LoginCallback = {
	success: function(o) {
		// do nothing
	},
	failure: function(o) {
		YAHOO.log(o.responseText, 'error', 'dashboard.js');
	},
	scope: YAHOO.Convio.PC2.Teamraiser
};

var updateLastPC2Login = function() {
	var registration = {
			updateLastPC2Login: 'true'
    };
	YAHOO.Convio.PC2.Teamraiser.updateRegistration(UpdateLastPC2LoginCallback, registration);
};

var UpdateGiftNotificationCallback = {
    success: function(o) {
        if(YAHOO.util.Dom.hasClass('msg_cat_gift_notification_on_label', 'hidden-form')) {
            YAHOO.util.Dom.addClass('msg_cat_gift_notification_off_label', 'hidden-form');
            YAHOO.util.Dom.removeClass('msg_cat_gift_notification_on_label', 'hidden-form');
            
            YAHOO.util.Dom.removeClass('msg_cat_gift_notification_off_button_label', 'hidden-form');
            YAHOO.util.Dom.addClass('msg_cat_gift_notification_on_button_label', 'hidden-form');
        } else {
            YAHOO.util.Dom.removeClass('msg_cat_gift_notification_off_label', 'hidden-form');
            YAHOO.util.Dom.addClass('msg_cat_gift_notification_on_label', 'hidden-form');
            
            YAHOO.util.Dom.addClass('msg_cat_gift_notification_off_button_label', 'hidden-form');
            YAHOO.util.Dom.removeClass('msg_cat_gift_notification_on_button_label', 'hidden-form');
        }
    },
    failure: function(o) {
        YAHOO.log(o.responseText, 'error', 'dashboard.js');
    },
    scope: YAHOO.Convio.PC2.Teamraiser
};

var giftNotificationOff = function() {
    var registration = {
            receiveGiftNotification: 'false'
    };
    YAHOO.Convio.PC2.Teamraiser.updateRegistration(UpdateGiftNotificationCallback, registration);
};

var giftNotificationOn = function() {
    var registration = {
            receiveGiftNotification: 'true'
    };
    YAHOO.Convio.PC2.Teamraiser.updateRegistration(UpdateGiftNotificationCallback, registration);
};

var GetTopDonorsListCallback = {
    success: function(o) {
        var divString = "";
        var response = YAHOO.lang.JSON.parse(o.responseText).getTopDonorsResponse;
        var myTeamraiserData = response.teamraiserData;
        if(YAHOO.lang.isUndefined(response.teamraiserData) == false) {
            if(YAHOO.lang.isArray(response.teamraiserData)) {
                for(var i=0; i<response.teamraiserData.length; i++) {
                    var data = response.teamraiserData[i];
                    var row = "<li>" + data.name + " - " + data.total + "</li>";
                    divString = divString + row;
                }
            } else {
                var data = response.teamraiserData;
                var row = "<li>" + data.name + " - " + data.total + "</li>";
                divString = divString + row;
            }
        } else {
            return;
        }
        var topDonorsBody = YAHOO.util.Dom.get('top-donors-body');
        topDonorsBody.innerHTML = divString;
        YAHOO.util.Dom.removeClass('top-donors', 'hidden-form');
    },
    failure: function(o) {
        YAHOO.log(o.responseText, 'error', 'report.js');
    },

    scope: YAHOO.Convio.PC2.Teamraiser
};

var GetPersonalDonationByDayCallback = {
    success: function(o) {
	    // Must have Flash 9.0.45 available in order to use YUI Charts:
	    if(YAHOO.util.SWFDetect.isFlashVersionAtLeast(9.045)){
		    // remove error message and show the chart
		    YAHOO.util.Dom.addClass('report-chart-no-flash', 'hidden-form');
		    YAHOO.util.Dom.removeClass('bd-chart', 'hidden-form');
		    
		    YAHOO.widget.Chart.SWFURL = "../yui/charts/assets/charts.swf";
		    var response = YAHOO.lang.JSON.parse(o.responseText).getPersonalDonationByDayResponse;
		    var chartDataSource = new YAHOO.util.DataSource(response.donationDataByDay);
		    chartDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY; 
		    chartDataSource.responseSchema = {
			fields:[
				{key:"date", parser:YAHOO.Convio.PC2.Chart.formatDate},
				"amount"
			       ]
		    }
		    var minY = 0;
		    if(YAHOO.lang.isArray(response.donationDataByDay) ) {
		    	for(var i=0; i<response.donationDataByDay.length; i++) {
		    		var item = response.donationDataByDay[i];
		    		var tempAmount = parseFloat(item.amount);
		    		if(tempAmount > minY) {
		    			minY = tempAmount;
		    		}
		    	}
		    }
		    var addVal = 1;
		    if(minY > 10) {
		    	addVal = minY/20;
		    }
		    minY = minY + addVal;

		    var seriesDef = 
			[
			{displayName: "Donated Amount", yField: "amount",
			    style:
				{ 
				    lineColor:0x008B00, 
				    lineAlpha:.5, 
				    borderColor:0x008B00, 
				    fillColor:0xffffff 
				}
			}
			];

		    formatDataTipText = function(item, index, series)
            {
                var str = YAHOO.Convio.PC2.Utils.formatCurrency(item.amount*100) + " " + YAHOO.Convio.PC2.Component.Content.getMsgCatValue("report_donated_on") + "\n" + item.date;
                return str;
            }

		    var myChart = new YAHOO.widget.LineChart(
		    	"report-chart",
		    	chartDataSource,
			    {
		    		xField:'date',
		    		series:seriesDef,
		    		wmode: 'transparent',
		    		dataTipFunction:formatDataTipText
			    });

		    var axisWithMinimum = new YAHOO.widget.NumericAxis();
		    axisWithMinimum.minimum = minY;
		    axisWithMinimum.labelFunction = "YAHOO.Convio.PC2.Chart.formatCurrency";

		    myChart.set( "yAxis", axisWithMinimum );
	    } else {
		// display error message and hide chart
		YAHOO.util.Dom.removeClass('report-chart-no-flash', 'hidden-form');
		YAHOO.util.Dom.addClass('bd-chart', 'hidden-form');
	    }
    },
    failure: function(o) {
        YAHOO.log(o.responseText, 'error', 'report.js');
    },

    scope: YAHOO.Convio.PC2.Teamraiser
};

YAHOO.Convio.PC2.Chart = {
    formatDate: function(date) {
        var dateItems = date.split('-');
        if (YAHOO.Convio.PC2.Config.isUSLocale())
        	return dateItems[1]+'-'+dateItems[2]+'-'+dateItems[0];
        else
        	return dateItems[2]+'-'+dateItems[1]+'-'+dateItems[0];
    },
    formatCurrency: function(currency) {
        return  YAHOO.Convio.PC2.Utils.formatCurrency(currency * 100);
    }
};

function deleteGift(giftId) {
    deleteGiftId = giftId;
    YAHOO.Convio.PC2.Component.GiftHistory.DeleteConfirmDialog.show();
};

var deleteGiftCallback = {
    success: function(o) {
        var response = YAHOO.lang.JSON.parse(o.responseText).deleteGiftResponse;
        var records = YAHOO.Convio.PC2.Component.GiftHistory.myDataTable.getRecordSet().getRecords();
        var giftId = response.giftId;
        for(var i=YAHOO.Convio.PC2.Component.GiftHistory.Paginator.getStartIndex(); i<records.length; i++) {
            var record = records[i];
            if(YAHOO.lang.isUndefined(record) == false && 
                    record.getData().id == giftId) {
                YAHOO.Convio.PC2.Component.GiftHistory.myDataTable.deleteRow(i);
                YAHOO.Convio.PC2.Teamraiser.getParticipantProgress(YAHOO.Convio.PC2.Component.Teamraiser.loadParticipantProgressCallback);
                break;
            }
        }
        YAHOO.Convio.PC2.Teamraiser.getPersonalDonationByDay(GetPersonalDonationByDayCallback);
        YAHOO.Convio.PC2.Teamraiser.getParticipantTopDonorsList(GetTopDonorsListCallback);
    },
    failure: function(o) {
    },
    scope: YAHOO.Convio.PC2.Teamraiser
};

var GetCompanyTeamsCallback = {
    success: function(o) {
        var response = YAHOO.lang.JSON.parse(o.responseText).getCompanyTeamsResponse;
        var companyTeamsBlock = YAHOO.util.Dom.get('company-teams');
        var companyTeam = response.companyTeam;
        var teamColumn1 = "<table class='col-1'>";
        var teamColumn2 = "<table class='col-2'>";
        if(YAHOO.lang.isArray(companyTeam)) {
            var length = companyTeam.length;
            for(var i=0; i<length; i++) {
                if(i- ((length-1)/2) > 0){
                    teamColumn2 += getTeamDiv(companyTeam[i]);
                } else {
                    teamColumn1 += getTeamDiv(companyTeam[i]);
                }
            }
        } else {
            if(YAHOO.lang.isUndefined(companyTeam) == false) {
                teamColumn1 += getTeamDiv(companyTeam);
            }
        }
        teamColumn1 += "</table>";
        teamColumn2 += "</table>";
        companyTeamsBlock.innerHTML = teamColumn1 + teamColumn2;
        
        var url = response.companyTeamsDownloadUrl;
        if(YAHOO.lang.isString(url)) {
            var companyTeamsDl = YAHOO.util.Dom.get("msg_cat_company_report_teams_download");
            companyTeamsDl.href = url;
        }
    },
    failure: function(o) {
        logFailure(o);
    },
    scope: YAHOO.Convio.PC2.Teamraiser
};

function getTeamDiv(record) {
    var str = "<tr>";
    str += "<td>" + record.teamName + "</td>";
    str += "<td class='amount'>" + YAHOO.Convio.PC2.Utils.formatCurrency(record.amount) + "</td>";
    str += "</tr>";
    return str;
};

var GetCompanyDonationByDayCallback = {
    success: function(o) {
	// Must have Flash 9.0.45 available in order to use YUI Charts:
	if(YAHOO.util.SWFDetect.isFlashVersionAtLeast(9.045)){
    	    // remove error message and show the chart
	    YAHOO.util.Dom.addClass('company-report-chart-no-flash', 'hidden-form');
	    YAHOO.util.Dom.removeClass('bd-company-chart', 'hidden-form');

	    YAHOO.widget.Chart.SWFURL = "../yui/charts/assets/charts.swf";
	    var response = YAHOO.lang.JSON.parse(o.responseText).getCompanyDonationByDayResponse;
	    var chartDataSource = new YAHOO.util.DataSource(response.donationDataByDay);
	    chartDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY; 
	    chartDataSource.responseSchema = {
		fields:[
			{key:"date", parser:YAHOO.Convio.PC2.Chart.formatDate},
			"amount"
		       ]
	    }
	    var minY = 0;
	    if(YAHOO.lang.isArray(response.donationDataByDay) ) {
	    	for(var i=0; i<response.donationDataByDay.length; i++) {
	    		var item = response.donationDataByDay[i];
	    		var tempAmount = parseInt(item.amount);
	    		if(tempAmount > minY) {
	    			minY = tempAmount;
	    		}
	    	}
	    }
	    var addVal = 1;
	    if(minY > 10) {
	    	addVal = minY/20;
	    }
	    minY = minY + addVal;

	    var seriesDef = 
		[
		{displayName: "Donated Amount", yField: "amount",
		    style: 
			{ 
			    lineColor:0x008B00, 
			    lineAlpha:.5, 
			    borderColor:0x008B00, 
			    fillColor:0xffffff 
			}
		}
		];

	    formatDateAxisLabel = function(value) {
			return YAHOO.Convio.PC2.Chart.formatDate(value);
	    }

	    formatDataTipText = function(item, index, series) { 
			var    str = "$" + item.amount + " donated on\n" + item.date;
			return str; 
	    } 

	    var myChart = new YAHOO.widget.LineChart(
		    "company-report-chart", 
		    chartDataSource,
		    {
		    	xField:'date',
		    	series:seriesDef,
		    	wmode: 'transparent',
		    	dataTipFunction:formatDataTipText
		    });

	    var axisWithMinimum = new YAHOO.widget.NumericAxis();
	    axisWithMinimum.minimum = minY;
	    axisWithMinimum.labelFunction = "YAHOO.Convio.PC2.Chart.formatCurrency";

	    myChart.set( "yAxis", axisWithMinimum );
	} else {
        // display error message and hide chart
	    YAHOO.util.Dom.removeClass('company-report-chart-no-flash', 'hidden-form');
	    YAHOO.util.Dom.addClass('bd-company-chart', 'hidden-form');
	}
    },
    failure: function(o) {
        YAHOO.log(o.responseText, 'error', 'report.js');
    },

    scope: YAHOO.Convio.PC2.Teamraiser
};

function WrapperCallback(o) {
    var wrapper = YAHOO.lang.JSON.parse(o.responseText).getParticipantCenterWrapperResponse.wrapper;
    if(wrapper.teamName) {
        origTeamName = wrapper.teamName;
        var teamNameElm = YAHOO.util.Dom.get("team-name-field");
        teamNameElm.innerHTML = origTeamName;
        var teamNameField = YAHOO.util.Dom.get("new-team-name");
        teamNameField.value = origTeamName;
    }
    if(wrapper.companyName) {
        origCompanyName = wrapper.companyName;
        var companyNameElm = YAHOO.util.Dom.get("company-name-field");
        companyNameElm.innerHTML = origCompanyName;
    }
    if(wrapper.participantCompanyName) {
    	origCompanyName = wrapper.participantCompanyName;
    	var companyNameElm = YAHOO.util.Dom.get("participant-company-name-field");
        companyNameElm.innerHTML = origCompanyName;
    } else {
    	// set to msg cat value for no company selection per UX suggestion
    	var companyNameElm = YAHOO.util.Dom.get("participant-company-name-field");
    	companyNameElm.innerHTML = YAHOO.Convio.PC2.Component.Content.getMsgCatValue("dashboard_company_null_label");
    }
};

var getGiftAidEnabledEDPCallback = {
	success: function(o) {
		var response = YAHOO.lang.JSON.parse(o.responseText).getEventDataParameterResponse;
	    if (response.booleanValue == "true") {
	    	YAHOO.Convio.PC2.Teamraiser.getEventDataParameter(getGiftAidInformationEDPCallback, "F2F_OFFLINE_GIFT_GIFT_AID_DESC", 'string');
	    }
	},
	failure: function(o) {
		logFailure(o);
	},
	scope: YAHOO.Convio.PC2.Teamraiser
};

var getGiftAidInformationEDPCallback = {
	success: function(o) {
		var response = YAHOO.lang.JSON.parse(o.responseText).getEventDataParameterResponse;

		// Set Gift Aid information text and display section
		document.getElementById("gift_aid_information").innerHTML = response.stringValue;
		show_pc2_element("uk_gift_aid_section");
	},
	failure: function(o) {
		logFailure(o);
	},

	scope: YAHOO.Convio.PC2.Teamraiser
};

function updateWizardProgress() {
  var CIRCLED_ONE = '&#9312';
  var CIRCLED_TWO = '&#9313';
  var CIRCLED_THREE = '&#9314';
  var CIRCLED_FOUR = '&#9315';
  var CHECKMARK = '&#10004';

  //update completion indicators
  /*
    Configure: Template selected OR any content exists OR subject exists
    Compose: Any content exists AND subject exists
    Set Recipients: Any recipient selected
    Preview & Send: Message has been sent
  */
  var templateSelected = jQuery('input[name=email-wizard-template-radio]:checked').length>0;
  var subjectExists = jQuery('#email-subject').val().trim() !== '';
  var contentExists = getComposeEditorContent() !== '';
  var recipientsExist = jQuery('#email-addresses').val().trim() !== '';

  //configure tab
  if( templateSelected || subjectExists || contentExists )
    jQuery('#email-wizard-nav-configure .email-wizard-status-indicator').html(CHECKMARK);
  else
    jQuery('#email-wizard-nav-configure .email-wizard-status-indicator').html(CIRCLED_ONE);

  //compose tab
  if( subjectExists && contentExists && YAHOO.Convio.PC2.Views.contentHasBeenViewed )
    jQuery('#email-wizard-nav-compose .email-wizard-status-indicator').html(CHECKMARK);
  else
    jQuery('#email-wizard-nav-compose .email-wizard-status-indicator').html(CIRCLED_TWO);

  //recipients tab
  if( recipientsExist )
    jQuery('#email-wizard-nav-contacts .email-wizard-status-indicator').html(CHECKMARK);
  else
    jQuery('#email-wizard-nav-contacts .email-wizard-status-indicator').html(CIRCLED_THREE);

  //preview tab
  //TODO: figure out how to know if this message has been sent (only applies to viewing Sent messages)
  if( false )
    jQuery('#email-wizard-nav-preview .email-wizard-status-indicator').html(CHECKMARK);
  else
    jQuery('#email-wizard-nav-preview .email-wizard-status-indicator').html(CIRCLED_FOUR);
}

function showWizardTab(tab) {
  updateWizardProgress();

  jQuery('.email-wizard-tab-specific').addClass('hidden-form');
  jQuery('.email-wizard-'+tab).removeClass('hidden-form');
  jQuery('.email-wizard-nav-selected').removeClass('email-wizard-nav-selected').addClass('email-wizard-nav-unselected');
  jQuery('#email-wizard-nav-'+tab).removeClass('email-wizard-nav-unselected').addClass('email-wizard-nav-selected');
}

function showWizardConfigure() {
  showWizardTab('configure');
  jQuery('#email-template-container').accordion('resize');
}
function showWizardCompose() {
  showWizardTab('compose');
  YAHOO.Convio.PC2.Views.contentHasBeenViewed = true;
}
function showWizardRecipients() {
  showWizardTab('contacts');
}
function showWizardPreviewAndSend() {
  showWizardTab('preview');
  previewMessage();
}

function loadComponents() {
	// init WYSIWYG editors
	YAHOO.Convio.PC2.TinyMCE.initWysiwygComponents("compose-rich-text,personal_page_rich_text,team_page_rich_text,company_page_rich_text");
	
	// reveal header content?
	if (!YAHOO.Convio.PC2.Utils.isIFrameDetected()) {
		var smallHeaderElm = YAHOO.util.Dom.get('hd-small');
		if (smallHeaderElm) {
			YAHOO.log('Revealing the small header b/c iFrame was not detected.','info','dashboard.js');
			YAHOO.util.Dom.removeClass(smallHeaderElm, 'hidden-form');
		}
		
		var brandingElement = YAHOO.util.Dom.get('hd-branding');
		if (brandingElement) {
			YAHOO.log('Revealing the branding element b/c iFrame was not detected.','info','dashboard.js');
			YAHOO.util.Dom.removeClass(brandingElement, 'hidden-form');
		}
	}
	else {
		YAHOO.log('Will not reveal small header or branding element b/c iFrame was detected.','info','dashboard.js');
	}

	if (YAHOO.Convio.PC2.Config.isUKLocale())
		setUKAddressLookupContent();

    // General TR init
    var trConfig = {
        initDone: function() {
            if(YAHOO.Convio.PC2.Component.Teamraiser.Registration.teamId > 0) {
                YAHOO.util.Dom.removeClass("team_report_link", "hidden-form")
            }

            if(YAHOO.Convio.PC2.Component.Teamraiser.Registration.aTeamCaptain == 'true') {
                YAHOO.util.Dom.removeClass("edit-team-goal-section", "hidden-form");
            }

            if(YAHOO.Convio.PC2.Component.Teamraiser.Registration.companyInformation &&
                    YAHOO.Convio.PC2.Component.Teamraiser.Registration.companyInformation.isCompanyCoordinator == "true" &&
                    YAHOO.Convio.PC2.Component.Teamraiser.Registration.companyInformation.companyType == "LOCAL") {
                YAHOO.util.Dom.removeClass("company_report_link", "hidden-form")
            }

            if(YAHOO.Convio.PC2.Component.Teamraiser.Registration.receiveGiftNotification == 'true') {
                YAHOO.util.Dom.removeClass('msg_cat_gift_notification_on_label', 'hidden-form');
                YAHOO.util.Dom.removeClass('msg_cat_gift_notification_off_button_label', 'hidden-form');
            } else {
                YAHOO.util.Dom.removeClass('msg_cat_gift_notification_on_button_label', 'hidden-form');
                YAHOO.util.Dom.removeClass('msg_cat_gift_notification_off_label', 'hidden-form');
            }

            // TODO add call here to populate & show the admin newsfeed area if it is
            // enabled in the config ?
            YAHOO.log('TR init finished','info','dashboard.html');
        },

        captainsMessage: { 
            container: 'captainsMessage',
            editContainer: 'captainsMessageEdit',
            editText: 'captainsMessageEditText',
            editLinkContainer: 'captainsMessageEditLink',
            emptyMessage: 'msg_cat_captains_message_empty',
            saveButton: 'msg_cat_captains_message_save_button',
            editLink: 'msg_cat_captains_message_edit_link',
            cancelLink: 'msg_cat_captains_message_cancel_link'
        },

        teamraiserConfig: {
            //callback: TeamraiserConfigCallback,
            personalPageConfig: 'personalpage-nav-link',
            personalPageConfig2: 'subnav_personal_page_link'
        },
        teamCaptains: 'teamCaptains',
        wrapper: 'hd-branding',
        teamPageLink: 'teampage-nav-link',
        companyPageLink: 'companypage-nav-link',
        teamPageUrl: 'hd-teampage-link',
        teamPageContainer: 'hd-teampage-container',
        personalPageUrl: 'hd-personalpage-link',
        consProfileUrl: 'hd-profile-link',
        helpLinkUrl: 'hd_nav_etc_help_link',
        logoutUrl: 'hd-logout-link',
        //siteName: 'bd-site-name',
        teamName: 'hd-team-name',
        shareContainer: 'sharing-sidebar',
        progress: {
            image: 'fundraising-progress-image',
            personalAmountValue: 'progress-amt-raised-value',
            personalPercentValue: 'progress-percent-value',
            personalGoalValue: 'progress-goal-value',
            personalGoalLink: 'progress-change-goal-link',
            daysLeft: 'progress-days-left-value',
            giftAidMatchDiv: 'progress-gift-aid-match',
            giftAidMatchValue: 'progress-gift-aid-match-value',
            personalAmountDiv: 'progress-amt-raised'
        },
        teamProgress: {
            image: 'team-fundraising-progress-image',
            teamAmountValue: 'team-progress-amt-raised-value',
            teamGoalValue: 'team-progress-goal-value',
            teamPercentValue: 'team-progress-percent-value',
            daysLeft: 'team-progress-days-left-value'
        },
        companyProgress: {
            image: 'company-fundraising-progress-image',
            companyAmountValue: 'company-progress-amt-raised-value',
            companyGoalValue: 'company-progress-goal-value',
            companyPercentValue: 'company-progress-percent-value',
            daysLeft: 'company-progress-days-left-value'
        },
        privacySettings: {
        	header: 'privacy_settings_radio_label',
        	dialogLink: 'subnav_manage_privacy_settings',
        	standardOption: 'standardOption',
        	standardOptionLabel: 'standard_option_label',
        	standardOptionLabelText: 'privacy_settings_standard_option',
        	anonymousOption: 'anonymousOption',
        	anonymousOptionLabel: 'anonymous_option_label',
        	anonymousOptionLabelText: 'privacy_settings_anonymous_option',
        	screennameOption: 'screennameOption',
        	screennameOptionLabel: 'screenname_option_label',
        	screennameOptionLabelText: 'privacy_settings_screenname_option',
        	screennameField: 'screennameField'
        },
        wrapperCallback: WrapperCallback
    };
    YAHOO.Convio.PC2.Utils.require("pc2:registrationLoaded", "pc2:configurationLoaded", ConfigAndRegReady);
    YAHOO.Convio.PC2.Component.Teamraiser.initialize(trConfig);
    
    // load general content, which includes population of supported locales
    YAHOO.Convio.PC2.Utils.require("pc2:configurationLoaded", YAHOO.Convio.PC2.Component.Content.initialize);
    if (YAHOO.Convio.PC2.Config.isUKLocale())
    {
    	setUKAddressLookupContent();
    }

    // WYSIWYG content
    YAHOO.Convio.PC2.Teamraiser.getOrganizationMessage(GetOrganizationMessageCallback);

    // locale selector
    YAHOO.util.Event.addListener("hd-etc-locale-selector", "change", localeSelectorChange);

    // personal goal popup
    if (!PersonalGoalEdit) {
	    var labels = {
	        editGoal: document.getElementById("msg_cat_goal_edit_goal").innerHTML,
	        goal: document.getElementById("msg_cat_goal_goal").innerHTML
	    }
	    PersonalGoalEdit = new YAHOO.Convio.PC2.Component.Teamraiser.EditGoalDialog("progress-goal-value", null, labels);
    }

    // Constituent
    var consConfig = {
        name: 'hd-user-name'
    };

    YAHOO.Convio.PC2.Component.Constituent.initialize(consConfig);
    YAHOO.util.Event.addListener("msg_cat_change_goal_link", "click", showGoalEdit);

    YAHOO.Convio.PC2.Views.load["dashboard"] = function(subview) {
    	var current = YAHOO.Convio.PC2.Views.current;

        if(subview == "home") {
            	YAHOO.Convio.PC2.Utils.require("pc2:configurationLoaded", "pc2:registrationLoaded", function() {
            		Y.use("pc2-admin-newsfeed-functions", function(Y) {
	                    var config = YAHOO.Convio.PC2.Data.TeamraiserConfig;
	                    var reg = YAHOO.Convio.PC2.Component.Teamraiser.Registration;
	                    if(config.AdminNewsFeed.showAdminNewsFeed == "true" ||
	                    		config.AdminNewsFeed.showAdminNewsFeed == true) {
	                    	YAHOO.Convio.PC2.Teamraiser.AdminNewsfeed.contentCriteria.lastPC2Login = reg.lastPC2Login;
                			YAHOO.Convio.PC2.Teamraiser.AdminNewsfeed.loadAdminNewsfeedContent('newsfeed-container');
                			YAHOO.util.Event.addListener("msg_cat_admin_newsfeed_view_all", "click", function() {
                				YAHOO.Convio.PC2.Teamraiser.AdminNewsfeed.showAdminNewsfeedAllMessages();
                			});
                		}
                    });
            	});

                YAHOO.Convio.PC2.Component.Teamraiser.CaptainsMessage.load();

                YAHOO.Convio.PC2.Utils.require("pc2:configurationLoaded", "pc2:registrationLoaded", "pc2:constituentLoaded", function() {
            		var config = YAHOO.Convio.PC2.Data.TeamraiserConfig;
                    var reg = YAHOO.Convio.PC2.Component.Teamraiser.Registration;
                    var cons = YAHOO.Convio.PC2.Data.User;

                    // If at least 2 privacy options are available, or the participant is using a screenname
                    // we need to display the privacy options link
                    if ((config.standardRegistrationAllowed && config.anonymousRegistrationAllowed) ||
                    		(config.standardRegistrationAllowed && config.screennameRegistrationAllowed) ||
                    		(config.anonymousRegistrationAllowed && config.screennameRegistrationAllowed) ||
                    		(reg.screenname != '' &&
                                	!YAHOO.lang.isNull(reg.screenname) &&
                                	!YAHOO.lang.isUndefined(reg.screenname)))
                    {
                    	YAHOO.Convio.PC2.Component.Teamraiser.PrivacySettings.configure(config, reg, cons);
                    	YAHOO.util.Event.addListener("msg_cat_nav_manage_privacy_settings_link", "click", function() {
                    		YAHOO.Convio.PC2.Component.Teamraiser.PrivacySettings.show();
                    	}); 
                    } 
                });

                // Recent activity 
                loadRecentActivity();    
                // What next
                loadSuggestion();
                // Update last PC2 Login
                updateLastPC2Login();

                YAHOO.Convio.PC2.Utils.require("pc2:configurationLoaded", "pc2:registrationLoaded", function() {	
	            	Y.use("participant-company-functions", function(Y) {

			    	    var config = YAHOO.Convio.PC2.Data.TeamraiserConfig;
			    	    var registration = YAHOO.Convio.PC2.Component.Teamraiser.Registration;

			    	    if(config.participantCompanyAssociationAllowed == "true" &&
			    	    		registration.teamInformation == null) {
			    	    	YAHOO.util.Dom.removeClass("participant-info-block-container", "hidden-form");
			    	        YAHOO.util.Dom.removeClass("participant-company-info-block", "hidden-form");
			    	        YAHOO.util.Dom.removeClass("participant-company-assignment-section", "hidden-form");
			    	        YAHOO.Convio.PC2.Teamraiser.getCompanyList(GetParticipantCompanyListCallback);
			    	    }
			    	    if(config.participantCompanyNewEntryAllowed == "true" &&
			    	    		registration.teamInformation == null) {
			    	        YAHOO.util.Dom.removeClass("participant-company-entry-section", "hidden-form");
			    	    }

			    	    // Add company listeners
			    	    YAHOO.util.Event.addListener('msg_cat_dashboard_company_edit_label', 'click', registrationEditClick);
			    	    YAHOO.util.Event.addListener('msg_cat_dashboard_company_submit_label', 'click', registrationUpdateSubmit);
			    	    YAHOO.util.Event.addListener('msg_cat_dashboard_company_cancel_label', 'click', registrationUpdateCancel);
			    	    YAHOO.util.Event.addListener("participant-new-company-name", "keypress", handleKeyPressedRegistrationOptionsUpdate);
	            	});
	            });
        }

        if(current == "dashboard") {
            return;
        }

    	var config = YAHOO.Convio.PC2.Data.TeamraiserConfig;
    	if(config.AdminNewsFeed.showAdminNewsFeed == "true" ||
    			config.AdminNewsFeed.showAdminNewsFeed == true) {
    		var tmpContainer = YAHOO.util.Dom.get('carousel-container');
    		if(tmpContainer != null && tmpContainer.childElementCount > 0) {
        		YAHOO.util.Dom.removeClass("newsfeed-container", "hidden-form");
    		}
    	}

        YAHOO.util.Dom.addClass("dashboard-report-content", "hidden-form");
        YAHOO.util.Dom.removeClass("dashboard-home-content", "hidden-form");
        YAHOO.util.Dom.addClass("report-sidebar", "hidden-form");
        YAHOO.util.Dom.removeClass("dashboard-sidebar", "hidden-form");
        // Switch between headers
        YAHOO.util.Dom.removeClass("msg_cat_overview_label","hidden-form");
        YAHOO.util.Dom.addClass("msg_cat_personal_report_label","hidden-form");
        // Sub load
        YAHOO.util.Dom.addClass(YAHOO.Convio.PC2.Views.current + "-content", "hidden-form");
        YAHOO.util.Dom.addClass(YAHOO.Convio.PC2.Views.current + "-sidebar", "hidden-form" );
        YAHOO.util.Dom.removeClass("dashboard-content", "hidden-form");
        YAHOO.util.Dom.removeClass("dashboard-sidebar", "hidden-form");
    };

    YAHOO.Convio.PC2.Views.load["email"] = function(subview) {
        updatePageStatus("");
        var current = YAHOO.Convio.PC2.Views.current;

        // Hide whatever is current
        YAHOO.util.Dom.addClass(YAHOO.Convio.PC2.Views.current + "-content", "hidden-form");
        YAHOO.util.Dom.addClass(YAHOO.Convio.PC2.Views.current + "-sidebar", "hidden-form" );
        // Always hide dashboard.
        YAHOO.util.Dom.addClass("dashboard-content","hidden-form");
        // Show email
        YAHOO.util.Dom.removeClass("email-content","hidden-form");
        YAHOO.util.Dom.addClass("email-" + YAHOO.Convio.PC2.Views.emailLast + "-content", "hidden-form");
        YAHOO.util.Dom.addClass("email-" + YAHOO.Convio.PC2.Views.emailLast + "-sidebar", "hidden-form");
        YAHOO.util.Dom.removeClass("email-" + subview + "-content", "hidden-form");
        YAHOO.util.Dom.removeClass("email-sidebar","hidden-form");
        YAHOO.util.Dom.removeClass("email-" + subview + "-sidebar","hidden-form");

        // Select right nav
        YAHOO.util.Dom.removeClass("email-" + YAHOO.Convio.PC2.Views.emailLast + "-nav","selected");
        //YAHOO.util.Dom.removeClass("email-" + YAHOO.Convio.PC2.Views.current_subview + "-nav", "selected");
        YAHOO.util.Dom.addClass("email-" + subview + "-nav", "selected");

        YAHOO.Convio.PC2.Views.emailLast = subview;

        Y.use("pc2-compose-functions", function(Y) {
        	ensureContactsLoaded();
        });

        if(subview == "compose") {
        	Y.use("pc2-compose-functions", "pc2-contacts-functions",function(Y) {
        		if(!YAHOO.Convio.PC2.Views.emailCompose) {
        			YAHOO.Convio.PC2.Views.emailCompose = true;

                    loadOverrides("email", subview);

                    YAHOO.Convio.PC2.Utils.require("pc2:configurationLoaded", "pc2:registrationLoaded", "pc2:allContactsLoaded", function() {
                        YAHOO.util.Event.addListener("email_wizard_compose_email_button", "click", showWizardCompose);
                        YAHOO.util.Event.addListener("email_wizard_set_recipients_button", "click", showWizardRecipients);
                        YAHOO.util.Event.addListener("email_wizard_preview_and_send_button", "click", showWizardPreviewAndSend);

                        YAHOO.util.Event.addListener("email_wizard_configure_button_prev", "click", showWizardConfigure);
                        YAHOO.util.Event.addListener("email_wizard_compose_button_prev", "click", showWizardCompose);
                        YAHOO.util.Event.addListener("email_wizard_contacts_button_prev", "click", showWizardRecipients);

                        YAHOO.util.Event.addListener("email-wizard-nav-configure", "click", showWizardConfigure);
                        YAHOO.util.Event.addListener("email-wizard-nav-compose", "click", showWizardCompose);
                        YAHOO.util.Event.addListener("email-wizard-nav-contacts", "click", showWizardRecipients);
                        YAHOO.util.Event.addListener("email-wizard-nav-preview", "click", showWizardPreviewAndSend);

                        jQuery('.next-button').button({label: jQuery('.msg_cat_class_next_button').html(), icons:{secondary:'ui-icon-triangle-1-e'}});
                        //jQuery('.msg_cat_class_prev').button({label: jQuery('.msg_cat_class_prev').html(), icons:{primary:'ui-icon-triangle-1-w'}});
                        jQuery('#email-wizard-contacts button').button();
                        jQuery('.email-wizard-contact-picker select').menu();

                        jQuery('#msg_cat_compose_send_button_label').button();

                        YAHOO.util.Event.addListener("msg_cat_compose_send_button_label", "click", sendMessage);
                        YAHOO.util.Event.addListener("msg_cat_compose_save_draft_button_label", "click", saveDraft);
                        YAHOO.util.Event.addListener("msg_cat_compose_save_template_button_label", "click", saveTemplate);
                        YAHOO.util.Event.addListener("msg_cat_compose_delete_button_label", "click", deleteDraft);
                        YAHOO.util.Event.addListener("msg_cat_back_to_drafts_label", "click", redirectToDrafts);
                        YAHOO.util.Event.addListener("msg_cat_layout_done_select_label", "click", hideLayouts);
                        YAHOO.util.Event.addListener("msg_cat_layout_select_label", "click", showLayouts);
                        YAHOO.util.Event.addListener("msg_cat_compose_preview_button_label", "click", previewMessage);

                        YAHOO.util.Event.addListener("msg_cat_compose_to_contacts_link", "click", redirectToContacts);

                        YAHOO.util.Event.addListener("preview-send-label", "click", sendPreviewMessage);
                        YAHOO.util.Event.addListener("preview-edit-label", "click", closePreviewMessage);
                        YAHOO.namespace("Convio.PC2.Component.EmailCompose");
                        YAHOO.Convio.PC2.Component.EmailCompose.DeleteConfirmDialog =
							YAHOO.Convio.PC2.Component.SimpleDialogBuilder.buildConfirmDialog(
								"confirm_templates_delete_dialog",
								[ /* dialog buttons */
									 {
                                         text: YAHOO.util.Dom.get("msg_cat_dialog_cancel_label").innerHTML,
                                         handler: function() {
                                             this.hide();
                                         }
                                     },
									 { 
									     text: YAHOO.util.Dom.get("msg_cat_dialog_delete_label").innerHTML, 
									     handler: function() {
									         this.hide();
									         deleteSuggestedMessageConfirmed(this.messageId);
									     },
									     isDefault:true 
									 }
                                ],
								{ /* no config overrides */ }
                    	   );
                        YAHOO.Convio.PC2.Component.EmailCompose.DeleteConfirmDialog.render();
                        show_pc2_element("confirm_templates_delete_dialog");
                        YAHOO.Convio.PC2.Component.EmailCompose.DeleteConfirmDialog.showFor = function(messageId) {
                            YAHOO.Convio.PC2.Component.EmailCompose.DeleteConfirmDialog.messageId = messageId;
                            YAHOO.Convio.PC2.Component.EmailCompose.DeleteConfirmDialog.show();
                        };

                        getMessageLayouts();

                        jQuery('#email-compose-templates .loader').show();
                        YAHOO.Convio.PC2.Teamraiser.getSuggestedMessages(GetSuggestedMessagesCallback);
                        YAHOO.Convio.PC2.Teamraiser.getEventDataParameter(GetEventDataParameterCallback, "F2F_CENTER_TAF_PERSONALIZED_SALUTATION_ENABLED", 'boolean');

                        lightBox = new YAHOO.widget.Panel("preview-block", 
                        { 
                            width:"650px", 
                            visible:false, 
                            constraintoviewport:true,
                            modal:true,
                            close: false
                        });

                        // Hide the lightbox if we click anywhere else in the document
                        YAHOO.util.Event.on(document, "click", function(e)
                    	{
                        	/* this technique described at http://developer.yahoo.com/yui/examples/calendar/calcontainer.html */
                    		var el = YAHOO.util.Event.getTarget(e);
                    		var lightBoxEl = lightBox.element;

                    		if (el != lightBoxEl && !YAHOO.util.Dom.isAncestor(lightBoxEl, el)) {
                    			closePreviewMessage();
                    		}
                    	}); 

                        lightBox.render();
                        show_pc2_element("preview-block");
                    });
        		}

        		// Always process the compose contactIds ... even on the first render of the compose subview
        		// but we have to wait until contacts are loaded into memory
        		YAHOO.Convio.PC2.Utils.require("pc2:allContactsLoaded", function() {
                populateEmailWizardContactPicker();
                YAHOO.Convio.PC2.Utils.publisher.on("pc2:contactAdded", function(contacts) {
                  contacts = YAHOO.Convio.PC2.Utils.ensureArray(contacts);
                  populateEmailWizardContactPicker();
                  addContacts(contacts);
                });

                //add in a case insensitive jQuery contains selector
                jQuery.expr[':'].containsIgnoreCase = function(a, i, m) {
                  return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
                };
                jQuery('#email-wizard-contact-search').keyup(updateContactPickerSearchResults);

		            addContactsById(YAHOO.Convio.PC2.Views.contactIds);
		            YAHOO.Convio.PC2.Views.contactIds = [];
		            addContactsByGroup(YAHOO.Convio.PC2.Views.groupIds)
		            YAHOO.Convio.PC2.Views.groupIds = [];
        		});
        	});
        }
        else if(subview == "drafts") {
            if(!YAHOO.Convio.PC2.Views.emailDrafts) {
                YAHOO.Convio.PC2.Views.emailDrafts = true; 
                Y.use("pc2-drafts-functions", function(Y) {

                    loadOverrides("email", subview);

                    YAHOO.Convio.PC2.Utils.require("pc2:configurationLoaded", "pc2:registrationLoaded", function() {
                        var deleteDraftAction = function() {
                            YAHOO.Convio.PC2.Teamraiser.deleteDraft(DeleteDraftConfirmCallback, deleteMessageId);
                        }
                        YAHOO.Convio.PC2.Teamraiser.Drafts.loadDrafts("drafts-block-inner");
                        YAHOO.Convio.PC2.Teamraiser.Drafts.DeleteConfirmDialog =
							YAHOO.Convio.PC2.Component.SimpleDialogBuilder.buildConfirmDialog(
								"confirm_delete_draft_dialog",
								[ /* dialog buttons */
								     {
                                         text: YAHOO.util.Dom.get("msg_cat_dialog_cancel_label").innerHTML,
                                         handler: function() {
                                             this.hide();
                                         }
                                     },
	                                 { 
	                                     text: YAHOO.util.Dom.get("msg_cat_dialog_delete_label").innerHTML, 
	                                     handler: function() {
	                                         this.hide();
	                                         deleteDraftAction();
	                                     },
	                                     isDefault:true 
	                                 }
	                            ],
								{ /* no config overrides */ }
                    	   );
                        YAHOO.Convio.PC2.Teamraiser.Drafts.DeleteConfirmDialog.render(document.body);
                        YAHOO.util.Dom.removeClass('confirm_delete_draft_dialog', 'hidden-form');
                    });
                });
            }
        }
        else if(subview == "sent") {
            if(!YAHOO.Convio.PC2.Views.emailSent) {
                YAHOO.Convio.PC2.Views.emailSent = true; 
                Y.use("pc2-sent-functions", function(Y) {

                    loadOverrides("email", subview);

                    YAHOO.Convio.PC2.Utils.require("pc2:configurationLoaded", "pc2:registrationLoaded", function() {
                        YAHOO.util.Event.addListener("search-button", "click", searchMessages);
                        YAHOO.util.Event.addListener("search-filters", "keypress", handleKeyPressedSearchMessages);

                        function handleKeyPressedPersonalShortcut(keyPressEvent) {
                        	if (keyPressEvent && keyPressEvent.keyCode === 13) {
                        		saveSettings();
                            }
                        };

                        YAHOO.Convio.PC2.Teamraiser.SentMessages.loadSentMessages("sent-messages-block-inner");

                        var deleteSentButtonAction = function() {
                            YAHOO.Convio.PC2.Teamraiser.deleteSentMessage(DeleteSentMessageCallback, deleteMessageId);
                        }

                        YAHOO.Convio.PC2.Teamraiser.SentMessages.DeleteConfirmDialog = 
							YAHOO.Convio.PC2.Component.SimpleDialogBuilder.buildConfirmDialog(
								"confirm_sent_delete_dialog",
								[ /* dialog buttons */
									 {
                                         text: YAHOO.util.Dom.get("msg_cat_dialog_cancel_label").innerHTML,
                                         handler: function() {
                                             this.hide();
                                         }
                                     },
	                                 { 
	                                     text: YAHOO.util.Dom.get("msg_cat_dialog_delete_label").innerHTML, 
	                                     handler: function() {
	                                         this.hide();
	                                         deleteSentButtonAction();
	                                     },
	                                     isDefault:true 
	                                 }

		                        ],
								{ /* no config overrides */ }
                    	   );
                        YAHOO.Convio.PC2.Teamraiser.SentMessages.DeleteConfirmDialog.render(document.body);
                        YAHOO.util.Dom.removeClass('confirm_sent_delete_dialog', 'hidden-form');
                    });
                });
            }
        }
        else if(subview == "contacts") {
        	// hide any previously revealed messages
        	hide_pc2_element('contacts-add-success');
        	hide_pc2_element('contacts-add-failure');
        	hide_pc2_element('contacts-delete-success');
        	hide_pc2_element('contacts-add-group-success');
        	hide_pc2_element('contacts-add-group-failure');
        	hide_pc2_element('contacts-add-group-exists-failure');

			jQuery('.next-button').button({label: jQuery('.msg_cat_class_next_button').html(), icons:{secondary:'ui-icon-triangle-1-e'}});

            if(!YAHOO.Convio.PC2.Views.emailContacts) {
                YAHOO.Convio.PC2.Views.emailContacts = true; 
                Y.use("pc2-contacts-functions", function(Y) {
                    loadOverrides("email", subview);
                    YAHOO.Convio.PC2.Utils.require("pc2:configurationLoaded", "pc2:registrationLoaded", function() {
                        /* BEGIN CONTACTS */
                        YAHOO.Convio.PC2.Component.Contacts.loadContacts(
                                'contacts-list', 
                                document.getElementById('msg_cat_contacts_name_label').innerHTML,
                                document.getElementById('msg_cat_contacts_email_label').innerHTML,
                                document.getElementById('msg_cat_contacts_amount_label').innerHTML,
                                document.getElementById('msg_cat_contacts_previous_amount_label').innerHTML,
                                document.getElementById('msg_cat_contacts_groups_label').innerHTML,
                                document.getElementById('msg_cat_contacts_email_sent_label').innerHTML,
                                document.getElementById('msg_cat_contacts_email_opened_label').innerHTML,
                                document.getElementById('msg_cat_contacts_page_visits_label').innerHTML,
                                document.getElementById('msg_cat_contacts_donations_label').innerHTML,
                                document.getElementById('msg_cat_contacts_groups_header_label').innerHTML
                                );
                        YAHOO.Convio.PC2.Teamraiser.getAddressBookFilters(getFiltersCallback);
                        /*
                        * BUTTON STUFF BELOW
                        */

                       /*
                        * Send Message Button
                        */
                       // "click" event handler for each Button instance
                       var onContactButtonClick = function(p_oEvent) {
                    	   if(YAHOO.Convio.PC2.Component.Contacts.contactViewType == 'individuals') {
                    		   var contacts = YAHOO.Convio.PC2.Component.Contacts.getSelectedContacts();
                    		   YAHOO.Convio.PC2.Views.contactIds = contacts;
                    		   YAHOO.Convio.PC2.Utils.loadView("email","compose");
                    	   } else {
                    		   // groups
                    		   var groupsFilterText = YAHOO.Convio.PC2.Component.Contacts.getSelectedFiltersString();
                    		   emailContactsGroup(groupsFilterText);
                    	   }
                           return false;
                       }

                       var emailAllClick = function(p_oEvent) {
                           //window.location="compose.html?contact_ids=all";
                           YAHOO.Convio.PC2.Views.contactIds = "all";
                           YAHOO.Convio.PC2.Utils.loadView("email","compose");
                           return false;
                       }

                       //var sendMessageButton = new YAHOO.widget.Button("msg_cat_contacts_send_message_button");
                       //sendMessageButton.on("click", onButtonClick);
                       YAHOO.util.Event.addListener("msg_cat_contacts_send_message_button", "click", onContactButtonClick);
                       YAHOO.util.Event.removeListener("msg_cat_subnav_compose_link_label", "click");
                       YAHOO.util.Event.addListener("msg_cat_subnav_compose_link_label", "click", onContactButtonClick);
                       YAHOO.util.Event.addListener("msg_cat_contacts_email_all_button", "click", emailAllClick);

                       //var searchButton = new YAHOO.widget.Button("msg_cat_contacts_search_button");
                       //searchButton.on("click", updateFilterText);
                       YAHOO.util.Event.addListener("msg_cat_contacts_search_button", "click", updateFilterText);
                       YAHOO.util.Event.addListener("contacts-search-text", "keypress", handleKeyPressedUpdateFilterText);

                       //var addContactButton = new YAHOO.widget.Button("msg_cat_add_contact_button_label");
                       //addContactButton.on("click", showAddContactForm);
                       YAHOO.util.Event.addListener("msg_cat_add_contact_button_label", "click", showAddContactForm);

                       YAHOO.util.Event.addListener("msg_cat_add_contacts_cancel_link", "click", cancelAddContact);

                       YAHOO.util.Event.addListener("msg_cat_contacts_individuals_view_label", "click", function() {
                    	   changeContactsView('individuals');
                       });
                       YAHOO.util.Event.addListener("msg_cat_contacts_groups_view_label", "click", function() {
                    	   changeContactsView('groups');
                       });

                       //var addSubmitButton = new YAHOO.widget.Button("msg_cat_add_contact_submit_button");
                       //addSubmitButton.on("click", submitAddContact);
                       // listen for the return key being pressed in any of the showAddContactForm fields
                       Y.use('event-key', function(Y) {
                           Y.on('key', submitAddContact, '#add_contact_first_name', 'down:13', Y);
                           Y.on('key', submitAddContact, '#add_contact_last_name', 'down:13', Y);
                           Y.on('key', submitAddContact, '#add_contact_email', 'down:13', Y);
                       });
                        YAHOO.util.Event.addListener("msg_cat_add_contact_submit_button", "click", submitAddContact);

                       /*
                        * Delete Button
                        */
                       var deleteContactsCallback = {
                           success: function(o) {
                               YAHOO.Convio.PC2.Component.Contacts.updateTimestamp();
                               var myPag = YAHOO.Convio.PC2.Component.Contacts.Paginator;
                               var myDialog = YAHOO.Convio.PC2.Component.Contacts.DeleteFailureDialog;
                               //YAHOO.Convio.PC2.Component.Contacts.Paginator.fireEvent('changeRequest',YAHOO.Convio.PC2.Component.Contacts.Paginator.getState({'page':1}));
                               var response = YAHOO.lang.JSON.parse(o.responseText).deleteTeamraiserAddressBookContactsResponse;
                               if(response.errors == 'true') {
                                   myDialog.show();
                               } else {
                                   YAHOO.util.Dom.removeClass('contacts-delete-success','hidden-form');
                               }
                               // If contactId is an array, set the total records to be
                               // the current number of records - the length of the array.
                               // Otherwise, set it to be the current number of records - 1.

                               if(YAHOO.lang.isArray(response.contactId)) {
                                   myPag.setTotalRecords(myPag.getTotalRecords() - response.contactId.length);
                               } else {
                                   myPag.setTotalRecords(myPag.getTotalRecords() - 1);
                               }
                               deleteContactHandler(response.contactId);
                               YAHOO.Convio.PC2.Utils.publisher.fire("pc2:contactDeleted", response.contactId);
                           },
                           failure: function(o) {
                               var myDialog = YAHOO.Convio.PC2.Component.Contacts.DeleteFailureDialog;
                               myDialog.show();
                               //YAHOO.log("Error deleting contacts. Message was: " + o.responseText, "info", "contacts.js");
                           },
                           scope: this
                       };
                       YAHOO.Convio.PC2.Component.Contacts.DeleteFailureDialog =
							YAHOO.Convio.PC2.Component.SimpleDialogBuilder.buildConfirmDialog(
								"unable_to_delete_all_dialog",
								[ /* dialog buttons */
								 	{ text:"Okay", handler: function() {this.hide();}, isDefault:true }
                                ],
								{ /* no config overrides */ }
                    	   );
                       YAHOO.Convio.PC2.Component.Contacts.DeleteFailureDialog.render(document.body);
                       YAHOO.util.Dom.removeClass("unable_to_delete_all_dialog","hidden-form");

                       var deleteContactButtonAction = function() {
                           var contacts = YAHOO.Convio.PC2.Component.Contacts.getSelectedContacts();
                           selectNone();
                           if(contacts.length > 0) {
                               clearStatusMessages();
                               YAHOO.Convio.PC2.Teamraiser.removeAddressBookContacts(deleteContactsCallback, contacts);
                           } else {
                               YAHOO.log("Delete clicked, but no contacts selected.","info","contacts.js");
                           }
                           return false;
                       }

                       YAHOO.Convio.PC2.Component.Contacts.DeleteConfirmDialog = 
                    	   YAHOO.Convio.PC2.Component.SimpleDialogBuilder.buildConfirmDialog(
                    			   "confirm_contacts_delete_dialog",
                    			   [ /* dialog buttons */
                                    {
                                        text: YAHOO.util.Dom.get("msg_cat_dialog_cancel_label").innerHTML,
                                        handler: function() {
                                            this.hide();
                                        }
                                    },
		                            {
		                                text: YAHOO.util.Dom.get("msg_cat_dialog_delete_label").innerHTML, 
		                                handler: function() {
		                                    this.hide();
		                                    deleteContactButtonAction();
		                                },
		                                isDefault:true 
		                            }

		                        ],
		                        { /*no overrides*/ }
                    	   );
                       YAHOO.Convio.PC2.Component.Contacts.DeleteConfirmDialog.render(document.body);
                       YAHOO.util.Dom.removeClass("confirm_contacts_delete_dialog","hidden-form");

                       YAHOO.Convio.PC2.Component.Contacts.DeleteGroupsConfirmDialog = 
							YAHOO.Convio.PC2.Component.SimpleDialogBuilder.buildConfirmDialog(
								"confirm_contacts_delete_groups_dialog",
                                [ /* dialog buttons */
                                    {
                                        text: YAHOO.util.Dom.get("msg_cat_dialog_cancel_label").innerHTML,
                                        handler: function() {
                                            this.hide();
                                        }
                                    },
                                    {
                                        text: YAHOO.util.Dom.get("msg_cat_dialog_delete_label").innerHTML, 
                                        handler: function() {
                                            this.hide();

                                            this.deleteGroupsCallback = {
                                            		success: function(o) {
                                            			refreshContactsGroups();
                                            		},
                                            		failure: function(o) {
                                            			logFailure(o);
                                            		},
                                            		scope: this
                                            }
                                            // delete each group
                                            var selectedGroups = YAHOO.Convio.PC2.Component.Contacts.getSelectedGroupsFilters(true);
                                            YAHOO.Convio.PC2.AddressBook.deleteGroups(this.deleteGroupsCallback, selectedGroups);
                                        },
                                        isDefault:true 
                                    }
                                ],
								{ /* no overrides */ }
                    	   );
                       YAHOO.Convio.PC2.Component.Contacts.DeleteGroupsConfirmDialog.render(document.body);
                       YAHOO.util.Dom.removeClass("confirm_contacts_delete_groups_dialog","hidden-form");

                       YAHOO.Convio.PC2.Component.Contacts.DeleteGroupsErrorDialog = 
							YAHOO.Convio.PC2.Component.SimpleDialogBuilder.buildConfirmDialog(
								"confirm_contacts_delete_groups_error_dialog",
								[ /* dialog buttons */
	                                 {
	                                     text: YAHOO.util.Dom.get("msg_cat_dialog_okay_label").innerHTML, 
	                                     handler: function() {
	                                         this.hide();
	                                     },
	                                     isDefault:true 
	                                 }
	                            ],
								{ /* no config overrides */ }
                    	   );

                       YAHOO.Convio.PC2.Component.Contacts.DeleteGroupsErrorDialog.render(document.body);
                       YAHOO.util.Dom.removeClass("confirm_contacts_delete_groups_error_dialog","hidden-form");

                       YAHOO.util.Event.addListener("msg_cat_contacts_delete_button", "click",function() {
                    	   if(YAHOO.Convio.PC2.Component.Contacts.contactViewType == 'individuals') {
                    		   YAHOO.Convio.PC2.Component.Contacts.DeleteConfirmDialog.show();
                    	   } else {
                    		   var groups = YAHOO.Convio.PC2.Component.Contacts.getSelectedGroupsFilters();
                    		   var allValidGroups = true;
                    		   for(var i in groups) {
                    			   var filterName = groups[i];
                    			   if(filterName.indexOf('email_rpt_group_') != 0) {
                    				   allValidGroups = false;
                    				   break;
                    			   }
                    		   }
                    		   if(allValidGroups) {
                    			   YAHOO.Convio.PC2.Component.Contacts.DeleteGroupsConfirmDialog.show();
                    		   } else {
                    			   YAHOO.Convio.PC2.Component.Contacts.DeleteGroupsErrorDialog.show();
                    		   }
                    	   }
                       });

                       // get the container for the Menu Button.  When embedded in an iFrame, IE can't create the button
                       // if you pass in just the element name for the container.

                       var groupContainerElem = YAHOO.util.Dom.get("groups_menu_container");
                       var groupsMenuButton = new YAHOO.widget.Button({
                                               id: "groupsMenuButton", 
                                               name: "groupsMenuButton",
                                               label: document.getElementById("msg_cat_contacts_add_to_group").innerHTML,
                                               type: "menu",  
                                               lazyloadmenu: false,
                                               menu: [], 
                                               container: groupContainerElem });
                       var groupsMenuButtonMenu = groupsMenuButton.getMenu();

                       /*
                       try {
                           //groupsMenuButtonMenu.itemData = initialMenu;
                               
                           //groupsMenuButtonMenu.clearContent();
                           groupsMenuButtonMenu.addItems(initialMenu);
                           groupsMenuButtonMenu.render();
                       
                       } catch(e) {
                           YAHOO.log("Caught error rendering groupsMenu: " + e, "error", "contacts.js");
                       }
                       */

                       YAHOO.Convio.PC2.Component.Contacts.GroupsMenuButton = groupsMenuButton;

                       /* BEGIN GROUPS MENU */
                       // Add Group
                       YAHOO.Convio.PC2.Component.Contacts.AddNewGroupDialog = function(id) {
                           YAHOO.log('Creating AddNewGroupDialog','info','contacts_utils.js');
                           
                           try {
                               this.AddNewGroupCallback = {
                                   success: function(o) {
                                       var response = YAHOO.lang.JSON.parse(o.responseText).addAddressBookGroupResponse;
                                       var responseGroup = response.addressBookGroup;

                                       YAHOO.util.Dom.removeClass('contacts-add-group-success','hidden-form');
                                       // Add the new group to the menu button
                                       //addGroupMenuItems(responseGroup);
                                       refreshContactsGroups();

                                       // Update existing records.
                                       updateGroupMembership(response);

                                       /* Need to refresh groups in other views */
                                       YAHOO.Convio.PC2.Views.emailGroupsReset = true;
                                       YAHOO.Convio.PC2.Views.emailContactDetailsGroupsReset = true;
                                   },
                                   failure: function(o) {
                                       var response = YAHOO.lang.JSON.parse(o.responseText).errorResponse;
                                       var errMessage = response.message;
                                       if(response.code == "905") {
                                           var error = YAHOO.util.Dom.get('add-group-exists-failure-span');
                                           error.innerHTML = errMessage;
                                           YAHOO.util.Dom.removeClass('contacts-add-group-exists-failure', 'hidden-form');
                                       } else {
                                           YAHOO.util.Dom.removeClass('contacts-add-group-failure', 'hidden-form');
                                       }
                                       YAHOO.log("Error adding new group: " + o.responseText, "error", "contacts_utils.js");
                                   },

                                   scope: this
                               };

                               // Define various event handlers for Dialog
                               this.handleSubmit = function() {
                                   try {
                                       var data = this.getData();
                                       var groupName = data.addNewGroupName;
                                       if(YAHOO.Convio.PC2.Component.Contacts.contactViewType == 'individuals') {
                                    	   var contactIds = YAHOO.Convio.PC2.Component.Contacts.getSelectedContacts();
                                    	   clearStatusMessages();
                                    	   YAHOO.Convio.PC2.AddressBook.createGroupForContacts(this.AddNewGroupCallback, groupName, contactIds);
                                       } else {
                                    	   // groups
                                    	   clearStatusMessages();
                                    	   var groupsFilterText = '';
                                    	   if(!YAHOO.Convio.PC2.Component.Contacts.skipGroupIds) {
                                    		   groupsFilterText = YAHOO.Convio.PC2.Component.Contacts.getSelectedFiltersString();
                                    	   }
                                    	   YAHOO.Convio.PC2.Component.Contacts.skipGroupIds = false;
                                    	   if(groupsFilterText != '') {
                                    		   GetAddressBookContactsFromGroupsForCreateGroupCallback.groupName = groupName;
                                    		   GetAddressBookContactsFromGroupsForCreateGroupCallback.callback = this.AddNewGroupCallback;
                                    		   createGroupFromContactsGroup(groupsFilterText);
                                    	   } else {
                                    		   YAHOO.Convio.PC2.AddressBook.createGroupForContacts(this.AddNewGroupCallback, groupName, []);
                                    	   }
                                       }

                                       this.hide();
                                       this.form.reset();
                                   } catch(e) {
                                       YAHOO.log('Error with AddNewGroupDialog.handleSubmit: ' + e, 'error', 'contacts_utils.js');
                                   }
                               };

                               this.handleCancel = function() {
                            	   YAHOO.Convio.PC2.Component.Contacts.skipGroupIds = false;
                                   this.cancel();
                               };

                               this.doSubmit = function(){
                                   this.handleSubmit();
                               };

                               // define dialog config
                               var MsgCatProvider = YAHOO.Convio.PC2.Component.Content;
                               var dialogConfig = {
                                   width : "27em",
                                   modal: true, 
                                   visible : false, 
                                   close: false,
                                   buttons : [ { text:MsgCatProvider.getMsgCatValue('dialog_cancel'), handler:this.handleCancel },
                                               { text:MsgCatProvider.getMsgCatValue('dialog_submit'), handler:this.handleSubmit, isDefault:true } ]
                               };

                               // invoke parent constructor
                               YAHOO.Convio.PC2.Component.Contacts.AddNewGroupDialog.superclass.constructor.call(
                                   this, 
                                   id || YAHOO.util.Dom.generateId(), 
                                   dialogConfig
                               );

                               this.render(document.body);
                           } catch(e) {
                               YAHOO.log('Error creating AddNewGroupDialog: ' + e, 'error', 'contacts_utils.js');
                           }
                       };

                       // Acknowledge gift
                       YAHOO.Convio.PC2.Component.Contacts.acknowledgeGiftsCallback = {
                    		   success: function(o) {
                    			   var response = YAHOO.lang.JSON.parse(o.responseText).acknowledgeGiftsResponse;
                    			   if(!response.success) {
                    				   YAHOO.log("Could not acknowledge gift.","info","contacts-functions.js");
                    			   } else {
                    				   document.getElementById('acknowledge-' + response.contactId).innerHTML = '';
                    				   // force refresh of gift history
                    				   YAHOO.Convio.PC2.Views.reportPersonalReset = true;
                    			   }
                    		   },
                    		   failure: function(o) {
                    			   YAHOO.log("Error acknowledging gifts","error","contacts-functions.js");
                    		   },
                    		   scope: this
                       };

                       YAHOO.Convio.PC2.Component.Contacts.acknowledgeGiftButtonAction = function() {
                    	   YAHOO.Convio.PC2.Teamraiser.acknowledgeGiftResult(YAHOO.Convio.PC2.Component.Contacts.acknowledgeGiftsCallback, acknowledgeContactId);
                       };
                       
                       YAHOO.Convio.PC2.Component.Contacts.acknowledgeGiftEmailButtonAction = function() {
                           YAHOO.Convio.PC2.Views.contactIds = acknowledgeContactId;
                           YAHOO.Convio.PC2.Utils.loadView("email","compose");
                         };

                       YAHOO.Convio.PC2.Component.Contacts.acknowledgeGift = function(contactId, showEmail) {
                    	   acknowledgeContactId = contactId;
                    	   if(showEmail) {
                    		   YAHOO.Convio.PC2.Component.Contacts.AcknowledgeGiftDialog.show();
                    	   } else {
                    		   YAHOO.Convio.PC2.Component.Contacts.AcknowledgeGiftNoEmailDialog.show();
                    	   }
                       };

                       YAHOO.Convio.PC2.Component.Contacts.AcknowledgeGiftDialog = 
							YAHOO.Convio.PC2.Component.SimpleDialogBuilder.buildConfirmDialog(
								"acknowledge_contact_gift_dialog",
								[ /* dialog buttons */
									{
                                        text: YAHOO.util.Dom.get("msg_cat_dialog_cancel_label").innerHTML,
                                        handler: function() {
                                            this.hide();
                                        }
                                    },
	                    		    {
	                    		    	text: YAHOO.util.Dom.get("msg_cat_dialog_acknowledge_label").innerHTML, 
	                    		    	handler: function() {
	                    		    		this.hide();
	                    		    		YAHOO.Convio.PC2.Component.Contacts.acknowledgeGiftButtonAction();
	                    		    	},
	                    		    	isDefault:true 
	                    		    },
	                    		    {
	                    		    	text: YAHOO.util.Dom.get("msg_cat_dialog_acknowledge_email_label").innerHTML, 
	                    		    	handler: function() {
	                    		    		this.hide();
	                    		    		YAHOO.Convio.PC2.Component.Contacts.acknowledgeGiftEmailButtonAction();
	                    		    	},
	                    		    	isDefault:true 
	                    		    }
	                    		],
								{ /* no config overrides */ }
                    	   );
                       YAHOO.Convio.PC2.Component.Contacts.AcknowledgeGiftNoEmailDialog = 
							YAHOO.Convio.PC2.Component.SimpleDialogBuilder.buildConfirmDialog(
								"acknowledge_contact_gift_no_email_dialog",
								[ /* dialog buttons */
                                    {
                                        text: YAHOO.util.Dom.get("msg_cat_dialog_cancel_label").innerHTML,
                                        handler: function() {
                                            this.hide();
                                        }
                                    },
	                      		    {
	                      		    	text: YAHOO.util.Dom.get("msg_cat_dialog_acknowledge_label").innerHTML,
	                      		    	handler: function() {
	                      		    		this.hide();
	                      		    		YAHOO.Convio.PC2.Component.Contacts.acknowledgeGiftButtonAction();
	                      		    	},
	                      		    	isDefault:true
	                      		    }
			                    ],
								{ /* no config overrides */ }
                    	   );
                        var MsgCatProvider = YAHOO.Convio.PC2.Component.Content;
                        jQuery('#msg_cat_contacts_acknowledge_contact_gift_header2').html(MsgCatProvider.getMsgCatValue('contacts_acknowledge_contact_gift_header'));
                        jQuery('#msg_cat_contacts_acknowledge_contact_gift_body2').html(MsgCatProvider.getMsgCatValue('contacts_acknowledge_contact_gift_body'));
                        YAHOO.Convio.PC2.Component.Contacts.AcknowledgeGiftNoEmailDialog.render(document.body);
                        YAHOO.Convio.PC2.Component.Contacts.AcknowledgeGiftDialog.render(document.body);
                        YAHOO.util.Dom.removeClass("acknowledge_contact_gift_dialog","hidden-form");
                        YAHOO.util.Dom.removeClass("acknowledge_contact_gift_no_email_dialog","hidden-form");

                       // Add Dialog
                       YAHOO.lang.extend(YAHOO.Convio.PC2.Component.Contacts.AddNewGroupDialog, YAHOO.Convio.PC2.Component.PC2Dialog);
                       var addGroupInstance = new YAHOO.Convio.PC2.Component.Contacts.AddNewGroupDialog("new-group-dialog");
                       YAHOO.Convio.PC2.Component.Contacts.addGroupInstance = addGroupInstance;
                       show_pc2_element("new-group-dialog");

                       // YAHOO.util.Event.addListener("msg_cat_groups_add_group_button", "click", addGroup);
                       /* END GROUPS MENU */
                       
                       YAHOO.Convio.PC2.AddressBook.getAddressBookGroups(addGroupMenuItemsCallback);

                        YAHOO.util.Event.addListener(
                                "msg_cat_filter_show_all",
                                "click", 
                                setNoFilter);

                        YAHOO.util.Event.addListener(
                                "msg_cat_filter_show_less",
                                "click", 
                                filterShowLess);

                        YAHOO.util.Event.addListener(
                                "msg_cat_filter_show_more",
                                "click", 
                                filterShowMore);

                        YAHOO.util.Event.addListener("upload-contacts-item", "click", YAHOO.Convio.PC2.Component.Contacts.showUpload);
                        YAHOO.util.Event.addListener("upload-contacts-cancel", "click", YAHOO.Convio.PC2.Component.Contacts.hideUpload);

                        YAHOO.lang.extend(YAHOO.Convio.PC2.Component.Contacts.EditGroupDialog, YAHOO.Convio.PC2.Component.PC2Dialog);
                        var groupEditLabels = {
                        		editGroupHeader: YAHOO.util.Dom.get("msg_cat_groups_dialog_edit_group_header").innerHTML,
                        		groupLabel: YAHOO.util.Dom.get("msg_cat_groups_dialog_group_name_label").innerHTML
                        };
                        YAHOO.Convio.PC2.Component.Contacts.groupEditObject = new YAHOO.Convio.PC2.Component.Contacts.EditGroupDialog(null, groupEditLabels);
                        
                        YAHOO.Convio.PC2.Component.Contacts.skipGroupIds = false;
                        var openCreateGroupDialog = function() {
                        	YAHOO.Convio.PC2.Component.Contacts.skipGroupIds = true;
                        	YAHOO.Convio.PC2.Component.Contacts.addGroupInstance.show(); 
                        }
                        YAHOO.util.Event.addListener('msg_cat_add_group_button_label', 'click', openCreateGroupDialog);
                    });
                });
                YAHOO.Convio.PC2.Views.emailContactsReset = false;
                YAHOO.Convio.PC2.Views.emailContactsGroupsReset = false;
            }
            else { 
                if(YAHOO.Convio.PC2.Views.emailContactsReset) {
                    YAHOO.Convio.PC2.Views.emailContactsReset = false;
                    YAHOO.Convio.PC2.Component.Contacts.Paginator.reset();
                }
                if(YAHOO.Convio.PC2.Views.emailContactsGroupsReset) {
                    YAHOO.Convio.PC2.Views.emailContactsGroupsReset = false;
                    refreshContactsGroups();
                }
            }
        }
        else if(subview == "contactdetails") 
				{
						if (contactId == null)
						{
										YAHOO.Convio.PC2.Utils.loadView("email", "contacts");
						}
            if(!YAHOO.Convio.PC2.Views.emailContactDetails) {
                YAHOO.Convio.PC2.Views.emailContactDetails = true;

                YAHOO.namespace("Convio.PC2.Component.ContactDetails");
                Y.use("pc2-contactdetails-functions", function(Y) {

                    loadOverrides("email", subview);

                    // get the container for the Menu Button.  When embedded in an iFrame, IE can't create the button
                    // if you pass in just the element name for the container.
                    var detailsGroupsMenuButtonContainer = YAHOO.util.Dom.get("details_groups_menu_container");
                    var detailsGroupsMenuButton = new YAHOO.widget.Button({ 
                        id: "detailsGroupsMenuButton", 
                        name: "detailsGroupsMenuButton",
                        label: document.getElementById("msg_cat_contacts_add_to_group").innerHTML, //"Add to Group", // TODO: Figure out how to msg_cat this
                        type: "menu",  
                        lazyloadmenu: false,
                        menu: [], 
                        container: detailsGroupsMenuButtonContainer });

                    var detailsGroupsMenuButtonMenu = detailsGroupsMenuButton.getMenu();

                    YAHOO.Convio.PC2.Component.ContactDetails.DetailsGroupsMenuButton = detailsGroupsMenuButton;

                    // Add Group
                    YAHOO.Convio.PC2.Component.ContactDetails.AddNewGroupDialog = function(id) {

                        YAHOO.log('Creating AddNewGroupDialog','info','contacts_utils.js');
                        try {
                            this.AddNewGroupCallback = {
                                success: function(o) {
                                    var response = YAHOO.lang.JSON.parse(o.responseText).addAddressBookGroupResponse;
                                    var responseGroup = response.addressBookGroup;
                 
                                    // Add the new group to the menu button
                                    //detailsAddGroupMenuItems(responseGroup);
                                    YAHOO.Convio.PC2.AddressBook.getAddressBookGroups(detailsAddGroupMenuItemsCallback);
                                    
                                    // Update existing records.
                                    detailsUpdateGroupMembership(response);
                                    
                                    /* Need to refresh groups in other views */
                                    YAHOO.Convio.PC2.Views.emailGroupsReset = true;
                                    YAHOO.Convio.PC2.Views.emailContactsGroupsReset = true;
                                    YAHOO.Convio.PC2.Views.emailContactsReset = true;
                                },
                                failure: function(o) {
                                    YAHOO.log("Error adding new group: " + o.responseText, "error", "contacts_utils.js");
                                }
                            };

                            // Define various event handlers for Dialog
                            this.handleSubmit = function() {
                                try {
                                    var data = this.getData();
                                    var groupName = data.detailsAddNewGroupName;

                                    //var contactIds = YAHOO.Convio.PC2.Component.Contacts.getSelectedContacts();
                                    YAHOO.Convio.PC2.AddressBook.createGroupForContacts(this.AddNewGroupCallback, groupName, contactId);

                                    this.hide();
                                    this.form.reset();
                                } catch(e) {
                                    YAHOO.log('Error with AddNewGroupDialog.handleSubmit: ' + e, 'error', 'contacts_utils.js');
                                }
                            };

                            this.handleCancel = function() {
                                this.cancel();
                            };

                            // define config for dialog
                            var MsgCatProvider = YAHOO.Convio.PC2.Component.Content;
                            var dialogConfig = {
                                width : "27em",
                                modal: true, 
                                visible : false, 
                                close: false,
                                buttons : [ { text:MsgCatProvider.getMsgCatValue('dialog_submit'), handler:this.handleSubmit, isDefault:true },
                                           { text:MsgCatProvider.getMsgCatValue('dialog_cancel'), handler:this.handleCancel } ]
                            };

                            // invoke parent class constructor
                            YAHOO.Convio.PC2.Component.ContactDetails.AddNewGroupDialog.superclass.constructor.call(
                                this, 
                                id || YAHOO.util.Dom.generateId(), 
                                dialogConfig
                            );
                            
                            this.render(document.body);
                        } catch(e) {
                            YAHOO.log('Error creating AddNewGroupDialog: ' + e, 'error', 'contacts_utils.js');
                        }
                    };

                    // Add Dialog
                    YAHOO.lang.extend(YAHOO.Convio.PC2.Component.ContactDetails.AddNewGroupDialog, YAHOO.Convio.PC2.Component.PC2Dialog);
                    var detailsAddGroupInstance = new YAHOO.Convio.PC2.Component.ContactDetails.AddNewGroupDialog("details-new-group-dialog");
                    YAHOO.Convio.PC2.Component.ContactDetails.detailsAddGroupInstance = detailsAddGroupInstance;
                    show_pc2_element("details-new-group-dialog");
                    /* END GROUPS MENU */

                    YAHOO.util.Dom.get("contact_details_history").innerHTML = "";
                    YAHOO.util.Dom.get("progress-contactdetails-goal-value").innerHTML = "";
                    YAHOO.util.Dom.get("contact_name").innerHTML = "";
                    YAHOO.util.Dom.get("contact_email").innerHTML = "";
                    YAHOO.Convio.PC2.Teamraiser.getAddressBookContact(getContactCallback, contactId);
                    loadContactActivity(contactId);              
                    YAHOO.Convio.PC2.AddressBook.getAddressBookGroups(detailsAddGroupMenuItemsCallback);

                    YAHOO.util.Event.addListener("msg_cat_contact_details_edit_info", "click", function() {
                        YAHOO.Convio.PC2.Utils.loadView("email", "contactedit");
                        return false;
                    });

                    /* Need to refresh groups in other views */
                    YAHOO.Convio.PC2.Views.emailContactDetailsGroupsReset = false;
                });
            } else {
                // This is not the first load of this view
                YAHOO.util.Dom.get("contact_details_history").innerHTML = "";
                YAHOO.util.Dom.get("progress-contactdetails-goal-value").innerHTML = "";
                YAHOO.util.Dom.get("contact_name").innerHTML = "";
                YAHOO.util.Dom.get("contact_email").innerHTML = "";
                YAHOO.Convio.PC2.Teamraiser.getAddressBookContact(getContactCallback, contactId);
                loadContactActivity(contactId);

                if(YAHOO.Convio.PC2.Views.emailContactDetailsGroupsReset) {
                    YAHOO.Convio.PC2.Views.emailContactDetailsGroupsReset = false;
                    /* reload groups menu */
                    YAHOO.Convio.PC2.AddressBook.getAddressBookGroups(detailsAddGroupMenuItemsCallback);
                }
            }
        } else if(subview == "contactedit") {
            if(!YAHOO.Convio.PC2.Views.emailContactEdit) {
                YAHOO.Convio.PC2.Views.emailContactEdit = true;
                
                YAHOO.namespace("Convio.PC2.Component.ContactEdit");
                Y.use("pc2-contactedit-functions", function(Y) {
                	configureDisplayForLocale();

                    loadOverrides("email", subview);

                    YAHOO.util.Event.addListener("msg_cat_contact_edit_save_button", "click", saveEditedContact);
                    YAHOO.util.Event.addListener(
                            "msg_cat_contact_edit_cancel_link",
                            "click", 
                            contactEditGoBack, 
                            null, 
                            false);

                    contactEditLoadSafe();
                });
            } else {
                updateEditContactError("");
                contactEditLoadSafe();
            }
        } else if(subview == "groups") {
            if(!YAHOO.Convio.PC2.Views.emailGroups) {
                // First email-groups load
                YAHOO.Convio.PC2.Views.emailGroups = true;

                YAHOO.namespace("Convio.PC2.Component.Groups");
                Y.use("pc2-groups-functions", function(Y) {
                    loadOverrides("email", subview);

                    YAHOO.Convio.PC2.Utils.require("pc2:configurationLoaded", "pc2:registrationLoaded", function() {
                        YAHOO.Convio.PC2.Component.Groups.loadGroups(
                                'groups-data-list', 
                                document.getElementById('msg_cat_groups_name_label').innerHTML,
                                document.getElementById('msg_cat_groups_contact_count_email_label').innerHTML
                        );

                        YAHOO.Convio.PC2.Component.Groups.DeleteConfirmDialog = 
							YAHOO.Convio.PC2.Component.SimpleDialogBuilder.buildConfirmDialog(
								"confirm_groups_delete_dialog",
								[ /* dialog buttons */
									 {
                                         text: YAHOO.util.Dom.get("msg_cat_dialog_cancel_label").innerHTML,
                                         handler: function() {
                                             this.hide();
                                         }
                                     },
	                                 { 
	                                     text: YAHOO.util.Dom.get("msg_cat_dialog_delete_label").innerHTML, 
	                                     handler: function() {
	                                         this.hide();
	                                         YAHOO.Convio.PC2.Component.Groups.deleteGroupsAction();
	                                     },
	                                     isDefault:true 
	                                 }
	                            ],
								{ /* no config overrides */ }
                    	   );

                        YAHOO.Convio.PC2.Component.Groups.DeleteConfirmDialog.render(document.body);
                        YAHOO.util.Dom.removeClass('confirm_groups_delete_dialog', 'hidden-form');

                        var showGroupsDelete = function() {
                            YAHOO.Convio.PC2.Component.Groups.DeleteConfirmDialog.show();
                        };

                        YAHOO.util.Event.addListener("msg_cat_groups_delete_selected", "click", showGroupsDelete);

                        // Group Edit Dialog
                        YAHOO.lang.extend(YAHOO.Convio.PC2.Component.Groups.EditGroupDialog, YAHOO.Convio.PC2.Component.PC2Dialog);
                        var groupEditLabels = {
                                editGroupHeader: YAHOO.util.Dom.get("msg_cat_groups_dialog_edit_group_header").innerHTML,
                                groupLabel: YAHOO.util.Dom.get("msg_cat_groups_dialog_group_name_label").innerHTML
                        };
                        YAHOO.Convio.PC2.Component.Groups.groupEditObject = new YAHOO.Convio.PC2.Component.Groups.EditGroupDialog(null, groupEditLabels);

                        // Group Add Dialog
                        YAHOO.lang.extend(YAHOO.Convio.PC2.Component.Groups.AddGroupDialog, YAHOO.Convio.PC2.Component.PC2Dialog);
                        var groupAddLabels = {
                                addGroupHeader: YAHOO.util.Dom.get("msg_cat_groups_dialog_add_group_header").innerHTML,
                                groupLabel: YAHOO.util.Dom.get("msg_cat_groups_dialog_group_name_label").innerHTML
                        };
                        var addGroupDialog = new YAHOO.Convio.PC2.Component.Groups.AddGroupDialog(null, groupAddLabels);
                        var addGroup = function() {
                            addGroupDialog.show();
                        }
                        YAHOO.util.Event.addListener("msg_cat_groups_add_group_button", "click", addGroup);

                        var loadGroupsCompose = function() {
                            YAHOO.Convio.PC2.Views.groupIds = YAHOO.Convio.PC2.Component.Groups.getSelectedGroups();
                            YAHOO.Convio.PC2.Utils.loadView("email", "compose");
                        };
                        YAHOO.util.Event.addListener("msg_cat_groups_send_message_to_selected", "click", loadGroupsCompose);
                        
                        YAHOO.Convio.PC2.Views.emailGroupsReset = false;
                    });
                });
            } else if(YAHOO.Convio.PC2.Views.emailGroupsReset) {
                YAHOO.Convio.PC2.Views.emailGroupsReset = false;
                YAHOO.Convio.PC2.Component.Groups.refreshList();
            }
        }

        YAHOO.Convio.PC2.Utils.require("pc2:configurationLoaded", "pc2:registrationLoaded", "pc2:allContactsLoaded", "pc2:suggestedMessagesLoaded", function() {
          var indexToActivate = typeof YAHOO.Convio.PC2.Views.emailTemplateTypeDefault==='number'?YAHOO.Convio.PC2.Views.emailTemplateTypeDefault:3;
          if( !jQuery(jQuery('#email-template-container h3')[indexToActivate]).is(':visible') )
            indexToActivate = 3;

          jQuery('#email-template-container').accordion({
              autoHeight: false
            , active: indexToActivate
            , clearStyle: true
          });
        });
    }

    YAHOO.Convio.PC2.Views.load["report"] = function(subview) {
        var subViewIds = [];
        subViewIds["personal"] = "personal_report_link";
        subViewIds["team"] = "team_report_link";
        subViewIds["company"] = "company_report_link";

        var currentSubview = YAHOO.Convio.PC2.Views.current_subview;
        var current = YAHOO.Convio.PC2.Views.current;

        hide_pc2_element("report-" + YAHOO.Convio.PC2.Views.reportLast + "-sidebar");
        show_pc2_element("report-" + subview + "-sidebar");

        if(subview == "personal") {
            if(!YAHOO.Convio.PC2.Views.reportPersonal) {
                Y.use("yui2-charts","yui2-paginator",function(Y) {
                    loadOverrides("report", subview);

                    YAHOO.Convio.PC2.Utils.require("pc2:configurationLoaded", "pc2:registrationLoaded", function() {
                    	if(YAHOO.Convio.PC2.Views.reportPersonal == null) {
                    		// 52816 force progress update if coming from dashboard w/o loading of personal progress 
                            YAHOO.Convio.PC2.Component.Teamraiser.updateParticipantGoal(YAHOO.util.Dom.get("progress-goal-value").innerHTML);
                            YAHOO.Convio.PC2.Teamraiser.getParticipantProgress(YAHOO.Convio.PC2.Component.Teamraiser.loadParticipantProgressCallback);
                    	}
                        YAHOO.Convio.PC2.Views.reportPersonal = true;

                        YAHOO.util.Event.addListener("msg_cat_report_add_gift_button_label", "click", clickAddlGiftOptions);
                        YAHOO.util.Event.addListener("msg_cat_gift_notification_off_button_label", "click", giftNotificationOff);
                        YAHOO.util.Event.addListener("msg_cat_gift_notification_on_button_label", "click", giftNotificationOn);
                        YAHOO.Convio.PC2.Teamraiser.getParticipantTopDonorsList(GetTopDonorsListCallback);
                        YAHOO.Convio.PC2.Teamraiser.getPersonalDonationByDay(GetPersonalDonationByDayCallback);

                        var labels = {
                            donor: document.getElementById("msg_cat_report_donor_label").innerHTML,
                            amount: document.getElementById("msg_cat_report_amount_label").innerHTML,
                            notes: document.getElementById("msg_cat_report_notes_label").innerHTML,
                            date: document.getElementById("msg_cat_report_date_label").innerHTML,
                            msgEmpty: document.getElementById("msg_cat_report_no_donations_found").innerHTML,
                            actions: document.getElementById("msg_cat_report_actions_label").innerHTML
                        }
                        YAHOO.Convio.PC2.Component.GiftHistory.loadDefaultPersonalGiftHistory("donation_history", labels);

                        var deleteButtonAction = function() {
                            YAHOO.Convio.PC2.Teamraiser.deleteGift(deleteGiftCallback, deleteGiftId);
                        }

                        YAHOO.Convio.PC2.Component.GiftHistory.DeleteConfirmDialog = 
							YAHOO.Convio.PC2.Component.SimpleDialogBuilder.buildConfirmDialog(
								"confirm_gift_delete_dialog",
								[ /* dialog  buttons */
								    {
                                        text: YAHOO.util.Dom.get("msg_cat_dialog_cancel_label").innerHTML,
                                        handler: function() {
                                            this.hide();
                                        }
                                    },
		                            { 
		                                text: YAHOO.util.Dom.get("msg_cat_dialog_delete_label").innerHTML, 
		                                handler: function() {
		                                    this.hide();
		                                    deleteButtonAction();
		                                },
		                                isDefault:true 
		                            }

				                ],
								{ /* no config overrides */ }
                    	   );
                        YAHOO.Convio.PC2.Component.GiftHistory.DeleteConfirmDialog.render(document.body);
                        show_pc2_element("confirm_gift_delete_dialog");
                    });
                });

                YAHOO.Convio.PC2.Views.reportPersonalReset = false;

                // Acknowledge gift
                YAHOO.Convio.PC2.Component.GiftHistory.acknowledgeGiftsCallback = {
             		   success: function(o) {
             			   var response = YAHOO.lang.JSON.parse(o.responseText).acknowledgeGiftsResponse;
             			   if(!response.success) {
             				   YAHOO.log("Could not acknowledge gifts.","info","contacts-functions.js");
             			   } else {
             				   var Y = YAHOO.util;
             				   YUI().use('node',function(Y) {
             					   var idStr = 'acknowledge-' + response.contactId;
             					   var nodes = Y.all('.follow-up');
             					   nodes.each(function(node) {
            						   var idAttr = node.getAttribute('id');
            						   if(idAttr.indexOf(idStr) > -1) {
            							   node.set('innerHTML', '');
            						   }
             					   });
             				   });
             			   }
             		   },
             		   failure: function(o) {
             			   YAHOO.log("Error acknowledging gifts","error","contacts-functions.js");
             		   },
             		   scope: this
                };

                YAHOO.Convio.PC2.Component.GiftHistory.acknowledgeGiftButtonAction = function() {
             	   YAHOO.Convio.PC2.Teamraiser.acknowledgeGiftResult(YAHOO.Convio.PC2.Component.GiftHistory.acknowledgeGiftsCallback, acknowledgeContactId);
                };
                
                YAHOO.Convio.PC2.Component.GiftHistory.acknowledgeGiftEmailButtonAction = function() {
                  YAHOO.Convio.PC2.Views.contactIds = acknowledgeContactId;
                  YAHOO.Convio.PC2.Utils.loadView("email","compose");
                };

                YAHOO.Convio.PC2.Component.GiftHistory.acknowledgeGift = function(contactId, includeEmailOption) {
             	   acknowledgeContactId = contactId;
             	   if(includeEmailOption) {
             		   YAHOO.Convio.PC2.Component.GiftHistory.AcknowledgeGiftDialog.show();
             	   } else {
             		  YAHOO.Convio.PC2.Component.GiftHistory.AcknowledgeGiftNoEmailDialog.show();
             	   }
                };

                YAHOO.Convio.PC2.Component.GiftHistory.AcknowledgeGiftDialog =
					YAHOO.Convio.PC2.Component.SimpleDialogBuilder.buildConfirmDialog(
						"progress_acknowledge_contact_gift_dialog",
						[ /* dialog buttons */
                            {
                                text: YAHOO.util.Dom.get("msg_cat_dialog_cancel_label").innerHTML,
                                handler: function() {
                                    this.hide();
                                }
                            },
                           {
                                text: YAHOO.util.Dom.get("msg_cat_dialog_acknowledge_email_label").innerHTML,
                                handler: function() {
                                    this.hide();
                                    YAHOO.Convio.PC2.Component.GiftHistory.acknowledgeGiftEmailButtonAction();
                                },
                                isDefault:true
                            },
	             		    {
	             		    	text: YAHOO.util.Dom.get("msg_cat_dialog_acknowledge_label").innerHTML, 
	             		    	handler: function() {
	             		    		this.hide();
	             		    		YAHOO.Convio.PC2.Component.GiftHistory.acknowledgeGiftButtonAction();
	             		    	},
	             		    	isDefault:true 
	             		    }

	             		],
						{ /* no config overrides */
						    width: '32em'
						}
            	   );

                YAHOO.Convio.PC2.Component.GiftHistory.AcknowledgeGiftNoEmailDialog = 
					YAHOO.Convio.PC2.Component.SimpleDialogBuilder.buildConfirmDialog(
						"progress_acknowledge_contact_gift_no_email_dialog",
						[ /* dialog buttons */
                            {
                                text: YAHOO.util.Dom.get("msg_cat_dialog_cancel_label").innerHTML,
                                handler: function() {
                                    this.hide();
                                }
                            },
	              		    {
	              		    	text: YAHOO.util.Dom.get("msg_cat_dialog_acknowledge_label").innerHTML, 
	              		    	handler: function() {
	              		    		this.hide();
	              		    		YAHOO.Convio.PC2.Component.GiftHistory.acknowledgeGiftButtonAction();
	              		    	},
	              		    	isDefault:true 
	              		    }
			            ],
						{ /* no config overrides */
						     width: '32em'
						}
					);
                var MsgCatProvider = YAHOO.Convio.PC2.Component.Content;
                jQuery('#msg_cat_contacts_acknowledge_contact_gift_header2').html(MsgCatProvider.getMsgCatValue('contacts_acknowledge_contact_gift_header'));
                jQuery('#msg_cat_contacts_acknowledge_contact_gift_body2').html(MsgCatProvider.getMsgCatValue('contacts_acknowledge_contact_gift_body'));
                YAHOO.Convio.PC2.Component.GiftHistory.AcknowledgeGiftDialog.render(document.body);
                YAHOO.Convio.PC2.Component.GiftHistory.AcknowledgeGiftNoEmailDialog.render(document.body);
                YAHOO.util.Dom.removeClass("progress_acknowledge_contact_gift_dialog","hidden-form");
                YAHOO.util.Dom.removeClass("progress_acknowledge_contact_gift_no_email_dialog","hidden-form");
            } else if(YAHOO.Convio.PC2.Views.reportPersonalReset) {
                YAHOO.Convio.PC2.Views.reportPersonalReset = false;
                YAHOO.Convio.PC2.Teamraiser.getParticipantTopDonorsList(GetTopDonorsListCallback);
                YAHOO.Convio.PC2.Teamraiser.getPersonalDonationByDay(GetPersonalDonationByDayCallback);
                YAHOO.Convio.PC2.Component.GiftHistory.Paginator.reset();
                // Get the goal and reset it. This updates the progress thermometer.
                YAHOO.Convio.PC2.Component.Teamraiser.updateParticipantGoal(YAHOO.util.Dom.get("progress-goal-value").innerHTML);
                YAHOO.Convio.PC2.Teamraiser.getParticipantProgress(YAHOO.Convio.PC2.Component.Teamraiser.loadParticipantProgressCallback);
            }
            // Show the personal content - which is partially shared with the dashboard.
            hide_pc2_element(YAHOO.Convio.PC2.Views.current + "-content");
            hide_pc2_element(YAHOO.Convio.PC2.Views.current + "-sidebar");
            hide_pc2_element("newsfeed-container");
            show_pc2_element("dashboard-content");
            hide_pc2_element("dashboard-home-content");
            show_pc2_element("dashboard-report-content");
            hide_pc2_element("top-team-donors");
            show_pc2_element("top-donors");
        }
        else if(subview == "team") {
            if(!YAHOO.Convio.PC2.Views.reportTeam) {
                Y.use("pc2-team-report-functions",function(Y) {
                    loadOverrides("report", subview);

                    YAHOO.Convio.PC2.Utils.require("pc2:configurationLoaded", "pc2:registrationLoaded", function() {
                        //YAHOO.Convio.PC2.Views.reportPersonal = true;
                        YAHOO.Convio.PC2.Views.reportTeam = true;

                        YAHOO.lang.extend(YAHOO.Convio.PC2.Component.Teamraiser.EditTeamGoalDialog, YAHOO.Convio.PC2.Component.PC2Dialog);
                        TeamGoalEdit = new YAHOO.Convio.PC2.Component.Teamraiser.EditTeamGoalDialog("team-progress-goal-value", null);
                        if(YAHOO.Convio.PC2.Component.Teamraiser.isCanViewTeamRoster()) {
                            loadTeamRoster();
                        }

                        var config = YAHOO.Convio.PC2.Data.TeamraiserConfig

                        YAHOO.util.Event.addListener("msg_cat_team_report_change_goal_link", "click", showTeamGoalEdit);

                        if(config.acceptingDonations == 'true' 
                            && config.personalOfflineGiftsAllowed == 'true' 
                            && (config.offlineTeamGifts == 'MEMBERS' 
                                || config.offlineTeamGifts == 'CAPTAINS' 
                                && YAHOO.Convio.PC2.Data.Registration.aTeamCaptain == 'true')) 
                        {
                            YAHOO.util.Event.addListener("msg_cat_team_report_add_gift_button_label", "click", clickAddlGiftOptions);
                            show_pc2_element("add-team-quick-gift-block");
                        }

                        YAHOO.Convio.PC2.Component.TeamGiftHistory.loadDefaultTeamGiftHistory("team_donation_history");
                        YAHOO.Convio.PC2.Teamraiser.getTopTeamDonorsList(GetTopTeamDonorsListCallback);
                        YAHOO.Convio.PC2.Teamraiser.getTeamDonationByDay(GetTeamDonationByDayCallback);

                        var deleteTeamGiftButtonAction = function() {
                            YAHOO.Convio.PC2.Teamraiser.deleteGift(deleteTeamGiftCallback, deleteTeamGiftId, true);
                        };

                        YAHOO.Convio.PC2.Component.TeamGiftHistory.DeleteConfirmDialog = 
							YAHOO.Convio.PC2.Component.SimpleDialogBuilder.buildConfirmDialog(
								"confirm_team_delete_dialog",
								[ /* dialog buttons */
									 {
                                         text: YAHOO.util.Dom.get("msg_cat_dialog_cancel_label").innerHTML,
                                         handler: function() {
                                             this.hide();
                                         }
                                     },
	                                 { 
	                                     text: YAHOO.util.Dom.get("msg_cat_dialog_delete_label").innerHTML,
	                                     handler: function() {
	                                         this.hide();
	                                         deleteTeamGiftButtonAction();
	                                     },
	                                     isDefault:true 
	                                 }
	                            ],
								{ /* no config overrides */ }
                    	   );
                        
                        YAHOO.Convio.PC2.Component.TeamGiftHistory.DeleteConfirmDialog.render(document.body);
                        YAHOO.util.Dom.removeClass('confirm_team_delete_dialog', 'hidden-form');
                    });
                });
                YAHOO.Convio.PC2.Views.reportTeamReset = false;
            } else if(YAHOO.Convio.PC2.Views.reportTeamReset) {
                YAHOO.Convio.PC2.Views.reportTeamReset = false;
                YAHOO.Convio.PC2.Component.TeamGiftHistory.Paginator.reset();
                
                // I don't think these will work right due to caching.
                //YAHOO.Convio.PC2.Teamraiser.getTopTeamDonorsList(GetTopTeamDonorsListCallback);
                //YAHOO.Convio.PC2.Teamraiser.getTeamDonationByDay(GetTeamDonationByDayCallback);
                //updateTeamGoal(YAHOO.util.Dom.get("team-progress-goal-value").innerHTML);
                //YAHOO.Convio.PC2.Teamraiser.getParticipantProgress(YAHOO.Convio.PC2.Component.Teamraiser.loadTeamProgressCallback);
                
            }
            YAHOO.util.Dom.addClass(YAHOO.Convio.PC2.Views.current + "-content", "hidden-form");
            YAHOO.util.Dom.addClass(YAHOO.Convio.PC2.Views.current + "-sidebar", "hidden-form" );
            if(YAHOO.Convio.PC2.Views.current_subview == "personal") {
                YAHOO.util.Dom.addClass("dashboard-content", "hidden-form");
            }
            YAHOO.util.Dom.removeClass("report-content", "hidden-form");
            YAHOO.util.Dom.removeClass("report-team-content", "hidden-form");
            YAHOO.util.Dom.addClass("report-company-content", "hidden-form");
            YAHOO.util.Dom.addClass("top-donors","hidden-form");
            YAHOO.util.Dom.removeClass("top-team-donors","hidden-form");

            // are team donations enabled?
            YAHOO.Convio.PC2.Utils.require("pc2:configurationLoaded", "pc2:registrationLoaded", function() {
            	var config = YAHOO.Convio.PC2.Data.TeamraiserConfig;
            	if (config.teamGiftsAllowed === 'true') {
            		YAHOO.util.Dom.removeClass("bd-team-donation-history", "hidden-form");
            	}
            	else {
            		YAHOO.util.Dom.addClass("bd-team-donation-history", "hidden-form");
            	}
            });
            
        }
        else if(subview == "company") {
            if(!YAHOO.Convio.PC2.Views.reportCompany) {
                Y.use("yui2-charts",function(Y) {
                    
                    loadOverrides("report", subview);
                    
                    YAHOO.Convio.PC2.Utils.require("pc2:configurationLoaded", "pc2:registrationLoaded", function() {
                        YAHOO.Convio.PC2.Views.reportCompany = true;
                        YAHOO.Convio.PC2.Teamraiser.getCompanyDonationByDay(GetCompanyDonationByDayCallback);
                        YAHOO.Convio.PC2.Teamraiser.getCompanyTeams(GetCompanyTeamsCallback, true, true);
                    });
                });
            }
            YAHOO.util.Dom.addClass(YAHOO.Convio.PC2.Views.current + "-content", "hidden-form");
            YAHOO.util.Dom.addClass(YAHOO.Convio.PC2.Views.current + "-sidebar", "hidden-form" );
            if(YAHOO.Convio.PC2.Views.current_subview == "personal") {
                YAHOO.util.Dom.addClass("dashboard-content", "hidden-form");
            }
            YAHOO.util.Dom.removeClass("report-content", "hidden-form");
            YAHOO.util.Dom.addClass("report-team-content","hidden-form");
            YAHOO.util.Dom.removeClass("report-company-content", "hidden-form");
            YAHOO.util.Dom.addClass("top-donors","hidden-form");
            YAHOO.util.Dom.addClass("top-team-donors","hidden-form");
            
        }
        // Select the appropriate side nav link
        YAHOO.util.Dom.removeClass(subViewIds[YAHOO.Convio.PC2.Views.reportLast],"selected");
        YAHOO.util.Dom.addClass(subViewIds[subview],"selected");

        // Switch between headers
        YAHOO.util.Dom.addClass("msg_cat_overview_label","hidden-form");
        YAHOO.util.Dom.removeClass("msg_cat_personal_report_label","hidden-form");

        // Show the sidebar
        YAHOO.util.Dom.removeClass("report-sidebar", "hidden-form");
        YAHOO.Convio.PC2.Views.reportLast = subview;
    };

    YAHOO.Convio.PC2.Views.load["personalpage"] = function(subview) {
        var current = YAHOO.Convio.PC2.Views.current;

        // Hide whatever is current
        YAHOO.util.Dom.addClass(YAHOO.Convio.PC2.Views.current + "-content", "hidden-form");
        YAHOO.util.Dom.addClass(YAHOO.Convio.PC2.Views.current + "-sidebar", "hidden-form" );
        // Always hide dashboard.
        YAHOO.util.Dom.addClass("dashboard-content","hidden-form");

        // special handling for page reload scenario
        if (!YAHOO.Convio.PC2.Views.personalpageLast) {
        	YAHOO.Convio.PC2.Views.personalpageLast = "compose";
        }

        // Show email
        YAHOO.util.Dom.removeClass("personalpage-content","hidden-form");
        YAHOO.util.Dom.addClass("personalpage-" + YAHOO.Convio.PC2.Views.personalpageLast + "-content", "hidden-form");
        YAHOO.util.Dom.addClass("personalpage-" + YAHOO.Convio.PC2.Views.personalpageLast + "-sidebar", "hidden-form");
        YAHOO.util.Dom.removeClass("personalpage-" + subview + "-content", "hidden-form");
        YAHOO.util.Dom.removeClass("personalpage-sidebar","hidden-form");
        YAHOO.util.Dom.removeClass("personalpage-" + subview + "-sidebar","hidden-form");

        // Select right nav
        YAHOO.util.Dom.removeClass("personalpage-" + YAHOO.Convio.PC2.Views.personalpageLast + "-subnav","selected");
        YAHOO.util.Dom.addClass("personalpage-" + subview + "-subnav", "selected");

        // track the last rendered subview
        YAHOO.Convio.PC2.Views.personalpageLast = subview;

        Y.use("pc2-personalpage-compose-functions", function(Y) {
        	YAHOO.Convio.PC2.Utils.require("pc2:configurationLoaded", "pc2:registrationLoaded", function() {
                updatePrivacy(YAHOO.Convio.PC2.Component.Teamraiser.Registration.privatePage == 'true');
                reconfigureURLSettingsDialog();
        	});
        });

        // configure personal page content and component subview DOM elements if not already done
        if(!YAHOO.Convio.PC2.Views.personalPageCompose) {
            YAHOO.Convio.PC2.Views.personalPageCompose = true;
            Y.use("pc2-personalpage-compose-functions", function(Y) {
                loadOverrides("personalpage", subview);

                YAHOO.Convio.PC2.Utils.require("pc2:configurationLoaded", "pc2:registrationLoaded", function() {
                    YAHOO.Convio.PC2.Teamraiser.getShortcut(GetShortcutCallback);

                    var config = YAHOO.Convio.PC2.Data.TeamraiserConfig;
                    var statusAllowed = (config.personalPageStatusAllowed == "true");
                    var blogAllowed = (config.personalBlogAllowed == "true");
                    var teamInfo = YAHOO.Convio.PC2.Component.Teamraiser.Registration.teamInformation;
                    if(statusAllowed || blogAllowed) {
                        YAHOO.util.Dom.removeClass("personalpage-components-subnav","hidden-form");
                        var view=YAHOO.Convio.PC2.Utils.getUrlParam("view");
                    }
                    if(statusAllowed) {
                        YAHOO.util.Dom.removeClass("status-therm","hidden-form");
                        YAHOO.util.Dom.removeClass("honor-list","hidden-form");
                    }
                    if(blogAllowed) {
                        YAHOO.util.Dom.removeClass("blog-enabled-container","hidden-form");
                    }

                    YAHOO.Convio.PC2.Teamraiser.getPersonalPageInfoResult(GetPersonalPageInfoCallback);

                    YAHOO.util.Event.addListener("msg_cat_personal_page_shortcut_edit", "click", editSettings);
                    YAHOO.util.Event.addListener("save_shortcut", "click", saveSettings);
                    YAHOO.util.Event.addListener("shortcut_input", "keypress", handleKeyPressedPersonalShortcut);
                    YAHOO.util.Event.addListener("cancel_shortcut", "click", cancelSettings);

                    YAHOO.util.Event.addListener("pp_content_save_page_button", "click", UpdatePersonalPageInfo.execute);
                    YAHOO.util.Event.addListener("pp_components_save_page_button", "click", UpdatePersonalPageInfo.execute);
                    YAHOO.util.Event.addListener("msg_cat_personal_page_content_preview", "click", personalPagePreview);
                    YAHOO.util.Event.addListener("msg_cat_personal_page_components_preview", "click", personalPagePreview);
                });
            });
        }

        // configure personal page media subview DOM elements if not already done
        if(!YAHOO.Convio.PC2.Views.personalPageMedia) {
            YAHOO.Convio.PC2.Views.personalPageMedia = true;
            Y.use("pc2-personalpage-media-functions", function(Y) {

                loadOverrides("personalpage", subview);

                YAHOO.Convio.PC2.Utils.require("pc2:configurationLoaded", "pc2:registrationLoaded", function() {
                    YAHOO.util.Event.on('msg_cat_photo_upload_button_label', 'click', onUploadButtonClick);
                    YAHOO.util.Event.on('msg_cat_photo_upload_remove_label', 'click', onRemoveButtonClick);
                    YAHOO.util.Event.on('msg_cat_photo_upload2_button_label', 'click', onUploadButton2Click);
                    YAHOO.util.Event.on('msg_cat_photo_upload2_remove_label', 'click', onRemoveButton2Click);
                    YAHOO.util.Event.on('msg_cat_personal_video_url_save_button_label', 'click', onUpdatePersonalVideoUrlButtonClick);    
                    YAHOO.util.Event.on('preview_personal_video_url_button', 'click', onPreviewPersonalVideoUrlButtonClick);  
                    YAHOO.util.Event.on('use_media_type_photos_radio', 'click', onUseMediaTypePhotosButtonClick);  
                    YAHOO.util.Event.on('use_media_type_video_radio', 'click', onUseMediaTypeVideoButtonClick);      

                    YAHOO.Convio.PC2.Teamraiser.getPersonalPhotos(GetPersonalPhotosCallback);
                    YAHOO.Convio.PC2.Teamraiser.getPersonalVideoUrl(GetPersonalVideoUrlCallback);    
                    YAHOO.Convio.PC2.Teamraiser.getPersonalMediaLayout(GetPersonalMediaLayoutCallback); 
                });
            });
        }

        // do these steps every time a subview is loaded, not just the first time
        if(subview == "compose") {
        	Y.use("pc2-personalpage-compose-functions", function(Y) {
        		clearPersonalPageMessages();
        	 });	
        } else if(subview == "components") {
        	Y.use("pc2-personalpage-compose-functions", function(Y) {
        		clearPersonalPageMessages();
        	 });
        } else if(subview == "media") {
        	Y.use("pc2-personalpage-media-functions", function(Y) {
            	clearPhotoMessages();
        	});
        }
    };

    YAHOO.Convio.PC2.Views.load["teampage"] = function(subview) 
		{
				var current = YAHOO.Convio.PC2.Views.current;

				// Hide whatever is current
				YAHOO.util.Dom.addClass(YAHOO.Convio.PC2.Views.current + "-content", "hidden-form");
				YAHOO.util.Dom.addClass(YAHOO.Convio.PC2.Views.current + "-sidebar", "hidden-form" );
				// Always hide dashboard.
				YAHOO.util.Dom.addClass("dashboard-content","hidden-form");

        YAHOO.Convio.PC2.Utils.require("pc2:configurationLoaded", "pc2:registrationLoaded", function() 
				{
						if (YAHOO.Convio.PC2.Component.Teamraiser.Registration.aTeamCaptain == "false")
						{
								YAHOO.Convio.PC2.Utils.loadView('dashboard','home');
								return;
						}
						// Show email
						YAHOO.util.Dom.removeClass("teampage-content","hidden-form");
						YAHOO.util.Dom.addClass("teampage-" + YAHOO.Convio.PC2.Views.teampageLast + "-content", "hidden-form");
						YAHOO.util.Dom.addClass("teampage-" + YAHOO.Convio.PC2.Views.teampageLast + "-sidebar", "hidden-form");
						YAHOO.util.Dom.removeClass("teampage-" + subview + "-content", "hidden-form");
						YAHOO.util.Dom.removeClass("teampage-sidebar","hidden-form");
						YAHOO.util.Dom.removeClass("teampage-" + subview + "-sidebar","hidden-form");
        
						// Select right nav
						YAHOO.util.Dom.removeClass("teampage-" + YAHOO.Convio.PC2.Views.teampageLast + "-subnav","selected");
						//YAHOO.util.Dom.removeClass("email-" + YAHOO.Convio.PC2.Views.current_subview + "-nav", "selected");
						YAHOO.util.Dom.addClass("teampage-" + subview + "-subnav", "selected");

						YAHOO.Convio.PC2.Views.teampageLast = subview;
						if(YAHOO.Convio.PC2.Views.teamPageCompose) {
								clearTeamPageMessages();
						}

						if(subview == "compose") 
						{
								if(YAHOO.Convio.PC2.Views.teamPageCompose) 
								{
            				// if we switch back to this view, reset the update team element
										teamUpdateCancel();
								} 
								else 
								{
										YAHOO.Convio.PC2.Views.teamPageCompose = true;
										Y.use("pc2-teampage-compose-functions", function(Y) 
										{
												loadOverrides("teampage", subview);

												YAHOO.Convio.PC2.Teamraiser.getTeamPageInfoResult(GetTeamPageInfoCallback);

                        var config = YAHOO.Convio.PC2.Data.TeamraiserConfig;
                        if(config.companyAssociationAllowed == "true") 
												{
                            YAHOO.util.Dom.removeClass("company-info-block", "hidden-form");
                            YAHOO.util.Dom.removeClass("company-assignment-section", "hidden-form");
                            YAHOO.Convio.PC2.Teamraiser.getCompanyList(GetCompanyListCallback);
                        }
                        if(config.companyNewEntryAllowed == "true") 
												{
                            YAHOO.util.Dom.removeClass("company-entry-section", "hidden-form");
                        }
                        if(config.teamPasswordAllowed == "true") 
												{
                            YAHOO.util.Dom.removeClass("team-password-block", "hidden-form");
                            YAHOO.util.Dom.removeClass("team-password-edit-block", "hidden-form");
                        }
                        if(config.teamDivisionsEnabled == "true") {
							var multiLocalEnabled = YAHOO.Convio.PC2.Component.Content.isMultiLocale();
                            if (!multiLocalEnabled){
                                YAHOO.Convio.PC2.Teamraiser.getTeamDivisions(GetTeamDivisionsCallback);
                            }
                            else {
                                YAHOO.Convio.PC2.Teamraiser.getTeamDivisionsMultiLocale(GetTeamDivisionsMultiLocaleCallback);
                            }

                            YAHOO.util.Dom.removeClass("team-division-block", "hidden-form");
                            YAHOO.util.Dom.removeClass("team-division-edit-block", "hidden-form");
                        }
                        if(config.recruitingGoalsEnabled == "true") 
												{
                            YAHOO.util.Dom.removeClass("recruiting-block", "hidden-form");
                            YAHOO.util.Dom.removeClass("recruiting-edit-block", "hidden-form");
                        }

                        var teamInfo = YAHOO.Convio.PC2.Component.Teamraiser.Registration.teamInformation;
                        if(YAHOO.Convio.PC2.Utils.hasValue(teamInfo)) 
												{
                            if(YAHOO.Convio.PC2.Utils.hasValue(teamInfo.recruitingGoal)) 
														{
                                origRecruitingGoal = teamInfo.recruitingGoal;
                                YAHOO.util.Dom.get('recruiting-goal').innerHTML = teamInfo.recruitingGoal;
                                YAHOO.util.Dom.get('new-recruiting-goal').value = teamInfo.recruitingGoal;
                            }
                            if(YAHOO.Convio.PC2.Utils.hasValue(teamInfo.divisionName)) 
														{
                                origTeamDivision = teamInfo.divisionName;
                                YAHOO.util.Dom.get('team-division').innerHTML = teamInfo.divisionName;
                            }
                            if(YAHOO.Convio.PC2.Utils.hasValue(teamInfo.password)) 
														{
                                if(YAHOO.lang.isString(teamInfo.password)) 
																{
                                    origTeamPassword = teamInfo.password;
                                } 
																else 
																{
                                    origTeamPassword = "";
                                }
                                YAHOO.util.Dom.get('team-password').innerHTML = origTeamPassword;
                                YAHOO.util.Dom.get('new-team-password').value = origTeamPassword;
                            }
                        }

                        YAHOO.Convio.PC2.Teamraiser.getTeamShortcut(GetTeamShortcutCallback);
                        YAHOO.Convio.PC2.Teamraiser.getTeamPhoto(GetTeamPhotoCallback);

                        YAHOO.util.Event.addListener("teampage_edit_shortcut", "click", editTeamShortcut);
                        YAHOO.util.Event.addListener("teampage_save_shortcut", "click", saveTeamShortcut);
                        YAHOO.util.Event.addListener("teampage_shortcut_input", "keypress", hendleKeyPressedTeamShortcut);
                        YAHOO.util.Event.addListener("teampage_cancel_shortcut", "click", cancelTeamShortcut);
                        YAHOO.util.Event.on('msg_cat_team_photo_upload_button_label', 'click', onTeamUploadButtonClick);
                        YAHOO.util.Event.on('msg_cat_team_photo_upload_remove_label', 'click', onTeamRemoveButtonClick);
                        YAHOO.util.Event.addListener('msg_cat_team_page_team_edit_label', 'click', teamEditClick);
                        YAHOO.util.Event.addListener('msg_cat_team_update_submit_label', 'click', teamUpdateSubmit);
                        YAHOO.util.Event.addListener("new-team-name", "keypress", handleKeyPressedTeamOptionsUpdate);
                        YAHOO.util.Event.addListener("new-company-name", "keypress", handleKeyPressedTeamOptionsUpdate);
                        YAHOO.util.Event.addListener("new-team-password", "keypress", handleKeyPressedTeamOptionsUpdate);
                        YAHOO.util.Event.addListener("new-recruiting-goal", "keypress", handleKeyPressedTeamOptionsUpdate);
                        YAHOO.util.Event.addListener('msg_cat_team_update_cancel_label', 'click', teamUpdateCancel);
                        YAHOO.util.Event.addListener("teampage_save_page_button", "click", UpdateTeamPageInfo.execute);
                        YAHOO.util.Event.addListener("msg_cat_team_page_preview", "click", teamPagePreview);
                        YAHOO.util.Event.addListener('company-select-list', 'change', teamPageResetCompanyInfo)
                    });
                }
            }
        });  
    };

    YAHOO.Convio.PC2.Views.load["companypage"] = function(subview) {
        var current = YAHOO.Convio.PC2.Views.current;

        // Hide whatever is current
        YAHOO.util.Dom.addClass(YAHOO.Convio.PC2.Views.current + "-content", "hidden-form");
        YAHOO.util.Dom.addClass(YAHOO.Convio.PC2.Views.current + "-sidebar", "hidden-form" );
        // Always hide dashboard.
        YAHOO.util.Dom.addClass("dashboard-content","hidden-form");
        // Show email
        YAHOO.util.Dom.removeClass("companypage-content","hidden-form");
        YAHOO.util.Dom.addClass("companypage-" + YAHOO.Convio.PC2.Views.companypageLast + "-content", "hidden-form");
        YAHOO.util.Dom.addClass("companypage-" + YAHOO.Convio.PC2.Views.companypageLast + "-sidebar", "hidden-form");
        YAHOO.util.Dom.removeClass("companypage-" + subview + "-content", "hidden-form");
        YAHOO.util.Dom.removeClass("companypage-sidebar","hidden-form");
        YAHOO.util.Dom.removeClass("companypage-" + subview + "-sidebar","hidden-form");

        // Select right nav
        YAHOO.util.Dom.removeClass("companypage-" + YAHOO.Convio.PC2.Views.companypageLast + "-subnav","selected");
        YAHOO.util.Dom.addClass("companypage-" + subview + "-subnav", "selected");

        YAHOO.Convio.PC2.Views.companypageLast = subview;

        if(YAHOO.Convio.PC2.Views.companyPageCompose) {
            clearCompanyMessages();
        }

        if(subview == "compose" || subview == "components") {
            if(!YAHOO.Convio.PC2.Views.companyPageCompose) {
                YAHOO.Convio.PC2.Views.companyPageCompose = true;
                Y.use("pc2-companypage-compose-functions", function(Y) {
                    loadOverrides("companypage", subview);

                    YAHOO.Convio.PC2.Utils.require("pc2:configurationLoaded", "pc2:registrationLoaded", function() {
                        // If we're not supposed to show this page, don't.
                        if(false == YAHOO.Convio.PC2.Data.TeamraiserConfig.showCompanyPage) {
                            YAHOO.Convio.PC2.Utils.loadView("dashboard", "home");
                        }
                        var statusAllowed = (YAHOO.Convio.PC2.Data.TeamraiserConfig.personalPageStatusAllowed == "true");
                        if(statusAllowed) {
                            YAHOO.util.Dom.removeClass("companypage-components-subnav","hidden-form");
                        }

                        YAHOO.Convio.PC2.Teamraiser.getCompanyPageInfoResult(GetCompanyPageInfoCallback);

                        YAHOO.Convio.PC2.Teamraiser.getCompanyShortcut(GetCompanyShortcutCallback);
                        YAHOO.Convio.PC2.Teamraiser.getCompanyPhoto(GetCompanyPhotoCallback);

                        YAHOO.util.Event.addListener("companypage_edit_shortcut", "click", editCompanyShortcut);
                        YAHOO.util.Event.addListener("msg_cat_company_page_shortcut_save", "click", saveCompanyShortcut);
                        YAHOO.util.Event.addListener("companypage_shortcut_input", "keypress", handleKeyPressedCompanyShortcut);
                        YAHOO.util.Event.addListener("msg_cat_company_page_shortcut_cancel", "click", cancelCompanyShortcut);
                        YAHOO.util.Event.on('companypage-graphic-upload-button', 'click', onCompanyUploadButtonClick);
                        YAHOO.util.Event.on('companypage-graphic-upload-remove-link', 'click', onCompanyRemoveButtonClick);

                        YAHOO.util.Event.addListener("companypage_save_page_button", "click", UpdateCompanyPageInfo.execute);
                        YAHOO.util.Event.addListener("msg_cat_company_page_preview", "click", companyPagePreview);

                        YAHOO.util.Event.addListener("companypage_components_save_page_button", "click", UpdateCompanyPageInfo.execute);
                        YAHOO.util.Event.addListener("msg_cat_company_page_components_preview", "click", companyPagePreview);
                    });
                });
            }
        }
    };

    YAHOO.Convio.PC2.Views.load["gift"] = function(subview) {
        //updatePageStatus("");
        var current = YAHOO.Convio.PC2.Views.current;
        // Hide whatever is current
        YAHOO.util.Dom.addClass(YAHOO.Convio.PC2.Views.current + "-content", "hidden-form");
        YAHOO.util.Dom.addClass(YAHOO.Convio.PC2.Views.current + "-sidebar", "hidden-form" );
        // Always hide dashboard.
        YAHOO.util.Dom.addClass("dashboard-content","hidden-form");
        // Show email
        YAHOO.util.Dom.removeClass("gift-content","hidden-form");
        YAHOO.util.Dom.addClass("gift-" + YAHOO.Convio.PC2.Views.giftLast + "-content", "hidden-form");
        YAHOO.util.Dom.addClass("gift-" + YAHOO.Convio.PC2.Views.giftLast + "-sidebar", "hidden-form");

        // For UK sites, dislpay relevant address fields
        if (YAHOO.Convio.PC2.Config.isUKLocale()) {
        	show_pc2_element("addl_gift_options_street3_section");
        	show_pc2_element("addl_gift_options_county_section");
        	show_pc2_element("addl_gift_options_country_section");
        	show_pc2_element("addl_gift_options_postcode_section");
        	hide_pc2_element("addl_gift_options_state_section");
        	hide_pc2_element("addl_gift_options_zip_section");
        }

        // If Gift Aid EDP is set, display Gift Aid section
        YAHOO.Convio.PC2.Teamraiser.getEventDataParameter(getGiftAidEnabledEDPCallback, "F2F_OFFLINE_GIFT_GIFT_AID", 'boolean');

        YAHOO.util.Dom.removeClass("gift-add-content", "hidden-form");
        YAHOO.util.Dom.removeClass("gift-sidebar","hidden-form");
        YAHOO.util.Dom.removeClass("gift-" + subview + "-sidebar","hidden-form");

        // Select right nav
        YAHOO.util.Dom.removeClass("gift-" + YAHOO.Convio.PC2.Views.giftLast + "-subnav","selected");
        YAHOO.util.Dom.addClass("gift-" + subview + "-subnav", "selected");

        YAHOO.Convio.PC2.Views.giftLast = subview;

        if(YAHOO.Convio.PC2.Views.giftAdd) {
            clearGiftMessages();
        }

        if(subview == "add" || subview == "team") {
            if(!YAHOO.Convio.PC2.Views.giftAdd) {
                YAHOO.Convio.PC2.Views.giftAdd = true;
                Y.use("pc2-gift-add-functions", function(Y) {

                    loadOverrides("gift", subview);

                    YAHOO.Convio.PC2.Utils.require("pc2:configurationLoaded", "pc2:registrationLoaded", function() {
                        var teamraiserConfig = YAHOO.Convio.PC2.Data.TeamraiserConfig;
                        if(teamraiserConfig.acceptingDonations == "true" 
                           &&  teamraiserConfig.personalOfflineGiftsAllowed == "true") {
                            show_pc2_element("add-quick-gift-block");
                        }

                        var giftTypes = teamraiserConfig.offlineGiftTypes;
                        if(giftTypes.cash == "true") {
                            show_pc2_element("gift_payment_type_cash_block");
                        }
                        if(giftTypes.check == "true") {
                            show_pc2_element("gift_payment_type_check_block");
                        }
                        if(giftTypes.credit == "true") {
                            show_pc2_element("gift_payment_type_credit_block");
                        }
                        if(giftTypes.later == "true") {
                            show_pc2_element("gift_payment_type_later_block");
                        }
                        if(teamraiserConfig.showGiftCategories == "true") {
                            YAHOO.Convio.PC2.Teamraiser.getGiftCategories(GetGiftCategoriesCallback);
                        }

                        // set click handler to mark which "flavor" of gift form submission has been requested
                        YAHOO.util.Event.addListener("quick-gift-submit", "click", setSubmitSingleGift );
                        YAHOO.util.Event.addListener("gift-add-another", "click", setSubmitMultipleGifts );

                        // define form validator for the "enter gift" form
                        Y.use('jquery-validate', function() {
	                        jQuery("#gift-add-content-form").validate(
	                 		   {
	                 			  // turn off eager validation ... it doesn't play well with multiple ajax submissions 
	                 			  onfocusout: false,
	                 			  onkeyup: false,

	                 			   // the submitQuickGift function defined in gift-add-functions.js is 
	                 			   // responsible for sending ajax rest request ... call that function when
	                 			   // the form is submitted _and_ contains valid data
	                 			   submitHandler: function() 
	             			   		{
	                 			   		if (isSubmitMultipleGifts()) {
	                 			   			submitAnotherGift();
	                 			   		}
	                 			   		else {
	                 			   			submitQuickGift();
	                 			   		}
	                 			   		// prevent 'normal' form submission to form's action
	             			   			return false;
	             		   			}, // end submit handler

	             		   			// some form elements have complex validation rules
	             		   			rules: {
		             		   			check_number: {
		         		   					required:  isGiftPaymentTypeCheck
		         		   				},
	             		   				credit_card_number: {
	             		   					required:  isGiftPaymentTypeCredit
	             		   				}, 
	             		   				credit_verification_code: {
	             		   					required:  isGiftPaymentTypeCredit
	             		   				},
	             		   				credit_expiration_month: {
	             		   					required:  isGiftPaymentTypeCredit
	             		   				},
	             		   				credit_expiration_year: {
	             		   					required:  isGiftPaymentTypeCredit
	             		   				},
	             		   				billing_first_name: {
	             		   					required:  isGiftPaymentTypeCredit
	             		   				},
	             		   				billing_last_name: {
	             		   					required:  isGiftPaymentTypeCredit
	             		   				},
	             		   				billing_street1: {
	             		   					required:  isGiftPaymentTypeCredit
	             		   				},
	             		   				billing_city: {
	             		   					required:  isGiftPaymentTypeCredit
	             		   				},
	             		   				billing_state: {
	             		   					required:  isGiftPaymentTypeCredit
	             		   				},
	             		   				billing_zip: {
	             		   					required:  isGiftPaymentTypeCredit
	             		   				}
	             		   			} // end rules collection
	             		   			
	                 		   } // end validation options
	                     	);
                    	});

                        YAHOO.util.Event.addListener("addl-gift-enable",  "click", enableAddlGiftOptions);
                        YAHOO.util.Event.addListener("addl-gift-disable",  "click", disableAddlGiftOptions);
                        YAHOO.util.Event.addListener("quick-gift-cancel", "click", disableQuickGift);
                        YAHOO.util.Event.addListener("gift_payment_type_cash", "click", disableAddlPaymentFields);
                        YAHOO.util.Event.addListener("gift_payment_type_check", "click", enableCheckFields);
                        YAHOO.util.Event.addListener("gift_payment_type_credit", "click", enableCreditFields);
                        YAHOO.util.Event.addListener("gift_payment_type_later", "click", disableAddlPaymentFields);

                        // set up gift year
                        var intYear = new Date().getFullYear();
                        var expirationDateItem = YAHOO.util.Dom.get("credit_expiration_year");
                        for(var i=0; i<11; i++) {
                            var year = intYear++;
                            expirationDateItem.options[i] = new Option(year, year);
                        }
                    });
                });
            } else {
                clearGiftFields();
            }

            if(subview == "team") {
                show_pc2_element("team-gift-header-section");
                hide_pc2_element("personal-gift-header-section");
                show_pc2_element("msg_cat_team_gift_label");
                hide_pc2_element("msg_cat_gift_label");
                isTeamGift = true;
            } else {
                show_pc2_element("personal-gift-header-section");
                hide_pc2_element("team-gift-header-section");
                show_pc2_element("msg_cat_gift_label");
                hide_pc2_element("msg_cat_team_gift_label");
                isTeamGift = false;
            }
        }
    };

    YAHOO.Convio.PC2.Views.load["teammates"] = function(subview) {
        var current = YAHOO.Convio.PC2.Views.current;

        // Hide whatever is current
        YAHOO.util.Dom.addClass(YAHOO.Convio.PC2.Views.current + "-content", "hidden-form");
        YAHOO.util.Dom.addClass(YAHOO.Convio.PC2.Views.current + "-sidebar", "hidden-form" );
        // Always hide dashboard.
        YAHOO.util.Dom.addClass("dashboard-content","hidden-form");

        YAHOO.util.Dom.removeClass("teammates-content","hidden-form");
        YAHOO.util.Dom.removeClass("teammates-" + subview + "-content", "hidden-form");
        YAHOO.util.Dom.removeClass("teammates-sidebar","hidden-form");
        YAHOO.util.Dom.removeClass("teammates-" + subview + "-sidebar","hidden-form");

        if(subview == "view" || subview == "manage") {
            if(!YAHOO.Convio.PC2.Views.teammatesLoaded) {
                YAHOO.Convio.PC2.Views.teammatesLoaded = true;
                Y.use("pc2-teammates-functions", function(Y) {
                    loadOverrides("teammates", subview);

                    YAHOO.Convio.PC2.Utils.require("pc2:configurationLoaded", "pc2:registrationLoaded", function() {
                        YAHOO.Convio.PC2.Data.TeamCaptain = (YAHOO.Convio.PC2.Component.Teamraiser.Registration.aTeamCaptain == "true");

                        YAHOO.util.Event.addListener("msg_cat_captains_save_button", "click", saveCaptains);

                        loadTeam();
                    });
                });
            } else {
                if(subview == "manage") {
                    switchToManage();
                } else {
                    switchToView();
                }
            }

            // use same related actions for all sub views
            Y.use("pc2-teammates-functions", function(Y) {
	            YAHOO.Convio.PC2.Utils.require("pc2:configurationLoaded", "pc2:registrationLoaded", function() {
	            	var config = YAHOO.Convio.PC2.Data.TeamraiserConfig;
	                if(YAHOO.Convio.PC2.Component.Teamraiser.Registration.teamId > 0 && (config.teamRosterConfig == "MEMBERS" ||
	                        (config.teamRosterConfig == "CAPTAINS" && YAHOO.Convio.PC2.Component.Teamraiser.Registration.aTeamCaptain == "true"))) 
	                {
	                	// reveal related action container
	                	YAHOO.util.Dom.removeClass("teammates-sidebar-related-actions", "hidden-form");

	                	if (config.teamGiftsAllowed  == 'true') {
	                		// reveal download team donations link
	                		YAHOO.util.Dom.removeClass("msg_cat_teammates_download_donations", "hidden-form");
	                	}

	                	loadTeamRosterRelatedLinks();
	                }
	            });
            });
        }
    };

    YAHOO.Convio.PC2.Views.load["membership"] = function(subview) {
        var current = YAHOO.Convio.PC2.Views.current;

        // Hide whatever is current
        YAHOO.util.Dom.addClass(YAHOO.Convio.PC2.Views.current + "-content", "hidden-form");
        YAHOO.util.Dom.addClass(YAHOO.Convio.PC2.Views.current + "-sidebar", "hidden-form" );
        // Always hide dashboard.
        YAHOO.util.Dom.addClass("dashboard-content","hidden-form");
        // Show the manage team membership content
        YAHOO.util.Dom.removeClass("membership-content","hidden-form");
        YAHOO.util.Dom.removeClass("membership-" + subview + "-content", "hidden-form");
        YAHOO.util.Dom.removeClass("membership-sidebar","hidden-form");
        YAHOO.util.Dom.removeClass("membership-" + subview + "-sidebar","hidden-form");

        if (subview == "manage" || subview == "join" || subview == "leave") {
            if (!YAHOO.Convio.PC2.Views.membershipLoaded) {
                // This is called the first time the user navigates to Manage Team Membership
                YAHOO.Convio.PC2.Views.membershipLoaded = true;

                Y.use("pc2-manage-membership-functions", function(Y) {
                    YAHOO.Convio.PC2.Utils.require("pc2:configurationLoaded", "pc2:registrationLoaded", function() {
                        // Prevent users from changing team membership outside of registration
                        if (YAHOO.Convio.PC2.Data.TeamraiserConfig.acceptingRegistrations !== "true") {
                            YAHOO.Convio.PC2.Utils.loadView('dashboard','home');
                        }

                        // If the event does not have companies, disable company search and company label in search results
                        if (YAHOO.Convio.PC2.Data.TeamraiserConfig.companyAssociationAllowed !== "true") {
                            jQuery("#team-company").parent().hide();
                            jQuery(".company").hide();
                            jQuery(".team-company-container").hide();
                        }

                        // If the event does not allow passwords, hide the password input when joining a team
                        if (YAHOO.Convio.PC2.Data.TeamraiserConfig.teamPasswordAllowed !== "true") {
                            jQuery("#join-team-password-input").hide();
                        }

                        // Prevent Team Captains from changing team membership
                        if (YAHOO.Convio.PC2.Component.Teamraiser.Registration.teamId > 0 
                            && YAHOO.Convio.PC2.Component.Teamraiser.Registration.aTeamCaptain == "true") {
                            /* Team captains cannot self-manage their team membership in PC2. The link to do so is hidden, so 
                               i) we made a mistake 
                               ii) the user navigated here directly (entered the URL) or 
                               iii) the user manipulated the DOM and unhid elements */
                            // If a team captain tries to load the Manage Team Membership page, redirect them to their team page instead
                            YAHOO.Convio.PC2.Utils.loadView('teampage','compose');
                        }

                        YAHOO.util.Event.addListener("search-team", "click", clickSearchTeam);
                        YAHOO.util.Event.addListener("leave-team", "click", clickLeaveTeam);
                        YAHOO.util.Event.addListener("confirm-join-team", "click", clickConfirmJoinTeam);
                        YAHOO.util.Event.addListener("confirm-leave-team", "click", clickConfirmLeaveTeam);
                        YAHOO.util.Event.addListener("join-team-radio-container", "click", clickJoinTeamRadio);
                        YAHOO.util.Event.addListener("leave-team-radio-container", "click", clickLeaveTeamRadio);
                        YAHOO.util.Event.addListener("team-name", "keypress", handleKeyPressedSearchTeamName);
                        YAHOO.util.Event.addListener("team-captain-first", "keypress", handleKeyPressedSearchTeamCaptainFirst);
                        YAHOO.util.Event.addListener("team-captain-last", "keypress", handleKeyPressedSearchTeamCaptainLast);
                        YAHOO.util.Event.addListener("team-company", "keypress", handleKeyPressedSearchTeamCompany);
                        YAHOO.util.Event.addListener("join-team-password-input", "keypress", handleKeyPressedJoinTeamPassword);

                        switchToManageTeamMembership();
                    });
                });
            } else {
                // This is called after the first time the user navigates to Manage Team Membership
                if (subview == "manage") {
                    switchToManageTeamMembership();
                } else if (subview == "join") {
                    switchToJoinTeam();
                } else {
                    switchToLeaveTeam();
                }
            }

        }
    };

    YAHOO.Convio.PC2.Views.load["survey"] = function(subview) {
        var current = YAHOO.Convio.PC2.Views.current;

        // Hide whatever is current
        YAHOO.util.Dom.addClass(YAHOO.Convio.PC2.Views.current + "-content", "hidden-form");
        YAHOO.util.Dom.addClass(YAHOO.Convio.PC2.Views.current + "-sidebar", "hidden-form" );
        // Always hide dashboard.
        YAHOO.util.Dom.addClass("dashboard-content","hidden-form");

        YAHOO.util.Dom.removeClass("survey-content","hidden-form");
        YAHOO.util.Dom.removeClass("survey-" + subview + "-content", "hidden-form");
        YAHOO.util.Dom.removeClass("survey-sidebar","hidden-form");
        YAHOO.util.Dom.removeClass("survey-" + subview + "-sidebar","hidden-form");

        if(subview == "edit") {
            if(!YAHOO.Convio.PC2.Views.surveyLoaded) {
                YAHOO.Convio.PC2.Views.surveyLoaded = true;
                Y.use("pc2-survey-functions", function(Y) {
                    loadOverrides("survey", subview);
                    
                    YAHOO.Convio.PC2.Utils.require("pc2:configurationLoaded", "pc2:registrationLoaded", function() {
                        YAHOO.Convio.PC2.Teamraiser.getSurveyResponses(surveyRespCallback);
                        
                        YAHOO.util.Event.addListener("save_survey_button", "click", function() {
                            
                            YAHOO.util.Dom.addClass("survey-save-success","hidden-form");
                            YAHOO.util.Dom.addClass("survey-save-failure","hidden-form");
                                
                            var questions = YAHOO.Convio.PC2.Data.SurveyResponses;
                            var responses = [];
                            var questionsList = [];
                            for(var i=0; i < questions.length; i++) {
                                var resp = loadResponse(responses, questionsList, questions[i]);
                            }
                            var valid = true;
                            hide_pc2_element("survey-date-save-failure");
                            for(var i = 0; i < questions.length; i++) {
                            	valid = validateSurveyResponse(questions[i]);
                            	if(!valid) {
                            		var label = YAHOO.util.Dom.get("label_" + questions[i].questionId);
                                	if(label) {
                                		YAHOO.util.Dom.addClass(label.parentNode, "failure-message");
                                	}
                                    YAHOO.util.Dom.addClass("hint_" + questions[i].questionId, "failure-message");
                                    show_pc2_element("survey-date-save-failure");
                                    break;
                            	}
                            }
                            if(valid) {
                                 YAHOO.Convio.PC2.Teamraiser.updateSurveyResponses(updateSurveyCallback, responses);
                            }
                        });

                        YAHOO.util.Event.addListener("cancel_survey_button", "click", function() {
                            YAHOO.Convio.PC2.Utils.loadView("dashboard", "home");
                        });
                    });
                });
            } else {
                clearSurveyMessages();
            }
        }
    };

    YAHOO.Convio.PC2.Views.load["tenting"] = function(subview) {
        var current = YAHOO.Convio.PC2.Views.current;

        // Hide whatever is current
        YAHOO.util.Dom.addClass(YAHOO.Convio.PC2.Views.current + "-content", "hidden-form");
        YAHOO.util.Dom.addClass(YAHOO.Convio.PC2.Views.current + "-sidebar", "hidden-form" );
        // Always hide dashboard.
        YAHOO.util.Dom.addClass("dashboard-content","hidden-form");

        YAHOO.util.Dom.removeClass("tenting-content","hidden-form");
        YAHOO.util.Dom.removeClass("tenting-" + subview + "-content", "hidden-form");
        YAHOO.util.Dom.removeClass("tenting-sidebar","hidden-form");
        YAHOO.util.Dom.removeClass("tenting-" + subview + "-sidebar","hidden-form");

        if(subview == "main") {
            if(!YAHOO.Convio.PC2.Views.tentingLoaded) {
                YAHOO.Convio.PC2.Views.tentingLoaded = true;
                Y.use("pc2-tenting-functions", function(Y) {
                    
                    loadOverrides("tenting", subview);
                    
                    YAHOO.Convio.PC2.Utils.require("pc2:configurationLoaded", "pc2:registrationLoaded", function() {
                        if(YAHOO.Convio.PC2.Data.Registration.tentingAllowed == "true") {
                            YAHOO.util.Dom.removeClass("tenting-main-content","hidden-form");
                            var tentingStatusEl = YAHOO.util.Dom.get("tenting_your_status");
                            
                            var status = YAHOO.Convio.PC2.Data.Registration.tentmateStatus;
                            updateTentingStatus(status);
                            
                            // show various elements of the page
                            if(status == "1") {
                                YAHOO.util.Dom.removeClass("tenting-search","hidden-form");
                            }
                            if(status > 3) {
                                if(YAHOO.Convio.PC2.Data.Registration.tentmateConsId > 0) {
                                    loadTentmate();
                                }
                            }

                            YAHOO.util.Event.addListener("msg_cat_tenting_decline_button_label", "click", declineTent);
                            YAHOO.util.Event.addListener("msg_cat_tenting_random_button_label", "click", randomTent);
                            YAHOO.util.Event.addListener("msg_cat_tenting_reset_button_label", "click", resetTent);

                            YAHOO.util.Event.addListener("msg_cat_tenting_send_button_label", "click", sendTentInvite);
                            YAHOO.util.Event.addListener("msg_cat_tenting_cancel_button_label", "click", cancelTentInvite);
                            YAHOO.util.Event.addListener("msg_cat_tenting_decline_invite_button_label", "click", declineTentInvite);
                            YAHOO.util.Event.addListener("msg_cat_tenting_share_button_label", "click", acceptTentInvite);

                            YAHOO.util.Event.addListener("msg_cat_tenting_search_button", "click", YAHOO.Convio.PC2.Component.TentingSearch.updateSearch);
                        }
                    });
                });
            } else {
            }
        }
    };

    YAHOO.Convio.PC2.Views.load["addressbookimport"] = function(subview) {
    	var current = YAHOO.Convio.PC2.Views.current;

    	YAHOO.util.Event.addListener("addressbookimport-selectsource-next", "click", YAHOO.Convio.PC2.Component.Teamraiser.showAddressImportWizardRetrieveContacts);
        YAHOO.util.Event.addListener("addressbookimport-thirdpartystatus-next", "click", YAHOO.Convio.PC2.Component.Teamraiser.showAddressImportWizardSelectContacts);
        YAHOO.util.Event.addListener("addressbookimport-csvmapping-next", "click", YAHOO.Convio.PC2.Component.Teamraiser.showAddressImportWizardSelectContacts);
        YAHOO.util.Event.addListener("addressbookimport-selectcontacts-next", "click", YAHOO.Convio.PC2.Component.Teamraiser.showAddressImportViewResults);

        // Hide whatever is current
        YAHOO.util.Dom.addClass(YAHOO.Convio.PC2.Views.current + "-content", "hidden-form");
        YAHOO.util.Dom.addClass(YAHOO.Convio.PC2.Views.current + "-sidebar", "hidden-form" );

        // Always hide dashboard.
        YAHOO.util.Dom.addClass("dashboard-content","hidden-form");

        // hide subview content from previous interaction
        YAHOO.util.Dom.addClass("addressbookimport-" + YAHOO.Convio.PC2.Views.addressBookImportLast + "-content", "hidden-form");
        YAHOO.util.Dom.addClass("addressbookimport-" + YAHOO.Convio.PC2.Views.addressBookImportLast + "-sidebar", "hidden-form");

        // let this content squat under the email tab
        YAHOO.util.Dom.addClass('email-nav-link', 'selected');

        // reveal top-level addressbookimport DOM containers
        YAHOO.util.Dom.removeClass("addressbookimport-content","hidden-form");
        YAHOO.util.Dom.removeClass("addressbookimport-sidebar","hidden-form");

        // hide subnav list item contents before revealing side bar
    	jQuery('ol#addressbookimport_subnav li').hide();

        // reveal subview addressbookimport DOM containers
        YAHOO.util.Dom.removeClass("addressbookimport-" + subview + "-content", "hidden-form");
        YAHOO.util.Dom.removeClass("addressbookimport-" + subview + "-sidebar","hidden-form");

        // clear 'selected' css class from all subnav list items
        jQuery('ol#addressbookimport_subnav li.selected').removeClass('selected');

        // capture the new subview
        YAHOO.Convio.PC2.Views.addressBookImportLast = subview;

        // subview-specific Configuration
        Y.use('pc2-addressbookimport-functions', 'jquery-noconflict', function() {
        	YAHOO.Convio.PC2.Component.AddressBookImport.enableNextButtonAndThen(subview, function() {
		        if(subview === "selectsource") {
		        	// hide any error messages for the subview that might need to be revealed later
		        	YAHOO.Convio.PC2.Component.AddressBookImport.hideSelectSourceErrors();

		        	// set the 'selected' css class on the appropriate subnav list item
		        	YAHOO.util.Dom.addClass("addressbookimport-selectsource-nav-next", "selected");

		        	// show subnav list item contents as appropriate to this step in the wizard flow
		        	jQuery('ol#addressbookimport_subnav li#addressbookimport-selectsource-nav-next').show();
		        	jQuery('ol#addressbookimport_subnav li#addressbookimport-retrievecontacts-nav-next').show();
		        	jQuery('ol#addressbookimport_subnav li#addressbookimport-selectcontacts-nav-next').show();
		        	jQuery('ol#addressbookimport_subnav li#addressbookimport-importresults-nav-next').show();

		        	// unobtrusive javascript ... only need to do once
		            if(!YAHOO.Convio.PC2.Views.addressbookimportSelectsource) {
		            	YAHOO.Convio.PC2.Views.addressbookimportSelectsource = true;

		            	YAHOO.util.Event.addListener("addressbookimport-" + subview + "-next", "click", YAHOO.Convio.PC2.Component.AddressBookImport.selectSourceNextEventHandler);
		            	YAHOO.util.Event.addListener("addressbookimport-" + subview + "-cancel", "click", YAHOO.Convio.PC2.Component.AddressBookImport.cancelImportEventHandler);

		            	// wire in contextual help link
		            	jQuery('a#addressbookimport_selectsource_help_link').attr('href', YAHOO.Convio.PC2.Component.Content.getMsgCatValue('addressbookimport_selectsource_help_link'));
		            	jQuery('a#addressbookimport_selectsource_csv_help_link').attr('href', YAHOO.Convio.PC2.Component.Content.getMsgCatValue('addressbookimport_selectsource_csv_help_link'));

		            	// wire in title values from msg cat
		            	var MsgCatProvider = YAHOO.Convio.PC2.Component.Content;
		            	jQuery('#addressbookimport_selectsource_button_gmail').attr('title', MsgCatProvider.getMsgCatValue('addressbookimport_tooltip_select_source_gmail'));
		            	//TODO DSW Snowbird Remove this code block once we've confirmed that we can't access Hotmail via web service.
		            	//jQuery('#addressbookimport_selectsource_button_hotmail').attr('title', MsgCatProvider.getMsgCatValue('addressbookimport_tooltip_select_source_hotmail'));
		            	jQuery('#addressbookimport_selectsource_button_yahoo').attr('title', MsgCatProvider.getMsgCatValue('addressbookimport_tooltip_select_source_yahoo'));
		            	jQuery('#addressbookimport_sourceicon_mac').attr('title', MsgCatProvider.getMsgCatValue('addressbookimport_tooltip_select_source_mac'));
		            	jQuery('#addressbookimport_sourceicon_outlook').attr('title', MsgCatProvider.getMsgCatValue('addressbookimport_tooltip_select_source_outlook'));
		            	jQuery('#addressbookimport_sourceicon_hotmail').attr('title', MsgCatProvider.getMsgCatValue('addressbookimport_tooltip_select_source_hotmail'));
		            	jQuery('#addressbookimport_sourceicon_aol').attr('title', MsgCatProvider.getMsgCatValue('addressbookimport_tooltip_select_source_aol'));
		            	jQuery('#addressbookimport_sourceicon_generic').attr('title', MsgCatProvider.getMsgCatValue('addressbookimport_tooltip_select_source_generic'));
		            	jQuery('#addressbookimport_sourceicon_vcard').attr('title', MsgCatProvider.getMsgCatValue('addressbookimport_tooltip_select_source_vcard'));

		            	// add a click handler to the import source "buttons" that will set the related radio value
		            	jQuery('#addressbookimport-selectsource-options div.big-button').click(function(eventObject) {
		            		if (this.id) {
			            		jQuery('#' + this.id + ' input:radio').attr("checked", "checked").change();
		            		}
		            	});

		            	// add change handler to radio buttons so that containing "button" styles are adjusted
		            	jQuery('#addressbookimport-selectsource-options div.big-button input:radio').change(function(eventObject) {
		            		// update css classes for non-selected radios  
		            		jQuery('#addressbookimport-selectsource-options div.big-button input:radio:not(:checked)')
		            		.parents('div.big-button')
		            		.removeClass('big-button-on')
		            		.addClass('big-button-off');

		            		// update css classes for selected radio  
		            		jQuery('#addressbookimport-selectsource-options div.big-button input:radio:checked')
		            		.parents('div.big-button')
		            		.removeClass('big-button-off')
		            		.addClass('big-button-on');
		            	});

		            	// add change handler to show/hide the csv file selector as appropriate
		            	jQuery('#addressbookimport-selectsource-options div.big-button input:radio').change(function(eventObject) {
		            		var csvSourceSelected = (jQuery('#addressbookimport-selectsource-options input#addressbookimport_selectsource_radio_csv:radio:checked').size() > 0);
		            		if (csvSourceSelected) {
		            			jQuery('div#addressbookimport_csv_form_container').slideDown(0.25 * 1000);
		            		}
		            		else {
		            			jQuery('div#addressbookimport_csv_form_container').slideUp(0.25 * 1000);
		            		}
		            	});
		            }

		            // always start with the same source selected
		            jQuery('#addressbookimport_selectsource_radio_gmail').click();
		        }
		        else if(subview === "csvmapping") {
		        	var context = YAHOO.Convio.PC2.Component.AddressBookImport.context;
		        	var importServiceInstance = YAHOO.Convio.PC2.Component.AddressBookImport.importServiceInstance;

		        	// check for expected context needed to render subview
		            // handles page reload during the middle of the import wizard
		            if (!context || !context.source || !context.csvParseResult) {
		        		YAHOO.log("Insufficient context to render subview: " + subview, "warn", "dashboard.js");
		        		YAHOO.Convio.PC2.Utils.loadView('addressbookimport','selectsource');
		        		return;
		        	}

		        	// hide any error messages for the subview that might need to be revealed later
		        	YAHOO.Convio.PC2.Component.AddressBookImport.hideCsvMappingErrors();

		        	// set the 'selected' css class on the appropriate subnav list item
		        	YAHOO.util.Dom.addClass("addressbookimport-retrievecontacts-nav-next", "selected");

		        	// show subnav list item contents as appropriate to this step in the wizard flow
		        	jQuery('ol#addressbookimport_subnav li#addressbookimport-selectsource-nav-previous').show();
		        	jQuery('ol#addressbookimport_subnav li#addressbookimport-retrievecontacts-nav-next').show();
		        	jQuery('ol#addressbookimport_subnav li#addressbookimport-selectcontacts-nav-next').show();
		        	jQuery('ol#addressbookimport_subnav li#addressbookimport-importresults-nav-next').show();

		        	// hide the file encoding selector
		        	jQuery('#addressbookimport-csvmapping-preview-select-encoding-block').hide(0 * 1000);

		        	// build the csv mapping preview
		        	YAHOO.Convio.PC2.Component.AddressBookImport.buildCsvMappingPreviewList();

		        	// wire in the count for num CSV contact omitted from preview
		        	var numOmitted = Math.max(0, (context.getCsvParseResult().countDataRows() - YAHOO.Convio.PC2.Component.AddressBookImport.CsvMappingPreviewList.numToPreview));
		        	jQuery('#addressbookimport_csvmapping_preview_num_omitted').html(numOmitted);

		        	// set the selected file encoding based on ReST response value 
					jQuery('#addressbookimport-csvmapping-encoding-selector').val(context.csvParseResult.getProposedCharacterEncoding());

		        	// unobtrusive javascript ... only need to do once
		            if(!YAHOO.Convio.PC2.Views.addressbookimportCsvmapping) {
		            	YAHOO.Convio.PC2.Views.addressbookimportCsvmapping = true;

		            	// wire in the URL for the help link
			        	jQuery('a#addressbookimport_csvmapping_help_link').attr('href', YAHOO.Convio.PC2.Component.Content.getMsgCatValue('addressbookimport_csvmapping_help_link'));

			        	// wire in the change column mapping event handler
			        	YAHOO.util.Event.addListener("msg_cat_addressbookimport_csvmapping_preview_make_changes_link", "click", YAHOO.Convio.PC2.Component.AddressBookImport.csvMappingChangeCsvParseHandler);

			        	// wire in the change file encoding event handler
			        	YAHOO.util.Event.addListener("addressbookimport-csvmapping-encoding-selector", "change", YAHOO.Convio.PC2.Component.AddressBookImport.csvMappingChangeEncodingHandler);

			        	YAHOO.util.Event.addListener("addressbookimport-" + subview + "-next", "click", YAHOO.Convio.PC2.Component.AddressBookImport.csvMappingNextEventHandler);
		            	YAHOO.util.Event.addListener("addressbookimport-" + subview + "-cancel", "click", YAHOO.Convio.PC2.Component.AddressBookImport.cancelImportEventHandler);
		            }
		        }
		        else if(subview === "thirdpartystatus") {
		        	var context = YAHOO.Convio.PC2.Component.AddressBookImport.context;
		        	var importServiceInstance = YAHOO.Convio.PC2.Component.AddressBookImport.importServiceInstance;

		        	// check for expected context needed to render subview
		            // handles page reload during the middle of the import wizard
		            if (!context || !context.source || !context.jobId || !context.oAuthUrl) {
		        		YAHOO.log("Insufficient context to render subview: " + subview, "warn", "dashboard.js");
		        		YAHOO.Convio.PC2.Utils.loadView('addressbookimport','selectsource');
		        		return;
		        	}

		        	// hide any error messages for the subview that might need to be revealed later
		        	YAHOO.Convio.PC2.Component.AddressBookImport.hideThirdPartyStatusErrors();

		        	// set the 'selected' css class on the appropriate subnav list item
		        	YAHOO.util.Dom.addClass("addressbookimport-retrievecontacts-nav-next", "selected");

		        	// show subnav list item contents as appropriate to this step in the wizard flow
		        	jQuery('ol#addressbookimport_subnav li#addressbookimport-selectsource-nav-previous').show();
		        	jQuery('ol#addressbookimport_subnav li#addressbookimport-retrievecontacts-nav-next').show();
		        	jQuery('ol#addressbookimport_subnav li#addressbookimport-selectcontacts-nav-next').show();
		        	jQuery('ol#addressbookimport_subnav li#addressbookimport-importresults-nav-next').show();

		        	// reveal the throbber
		        	jQuery('#addressbookimport-thirdpartystatus-throbber').show();

		        	// clear out any prior event messages
		        	jQuery('#addressbookimport-thirdpartystatus-events').html('');

		        	// disable the "next" button while we wait 
		        	jQuery('#addressbookimport-thirdpartystatus-next').attr('disabled', 'disabled');

		        	// wire in the URL for the consent popup
		        	jQuery('#msg_cat_addressbookimport_thirdpartystatus_consent_link').unbind("click").click(YAHOO.Convio.PC2.Component.AddressBookImport.displayOpenAuthWindow);

		        	// auto-open the consent URL window after a short delay
		        	setTimeout(YAHOO.Convio.PC2.Component.AddressBookImport.displayOpenAuthWindow, 1.5 * 1000);

		        	// run a background 'thread' to watch for address book import events
		        	YAHOO.Convio.PC2.Component.AddressBookImport.startImportEventsAndStatusThread();

		        	// unobtrusive javascript ... only need to do once
		            if(!YAHOO.Convio.PC2.Views.addressbookimportThirdpartystatus) {
		            	YAHOO.Convio.PC2.Views.addressbookimportThirdpartystatus = true;
		            	
		            	YAHOO.util.Event.addListener("addressbookimport-" + subview + "-next", "click", YAHOO.Convio.PC2.Component.AddressBookImport.thirdPartyStatusNextEventHandler);
		            	YAHOO.util.Event.addListener("addressbookimport-" + subview + "-cancel", "click", YAHOO.Convio.PC2.Component.AddressBookImport.cancelImportEventHandler);
		            }
		        }
		        else if(subview === "selectcontacts") {
		        	var context = YAHOO.Convio.PC2.Component.AddressBookImport.context;
		        	var importServiceInstance = YAHOO.Convio.PC2.Component.AddressBookImport.importServiceInstance;

		        	// check for expected context needed to render subview
		            // handles page reload during the middle of the import wizard
		            if (!context || !context.addressBook) {
		        		YAHOO.log("Insufficient context to render subview: " + subview, "warn", "dashboard.js");
		        		YAHOO.Convio.PC2.Utils.loadView('addressbookimport','selectsource');
		        		return;
		        	}

		        	// hide any error messages for the subview that might need to be revealed later
		        	YAHOO.Convio.PC2.Component.AddressBookImport.hideSelectContactsErrors();

		        	// set the 'selected' css class on the appropriate subnav list item
		        	YAHOO.util.Dom.addClass("addressbookimport-selectcontacts-nav-next", "selected");

		        	// set the appropriate default for the all/some radio choice
		        	jQuery('#addressbookimport_selectcontacts_option_all').attr('checked', true);

		        	// set the number of imported contacts into the DOM
		        	jQuery('span#addressbookimport_selectcontacts_option_count')
		        	.html('<b>' + YAHOO.Convio.PC2.Component.AddressBookImport.context.addressBook.getContacts().length + '</b>');

		        	// show subnav list item contents as appropriate to this step in the wizard flow
		        	jQuery('ol#addressbookimport_subnav li#addressbookimport-selectsource-nav-previous').show();
		        	jQuery('ol#addressbookimport_subnav li#addressbookimport-retrievecontacts-nav-previous').show();
		        	jQuery('ol#addressbookimport_subnav li#addressbookimport-selectcontacts-nav-next').show();
		        	jQuery('ol#addressbookimport_subnav li#addressbookimport-importresults-nav-next').show();

		        	// start with with select list hidden
		        	jQuery('#addressbookimport-importcandidatecontacts-list-container').hide();

		        	// build the contact list
		        	YAHOO.Convio.PC2.Component.AddressBookImport.buildImportCandidateContactsList();

		        	// unobtrusive javascript ... only need to do once
		            if(!YAHOO.Convio.PC2.Views.addressbookimportSelectcontacts) {
		            	YAHOO.Convio.PC2.Views.addressbookimportSelectcontacts = true;

		            	YAHOO.util.Event.addListener("addressbookimport-" + subview + "-next", "click", YAHOO.Convio.PC2.Component.AddressBookImport.selectContactsNextEventHandler);
		            	YAHOO.util.Event.addListener("addressbookimport-" + subview + "-cancel", "click", YAHOO.Convio.PC2.Component.AddressBookImport.cancelImportEventHandler);

		            	// wire in contextual help link
		            	jQuery('a#addressbookimport_selectcontacts_help_link').attr('href', YAHOO.Convio.PC2.Component.Content.getMsgCatValue('addressbookimport_selectcontacts_help_link'));

		            	// add change handlers to radio buttons so that contact list is revealed only when appropriate
			        	jQuery('#addressbookimport_selectcontacts_option_some').change(function(eventObject) {
			        		jQuery('#addressbookimport-importcandidatecontacts-list-container').slideDown(0.25* 1000, function() {
			        			// tell the datatable to check its column widths
			        			YAHOO.Convio.PC2.Component.AddressBookImport.ImportSelectList.dataTable.onShow();
			        		});
			        	});
			        	jQuery('#addressbookimport_selectcontacts_option_all').change(function(eventObject) {
			        		jQuery('#addressbookimport-importcandidatecontacts-list-container').slideUp(0.25 * 1000);
			        	});

			        	// wire in event handlers for select all/none links
			        	YAHOO.util.Event.addListener("msg_cat_addressbookimport_importcandidatecontacts_list_select_all_label_top", "click", YAHOO.Convio.PC2.Component.AddressBookImport.selectAllImportCandidateContactsList);
			        	YAHOO.util.Event.addListener("msg_cat_addressbookimport_importcandidatecontacts_list_select_all_label_bottom", "click", YAHOO.Convio.PC2.Component.AddressBookImport.selectAllImportCandidateContactsList);
			        	YAHOO.util.Event.addListener("msg_cat_addressbookimport_importcandidatecontacts_list_select_none_label_top", "click", YAHOO.Convio.PC2.Component.AddressBookImport.selectNoneImportCandidateContactsList);
			        	YAHOO.util.Event.addListener("msg_cat_addressbookimport_importcandidatecontacts_list_select_none_label_bottom", "click", YAHOO.Convio.PC2.Component.AddressBookImport.selectNoneImportCandidateContactsList);
			        	
			        }
		        }
		        else if(subview === "importresults") {
		        	var context = YAHOO.Convio.PC2.Component.AddressBookImport.context;
		        	var importServiceInstance = YAHOO.Convio.PC2.Component.AddressBookImport.importServiceInstance;

		        	// check for expected context needed to render subview
		            // handles page reload during the middle of the import wizard
		        	if (!context || !context.saveContactsResult) {
		        		YAHOO.log("Insufficient context to render subview: " + subview, "warn", "dashboard.js");
		        		YAHOO.Convio.PC2.Utils.loadView('addressbookimport','selectsource');
		        		return;
		        	}

		        	// set the 'selected' css class on the appropriate subnav list item
		        	YAHOO.util.Dom.addClass("addressbookimport-importresults-nav-next", "selected");

		        	// show subnav list item contents as appropriate to this step in the wizard flow
		        	jQuery('ol#addressbookimport_subnav li#addressbookimport-selectsource-nav-previous').show();
		        	jQuery('ol#addressbookimport_subnav li#addressbookimport-retrievecontacts-nav-previous').show();
		        	jQuery('ol#addressbookimport_subnav li#addressbookimport-selectcontacts-nav-previous').show();
		        	jQuery('ol#addressbookimport_subnav li#addressbookimport-importresults-nav-next').show();

		        	// build the list of newly added contacts
		        	YAHOO.Convio.PC2.Component.AddressBookImport.buildNewlyAddedContactsList();

		        	// build the list of suspected duplicate contacts
		        	YAHOO.Convio.PC2.Component.AddressBookImport.buildSuspectedDuplicateContactsList();

		        	// build the list of contacts in error
		        	YAHOO.Convio.PC2.Component.AddressBookImport.buildErrorContactsList();

		        	// assign css classes to summary list items
		        	YAHOO.Convio.PC2.Component.AddressBookImport.updateSummaryListItemStyles();

		        	// apply accordion to UI
		        	// ... must do this every time we load the subview, not just the first time
		            YAHOO.Convio.PC2.Component.AddressBookImport.buildResultsAccordion();

		        	// unobtrusive javascript ... only need to do once
		            if(!YAHOO.Convio.PC2.Views.addressbookimportImportresults) {
		            	YAHOO.Convio.PC2.Views.addressbookimportImportresults = true;
		            	
		            	YAHOO.util.Event.addListener("addressbookimport-" + subview + "-next", "click", YAHOO.Convio.PC2.Component.AddressBookImport.importResultsNextEventHandler);
		            	
		            	// wire in contextual help link
		            	jQuery('a#addressbookimport_importresults_help_link').attr('href', YAHOO.Convio.PC2.Component.Content.getMsgCatValue('addressbookimport_importresults_help_link'));
		            	
		            	YAHOO.Convio.PC2.Component.AddressBookImport.buildConfirmFinishedDialog();
		            }
		        }
		        else {
		        	throw "Unexpected subview: " + subview; 
		        }
        	});
        }); 
    };
}

var participantCanSelfManageEDPCallback = {
    success: function(o) {
        var response = YAHOO.lang.JSON.parse(o.responseText).getEventDataParameterResponse;
        // Show the change membership link only if the event is open and user is not a captain
        if (response.booleanValue == "true" 
        	&& YAHOO.Convio.PC2.Component.Teamraiser.Registration.aTeamCaptain == "false"
        	&& YAHOO.Convio.PC2.Data.TeamraiserConfig.acceptingRegistrations == "true") 
        {
        	YAHOO.util.Dom.removeClass("subnav_manage_membership", "hidden-form");
        }
    },
    failure: function(o) {
        logFailure(o);
    }
};

var validateSurveyResponse = function(question) {
	//right now only validating the date
	if(question.questionType == "DateQuestion") {
		var inputEl = YAHOO.util.Dom.get("question_cal_" + question.questionId);
		var required = question.questionRequired === "true";
		if(!required && inputEl.value == "") {
			return true;
		}
		var dateformat = /^\d{1,2}\/\d{1,2}\/\d{4}$/ //check for date format MM/dd/yyyy with leniency for 1 digit month and day
		if (!dateformat.test(inputEl.value)) {
			return false;
		} else {
			//format is good so check if the date is a valid date
			var month = inputEl.value.split("/")[0];
			var day = inputEl.value.split("/")[1];
	        var year = inputEl.value.split("/")[2];
	        var date = new Date(year, month - 1, day);
	        if(date.getMonth() + 1 != month || date.getDate() != day || date.getFullYear() != year) {
	        	return false;
	        }
		} 
    }
	return true;
}

// --- UK Address lookup functions ---------
var setupUKAddressLookup = function() {
   document.getElementById('api_key').value = YAHOO.Convio.PC2.Config.getApiKey();
   document.getElementById('servlet').value = YAHOO.Convio.PC2.Config.Constituent.getUrl();
   document.getElementById('v').value = YAHOO.Convio.PC2.Config.getVersion();

   Y.use('ukaddresslookup',function() {
      UKAddressLookup.setupObservableCountry(countryId);
      UKAddressLookup.registerCustomObserver(countryId,"postcode_find_button","postcode_matchingAddresses");
   });
};

var findAddressesLocal = function() {
    Y.use('ukaddresslookup',function() {
       UKAddressLookup.findAddresses(postCodeField.value, matchingAddresses, lookupError, procText);
    });
};

var addressSelectedLocal = function() {
    Y.use('ukaddresslookup',function() {
        UKAddressLookup.addressSelected(matchingAddresses.value, addressFieldInfo, matchingAddresses, lookupError, procText);
    });
};

var setUKAddressLookupContent = function() {
    var MsgCatProvider = YAHOO.Convio.PC2.Component.Content;
    document.getElementById('msg_united_kingdom').value = MsgCatProvider.getMsgCatValue('united_kingdom');
    document.getElementById('msg_server_error').value = MsgCatProvider.getMsgCatValue('address_lookup_server_error');
    document.getElementById('msg_address_not_in_list').value = MsgCatProvider.getMsgCatValue('address_lookup_not_in_list');
    document.getElementById('postcode_findAddressProcessingText').innerHTML = MsgCatProvider.getMsgCatValue('processing');
    document.getElementById('postcode_find_button').innerHTML = MsgCatProvider.getMsgCatValue('find_address_button');

    YAHOO.Convio.PC2.Teamraiser.getEventDataParameter(getUKAddressLookupResponseHandler, "UK_ADDRESS_LOOKUP", 'boolean');
};

var getUKAddressLookupResponseHandler = {
    success: function(o) {
        var response = YAHOO.lang.JSON.parse(o.responseText).getEventDataParameterResponse;
        if (response.booleanValue != "true" && YAHOO.Convio.PC2.Config.isUKLocale())
            hide_pc2_element('postcode_find_button');
    },
    failure: function(o) {
        YAHOO.log(o.responseText, 'error', 'content_utils.js');
    }
};
 // --- End of UK Address lookup functions --------- 
