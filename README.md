![logo icon of shift-yt-optimizer](./ui/icons/icon128px.png)
# shift-yt-optimizer Chrome Extension
Chrome extension to hide/reduce the number of videos shown on YouTube.

**Published & Featured** : https://chrome.google.com/webstore/detail/shift-youtube-optimizer/hfndjegliabemhpfcdecfehlipjdnecp

<img width="473" alt="Screenshot 2024-11-21 at 4 38 38 PM" src="https://github.com/user-attachments/assets/59bd9b9d-e333-4d9f-aa3b-0daab262fcd4">

***Update Pending Review From Google [v.1.1.0]***

-Updated parameters for 'hideWatched' mode

-Fixed function and added parameters for 'hideWorkMode'

![screenshot of shift-yt-optimizer in use](./screenshots/shift_yt_screenshot1.PNG)

As the summary above states, this is a simple open-source chrome extension written in vanilla JavaScript, CSS and of course, HTML, using the Chrome Extension format, although shortly there should be an extension for Firefox as well. I noticed a number of other Chrome Extensions that were similar but they all only worked on the homepage, so I decided to make one that worked all over the site, and didn't need the mouse to scroll before it would activate.

I spent a few days looking into how YouTube sets up the front-end of their website, so if anyone has any questions, feel free to shoot me a message. Also, if anyone would like to check out the source-code, or contribute to make it even better (or fix bugs), you've come to the right place.

# Features

-Hides all watched YouTube videos only on the youtube.com website. Tested and working pages include the homepage, user's channels, playlists, watching a video, search results page, and the explore/trending pages.

-'Work Mode' : Predefine a list of channels/tags that you would like to allow videos from, and hide everything else. Great for work in a professional setting, or teachers who don't want to create multiple accounts. Can only show videos that contain matching keywords, or can only show videos that DO NOT contain matching keywords. [still testing, although I haven't found any bugs so far]

# Coming Soon

'Mobile Mode' Improvements (Google Chrome does not allow extensions on mobile devices, so this is a very small percentage of users)
Need to update parameters to also hide mixes, podcasts and shorts (and any other new types that I've missed)
