                    
                    
YAHOO.Convio.PC2.Component.Groups = {
        
    updateTimestamp: function() {
        YAHOO.Convio.PC2.Component.Groups.groupsListCriteria.timestamp = new Date().getTime();
    },

    getSelectedGroups: function() {
        var groupIds = [];
        
        var checked = YAHOO.Convio.PC2.Data.SelectedGroups;
        for(var i in checked) {
            var rec = checked[i]; 
            if(rec.checked) {
                groupIds[groupIds.length] = rec.id;
            }
        }
        
        return groupIds;
    },
    
    refreshList: function() {
        YAHOO.Convio.PC2.Component.Groups.DataSource.sendRequest(
                YAHOO.Convio.PC2.AddressBook.getAddressBookGroupsParams(YAHOO.Convio.PC2.Component.Groups.groupsListCriteria),
                { 
                    success: YAHOO.Convio.PC2.Component.Groups.DataTable.onDataReturnInitializeTable, 
                    scope: YAHOO.Convio.PC2.Component.Groups.DataTable
                }
        );
    },
    
    deleteGroupsConfirmCallback: {
        success: function(o) {
            
            /* Need to refresh groups in other views */
            YAHOO.Convio.PC2.Views.emailContactsReset = true;
            YAHOO.Convio.PC2.Views.emailContactsGroupsReset = true;
            YAHOO.Convio.PC2.Views.emailContactDetailsGroupsReset = true;
            
            YAHOO.log("Deleted groups: " + o.responseText, "debug", "groups-functions.js");
            YAHOO.Convio.PC2.Component.Groups.refreshList();
        },
        failure: function(o) {
            YAHOO.log("Failed to delete groups: " + o.responseText, "error", "groups-functions.js");
        },
        scope: this
    },
    
    deleteGroupsAction: function() {
        var selectedGroups = YAHOO.Convio.PC2.Component.Groups.getSelectedGroups();
        YAHOO.log("Delete confirmed: " + selectedGroups, "debug", "groups-functions.js");
        YAHOO.Convio.PC2.AddressBook.deleteGroups(
                YAHOO.Convio.PC2.Component.Groups.deleteGroupsConfirmCallback, 
                selectedGroups);
    },
    
    groupEditObject: {},

    groupsListCriteria: {
        count_contacts: true
    },

    formatName: function(elCell, oRecord, oColumn, sData) {
        var editLink = " <a class=\"hidden-form\" href=\"javascript: void(0);\" id=\"group_edit_link_" + oRecord.getData("id") + "\">"
            + YAHOO.util.Dom.get("msg_cat_groups_edit_group_link").innerHTML + "</a>"; 
        elCell.innerHTML = sData + editLink;
    },
    
    /**
     * This method loads the gift history
     */
    loadGroups: function(container, name_label, contacts_label) {
        YAHOO.log('Entry: loadGroups(' + container + ')', 'info', 'groups-functions.js');
        YAHOO.namespace("Convio.PC2.Data");
        YAHOO.Convio.PC2.Data.SelectedGroups = [];
        var DataSource = YAHOO.util.DataSource,
        DataTable  = YAHOO.widget.DataTable;
    
        /* Column Definitions */
        var myColumnDefs = [
            {label:" ", key:"checked", formatter:"checkbox", className: "groups-list-checkbox" },
            {label: name_label, key:"name", formatter: YAHOO.Convio.PC2.Component.Groups.formatName, className: "groups-list-name border-left-none"},
            {label: contacts_label, key:"contactsCount", className: "groups-list-contacts"}
        ];
    
        YAHOO.Convio.PC2.Component.Groups.DataSource = new YAHOO.util.XHRDataSource(YAHOO.Convio.PC2.Config.AddressBook.getUrl());
        YAHOO.Convio.PC2.Component.Groups.DataSource.responseType = YAHOO.util.DataSource.TYPE_JSON;
        YAHOO.Convio.PC2.Component.Groups.DataSource.connXhrMode = "queueRequests";
        YAHOO.Convio.PC2.Component.Groups.DataSource.connMethodPost = true;
        YAHOO.Convio.PC2.Component.Groups.DataSource.responseSchema = {
                resultsList: "getAddressBookGroupsResponse.group",
                fields: ["id","name","contactsCount"]
        };
        
        YAHOO.Convio.PC2.Component.Groups.DataSource.doBeforeParseData = function (oRequest, oFullResponse, oCallback) {
            YAHOO.Convio.PC2.Data.SelectedGroups = [];
            if(YAHOO.lang.isUndefined(oFullResponse.getAddressBookGroupsResponse.group)) {
                // hack: if messageItem does not exist, insert an empty list
                oFullResponse.getAddressBookGroupsResponse.group = [];
            }
            return oFullResponse;    
        };
    
        var buildGroupsQueryString = function(state, dt) {
            var result = YAHOO.Convio.PC2.AddressBook.getAddressBookGroupsParams(YAHOO.Convio.PC2.Component.Groups.groupsListCriteria);
            YAHOO.log("Built query: " + result, "info", "groups-functions.js");
            return result;
        };

        var myTableConfig = {
                initialRequest         	: YAHOO.Convio.PC2.AddressBook.getAddressBookGroupsParams(YAHOO.Convio.PC2.Component.Groups.groupsListCriteria),
                generateRequest        	: buildGroupsQueryString,
                dynamicData             : true
        };
    
        try {
            YAHOO.Convio.PC2.Component.Groups.DataTable = new YAHOO.widget.DataTable(
                    container,
                    myColumnDefs,
                    YAHOO.Convio.PC2.Component.Groups.DataSource, 
                    myTableConfig
            );
        } catch(e) {
            YAHOO.log(e, 'error', 'groups-functions.js');
        }
        
        YAHOO.Convio.PC2.Component.Groups.DataTable.subscribe("checkboxClickEvent", function(oArgs){
            var elCheckbox = oArgs.target;
            var oRecord = YAHOO.Convio.PC2.Component.Groups.DataTable.getRecord(elCheckbox);
            var myId = oRecord.getData("id")
            var newRec = { 
                id: myId, 
                checked: elCheckbox.checked
            };
            YAHOO.Convio.PC2.Data.SelectedGroups[myId] = newRec;
            YAHOO.log('added {id: ' + newRec.id + ', checked: ' + newRec.checked + '}', 'info', 'groups-functions.js');
            oRecord.setData("checked",elCheckbox.checked);
        });
        
        YAHOO.Convio.PC2.Component.Groups.DataTable.subscribe('cellClickEvent',function(oArgs) {
            var target = oArgs.target;
            var column = YAHOO.Convio.PC2.Component.Groups.DataTable.getColumn(target);
            if (column.key == "name") {
                var record = YAHOO.Convio.PC2.Component.Groups.DataTable.getRecord(target);
                var groupId = record.getData("id");
                var groupName = record.getData("name");
                
                //alert("Fix me! " + groupId);
                
                YAHOO.Convio.PC2.Component.Groups.groupEditObject.showFor(groupId, groupName);
                //YAHOO.Convio.PC2.Utils.loadView("email", "contactdetails");
                //window.location.href="contact_details.html?contact_id=" + record.getData("id");
            }
        });
        
        YAHOO.Convio.PC2.Component.Groups.DataTable.subscribe('cellMouseoverEvent',function(oArgs) {
            var target = oArgs.target;
            var column = YAHOO.Convio.PC2.Component.Groups.DataTable.getColumn(target);
            if (column.key == "name") {
                var record = YAHOO.Convio.PC2.Component.Groups.DataTable.getRecord(target);
                groupId = record.getData("id");
                show_pc2_element("group_edit_link_" + groupId);
            }
        });
        YAHOO.Convio.PC2.Component.Groups.DataTable.subscribe('cellMouseoutEvent',function(oArgs) {
            var target = oArgs.target;
            var column = YAHOO.Convio.PC2.Component.Groups.DataTable.getColumn(target);
            if (column.key == "name") {
                var record = YAHOO.Convio.PC2.Component.Groups.DataTable.getRecord(target);
                groupId = record.getData("id");
                hide_pc2_element("group_edit_link_" + groupId);
            }
        });
        
        var MsgCatProvider = YAHOO.Convio.PC2.Component.Content;
        YAHOO.Convio.PC2.Component.Groups.DataTable.setAttributeConfig("MSG_EMPTY", {value: MsgCatProvider.getMsgCatValue('data_table_message_empty') });
    
        YAHOO.log("Exit: loadGroups(" + container + ")", "info", "groups-functions.js");
    }
    
    
};

YAHOO.Convio.PC2.Component.Groups.EditGroupDialog = function(formContainer, labels) {
    YAHOO.log("Creating EditGroupDialog", "info", "groups-functions.js");
    
    try {
        this.EditGroupCallback = {
            success: function(o) {
                YAHOO.Convio.PC2.Component.Groups.refreshList();
                
                /* Need to refresh groups in other views */
                YAHOO.Convio.PC2.Views.emailContactsGroupsReset = true;
                YAHOO.Convio.PC2.Views.emailContactDetailsGroupsReset = true;
                
                this.parent.hide();
            },
            
            failure: function(o) {
                var err = YAHOO.lang.JSON.parse(o.responseText).errorResponse.message;
                var errElm = YAHOO.util.Dom.get(this.parent.ErrorDiv);
                YAHOO.util.Dom.removeClass(errElm, "hidden-form");
                errElm.innerHTML = err;
                
                YAHOO.log(o.responseText, "error", "groups-functions.js");
            },
            
            parent: this
        };
        
        // Define various event handlers for Dialog
        this.handleSubmit = function() {
        	try {
                var data = this.getData();
                YAHOO.util.Dom.addClass(this.ErrorDiv, "hidden-form");
                if (YAHOO.lang.trim(data.group_name_edit) == "") {
                	var errElm = YAHOO.util.Dom.get(this.ErrorDiv);
                	var err = document.getElementById('msg_cat_group_name_update_empty_error').innerHTML;
                	errElm.innerHTML = err;
                	YAHOO.util.Dom.removeClass(errElm, "hidden-form");
                	YAHOO.log('Error with EditGroupDialog.handleSubmit: ' + err, 'error', 'groups-functions.js');
                } else {
                	
	                // Update the remote value asynchronously                
	                YAHOO.Convio.PC2.AddressBook.updateGroup(this.EditGroupCallback, data.group_id_edit, data.group_name_edit);
        		}                                
            } catch(e) {
                YAHOO.log('Error with EditGroupDialog.handleSubmit: ' + e, 'error', 'groups-functions.js');
            }
        };
        
        this.handleCancel = function() {
            this.cancel();
            YAHOO.util.Dom.addClass(this.ErrorDiv, "hidden-form");
            this.form.reset();
        };
        
        this.showFor = function(groupId, groupName) {
            YAHOO.util.Dom.get("group_name_edit").value = groupName;
            YAHOO.util.Dom.get("group_id_edit").value = groupId;
            this.show();
        };
        
        var dialogConfig = {
            width : "400px",
            modal: true, 
            visible : false, 
            close: false,
            buttons : [ { text: YAHOO.util.Dom.get("msg_cat_dialog_save_label").innerHTML, handler:this.handleSubmit, isDefault:true },
                        { text: YAHOO.util.Dom.get("msg_cat_dialog_cancel_label").innerHTML, handler:this.handleCancel } ]
        };
        
        YAHOO.Convio.PC2.Component.Groups.EditGroupDialog.superclass.constructor.call(
            this, 
            formContainer || YAHOO.util.Dom.generateId(), 
            dialogConfig
        );
        
        this.ErrorDiv = YAHOO.util.Dom.generateId();
        this.setHeader(labels.editGroupHeader);
        this.setBody(  '<div class="hidden-form failure-message" id="'  + this.ErrorDiv + '">&nbsp;</div>'
                     + '<form action="javascript: void(0);">' 
                     + '<input type="hidden" id="group_id_edit" name="group_id_edit" value="" />'
                     + '<label for="group_name_edit">' + labels.groupLabel + '</label> <input type="textbox" id="group_name_edit" name="group_name_edit"  />' 
                     + '</form>');
        //YAHOO.util.Dom.setStyle(this.body, 'textAlign', 'center');
        this.render(document.body);
    } catch(e) {
        YAHOO.log("Error creating EditGroupDialog: " + e, "error", "groups-functions.js");
    }
};

YAHOO.Convio.PC2.Component.Groups.AddGroupDialog = function(formContainer, labels) {
    YAHOO.log("Creating AddGroupDialog", "info", "groups-functions.js");
    
    try {
        this.AddGroupCallback = {
            success: function(o) {
                YAHOO.Convio.PC2.Component.Groups.refreshList();
                
                /* Need to refresh groups in other views */
                YAHOO.Convio.PC2.Views.emailContactsGroupsReset = true;
                YAHOO.Convio.PC2.Views.emailContactDetailsGroupsReset = true;
                
                this.parent.hide();
                this.parent.form.reset();
            },
            
            failure: function(o) {
                var err = YAHOO.lang.JSON.parse(o.responseText).errorResponse.message;
                var errElm = YAHOO.util.Dom.get(this.parent.ErrorDiv);
                YAHOO.util.Dom.removeClass(errElm, "hidden-form");
                errElm.innerHTML = err;
                
                YAHOO.log(o.responseText, "error", "groups-functions.js");
            },
            
            parent: this
        };
        
        // Define various event handlers for Dialog
        this.handleSubmit = function() {
            try {
                var data = this.getData();
                
                YAHOO.util.Dom.addClass(this.ErrorDiv, "hidden-form");
                // Update the remote value asynchronously
                YAHOO.Convio.PC2.AddressBook.addGroup(this.AddGroupCallback, data.group_name_add);
                                
            } catch(e) {
                YAHOO.log('Error with AddGroupDialog.handleSubmit: ' + e, 'error', 'groups-functions.js');
            }
        };

        this.doSubmit = function(){
            this.handleSubmit();
        };
        
        this.handleCancel = function() {
            this.cancel();
            YAHOO.util.Dom.addClass(this.ErrorDiv, "hidden-form");
            this.form.reset();
        };
        
        var dialogConfig = {
            width : "400px",
            modal: true, 
            visible : false, 
            close: false,
            buttons : [ { text: YAHOO.util.Dom.get("msg_cat_dialog_save_label").innerHTML, handler:this.handleSubmit, isDefault:true },
                        { text: YAHOO.util.Dom.get("msg_cat_dialog_cancel_label").innerHTML, handler:this.handleCancel } ]
        };
        
        YAHOO.Convio.PC2.Component.Groups.AddGroupDialog.superclass.constructor.call(
            this, 
            formContainer || YAHOO.util.Dom.generateId(), 
            dialogConfig
        );
        
        this.ErrorDiv = YAHOO.util.Dom.generateId();
        this.setHeader(labels.addGroupHeader);
        this.setBody(  '<div class="hidden-form failure-message" id="'  + this.ErrorDiv + '">&nbsp;</div>'
                     + '<form action="javascript: void(0);">' 
                     + '<label for="group_name_add">' + labels.groupLabel + '</label> <input type="textbox" id="group_name_add" name="group_name_add"  />' 
                     + '</form>');
        
        this.render(document.body);
    } catch(e) {
        YAHOO.log("Error creating AddGroupDialog: " + e, "error", "groups-functions.js");
    }
};