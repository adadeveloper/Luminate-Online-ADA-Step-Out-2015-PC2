YAHOO.Convio.PC2.Component.Contacts = {
		
    updateTimestamp: function() {
        YAHOO.Convio.PC2.Component.Contacts.contactsListCriteria.timestamp = new Date().getTime();
    },
    
    /**
     * Set flag(s) that indicate subsequent view renders should fetch fresh contact/gropu data.
     */
    markCachedContactsAsDirty: function () {
    	if (YAHOO.Convio.PC2.Component.Contacts) {
     	   YAHOO.Convio.PC2.Component.Contacts.updateTimestamp();
        }
	   YAHOO.Convio.PC2.Views.emailContactsReset = true;
	   YAHOO.Convio.PC2.Views.emailGroupsReset = true;
	   YAHOO.Convio.PC2.Views.emailContactsGroupsReset = true;
	   YAHOO.Convio.PC2.Views.emailContactDetailsGroupsReset = true;
    },

    updateABFilter: function(filter) {
        YAHOO.log("Entered updateABFilter","info","contacts-functions.js");
        
        YAHOO.Convio.PC2.Component.Contacts.contactsListCriteria.tr_ab_filter = filter;
        YAHOO.Convio.PC2.Component.Contacts.Paginator.reset();
    },
    
    updateSelectedCount: function() {
    	if(YAHOO.Convio.PC2.Component.Contacts.contactViewType == 'individuals') {
    		var contactIds = YAHOO.Convio.PC2.Component.Contacts.getSelectedContacts();
    		if(contactIds.length > 0) {
    			show_pc2_element("count_selected_block");
    			YAHOO.util.Dom.get("count_selected").innerHTML = contactIds.length;
    		} else {
    			hide_pc2_element("count_selected_block");
    			YAHOO.util.Dom.get("count_selected").innerHTML = 0;
    		}
    		hide_pc2_element("count_groups_selected_block");
			YAHOO.util.Dom.get("count_groups_selected").innerHTML = 0;
    	} else {
    		var groupIds = YAHOO.Convio.PC2.Component.Contacts.getSelectedGroupsFilters();
    		if(groupIds.length > 0) {
    			show_pc2_element("count_groups_selected_block");
    			YAHOO.util.Dom.get("count_groups_selected").innerHTML = groupIds.length;
    		} else {
    			hide_pc2_element("count_groups_selected_block");
    			YAHOO.util.Dom.get("count_groups_selected").innerHTML = 0;
    		}
    		hide_pc2_element("count_selected_block");
			YAHOO.util.Dom.get("count_selected").innerHTML = 0;
    	}
    },
    
    getSelectedContacts: function() {
        var contactIds = [];

        if(!YAHOO.Convio.PC2.Component.Contacts.DataTable) {
            contactIds[0] = YAHOO.Convio.PC2.Utils.getUrlParam("contact_id");
            YAHOO.log("Returning contactId from URL for getSelectedContacts", "info", "contacts-functions.js");
            return contactIds;
        }
        
        var checked = YAHOO.Convio.PC2.Data.SelectedContacts;
        for(var i in checked) {
            var rec = checked[i]; 
            if(rec.checked) {
                contactIds[contactIds.length] = rec.id;
            }
        }
        
        return contactIds;
    },
    
    getSelectedFiltersString: function() {
    	var groupFilters = YAHOO.Convio.PC2.Component.Contacts.getSelectedGroupsFilters();
    	var groupFilterString = '';
    	for(var i in groupFilters) {
    		groupFilterString += groupFilters[i] + ';';
    	}
    	return groupFilterString.substring(0,groupFilterString.length-1);
    },
    
    getSelectedGroupsFilters: function(byGroupId) {
        var groupfilterValues = [];

        if(!YAHOO.Convio.PC2.Component.Contacts.GroupsDataTable) {
            return groupfilterValues;
        }
        
        var checked = YAHOO.Convio.PC2.Data.SelectedContactGroups;
        var counter = 0;
        for(var i in checked) {
            var rec = checked[i]; 
            if(!YAHOO.lang.isUndefined(rec)) {
            	if(rec.checked) {
            		if(byGroupId && rec.groupId != null) {
            			groupfilterValues[counter++] = rec.groupId;
            		} else {
            			groupfilterValues[counter++] = rec.filterValue;
            		}
            	}
            }
        }
        
        return groupfilterValues;
    },
    
    contactsListCriteria: {
        pageSize: 25,
        pageOffset: 0,
        sortColumn: 'lastName',
        isAscending: 'true',
        totalResult: 0
    },
    
    /**
     * This method loads the gift history
     */
    loadContacts: function(container, name_label, email_label, amount_label, previous_amount_label, groups_label, 
    		email_sent_label, email_opened_label, page_visits_label, donations_label, groups_header_label) {
        YAHOO.log('Entry: loadContacts(' + container + ')', 'info', 'contacts-functions.js');
        YAHOO.namespace("Convio.PC2.Data");
        YAHOO.Convio.PC2.Data.SelectedContacts = [];
        YAHOO.Convio.PC2.Data.SelectedContactGroups = [];
        var DataSource = YAHOO.util.DataSource,
        DataTable  = YAHOO.widget.DataTable,
        Paginator  = YAHOO.widget.Paginator;
        
        function formatData(sData) {
        	var data = "";
        	if(sData == 0) {
        		data += '<span class="gray-item">' + sData + '</span>';
        	} else {
        		data += sData;
        	}
        	return data;
        }
        
        function formatContactsDate(date) {
        	var data = "";
        	if(date) {
        	  data += "<p class=\"date-item\">" + formatDateFromMillis(date) + "</p>";
        	}
        	return data;
        };
        
    
        /* Custom Cell Formatter */
        this.formatName = function(elCell, oRecord, oColumn, sData) {
        	
            var fName = oRecord.getData("firstName");
            var lName = sData;
            if(!YAHOO.lang.isString(fName)) {
                fName = "";
            }
            if(!YAHOO.lang.isString(lName)) {
                lName = "";
            }
            var name = fName + ' ' + lName;
            if(name == ' ') {
            	name = MsgCatProvider.getMsgCatValue('contact_no_name_label');
            }
            
            var id = oRecord.getData().id;
            // TODO DSW Snowbird Define and use a global utility function for the escape logic below
            var innerHtml = '<div class="contact-list-name no-wrap" title="' + name.replace(/"/g, '\\"').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '" onclick="YAHOO.Convio.PC2.Component.Contacts.loadContactView(' + id + ');">';
            innerHtml += name;
            innerHtml += '</div>';
            
            var email = oRecord.getData().email;
            if(email && email != null && YAHOO.lang.isString(email)) {
            	// TODO DSW Snowbird Define and use a global utility function for the escape logic below
            	innerHtml += '<div class="no-wrap"><p class="email-address" onclick="YAHOO.Convio.PC2.Component.Contacts.loadComposeView(' + id + ');" title="' + email.replace(/"/g, '\\"').replace(/</g, '&lt;').replace(/>/g, '&gt;') +'">' + email + '</p><div>';
            }
            elCell.innerHTML = '<div>' + innerHtml + '</div>';
            elCell.tabIndex = -1;
            elCell.setAttribute('role','presentation');
            if(YAHOO.Convio.PC2.Component.Contacts.contactViewType == 'groups') {
            	jQuery(elCell).parents('td:eq(0)').addClass('left-group-border');
            }
        };
        
        this.formatIcons = function(elCell, oRecord, oColumn, sData) {
        	var innerHtml = '';
            var acknowledged = oRecord.getData().acknowledged;
            if(acknowledged && acknowledged == 'false') {
            	var contactId = oRecord.getData("id");
            	var MsgCatProvider = YAHOO.Convio.PC2.Component.Content;
            	var acknowledgeGiftTitle = MsgCatProvider.getMsgCatValue('contacts_acknowledge_gift_title_label');
            	innerHtml += '<div class="follow-up" id="acknowledge-' + contactId + '" title="' + acknowledgeGiftTitle + '"><a href="javascript:YAHOO.Convio.PC2.Component.Contacts.acknowledgeGift(' + contactId;
            	var email = oRecord.getData('email'); 
            	if(!YAHOO.lang.isUndefined(email) && email != null) {
            		innerHtml += ', true';
            	}
            	innerHtml += ');">'; 
            	innerHtml += '<img src="images/followup.png" onmouseout="this.src=\'images/followup.png\';" onmouseover="this.src=\'images/followup-hover.png\';" /></a></div>';
            }
            elCell.innerHTML = innerHtml;
            elCell.tabIndex = -1;
            elCell.setAttribute('role','presentation');
        };
        
        /* Custom Cell Formatter */
        this.formatEmail = function(elCell, oRecord, oColumn, sData) {
            var email = sData;
            if(YAHOO.lang.isString(sData)) {
                elCell.innerHTML = sData;
            } else {
                elCell.innerHTML = " ";
            }
            elCell.tabIndex = -1;
            elCell.setAttribute('role','presentation');
        };
    
        this.formatAmount = function(elCell, oRecord, oColumn, sData) {
        	var isZero = (sData == 0);
            var amount = YAHOO.Convio.PC2.Utils.formatCurrency(sData);
            
            var innerHtml = '';
            if(isZero) {
            	innerHtml = '<span class="large-amount-text gray-item">' + amount + '</span>';
            } else {
            	innerHtml = '<span class="large-amount-text">' + amount + '</span>';
            }
            elCell.innerHTML = innerHtml;
            elCell.tabIndex = -1;
            elCell.setAttribute('role', 'presentation');
        };
        
        this.formatPreviousAmount = function(elCell, oRecord, oColumn, sData) {
        	var isZero = (sData == 0);
            var amount = YAHOO.Convio.PC2.Utils.formatCurrency(sData);
            
            var innerHtml = '';
            if(isZero) {
            	innerHtml = '<span class="gray-item">' + amount + '</span>';
            } else {
            	innerHtml = amount;
            }
            elCell.innerHTML = innerHtml;
            elCell.tabIndex = -1;
            elCell.setAttribute('role', 'presentation');
        };
        
        this.formatEmailSent = function(elCell, oRecord, oColumn, sData) {
        	var innerHtml = formatData(sData);
        	innerHtml += formatContactsDate(oRecord.getData().lastMessageSentDate);

        	elCell.innerHTML = innerHtml;
            elCell.tabIndex = -1;
            elCell.setAttribute('role', 'presentation');
        };
        
        this.formatEmailOpened = function(elCell, oRecord, oColumn, sData) {
        	var innerHtml = formatData(sData);
        	innerHtml += formatContactsDate(oRecord.getData().lastMessageOpenDate);
        	elCell.innerHTML = innerHtml;
            elCell.tabIndex = -1;
            elCell.setAttribute('role', 'presentation');
        };
        
        this.formatPageVisits = function(elCell, oRecord, oColumn, sData) {
        	var innerHtml = formatData(sData);
        	innerHtml += formatContactsDate(oRecord.getData().lastClickThroughDate);
        	elCell.innerHTML = innerHtml;
            elCell.tabIndex = -1;
            elCell.setAttribute('role', 'presentation');
        };
        
        this.formatGroups = function(elCell, oRecord, oColumn, sData) {
            if(sData) {
                if(sData.length) {
                    var str = "";
                    for(var i=0; i < sData.length; i++) {
                        str += '<span><a href="javascript: loadGroupsView(' + sData[i].id + ')" title="' + sData[i].name + '">' + sData[i].name + '</a></span>';
                    }
                    elCell.innerHTML = str;
                } else {
                    elCell.innerHTML = '<a href="javascript: loadGroupsView(' + sData.id + ')" title="' + sData.name + '">' + sData.name + '</a>';
                }
            }
        }
        
        this.formatRemoveGroup = function(elCell, oRecord, oColumn, sData) {
        	var contactId = oRecord.getData().id;
        	var innerHtml = '<a id="remove-group-' + contactId + '" href="javascript:YAHOO.Convio.PC2.Component.Contacts.removeContactFromGroup(\'';
        	innerHtml += contactId + '\');" title="' + MsgCatProvider.getMsgCatValue('contacts_contact_remove_group_title') + '">';
        	innerHtml += '<img src="images/remove.png" onmouseout="this.src=\'images/remove.png\';" onmouseover="this.src=\'images/remove_hover.png\';"/></a></div>';
        	innerHtml += '</a>';
        	elCell.innerHTML = innerHtml;
        	elCell.tabIndex = -1;
        	elCell.setAttribute('role', 'presentation');
        }
        
        var MsgCatProvider = YAHOO.Convio.PC2.Component.Content;
        var selectorStr = '<span class="paginatorContactSelector" id="select-link-actions-bottom">(<span>' +
          MsgCatProvider.getMsgCatValue('contacts_select_label') +' </span>' +
          '<a href="javascript: selectAll();">' + MsgCatProvider.getMsgCatValue('contacts_select_all_link') + '</a>' +
          ' or <a href="javascript: selectNone();">' + MsgCatProvider.getMsgCatValue('contacts_select_none_link') + '</a>)' +
          '</span>';
        /* Column Definitions */
        var myColumnDefs = [];
        var index = 0;
        myColumnDefs[index++] = {label:" ", key:"checked", formatter:"checkbox", className: "td-align-top"};
        myColumnDefs[index++] = {label: name_label, key:"lastName", formatter: this.formatName, className: "contact-list-name border-left-none", sortable: true, width: 150};
        myColumnDefs[index++] = {label: "", key: "icons", formatter: this.formatIcons, className: "contact-list-icons border-left-none border-right-double", sortable: false};
        myColumnDefs[index++] = {label: groups_label, key:"group", formatter: this.formatGroups, className: "group-column"};
        myColumnDefs[index++] = {label: '', key: 'removeGroup', formatter: this.formatRemoveGroup, className: "align-right"};
        
        var emailChildren = [];
        var emailChildrenIndex = 0;
        emailChildren[emailChildrenIndex++] = {label: email_sent_label, key:"messagesSent", className: "column-set-width", formatter: this.formatEmailSent, sortable: true};
        
        var emailStatsEnabled = YAHOO.Convio.PC2.Data.TeamraiserConfig && YAHOO.Convio.PC2.Data.TeamraiserConfig.emailStatisticsEnabled == 'true';
        if(emailStatsEnabled) {
        	emailChildren[emailChildrenIndex++] = {label: email_opened_label, key:"messagesOpened", className: "column-set-width", formatter: this.formatEmailOpened, sortable: true};
        }
        myColumnDefs[index++] = {label: email_label, key: "email", className:"th-align-center", children: emailChildren};
        if(emailStatsEnabled) {
        	myColumnDefs[index++] = {label: page_visits_label, key:"clickThroughs", className: "th-align-center column-set-width", formatter: this.formatPageVisits, sortable: true};
        }
        var amountChildren = [];
        var amountChildrenIndex = 0;
        if (YAHOO.Convio.PC2.Data.Registration.previousEventParticipant == 'true')
        {
        	amountChildren[amountChildrenIndex++] = {label: previous_amount_label, key: "previousAmountRaised", formatter: this.formatPreviousAmount, className: "border-left align-right th-align-center", sortable: true}; 
        }
        amountChildren[amountChildrenIndex++] = {label: amount_label, key:"amountRaised", formatter: this.formatAmount, className: "border-left align-right th-align-center", sortable: true};
        myColumnDefs[index++] = {label: donations_label, key:"donations", className:"th-align-center", children: amountChildren};
        
        YAHOO.Convio.PC2.Component.Contacts.DataSource = new YAHOO.util.XHRDataSource(YAHOO.Convio.PC2.Config.Teamraiser.getUrl());
        YAHOO.Convio.PC2.Component.Contacts.DataSource.responseType = YAHOO.util.DataSource.TYPE_JSON;
        YAHOO.Convio.PC2.Component.Contacts.DataSource.connXhrMode = "queueRequests";
        YAHOO.Convio.PC2.Component.Contacts.DataSource.connMethodPost = true;
        YAHOO.Convio.PC2.Component.Contacts.DataSource.responseSchema = {
                resultsList: "getTeamraiserAddressBookContactsResponse.addressBookContact",
                metaFields: {
                    totalRecords: "getTeamraiserAddressBookContactsResponse.totalNumberResults"
                },
                fields: ["id","firstName","lastName","email","amountRaised", "previousAmountRaised", "group", 
                         "messagesSent", "messagesOpened", "clickThroughs", 
                         "lastMessageSentDate", "lastMessageOpenDate", "lastClickThroughDate", "acknowledged"]
        };
        
        YAHOO.Convio.PC2.Component.Contacts.DataSource.doBeforeParseData = function (oRequest, oFullResponse, oCallback) {
            if(YAHOO.lang.isUndefined(oFullResponse.getTeamraiserAddressBookContactsResponse.addressBookContact)) {
                // hack: if messageItem does not exist, insert an empty list
                oFullResponse.getTeamraiserAddressBookContactsResponse.addressBookContact = [];
            }
            return oFullResponse;    
        };
    
        var buildQueryString = function(state, dt) {
        	
        	
        	YAHOO.Convio.PC2.Component.Contacts.contactsListCriteria.pageOffset = (state.pagination.page - 1);
        	if(state.sortedBy != null)
        	{
	            YAHOO.Convio.PC2.Component.Contacts.contactsListCriteria.sortColumn = state.sortedBy.key;
	            if(state.sortedBy.dir == "yui-dt-asc")
	            	{YAHOO.Convio.PC2.Component.Contacts.contactsListCriteria.isAscending = "true";}
	            else
	            	{YAHOO.Convio.PC2.Component.Contacts.contactsListCriteria.isAscending = "false";}
        	}
            YAHOO.Convio.PC2.Component.Contacts.contactsListCriteria.pageSize = state.pagination.rowsPerPage;
            return YAHOO.Convio.PC2.Teamraiser.getAddressBookContactsParams(YAHOO.Convio.PC2.Component.Contacts.contactsListCriteria);
        };
        
        var maxPageSize = 500;
        if(YAHOO.Convio.PC2.Data.TeamraiserConfig != null)
        	{maxPageSize =  YAHOO.Convio.PC2.Data.TeamraiserConfig.pagingMaxPageSize; }
        // determine values for rows per page dropdown 
        var rowsPerPageArray;
        if(maxPageSize == 25)
        	{rowsPerPageArray = [25];}
        if(maxPageSize > 25 && maxPageSize <= 50)
        	{rowsPerPageArray = [25,maxPageSize];}
        if(maxPageSize > 50 && maxPageSize <= 100)
        	{rowsPerPageArray = [25,50,maxPageSize];}
        if(maxPageSize > 100 && maxPageSize <= 500)
        	{rowsPerPageArray = [25,50,100,maxPageSize];}
        if(maxPageSize > 500)
        	{rowsPerPageArray = [25,50,100,500,maxPageSize];}
        
        var myPaginator = new Paginator(
				// see http://developer.yahoo.com/yui/docs/YAHOO.widget.Paginator.html for config documentation
				{
					containers : [ 'lower_contacts_pagination_block' /*took out 'upper_contacts_pagination_block'*/ ], 
					pageLinks : 5,
					rowsPerPage : YAHOO.Convio.PC2.Component.Contacts.contactsListCriteria.pageSize,
					template : selectorStr + "<span class=\"paginatorPageNumber\"><span class=\"paginatorPageSize\">" + MsgCatProvider.getMsgCatValue('data_table_contacts_per_page')  + ":&nbsp;{RowsPerPageDropdown}</span><span class=\"paginatorPageNumber\">&nbsp;{FirstPageLink}&nbsp;{PreviousPageLink}&nbsp;{CurrentPageReport}&nbsp;{NextPageLink}&nbsp;{LastPageLink}</span>",
					firstPageLinkLabel : "&laquo;",
					firstPageLinkTitle : MsgCatProvider.getMsgCatValue('paginator_first_page_title'),
					previousPageLinkLabel : "&lsaquo;",
					previousPageLinkTitle : MsgCatProvider.getMsgCatValue('paginator_previous_page_title'),
					nextPageLinkLabel : "&rsaquo;",
					nextPageLinkTitle : MsgCatProvider.getMsgCatValue('paginator_next_page_title'),
					lastPageLinkLabel : "&raquo;",
					lastPageLinkTitle : MsgCatProvider.getMsgCatValue('paginator_last_page_title'),
					pageReportTemplate : "<b>{startRecord}-{endRecord}</b> " + MsgCatProvider.getMsgCatValue('paginator_of') + " {totalRecords}",
					// Options for RowsPerPageDropdown component
					rowsPerPageOptions : rowsPerPageArray
					//updateOnChange: true
				}
        );
        
        YAHOO.Convio.PC2.Component.Contacts.Paginator = myPaginator;
        YAHOO.Convio.PC2.Component.Contacts.Paginator.reset = function() {
            
            YAHOO.Convio.PC2.Data.SelectedContacts = [];
            YAHOO.Convio.PC2.Component.Contacts.updateSelectedCount();
            
            if(YAHOO.Convio.PC2.Component.Contacts.Paginator.getTotalRecords() == 1) {
                YAHOO.Convio.PC2.Component.Contacts.Paginator.fireEvent('changeRequest',YAHOO.Convio.PC2.Component.Contacts.Paginator.getState({'page':1}));
            } else {
                YAHOO.Convio.PC2.Component.Contacts.Paginator.setTotalRecords(1);
            }
        };
        
        var myTableConfig = {
                initialRequest         : YAHOO.Convio.PC2.Teamraiser.getAddressBookContactsParams(YAHOO.Convio.PC2.Component.Contacts.contactsListCriteria),
                generateRequest        : buildQueryString,
                paginationEventHandler : DataTable.handleDataSourcePagination,
                paginator              : myPaginator,
                dynamicData            : true,
                summary                : MsgCatProvider.getMsgCatValue('contacts_contacts_table_summary_desc'),
                MSG_LOADING			   : MsgCatProvider.getMsgCatValue('contacts_contacts_table_loading'),
                MSG_SORTASC            : MsgCatProvider.getMsgCatValue('data_table_click_sort_asc'),
                MSG_SORTDESC           : MsgCatProvider.getMsgCatValue('data_table_click_sort_desc')

        };
    
        try {
            YAHOO.Convio.PC2.Component.Contacts.DataTable = new YAHOO.widget.DataTable(
                    container,
                    myColumnDefs,
                    YAHOO.Convio.PC2.Component.Contacts.DataSource, 
                    myTableConfig
            );
        } catch(e) {
            YAHOO.log(e, 'error', 'contacts-functions.js');
        }
    
        YAHOO.Convio.PC2.Component.Contacts.DataTable.handleDataReturnPayload = function(oRequest, oResponse, oPayload) {
            var totalRecords = oResponse.meta.totalRecords;
            if(!YAHOO.lang.isUndefined(oPayload)) {
            	oPayload.totalRecords = totalRecords;
            }
            return oPayload;
        };
        
        YAHOO.Convio.PC2.Component.Contacts.DataTable.subscribe("checkboxClickEvent", function(oArgs){
            var elCheckbox = oArgs.target;
            var oRecord = YAHOO.Convio.PC2.Component.Contacts.DataTable.getRecord(elCheckbox);
            var myId = oRecord.getData("id")
            var newRec = { 
                id: myId, 
                checked: elCheckbox.checked
            };
            YAHOO.Convio.PC2.Data.SelectedContacts[myId] = newRec;
            YAHOO.log('added {id: ' + newRec.id + ', checked: ' + newRec.checked + '}', 'info', 'contacts-functions.js');
            oRecord.setData("checked",elCheckbox.checked);
            
            YAHOO.Convio.PC2.Component.Contacts.updateSelectedCount();
        });
        
        YAHOO.Convio.PC2.Component.Contacts.loadContactView = function(id) {
        	contactId = id;
        	YAHOO.Convio.PC2.Utils.loadView("email", "contactdetails");
        };
        
        YAHOO.Convio.PC2.Component.Contacts.loadComposeView = function(contactId) {
        	YAHOO.Convio.PC2.Views.contactIds = contactId;
            YAHOO.Convio.PC2.Utils.loadView("email","compose");
        };
          
        myPaginator.subscribe('pageChange', function(oAargs) {
                var rs = YAHOO.Convio.PC2.Component.Contacts.DataTable.getRecordSet();
                var paginator = YAHOO.Convio.PC2.Component.Contacts.Paginator;
                
                var len = rs.getLength();
                var j=0;
                
                for(var i=paginator.getStartIndex(); i < len; i++) {
                    var rec = rs.getRecord(i);
                    var checkRec = YAHOO.Convio.PC2.Data.SelectedContacts[rec.getData("id")];
                    if(checkRec && checkRec.checked) {
                        rec.setData("checked",true);
                    }
                }
        });
         
        myPaginator.subscribe('rowsPerPageChange', function (oAargs) {
        	// Bug 59353 - We need to refresh the list of selected items when the rows per page changes
        	// in order to keep the ui and model in sync.
            var rs = YAHOO.Convio.PC2.Component.Contacts.DataTable.getRecordSet();
            var paginator = YAHOO.Convio.PC2.Component.Contacts.Paginator;
            
            var len = rs.getLength();
            var j=0;
            
            for(var i=paginator.getStartIndex(); i < len; i++) {
                var rec = rs.getRecord(i);
                var checkRec = YAHOO.Convio.PC2.Data.SelectedContacts[rec.getData("id")];
                if(checkRec && checkRec.checked) {
                    rec.setData("checked",true);
                }
            }
        });
        
        var MsgCatProvider = YAHOO.Convio.PC2.Component.Content;
        YAHOO.Convio.PC2.Component.Contacts.DataTable.setAttributeConfig("MSG_EMPTY", {value: MsgCatProvider.getMsgCatValue('data_table_message_empty') });
        
        /**
         * loadGroupTable
         * Group table
         */
        this.formatGroupName = function(elCell, oRecord, oColumn, sData) {
        	
        	var filterValue = oRecord.getData().filterValue;
        	var displayName = sData;
        	var groupId = oRecord.getData().groupId;
        	var innerHtml = '<span class="underline" title="' + displayName + '">' + displayName + '</span>';
        	var contactsCount = oRecord.getData().contactsCount;
        	if(contactsCount != null) {
        		innerHtml += '<p class="gray-item members-label">' + contactsCount + '&nbsp;' + MsgCatProvider.getMsgCatValue('contacts_groups_members_label') + '</p>';
        	}
        	if(groupId && groupId > -1) {
            	// edit link
        		innerHtml += '&nbsp;<a class="hidden-form" href="javascript:showGroupEdit(\'' + groupId + '\', \'' + displayName + '\');" id="group_edit_link_' + groupId + '">'
        		+ YAHOO.util.Dom.get('msg_cat_groups_edit_group_link').innerHTML + '</a>';
        	}
        	
        	elCell.innerHTML = innerHtml;
            elCell.tabIndex = -1;
            elCell.setAttribute('role', 'presentation');
            
            YAHOO.util.Event.addListener(elCell, "click", function() {
            	updateContactsListWithGroup(filterValue, groupId);
                setFilter(filterValue, displayName);
            });
            
            if(groupId == null) {
            	jQuery(elCell).parents('tr:eq(0)').addClass('filter-type');
            }
        }
        
        var myGroupColumnDefs = [];
        var groupIndex = 0;
        myGroupColumnDefs[groupIndex++] = {label: '', key:'checked', formatter:'checkbox', className: 'td-align-top'};
        myGroupColumnDefs[groupIndex++] = {label: groups_header_label, key: 'filterName', formatter: this.formatGroupName, className: 'border-left-none', sortable: true};
        YAHOO.Convio.PC2.Component.Contacts.GroupsDataSource = new YAHOO.util.XHRDataSource(YAHOO.Convio.PC2.Config.Teamraiser.getUrl());
        YAHOO.Convio.PC2.Component.Contacts.GroupsDataSource.responseType = YAHOO.util.DataSource.TYPE_JSON;
        YAHOO.Convio.PC2.Component.Contacts.GroupsDataSource.connXhrMode = "queueRequests";
        YAHOO.Convio.PC2.Component.Contacts.GroupsDataSource.connMethodPost = true;
        YAHOO.Convio.PC2.Component.Contacts.GroupsDataSource.responseSchema = {
                resultsList: "getTeamraiserAddressBookFiltersResponse.filter",
                fields: ["filterName", "filterValue", "groupId", "contactsCount"]
        };
        
        YAHOO.Convio.PC2.Component.Contacts.GroupsDataSource.doBeforeParseData = function (oRequest, oFullResponse, oCallback) {
            if(YAHOO.lang.isUndefined(oFullResponse.getTeamraiserAddressBookFiltersResponse.filterGroup)) {
                // hack: if messageItem does not exist, insert an empty list
                oFullResponse.getTeamraiserAddressBookFiltersResponse.filterGroup = [];
            } else {
            	var jsonObj = [];
            	// convert the data to a new list
            	var response = oFullResponse.getTeamraiserAddressBookFiltersResponse;
            	var data = response.filterGroup;
            	var index = 0;
            	for(var i=0; i < response.filterGroup.length; i++) {
            		response.filterGroup[i].filter = YAHOO.Convio.PC2.Utils.ensureArray(response.filterGroup[i].filter);

            		var filterGroup = response.filterGroup[i];
            		for(var j=0; j < filterGroup.filter.length; j++) {
            			var filterItem = {};
            			var filterIndex = filterGroup.filter[j].filterValue.indexOf("email_rpt_group_");
            			if(filterIndex == 0) {
            				filterItem.filterValue = filterGroup.filter[j].filterValue;
            				filterItem.filterName = filterGroup.filter[j].filterName;
            				filterItem.groupId = filterItem.filterValue.substring(16);
            				filterItem.contactsCount = filterGroup.filter[j].contactsCount;
            			} else {
            				filterItem.filterValue = filterGroup.filter[j].filterValue;
							var filterElement = YAHOO.util.Dom.get("msg_cat_filter_" + filterGroup.filter[j].filterValue);
							// Don't do anything with this filter if we don't have an element in the dom for it
							if (!filterElement)
							{	
								continue;
							}
            				filterItem.filterName = filterElement.innerHTML;
            				var teamName = filterGroup.filter[j].teamName; 
            				if (teamName != null && teamName.length > 0)
            				{
            					// We don't want the teamName to wrap
            					teamName = teamName.replace(/ /g, "&nbsp;");
            					filterItem.filterName = filterItem.filterName + ' (' + teamName + ')';
            				}
            				filterItem.groupId = null;
            				filterItem.contactsCount = null;
            			}
            			jsonObj.push(filterItem);
            		}
            	}
            	
            	var state = YAHOO.Convio.PC2.Component.Contacts.GroupsDataTable.getState();
            	if(state != null && state.sortedBy != null && state.sortedBy.dir == 'yui-dt-asc') {
            		var jsonObjDesc = [];
            		var len = jsonObj.length-1;
            		for(var k=len; k>=0; k--) {
            			jsonObjDesc.push(jsonObj[k]);
            		}
            		jsonObj = jsonObjDesc;
            	}
            	clearGroupSelections();
            	
            	setNoFilter();
            	oFullResponse.getTeamraiserAddressBookFiltersResponse.filter = jsonObj;
            }
            return oFullResponse;    
        };
        
        this.buildGroupsQueryString = function(state, dt) {
            var result = YAHOO.Convio.PC2.Teamraiser.getAddressBookFiltersParams();
            YAHOO.log("Built query: " + result, "info", "contacts-functions.js");
            return result;
        };
        
        this.removeContactFromGroup = function(contactId) {
        	clearStatusMessages();
        	if(YAHOO.lang.isUndefined(YAHOO.Convio.PC2.Component.Contacts.selectedGroupId) == false && YAHOO.Convio.PC2.Component.Contacts.selectedGroupId != null) {
        		YAHOO.Convio.PC2.AddressBook.removeContactFromGroup(this.removeContactFromGroupCallback, contactId, YAHOO.Convio.PC2.Component.Contacts.selectedGroupId);
        	}
        };
        
        this.removeContactFromGroupCallback = {
        		success: function(o) {
        			var response = YAHOO.lang.JSON.parse(o.responseText).removeContactFromGroupResponse;
        			var removedContactId = response.contact_id;
        			var removedGroupId = response.group_id;
        			var recSet = YAHOO.Convio.PC2.Component.Contacts.DataTable.getRecordSet();
        			var records = YAHOO.Convio.PC2.Component.Contacts.DataTable.getRecordSet().getRecords();
        			for(var i=YAHOO.Convio.PC2.Component.Contacts.Paginator.getStartIndex(); i<records.length; i++) {
        				var record = records[i];
        				if(YAHOO.lang.isUndefined(record) == false && 
        						record.getData().id == removedContactId) {
        					YAHOO.Convio.PC2.Component.Contacts.DataTable.deleteRow(i);
        					// show success message
        					show_pc2_element('contacts-remove-group-contact-success');
        					break;
        				}
        			}
        		},
        		failure: function(o) {
        			logFailure(o);
        		},
        		scope: this
        };
        
        var myGroupTableConfig = {
                initialRequest         : YAHOO.Convio.PC2.Teamraiser.getAddressBookFiltersParams(),
                generateRequest        : this.buildGroupsQueryString,
                dynamicData            : true,
                summary                : MsgCatProvider.getMsgCatValue('contacts_groups_table_summary_desc'),
                MSG_SORTASC            : MsgCatProvider.getMsgCatValue('data_table_click_sort_asc'),
                MSG_SORTDESC           : MsgCatProvider.getMsgCatValue('data_table_click_sort_desc')
        };
        
        try {
            YAHOO.Convio.PC2.Component.Contacts.GroupsDataTable = new YAHOO.widget.DataTable(
                    container + '-groups',
                    myGroupColumnDefs,
                    YAHOO.Convio.PC2.Component.Contacts.GroupsDataSource, 
                    myGroupTableConfig
            );
        } catch(e) {
            YAHOO.log(e, 'error', 'contacts-functions.js');
        }
    
        // set up group column
        if(YAHOO.lang.isUndefined(YAHOO.Convio.PC2.Component.Contacts.groupColumns)) {
			YAHOO.Convio.PC2.Component.Contacts.groupColumns = [];
			YAHOO.Convio.PC2.Component.Contacts.groupColumns.push({index: 3, column: YAHOO.Convio.PC2.Component.Contacts.DataTable.removeColumn('removeGroup')});
		};
		
		YAHOO.Convio.PC2.Component.Contacts.GroupsDataTable.subscribe('cellClickEvent', function(oArgs) {
			var target = oArgs.target;
            var column = YAHOO.Convio.PC2.Component.Contacts.GroupsDataTable.getColumn(target);
            if (column.key == 'filterName') {
            	if(YAHOO.Convio.PC2.Component.Contacts.GroupsDataTable.selectedRow) {
    				YAHOO.Convio.PC2.Component.Contacts.GroupsDataTable.unselectRow(YAHOO.Convio.PC2.Component.Contacts.GroupsDataTable.selectedRow);
    			}
            	var row = YAHOO.Convio.PC2.Component.Contacts.GroupsDataTable.getRow(target);
            	YAHOO.Convio.PC2.Component.Contacts.GroupsDataTable.selectRow(row);
            	YAHOO.Convio.PC2.Component.Contacts.GroupsDataTable.selectedRow = row;

            	var oRecord = YAHOO.Convio.PC2.Component.Contacts.GroupsDataTable.getRecord(target);
            	YAHOO.Convio.PC2.Component.Contacts.GroupsDataTable.selectedGroupId = oRecord.getData().groupId;
            }
		});
        
        YAHOO.Convio.PC2.Component.Contacts.GroupsDataTable.subscribe("checkboxClickEvent", function(oArgs){
            var elCheckbox = oArgs.target;
            var oRecord = YAHOO.Convio.PC2.Component.Contacts.GroupsDataTable.getRecord(elCheckbox);
            var filterValue = oRecord.getData().filterValue;
            var groupId = oRecord.getData().groupId;
            var newRec = { 
            	filterValue: filterValue,
            	groupId: groupId,
                checked: elCheckbox.checked
            };
            YAHOO.Convio.PC2.Data.SelectedContactGroups[filterValue] = newRec;
            YAHOO.log('added {filterValue: ' + newRec.filterValue + ', groupId: ' + newRec.groupId +', checked: ' + newRec.checked + '}', 'info', 'contacts-functions.js');
            oRecord.setData("checked",elCheckbox.checked);
            YAHOO.Convio.PC2.Component.Contacts.updateSelectedCount();
        });
        
        YAHOO.Convio.PC2.Component.Contacts.GroupsDataTable.subscribe('cellMouseoverEvent',function(oArgs) {
            var target = oArgs.target;
            var column = YAHOO.Convio.PC2.Component.Contacts.GroupsDataTable.getColumn(target);
            if (column.key == "filterName") {
                var record = YAHOO.Convio.PC2.Component.Contacts.GroupsDataTable.getRecord(target);
                var groupId = record.getData().groupId;
                show_pc2_element("group_edit_link_" + groupId);
            }
        });
        
        YAHOO.Convio.PC2.Component.Contacts.GroupsDataTable.subscribe('cellMouseoutEvent',function(oArgs) {
            var target = oArgs.target;
            var column = YAHOO.Convio.PC2.Component.Contacts.GroupsDataTable.getColumn(target);
            if (column.key == "filterName") {
                var record = YAHOO.Convio.PC2.Component.Contacts.GroupsDataTable.getRecord(target);
                var groupId = record.getData().groupId;
                hide_pc2_element("group_edit_link_" + groupId);
            }
        });
        
        /**
         * End Group Table
         */
    
        YAHOO.log('Exit: loadContacts(' + container + ')', 'info', 'contacts-functions.js');
    }
};

var contactsErrCleanup = function() {
    hide_pc2_element("contacts-add-success");
    hide_pc2_element("contacts-add-failure");
}

var selectAll = function() {
    contactsErrCleanup();
    var testMeth = function(obj) { return true; }
	if(YAHOO.Convio.PC2.Component.Contacts.contactViewType == 'individuals') {
		var rs = YAHOO.Convio.PC2.Component.Contacts.DataTable.getRecordSet();
		var paginator = YAHOO.Convio.PC2.Component.Contacts.Paginator;

		var len = rs.getLength();
		YAHOO.log("RecordSet has " + len + " records.", "info", "contacts-functions.js");
		for(var i=paginator.getStartIndex(); i < len; i++) {
			var rec = rs.getRecord(i);
			var trEl = YAHOO.Convio.PC2.Component.Contacts.DataTable.getTrEl(rec);
			var checkBox = YAHOO.util.Dom.getElementBy(testMeth, "input", trEl);
			checkBox.checked = true;
			if(!rec.getData("checked")) {
				rec.setData("checked",true);
			}
			var myId = rec.getData("id")
			var newRec = { 
				id: myId, 
				checked: true
			};
			YAHOO.Convio.PC2.Data.SelectedContacts[myId] = newRec;
			YAHOO.log('added {id: ' + newRec.id + ', checked: ' + newRec.checked + '}', 'info', 'contacts-functions.js');
		}
	} else {
		// groups
		var rs = YAHOO.Convio.PC2.Component.Contacts.GroupsDataTable.getRecordSet();
		var len = rs.getLength();
		for(var i=0; i < len; i++) {
			var oRecord = rs.getRecord(i);
			var trEl = YAHOO.Convio.PC2.Component.Contacts.GroupsDataTable.getTrEl(oRecord);
			var checkBox = YAHOO.util.Dom.getElementBy(testMeth, "input", trEl);
			checkBox.checked = true;
			if(!oRecord.getData().checked) {
				oRecord.setData("checked",true);
			}
			var filterValue = oRecord.getData().filterValue;
			var groupId = oRecord.getData().groupId;
			var newRec = { 
					filterValue: filterValue,
					groupId: groupId,
					checked: true
			};
			YAHOO.Convio.PC2.Data.SelectedContactGroups[filterValue] = newRec;
			YAHOO.log('added {filterValue: ' + newRec.filterValue + ', groupId: ' + newRec.groupId + ', checked: ' + newRec.checked + '}', 'info', 'contacts-functions.js');
		}
	}
	YAHOO.Convio.PC2.Component.Contacts.updateSelectedCount();
};

var isFilterSelected = false;
var selectedFilter;

var setFilter = function(value, name) {
    errCleanup();
    // Clean up the old selection
    YAHOO.util.Dom.removeClass(selectedFilter, "selected");
    selectedFilter = value;
    YAHOO.util.Dom.addClass(selectedFilter, "selected");
    
    YAHOO.Convio.PC2.Component.Contacts.updateABFilter(value);
    
    YAHOO.util.Dom.get("contacts_showing_selected").innerHTML = name;
    
    show_pc2_element("contacts_showing_selected");
    show_pc2_element("contacts_filters_selected");
    hide_pc2_element("contacts_top_list");
    show_pc2_element("msg_cat_contacts_view_only");
    hide_pc2_element("msg_cat_contacts_view_by_label");
    
    isFilterSelected = true;
    filterShowLess();
};

var filterShowLess = function() {
    hide_pc2_element("contacts_filters_show_less");
    hide_pc2_element("contacts_show_all_block");
    show_pc2_element("contacts_filters_show_more");
    if(!isFilterSelected) {
        show_pc2_element("contacts_top_list");
    }
    //show_pc2_element("contacts-list");
    //show_pc2_element("lower_contacts_pagination_block");
};

var filterShowMore = function() {
    show_pc2_element("contacts_filters_show_less");
    show_pc2_element("contacts_show_all_block");
    hide_pc2_element("contacts_filters_show_more");
    hide_pc2_element("contacts_top_list");
    //hide_pc2_element("contacts-list");
    //hide_pc2_element("lower_contacts_pagination_block");
};

var setNoFilter = function() {
    
    errCleanup();
    var searchTextEl = YAHOO.util.Dom.get("contacts-search-text");
    searchTextEl.value = "";
    YAHOO.Convio.PC2.Component.Contacts.contactsListCriteria.filterText = searchTextEl.value;
    
    YAHOO.Convio.PC2.Component.Contacts.updateABFilter("all");
    
    hide_pc2_element("contacts_showing_selected");
    hide_pc2_element("contacts_filters_selected");
    hide_pc2_element("msg_cat_contacts_view_only");
    show_pc2_element("msg_cat_contacts_view_by_label");
    
    isFilterSelected = false;
    YAHOO.util.Dom.removeClass(selectedFilter, "selected");
    filterShowLess();
    
};

var getFiltersCallback = {
    success: function(o) {
        
        var response = YAHOO.lang.JSON.parse(o.responseText).getTeamraiserAddressBookFiltersResponse;
        var yourGroupsEl = YAHOO.util.Dom.get("contacts_your_groups");
        yourGroupsEl.innerHTML = "";
        
        for(var i=0; i < response.filterGroup.length; i++) {

            response.filterGroup[i].filter = YAHOO.Convio.PC2.Utils.ensureArray(response.filterGroup[i].filter);
            for(var j=0; j < response.filterGroup[i].filter.length; j++) {
                if(response.filterGroup[i].filter[j].filterValue.indexOf("email_rpt_group_") == 0) {
                    
                    /* Handle user created groups */
                    show_pc2_element("contacts_your_groups_label_block");
                    var liEl = document.createElement("li");
                    liEl.id = response.filterGroup[i].filter[j].filterValue;
                    
                    liEl.filterValue = response.filterGroup[i].filter[j].filterValue;
                    liEl.filterName = response.filterGroup[i].filter[j].filterName;
                    
                    YAHOO.util.Event.addListener(liEl, "click", function() {
                        setFilter(this.filterValue, this.filterName);
                    });
                    
                    var anchorEl = document.createElement("a");
                    anchorEl.href="javascript:void(0);";
                    anchorEl.innerHTML = response.filterGroup[i].filter[j].filterName;
                    
                    liEl.appendChild(document.createTextNode(" "));
                    liEl.appendChild(anchorEl);
                    liEl.appendChild(document.createTextNode(" "));
                    
                    
                    yourGroupsEl.appendChild(liEl);
                    
                } else {
                    
                    /* Handle built in groups */
                    if(response.filterGroup[i].filter[j].filterValue.indexOf("teammates") > -1) {
                        show_pc2_element("contacts_showing_teammates_block");
                    }
                    
                    show_pc2_element(response.filterGroup[i].filter[j].filterValue);
                    show_pc2_element("top_" + response.filterGroup[i].filter[j].filterValue);
                    
                    var filterElementId = "msg_cat_filter_" + response.filterGroup[i].filter[j].filterValue;
					var filterElement = YAHOO.util.Dom.get(filterElementId);
					if (!filterElement)
					{
						YAHOO.log('Failed to find expected DOM element with ID "' + filterElementId + '"', 'warn', 'contacts-functions.js');
						continue;
					}
                    var filterName = filterElement.innerHTML
                    
                    var elm = YAHOO.util.Dom.get(response.filterGroup[i].filter[j].filterValue);
                    if(elm) {
                        elm.filterValue = response.filterGroup[i].filter[j].filterValue;
                        elm.filterName = filterName;
                        YAHOO.util.Event.addListener(response.filterGroup[i].filter[j].filterValue, "click", function() {
                            setFilter(this.filterValue, this.filterName);
                        });
                    }
                    
                    elm = YAHOO.util.Dom.get("top_" + response.filterGroup[i].filter[j].filterValue);
                    if(elm) {
                        elm.filterValue = response.filterGroup[i].filter[j].filterValue;
                        elm.filterName = filterName;
                        YAHOO.util.Event.addListener("top_" + response.filterGroup[i].filter[j].filterValue, "click", function() {
                            setFilter(this.filterValue, this.filterName);
                        });
                    }
                }
            }
        }
    },
    failure: function(o) {
        YAHOO.log("Error with getting address book filters: " + o.responseText, "error", "contacts-functions.js");
    },
    cache: false
};

var clearStatusMessages = function() {
    hide_pc2_element("contacts-add-success");
    hide_pc2_element("contacts-add-failure");
    hide_pc2_element("contacts-delete-success");
    hide_pc2_element("contacts-add-group-exists-failure");
    hide_pc2_element("contacts-add-group-failure");
    hide_pc2_element("contacts-add-group-success");
    hide_pc2_element("contacts-remove-group-contact-success");
    /* TODO DSW Snowbird Remove this code when CSV functionality has been reworked in sprint 2
    hide_pc2_element("contacts_upload_generic_error");
    */
}

var selectNone = function() {
    contactsErrCleanup();
    if(YAHOO.Convio.PC2.Component.Contacts.contactViewType == 'individuals') {
    	YAHOO.Convio.PC2.Data.SelectedContacts = [];
    	var testMeth = function(obj) { return true; }
    	var rs = YAHOO.Convio.PC2.Component.Contacts.DataTable.getRecordSet();
    	var paginator = YAHOO.Convio.PC2.Component.Contacts.Paginator;

    	var len = rs.getLength();
    	for(var i=paginator.getStartIndex(); i < len; i++) {
    		var rec = rs.getRecord(i);
    		var trEl = YAHOO.Convio.PC2.Component.Contacts.DataTable.getTrEl(rec);
    		var checkBox = YAHOO.util.Dom.getElementBy(testMeth, "input", trEl);
    		checkBox.checked = false;
    		if(rec.getData("checked")) {
    			rec.setData("checked",false);
    		}
    		var myId = rec.getData("id")
    		var newRec = { 
    			id: myId, 
    			checked: false
    		};
    		YAHOO.Convio.PC2.Data.SelectedContacts[myId] = newRec;
    		YAHOO.log('added {id: ' + newRec.id + ', checked: ' + newRec.checked + '}', 'info', 'contacts-functions.js');
    	}
    } else {
		clearGroupSelections();
	}
    YAHOO.Convio.PC2.Component.Contacts.updateSelectedCount();
};

var clearContact = function() {
    YAHOO.util.Dom.get('add_contact_first_name').value = '';
    YAHOO.util.Dom.get('add_contact_last_name').value = '';
    YAHOO.util.Dom.get('add_contact_email').value = '';
};

var errCleanup = function() {
    hide_pc2_element("contacts-add-success");
    hide_pc2_element("contacts-add-failure");
};

/*
 * Search Button
 */
var updateFilterText = function() {
   errCleanup();
   YAHOO.log("Entered updateFilterText","info","contacts-functions.js");
   var searchTextEl = YAHOO.util.Dom.get("contacts-search-text");
   
   changeContactsView('individuals', true);
   YAHOO.Convio.PC2.Component.Contacts.contactsListCriteria.filterText = searchTextEl.value;
   YAHOO.Convio.PC2.Component.Contacts.Paginator.reset();
};

function handleKeyPressedUpdateFilterText(keyPressEvent) {
	if (keyPressEvent && keyPressEvent.keyCode === 13) {
		updateFilterText();
    }
};
                   
var addContactCallback = {
   success: function(o) {
    setTimeout( function() {
        jQuery('#email-wizard-add-contact-dialog').parent().find('button').button('option','disabled',false);
    },1000);
          var response = YAHOO.lang.JSON.parse(o.responseText).addAddressBookContactResponse;
          var contact = response.addressBookContact;
          //some weird happens in the API where empty strings get turned into empty objects
          if( typeof contact.firstName !== 'string' )
            contact.firstName = null;
          if( typeof contact.lastName !== 'string' )
            contact.lastName = null;

       if(myContactsMap) {
           if(!myContactsMap[contact.id] && contact.id != 0) {
               myContactsMap[contact.id] = contact;
               myContacts[myContacts.length] = contact;
           }
       }
       YAHOO.util.Dom.removeClass("contacts-add-success","hidden-form");
       YAHOO.Convio.PC2.Component.Contacts.updateTimestamp();
       
       if( YAHOO.Convio.PC2.Component.Contacts.Paginator ) {
        YAHOO.Convio.PC2.Component.Contacts.Paginator.setTotalRecords(YAHOO.Convio.PC2.Component.Contacts.Paginator.getTotalRecords() + 1);
      }
       
       /* Need to refresh groups in other views */
       YAHOO.Convio.PC2.Views.emailGroupsReset = true;
       
       clearContact();
       
       //close the dialog
       jQuery('#email-wizard-add-contact-dialog').dialog("close");
       
       // Fire an event
       YAHOO.Convio.PC2.Utils.publisher.fire("pc2:contactAdded", contact);
   },
   failure: function(o) {
    setTimeout( function() {
        jQuery('#email-wizard-add-contact-dialog').parent().find('button').button('option','disabled',false);
    },1000);
			 var errCode = YAHOO.lang.JSON.parse(o.responseText).errorResponse.code;
			 var err;
			 if (errCode = 9) // Missing email
			 {
					 err = YAHOO.util.Dom.get("msg_cat_contact_add_failure_email").innerHTML;
			 }
			 else // Other error
			 {
					 err = YAHOO.util.Dom.get("msg_cat_contact_add_failure_unknown").innerHTML;
			 }
       var errEl = YAHOO.util.Dom.get("contacts-add-failure");
			 errEl.innerHTML = err;
       YAHOO.util.Dom.removeClass("contacts-add-failure","hidden-form");
       YAHOO.log("Error adding contact. Message was: " + o.responseText, "info", "contacts-functions.js");
       jQuery('#contactadd-dialog-error').html(YAHOO.lang.JSON.parse(o.responseText).errorResponse.message).show();
   },
   scope: this
};
                   
var showAddContactForm = function() {
   errCleanup();
   YAHOO.util.Dom.setStyle('add-contact-selectsource', 'display', 'none');
   YAHOO.util.Dom.removeClass("address_book_add", "hidden-form");
};
                   
var showAddContactButton = function() {
   YAHOO.util.Dom.setStyle('add-contact-selectsource', 'display', 'block');
   YAHOO.util.Dom.addClass("address_book_add", "hidden-form");
};
                   
var cancelAddContact = function() {
   showAddContactButton();
   clearContact();
};
                   
var submitAddContact = function() {
   var fNameEl = YAHOO.util.Dom.get("add_contact_first_name");
   var lNameEl = YAHOO.util.Dom.get("add_contact_last_name");
   var eMailEl = YAHOO.util.Dom.get("add_contact_email");
       
   if(YAHOO.lang.isString(fNameEl.value)
       && YAHOO.lang.isString(lNameEl.value)
       && YAHOO.lang.isString(eMailEl.value)) 
   {
       var contact = {
           firstName: fNameEl.value,
           lastName: lNameEl.value,
           email: eMailEl.value
       }
       clearStatusMessages();
       YAHOO.Convio.PC2.AddressBook.addAddressBookContact(addContactCallback, contact);
       showAddContactButton();
   }
};

var addMembersToGroupCallback = {
   success: function(o){
       YAHOO.log("addMembersToGroupCallback success","info","contacts-functions.js");
       var response = YAHOO.lang.JSON.parse(o.responseText).addContactsToGroupResponse;
       updateGroupMembership(response);
       YAHOO.Convio.PC2.Views.emailGroupsReset = true;
   },
   failure: function(o){
       YAHOO.log("Error adding contacts to group: " + o.responseText, "error", "contacts-functions.js");
   },
   scope: this
};

var updateGroupMembership = function(response) {
   YAHOO.log("Entering updateGroupMembership","info","contacts-functions.js");
   var rs = YAHOO.Convio.PC2.Component.Contacts.DataTable.getRecordSet();
   var paginator = YAHOO.Convio.PC2.Component.Contacts.Paginator;
   
   var len = rs.getLength();
   var contactIdx = 0;
   
   // groups type and shown group is the updated group id
   if(YAHOO.Convio.PC2.Component.Contacts.contactViewType == 'groups' &&
		   YAHOO.Convio.PC2.Component.Contacts.GroupsDataTable.selectedGroupId != null && 
		   YAHOO.Convio.PC2.Component.Contacts.GroupsDataTable.groupId == response.groupId) {
	   // reload the contacts table
	   YAHOO.Convio.PC2.Component.Contacts.Paginator.reset();
   } else if(response.contactId) { // Iterate through the datatable recordset
       for(var i=paginator.getStartIndex(); i < len; i++) {
           var rec = rs.getRecord(i);
           var recordId = rec.getData("id")
           
           // Is contactIds one record or multiple?
           if(YAHOO.lang.isArray(response.contactId)) {
               // Found represents whether or not the list of contacts to update contains the current record.
               var found = false;
               
               // Go through the list of contacts to update.
               for(contactIdx = 0; contactIdx < response.contactId.length; contactIdx++) {
                   if(response.contactId[contactIdx] == recordId) {
                       // If one of the contacts to update matches the current record,
                       // record that fact.
                       found = true;
                   }
               }
               
               // If this record is not one to update, skip it.
               if(!found) {
                   YAHOO.log("Skipping " + rec.getData("firstName"),"info","contacts-functions.js");
                   continue;
               }
               
           } else {
               // Only one contactId
               // If this record is not one to update, skip it.
               YAHOO.log("Found single contactId: " + response.contactId, "info", "contacts-functions.js");
               if(recordId != response.contactId) {
                   YAHOO.log("Skipping " + rec.getData("firstName"),"info","contacts-functions.js");
                   continue;
               }
           }
           // Check the existing groups
           var groups = rec.getData("group");
           if(!groups) {
               // If there are no groups, simply set the new group as the only value
               rec.setData("group", response.addressBookGroup);
           } else {
               // There is at least one existing group.
               groups = YAHOO.Convio.PC2.Utils.ensureArray(groups);
               // Iterate through to see if they already have this group...
               var alreadyHasGroup = false;
               // Cannot use "i" because we are already in a for loop with "i" as control
               for(var j=0; j < groups.length; j++) {
                   if(groups[j].id == response.addressBookGroup.id) {
                       alreadyHasGroup = true;
                       YAHOO.log("Refusing to update contact " + recordId + " because of existing group.", "info", "contacts-functions.js");
                       break;
                   }
               }
               
               if(!alreadyHasGroup) {
                   // Just append to the end.
                   groups[groups.length] = response.addressBookGroup;
                   // Re-update just to be sure. This may not actually be necessary.
                   rec.setData("group", groups);
               }
           }
           YAHOO.log("Updating " + rec.getData("firstName"), "info", "contacts-functions.js");
           YAHOO.Convio.PC2.Component.Contacts.DataTable.updateRow(rec);
       }
       
       // At the end, re-render the datatable
       YAHOO.Convio.PC2.Component.Contacts.DataTable.render();
   }
};

var addContactsToGroup = function(groupId) {
    YAHOO.log("addContactsToGroup entry, groupId = " + groupId,"info","contacts-functions.js");
    if(YAHOO.Convio.PC2.Component.Contacts.contactViewType == 'individuals') {
    	var contacts = YAHOO.Convio.PC2.Component.Contacts.getSelectedContacts();
    	YAHOO.Convio.PC2.AddressBook.addContactsToGroup(addMembersToGroupCallback, groupId, contacts);
    } else {
    	var groupsFilterText = YAHOO.Convio.PC2.Component.Contacts.getSelectedFiltersString();
    	if(groupsFilterText != '') {
    		GetAddressBookContactsFromGroupsForCreateGroupCallback.groupId = groupId;
    		GetAddressBookContactsFromGroupsForCreateGroupCallback.callback = addMembersToGroupCallback;
    		createGroupFromContactsGroup(groupsFilterText);
    	} else {
    		YAHOO.Convio.PC2.AddressBook.addContactsToGroup(GetAddressBookContactsFromGroupsForCreateGroupCallback.callback, groupId, []);
    	}
    }
};

var addGroupMenuItemsCallback = {
    success: function(o) {
    
        var initialMenu = [
            { 
                text: document.getElementById("msg_cat_contacts_create_a_new_group").innerHTML, 
                value: "add_new_group",
                onclick: {
                    fn: function (p_sType, p_aArgs, p_oItem) {
                        YAHOO.Convio.PC2.Component.Contacts.addGroupInstance.show();
                    }
                }
            }
        ];
        var groupsMenuButton = YAHOO.Convio.PC2.Component.Contacts.GroupsMenuButton;
        var groupsMenuButtonMenu = groupsMenuButton.getMenu();
        
        groupsMenuButtonMenu.clearContent();
        groupsMenuButtonMenu.addItems(initialMenu);
        groupsMenuButtonMenu.render();
        
        var response = YAHOO.lang.JSON.parse(o.responseText).getAddressBookGroupsResponse;
        addGroupMenuItems(response.group);
    },
    failure: function(o){
        YAHOO.log("Error loading groups: " + o.responseText, "error", "contacts-functions.js");
    }
};
   
var addGroupMenuItems = function(group) {
    if(!group) {
        return;
    }
    var groupsMenuButton = YAHOO.Convio.PC2.Component.Contacts.GroupsMenuButton;
    var groupsMenuButtonMenu = groupsMenuButton.getMenu();
    
    var buildNewMenuItem = function(rGroup) {
        var newMenuItem = { text: rGroup.name, value: rGroup.id, onclick: { 
            fn: 
                function (p_sType, p_aArgs, p_oItem) {
                    addContactsToGroup(p_oItem.value);
                }
            }
        };
        return newMenuItem;
    };
       
    group = YAHOO.Convio.PC2.Utils.ensureArray(group);
    for(var i=0; i < group.length; i++) {
        var menuItem = buildNewMenuItem(group[i]);
        groupsMenuButtonMenu.addItem(menuItem);
    }
    groupsMenuButtonMenu.render();
};

var refreshContactsGroups = function() {
    YAHOO.Convio.PC2.AddressBook.getAddressBookGroups(addGroupMenuItemsCallback);
    /* Update the filters */
    YAHOO.Convio.PC2.Teamraiser.getAddressBookFilters(getFiltersCallback);
    /*
     * Refresh groups
     */
    YAHOO.Convio.PC2.Component.Contacts.GroupsDataSource.sendRequest(
    		YAHOO.Convio.PC2.Teamraiser.getAddressBookFiltersParams(),
    		{ 
    			success: YAHOO.Convio.PC2.Component.Contacts.GroupsDataTable.onDataReturnInitializeTable, 
    			scope: YAHOO.Convio.PC2.Component.Contacts.GroupsDataTable
    		}
    );
};

/*
 * This handles "cleaning up" contacts that have been deleted by removing
 * them from the list of contacts stored in memory and indicating that
 * various views that reference contacts need to be reloaded the next time
 * they are accessed.
 *
 * @param removedContactId is the contactId or an array of contactIds 
 * that have been deleted.
 */
var deleteContactHandler = function(removedContactId) {
    var myContactsMap = YAHOO.Convio.PC2.Utils.ensureArray(YAHOO.Convio.PC2.Data.ContactsMap);
    var myContacts = YAHOO.Convio.PC2.Utils.ensureArray(YAHOO.Convio.PC2.Data.Contacts);

    var deletedContacts = YAHOO.Convio.PC2.Utils.ensureArray(removedContactId);
    for(var i = 0 ; i < deletedContacts.length ; i++){
        if(myContactsMap[deletedContacts[i]]) {
            var deletedContact = myContactsMap[deletedContacts[i]];
            var index = Y.Array.indexOf(myContacts, deletedContact);
            if(index >= 0){
                // remove the contact from active memory:
                myContacts.splice(index,1);
                myContactsMap[deletedContacts[i]] = null;
            }
        }
    }
    // indicate that views needs refreshing:
    YAHOO.Convio.PC2.Views.reportPersonalReset = true;
    YAHOO.Convio.PC2.Views.reportTeamReset = true;
    YAHOO.Convio.PC2.Views.emailGroupsReset = true;
}

YAHOO.Convio.PC2.Component.Contacts.individualColumns;
YAHOO.Convio.PC2.Component.Contacts.groupColumns;
YAHOO.Convio.PC2.Component.Contacts.contactViewType = 'individuals';

var changeContactsView = function(type, skipRefresh) {
	if((YAHOO.Convio.PC2.Component.Contacts.contactViewType == type) == false) { 
		if(type == 'individuals') {
			YAHOO.Convio.PC2.Component.Contacts.contactViewType = type;
			
			// remove 'remove group' column
			YAHOO.Convio.PC2.Component.Contacts.DataTable.removeColumn('removeGroup');
			
			// Set the appropriate width
			YAHOO.Convio.PC2.Component.Contacts.DataTable.getColumn('lastName').width = 150;
			
			hide_pc2_element('group-list-content-block');
			for(var i=0; i<YAHOO.Convio.PC2.Component.Contacts.individualColumns.length; i++) {
				var dataColumn = YAHOO.Convio.PC2.Component.Contacts.individualColumns[i];
				YAHOO.Convio.PC2.Component.Contacts.DataTable.insertColumn(dataColumn.column, dataColumn.index);
			}
			YAHOO.util.Dom.removeClass('contacts-list-content-block', 'partial');
			YAHOO.util.Dom.addClass('contacts-list-content-block', 'full');
			YAHOO.util.Dom.addClass('contacts-individuals-tab', 'selected');
			YAHOO.util.Dom.removeClass('contacts-groups-tab', 'selected');
			
			if(YAHOO.Convio.PC2.Component.Contacts.GroupsDataTable.selectedRow) {
				YAHOO.Convio.PC2.Component.Contacts.GroupsDataTable.unselectRow(YAHOO.Convio.PC2.Component.Contacts.GroupsDataTable.selectedRow);
				YAHOO.Convio.PC2.Component.Contacts.GroupsDataTable.selectedGroupId = null;
			}
			// clear selected group checkboxes
			clearGroupSelections();
			if(!skipRefresh) {
				setNoFilter();
			}
			show_pc2_element('add-contact-selectsource');
			hide_pc2_element('add-group-selectsource');
			jQuery('#contacts-list').removeClass('groups-view');
		} else if(type == 'groups') {
			YAHOO.Convio.PC2.Component.Contacts.contactViewType = type;
			show_pc2_element('group-list-content-block');
			// Set the appropriate width
			YAHOO.Convio.PC2.Component.Contacts.DataTable.getColumn('lastName').width = 300;
			if(YAHOO.lang.isUndefined(YAHOO.Convio.PC2.Component.Contacts.individualColumns)) {
				YAHOO.Convio.PC2.Component.Contacts.individualColumns = [];
				YAHOO.Convio.PC2.Component.Contacts.individualColumns.push({index: 0, column: YAHOO.Convio.PC2.Component.Contacts.DataTable.removeColumn('checked')});
				YAHOO.Convio.PC2.Component.Contacts.individualColumns.push({index: 2, column: YAHOO.Convio.PC2.Component.Contacts.DataTable.removeColumn('icons')});
				YAHOO.Convio.PC2.Component.Contacts.individualColumns.push({index: 3, column: YAHOO.Convio.PC2.Component.Contacts.DataTable.removeColumn('group')});
				YAHOO.Convio.PC2.Component.Contacts.individualColumns.push({index: 4, column: YAHOO.Convio.PC2.Component.Contacts.DataTable.removeColumn('email')});
				YAHOO.Convio.PC2.Component.Contacts.individualColumns.push({index: 5, column: YAHOO.Convio.PC2.Component.Contacts.DataTable.removeColumn('clickThroughs')});
				YAHOO.Convio.PC2.Component.Contacts.individualColumns.push({index: 6, column: YAHOO.Convio.PC2.Component.Contacts.DataTable.removeColumn('donations')});
			} else {
				YAHOO.Convio.PC2.Component.Contacts.DataTable.removeColumn('checked');
				YAHOO.Convio.PC2.Component.Contacts.DataTable.removeColumn('icons');
				YAHOO.Convio.PC2.Component.Contacts.DataTable.removeColumn('group');
				YAHOO.Convio.PC2.Component.Contacts.DataTable.removeColumn('email');
				YAHOO.Convio.PC2.Component.Contacts.DataTable.removeColumn('clickThroughs');
				YAHOO.Convio.PC2.Component.Contacts.DataTable.removeColumn('donations');
			}
			//clear checkboxes
			selectNone();
			YAHOO.util.Dom.addClass('contacts-list-content-block', 'partial');
			YAHOO.util.Dom.removeClass('contacts-list-content-block', 'full');
			YAHOO.util.Dom.removeClass('contacts-individuals-tab', 'selected');
			YAHOO.util.Dom.addClass('contacts-groups-tab', 'selected');
			
			jQuery('#contacts-search-text').val('');
			jQuery('#contacts-list').addClass('groups-view');
			
			// update filter text
			YAHOO.Convio.PC2.Component.Contacts.contactsListCriteria.filterText = '';
			hide_pc2_element('add-contact-selectsource');
			show_pc2_element('add-group-selectsource');
		}
	}
}

var loadGroupsView = function(groupId) {
	changeContactsView('groups');
	// set group selection
	if(YAHOO.Convio.PC2.Component.Contacts.GroupsDataTable.selectedRow) {
		YAHOO.Convio.PC2.Component.Contacts.GroupsDataTable.unselectRow(YAHOO.Convio.PC2.Component.Contacts.GroupsDataTable.selectedRow);
		YAHOO.Convio.PC2.Component.Contacts.GroupsDataTable.selectedGroupId = null;
	}
	var rs = YAHOO.Convio.PC2.Component.Contacts.GroupsDataTable.getRecordSet();
	var len = rs.getLength();
	for(var i=0; i<len; i++) {
		var oRecord = rs.getRecord(i);
		if(oRecord.getData().groupId == groupId) {
			var row = YAHOO.Convio.PC2.Component.Contacts.GroupsDataTable.getTrEl(oRecord);
        	YAHOO.Convio.PC2.Component.Contacts.GroupsDataTable.selectRow(row);
        	YAHOO.Convio.PC2.Component.Contacts.GroupsDataTable.selectedRow = row;
        	YAHOO.Convio.PC2.Component.Contacts.GroupsDataTable.selectedGroupId = groupId;
        	var filterValue = oRecord.getData().filterValue;
        	var filterName = oRecord.getData().filterName;
        	updateContactsListWithGroup(filterValue, groupId);
            setFilter(filterValue, filterName);
			break;
		}
	}
}

var clearGroupSelections = function() {
	YAHOO.Convio.PC2.Data.SelectedContactGroups = [];
	YAHOO.Convio.PC2.Data.SelectedContacts = [];
	var testMeth = function(obj) { return true; }
	var rs = YAHOO.Convio.PC2.Component.Contacts.GroupsDataTable.getRecordSet();
	var len = rs.getLength();
	for(var i=0; i < len; i++) {
		var oRecord = rs.getRecord(i);
		var trEl = YAHOO.Convio.PC2.Component.Contacts.GroupsDataTable.getTrEl(oRecord);
		var checkBox = YAHOO.util.Dom.getElementBy(testMeth, "input", trEl);
		checkBox.checked = false;
		if(oRecord.getData("checked")) {
			oRecord.setData("checked",false);
		}
		var filterValue = oRecord.getData().filterValue;
		var groupId = oRecord.getData().groupId;
		var newRec = { 
				filterValue: filterValue,
				groupId: groupId,
				checked: false
		};
		YAHOO.Convio.PC2.Data.SelectedContactGroups[filterValue] = newRec;
		YAHOO.log('added {filterValue: ' + newRec.filterValue + ', groupId: ' + newRec.groupId +', checked: ' + newRec.checked + '}', 'info', 'contacts-functions.js');
	}

	YAHOO.Convio.PC2.Component.Contacts.updateSelectedCount();
}

var updateContactsListWithGroup = function(filterValue, groupId) {
	if (YAHOO.Convio.PC2.Component.Contacts.DataTable.getColumn('removeGroup'))
	{
		YAHOO.Convio.PC2.Component.Contacts.DataTable.removeColumn('removeGroup');
	}
	if(groupId != null) {
		YAHOO.Convio.PC2.Component.Contacts.selectedGroupId = groupId;
		for(var i=0; i<YAHOO.Convio.PC2.Component.Contacts.groupColumns.length; i++) {
			var dataColumn = YAHOO.Convio.PC2.Component.Contacts.groupColumns[i];
			YAHOO.Convio.PC2.Component.Contacts.DataTable.insertColumn(dataColumn.column);
		}
	} else {
		YAHOO.Convio.PC2.Component.Contacts.selectedGroupId = null;
	}
}

YAHOO.Convio.PC2.Component.Contacts.EditGroupDialog = function(formContainer, labels) {
    YAHOO.log("Creating EditGroupDialog", "info", "groups-functions.js");
    
    try {
        this.EditGroupCallback = {
            success: function(o) {
            	refreshContactsGroups();
                
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
                YAHOO.log('Error with EditGroupDialog.handleSubmit: ' + e, 'error', 'contacts-functions.js');
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
        
        // define config for the dialog
        var dialogConfig = {
            width : "400px",
            modal: true, 
            visible : false, 
            close: false,
            buttons : [ { text: YAHOO.util.Dom.get("msg_cat_dialog_cancel_label").innerHTML, handler:this.handleCancel },
                        { text: YAHOO.util.Dom.get("msg_cat_dialog_save_label").innerHTML, handler:this.handleSubmit, isDefault:true } ]
        }; 
        
        // invoke parent constructor
        YAHOO.Convio.PC2.Component.Contacts.EditGroupDialog.superclass.constructor.call(
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
        
        this.render(document.body);
    } catch(e) {
        YAHOO.log("Error creating EditGroupDialog: " + e, "error", "contacts-functions.js");
    }
};

var showGroupEdit = function(groupId, groupName) {
	YAHOO.Convio.PC2.Component.Contacts.groupEditObject.showFor(groupId, groupName);
};

function addContactButtonHandler() {
  saveNewContactFromDialog();
}
function showAddContactDialog() {
  var btnCfg = {};
  btnCfg[jQuery('#msg_cat_add_contacts_cancel_link').html()] = function(){jQuery(this).dialog("close")};
  btnCfg[jQuery('#msg_cat_add_contact_submit_button').html()] = addContactButtonHandler;


  jQuery('#contactadd-dialog-error').empty().hide();
  jQuery('#email-wizard-add-contact-dialog form')[0].reset();
  jQuery('#email-wizard-add-contact-dialog').dialog({
    modal: true,
    title: jQuery('#msg_cat_contacts_sidebar_add_contact_header').html(),
    width: 375,
    resizable: false,
    dialogClass: 'email-wizard-dialog',
    buttons: btnCfg
  });
  jQuery('#email-wizard-add-contact-dialog input').keyup( function(e) {
    if( e.keyCode===13 )
      addContactButtonHandler();
  });

  jQuery("div.email-wizard-dialog button").removeClass('ui-state-default')
  jQuery("div.email-wizard-dialog button:nth-child(2)").removeClass('ui-state-default').addClass("primary");

}

var saveContactDialogCallback = {
  success: function(o) {
    YAHOO.log("Saved contact.","info","contacts-functions.js");
    setTimeout( function() {
        jQuery('#email-wizard-edit-contact-dialog').parent().find('button').button('option','disabled',false);
    },1000);
    var saveResponseContactId = YAHOO.lang.JSON.parse(o.responseText).updateTeamraiserAddressBookContactResponse.contact_id;
    var oldContactString = 'n/a';
    if(!YAHOO.lang.isUndefined(window.myContactsMap)) {
      var contact = myContactsMap[saveResponseContactId];
      oldContactString = getContactString(contact);

      if (contact) {
        contact.firstName = jQuery('#dialog_contactedit_first_name').val();
        contact.lastName = jQuery('#dialog_contactedit_last_name').val();
        contact.email = jQuery('#dialog_contactedit_email').val();
        contact.street1 = jQuery('#dialog_contactedit_address1').val();
        contact.street2 = jQuery('#dialog_contactedit_address2').val();
        contact.street3 = jQuery('#dialog_contactedit_address3').val();
        contact.city = jQuery('#dialog_contactedit_city').val();
        contact.state = jQuery('#dialog_contactedit_state').val();
        contact.county = jQuery('#dialog_contactedit_county').val();
        contact.zip = jQuery('#dialog_contactedit_zip').val();
        contact.country = jQuery('#dialog_contactedit_country').val();
        contact.phone = jQuery('#dialog_contactedit_phone').val();
      } else {
        YAHOO.Convio.PC2.Component.Contacts.Paginator.reset();
      }
    }
    YAHOO.Convio.PC2.Views.emailContactsReset = true;
    //close the dialog
    jQuery('#email-wizard-edit-contact-dialog').dialog("close");
    //update the contacts list
    populateEmailWizardContactPicker();
    //update the email-addresses field
    jQuery('#email-addresses').val( jQuery('#email-addresses').val().replace( oldContactString, getContactString(contact) ) );
    //update the recipients list
    syncWizardContactPicker();


  },
  failure: function(o) {
    setTimeout( function() {
        jQuery('#email-wizard-edit-contact-dialog').parent().find('button').button('option','disabled',false);
    },1000);
    YAHOO.log("Error saving contact.","error","contacts-functions.js");
    jQuery('#contactedit-dialog-error').html(YAHOO.lang.JSON.parse(o.responseText).errorResponse.message).show();
  },
  scope: this
};

function saveNewContactFromDialog() {
    var contact = {
        firstName: jQuery('#email-wizard-add-contact-first').val() || '',
        lastName: jQuery('#email-wizard-add-contact-last').val() || '',
        email: jQuery('#email-wizard-add-contact-email').val() || ''
    };
    if( !jQuery('#email-wizard-add-contact-dialog').parent().find('button').button('option','disabled' ) ) {
        jQuery('#email-wizard-add-contact-dialog').parent().find('button').button('option','disabled',true);
        YAHOO.Convio.PC2.AddressBook.addAddressBookContact(addContactCallback, contact);
    }
}
function saveEditedContactFromDialog(contactId) {
  var contact = {
    contactId: contactId,
    firstName: jQuery('#dialog_contactedit_first_name').val(),
    lastName: jQuery('#dialog_contactedit_last_name').val(),
    email: jQuery('#dialog_contactedit_email').val(),
    street1: jQuery('#dialog_contactedit_address1').val(),
    street2: jQuery('#dialog_contactedit_address2').val(),
    street3: jQuery('#dialog_contactedit_address3').val(),
    city: jQuery('#dialog_contactedit_city').val(),
    state: jQuery('#dialog_contactedit_state').val(),
    county: jQuery('#dialog_contactedit_county').val(),
    zip: jQuery('#dialog_contactedit_zip').val(),
    country: jQuery('#dialog_contactedit_country').val(),
    phone: jQuery('#dialog_contactedit_phone').val()
  };
  if( !jQuery('#email-wizard-edit-contact-dialog').parent().find('button').button('option','disabled' ) ) {
    jQuery('#email-wizard-edit-contact-dialog').parent().find('button').button('option','disabled',true);
    YAHOO.Convio.PC2.Teamraiser.updateAddressBookContact(saveContactDialogCallback, contact);
  }
}

function fillEditContactDialogLabels() {
  jQuery('#dialog_msg_cat_contact_edit_first_name_label').html( jQuery('#msg_cat_contact_edit_first_name_label').html() );
  jQuery('#dialog_msg_cat_contact_edit_last_name_label').html( jQuery('#msg_cat_contact_edit_last_name_label').html() );
  jQuery('#dialog_msg_cat_contact_edit_email_label').html( jQuery('#msg_cat_contact_edit_email_label').html() );
  jQuery('#dialog_msg_cat_contact_edit_address1_label').html( jQuery('#msg_cat_contact_edit_address1_label').html() );
  jQuery('#dialog_msg_cat_contact_edit_address2_label').html( jQuery('#msg_cat_contact_edit_address2_label').html() );
  jQuery('#dialog_msg_cat_contact_edit_address3_label').html( jQuery('#msg_cat_contact_edit_address3_label').html() );
  jQuery('#dialog_msg_cat_contact_edit_city_label').html( jQuery('#msg_cat_contact_edit_city_label').html() );
  jQuery('#dialog_msg_cat_contact_edit_state_label').html( jQuery('#msg_cat_contact_edit_state_label').html() );
  jQuery('#dialog_msg_cat_contact_edit_county_label').html( jQuery('#msg_cat_contact_edit_county_label').html() );
  jQuery('#dialog_msg_cat_contact_edit_zip_label').html( jQuery('#msg_cat_contact_edit_zip_label').html() );
  jQuery('#dialog_msg_cat_contact_edit_country_label').html( jQuery('#msg_cat_contact_edit_country_label').html() );
  jQuery('#dialog_msg_cat_contact_edit_phone_label').html( jQuery('#msg_cat_contact_edit_phone_label').html() );
  if (YAHOO.Convio.PC2.Config.isUKLocale()) {
    jQuery('.email-wizard-contact-edit-state').hide();
    jQuery('.email-wizard-contact-edit-address3').show();
    jQuery('.email-wizard-contact-edit-county').show();
  } else {
    jQuery('.email-wizard-contact-edit-state').show();
    jQuery('.email-wizard-contact-edit-address3').hide();
    jQuery('.email-wizard-contact-edit-county').hide();
  }
}

function loadEditContactDialogData(contact) {
  jQuery('#email-wizard-edit-contact-dialog form')[0].reset();
  jQuery('#email-wizard-edit-contact-dialog #dialog_contactedit_first_name').val( contact.firstName?contact.firstName:'' );
  jQuery('#email-wizard-edit-contact-dialog #dialog_contactedit_last_name').val( contact.lastName?contact.lastName:'' );
  jQuery('#email-wizard-edit-contact-dialog #dialog_contactedit_email').val( contact.email?contact.email:'' );
  jQuery('#email-wizard-edit-contact-dialog #dialog_contactedit_address1').val( contact.street1?contact.street1:'' );
  jQuery('#email-wizard-edit-contact-dialog #dialog_contactedit_address2').val( contact.street2?contact.street2:'' );
  jQuery('#email-wizard-edit-contact-dialog #dialog_contactedit_address3').val( contact.street3?contact.street3:'' );
  jQuery('#email-wizard-edit-contact-dialog #dialog_contactedit_city').val( contact.city?contact.city:'' );
  jQuery('#email-wizard-edit-contact-dialog #dialog_contactedit_state').val( contact.state?contact.state:'' );
  jQuery('#email-wizard-edit-contact-dialog #dialog_contactedit_county').val( contact.county?contact.county:'' );
  jQuery('#email-wizard-edit-contact-dialog #dialog_contactedit_zip').val( contact.zip?contact.zip:'' );
  jQuery('#email-wizard-edit-contact-dialog #dialog_contactedit_country').val( contact.country?contact.country:'' );
  jQuery('#email-wizard-edit-contact-dialog #dialog_contactedit_phone').val( contact.phone?contact.phone:'' );
}

function showEditContactDialog(contactId) {
  var contact = myContactsMap[contactId];
  if(!contact)
    return;

  fillEditContactDialogLabels();
  loadEditContactDialogData(contact);
  jQuery('#contactedit-dialog-error').empty().hide();

  var btnCfg = {};
  btnCfg[jQuery('#msg_cat_contact_edit_cancel_link').html()] = function(){ jQuery(this).dialog("close") };
  btnCfg[jQuery('#msg_cat_contact_edit_save_button').html()] = function(e) { saveEditedContactFromDialog(contactId); };

  jQuery('#email-wizard-edit-contact-dialog').dialog({
    modal: true,
    title: jQuery('#msg_cat_contact_details_edit_info').html(),
    dialogClass: 'email-wizard-dialog',
    buttons: btnCfg,
    resizable: false,
    close: false,
    minWidth: 400
  });

  jQuery('#email-wizard-edit-contact-dialog input').keyup( function(e) {
    if( e.keyCode===13 )
      saveEditedContactFromDialog(contactId);
  });

  jQuery("div.email-wizard-dialog button").removeClass('ui-state-default');
  jQuery("div.email-wizard-dialog button:nth-child(2)").addClass("primary");
}
