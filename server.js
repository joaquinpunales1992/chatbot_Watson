var express = require('express');
var cfenv = require('cfenv');
var callbacks = [];
var ConversationV1 = require('watson-developer-cloud/conversation/v1');
//var TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');

var conversation = new ConversationV1({
										  username: '7b5357ef-869f-42eb-8cd4-e965f27d5c67', 
										  password: 'DJUOdf2he1b1',
										  path: { workspace_id: 'def063cb-8588-4fdf-980e-561913dbd697' }, 
										  version_date: '2017-06-20'
										});

var text_to_speech = new TextToSpeechV1 ({
                                          username: 'e846beae-c826-4d6c-83e6-19573de86de2',
                                          password: '4A8II1Ucw3CE'
                                        });

var  vContextoWatson = '';

function appendMessage(message){
  var resp = {messages: [message]};
  while (callbacks.length > 0) {
    callbacks.shift()(resp);
  }
}

function procesarRespuesta(err, response){
		var vRespuestaWatson;
		if (response.output.text.length != 0) {																																		
												vRespuestaWatson = response.output.text[0];
                                                console.log(vRespuestaWatson)
                                                vContextoWatson  = response.context;
												var respuesta = {
																nickname : 'Tornillito',
																text: vRespuestaWatson
																}
                                                
												appendMessage(respuesta);	
                                               												                                                
											  }																											                                                                      										
	}



var app = express();


app.use(express.bodyParser());


app.get('/', function(req, res){
    res.sendfile('index.html');
});

app.post('/send', function(req, res){
    
  var message = {
    nickname: req.param('nickname', 'Anonymous'),
    text: req.param('text', '')
  };
    
  appendMessage(message)
if (vContextoWatson == '')  {
                            
                            conversation.message(message.text, procesarRespuesta)
                            }


else{
                            
                            conversation.message({input: {text: message.text}, context:vContextoWatson}, procesarRespuesta)
    
    }
                                
 
  
  
  res.json({status: 'ok'});
});



app.get('/recv', function(req, res){
  callbacks.push(function(message){
    res.json(message);
  });
});


var appEnv = cfenv.getAppEnv();

app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

//app.listen(3000)
