var expressController = function () {

	var post = function(req,res){
		var path 		= require('path');
		var fs = require('fs');
		var ctrl = "";


			var arr = [];
           

            		// 	var b = "[";
        				// for (var permissionsCount= 0 ; permissionsCount < req.body.levels[count].methods.length; permissionsCount++){
        				// 	b = b+ "\'"+req.body.levels[count].methods[permissionsCount] +"\'";
        				// }    			
        				// b = b+ "]";
        				// permissionsArr.push(b);

        				for(var i = 0; i <req.body.levels.length; i++)
        				{ 
        					var pathArr = [];

        					for ( var j=0 ;j< req.body.paths.length; j++)
        					{	
        						
        						var c = "[";
        						for ( var k=0 ;k< req.body.levels[i].methods.length; k++)
        						{
        							c +=  "\'"+req.body.levels[i].methods[k]+"\'";

        							if( k < req.body.levels[i].methods.length-1){
        								c += ",";
        							}


        						}
        						c += "]";

        						var b = "{ resources: \'"+req.body.paths[j]+"\', permissions: "+c+" }";
        						pathArr.push(b);
        					}

        					var a = "{	roles: \'"+req.body.levels[i].role+"\', \n \
						            allows: [\n \
						               "+pathArr+"\n \
						            ]\n \
						            }";
						   arr.push(a);

        				}

        				var routeArr =[];
        				var d = "";
            		for(var count =0 ;count < req.body.paths.length; count++)
            		{
            				 d +="	app.all( \'"+req.body.paths[count]+"\', [ Throttle.limit, acl.middleware( 1, get_user_id ) ],\n \
											   function( req, res ) {\n \
											         apiProxy.web(req, res, {target: serverOne});\n \
											        });\n \
											  app.all(\'"+req.body.paths[count]+"/*\', [ Throttle.limit, acl.middleware( 1, get_user_id ) ],\n \
											    function( req, res ) {\n \
											           apiProxy.web(req, res, {target: serverOne});\n \
											        });";
							
            		}
					
						
				var authenticateMid = "var User       = require(\'../models/user\'); \n \
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
									            var token = req.body.token || req.query.token || req.headers[\'x-access-token\'];\n \
									            var secret = req.body.secretKey || req.query.secretKey || req.headers[\'x-secret-key\'];\n \
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
			  	
			  var throttleModel = "var mongoose = require(\'mongoose\'), \n \
								    config = require(\'../config\'),\n \
								    Schema = mongoose.Schema;\n \
								var RateBuckets = new Schema({  \n \
								    createdAt: { type: Date, required: true, timestamps: true, expires: \'180000\' },\n \
								     ip: { type: String, required: true},\n \
								     hits: { type: Number, default: 1, required: true, max: config.rateLimits.maxHits, min: 0 }\n \
								});\n \
								module.exports = mongoose.model(\'RateBuckets\', RateBuckets); ";


			var userModel = "var mongoose = require(\'mongoose\'), \n \
							 AutoIncrement = require(\'mongoose-sequence\'), \n \
							    config = require(\'../config\'),\n \
							    Schema = mongoose.Schema;\n \
							var User = new Schema({  \n \
							   //  id:{type:Number,primaryKey:true},\n \
							    username: String, \n \
							    password: String, \n \
							    secret : String\n \
							});\n \
							module.exports = mongoose.model(\'User\', User); \n \
							User.plugin(AutoIncrement, {inc_field: \'id\'});";

			var throttleSvc = " // Module dependencies \n \
						var config = require('../config'), \n \
						    mongoose = require('mongoose');\n \
						// Load model\n \
						var RateBuckets_schema = require('../models/throttle'),  \n \
						    RateBuckets = mongoose.model('RateBuckets', RateBuckets_schema);\n \
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
						                    response.set(\'X-Rate-Limit-Limit\', config.rateLimits.maxHits);\n \
						                    // the number of requests left for the time window\n \
						                    response.set(\'X-Rate-Limit-Remaining\', config.rateLimits.maxHits - 1);\n \
						                    // the remaining window before the rate limit resets in miliseconds\n \
						                    response.set(\'X-Rate-Limit-Reset\', timeUntilReset);\n \
						                    // Return bucket so other routes can use it\n \
						                    request.rateBucket = rateBucket;\n \
						                    return next();\n \
						                });\n \
						            }          \n \
						            else {         \n \
						                var timeUntilReset = config.rateLimits.ttl - (new Date().getTime()- rateBucket.createdAt.getTime());\n \
						                var remaining =  Math.max(0, (config.rateLimits.maxHits - rateBucket.hits));\n \
						                console.log(JSON.stringify(rateBucket, null, 4));\n \
						                // the rate limit ceiling for that given request\n \
						                response.set(\'X-Rate-Limit-Limit\', config.rateLimits.maxHits);\n \
						                // the number of requests left for the time window\n \
						                response.set(\'X-Rate-Limit-Remaining\', remaining);\n \
						                // the remaining window before the rate limit resets in miliseconds\n \
						                response.set(\'X-Rate-Limit-Reset\', timeUntilReset);\n \
						                // Return bucket so other routes can use it\n \
						                request.rateBucket = rateBucket;\n \
						                // Reject or allow\n \
						                 if(rateBucket.hits < config.rateLimits.maxHits) {\n \
						                    return next();\n \
						                }else {\n \
						                    response.statusCode = 429;\n \
						                    return response.json({error: \"RateLimit\", message: \'Too Many Requests\'});\n \
						                }\n \
						            }\n \
						        });\n \
						};";

						var config = "module.exports = {  \n \
										    rateLimits: {\n \
										        ttl: 180000, // 4 mins\n \
										        maxHits: "+req.body.rate_limit+" // Max Hits    \n \
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
											var User       = require(\'./models/user\'); // get our mongoose model\n \
											var throttle   = require(\'./models/throttle\'); // get our mongoose model\n \
											var Throttle   = require(\'./services/throttle\');\n \
											var mongodb = require( \'mongodb\' );\n \
											var passport = require( \'passport\' );\n \
											var  node_acl = require( \'acl\' );\n \
											var acl;\n \
											var methodOverride= require(\'method-override\');\n \n \
											app.set(\'superSecret\', config.secret);\n \
											mongoose.connect(\'mongodb://127.0.0.1:27017/api\', function(err) {\n\
											    if (err) {\n\
											    	mongoose.connect(\"mongodb://192.168.99.100:27017/api\");\n\
											    };\n\
											});\n\
											app.use(morgan(\'dev\'));\n \n \
											var apiProxy= httpProxy.createServer({\n \
											  secure: true,\n \
											  changeOrigin: true // Depends on your needs, could be false. \n \
											});\n \
											var serverOne = \'"+req.body.upstream_url+"\';\n \n \
											app.use( methodOverride() );\n \
											app.use(bodyParser.urlencoded({ extended: false }));\n \
											app.use(bodyParser.json());\n \n \
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
											       "+arr+"\n \
											    ]);\n \
											}\n \n \
											function set_routes() {\n \
											app.get(\'/users\', function(req, res) {\n \
											  User.find({}, function(err, users) {\n \
											    res.json(users);\n \
											  });\n \
											});  \n \n \
											//creating user \n \
											app.post(\'/signup\', function(req, res) {\n \
											  User.create(req.body,function(){\n \
											     console.log('User saved successfully');\n \
											     res.json({ success: true , message:\"User created successfully!\" });\n \
											  });\n \
											 });\n \
											// Check your current user and roles\n \
											     // Check your current user and roles \n \
											    app.get(\'/status\', function( request, response ) {\n \
											        acl.userRoles( request.headers[\'x-access-id\'].toString()  || false, function( error, roles ){\n \
											          response.json( {\'User\':  request.user ,\"Roles\":  roles  });\n \
											        });\n \
											    });       // Only for users and higher\n \
											 // Setting a new role\n \
											    app.get( \'/allow/:user/:role\', function( request, response, next ) {\n \
											        console.log(request.params);\n \
											        acl.addUserRoles( request.params.user, request.params.role );\n \
											       response.send( request.params.user + \' is a \' + request.params.role );\n \
											    });\n \
											    // Unsetting a role\n \
											    app.get( \'/disallow/:user/:role\', function( request, response, next ) {\n \
											        acl.removeUserRoles( request.params.user, request.params.role );\n \
											        response.send( request.params.user + \' is not a \' + request.params.role + \' anymore.\' );\n \
											    });\n \
											}\n \
											app.post(\'/authenticate\', require(\'./middleware/authenticate.js\'));\n \
											// TODO: route middleware to verify a token\n \
											 app.use(require(\'./middleware/jwtmiddleware.js\'));\n \
											 "+d+"\n \
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
											app.listen(3000);  ";

				

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
	               try {
					    // Query the entry
					    stats = fs.lstatSync(path.join(__dirname,'../api-gateway.zip'));
					
					    // Is it a directory?
					    if (stats.isDirectory()) {
					     	      fs.unlink('./api-gateway.zip');
					    }
					}
					catch (e) {
					   
					}
					var Zip = require('node-zip');
					var zip = Zip();
					var gatewayFolder = zip.folder('api-gateway');
					
				
					
					var modelFolder = gatewayFolder.folder('models');
					modelFolder.file('throttle.js', throttleModel);
					modelFolder.file('user.js', userModel);
					
					var routerFolder = gatewayFolder.folder('services');
					routerFolder.file('throttle.js', throttleSvc);

					var waterlineFolder = gatewayFolder.folder('middleware');
					waterlineFolder.file('authenticate.js', authenticateMid);
					waterlineFolder.file('jwtmiddleware.js', jwtmiddlewareMid);

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