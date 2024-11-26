// Functions to be executed within the active Chrome window
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
			for(let i=toremove.length-1;i>=0;i--){toremove[i].style.display="block";toremove[i].style.opacity="1";toremove[i].classList.remove('shift-yt-deleteme')};
			let toremoven = document.getElementsByClassName('shift-yt-used');
			for(let ii=toremoven.length-1;ii>=0;ii--){toremoven[ii].classList.remove('shift-yt-used')};
			document.body.setAttribute('async-inject-listener', 'false');
		}
	});
}
function extRun_work() {
	resetReapply();
}
function extRun_ads(){
	chrome.storage.sync.get('adMode', function(obj) {
		if(obj["adMode"] > 0) {
			if(window.location.host == 'www.youtube.com'){
				console.log("Youtube");
				hideAds();
			} else if (window.location.host == 'm.youtube.com') {
				console.log("Mobile Youtube");
				hideAds();
			} else {
				console.log('Not Youtube');
			}
		} else {
			console.log("OFF");
			//Add refresh here
			let toremove = document.getElementsByClassName('shift-yt-ads-deleteme');
			for(let i=toremove.length-1;i>=0;i--){toremove[i].style.display="block";toremove[i].style.opacity="1";toremove[i].classList.remove('shift-yt-ads-deleteme')};
			let toremoven = document.getElementsByClassName('shift-yt-ads-used');
			for(let ii=toremoven.length-1;ii>=0;ii--){toremoven[ii].classList.remove('shift-yt-ads-used')};
			document.body.setAttribute('async-inject-listener', 'false');
		}
	});
}
function extRun_mixes() {
	chrome.storage.sync.get('mixMode', function(obj) {
		if(obj["mixMode"] > 0) {
			if(window.location.host == 'www.youtube.com'){
				console.log("Youtube");
				hideMixes();
			} else if (window.location.host == 'm.youtube.com') {
				console.log("Mobile Youtube");
				hideMixes();
			} else {
				console.log('Not Youtube');
			}
		} else {
			console.log("OFF");
			//Add refresh here
			let toremove = document.getElementsByClassName('shift-yt-mix-deleteme');
			for(let i=toremove.length-1;i>=0;i--){toremove[i].style.display="block";toremove[i].style.opacity="1";toremove[i].classList.remove('shift-yt-mix-deleteme')};
			let toremoven = document.getElementsByClassName('shift-yt-mix-used');
			for(let ii=toremoven.length-1;ii>=0;ii--){toremoven[ii].classList.remove('shift-yt-mix-used')};
			document.body.setAttribute('async-inject-listener', 'false');
		}
	});
}

// Get local stored variables when tab is reloaded / refreshed, then set the UI accordingly
chrome.storage.sync.get('mK', function(obj) {
	if (obj['mK'] > 0) {
		document.getElementById('hide_watched').checked = 'true';
	}
});
chrome.storage.sync.get('adMode', function(obj) {
	if(obj['adMode'] > 0) {
		document.getElementById('hide_ads').checked = "true";
	}
});
chrome.storage.sync.get('mixMode', function(obj) {
	if(obj['mixMode'] > 0) {
		document.getElementById('hide_mixes').checked = "true";
	}
});
chrome.storage.sync.get('excl', function(obj) {
	if(obj['excl'] === undefined) {
		chrome.storage.sync.set({'excl':true});
	} else {
		if(!obj['excl']) {
			document.getElementById("ext_include").checked = 'true';
		}
	}
});

// Async functions with event handles that are responsible for tags
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

// Complex functions to set UI according to tags and including/excluding option
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

// Event Listeners that are responsible for inserting functions to be executed into the active Chrome tabs
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
document.getElementById('hide_ads').addEventListener('change', async() => {
	let [tab] = await chrome.tabs.query({active:true,currentWindow:true});

	chrome.storage.sync.get('adMode', function(obj) {
		if (typeof obj['adMode'] == 'undefined' ) {
			chrome.storage.sync.set({'adMode':1});
		}else if (obj['adMode'] > 0) {
			chrome.storage.sync.set({'adMode':0});
		}else if (obj['adMode'] == 0){
			chrome.storage.sync.set({'adMode':1});
		}
	});

	chrome.scripting.executeScript({
		target:{tabId:tab.id},
		function: extRun_ads,
	});
})
document.getElementById('hide_mixes').addEventListener('change', async() => {
	let [tab] = await chrome.tabs.query({active:true,currentWindow:true});

	chrome.storage.sync.get('mixMode', function(obj) {
		if (typeof obj['mixMode'] == 'undefined' ) {
			chrome.storage.sync.set({'mixMode':1});
		}else if (obj['mixMode'] > 0) {
			chrome.storage.sync.set({'mixMode':0});
		}else if (obj['mixMode'] == 0){
			chrome.storage.sync.set({'mixMode':1});
		}
	});

	chrome.scripting.executeScript({
		target:{tabId:tab.id},
		function: extRun_mixes,
	});
})
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
document.querySelector("label[for='ext_include']").addEventListener('click', async () => {
	let [tab] = await chrome.tabs.query({active:true,currentWindow:true});
	chrome.storage.sync.set({'excl':false});
	chrome.scripting.executeScript({
		target:{tabId: tab.id},
		func:extRun_work,
	});
});
document.querySelector("label[for='ext_exclude']").addEventListener('click', async () => {
	let [tab] = await chrome.tabs.query({active:true,currentWindow:true});
	chrome.storage.sync.set({'excl':true});
	chrome.scripting.executeScript({
		target:{tabId: tab.id},
		func:extRun_work,
	});
});