function ready(fn) {
	if (
		document.attachEvent
			? document.readyState === 'complete'
			: document.readyState !== 'loading'
	) {
		fn();
	} else {
		document.addEventListener('DOMContentLoaded', fn);
	}
}

ready(function onReady() {
	var sync = document.getElementById('sync');
	var async = document.getElementById('async');
	var log = document.getElementById('log');

	function getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		// The maximum is exclusive and the minimum is inclusive
		return Math.floor(Math.random() * (max - min)) + min;
	}

	function r() {
		return getRandomInt(1, 999999999);
	}

	function enableButtons() {
		sync.disabled = false;
		async.disabled = false;
	}

	function disableButtons() {
		sync.disabled = true;
		async.disabled = true;
	}

	function createImplicitAsyncScriptTag(src) {
		var script = document.createElement('script');
		script.src = src;
		script.className = 'dynamic';
		return script;
	}

	function createExplicitSyncScriptTag(src) {
		var script = document.createElement('script');
		script.src = src;
		script.className = 'dynamic';
		script.async = false;
		return script;
	}

	function removeAllOldDynamicScripts() {
		var dynamic_scripts = document.querySelectorAll('.dynamic');
		for (var i = 0; i < dynamic_scripts.length; i++) {
			var dynamic_script = dynamic_scripts[i];
			dynamic_script.parentNode.removeChild(dynamic_script);
		}
	}

	var writeLog = (function () {
		var count = 0;
		return function (str, no_new_line) {
			log.value += '[' + count++ + ']: ' + str + (no_new_line ? '' : '\n');
			
			// Auto scroll to bottom
			log.scrollTop = log.scrollHeight;
		};
	})();
	window.writeLog = writeLog;

	function grabSyncScripts() {
		disableButtons();
		removeAllOldDynamicScripts();

		var tags = ['huge', 'big', 'medium', 'small', 'tiny'].map(function (size) {
			return createExplicitSyncScriptTag('/js/' + size + '/' + r() + '.js');
		});

		var load_promises = tags.map(function (tag) {
			return new Promise(function (resolve, reject) {
				tag.onload = resolve;
				tag.onerror = reject;
			});
		});

		writeLog('Synchronously injecting "huge, big, medium, small, tiny" in that order...');

		// Append them in order, largest to smallest
		tags.forEach(function (tag) {
			document.body.appendChild(tag);
		});

		Promise.all(load_promises)
			.then(function () {
				enableButtons();

				writeLog('Done fetching and executing scripts!\n');
			})
			.catch(function (err) {
				enableButtons();

				writeLog('Something went wrong... \n' + err.toString() + '\n');
			});
	}

	function grabAyncScripts() {
		disableButtons();
		removeAllOldDynamicScripts();

		var tags = ['huge', 'big', 'medium', 'small', 'tiny'].map(function (size) {
			return createImplicitAsyncScriptTag('/js/' + size + '/' + r() + '.js');
		});

		var load_promises = tags.map(function (tag) {
			return new Promise(function (resolve, reject) {
				tag.onload = resolve;
				tag.onerror = reject;
			});
		});

		writeLog('Asynchronously injecting "huge, big, medium, small, tiny" in that order...');

		// Append them in order, largest to smallest
		tags.forEach(function (tag) {
			document.body.appendChild(tag);
		});

		Promise.all(load_promises)
			.then(function () {
				enableButtons();

				writeLog('Done fetching and executing scripts!\n');
			})
			.catch(function (err) {
				enableButtons();

				writeLog('Something went wrong... \n' + err.toString() + '\n');
			});
	}

	sync.addEventListener('click', function (e) {
		grabSyncScripts();
	});

	async.addEventListener('click', function (e) {
		grabAyncScripts();
	});
});
