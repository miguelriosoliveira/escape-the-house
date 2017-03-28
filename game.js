var canvas = document.getElementById('gameScreen');
var context = canvas.getContext('2d');
var canvasBoundingBox = canvas.getBoundingClientRect();

var mouseClickX = -1;
var mouseClickY = -1;
var mousePosX = -1;
var mousePosY = -1;

var fontSize = 30;
var locationX = canvas.width * 0.05;
var locationY = canvas.height * 0.95;

var video = document.getElementById("transition");

// ===================== CLASSE CLICKABLE =====================

var Clickable = function (x, y) {
    this.x = x;
    this.y = y;

    this.isSelected = function (mouseX, mouseY) {
        var isInsideWidth = false;
        var isInsideHeight = false;

        if (this.x <= mouseX && mouseX <= this.x + this.width) isInsideWidth = true;
        if (this.y <= mouseY && mouseY <= this.y + this.height) isInsideHeight = true;

        if (isInsideWidth && isInsideHeight) {
            return true;
        }
        return false;
    };
};

// ===================== CLASSE OBJETO =====================

var Object = function (x, y, width, height) {
    Clickable.call(this, x, y);
    this.width = width;
    this.height = height;
};

// ===================== CLASSE LOCAL =====================

var Location = function (name, x, y, font) {
    Clickable.call(this, x, y);
    this.name = name;
    this.font = font;
    this.height = -parseInt(font.substring(0, 2));

    this.writeInCanvas = function (context) {
        context.fillStyle = 'red';
        context.strokeStyle = 'black';
        context.font = this.font;
        context.fillText(this.name, this.x, this.y);
        context.strokeText(this.name, this.x, this.y);

        this.width = context.measureText(this.name).width;
    };

    this.isSelected = function (mouseX, mouseY) {
        var isInsideWidth = false;
        var isInsideHeight = false;

        if (this.x <= mouseX && mouseX <= this.x + this.width) isInsideWidth = true;
        if (this.y >= mouseY && mouseY >= this.y + this.height) isInsideHeight = true;

        if (isInsideWidth && isInsideHeight) {
            return true;
        }
        return false;
    };
};

// ===================== CLASSE CENÁRIO =====================

writeLocations = function () {
    for (var i = 0; i < currentScenario.locationList.length; i++) {
        var location = currentScenario.locationList[i];
        location.writeInCanvas(context);
    }
};

var Scenario = function (sceneObjects, locationList, backgroundImage) {
    this.sceneObjects = sceneObjects;
    this.locationList = locationList;
    this.backgroundImage = backgroundImage;

    // muda o cenário atual para o que chamar este método
    // (muda imagem de fundo, lista de itens e lista de locais para movimentação)
    this.chooseMe = function () {
        context.clearRect(0, 0, canvas.width, canvas.height);
        var scene = new Image();
        scene.onload = function () {
            context.drawImage(scene, 0, 0, canvas.width, canvas.height);
            writeLocations();
        };
        scene.src = this.backgroundImage;

        // // lista de itens
        // var itemBox = document.getElementById('body_itemBox');
        // itemBox.innerHTML = '';

        // for (var i = 0; i < this.sceneObjects.length; i++) {
        // 	var label = document.createTextNode('Item ' + (i+1));

        // 	var item = document.createElement("input");
        // 	item.setAttribute('type', 'checkbox');
        // 	item.setAttribute('id', 'item' + i);
        // 	item.disabled = "disabled";

        // 	itemBox.appendChild(item);
        // 	itemBox.appendChild(label);
        // 	itemBox.appendChild( document.createElement("br") );
        // };
    };
};

drawTransition = function (v) {
    if (v.ended || (v.currentTime >= currentTransition.end)) {
        //desenha o prox cenario
        currentScenario = scenarios[currentTransition.sceneEnd];
        currentScenarioName = currentTransition.sceneEnd;
        currentScenario.chooseMe();

        // play na musica (após primeira transição)
        if (currentTransition.id == 'acordando') {
            var firstMusic = document.getElementById('1');
            firstMusic.click();
        }
        return false;
    }
    context.drawImage(v, 0, 0, canvas.width, canvas.height);
    setTimeout(drawTransition, 20, v);
};

var Transition = function (id, src, begin, end, sceneEnd) {
    this.id = id;
    this.src = src;
    this.begin = begin;
    this.end = end;
    this.sceneEnd = sceneEnd;

    this.play = function () {
        var videoPlayer = document.getElementById('transition');
        currentTransition = this;
        videoPlayer.setAttribute('src', this.src);

        videoPlayer.addEventListener('play', function () {
            drawTransition(this);
            this.removeEventListener('play', arguments.callee);
        }, false);
        videoPlayer.addEventListener('loadeddata', function () {
            videoPlayer.currentTime = currentTransition.begin;
            videoPlayer.play();
            this.removeEventListener('loadeddata', arguments.callee);
        });
    };
};

// ===================== LOCAIS DA CASA =====================

var transitionList = {};
transitionList['Acordando'] = new Transition('acordando', 'Videos/anim-01.MP4', 32, 100, 'Quarto');
transitionList['QuartoCorredor'] = new Transition('QuartoCorredor', 'Videos/anim-02.MP4', 2, 100, 'Corredor');
transitionList['QuartoGuardaRoupas'] = new Transition('QuartoGuardaRoupas', 'Videos/arrumar.MP4', 3, 100, 'Quarto');
transitionList['QuartoMesa'] = new Transition('QuartoMesa', 'Videos/indoMesa.MP4', 0, 7, 'Mesa');
transitionList['PegandoCoisas'] = new Transition('PegandoCoisas', 'Videos/pegandoCoisas.MP4', 0, 16, 'Mesa2');
transitionList['MesaQuarto'] = new Transition('MesaQuarto', 'Videos/voltandoDaMesa.MP4', 0, 100, 'Quarto');
transitionList['Mesa2Quarto'] = new Transition('Mesa2Quarto', 'Videos/voltandoDaMesa.MP4', 0, 100, 'Quarto');
transitionList['CorredorQuarto'] = new Transition('CorredorQuarto', 'Videos/anim-06.MP4', 3, 9, 'Quarto');
transitionList['CorredorCozinha'] = new Transition('CorredorCozinha', 'Videos/anim-04.MP4', 3, 100, 'Cozinha');
transitionList['CorredorBanheiro'] = new Transition('CorredorBanheiro', 'Videos/BanheiroCorredorTransit.mp4', 0, 12, 'Corredor');
transitionList['CozinhaCorredor'] = new Transition('CozinhaCorredor', 'Videos/anim-05.MP4', 4, 14, 'Corredor');
transitionList['Cafe'] = new Transition('Cafe', 'Videos/cafe.MP4', 2, 100, 'Cozinha');
transitionList['CorredorSair'] = new Transition('CorredorSair', 'Videos/fim.MP4', 4, 100, 'Sair');

var corredorLocationList = [];
corredorLocationList.push(new Location('Banheiro', locationX, locationY - fontSize * corredorLocationList.length, fontSize + 'px Arial'));
corredorLocationList.push(new Location('Cozinha', locationX, locationY - fontSize * corredorLocationList.length, fontSize + 'px Arial'));
corredorLocationList.push(new Location('Quarto', locationX, locationY - fontSize * corredorLocationList.length, fontSize + 'px Arial'));
corredorLocationList.push(new Location('Sair', locationX, locationY - fontSize * corredorLocationList.length, fontSize + 'px Arial'));

var kitchenLocationList = [];
kitchenLocationList.push(new Location('Corredor', locationX, locationY - fontSize * kitchenLocationList.length, fontSize + 'px Arial'));

var guardaRoupaLocationList = [];
guardaRoupaLocationList.push(new Location('Quarto', locationX, locationY - fontSize * guardaRoupaLocationList.length, fontSize + 'px Arial'));

var mesaLocationList = [];
mesaLocationList.push(new Location('Quarto', locationX, locationY - fontSize * mesaLocationList.length, fontSize + 'px Arial'));

var bedroomLocationList = [];
bedroomLocationList.push(new Location('Corredor', locationX, locationY - fontSize * bedroomLocationList.length, fontSize + 'px Arial'));
bedroomLocationList.push(new Location('Mesa', locationX, locationY - fontSize * bedroomLocationList.length, fontSize + 'px Arial'));

// =============== OBJETOS DA CENA 1 (Quarto, guarda-roupas e mesa) ===============

var guardaRoupas = new Object(0, 230, 130, 220);
var bedroomObjects = [guardaRoupas];

var carteira = new Object(380, 320, 90, 65);
var chaves = new Object(515, 315, 60, 60);
var tableObjects = [carteira, chaves];

// =============== OBJETOS DA CENA 3 (Cozinha) ===============

var cafe = new Object(675, 455, 45, 75);
var kitchenObjects = [cafe];

// ======================= CENÁRIOS =======================

var scenarios = {};
// scenarios['Guarda-roupas'] = new Scenario(closetObjects, guardaRoupaLocationList, 'GuardaRoupas.jpg');
scenarios['Mesa'] = new Scenario(tableObjects, mesaLocationList, 'Mesa.jpg');
scenarios['Mesa2'] = new Scenario([], mesaLocationList, 'MesaVazia.jpg');
scenarios['Quarto'] = new Scenario(bedroomObjects, bedroomLocationList, 'Quarto.jpg');
scenarios['Cozinha'] = new Scenario(kitchenObjects, kitchenLocationList, 'Cozinha.jpg');
scenarios['Corredor'] = new Scenario([], corredorLocationList, 'Corredor.jpg');
scenarios['Sair'] = new Scenario([], [], 'Fim.jpg');

// console.log(scenarios.length);

var currentScenario = scenarios['Quarto'];
var currentScenarioName = 'Quarto';

// var currentScenario = scenarios['Corredor'];
// var currentScenarioName = 'Corredor';

// currentScenario.chooseMe();

// ==================== EVENT LISTENERS ====================

// verifica se clicou em algum objeto com highlight (ou em algum local da lista)
canvas.addEventListener("click", function (event) {
    mouseClickX = Math.round(event.clientX - canvasBoundingBox.left);
    mouseClickY = Math.round(event.clientY - canvasBoundingBox.top);

    // console.log("(" + clickX + " , " + clickY + ")");

    // se clicou em algum objeto do cenário, muda estado do checkbox correspondente
    for (var i = 0; i < currentScenario.sceneObjects.length; i++) {
        var object = currentScenario.sceneObjects[i];

        if (object.isSelected(mouseClickX, mouseClickY)) {
            // marcar checkbox correspondente
            var itemCheckbox;
            var checkboxState;

            if (currentScenarioName == 'Cozinha') {
                itemCheckbox = document.getElementById('item2');
                transitionList['Cafe'].play();
            }
            else if (currentScenarioName == 'Quarto') {
                itemCheckbox = document.getElementById('item1');
                transitionList['QuartoGuardaRoupas'].play();
            }
            else if (currentScenarioName == 'Mesa') {
                if (i == 0) itemCheckbox = document.getElementById('item4').checked = !document.getElementById('item4').checked;
                if (i == 1) itemCheckbox = document.getElementById('item5').checked = !document.getElementById('item5').checked;

                if (document.getElementById('item4').checked && document.getElementById('item5').checked) {
                    transitionList['PegandoCoisas'].play();
                }
                return;
            }
            checkboxState = itemCheckbox.checked;
            itemCheckbox.checked = !checkboxState;

            return;
        }
    }
    // se clicou em algum local da lista de locais, muda para o cenário correspondente
    for (var i = 0; i < currentScenario.locationList.length; i++) {
        var location = currentScenario.locationList[i];

        if (location.isSelected(mouseClickX, mouseClickY)) {
            if (location.name == 'Banheiro') {
                var itemCheckbox = document.getElementById('item3');
                var checkboxState = itemCheckbox.checked;
                itemCheckbox.checked = !checkboxState;
            }

            // mudar para cenário correspondente
            if (location.name == 'Sair') {
                var fezTarefa1 = document.getElementById('item1').checked;
                var fezTarefa2 = document.getElementById('item2').checked;
                var fezTarefa3 = document.getElementById('item3').checked;
                var fezTarefa4 = document.getElementById('item4').checked;
                var fezTarefa5 = document.getElementById('item5').checked;

                if (fezTarefa1 && fezTarefa2 && fezTarefa3 && fezTarefa4 && fezTarefa5) {
                    var nextTransition = currentScenarioName + location.name;
                    transitionList[nextTransition].play();
                } else {
                    alert("VOCÊ AINDA NÃO FEZ TODAS AS TAREFAS!");
                }
                return;
            }
            var nextTransition = currentScenarioName + location.name;
            transitionList[nextTransition].play();
            return;
        }
    }
});

// salva a posição atual do mouse no canvas
canvas.addEventListener("mousemove", function (event) {
    mousePosX = Math.round(event.clientX - canvasBoundingBox.left);
    mousePosY = Math.round(event.clientY - canvasBoundingBox.top);

    drawHighlights();

    // console.log("(" + mousePosX + " , " + mousePosY + ")");
});

// ==================== FUNÇÕES DE DESENHO ====================

// desenha barra de itens
function drawItemBox() {
    var x = canvas.width * 0.05;
    var y = canvas.height * 0.01;
    var width = canvas.width - canvas.width * 0.1;
    var height = canvas.height * 0.15;

    context.beginPath();
    context.fillStyle = 'rgba(0, 0, 0, 0.5)';
    context.fillRect(x, y, width, height);
    context.closePath();
}

// desenhar highlights dos objetos e dos locais
function drawHighlights() {
    // objetos
    for (var i = 0; i < currentScenario.sceneObjects.length; i++) {
        var object = currentScenario.sceneObjects[i];

        if (object.isSelected(mousePosX, mousePosY)) {
            context.beginPath();
            context.strokeStyle = 'red';
            context.strokeRect(object.x, object.y, object.width, object.height);
            context.closePath();
            return;
        }
    }
}

//wipes the canvas context
function clear(c) {
    c.clearRect(0, 0, canvas.width, canvas.height);
}

// ==================== AUDIO  ====================

function playAudio(idRadioButton) {
    var player = document.getElementById("gameRadio");

    switch (idRadioButton) {
        case 1:
            var newSourceAudio = document.getElementById("nowPlaying");
            newSourceAudio.src = "audio/track1.mp3";
            player.load();
            player.play();
            break;
        case 2:
            var newSourceAudio = document.getElementById("nowPlaying");
            newSourceAudio.src = "audio/track2.mp3";
            player.load();
            player.play();
            break;
        case 3:
            var newSourceAudio = document.getElementById("nowPlaying");
            newSourceAudio.src = "audio/track3.mp3";
            player.load();
            player.play();
            break;
        case 4:
            var newSourceAudio = document.getElementById("nowPlaying");
            newSourceAudio.src = "audio/track4.mp3";
            player.load();
            player.play();
            break;
        default:
            sourceAudio.src = "";
            player.load();
            player.pause();
    }
}

function audioButtonAction() {

    var button = document.getElementById("button_box1");
    var div = document.getElementById("body_box1");
    // div.style.display = 'none';

    button.onclick = function () {
        if (div.className === "hidden") {
            div.className = "visible";
            button.innerHTML = "CLIQUE AQUI PARA ESCONDER";
        } else if (div.className === "visible") {
            div.className = "hidden";
            button.innerHTML = "CLIQUE AQUI PARA VER A PLAYLIST";
        }
    };

    // var firstMusic = document.getElementById(nMusica);
    // firstMusic.click();
}

// ==================== LOOP PRINCIPAL  ====================

window.onload = function () {
    transitionList['Acordando'].play();
    audioButtonAction();
    // currentScenario.chooseMe();
};