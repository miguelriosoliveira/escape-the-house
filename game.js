let canvas = document.getElementById('gameScreen');
let context = canvas.getContext('2d');
let canvasBoundingBox = canvas.getBoundingClientRect();

let mouseClickX = -1;
let mouseClickY = -1;
let mousePosX = -1;
let mousePosY = -1;

let fontSize = 30;
let locationX = canvas.width * 0.05;
let locationY = canvas.height * 0.95;

let currentTransition;

// ===================== CLASSE CLICKABLE =====================

let Clickable = function (x, y) {
    this.x = x;
    this.y = y;

    this.isSelected = function (mouseX, mouseY) {
        let isInsideWidth = this.x <= mouseX && mouseX <= this.x + this.width;
        let isInsideHeight = this.y <= mouseY && mouseY <= this.y + this.height;
        return isInsideWidth && isInsideHeight;
    };
};

// ===================== CLASSE OBJETO =====================

let Object = function (x, y, width, height) {
    Clickable.call(this, x, y);
    this.width = width;
    this.height = height;
};

// ===================== CLASSE LOCAL =====================

let Location = function (name, x, y, font) {
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
        let isInsideWidth = this.x <= mouseX && mouseX <= this.x + this.width;
        let isInsideHeight = this.y >= mouseY && mouseY >= this.y + this.height;
        return isInsideWidth && isInsideHeight;
    };
};

// ===================== CLASSE CENÁRIO =====================

function writeLocations() {
    for (let i = 0; i < currentScenario.locationList.length; i++) {
        let location = currentScenario.locationList[i];
        location.writeInCanvas(context);
    }
}

let Scenario = function (sceneObjects, locationList, backgroundImage) {
    this.sceneObjects = sceneObjects;
    this.locationList = locationList;
    this.backgroundImage = backgroundImage;

    // muda o cenário atual para o que chamar este método
    // (muda imagem de fundo, lista de itens e lista de locais para movimentação)
    this.chooseMe = function () {
        context.clearRect(0, 0, canvas.width, canvas.height);
        let scene = new Image();
        scene.onload = function () {
            context.drawImage(scene, 0, 0, canvas.width, canvas.height);
            writeLocations();
        };
        scene.src = this.backgroundImage;
    };
};

function drawTransition(v) {
    if (v.ended || (v.currentTime >= currentTransition.end)) {

        if (!currentScenario)return;

        //desenha o prox cenario
        currentScenario = scenarios[currentTransition.sceneEnd];
        currentScenarioName = currentTransition.sceneEnd;
        currentScenario.chooseMe();

        // play na musica (após primeira transição)
        if (currentTransition.id == 'acordando') {
            let firstMusic = document.getElementById('1');
            firstMusic.click();
        }
        return false;
    }
    context.drawImage(v, 0, 0, canvas.width, canvas.height);
    setTimeout(drawTransition, 20, v);
}

let Transition = function (id, src, begin, end, sceneEnd) {
    this.id = id;
    this.src = src;
    this.begin = begin;
    this.end = end;
    this.sceneEnd = sceneEnd;

    this.play = function () {
        let videoPlayer = document.getElementById('transition');
        currentTransition = this;
        videoPlayer.setAttribute('src', this.src);

        videoPlayer.addEventListener('play', function () {
            drawTransition(this);
            this.removeEventListener('play', videoPlayer);
            // this.removeEventListener('play', arguments.callee);
        }, false);
        videoPlayer.addEventListener('loadeddata', function () {
            videoPlayer.currentTime = currentTransition.begin;
            videoPlayer.play();
            this.removeEventListener('loadeddata', videoPlayer);
            // this.removeEventListener('loadeddata', arguments.callee);
        });
    };
};

// ===================== LOCAIS DA CASA =====================

let [transitionList, path] = [{}, "resources/videos/"];
transitionList['Acordando'] = new Transition('acordando', `${path}beginning.mp4`, 32, 100, 'Quarto');
transitionList['QuartoCorredor'] = new Transition('QuartoCorredor', `${path}room-to-hall.mp4`, 2, 100, 'Corredor');
transitionList['QuartoGuardaRoupas'] = new Transition('QuartoGuardaRoupas', `${path}get-dress.mp4`, 3, 100, 'Quarto');
transitionList['QuartoMesa'] = new Transition('QuartoMesa', `${path}desk.mp4`, 0, 7, 'Mesa');
transitionList['PegandoCoisas'] = new Transition('PegandoCoisas', `${path}getting-things.mp4`, 0, 16, 'Mesa2');
transitionList['MesaQuarto'] = new Transition('MesaQuarto', `${path}beck-from-desk.mp4`, 0, 100, 'Quarto');
transitionList['Mesa2Quarto'] = new Transition('Mesa2Quarto', `${path}back-from-desk.mp4`, 0, 100, 'Quarto');
transitionList['CorredorQuarto'] = new Transition('CorredorQuarto', `${path}hall-to-room.mp4`, 3, 9, 'Quarto');
transitionList['CorredorCozinha'] = new Transition('CorredorCozinha', `${path}hall-to-kitchen.mp4`, 3, 100, 'Cozinha');
transitionList['CorredorBanheiro'] = new Transition('CorredorBanheiro', `${path}bathroom-hall-transition.mp4`, 0, 12, 'Corredor');
transitionList['CozinhaCorredor'] = new Transition('CozinhaCorredor', `${path}kitchen-to-hall.mp4`, 4, 14, 'Corredor');
transitionList['Cafe'] = new Transition('Cafe', `${path}coffee.mp4`, 2, 100, 'Cozinha');
transitionList['CorredorSair'] = new Transition('CorredorSair', `${path}end.mp4`, 4, 100, 'Sair');

let corredorLocationList = [];
corredorLocationList.push(new Location('Banheiro', locationX, locationY - fontSize * corredorLocationList.length, fontSize + 'px Arial'));
corredorLocationList.push(new Location('Cozinha', locationX, locationY - fontSize * corredorLocationList.length, fontSize + 'px Arial'));
corredorLocationList.push(new Location('Quarto', locationX, locationY - fontSize * corredorLocationList.length, fontSize + 'px Arial'));
corredorLocationList.push(new Location('Sair', locationX, locationY - fontSize * corredorLocationList.length, fontSize + 'px Arial'));

let kitchenLocationList = [];
kitchenLocationList.push(new Location('Corredor', locationX, locationY - fontSize * kitchenLocationList.length, fontSize + 'px Arial'));

let guardaRoupaLocationList = [];
guardaRoupaLocationList.push(new Location('Quarto', locationX, locationY - fontSize * guardaRoupaLocationList.length, fontSize + 'px Arial'));

let mesaLocationList = [];
mesaLocationList.push(new Location('Quarto', locationX, locationY - fontSize * mesaLocationList.length, fontSize + 'px Arial'));

let bedroomLocationList = [];
bedroomLocationList.push(new Location('Corredor', locationX, locationY - fontSize * bedroomLocationList.length, fontSize + 'px Arial'));
bedroomLocationList.push(new Location('Mesa', locationX, locationY - fontSize * bedroomLocationList.length, fontSize + 'px Arial'));

// =============== OBJETOS DA CENA 1 (Quarto, guarda-roupas e mesa) ===============

let guardaRoupas = new Object(0, 230, 130, 220);
let bedroomObjects = [guardaRoupas];

let carteira = new Object(380, 320, 90, 65);
let chaves = new Object(515, 315, 60, 60);
let tableObjects = [carteira, chaves];

// =============== OBJETOS DA CENA 3 (Cozinha) ===============

let cafe = new Object(675, 455, 45, 75);
let kitchenObjects = [cafe];

// ======================= CENÁRIOS =======================

let scenarios = {};
// scenarios['Guarda-roupas'] = new Scenario(closetObjects, guardaRoupaLocationList, 'GuardaRoupas.jpg');
scenarios['desk'] = new Scenario(tableObjects, mesaLocationList, 'desk.jpg');
scenarios['emptyDesk'] = new Scenario([], mesaLocationList, 'empty-desk.jpg');
scenarios['room'] = new Scenario(bedroomObjects, bedroomLocationList, 'room.jpg');
scenarios['kitchen'] = new Scenario(kitchenObjects, kitchenLocationList, 'kitchen.jpg');
scenarios['hall'] = new Scenario([], corredorLocationList, 'hall.jpg');
scenarios['end'] = new Scenario([], [], 'end.jpg');

let currentScenario = scenarios['Quarto'];
let currentScenarioName = 'Quarto';

// ==================== EVENT LISTENERS ====================

// verifica se clicou em algum objeto com highlight (ou em algum local da lista)
canvas.addEventListener("click", function (event) {
    mouseClickX = Math.round(event.clientX - canvasBoundingBox.left);
    mouseClickY = Math.round(event.clientY - canvasBoundingBox.top);

    if (!currentScenario)return;

    // se clicou em algum objeto do cenário, muda estado do checkbox correspondente
    for (let i = 0; i < currentScenario.sceneObjects.length; i++) {
        let object = currentScenario.sceneObjects[i];

        if (object.isSelected(mouseClickX, mouseClickY)) {
            // marcar checkbox correspondente
            let itemCheckbox;
            let checkboxState;

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
    for (let i = 0; i < currentScenario.locationList.length; i++) {
        let location = currentScenario.locationList[i];

        if (location.isSelected(mouseClickX, mouseClickY)) {
            if (location.name == 'Banheiro') {
                let itemCheckbox = document.getElementById('item3');
                let checkboxState = itemCheckbox.checked;
                itemCheckbox.checked = !checkboxState;
            }

            // mudar para cenário correspondente
            if (location.name == 'Sair') {
                let fezTarefa1 = document.getElementById('item1').checked;
                let fezTarefa2 = document.getElementById('item2').checked;
                let fezTarefa3 = document.getElementById('item3').checked;
                let fezTarefa4 = document.getElementById('item4').checked;
                let fezTarefa5 = document.getElementById('item5').checked;

                if (fezTarefa1 && fezTarefa2 && fezTarefa3 && fezTarefa4 && fezTarefa5) {
                    let nextTransition = currentScenarioName + location.name;
                    transitionList[nextTransition].play();
                } else {
                    alert("VOCÊ AINDA NÃO FEZ TODAS AS TAREFAS!");
                }
                return;
            }
            let nextTransition = currentScenarioName + location.name;
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
});

// ==================== FUNÇÕES DE DESENHO ====================

// desenha barra de itens
function drawItemBox() {
    let x = canvas.width * 0.05;
    let y = canvas.height * 0.01;
    let width = canvas.width - canvas.width * 0.1;
    let height = canvas.height * 0.15;
    context.beginPath();
    context.fillStyle = 'rgba(0, 0, 0, 0.5)';
    context.fillRect(x, y, width, height);
    context.closePath();
}

// desenhar highlights dos objetos e dos locais
function drawHighlights() {
    if (!currentScenario)return;
    for (let i = 0; i < currentScenario.sceneObjects.length; i++) {
        let object = currentScenario.sceneObjects[i];
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
    document.getElementById("nowPlaying").src = `resources/audio/${idRadioButton}.mp3`;
    let player = document.getElementById("gameRadio");
    player.load();
    player.play();
}

function audioButtonAction() {
    let button = document.getElementById("button_box1");
    let div = document.getElementById("body_box1");

    button.onclick = function () {
        if (div.className === "hidden") {
            div.className = "visible";
            button.innerHTML = "CLIQUE AQUI PARA ESCONDER";
        } else if (div.className === "visible") {
            div.className = "hidden";
            button.innerHTML = "CLIQUE AQUI PARA VER A PLAYLIST";
        }
    };
}

// ==================== LOOP PRINCIPAL  ====================

window.onload = function () {
    transitionList['Acordando'].play();
    audioButtonAction();
};