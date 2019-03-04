(function() {

try {

var currentVarsNumber = 0;
var currentConstraintsNumber = 0;
var defaultVarsNumber = 2;
var defaultConstraintsNumber = 2;

/**
 * updateVars: mettre à jour le nombre de variables dans le formulaire
 * @param  {Number} targetVarsNumber la valeur que le nombre de variables devra être
 * @return null
 */
var updateVars = function(targetVarsNumber) {
	var polynomialEls = document.querySelectorAll(".polynomial");
	if (currentVarsNumber == targetVarsNumber) {
	} else if (currentVarsNumber < targetVarsNumber) {
		[].forEach.call(polynomialEls, function(each){
			for (var i = currentVarsNumber + 1; i <= targetVarsNumber; i++) {
				var newTerm = document.createElement("span");
				newTerm.className = "term";
				newTerm.dataset.no = i;
				newTerm.innerHTML = '<input class="term-input" value="" type="number" step="any" /><span class="variable" data-var="x"></span></span>';
				each.appendChild(newTerm);
			}
		});
	} else {//currentVarsNumber > targetVarsNumber
		[].forEach.call(polynomialEls, function(each){
			for (var i = currentVarsNumber; i > targetVarsNumber; i--) {
				each.removeChild(each.lastChild);
			}
		});
	}
	currentVarsNumber = targetVarsNumber;
}

/**
 * updateConstraints: mettre à jour le nombre de contraintes dans le formulaire
 * @param  {Number} targetConstraintsNumber la valeur que le nombre de contraintes devra être
 * @return null
 */
var updateConstraints = function(targetConstraintsNumber) {
	var constraintList = document.querySelector("#constraint-list");
	if (currentConstraintsNumber == targetConstraintsNumber) {
	} else if (currentConstraintsNumber < targetConstraintsNumber) {
		for (var i = currentConstraintsNumber + 1; i <= targetConstraintsNumber; i++) {
			var newConstraint = document.querySelector("#constraint-example").cloneNode(true);
			newConstraint.id = "";
			newConstraint.dataset.cno = i;
			constraintList.appendChild(newConstraint);
		}
	} else {//currentConstraintsNumber > targetConstraintsNumber
		for (var i = currentConstraintsNumber; i > targetConstraintsNumber; i--) {
			constraintList.removeChild(constraintList.lastChild);
		}
	}
	currentConstraintsNumber = targetConstraintsNumber;
}

/**
 * randomize: la fonction déclenchée par les deux boutons "Générer"
 * @param  {Boolean} typical si c'est true, générer des valeur typique (valeurs sont toujours positives, signs sont toujours >=, toujours Max Z), sinon, il n'y pas de limite.
 * @return null
 */
var randomize = function(typical) {
	[].forEach.call(document.querySelectorAll(".extremization .term-input"), function(eachTermInput){
		if (typical) {
			eachTermInput.value = Math.floor(Math.random() * 51);//random int in (0, +50)
		} else {
			eachTermInput.value = Math.floor(Math.random() * 101) - 50;//random int in (-50, +50)
		}
	});
	document.querySelector(".extremization option[value='" + (typical || (Math.random() >= 0.5) ? "max" : "min") + "']").selected = true;
	var random0To1Temp;
	var randomSignTemp;
	[].forEach.call(document.querySelectorAll("#constraint-list .constraint"), function(eachConstraint){
		[].forEach.call(eachConstraint.querySelectorAll(".term-input"), function(eachTermInput){
			if (typical) {
				eachTermInput.value = Math.floor(Math.random() * 11);//random int in (0, +10)
			} else {
				eachTermInput.value = Math.floor(Math.random() * 21) - 10;//random int in (-10, +10)
			}
		});
		if (typical) {
			eachConstraint.querySelector(".result-input").value = Math.floor(Math.random() * 51);//random int in (0, +50)
		} else {
			eachConstraint.querySelector(".result-input").value = Math.floor(Math.random() * 101) - 50;//random int in (-50, +50)
		}
		random0To1Temp = Math.random();
		if (typical || random0To1Temp <= 0.45) {
			randomSignTemp = "<=";
		} else if (random0To1Temp <= 0.9) {
			randomSignTemp = ">=";
		} else {
			randomSignTemp = "=";
		}
		eachConstraint.querySelector("option[value='" + randomSignTemp + "']").selected = true;
	});
}

/**
 * solve: la fonction déclenchée par les deux boutons "Résoudre", tous les démarches sont dans cette fonction
 * @return null
 */
var solve = function() {
	if (currentVarsNumber != 2) {
		document.querySelector("#result").innerText = "La mèthode graphique ne fonctionne que pour 2 variables !";
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctxCoordGrid.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctxCoordText.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		return;
	}

	// Obtenir des valeurs
	var extremization = {};
	var arrayOfConstraintEquations = [];
	var termInputsTemp = document.querySelectorAll(".extremization .term-input");
	if (termInputsTemp[0].value === "") {
		termInputsTemp[0].value = 0;
	}
	if (termInputsTemp[1].value === "") {
		termInputsTemp[1].value = 0;
	}
	if (termInputsTemp[0].value === "0" && termInputsTemp[1].value === "0") {
		document.querySelector("#result").innerText = "Z est toujours de 0 !";
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctxCoordGrid.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctxCoordText.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		return;
	}
	extremization.a = +termInputsTemp[0].value;
	extremization.b = +termInputsTemp[1].value;
	var signSelTemp = document.querySelector(".extremization .sign");
	extremization.ext = signSelTemp.options[signSelTemp.selectedIndex].value;
	[].forEach.call(document.querySelectorAll("#constraint-list .constraint"), function(eachConstraint){
		var constraintEquation = {};
		termInputsTemp = eachConstraint.querySelectorAll(".term-input");
		if (termInputsTemp[0].value === "") {
			termInputsTemp[0].value = 0;
		}
		if (termInputsTemp[1].value === "") {
			termInputsTemp[1].value = 0;
		}
		constraintEquation.a = +termInputsTemp[0].value;
		constraintEquation.b = +termInputsTemp[1].value;
		constraintEquation.c = +eachConstraint.querySelector(".result-input").value;
		signSelTemp = eachConstraint.querySelector(".sign");
		constraintEquation.sign = signSelTemp.options[signSelTemp.selectedIndex].value;
		arrayOfConstraintEquations.push(constraintEquation);
	});

	// Obtenir toutes les intersections de chaque paire parmi : toutes les droites et les 2 axes
	var arrayOfConstraintEquationsPlusAxis = arrayOfConstraintEquations.slice(0);
	arrayOfConstraintEquationsPlusAxis.push({a: 1, b: 0, c: 0, sign: ">="});//1x1 + 0x2 >= 0
	arrayOfConstraintEquationsPlusAxis.push({a: 0, b: 1, c: 0, sign: ">="});//0x1 + 1x2 >= 0
	var intersectionsArray = getIntersectionsFromEquations(arrayOfConstraintEquationsPlusAxis);

	// Pour toutes les intersections (xi, yi), calculer le max et min de x et de y
	var xArray = [];
	var yArray = [];
	intersectionsArray.forEach(function(intersection) {
		if (typeof intersection === "object") {
			xArray.push(intersection.x);
			yArray.push(intersection.y);
		}
	});
	if (xArray.length !== 0) {
		xMaxCoord = Math.ceil(Math.max.apply(null, xArray));
		xMinCoord = Math.floor(Math.min.apply(null, xArray));
		yMaxCoord = Math.ceil(Math.max.apply(null, yArray));
		yMinCoord = Math.floor(Math.min.apply(null, yArray));
	}
	var diffXMaxMin = xMaxCoord - xMinCoord;
	var diffYMaxMin = yMaxCoord - yMinCoord;
	if (diffXMaxMin < 6) {
		xMaxCoord = Math.ceil(xMaxCoord + (6 - diffXMaxMin)/2);
		xMinCoord = Math.floor(xMinCoord - (6 - diffXMaxMin)/2);
	}
	if (diffYMaxMin < 6) {
		yMaxCoord = Math.ceil(yMaxCoord + (6 - diffYMaxMin)/2);
		yMinCoord = Math.floor(yMinCoord - (6 - diffYMaxMin)/2);
	}

	// Dessiner le système de coordonnées
	drawCoordinateGrid();

	// Dessiner toutes les droites de contrainte
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	drawAreaFromEquations(arrayOfConstraintEquations);
	ctx.strokeStyle = "red";
	drawEquationLine(extremization.a, extremization.b, 0);

	// Réduire les intersections à celles qui satisfont toutes les (in)équations de contrainte
	var intersectionsArrayFit = reducePoints(intersectionsArray, arrayOfConstraintEquationsPlusAxis);
	// Dessiner ces points d’intersection
	ctx.fillStyle = "yellow";
	intersectionsArrayFit.forEach(function(intersection){
		drawCircle(intersection, 3, ctx, true);
	});

	// Obtenir toutes les intersections de chaque paire parmi : toutes les droites, les 2 axes et les 4 bordures
	var intersectionsPlusBordersArray = getIntersectionsFromEquations(arrayOfConstraintEquationsPlusAxis, true);

	var intersectionsPlusBordersArrayFit = reducePoints(intersectionsPlusBordersArray, arrayOfConstraintEquationsPlusAxis);

	// Dernière étape
	var resultString;
	if (intersectionsPlusBordersArrayFit.length === 0) {
		resultString = "Valeur " + (extremization.ext === "max" ? "maximale" : "minimale") + " de Z n'existe pas.";
		//no fit
	} else {
		// Calculer la valeur Z pour chacun des points d’intersection précédents
		var zArr = [];
		intersectionsPlusBordersArrayFit.forEach(function(intersection) {
			zArr.push(extremization.a * intersection.x + extremization.b * intersection.y);
		});

		// Obtenir min / max Z
		var extremeValue = Math[extremization.ext].apply(null, zArr);

		// Obtenir un Array de index de tous les min / max Z
		var extremeValueIndexArr = zArr.reduce(function(retArr, each, i) {
			if (each === extremeValue) {
				retArr.push(i);
			}
			return retArr;
		}, []);

		// Obtenir un Array de points min / max
		var extremePointArr = [];
		extremeValueIndexArr.forEach(function(eachExtremeValueIndex) {
			extremePointArr.push(intersectionsPlusBordersArrayFit[eachExtremeValueIndex]);
		});

		// remove duplicates
		extremePointArr = extremePointArr.filter(function(eachExtremePoint, index, self) {
			return index === self.findIndex(function (otherExtremePoint) {
				return otherExtremePoint.x === eachExtremePoint.x && otherExtremePoint.y === eachExtremePoint.y;
			});
		});

		var pixelBottomLeft = pixelToCoord({x: 0, y: 0});
		var pixelTopRight = pixelToCoord({x: ctx.canvas.width, y: ctx.canvas.height});

		if (
			extremePointArr.every(function(extremePoint) {
				// Tester si le point min ou max est sur une bordure. si oui pour tous les point min ou max, alors aucune valeur/point extrême n'existe
				if (
					+extremePoint.x.toFixed(8) === +pixelBottomLeft.x.toFixed(8) || +extremePoint.x.toFixed(8) === +pixelTopRight.x.toFixed(8) ||
					+extremePoint.y.toFixed(8) === +pixelBottomLeft.y.toFixed(8) || +extremePoint.y.toFixed(8) === +pixelTopRight.y.toFixed(8)
				) {
					return true;
				}
			})
		) {
			resultString = "Valeur " + (extremization.ext === "max" ? "maximale" : "minimale") + " de Z est l'infini positif ou négatif.";
		} else {
			resultString = "Valeur " + (extremization.ext === "max" ? "maximale" : "minimale") + " de Z est de " + +extremeValue.toFixed(5) +
				", qui se produit sur ";
			if (extremePointArr.length === 1) {
				resultString += "le point ";
			} else {
				resultString += "les points "
			}

			extremePointArr.forEach(function(extremePoint, index) {
				console.log(index);
				ctx.fillStyle = "red";
				drawCircle(extremePoint, 3, ctx, true);
				resultString += "(" + +extremePoint.x.toFixed(5) + ", " + +extremePoint.y.toFixed(5) + ")";
				if (extremePointArr.length !== 1) {
					if (index === extremePointArr.length - 2) {
						resultString += " et ";
					} else if (index !== extremePointArr.length - 1) {
						resultString += ", ";
					}
				}
			});

			if (extremePointArr.length === 1) {
				resultString += ".";
			} else {
				resultString += ", ainsi que tous les points sur le segment de droite entre eux.";
			}

		}

	}

	// Imprimer le résultat
	document.querySelector("#result").innerText = resultString;

}

/**
 * initialisation, ajout des écouteurs d'événements aux éléments HTML
 */
var posIntEls = document.querySelectorAll(".posint");

[].forEach.call(posIntEls, function(each){
	var incButton = each.querySelector("button[increment]");
	var decButton = each.querySelector("button[decrement]");
	var input = each.querySelector("input");
	var max  = +input.max;
	var min  = +input.min;
	var step = +input.step;

	incButton.addEventListener("click", function(){
		// Pour supporter IE et Edge, on n'utilise pas stepUp()
		var targetValue = +input.value + step;
		input.value = targetValue;
		input.dispatchEvent(new Event("change"));
	}, false);

	decButton.addEventListener("click", function(){
		// Pour supporter IE et Edge, on n'utilise pas stepDown()
		var targetValue = +input.value - step;
		input.value = targetValue;
		input.dispatchEvent(new Event("change"));
	}, false);

	input.addEventListener("change", function(){
		var targetValue = this.value;
		// Validation
		if (/^[0-9]+$/.test(targetValue) && +targetValue >= min && +targetValue <= max ) {
			// S'il est validé, mettre currentVarsNumber à jour
			if (this.id == "vars-number-input") {
				updateVars(+targetValue);
			} else {
				updateConstraints(+targetValue);
			}
		} else {
			// S'il n'est pas validé, revenir
			if (this.id == "vars-number-input") {
				this.value = currentVarsNumber;
			} else {
				this.value = currentConstraintsNumber;
			}
		}
	});
});

document.querySelector("#generate").addEventListener("click", function(){
	randomize(false);
}, false);
document.querySelector("#generate-typical").addEventListener("click", function(){
	randomize(true);
}, false);
document.querySelector("#solve").addEventListener("click", solve, false);

//initialisation
document.querySelector("#vars-number-input").value = defaultVarsNumber;
updateVars(defaultVarsNumber);
document.querySelector("#constraint-number-input").value = defaultConstraintsNumber;
updateConstraints(defaultConstraintsNumber);
randomize(true);




/**
 * constants et variables à utiliser par canvas
 */

var xMaxCoord = 10;
var xMinCoord = -10;
var yMaxCoord = 10;
var yMinCoord = -10;

var whiteSpaceRatio = 0.14;
var gridNumberX = 10;
var gridNumberY = 10;

var ctx = document.querySelector(".canvas-main").getContext("2d");
var ctxCoordGrid = document.querySelector(".canvas-coordgrid").getContext("2d");
var ctxCoordText = document.querySelector(".canvas-coordtext").getContext("2d");

var coordPerPixelX;
var coordPerPixelY;

var originPosPixelX;
var originPosPixelY;

var pixelPerGridX = ctx.canvas.width / (gridNumberX * (1 + whiteSpaceRatio));
var coordPerGridX;

var pixelPerGridY = ctx.canvas.height / (gridNumberY * (1 + whiteSpaceRatio));
var coordPerGridY;

/**
 * drawCircle: dessiner un cercle
 * @param  {Object}  centerPoint  objet représentant un point, par exemple, {x: 1, y: 2}
 * @param  {Number}  r            rayon du cyrcle
 * @param  {Object}  context      context de canvas
 * @param  {Boolean} isCoordinate si true, le(s) point(s) est(sont) en coordonnée, sinon, en pixel
 * @return null
 */
function drawCircle(centerPoint, r, context, isCoordinate) {
	if (isCoordinate) {
		centerPoint = coordToPixel(centerPoint);
	}
	context = context || ctx;
	context.beginPath();
	context.arc(centerPoint.x, context.canvas.height - centerPoint.y, r, 0, 2 * Math.PI, true);
	context.closePath();
	context.fill();
}

/**
 * drawLine: dessiner un segment de droite (d'un point à un autre point)
 * @param  {Object}  point1       objet représentant le point de départ
 * @param  {Object}  point2       objet représentant le point d'arrivée
 * @param  {Object}  context      context de canvas
 * @param  {Boolean} isCoordinate si true, le(s) point(s) est(sont) en coordonnée, sinon, en pixel
 * @return null
 */
function drawLine(point1, point2, context, isCoordinate) {
	if (isCoordinate) {
		point1 = coordToPixel(point1);
		point2 = coordToPixel(point2);
	}
	context = context || ctx;
	context.beginPath();
	context.moveTo(point1.x, context.canvas.height - point1.y);
	context.lineTo(point2.x, context.canvas.height - point2.y);
	context.closePath();
	context.stroke();
}

/**
 * drawPolygon: dessiner un polygone
 * @param  {Array}   arrayOfPoints Array des objets représentant les points qui sont les sommets du polygone
 * @param  {Object}  context       context de canvas
 * @param  {Boolean} isCoordinate  si true, le(s) point(s) est(sont) en coordonnée, sinon, en pixel
 * @return null
 */
function drawPolygon(arrayOfPoints, context, isCoordinate) {
	context = context || ctx;
	context.beginPath();
	arrayOfPoints.forEach(function(point, index) {
		if (isCoordinate) {
			point = coordToPixel(point);
		}
		if (index === 0) {
			context.moveTo(point.x, context.canvas.height - point.y);
		} else {
			context.lineTo(point.x, context.canvas.height - point.y);
		}
	});
	context.closePath();
	context.fill();
}

/**
 * coordToPixel: convertir coordonnées à pixel
 * @param  {Object} point objet représentant un point en coordonnées
 * @return {Object}       objet représentant un point en pixel
 */
function coordToPixel(point) {
	pixelX = originPosPixelX + (point.x / coordPerPixelX);
	pixelY = originPosPixelY + (point.y / coordPerPixelY);
	return {x: pixelX, y: pixelY};
}

/**
 * pixelToCoord: convertir pixel à coordonnées
 * @param  {Object} pixelPoint objet représentant un point en pixel
 * @return {Object}            objet représentant un point en coordonnées
 */
function pixelToCoord(pixelPoint) {
	var coordX = coordPerPixelX * (pixelPoint.x - originPosPixelX);
	var coordY = coordPerPixelY * (pixelPoint.y - originPosPixelY);
	return {x: coordX, y: coordY};
}

/**
 * extendedLine: dessiner une droite (longeur infinite) selon deux points sur la droite
 * @param  {Object}  point1       objet représentant un point sur la droite
 * @param  {Object}  point2       objet représentant un autre point sur la droite
 * @param  {Boolean} isCoordinate si true, le(s) point(s) est(sont) en coordonnée, sinon, en pixel
 * @param  {Boolean} noDraw       si true, ne pas dessiner la droite
 * @return {Object}               objet {start: startPoint, end: endPoint} contenant points "start" et "end" qui sont les intersections entre la droite et le bordure inférieure et supérieure, respectivement (si la droite est parallèle de la bordure inférieure/supérieure, ils sont les intersections entre la droite et le bordure gauche et droite, respectivement)
 */
function extendedLine(point1, point2, isCoordinate, noDraw) {
	if (isCoordinate) {
		point1 = coordToPixel(point1);
		point2 = coordToPixel(point2);
	}
	var startPoint, endPoint;
	if (point1.x == point2.x) {
		if (point1.y != point2.y) {//meme x, different y
			startPoint = {x: point1.x, y: 0};
			endPoint = {x: point1.x, y: ctx.canvas.height};
		} else {//meme x, meme y
			return;
		}
	} else if (point1.y == point2.y) {//meme y, different x
		startPoint = {x: 0, y: point1.y};
		endPoint = {x: ctx.canvas.width, y: point1.y};
	} else {//different y, different x
		var slope = (point2.y - point1.y) / (point2.x - point1.x);
		var intercept = point2.y - (slope * point2.x);
		var getY = function(x){
			return (slope * x) + intercept;
		};
		var getX = function(y){
			return (y - intercept) / slope;
		};
		startPoint = {x: getX(0), y: 0};
		endPoint = {x: getX(ctx.canvas.height), y: ctx.canvas.height};
	}
	if (!noDraw) {
		drawLine(startPoint, endPoint);
	}
	return {start: startPoint, end: endPoint};
}

/**
 * addText: ajouter texte sur canvas
 * @param {String}  text         texte à ajouter
 * @param {Object}  point        un objet de poinr représentant l'emplacement de texte
 * @param {Object}  context      context de canvas
 * @param {Boolean} isCoordinate si true, le(s) point(s) est(sont) en coordonnée, sinon, en pixel
 * @return null
 */
function addText(text, point, context, isCoordinate) {
	if (isCoordinate) {
		point = coordToPixel(point);
	}
	context = context || ctx;
	context.fillText(text, point.x, ctx.canvas.height - point.y);
}

/**
 * getIntersection: obtenir le point d'intersection entre les droites [a1 x + b1 y = c1] et [a2 x + b2 y = c2]
 * @param  {Number} a1
 * @param  {Number} b1
 * @param  {Number} c1
 * @param  {Number} a2
 * @param  {Number} b2
 * @param  {Number} c2
 * @return {Object} or {String} Objet représentant le point d'intersection, en cas échéant, il peut être un String de "invalid", "parallel" ou "same line"
 */
function getIntersection(a1, b1, c1, a2, b2, c2) {
	if ((a1 === 0 && b1 === 0) || (a2 === 0 && b2 === 0)) {
		return "invalid";
	} else if ((b1 === 0 && b2 === 0 && c1 !== c2) || (a1 === 0 && a2 === 0 && c1 !== c2)) {
		return "parallel";
	} else if ((b1 === 0 && b2 === 0 && c1 === c2) || (a1 === 0 && a2 === 0 && c1 === c2)) {
		return "same line";
	} else if (b1 === 0) {
		var intX = c1/a1;
		var intY = c2/b2 - (c1*a2)/(a1*b2);
	} else if (b2 === 0) {
		var intX = c2/a2;
		var intY = c1/b1 - (c2*a1)/(a2*b1);
	} else if (a1 === 0) {
		var intX = c2/a2 - (b2*c1)/(b1*a2);
		var intY = c1/b1;
	} else if (a2 === 0) {
		var intX = c1/a1 - (b1*c2)/(b2*a1);
		var intY = c2/b2;
	} else if (a1/b1 === a2/b2) {
		if (c1/b1 === c2/b2) {
			return "same line";
		} else {
			return "parallel";
		}
	} else {
		var intX = (c2 - c1*b2/b1) / (a2 - a1*b2/b1);
		var intY = (c2 - c1*a2/a1) / (b2 - b1*a2/a1);
	}
	return {x: intX, y: intY};
}

/**
 * drawEquationLine: dessiner la droite [ax + by = c], toujours en coordonnée
 * @param  {Number} a
 * @param  {Number} b
 * @param  {Number} c
 * @return {Object} objet {start: startPoint, end: endPoint} retourné par la fonction extendedLine()
 */
function drawEquationLine(a, b, c) {
	if (a === 0 && b === 0) {
		// can't draw a line
		return;
	} else if (a === 0) {//y = c/b, b !== 0
		return extendedLine({x: 0, y: c/b}, {x: 1, y: c/b}, true);
	} else if (b === 0) {//x = c/a, a !== 0
		return extendedLine({x: c/a, y: 0}, {x: c/a, y: 1}, true);
	} else if (c === 0) {//a !== 0 && b !== 0
		return extendedLine({x: 0, y: 0}, {x: 1, y: -a/b}, true);
	} else {//a !== 0 && b !== 0 && c !== 0
		return extendedLine({x: 0, y: c/b}, {x: c/a, y: 0}, true);
	}
}

/**
 * drawArea: dessiner une zone sur le canvas en fonction d'une (in)équation [ax + by sign c], toujours en coordonnée
 * @param  {Number} a
 * @param  {Number} b
 * @param  {Number} c
 * @param  {String} sign signe "<=", ">=" ou "="
 * @return null
 */
function drawArea(a, b, c, sign) {
	//intersections between extended line and border
	var intersBELB = drawEquationLine(a, b, c);

	var topLeft = {x: 0, y: ctx.canvas.height};
	var topRight = {x: ctx.canvas.width, y: ctx.canvas.height};
	var bottomLeft = {x: 0, y: 0};
	var bottomRight = {x: ctx.canvas.width, y: 0};

	if (sign == "=") {
		// do not draw area, a line is enough
	} else if (a === 0 && b === 0) {
		// can't draw a line
	} else if ((sign == ">=") && (a > 0) || (sign == "<=") && (a < 0)) {
		// area to the right
		drawPolygon([
			intersBELB.start,
			bottomRight,
			topRight,
			intersBELB.end
		]);
	} else if ((sign == ">=") && (a < 0) || (sign == "<=") && (a > 0)) {
		// area to the left
		drawPolygon([
			intersBELB.start,
			bottomLeft,
			topLeft,
			intersBELB.end
		]);
	// in the following block:
	// a must be 0,
	// b must not be 0,
	// sign must be ">=" or "<="
	} else if ((sign == ">=") && (b > 0) || (sign == "<=") && (b < 0)) {
		// area to the top
		drawPolygon([
			intersBELB.start,
			topLeft,
			topRight,
			intersBELB.end
		]);
	} else {
		// area to the bottom
		drawPolygon([
			intersBELB.start,
			bottomLeft,
			bottomRight,
			intersBELB.end
		]);
	}

/*
	Ci-dessous listent tout les cas avec les conditions non regroupées, après une analyse et un regroupement, on a obtenu les cas simplifiés ci-dessus à implémenter dans la fontion réelle

	if (a > 0 && b > 0) {
		if (sign == ">=") {
			// right top
		} else if (sign == "<=") {
			// left bottom
		}
	} else if (a < 0 && b < 0) {
		if (sign == ">=") {
			// left bottom
		} else if (sign == "<=") {
			// right top
		}
	} else if (a > 0 && b < 0) {
		if (sign == ">=") {
			// right bottom
		} else if (sign == "<=") {
			// left top
		}
	} else if (a < 0 && b > 0) {
		if (sign == ">=") {
			// left top
		} else if (sign == "<=") {
			// right bottom
		}
	} else if (a > 0 && b = 0) {
		// vertical
		if (sign == ">=") {
			// right
		} else if (sign == "<=") {
			// left
		}
	} else if (a < 0 && b = 0) {
		if (sign == ">=") {
			// left
		} else if (sign == "<=") {
			// right
		}
	} else if (a = 0 && b > 0) {
	// no intersection with top and botton line
		// horizontal
		if (sign == ">=") {
			// top
		} else if (sign == "<=") {
			// bottom
		}
	} else if (a = 0 && b < 0) {
		if (sign == ">=") {
			// bottom
		} else if (sign == "<=") {
			// top
		}
	}
*/

}

/**
 * drawAreaFromEquations: dessiner zone pour chaque (in)équations parmi des plusieurs (in)équations, toujours en coordonnée
 * @param  {Array} arrayOfEquations Array contenant des objets {a: , b: , c: , sign: } représentant les (in)équations [ax + by sign c]
 * @return null
 */
function drawAreaFromEquations(arrayOfEquations) {
	var n = arrayOfEquations.length + 2;
	ctx.fillStyle = "rgba(0, 0, 200, " + (1.1 / n) + ")";
	ctx.strokeStyle = "#0000ff";
	arrayOfEquations.forEach(function(equation) {
		drawArea(equation.a, equation.b, equation.c, equation.sign);
	});
	ctx.strokeStyle = "#000";
	drawArea(1, 0, 0, ">=");
	drawArea(0, 1, 0, ">=");
}

/**
 * getIntersectionsFromEquations: Obtenir les intersections entre chaque paire des (in)équations (la fonction traite une inéquation comme une équation)
 * @param  {Array} arrayOfEquations Array contenant des objets {a: , b: , c: , sign: } représentant les (in)équations [ax + by sign c]
 * @param  {Boolean} includeBorder  si true, la fonction calcule équalement les intersections entre chaque (in)équations données et chaque droite de la bordure de canvas
 * @return {Array}                  Array contenant des objets de point d'intersection
 */
function getIntersectionsFromEquations(arrayOfEquations, includeBorder) {
	if (includeBorder) {
		var pixelBottomLeft = pixelToCoord({x: 0, y: 0});
		var pixelTopRight = pixelToCoord({x: ctx.canvas.width, y: ctx.canvas.height});
		var arrayOfBorderEquations = [];
		arrayOfBorderEquations.push({a: 1, b: 0, c: pixelBottomLeft.x, sign: "="});//1x + 0y = pixelBottomLeft.x
		arrayOfBorderEquations.push({a: 0, b: 1, c: pixelBottomLeft.y, sign: "="});//0x + 1y = pixelBottomLeft.y
		arrayOfBorderEquations.push({a: 1, b: 0, c: pixelTopRight.x, sign: "="});//1x + 0y = pixelTopRight.x
		arrayOfBorderEquations.push({a: 0, b: 1, c: pixelTopRight.y, sign: "="});//0x + 1y = pixelTopRight.y
	}
	var intersectionsArray = [];
	for (var i = 0, l = arrayOfEquations.length; i < l; i++) {
		for (var i2 = i + 1; i2 < l; i2++) {
			intersectionsArray.push(getIntersection(
				arrayOfEquations[i].a, arrayOfEquations[i].b, arrayOfEquations[i].c,
				arrayOfEquations[i2].a, arrayOfEquations[i2].b, arrayOfEquations[i2].c,
			));
		}
		if (includeBorder) {
			arrayOfBorderEquations.forEach(function(borderEquation){
				intersectionsArray.push(getIntersection(
					arrayOfEquations[i].a, arrayOfEquations[i].b, arrayOfEquations[i].c,
					borderEquation.a, borderEquation.b, borderEquation.c,
				));
			});
		}
	}
	return intersectionsArray;
}

/**
 * reducePoints: réduire un Array de points à ceux qui satisfont toutes les (in)équations de contrainte
 * @param  {Array} pointsArray              Array contenant des objets de point
 * @param  {Array} constraintEquationsArray Array contenant des objets d'(in)équation de contrainte
 * @return {Array}                          Array contenant des objets de point, chaque point satisfait toutes les (in)équations de contrainte
 */
function reducePoints(pointsArray, constraintEquationsArray) {
	return pointsArray.filter(function(point) {
		if (typeof point === "string") {
			return false;
		}
		return constraintEquationsArray.every(function(constraintEquation) {
			var bool;
			if (constraintEquation.sign === "<=") {
				bool = (+(constraintEquation.a * point.x + constraintEquation.b * point.y).toFixed(8) <= +constraintEquation.c.toFixed(8));
			} else if (constraintEquation.sign === ">=") {
				bool = (+(constraintEquation.a * point.x + constraintEquation.b * point.y).toFixed(8) >= +constraintEquation.c.toFixed(8));
			} else if (constraintEquation.sign === "=") {
				bool = (+(constraintEquation.a * point.x + constraintEquation.b * point.y).toFixed(8) === +constraintEquation.c.toFixed(8));
			}
			return bool;
		});
	});
}

/**
 * drawCoordinateGrid: dessiner le système de grille de coordonnées
 * @return null
 */
function drawCoordinateGrid() {

	ctxCoordGrid.clearRect(0, 0, ctxCoordGrid.canvas.width, ctxCoordGrid.canvas.height);
	ctxCoordText.clearRect(0, 0, ctxCoordText.canvas.width, ctxCoordText.canvas.height);

	coordPerPixelX = (xMaxCoord - xMinCoord) * (1 + whiteSpaceRatio) / ctx.canvas.width;
	coordPerPixelY = (yMaxCoord - yMinCoord) * (1 + whiteSpaceRatio) / ctx.canvas.height;

	originPosPixelX = ctx.canvas.width * (whiteSpaceRatio / 2) + (0 - xMinCoord) / coordPerPixelX;
	originPosPixelY = ctx.canvas.height * (whiteSpaceRatio / 2) + (0 - yMinCoord) / coordPerPixelY;

	coordPerGridX = Math.round(pixelPerGridX * coordPerPixelX);
	pixelPerGridX = coordPerGridX / coordPerPixelX;

	coordPerGridY = Math.round(pixelPerGridY * coordPerPixelY);
	pixelPerGridY = coordPerGridY / coordPerPixelY;

	ctxCoordGrid.strokeStyle = "#ddd";
	ctxCoordText.font = "14px Arial";
	ctxCoordText.textAlign = "center";
	for (var x = originPosPixelX + pixelPerGridX, gridIndex = coordPerGridX; x < ctx.canvas.width; x += pixelPerGridX, gridIndex += coordPerGridX) {
		drawLine({x: x, y: 0}, {x: x, y: ctx.canvas.height}, ctxCoordGrid);
		addText(gridIndex, {x: x, y: originPosPixelY - 12}, ctxCoordText);
	}
	for (var x = originPosPixelX - pixelPerGridX, gridIndex = -coordPerGridX; x > 0; x -= pixelPerGridX, gridIndex -= coordPerGridX) {
		drawLine({x: x, y: 0}, {x: x, y: ctx.canvas.height}, ctxCoordGrid);
		addText(gridIndex, {x: x, y: originPosPixelY - 12}, ctxCoordText);
	}
	ctxCoordText.textAlign = "right";
	addText("0", {x: originPosPixelX, y: originPosPixelY - 12}, ctxCoordText);
	for (var y = originPosPixelY + pixelPerGridY, gridIndex = coordPerGridY; y < ctx.canvas.height; y += pixelPerGridY, gridIndex += coordPerGridY) {
		drawLine({x: 0, y: y}, {x: ctx.canvas.width, y: y}, ctxCoordGrid);
		addText(gridIndex, {x: originPosPixelX, y: y - 6}, ctxCoordText);
	}
	for (var y = originPosPixelY - pixelPerGridY, gridIndex = -coordPerGridY; y > 0; y -= pixelPerGridY, gridIndex -= coordPerGridY) {
		drawLine({x: 0, y: y}, {x: ctx.canvas.width, y: y}, ctxCoordGrid);
		addText(gridIndex, {x: originPosPixelX, y: y - 6}, ctxCoordText);
	}

}


} catch(e) {
}

})();
