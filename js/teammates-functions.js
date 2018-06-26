// Methods for switching views
var switchMemberToView = function(member) {
    var isCaptain = (member.aTeamCaptain == "true");
    if(isCaptain) {
        show_pc2_element("captain_marker_" + member.consId);
    }
    hide_pc2_element("captain_check_" + member.consId);
};

var switchMemberToManage = function(member) {
    hide_pc2_element("captain_marker_" + member.consId);
    show_pc2_element("captain_check_" + member.consId);
};
            
var clearTeammatesMessages = function() {
	hide_pc2_element("teammates-save-success");
    hide_pc2_element("teammates-save-failure");
}

var switchToManage = function() {
    hide_pc2_element("msg_cat_view_teammates_header");
    show_pc2_element("msg_cat_manage_team_captains_header");
    var members = YAHOO.Convio.PC2.Data.Members;
    if(YAHOO.lang.isArray(members)) {
        for(var i=0; i < members.length; i++) {
            switchMemberToManage(members[i]);
        }
    } else {
        switchMemberToManage(members);
    }
    hide_pc2_element("teammates-save-success");
    hide_pc2_element("teammates-save-failure");
    show_pc2_element("teammates-content-actions");
    YAHOO.util.Dom.addClass("teammates-subnav-manage", "selected");
    YAHOO.util.Dom.removeClass("teammates-subnav-view", "selected");
    
    clearTeammatesMessages();
};

var switchToView = function() {
    show_pc2_element("msg_cat_view_teammates_header");
    hide_pc2_element("msg_cat_manage_team_captains_header");
    var members = YAHOO.Convio.PC2.Data.Members;
    if(YAHOO.lang.isArray(members)) {
        for(var i=0; i < members.length; i++) {
            switchMemberToView(members[i]);
        }
    } else {
        switchMemberToView(members);
    }
    hide_pc2_element("teammates-content-actions");
    YAHOO.util.Dom.addClass("teammates-subnav-view", "selected");
    YAHOO.util.Dom.removeClass("teammates-subnav-manage", "selected");
    
    clearTeammatesMessages();
};

var loadTeam = function(teamId) {
    var loadTeamCallback = {
        success: function(o) {
            
            /**
             * Create a new DIV with information about the provided member
             * and append it to the provided HTML element.
             */
            var renderMember = function(el, member) {
                var memberRow = document.createElement("tr");
                var memberData = document.createElement("td");


                //hide_pc2_element(memberDiv, "captain-container");
                
                    //var checkboxSpan = document.createElement("span");
                    //checkboxSpan.id = "captain_edit_" + member.consId;
                    //hide_pc2_element(checkboxSpan, "captain-edit");
                var checkbox = document.createElement("input");
                checkbox.id = "captain_check_" + member.consId;
                checkbox.type = "checkbox";
                memberData.appendChild(checkbox);
                if(member.aTeamCaptain == "true") {
                	checkbox.checked = true;
                }

                //checkboxSpan.appendChild(checkbox);

                var achievementBadgeSpan = document.createElement("span");
                achievementBadgeSpan.innerHTML=member.achievementBadges;
                var nameSpan = document.createElement("span");
                YAHOO.util.Dom.addClass(nameSpan, "captain-name");
                
                var MsgCatProvider = YAHOO.Convio.PC2.Component.Content;
                var privacySettingStr = "";
    			
    			// if the participant viewing is not a captain and the participant we're rendering is not
    			// himself, respect privacy settings
                if (member.name.isAnonymous && member.name.isAnonymous == 'true')
                {
                	privacySettingStr = MsgCatProvider.getMsgCatValue('privacy_setting_team_roster_anonymous');
                }
                else if (member.name.screenname && member.name.screenname != '')
                {
    				privacySettingStr = MsgCatProvider.getMsgCatValue('privacy_setting_team_roster_screenname');
    				privacySettingStr = privacySettingStr.replace("{0}", member.name.screenname);
                }

                var nameStr = member.name.first + " " + member.name.last;
                if (privacySettingStr != "")
                {
                	nameStr += " " + privacySettingStr;
                }
                var name = document.createTextNode(nameStr);

                nameSpan.appendChild(name);

                var markerSpan = document.createElement("span");
                markerSpan.id = "captain_marker_" + member.consId;
                YAHOO.util.Dom.addClass(markerSpan, "captain-marker");
                hide_pc2_element(markerSpan);

                var MsgCatProvider = YAHOO.Convio.PC2.Component.Content;
                var markerText = document.createTextNode(MsgCatProvider.getMsgCatValue('captain_title'));

                markerSpan.appendChild(markerText);    

                memberData.appendChild(achievementBadgeSpan);
                memberData.appendChild(nameSpan);
                memberData.appendChild(markerSpan);

                memberRow.appendChild(memberData);
                el.appendChild(memberRow);
                
            };
            
            var members = YAHOO.lang.JSON.parse(o.responseText).getTeamMembersResponse.member;
            
            // Copy the data to a global variable
            YAHOO.Convio.PC2.Data.Members = members;
            
            if(YAHOO.lang.isArray(members)) {
                var teammatesTable = YAHOO.util.Dom.get("view-teammates-table");
                for(var i=0; i < members.length; i++) {
                        renderMember(teammatesTable, members[i]);
                }
            } else {
                var individualTable = YAHOO.util.Dom.get("view-teammates-table");
                renderMember(individualTable, members);
            }
            
            YAHOO.util.Event.addListener("msg_cat_subnav_view_teammates", "click", switchToView);
            YAHOO.util.Event.addListener("msg_cat_subnav_manage_captains", "click", switchToManage);
            
            var maxCaptains = YAHOO.Convio.PC2.Data.TeamraiserConfig.teamCaptainsMaximum * 1;
            if(!YAHOO.Convio.PC2.Data.TeamCaptain || !YAHOO.lang.isNumber(maxCaptains) || maxCaptains <= 1) {
                YAHOO.util.Dom.addClass("teammates-subnav-view", "selected");
                hide_pc2_element("teammates-subnav-manage");
                switchToView();
            } else {
            	YAHOO.util.Dom.addClass("teammates-subnav-view", "selected");
            	switchToView();
            	//YAHOO.util.Dom.addClass("teammates-subnav-manage", "selected");
            }
        },
        failure: function(o) {
            YAHOO.log("Error loading team roster: " + o.responseText, "error", "teamcaptains.js");
        },
        scope: this
    };
    
    YAHOO.Convio.PC2.Teamraiser.getTeamMembers(loadTeamCallback);
};

var saveCaptains = function() {
    hide_pc2_element("teammates-save-failure");
    hide_pc2_element("teammates-save-success");
    /**
     * Determines if the checkbox for a team member is checked, indicating
     * that this person is currently a captain or should be made a captain.
     */
    var isCaptainChecked = function(member) {
        var checkboxEl = YAHOO.util.Dom.get("captain_check_" + member.consId);
        return checkboxEl.checked;
    };
    
    var setCaptainChecked = function(member) {
        var isCaptain = (member.aTeamCaptain == "true");
        var checkboxEl = YAHOO.util.Dom.get("captain_check_" + member.consId);
        checkboxEl.checked = isCaptain;
    }
    
    /**
     * Callback object for saving the list of team captains
     */
    var saveCaptainsCallback = {
        success: function(o) {
            var members = YAHOO.lang.JSON.parse(o.responseText).getTeamMembersResponse.member;
            
            // Copy the data to a global variable
            YAHOO.Convio.PC2.Data.Members = members;
            
            if(YAHOO.lang.isArray(members)) {
                for(var i=0; i < members.length; i++) {
                    setCaptainChecked(members[i]);
                }
            } else {
                setCaptainChecked(members);
            }
            show_pc2_element("teammates-save-success");
        },
        failure: function(o) {
            var err = YAHOO.lang.JSON.parse(o.responseText).errorResponse.message;
            var errElm = YAHOO.util.Dom.get("msg_cat_captains_save_failure");
            errElm.innerHTML = err;
            
            show_pc2_element("teammates-save-failure");
            YAHOO.log("Error saving captains: " + o.responseText, "error", "teamcaptains.js");
            
        },
        scope: this
    };
    try {
        var captains = [];
        var members = YAHOO.Convio.PC2.Data.Members;
        if(YAHOO.lang.isArray(members)) {
            for(var i=0; i < members.length; i++) {
                if(isCaptainChecked(members[i])) {
                    captains[captains.length] = members[i].consId;
                }
            }
        } else {
            if(isCaptainChecked(members)) {
                captains[captains.length] = members.consId;
            }
        }
        
        YAHOO.Convio.PC2.Teamraiser.setTeamCaptains(saveCaptainsCallback, captains);
    } catch(e) {
        YAHOO.log("Error saving: " + e, "error", "teamcaptains.js");
    }
};


/**
 * Makes an asynchronous REST call to fetch a TeamRosterResponse. Response is
 * used to manipulate DOM by delegating to 
 * <code>injectTeamRosterRelatedLinks(teamRosterResponse)</code>.
 * 
 * This is an asynchronous method.
 */
var loadTeamRosterRelatedLinks = function()
{

	LoadTeamRosterRelatedLinksCallback = {
		success : function(o)
		{
			var teamRosterResponse = YAHOO.lang.JSON.parse(o.responseText).getTeamRosterResponse;
			injectTeamRosterRelatedLinks(teamRosterResponse);
		},
		failure : function(o)
		{
			logFailure(o);
		},
		scope : YAHOO.Convio.PC2.Teamraiser
	};

	YAHOO.Convio.PC2.Teamraiser.getTeamRoster(LoadTeamRosterRelatedLinksCallback, YAHOO.Convio.PC2.Component.Teamraiser.Registration.teamId, true, true);
};

/**
 * 
 * Process a TeamRosterResponse, injecting link URLs into the DOM as appropriate
 * to the PC2 teammates view.
 * 
 * This is a blocking method.
 * 
 * @param teamRosterResponse
 */
var injectTeamRosterRelatedLinks = function(teamRosterResponse)
{
	if (!teamRosterResponse || teamRosterResponse == null) {
		// no response to process
		YAHOO.log("injectTeamRosterRelatedLinks(..) ignored invalid response", "warn", "teammates-functions.js");
		return;
	}
	
	var url = teamRosterResponse.teamRosterDownloadUrl;
	if (YAHOO.lang.isNull(url) == false && YAHOO.lang.isString(url) == true) {
		var teamRosterElm = YAHOO.util.Dom.get("msg_cat_teammates_download_members");
		if (teamRosterElm) {
			teamRosterElm.href = url;
		}
	}

	var url = teamRosterResponse.teamDonationsDownloadUrl;
	if (YAHOO.lang.isNull(url) == false && YAHOO.lang.isString(url) == true) {
		var teamDonationsElm = YAHOO.util.Dom.get("msg_cat_teammates_download_donations");
		if (teamDonationsElm) {
			teamDonationsElm.href = url;
		}
	}

	var url = teamRosterResponse.teamStatsDownloadUrl;
	if (YAHOO.lang.isNull(url) == false && YAHOO.lang.isString(url) == true) {
		var teamStatsElm = YAHOO.util.Dom.get("msg_cat_teammates_download_stats");
		if (teamStatsElm) {
			teamStatsElm.href = url;
		}
	}
};