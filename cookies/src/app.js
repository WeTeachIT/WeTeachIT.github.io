(function(){

	var auto = true;
	
	// obtain plugin object
	var cc = initCookieConsent();

	// init plugin
	var autorun = function(){
		cc.run({
			cc_autorun : auto, 							// show as soon as possible (without the need to manually call CookieConsent.show() )
			cc_delay : 0,								    // specify initial delay after website has loaded		
			cc_enable_verbose : true,						// if enabled, prints all info/error msgs	
			cc_current_lang : 'en',							
			cc_policy_url : null,                           // specify your own dedicated cookie policy page url
			cc_auto_language : true,						// if enabled, overrides cc_current_lang
			cc_theme_css : "../src/cookieconsent.css",		// path to cookieconsent css
			cc_languages : [
				{
					lang : 'en',
					modal : {
						cc_title : "We use cookies",
						cc_description : "We inform you that this site uses own, technical and third parties cookies to make sure our web page is user-friendly and to guarantee a high functionality of the webpage. <br/>By continuing to browse this website, you declare to accept the use of cookies.",
						cc_more_text : "Find out more",
						cc_accept_text : "I understand"
					},
					policy : {
						ccp_title : "cookie-policy",
						ccp_save_text : "Save preference",
						ccp_blocks : [
							{
								ccb_title : "Cookie essential",
								ccb_description: "A cookie is a small text file that a web portal leaves on your computer, tablet computer or smartphone when you visit it. In this way, the portal can “remember” certain entries and settings (e.g. login, language, font size and other display preferences) for a certain period of time, and you do not need to make these again each time you visit the portal and navigate through the portal.<br/><br/>You can control and / or delete cookies as you wish. You can find out how here: aboutcookies.org. You can delete all cookies stored on your computer and set most browsers to prevent cookies from being stored. Then you may have to make some settings manually each time you visit a page and accept the impairment of some functions.<br/><br/>Please also note our privacy policy in this context !"
							},
							{
								ccb_title : "Cookie of functionality",
								ccb_description: "Most of the cookies we use are so-called 'session cookies'. They are automatically deleted after your visit. Other cookies remain stored on your device until you delete them. These cookies enable us, for example, to recognize your browser the next time you visit.<br/><br/>You can control and / or delete cookies as you wish. You can find out how here: aboutcookies.org. You can delete all cookies stored on your computer and set most browsers to prevent cookies from being stored. Then you may have to make some settings manually each time you visit a page and accept the impairment of some functions.<br/><br/><a style='text-decoration:none; color:gray; font-weight:bold;' href='https://de.wikipedia.org/wiki/HTTP-Cookie'>More information about cookies</a>",
								ccb_switch : {
									value : 'cc_funzionalita',
									enabled : true,
									readonly : false
								}
							}
						]
					}
				}
			]
		});
	}

    function myLoop() {
        setTimeout(function () {
            if (auto) {
                autorun();
            }
        }, 10000)
    }
    if (auto) {
        myLoop();
    }
})();