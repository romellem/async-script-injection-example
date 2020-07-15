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
	var loading = document.getElementById('loading');
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
		return script;
	}

	function createExplicitSyncScriptTag(src) {
		var script = document.createElement('script');
		script.src = src;
		script.async = false;
		return script;
	}

	var writeLog = (function () {
		var count = 0;
		return function (str, no_new_line) {
			log.value += '[' + count++ + ']: ' + str + (no_new_line ? '' : '\n');
		};
	})();
	window.writeLog = writeLog;

	function grabSyncScripts() {
		disableButtons();

		var tags = ['huge', 'big', 'medium', 'small', 'tiny'].map(function (size) {
			return createExplicitSyncScriptTag('/js/' + size + '/' + r() + '.js');
		});

		var load_promises = tags.map(function (tag) {
			return new Promise(function (resolve, reject) {
				tag.onload = resolve;
				tag.onerror = reject;
			});
		});

		writeLog('Synchronously injecting big, medium, and small...');
		loading.innerText = 'Loading...';

		// Append them in order, largest to smallest
		tags.forEach(function (tag) {
			document.body.appendChild(tag);
		});

		Promise.all(load_promises)
			.then(function () {
				enableButtons();
				loading.innerText = '';
			})
			.catch(function (err) {
				enableButtons();
				loading.innerText = '';
				writeLog('Something went wrong... ' + err.toString());
			});
	}

	function grabAyncScripts() {
		disableButtons();

		var tags = ['huge', 'big', 'medium', 'small', 'tiny'].map(function (size) {
			return createImplicitAsyncScriptTag('/js/' + size + '/' + r() + '.js');
		});

		var load_promises = tags.map(function (tag) {
			return new Promise(function (resolve, reject) {
				tag.onload = resolve;
				tag.onerror = reject;
			});
		});

		writeLog('Asynchronously injecting big, medium, and small...');
		loading.innerText = 'Loading...';

		// Append them in order, largest to smallest
		tags.forEach(function (tag) {
			document.body.appendChild(tag);
		});

		Promise.all(load_promises)
			.then(function () {
				enableButtons();
				loading.innerText = '';
				writeLog('Done fetching and executing scripts!');
			})
			.catch(function (err) {
				enableButtons();
				loading.innerText = '';
				writeLog('Something went wrong... ' + err.toString());
			});
	}

	sync.addEventListener('click', function (e) {
		grabSyncScripts();
	});

	async.addEventListener('click', function (e) {
		grabAyncScripts();
	});
});
