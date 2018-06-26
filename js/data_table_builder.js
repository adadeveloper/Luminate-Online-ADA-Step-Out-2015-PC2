/* data_table_builder.js
 * Copyright 2010, Convio
 *
 * Provides builder functions that can be used for creating YUI DataTables, 
 * standardizing the basic features of DataTables in PC2 while also
 * minimizing the need for copy/paste code for those tables.
 * 
 * Dependencies declared in modules.js.
 */
YAHOO.namespace("Convio.PC2.Component");
YAHOO.Convio.PC2.Component.DataTableBuilder = {
		
	buildDataTable: function(containerId, columnDefinitions, dataSource, tableConfigOverrides, msgCatProvider, shouldScroll) {
	
		// what type of table do we want to build?
		var DataTableConstructorFunction = (shouldScroll) ? YAHOO.widget.ScrollingDataTable : YAHOO.widget.DataTable;
		
		var paginator_of = (msgCatProvider) ? msgCatProvider.getMsgCatValue('paginator_of') : 'of';
		
		// define default characteristics of our table
		var tableConfig = {
				paginator : new YAHOO.widget.Paginator({
					rowsPerPage: 100,
			        pageLinks: 5,
			        alwaysVisible: false,
			        containers: [containerId + '-pagination'],
					template: "&nbsp;{FirstPageLink}&nbsp;{PreviousPageLink}&nbsp;{CurrentPageReport}&nbsp;{NextPageLink}&nbsp;{LastPageLink}",
					firstPageLinkLabel: "&laquo;",
					firstPageLinkTitle : msgCatProvider.getMsgCatValue('paginator_first_page_title'),
		            previousPageLinkLabel: "&lsaquo;",
		            previousPageLinkTitle : msgCatProvider.getMsgCatValue('paginator_previous_page_title'),
		            nextPageLinkLabel: "&rsaquo;",
		            nextPageLinkTitle : msgCatProvider.getMsgCatValue('paginator_next_page_title'),
		            lastPageLinkLabel: "&raquo;",
		            lastPageLinkTitle : msgCatProvider.getMsgCatValue('paginator_last_page_title'), 
					pageReportTemplate: "<b>{startRecord}-{endRecord}</b> " + paginator_of + " {totalRecords}"
			    })
		};
		
		// process any table characteristic overrides
		for (var key in tableConfigOverrides) {
			tableConfig[key] = tableConfigOverrides[key];
		}
		
		var dataTable = new DataTableConstructorFunction(
				containerId,
				columnDefinitions, 
				dataSource,
				tableConfig
	    );
		
		return dataTable;
	
	}
		
}