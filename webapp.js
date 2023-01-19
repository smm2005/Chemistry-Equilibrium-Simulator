// Defined Values
let factor1 = 50;
let factor = 50;
let reactantValue = 50;
let C = 50; 
let enth = 0;
let temp = 50;
let tempFactor;
let pres = 1;
let setRMoles = 1;
let setPMoles = 1;
let init_equiconst = 1;
let equiconst = 1;
let starterNumber = 0;
let sideOfShift;
let revealer = document.getElementById("box2");
let reactantDisplay = document.getElementById("rMolesDisplay");
let productDisplay = document.getElementById("pMolesDisplay");

let xArray = [];
let yArray = [];
const particleLimit = 50;

// Booleans
let onPlay = false;
let onPause = false;
let onStart = true;
let onDelay;
let isVisible;
let adjusted = false;

// Importing jQuery
var script = document.createElement("script");
script.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js";
script.type = "text/javascript";
document.getElementsByTagName("head")[0].appendChild(script);

function createReactantParticles(){
  for (let i = 0; i < 100; i++){
    var div = document.createElement("div")
    let idName = "reactant-"+i.toString();
    let leftPos = Math.floor((Math.random() * 50)).toString();
    let topPos = Math.floor((Math.random() * 50)).toString();
    div.setAttribute("id", idName);
    div.setAttribute("style", `background: #0a0; height: 25px; width: 25px; border-radius: 50%; position: absolute; top: ${topPos}%; left: ${leftPos}%; animation-name: ballanim; animation-duration: 2s; animation-iteration-count: 600000; opacity: 0.8; border: solid; border-color: black;`);
    document.getElementById("box").appendChild(div);
  }

}

function createProductParticles(){
  for (let i = 0; i < particleLimit; i++){
    var div = document.createElement("div")
    let idName = "product-"+i.toString();
    let leftPos = Math.floor((Math.random() * 50)).toString();
    let topPos = Math.floor((Math.random() * 50)).toString();
    div.setAttribute("id", idName);
    div.setAttribute("style", `background: #f4f; height: 25px; width: 25px; border-radius: 50%; position: absolute; top: ${topPos}%; left: ${leftPos}%; animation-name: ballanim-${(i % 4).toString()}; animation-duration: 2s; animation-iteration-count: 600000; opacity: 0.5; border: solid; border-color: black;`);
    document.getElementById("box").appendChild(div);
  }
}

function addStressAndShift(sn, stress, shift="No shift"){
  var tableRow = document.createElement("tr")
  let idName = "stressAdd-"+sn.toString();
  tableRow.setAttribute("id", idName);
  document.getElementById("table").appendChild(tableRow);
  var stressAdd = document.createElement("td")
  document.getElementById(idName).appendChild(stressAdd);
  stressAdd.innerHTML = stress;
  var shiftAdd = document.createElement("td");
  document.getElementById(idName).appendChild(shiftAdd);
  shiftAdd.innerHTML = shift;
}

function adjustReactantParticles(setValue){
  for (let i = 0; i < 100; i++){
    r = document.getElementById(`reactant-${i.toString()}`)
    if (i < setValue){
      r.style.opacity = 0.8;
    }
    else if (i > setValue){
      r.style.opacity = 0; 
    }
  }
}

function adjustRTemp(setValue, adjustValue){
  for (let i = 0; i < 100; i++){
    let animation = anime({
      targets: `#reactant-${i.toString()}`,
      translateX: ((Math.random()*(130/adjustValue))),
      translateY: ((Math.random()*(130/adjustValue))),
      duration: 30000/setValue,
      easing: 'linear',
      direction: 'alternate',
      loop: true
    });
  }
}

function adjustPTemp(setValue, adjustValue){
  for (let i = 0; i < 100; i++){
    let animation = anime({
      targets: `#product-${i.toString()}`,
      translateX: ((Math.random()*(130/adjustValue))),
      translateY: ((Math.random()*(130/adjustValue))),
      duration: 30000/setValue,
      easing: 'linear',
      direction: 'alternate',
      loop: true
    });
  }
}

function declareShiftViaPressure(val, oldVal){
  if ((setRMoles < setPMoles) && (val > oldVal)){
    revealer.style.background = '#0a0';
    sideOfShift = "Reactants";
  }
  else if ((setRMoles < setPMoles) && (val < oldVal)){
    revealer.style.background = '#f4f'; 
    sideOfShift = "Products";
  }
  else if ((setRMoles > setPMoles) && (val > oldVal)){
    revealer.style.background = '#f4f';
    sideOfShift = "Products";
  }
  else if ((setRMoles > setPMoles) && (val < oldVal)){
    revealer.style.background = '#0a0';
    sideOfShift = "Reactants";
  }
  else{
    revealer.style.background = 'none'; 
  }
}

function declareShiftViaConcentration(val, oldVal){
  if (val < oldVal){
    revealer.style.background = '#0a0';
    sideOfShift = "Reactants";
  }
  else if (val > oldVal){
    revealer.style.background = '#f4f';
    sideOfShift = "Products";
  }
  else{
    revealer.style.background = 'none';
  }
}

function declareShiftViaTemperature(val, oldVal){
  if (val < oldVal && enth < 0){
    revealer.style.background = '#f4f';
    sideOfShift = "Products";
  }
  else if (val > oldVal  && enth < 0){
    revealer.style.background = '#0a0';
    sideOfShift = "Reactants";
  }
  else if (val < oldVal && enth > 0){
    revealer.style.background = '#0a0';
    sideOfShift = "Reactants";
  }
  else if (val > oldVal && enth > 0){
    revealer.style.background = '#f4f';
    sideOfShift = "Products";
  }
  else{
    revealer.style.background = 'none';
  }
}

// Integrated Van't Hoff Equation to Find Final Equilibrium Constant
function changeKEQ(kI, dH, initialTemp, finalTemp){
  let R = 8.3145;
  init_equiconst = equiconst;
  return kI * Math.pow(Math.E, (dH/R)*(1/initialTemp - 1/finalTemp));
}

function adjustSliderValue(range, demo, factAdj){
    window.addEventListener("DOMContentLoaded", () => {
        var slider = document.getElementById(range);
        var output = document.getElementById(demo);
        output.innerHTML = slider.value;

        slider.oninput = function() {
          output.innerHTML = this.value;
          factAdj = this.value;
          adjusted = true;
          if (range == "rMoles"){
            setRMoles = factAdj;
            reactantDisplay.innerHTML = factAdj;
          }
          else if (range == "pMoles"){
            setPMoles = factAdj;
            productDisplay.innerHTML = factAdj;
          }
          else if (range == "enthalpy"){
            enth = factAdj;
          }
          else if (range == "concentration"){
            adjustReactantParticles(factAdj);
            declareShiftViaConcentration(factAdj, C);
            if (C < factAdj){
              addStressAndShift(starterNumber, "Increase (C)", sideOfShift);
            }
            else if (C > factAdj){
              addStressAndShift(starterNumber, "Decrease (C)", sideOfShift);
            }
            C = factAdj;
            starterNumber = starterNumber + 1;
          }
          else if (range == "temperature"){
            adjustRTemp(factAdj, pres);
            adjustPTemp(factAdj, pres);
            declareShiftViaTemperature(factAdj, temp);
            document.getElementById("setEQ").innerHTML = (Math.round(((changeKEQ(init_equiconst, enth, temp, factAdj)) * 100))/100).toExponential(2);
            if (temp < factAdj){
              addStressAndShift(starterNumber, "Increase (T)", sideOfShift);
            }
            else if (temp > factAdj){
              addStressAndShift(starterNumber, "Decrease (T)", sideOfShift);
            }
            temp = factAdj;
            starterNumber = starterNumber + 1;
          }
          else if (range == "pressure"){
            adjustRTemp(temp, factAdj);
            adjustPTemp(temp, factAdj);
            document.getElementById("box").style.width = (260 - (10 * factAdj)).toString() + "px";
            document.getElementById("box").style.height = (260 - (10 * factAdj)).toString() + "px";
            declareShiftViaPressure(factAdj, pres);
            if (pres < factAdj){
              addStressAndShift(starterNumber, "Increase (P)", sideOfShift);
            }
            else if (pres > factAdj){
              addStressAndShift(starterNumber, "Decrease (P)", sideOfShift);
            }
            starterNumber = starterNumber + 1;
            pres = factAdj;
          }
        }
    })   
}

createProductParticles();
createReactantParticles();

document.getElementById("setEQ").innerHTML = equiconst;

adjustSliderValue("rMoles", "demo1", factor1);
adjustSliderValue("pMoles", "demo2", factor);
adjustSliderValue("enthalpy", "demo3", 0);
adjustSliderValue("concentration", "demo4", factor);
adjustSliderValue("temperature", "demo5", factor);
adjustSliderValue("pressure", "demo6", factor);

