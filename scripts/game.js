$(document).ready(function() {

 });


var f = new FontFace('Magic School One', 'url(/font/MagicSchoolOne.ttf)');
var ctx
var enemies = [];
var canvas;
var blasts = [];
var player
var timeLeft
var enemyBlasts = [];
var playerImage;
var enemyImage;
var bgImage;
var blastImg
var cur;
var enemyBlastImage
var timerInterval
var score
var gameover
var timeout
var lives = 3;
var victory
var initialHeight
var initialWidth
var randomIndex;
var animation;
var count = 0;
var bonus = 1;
var bgMusic;
var playerDeath;
var goodBlast;
var badBlast;
var enemyDeath;

const keys = {};



function setup(){
  
    document.addEventListener( "unload", null, false );
    canvas = document.getElementById( "theCanvas" );
    ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth*0.6;
    canvas.height = window.innerHeight*0.7;
    initialHeight = canvas.height
    initialWidth = canvas.width
    playerImage = new Image();
    playerImage.src = 'images/good_guy.png';
    player = {
        x: canvas.width / 2,
        y: canvas.height - canvas.height*0.25,
        width: canvas.width*0.2,
        height: canvas.height*0.25,
        speed: 5
    }; 
    enemyImage = new Image();
    enemyImage.src = 'images/bad_guy.png'; 
    blastImage = new Image();
    blastImage.src = 'images/good_blast.png';  
    enemyBlastImage = new Image();
    enemyBlastImage.src = 'images/bad_blast.png'; 
    bgImage = new Image();
    bgImage.src = 'images/gameBg.png'
    bgMusic = document.getElementById("bgMusic")
    playerDeath = document.getElementById("playerDeath")
    goodBlast = document.getElementById("goodBlast")
    badBlast = document.getElementById("badBlast")
    enemyDeath = document.getElementById("enemyDeath")
    timerInterval;
    score = 0;
    gameover = false;
    timeout = false;
    victory = false;
    enemies = []
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 5; j++) {
            enemies.push({
                x: j * canvas.width*0.08 + 10,
                y: i * canvas.height*0.1 + 15,
                width: canvas.width*0.08,
                height: canvas.height*0.1,
                speed: 2
            });
        }
    }
    
     window.addEventListener('resize', resize);



}

function resize() {
    const rect = canvas.getBoundingClientRect();
    const scaleX = window.innerWidth*0.6 / initialWidth;
    const scaleY = window.innerHeight*0.7 / initialHeight;
    const scale = Math.min(scaleX, scaleY);
  
    canvas.style.transformOrigin = '0 0';
    canvas.style.transform = `scale(${scale})`;
  }

function keyEventHandler(event){
    if (event.key === key && event.type === "keydown") {
        blasts.push({
            x: player.x + player.width/2,
            y: player.y ,
            width: 0.07*canvas.width,
            height: 0.07*canvas.height,
            speed: 2,
            image: blastImage
            });
        goodBlast.currentTime = 0;
        goodBlast.play();
    }
    keys[event.code] = event.type === "keydown";
    event.preventDefault();
}

function movePlayer(){
    if(keys.ArrowLeft){
        player.x -= player.speed;
    }
    if(keys.ArrowRight){
        player.x += player.speed;
    }
    if(keys.ArrowDown){
        player.y += player.speed;
    }
    if(keys.ArrowUp){
        if (player.y >= canvas.height*0.6){
            player.y -= player.speed;
        }
    }
}



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
    count = 0;
    timerInterval = setInterval(() => {
        if(count === 5 || count === 10 || count === 15 || count === 20){
            bonus += 0.07
        }
        count++;
      timeLeft--;
      if (timeLeft === 0) {
        clearInterval(timerInterval);
        timeout = true; 
    }
    }, 1000);
  }
  
 
  function update() {

    if(enemies.length == 0){
        victory = true
        window.cancelAnimationFrame(animation)
        return 0
    }

    if (player.x < 0) {
      player.x = 0;
    } else if (player.x  > canvas.width - player.width) {
      player.x = canvas.width - player.width;
    }

    if (player.y >= canvas.height-canvas.height*0.25){
        player.y = canvas.height-canvas.height*0.25
    }
  
    for (let i = 0; i < enemies.length; i++) {
      enemies[i].x += enemies[i].speed * bonus;
      if (enemies[i].x < 0 || enemies[i].x > canvas.width - enemies[i].width) {
        enemies[i].speed = -enemies[i].speed;
      }
    }

    if (enemyBlasts.length == 0 || enemyBlasts[enemyBlasts.length-1].y >= canvas.height*0.75){
        rand = Math.floor(Math.random() * enemies.length);
        enemyBlasts.push({
            x: enemies[rand].x + enemies[rand].width / 2,
            y: enemies[rand].y + enemies[rand].height,
            width: canvas.width*0.07,
            height: canvas.height*0.07,
            speed: 2,
            image: enemyBlastImage
        });
        badBlast.currentTime = 0;
        badBlast.play()
    }
  
    for (let i = blasts.length - 1; i >= 0; i--) {
      blasts[i].y -= blasts[i].speed;
  
      if (blasts[i].y < 0) {
        blasts.splice(i, 1);
      }
    }

    for (let i = enemyBlasts.length - 1; i >= 0; i--) {
        enemyBlasts[i].y += enemyBlasts[i].speed * bonus;

        if (enemyBlasts[i].y > canvas.height) {
        enemyBlasts.splice(i, 1);
        }
    }
  
    for (let i = blasts.length - 1; i >= 0; i--) {
      for (let j = enemies.length - 1; j >= 0; j--) {
        if (checkCollision(blasts[i], enemies[j])) {
          blasts.splice(i, 1);
          enemies.splice(j, 1);
          enemyDeath.play()
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

    for (let i = 0; i < enemyBlasts.length; i++) {
        if (
        enemyBlasts[i].x < player.x + player.width &&
        enemyBlasts[i].x + enemyBlasts[i].width > player.x &&
        enemyBlasts[i].y < player.y + player.height &&
        enemyBlasts[i].y + enemyBlasts[i].height > player.y
        ) {
        enemyBlasts.splice(i, 1);
        lives--;
        playerDeath.play()
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
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 0.6
        ctx.drawImage(bgImage,canvas.width-bgImage.width,canvas.height-bgImage.height)
        ctx.globalAlpha = 1

        ctx.drawImage(playerImage, player.x * (canvas.width / initialWidth), player.y * (canvas.height / initialHeight), player.width * (canvas.width / initialWidth), player.height * (canvas.height / initialHeight));
        for (let i = 0; i < enemies.length; i++) {
          ctx.drawImage(enemyImage, enemies[i].x * (canvas.width / initialWidth), enemies[i].y * (canvas.height / initialHeight), enemies[i].width * (canvas.width / initialWidth), enemies[i].height * (canvas.height / initialHeight));
        }
      
        for (let i = 0; i < blasts.length; i++) {
          ctx.drawImage(blastImage, blasts[i].x * (canvas.width / initialWidth), blasts[i].y * (canvas.height / initialHeight), blasts[i].width * (canvas.width / initialWidth), blasts[i].height * (canvas.height / initialHeight));
        }
      
        for (let i = 0; i < enemyBlasts.length; i++) {
          ctx.drawImage(enemyBlastImage, enemyBlasts[i].x * (canvas.width / initialWidth), enemyBlasts[i].y * (canvas.height / initialHeight), enemyBlasts[i].width * (canvas.width / initialWidth), enemyBlasts[i].height * (canvas.height / initialHeight));
        }
      
        ctx.font = "20px Magic School One";
        ctx.fillStyle = "white";
        ctx.fillText(`Score: ${score}`, 10, 30);
        ctx.fillText(`Time: ${timeLeft}`, 10, 60);
        ctx.fillText(`Lives: ${lives}`, canvas.width - 90, 30);
      
        if (gameover) {
          ctx.font = "50px Magic School One";
          ctx.fillStyle = "red";
          ctx.fillText("You Lost", canvas.width / 2 - 150, canvas.height / 2);
          LB.push([gameCount, score, timeLeft, lives])
          gameCount++;
          window.cancelAnimationFrame(animation)
          bgMusic.loop = false;
          bgMusic.pause()
          displayBoards()
        }

        if (timeout) {
            ctx.font = "50px Magic School One";
            ctx.fillStyle = "yellow";
            if (score >= 100){
                ctx.fillText("Winner!", canvas.width / 2 - 150, canvas.height / 2);
                LB.push([gameCount, score, timeLeft, lives])
                gameCount++;
            } else{
                ctx.fillText(`you can do better, score: ${score}`, canvas.width / 2 - 150, canvas.height / 2);
                LB.push([gameCount, score, timeLeft, lives])
                gameCount++
            }
            window.cancelAnimationFrame(animation)
            bgMusic.loop = false;
            bgMusic.pause()
            displayBoards()
        }

        if (victory) {
            ctx.font = "50px Magic School One";
            ctx.fillStyle = "green";
            ctx.fillText("Champion!", canvas.width / 2 - 150, canvas.height / 2);
            LB.push([gameCount, score, timeLeft, lives])
            gameCount++;
            window.cancelAnimationFrame(animation)
            bgMusic.loop = false;
            bgMusic.pause()
            displayBoards()
          }
      }

      function displayBoards(){
        cancelAnimationFrame(animation)
        ctx.font = "25px Magic School One";
        ctx.fillStyle = "white";
        ctx.fillText(`current game: ${gameCount-1}`,ctx.canvas.width /2 , 75 )
        ctx.fillText('# \t \t \t Score\t \t \t Time Left \t \t \t Lives', ctx.canvas.width / 2, 50);
        // Draw each row
        for (let i = 0; i < LB.length; i++){
            if (i == (gameCount-2)){
                ctx.fillStyle = "yellow";
            }
            const num = LB[i][0]
            const scor = LB[i][1]
            const tLeft = LB[i][2]
            const life = LB[i][3]
            ctx.fillText(`${num}  \t \t \t ${scor}   \t \t  \t ${tLeft} \t \t   \t  \t \t \t ${life}`, ctx.canvas.width / 2, 100 + i * 25);
            ctx.fillStyle = "white";
        }
      }

      function gameLoop() {
        if (gameover || victory || timeout){
            window.cancelAnimationFrame(animation)
        } else{
            movePlayer();
            update();
            draw();
            animation = requestAnimationFrame(gameLoop);
        }
      }


      function startGame() {
        bgMusic.pause()
        document.addEventListener("keydown",keyEventHandler);
        document.addEventListener("keyup",keyEventHandler);
        window.cancelAnimationFrame(animation)
        clearInterval(timerInterval);
        timeLeft = timer
        score = 0;
        lives = 3;
        gameover = false;
        timeout = false;
        victory = false;
        
        setup()
        bgMusic.loop = true;
        bgMusic.volume = 0.2
        bgMusic.play();
        player.x = canvas.width / 2;
        player.y = canvas.height - 50;
      
        blasts.splice(0, blasts.length);
        enemyBlasts.splice(0, enemyBlasts.length);
      
        startTimer();
      
        gameLoop();
      }


window.addEventListener("load", setup, false);
