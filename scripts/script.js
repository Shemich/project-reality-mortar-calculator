var [size_x, size_y] =  getMapSize('');

function getMapSize(name)
{
	switch (name)
	{
		case "al-basrah":		return [2100, 2100];
		case "assault-on-grozny":			return [2100, 2100];
		case "fools-road":		return [1733, 1777];
		case "gorodok":			return [4333, 4333];
		case "kohat-toi":		return [4017, 4017];
		case "kokan":			return [2500, 2500];
		case "logar-valley":	return [1766, 1766];
		case "narva":			return [2200, 2200];
		case "op-first-light":	return [1200, 1200];
		case "sumari-bala":		return [1300, 1300];
		case "yehorivka":		return [4033, 4033];
		default:				return [3200, 3200];
	}
}

function click(what, event)
{
	const el = document.getElementById(what);
	el.style.visibility = "visible";
	el.style.left = event.clientX+"px";
	el.style.top = event.clientY+"px";
	compute();
}

function pixelToMeters(px, mapSizePx, mapSizeMeters)
{
	return (px / mapSizePx) * mapSizeMeters;
}

function point(elemName)
{
	const map = document.getElementById("currentMap").getBoundingClientRect();
	const elem = document.getElementById(elemName).getBoundingClientRect();
	const x = pixelToMeters(elem.x - map.x, map.width, size_x);
	const y = pixelToMeters(elem.y - map.y, map.height, size_y);
	return [x, y];
}

function polar(mx, my, tx, ty)
{
	const dx = tx - mx;
	const dy = ty - my;
	const dist = Math.round(Math.hypot(dx, dy));
	const dir = Math.round(Math.atan2(dx, -dy) * 180 / Math.PI + 360) % 360;
	return [dist, dir];
}

/*
 * расстояние в метрах переводим в угол вертикали
 */
function distanceToMil(distance)
{
	if (distance < 100) return "БЛИЗКО";
	if (distance > 1500) return "ДАЛЕКО";
	const milliradians = [1567, 1550, 1533, 1516, 1498, 1481, 1463, 1446, 1428, 1410, 1391, 1373, 1354, 1334, 1314, 1294, 1273, 1252, 1229, 1206, 1182, 1156, 1129, 1099, 1067, 1031, 988, 933, 801, ];
	const i_frac = distance  / 50 - 2; //-2 тк дальность 100 150 ... 1500 (т.е пропускается 2 по 50)
	const i = Math.floor(i_frac); //Индекс массива в который целимся
	const [a, b] = milliradians.slice(i); //[i] и [i+1]
	const k = i_frac - i;
	return Math.round(a - (a - b) * k);
}

function compute()
{
	const [mx, my] = point("mortar");
	const [tx, ty] = point("target");
	const [dist, dir] = polar(mx, my, tx, ty);
	const mil = distanceToMil(dist);

	document.getElementById("form_distance").value = dist + " метров";
	document.getElementById("form_deg").value = dir + "°";
	document.getElementById("form_mil").value = mil + "°";
}

function changeMap(name, brightness)
{
	document.getElementById("currentMap").src = "images/maps/"+name+".png";
	document.getElementById("mortar").style.visibility = "hidden";
	document.getElementById("target").style.visibility = "hidden";
	document.getElementById("currentMap").style.filter = "brightness("+brightness+"%)";
	[size_x, size_y] = getMapSize(name);
}

window.onload = function(){
	document.getElementById("currentMap").addEventListener("contextmenu", function(event){
		event.preventDefault();
		click("mortar", event);
	});
	document.getElementById("currentMap").addEventListener("click", function(event){
		click("target", event);
	});
	document.getElementById("mortar").addEventListener("contextmenu", function(event){
		event.preventDefault();
		click("mortar", event);
	});
	document.getElementById("mortar").addEventListener("click", function(event){
		click("target", event);
	});
	document.getElementById("target").addEventListener("contextmenu", function(event){
		event.preventDefault();
		click("mortar", event);
	});
	document.getElementById("target").addEventListener("click", function(event){
		click("target", event);
	});
}