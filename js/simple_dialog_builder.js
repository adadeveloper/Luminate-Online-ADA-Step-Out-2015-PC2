/* simple_dialog_builder.js
 * Copyright 2011, Convio
 *
 * Provides builder functions that can be used for creating YUI SimpleDialogs, 
 * standardizing the basic features of Dialogs in PC2 while also
 * minimizing the need for copy/paste code.
 * 
 * Dependencies declared in modules.js.
 */
YAHOO.namespace("Convio.PC2.Component");
YAHOO.Convio.PC2.Component.SimpleDialogBuilder = {
	

	/**
	 * Builds an instance of YAHOO.Convio.PC2.Component.PC2SimpleDialog that is appropriate
	 * for rendering PC2 confirm dialogs.
	 */	
	buildConfirmDialog: function(containerId, buttonsArray, dialogConfigOverrides) {
	
		var dialogConfig = {
				width: "30em",
                visible: false,
                draggable: false,
                modal: true,
                close: false,
                icon: YAHOO.widget.SimpleDialog.ICON_INFO,
                buttons: buttonsArray
		};
		
		// apply any config overrides
		for (var key in dialogConfigOverrides) {
			dialogConfig[key] = dialogConfigOverrides[key];
		}
		
		var dialog = new YAHOO.Convio.PC2.Component.PC2SimpleDialog(containerId, dialogConfig);
		
		return dialog;
	},
	

	/**
	 * Builds the most basic instance of YAHOO.Convio.PC2.Component.PC2SimpleDialog that is
	 * appropriate for any type PC2 dialog.
	 */	
	buildBasicDialog: function(containerId, dialogConfigOverrides) {
		
		var dialogConfig = {
				width: '30em', 
				modal: true, 
				close: false
		};
		
		// apply any config overrides
		for (var key in dialogConfigOverrides) {
			dialogConfig[key] = dialogConfigOverrides[key];
		}
		
		var dialog = new YAHOO.Convio.PC2.Component.PC2SimpleDialog(containerId, dialogConfig);
		
		return dialog;
	},
	
	/**
	 * Applies standard PC2-specific values to a collection of dialog config values.
	 * More specifically, this helper function applies different config values depending
	 * on whether the PC2 instance is stand-alone or embedded in an iFrame.  
	 */
	decorateDialogConfigForPC2: function(dialogConfig) {
		if (YAHOO.Convio.PC2.Utils.isIFrameDetected()) {
			// don't use YUI centering when PC2 is in iFrame
			dialogConfig['fixedcenter'] = false;
			dialogConfig['constraintoviewport'] = false;
		}
		else {
			// let YUI manage centering our dialog
			dialogConfig['fixedcenter'] = true;
			dialogConfig['constraintoviewport'] = true;
		}
	},
	
	/**
	 * Applies standard PC2-specific event handlers to a dialog.
	 * More specifically, this helper function applies different behavior to the dialog 
	 * depending on whether the PC2 instance is stand-alone or embedded in an iFrame.  
	 */
	decorateDialogForPC2: function(dialog) {
		if (YAHOO.Convio.PC2.Utils.isIFrameDetected()) {
			dialog.beforeShowEvent.subscribe(function() {
				// before show, move the dialog just a bit off the screen ...
				// this causes the browser to focus to the top of the iframe
				dialog.moveTo(0, -100);
			});
			
			dialog.showEvent.subscribe(function() {
				
				// middle of iframe
				var x = (jQuery(window).width() - jQuery(dialog.element).width()) / 2;
				// constant value from the top of the iframe
				var y = 150;
				dialog.moveTo(x, y);
			});
		}
	}
		
}; // end YAHOO.Convio.PC2.Component.SimpleDialogBuilder


/**
 * Extends YAHOO.widget.SimpleDialog, enforcing expected behaviors for PC2 dialogs  
 */
YAHOO.Convio.PC2.Component.PC2SimpleDialog = function(containerId, dialogConfig) {
	
	// manipulate the dialog config collection for PC2-mandated behavior
	YAHOO.Convio.PC2.Component.SimpleDialogBuilder.decorateDialogConfigForPC2(dialogConfig);
	
	// call the parent constructor
	YAHOO.Convio.PC2.Component.PC2SimpleDialog.superclass.constructor.call(this, containerId, dialogConfig);
	
	// apply some standard PC2 event handles to the newly constructed dialog
	YAHOO.Convio.PC2.Component.SimpleDialogBuilder.decorateDialogForPC2(this);
};
YAHOO.lang.extend(YAHOO.Convio.PC2.Component.PC2SimpleDialog, YAHOO.widget.SimpleDialog);


/**
 * Extends YAHOO.widget.Dialog, enforcing expected behaviors for PC2 dialogs  
 */
YAHOO.Convio.PC2.Component.PC2Dialog = function(containerId, dialogConfig) {
	
	// manipulate the dialog config collection for PC2-mandated behavior
	YAHOO.Convio.PC2.Component.SimpleDialogBuilder.decorateDialogConfigForPC2(dialogConfig);
	
	// call the parent constructor
	YAHOO.Convio.PC2.Component.PC2Dialog.superclass.constructor.call(this, containerId, dialogConfig);
	
	// apply some standard PC2 event handles to the newly constructed dialog
	YAHOO.Convio.PC2.Component.SimpleDialogBuilder.decorateDialogForPC2(this);
};
YAHOO.lang.extend(YAHOO.Convio.PC2.Component.PC2Dialog, YAHOO.widget.Dialog);
	