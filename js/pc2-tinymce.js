/* 
 * pc2-tinymce.js
 * Copyright 2010, Convio
 *
 * Defines PC2 specific utility functions for working with tinyMCE.
 * 
 * Transitive dependency management defined in pc2-tinymce (modules.js).
 */
YAHOO.log('Included PC2-specific support for tiny MCE.','info','pc2-tinymce.js');

YAHOO.Convio.PC2.TinyMCE = {
		
		initWysiwygComponents: function (commaSeparatedTextAreaElements) {
	
			var pluginUrl = '../../../../mce/plugins/convio_spellcheck/editor_plugin' + tinymce.suffix + '.js';
			tinymce.PluginManager.load('convio_spellcheck', pluginUrl, function() {
				YAHOO.log('Successfully loaded TinyMCE convio_spellcheck plugin', 'info', 'tinymce-plugin-convio-spellcheck-dependencies.js')
			});
			
			var tinyMceLanguage = this.resolveWysiwygLanague();
		
			tinyMCE.init( {
					language: tinyMceLanguage,
					mode : "exact",
					elements: commaSeparatedTextAreaElements,
					theme : "advanced",
					plugins : "paste,convio_spellcheck",
                    paste_text_sticky_default: true,
                    paste_text_sticky: true,
					theme_advanced_buttons1 : "convio_spellcheck,separator,fontselect,fontsizeselect,separator,forecolor,backcolor, pasteword",
					theme_advanced_buttons2 : "bold,italic,underline,separator,strikethrough,justifyleft,justifycenter,justifyright, justifyfull,bullist,numlist,indent,outdent,undo,redo",
					theme_advanced_buttons3 : "",
					theme_advanced_toolbar_location : "top",
					theme_advanced_toolbar_align : "left",
					width : "99.9%",
					height : "250px",
					init_instance_callback : function(instance)
					{
						YAHOO.log('TinyMCE initialized text area: ' + instance.editorId, 'info', 'tinymce-plugin-convio-spellcheck-dependencies.js');
					}
				});
		},

		resolveWysiwygLanague: function () {
			
			var wysiwygLanguage = 'en';
			
			var currentlySelectedLocale = YAHOO.Convio.PC2.Config.getLocale();
			if (currentlySelectedLocale && currentlySelectedLocale != null) {
				
				currentlySelectedLocale = currentlySelectedLocale.toString();
				
				if (currentlySelectedLocale.search('^en') === 0) {
					// user selected locale starts with 'en'
					wysiwygLanguage = 'en';
				}
				else if (currentlySelectedLocale.search('^es') === 0) {
					// user selected locale starts with 'es'
					wysiwygLanguage = 'es';
				}
				else if (currentlySelectedLocale.search('^fr') === 0) {
					// user selected locale starts with 'es'
					wysiwygLanguage = 'fr';
				}
				else {
					// unexpected user selected locale
					wysiwygLanguage = 'en';
					YAHOO.log('Unexpected user selected locale ' + currentlySelectedLocale + '.  TinyMCE may use the wrong language pack!', 'warn', 'tinymce-plugin-convio-spellcheck-dependencies.js');
				}
				
				YAHOO.log('Resolved user selected locale ' + currentlySelectedLocale + ' to the ' + wysiwygLanguage + ' TinyMCE language pack.', 'info', 'tinymce-plugin-convio-spellcheck-dependencies.js');
				
			}	
			
			return wysiwygLanguage;
			
		}
};