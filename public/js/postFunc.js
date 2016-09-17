

postRequest = function() 
{

  
    var upstream_url =  document.getElementById("upstream_url").value;     
   
    
    var divCounts = getdivValue();

    console.log(divCounts);
    var arrLevels = [];
    

    
    for(var i = 0 ; i < divCounts; i ++)
    {   var  objLevels = {}  
         var count = 1;  
                var arrRoles = [];
        var attValue = document.getElementById("btnUpperDiv_"+i).getAttribute("data-value")
          var path =   document.getElementById("pathId_"+i).value;
          console.log(path);
          

          for(j = 0 ; j< attValue; j++){
            var objRole = {};
            var methods = [];
            var methodsCount = 0;
              var roles =   document.getElementById("roles_"+i+count+j).value;
             // var roles =   document.getElementById("roles_"+i+count+j).value;
              var rateLimit =   document.getElementById("rateLimit_"+i+count+0).value;
              console.log(roles);
              console.log(rateLimit);
              objRole.role = roles;
            
                for(k = 0; k <4; k++)
                {   
                    if(document.getElementById("checkbox_"+i+count+j+k).checked){

                        console.log("ok");
                       methods[methodsCount] = document.getElementById("checkbox_"+i+count+j+k).value;
                     methodsCount++
                    }else{
                      methods[0] = 'get';
                    }
                   
                    
                }
                console.log(methods);
                objRole.methods = methods;         
                arrRoles.push(objRole); 
                objLevels.rate_limit = rateLimit;
                objLevels.roles = arrRoles;
                objLevels.path = path;
          }
         arrLevels.push(objLevels);
          //count++;
    }
   
           var obj =    {
                "upstream_url":upstream_url,
                
                "levels":arrLevels,
                
                "jwt":"true"
            };
          

 console.log(JSON.stringify(obj));





            $.ajax({
        url: "http://localhost:3000/rad/apigateway",
        type: "POST",
        data:obj,
        dataType: "json"
        
    });
        $.ajax({
        url: "http://localhost:3000/download",
        type: "GET",
        success: function() {
        window.location = 'http://localhost:3000/download';
    }
    });
   
 


           console.log(JSON.stringify(obj));

 }




    