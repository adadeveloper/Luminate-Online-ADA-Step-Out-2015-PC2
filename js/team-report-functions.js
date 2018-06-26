var TeamGoalEdit;
var showTeamGoalEdit = function() {
    TeamGoalEdit.show();
};

YAHOO.Convio.PC2.Component.Teamraiser.EditTeamGoalDialog = function(goalValue, formContainer) {
    YAHOO.log("Creating EditTeamGoalDialog","info","team-report-functions.js");
    
    try {
        this.UpdateTeamGoalCallback = {
            success: function(o) {
                // Update the local presentation
                var goalValElm = YAHOO.util.Dom.get(this.parent.GoalValue);
                var data = this.parent.getData();
                var goal = YAHOO.Convio.PC2.Utils.parseCurrency(data.goal);
                goalValElm.innerHTML = YAHOO.Convio.PC2.Utils.formatCurrency(goal);
                updateTeamGoal(goal);
                this.parent.hide();
            },
            
            failure: function(o) {
                var err = YAHOO.lang.JSON.parse(o.responseText).errorResponse.message;
                var errElm = YAHOO.util.Dom.get(this.parent.ErrorDiv);
                YAHOO.util.Dom.removeClass(errElm,"hidden-form");
                errElm.innerHTML = err;
		
		logFailure(o);
            },
            
            parent: this
        };
        
        // Define various event handlers for Dialog
        this.validate = function(){
            try {
                var data = this.getData();
                var teamInfo = {
                    teamGoal: YAHOO.Convio.PC2.Utils.parseCurrency(data.goal)
                };
                var valid = YAHOO.lang.isNumber(teamInfo.teamGoal);
                if(valid) {
                    var amountStr = '' + teamInfo.teamGoal;
                    var periodIdx = amountStr.indexOf('.');
                    if(periodIdx > -1) {
                        valid = false;
                    }
                }
                if(!valid) {
                    var errElm = YAHOO.util.Dom.get(this.ErrorDiv);
                    errElm.innerHTML = MsgCatProvider.getMsgCatValue('error_team_goal_invalid_number');
                    YAHOO.util.Dom.removeClass(errElm,"hidden-form");
                }
		
                return valid;
            } catch(e) {
                YAHOO.log('Error with EditTeamGoalDialog.validate: ' + e, 'error', 'team-report-functions.js');
                return false;
            }
        };
	
        this.handleSubmit = function() {
            try {
		if(this.validate()){
		    var data = this.getData();
		    var teamInfo = {
			teamGoal: YAHOO.Convio.PC2.Utils.parseCurrency(data.goal)
		    };
		    YAHOO.util.Dom.addClass(this.ErrorDiv, "hidden-form");
		    YAHOO.Convio.PC2.Teamraiser.updateTeamInformation(this.UpdateTeamGoalCallback, teamInfo);
		}
            } catch(e) {
                YAHOO.log("Error with EditGoalDialog.handleSubmit: " + e, "error", "team_report.js");
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
        
        var MsgCatProvider = YAHOO.Convio.PC2.Component.Content;
        var dialogConfig = {
            width : "27em",
            modal: true, 
            visible : false, 
            close: false,
            hideaftersubmit: false,
            buttons : [ { text:MsgCatProvider.getMsgCatValue('dialog_submit'), handler:this.handleSubmit, isDefault:true },
                        { text:MsgCatProvider.getMsgCatValue('dialog_cancel'), handler:this.handleCancel } ]
        };
        
        YAHOO.Convio.PC2.Component.Teamraiser.EditGoalDialog.superclass.constructor.call(
            this, 
            formContainer || YAHOO.util.Dom.generateId(), 
            dialogConfig
        );
        
        this.GoalValue = goalValue;
	this.ErrorDiv = YAHOO.util.Dom.generateId();
        this.setHeader(document.getElementById("msg_cat_team_goal_edit_goal").innerHTML);
        this.setBody(  '<div class="hidden-form failure-message" id="'  + this.ErrorDiv + '">&nbsp;</div>'
                     + '<form action="javascript: void(0);">'
                     + '<label for="goal">' + document.getElementById("msg_cat_team_goal_goal").innerHTML
                     + ': </label> <input type="textbox" name="goal" maxlength="17" size="17" />'
                     + '</form>');
        this.render(document.body);
    } catch(e) {
        YAHOO.log('Error creating EditGoalDialog: ' + e, 'error', 'teamraiser_utils.js');
    }
};

var updateTeamGoal = function(goal) {
    if(!YAHOO.Convio.PC2.Component.Teamraiser.TeamProgressData) {
        YAHOO.log('updateTeamGoal did not succeed beacuse ProgressData is not set','error','team_report.js');
        return;
    }
    var percentText = YAHOO.Convio.PC2.Utils.getPercentText(YAHOO.Convio.PC2.Component.Teamraiser.TeamProgressData.teamProgress.raised, goal);
    var tPercentElm = YAHOO.util.Dom.get(YAHOO.Convio.PC2.Component.Teamraiser.TeamProgress.teamPercentValue);
    tPercentElm.innerHTML = percentText;

    var pct = YAHOO.Convio.PC2.Component.Teamraiser.TeamProgressData.teamProgress.raised / goal;
    if(isNaN(pct)) {
        pct = 0;
    }

    YAHOO.Convio.PC2.Component.Teamraiser.updateProgressBar('.team-fundraising-progress-bar-container', pct * 100);
};

var GetTopTeamDonorsListCallback = {
    success: function(o) {
        var divString = "";
        var response = YAHOO.lang.JSON.parse(o.responseText).getTopTeamDonorsResponse;
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
        var topDonorsBody = YAHOO.util.Dom.get('top-team-donors-body');
        topDonorsBody.innerHTML = divString;
        YAHOO.util.Dom.removeClass('top-team-donors', 'hidden-form');
    },
    
    failure: function(o) {
        YAHOO.log(o.responseText, 'error', 'report.js');
    },

    scope: YAHOO.Convio.PC2.Teamraiser
};


function deleteTeamGift(giftId) {
    deleteTeamGiftId = giftId;
    YAHOO.Convio.PC2.Component.TeamGiftHistory.DeleteConfirmDialog.show();
};

var deleteTeamGiftCallback = {
    success: function(o) {
        var response = YAHOO.lang.JSON.parse(o.responseText).deleteGiftResponse;
        var records = YAHOO.Convio.PC2.Component.TeamGiftHistory.myDataTable.getRecordSet().getRecords();
        var giftId = response.giftId;
        for(var i=YAHOO.Convio.PC2.Component.TeamGiftHistory.Paginator.getStartIndex(); i<records.length; i++) {
            var record = records[i];
            if(YAHOO.lang.isUndefined(record) == false && 
                    record.getData().id == giftId) {
                YAHOO.Convio.PC2.Component.TeamGiftHistory.myDataTable.deleteRow(i);
                break;
            }
        }
    },
    failure: function(o) {
    },
    scope: YAHOO.Convio.PC2.Teamraiser
};

var GetTeamDonationByDayCallback = {
    success: function(o) {
	// Must have Flash 9.0.45 available in order to use YUI Charts:
	if(YAHOO.util.SWFDetect.isFlashVersionAtLeast(9.045)){
   	    // remove error message and show the chart
	    YAHOO.util.Dom.addClass('team-report-chart-no-flash', 'hidden-form');
	    YAHOO.util.Dom.removeClass('bd-team-chart', 'hidden-form');

	    YAHOO.widget.Chart.SWFURL = "../yui/charts/assets/charts.swf";
	    var response = YAHOO.lang.JSON.parse(o.responseText).getTeamDonationByDayResponse;
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
		    "team-report-chart", 
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
	    YAHOO.util.Dom.removeClass('team-report-chart-no-flash', 'hidden-form');
	    YAHOO.util.Dom.addClass('bd-team-chart', 'hidden-form');
	}
    },

    failure: function(o) {
        YAHOO.log(o.responseText, 'error', 'report.js');
    },

    scope: YAHOO.Convio.PC2.Teamraiser
};

function getTeamMember(record) {
	var MsgCatProvider = YAHOO.Convio.PC2.Component.Content;
	var privacySettingStr = "";
	
	// if this record is anonymous or is using a screen name
	// we should display it in the team roster
	if (record.anonymous && record.anonymous == 'true')
	{
		privacySettingStr = MsgCatProvider.getMsgCatValue('privacy_setting_team_roster_anonymous');
	}
	else if (record.screenname && record.screenname != '')
	{
		privacySettingStr = MsgCatProvider.getMsgCatValue('privacy_setting_team_roster_screenname');
		privacySettingStr = privacySettingStr.replace("{0}", record.screenname);
	}
	
    var str = "<tr>";
    str += "<td>" + record.firstName + " " + record.lastName;
    if (privacySettingStr && privacySettingStr != "")
    {
    	str += " " + privacySettingStr;
    }
    str += "</td>";
    str += "<td class='amount'>" + YAHOO.Convio.PC2.Utils.formatCurrency(record.amount) + "</td>";
    str += "</tr>";
    return str;
};

var GetTeamRosterCallback = {
    success: function(o) {
        var response = YAHOO.lang.JSON.parse(o.responseText).getTeamRosterResponse;
        var teamRosterBlock = YAHOO.util.Dom.get('team-roster');
        var teamMember = response.teamMember;
        var membersColumn1 = "<table class='col-1'>";
        var membersColumn2 = "<table class='col-2'>";
        if(YAHOO.lang.isArray(teamMember)) {
            var length = teamMember.length;
            for(var i=0; i<length; i++) {
                if(i- ((length-1)/2) > 0){
                    membersColumn2 += getTeamMember(teamMember[i]);
                } else {
                    membersColumn1 += getTeamMember(teamMember[i]);
                }
            }
        } else {
            if(YAHOO.lang.isUndefined(teamMember) == false) {
                membersColumn1 += getTeamMember(teamMember);
            }
        }
        membersColumn1 += "</table>";
        membersColumn2 += "</table>";
        teamRosterBlock.innerHTML = membersColumn1 + membersColumn2;
        
        var url = response.teamRosterDownloadUrl;
        var teamRosterDl = YAHOO.util.Dom.get("msg_cat_team_report_team_members_download");
        teamRosterDl.href = url;
        
        var url = response.teamDonationsDownloadUrl;
        if (YAHOO.lang.isNull(url) == false && YAHOO.lang.isString(url) == true){
        	var teamDonationsDl = YAHOO.util.Dom.get("msg_cat_team_report_team_donations_download");
        	teamDonationsDl.href = url;
            YAHOO.util.Dom.removeClass('team_report_team_donations_download_block', 'hidden-form');
        }
        
        var url = response.teamStatsDownloadUrl;
        if (YAHOO.lang.isNull(url) == false && YAHOO.lang.isString(url) == true){
           var teamStatsDl = YAHOO.util.Dom.get("msg_cat_team_report_team_stats_download");
           teamStatsDl.href = url;
           YAHOO.util.Dom.removeClass('team_report_team_stats_block', 'hidden-form');
        }

        YAHOO.util.Dom.removeClass('bd-teammates-block', 'hidden-form');
    },
    failure: function(o) {
        // no permission to display team roster
        // leave the team roster block hidden
    	console.log("Failed to display team roster.");
    },
    scope: YAHOO.Convio.PC2.Teamraiser
};

function loadTeamRoster() {
    YAHOO.Convio.PC2.Teamraiser.getTeamRoster(GetTeamRosterCallback, YAHOO.Convio.PC2.Component.Teamraiser.Registration.teamId, true, true);
};