# shift-yt-optimizer Chrome Extension 

**Published**
https://chrome.google.com/webstore/detail/shift-youtube-optimizer/hfndjegliabemhpfcdecfehlipjdnecp

Chrome extension to hide/reduce the number of videos shown on YouTube.

![screenshot of shift-yt-optimizer in use](./screenshots/shift_yt_screenshot2.PNG)

As the summary above states, this is a simple open-source chrome extension written in vanilla JavaScript, CSS and of course, HTML, using the Chrome Extension format, although shortly there should be an extension for Firefox as well. I noticed a number of other Chrome Extensions that were similar but they all only worked on the homepage, so I decided to make one that worked all over the site, and didn't need the mouse to scroll before it would activate.

I spent a few days looking into how YouTube sets up the front-end of their website, so if anyone has any questions, feel free to shoot me a message. Also, if anyone would like to check out the source-code, or contribute to make it even better (or fix bugs), you've come to the right place.

# Features

-Hides all watched YouTube videos only on the youtube.com website. Tested and working pages include the homepage, user's channels, playlists, watching a video, and the explore/trending pages. **(Need to add in search query page)**

-**Coming Soon**
'Work Mode' : Predefine a list of channels/tags that you would like to allow videos from, and hide everything else. Great for work in a professional setting, or teachers who don't want to create multiple accounts.

-**Known Bugs**
-Doesn't work on 'search results' page which freezes the main thread, but async funcs still work.
-Needs refresh after first time turning on and downloading.
