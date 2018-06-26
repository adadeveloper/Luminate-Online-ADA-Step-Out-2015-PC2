var AddGiftCallback = {
    success: function(o) {
        var addButton = YAHOO.util.Dom.get("quick-gift-submit");
        var addAnotherButton = YAHOO.util.Dom.get("gift-add-another");
        addButton.disabled = false;
        addAnotherButton.disabled = false;
        if(isTeamGift) {
        	var giftAmount = YAHOO.util.Dom.get("gift_amount").innerHTML;
        	var penniesAdded = YAHOO.Convio.PC2.Utils.parseCurrency(giftAmount);
        	YAHOO.Convio.PC2.Component.Teamraiser.ProgressData.teamProgress.raised += penniesAdded;
        	
        	YAHOO.Convio.PC2.Views.reportTeamReset = true;
        	if(isAddAnother) {
        		clearGiftFields();
        		show_pc2_element("gift-submit-success");
        		YAHOO.Convio.PC2.Utils.loadView("gift","team");
        	} else {
        		YAHOO.Convio.PC2.Utils.loadView("report","team");
        	}
        } else {
        	var giftAmount = YAHOO.util.Dom.get("gift_amount").innerHTML;
        	var penniesAdded = YAHOO.Convio.PC2.Utils.parseCurrency(giftAmount);
        	YAHOO.Convio.PC2.Component.Teamraiser.ProgressData.personalProgress.raised += penniesAdded;
        	
        	YAHOO.Convio.PC2.Views.reportPersonalReset = true;
        	if(isAddAnother) {
        		clearGiftFields();
        		show_pc2_element("gift-submit-success");
        		YAHOO.Convio.PC2.Utils.loadView("gift","add");
        	} else {
        		YAHOO.Convio.PC2.Utils.loadView("report","personal");
        	}
        }
        var response = YAHOO.lang.JSON.parse(o.responseText).addGiftResponse;
        var gift = response.gift;
        // myContactsMap should only be initialized if the compose page has already
        // been loaded. This is also where the GetContactsByIdsCallback is defined.
        if(typeof(myContactsMap) != "undefined") {
        	if(!myContactsMap[gift.contactId] && gift.contactId != 0) {
        		YAHOO.Convio.PC2.Teamraiser.getAddressBookContactsByIds(GetContactsByIdsCallback, gift.contactId);
        	}
        }
        // Reset the contacts page, just in case.
        YAHOO.Convio.PC2.Views.emailContactsReset = true;

        // Fire an event
        YAHOO.Convio.PC2.Utils.publisher.fire("pc2:giftAdded", gift);
    },

    failure: function(o) {
    	var addButton = YAHOO.util.Dom.get("quick-gift-submit");
    	var addAnotherButton = YAHOO.util.Dom.get("gift-add-another");
    	addButton.disabled = false;
    	addAnotherButton.disabled = false;
    	show_pc2_element("gift-submission-error");
    	
        var err = YAHOO.lang.JSON.parse(o.responseText).errorResponse;
        if(err.code == 2665){
            show_pc2_element("gift_too_small_error");
        } else if(err.code == 2710) {
        	show_pc2_element("gift-card-submission-error");
        	hide_pc2_element("gift-submission-error");
        }
        
        YAHOO.log(o.responseText, "error", "gift.js");
    },

    scope: YAHOO.Convio.PC2.Teamraiser
};

var isGiftPaymentTypeCredit = function(){
	return jQuery('input:radio[name=gift_payment_type]:checked').val() === 'credit';
};

var isGiftPaymentTypeCheck = function(){
	return jQuery('input:radio[name=gift_payment_type]:checked').val() === 'check';
}; 

// a global variable used to track gift form submission type 
var gift_add_submitMultiple = false;

function setSubmitMultipleGifts() {
	gift_add_submitMultiple = true;
}

function setSubmitSingleGift() {
	gift_add_submitMultiple = false;
}

function isSubmitMultipleGifts() {
	return gift_add_submitMultiple;
}

function submitAnotherGift() {
	doGiftSubmit(true);
}

function submitQuickGift() {
	doGiftSubmit(false);
}

function doGiftSubmit(addAnotherFlag) {
	isAddAnother = addAnotherFlag;
    clearGiftMessages();
    var addButton = YAHOO.util.Dom.get("quick-gift-submit");
    var addAnotherButton = YAHOO.util.Dom.get("gift-add-another");
    // validate that all field are entered
    var firstName = YAHOO.util.Dom.get("gift_first_name");
    var error = false;
    if(isValidString(firstName.value) == false) {
        error = true;
    }
    var lastName = YAHOO.util.Dom.get("gift_last_name");
    if(isValidString(lastName.value) == false) {
        error = true;
    }
    var email = YAHOO.util.Dom.get("gift_email");
    var giftAmount = YAHOO.util.Dom.get("gift_amount");
    if(isValidString(giftAmount.value) == false) {
        error = true;
    }
    
    var giftAidDeclarationCheckbox = YAHOO.util.Dom.get("gift_aid_declaration");
    var giftAidStatus = giftAidDeclarationCheckbox.checked ? "1" : "0";
    
    var paymentType = null;
    // determine if radio buttons checked
    var cashRadioButton = YAHOO.util.Dom.get("gift_payment_type_cash");
    if(cashRadioButton.checked) {
        paymentType = cashRadioButton.value;
    }
    var checkNumber;
    var checkRadioButton = YAHOO.util.Dom.get("gift_payment_type_check");
    if(checkRadioButton.checked) {
        paymentType = checkRadioButton.value;
        var checkNumberItem = YAHOO.util.Dom.get("check_number").value;
        if(isValidString(checkNumberItem)) {
            checkNumber = checkNumberItem;
        } else {
            error = true;
        }
    }
    var creditRadioButton = YAHOO.util.Dom.get("gift_payment_type_credit");
    if(creditRadioButton.checked) {
        paymentType = creditRadioButton.value;
    }
    var laterRadioButton = YAHOO.util.Dom.get("gift_payment_type_later");
    if(laterRadioButton.checked) {
        paymentType = laterRadioButton.value;
    }
    if( paymentType == null) {
        error = true;
    }
    var street1 = YAHOO.util.Dom.get("gift_street1");
    var street2 = YAHOO.util.Dom.get("gift_street2");
    var street3 = YAHOO.util.Dom.get("gift_street3");
    var city = YAHOO.util.Dom.get("gift_city");
    var state = YAHOO.util.Dom.get("gift_state");
    var county = YAHOO.util.Dom.get("gift_county");
    var zip = YAHOO.Convio.PC2.Config.isUKLocale() ? YAHOO.util.Dom.get("gift_postcode") : YAHOO.util.Dom.get("gift_zip");
    var country = YAHOO.util.Dom.get("gift_country");
    var recognitionName = YAHOO.util.Dom.get("gift_recognition_name");
    var displayGift = YAHOO.util.Dom.get("gift_display_personal_page");
    
    var billingFirstName;
    var billingLastName;
    var billingStreet1;
    var billingStreet2;
    var billingCity;
    var billingState;
    var billingZip;
    var billingCardNumber;
    var billingVerificationCode;
    var billingMonth;
    var billingYear;
    if(paymentType == creditRadioButton.value) {
        billingFirstName = YAHOO.util.Dom.get("billing_first_name").value;
        billingLastName = YAHOO.util.Dom.get("billing_last_name").value;
        billingStreet1 = YAHOO.util.Dom.get("billing_street1").value;
        billingStreet2 = YAHOO.util.Dom.get("billing_street2").value;
        billingCity = YAHOO.util.Dom.get("billing_city").value;
        billingState = YAHOO.util.Dom.get("billing_state").value;
        billingZip = YAHOO.util.Dom.get("billing_zip").value;
        billingCardNumber = YAHOO.util.Dom.get("credit_card_number").value;
        billingVerificationCode = YAHOO.util.Dom.get("credit_verification_code").value;
        billingMonth = YAHOO.util.Dom.get("credit_expiration_month").value;
        billingYear = YAHOO.util.Dom.get("credit_expiration_year").value;
        
        if(isValidString(billingFirstName) == false || isValidString(billingLastName) == false ||
                isValidString(billingStreet1) == false || isValidString(billingCity) == false ||
                isValidString(billingState) == false || isValidString(billingZip) == false ||
                isValidString(billingCardNumber) == false || isValidString(billingVerificationCode) == false) {
            error = true;
        }
    }
    var teamraiserConfig = YAHOO.Convio.PC2.Data.TeamraiserConfig;
    
    var giftCategoryId;
    if(teamraiserConfig.showGiftCategories == "true") {
        var giftCategory = YAHOO.util.Dom.get("gift-category-list");
        if(YAHOO.lang.isUndefined(giftCategory) == false && 
                YAHOO.lang.isNull(giftCategory) == false) {
            var selectedCatId = giftCategory.options[giftCategory.selectedIndex].value;
            if(selectedCatId > 0) {
                giftCategoryId = selectedCatId;
            }
        }
    }
    
    if(error) {
        show_pc2_element("gift-error");
    } else {
        addButton.disabled = true;
        addAnotherButton.disabled = true;
        // submit
        var offlineGift = new Object();
                
        offlineGift.firstName = firstName.value;
        offlineGift.lastName = lastName.value;
        offlineGift.email = email.value;
        offlineGift.giftAmount = giftAmount.value;
        offlineGift.giftAidStatus = giftAidStatus;
        offlineGift.paymentType =  paymentType;
        if(hasValue(street1)) {
            offlineGift.street1 = street1.value;
        }
        if(hasValue(street2)) {
            offlineGift.street2 = street2.value;
        }
        if(hasValue(street3)) {
            offlineGift.street3 = street3.value;
        }
        if(hasValue(city)) {
            offlineGift.city = city.value;
        }
        if(hasValue(state)) {
            offlineGift.state = state.value;
        }
        if(hasValue(county)) {
            offlineGift.county = county.value;
        }
        if(hasValue(zip)) {
            offlineGift.zip = zip.value;
        }
        if(hasValue(country)) {
            offlineGift.country = country.value;
        }
        if(hasValue(recognitionName)) {
            offlineGift.recognitionName = recognitionName.value;
        }
        // Gifts are displayed by default.  Only include if display gift has been deselected.
        if(!displayGift.checked){
            offlineGift.displayGift = "false" 
        }
        
        if(paymentType == checkRadioButton.value) {
            offlineGift.checkNumber = checkNumber;
        }        
        if(paymentType == creditRadioButton.value) {
            offlineGift.billingFirstName = billingFirstName;
            offlineGift.billingLastName = billingLastName;
            offlineGift.billingStreet1 = billingStreet1;
            offlineGift.billingStreet2 = billingStreet2;
            offlineGift.billingCity = billingCity;;
            offlineGift.billingState = billingState;
            offlineGift.billingZip = billingZip;
            offlineGift.billingCardNumber = billingCardNumber;
            offlineGift.billingVerificationCode = billingVerificationCode;
            offlineGift.billingMonth = billingMonth;
            offlineGift.billingYear = billingYear;
        }
        if(isTeamGift) {
            offlineGift.teamGift = "true";
        }
        if(YAHOO.lang.isUndefined(giftCategoryId) == false &&
                YAHOO.lang.isNull(giftCategoryId) == false) {
            offlineGift.giftCategoryId = giftCategoryId;
        }
        YAHOO.Convio.PC2.Teamraiser.addGift(AddGiftCallback, offlineGift);
    }
};

function disableQuickGift(e) {
    // stop the default event from the link
    YAHOO.util.Event.stopEvent(e);
    
    var addButton = YAHOO.util.Dom.get("quick-gift-submit");
    addButton.disabled = false;
    show_pc2_element("add-quick-gift-block");
    
    hide_pc2_element("quick-gift-block");
    // clear the existing fields
    var firstName = YAHOO.util.Dom.get("gift_first_name");
    firstName.value = "";
    var lastName = YAHOO.util.Dom.get("gift_last_name");
    lastName.value = "";
    var email = YAHOO.util.Dom.get("gift_email");
    email.value = "";
    var giftAmount = YAHOO.util.Dom.get("gift_amount");
    giftAmount.value = "";
    var giftAidDeclaration = YAHOO.util.Dom.get("gift_aid_declaration");
    giftAidDeclaration.checked = false;
    var cashRadioButton = YAHOO.util.Dom.get("gift_payment_type_cash");
    cashRadioButton.checked = false;
    var checkRadioButton = YAHOO.util.Dom.get("gift_payment_type_check");
    checkRadioButton.checked = false;
    var creditRadioButton = YAHOO.util.Dom.get("gift_payment_type_credit");
    creditRadioButton.checked = false;
    var checkNumber = YAHOO.util.Dom.get("check_number");
    //checkNumber.value = "";
	checkNumber.value = "0";
    hide_pc2_element("check-block");
    // clear the error message
    clearGiftMessages();
    disableAddlGiftOptions();
    if(isTeamGift) {
    	YAHOO.Convio.PC2.Utils.loadView("report","team");
    } else {
    	YAHOO.Convio.PC2.Utils.loadView("report","personal");
    }
};

function isValidString(str) {
    return YAHOO.lang.isUndefined(str) == false && YAHOO.lang.isString(str) && YAHOO.lang.trim(str) != "";
}

function hasValue(o) {
    return isValidString(o.value);
};

function disableAddlPaymentFields() {
    hide_pc2_element("check-block");
    hide_pc2_element("credit-block");
};

function enableCheckFields() {
    show_pc2_element("check-block");
    hide_pc2_element("credit-block");
};

function enableCreditFields() {
    hide_pc2_element("check-block");
    show_pc2_element("credit-block");
};

function enableAddlGiftOptions() {
    show_pc2_element("addl_gift_options");
    hide_pc2_element("addl_gift_enable_toggle");
};

function disableAddlGiftOptions() {
    hide_pc2_element("addl_gift_options");
    show_pc2_element("addl_gift_enable_toggle");
    
    var street1 = YAHOO.util.Dom.get("gift_street1");
    street1.value = "";
    var street2 = YAHOO.util.Dom.get("gift_street2");
    street2.value = "";
    var city = YAHOO.util.Dom.get("gift_city");
    city.value = "";
    var state = YAHOO.util.Dom.get("gift_state");
    state.value = "";
    var zip = YAHOO.util.Dom.get("gift_zip");
    zip.value = "";
    var recognitionName = YAHOO.util.Dom.get("gift_recognition_name");
    recognitionName.value = "";
};

var GetGiftCategoriesCallback = {
    success: function(o) {
        var response = YAHOO.lang.JSON.parse(o.responseText).getGiftCategoriesResponse;
        var giftCategory = response.giftCategory;
        if(YAHOO.lang.isUndefined(giftCategory) == false &&
                YAHOO.lang.isNull(giftCategory) == false) {
            var selectListDiv = "<select id=\"gift-category-list\" name=\"gift-category-list\">";
            
            var blankCategory= {
                    id: -1,
                    name: ""
            };
            selectListDiv += addGiftCategory(blankCategory);
            if(YAHOO.lang.isArray(giftCategory)) {
                for(var i=0; i<giftCategory.length; i++) {
                    selectListDiv += addGiftCategory(giftCategory[i]);
                }
            } else {
                selectListDiv += addGiftCategory(giftCategory);
            }
            selectListDiv += "</select>";
            var giftCategorySection = YAHOO.util.Dom.get("gift-categories-list-section");
            giftCategorySection.innerHTML = selectListDiv;
            show_pc2_element("gift-categories-section");
        }
    },
    failure: function(o) {
        YAHOO.log(o.responseText, "error", "gift.js");
    },
    scope: YAHOO.Convio.PC2.Teamraiser
};

var addGiftCategory = function(giftCategory) {
    var div = "<option value=\"" + giftCategory.id + "\";";
    div += ">";
    div += giftCategory.name;
    div += "</option>";
    return div;
};

var clearGiftMessages = function() {
    hide_pc2_element("gift-error");
    hide_pc2_element("gift_too_small_error");
    hide_pc2_element("gift-submission-error");
    hide_pc2_element("gift-submit-success");
    hide_pc2_element("gift-card-submission-error");
};

var clearGiftFields = function() {
	
	disableAddlPaymentFields();
	
    var firstName = YAHOO.util.Dom.get("gift_first_name");
    firstName.value = "";
    var lastName = YAHOO.util.Dom.get("gift_last_name");
    lastName.value = "";
    var email = YAHOO.util.Dom.get("gift_email");
    email.value = "";
    var giftAmount = YAHOO.util.Dom.get("gift_amount");
    giftAmount.value = "";
    var giftAidDeclaration = YAHOO.util.Dom.get("gift_aid_declaration");
    giftAidDeclaration.checked = false;
    
    var street1 = YAHOO.util.Dom.get("gift_street1");
    street1.value = "";
    var street2 = YAHOO.util.Dom.get("gift_street2");
    street2.value = "";
    var city = YAHOO.util.Dom.get("gift_city");
    city.value = "";
    var state = YAHOO.util.Dom.get("gift_state");
    state.value = "";
    var zip = YAHOO.util.Dom.get("gift_zip");
    zip.value = "";
    var recognitionName = YAHOO.util.Dom.get("gift_recognition_name");
    recognitionName.value = "";
    
    var cashRadioButton = YAHOO.util.Dom.get("gift_payment_type_cash");
    cashRadioButton.checked = false;
    var checkRadioButton = YAHOO.util.Dom.get("gift_payment_type_check");
    checkRadioButton.checked = false;
    var creditRadioButton = YAHOO.util.Dom.get("gift_payment_type_credit");
    creditRadioButton.checked = false;
    var laterRadioButton = YAHOO.util.Dom.get('gift_payment_type_later');
    laterRadioButton.checked = false;
    var checkNumber = YAHOO.util.Dom.get("check_number");
    //checkNumber.value = "";
    checkNumber.value = "0";
    var billingFirstName = YAHOO.util.Dom.get("billing_first_name");
    billingFirstName.value = "";
    var billingLastName = YAHOO.util.Dom.get("billing_last_name");
    billingLastName.value = "";
    var billingStreet1 = YAHOO.util.Dom.get("billing_street1");
    billingStreet1.value = "";
    var billingStreet2 = YAHOO.util.Dom.get("billing_street2");
    billingStreet2.value = "";
    var billingCity = YAHOO.util.Dom.get("billing_city");
    billingCity.value = "";
    var billingState = YAHOO.util.Dom.get("billing_state");
    billingState.value = "";
    var billingZip = YAHOO.util.Dom.get("billing_zip");
    billingZip.value = "";
    var billingCardNumber = YAHOO.util.Dom.get("credit_card_number");
    billingCardNumber.value = "";
    var billingVerificationCode = YAHOO.util.Dom.get("credit_verification_code");
    billingVerificationCode.value = "";
    var billingMonth = YAHOO.util.Dom.get("credit_expiration_month");
    billingMonth.value = "";
    var billingYear = YAHOO.util.Dom.get("credit_expiration_year");
    billingYear.value = "";
};
