"use strict";function _typeof(e){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}!function(){try{var q=function(e,t,n,a){a&&(e=s(e)),(n=n||B).beginPath(),n.arc(e.x,n.canvas.height-e.y,t,0,2*Math.PI,!0),n.closePath(),n.fill()},M=function(e,t,n,a){a&&(e=s(e),t=s(t)),(n=n||B).beginPath(),n.moveTo(e.x,n.canvas.height-e.y),n.lineTo(t.x,n.canvas.height-t.y),n.closePath(),n.stroke()},u=function(e){var n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:B,a=2<arguments.length?arguments[2]:void 0;n.beginPath(),e.forEach(function(e,t){a&&(e=s(e)),0===t?n.moveTo(e.x,n.canvas.height-e.y):n.lineTo(e.x,n.canvas.height-e.y)}),n.closePath(),n.fill()},s=function(e){var t=e.x,n=e.y;return{x:Z+t/L,y:z+n/P}},w=function(e){var t=e.x,n=e.y;return{x:L*(t-Z),y:P*(n-z)}},a=function(e,t,n,a){var r,i;if(n&&(e=s(e),t=s(t)),e.x===t.x){if(e.y===t.y)return null;r={x:e.x,y:0},i={x:e.x,y:B.canvas.height}}else if(e.y===t.y)r={x:0,y:e.y},i={x:B.canvas.width,y:e.y};else{var o=(t.y-e.y)/(t.x-e.x),c=t.y-o*t.x,l=function(e){return(e-c)/o};r={x:l(0),y:0},i={x:l(B.canvas.height),y:B.canvas.height}}return a||M(r,i),{start:r,end:i}},E=function(e,t,n,a){a&&(t=s(t)),(n=n||B).fillText(e,t.x,B.canvas.height-t.y)},h=function(e,t,n,a,r,i){var o,c;if(0===e&&0===t||0===a&&0===r)return"invalid";if(0===t&&0===r&&n!==i||0===e&&0===a&&n!==i)return"parallel";if(0===t&&0===r&&n===i||0===e&&0===a&&n===i)return"same line";if(0===t)o=n/e,c=i/r-n*a/(e*r);else if(0===r)o=i/a,c=n/t-i*e/(a*t);else if(0===e)o=i/a-r*n/(t*a),c=n/t;else if(0===a)o=n/e-t*i/(r*e),c=i/r;else{if(e/t==a/r)return n/t==i/r?"same line":"parallel";o=(i-n*r/t)/(a-e*r/t),c=(i-n*a/e)/(r-t*a/e)}return{x:o,y:c}},F=function(e,t,n){return 0===e&&0===t?null:0===e?a({x:0,y:n/t},{x:1,y:n/t},!0):0===t?a({x:n/e,y:0},{x:n/e,y:1},!0):0===n?a({x:0,y:0},{x:1,y:-e/t},!0):a({x:0,y:n/t},{x:n/e,y:0},!0)},k=function(e,t,n,a){var r=F(e,t,n),i={x:0,y:B.canvas.height},o={x:B.canvas.width,y:B.canvas.height},c={x:0,y:0},l={x:B.canvas.width,y:0};"="===a||0===e&&0===t||u(">="===a&&0<e||"<="===a&&e<0?[r.start,l,o,r.end]:">="===a&&e<0||"<="===a&&0<e?[r.start,c,i,r.end]:">="===a&&0<t||"<="===a&&t<0?[r.start,i,o,r.end]:[r.start,c,l,r.end])},A=function(i,n){var a=[],o=[];if(n){var e=w({x:0,y:0}),t=w({x:B.canvas.width,y:B.canvas.height});a.push({a:1,b:0,c:e.x,sign:"="}),a.push({a:0,b:1,c:e.y,sign:"="}),a.push({a:1,b:0,c:t.x,sign:"="}),a.push({a:0,b:1,c:t.y,sign:"="})}for(var r=function(r,e){for(var t=r+1;t<e;t+=1)o.push(h(i[r].a,i[r].b,i[r].c,i[t].a,i[t].b,i[t].c));n&&a.forEach(function(e){var t=e.a,n=e.b,a=e.c;o.push(h(i[r].a,i[r].b,i[r].c,t,n,a))})},c=0,l=i.length;c<l;c+=1)r(c,l);return o},T=function(e,t){return e.filter(function(o){return"string"!=typeof o&&t.every(function(e){var t,n=e.sign,a=e.a,r=e.b,i=e.c;return"<="===n?t=+(a*o.x+r*o.y).toFixed(8)<=+i.toFixed(8):">="===n?t=+(a*o.x+r*o.y).toFixed(8)>=+i.toFixed(8):"="===n&&(t=+(a*o.x+r*o.y).toFixed(8)==+i.toFixed(8)),t})})},C=0,c=0,R=function(e){return e[document.documentElement.lang.split("-")[0]]},l=function(a){var e=document.querySelectorAll(".polynomial");C<a?e.forEach(function(e){for(var t=C+1;t<=a;t+=1){var n=document.createElement("span");n.className="term",n.dataset.no=t,n.innerHTML='<input class="term-input" value="" type="number" step="any" /><span class="variable" data-var="x"></span></span>',e.appendChild(n)}}):e.forEach(function(e){for(var t=C;a<t;t-=1)e.removeChild(e.lastChild)}),C=a},v=function(e){var t=document.querySelector("#constraint-list");if(c<e)for(var n=c+1;n<=e;n+=1){var a=document.querySelector("#constraint-example").cloneNode(!0);a.id="",a.dataset.cno=n,t.appendChild(a)}else for(var r=c;e<r;r-=1)t.removeChild(t.lastChild);c=e},e=function(t){var n,a;document.querySelectorAll(".extremization .term-input").forEach(function(e){e.value=t?Math.floor(51*Math.random()):Math.floor(101*Math.random())-50}),document.querySelector(".extremization option[value='".concat(t||.5<=Math.random()?"max":"min","']")).selected=!0,document.querySelectorAll("#constraint-list .constraint").forEach(function(e){e.querySelectorAll(".term-input").forEach(function(e){e.value=t?Math.floor(11*Math.random()):Math.floor(21*Math.random())-10}),e.querySelector(".result-input").value=t?Math.floor(51*Math.random()):Math.floor(101*Math.random())-50,n=Math.random(),a=t||n<=.45?"<=":n<=.9?">=":"=",e.querySelector("option[value='".concat(a,"']")).selected=!0})};document.querySelectorAll(".posint").forEach(function(e){var t=e.querySelector("button[increment]"),n=e.querySelector("button[decrement]"),a=e.querySelector("input"),r=+a.max,i=+a.min,o=+a.step;t.addEventListener("click",function(){var e=+a.value+o;a.value=e,a.dispatchEvent(new Event("change"))},!1),n.addEventListener("click",function(){var e=+a.value-o;a.value=e,a.dispatchEvent(new Event("change"))},!1),a.addEventListener("change",function(){var e=a.value;/^[0-9]+$/.test(e)&&i<=+e&&+e<=r?"vars-number-input"===a.id?l(+e):v(+e):"vars-number-input"===a.id?a.value=C:a.value=c})}),document.querySelector("#generate").addEventListener("click",function(){e(!1)},!1),document.querySelector("#generate-typical").addEventListener("click",function(){e(!0)},!1),document.querySelector("#solve").addEventListener("click",function(){if(2!==C)return document.querySelector("#result").innerText=R({en:"The graphical method only works for 2 variables!",fr:"La mèthode graphique ne fonctionne que pour 2 variables !"}),B.clearRect(0,0,B.canvas.width,B.canvas.height),D.clearRect(0,0,B.canvas.width,B.canvas.height),void G.clearRect(0,0,B.canvas.width,B.canvas.height);var a={},n=[],r=document.querySelectorAll(".extremization .term-input");if(""===r[0].value&&(r[0].value=0),""===r[1].value&&(r[1].value=0),"0"===r[0].value&&"0"===r[1].value)return document.querySelector("#result").innerText="Z est toujours de 0 !",B.clearRect(0,0,B.canvas.width,B.canvas.height),D.clearRect(0,0,B.canvas.width,B.canvas.height),void G.clearRect(0,0,B.canvas.width,B.canvas.height);a.a=+r[0].value,a.b=+r[1].value;var i=document.querySelector(".extremization .sign");a.ext=i.options[i.selectedIndex].value,document.querySelectorAll("#constraint-list .constraint").forEach(function(e){var t={};""===(r=e.querySelectorAll(".term-input"))[0].value&&(r[0].value=0),""===r[1].value&&(r[1].value=0),t.a=+r[0].value,t.b=+r[1].value,t.c=+e.querySelector(".result-input").value,i=e.querySelector(".sign"),t.sign=i.options[i.selectedIndex].value,n.push(t)});var e=n.slice(0);e.push({a:1,b:0,c:0,sign:">="}),e.push({a:0,b:1,c:0,sign:">="});var t=A(e),o=[],c=[];t.forEach(function(e){"object"===_typeof(e)&&(o.push(e.x),c.push(e.y))}),0!==o.length&&(_=Math.ceil(Math.max.apply(null,o)),j=Math.floor(Math.min.apply(null,o)),N=Math.ceil(Math.max.apply(null,c)),H=Math.floor(Math.min.apply(null,c)));var l,u,s=_-j,h=N-H;s<6&&(_=Math.ceil(_+(6-s)/2),j=Math.floor(j-(6-s)/2)),h<6&&(N=Math.ceil(N+(6-h)/2),H=Math.floor(H-(6-h)/2)),function(){D.clearRect(0,0,D.canvas.width,D.canvas.height),G.clearRect(0,0,G.canvas.width,G.canvas.height),L=(_-j)*(1+$)/B.canvas.width,P=(N-H)*(1+$)/B.canvas.height,Z=B.canvas.width*($/2)+(0-j)/L,z=B.canvas.height*($/2)+(0-H)/P,I=Math.round(J*L),J=I/L,V=Math.round(K*P),K=V/P,D.strokeStyle="#ddd",G.font="14px Arial",G.textAlign="center";for(var e=Z+J,t=I;e<B.canvas.width;e+=J,t+=I)M({x:e,y:0},{x:e,y:B.canvas.height},D),E(t,{x:e,y:z-12},G);for(var n=Z-J,a=-I;0<n;n-=J,a-=I)M({x:n,y:0},{x:n,y:B.canvas.height},D),E(a,{x:n,y:z-12},G);G.textAlign="right",E("0",{x:Z,y:z-12},G);for(var r=z+K,i=V;r<B.canvas.height;r+=K,i+=V)M({x:0,y:r},{x:B.canvas.width,y:r},D),E(i,{x:Z,y:r-6},G);for(var o=z-K,c=-V;0<o;o-=K,c-=V)M({x:0,y:o},{x:B.canvas.width,y:o},D),E(c,{x:Z,y:o-6},G)}(),B.clearRect(0,0,B.canvas.width,B.canvas.height),u=(l=n).length+2,B.fillStyle="rgba(0, 0, 200, ".concat(1.1/u,")"),B.strokeStyle="#0000ff",l.forEach(function(e){var t=e.a,n=e.b,a=e.c,r=e.sign;k(t,n,a,r)}),B.strokeStyle="#000",k(1,0,0,">="),k(0,1,0,">="),B.strokeStyle="red",F(a.a,a.b,0);var v=T(t,e);B.fillStyle="yellow",v.forEach(function(e){q(e,3,B,!0)});var d,f=A(e,!0),y=T(f,e);if(0===y.length)d=R({en:"".concat("max"===a.ext?"maximum":"minimum"," value of Z does not exist."),fr:"Valeur ".concat("max"===a.ext?"maximale":"minimale"," de Z n'existe pas.")});else{var x=[];y.forEach(function(e){var t=e.x,n=e.y;x.push(a.a*t+a.b*n)});var m=Math[a.ext].apply(null,x),p=x.reduce(function(e,t,n){return t===m&&e.push(n),e},[]),g=[];p.forEach(function(e){g.push(y[e])}),g=g.filter(function(e,t,n){var a=e.ex,r=e.ey;return t===n.findIndex(function(e){var t=e.ox,n=e.oy;return t===a&&n===r})});var S=w({x:0,y:0}),b=w({x:B.canvas.width,y:B.canvas.height});g.every(function(e){var t=e.x,n=e.y;return+t.toFixed(8)==+S.x.toFixed(8)||+t.toFixed(8)==+b.x.toFixed(8)||+n.toFixed(8)==+S.y.toFixed(8)||+n.toFixed(8)==+b.y.toFixed(8)})?d=R({en:"".concat("max"===a.ext?"maximum":"minimum"," value of Z is the positive or negative infinity."),fr:"Valeur ".concat("max"===a.ext?"maximale":"minimale"," de Z est l'infini positif ou négatif.")}):(d=R({en:"".concat("max"===a.ext?"maximum":"minimum"," value of Z is ").concat(+m.toFixed(5),", which occurs at "),fr:"Valeur ".concat("max"===a.ext?"maximale":"minimale"," de Z est de ").concat(+m.toFixed(5),", qui se produit sur ")}),1===g.length?d+=R({en:"the point ",fr:"le point "}):d+=R({en:"the points ",fr:"les points "}),g.forEach(function(e,t){B.fillStyle="red",q(e,3,B,!0),d+="(".concat(+e.x.toFixed(5),", ").concat(+e.y.toFixed(5),")"),1!==g.length&&(t===g.length-2?d+=R({en:" and ",fr:" et "}):t!==g.length-1&&(d+=", "))}),1===g.length?d+=".":d+=R({en:", as well as all the points on the line segment between them.",fr:", ainsi que tous les points sur le segment de droite entre eux."}))}document.querySelector("#result").innerText=d},!1),document.querySelector("#vars-number-input").value=2,l(2),document.querySelector("#constraint-number-input").value=2,v(2),e(!0);var L,P,Z,z,I,V,_=10,j=-10,N=10,H=-10,$=.14,B=document.querySelector(".canvas-main").getContext("2d"),D=document.querySelector(".canvas-coordgrid").getContext("2d"),G=document.querySelector(".canvas-coordtext").getContext("2d"),J=B.canvas.width/(10*(1+$)),K=B.canvas.height/(10*(1+$))}catch(e){}}();