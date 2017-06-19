//Game settings & data
var app = {};
//Game trackers
  //check for 1st phase of selecting your character
  app.goNoGoSC = true; 
  //check for 1st phase of selecting your enemy
  app.goNoGoSE = false;  
  //number of defeated enemies
  app.defeatedEnemies = 0; 
//character data
app.charList = {};
  app.charList["Young Obi-Wan Kenobi"] = [6,12,150];
  app.charList["Mace Windu"] = [8,16,120];
  app.charList["Darth Maul"] = [10,8,140];
  app.charList["Count Dooku"] = [12,10,110];

//pseudoclassical pattern to construct Star Wars character objects
var SWcharConstructor = function (name, baseAP, CAP, baseHP){
  this.name = name; 
  this.baseAP = baseAP;
  this.nowAP = baseAP; 
  this.CAP = CAP;
  this.baseHP = baseHP;
  this.nowHP = baseHP; 
}
//game logic for the 'attack' method
SWcharConstructor.prototype.attack = function (enemy){
  var oldAP = this.nowAP; 
  this.nowAP += this.baseAP; 
  enemy.nowHP -= oldAP;
  this.nowHP -= enemy.CAP;  
  console.log(`You takes ${enemy.CAP} damages and has ${this.nowHP} health left`);
  console.log(`${enemy.name} takes ${oldAP} damages and has ${enemy.nowHP} health left`);
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

  //Clear all on-screen characters and restart button 
  $('.char').remove();
  $('#startOver').css('display', 'none');

  //Render all chars for user to choose from
  console.log('Rendering all characters for user to choose from')  
    //spacer helper function for Bootstrap
    function spacer() {
      var spacerDiv = $('<div>');
      spacerDiv.addClass('col-md-2 char spacer');
      
      $('#char-select').append(spacerDiv);
    }
  //Rendering logic
  spacer();  
  _.each(app.SWcharObj, (v) => {
    var charToChoose = $('<div>');
    charToChoose.addClass('char col-xs-6 col-sm-3 col-md-2');
    charToChoose.css({'border': '4px solid green'});
    charToChoose.attr('data', v.name);
    var nameh3 = $('<h3 class="char-name">');
    nameh3.text(v.name);
    charToChoose.append(nameh3);
    var HPh3 = $('<h3 class="HP">');
    HPh3.text(v.nowHP);
    charToChoose.append(HPh3);
    //adds on-click event listener to each character
    charToChoose.on('click', function() {
      console.log($(this).attr('data'), 'is being clicked!')
      //logic for selecting a character to be your character
      if (that.goNoGoSC) {
        $(this).addClass('chosen');
        $('#your-char').append($(this));
        var remainingChars = $('#char-select').find('.char');
        remainingChars.css({'border-color': 'yellow', 'background-color': 'red'});
        remainingChars.addClass('not-chosen');
        remainingChars.appendTo('#enemies');
        $('.spacer').css({'background-color': 'white', 'border': 'none'})
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
          that.goNoGoSE = false; 
        }
      }
    })
    $('#char-select').append(charToChoose);
  })
  spacer(); 
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
    $('#your-char > .chosen').find('.HP').text( app.SWcharObj[yourName].nowHP);
    $('#your-enemy > .chosen').find('.HP').text( app.SWcharObj[enemyName].nowHP);
    //losing condition
    if (app.SWcharObj[yourName].nowHP < 1){
      //FIX!!!
      console.log('you lose');
      $('#startOver').toggle();
    } 
    //Moving onto next enemy condition
    else if (app.SWcharObj[enemyName].nowHP < 1){
      console.log(`you defeated ${enemyName}`)
       $('#your-enemy > .chosen').remove();
      app.goNoGoSE = true; 
      app.defeatedEnemies ++; 
      if (app.defeatedEnemies === 3){
        //FIX!!
        console.log('you win!')
        $('#startOver').toggle();
      } 
    }
  }
})

$('#startOver').on('click', () => (app.initialize()));