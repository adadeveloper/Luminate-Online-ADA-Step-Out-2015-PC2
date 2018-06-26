var switchToManageTeamMembership = function() {
    resetManageMembershipUI();
    YAHOO.util.Dom.removeClass("membership-manage-content", "hidden-form");
    YAHOO.util.Dom.addClass("membership-join-content", "hidden-form");
    YAHOO.util.Dom.addClass("membership-leave-content", "hidden-form");
};

var switchToJoinTeam = function() {
    resetManageMembershipUI();
    YAHOO.util.Dom.removeClass("membership-join-content", "hidden-form");
    YAHOO.util.Dom.addClass("membership-manage-content", "hidden-form");
    YAHOO.util.Dom.addClass("membership-leave-content", "hidden-form");
};

var switchToLeaveTeam = function() {
    resetManageMembershipUI();
    YAHOO.util.Dom.removeClass("membership-leave-content", "hidden-form");
    YAHOO.util.Dom.addClass("membership-manage-content", "hidden-form");
    YAHOO.util.Dom.addClass("membership-join-content", "hidden-form");
};

var resetManageMembershipUI = function() {
    showOrHideLeaveTeamRadio();
    deactivateLeaveTeamContainer();
    clearAndHidePageMessages();
    clearDomElements();
    clearSearchResults();
    activateJoinTeamContainer();
};

var showOrHideLeaveTeamRadio = function() {
    if (YAHOO.Convio.PC2.Component.Teamraiser.Registration.teamId > 0) {
        YAHOO.util.Dom.removeClass("leave-team-radio-container", "hidden-form");
    } else {
        YAHOO.util.Dom.addClass("leave-team-radio-container", "hidden-form");
    }
};

var activateJoinTeamContainer = function() {
    YAHOO.util.Dom.removeClass("join-team-container", "hidden-form");
    YAHOO.util.Dom.addClass("join-team-radio-container", "big-button-on");
    YAHOO.util.Dom.removeClass("join-team-radio-container", "big-button-off");
    YAHOO.util.Dom.setAttribute("join-team-radio", "checked", true);
    clearSearchResults();
    jQuery("#team-name").focus();
};

var activateLeaveTeamContainer = function() {
    YAHOO.util.Dom.removeClass("leave-team-container", "hidden-form");
    YAHOO.util.Dom.addClass("leave-team-radio-container", "big-button-on");
    YAHOO.util.Dom.removeClass("leave-team-radio-container", "big-button-off");
    YAHOO.util.Dom.setAttribute("leave-team-radio", "checked", true);
};

var deactivateJoinTeamContainer = function() {
    YAHOO.util.Dom.addClass("join-team-radio-container", "big-button-off");
    YAHOO.util.Dom.addClass("join-team-container", "hidden-form");
    YAHOO.util.Dom.removeClass("join-team-radio-container", "big-button-on");
};

var deactivateLeaveTeamContainer = function() {
    YAHOO.util.Dom.addClass("leave-team-radio-container", "big-button-off");
    YAHOO.util.Dom.addClass("leave-team-container", "hidden-form");
    YAHOO.util.Dom.removeClass("leave-team-radio-container", "big-button-on");
};

var clearAndHidePageMessages = function() {
    jQuery("#manage-membership-success").addClass("hidden-form");
    jQuery("#manage-membership-failure").addClass("hidden-form");
    jQuery("#team-search-success").addClass("hidden-form");
    jQuery("#team-search-failure").addClass("hidden-form");
    jQuery("#join-team-success").addClass("hidden-form");
    jQuery("#join-team-failure").addClass("hidden-form");
};

var clearDomElements = function() {
    jQuery("#join-team-password").val("");
};

clearSearchTerms = function() {
    jQuery("#team-name").val("");
    jQuery("#team-captain-first").val("");
    jQuery("#team-captain-last").val("");
    jQuery("#team-company").val("");
}

var clearSearchResults = function() {
    jQuery("#team-search-results").hide().empty();
    jQuery("#team-search-results-container").hide();

    clearSearchTerms();
    clearDomElements();
};

var handleKeyPressedSearchTeamName = function(keyPressEvent) {
    if (keyPressEvent && keyPressEvent.keyCode === 13) {
        clickSearchTeam();
    }
};

var handleKeyPressedSearchTeamCaptainFirst = function(keyPressEvent) {
    if (keyPressEvent && keyPressEvent.keyCode === 13) {
        clickSearchTeam();
    }
};

var handleKeyPressedSearchTeamCaptainLast = function(keyPressEvent) {
    if (keyPressEvent && keyPressEvent.keyCode === 13) {
        clickSearchTeam();
    }
};

var handleKeyPressedSearchTeamCompany = function(keyPressEvent) {
    if (keyPressEvent && keyPressEvent.keyCode === 13) {
        clickSearchTeam();
    }
};

var handleKeyPressedJoinTeamPassword = function(keyPressEvent) {
    if (keyPressEvent && keyPressEvent.keyCode === 13) {
        clickConfirmJoinTeam();
    }
};

var clickJoinTeamRadio = function() {
    clearAndHidePageMessages();
    activateJoinTeamContainer();
    deactivateLeaveTeamContainer();
};

var clickLeaveTeamRadio = function() {
    clearAndHidePageMessages();
    activateLeaveTeamContainer();
    deactivateJoinTeamContainer();
};

var clickSearchTeam = function() {
    clearAndHidePageMessages();
    jQuery("#team-search-results-container").hide();
    jQuery("#team-search-results").empty();

    var teamName = jQuery("#team-name").val()
      , teamCaptainFirstName = jQuery("#team-captain-first").val()
      , teamCaptainLastName = jQuery("#team-captain-last").val()
      , teamCompany = jQuery("#team-company").val();
    if (!teamName.trim() && !teamCompany.trim() && !teamCaptainFirstName.trim() && !teamCaptainLastName.trim()) {
        clearSearchTerms();
        jQuery("#team-search-failure").removeClass("hidden-form");
        return;
    }

    var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl()
      , params = "method=getTeamsByInfo&response_format=json"
        + YAHOO.Convio.PC2.Utils.getCommonRequestParams()
        + "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();

    if (teamName)
        params += "&team_name=" + encodeURIComponent(teamName);
    if (teamCaptainFirstName)
        params += "&first_name=" + encodeURIComponent(teamCaptainFirstName);
    if (teamCaptainLastName)
        params += "&last_name=" + encodeURIComponent(teamCaptainLastName);
    if (teamCompany)
        params += "&team_company=" + encodeURIComponent(teamCompany);

    YAHOO.log('Preparing XHR, url=' + url + ' , params=' + params);
    YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, getTeamsInfoCallback, params);
    return false;
};

var clickLeaveTeam = function() {
    // Copy the values onto the leave team page
    var leaveTeamDialog = jQuery("#leave-team-confirmation-dialog")
      , teamName = jQuery("#hd-team-name").text();
    leaveTeamDialog.find(".team-id").text(YAHOO.Convio.PC2.Component.Teamraiser.Registration.teamId);
    leaveTeamDialog.find(".team-name").text(teamName);

    YAHOO.Convio.PC2.Utils.loadView('membership','leave');
};

var leaveTeamCallback = {
    success: function(o) {
        var message = YAHOO.lang.JSON.parse(o.responseText);
        if (message.leaveTeamResponse) {
            YAHOO.Convio.PC2.Component.Teamraiser.Registration.teamId = 0;
            resetManageMembershipUI();
            // Redirect back to ../dashboard.html (from ../dashboard.html#pc2=membership-manage)
            location.href=location.href.split("#")[0];
        }
    },
    failure: function(o) {
        var message = YAHOO.lang.JSON.parse(o.responseText);
        if (message.errorResponse) {
            YAHOO.log(message.errorResponse.message);
            jQuery("#manage-membership-failure").html(message.errorResponse.message).removeClass("hidden-form");
        }
    }
};

var clickConfirmJoinTeam = function() {
    var teamInformationContainer = jQuery("#join-team-confirmation-dialog")
      , teamId = teamInformationContainer.find(".team-id").text()
      , password = teamInformationContainer.find("#join-team-password").val();
    joinTeam(teamId, password);
}

var joinTeam = function(teamId, password) {
    var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl()
      , params = "method=joinTeam&response_format=json"
      + YAHOO.Convio.PC2.Utils.getCommonRequestParams()
      + "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId()
      + "&team_id=" + teamId;

    if (password) {
        params += "&team_password=" + encodeURIComponent(password);
    }

    YAHOO.log('Preparing XHR, ' + url + '?' + params);
    YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, joinTeamCallback, params);
};

var joinTeamCallback = {
    success: function(o) {
        var message = YAHOO.lang.JSON.parse(o.responseText);
        if (message.joinTeamResponse) {
            // Redirect back to ../dashboard.html (from ../dashboard.html#pc2=membership-manage)
            location.href=location.href.split("#")[0];
            return false;
        }
    },
    failure: function(o) {
        var message = YAHOO.lang.JSON.parse(o.responseText);
        if (message.errorResponse) {
            YAHOO.log(message.errorResponse.message);
            jQuery("#join-team-failure").html(message.errorResponse.message).removeClass("hidden-form");
        }
        clearSearchResults();
    }
};

var clickConfirmLeaveTeam = function() {
    var teamInformationContainer = jQuery("#leave-team-confirmation-dialog")
      , teamId = teamInformationContainer.find(".team-id").text();
    leaveTeam();
};

var leaveTeam = function() {
    clearAndHidePageMessages();

    var url = YAHOO.Convio.PC2.Config.Teamraiser.getUrl()
      , params = "method=leaveTeam&response_format=json"
      + YAHOO.Convio.PC2.Utils.getCommonRequestParams()
      + "&fr_id=" + YAHOO.Convio.PC2.Config.Teamraiser.getFrId();

    YAHOO.log('Preparing XHR, ' + url + '?' + params);
    YAHOO.Convio.PC2.Utils.asyncRequest('POST', url, leaveTeamCallback, params);
};

var getTeamsInfoCallback = {
    success: function(o) {
        var teams = YAHOO.lang.JSON.parse(o.responseText).getTeamSearchByInfoResponse.team;
        processTeams(teams);
    },
    failure: function(o) {
        var teams = {};
        YAHOO.log(o.responseText);
        processTeams(teams);
    }
};

var processTeams = function(teams) {
    jQuery("#team-search-results").empty();

    if (typeof teams === 'undefined') {
        jQuery("#msg_cat_manage_membership_team_search_results_count").text(0);
        jQuery("#team-search-results-container").show();
        return;
    }

    // When there is only one team, the teams object is not an array, 
    // so make it an array and use standard processing techniques
    if (typeof teams.length === 'undefined') {
        teams = [teams];
    }

    var numberOfTeams = 0;
    for (var i = 0, len = teams.length; i < len; i++) {
        var team = teams[i]
          , teamId = team.id
          , teamName = team.name || "None"
          , teamPageUrl = team.teamPageURL
          , captainName = team.captainFirstName + " " + team.captainLastName
          , companyName = team.companyName || "None"
          , requiresPassword = team.requiresPassword;

        // Prevent the user from joining their current team
        if (teamId !== YAHOO.Convio.PC2.Component.Teamraiser.Registration.teamId) {
            numberOfTeams++;
            var teamResultDivElement = jQuery("#team-search-result-example :first").clone();

            teamResultDivElement.find(".team-id").text(teamId);
            teamResultDivElement.find(".team-name").html("<a target=\"_blank\" href=\"" + teamPageUrl + "\">" + teamName + "</a>");
            teamResultDivElement.find(".captain-name").text(captainName);
            teamResultDivElement.find(".company-name").text(companyName);
            teamResultDivElement.find(".requires-password").text(requiresPassword);

            teamResultDivElement.find(".join-team-button").click(function() {
                var parentDiv = jQuery(this).parent()
                  , teamId = parentDiv.find(".team-id").text()
                  , teamName = parentDiv.find(".team-name").text()
                  , teamCaptain = parentDiv.find(".captain-name").text()
                  , teamCompany = parentDiv.find(".company-name").text()
                  , requiresPassword = parentDiv.find(".requires-password").text();

                // Copy the values onto the join team page
                var joinTeamDialog = jQuery("#join-team-confirmation-dialog");
                joinTeamDialog.find(".team-id").text(teamId);
                joinTeamDialog.find(".team-name").text(teamName);
                joinTeamDialog.find(".team-captain").text(teamCaptain);
                joinTeamDialog.find(".team-company").text(teamCompany);
                if (requiresPassword === "true") {
                    joinTeamDialog.find("#join-team-password-input").removeClass("hidden-form");
                } else {
                    joinTeamDialog.find("#join-team-password-input").addClass("hidden-form");
                }

                YAHOO.Convio.PC2.Utils.loadView('membership','join');
                return;
            });

            jQuery("#team-search-results").append(teamResultDivElement);
        }
    }

    jQuery("#msg_cat_manage_membership_team_search_results_count").text(numberOfTeams);
    if (numberOfTeams > 20) {
        jQuery("#msg_cat_manage_membership_team_search_results_hint").show();
    } else {
        jQuery("#msg_cat_manage_membership_team_search_results_hint").hide();
    }
    jQuery("#team-search-results").show();
    jQuery("#team-search-results-container").show();
};