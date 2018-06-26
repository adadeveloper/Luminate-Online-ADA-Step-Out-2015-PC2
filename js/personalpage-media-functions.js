var LoggingHandler = {
    success: function() {
        YAHOO.log("Successful rest call", "debug", "personal_media.js");
    },
    failure: function() {
        YAHOO.log("Failed rest call", "debug", "personal_media.js");
    }
};

var updatePersonalPhotoError = function(err) {
	hide_pc2_element("msg_cat_photo_upload_success");
    YAHOO.util.Dom.get("photo_upload_error_message").innerHTML = err;
    if("" == err) {
        hide_pc2_element("photo_upload_error_message");
    } else {
        show_pc2_element("photo_upload_error_message");
    }
}
var updatePersonalPhoto2Error = function(err) {
	YAHOO.util.Dom.get("photo2_upload_error_message").innerHTML = err;
    hide_pc2_element("msg_cat_photo_upload2_success");
    if("" == err) {
        hide_pc2_element("photo2_upload_error_message");
    } else {
        show_pc2_element("photo2_upload_error_message");
    }
}

var UploadPersonalPhotoCallback = {
    upload: function(o) {
      try {
        var beginIndex = o.responseText.indexOf("{");
        var endIndex = o.responseText.indexOf("</pre>");
        if(endIndex == -1) {
            endIndex = o.responseText.indexOf("</PRE>");
            if(endIndex == -1) {
                endIndex = o.responseText.length;
            }
        }
        if(beginIndex == -1) {
            beginIndex = 0;
        }
        var responseText = o.responseText.substring(beginIndex, endIndex);
        var response = YAHOO.lang.JSON.parse(responseText).uploadPersonalPhotoResponse;
        if(YAHOO.lang.isUndefined(response.photoItem) || YAHOO.lang.isNull(response.photoItem)) {
        	updatePersonalPhotoError(response.message);
        } else {
            var config = YAHOO.Convio.PC2.Data.TeamraiserConfig;
            if(config.personalPageApprovalRequired == "true") {
                YAHOO.util.Dom.removeClass("msg_cat_photo_upload_success_approval", "hidden-form");
            } else {
                YAHOO.util.Dom.removeClass("msg_cat_photo_upload_success", "hidden-form");
            }
            var uploadFile = YAHOO.util.Dom.get("photo-upload-block");
            if(YAHOO.lang.isUndefined(uploadFile) == false && uploadFile != null) {
                uploadFile.innerHTML = uploadFile.innerHTML;
            }
            YAHOO.Convio.PC2.Teamraiser.getPersonalPhotos(GetPersonalPhotosCallback);
        }
      } catch(e) {
          YAHOO.util.Dom.removeClass("msg_cat_photo_upload_generic_error", "hidden-form");
      }
    }
};

var UploadPersonalPhotoCallback2 = {
    upload: function(o) {
          try {
            
              
            var beginIndex = o.responseText.indexOf("{");
            var endIndex = o.responseText.indexOf("</pre>");
            if(endIndex == -1) {
                endIndex = o.responseText.indexOf("</PRE>");
                if(endIndex == -1) {
                    endIndex = o.responseText.length;
                }
            }
            if(beginIndex == -1) {
                beginIndex = 0;
            }
            var responseText = o.responseText.substring(beginIndex, endIndex);
            var response = YAHOO.lang.JSON.parse(responseText).uploadPersonalPhotoResponse;
            if(YAHOO.lang.isUndefined(response.photoItem) || YAHOO.lang.isNull(response.photoItem)) {
            	updatePersonalPhoto2Error(response.message);
            } else {
                var config = YAHOO.Convio.PC2.Data.TeamraiserConfig;
                if(config.personalPageApprovalRequired == "true") {
                    YAHOO.util.Dom.removeClass("msg_cat_photo_upload2_success_approval", "hidden-form");
                } else {
                    YAHOO.util.Dom.removeClass("msg_cat_photo_upload2_success", "hidden-form");
                }
                var uploadFile = YAHOO.util.Dom.get("photo-upload2-block");
                if(YAHOO.lang.isUndefined(uploadFile) == false && uploadFile != null) {
                    uploadFile.innerHTML = uploadFile.innerHTML;
                }
                YAHOO.Convio.PC2.Teamraiser.getPersonalPhotos(GetPersonalPhotosCallback);
            }
          }catch(e) {
              YAHOO.util.Dom.removeClass("msg_cat_photo_upload2_generic_error", "hidden-form");
          }
    }
};

var GetPersonalVideoUrlCallback = {
    success: function(o) {
        
        var response = YAHOO.lang.JSON.parse(o.responseText).getPersonalVideoUrlResponse;
        var videoUrl = response.videoUrl; 
        
        if(videoUrl != null && YAHOO.lang.isUndefined(videoUrl) == false) {
            YAHOO.util.Dom.get("personal_video_url").value = videoUrl;
        }
    
    },
    failure: function(o) {
        logFailure(o);
    },
    scope: YAHOO.Convio.PC2.Teamraiser
};

var GetPersonalMediaLayoutCallback = {
    success: function(o) {
        
        var response = YAHOO.lang.JSON.parse(o.responseText).getPersonalMediaLayoutResponse;
        var personalMediaLayout = response.personalMediaLayout;
        
        if(personalMediaLayout != null && YAHOO.lang.isUndefined(personalMediaLayout) == false) {
            
            if(personalMediaLayout == "video") {
                YAHOO.util.Dom.get("use_media_type_video_radio").checked = true;
                YAHOO.util.Dom.addClass("photos-block", "hidden-form");
                YAHOO.util.Dom.removeClass("videos-block", "hidden-form");
            }
            else {
                YAHOO.util.Dom.get("use_media_type_photos_radio").checked = true;
                YAHOO.util.Dom.removeClass("photos-block", "hidden-form");
                YAHOO.util.Dom.addClass("videos-block", "hidden-form");
            }
        }
        // default to photos
        else { 
            YAHOO.util.Dom.get("use_media_type_photos_radio").checked = true;                                                    
        }
    
    },
    failure: function(o) {
        logFailure(o);
    },
    scope: YAHOO.Convio.PC2.Teamraiser
};

var GetPersonalPhotosCallback = {
    success: function(o) {
        var response = YAHOO.lang.JSON.parse(o.responseText).getPersonalPhotosResponse;
        var photoItems = response.photoItem;
        for(var i=0; i< response.photoItem.length; i++) {
            var photoItem = response.photoItem[i];
            var img = null;
            var noPhotoName = null;
            var removeSection = null;
            var captionName = null;
            if(photoItem.id == "1") {
                img = "photo-thumbnail-example";
                noPhotoName = "msg_cat_photo_upload_no_image";
                removeSection = "photo-remove-section";
                captionName = "graphic_caption";
                var uploadFile = YAHOO.util.Dom.get("graphic_upload_file");
                if(YAHOO.lang.isUndefined(uploadFile) == false && uploadFile != null) {
                    uploadFile.value = "";
                }
            } else if(photoItem.id == "2") {
                img = "photo2-thumbnail-example";
                noPhotoName = "msg_cat_photo_upload2_no_image";
                removeSection = "photo2-remove-section";
                captionName = "graphic_caption2";
                var uploadFile = YAHOO.util.Dom.get("graphic_upload2_file");
                if(YAHOO.lang.isUndefined(uploadFile) == false && uploadFile != null) {
                    uploadFile.value = "";
                }
            }
            UpdatePhoto(img, noPhotoName, photoItem, removeSection, captionName);
        }
    },
    failure: function(o) {
        logFailure(o);
    },
    scope: YAHOO.Convio.PC2.Teamraiser
};

var UpdatePhoto = function(imgName, noName, photoItem, removeSection, captionName) {
    
    var img = YAHOO.util.Dom.get(imgName);
    var isPhotoItemUrlDefined = 
        (photoItem != null) && 
        (!YAHOO.lang.isUndefined(photoItem.thumbnailUrl) || !YAHOO.lang.isUndefined(photoItem.originalUrl));
    
    if(img != null && isPhotoItemUrlDefined) {
        // prefer the thumbnail URL if available
        img.src = !YAHOO.lang.isUndefined(photoItem.thumbnailUrl) ? photoItem.thumbnailUrl : photoItem.originalUrl;
        YAHOO.util.Dom.removeClass(imgName, "hidden-form");
        YAHOO.util.Dom.removeClass(removeSection, "hidden-form");
        YAHOO.util.Dom.addClass(noName, "hidden-form");
        if(YAHOO.lang.isString(photoItem.caption)) {
            YAHOO.util.Dom.get(captionName).value = photoItem.caption;
        }
    } else {
        YAHOO.util.Dom.addClass(removeSection, "hidden-form");
        YAHOO.util.Dom.addClass(imgName, "hidden-form");
        YAHOO.util.Dom.removeClass(noName, "hidden-form");
        YAHOO.util.Dom.get(captionName).value = "";
    }
};

var RemovePhotoCallback = {
    upload: function(o) {
        var beginIndex = o.responseText.indexOf("{");
        var endIndex = o.responseText.indexOf("</pre>");
        if(endIndex == -1) {
            endIndex = o.responseText.indexOf("</PRE>");
            if(endIndex == -1) {
                endIndex = o.responseText.length;
            }
        }
        if(beginIndex == -1) {
            beginIndex = 0;
        }
        var responseText = o.responseText.substring(beginIndex, endIndex);
        var response = YAHOO.lang.JSON.parse(responseText).removePersonalPhotoResponse;
        var img = null;
        var noPhotoName = null;
        var removeSection;
        var captionName = null;
        var config = YAHOO.Convio.PC2.Data.TeamraiserConfig;
        if(response.photoItem.id == "1") {
            img = "photo-thumbnail-example";
            noPhotoName = "msg_cat_photo_upload_no_image";
            removeSection = "photo-remove-section";
            captionName = "graphic_caption";
            if(config.personalPageApprovalRequired == "true") {
                YAHOO.util.Dom.removeClass("msg_cat_photo_upload_success_approval", "hidden-form");
            } else {
                YAHOO.util.Dom.removeClass("msg_cat_photo_upload_success", "hidden-form");
            }
            var uploadFile = YAHOO.util.Dom.get("photo-upload-block");
            if(YAHOO.lang.isUndefined(uploadFile) == false && uploadFile != null) {
                uploadFile.innerHTML = uploadFile.innerHTML;
            }
        } else if(response.photoItem.id == "2") {
            img = "photo2-thumbnail-example";
            noPhotoName = "msg_cat_photo_upload2_no_image";
            removeSection = "photo2-remove-section";
            captionName = "graphic_caption2";
            if(config.personalPageApprovalRequired == "true") {
                YAHOO.util.Dom.removeClass("msg_cat_photo_upload2_success_approval", "hidden-form");
            } else {
                YAHOO.util.Dom.removeClass("msg_cat_photo_upload2_success", "hidden-form");
            }
            var uploadFile = YAHOO.util.Dom.get("photo-upload2-block");
            if(YAHOO.lang.isUndefined(uploadFile) == false && uploadFile != null) {
                uploadFile.innerHTML = uploadFile.innerHTML;
            }
        }
        UpdatePhoto(img, noPhotoName, null, removeSection, captionName);
    }
};

var UpdatePersonalVideoUrlCallback = {
        
    success: function(o) {
        var response = YAHOO.lang.JSON.parse(o.responseText).updatePersonalVideoUrlResponse;
        var videoUrl = response.videoUrl; 
        
        if(videoUrl != null && YAHOO.lang.isUndefined(videoUrl) == false && YAHOO.lang.isString(videoUrl)) {
            var config = YAHOO.Convio.PC2.Data.TeamraiserConfig;
            if(config.personalPageApprovalRequired == "true") {
                YAHOO.util.Dom.removeClass("msg_cat_personal_video_url_saved_approval", "hidden-form");
            } else {
                YAHOO.util.Dom.removeClass("msg_cat_personal_video_url_saved", "hidden-form");
            }
        }    
        else {
            YAHOO.util.Dom.removeClass("msg_cat_personal_video_url_generic_error", "hidden-form");                        
        }
    
    },
    failure: function(o) {
        YAHOO.util.Dom.removeClass("msg_cat_personal_video_url_generic_error", "hidden-form");
        logFailure(o);
    },
    scope: YAHOO.Convio.PC2.Teamraiser
};

var onUploadButtonClick = function(e){
    var caption = YAHOO.util.Dom.get("graphic_caption").value;
    var captionParam = "&graphic_caption=" + encodeURIComponent(caption);
    clearPhotoMessages();
    YAHOO.Convio.PC2.Teamraiser.uploadPersonalPhoto(UploadPersonalPhotoCallback, "photo-upload-form", captionParam);
};

var onUploadButton2Click = function(e){
    var caption2 = YAHOO.util.Dom.get("graphic_caption2").value;
    var captionParam = "&graphic_caption2=" + encodeURIComponent(caption2);
    clearPhotoMessages();
    YAHOO.Convio.PC2.Teamraiser.uploadPersonalPhoto(UploadPersonalPhotoCallback2, "photo-upload2-form", captionParam);
};

var onRemoveButtonClick = function(e) {
    clearPhotoMessages();
    YAHOO.Convio.PC2.Teamraiser.removePersonalPhoto(RemovePhotoCallback, "graphic-upload-remove-form");
};

var onRemoveButton2Click = function(e) {
    clearPhotoMessages();
    YAHOO.Convio.PC2.Teamraiser.removePersonalPhoto(RemovePhotoCallback, "graphic-upload2-remove-form");
};

var onUpdatePersonalVideoUrlButtonClick = function(e) {
    clearPhotoMessages();
    var videoUrl = YAHOO.util.Dom.get("personal_video_url").value;
    var re = new RegExp("^(?:https?://)?(?:(?:(?:www\\.)?youtube\\.com/(?:watch\\?v=|v/))|youtu\\.be/).+")
    var m = re.exec(videoUrl);
    if(m == null) {
        YAHOO.util.Dom.removeClass("msg_cat_personal_video_url_format_error", "hidden-form");
        return;
    }
    YAHOO.Convio.PC2.Teamraiser.updatePersonalVideoUrl(UpdatePersonalVideoUrlCallback, videoUrl);                
};

var onPreviewPersonalVideoUrlButtonClick = function(e) {
    var videoUrl = YAHOO.util.Dom.get("personal_video_url").value;
    
    if(videoUrl == null || videoUrl == "" || YAHOO.lang.isUndefined(videoUrl)) {
        alert(YAHOO.util.Dom.get("msg_cat_personal_video_url_unset_error").innerHTML);
    }
    else {
        // only supports youtube, opens new window to video
        var re = new RegExp("^(?:https?://)?(?:(?:(?:www\\.)?youtube\\.com/(?:watch\\?v=|v/))|youtu\\.be/)(.+)")
        var youTubeVideoId = re.exec(videoUrl)[1];
        window.open("http://www.youtube.com/watch?v=" + youTubeVideoId);
    }
};

var onUseMediaTypePhotosButtonClick = function(e) {        
    YAHOO.Convio.PC2.Teamraiser.updatePersonalMediaLayout(LoggingHandler, "photos");
    YAHOO.util.Dom.removeClass("photos-block", "hidden-form");
    YAHOO.util.Dom.addClass("videos-block", "hidden-form");
};

var onUseMediaTypeVideoButtonClick = function(e) {
    YAHOO.Convio.PC2.Teamraiser.updatePersonalMediaLayout(LoggingHandler, "video");
    YAHOO.util.Dom.addClass("photos-block", "hidden-form");
    YAHOO.util.Dom.removeClass("videos-block", "hidden-form");
};

var clearPhotoMessages = function() {
    updatePersonalPhotoError("");
    updatePersonalPhoto2Error("");
    hide_pc2_element("msg_cat_photo_upload_content_type_error");
    hide_pc2_element("msg_cat_photo_upload_dimensions_error");
    hide_pc2_element("msg_cat_photo_upload_generic_error");
    hide_pc2_element("msg_cat_photo_upload_success_approval");
    hide_pc2_element("msg_cat_photo_upload_success");
    hide_pc2_element("msg_cat_personal_video_url_saved");
    hide_pc2_element("msg_cat_personal_video_url_saved_approval");
    hide_pc2_element("msg_cat_personal_video_url_generic_error");
    hide_pc2_element("msg_cat_personal_video_url_format_error");
};