$(document).ready(function() {
    // all custom jQuery will go here
    //$("#register").text("<p>hdfgh</p>");
 });


var f = new FontFace('Magic School One', 'url(/font/MagicSchoolOne.ttf)');
var ctx
var chickens = [];
var canvas;
var blasts = [];
var player
var chickenBlasts = [];
var playerImage;
var chickenImage;
var blastImg
var chickenBlastImg
var timeLeft
var timerInterval
var score
var gameover
var initialHeight
var initialWidth
var randomIndex;
var animation;

function setup(){
    document.addEventListener( "unload", null, false );
    canvas = document.getElementById( "theCanvas" );
    ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth*0.75;
    canvas.height = window.innerHeight*0.6;
    initialHeight = canvas.height
    initialWidth = canvas.width
    playerImage = new Image();
    playerImage.src = 'images/egg.png';
    player = {
        x: canvas.width / 2,
        y: canvas.height - 30,
        width: 50,
        height: 50,
        speed: 10
    }; 
    chickenImage = new Image();
    chickenImage.src = 'images/bad_guy.png'; 
    blastImage = new Image();
    blastImage.src = 'images/egg.png';  
    chickenBlastImage = new Image();
    chickenBlastImage.src = 'images/egg.png'; 
    timerInterval;
    score = 0;
    gameover = false;
    chickens = []
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 5; j++) {
            chickens.push({
                x: j * 35 + 10,
                y: i * 35 + 15,
                width: 25,
                height: 25,
                speed: 2
            });
        }
    }
    
    // Redraw elements on window resize
     window.addEventListener('resize', () => {
     canvas.width = window.innerWidth*0.75;
     canvas.height = window.innerHeight*0.6;
     player.x = canvas.width / 2
     player.y = canvas.height - 50
     for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 5; j++) {
            chickens[j+i*5].x = j * 35 + 10;
            chickens[j+i*5].y = i * 35 + 15;
        }
    }
     draw();
   });

}
    // event listeners for user input
    document.addEventListener('keydown', event => {
        if (event.key === 'ArrowLeft') {
            player.x -= player.speed;
        } else if (event.key === 'ArrowRight') {
            player.x += player.speed;
        }  else if (event.key === 'ArrowUp') {
            if (player.y >= canvas.height*0.6){
                player.y -= player.speed;
            }
        } else if (event.key === 'ArrowDown') {
            player.y += player.speed;
        }
         else if (event.key === ' ') {
            blasts.push({
            x: player.x + 12.5,
            y: player.y ,
            width: 20,
            height: 20,
            speed: 10,
            image: blastImage
            });
        } });




function checkCollision(rect1, rect2) {
    if (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    ) {
      return true;
    }
    return false;
  }


  function startTimer() {
    timerInterval = setInterval(() => {
      timeLeft--;
      if (timeLeft === 0) {
        clearInterval(timerInterval); // Stop the timer
        gameover = true; // Set the game over flag
        draw(); // Redraw the canvas to show the game over message
      }
    }, 1000); // Update the timer every 1 second
  }
  
  
  // update game objects
  function update() {

    if(chickens.length == 0){
        gameover = true
        draw()
    }

    // update player's position
    if (player.x < 0) {
      player.x = 0;
    } else if (player.x > canvas.width - player.width) {
      player.x = canvas.width - player.width;
    }

    if (player.y >= canvas.height-50){
        player.y = canvas.height-50
    }
  
    // update chicken positions
    for (let i = 0; i < chickens.length; i++) {
      chickens[i].x += chickens[i].speed;
  
      if (chickens[i].x < 0 || chickens[i].x > canvas.width - chickens[i].width) {
        chickens[i].speed = -chickens[i].speed;
      }
    }

    if (chickenBlasts.length == 0 || chickenBlasts[chickenBlasts.length-1].y >= canvas.height*0.75){
        rand = Math.floor(Math.random() * chickens.length);
        chickenBlasts.push({
            x: chickens[rand].x + chickens[rand].width / 2,
            y: chickens[rand].y + chickens[rand].height,
            width: 20,
            height: 40,
            speed: 2,
            image: chickenBlastImage
        });
    }
  
    // update blast positions and remove blasts that have gone off screen
    for (let i = blasts.length - 1; i >= 0; i--) {
      blasts[i].y -= blasts[i].speed;
  
      if (blasts[i].y < 0) {
        blasts.splice(i, 1);
      }
    }

    // update chicken blasts positions and remove blasts that have gone off screen
    for (let i = chickenBlasts.length - 1; i >= 0; i--) {
        chickenBlasts[i].y += chickenBlasts[i].speed;

        if (chickenBlasts[i].y > canvas.height) {
        chickenBlasts.splice(i, 1);
        }
    }
  
    // check for collisions between blasts and chickens
    for (let i = blasts.length - 1; i >= 0; i--) {
      for (let j = chickens.length - 1; j >= 0; j--) {
        if (checkCollision(blasts[i], chickens[j])) {
          blasts.splice(i, 1);
          chickens.splice(j, 1);
          if(j <= 4){
            score += 20
          } else if (j <= 9){
            score += 15
          } else if (j <= 14){
            score += 10
          } else if (j <= 19){
            score += 5
          }
          break;
        }
      }
    }

    // check for collisions between chicken blasts and player
    for (let i = 0; i < chickenBlasts.length; i++) {
        if (
        chickenBlasts[i].x < player.x + player.width &&
        chickenBlasts[i].x + chickenBlasts[i].width > player.x &&
        chickenBlasts[i].y < player.y + player.height &&
        chickenBlasts[i].y + chickenBlasts[i].height > player.y
        ) {
        // remove the player and the blast
        chickenBlasts.splice(i, 1);
        lives--;
        if (lives === 0) {
            gameover = true;
        } else {
            player.x = canvas.width / 2;
            player.y = canvas.height - 50;
        }
        }
    }
  }


    function draw() {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      
        // Draw the player
        ctx.drawImage(playerImage, player.x * (canvas.width / initialWidth), player.y * (canvas.height / initialHeight), player.width * (canvas.width / initialWidth), player.height * (canvas.height / initialHeight));
        // Draw the chickens
        for (let i = 0; i < chickens.length; i++) {
          ctx.drawImage(chickenImage, chickens[i].x * (canvas.width / initialWidth), chickens[i].y * (canvas.height / initialHeight), chickens[i].width * (canvas.width / initialWidth), chickens[i].height * (canvas.height / initialHeight));
        }
      
        // Draw the blasts
        for (let i = 0; i < blasts.length; i++) {
          ctx.drawImage(blastImage, blasts[i].x * (canvas.width / initialWidth), blasts[i].y * (canvas.height / initialHeight), blasts[i].width * (canvas.width / initialWidth), blasts[i].height * (canvas.height / initialHeight));
        }
      
        // Draw the chicken blasts
        for (let i = 0; i < chickenBlasts.length; i++) {
          ctx.drawImage(chickenBlastImage, chickenBlasts[i].x * (canvas.width / initialWidth), chickenBlasts[i].y * (canvas.height / initialHeight), chickenBlasts[i].width * (canvas.width / initialWidth), chickenBlasts[i].height * (canvas.height / initialHeight));
        }
      
        // Draw the score and lives
        ctx.font = "20px Magic School One";
        ctx.fillStyle = "white";
        ctx.fillText(`Score: ${score}`, 10, 30);
        ctx.fillText(`Time: ${timeLeft}`, 10, 60);
        ctx.fillText(`Lives: ${lives}`, canvas.width - 90, 30);
      
        // Draw game over message
        if (gameover) {
          ctx.font = "50px Arial";
          ctx.fillStyle = "red";
          ctx.fillText("GAME OVER", canvas.width / 2 - 150, canvas.height / 2);
          window.cancelAnimationFrame(animation)
        }
      }

      function gameLoop() {
        update();
        draw();
        animation = requestAnimationFrame(gameLoop);
      }


      function startGame() {
        
        window.cancelAnimationFrame(animation)
        clearInterval(timerInterval);
        
        // Reset game variables
        timeLeft = 120;
        score = 0;
        lives = 3;
        gameover = false;
        
        setup()
      
        // Reset player position
        player.x = canvas.width / 2;
        player.y = canvas.height - 50;
      
        // Clear any existing blasts or chicken blasts
        blasts.splice(0, blasts.length);
        chickenBlasts.splice(0, chickenBlasts.length);
      
        // Start the timer
        startTimer();
      
        // Start the game loop
        gameLoop();
      }


window.addEventListener("load", setup, false);
