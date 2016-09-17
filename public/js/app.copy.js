var attValue     = 1; 
function addAttributePath()
    {
          var container = document.getElementById("container");
          
            var lengthInput  = document.createElement("input");
            lengthInput.id   = "pathId_"+attValue;
            lengthInput.type = "text";
            lengthInput.name = "lengthInput"+attValue; 
            lengthInput.placeholder = "/abc";  
          
   
       container.appendChild(lengthInput); 
       document.getElementById("pathId_"+attValue).setAttribute("class","form-control");  
          
       attValue++; 
}      


function removeElementPath()
{
  if (attValue !=1){  
      var d = document.getElementById('container');
      attValue--;

       var a = document.getElementById("pathId_"+attValue);
      d.removeChild(a);
  }
console.log(attValue);
}

//add roles and remove roles
var attValueRole     = 1; 
function addAttributeRoles()
    {
          var container = document.getElementById("containerRole");
          var roles=  document.getElementById("roles");
        var methods=  document.getElementById("methods");
            var roleInput  = document.createElement("input");
            var rateLimit = document.createElement("input");

            roleInput.id   = "roles_"+attValueRole;
            roleInput.type = "text";
            roleInput.name = "roles_"+attValueRole; 
            roleInput.placeholder = "Admin , User";  

            rateLimit.id = "rateLimit_"+attValue;

          var spanGet = document.createElement("span");
          var spanPost = document.createElement("span");
          var spanPut = document.createElement("span");
          var spanDelete = document.createElement("span");
          var inputGet = document.createElement("input");
          var inputPost = document.createElement("input");
          var inputPut = document.createElement("input");
          var inputDelete = document.createElement("input");
          var br = document.createElement("br");
          var para = document.createElement("p");

          para.id = "para"+attValueRole;

          inputGet.type="checkbox";
          inputGet.value = "get";
          inputGet.id = "checkbox_"+attValueRole+"0";
          spanGet.innerHTML= "GET";

          inputPost.type = "checkbox";
          inputPost.value = "post";
          inputPost.id = "checkbox_"+attValueRole+"1";
          spanPost.innerHTML= " POST";

          inputPut.type="checkbox";
          inputPut.value = "put";
          inputPut.id = "checkbox_"+attValueRole+"2";
          spanPut.innerHTML= " PUT";

          inputDelete.type="checkbox";
          inputDelete.value = "delete";
          inputDelete.id = "checkbox_"+attValueRole+"3";
          spanDelete.innerHTML= " DELETE";


          spanGet.appendChild(inputGet);
          spanPost.appendChild(inputPost);
          spanPut.appendChild(inputPut);
          spanDelete.appendChild(inputDelete);

          para.appendChild(spanGet);
          para.appendChild(spanPost);
          para.appendChild(spanPut);
          para.appendChild(spanDelete);
          para.appendChild(br);


          roles.appendChild(roleInput); 
      
    
       methods.appendChild(para);
           container.appendChild(roles);
           container.appendChild(methods);

   

         document.getElementById("roles_"+attValueRole).setAttribute("class","form-control");  
     //  document.getElementById("method"+attValueRole).setAttribute("class","form-control");  
          
       attValueRole++; 
}      




function removeElementRoles()
{

  if (attValueRole !=1){


      var contRole = document.getElementById('roles');
      var contmethod= document.getElementById('methods');


      attValueRole--;

       var a = document.getElementById("roles_"+attValueRole);
        var b = document.getElementById("para"+attValueRole);
    

       
      contRole.removeChild(a);
      contmethod.removeChild(b);
      
  }
console.log(attValueRole);
}

function getattValue(){
  return attValue;
}

function getattValueRole(){
  return attValueRole;
}

