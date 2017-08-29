$(()=>{

  const $player = $('#player');
  const $cpu= $('#cpu');
  const $gameScreen= $('#mainScreen');
  //const $playerLife = $('#playerLife');
  const cpuMove={
    left: 'left',
    right: 'right',
    top: 'top',
    bottom: 'bottom'
  };
  let xTop = $gameScreen.offset().top, yLeft = $gameScreen.offset().left;
  let yRight = yLeft + $gameScreen.outerWidth();
  let xBottom = xTop +$gameScreen.outerHeight();
  console.log(xTop,yLeft,yRight,xBottom);
  let superAttack=0;

  function getPositions(){
    const playerRight = $player.offset().left+$player.outerWidth();
    const playerLeft = $player.offset().left;
    const playerTop = $player.offset().top;
    const playerBottom = $player.offset().top+$player.outerHeight();
    const cpuRight = $player.offset().left+$player.outerWidth();
    const cpuLeft = $cpu.offset().left;
    const cpuTop = $cpu.offset().top;
    const cpuBottom = $cpu.offset().top+$cpu.outerHeight();

    return playerRight,playerLeft,playerTop,playerBottom,cpuRight,cpuLeft,cpuTop,cpuBottom;
  }

  function collisionCPU(playerRight,playerLeft,playerTop,playerBottom,cpuRight,cpuLeft,cpuTop,cpuBottom){

    if(cpuRight < playerLeft){
      console.log('no collision');
    }else{
      if(cpuLeft < playerRight && playerTop<cpuBottom){
        console.log('collision');
      }
    }
  }

  function collisionPlayer(){
    getPositions();
    if($player.offset().left+$player.outerWidth()>=$cpu.offset().left){
      console.log('collision');
    }
  }

  function cpuSpeedAttack(){
    return $cpu.animate({
      left: '-=20%'
    }, {
      duration: 200,
      progress: collisionCPU(getPositions()),
      complete() {
        $cpu.animate({ left: '+=20%' }, 100);
      }
    });
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
      superAttack++;
      if(superAttack>5){
        cpuSpeedAttack();
        superAttack=0;
        console.log(superAttack);
      }
    },1000);
  }

  function playerMoves(event) {
    getPositions();
    switch (event.which) {
      case 32:
        if($player.hasClass('horizontal')){
          $player.animate({left: '-=30%'}, 90, collisionPlayer);
          break;
        }
        $player.animate({left: '+=30%'}, 90);
        break;
      case 37:
        if(($player.offset().left-$player.offset().left*0.01)>=yLeft && $player.hasClass('horizontal')){
          $player.animate({left: '-=10%'}, 1);
          break;
        }else if(($player.offset().left-$player.offset().left*0.01)>=yLeft && !$player.hasClass('horizontal')){
          $player.animate({left: '-=10%'}, 1);
          $player.toggleClass('horizontal');
          break;
        }
        break;
      case 39:
        if(($player.offset().left+($player.offset().left)*0.01)>=yRight){
          break;
        }else if(($player.offset().left+($player.offset().left)*0.05)<yRight+$player.outerWidth() && $player.hasClass('horizontal')){
          $player.toggleClass('horizontal');
          $player.animate({left: '+=10%'}, 1);
          break;
        }
        $player.animate({left: '+=10%'}, 1);
        break;
      case 38:
        if(($player.offset().top-$player.offset().top*0.01)<=xBottom*0.5){
          break;
        }
        $player.animate({top: '-=10%'}, 1);
        break;
      case 40:
        if(($player.offset().top-$player.offset().top*0.01)>=xBottom-$player.outerHeight()){
          break;
        }
        $player.animate({top: '+=10%'}, 1);
        break;
    }
  }

  function resizeWindow(){
    $(window).resize(function(){
      xTop = $gameScreen.offset().top;
      yLeft = $gameScreen.offset().left;
      yRight = (yLeft + $gameScreen.outerWidth());
      xBottom = (xTop +$gameScreen.outerHeight());
      console.log(xTop,yLeft,yRight,xBottom);
    });
  }

  function play(){
    resizeWindow();
    $(window).keydown(playerMoves);
    startCPUMovement();
  }
  play();

});
