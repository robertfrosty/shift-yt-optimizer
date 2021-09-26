function extRun() {
	chrome.storage.sync.get('mK', function(obj) {
		if(obj['mK'] > 0) {
			if(window.location.host == 'www.youtube.com'){
				hideWatched();
				document.getElementById('contents').setAttribute('async-inject-listener', 'true');
			}else {
				console.log('Not Youtube');
			}
		} else {
			let toremove = document.getElementsByClassName('shift-yt-deleteme');
			for(let i=toremove.length-1;i>=0;i--){toremove[i].style.display="initial";toremove[i].style.opacity="1";toremove[i].classList.remove('shift-yt-deleteme')};
			let toremoven = document.getElementsByClassName('shift-yt-used');
			for(let ii=toremoven.length-1;ii>=0;ii--){toremoven[ii].classList.remove('shift-yt-used')};
			document.getElementById('contents').setAttribute('async-inject-listener', 'false');
		}
	});
}

chrome.storage.sync.get('mK', function(obj) {
	if (obj['mK'] > 0) {
		document.getElementById('hide_watched').checked = 'true';
	}
});

document.getElementById('hide_watched').addEventListener('change', async() => {
	let [tab] = await chrome.tabs.query({active:true,currentWindow:true});

	chrome.storage.sync.get('mK', function(obj) {
		if (typeof obj['mK'] == 'undefined' ) {
			chrome.storage.sync.set({'mK':1});
		}else if (obj['mK'] > 0) {
			chrome.storage.sync.set({'mK':0});
		}else if (obj['mK'] == 0){
			chrome.storage.sync.set({'mK':1});
		}
	});

	chrome.scripting.executeScript({
		target:{tabId:tab.id},
		function: extRun,
	});
});