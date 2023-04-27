    // JS code for plot

function makeArr(startValue, stopValue, cardinality) {
  var arr = [];
  var step = (stopValue - startValue) / (cardinality - 1);
  for (var i = 0; i < cardinality; i++) {
    arr.push(startValue + (step * i));
  }
  return arr;
}

function makeFull(startValue, cardinality) {
  var arr = [];
  for (var i = 0; i < cardinality; i++) {
    arr.push(startValue );
  }
  return arr;
}

function kepler2cartesian(e, i, Omega, omega, nu) {
    a=1
    mu=1
    r = a * ((1 - e**2)/(1 + e * Math.cos(nu)))
    X_Value = r * (Math.cos(Omega) * Math.cos(omega+nu) - Math.sin(Omega) * Math.sin(omega+nu) * Math.cos(i))
    Y_Value = r * (Math.sin(Omega) * Math.cos(omega+nu) + Math.cos(Omega) * Math.sin(omega+nu) * Math.cos(i))
    Z_Value = r * (Math.sin(omega+nu) * Math.sin(i))
    return [X_Value, Y_Value, Z_Value]
    
  return [x, y, z];
}

function vkep2cart(e, i, Omega, omega, N) {
  const coords = [];
  for (let j = 0; j < N; j++) {
    const nu = j * (2 * Math.PI / N);
    const cart = kepler2cartesian(e, i, Omega, omega, nu);
    coords.push(cart);
  }
  const transposedCoords = coords[0].map((col, i) => coords.map(row => row[i]));
  return transposedCoords
}



transposedCoords = vkep2cart(0.2,0.3,1.2,0.8,1000)
transposedPlanet = kepler2cartesian(0.2,0.3,1.2,0.8,0.0)
console.log(transposedPlanet)
var trace1 = {
	x: transposedCoords[0],
	y: transposedCoords[1],
	z: transposedCoords[2],
	mode: 'markers',
	name: 'orbit',
	marker: {size: 3, line: {color: 'rgba(217, 217, 217, 0.14)',width: 0.0},opacity: 1.0},type: 'scatter3d'};

var star = {
	x: [0],
	y: [0],
	z: [0],
	mode: 'markers',
	name: 'star',
	marker: {size: 10, line: {color: 'rgba(247, 223, 2, 1.0)',width: 0.0},opacity: 1.0},type: 'scatter3d'};

var planet = {
	x: [transposedPlanet[0]],
	y: [transposedPlanet[1]],
	z: [transposedPlanet[2]],
	mode: 'markers',
	name: 'planet',
	marker: {size: 7, line: {color: 'rgba(247, 20, 5, 1.0)',width: 0.0},opacity: 1.0},type: 'scatter3d'};

var xaxis = {
	x: makeArr(-2.5,2.5,2000),
	y: makeFull(0,2000),
	z: makeFull(0,2000),
	mode: 'markers',
	name: 'x',
	marker: {size: 1, line: {color: 'rgba(217, 217, 217, 0.14)',width: 0.0},opacity: 1.0},type: 'scatter3d'};

var yaxis = {
	x: makeFull(0,2000),
	y: makeArr(-2.5,2.5,2000),
	z: makeFull(0,2000),
	mode: 'markers',
	name: 'y',
	marker: {size: 1, line: {color: 'rgba(217, 217, 217, 0.14)',width: 0.0},opacity: 1.0},type: 'scatter3d'};

var zaxis = {
	x: makeFull(0,2000),
	y: makeFull(0,2000),
	z: makeArr(-2.5,2.5,2000),
	mode: 'markers',
	name: 'z',
	marker: {size: 1, line: {color: 'rgba(217, 217, 217, 0.14)',width: 0.0},opacity: 1.0},type: 'scatter3d'};

var data = [trace1,star,planet,xaxis,yaxis,zaxis];
var layout = {autosize:false, width: 750, height: 750, margin:{l:100,r:0,b:100,t:100,pad:0},x:1.0,xanchor: "right", xaxis:{autorange:false, range:[-5,5],type:'linear'},yaxis:{autorange:false, range:[-5,5],type:'linear'},zaxis:{autorange:false, range:[-5,5],type:'linear'},showlegend: true};
Plotly.newPlot('keplerplot', data, layout);

	let slider1 = document.getElementById("slider1");
	let slider2 = document.getElementById("slider2");
	let slider3 = document.getElementById("slider3");
	let slider4 = document.getElementById("slider4");
	let slider5 = document.getElementById("slider5");
	let e = slider1.value;
	let inc = slider2.value;
	let omega = slider3.value;
	let Omega = slider4.value;
	let nu = slider5.value;

function update() {
        e = parseFloat(slider1.value);
        inc = parseFloat(slider2.value);
        omega = parseFloat(slider3.value);
        Omega = parseFloat(slider4.value);
        nu = parseFloat(slider5.value);
        transposedCoords = vkep2cart(e,inc,omega,Omega,1000);
        transposedPlanet = kepler2cartesian(e,inc,omega,Omega,nu);
        data[0]['x'] = transposedCoords[0];
        data[0]['y'] = transposedCoords[1];
        data[0]['z'] = transposedCoords[2];

        data[2]['x'] = [transposedPlanet[0]];
        data[2]['y'] = [transposedPlanet[1]];
        data[2]['z'] = [transposedPlanet[2]];
        Plotly.redraw('keplerplot');
}


