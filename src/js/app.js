$(()=>{

  const $player = $('.player');
  const $cpu= $('.boss');
  const $dactyl =$('#dactyl');
  const $mainScreen= $('#mainScreen');
  const $specialAttack = $('#specialAttack');
  const $special = $('#special');
  const $life = $('.life');
  const $dragon = $('#dragon');
  const $points=$('#points');
  const $pauseScreen= $('#pauseScreen');
  const $instructionsScreen = $('#instructionsScreen');
  const $mainSong = $('#mainSong');


  function play(){
    const cpuDactylMoveX={
      1: '0%',
      2: '15%',
      3: '30%',
      4: '45%',
      5: '60%',
      6: '75%'
    };
    const cpuDactylMoveY={
      1: '0%',
      2: '15%',
      3: '30%'
    };
    let specialAttackCast= 3;
    let dactylCollision=[];
    let playerCollision =[];
    let bossCollision =[];
    let dragonCollision=[];
    let gameSpeed = 1;
    let points=0;
    let speedAttack=0;
    let gameScreenTop = $mainScreen.offset().top;
    let gameScreenLeft = $mainScreen.offset().left;
    let gameScreenRight = gameScreenLeft + $mainScreen.outerWidth(true);
    let gameScreenBottom = $mainScreen.outerHeight(true);
    let levels = null;
    let pointerPoints = null;
    let gameStart=null;
    // function getPositions(){
    //   let playerRight = $player.outerWidth(true);
    //   let playerLeft = $player.offset().left;
    //   let playerTop = $player.offset().top;
    //   let playerBottom = $player.outerHeight(true);
    //   let cpuRight = $player.offset().left+$player.outerWidth(true);
    //   let cpuLeft = $cpu.offset().left;
    //   let cpuTop = $cpu.offset().top;
    //   let cpuBottom = $cpu.outerHeight(true);
    //
    //   return {
    //     playerRight,playerLeft,playerTop,playerBottom,cpuRight,cpuLeft,cpuTop,cpuBottom
    //   };
    // }

    // function collision() {
    //   const positions=getPositions();
    //   var b1 = positions.playerTop + positions.playerButtom;
    //   var r1 = positions.playerLeft + positions.playerRight;
    //   var b2 = positions.cpuTop + positions.cpuBottom;
    //   var r2 = positions.cpuLeft + positions.cpuRight;
    //
    //   if (b1 < positions.cpuTop || positions.playerTop > b2 || r1 < positions.cpuLeft || positions.playerLeft > r2) return false;
    //   return true;
    // }
    function levelUp(){
      levels = setInterval(()=>{
        gameSpeed+=0.2;
        console.log(gameSpeed);
        if(gameSpeed>30){
          stopLevelUp();
        }
      },5000);
    }

    function stopLevelUp(){
      clearInterval(levels);
    }

    function collision($player, $cpu) {
      var x1 = $player.offset().left;
      var y1 = $player.offset().top;
      var h1 = $player.outerHeight(true);
      var w1 = $player.outerWidth(true);
      var b1 = y1 + h1;
      var r1 = x1 + w1;
      var x2 = $cpu.offset().left;
      var y2 = $cpu.offset().top;
      var h2 = $cpu.outerHeight(true);
      var w2 = $cpu.outerWidth(true);
      var b2 = y2 + h2;
      var r2 = x2 + w2;

      if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return -1;
      return 1;
    }

    function startCPUMovement(){
      const gameStart=setInterval( ()=>{
        speedAttack++;
        if(speedAttack>5){
          cpuDash();
          speedAttack=0;
        }else if(speedAttack===4){
          dragonAttack();
        }
      },1500/gameSpeed);
      return gameStart;
    }

    function pauseCPUMovement(){
      clearInterval(gameStart);
    }

    // function cpuMoves() {
    //   let result;
    //   let count = 0;
    //   for (const move in cpuMove)
    //     if (Math.random() < 1/++count)
    //       result = move;
    //   return result;
    // }


    function cpuDash(){
      $cpu.animate({
        left: '-=20%'
      }, {
        duration: 1000/gameSpeed,
        progress: () => storeCollisionCPU(),
        complete() {
          $cpu.animate({ left: '+=20%' }, 100);
        }
      });
      removeLifeCPU();
      cpuDactylAttack();

    }
    function storeCollisionCPU(){
      bossCollision.push(collision($cpu,$player));
    }
    function storeCollisionDragon(){
      dragonCollision.push(collision($dragon,$player));
    }

    function setDactylPosition(){
      const dactylPosition=[];
      dactylPosition.push(1 + Math.floor(Math.random() * 6));
      dactylPosition.push( 1 + Math.floor(Math.random() * 3));
      return dactylPosition;
    }

    function cpuDactylAttack(){
      const dactylPosition = setDactylPosition();
      $dactyl.toggleClass('hidden');
      $dactyl.animate({
        top: '+=50%'
      }, {
        duration: 1000/gameSpeed,
        progress: () => storeCollisionDactyl(),
        complete() {
          $dactyl.toggle( 'bounce', { times: 5 }, 'slow', () => {
            $dactyl.css({top: cpuDactylMoveY[dactylPosition[1]], left: cpuDactylMoveX[dactylPosition[0]]});
            $dactyl.toggleClass('hidden');
          });
          removeLifeDactyl();
        }
      });
    }

    function storeCollisionDactyl(){
      dactylCollision.push(collision($dactyl,$player));
    }

    function dragonAttack(){
      $dragon.toggleClass('hidden');
      $dragon.animate({
        left: '+=70%'
      }, {
        duration: 3000/gameSpeed,
        progress: () => storeCollisionDragon(),
        complete() {
          $dragon.toggleClass('hidden');
          $dragon.css({left: '0%'}
          );
          removeLifeDragon();
        }
      });
    }

    function removeLifeDactyl(){
      if(dactylCollision.includes(1) || bossCollision.includes(1)){
        $('#life li:last').remove();
        playerHit();
      }
      dactylCollision=[];
    }
    function removeLifeCPU(){
      if(bossCollision.includes(1)){
        $('#life li:last').remove();
        playerHit();
      }
      bossCollision=[];
    }
    function removeLifeDragon(){
      if(dragonCollision.includes(1)){
        $('#life li:last').remove();
        playerHit();
      }
      dragonCollision=[];
    }

    function addLife(){
      $life.append('<li class="life">&hearts;</li>');
    }

    function removeSpecial(){
      $('#special li:last').remove();
      if($special.length>0 && $life.length<6){
        addLife();
      }
    }

    function playerMoves(event) {
      switch (event.which) {
        case 32:
          playerSpecialAttack();
          removeSpecial();
          break;
        case 16:
          playerDash();
          break;
        case 65:
          playerLeftMove();
          break;
        case 68:
          playerRightMove();
          break;
        case 87:
          playerUpMove();
          break;
        case 83:
          playerDownMove();
          break;
      }
    }

    function playerSpecialAttack(){
      if(specialAttackCast<1){
        return false;
      }
      playerSpecialAttackEffects();
      const duration = setInterval(playerSpecialAttackEffects ,999);
      setTimeout(function() {
        clearInterval( duration );
      }, 1000);
      specialAttackCast--;

    }

    function playerSpecialAttackEffects(){
      $player.toggleClass('playerSpecialAttack');
      $specialAttack.toggleClass('hidden');
    }

    function playerDash(){
      if(dashAvailable() && isMirror()){
        playerDashLeft();
      }else if(dashAvailable() && !isMirror()){
        playerDashRight();
      }
    }

    function isMirror(){
      return ($player.hasClass('mirror'));
    }

    function playerDashLeft(){
      if($player.offset().left-($player.offset().left-$player.offset().left*0.3)>$player.offset().left-$mainScreen.offset().left){
        return false;
      }else{
        $player.animate({
          left: '-=30%'
        }, {
          duration: 90,
          progress: () => storeCollisionPlayer()
        });
      }
    }

    function playerDashRight(){
      if($player.outerWidth(true)+($player.outerWidth(true)+$player.outerWidth(true)*0.3)<$player.outerWidth(true)-($mainScreen.outerWidth()+$mainScreen.offset().left)){
        return false;
      }else{
        $player.animate({
          left: '+=30%'
        }, {
          duration: 90,
          progress: () => storeCollisionPlayer()
        });
      }
    }

    // function playerLimitedDashRight(){
    //
    //
    //
    //
    // }
    //
    // function playerLimitedDashLeft(){
    //
    // }

    function dashAvailable(){
      if($player.hasClass('playerHit') || $player.hasClass('playerSpecialAttack')){
        return false;
      }
      return true;
    }

    function storeCollisionPlayer(){
      playerCollision.push(collision($player,$cpu));
      if(playerCollision.includes(1)){
        points+=100;
      }
      playerCollision=[];
    }

    function startPoints(){
      pointerPoints = setInterval(()=>{
        points++;
        $points.text(points);
      },10);
    }

    function finishGame(){
      clearInterval(pointerPoints);
    }
    //dash = true
    //dash();--->dashAvailable?--->true DASH!---->cancellDash()
    //dash=false;
    //dash();--->dashAvailable?---->false NO DASH!



    function playerLeftMove(){
      if(playerCheckLeftMirror()){
        $player.animate({left: '-=3%'}, 1);
        return false;
      }else if(playerCheckLeftNoMirror()){
        mirror();
        $player.animate({left: '-=3%'}, 1);
        return false;
      }
    }

    function playerRightMove(){
      if(playerCheckRightMirror()){
        return false;
      }else if(playerCheckRightNoMirror()){
        mirror();
        $player.animate({left: '+=3%'}, 1);
        return false;
      }
      $player.animate({left: '+=3%'}, 1);
    }

    function playerUpMove(){
      if(playerCheckUp()){
        return false;
      }
      $player.animate({top: '-=2%'}, 1);
    }

    function playerDownMove(){
      if(playerCheckDown()){
        return false;
      }
      $player.animate({top: '+=2%'}, 1);
    }

    function playerCheckUp(){
      return (($player.offset().top-$player.offset().top*0.01)<=gameScreenBottom*0.5);
    }

    function playerCheckDown(){
      return (($player.offset().top-$player.offset().top*0.01)>=gameScreenBottom-$player.outerHeight());
    }

    function playerCheckRightMirror(){
      return (($player.offset().left+($player.offset().left)*0.09)>=gameScreenRight);
    }

    function playerCheckRightNoMirror(){
      return (($player.offset().left+($player.offset().left)*0.09)<gameScreenRight+$player.outerWidth() && $player.hasClass('mirror'));
    }

    function playerCheckLeftMirror(){
      return (($player.offset().left-$player.offset().left*0.01)>=gameScreenLeft && $player.hasClass('mirror'));
    }

    function playerCheckLeftNoMirror(){
      return (($player.offset().left-$player.offset().left*0.01)>=gameScreenLeft && !$player.hasClass('mirror'));
    }

    function mirror(){
      $player.toggleClass('mirror');
    }

    function playerHit(){
      playerHitEffects();
      const duration = setInterval(playerHitEffects ,999);
      setTimeout(function() {
        clearInterval( duration );
      }, 1000);
    }

    function playerHitEffects(){
      $player.toggleClass('playerHit');
    }

    function showUltraBoss(){
      $cpu.toggleClass('ultraBoss');
    }

    function showMainScreen(){
      $mainScreen.toggleClass('hidden');

    }
    function showInstructionsScreen(){
      $instructionsScreen.toggleClass('hidden');

    }
    function hidePauseScreen(){
      $pauseScreen.addClass('hidden');
    }
    function playAudio(){
      const mainSong = new Audio('/audio/mainSong.mp3');
      mainSong.loop=true;
      mainSong.autoplay=true;
    }

    $(window).resize(resizeWindow);
    function resizeWindow(){
      console.log('resizing window!');
      gameScreenTop = $mainScreen.offset().top;
      gameScreenLeft = $mainScreen.offset().left;
      gameScreenRight = (gameScreenLeft + $mainScreen.outerWidth());
      gameScreenBottom = (gameScreenTop +$mainScreen.outerHeight());
      console.log(gameScreenTop,gameScreenLeft,gameScreenRight,gameScreenBottom);
    }

    $(window).keydown(playerMoves);


    $('#play').one('click',function(event){
      event.preventDefault();
      hidePauseScreen();
      showMainScreen();
      playAudio();
      if(!$instructionsScreen.hasClass('hidden')){
        showInstructionsScreen();
      }
      levelUp();
      startCPUMovement();
      startPoints();
      resizeWindow();
    });

    $('#pause').on('click',pauseCPUMovement);
    $('#restart').on('click',function(){
      location.reload();
    });

    $('#instructions').one('click',function(event){
      event.preventDefault();
      hidePauseScreen();
      showInstructionsScreen();
    });
    $('#ultraBoss').on('click',showUltraBoss);
  }

  play();




});
