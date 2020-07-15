const express = require('express');
const morgan = require('morgan');
const compression = require('compression');

const app = express();
app.use(morgan('combined'));
app.use(compression());

// Make sure the sizes go from smallest to largest
const SIZES = ['tiny', 'small', 'medium', 'big', 'huge'];
app.get('/js/:size/:id.js', (req, res) => {
	const { size, id } = req.params;
	if (!SIZES.includes(size) || !id) {
		return res.status(404);
	}

	// Small is 0ms delay, up to 800ms delay for Huge
	let delay = SIZES.indexOf(size) * 200;

	res.type('js');
	setTimeout(() => {
		// `window.writeLog` is exposed in 'main.js'
		res.send(`window.writeLog("${size}.js finished executing")`);
	}, delay);
});

app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Listening', PORT));
