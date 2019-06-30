const express = require('express');
const bodyparser = require('body-parser');
const Tracer = require('./trace.js');
const app = express();

// port = 3000
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.get('/', (req, res) => res.send('Hello World!'));
app.post('/api/amazon', async (req, res) => {
	req_params = req.body
	console.log(req_params)
	if(!(req_params.url)){
		res.status(500);
		res.set('Content-Type', 'application/json');
		res.send({
			status_code: 500,
			url: req_params.url,
			error: 'Failed to process request, due to required url parameters missing',
		});  
		return  
	}
	console.log("*** Url parameters are fine ***")
	max_retry = 2;
	let result;
	for (i = 0; i < max_retry; i++) { 
		console.log(`=== REQUESTING ${i} ===`);
		result = await Tracer.trace(req_params, i);
		if(!result.error){
			break;
		}
	}
	if(result.error){
		res.status(500);
		res.set('Content-Type', 'application/json');
		res.send(result);
	}
	else if(!result){
		res.status(500);
		res.set('Content-Type', 'application/json');
		res.send({
			status_code: 500,
			url: req_params.url,
			error: 'Failed to process request',
		});    
	}
	else{
		res.status(200);
		res.set('Content-Type', 'application/json');
		res.send(result);
	}
});
app.listen(process.env.port, '0.0.0.0', () => {
	console.log('amazon_api listening on port ' + process.env.port);
});
