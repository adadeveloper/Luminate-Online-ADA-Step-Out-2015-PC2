----------------------------------------
1. Background
----------------------------------------
The TeamRaiser Participant Center 2 (PC2) represents a complete redesign of the original TeamRaiser Participant Center. After extensive user research and usability testing, our new PC2 is designed to make it easier for your participants focus on their fundraising.

Built entirely on the Convio Open platform, PC2 uses the TeamRaiser API to perform required functions through web pages built with plain old HTML and JavaScript. The Participant Center pages are controlled by CSS, which makes it easier for you to customize the look-and-feel of a new Participant Center for your branding and constituent needs. PC2 utilizes the YUI library to handle much of the JavaScript "glue" to tie all this together.

You can configure a different PC2 for each TeamRaiser event, which also makes it easier to design and brand a Participant Center that suits your needs for each event, each program, and so on. 

Participant Center 2 puts the fun back in fundraising!

----------------------------------------
  2. Overview
----------------------------------------
You can create multiple Participant Centers through the Convio Admin Interface.  Each Participant Center is comprised of HTML, JavaScript, and CSS files that are stored in the FTP folder on your site, using the folder name you specify when you create your Participant Center.

Convio provides a sample Participant Center 2 available in the Admin Interface that uses the folder "pc2" in your FTP folder.

You have complete control over the content and files in your Participant Center folders on your Convio FTP server.  You can edit any of the files for any Participant Center (including the "pc2" folder provided by Convio), but how you modify your files will affect how you upgrade your participant centers, so be sure to read Upgrading Participant Centers before you begin your customizations!

----------------------------------------
  3. Customizing PC2
----------------------------------------
There are 2 ways to customize Participant Center 2:

-- Customization Option 1: By modifying the the custom.css and custom_ie.css files in the CSS folder to make changes to the styles used on the Participant Center Pages, and modifying custom.js in the JS folder to override, enhance, or add new JavaScript functionality to the Participant Center.  These 3 files can be edited through the Convio Admin Interface.

-- Customization Option 2: By modifying any/all of the files within the Participant Center's folder by accessing them via FTP.

----------------------------------------------------------------------------------------------------
  Customization Option 1: Modifying the Custom Files in the /css and /js Directories
----------------------------------------------------------------------------------------------------
If you are making small tweaks to styles, overriding the default settings, or adding new styles, you can make the changes in the css/custom.css file. If these style overrides, changes, or additions will have effects that need to be fixed for site visitors who use the Microsoft Internet Explorer web browser, be sure to make the appropriate changes in the css/custom_ie.css file.
 
Note that when the page is rendered, custom_ie.css is included after custom.css so it is important to put the Internet Explorer styles and overrides in that file.

To customize or add new functionality to your Participant Center, each PC2 page includes the custom.js file as the last included JavaScript file. Within custom.js, you can over ride functions defined elsewhere in the PC2 JavaScript files. The custom.js file also contains the loadCustom() method, which is called when the dashboard.html page finishes loading and fires an onDOMReady() event.  Each "page" in the participant center is a dynamically loaded view, and if you would like to add something to a particular view, you can do so by implementing a loadOverrides(view, subview) method for the view and subview.

An example of a fast and easy way to customize PC2 using the custom.js file would be to change the loading message to display as a page is loading. To override this default by displaying a line of text on the panel, you can add the following line to the custom.js file: 

YAHOO.Convio.PC2.Utils.LoadingMessage="Loading, please wait.";

Note: Add this to the custom.js file, but not as a part of the loadCustom() method.

-----------------------------------------------------------------------------------------
  Customization Option 2: Modifying Any/All Files in the Participant Directory
-----------------------------------------------------------------------------------------
If you would like to make changes to files other than the custom.css, custom_ie.css, and custom.js, you may do so by accessing those files through your Convio FTP server.  This gives you the greatest control over modifying your Participant Center(s), but it also involves the most overhead in terms of keeping your Participant Centers current with the latest version from Convio.  Be sure to read the Upgrade Concerns section below if you choose this option.


-----------------------------------------------------
  4. Upgrading Participant Centers
-----------------------------------------------------
When Convio makes upgrades to Participant Center 2, you will have control over when (and if) those upgrades are applied to your Participant Centers.  Through the administrative interface for Participant Centers (Fundraising > Teamraiser > Participant Centers), any Participant Center that is not running the most recent version of Participant Center 2 will have an "Upgrade" action available.

When you Upgrade a Participant Center, Convio upgrades only that specific Participant Center - none of your other centers will be affected.  During the Upgrade process, your Participant Center will be temporarily unavailable, but upgrades generally take only a few seconds to complete.

You do not have to upgrade your Participant Centers - previous versions of a Participant Center will continue to work since they use the TeamRaiser APIs which do not change functionality in a way that should affect your Participant Centers.

-----------------------------------------------------
  4a. How the Upgrade Works
-----------------------------------------------------
Convio upgrades your Participant Center by performing 2 steps:

   1. Delete ALL files within the Participant Center folder except custom.css, custom_ie.css, and custom.js.  This means that all other files will be lost, whether they are files that you created or files that originally came from Convio.

   2. Install the latest Participant Center files from Convio into the Participant Center's folder.


-----------------------------------------------------
  4b. Upgrade Concerns
-----------------------------------------------------
Since the first step in the upgrade process is to remove all the files except custom.css, custom_ie.css, and custom.js, if you have customized other files in the folder, or added files to the folder, you may want to choose to NOT upgrade your Participant Center since it will result in you loosing that work.  If you have customized your Participant Center in this manner and would like to upgrade, here's the recommended way to do so:

   1. Create a NEW participant Center through the Admin Interface.  This will have the most recent Participant Center 2 files from Convio in it.
      TIP: Name the New Participant Center with the same name and folder of the Participant Center you want to upgrade, but with "_test" at the end of the name and folder.
      Example: The Participant Center you want to upgrade is named "FunWalk" with a folder name of "FunWalk".  Create a new Participant Center and name it "FunWalk_test" with a folder name of "FunWalk_test".
   
   2. Compare the files from your old Participant Center to the Participant Center you created in step 1.
   
   3. Merge the customizations that you made in the old Participant Center into the New Participant Center.  This process will have varying levels of difficulty depending on how many and how complex your customizations are.  Be sure to check for any changes to dependencies between files.
   
   4. Configure a TeamRaiser to use the new Participant Center from step 1.  This should be an event that you can use for testing, and not a live event that your participants are actively fundraising in - you may want to create a new TeamRaiser Event to use for this purpose.
	TIP: You may want to put this testing event into a Security Category that only your testing users have access to, so that your normal site visitors don't accidentally access the event.  You can also unpublish the event when you're not actively testing it.
   
   5. Thoroughly test your new Participant Center using the Testing TeamRaiser event you created/configured in step 4.
   
   6. Correct any issues that you encounter during testing.  Repeat steps 5 and 6 until you are satisfied that the new Participant Center is ready for your participants to use.
   
   7. Pick a time to Upgrade your old Participant Center.  The participant center will be unavailable for a few moments while you perform the upgrade, so this should be a time when your participants are least likely to be using the Participant Center.  You may consider sending out a Coaching Email to all current participants informing them of the short time that their Participant Center will be unavailable.
   
   8. At the time you decided upon, Upgrade the old Participant Center through the Convio Admin Interface.
      TIP: This step is important because it will update the Convio Admin Interface to indicate that the selected Participant Center is now current and no longer needs to be upgraded.
   
   9. While on your Convio FTP server, copy all of the files from within the new Participant Center (created in step 1) into the old Participant Center's folder on the FTP server.
      Example: continuing with the FunWalk example from step 1: on your Convio FTP Server, copy all of the files from "FunWalk_test" into "FunWalk" and chose the option replace any files in "FunWalk".

   10. In the Convio Admin Interface, configure the TeamRaiser from step 4 to use a different participant center than the testing Participant Center created in step 1.
   
   11. In the Convio Admin Interface, Archive the testing Participant Center that you created in step 1.


-----------------------------------------------------
  5. Importing Custom Participant Centers
-----------------------------------------------------
If you have a customized Participant Center that was created before the Convio Fall Release 2010 (version 6.4.0) which uses a different folder on the FTP server than "pc2", it's possible to import those customized Participant Centers into the Convio Admin Interface.  Here's the steps to follow to do so:

   1. Connect to your Convio FTP server and find the folder for Participant Center you want to import. Leave this window / folder / tab open.

   2. Login to your Convio Admin Site and go to Fundraising > TeamRaiser > Participant Centers.

   3. Click "Create a New Participant Center".

   4. Enter the Admin Name you want this Participant Center to have.

   5. For the Name of the Public Folder on the FTP Server, enter the name of the directory you found in step 1, and do not click on Next or Save yet.  Leave this window / tab open.

   6. In the FTP window / folder / tab, rename the folder from step 1 by adding some text to the end of the name. You must do this in order for step 7 to be successful.
      TIP: rename the folder by adding "_temp" to the end of the current name.

   7. In the window / tab with the Convio Admin Interface, click "Next". This creates a new folder on the FTP server with the name you entered in step 5.

   8. In the FTP window / folder /tab, find the new folder with the name from step 1.  This is a new folder that was created in step 7 that contains the latest Participant Center files from Convio.  Delete this folder.
   
   9. In the FTP window / folder /tab, find the folder that you renamed in step 6 and rename the folder back to the original name from step 1.


---------------------------------------------------------------------
  5a. Importing Custom Participant Center Example
---------------------------------------------------------------------
For this example, assume that you have a customized Participant Center in a folder named "fallWalk", and you want to import this Participant Center into to the Admin Interface:

   1. Connect to your Convio FTP server and find the "fallWalk" folder. Leave this window / folder / tab open.
   
   2. Login to your Convio Admin Site and go to Fundraising > TeamRaiser > Participant Centers.
   
   3. Click "Create a New Participant Center".
   
   4. For the Administrative Name, enter "Fall Walk".
   
   5. For the "Name for Public Folder on FTP Server" enter "fallWalk".  Do not click on Next or Save!  Leave this window / tab open.
   
   6.In the FTP window / folder / tab, rename the "fallWalk" folder to "fallWalk_temp"
   
   7. In the window / tab with the Convio Admin Interface, click "Next".
   
   8. In the FTP window / folder / tab, find the "fallWalk" folder and delete it.
   
   9. In the FTP window / folder / tab, find the "fallWalk_temp" folder and rename it to "fallWalk".


---------------------------------------------------------------------
  5b. Importing and Upgrading a Custom Participant Center
---------------------------------------------------------------------
Once you have followed the import steps above, your customized Participant Center will show up in the Administrative UI, but it will not have the option to be upgraded.  Since this center existed before the Convio Fall Release 2010, it *does* need to be updated.  There are three options for how to proceed from here, but option 1 is the the recommended option.

-- Import and Upgrade Option 1: Merge Customizations

-- Import and Upgrade Option 2: Wait for the next release.

-- Import and Upgrade Option 3: Open a Support Case


-----------------------------------------------------------------
  Import and Upgrade Option 1: Merge Customizations 
-----------------------------------------------------------------
This option involves combining the import and upgrade steps.  First follow the steps to import your custom Participant Center by following the steps outlined in “5. Importing Custom Participant Centers”.  Once that is complete, then follow the steps outlined  in the "4b. Upgrade Concerns" section, skipping Step 8, as the participant center you imported will not have the option to upgrade.

This is the preferred option, as it brings your Participant Center up to date with both your customization and the most recent features and bug fixes from Convio.


-----------------------------------------------------------------
  Import and Upgrade Option 2: Wait for the Next Release
-----------------------------------------------------------------
This option is arguably the easiest: wait for the next release.  When Convio next updates Participant Center 2, the participant center you have imported will again be marked as not current and will have the option to upgrade.

The primary down side to this option is that your participant center will not have any of the new features or bug fixes that Convio has provided in the most recent release.


-----------------------------------------------------------------
  Import and Upgrade Option 3: Open a Support Case
-----------------------------------------------------------------
Convio Support can mark the participant center as upgradeable if you provide the Participant Center Id (found in the Participant Centers list in Fundraising > TeamRaiser > Participant Centers).

This option is not recommended, because it will mark the Participant Center as upgradeable, which makes it susceptible to being over-written if an admin performs the "Upgrade" action for this participant center. 

If you do follow this option, it is strongly recommended that you then follow the steps outlined in “4b. Upgrade Concerns” to upgrade your Participant Center.