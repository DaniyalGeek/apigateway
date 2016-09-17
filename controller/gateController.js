var expressController = function () {

	var post = function(req,res){
		var path 		= require('path');
		var fs = require('fs');
		var ctrl = "";
		var maxHits = "";
		var indexVars = "";
		var indexRols = [];
		var routesforAll = "";
 console.log(req.body.levels.length);
			
						var Zip = require('node-zip');
					var zip = Zip();
					var gatewayFolder = zip.folder('api-gateway');
					
					var routerFolder = gatewayFolder.folder('services');
					var middleware = gatewayFolder.folder('middleware');
					var modelFolder = gatewayFolder.folder('models');
					for( var i = 0; i < req.body.levels.length; i++)
						{
							
							for(var j = 0 ;j< req.body.levels[i].roles.length; j++)
							{

								var methodString = "[";
 						 		for (var k = 0; k < req.body.levels[i].roles[j].methods.length; k++) {
									methodString +=  "\'"+req.body.levels[i].roles[j].methods[k]+"\'";

        							if( k < req.body.levels[i].roles[j].methods.length-1){
        								methodString += ",";
        							}


        						}
        						methodString += "]";

								var arr= "{	roles: '"+req.body.levels[i].roles[j].role+"', \n\
 						            allows: [\n\
 						               { resources: \'"+req.body.levels[i].path+"\', permissions: "+methodString+" }\n\
 						            ]\n\
 						            }";	
 						 	
 						 		
        						indexRols.push(arr);
							}
 						

					}

				var authenticateMid = "var User       = require(\'../models/userM\'); \n \
									var jwt        = require(\'jsonwebtoken\');\n \
									module.exports =function(req, res) {\n \
									  // find the user\n \
									  User.findOne({username: req.body.username}, function(err, user) {\n \
									    console.log(user);\n \
									    if (err) throw err;\n \
									    if (!user) {\n \
									      res.json({ success: false, message: \'Authentication failed. User not found.\' });\n \
									    } else if (user) {\n \
									      // check if password matches\n \
									      if (user.password != req.body.password) {\n \
									        res.json({ success: false, message: \'Authentication failed. Wrong password.\' });\n \
									      } else {\n \
									        // if user is found and password is right\n \
									        // create a token\n \
									        var token = jwt.sign(user, user.secret, {\n \
									        //  expiresAt: 600//expires in 1 minutes define seconds here\n \
									        });\n \
									        var decoded = jwt.decode(token);\n \
									        // return the information including token as JSON\n \
									        res.json({\n \
									          success: true,\n \
									          message: \'Enjoy your token!\',\n \
									          token: token        \n \
									        });\n \
									      }  \n \
									    }\n \
									  });\n \
									}";
					var jwtmiddlewareMid = "var jwt        = require(\'jsonwebtoken\'); \n \
									module.exports=  \n \
												function(req, res, next) {\n \
												          //   // check header or url parameters or post parameters for token\n \
									            var token =  req.query.token || req.headers[\'x-access-token\'];\n \
									            var secret =  req.query.secretKey || req.headers[\'x-secret-key\'];\n \
									            // decode token\n \
									            if (token) {\n \
									              // verifies secret and checks exp\n \
									              jwt.verify(token, secret, function(err, decoded) { \n \
									                if (err) {\n \
									                  return res.json({ success: false, message: \'Failed to authenticate token.\' }); \n \
									                } else {\n \
									                  // if everything is good, save to request for use in other routes\n \
									                  req.decoded = decoded;   \n \
									                  next();\n \
									                }\n \
									              });\n \
									            } else {\n \
									              // if there is no token\n \
									              // return an error\n \
									              return res.status(403).send({ \n \
									                  success: false, \n \
									                  message: \'No token provided.\' \n \
									              });\n \
									            }\n \
									          }";
			  		for(var i = 0 ; i <  req.body.levels.length; i++){
			  			var modelNames = req.body.levels[i].path.split("/");

			  			var modelName = modelNames[1];
			  		var models   = "var mongoose = require(\'mongoose\'), \n \
								    config = require(\'../config\'),\n \
								    Schema = mongoose.Schema;\n \
								var RateBuckets = new Schema({  \n \
								    createdAt: { type: Date, required: true, timestamps: true, expires: \'180000\' },\n \
								     ip: { type: String, required: true},\n \
								     hits: { type: Number, default: 1, required: true, max: config.rateLimits.maxHits"+modelName+", min: 0 }\n \
								});\n \
								module.exports = mongoose.model(\'"+modelName+"M\', RateBuckets); ";

								modelFolder.file(modelName+"TM.js", models);

					var services = 	" // Module dependencies \n \
						var config = require('../config'), \n \
						    mongoose = require('mongoose');\n \
						// Load model\n \
						var RateBuckets_schema = require(\'../models/"+modelName+"TM\'),  \n \
						    RateBuckets = mongoose.model(\'"+modelName+"M\', RateBuckets_schema);\n \
						exports.limit = function(request, response, next) {   \n \
						    'use strict';\n \
						    var ip = request.headers['x-forwarded-for'] ||\n \
						        request.connection.remoteAddress ||\n \
						        request.socket.remoteAddress ||\n \
						        request.connection.socket.remoteAddress;\n \
						    RateBuckets.findOneAndUpdate({ip: ip}, { $inc: { hits: 1 } }, { upsert: false })\n \
						        .exec(function(error, rateBucket) {\n \
						         console.log( new Date().getTime() );  \n \
						            if(error) {\n \
						                response.statusCode = 500;\n \
						                return next(error);\n \
						            }\n \
						            if(!rateBucket) {\n \
						                rateBucket = new RateBuckets({\n \
						                    createdAt: new Date(),\n \
						                    ip: ip\n \
						                });\n \
						                rateBucket.save(function(error, rateBucket) {\n \
						                    if (error) {\n \
						                        response.statusCode = 500;\n \
						                        return next(error);\n \
						                    }\n \
						                    if(!rateBucket) {\n \
						                        response.statusCode = 500;\n \
						                        return response.json({error: \"RateLimit\", message: \'Cant create rate limit bucket\'});\n \
						                    }\n \
						                    var timeUntilReset = config.rateLimits.ttl - (new Date().getTime() - rateBucket.createdAt.getTime());\n \
						                    console.log(JSON.stringify(rateBucket, null, 4));\n \
						                    // the rate limit ceiling for that given request\n \
						                    response.set(\'X-Rate-Limit-Limit\', config.rateLimits.maxHits"+modelName+");\n \
						                    // the number of requests left for the time window\n \
						                    response.set(\'X-Rate-Limit-Remaining\', config.rateLimits.maxHits"+modelName+" - 1);\n \
						                    // the remaining window before the rate limit resets in miliseconds\n \
						                    response.set(\'X-Rate-Limit-Reset\', timeUntilReset);\n \
						                    // Return bucket so other routes can use it\n \
						                    request.rateBucket = rateBucket;\n \
						                    return next();\n \
						                });\n \
						            }          \n \
						            else {         \n \
						                var timeUntilReset = config.rateLimits.ttl - (new Date().getTime()- rateBucket.createdAt.getTime());\n \
						                var remaining =  Math.max(0, (config.rateLimits.maxHits"+modelName+" - rateBucket.hits));\n \
						                console.log(JSON.stringify(rateBucket, null, 4));\n \
						                // the rate limit ceiling for that given request\n \
						                response.set(\'X-Rate-Limit-Limit\', config.rateLimits.maxHits"+modelName+");\n \
						                // the number of requests left for the time window\n \
						                response.set(\'X-Rate-Limit-Remaining\', remaining);\n \
						                // the remaining window before the rate limit resets in miliseconds\n \
						                response.set(\'X-Rate-Limit-Reset\', timeUntilReset);\n \
						                // Return bucket so other routes can use it\n \
						                request.rateBucket = rateBucket;\n \
						                // Reject or allow\n \
						                 if(rateBucket.hits < config.rateLimits.maxHits"+modelName+") {\n \
						                    return next();\n \
						                }else {\n \
						                    response.statusCode = 429;\n \
						                    return response.json({error: \"RateLimit\", message: \'Too Many Requests\'});\n \
						                }\n \
						            }\n \
						        });\n \
						};";

					routerFolder.file(modelName+"T.js", services);


					maxHits += "maxHits"+modelName +":"+ req.body.levels[i].rate_limit;
					if (i < req.body.levels.length )
						maxHits += ",";

					indexVars += "var  "+modelName+"M  = require(\'./models/"+modelName+"TM\'); // get our mongoose model\n \
 											var "+modelName+"svc   = require('./services/"+modelName+"T\');";



            		 routesforAll +="	app.all( \'"+req.body.levels[i].path+"\', [ "+modelName+"svc.limit, acl.middleware( 1, get_user_id ) ],\n \
											   function( req, res ) {\n \
											         apiProxy.web(req, res, {target: serverOne});\n \
											        });\n \
											  app.all(\'"+req.body.levels[i].path+"/*\', [ "+modelName+"svc.limit, acl.middleware( 1, get_user_id ) ],\n \
											    function( req, res ) {\n \
											           apiProxy.web(req, res, {target: serverOne});\n \
											        });";
							
            		
 											

			  		}




			var userModel = "var mongoose = require(\'mongoose\'), \n \
							 AutoIncrement = require(\'mongoose-sequence\'), \n \
							    config = require(\'../config\'),\n \
							    Schema = mongoose.Schema;\n \
							var User = new Schema({  \n \
							    id:{type:String,primaryKey:true},\n \
							    username: String, \n \
							    password: String, \n \
							    secret : String\n \
							});\n \
							module.exports = mongoose.model(\'User\', User); \n \
							//User.plugin(AutoIncrement, {inc_field: \'id\'});";

				modelFolder.file("userM.js",userModel);

// 		

						var config = "module.exports = {  \n \
										    rateLimits: {\n \
										        ttl: 180000, // 4 mins\n \
										        "+maxHits+"\n \
										    } \n \
										};";
				

				var frontCtrl = " var express    = require(\'express\'); \n \
											var app        = express();\n \
											var httpProxy  = require(\'http-proxy\');\n \
											var bodyParser = require(\'body-parser\');\n \
											var morgan     = require(\'morgan\');\n \
											var mongoose   = require(\'mongoose\');\n \
											var fs         = require(\'fs\');\n \
											var jwt        = require(\'jsonwebtoken\'); // used to create, sign, and verify tokens\n \
											var config     = require(\'./config\'); // get our config file\n \
											var User       = require(\'./models/userM\'); // get our mongoose model\n \
										   	"+indexVars+"\n\
											var mongodb = require( \'mongodb\' );\n \
											var passport = require( \'passport\' );\n \
											var  node_acl = require( \'acl\' );\n \
											var acl;\n \
											var methodOverride= require(\'method-override\');\n \n \
											app.set(\'superSecret\', config.secret);\n \
											mongoose.connect(process.env.IP || 'mongodb://127.0.0.1/api');\n\
											app.use(morgan(\'dev\'));\n \n \
											var apiProxy= httpProxy.createServer({\n \
											  secure: true,\n \
											  changeOrigin: true // Depends on your needs, could be false. \n \
											});\n \
											var serverOne = \'"+req.body.upstream_url+"\';\n \n \
											app.use( methodOverride() );\n \
											var jsonParser = bodyParser.json({ type: 'application/json'});\n\
											app.use( function( error, request, response, next ) {\n \
											    if( ! error ) {\n \
											        return next();\n \
											    }\n \
											    response.json( error.msg, error.errorCode );\n \
											});\n \
											var mongoBackend = new node_acl.mongodbBackend( mongoose.connection.db  );\n \n \
											 acl = new node_acl( mongoBackend );\n \
											    set_roles();\n \
											    set_routes();\n \
											function set_roles() {\n \
											    // Define roles, resources and permissions\n \
											    acl.allow([\n \
											       "+indexRols+"\n \
											    ]);\n \
											}\n \n \
											function set_routes() {\n \
											app.get(\'/users\',jsonParser, function(req, res) {\n \
											  User.find({}, function(err, users) {\n \
											    res.json(users);\n \
											  });\n \
											});  \n \n \
											//creating user \n \
											app.post(\'/signup\',jsonParser, function(req, res) {\n \
											  User.create(req.body,function(){\n \
											     console.log('User saved successfully');\n \
											     res.json({ success: true , message:\"User created successfully!\" });\n \
											  });\n \
											 });\n \
											// Check your current user and roles\n \
											     // Check your current user and roles \n \
											    app.get(\'/status\',jsonParser, function( request, response ) {\n \
											        acl.userRoles( request.headers[\'x-access-id\'].toString()  || false, function( error, roles ){\n \
											          response.json( {\'User\':  request.user ,\"Roles\":  roles  });\n \
											        });\n \
											    });       // Only for users and higher\n \
											 // Setting a new role\n \
											    app.get( \'/allow/:user/:role\', jsonParser,function( request, response, next ) {\n \
											        console.log(request.params);\n \
											        acl.addUserRoles( request.params.user, request.params.role );\n \
											       response.send( request.params.user + \' is a \' + request.params.role );\n \
											    });\n \
											    // Unsetting a role\n \
											    app.get( \'/disallow/:user/:role\',jsonParser, function( request, response, next ) {\n \
											        acl.removeUserRoles( request.params.user, request.params.role );\n \
											        response.send( request.params.user + \' is not a \' + request.params.role + \' anymore.\' );\n \
											    });\n \
											}\n \
											app.post(\'/authenticate\',jsonParser, require(\'./middleware/authenticate.js\'));\n \
											// TODO: route middleware to verify a token\n \
											 app.use(require(\'./middleware/jwtmiddleware.js\'));\n \
											"+routesforAll+" \n \
											   app.use(acl.middleware.errorHandler('json')); \n \
											// This gets the ID from currently logged in user\n \
											function get_user_id( req, res ) {\n \
											    return req.headers[\'x-access-id\'];\n \
											}\n \
											function logger() {\n \
											    return {\n \
											        debug: function( msg ) {\n \
											            console.log( \'-DEBUG-\', msg );\n \
											        }\n \
											    };\n \
											}\n \
											app.listen(process.env.PORT ||3000,function () { \n\
												console.log('Server Listening on port 3000');\n\
											});";

				

				var pkg = " {\"name\": \"apigateway\",\n \
							  \"version\": \"1.0.0\", \n \
							  \"description\": \"Api Gateway which can authenticate user and throttle requests\",\n \
							  \"main\": \"index.js\",\n \
							  \"dependencies\": {\n \
							   \"express\": \"^4.14.0\",\n \
							   \"body-parser\": \"^1.15.2\",\n \
							   \"http-proxy\": \"^1.14.0\",\n \
							   \"jsonwebtoken\": \"^7.1.9\",\n \
							   \"mongoose\": \"^4.5.10\",\n \
							   \"morgan\": \"^1.7.0\",\n \
							   \"http\": \"^0.0.0\",\n \
							   \"acl\": \"^0.4.9\",\n \
							   \"async\": \"^1.5.0\",\n \
							   \"bluebird\": \"^3.0.2\",\n \
							   \"cookie-parser\": \"^1.4.3\",\n \
							   \"express-session\": \"^1.14.1\",\n \
							   \"lodash\": \"^3.10.1\",\n \
							   \"method-override\": \"^2.3.5\",\n \
							   \"mongodb\": \"^2.1.7\",\n \
							   \"passport\": \"^0.3.2\",\n \
							   \"passport-local\": \"^1.0.0\",\n \
							   \"mongoose-sequence\": \"^3.0.2\",\n \
							   \"redis\": \"^2.2.5\"\n \
							  },\n \
							  \"devDependencies\": {},\n \
							  \"scripts\": {\n \
							  },\n \
							  \"author\": \"Daniyal Ahmed\",\n \
							  \"license\": \"ISC\" \n \
							}	";

							var dockerfile = "FROM node:latest\n \
												MAINTAINER Daniyal Ahmed <daniyal@withease.org>\n \
												RUN mkdir -p /usr/api\n \
												COPY . /usr/api\n \
												WORKDIR /usr/api\n \
												RUN npm install \n \
												ENV PORT 3000\n \
												ENV IP mongodb://192.168.99.100:27017/api\n\
												EXPOSE  $PORT\n \
												CMD [\"node\", \"index\"]";

							var dockercomposr = 
"version: \"2\"\n\
\n\
services:  \n\
  apigateway:  \n\
    restart: on-failure\n\
    build : .\n\
    container_name: apigateway\n\
    ports:\n \
      - \"3000:3000\"\n\
    volumes:\n \
      - \"db-data:/var/lib/mongo\"\n\
  db:\n\
    restart: on-failure\n\
    image: mongo\n\
    ports:\n\
      - \"27017:27017\"\n\
\n\
\n\
volumes:\n\
  db-data:";
	  
				
				
					

					
					middleware.file('authenticate.js', authenticateMid);
					middleware.file('jwtmiddleware.js', jwtmiddlewareMid);

 					gatewayFolder.file('config.js', config);
 					gatewayFolder.file('index.js', frontCtrl);
					gatewayFolder.file('package.json', pkg);
					gatewayFolder.file('Dockerfile', dockerfile);
					gatewayFolder.file('docker-compose.yml', dockercomposr);

					var options = {base64: false, compression:'DEFLATE'};
 					fs.writeFile('api-gateway.zip', zip.generate(options), 
 											'binary', function (error) {
 					console.log('wrote crud.zip', error);
					
		
				});
		
		res.send("Thank you for downloading!");	
	}

	return{
		post:post
	}
}
module.exports = expressController;