function getModules(base, skin, secure) {
	return {
		
		/* 
		 *  ******************** BEGIN TOP-LEVEL DEPENDENCY COLLECTIONS ********************  
		 */
		
		'pc2-core-service-dependencies': {
			// defines core JavaScript dependencies used throughout PC2
			// PC2 page views should cite this set of dependencies as convenient alias for core JavaScript services
		    fullpath: 'js/pc2-core-service-dependencies.js',
		    requires: [ 
		               	'yui2-container',	// UI containers, e.g. dialogs
		               	'pc2-simple-dialog-builder', // dialog builder functions
		               	'yui2-cookie',		// cookie utils
		                'yui2-logger',		// logging
		                'yui2-connection', 	// ajax requests
		                'yui2-json', 		// ajax responses
		                'yui2-datasource',	// data-backed UI containers
		                'yui2-yde', 		// DOM manipulation
		                'event-custom',		// custom events
		                /*
		        		 * TODO DSW Keystone Dojo is no longer used in the latest PC2 code.
		        		 * Remove dojo files defined here after the Snowbird event season is
		        		 * over ... probably in 2012.
		        		 */
		                'dojo-pc2-layer',	// currency utility methods
		                'yui2-reset-fonts-grids',	// essential YUI CSS
		                'history' 			// page history
		              ]
		},
		'pc2-initial-page-view-dependencies': {
			// defines dependencies needed to render PC2's initial page view
		    fullpath: 'js/pc2-initial-page-view-dependencies.js',
		    requires: [ 'pc2-core-service-dependencies', 'yui2-button' ]
		},
		'pc2-loading-container-dependencies': {
			// defines dependencies needed to render the loading container and its progress bar
		    fullpath: 'js/pc2-loading-container-dependencies.js',
		    requires: [ 'jquery-ui', 'jquery-ui-theme-pc2', 'yui2-container', 'yui2-cookie' ]
		},
		
		
		/* 
		 *  ******************** BEGIN INDIVIDUAL DEPENDENCIES ********************  
		 */
		'address-book-import-domain': {
			fullpath: 'js/address_book_import_domain.js'
		},
		'address-book-import-service': {
			fullpath: 'js/address_book_import_rest.js',
			requires: ['address-book-import-domain']
		},
		'address-book-import-retrieve-service-dummy': {
			fullpath: 'js/address_book_import_dummy_retrieve_rest.js',
			requires: ['address-book-import-domain']
		},
		'address-book-import-retrieve-service-convio': {
			fullpath: 'js/address_book_import_convio_retrieve_rest.js',
			requires: ['address-book-import-domain']
		},
		'boxinator': {
			fullpath: base + 'js/convio/boxinator.js',
			requires: ['node', 'yui2-yde', 'yui2-container']
		},
		/*
		 * TODO DSW Keystone Dojo is no longer used in the latest PC2 code.
		 * Remove dojo files defined here after the Snowbird event season is
		 * over ... probably in 2012.
		 */
		'dojo': {
			// the dojo base file
			fullpath: base + 'dojo/dojo/dojo.js'
		},
		'dojo-pc2-layer-supported-locales': {
			// a single file consolidating all locales required to support dojo functions used by PC2
			fullpath: base + 'dojo/dojo/nls/pc2-layer-supported-locales.js',
			requires: ['dojo']
		},
		'dojo-pc2-layer': {
			// the custom pc2 dojo layer built from convio.profile.js
			fullpath: base + 'dojo/dojo/pc2-layer.js',
			requires: ['dojo', 'dojo-pc2-layer-supported-locales']
		},
		'enhanceAddress': {
			fullpath: base + 'js/convio/enhanceAddress.js',
			requires: ['jquery.select-to-autocomplete']
		},
		'global_utils': {
			fullpath: base + 'js/convio/global_utils.js',
			requires: ['yui2-yde']
		},
		'google-jsapi': {
			fullpath: secure ? 'https://www.google.com/jsapi' : 'http://www.google.com/jsapi'
		},
		'hidden_model': {
			fullpath: base + 'js/convio/hidden_model.js',
			requires: ['yui2-yde']
		},
		'jquery': {
			fullpath: base + 'jquery/jquery-1.4.2.min.js',
			requires: ['jquery-detect-existing']
		},
		'jquery-detect-existing': {
			fullpath: base + 'jquery/jquery-detect-existing.js',
			requires: ['logging']
		},
		'jquery-noconflict': {
			fullpath: base + 'jquery/jquery-noconflict.js',
			requires: ['logging', 'jquery']
		},
		'jquery-form': {
			fullpath: base + 'jquery/plugins/form/jquery.form-2.43.js',
			requires: ['jquery-noconflict']
		},
		'jquery-tooltip': {
			fullpath: base + 'jquery/plugins/tooltip/jquery.tooltip-1.3.min.js',
			requires: ['jquery-noconflict', 'jquery-tooltip-styles']
		},
		'jquery-tooltip-styles': {
			fullpath: base + 'jquery/plugins/tooltip/jquery.tooltip-1.3.css',
			type: 'css'
		},
		'jquery-ui': {
			fullpath: base + 'jquery/plugins/ui/jquery-ui-1.8.3.min.js',
			requires: ['jquery-noconflict']
		},
		'jquery-ui-theme-cupertino': {
			fullpath: base + 'jquery/plugins/ui/themes/cupertino/jquery-ui.css',
			requires: ['jquery-ui'],
			type: 'css'
		},
		'jquery-ui-theme-redmond': {
			fullpath: base + 'jquery/plugins/ui/themes/redmond/jquery-ui.css',
			requires: ['jquery-ui'],
			type: 'css'
		},
		'jquery-ui-theme-pc2': {
			fullpath: base + 'jquery/plugins/ui/themes/pc2-custom-theme/jquery-ui.css',
			requires: ['jquery-ui'],
			type: 'css'
		},
		'jquery-validate': {
			fullpath: base + 'jquery/plugins/validate/jquery.validate.min-1.7.js',
			requires: ['jquery-noconflict']
		},
		'jquery.select-to-autocomplete' : {
			fullpath:  base + 'js/jquery.select-to-autocomplete.js',
			requires: ['jquery-ui', 'jquery.select-to-autocomplete.css']
		},
		'jquery.select-to-autocomplete.css' : {
			fullpath:  base + 'css/jquery.select-to-autocomplete.css',
			requires: [],
			type: 'css'
		},
		'logging': {
			fullpath: base + 'js/convio/logging.js'
		},
		'observable_component': {
		    fullpath: base + 'js/obs_comp_rollup.js',
		    requires: ['global_utils', 'utils']
		},
		'participant-company-functions': {
			fullpath: 'js/participant_company_functions.js'
		},
		'pc2-admin-newsfeed-functions': {
			fullpath: 'js/admin-newsfeed-functions.js',
			requires: ['yui2-carousel', 'yui2-paginator', 'yui2-container', 'pc2-admin-newsfeed-common-functions']
		},
		'pc2-admin-newsfeed-common-functions': {
			fullpath: base + 'js/admin-newsfeed-common-functions.js',
			requires: ['yui2-yde']
		},
		'pc2-addressbookimport-functions': {
		    fullpath: 'js/address_book_import_functions.js',
		    requires: [
		               'address-book-import-domain', 'address-book-import-service', 'address-book-import-retrieve-service-convio', 
		               'pc2-data-table-builder', 'jquery-noconflict', 
		               'boxinator', 'yui2-button', 'yui2-connection'
		              ]
		},
		'pc2-compose-functions': {
		    fullpath: 'js/compose-functions.js',
		    requires: ['yui2-autocomplete','yui2-dragdrop']
		},
		'pc2-data-table-builder': {
			fullpath: 'js/data_table_builder.js',
		    requires: ['yui2-datatable', 'yui2-paginator']
		},
		'pc2-drafts-functions': {
		    fullpath: 'js/drafts-functions.js',
		    requires: ['yui2-datatable','yui2-paginator']
		},
		'pc2-sent-functions': {
		    fullpath: 'js/sent-functions.js',
		    requires: ['yui2-datatable','yui2-paginator']
		},
		'pc2-contacts-functions': {
			fullpath: 'js/contacts-functions.js',
		    requires: ['yui2-datatable','yui2-paginator','yui2-menu']
		},
		'pc2-contactdetails-functions': {
			fullpath: 'js/contactdetails-functions.js',
			requires: ['yui2-menu','pc2-contacts-functions']
		},
		'pc2-contactedit-functions': {
			fullpath: 'js/contactedit-functions.js',
			requires: ['pc2-contactdetails-functions']
		},
		'pc2-groups-functions': {
			fullpath: 'js/groups-functions.js',
			requires: ['yui2-menu','pc2-contacts-functions']
		},
		'pc2-personalpage-compose-functions': {
			fullpath: 'js/personalpage-compose-functions.js'
		},
		'pc2-personalpage-media-functions': {
			fullpath: 'js/personalpage-media-functions.js'
		},
		'pc2-teampage-compose-functions': {
			fullpath: 'js/teampage-compose-functions.js'
		},
		'pc2-companypage-compose-functions': {
			fullpath: 'js/companypage-compose-functions.js'
		},
		'pc2-gift-add-functions': {
			fullpath: 'js/gift-add-functions.js'
		},
		'pc2-rest-config': {
			fullpath: 'js/rest-config.js',
			requires : ['rest']
		},
		'pc2-simple-dialog-builder': {
			fullpath: 'js/simple_dialog_builder.js',
		    requires: ['yui2-container', 'jquery-noconflict']
		},
		'pc2-survey-functions': {
			fullpath: 'js/survey-functions.js',
			requires: ['yui2-calendar']
		},
		'pc2-teammates-functions': {
			fullpath: 'js/teammates-functions.js'
		},
		'pc2-manage-membership-functions': {
			fullpath: 'js/manage-membership-functions.js'
		},
		'pc2-team-report-functions': {
			fullpath: 'js/team-report-functions.js',
			requires: ['yui2-charts','yui2-paginator']
		},
		'pc2-tenting-functions': {
			fullpath: 'js/tenting-functions.js',
			requires: ['yui2-datatable','yui2-paginator']
		},
		'pc2-tinymce' : {
			// A PC2-specific wrapper around
			// tinymce-plugin-convio-spellcheck-dependencies that ensures
			// rest.js is not just available, but also properly configured.
			fullpath: 'js/pc2-tinymce.js',
			requires : ['tinymce-plugin-convio-spellcheck-dependencies','pc2-rest-config']
		},
		'pc2-social-functions': {
			fullpath: 'js/share-functions.js',
			requires: ['pc2-social-css', 'boxinator', 'yui2-button', 'yui2-connection']
		},
		'pc2-social-css': {
			fullpath: base + 'css/Social.css',
			type: 'css'
		},
		'rest': {
			fullpath: base + 'js/convio/rest.js',
			requires: ['yui2-yde']
		},
		'selectinator': {
			fullpath: base + 'js/convio/selectinator.js',
			requires: ['global_utils', 'hidden_model', 'yui2-animation', 'yui2-button', 'yui2-connection', 'yui2-datatable', 'yui2-element', 'yui2-tabview']
		},
		'test-assertions': {
			fullpath: base + 'js/convio/test-assertions.js',
			requires: ['test']
		},
		'test-eventhandlers': {
			fullpath: base + 'js/convio/test-eventhandlers.js',
			requires: ['test']
		},
		'tinymce-plugin-convio-spellcheck-dependencies' : {
			// define dependencies used by convio_spellcheck/editor_plugin.js
			fullpath: 'js/tinymce-plugin-convio-spellcheck-dependencies.js',
			requires : ['rest','global_utils']
		},
		'tipinator': {
			fullpath: base + 'js/convio/tipinator.js',
			requires: ['node', 'anim', 'yui2-container', 'tipinator-css']
		},
		'tipinator-css': {
			fullpath: base + 'css/convio/tipinator.css',
			type: 'css'
		},
		'utils': {
		    fullpath: base + 'js/utils.js'
		},
		'ukaddresslookup': {
			fullpath: base + 'js/ukaddresslookup.js',
			requires: ['observable_component']
		},
		'vm_common': {
			fullpath: base + 'js/vm_common.js'
		},
		'vm_stag_event_calendar': {
			fullpath: base + 'js/vm_stag_event_calendar.js',
			requires: ['vm_common', 'yui2-yde', 'yui2-calendar', 'yui2-connection', 'yui2-json']
		},
		'vm_stag_jukebox': {
			fullpath: base + 'js/vm_stag_jukebox.js',
			requires: ['vm_common', 'yui2-yde', 'yui2-connection', 'yui2-json']
		},
		'vm_stag_location_map': {
			fullpath: base + 'js/vm_stag_location_map.js',
			requires: ['vm_common', 'yui2-yde', 'yui2-connection', 'yui2-json']
		},
		'vm_stag_zip_map': {
			fullpath: base + 'js/vm_stag_zip_map.js',
			requires: ['vm_common', 'yui2-yde', 'yui2-connection', 'yui2-json']
		},
		'yui2-animation': {
			fullpath: base + 'yui/animation/animation-min.js',
			requires: ['yui2-yde']
		},
		'yui2-autocomplete': {
		    fullpath: base + 'yui/autocomplete/autocomplete-min.js',
		    requires: ['yui2-animation']
		},
		'yui2-button': {
			fullpath: base + 'yui/button/button-min.js',
			requires: ['yui2-element', 'yui2-button-core-css', 'yui2-button-skin-css']
		},
		'yui2-button-core-css': {
			fullpath: base + 'yui/button/assets/button-core.css',
			type: 'css'
		},
		'yui2-button-skin-css': {
			fullpath: base + 'yui/button/assets/skins/' + skin + '/button-skin.css',
			type: 'css'
		},
		'yui2-calendar': {
			fullpath: base + 'yui/calendar/calendar-min.js',
			requires: ['yui2-yde', 'yui2-calendar-core-css', 'yui2-calendar-skin-css']
		},
		'yui2-calendar-core-css': {
			fullpath: base + 'yui/calendar/assets/calendar-core.css',
			type: 'css'
		},
		'yui2-calendar-skin-css': {
			fullpath: base + 'yui/calendar/assets/skins/' + skin + '/calendar-skin.css',
			type: 'css'
		},
		'yui2-carousel' : {
			fullpath: base + "yui/carousel/carousel-min.js",
			requires: ['yui2-element', 'yui2-carousel-core-css', /*'yui2-carousel-skin-css'*/]
		},
		'yui2-carousel-core-css' : {
			fullpath: base + 'yui/carousel/assets/carousel-core.css',
			type: 'css'
		},
		/*
		'yui2-carousel-skin-css' : {
			fullpath: base + 'yui/carousel/assets/skins/' + skin + '/carousel-skin.css',
			type: 'css'
		},
		*/
		'yui2-charts': {
		},
		'yui2-connection': {
			fullpath: base + 'yui/connection/connection-min-patched.js',
			requires: ['yui2-yde']
		},
		'yui2-container': {
			fullpath: base + 'yui/container/container-min.js',
			requires: ['yui2-yde', 'yui2-container-core-css', 'yui2-container-skin-css']
		},
		'yui2-container-core-css': {
			fullpath: base + 'yui/container/assets/container-core.css',
			type: 'css'
		},
		'yui2-container-skin-css': {
			fullpath: base + 'yui/container/assets/skins/' + skin + '/container-skin.css',
			type: 'css'
		},
		'yui2-cookie': {
			fullpath: base + 'yui/cookie/cookie-min.js',
			requires: ['yui2-yde']
		},
		'yui2-charts': {
            fullpath: base + 'yui/charts/charts-min.js',
            requires: ['yui2-swf','yui2-yde']
		},
		'yui2-datasource': {
			fullpath: base + 'yui/datasource/datasource-min.js',
			requires: ['yui2-yde']
		},
		'yui2-datatable': {
			fullpath: base + 'yui/datatable/datatable-min.js',
			requires: ['yui2-element', 'yui2-datasource', 'yui2-datatable-core-css', 'yui2-datatable-skin-css']
		},
		'yui2-datatable-core-css': {
			fullpath: base + 'yui/datatable/assets/datatable-core.css',
			type: 'css'
		},
		'yui2-datatable-skin-css': {
			fullpath: base + 'yui/datatable/assets/skins/' + skin + '/datatable-skin.css',
			type: 'css'
		},
		'yui2-dragdrop': {
			fullpath: base + 'yui/dragdrop/dragdrop-min.js',
			requires: ['yui2-yde']
		},
		'yui2-element': {
			fullpath: base + 'yui/element/element-min.js',
			requires: ['yui2-yde']
		},
		'yui2-json': {
			fullpath: base + 'yui/json/json-min.js',
			requires: ['yui2-yde']
		},
		'yui2-logger': {
		    fullpath: base + 'yui/logger/logger-min.js'
		},
		'yui2-menu': {
			fullpath: base + 'yui/menu/menu-min.js',
			requires: ['yui2-container', 'yui2-menu-core-css', 'yui2-menu-skin-css']
		},
		'yui2-menu-core-css': {
			fullpath:  base + 'yui/menu/assets/menu-core.css',
			type: 'css'
		},
		'yui2-menu-skin-css': {
			fullpath:  base + 'yui/menu/assets/skins/' + skin + '/menu-skin.css',
			type: 'css'
		},
		'yui2-paginator': {
		    fullpath: base + 'yui/paginator/paginator-min.js',
		    requires: ['yui2-datatable']
		},
        'yui2-reset-fonts-grids': {
		    fullpath: base + 'yui/reset-fonts-grids/reset-fonts-grids.css',
		    type: 'css'
		},
		'yui2-storage': {
		    fullpath: base + 'yui/storage/storage-min.js',
		    requires: ['yui2-yde']
		},
		'yui2-swf': {
		    fullpath: base + 'yui/swf/swf-min.js',
		    requires: ['yui2-yde']
		},
		'yui2-swfstore': {
		    fullpath: base + 'yui/swfstore/swfstore-min.js',
		    requires: ['yui2-swf']
		},
		'yui2-tabview': {
			fullpath: base + 'yui/tabview/tabview-min.js',
			requires: ['yui2-element', 'yui2-tabview-core-css', 'yui2-tabview-skin-css']
		},
		'yui2-tabview-core-css': {
			fullpath: base + 'yui/tabview/assets/tabview-core.css',
			type: 'css'
		},
		'yui2-tabview-skin-css': {
			fullpath: base + 'yui/tabview/assets/skins/' + skin + '/tabview-skin.css',
			type: 'css'
		},
		'yui2-yde': {
			fullpath: base + 'yui/yahoo-dom-event/yahoo-dom-event.js'
		}
	};
}
