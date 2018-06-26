/* 
 * rest-config.js
 * Copyright 2010, Convio
 *
 * Configures the general YAHOO.Convio.REST.Config with appropriate PC2-specific values.
 * 
 * Depends on:
 * YAHOO.Convio.PC2.Config (from convio_config.js)
 * YAHOO.Convio.REST.Config (from rest.js)
 */

YAHOO.Convio.PC2.RestConfig = {
		initialize: function() {
			YAHOO.Convio.REST.Config.initialize(YAHOO.Convio.PC2.Config.getAuth(), YAHOO.Convio.PC2.Config.getApiKey(), YAHOO.Convio.PC2.Config.getVersion());
			YAHOO.Convio.REST.Paths.setAddressBookPath(YAHOO.Convio.PC2.Config.AddressBook.getUrl());
			YAHOO.Convio.REST.Paths.setConstituentPath(YAHOO.Convio.PC2.Config.Constituent.getUrl());
			YAHOO.Convio.REST.Paths.setContentPath(YAHOO.Convio.PC2.Config.Content.getUrl());
			YAHOO.Convio.REST.Paths.setTeamRaiserPath(YAHOO.Convio.PC2.Config.Teamraiser.getUrl());
			
			YAHOO.log('Configured low-level REST objects with values appropriate for PC2.','info','rest-config.js');
		}
};

YAHOO.Convio.PC2.RestConfig.initialize();