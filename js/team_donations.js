/**
 * Closes this window.
 * @member Utils
 */
//TODO DSW Vernon 42928 Move this method to a common js library file?
function closeWin() {
    var isIE = (navigator.appName.indexOf("Microsoft") != -1 && navigator.appName.indexOf("Mac") == -1);

    if (isIE) {
        window.close();
    } else {
        self.close();
    }
};

function addLogger() {
    if(YAHOO.Convio.PC2.Config.isLoggingEnabled()) {
        var myLogReader = new YAHOO.widget.LogReader("yui-logging");
    }
};

function doValidation() {
    YAHOO.Convio.PC2.Config.validate();
};

function loadComponents() {
    
    var keys = [
                'team_donations_heading','team_donations_close'
    ];
    YAHOO.Convio.PC2.Component.Content.loadMsgCatalog(keys,'trpc');
    
    var trConfig = {
        initDone: function() {
            if(YAHOO.Convio.PC2.Component.Teamraiser.Registration.teamId > 0) {
                
                customListCriteria = {
                    pageSize : 500,
                    pageOffset : 0,
                    sortColumn : 'date_recorded',
                    isAscending : 'false',
                    totalResult : 0
                };
                
                YAHOO.Convio.PC2.Component.TeamGiftHistory.loadCustomTeamGiftHistory("team-donations-block", customListCriteria, false);
            }
            YAHOO.Convio.PC2.Utils.hideLoadingContainer();
            YAHOO.log('TR init finished','info','team_donations.js');
        }
    };
    YAHOO.Convio.PC2.Component.Teamraiser.initialize(trConfig);

    var consConfig = {
        name: 'hd-user-name'
    };
    
};