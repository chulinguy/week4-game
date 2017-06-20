//Game settings & data
var app = {};
//Game trackers
  //state checker for 1st phase of selecting your character
  app.goNoGoSC = true; 
  //state checker for 2nd phase of selecting your enemy
  app.goNoGoSE = false;  
  //number of defeated enemies
  app.defeatedEnemies = 0; 
//era-selecting function
app.hideDifferentEra = function (era) {
  console.log('hiding characters from different era, current era is', era)
  $('.char').each(function () {
     if ($(this).hasClass(era)) {
     } else {
      console.log(`hiding ${this}`)
      $(this).addClass('hidden');
     }
  })
}

//character data
app.charList = {};
  app.charList["Young Obi-Wan Kenobi"] = [6,14,150, 'prequels', 'Attack: lightsaber (Form IV Ataru)'];
  app.charList["Mace Windu"] = [8,18,120, 'prequels', 'Attack: lightsaber (Form VII Vaapad)'];
  app.charList["Darth Maul"] = [10,10,140, 'prequels', 'Attack: lightsaber (Form VI Niman)'];
  app.charList["Count Dooku"] = [12,12,110, 'prequels', 'Attack: lightsaber (Form II Makashi)'];
  app.charList["Luke Skywalker"] = [7,15,145, 'original trilogy', 'Attack: lightsaber (Form V Djem So)'];
  app.charList["Old Obi-Wan Kenobi"] = [8,19,115, 'original trilogy', 'Attack: lightsaber (Form III Soresu)'];
  app.charList["Darth Vader"] = [11,10,130, 'original trilogy', 'Attack: lightsaber (Form V Djem So)'];
  app.charList["Old Darth Sidious"] = [13,12,105, 'original trilogy', 'Attack: Force Lightning'];

//pseudoclassical pattern to construct Star Wars character objects
var SWcharConstructor = function (name, baseAP, CAP, baseHP, era, form){
  this.name = name; 
  this.baseAP = baseAP;
  this.nowAP = baseAP; 
  this.CAP = CAP;
  this.baseHP = baseHP;
  this.nowHP = baseHP; 
  this.era = era; 
  this.form = form;
}
//game logic for the 'attack' method
SWcharConstructor.prototype.attack = function (enemy){
  var oldAP = this.nowAP; 
  this.nowAP += this.baseAP; 
  enemy.nowHP -= oldAP;
  this.nowHP -= enemy.CAP;  
  $('#fight-text').text(`You take ${enemy.CAP} damages and have ${this.nowHP} health left ... ${enemy.name} takes ${oldAP} damages and has ${enemy.nowHP} health left`);
}

//instantiating each SW character 
app.SWcharObj = {};
for (var key in app.charList) {
 app.SWcharObj[key] = new SWcharConstructor(key, ...app.charList[key]);
}

//initializing logic 
app.initialize = function (){
  var that = this; 
  //reset values
  _.each(this.SWcharObj, (v) => {
    v.nowHP = v.baseHP;
    v.nowAP = v.baseAP; 
  })
  this.goNoGoSC = true;
  this.goNoGoSE = false; 
  this.defeatedEnemies = 0;  

  //Clear all on-screen characters, fight-text, restart button 
  $('.char').remove();
  $('#fight-text').text();
  $('#startOver').css('display', 'none');
  $('#fight-text').text(`Pick your character!\nHint: in general, younger characters have more HP and older characters have more attack and counter-attack power;\nSiths have more attack power and Jedis have more counter-attack power.`)
  //remove the hidden class
  $('.char').removeClass('hidden');
  //Render all chars for user to choose from
  console.log('Rendering all characters for user to choose from')  
  //Rendering logic
  _.each(that.SWcharObj, (v) => {
    var charToChoose = $('<div>');
    charToChoose.addClass('char col-xs-6 col-sm-3');
    charToChoose.addClass(v.era)
    charToChoose.css({'border': '4px solid green'});
    charToChoose.attr('data', v.name);
    //adds images to divs
    var SWcharIMG = $('<img>');
    SWcharIMG.attr('src', `assets/images/${v.name}.png`)
    charToChoose.append(SWcharIMG);
     //adds character names to divs
    var nameh3 = $('<h3 class="char-name">');
    nameh3.text(v.name);
    charToChoose.append(nameh3);
    //adds attack form names to divs
    var formh3 = $('<h3 class="char-attack">');
    formh3.text(v.form);
    charToChoose.append(formh3);
    //adds HP to divs
    var HPh3 = $('<h3 class="HP">');
    HPh3.text(`${v.nowHP} HP`);
    charToChoose.append(HPh3);
    //adds on-click event listener to each character
    charToChoose.on('click', function() {
      console.log($(this).attr('data'), 'is being clicked!')
      //logic for selecting a character to be your character
      if (that.goNoGoSC) {
        //move chosen characters
        $(this).addClass('chosen');
        $('#your-char').append($(this));
        //move non chosen charaters
        var remainingChars = $('#char-select').find('.char');
        remainingChars.css({'border-color': 'yellow', 'background-color': 'pink'});
        remainingChars.addClass('not-chosen');
        remainingChars.appendTo('#enemies');
        //Hide characters from a different era
        var nowEra = that.SWcharObj[$(this).attr('data')].era;
        that.hideDifferentEra(nowEra);
        //update colors and fight-text
        $('.spacer').css({'background-color': 'white', 'border': 'none'});
        //FIX
        $('#fight-text').text(`Based on your selection, only characters from the ${nowEra} era are shown.\nPick your enemy character!`);
        //update state checkers
        that.goNoGoSC = false;  
        that.goNoGoSE = true; 
      } 
      //logic for selecting a character to be your enemy
      else if (that.goNoGoSE) {
        if($(this).hasClass('not-chosen')) {
          $(this).addClass('chosen');
          $(this).removeClass('not-chosen');
          $(this).css({'border-color': 'green', 'background-color': 'lightblue'});
          $('#your-enemy').append($(this));
          //update fight text
          $('#fight-text').text('Let the fight begin!')
          //update state checker
          that.goNoGoSE = false; 
        }
      }
    })
    $('#char-select').append(charToChoose);
  })
}
//logic for initializing
$('#startOver').toggle();
app.initialize();

//Main game logic for attacking & defending
$('#attack').on('click', function(){
  if (!app.goNoGoSC && !app.goNoGoSE) {
    var yourName = $('#your-char > .chosen').attr('data');
    var enemyName = $('#your-enemy > .chosen').attr('data');
    console.log(yourName,'attacks', enemyName);
    //calling the attack method
    (app.SWcharObj[yourName]).attack(app.SWcharObj[enemyName]);
    //update HPs displayed
    $('#your-char > .chosen').find('.HP').text( `${app.SWcharObj[yourName].nowHP} HP`);
    $('#your-enemy > .chosen').find('.HP').text( `${app.SWcharObj[enemyName].nowHP} HP`);
    //losing condition
    if (app.SWcharObj[yourName].nowHP < 1){
      $('#fight-text').text('Oh no! You lost all your HP! Press the Restart Button to start a new game');
      $('#startOver').toggle();
    } 
    //Moving onto next enemy condition
    else if (app.SWcharObj[enemyName].nowHP < 1){
      $('#fight-text').text(`you defeated ${enemyName}! Pick your next enemy!`);
      $('#your-enemy > .chosen').remove();
      app.goNoGoSE = true; 
      app.defeatedEnemies ++; 
      //Win condition
      if (app.defeatedEnemies === 3){
        $('#fight-text').text('You defeated all enemies and won! Press the Restart Button to start a new game')
        $('#startOver').toggle();
      } 
    }
  }
})
//Restart button logic
$('#startOver').on('click', () => (app.initialize()));