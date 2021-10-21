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

/*


function findHideParams() {
	let locname = window.location.pathname.split('/');
	var flag = true;
	if(flag) {
		if(locname[1] == 'watch') { //watching video
			hideparams = 'ytd-compact-video-renderer';
		} else if (locname[1] == 'results'){
			hideparams = 'ytd-video-renderer';
		} else {
			if(locname[1] == '') { //homepage
				hideparams = 'ytd-rich-item-renderer';
			} else if (locname[1] == 'c' || locname[1] == 'user' || locname[1] == 'channel') { //someone's channel
				hideparams = 'ytd-grid-video-renderer';
			} else if (locname[1] == 'feed') { //explore
				hideparams = 'ytd-video-renderer';
			} else if (locname[1] == 'playlist') { //watching playlist
				hideparams = 'ytd-playlist-video-renderer';
			}
		}
	}
	return hideparams;
}

*/

function resetReapply() {
	// Reset everything
	let toremove = document.getElementsByClassName('shift-yt-wm-deleteme');
	for(let i=toremove.length-1;i>=0;i--){toremove[i].style.display="inherit";toremove[i].style.opacity="1";toremove[i].classList.remove('shift-yt-wm-deleteme')};
	let toremoven = document.getElementsByClassName('shift-yt-wm-used');
	for(let ii=toremoven.length-1;ii>=0;ii--){toremoven[ii].classList.remove('shift-yt-wm-used')};
	document.body.setAttribute('async-inject-listener', 'false');

	//Reapply hideWorkMode() - should just be able to call func, it will check for incl / exclude
	hideWorkMode();
}

const notsyncGet = async (key) => {
	return new Promise((resolve, reject) => {
		chrome.storage.sync.get([key], function(obj) {
			if(obj[key] === 'undefined') {
				reject();
			} else {
				resolve(obj[key]);
			}
		});
	});
};

async function hideWorkMode(elist=null) {
	if(!elist) {
		elist = await notsyncGet('incl_tags');
	}
	exclude = await notsyncGet('excl');
	for(tag in elist) {
		if(elist[tag].length > 0) {
			let e = elist[tag].trim();
			let locname = window.location.pathname.split('/');
			if(e.includes(">")) {
			} else { // search channels and video titles
				if(locname[1] == 'watch') { //watching video
					hideparams = 'ytd-compact-video-renderer';
					allmeta = document.querySelectorAll("div.style-scope.metadata:not(.shift-yt-wm-used):not(.ytd-mini-player)");
					textparams = ["span[id='video-title']", "yt-formatted-string[id='text']"];
				} else if (locname[1] == 'results'){
					hideparams = 'ytd-video-renderer';
					allmeta = document.querySelector('ytd-search').querySelectorAll("div.text-wrapper:not(.shift-yt-wm-used)");
					textparams = ["a[id='video-title']", "yt-formatted-string[id='text']", "yt-formatted-string.metadata-snippet-text"];
				} else {
					if(locname[1] == '') { //homepage
						hideparams = 'ytd-rich-item-renderer';
						allmeta = document.querySelectorAll("div.ytd-rich-grid-media:not(.shift-yt-wm-used)[id='meta']");
						textparams = ["yt-formatted-string[id='video-title']", "yt-formatted-string[id='text']"];
					} else if (locname[1] == 'c' || locname[1] == 'user' || locname[1] == 'channel') { //someone's channel
						hideparams = 'ytd-grid-video-renderer';
						allmeta = document.querySelectorAll("div.ytd-grid-video-render:not(.shift-yt-wm-used)[id='meta']");
						textparams = ["a[id='video-title']"];
					} else if (locname[1] == 'feed') { //explore
						if(locname[2] == 'subscriptions' || locname[2] == 'library') {
							allmeta = document.querySelectorAll("div.ytd-grid-video-renderer:not(.shift-yt-wm-used):not(.ytd-mini-player):not(.ytd-watch-flexy)[id='meta']");
							hideparams = 'ytd-grid-video-renderer';
							textparams = ["a[id='video-title']", "yt-formatted-string[id='text']"];
						} else {
							allmeta = document.querySelectorAll("div.text-wrapper:not(.shift-yt-wm-used)");
							hideparams = 'ytd-video-renderer';
							textparams = ["a[id='video-title']", "yt-formatted-string[id='text']", "yt-formatted-string[id='description-text']"];
						}
					} else if (locname[1] == 'playlist') { //watching playlist
						hideparams = 'ytd-playlist-video-renderer';
						allmeta = document.querySelectorAll("div.ytd-playlist-video-render:not(.shift-yt-wm-used)[id='meta']");
						textparams = ["a[id='video-title']", "yt-formatted-string[id='text']"];
					}
				}
				let re = new RegExp(e, 'i');
				for(i=0; i<allmeta.length;i++) {
					for(text in textparams) {
						console.log(exclude);
						if(exclude) {
							if(allmeta[i].querySelector(textparams[text]).innerText.match(re)) { // if video title contains words to remove, hide whole video
								let torem = findAncs(allmeta[i], null, hideparams);
								torem.classList.add('shift-yt-wm-deleteme', e);
								torem.style.opacity = "0";
								setTimeout(() => {torem.style.display = "none"}, 1000);
								allmeta[i].classList.add('shift-yt-wm-used');
								break;
							}
						} else {
							if(allmeta[i].querySelector(textparams[text]).innerText.match(re)) { // if video title does NOT contains words to remove, hide whole video
								allmeta[i].setAttribute('shift-save-for-later', true);
								break;
							}
							if(text == textparams.length - 1) { //If this is last item in textparams list then hide the video
								if(allmeta[i].getAttribute('shift-save-for-later')) {
									console.log(allmeta[i]);
									break;
								}
								let torem = findAncs(allmeta[i], null, hideparams);
								torem.classList.add('shift-yt-wm-deleteme', e);
								torem.style.opacity = "0";
								setTimeout(() => {torem.style.display = "none"}, 1000);
								allmeta[i].classList.add('shift-yt-wm-used');
							}
						}
					}
				}
			}
		}
	}
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
					ancCont = "";
					ancCont = findAncs(tohide[i], hideparam[ii]);
					if(ancCont) {
						ancCont.classList.add('shift-yt-deleteme');
						ancCont.style.opacity = "0";
						setTimeout(function(ancCont){ancCont.style.display="none"}, 1000, ancCont);
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

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if(request.ftr == 'work-mode') {
			if(request.checkval) {
				if(request.insparams) {
					hideWorkMode(request.insparams);
				}
			} else {
				if(request.remparams) { //remove params are defined
					let r = request.remparams.trim();
					let toremove = document.getElementsByClassName(r);
					for(let i=toremove.length-1;i>=0;i--){
						toremove[i].style.display="inherit";
						toremove[i].style.opacity="1";
						toremove[i].classList.remove('shift-yt-wm-deleteme');
						toremove[i].querySelector('.shift-yt-wm-used').classList.remove('shift-yt-wm-used');
					}
				} else { // no remove params, remove everything
					let toremove = document.getElementsByClassName('shift-yt-wm-deleteme');
					for(let i=toremove.length-1;i>=0;i--){toremove[i].style.display="inherit";toremove[i].style.opacity="1";toremove[i].classList.remove('shift-yt-wm-deleteme')};
					let toremoven = document.getElementsByClassName('shift-yt-wm-used');
					for(let ii=toremoven.length-1;ii>=0;ii--){toremoven[ii].classList.remove('shift-yt-wm-used')};
					document.body.setAttribute('async-inject-listener', 'false');
				}																																																																																																																																																																																		
			}
		}
	}
)

function scrollHide(e) {
	if(this.oldScroll < this.scrollY) {
		chrome.storage.sync.get('mK', function(obj) {
			if (obj['mK'] > 0) {
				hideWatched();
			}
		});
		chrome.storage.sync.get('wM', function(obj) {
			if (obj['wM'] > 0) {
				hideWorkMode();
			}
		});
	}
	this.oldScroll = this.scrollY;
}

function loadFunc() {
	stylesh = document.createElement('style');
	stylesh.type = 'text/css';
	stylesh.innerHTML = `.shift-yt-used {display: none;} ${yttype}-video-with-context-renderer, ${yttype}-rich-item-renderer, ${yttype}-grid-renderer, ${yttype}-grid-video-renderer, ${yttype}-compact-video-renderer, ${yttype}-playlist-video-renderer, ${yttype}-video-renderer, ${yttype}-shelf-renderer {-webkit-transition: opacity 1s ease-in-out;-moz-transition: opacity 1s ease-in-out;-ms-transition: opacity 1s ease-in-out;-o-transition: opacity 1s ease-in-out;}`;
	document.getElementsByTagName('head')[0].appendChild(stylesh);

	window.addEventListener('scroll', scrollHide);
}

if(window.location.href.split("//")[1].split(".")[0] == 'm'|| document.querySelector('ytm-app')) {
	yttype = 'ytm';	} 
else {
	yttype = 'ytd';
}

if(yttype == 'ytd') {
	var loadObs = document.querySelectorAll(`${yttype}-app`)[0];
	lobserver = new MutationObserver(function(mutationsList, lobserver) {
		console.log(`page loaded`);
		elemObs = document.querySelector('yt-page-navigation-progress');
		observer = new MutationObserver(function(mutationsList, observer) {
			if(elemObs.hidden) {
				console.log('page_loaded3');
				loadFunc();
				let toremoven = document.getElementsByClassName('shift-yt-used');
				for(let ii=toremoven.length-1;ii>=0;ii--){toremoven[ii].classList.remove('shift-yt-used')};
				chrome.storage.sync.get('mK', function(obj) {
					if (obj['mK'] > 0) {
						hideWatched();
					}
				});
				chrome.storage.sync.get('wM', function(obj) {
					if (obj['wM'] > 0) {
						hideWorkMode();
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
		chrome.storage.sync.get('wM', function(obj) {
			if (obj['wM'] > 0) {
				hideWorkMode();
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

loadFunc();