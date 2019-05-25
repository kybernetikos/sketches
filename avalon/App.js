function getConfig(url) {
	var xhr = new XMLHttpRequest();
	xhr.open('get', url, false);
	xhr.send(null);
	return JSON.parse(xhr.responseText);
}

function checkFilter(filter, configuration) {
	for (var key in filter) {
		if (configuration[key] !== filter[key]) {
			return false;
		}
	}
	return true;
}

function App(script) {
	var steps = this.steps = script.steps;
	this.currentClip = null;
	var audio = this.audio = [];
	for (var i = 0, length = steps.length; i < length; ++i) {
		audio[i] = new Audio('audio/ogg/' + steps[i].file + '.ogg');
		audio[i].load();
	}
	this.playing = false;
}

App.prototype.play = function() {
	this.playing = true;
	var selectionForm = document.getElementById('configuration');
	var configuration = {
		intro: selectionForm.monarchist.checked ? "monarchist" : (selectionForm.democrat.checked ? "democrat" : "none"),
		merlin: selectionForm.merlin.checked,
		percival: selectionForm.perceval.checked,
		mordred: selectionForm.mordred.checked,
		oberon: selectionForm.oberon.checked,
		morgana: selectionForm.morgana.checked
	};

	var i = 0;
	var steps = this.steps, audio = this.audio, app = this;
	function playNext() {
		if (app.playing === false) {
			return;
		}
		var currentClip = app.currentClip = audio[i];
		var willPlay = checkFilter(steps[i].filter, configuration);
		currentClip.currentTime = 0;
		if (++i < audio.length) {
			setTimeout(playNext, willPlay ? (currentClip.duration * 1000) : 0);
		}
		if (willPlay) {
			console.log('playing ' + currentClip.currentSrc+" "+currentClip.duration);
			currentClip.play();
		} else {
			console.log('not playing ' + currentClip.currentSrc);
		}
	}
	playNext();
};

App.prototype.stop = function() {
	if (this.currentClip !== null) {
		this.currentClip.pause();
		this.currentClip = null;
	}
	this.playing = false;
};