const express = require('express');
const morgan = require('morgan');
const compression = require('compression');

const createEventEmitterCode = (event_type) => {
	return `(function() {
var event;
if (window.CustomEvent && typeof window.CustomEvent === 'function') {
	event = new CustomEvent('${event_type}', { detail: null });
} else {
	event = document.createEvent('CustomEvent');
	event.initCustomEvent('${event_type}', true, true);
}

document.dispatchEvent(event);
})();`;
};


const app = express();
app.use(morgan('combined'));
app.use(compression());

app.get('/js/big.js', (req, res) => {
	res.type('js');
	setTimeout(() => {
		res.send('Hello');
	}, 100);
});

app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Listening', PORT));
