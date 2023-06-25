let t = [];
let cantidad = 16;
let nombre;

let estado = "grosor"; //grosor, ubicacion, paleta, color
let transicionColor = false;
let monitorear = true;

let cuantosCirculos = 23;

let ubicaciones = [];
let xyi = [];
let cambiarUbicaciones = 0;

let unGrosor = 0;
let gros = 7; //Rango entre 7 y 20
let grosores = [];
let guardarGrosores = [];

let pta = "unColor"; //unColor, monoCromo o variada
let cuantosColores;

let col;
let sat;
let bri;
let setColores = [];
let setTonos = [];
let setBrillos = [];
let setSaturaciones = [];
let colores = [];
let randomColores = [];
let cambiarColores = 0;
let cambiarPaleta = 0;

let marcaEnElTiempo;
let tiempoLimiteGrosor = 8000;
let tiempoLimiteUbicacion = 8000;
let tiempoLimitePaleta = 8000;
let tiempoLimiteColor = 8000;
let ahora;
//let tiempoReinicio = 3000;

/*------------------------------ SONIDO -----------------------------*/

let audioContext;

//----CONFIGURACION-----
let AMP_MIN = 0.01; // umbral mínimo de sonido qiu supera al ruido de fondo
let AMP_MAX = 0.12; // amplitud máxima del sonido
let PIT_MIN = 20;
let PIT_MAX = 40;

let AMORTIGUACION = 0.8; // factor de amortiguación de la señal

//----MICROFONO----
let mic;

//-----AMPLITUD-----
let amp; // variable para cargar la amplitud (volumen) de la señal de entrada del mic

//-----PITCH-----
let pitch;
let pit;

//----GESTOR----
let gestorAmp;
let gestorPitch;

let haySonido;
let antesHabiaSonido; // memoria del estado de "haySonido" un fotograma atrás
let inicioElSonido;
let finDelSonido;

const model_url = 'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/';

function setup() {
  createCanvas(1400, 600, WEBGL);
  background(220);

  /*------------------------------ SONIDO -------------------------*/
 
  //----MICROFONO-----
  audioContext = getAudioContext();
	mic = new p5.AudioIn();
  mic.start( startPitch );

  //----GESTOR----
  gestorAmp = new GestorSenial(AMP_MIN, AMP_MAX); // inicilizo en gestor con los umbrales mínimo y máximo de la señal
  gestorPitch = new GestorSenial( PIT_MIN , PIT_MAX );

  gestorAmp.f = AMORTIGUACION;

  //------MOTOR DE AUDIO-----
  userStartAudio(); // esto lo utilizo porque en algunos navigadores se cuelga el audio. Esto hace un reset del motor de audio (audio context)

  /*-------------------------------- FIN SONIDO --------------------*/

  
  /*------------------------ PRIMER SETEO DE VARIABLES ------------------------ */

  //GROSOR
  for(i=0;i<cuantosCirculos;i++){
    guardarGrosores[i] = random(7,20);
  } 

  //UBICACION
  for(i=0;i<(cantidad*cuantosCirculos);i++){
      ubicaciones[i] = random(70,100);
      xyi[i] = random(10,100);
    }

  //COLOR
  colorMode(HSB,255,255,255);
  cuantosColores = int(random(3,5));

  for(i=0;i<cuantosColores;i++){
    setTonos[i] = int(random(255));
    setBrillos[i] = int(random(30,220));
    setSaturaciones[i] = int(random(150,220));
  }
  setColores[0] = color(0, 200, 220);

  for(i=0;i<cuantosCirculos;i++){
    colores[i] = random(setColores);
  }

  for(i=0;i<(cantidad*cuantosCirculos);i++){
    randomColores[i] = random(colores);   
  }
 
  //Construimos los triangulos
  for(i=0;i<cantidad;i++){
    nombre = "img"+i;
    t.push (new Triangulo(nombre));    
  } 

}


function draw() {      

  /*-------------------------- SONIDO --------------------------*/
  gestorAmp.actualizar(mic.getLevel());  

  amp = gestorAmp.filtrada; 
  //console.log(amp);

  gestorPitch.actualizar(mic.getLevel());  

  pit = gestorPitch.filtrada;
  //console.log(pit); 

 //mido por el umbral si hay o no sonido
 haySonido = gestorAmp.filtrada>0.1;
 //comparando el pasado con el presente
 //decido que el sonido inició ahora
 inicioElSonido = haySonido && !antesHabiaSonido;
 //comparando el pasado con el presente
 //decido que el sonido finalizó ahora
 let finDelSonido = !haySonido && antesHabiaSonido;


 /*------------------------------ ESTADOS ---------------------------- */
  
  if(estado == "grosor"){
    document.getElementById('estado').textContent = estado;
    document.getElementById('paleta').textContent = pta;
    document.getElementById('descripcion').textContent = "El grosor se mueve de acuerdo a la amplitud.";
    
    
    if(haySonido){
      if(amp >= 0.15){
        unGrosor = 0;
      } else {
        unGrosor = 1;
      }       
    }       
    
    console.log('amp ' + amp);
    console.log('unGrosor ' + unGrosor);

    if(inicioElSonido){
      setTimeout(function() {
        estado = "ubicacion";
        inicioElSonido = false;
      }, 8000);
    }
    


  } else if (estado == "ubicacion"){
    document.getElementById('estado').textContent = estado;
    document.getElementById('paleta').textContent = pta;
    document.getElementById('descripcion').textContent = "Las ubicaciones se mueven aleatoriamente si hay sonido";


    if(haySonido){
        cambiarUbicaciones = 1;
      } else {
        cambiarUbicaciones = 0;
      }
    
      //if(inicioElSonido){
        setTimeout(function() {
          estado = "paleta";
          inicioElSonido = false;
        }, 8000);
     // }   
    

      
  } else if (estado == "paleta"){
    document.getElementById('estado').textContent = estado;
    document.getElementById('descripcion').textContent = "La paleta cambia con el sonido y la amplitud";
    document.getElementById('paleta').textContent = pta;

    if(haySonido){
      cambiarPaleta = 1;
    } else {
      cambiarPaleta = 0;
    }

    console.log("pta " + pta);
    console.log("pit " + pit); 
    console.log("amp " + amp);
    console.log("haySonido " + haySonido);

    //if(inicioElSonido){
      setTimeout(function() {
        estado = "colores";
        inicioElSonido = false;
      }, 8000);
    //} 
       
   
  } else if (estado == "colores"){

    document.getElementById('estado').textContent = estado;
    document.getElementById('paleta').textContent = pta;
    document.getElementById('descripcion').textContent = "Los colores cambian con el pitch";

    //if(inicioElSonido){
      setTimeout(function() {
        estado = "fin";
      }, 12000);
   // } 

    
  }  else if (estado == "fin"){
    document.getElementById('estado').textContent = estado;
    document.getElementById('descripcion').textContent = "...";

  }
  
  console.log(estado);
   /*------------------- ACTUALIZAR VARIABLES ------------------*/
   setearGrosores();   
   setearUbicaciones(); 
   setearPaleta();  
   setearColores();
 
  
  /*----------------- DIBUJO -------------------*/
    
      for(i=0;i<cantidad;i++){     
          
        t[i].actualizar(cantidad,cuantosCirculos,grosores,ubicaciones,xyi,randomColores); 
        t[i].dibujar();       
      }    

      if( monitorear ){
        push();
        colorMode(RGB);
        gestorAmp.dibujar( 325 , -100 );
        gestorPitch.dibujar( 320 , 100 );
        pop(); 
      }

    antesHabiaSonido = haySonido; // guardo el estado del fotograma anteior    
}

function setearPaleta(){

  if(estado == "paleta"){
    if(cambiarPaleta == 1){
      if(amp < 0.2){
        pta = "monoCromo";
      } else{
        pta = "variada";
      }      
    } else {
      pta = "unColor";
    }

    if(pta == "unColor"){
        setColores[0] = color(255, 200, 220); 

        for(i=0;i<cuantosCirculos;i++){
          colores[i] = setColores[0];
        }
    } else if (pta == "monoCromo"){
        for(i=0;i<cuantosColores;i++){
          setColores[i] = color(255,setSaturaciones[i],setBrillos[i]);
        }
      
        for(i=0;i<cuantosCirculos;i++){
          colores[i] = random(setColores);
        }
    } else if (pta == "variada"){
        for(i=0;i<cuantosColores;i++){
          setColores[i] = color(setTonos[i],setSaturaciones[i],setBrillos[i]);
        }

        for(i=0;i<cuantosCirculos;i++){
          colores[i] = random(setColores);
        }
    }
    for(i=0;i<(cantidad*cuantosCirculos);i++){
      randomColores[i] = random(colores);   
    }
  } 
}

function setearColores(){

  if(estado == "colores"){
    if(pta == "unColor"){   
        pit = map(pit,0,1,0,400);     
        setColores[0] = color(pit, 200, 220); 
        console.log(pit);         
  
      for(i=0;i<cuantosCirculos;i++){
        colores[i] = setColores[0];
      }
  
    } else if (pta == "monoCromo") {

      pit = map(pit,0,1,0,400);
        for(i=0;i<cuantosColores;i++){
          setColores[i] = color(pit,setSaturaciones[i],setBrillos[i]);
        }
        
          for(i=0;i<cuantosCirculos;i++){
            colores[i] = random(setColores);
          }
               
  
      } else if (pta == "variada"){

        pit = map(pit,0,1,0,400);
          for(i=0;i<cuantosColores;i++){
            setColores[i] = color(setTonos[i]+pit,setSaturaciones[i],setBrillos[i]);
          }
  
          for(i=0;i<cuantosCirculos;i++){
            colores[i] = random(setColores);
          }
        }         
  
        if(cambiarColores = 1){
          for(i=0;i<(cantidad*cuantosCirculos);i++){
            randomColores[i] = random(colores);   
          }
        }   
  } 

}    

function setearGrosores(){
  
  if(estado == "grosor") {
    if(unGrosor == 1){
          gros = map(amp,0,1,7,15);
          for(i=0;i<cuantosCirculos;i++){
            grosores[i] = gros;      
          }
      
        } else if(unGrosor == 0){
          for(i=0;i<cuantosCirculos;i++){
            grosores[i] = guardarGrosores[i];
          }    
          for(i=0;i<cuantosCirculos;i++){
            gros = map(amp,0,1,1,5);
            grosores[i] = (grosores[i]*amp*gros)+2;
          }     
      }
  }     
}

function setearUbicaciones(){
  
  if (estado == "ubicacion"){
    if(cambiarUbicaciones == 1){
          for(i=0;i<(cantidad*cuantosCirculos);i++){
            ubicaciones[i] = random(70,100);
            xyi[i] = random(10,100);
          }
        }  
  }     
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
//--------------------------------------------------------------------
function startPitch() {
  pitch = ml5.pitchDetection(model_url, audioContext , mic.stream, modelLoaded);
}
//--------------------------------------------------------------------
function modelLoaded() {
//select('#status').html('Model Loaded');
getPitch();
//console.log( "entro aca !" );

}
//--------------------------------------------------------------------
function getPitch() {
  pitch.getPitch(function(err, frequency) {
  if (frequency) {    	
    let midiNum = freqToMidi(frequency);
    //console.log( midiNum );

    gestorPitch.actualizar( midiNum );

  }
  getPitch();
})
}