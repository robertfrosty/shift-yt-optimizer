function hasClass(element, className) {
	return (' ' + element.className + ' ').indexOf(' ' + className + ' ') > -1;
}
function findAncs(el, cls=0, clparam=0) {
	try {
		if (clparam==0) {
			while ((el = el.parentNode) && !hasClass(el, cls));
		} else {
			while ((el = el.parentNode) && (el.tagName != clparam.toUpperCase()));
		}
		return el;
	} catch(err) {
		console.warn("%c findAncs() func was unable to find a parent element with the pre-defined className. If you are interested in helping fix this issue, please report this to https://github.com/robertfrosty/shift-yt-optimizer", "background: #222222;color: cyan; font-weight: bold;");
		return false;
	}
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

function hideWatched(hideparam=['ytd-rich-grid-renderer']) {
	if(window.location.href.split("/")[3] == 'playlist?list=LL') {
		return;
	}
	let locname = window.location.pathname.split('/');
	var tohide = null;
	var flag = (yttype == 'ytd' ? true : false);
	if (flag) { // Desktop version
		if(locname[1] == 'watch') { //watching video
			hideparam=['ytd-item-section-renderer'];
			tohide = attrQueryAll(null, 'ytd-watch-flexy', 'role', 'main')[0].querySelectorAll('ytd-thumbnail-overlay-resume-playback-renderer:not(.shift-yt-used)');
		} else if (locname[1] == 'results'){
			hideparam=['ytd-vertical-list-renderer', 'ytd-item-section-renderer'];
			tohide = attrQueryAll(null, 'ytd-search', 'role', 'main')[0].querySelectorAll('ytd-thumbnail-overlay-resume-playback-renderer:not(.shift-yt-used)');
		} else {
			if(locname[1] == '') { //homepage
				hideparam=['ytd-rich-grid-renderer'];
				tohide = attrQueryAll(null, 'ytd-browse', 'role', 'main')[0].querySelectorAll('ytd-thumbnail-overlay-resume-playback-renderer:not(.shift-yt-used)');
			} else if (locname[1] == 'c' || locname[1] == 'user' || locname[1] == 'channel') { //someone's channel
				if (locname[locname.length - 1] == 'videos') {
					hideparam=['ytd-grid-renderer'];
				} else {
					hideparam=['yt-horizontal-list-renderer'];
				}
				tohide = attrQueryAll(null, 'ytd-browse', 'role', 'main')[0].querySelectorAll('ytd-thumbnail-overlay-resume-playback-renderer:not(.shift-yt-used)');
			} else if (locname[1] == 'feed') { //explore
				if(locname[2] == 'explore' || locname[2] == 'trending') {
					hideparam = ['ytd-expanded-shelf-contents-renderer'];
				} else {
					hideparam = ['ytd-grid-renderer'];
				}
				tohide = attrQueryAll(null, 'ytd-browse', 'role', 'main')[0].querySelectorAll('ytd-thumbnail-overlay-resume-playback-renderer:not(.shift-yt-used)');
			} else if (locname[1] == 'playlist') { //watching playlist
				hideparam=['ytd-playlist-video-list-renderer'];
				tohide = attrQueryAll(null, 'ytd-browse', 'role', 'main')[0].querySelectorAll('ytd-thumbnail-overlay-resume-playback-renderer:not(.shift-yt-used)');
			}
		}
		if(tohide.length>0) {
			for (let i=0;i<tohide.length;i++) {
				for(let ii=0;ii<hideparam.length;ii++) {
					var ancCont = findAncs(tohide[i], hideparam[ii]);
					if(ancCont) {
						ancCont.classList.add('shift-yt-deleteme');
						ancCont.style.opacity = "0";
						setTimeout(function(){findAncs(tohide[i], hideparam[ii]).style.display = "none"}, 1000);
						tohide[i].classList.add('shift-yt-used');
					}
				}
			}
			console.log("%c ______  __  __  __  ______  ______  \n/\\  ___\\/\\ \\_\\ \\/\\ \\/\\  ___\\/\\__  _\\ \n\\ \\___  \\ \\  __ \\ \\ \\ \\  __\\\\/_/\\ \\/ \n \\/\\_____\\ \\_\\ \\_\\ \\_\\ \\_\\     \\ \\_\\\n  \\/_____/\\/_/\\/_/\\/_/\\/_/      \\/_/ \n\n", "color: #2196F3;");
		}
	} else { // Mobile Version
		if(locname[1] == 'watch') { //watching video
			hideparam=['ytm-video-with-context-renderer'];
			tohide = document.querySelector('ytm-watch').querySelectorAll('ytm-thumbnail-overlay-resume-playback-renderer:not(.shift-yt-used)');
		} else if (locname[1] == 'results'){
			hideparam=['ytm-compact-video-renderer'];
			tohide = document.querySelector('ytm-search').querySelectorAll('ytm-thumbnail-overlay-resume-playback-renderer:not(.shift-yt-used)');
		} else {
			if(locname[1] == '') { //homepage
				hideparam=['ytm-rich-item-renderer']
				tohide = document.querySelector('ytm-browse').querySelectorAll('ytm-thumbnail-overlay-resume-playback-renderer:not(.shift-yt-used)');
			} else if (locname[1] == 'c' || locname[1] == 'user' || locname[1] == 'channel') { //someone's channel
				hideparam=['ytm-compact-video-renderer'];
				tohide = document.querySelector('ytm-browse').querySelectorAll('ytm-thumbnail-overlay-resume-playback-renderer:not(.shift-yt-used)');
			} else if (locname[1] == 'feed') { //explore
				hideparam=['ytm-item-section-renderer'];
				tohide = document.querySelector('ytm-browse').querySelectorAll('ytm-thumbnail-overlay-resume-playback-renderer:not(.shift-yt-used)');
			} else if (locname[1] == 'playlist') { //watching playlist
				hideparam=['ytm-playlist-video-renderer'];
				tohide = document.querySelector('ytm-browse').querySelectorAll('ytm-thumbnail-overlay-resume-playback-renderer:not(.shift-yt-used)');
			}
		}
		if(tohide.length>0) {
			for (let i=0;i<tohide.length;i++) {
				for(let ii=0;ii<hideparam.length;ii++) {
					var ancCont = findAncs(tohide[i], null, hideparam[ii]); // Search using tagName instead of className
					if(ancCont) {
						ancCont.classList.add('shift-yt-deleteme');
						ancCont.style.opacity = "0";
						setTimeout(function(){findAncs(tohide[i], null, hideparam[ii]).style.display = "none"}, 1000);
						tohide[i].classList.add('shift-yt-used');
					}
				}
			}
			console.log("%c ______  __  __  __  ______  ______  \n/\\  ___\\/\\ \\_\\ \\/\\ \\/\\  ___\\/\\__  _\\ \n\\ \\___  \\ \\  __ \\ \\ \\ \\  __\\\\/_/\\ \\/ \n \\/\\_____\\ \\_\\ \\_\\ \\_\\ \\_\\     \\ \\_\\\n  \\/_____/\\/_/\\/_/\\/_/\\/_/      \\/_/ \n\n", "color: #2196F3;");
		}
	}
}

if(window.location.href.split("//")[1].split(".")[0] == 'm'|| document.querySelector('ytm-app')) {
	yttype = 'ytm';
} else {
	yttype = 'ytd';
}

stylesh = document.createElement('style');
stylesh.type = 'text/css';
stylesh.innerHTML = `${yttype}-video-with-context-renderer, ${yttype}-rich-item-renderer, ${yttype}-grid-renderer, ${yttype}-grid-video-renderer, ${yttype}-compact-video-renderer, ${yttype}-playlist-video-renderer, ${yttype}-video-renderer, ${yttype}-shelf-renderer {-webkit-transition: opacity 1s ease-in-out;-moz-transition: opacity 1s ease-in-out;-ms-transition: opacity 1s ease-in-out;-o-transition: opacity 1s ease-in-out;}`;
document.getElementsByTagName('head')[0].appendChild(stylesh);

if(yttype == 'ytd') {
	var loadObs = document.querySelectorAll(`${yttype}-app`)[0];
	lobserver = new MutationObserver(function(mutationsList, lobserver) { 
		elemObs = document.querySelector('yt-page-navigation-progress');
		observer = new MutationObserver(function(mutationsList, observer) {
			if(elemObs.hidden) {
				let toremoven = document.getElementsByClassName('shift-yt-used');
				for(let ii=toremoven.length-1;ii>=0;ii--){toremoven[ii].classList.remove('shift-yt-used')};
				chrome.storage.sync.get('mK', function(obj) {
					if (obj['mK'] > 0) {
						hideWatched();
					}
				});
			}
		});
		observer.observe(elemObs, {characterData:true, childList:true, attributes: true});

		chrome.storage.sync.get('mK', function(obj) {
			if (obj['mK'] > 0) {
				hideWatched();
			}
		});
	});
	lobserver.observe(loadObs, {characterData:true, childList:true, attributes: true});
} else {
	window.addEventListener('load', () => {
		elemObs = document.querySelector('div.spinner');
		observer = new MutationObserver(function(mutationsList, observer) {
			if(elemObs.hidden) {
				let toremoven = document.getElementsByClassName('shift-yt-used');
				for(let ii=toremoven.length-1;ii>=0;ii--){toremoven[ii].classList.remove('shift-yt-used')};
				chrome.storage.sync.get('mK', function(obj) {
					if (obj['mK'] > 0) {
						hideWatched();
					}
				});
			}
		});
		observer.observe(elemObs, {characterData:true, childList:true, attributes: true});
		chrome.storage.sync.get('mK', function(obj) {
			if (obj['mK'] > 0) {
				hideWatched();
			}
		});
	});
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