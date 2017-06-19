//Game settings & data
var app = {};
//check for 1st phase of selecting your character
app.goNoGoSC = true; 
//check for 1st phase of selecting your enemy
app.goNoGoSE = false;  
//character data
app.charList = {};
  app.charList["Obi-Wan Kenobi"] = [0,0,120];
  app.charList["Mace Windu"] = [0,0,100];
  app.charList["Count Dooku"] = [0,0,150];
  app.charList["Darth Maul"] = [0,0,120];

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
  console.log(`${this.name} is attacking ${enemy.name}`)
  var oldAP = this.nowAP; 
  this.nowAP += this.baseAP; 
  enemy.nowHP -= oldAP;
  this.nowHP -= enemy.CAP;  
  console.log(`${this.name} takes ${enemy.CAP} damages and ${enemy.name} takes ${oldAP} damages`)
}


//instantiating each SW character 
app.SWcharObj = {};
for (var key in app.charList) {
 app.SWcharObj[key] = new SWcharConstructor(key, ...app.charList[key]);
}
console.log('app.SWcharObj is: ', app.SWcharObj);

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

  //Clear all on-screen characters 
  $('.char').remove();

  //Render all chars for user to choose from
  console.log('Rendering all characters for user to choose from')  
    //spacer helper function for Bootstrap
    function spacer() {
      var spacerDiv = $('<div>');
      spacerDiv.addClass('col-md-2');
      
      $('#char-select').append(spacerDiv);
    }
  //Rendering logic
  spacer();  
  _.each(app.SWcharObj, (v) => {
    var charToChoose = $('<div>');
    charToChoose.addClass('char col-xs-6 col-sm-3 col-md-2');
    charToChoose.attr('data', v.name)
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
        that.goNoGoSC = false;  
        that.goNoGoSE = true; 
      } 
      //logic for selecting a character to be your enemy
      else if (that.goNoGoSE) {
        if($(this).hasClass('not-chosen')) {
          $(this).addClass('chosen');
          $(this).removeClass('not-chosen');
          $('#your-enemy').append($(this));
          that.goNoGoSE = false; 
        }
      }
    })
    $('#char-select').append(charToChoose);
  })
  spacer(); 
}

app.initialize();

$('button').on('click', function(){
  if (!app.goNoGoSC && !app.goNoGoSE) {
    var yourName = $('#your-char > .chosen').attr('data');
    var enemyName = $('#your-enemy > .chosen').attr('data');
    console.log(yourName,'attacks', enemyName);

  }
})