/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};




function onError(errorMessage){
    console.log(errorMessage);

}


function getRegister() {
    
      navigator.geolocation.getCurrentPosition(register, onError);
  
}


function register(position){

    var http = new XMLHttpRequest();
    var name = document.getElementById('uname').value;
    var age= document.getElementById('age').value;
    var email = document.getElementById("emai2").value;
    var password = document.getElementById("psw2").value;
    var shoked = document.getElementById("smoke").checked;
    var hobbies = document.getElementById("hobbies").value;
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;

    //var lat =  53.346;
     //var lon = -6.2588;
 
     const url = "http://localhost:8080/registration"; 
     http.open("POST", url,true);
     http.setRequestHeader("Content-type", "application/json");
     data = JSON.stringify(
        {
        name: name,
        age: age,
        email: email,
        password: password,
        smoke: shoked,
        hobbies:hobbies,
        latitude : lat,
        longitude: lon

         }
     )
      http.send(data);
      http.onreadystatechange = (e) => {
       var response = http.responseText;
       console.log(response);
  
 
       location = "#login";

    }

    
}



function getLogin() {
    
    navigator.geolocation.getCurrentPosition(login, onError);

}

function login(position){

     var http = new XMLHttpRequest();
     var email = document.getElementById("emai").value;
     var password = document.getElementById("psw").value;
     
     // take the actual lat and log when the user login, to update information on the serve. sent by Get when login
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
   

     //var lat =  53.346;
     //var lon = -6.2588;
    // console.log(lat);
    const url = "http://localhost:8080/login?email="+ email +"&password=" + password +"&latitude=" + lat +"&longitude=" + lon;
    console.log(url);

     http.open("GET", url),true;
     http.send();
     
     http.onreadystatechange = (e) => {
         var response = http.responseText;
         console.log(response);
       
         // when the user is loggin show all user by distance 
       document.getElementById('demo').innerHTML=callbackDistance();
        
        
        location = "#principal";

    }

} 



function callbackDistance(){
    var http = new XMLHttpRequest(); 
  // from fron end we send the max distance to the service, it is km 
    var maxdistance = 10;
   const url = "http://localhost:8080/showbydistance?max="+ maxdistance;
   console.log(url); 
   http.open("GET", url, true);
    http.send();

    http.onreadystatechange = (e) => {
        var response =JSON.parse(http.responseText);
        var users = response;
       // document.getElementById('demo').innerHTML=response;
      // location = "#principal";
      var output = '';
      for(var i=0;i<users.length;i++){
   //     var sw=true;
      output +='<li>' + users[i].name +" "+ users[i].age +" "+   users[i].hobbies +" "+  users[i].smoke  +'</li>';
    
      }

      outwithlh ='<lh>' + "Name" +"-"+ "Age" +"-"+   "Hobbies" +"-"+  "Smoke"  +'</lh>' +output;

      document.getElementById('demo').innerHTML= outwithlh ;

   }
}


function callbackSmoke(){
    var http = new XMLHttpRequest(); 
   const url = "http://localhost:8080/show";
    http.open("GET", url);
    http.send();

    http.onreadystatechange = (e) => {
        var response =JSON.parse(http.responseText);
        var users = response;
       // document.getElementById('demo').innerHTML=response;
      // location = "#principal";
      var output = '';
      for(var i=0;i<users.length;i++){
   //     var sw=true;
      if(users[i].smoke){
        
        output +='<li>' + users[i].name +" "+ users[i].age +" "+   users[i].hobbies +" "+  users[i].smoke  +'</li>';
        }
      }
      
      outwithlh ='<lh>' + "Name" +"-"+ "Age" +"-"+   "Hobbies" +"-"+  "Smoke"  +'</lh>' +output;

  
      document.getElementById('demo').innerHTML=outwithlh;

   }
}


function showbyAge(){
    // this query show all user registred
    var http = new XMLHttpRequest(); 
    const url = "http://localhost:8080/show";
    http.open("GET", url);
    http.send();
 
    http.onreadystatechange = (e) => {
        var response =JSON.parse(http.responseText);
        var users = response;
       // document.getElementById('demo').innerHTML=response;
      // location = "#principal";
      var ulog = showuserlog();
    

      var output = '';
      for(var i=0;i<users.length;i++){

       var email = ulog["email"];
      console.log(email);
   //     here compare with all users except the own user
      if( email!=users[i].email ){
          var age= ulog.age ;
        var difpos = age - users[i].age;
        // conver in positive the diference in case the rest is negative        
        difpos = Math.abs(difpos);
        // here as about difente age, only show the user from 0 to 10 years of difference

        if(difpos>=0 && difpos<=10){
          
        output +='<li>' + users[i].name +" "+ users[i].age +" "+   users[i].hobbies +" "+  users[i].smoke  +'</li>';
            }   
        }
      }
      
      outwithlh ='<lh>' + "Name" +"-"+ "Age" +"-"+   "Hobbies" +"-"+  "Smoke"  +'</lh>' +output;

  
      document.getElementById('demo').innerHTML=outwithlh;

   }
}


function showuserlog(){
 // this query show the user login. 
 var http = new XMLHttpRequest(); 
 const url = "http://localhost:8080/userlogin";
 http.open("GET", url), true;
 http.send();
 http.onreadystatechange = (e) => {
    var response =JSON.parse(http.responseText);
    
    return response;
}
}

   function logOut(){
    
    document.getElementById('demo').innerHTML=null;

    location = "#login";

   }
    