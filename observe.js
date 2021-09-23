function hasClass(element, className) {
	return (' ' + element.className + ' ').indexOf(' ' + className + ' ') > -1;
}
function findAncs(el, cls, clparam=0) {
	if (clparam==0) {
		while ((el = el.parentNode) && !hasClass(el, cls));
	} else {
		while ((el = el.parentNode) && (el.tagName != cls));
	}
	return el;
}
function attrQueryAll(cls=null, tag=null, attr, qterm) {
	if (cls) {
		var attrll = document.getElementsByClassName(cls);
	} else if (tag) {
		var attrll = document.querySelectorAll(tag);
	}
	let newarr = new Array();
	for(i=0; i<attrll.length;i++) {
		if(attrll[i].getAttribute(attr) == qterm) {
			newarr.push(attrll[i]);
		}
	}
	return newarr;
}

function hideWatched(hideparam='ytd-rich-grid-renderer') {
	if(window.location.href.split("/")[3] == 'playlist?list=LL') {
		return;
	}
	let locname = window.location.pathname.split('/');
	var tohide = null;
	if(locname[1] == 'watch') { //watching video
		hideparam='ytd-item-section-renderer';
		tohide = attrQueryAll(null, 'ytd-watch-flexy', 'role', 'main')[0].querySelectorAll('ytd-thumbnail-overlay-resume-playback-renderer:not(.shift-yt-used)');
	} else {
		tohide = attrQueryAll(null, 'ytd-browse', 'role', 'main')[0].querySelectorAll('ytd-thumbnail-overlay-resume-playback-renderer:not(.shift-yt-used)');
		if(locname[1] == '') { //homepage
			//do nothing	
		} else if (locname[1] == 'c' || locname[1] == 'user' || locname[1] == 'channel') { //someone's channel
			if (locname[locname.length - 1] == 'videos') {
				hideparam='ytd-grid-renderer';
			} else {
				hideparam='yt-horizontal-list-renderer';
			}
		} else if (locname[1] == 'feed') { //explore **double check this**
			if(locname[2] == 'explore' || locname[2] == 'trending') {
				hideparam = 'ytd-expanded-shelf-contents-renderer';
			} else {
				hideparam = 'ytd-grid-renderer';
			}
		} else if (locname[1] == 'playlist') { //watching playlist
			hideparam='ytd-playlist-video-list-renderer';
		}
	}
	if(tohide.length>0) {
		for (let i=0;i<tohide.length;i++) {
			findAncs(tohide[i], hideparam).classList.add('shift-yt-deleteme');
			findAncs(tohide[i], hideparam).style.opacity = "0";
			setTimeout(function(){findAncs(tohide[i], hideparam).style.display = "none"}, 1000);
			tohide[i].classList.add('shift-yt-used');
		}
		console.log(" ______  __  __  __  ______  ______  \n/\\  ___\\/\\ \\_\\ \\/\\ \\/\\  ___\\/\\__  _\\ \n\\ \\___  \\ \\  __ \\ \\ \\ \\  __\\\\/_/\\ \\/ \n \\/\\_____\\ \\_\\ \\_\\ \\_\\ \\_\\     \\ \\_\\\n  \\/_____/\\/_/\\/_/\\/_/\\/_/      \\/_/ \n\n");
	}
}

function npObs_func() {
	if(typeof npobserver !== 'undefined') {
		npobserver.disconnect();
	}
	if (typeof observer !== 'undefined') {
		observer.disconnect();
	}
	newpageObs = attrQueryAll(null, 'ytd-browse', 'role', 'main')[0];
	npobserver = new MutationObserver(function(mutationsList, npobserver){
		chrome.storage.sync.get('mK', function(obj) {
			if (obj['mK'] > 0) {
				setTimeout(hideWatched, 500);
				npObs_func();
				elemObs = attrQueryAll(null, 'ytd-browse', 'role', 'main')[0].querySelector('div#contents');
				observer = new MutationObserver(function(mutationsList, observer) {
					chrome.storage.sync.get('mK', function(obj) {
						if (obj['mK'] > 0) {
							hideWatched();
						}
					});
				});
				observer.observe(elemObs, {characterData:false, childList:true, attributes: false});
			}
		});
	});
	npobserver.observe(newpageObs, {attributes:true,characterData:true, childList:true});
}

stylesh = document.createElement('style');
stylesh.type = 'text/css';
stylesh.innerHTML = 'ytd-rich-item-renderer, ytd-grid-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer, ytd-playlist-video-renderer, ytd-video-renderer {-webkit-transition: opacity 1s ease-in-out;-moz-transition: opacity 1s ease-in-out;-ms-transition: opacity 1s ease-in-out;-o-transition: opacity 1s ease-in-out;}';
document.getElementsByTagName('head')[0].appendChild(stylesh);

var loadObs = document.querySelectorAll('ytd-app')[0];
lobserver = new MutationObserver(function(mutationsList, lobserver) {
	chrome.storage.sync.get('mK', function(obj) {
		if (obj['mK'] > 0) {
			hideWatched();
		}
	});
});
lobserver.observe(loadObs, {characterData:true, childList:true, attributes: true});

npObs_func();

const startloc = window.location.pathname.split("/");
if(startloc[1] == 'c' || startloc[1] == 'user' || startloc[1] == 'channel') {
	elemObs = attrQueryAll(null, 'ytd-browse', 'role', 'main')[0].querySelector('div#contents');
	observer = new MutationObserver(function(mutationsList, observer) {
		chrome.storage.sync.get('mK', function(obj) {
			if (obj['mK'] > 0) {
				hideWatched();
			}
		});
	});
	observer.observe(elemObs, {characterData:false, childList:true, attributes: false});
}

window.addEventListener('scroll', function(e) {
	if(this.oldScroll < this.scrollY) {
		chrome.storage.sync.get('mK', function(obj) {
			if (obj['mK'] > 0) {
				hideWatched();
			}
		});
	}
	this.oldScroll = this.scrollY;
});
