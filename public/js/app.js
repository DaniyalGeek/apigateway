var divId   = 1; 
function addAttributePath()
    {
          var container = document.getElementById("container");
           var divOuter  = document.createElement("div");
           var pathLabel  = document.createElement("label");
           
            pathLabel.innerHTML = "RESOURCE"
           
            divOuter.id = "divOuter_"+divId;
            divOuter.setAttribute("class","rcorners2");

          


            var lengthInput = document.createElement("input");
            lengthInput.id   = "pathId_"+divId;
            lengthInput.type = "text";
            lengthInput.name = "lengthInput"+divId; 
            lengthInput.placeholder = "/abc";  
          divOuter.appendChild(pathLabel);
          divOuter.appendChild(lengthInput);
          attValueRole = 1;
          divOuter.appendChild(addContainerRole(divId,attValueRole));
          container.appendChild(document.createElement("br"));
          container.appendChild(divOuter); 

       document.getElementById("divOuter_"+divId).setAttribute("style"," background-color: white");  
       
       document.getElementById("pathId_"+divId).setAttribute("class","form-control");  
          
       divId++; 
}      


function removeElementPath()
{
	if (divId !=1){	
			var d = document.getElementById('container');
			divId--;

			 var a = document.getElementById("divOuter_"+divId);
			d.removeChild(a);
	}
console.log(divId);
}

function addContainerRole(outerId, attValueRole){
 
       var containerRole = document.createElement("div");
       var btnUpperDiv = document.createElement("div");
          var divRoles=  document.createElement("div");
          var divMethods=  document.createElement("div");
          var divRatelimit=  document.createElement("div");


          btnUpperDiv.id = "btnUpperDiv_"+outerId;
          btnUpperDiv.setAttribute('data-value',"1");

          containerRole.id = "containerRole_"+outerId;
          
          divRoles.id = "divRolesId_"+outerId+attValueRole;
          divMethods.id = "divMethodsId_"+outerId+attValueRole;
          divRatelimit.id = "divRateLimitId_"+outerId+attValueRole;

          divRoles.setAttribute("class","form-group col-xs-6");
          divMethods.setAttribute("class","form-group col-xs-6");
        //  divRatelimit.setAttribute("class","form-group col-xs-4");

            var roleInput  = document.createElement("input");
            var rateLimit = document.createElement("input");
            var plusBtn  = document.createElement("input");
            var minusBtn = document.createElement("input");

             var roleLabel  = document.createElement("label");
             var methodLabel  = document.createElement("label");
             var rateLimitLabel  = document.createElement("label");

             roleLabel.innerHTML = "Role";
             methodLabel.innerHTML = "Access Methods";
             rateLimitLabel.innerHTML = "Rate Limit"

            plusBtn.id = "plusBtnId_"+outerId+attValueRole;
            plusBtn.type = "button";
            plusBtn.value = "+";
            plusBtn.setAttribute("class","btn btn-success")
            plusBtn.setAttribute("onclick", "RoleMakerFunc(this);");

            minusBtn.id = "minusBtnId_"+outerId+attValueRole;
            minusBtn.type = "button";
            minusBtn.value = "-";
            minusBtn.setAttribute("class","btn btn-danger")
            minusBtn.setAttribute("onclick", "removeRoleFunc(this);");


            roleInput.id   = "roles_"+outerId+attValueRole+"0";
            roleInput.type = "text";
            roleInput.name = "roles_"+outerId+attValueRole+"0"; 
            roleInput.placeholder = "Admin , User";  
            roleInput.setAttribute("class","form-control");

            rateLimit.id = "rateLimit_"+outerId+attValueRole+"0";
            rateLimit.placeholder = "200"
            rateLimit.type="number";
            rateLimit.setAttribute("class","form-control");

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

          para.id = "para"+outerId+attValueRole;

          inputGet.type="checkbox";
          inputGet.value = "get";
          inputGet.id = "checkbox_"+outerId+attValueRole+"00";
          spanGet.innerHTML= "GET";

          inputPost.type = "checkbox";
          inputPost.value = "put";
          inputPost.id = "checkbox_"+outerId+attValueRole+"01";
          spanPost.innerHTML= " PUT";

          inputPut.type="checkbox";
          inputPut.value = "post";
          inputPut.id = "checkbox_"+outerId+attValueRole+"02";
          spanPut.innerHTML= "POST";

          inputDelete.type="checkbox";
          inputDelete.value = "delete";
          inputDelete.id = "checkbox_"+outerId+attValueRole+"03";
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
            
            divRoles.appendChild(roleLabel);
            divRoles.appendChild(roleInput);
            divMethods.appendChild(methodLabel);
            divMethods.appendChild(para);
            divRatelimit.appendChild(rateLimitLabel);
            divRatelimit.appendChild(rateLimit);
            btnUpperDiv.appendChild(divRoles);
            btnUpperDiv.appendChild(divMethods);
            btnUpperDiv.appendChild(divRatelimit);

            
            
            containerRole.appendChild(btnUpperDiv);
            containerRole.appendChild(document.createElement("br"));
            containerRole.appendChild(plusBtn);
            containerRole.appendChild(minusBtn);

            attValueRole++;
          
         
         
          return containerRole;
}

function RoleMakerFunc(element){
          console.log(element.id);
            var callerId = element.id

            var callerNumber = callerId.split("_");
          
           var getdivContainerId = $(element).closest("div").attr("id");

           var divContainerId =  getdivContainerId.split("_");
           console.log(divContainerId);
           var outerDiv = document.getElementById("btnUpperDiv_"+divContainerId[1]);
           console.log(outerDiv);
         var attValue = document.getElementById("btnUpperDiv_"+divContainerId[1]).getAttribute("data-value");
      
        var roles=  document.getElementById("divRolesId_"+callerNumber[1]);
        var methods=  document.getElementById("divMethodsId_"+callerNumber[1]);
        var rate=  document.getElementById("divRateLimitId_"+callerNumber[1]);

          var roleInput  = document.createElement("input");
            var rateLimit = document.createElement("input");

            roleInput.id   = "roles_"+callerNumber[1]+attValue;
            roleInput.type = "text";
          //  roleInput.name = "roles_"; 
            roleInput.placeholder = "Admin , User";  
            roleInput.setAttribute("class","form-control")

            rateLimit.id = "rateLimit_"+callerNumber[1]+attValue;
            rateLimit.type = "hidden";
            rateLimit.placeholder = "2000";
            rateLimit.setAttribute("class","form-control");

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

          para.id = "para"+callerNumber[1]+attValue;

          inputGet.type="checkbox";
          inputGet.value = "get";
          inputGet.id = "checkbox_"+callerNumber[1]+attValue+"0";
          spanGet.innerHTML= "GET";

          inputPost.type = "checkbox";
          inputPost.value = "post";
          inputPost.id = "checkbox_"+callerNumber[1]+attValue+"1";
          spanPost.innerHTML= " POST";

          inputPut.type="checkbox";
          inputPut.value = "put";
          inputPut.id = "checkbox_"+callerNumber[1]+attValue+"2";
          spanPut.innerHTML= " PUT";

          inputDelete.type="checkbox";
          inputDelete.value = "delete";
          inputDelete.id = "checkbox_"+callerNumber[1]+attValue+"3";
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
            rate.appendChild(rateLimit);
            methods.appendChild(para);

            outerDiv.appendChild(roles);
            outerDiv.appendChild(methods);
            outerDiv.appendChild(rate);

        attValue++;
         document.getElementById("btnUpperDiv_"+divContainerId[1]).setAttribute("data-value",attValue);
       
}
function removeRoleFunc(element)
{
           console.log(element.id);
           var callerId = element.id
           console.log(callerId);
          var callerNumber = callerId.split("_");         
           var getdivContainerId = $(element).closest("div").attr("id");
          
           var divContainerId =  getdivContainerId.split("_");
           console.log(divContainerId);
           var outerDiv = document.getElementById("btnUpperDiv_"+divContainerId[1]);
           console.log(outerDiv);
          var attValue = document.getElementById("btnUpperDiv_"+divContainerId[1]).getAttribute("data-value");
          if(attValue>1)
          {
          attValue--;
           console.log("roles_"+callerNumber[1]+attValue);
            var rolesContainer=  document.getElementById("divRolesId_"+callerNumber[1]);
        var methodsContainer=  document.getElementById("divMethodsId_"+callerNumber[1]);
        var rateContainer=  document.getElementById("divRateLimitId_"+callerNumber[1]);

        var roles=  document.getElementById("roles_"+callerNumber[1]+attValue);
        var methods=  document.getElementById("para"+callerNumber[1]+attValue);
        var rate=  document.getElementById("rateLimit_"+callerNumber[1]+attValue);

        rolesContainer.removeChild(roles);
        methodsContainer.removeChild(methods);
        rateContainer.removeChild(rate);
      }
  
    console.log(attValue);
   document.getElementById("btnUpperDiv_"+divContainerId[1]).setAttribute("data-value",attValue);
}

function getdivValue(){
  return divId;
}
