import '../scss/style.scss';
import '../audio/end-of-time-3-.mp3';
import '../audio/boss-battle.mp3';
import '../audio/game-over.mp3';
import '../audio/slash.mp3';
import '../audio/grunt.wav';
import '../images/fire2.gif';


$(() => {
  //DOM
  const $player = $('.player');
  const $boss = $('.boss');
  const $portal = $('#portal');
  const $mainScreen = $('#main-screen');
  const $specialAttack = $('#special-attack');
  const $specialAttackList = $('#special-attack-list');
  const $lifes = $('#lifes');
  const $points = $('#points');
  const $pauseScreen = $('#pause-screen');
  const $instructionsScreen = $('#instructions-screen');
  const $gameOverScreen = $('#game-over');
  const $finalScore = $('.finalScore');
  const $stats = $('.lifes');

  //GLOBALS
  const life = '<li class="life">&hearts;</li>';
  const specialAttackIcon = '<li class="specialAttack">#</li>';
  const playerSpecialAttackClassSelector = 'player-special-attack'
  const playerCollidedClassSelector = 'player-collided'
  const mainSong = new Audio('../audio/end-of-time-3-.mp3');
  const gameOverSong = new Audio('../audio/game-over.mp3');
  const bossSong = new Audio('../audio/boss-battle.mp3');
  const slash = new Audio('../audio/slash.mp3');
  const grunt = new Audio('../audio/grunt.wav');
  const ultraBossClass = 'ultra-boss';
  const hiddenClass = 'hidden';

  function play() {
    //VARIABLES FOR MOVES
    const cpuPortalMoveX = {
      1: '0%',
      2: '15%',
      3: '30%',
      4: '45%',
      5: '60%',
      6: '70%'
    };
    const cpuPortalMoveY = {
      1: '50%',
      2: '40%',
      3: '30%'
    };

    //STATS OF THE GAME
    let lifes = 6;
    let specialAttackCast = 3;
    let portalCollision = [];
    let playerCollision = [];
    let bossCollision = [];
    let gameSpeed = 2;
    let points = 0;
    let gameScreenTop = $mainScreen.offset().top;
    let gameScreenLeft = $mainScreen.offset().left;
    let gameScreenRight = gameScreenLeft + $mainScreen.outerWidth(true);
    let gameScreenBottom = $mainScreen.outerHeight(true);
    let superBoss = false;

    //VARIABLES FOR TIMERS
    let levels = null;
    let pointerPoints = null;
    let cpuMovement = null;
    let portal = null;
    let transformBoss = null;
    let specialAttack = null;

    //BOOLEAN FOR WIN/LOSE LOGIC
    let lose = false;


    //TIMERS
    function upgradeBoss() {
      let transformation = 0;
      transformBoss = setInterval(() => {
        $boss.toggleClass(ultraBossClass);
        $mainScreen.toggleClass('main-screen-boss');
        if (++transformation === 15) {
          window.clearInterval(transformBoss);
        }
      }, 200);
    }


    function levelUp() {
      levels = setInterval(() => {
        gameSpeed += 0.1;
      }, 4000 / gameSpeed);
    }

    function stopLevelUp() {
      clearInterval(levels);
    }

    function startPoints() {
      pointerPoints = setInterval(() => {
        points++;
        $points.text(points);
        if (points > 3000) {
          $boss.toggleClass('boss');
        }
      }, 10);

    }

    function stopPoints() {
      clearInterval(pointerPoints);
    }

    function startCPUMovement() {
      cpuMovement = setInterval(() => {
        cpuDash();
      }, 10000 / gameSpeed);
    }

    function stopCPUMovement() {
      clearInterval(cpuMovement);
    }

    function startPortal() {
      portal = setInterval(() => {
        cpuPortalAttack();
      }, 6000 / gameSpeed);
    }

    function stopPortal() {
      clearInterval(portal);
    }

    //COLLISIONS
    function collision($player, $boss) {
      const playerLeft = $player.offset().left;
      const playerTop = $player.offset().top;
      const playerBottom = $player.outerHeight(true);
      const playerRight = $player.outerWidth(true);
      const b1 = playerTop + playerBottom;
      const r1 = playerLeft + playerRight;
      const cpuLeft = $boss.offset().left;
      const cpuTop = $boss.offset().top;
      const cpuBottom = $boss.outerHeight(true);
      const cpuRight = $boss.outerWidth(true);
      const b2 = cpuTop + cpuBottom;
      const r2 = cpuLeft + cpuRight;

      if (b1 < cpuTop || playerTop > b2 || r1 < cpuLeft || playerLeft > r2) return -1;
      return 1;
    }

    function storeCollisionPortal() {
      portalCollision.push(collision($portal, $player));
    }

    function storeCollisionCPU() {
      bossCollision.push(collision($boss, $player));
    }

    function storeCollisionPlayer() {
      playerCollision.push(collision($player, $boss));
      if (playerCollision.includes(1)) {
        points += 500;
        if (!superBoss) {
          bossSong.play();
          upgradeBoss();
          levelUp();
          startCPUMovement();
          startPortal();
          startPoints();
          superBoss = true;
        }
        slash.play();
      }
      playerCollision = [];
    }

    function portalDamage() {
      if (portalCollision.includes(1) || bossCollision.includes(1)) {
        $('#life li:last').remove();
        playerCollided();
        checkLose();
      }
      portalCollision = [];
    }

    function bossDamage() {
      if (bossCollision.includes(1)) {
        $('#life li:last').remove();
        playerCollided();
        checkLose();
      }
      bossCollision = [];
    }

    function playerCollided() {
      playerCollidedEffects();
      const duration = setInterval(playerCollidedEffects, 999);
      setTimeout(function () {
        clearInterval(duration);
      }, 1000);
      lifes--;
      grunt.play();
    }


    //CPU MOVES
    function cpuDash() {
      $boss.animate({
        left: '-=10%'
      }, {
        duration: 2000 / gameSpeed,
        progress: () => storeCollisionCPU(),
        complete() {
          $boss.animate({ left: '+=10%' }, 100);
          bossDamage();
        }
      });

    }

    function cpuPortalAttack() {
      const portalPosition = setPortalPosition();
      $portal.animate({
        width: '30%'
      }, {
        duration: 4000 / gameSpeed,
        progress: () => storeCollisionPortal(),
        complete() {

          $portal.css({ top: cpuPortalMoveY[portalPosition[1]], left: cpuPortalMoveX[portalPosition[0]], width: '' });
          portalDamage();
        }
      });
    }

    //RANDOM POSITIONING FOR PORTAL
    function setPortalPosition() {
      const portalPosition = [];
      portalPosition.push(1 + Math.floor(Math.random() * 6));
      portalPosition.push(1 + Math.floor(Math.random() * 3));
      return portalPosition;
    }

    //USER MOVES
    function playerMoves(event) {
      switch (event.which) {
        case 32:
          playerSpecialAttack();
          specialCasted();
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

    function playerSpecialAttack() {
      if (specialAttackCast < 1) {
        specialAttackCast--;
        return false;
      }
      playerSpecialAttackEffects();
      specialAttack = setInterval(playerSpecialAttackEffects, 999);
      setTimeout(function () {
        clearInterval(specialAttack);
      }, 1000);
      specialAttackCast--;
    }

    function playerSpecialAttackEffects() {
      $player.toggleClass(playerSpecialAttackClassSelector);
      $specialAttack.toggleClass(hiddenClass);
    }

    function playerDash() {
      if (checkDash() && isMirror()) {
        playerDashLeft();
      } else if (checkDash() && !isMirror()) {
        playerDashRight();
      }
    }

    function playerDashLeft() {
      const playerLeft = $player.offset().left;
      const playerLeftDash = playerLeft - playerLeft * 0.3;
      if (playerLeftDash < gameScreenLeft) {
        //if($player.offset().left-($player.offset().left-$player.offset().left*0.3)>$player.offset().left-$mainScreen.offset().left){
        return false;
      } else {
        $player.animate({
          left: '-=20%'
        }, {
          duration: 90,
          progress: () => storeCollisionPlayer()
        });
      }
    }

    function playerDashRight() {
      const gameScreenRight = (gameScreenLeft + $mainScreen.outerWidth());
      const playerRight = $player.offset().left + $player.outerWidth(true);
      const playerRightDash = playerRight + playerRight * 0.3;
      if (playerRightDash > gameScreenRight) {
        return false;
      } else {
        $player.animate({
          left: '+=20%'
        }, {
          duration: 90,
          progress: () => storeCollisionPlayer()
        });
      }
    }

    function playerLeftMove() {
      if (playerCheckLeftMirror()) {
        $player.animate({ left: '-=3%' }, 1);
        return false;
      } else if (playerCheckLeftNoMirror()) {
        mirror();
        $player.animate({ left: '-=3%' }, 1);
        return false;
      }
    }

    function playerRightMove() {
      if (playerCheckRightMirror()) {
        return false;
      } else if (playerCheckRightNoMirror()) {
        mirror();
        $player.animate({ left: '+=3%' }, 1);
        return false;
      }
      $player.animate({ left: '+=3%' }, 1);
    }

    function playerUpMove() {
      if (playerCheckUp()) {
        return false;
      }
      $player.animate({ top: '-=2%' }, 1);
    }

    function playerDownMove() {
      if (playerCheckDown()) {
        return false;
      }
      $player.animate({ top: '+=2%' }, 1);
    }

    //CHECKS FENCES
    function isMirror() {
      return ($player.hasClass('mirror'));
    }

    function playerCheckUp() {
      return (($player.offset().top - $player.offset().top * 0.01) <= gameScreenBottom * 0.5);
    }

    function playerCheckDown() {
      return (($player.offset().top - $player.offset().top * 0.01) >= gameScreenBottom - $player.outerHeight());
    }

    function playerCheckRightMirror() {
      return (($player.offset().left + ($player.offset().left) * 0.09) >= gameScreenRight);
    }

    function playerCheckRightNoMirror() {
      return (($player.offset().left + ($player.offset().left) * 0.09) < gameScreenRight + $player.outerWidth() && $player.hasClass('mirror'));
    }

    function playerCheckLeftMirror() {
      return (($player.offset().left - $player.offset().left * 0.01) >= gameScreenLeft && $player.hasClass('mirror'));
    }

    function playerCheckLeftNoMirror() {
      return (($player.offset().left - $player.offset().left * 0.01) >= gameScreenLeft && !$player.hasClass('mirror'));
    }

    function checkDash() {
      if ($player.hasClass(playerCollidedClassSelector) || $player.hasClass(playerSpecialAttackClassSelector)) {
        return false;
      }
      return true;
    }

    function mirror() {
      $player.toggleClass('mirror');
    }

    //OTHERS
    function playerCollidedEffects() {
      $player.toggleClass(playerCollidedClassSelector);

    }

    function specialCasted() {
      ($specialAttackList + ' li:last').remove();
      if (specialAttackCast >= 0) {
        addLife();
      }
    }

    function addLife() {
      if (lifes < 6) {
        $lifes.append(life);
        lifes++;
      }
    }

    function finalScore() {
      $finalScore.text($points);
    }

    //TOGGLES
    function showUltraBoss() {
      $boss.toggleClass(ultraBossClass);
    }

    function showMainScreen() {
      $mainScreen.toggleClass(hiddenClass);

    }
    function showInstructionsScreen() {
      $instructionsScreen.toggleClass(hiddenClass);

    }
    function hidePauseScreen() {
      $pauseScreen.addClass(hiddenClass);
    }
    function showGameOverScreen() {
      $gameOverScreen.toggleClass(hiddenClass);
      $mainScreen.toggleClass('main-screen-game-over');
    }
    function hideStatsScreen() {
      $stats.toggleClass(hiddenClass);
    }

    //WIN OR LOSE
    function checkLose() {
      if (lifes < 1) {
        stopLevelUp();
        stopCPUMovement();
        stopPortal();
        stopPoints();
        finalScore();
        hideStatsScreen();
        showGameOverScreen();
        $boss.removeClass(ultraBossClass);
        $boss.addClass('boss-game-over');
        bossSong.pause();
        gameOverSong.play();
        lose = true;
      }
    }

    //GET NEW COORDINATES IF WINDOW IS RESIZED
    $(window).resize(resizeWindow);
    function resizeWindow() {

      gameScreenTop = $mainScreen.offset().top;
      gameScreenLeft = $mainScreen.offset().left;
      gameScreenRight = (gameScreenLeft + $mainScreen.outerWidth());
      gameScreenBottom = (gameScreenTop + $mainScreen.outerHeight());

    }

    //EVENT TO START CAPTURE PLAYER MOVEMENT
    $(window).keydown(function () {
      if (!lose) {
        playerMoves(event);
      }
    });


    //BUTTONS MENU
    $('#play').one('click', function (event) {
      mainSong.pause();
      for (let i = 0; i < lifes; i++) {
        $lifes.append(life);
      }
      for (let i = 0; i < specialAttackCast; i++) {
        $specialAttackList.append(specialAttackIcon);
      }
      event.preventDefault();
      hidePauseScreen();
      showMainScreen();
      if (!$instructionsScreen.hasClass(hiddenClass)) {
        showInstructionsScreen();
      }
      resizeWindow();
    });

    $('#restart').on('click', function () {
      location.reload();
    });

    $('#instructions').one('click', function (event) {
      event.preventDefault();
      hidePauseScreen();
      showInstructionsScreen();
    });
  }

  $('#mute-button').one('click', function () {
    mainSong.play();
  });

  play();
});
