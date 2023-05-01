var DB = [['p','testuser']];
var LB = [];
var gameCount = 1;
var key_chose_bool = false;
var shooting_key_chose;
var timer
var key;
var logged = false
function setupFunctions()
{
   hideDiv()
   $('#welcomeBtn').addClass('active')
   $('#welcome').show();
   login_layout = document.getElementById("login");
   register_layout = document.getElementById("register");
   // EVENT LISTENERS FOR BUTTONS **********************
   const outside = document.getElementById('outside');
   outside.addEventListener('click', (event) => event.stopPropagation());
   $('#closeAbout').bind("click", closeModal, false);
   $('#modal').bind("click", closeModal, false)
   $('#aboutBtn').bind("click", openModal, false)
   $("#key").bind('keydown', (e)=>{
      const key = e.key
      $("#key input").val(key)
   })
   $('#welcomeBtn').bind("click",(e)=>{
      hideDiv()
      $('#welcomeBtn').addClass('active')
      $('#welcome').show();
   })
   $('#signupBtn').bind("click",(e)=>{
      hideDiv()
      $('#signupBtn').addClass('active')
      $('#signup').show();
   })
   $('#loginBtn').bind("click",(e)=>{
      hideDiv()
      $('#loginBtn').addClass('active')
      $('#login').show();
   })
   $('#configBtn').bind("click",(e)=>{
      if(logged){
         hideDiv()
         $('#configBtn').addClass('active')
         $('#config').show();
      } else{
         alert("Not logged in yet")
      }
   })
   $('#playBtn').bind("click",(e)=>{
      if (logged){
         hideDiv()

         $('#playBtn').addClass('active')
         $('#canvas').show();
      } else{
         alert("Not logged in yet")
      }
   })
   document.getElementById( "startButton" ).addEventListener( 
      "click", startGame, false );
   
}

function openModal(){
   $('#aboutBtn').addClass('active')
   const modal = document.getElementById("modal")
   modal.showModal()
}

function closeModal(){
   const modal = document.getElementById("modal")
   $('#aboutBtn').removeClass('active')
   modal.close()
}

function hideDiv()
{
   
   $('#welcomeBtn').removeClass('active')
   $('#signupBtn').removeClass('active')
   $('#loginBtn').removeClass('active')
   $('#configBtn').removeClass('active')
   $('#playBtn').removeClass('active')
   $('#aboutBtn').removeClass('active')

   $("#canvas").hide()
   $("#config").hide()
   $("#welcome").hide()
   $("#signup").hide()
   $('#login').hide()
   if(bgMusic != null){
      bgMusic.pause();
   }
}


$(document).ready(function() {
    // ******** Registeration
   $("#registration-form").submit(function(e) {
      e.preventDefault();
      e.stopPropagation();
      var username = $("#username").val();
      var password = $("#password").val();
      var name = $("#name").val();
      var last_name = $("#last_name").val();
      var email = $("#email").val();
      var date_of_birth = $("#date_of_birth").val();
      var password = $("#password").val();
      var confirmPassword = $("#password_validation").val();
      var psre = /^(?=.*\d)(?=.*[a-z]).{8,}$/;
      var nre = /\d/;
      if (!psre.test(password)){
         alert("Password not strong enough, you need at least 8 characters at least one number and one letter")
      }
      if (nre.test(name) || nre.test(last_name)){
         alert("Name and last name can't have digits in them...")
      }

      if(date_of_birth == null){
         alert("Birthdate cannot be empty")
      }


      if (password !== confirmPassword) {
         alert("Passwords do not match. Please try again.");
         return false;
      }
      const data = [username,password] 
      DB.push(data);
      alert("Congratz! you're registered, lets log in so you can play!");
      hideDiv()
      $('#loginBtn').addClass('active')
      $('#login').show();
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
            LB = []
            gameCount = 1;
            alert("Logged-in successfully");
            logged = true
            hideDiv()
            $('#configBtn').addClass('active')
            $('#config').show();
            return true;
         }
    }
    alert("your credentials don't match, please try again");
    logged = false
    return false;
 });

 //***************** CONFIGURATION */
 
   $("#configuration-form").submit(function(e) {
      e.preventDefault();
      timer = $("#time").val();
      key = $('#key').val();
      if( timeLeft< 120 || key === null)
      {
         alert("minimum time in seconds: 120 OR key hasn't been chosen");
         return false;
      }
      hideDiv()
      $('#playBtn').addClass('active')
      $('#canvas').show();
      return true;

   
});
});
window.addEventListener("load", setupFunctions, false);