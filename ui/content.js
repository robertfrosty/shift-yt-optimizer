function extRun() {
	chrome.storage.sync.get('mK', function(obj) {
		if(obj['mK'] > 0) {
			if(window.location.host == 'www.youtube.com'){
				hideWatched();
				document.body.setAttribute('async-inject-listener', 'true');
			} else if (window.location.host == 'm.youtube.com') {
				hideWatched();
			} else {
				console.log('Not Youtube');
			}
		} else {
			let toremove = document.getElementsByClassName('shift-yt-deleteme');
			for(let i=toremove.length-1;i>=0;i--){toremove[i].style.display="inherit";toremove[i].style.opacity="1";toremove[i].classList.remove('shift-yt-deleteme')};
			let toremoven = document.getElementsByClassName('shift-yt-used');
			for(let ii=toremoven.length-1;ii>=0;ii--){toremoven[ii].classList.remove('shift-yt-used')};
			document.body.setAttribute('async-inject-listener', 'false');
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

inclhandler = async function(e) {
	let [tab] = await chrome.tabs.query({active:true,currentWindow:true});
	chrome.tabs.sendMessage(tab.id, {ftr:'work-mode', checkval:true, insparams:[this.value]});
	e.target.value="";
}

inputhandler = async function(e) {
	if(e.keyCode === 32) {
		if(e.target.value.length <= 1) {
			e.target.value = "";
			return;
		}
		let [tab] = await chrome.tabs.query({active:true,currentWindow:true});

		var spanel = document.createElement("SPAN");
		spanel.className = "tag";
		spanel.innerText = e.target.value;
		tempvar = e.target.value;
		spanel.addEventListener("click", (e) => {
			e.currentTarget.style.display = "none";
			e.currentTarget.className = "used-tag";

			tempvar2 = e.currentTarget.innerText;

			chrome.storage.sync.get(['incl_tags'], function(obj) {
				obj.incl_tags.splice(obj.incl_tags.indexOf(tempvar2), 1);

				chrome.tabs.sendMessage(tab.id, {ftr:'work-mode', checkval:false, remparams:tempvar2});

				chrome.storage.sync.set({'incl_tags':obj.incl_tags});
			});
		});
		e.target.blur();
		e.target.focus();
		document.getElementById("ext_include_tags").append(spanel);

		chrome.storage.sync.get(['incl_tags'], function(obj) {
			if(typeof obj['incl_tags'] == 'undefined') {
				chrome.storage.sync.set({'incl_tags':[tempvar]});
			} else {
				temparr = obj.incl_tags;
				temparr.push(tempvar);
				chrome.storage.sync.set({'incl_tags':temparr});
			}
		});
	}
}

chrome.storage.sync.get(['incl_tags'], function(obj) {
	if(typeof obj['incl_tags'] == 'undefined') {
		console.log('empty');
	} else {
		for(let i=0; i<obj.incl_tags.length;i++) {
			var spanel = document.createElement("SPAN");
			spanel.className = "tag";
			spanel.innerText = obj.incl_tags[i];
			document.getElementById("ext_include_tags").append(spanel);
		}
		document.getElementById('ext_include_params').blur();
		document.getElementById('ext_include_params').focus();
	}
});

chrome.storage.sync.get('wM', function(obj) {
	if (obj['wM'] > 0) {
		document.getElementById('work_mode_toggle').checked = 'true';
		document.getElementsByClassName('work_mode_dets')[0].classList.toggle('nonactive');
		document.getElementById('ext_include_params').addEventListener('focusout', inclhandler);
		document.getElementById('ext_include_params').addEventListener('keydown', inputhandler);
		const taglist = document.getElementsByClassName('tag');
		for(let i=0;i < taglist.length;i++) {
			taglist[i].addEventListener("click", (e) => {
				e.currentTarget.style.display = "none";

				tempvar2 = e.currentTarget.innerText;

				chrome.storage.sync.get(['incl_tags'], function(obj) {
					obj.incl_tags.splice(obj.incl_tags.indexOf(tempvar2), 1);
					chrome.storage.sync.set({'incl_tags':obj.incl_tags});
				})
			});
		}
	}
}); 

document.getElementById('work_mode_toggle').addEventListener('change', async() => {
	let [tab] = await chrome.tabs.query({active:true,currentWindow:true});
	document.getElementsByClassName('work_mode_dets')[0].classList.toggle('nonactive');
	chrome.storage.sync.get('wM', function(obj) {
		if (typeof obj['wM'] == 'undefined' ) { // on 
			chrome.storage.sync.set({'wM':1});
			document.getElementById('ext_include_params').addEventListener('focusout', inclhandler);
			document.getElementById('ext_include_params').addEventListener('keydown', inputhandler);
		}else if (obj['wM'] > 0) { // off
			chrome.storage.sync.set({'wM':0});
			chrome.tabs.sendMessage(tab.id, {ftr:'work-mode', checkval:false});
			document.getElementById('ext_include_params').removeEventListener('focusout', inclhandler);
		}else if (obj['wM'] == 0){ // on
			chrome.storage.sync.set({'wM':1});
			document.getElementById('ext_include_params').addEventListener('focusout', inclhandler);
			document.getElementById('ext_include_params').addEventListener('keydown', inputhandler);
			const taglist = Array.prototype.slice.call(document.getElementsByClassName('tag')).map(x => x.innerText);
			chrome.tabs.sendMessage(tab.id, {ftr:'work-mode', checkval:true, insparams:taglist});
		}
	});	

});