$(()=>{

  const $player = $('#player');
  const $cpu= $('#boss');
  const $dactyl =$('#dactyl');
  const $gameScreen= $('#mainScreen');
  const $specialAttack = $('#specialAttack');
  const $life = $('#life');

  //const $playerLife = $('#playerLife');
  const cpuMove={
    left: 'left',
    right: 'right',
    top: 'top',
    bottom: 'bottom'
  };
  const cpuDactylMove={
    1: '0%',
    2: '15%',
    3: '30%',
    4: '45%',
    5: '60%',
    6: '75%'
  };

  const hit=[];
  let gameSpeed = 1;
  let gameScreenTop = $gameScreen.offset().top;
  let gameScreenLeft = $gameScreen.offset().left;
  let gameScreenRight = gameScreenLeft + $gameScreen.outerWidth(true);
  let gameScreenBottom = gameScreenTop +$gameScreen.outerHeight(true);

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

    if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
    return true;
  }

  function cpuMoves() {
    let result;
    let count = 0;
    for (const move in cpuMove)
      if (Math.random() < 1/++count)
        result = move;
    return result;
  }

  function startCPUMovement(){
    setInterval( ()=>{
      console.log(cpuMoves());
      const speedAttack=1 + Math.floor(Math.random() * 6);
      if(speedAttack===3){
        cpuDash();
      }
    },1000/gameSpeed);
  }

  function cpuDash(){
    $cpu.animate({
      left: '-=20%'
    }, {
      duration: 1000/gameSpeed,
      progress: () => console.log(collision($cpu,$player)),
      complete() {
        $cpu.animate({ left: '+=20%' }, 100);
      }
    });
    cpuDactylAttack();
  }

  function cpuDactylAttack(){
    const dactylPosition = 1 + Math.floor(Math.random() * 6);
    $dactyl.toggleClass('hidden');
    $dactyl.animate({
      top: '+=50%'
    }, {
      duration: 1000/gameSpeed,
      progress: () => checkCollisionDactyl(),
      complete() {
        $dactyl.toggle( 'bounce', { times: 5 }, 'slow', () => {
          $dactyl.css({top: '30%', left: cpuDactylMove[dactylPosition]});
        });
      }
    });
  }

  function checkCollisionDactyl(){

    hit.push(collision($dactyl,$player));
    console.log(hit);
    // if(true in hit)){
    //   $('.heart:last-child', this).remove();
    //   return false;
    // }
  }


  function playerMoves(event) {

    switch (event.which) {
      case 17:
        playerSpecialAttack();
        break;
      case 32:
        playerDash();
        break;
      case 37:
        playerLeftMove();
        break;
      case 39:
        playerRightMove();
        break;
      case 38:
        playerUpMove();
        break;
      case 40:
        playerDownMove();
        break;
    }
  }

  function playerSpecialAttack(){
    const duration = setInterval(playerSpecialAttackEffects ,1000);
    setTimeout(function() {
      clearInterval( duration );
    }, 2000);

  }

  function playerSpecialAttackEffects(){

    $player.toggleClass('playerSpecialAttack');
    $specialAttack.toggleClass('hidden');
  }

  function playerDash(){
    if($player.hasClass('mirror')){
      $player.animate({
        left: '-=20%'
      }, {
        duration: 90,
        progress: () => collision($player,$cpu)
      });
      return false;
    }
    $player.animate({
      left: '+=20%'
    }, {
      duration: 90,
      progress: () => collision($player,$cpu)
    });
  }

  function playerLeftMove(){
    if(($player.offset().left-$player.offset().left*0.01)>=gameScreenLeft && $player.hasClass('mirror')){
      $player.animate({left: '-=2%'}, 1);
      return false;
    }else if(($player.offset().left-$player.offset().left*0.01)>=gameScreenLeft && !$player.hasClass('mirror')){
      $player.animate({left: '-=2%'}, 1);
      $player.toggleClass('mirror');
      return false;
    }
  }

  function playerRightMove(){
    if(($player.offset().left+($player.offset().left)*0.01)>=gameScreenRight){
      return false;
    }else if(($player.offset().left+($player.offset().left)*0.05)<gameScreenRight+$player.outerWidth() && $player.hasClass('mirror')){
      $player.toggleClass('mirror');
      $player.animate({left: '+=2%'}, 1);
      return false;
    }
    $player.animate({left: '+=2%'}, 1);
  }

  function playerUpMove(){
    if(($player.offset().top-$player.offset().top*0.01)<=gameScreenBottom*0.5){
      return false;
    }
    $player.animate({top: '-=2%'}, 1);
  }

  function playerDownMove(){
    if(($player.offset().top-$player.offset().top*0.01)>=gameScreenBottom-$player.outerHeight()){
      return false;
    }
    $player.animate({top: '+=2%'}, 1);
  }

  function resizeWindow(){
    $(window).resize(function(){
      gameScreenTop = $gameScreen.offset().top;
      gameScreenLeft = $gameScreen.offset().left;
      gameScreenRight = (gameScreenLeft + $gameScreen.outerWidth());
      gameScreenBottom = (gameScreenTop +$gameScreen.outerHeight());
      console.log(gameScreenTop,gameScreenLeft,gameScreenRight,gameScreenBottom);
    });
  }

  function play(){
    resizeWindow();
    $(window).keydown(playerMoves);
    startCPUMovement();
  }
  play();

});
