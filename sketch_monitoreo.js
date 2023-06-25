//----CONFIGURACION-----
let AMP_MIN = 0.02; // umbral mínimo de sonido qiu supera al ruido de fondo
let AMP_MAX = 0.2 // amplitud máxima del sonido

let AMORTIGUACION = 0.8; // factor de amortiguación de la señal

let IMPRIMIR = true;

//----MICROFONO----
let mic;

//-----AMPLITUD-----
let amp; // variable para cargar la amplitud (volumen) ee la señal de entrada del mic

//----GESTOR----
let gestorAmp;

let haySonido;
let antesHabiaSonido; // memoria del estado de "haySonido" un fotograma atrás
let empezoElSonido;
let finDelSonido;

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(220);

     //----MICROFONO-----
    audioContext = getAudioContext();
    mic = new p5.AudioIn();
    mic.start();

    //----GESTOR----
    gestorAmp = new GestorSenial(AMP_MIN, AMP_MAX); // inicilizo en goestor con los umbrales mínimo y máximo de la señal

    gestorAmp.f = AMORTIGUACION;

    //------MOTOR DE AUDIO-----
    userStartAudio(); // esto lo utilizo porque en algunos navigadores se cuelga el audio. Esto hace un reset del motor de audio (audio context)

}

function draw() {

    gestorAmp.actualizar(mic.getLevel());  

    amp = gestorAmp.filtrada;

    haySonido = amp > AMP_MIN; 

    let empezoElSonido = haySonido && !antesHabiaSonido; // EVENTO

    
    if(IMPRIMIR){
        printData();
    }

    antesHabiaSonido = haySonido; // guardo el estado del fotograma anteior
    
}

function printData(){

    background(255);
    push();
    textSize(16);
    fill(0);
    let texto;
  
    texto = 'amplitud: ' + amp;
    text(texto, 200, 200);
  
    fill(0);
    ellipse(width/2, height-amp * 300, 30, 30);
  
    pop();
  
    gestorAmp.dibujar(0, 0);
  }