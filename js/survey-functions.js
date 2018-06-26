// TODO DSW Olympus place these functions in a non-global namespace

var loadResponse = function(responses, questionsList, question) {
	var label = YAHOO.util.Dom.get("label_" + question.questionId);
	if(label) {
		YAHOO.util.Dom.removeClass(label.parentNode, "failure-message");
	}
    YAHOO.util.Dom.removeClass("hint_" + question.questionId, "failure-message");
    if(    question.questionType == "HiddenTextValue" 
        || question.questionType == "HiddenInterests"
        || question.questionType == "HiddenTrueFalse"
        || question.questionType == "Caption"
        || question.questionType == "Captcha") 
    {
        return;
    }
    
    if(    question.questionType == "MultiSingle" 
        || question.questionType == "YesNo"
        || question.questionType == "TrueFalse") 
    {
        var selectEl = YAHOO.util.Dom.get("question_" + question.questionId);
        var optionEl = selectEl.options[selectEl.selectedIndex];
        responses[responses.length] = { 
            questionId: question.questionId,
            value: optionEl.value
        };
    }
    
    else if(question.questionType == "MultiMulti") {
        if(questionsList[question.questionId]) {
            return;
        }
        questionsList["" + question.questionId] = question.questionId;
        var questionAnswers = YAHOO.Convio.PC2.Utils.ensureArray(question.questionAnswer);
        var found = false;
        for(var i=0; i < questionAnswers.length; i++) {
            var checkBoxEl = YAHOO.util.Dom.get("question_" + question.questionId + "_" + i);
            if(checkBoxEl.checked) {
                found = true;
                responses[responses.length] = {
                    questionId: question.questionId,
                    value: checkBoxEl.value
                };
            }
        }
        if(!found) {
            responses[responses.length] = {
                questionId: question.questionId,
                value: "_NONE"
            };
        }
    }
    
    else if(question.questionType == "Categories") {
        if(questionsList[question.questionId]) {
            return;
        }
        questionsList["" + question.questionId] = question.questionId;
        var questionAnswers = YAHOO.Convio.PC2.Utils.ensureArray(question.questionAnswer);
        var found = false;
        for(var i=0; i < questionAnswers.length; i++) {
            var checkBoxEl = YAHOO.util.Dom.get("question_" + question.questionId + "_" + i);
            if(checkBoxEl.checked) {
                found = true;
                responses[responses.length] = {
                    questionId: question.questionId,
                    value: questionAnswers[i].label
                };
            }
        }
        if(!found) {
            responses[responses.length] = {
                questionId: question.questionId,
                value: "_NONE"
            };
        }
    }
    
    else if(    question.questionType == "TextValue"
              || question.questionType == "NumericValue"
              || question.questionType == "ShortTextValue"
              || question.questionType == "LargeTextValue") 
    {
        var inputEl = YAHOO.util.Dom.get("question_" + question.questionId);
        responses[responses.length] = { 
            questionId: question.questionId,
            value: inputEl.value
        };
    }
    
    else if (    question.questionType == "RatingScale"
               || question.questionType == "MultiSingleRadio") 
    {
        var questionAnswers = YAHOO.Convio.PC2.Utils.ensureArray(question.questionAnswer);
        for(var i=0; i < questionAnswers.length; i++) {
            var radioEl = YAHOO.util.Dom.get("radio_" + question.questionId + "_" + i);
            if(radioEl.checked) {
                responses[responses.length] = {
                    questionId: question.questionId,
                    value: radioEl.value
                }
                break;
            }
        }
    }
    
    else if(question.questionType == "DateQuestion") {
        var inputEl = YAHOO.util.Dom.get("question_cal_" + question.questionId);
        responses[responses.length] = { 
            questionId: question.questionId,
            value: inputEl.value
        };
    }
    
    else if(question.questionType == "ComboChoice") {
        var radio1El = YAHOO.util.Dom.get("radio_" + question.questionId + "_0");
        if(radio1El.checked) {
            // Copied from select handling
            var selectEl = YAHOO.util.Dom.get("question_" + question.questionId);
            var optionEl = selectEl.options[selectEl.selectedIndex];
            responses[responses.length] = { 
                questionId: question.questionId,
                value: optionEl.value
            };
        } else {
            var textEl = YAHOO.util.Dom.get("text_" + question.questionId);
            responses[responses.length] = {
                questionId: question.questionId,
                value: textEl.value
            };
        }
    }
};

var surveyRespCallback = {
    
    /* WOW! IE6 and IE7 do not support dynamically setting
     * the NAME attribute of radio input elements.
     * 
     * Because of this, the following DOM manipulation
     * checks to see if we are using the poorly written
     * Microsoft Internet Explorer. We try to work around
     * its failings.
     * 
     * http://msdn.microsoft.com/en-us/library/ms535838(VS.85).aspx
     */
    count: 0,
    success: function(o) {
        
        // Simple text
        var buildTextQuestion = function(response) {
            var parentEl = YAHOO.util.Dom.get("survey-questions");
            
            var qDiv = document.createElement("div");
            addContainerClass(qDiv);

            var labelDiv = document.createElement("div");
            var inputDiv = document.createElement("div");

                addQuestionNumber(labelDiv);

                var labelEl = document.createElement("label");
                labelEl.id = "label_" + response.questionId;
                labelEl.setAttribute("for","question_" + response.questionId);
                if(response.questionRequired == 'true'){
                	markQuestionRequired(labelEl);
                }
                labelEl.appendChild(document.createTextNode(response.questionText));
                //labelEl.appendChild(document.createTextNode(" " + response.questionType));
                labelDiv.appendChild(labelEl);
                
                var inputEl = document.createElement("input");
                inputEl.type = "text";
                inputEl.id = "question_" + response.questionId;
                
                var respVal = YAHOO.lang.isString(response.responseValue) ? response.responseValue : "";
                    inputEl.value = respVal;
                    
                    inputDiv.appendChild(inputEl);
                    
                qDiv.appendChild(labelDiv);
                qDiv.appendChild(inputDiv);
                
                parentEl.appendChild(qDiv);
            };

            var buildLargeTextQuestion = function (response) {
                var parentEl = YAHOO.util.Dom.get("survey-questions");

                var qDiv = document.createElement("div");
                addContainerClass(qDiv);

                var labelDiv = document.createElement("div");
                var inputDiv = document.createElement("div");

                addQuestionNumber(labelDiv);

                var labelEl = document.createElement("label");
                labelEl.id = "label_" + response.questionId;
                labelEl.setAttribute("for","question_" + response.questionId);
                if(response.questionRequired == 'true'){
                    markQuestionRequired(labelEl);
                }
                labelEl.appendChild(document.createTextNode(response.questionText));
                //labelEl.appendChild(document.createTextNode(" " + response.questionType));
                labelDiv.appendChild(labelEl);

                var textEl = document.createElement("textarea");
                textEl.id = "question_" + response.questionId;
                textEl.cols = 50;
                textEl.rows = 10;

                var respVal = YAHOO.lang.isString(response.responseValue) ? response.responseValue : "";
                textEl.value = respVal;
                inputDiv.appendChild(textEl);

                qDiv.appendChild(labelDiv);
                qDiv.appendChild(inputDiv);

                parentEl.appendChild(qDiv);
            };

            var buildMediumTextQuestion = function (response) {
                var parentEl = YAHOO.util.Dom.get("survey-questions");

                var qDiv = document.createElement("div");
                addContainerClass(qDiv);

                var labelDiv = document.createElement("div");
                var inputDiv = document.createElement("div");

                addQuestionNumber(labelDiv);

                var labelEl = document.createElement("label");
                labelEl.id = "label_" + response.questionId;
                labelEl.setAttribute("for","question_" + response.questionId);
                if(response.questionRequired == 'true'){
                    markQuestionRequired(labelEl);
                }
                labelEl.appendChild(document.createTextNode(response.questionText));
                //labelEl.appendChild(document.createTextNode(" " + response.questionType));
                labelDiv.appendChild(labelEl);

                var textEl = document.createElement("textarea");
                textEl.id = "question_" + response.questionId;
                textEl.cols = 50;
                textEl.rows = 4;

                var respVal = YAHOO.lang.isString(response.responseValue) ? response.responseValue : "";
                textEl.value = respVal;
                inputDiv.appendChild(textEl);

                qDiv.appendChild(labelDiv);
                qDiv.appendChild(inputDiv);

                parentEl.appendChild(qDiv);
            };
            
            var buildSelect = function(qDiv, response) {
 
                    // Create the select element
                var inputEl = document.createElement("select");
                inputEl.id = "question_" + response.questionId;
                
                    var questionAnswers = YAHOO.Convio.PC2.Utils.ensureArray(response.questionAnswer);
                    // create the option elements
                    var optionEl = document.createElement("option");
                    optionEl.id = "question_" + response.questionId + "_none";
                    optionEl.value = "";
                    
                    optionEl.appendChild(document.createTextNode("Please select a response"));
                    inputEl.appendChild(optionEl);
                        
                    for(var i=0; i < questionAnswers.length; i++) {
                        var optionEl = document.createElement("option");
                        optionEl.id = "question_" + response.questionId + "_" + i;
                        optionEl.value = questionAnswers[i].value;
                        
                        optionEl.appendChild(document.createTextNode(questionAnswers[i].label));
                        inputEl.appendChild(optionEl);
                    }
                
            qDiv.appendChild(inputEl);
        }
        
        // multiple choice, single response as select list
        var buildMultiSelect = function(response) {
            var parentEl = YAHOO.util.Dom.get("survey-questions");
            
            var qDiv = document.createElement("div");
            addContainerClass(qDiv);

            var labelDiv = document.createElement("div");

            addQuestionNumber(labelDiv);

            var labelEl = document.createElement("label");
            labelEl.id = "label_" + response.questionId;
            labelEl.setAttribute("for","question_" + response.questionId);
            if(response.questionRequired == 'true'){
            	markQuestionRequired(labelEl);
            }
            labelEl.appendChild(document.createTextNode(response.questionText));
            labelDiv.appendChild(labelEl);
            qDiv.appendChild(labelDiv);
            
            var inputDiv = document.createElement("div");
            buildSelect(inputDiv, response);
            
            qDiv.appendChild(inputDiv);
            
            parentEl.appendChild(qDiv);
            
            // The response
            var respVal = YAHOO.lang.isString(response.responseValue) ? response.responseValue : "";
            
            var inputEl = YAHOO.util.Dom.get("question_" + response.questionId);
            for(var i=0; i < inputEl.options.length; i++) {
                if(inputEl.options[i].value == respVal) {
                    inputEl.options[i].selected = true;
                    break;
                }
            }
        };
        
        // multiple choice, radio response
        var buildRadio = function(response) {
            var parentEl = YAHOO.util.Dom.get("survey-questions");
            
            var qDiv = document.createElement("div");
            addContainerClass(qDiv);

            var labelDiv = document.createElement("div");
            addQuestionNumber(labelDiv);
            var labelEl = document.createElement("label");
            labelEl.id = "label_" + response.questionId;
            labelEl.setAttribute("for","question_" + response.questionId);
            if(response.questionRequired == 'true'){
            	markQuestionRequired(labelEl);
            }
            labelEl.appendChild(document.createTextNode(response.questionText));
            labelDiv.appendChild(labelEl);
            qDiv.appendChild(labelDiv);
            
            var inputDiv = document.createElement("div");
            var questionAnswers = YAHOO.Convio.PC2.Utils.ensureArray(response.questionAnswer);
            for(var i=0; i < questionAnswers.length; i++) {
                var rowDiv = document.createElement("div");
                var inputEl = null;
                
                if(YAHOO.env.ua.ie > 0 && YAHOO.env.ua.ie < 8) {
                    inputEl = document.createElement('<input type="radio" name="radio_' + response.questionId + '" />');
                } else {
                    inputEl = document.createElement("input");
                    inputEl.type = "radio";
                    inputEl.name = "radio_" + response.questionId;
                }
                
                inputEl.type = "radio";
                inputEl.name = "radio_" + response.questionId;
                inputEl.id = "radio_" + response.questionId + "_" + i;
                inputEl.value = questionAnswers[i].value;
                
                rowDiv.appendChild(inputEl);
                
                var labelEl = document.createElement("label");
                labelEl.setAttribute("for","radio_" + response.questionId + "_" + i);
                labelEl.appendChild(document.createTextNode(questionAnswers[i].label));
                rowDiv.appendChild(document.createTextNode(" "));
                rowDiv.appendChild(labelEl);
                                    
                inputDiv.appendChild(rowDiv);
            }
            qDiv.appendChild(inputDiv);
            
            parentEl.appendChild(qDiv);
            
            
            // The response
            var respVal = YAHOO.lang.isString(response.responseValue) ? response.responseValue : "";
            var questionAnswers = YAHOO.Convio.PC2.Utils.ensureArray(response.questionAnswer);
            for(var i=0; i < questionAnswers.length; i++) {
                var inputEl = YAHOO.util.Dom.get("radio_" + response.questionId + "_" + i);
                if(inputEl.value == respVal) {
                    inputEl.checked = true;
                }
            }
            
            
        };
        
        var buildComboChoice = function(response) {
            var parentEl = YAHOO.util.Dom.get("survey-questions");
            
            var qDiv = document.createElement("div");
            addContainerClass(qDiv);

            var labelDiv = document.createElement("div");
            addQuestionNumber(labelDiv);
            var labelEl = document.createElement("label");
            labelEl.id = "label_" + response.questionId;
            labelEl.setAttribute("for","question_" + response.questionId);
            if(response.questionRequired == 'true'){
            	markQuestionRequired(labelEl);
            }
            labelEl.appendChild(document.createTextNode(response.questionText));
            labelDiv.appendChild(labelEl);
            qDiv.appendChild(labelDiv);
            
            var divSel = document.createElement("div");
            var divTxt = document.createElement("div");
            qDiv.appendChild(divSel);
            qDiv.appendChild(divTxt);
            
                var radio1 = null;
                if(YAHOO.env.ua.ie > 0 && YAHOO.env.ua.ie < 8) {
                    radio1 = document.createElement('<input type="radio" name="radio_'  + response.questionId + '" />');
                } else {
                    radio1 = document.createElement("input");
                    radio1.type = "radio";
                    radio1.name = "radio_" + response.questionId;
                }
                
                radio1.id = "radio_" + response.questionId + "_0";
                radio1.value = "preselected"
                
                divSel.appendChild(radio1);
                divSel.appendChild(document.createTextNode(" "));

                buildSelect(divSel, response);
                
                var radio2 = null;
                if(YAHOO.env.ua.ie > 0 && YAHOO.env.ua.ie < 8) {
                    radio2 = document.createElement('<input type="radio" name="radio_'  + response.questionId + '" />');
                } else {
                    radio2 = document.createElement("input");
                    radio2.type = "radio";
                    radio2.name = "radio_" + response.questionId;
                }
                radio2.id = "radio_" + response.questionId + "_1";
                radio2.value = "freetext"
                
                var freeText = document.createElement("input");
                freeText.type = "text";
                freeText.id = "text_" + response.questionId;
                freeText.value = "";
                
                divTxt.appendChild(radio2);
                divTxt.appendChild(document.createTextNode(" "));
                divTxt.appendChild(freeText);
                
                var disableSelect = function() {
                    var selectEl = YAHOO.util.Dom.get("question_" + response.questionId);
                    selectEl.disabled = true;
                    var textEl = YAHOO.util.Dom.get("text_" + response.questionId);
                    textEl.disabled = false;
                };
                
                var disableText = function() {
                    var selectEl = YAHOO.util.Dom.get("question_" + response.questionId);
                    selectEl.disabled = false;
                    var textEl = YAHOO.util.Dom.get("text_" + response.questionId);
                    textEl.disabled = true;
                };
                
                YAHOO.util.Event.addListener(radio1, "click", disableText);
                YAHOO.util.Event.addListener(radio2, "click", disableSelect);
                
            
            
            parentEl.appendChild(qDiv);
            
            // The response
            var respVal = YAHOO.lang.isString(response.responseValue) ? response.responseValue : "";
            var found = false;
            var inputEl = YAHOO.util.Dom.get("question_" + response.questionId);
            for(var i=0; i < inputEl.options.length; i++) {
                if(inputEl.options[i].value == respVal) {
                    inputEl.options[i].selected = true;
                    found = true;
                    break;
                }
            }
            if(found) {
                radio1.checked = true;
                disableText();
            } else {
                radio2.checked = true;
                disableSelect();
                freeText.value = respVal;
            }
        };
        
        // Multiple choice, multiple response
        var buildMultiMulti = function(response) {

        var addHint = function(qDiv, response){
            var min = response.questionMinResponses;
            var max = response.questionMaxResponses;
            // if the question is required but questionMinResponses is 0, set min=1
            if(response.questionRequired == 'true' && min <= 0){
                min = 1;
            }
	    
            if (min > 0 || max > 0 ) {
                var hintDiv = document.createElement("div");
                hintDiv.id = "hint_" + response.questionId;
                YAHOO.util.Dom.addClass(hintDiv,"Hint");
			            
                var hintIntroElem = document.createElement("span");     // stores the beginning of the hint
                var hintMinMaxElem;         // stores the min/max selections numbers
                var hintSelectionElem = document.createElement("span"); // "selection" or "selections"
                var hintClose = document.createElement("span");         // stores the closing of the hint
                YAHOO.util.Dom.addClass(hintClose, "survey_hint_close");
			
                // set the plural or singular form of "selection" based on the min/max values
                if ( min > 1 || (min >= 0 && max > min && max > 1) ) {
                    YAHOO.util.Dom.addClass(hintSelectionElem, "survey_hint_selections");
                } else {
                    YAHOO.util.Dom.addClass(hintSelectionElem, "survey_hint_selection");
                }
			            
                // set the message intro based on min/max values
                if (min == max){
                    YAHOO.util.Dom.addClass(hintIntroElem, "survey_hint_start_select_set_number");
                    hintMinMaxElem = document.createTextNode(min);
                } else if (min == 0 && max > 0){
                    YAHOO.util.Dom.addClass(hintIntroElem, "survey_hint_start_select_max_number");
                    hintMinMaxElem = document.createTextNode(max);
                } else if (max == 0 && min > 0){
                    YAHOO.util.Dom.addClass(hintIntroElem, "survey_hint_start_select_min_number");
                    hintMinMaxElem = document.createTextNode(min);
                } else {
                    YAHOO.util.Dom.addClass(hintIntroElem, "survey_hint_start_select_between");
                    hintMinMaxElem = document.createTextNode(min + "-" + max);
                }
			
                hintDiv.appendChild(hintIntroElem);
                hintDiv.appendChild(hintMinMaxElem);
                hintDiv.appendChild(hintSelectionElem);
                hintDiv.appendChild(hintClose);
			            
                qDiv.appendChild(hintDiv);
            }
        }

            var parentEl = YAHOO.util.Dom.get("survey-questions");

            var qDiv = YAHOO.util.Dom.get("question_" + response.questionId);
            if(!qDiv) {
                qDiv = document.createElement("div");
                addContainerClass(qDiv);
                qDiv.id = "question_" + response.questionId;
                
                    var labelDiv = document.createElement("div");
                    addQuestionNumber(labelDiv);
                    var labelEl = document.createElement("label");
                    labelEl.id = "label_" + response.questionId;
                    if(response.questionRequired == 'true'){
            			markQuestionRequired(labelEl);
            		}
                    labelEl.appendChild(document.createTextNode(response.questionText));
                    labelDiv.appendChild(labelEl);
                    qDiv.appendChild(labelDiv);

                    addHint(qDiv,response);
                
                    var createCheckbox = function(rowDiv, response, questionValue, questionNum) {
                        var inputEl = document.createElement("input");
                        inputEl.id = "question_" + response.questionId + "_" + questionNum;
                        inputEl.type = "checkbox";
                        inputEl.value = questionValue.value;
                        
                        var labelEl = document.createElement("label");
                        labelEl.setAttribute("for","question_" + response.questionId + "_" + questionNum);
                        labelEl.appendChild(document.createTextNode(questionValue.label));
                        
                        rowDiv.appendChild(inputEl);
                        rowDiv.appendChild(document.createTextNode(" "));
                        rowDiv.appendChild(labelEl);
                    };
                
                
                    var questionValues = YAHOO.Convio.PC2.Utils.ensureArray(response.questionAnswer);

                    for(var k=0; k < questionValues.length; k++) {
                        var rowDiv = document.createElement("div");
                        createCheckbox(rowDiv, response, questionValues[k], k);
                        qDiv.appendChild(rowDiv);
                    }
                // The response
                parentEl.appendChild(qDiv);
            } 
            
            var respVal = YAHOO.lang.isString(response.responseValue) ? response.responseValue : "";
            var questionValues = YAHOO.Convio.PC2.Utils.ensureArray(response.questionAnswer);
            for(var j=0; j < questionValues.length; j++) {
                var checkboxEl = YAHOO.util.Dom.get("question_" + response.questionId + "_" + j);
                if(respVal == questionValues[j].value || respVal == questionValues[j].label) {
                    checkboxEl.checked = true;
                    break;
                }
            }
        };
        
        var buildQuestion = function(response) {
            if(    response.questionType == "HiddenTextValue" 
                || response.questionType == "HiddenInterests"
                || response.questionType == "HiddenTrueFalse"
                || response.questionType == "Caption"
                || response.questionType == "Captcha") 
            {
                return;
            }

            if(response.responseValue == "User Provided No Response") {
                response.responseValue = "";
            }
            
            var surveyQestionParentEl = YAHOO.util.Dom.get("survey-questions");
            
            if(response.questionType == "MultiSingle") {
                return buildMultiSelect(response);
            } else if(response.questionType == "MultiMulti" || response.questionType == "Categories") {
                return buildMultiMulti(response);
            } else if(response.questionType == "DateQuestion") {
                return buildDateSurveyQuestion(response, surveyQestionParentEl);
            } else if(response.questionType == "ComboChoice") {
                return buildComboChoice(response);
            } else if(response.questionType == "NumericValue") {
                return buildTextQuestion(response);
            } else if(response.questionType == "RatingScale" || response.questionType == "MultiSingleRadio") {
                return buildRadio(response);
            } else if(response.questionType == "YesNo" || response.questionType == "TrueFalse") {
                return buildMultiSelect(response);
            } else if(response.questionType == "LargeTextValue") {
                return buildLargeTextQuestion(response);
            } else if(response.questionType == "TextValue") {
                return buildMediumTextQuestion(response);
            } else {
                return buildTextQuestion(response);
            }
        };
        
        var responses = YAHOO.Convio.PC2.Utils.ensureArray(YAHOO.lang.JSON.parse(o.responseText).getSurveyResponsesResponse.responses);
        
        // Save in a global variable
        YAHOO.Convio.PC2.Data.SurveyResponses = responses;
        
        for(var i=0; i < responses.length; i++) {
            buildQuestion(responses[i]);
        }
        
        addHintsAndIndicators();
    },
    failure: function(o) {
        YAHOO.log("Failure retrieving survey responsese.","error","survey.js");
    },
    scope: this
};

var updateSurveyCallback = {
    success: function(o) {
        show_pc2_element("survey-save-success");
    },
    failure: function(o) {
        YAHOO.log("Error saving responses: " + o.responseText, "error", "survey.js");
        var err = YAHOO.lang.JSON.parse(o.responseText).errorResponse;
        if(err.code == "2610") {
        	var label = YAHOO.util.Dom.get("label_" + err.message);
        	if(label) {
        		YAHOO.util.Dom.addClass(label.parentNode, "failure-message");
        	}
            YAHOO.util.Dom.addClass("hint_" + err.message, "failure-message");
        }
        
        show_pc2_element("survey-save-failure");
    },
    scope: this
};

var clearSurveyMessages = function() {
	hide_pc2_element("survey-save-success");
	hide_pc2_element("survey-save-failure");
	hide_pc2_element("survey-date-save-failure");
};

var addContainerClass = function(elem) {
    YAHOO.util.Dom.addClass(elem, "question-container");
}

var addQuestionNumber = function(elem) {
    var questionNumber = document.createElement("span");
    YAHOO.util.Dom.addClass(questionNumber, "question-number");
    questionNumber.innerHTML = ++surveyRespCallback.count + ". ";
    elem.appendChild(questionNumber);
}

var markQuestionRequired = function(elem) {
	var reqElem = document.createElement("span");
YAHOO.util.Dom.addClass(reqElem, "required");
	elem.appendChild(reqElem);
}

var addHintsAndIndicators = function(){
	var keys = [
	    'required', 'survey_hint_start_select_set_number',
	    'survey_hint_start_select_min_number', 'survey_hint_start_select_max_number',
	    'survey_hint_start_select_between', 'survey_hint_selection',
	    'survey_hint_selections', 'survey_hint_close'
	];

	YAHOO.Convio.PC2.Component.Content.loadMsgCatalogBySpanAndClass(keys,'trpc');
}

var buildDateSurveyQuestion = function(response, parentEl) {
    var respVal = YAHOO.lang.isString(response.responseValue) ? response.responseValue : "";
    var qDiv = document.createElement("div");
    addContainerClass(qDiv);
    //YAHOO.util.Dom.addClass(qDiv, "yui-skin-sam");
        
        var labelDiv = document.createElement("div");
        addQuestionNumber(labelDiv);
        var labelEl = document.createElement("label");
        labelEl.id = "label_" + response.questionId;
        labelEl.setAttribute("for","question_" + response.questionId);
        if(response.questionRequired == 'true'){
    		markQuestionRequired(labelEl);
    	}
        labelEl.appendChild(document.createTextNode(response.questionText));
        labelDiv.appendChild(labelEl);
        
        var inputDiv = document.createElement("div");
        var inputEl = document.createElement("input");
        inputEl.id = "question_cal_" + response.questionId;
        inputEl.type = "text";
        inputEl.value = respVal;
        inputDiv.appendChild(inputEl);
        
        var panelEl = document.createElement("div");
        panelEl.id = "question_panel_" + response.questionId;
        YAHOO.util.Dom.addClass(panelEl, "yui-skin-sam");

        
    qDiv.appendChild(labelDiv);
    qDiv.appendChild(inputDiv);
    qDiv.appendChild(panelEl);
    
    parentEl.appendChild(qDiv);
    
    var navConfig = {
    	/* See http://developer.yahoo.com/yui/docs/YAHOO.widget.Calendar.html */
        monthFormat: YAHOO.widget.Calendar.LONG,
        initialFocus: "year"
    };
    var panel = new YAHOO.widget.Panel(panelEl, { 
        visible:false, 
        draggable:false, 
        close:false}
    );
    
    //panel.setHeader("Test");
    panel.setBody("<div id='question_panel_" + response.questionId + "'></div>");
    //panel.setFooter("");
    panel.render();
    
    panel.showEvent.subscribe(function() {
        if (YAHOO.env.ua.ie) {
            // Since we're hiding the table using yui-overlay-hidden, we 
            // want to let the dialog know that the content size has changed, when
            // shown
            panel.fireEvent("changeContent");
        }
    });

    
    var cal = new YAHOO.widget.Calendar("question_panel_" + response.questionId, { navigator:navConfig, close:false});
    //cal.render();
    cal.selectEvent.subscribe(function(type,args,obj) {
        if (cal.getSelectedDates().length > 0) {
            var dates = args[0];
            var date = dates[0];
            var year = date[0], month = date[1], day = date[2];
        
            // Pretty Date Output, using Calendar's Locale values: Friday, 8 February 2008
            //var wStr = cal.cfg.getProperty("DATE")[selDate.getDate()];
            /*var dStr = selDate.getDate();
            var mStr = cal.cfg.getProperty("MONTHS_LONG")[selDate.getMonth()];
            var yStr = selDate.getFullYear();
            */
            YAHOO.util.Dom.get("question_cal_" + response.questionId).value =  month + "/" + day + "/" + year;
        } else {
            YAHOO.util.Dom.get("question_cal_" + response.questionId).value = "";
        }
        panel.hide();
    });

    cal.renderEvent.subscribe(function() {
        // Tell Dialog it's contents have changed, which allows 
        // container to redraw the underlay (for IE6/Safari2)
        panel.fireEvent("changeContent");
    });
    
    cal.changePageEvent.subscribe(function() {
            /*alert('page change');*/
        //panel.fireEvent("changeContent");
        panel.render();
    });
    var selectResponse = false;
    var dateToValidate = respVal.split("/");
    if(dateToValidate.length == 3) {
        selectResponse = (!isNaN(dateToValidate[0]) 
            && !isNaN(dateToValidate[1])
            && !isNaN(dateToValidate[2]));
    }
    if(selectResponse) {
        cal.select(response.responseValue);
    }
	var selectedDates = cal.getSelectedDates();
	if (selectedDates.length > 0) {
		var firstDate = selectedDates[0];
		cal.cfg.setProperty("pagedate", (firstDate.getMonth()+1) + "/" + firstDate.getFullYear());
    }
    cal.render();
    
    panel.render();
    cal.hide();

    // show the calendar component if user clicks on text input
    YAHOO.util.Event.addListener(inputEl, "click", function()
	{
    	// show ui component
		cal.show();
		panel.show();

		// keep track of last cal component shown
		YAHOO.namespace("YAHOO.Convio.PC2.Component.Survey");
		YAHOO.Convio.PC2.Component.Survey.lastDatePickerPanelShown = panel;
	});
    
    // Hide Calendar if we click anywhere in the document other than the
	// calendar or the text input
    YAHOO.util.Event.on(document, "click", function(e)
	{
    	/* this technique described at http://developer.yahoo.com/yui/examples/calendar/calcontainer.html */
		var el = YAHOO.util.Event.getTarget(e);
		var panelEl = panel.element;

		if (el != panelEl && !YAHOO.util.Dom.isAncestor(panelEl, el) && el != inputEl && !YAHOO.util.Dom.isAncestor(inputEl, el)) {
			panel.hide();
		}
	}); 
    
    // return a reference to the HTML input element that was created
    return inputEl;

};