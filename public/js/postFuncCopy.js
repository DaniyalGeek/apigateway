postFuncCopy.js


postRequest = function() 
{
    var upstream_url =  document.getElementById("upstream_url").value;     
    var rate_limit=document.getElementById('rate_limit').value; 

           var obj =    {
                "upstream_url":upstream_url,
                
                "levels":[
                          
                        ],
                
                "jwt":"true"
            };
            obj.rate_limit = rate_limit;
            var arrPath =[];
            for(var i=0; i<getattValue();i++){
            arrPath[i]= document.getElementById('pathId_'+i).value;

            }
            obj.paths = arrPath;
            
            for(var j = 0; j < getattValueRole(); j++)
            {
                var methods = [];
                var arrRole = {};
                var count = 0;
                for(k = 0; k <4; k++)
                {   
                    if(document.getElementById("checkbox_"+j+k).checked){

                        console.log("ok");
                       methods[count] = document.getElementById("checkbox_"+j+k).value;
                       count++;
                    }
                    arrRole.methods=methods;
                    arrRole.role = document.getElementById("roles_"+j).value;
                    obj.levels[j] = arrRole;

                }

                   
                }
                
            $.ajax({
        url: "http://localhost:3001/rad/apigateway",
        type: "POST",
        data:obj,
        dataType: "json"
        
    });
        $.ajax({
        url: "http://localhost:3001/download",
        type: "GET",
        success: function() {
        window.location = 'http://localhost:3001/download';
    }
    });
   
 


            console.log(JSON.stringify(obj));
 }




    