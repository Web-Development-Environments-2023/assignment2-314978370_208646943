var DB = [['p','testuser']];
var key_chose_bool = false;
var shooting_key_chose;
var amountOfTime;
function setupFunctions()
{
   $("#canvas").hide()
   $("#welcome").hide()
   login_layout = document.getElementById("login");
   register_layout = document.getElementById("register");
   // EVENT LISTENERS FOR BUTTONS **********************
   document.getElementById( "startButton" ).addEventListener( 
      "click", startGame, false );
   document.getElementById( "loginbtn1" ).addEventListener( 
      "click", function()
      {
         switch_div(login_layout);
      });
      document.getElementById( "loginbtn2" ).addEventListener( 
        "click", function()
        {
           switch_div(login_layout);
        });
   document.getElementById( "registerbtn1" ).addEventListener( 
      "click", function() 
      {
         switch_div(register_layout);
      });
      document.getElementById( "registerbtn2" ).addEventListener( 
        "click", function() 
        {
           switch_div(register_layout);
        });
}

function switch_div(chosen_div)
{
   
   // Select all div elements on the page
   const divs = document.querySelectorAll('div');

   // Iterate over each div element
   for (let i = 0; i < divs.length; i++) {
   const div = divs[i];
   if(chosen_div === div)
         div.style.display ="block";
      else
      div.style.display = "none";
   
   }

}


$(document).ready(function() {
    // ******** Registeration
   $("#registration-form").submit(function(e) {
      e.preventDefault();
      var username = $("#username").val();
      var password = $("#password").val();
      var password_validation = $("#password_validation").val();
      var name = $("#name").val();
      var last_name = $("#last_name").val();
      var email = $("#email").val();
      var date_of_birth = $("#date_of_birth").val();
      var password = $("#password").val();
      var confirmPassword = $("#password_validation").val();
      
      if (password !== confirmPassword) {
         alert("Passwords do not match. Please try again.");
         return false;
      }
      const data = [username,password] 
      DB.push(data);
      alert("Congratz! you're registered, lets log in so you can play!");
      login_layout = document.getElementById("login");
      switch_div(login_layout);
      return true;
    
 });
//************ LOGIN */
   $("#login-form").submit(function(e) {
      e.preventDefault();
      var user_log = $("#username-login").val();
      var password_log = $("#password-login").val();
      for(let i =0; i< DB.length; i++){
         if(user_log === DB[i][0] && password_log === DB[i][1])
         { 
            alert("Logged-in successfully");
            game_layout = document.getElementById("game");
            config_layout = document.getElementById("configuration");
            switch_div(config_layout);
            return true;
         }
    }
    alert("your credentials don't match, please try again");
    return false;
 });

 //***************** CONFIGURATION */
 
   $("#configuration-form").submit(function(e) {
      e.preventDefault();
      var time_chose = $("#time").val();
      if( time_chose< 120 || chose_key_bool === false)
      {
         alert("minimum time in seconds: 120 OR key hasn't been chosen");
         return false;
      }
      amountOfTime  = time_chose;
      switch_div(game_layout);
      return true;

   
});
});
window.addEventListener("load", setupFunctions, false);