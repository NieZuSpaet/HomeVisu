	 
var Plc =  TAME.WebServiceClient.createClient({
    serviceUrl: 'http://192.168.2.220/TcAdsWebService/TcAdsWebService.dll',
    amsNetId: '192.168.2.220.1.1',
    amsPort: '801',     //default
    dataAlign4: true,  //default, set it to "true" if you have an ARM based PLC device (i.e. CX90xx)
    language: 'ge'       //default, set it to "en" for english names of days and months
});

 
var PLC_VAR = {
	Wetter: [],
	Technik: [],
	ArrTimer: [],
	DimmerVisu:[], 
	DimmerOut:[],  
	stLueftung:[],
	ArrStatusVisu:[],
	ArrErrorVisu:[],
	ArrToggleSteckdose:[],
	ArrToggleLicht:[],
	ArrTempVisu:[], 
	ArrRaffVisu:[],
	arrWetter: [],
};

var Wetter_Struct = {
	RegenDatum				: 	'DT.#DD#. #MONTH# #YYYY#',
	RegenUhrzeit			: 	'DT.#hh#:#mm#',
	tSunrise				: 	'TIME.#hh#:#mm#',
	tSunset					: 	'TIME.#hh#:#mm#',
	fSunZenith				: 	'UINT',
	fSunAzimuth				: 	'UINT',
	nOutdoortemp			:	'INT',		
	nGefTemp				:	'INT',		
	nLuftfeuchtigkeit		: 	'INT',
	nSunSouth				:	'INT',	
	nSunWest				:	'INT',		
	nSunEast				:	'INT',	
	nWindspeed				:	'INT',	
	nWindspeedMittelwert	:	'INT',	 
	nWindspeedMax			:	'INT',	
	nWindDir				:	'INT',	
	nBft					:   'INT',
	nBrightness				:	'INT',	
	nLuftdruck				:	'INT',
	nLuftdruck3h			:	'INT',
	nLuftdruck6h			:	'INT',
	nMaxWind24h				: 	'INT',
	nMaxTemp24h				: 	'INT',
	nMinTemp24h				: 	'INT',
	nRegen10m				:   'INT',
	nRegen24h				:   'INT',
	nRegenRate				:   'INT',
	nMaxRegenRate10m		:	'INT',
	bRain					: 	'BOOL',
	bDusk					: 	'BOOL',
};

var Timer_Struct = {
	ENABLE					: 	'BOOL',
	NAME					: 	'STRING.16',
	START 					: 	'TOD.#hh#:#mm#',
	DURATION 				: 	'TIME.#hh#:#mm#',
	LUX						: 	'INT',
	STOP					: 	'TOD.#hh#:#mm#',
	MODE 					: 	'BYTE',
};


var structdef_ArrStatusVisu = {
	arrStatusVisu		:'BOOL'
};

var structdef_ArrErrorVisu = {
	arrErrorVisu		:'BOOL'
};

var structdef_ArrAnalogwertDimmer = {
	arrAna_Dimm_Out		:'WORD'
};	 
	 
var structdef_ArrDimmerVisu = {
		vis_DimmID		:'INT',
		vis_DimmUp		:'BOOL',
		vis_DimmDwn		:'BOOL',
		vis_DimmSet		:'BOOL',
		vis_DimmOff		:'BOOL',
		vis_DimmIst		:'INT',
		vis_DimmSoll	:'INT'
};
	
var structdef_ArrTempVisu = {
	arrTempVisu		:'INT1DP'
};
  
var arrWetter_Struct = { 
	dtTime				:'DT.#YYYY#-#MM#-#DD#-#hh#:#mm#',
	nTemperatur			:'INT',
	nMittelWind			:'INT',
	nMaxWind			:'INT',
	nMittelWindRasp		:'INT',
	nMaxWindRasp		:'INT',
	nWindrichtung		:'INT',
	nLuftdruck			:'INT',
	nLuftfeuchtigkeit	:'INT',
	nRegen				:'INT',
	nRegenRate			:'INT',
	nMaxRegenRate10m	:'INT',
	nHelligkeit			:'UDINT',
	bRain				:'BOOL'
};  
  
var structdef_Technik = {  
	dtTime			:'DT.#YYYY#-#MM#-#DD#-#hh#:#mm#',
	nLeistung		:'INT',
	nTempOutdoor	:'INT',
	nTempFL			:'INT',
	nTempWG			:'INT',
	nTempWE			:'INT',
	nTempKU			:'INT',
	nTempGB			:'INT',
	nTempST			:'INT',
	nTempSC			:'INT',
	nTempBD			:'INT',
	nTempAN			:'INT',
	nTempTH			:'INT',
	nTempAVG		:'INT',
	nTempWP_VL		:'INT',
	nTempWP_RL		:'INT',
	nTempWW_Oben	:'INT',
	nTempWW_Unten	:'INT',
	nTempLftg_Zuluft:'INT',
	nTempLftg_Abluft:'INT',
	nSonne			:'INT',
	nHeizstab		:'INT'  
};
var structdef_lueftung ={
	bBetrieb			:'BOOL',
	bSommerbetrieb		:'BOOL',
	bStosslueftung		:'BOOL',
	bStandby			:'BOOL',
	nTempSchaltschwelle	:'INT',
	nTempHysterese		:'INT',
	nTempRaumMittel		:'INT',
	nTempAussenluft		:'INT',
	nTempAbluft			:'INT',
	nTempZuluft			:'INT',
	nTempFrischluft		:'INT',
	nTempFortluft		:'INT'
};

var structdef_ArrRaffVisu = {  
	bVerschattung_Visu	:'BOOL',
	bSet				:'BOOL',
	bDisableTracking	:'BOOL',
	bTuerKontaktAktiv	:'BOOL',
	bWindAktiv			:'BOOL',
	iPosSet				:'INT',
	iAngSet				:'INT',
	iPosIst				:'INT',
	iAngIst				:'INT' 
};

var  	nRegenHilf,
		nWindHilf,
		nJahr,
		nMonat,
		nTag,
		nStunde,
		nMinute,
		arrTemperatur = new Array(),
		arrWindMittel = new Array(),
		arrWindMax = new Array(),
		arrLuftdruck = new Array(),
		arrLuftfeuchtigkeit = new Array(),
		arrHelligkeit = new Array(),
		arrRegen = new Array(),
		Xstart= new Date(),
		XstartHilf = new Date(),	
		success = 0,
		errors = 0,
		docrev =1,
		count=1,
		plc_SystemTime,
 		plc_nDimmerWert,
 		q=1,
 		plc_status_sps,
 		plc_toggle,
 		PLC_LOOP_READ = false,
 		slider_wert = 12,
 		stunden,
 		minuten,
 		lastDimmValue = 0,
 		lastRaffPosValue,
 		lastRaffAngValue,
 		glbIndexSS,
		glbIndexDIM = 0,
		glbIndexLA,
		glbIndexRA,
		nStartwert,
		nEndwert,
		nVarName,
		nglbAnzahlSteckdosen		= 56,
		nglbAnzahlDimmer			= 11,
		nglbAnzahlLampen			=  8,
		nglbAnzahlLichttaster		= 20,
		nglbAnzahlRauchmelder		=  7,
		nglbAnzahlTemperaturen		= 12,
		nglbAnzahlTimer				= 20,
		nglbAnzahlRaffstore			= 12,
		nglbAnzahlFensterkontakte	= 14;



/****************************************************************/
/*****														*****/		
/*****				Wetter Chart							*****/		
/*****														*****/		
/****************************************************************/

	function chart()
	{
		nJahr = PLC_VAR.arrWetter[0].dtTime.slice(0,4);
		nMonat = PLC_VAR.arrWetter[0].dtTime.slice(5,7);
		nTag = PLC_VAR.arrWetter[0].dtTime.slice(8,10);
		nStunde = PLC_VAR.arrWetter[0].dtTime.slice(11,13);
		nMinute = PLC_VAR.arrWetter[0].dtTime.slice(14,16);
	
		XstartHilf.setFullYear(nJahr);
		XstartHilf.setMonth(nMonat-1);
		XstartHilf.setDate(nTag);
		XstartHilf.setUTCHours(nStunde);
		XstartHilf.setMinutes(nMinute);
		XstartHilf.setSeconds(0);
		XstartHilf.setMilliseconds(0);
		
		Xstart = Date.parse(XstartHilf);
	
		for (var k = 0; k < 720; k++) {
			arrTemperatur[k]		= PLC_VAR.arrWetter[k].nTemperatur / 10;
			arrWindMittel[k] 		= PLC_VAR.arrWetter[k].nMittelWind / 100;
			arrWindMax[k]			= PLC_VAR.arrWetter[k].nMaxWind / 100;
			arrLuftdruck[k] 		= PLC_VAR.arrWetter[k].nLuftdruck / 10;
			arrLuftfeuchtigkeit[k] 	= PLC_VAR.arrWetter[k].nLuftfeuchtigkeit / 10;
			arrHelligkeit[k] 		= PLC_VAR.arrWetter[k].nHelligkeit / 1000;
			nRegenHilf = PLC_VAR.arrWetter[k].bRain;
			if ( nRegenHilf == true)	{ 
				arrRegen[k] = 1;
			} else { 
				arrRegen[k] = 0;
			};
		}
	
		var highchartsOptions = Highcharts.setOptions(Highcharts.theme);   
	   	var chart = new Highcharts.StockChart({
			chart: {renderTo: 'container', type: 'arearange',top:200, height: 670,marginLeft:40, marginRight:40,  },credits: {enabled: false},
		    navigator: {enabled: true,height: 80,xAxis: {	gridLineWidth:1,startOnTick: true,endOnTick: true,labels: {enabled: true}},},
			rangeSelector: {enabled: true,selected: 4,buttonSpacing: 3,buttons: [
			    		{	type: 'minute',	count: 60,		text: '1'	}, 
						{	type: 'minute',	count: 180,		text: '3' 	}, 
						{	type: 'minute',	count: 360,		text: '6'	}, 
						{	type: 'minute',	count: 720,		text: '12'	}, 
						{	type: 'minute',	count: 1440,	text: '24'	}, 
						{	type: 'minute',	count: 4320,	text: '72'	}, 
						{	type: 'all',	count: 1,		text: 'All'	}],
						inputDateFormat: '%d.%m.%Y',inputEditDateFormat: '%d.%m.%Y',},scrollbar : {enabled : false},title: { text: '' },
			legend: {enabled: true,verticalAlign: 'top',},
			yAxis: [	{	labels:{enabled: true},		title: {text: 'Wind'		},			opposite: false,				height: 200,	lineWidth: 0,	min: 0},
	            		{	labels:{enabled: true},		title: {text: 'Temperatur'	},			opposite: true,					height: 200,	lineWidth: 0,							},
	            		{	labels:{enabled: false},	title: {text: 'Regen',margin: -15},		opposite: false,	top: 480,	height: 55,						min: 0,	max: 0.25,range: 0 },
		    			{	labels:{enabled: true},		title: {text: 'Luftdruck',margin: 10},	opposite: true,		top: 265,	height: 200,	lineWidth: 0,					offset: 0,						minTickInterval: 1},
		    			{	labels:{enabled: true},		title: {text: 'Helligkeit',margin: 10},	opposite: true,		top: 480,	height: 55,		lineWidth: 0,	min: 0,	max:17,	offset: 0},
		    			{	labels:{enabled: true},		title: {text: 'Luftfeuchte',margin: 10},opposite: false,	top: 265,	height: 200,	lineWidth: 0,					offset: 0,startOnTick: false,endOnTick: false}
		    		],
		    series: [	{	index: 0,type: 'areaspline',	name: 'Temperatur',			tooltip: {valueSuffix: '°C',	yDecimals: 1},	data:  arrTemperatur,		pointStart: Xstart,pointInterval: 1000 * 60 * 10,yAxis: 1,threshold : null,	fillColor :	{linearGradient : {x1: 4, y1: 4, x2: 0, y2: 0},	stops : [[0, Highcharts.getOptions().colors[0]], [1, 'rgba(0,0,0,0)']]}},
			      		{	index: 1,type: 'areaspline',	name: 'Wind',				tooltip: {valueSuffix: 'm/s',	yDecimals: 1},	data:  arrWindMittel,		pointStart: Xstart,pointInterval: 1000 * 60 * 10,yAxis: 0,threshold : null,	fillColor :	{linearGradient : {x1: 3, y1: 3, x2: 0, y2: 0},	stops : [[0, Highcharts.getOptions().colors[1]], [1, 'rgba(0,0,0,0)']]}},
			     		{	index: 2,type: 'spline',		name: 'Windmax',			tooltip: {valueSuffix: 'm/s',	yDecimals: 1},	data:  arrWindMax,			pointStart: Xstart,pointInterval: 1000 * 60 * 10,yAxis: 0,lineWidth : 0,marker : {enabled : true,radius : 2},},
						{	index: 3,type: 'spline',		name: 'Helligkeit',			tooltip: {valueSuffix: 'kLux',	yDecimals: 3},	data:  arrHelligkeit,		pointStart: Xstart,pointInterval: 1000 * 60 * 10,yAxis: 4,					fillColor :	{linearGradient : {x1: 4, y1: 4, x2: 0, y2: 0},	stops : [[0, Highcharts.getOptions().colors[5]], [1, 'rgba(0,0,0,0)']]}},
						{	index: 4,type: 'areaspline',	name: 'Luftdruck',			tooltip: {valueSuffix: 'hPa',	yDecimals: 1},	data:  arrLuftdruck,		pointStart: Xstart,pointInterval: 1000 * 60 * 10,yAxis: 3,threshold : null,	fillColor :	{linearGradient : {x1: 4, y1: 4, x2: 0, y2: 0},	stops : [[0, Highcharts.getOptions().colors[4]], [1, 'rgba(0,0,0,0)']]}},
						{	index: 5,type: 'column',		name: 'Regen',																data:  arrRegen,			pointStart: Xstart,pointInterval: 1000 * 60 * 10,yAxis: 2},
						{	index: 6,type: 'spline',		name: 'Luftfeuchtigkeit',	tooltip: {valueSuffix: '%',		yDecimals: 1},	data:  arrLuftfeuchtigkeit,	pointStart: Xstart,pointInterval: 1000 * 60 * 10,yAxis: 5,threshold : null,	fillColor :	{linearGradient : {x1: 5, y1: 3, x2: 0, y2: 0},	stops : [[0, Highcharts.getOptions().colors[6]], [1, 'rgba(0,0,0,0)']]}}
					],
			});
	};


$(document).on('pageshow', '#wetterchart' ,function() {

 	Plc.sumReadReq({
    	items: [{
			name: '.arrWetterdaten',
			jvar: 'PLC_VAR.arrWetter',
			def: arrWetter_Struct,
		}],
		ocd: 50,
		oc: function() { chart();},
	});

});



/****************************************************************/
/*****														*****/		
/*****					Chart Windrose klein				*****/		
/*****														*****/		
/****************************************************************/
$(document).on('pageshow', '#wetter3' ,function() {

var chart_1 = AmCharts.makeChart("container_windrose_klein", {
//    theme: "custom",
    type: "gauge",
    color:"#bbbbbb",
	fontSize:"10",
 

    axes: [{	id:"a1",	axisColor: "#cccccc",   axisThickness: 3, 	endValue: 35, 		radius: 117,	gridInside: false,   inside: false,  fontSize:"8", valueInterval:2.5, labelOffset:1, tickColor: "#cccccc",bottomTextBold:false,bottomTextYOffset:29}, 
    		{   id:"a2",	axisColor: "#cccccc",	axisThickness: 3,  	endValue: 126,   	radius: 84,   fontSize:"8", valueInterval:15, labelOffset:2,		tickColor: "#cccccc",	showLastLabel:false, bottomTextBold:false,bottomTextYOffset:25,topTextYOffset:150,topTextBold:false  },
    		{   id:"a3",	axisColor: "#cccccc",	axisThickness: 0, 	endValue: 350,  	radius: 91,    valueInterval:350,  	tickColor: "#cccccc", tickThickness:0, bands: [	{"startValue": 0,"endValue": 3, 	color: "#ffffff",	alpha:0.1},
    																																							{"startValue": 3,"endValue": 16, 	color: "#088A08",	alpha:0.4},
    																																							{"startValue": 16,"endValue": 34, 	color: "#088A08",	alpha:0.6},
    																																							{"startValue": 34,"endValue": 55,	color: "#55cc00",	alpha:0.7},
    																																							{"startValue": 55,"endValue": 80, 	color: "#3ADF00",	alpha:0.8},
    																																							{"startValue": 80,"endValue": 108, 	color: "#74DF00",	alpha:1},
    																																							{"startValue": 108,"endValue": 139, color: "#D7DF01",	alpha:1},
    																																							{"startValue": 139,"endValue": 172, color: "#DBA901",	alpha:1},
    																																							{"startValue": 172,"endValue": 208, color: "#DF7401",	alpha:1},
    																																							{"startValue": 208,"endValue": 245, color: "#B43104",	alpha:1},
    																																							{"startValue": 245,"endValue": 285, color: "#df0101",	alpha:1},
    																																							{"startValue": 285,"endValue": 327, color: "#b80808",	alpha:1},
    																																							{"startValue": 327,"endValue": 350, color: "#610B0B",	alpha:1},
    																																				],
    		labelsEnabled:false },
    			{ id:"a4",	axisColor: "#cccccc",	 axisThickness: 3,  endValue: 360,  startAngle:0,	endAngle:360, radius: 40,   gridInside: false, inside: false, valueInterval:45,  showLastLabel:false,	labelsEnabled:false,	labelFunction: formatValue, tickColor: "#cccccc"   },
  	 			{ id:"a5",	axisColor: "#cccccc",	 axisThickness: 3,  endValue: 360,  startAngle:0,	endAngle:360, radius: 50,  valueInterval:90,   labelOffset:2, tickColor: "#cccccc", labelsEnabled:true,showLastLabel:false, labelFunction: formatValue},
  			],
    arrows: [
    		{	axis:"a4", color: "#FF0000", 	innerRadius: 0,  nailRadius: 6,  radius: 64 }, // Windrichtung 
    		{	axis:"a4", color: "#0101DF", 	innerRadius: 0,  nailRadius: 6,  radius: 63 },	// Windrichtung blau (abgewandt)
  	 		{	axis:"a1",color: "#999999", 	innerRadius: 55,  nailRadius: 0,  radius: 110}, // Windgeschwindigkeit aktuell
    		{	axis:"a1",color: "#999", 		innerRadius: 110,  nailRadius: 0,  radius: 111 }, // Windgeschwindigkeit Mittelwert 10m
    		{	axis:"a1",color: "#ff8000", 	innerRadius: 110,  nailRadius: 0,  radius: 111 }, // Windgeschwindigkeit Max 10m
    		{	axis:"a1",color: "#ff0000", 	innerRadius: 110,  nailRadius: 0,  radius: 111 },	// Windgeschwindigkeit Max 24h
    		{	axis:"a6",color: "#ff0000", innerRadius: 0,  nailRadius: 0,  radius: 0, alpha:0 ,borderAlpha:0},	// Windgeschwindigkeit Max 24h
    ],
    		
});
  if(PLC_VAR.Wetter.nWindDir > 180)
		nWindHilf = true;
		
setInterval(randomValue, 1000);

// set random value
function randomValue() {
  
    chart_1.axes[ 0 ].setBottomText((PLC_VAR.Wetter.nWindspeed / 100).toFixed(2) + " m/s"  );
 	chart_1.axes[ 1 ].setBottomText((PLC_VAR.Wetter.nWindspeed / 100 * 3.6).toFixed(2) + " km/h"  );
	chart_1.axes[ 1 ].setTopText("BFT: " + PLC_VAR.Wetter.nBft  );
		
	if(nWindHilf)
	{
		if(PLC_VAR.Wetter.nWindDir < 90) 
		{
			chart_1.arrows[0].setValue(PLC_VAR.Wetter.nWindDir + 360);
		    chart_1.arrows[1].setValue(PLC_VAR.Wetter.nWindDir + 180);		
		}
		else
		{
			chart_1.arrows[0].setValue(PLC_VAR.Wetter.nWindDir);
		    chart_1.arrows[1].setValue(PLC_VAR.Wetter.nWindDir - 180);		
		}
		
	}
	else
	{
		if(PLC_VAR.Wetter.nWindDir > 270) 
		{
			chart_1.arrows[0].setValue(PLC_VAR.Wetter.nWindDir - 360);
		    chart_1.arrows[1].setValue(PLC_VAR.Wetter.nWindDir - 540);		
		}
		else
		{
			chart_1.arrows[0].setValue(PLC_VAR.Wetter.nWindDir);
		    chart_1.arrows[1].setValue(PLC_VAR.Wetter.nWindDir - 180);		
		}
	}
	
    chart_1.arrows[2].setValue(PLC_VAR.Wetter.nWindspeed / 100);
    chart_1.arrows[3].setValue(PLC_VAR.Wetter.nWindspeedMittelwert / 100);
   	chart_1.arrows[4].setValue(PLC_VAR.Wetter.nWindspeedMax / 100);
 	chart_1.arrows[5].setValue(PLC_VAR.Wetter.nMaxWind24h / 100);
   	
 
  };

function formatValue(value, formattedValue, valueAxis){
    if(value === 0){ return "N"; }
    else if(value == 45){return "NO"; }
    else if (value == 90){ return "O";}
    else if (value == 135){ return "SO";  }
    else if (value == 180){ return "S"; }
    else if (value == 225){ return "SW";}
    else if (value == 270){ return "W"; }
    else if (value == 315){ return "NW"; }
};
})





/****************************************************************/
/*****														*****/		
/*****				Initialisierung							*****/		
/*****														*****/		
/****************************************************************/

	function init()
	{ 
		dimmer101.onclick = function() {	glbIndexDIM = 1;	fktDimmer();	};
		dimmer102.onclick = function() {	glbIndexDIM = 2;	fktDimmer();	};
		dimmer103.onclick = function() {	glbIndexDIM = 3;	fktDimmer();	};
		dimmer104.onclick = function() {	glbIndexDIM = 4;	fktDimmer();	};
		dimmer105.onclick = function() {	glbIndexDIM = 5;	fktDimmer();	};
		dimmer106.onclick = function() {	glbIndexDIM = 6;	fktDimmer();	};
		dimmer107.onclick = function() {	glbIndexDIM = 7;	fktDimmer();	};
		dimmer108.onclick = function() {	glbIndexDIM = 8;	fktDimmer();	};
		dimmer109.onclick = function() {	glbIndexDIM = 9;	fktDimmer();	};
		dimmer110.onclick = function() {	glbIndexDIM = 10;	fktDimmer();	};
		dimmer111.onclick = function() {	glbIndexDIM = 11;	fktDimmer();	};
		
		lampe101.onclick = function() { glbIndexLA = 1;	toggle_lampe();	};	
		lampe102.onclick = function() { glbIndexLA = 2;	toggle_lampe();	};	
		lampe103.onclick = function() { glbIndexLA = 3;	toggle_lampe();	};	
		lampe104.onclick = function() { glbIndexLA = 4;	toggle_lampe();	};	
		lampe105.onclick = function() { glbIndexLA = 5;	toggle_lampe();	};	
		lampe107.onclick = function() { glbIndexLA = 7;	toggle_lampe();	};	
	
		steckdose101.onclick = function() {	glbIndexSS = 1;	toggle_steckdose();	};
		steckdose102.onclick = function() {	glbIndexSS = 2;	toggle_steckdose();	};
		steckdose103.onclick = function() {	glbIndexSS = 3;	toggle_steckdose();	};
		steckdose104.onclick = function() {	glbIndexSS = 4;	toggle_steckdose();	};
		steckdose105.onclick = function() {	glbIndexSS = 5;	toggle_steckdose();	};
		steckdose106.onclick = function() {	glbIndexSS = 6;	toggle_steckdose();	};
		steckdose107.onclick = function() {	glbIndexSS = 7;	toggle_steckdose();	};
		steckdose108.onclick = function() {	glbIndexSS = 8;	toggle_steckdose();	};
		steckdose109.onclick = function() {	glbIndexSS = 9;	toggle_steckdose();	};
		steckdose110.onclick = function() {	glbIndexSS = 10;	toggle_steckdose();	};
		steckdose111.onclick = function() {	glbIndexSS = 11;	toggle_steckdose();	};
		steckdose112.onclick = function() {	glbIndexSS = 12;	toggle_steckdose();	};
		steckdose113.onclick = function() {	glbIndexSS = 13;	toggle_steckdose();	};
		steckdose114.onclick = function() {	glbIndexSS = 14;	toggle_steckdose();	};
		steckdose115.onclick = function() {	glbIndexSS = 15;	toggle_steckdose();	};
		steckdose116.onclick = function() {	glbIndexSS = 16;	toggle_steckdose();	};
		steckdose117.onclick = function() {	glbIndexSS = 17;	toggle_steckdose();	};
		steckdose118.onclick = function() {	glbIndexSS = 18;	toggle_steckdose();	};
		steckdose119.onclick = function() {	glbIndexSS = 19;	toggle_steckdose();	};
		steckdose120.onclick = function() {	glbIndexSS = 20;	toggle_steckdose();	};
		steckdose121.onclick = function() {	glbIndexSS = 21;	toggle_steckdose();	};
		steckdose122.onclick = function() {	glbIndexSS = 22;	toggle_steckdose();	};
		steckdose123.onclick = function() {	glbIndexSS = 23;	toggle_steckdose();	};
		steckdose124.onclick = function() {	glbIndexSS = 24;	toggle_steckdose();	};
		steckdose125.onclick = function() {	glbIndexSS = 25;	toggle_steckdose();	};
		steckdose126.onclick = function() {	glbIndexSS = 26;	toggle_steckdose();	};
		steckdose127.onclick = function() {	glbIndexSS = 27;	toggle_steckdose();	};
		steckdose128.onclick = function() {	glbIndexSS = 28;	toggle_steckdose();	};
		steckdose129.onclick = function() {	glbIndexSS = 29;	toggle_steckdose();	};
		steckdose130.onclick = function() {	glbIndexSS = 30;	toggle_steckdose();	};
		steckdose131.onclick = function() {	glbIndexSS = 31;	toggle_steckdose();	};
		steckdose132.onclick = function() {	glbIndexSS = 32;	toggle_steckdose();	};
		steckdose133.onclick = function() {	glbIndexSS = 33;	toggle_steckdose();	};
		steckdose134.onclick = function() {	glbIndexSS = 34;	toggle_steckdose();	};	
		steckdose135.onclick = function() { glbIndexSS = 35;	toggle_steckdose();	};
		steckdose136.onclick = function() { glbIndexSS = 36;	toggle_steckdose();	};
		steckdose137.onclick = function() { glbIndexSS = 37;	toggle_steckdose();	};
		steckdose138.onclick = function() { glbIndexSS = 38;	toggle_steckdose();	};
		steckdose139.onclick = function() { glbIndexSS = 39;	toggle_steckdose();	};
		steckdose140.onclick = function() { glbIndexSS = 40;	toggle_steckdose();	};
		steckdose141.onclick = function() { glbIndexSS = 41;	toggle_steckdose();	};
		steckdose142.onclick = function() { glbIndexSS = 42;	toggle_steckdose();	};
		steckdose143.onclick = function() { glbIndexSS = 43;	toggle_steckdose();	};
		steckdose144.onclick = function() { glbIndexSS = 44;	toggle_steckdose();	};
		steckdose145.onclick = function() { glbIndexSS = 45;	toggle_steckdose();	};
		steckdose146.onclick = function() { glbIndexSS = 46;	toggle_steckdose();	};
		steckdose147.onclick = function() { glbIndexSS = 47;	toggle_steckdose();	};
		steckdose148.onclick = function() { glbIndexSS = 48;	toggle_steckdose();	};
		steckdose149.onclick = function() { glbIndexSS = 49;	toggle_steckdose();	};
		steckdose150.onclick = function() { glbIndexSS = 50;	toggle_steckdose();	};
		steckdose151.onclick = function() { glbIndexSS = 51;	toggle_steckdose();	};
		steckdose152.onclick = function() { glbIndexSS = 52;	toggle_steckdose();	};
		steckdose153.onclick = function() { glbIndexSS = 53;	toggle_steckdose();	};
		steckdose154.onclick = function() { glbIndexSS = 54;	toggle_steckdose();	};
		steckdose155.onclick = function() { glbIndexSS = 55;	toggle_steckdose();	};
		steckdose156.onclick = function() { glbIndexSS = 56;	toggle_steckdose();	};
			
	
	raffstore101.onclick = function() {  glbIndexRA = 1; fktRaffstore()};
	raffstore102.onclick = function() {  glbIndexRA = 2; fktRaffstore()};
	raffstore103.onclick = function() {  glbIndexRA = 3; fktRaffstore()};
	raffstore104.onclick = function() {  glbIndexRA = 4; fktRaffstore()};
	raffstore105.onclick = function() {  glbIndexRA = 5; fktRaffstore()};
	raffstore106.onclick = function() {  glbIndexRA = 6; fktRaffstore()};
	raffstore107.onclick = function() {  glbIndexRA = 7; fktRaffstore()};
	raffstore108.onclick = function() {  glbIndexRA = 8; fktRaffstore()};
	raffstore109.onclick = function() {  glbIndexRA = 9; fktRaffstore()};
	raffstore110.onclick = function() {  glbIndexRA = 10; fktRaffstore()};
	raffstore111.onclick = function() {  glbIndexRA = 11; fktRaffstore()};
	raffstore112.onclick = function() {  glbIndexRA = 12; fktRaffstore()};
	
/****************************************************************/
/*****														*****/		
/*****				INIT: Setup Timer						*****/		
/*****														*****/		
/****************************************************************/
function setup_timer()
{
	
	document.all["control"].value = "Start Funktion Setup";

	Plc.sumReadReq({
  //          id: 2,        //If an ID is given, the script waits for the end of the request before firing a new one.
            items: [
                {
                   	name: '.arrTimer',
					jvar: 'PLC_VAR.ArrTimer',
					def: Timer_Struct,
             	}],
             	oc: function() {
					for (var k = 1; k < 5; k++) {
							if(PLC_VAR.ArrTimer[k].ENABLE == true) 
							{
								document.getElementById("enable_timer_" + k).value = 'on';
									$('#enable_timer_' + k).slider('enable');
									$('#enable_timer_' + k).slider('refresh');
							}
							else
							{
								document.getElementById("enable_timer_" + k).value = 'off';
									$('#enable_timer_' + k).slider('enable');
									$('#enable_timer_' + k).slider('refresh');
							};
							document.all["name_timer_" +k].value = PLC_VAR.ArrTimer[k].NAME;
								$('#name_timer_' +k).textinput('enable');
							document.all["startzeit_timer_" +k].value = PLC_VAR.ArrTimer[k].START;
								$('#startzeit_timer_' +k).textinput('enable');
							document.all["dauer_timer_" +k].value = PLC_VAR.ArrTimer[k].DURATION;
								$('#dauer_timer_' +k).textinput('enable');
							document.all["select_timer_" +k].value = PLC_VAR.ArrTimer[k].MODE;
								$('#select_timer_' + k ).selectmenu('enable');
								$('#select_timer_' + k ).selectmenu('refresh');
							
					};
						$('#save_struct').prop('disabled',false);
						
						duration = PLC_VAR.ArrTimer[1].DURATION;
						var hilf = duration.indexOf(':'); 
						stunden = duration.slice(0,hilf);
						minuten = duration.slice(hilf+1,duration.length);
    					document.all["control"].value = "Ende Lesen von SPS - " +duration +" - hilf= " +hilf+ " Stunden= " +stunden+ " Minuten= " +minuten;
					},
      		});
};

	read_struct.onclick = function(){ 
		document.all["control"].value = "Start Funktion Lesen der Struktur"; 
		setup_timer();
	};
   	
   	
	save_struct.onclick = function(){
		document.all("control").value = "Start Funktion Speichern der Struktur";
	
		for (var e = 1; e < 5; e++) {
			if(document.getElementById("enable_timer_" + e).value == 'on') 
			{
				PLC_VAR.ArrTimer[e].ENABLE = true;	
			}
			else
			{
				PLC_VAR.ArrTimer[e].ENABLE = false;	
			};
	
			
			PLC_VAR.ArrTimer[e].NAME = document.all("name_timer_" + e).value;	
			PLC_VAR.ArrTimer[e].START = document.all("startzeit_timer_" + e).value;	
			
			duration =  document.all("dauer_timer_" + e).value;	
			var hilf = duration.indexOf(':'); 
			var stunden = duration.slice(0,hilf);
			var minuten = duration.slice(hilf+1,duration.length);
			
			PLC_VAR.ArrTimer[e].DURATION = (stunden * 1000 * 60 * 60)+ (minuten * 1000 * 60);
			PLC_VAR.ArrTimer[e].MODE = document.all("select_timer_" + e).value;	
		};
		Plc.sumWriteReq({
	            items: [{
					name: '.arrTimer',
					val: PLC_VAR.ArrTimer,
					def: Timer_Struct,
				}],
				oc: function(){
					
					
					document.all("control").value = "Speichern der Struktur feddich DURATION 1 = " +stunden+":"+minuten;
				},
				});
	};

/****************************************************************/
/*****														*****/		
/*****				INIT: Steckdosen 						*****/		
/*****														*****/		
/****************************************************************/

toggle_steckdose = function()
{
	PLC_VAR.ArrToggleSteckdose[glbIndexSS] ="true";
	
	Plc.writeArrayOfBool({
                 					name: '.arrSS_Toggle_Visu',
                 					item: glbIndexSS,
									val: PLC_VAR.ArrToggleSteckdose,
      							}
      						);
}


/****************************************************************/
/*****														*****/		
/*****				INIT: Lampen	 						*****/		
/*****														*****/		
/****************************************************************/

toggle_lampe = function()
{
	PLC_VAR.ArrToggleLicht[glbIndexLA] ="true";
	
	Plc.writeArrayOfBool({
                 					name: '.arrLicht_Toggle_Visu',
                 					item: glbIndexSS,
									val: PLC_VAR.ArrToggleLicht,
      							}
      						);
}


/****************************************************************/
/*****														*****/		
/*****				INIT: Dimmer 							*****/		
/*****														*****/		
/****************************************************************/

function PLC_WRITE_DIMM()
{
	
Plc.sumWriteReq({
	items: [
		{
		   	name: '.arrDimmerVisu',
			val: 	PLC_VAR.DimmerVisu,
			def: structdef_ArrDimmerVisu,
		}],
		});
}
 
function fktDimmer()
{   		
	document.all["dim_value"].value = PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmIst + " %";
	document.getElementById('slider_dim').value = PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmIst;
		$('#slider_dim').slider('refresh');
}

$("#btn_dim_dwn").bind('vmousedown', function(){
		PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmDwn = true;
       	document.getElementById('slider_dim').value = PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmIst;
			$('#slider_dim').slider('refresh');
		PLC_WRITE_DIMM();
    }).bind('vmouseup', function(){
       PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmDwn = false;
       	document.getElementById('slider_dim').value = PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmIst;
			$('#slider_dim').slider('refresh');
		PLC_WRITE_DIMM();
    });

$("#btn_dim_up").bind('vmousedown', function(){
		PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmUp = true;
 		PLC_WRITE_DIMM();
       	document.getElementById('slider_dim').value = PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmIst;
		$('#slider_dim').slider('refresh');
    }).bind('vmouseup', function(){
        PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmUp = false;
 		PLC_WRITE_DIMM();
       	document.getElementById('slider_dim').value = PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmIst;
		$('#slider_dim').slider('refresh');
    });

$("#btn_dim_set").bind('vmousedown', function(){
		PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmSet = true;
  		PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmSoll = document.getElementById('slider_dim').value;
 		PLC_WRITE_DIMM();
    }).bind('vmouseup', function(){
      	PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmSet = false;
 		PLC_WRITE_DIMM();
    });

$("#btn_dim_off").bind('vmousedown', function(){
		PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmSet = true;
  		PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmSoll = 0;
 		PLC_WRITE_DIMM();
    }).bind('vmouseup', function(){
      	PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmSet = false;
 		PLC_WRITE_DIMM();
    });


/****************************************************************/
/*****														*****/		
/*****				INIT: Raffstore 						*****/		
/*****														*****/		
/****************************************************************/
	function fktRaffstore()
	{
		
	

		document.all("slider_raff_pos").value = (PLC_VAR.ArrRaffVisu[glbIndexRA].iPosIst * (-1) + 100);
			$('#slider_raff_pos').slider('refresh');
		lastRaffPosValue = PLC_VAR.ArrRaffVisu[glbIndexRA].iPosIst;
	
		document.getElementById("slider_raff_ang").value = (PLC_VAR.ArrRaffVisu[glbIndexRA].iAngIst * (-1) + 100);
			$('#slider_raff_ang').slider('refresh');
		lastRaffAngValue = PLC_VAR.ArrRaffVisu[glbIndexRA].iAngIst;
	}
	
	btn_raff_sun.onchange = function()
	{
		if ($('#btn_raff_sun').prop("checked") == true)
		{
			PLC_VAR.ArrRaffVisu[glbIndexRA].bVerschattung_Visu = true;
		}
		else
		{
			PLC_VAR.ArrRaffVisu[glbIndexRA].bVerschattung_Visu = false;		
		};
		PLC_WRITE_RAFF();
	}


	btn_raff_tracking.onchange = function()
	{
		if ($('#btn_raff_tracking').prop("checked") == true)
		{
			PLC_VAR.ArrRaffVisu[glbIndexRA].bDisableTracking = true;
		}
		else
		{
			PLC_VAR.ArrRaffVisu[glbIndexRA].bDisableTracking = false;		
		};
		PLC_WRITE_RAFF();
	};

	$("#btn_raff_set").bind('vmousedown', function(){
			PLC_VAR.ArrRaffVisu[glbIndexRA].bSet = true;
	  		PLC_VAR.ArrRaffVisu[glbIndexRA].bVerschattung_Visu = false;
	  		PLC_VAR.ArrRaffVisu[glbIndexRA].iPosSet = (document.all["slider_raff_pos"].value - 100) * (-1);
	 		PLC_VAR.ArrRaffVisu[glbIndexRA].iAngSet =  (document.all["slider_raff_ang"].value - 100) * (-1);
	 		PLC_WRITE_RAFF();
	    }).bind('vmouseup', function(){
	      	PLC_VAR.ArrRaffVisu[glbIndexRA].bSet = false;
	 		PLC_WRITE_RAFF();
	    });
		
	$("#btn_raff_up").bind('vmousedown', function(){
			PLC_VAR.ArrRaffVisu[glbIndexRA].bSet = true;
	  		PLC_VAR.ArrRaffVisu[glbIndexRA].bVerschattung_Visu = false;
	  		PLC_VAR.ArrRaffVisu[glbIndexRA].iPosSet = 100;
	 		PLC_VAR.ArrRaffVisu[glbIndexRA].iAngSet = 100;
	 		PLC_WRITE_RAFF();
	    }).bind('vmouseup', function(){
	      	PLC_VAR.ArrRaffVisu[glbIndexRA].bSet = false;
	 		PLC_WRITE_RAFF();
	    });
	
	$("#btn_raff_dwn").bind('vmousedown', function(){
			PLC_VAR.ArrRaffVisu[glbIndexRA].bSet = true;
	  		PLC_VAR.ArrRaffVisu[glbIndexRA].bVerschattung_Visu = false;
	  		PLC_VAR.ArrRaffVisu[glbIndexRA].iPosSet = 0;
	 		PLC_VAR.ArrRaffVisu[glbIndexRA].iAngSet = 0;
	 		PLC_WRITE_RAFF();
	    }).bind('vmouseup', function(){
	      	PLC_VAR.ArrRaffVisu[glbIndexRA].bSet = false;
	 		PLC_WRITE_RAFF();
	    });

/****************************************************************/
/*****														*****/		
/*****				INIT: Raffstore							*****/		
/*****														*****/		
/****************************************************************/
	function PLC_WRITE_RAFF()
	{
		Plc.sumWriteReq({
			items: [{
			   	name: '.arrRaffstore_Visu',
				val: 	PLC_VAR.ArrRaffVisu,
				def: structdef_ArrRaffVisu,
			}],
		});
	}


/****************************************************************/
/*****														*****/		
/*****					INIT: Lüftung						*****/		
/*****														*****/		
/****************************************************************/

sommerbetrieb.onchange = function(){
	
	if ($('#sommerbetrieb').prop("checked") == true)
	{
		PLC_VAR.stLueftung.bSommerbetrieb = true;
	}
	else
	{
		PLC_VAR.stLueftung.bSommerbetrieb = false;
	};
		
	
	Plc.sumWriteReq({
            items: [{
				name: 'prgLueftung.stData',
				val: PLC_VAR.stLueftung,
				def: structdef_lueftung,
			}],
		});
};

standby.onclick = function(){
	if (PLC_VAR.stLueftung.bStandby == false)
	{
		PLC_VAR.stLueftung.bStandby = true;
	}
	else
	{
		PLC_VAR.stLueftung.bStandby = false;
	};
	
	Plc.sumWriteReq({
            items: [{
				name: 'prgLueftung.stData',
				val: PLC_VAR.stLueftung,
				def: structdef_lueftung,
			}],
	});	
};
	

stosslueftung.onclick = function(){

	PLC_VAR.stLueftung.bStosslueftung = true;
	
	Plc.sumWriteReq({
            items: [{
				name: 'prgLueftung.stData',
				val: PLC_VAR.stLueftung,
				def: structdef_lueftung,
			}],
	});	
};
	
	

	loop();
}		
	

/****************************************************************/
/*****														*****/		
/*****				LOOP()									*****/		
/*****														*****/		
/****************************************************************/

	function loop()
	{
		Plc.sumReadReq({
			id: 1,        //If an ID is given, the script waits for the end of the request before firing a new one.
            items: [
                {
			       	name: '.arrDimmerVisu',
					jvar: 'PLC_VAR.DimmerVisu',
					def: structdef_ArrDimmerVisu,
				},{
	               	name: '.arrStatusVisu',
					jvar: 'PLC_VAR.ArrStatusVisu',
					def: structdef_ArrStatusVisu,
				},{
	               	name: '.arrErrorVisu',
					jvar: 'PLC_VAR.ArrErrorVisu',
					def: structdef_ArrErrorVisu,
				},{
	               	name: '.arrTempVisu',
					jvar: 'PLC_VAR.ArrTempVisu',
					def: structdef_ArrTempVisu,
				},{
			      	name: '.arrRaffstore_Visu',
					jvar: 'PLC_VAR.ArrRaffVisu',
					def: structdef_ArrRaffVisu,
				},{
                	name: '.visWetter',
					jvar: 'PLC_VAR.Wetter',
					def: Wetter_Struct,
				},{
               		name: '.visTechnik',
					jvar: 'PLC_VAR.Technik',
					def: structdef_Technik,
				},{
		           	name: 'prgLueftung.stData',
                    jvar: 'PLC_VAR.stLueftung',
                    def: structdef_lueftung
				},{
					name: '.dtSystemTime',
                    type: "DT.#WEEKDAY#, #DD#.#MM#.#YYYY#  - #hh#:#mm#:#ss#",
                    jvar: 'plc_SystemTime'
           		},{
                    name: 'MAIN.bToggle',
                    jvar: 'plc_toggle'
             	}],
             	oc: function() 
             	{
					if(PLC_VAR.Wetter.bDusk==true)
						{document.all["Dusk"].value="Ja";}
					else
						{document.all["Dusk"].value="Nein";}	
				
					if(PLC_VAR.Wetter.bRain==true)
					{ 
						document.getElementById("regen").firstChild.data = "es regnet seit dem";
						document.all["Regen_1"].value = PLC_VAR.Wetter.RegenDatum;
						document.all["Regen_2"].value = PLC_VAR.Wetter.RegenUhrzeit;
					}
					else
					{ 
						document.getElementById("regen").firstChild.data = "letzter Regen";
						document.all["Regen_1"].value = PLC_VAR.Wetter.RegenDatum;
						document.all["Regen_2"].value = PLC_VAR.Wetter.RegenUhrzeit;
					};
							
					if(PLC_VAR.Wetter.nOutdoortemp > 10)
					{
						document.getElementById("GefTempText").firstChild.data = "gefühlte Temperatur";
					}
					else
					{
						document.getElementById("GefTempText").firstChild.data = "Windchill";
					};			
					document.all["Outdoortemp"].value 			= (PLC_VAR.Wetter.nOutdoortemp / 10).toFixed(1) + " °C";
					document.all["GefTemp"].value 				= (PLC_VAR.Wetter.nGefTemp / 10).toFixed(1) + " °C";
					document.all["MaxTemp"].value 				= (PLC_VAR.Wetter.nMaxTemp24h / 10).toFixed(1) +" °C";
					document.all["MinTemp"].value 				= (PLC_VAR.Wetter.nMinTemp24h / 10).toFixed(1) +" °C";
					document.all["MaxWind"].value 				= (PLC_VAR.Wetter.nMaxWind24h / 100).toFixed(2) + " m/s";
					document.all["Windspeed"].value 			= (PLC_VAR.Wetter.nWindspeed / 100).toFixed(2) + " m/s";
					document.all["WindspeedMittelwert"].value 	= (PLC_VAR.Wetter.nWindspeedMittelwert / 100).toFixed(2) + " m/s";
					document.all["WindspeedMax"].value 			= (PLC_VAR.Wetter.nWindspeedMax / 100).toFixed(2) + " m/s";
					document.all["WindDir"].value 				= PLC_VAR.Wetter.nWindDir +" °";;
					document.all["Bft"].value 					= PLC_VAR.Wetter.nBft;
					document.all["Regen10m"].value 				= (PLC_VAR.Wetter.nRegen10m / 100).toFixed(1) + " mm";
					document.all["Regen24h"].value 				= (PLC_VAR.Wetter.nRegen24h / 100).toFixed(1) + " mm";
					document.all["RegenRate"].value 			= (PLC_VAR.Wetter.nRegenRate /100).toFixed(1) + " mm/h";
					document.all["MaxRegenRate"].value 			= (PLC_VAR.Wetter.nMaxRegenRate10m /100).toFixed(1) + " mm/h";
					document.all["SunWest"].value 				= PLC_VAR.Wetter.nSunWest + " klux";
					document.all["SunSouth"].value 				= PLC_VAR.Wetter.nSunSouth + " klux";
					document.all["SunEast"].value 				= PLC_VAR.Wetter.nSunEast + " klux";
					document.all["Sunrise"].value 				= PLC_VAR.Wetter.tSunrise;
					document.all["Sunset"].value 				= PLC_VAR.Wetter.tSunset;
					document.all["SunZenit"].value 				= (PLC_VAR.Wetter.fSunZenith / 100).toFixed(2) +" °";
					document.all["SunAzimut"].value 			= (PLC_VAR.Wetter.fSunAzimuth / 100).toFixed(2) +" °";
					document.all["Brightness"].value 			= PLC_VAR.Wetter.nBrightness + " lux";
					document.all["Luftdruck"].value 			= (PLC_VAR.Wetter.nLuftdruck / 10).toFixed(1) + " hPa";
					if(PLC_VAR.Wetter.nLuftdruck3h > 0)
						{	document.all["Luftdruck3h"].value 			= "+" + (PLC_VAR.Wetter.nLuftdruck3h / 10).toFixed(1) + " hPa";}
					else
						{	document.all["Luftdruck3h"].value 			= (PLC_VAR.Wetter.nLuftdruck3h / 10).toFixed(1) + " hPa";};			
					if(PLC_VAR.Wetter.nLuftdruck6h > 0)
						{	document.all["Luftdruck6h"].value 			= "+" + (PLC_VAR.Wetter.nLuftdruck6h / 10).toFixed(1) + " hPa";}
					else
						{	document.all["Luftdruck6h"].value 			= (PLC_VAR.Wetter.nLuftdruck6h / 10).toFixed(1) + " hPa";};			
					
					document.all["Luftfeuchtigkeit"].value 		= (PLC_VAR.Wetter.nLuftfeuchtigkeit / 10).toFixed(1) + " %";

// String der Windrichtung ausgeben
	if (PLC_VAR.Wetter.nWindDir > 11 && PLC_VAR.Wetter.nWindDir <= 34)
		document.all["WindDirStr"].value = "NNO";			
	else if (PLC_VAR.Wetter.nWindDir > 34 && PLC_VAR.Wetter.nWindDir <= 56)
		document.all["WindDirStr"].value = "NO";			
	else if (PLC_VAR.Wetter.nWindDir > 56 && PLC_VAR.Wetter.nWindDir <= 79)
		document.all["WindDirStr"].value = "ONO";			
	else if (PLC_VAR.Wetter.nWindDir > 79 && PLC_VAR.Wetter.nWindDir <= 101)
		document.all["WindDirStr"].value = "O";			
	else if (PLC_VAR.Wetter.nWindDir > 101 && PLC_VAR.Wetter.nWindDir <= 124)
		document.all["WindDirStr"].value = "OSO";			
	else if (PLC_VAR.Wetter.nWindDir > 124 && PLC_VAR.Wetter.nWindDir <= 146)
		document.all["WindDirStr"].value = "SO";			
	else if (PLC_VAR.Wetter.nWindDir > 146 && PLC_VAR.Wetter.nWindDir <= 169)
		document.all["WindDirStr"].value = "SSO";			
	else if (PLC_VAR.Wetter.nWindDir > 169 && PLC_VAR.Wetter.nWindDir <= 191)
		document.all["WindDirStr"].value = "S";			
	else if (PLC_VAR.Wetter.nWindDir > 191 && PLC_VAR.Wetter.nWindDir <= 214)
		document.all["WindDirStr"].value = "SSW";			
	else if (PLC_VAR.Wetter.nWindDir > 214 && PLC_VAR.Wetter.nWindDir <= 236)
		document.all["WindDirStr"].value = "SW";			
	else if (PLC_VAR.Wetter.nWindDir > 236 && PLC_VAR.Wetter.nWindDir <= 259)
		document.all["WindDirStr"].value = "WSW";			
	else if (PLC_VAR.Wetter.nWindDir > 259 && PLC_VAR.Wetter.nWindDir <= 281)
		document.all["WindDirStr"].value = "W";			
	else if (PLC_VAR.Wetter.nWindDir > 281 && PLC_VAR.Wetter.nWindDir <= 304)
		document.all["WindDirStr"].value = "WNW";			
	else if (PLC_VAR.Wetter.nWindDir > 304 && PLC_VAR.Wetter.nWindDir <= 326)
		document.all["WindDirStr"].value = "NW";			
	else if (PLC_VAR.Wetter.nWindDir > 329 && PLC_VAR.Wetter.nWindDir <= 349)
		document.all["WindDirStr"].value = "NNW";	
	else
		document.all["WindDirStr"].value = "N";			
		
   	document.all("temp_wp_vl").value 				= (PLC_VAR.Technik.nTempWP_VL / 10).toFixed(1) + " °C";
   	document.all("temp_wp_rl").value  				= (PLC_VAR.Technik.nTempWP_RL / 10).toFixed(1) + " °C";
   	document.all("wp_leistung").value  				= (PLC_VAR.Technik.nLeistung) + " Watt";
   	document.all("temp_ww_oben").value 				= (PLC_VAR.Technik.nTempWW_Oben / 10).toFixed(1) + " °C";
   	document.all("temp_ww_unten").value 				= (PLC_VAR.Technik.nTempWW_Unten / 10).toFixed(1) + " °C";
 
 	nStartwert = 1;
	nEndwert = 1 + nglbAnzahlSteckdosen;	
	for (var i = nStartwert; i < nEndwert; i++)
	{
		if (PLC_VAR.ArrErrorVisu[i] == true)
			{
				document.getElementById("steckdose" +(100 +i)).className = "red my_li_steck";
			}
		else
			{
				if (PLC_VAR.ArrStatusVisu[i] == true)
					{
						if(i != 47) /* Steckdose 47 ist Leuchte Spiegelschrank OG */
						{
							document.getElementById("steckdose" +(100 +i)).className = "green my_li_steck";
						}
						else
						{
							document.getElementById("steckdose" +(100 +i)).className = "green my_li_lampe";
						};
						
					}
				else
					{
						if(i != 47)/* Steckdose 47 ist Leuchte Spiegelschrank OG */
						{
							document.getElementById("steckdose" +(100 +i)).className = "my_li_steck";
						}
						else
						{
							document.getElementById("steckdose" +(100 +i)).className = "my_li_lampe";
						};
					};	
			};	
			
	};	
	nStartwert = nEndwert;
	nEndwert = nEndwert + nglbAnzahlDimmer;
	for (var j = nStartwert; j < nEndwert; j++)
	{
		nVarName = 100 + (j - nStartwert + 1);
		if (PLC_VAR.ArrStatusVisu[j] == true)
			{
				document.getElementById("dimmer" + nVarName).className = "green my_li_dimm";
			}
		else
			{
				document.getElementById("dimmer" + nVarName).className = "my_li_dimm";	
			};	
	};			
	
	nStartwert = nEndwert;
	nEndwert = nEndwert + nglbAnzahlLampen;
	for (var j = nStartwert; j < nEndwert; j++)
	{
		nVarName = 100 + (j - nStartwert + 1);
		if (PLC_VAR.ArrStatusVisu[j] == true)
			{
				document.getElementById("lampe" + nVarName).className = "green my_li_lampe";
			}
		else
			{
				document.getElementById("lampe" + nVarName).className = "my_li_lampe";	
			};	
	};	
	
	
	nStartwert = nEndwert;
	nEndwert = nEndwert + nglbAnzahlRaffstore;	
	for (var j = nStartwert; j < nEndwert; j++)
	{
		nVarName = 100 + (j - nStartwert + 1);
		if (PLC_VAR.ArrStatusVisu[j] == true)
			{
				document.getElementById("raffstore" + nVarName).className = "green my_li_raffstore";
			}
		else
			{
				document.getElementById("raffstore" + nVarName).className = "my_li_raffstore";	
			};	
	};	
	
	
	nStartwert = nEndwert;
	nEndwert = nEndwert + nglbAnzahlFensterkontakte;	
	for (var j = nStartwert; j < nEndwert; j++)
	{
		nVarName = 100 + (j - nStartwert + 1);
		if (PLC_VAR.ArrStatusVisu[j] == true)
			{
				document.getElementById("fenster" + nVarName).className = "my_li_fenster";
			}
		else
			{
				document.getElementById("fenster" + nVarName).className = "red my_li_fenster";	
			};	
	};	
		
		
	for (var k = 1; k < 13; k++)
{
	document.all("temp" +(100 +k)).value = (PLC_VAR.ArrTempVisu[k] / 10) +" °C";
	document.all("temp" +(200 +k)).value = (PLC_VAR.ArrTempVisu[k] / 10) +" °C";
};				
		
	PLC_LOOP_READ = true;
	
	
			
}}); // Ende des plc.sumRead im Loop


/********************************************************************************/
/***** 				LOOP: Dimmer											*****/
/********************************************************************************/

if ($("#dimmer").is(".ui-page-active"))
{
	if(lastDimmValue != PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmIst)
	{
		document.all["slider_dim"].value = PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmIst;
			$('#slider_dim').slider('refresh');
		lastDimmValue = PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmIst;
	};
     // the popup is open
	document.all["dim_value"].value = PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmIst + " %";
		$('#slider_dim').slider('refresh');		
	
	if(PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmDwn == true)
	   	document.getElementById('slider_dim').value = PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmIst;
	if(PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmUp == true)
	   	document.getElementById('slider_dim').value = PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmIst;
};


/********************************************************************************/
/***** 				LOOP: Raffstore											*****/
/********************************************************************************/

if ($("#raffstore").is(".ui-page-active"))
{
	if(lastRaffPosValue != PLC_VAR.ArrRaffVisu[glbIndexRA].iPosIst)
	{
	document.all["slider_raff_pos"].value = (PLC_VAR.ArrRaffVisu[glbIndexRA].iPosIst * (-1) + 100);
		$('#slider_raff_pos').slider('refresh');
		lastRaffPosValue = PLC_VAR.ArrRaffVisu[glbIndexRA].iPosIst;
	};
	
	if(lastRaffAngValue != PLC_VAR.ArrRaffVisu[glbIndexRA].iAngIst)
	{
	document.all["slider_raff_ang"].value = (PLC_VAR.ArrRaffVisu[glbIndexRA].iAngIst * (-1) + 100);
		$('#slider_raff_ang').slider('refresh');
		lastRaffAngValue = PLC_VAR.ArrRaffVisu[glbIndexRA].iAngIst;
	};
	
	$("#btn_raff_sun").attr("checked",PLC_VAR.ArrRaffVisu[glbIndexRA].bVerschattung_Visu).checkboxradio("refresh");
	$("#btn_raff_tracking").attr("checked",PLC_VAR.ArrRaffVisu[glbIndexRA].bDisableTracking).checkboxradio("refresh");
};
	
	
/********************************************************************************/
/***** 				LOOP: Lüftung											*****/
/********************************************************************************/

	if(PLC_VAR.stLueftung.bBetrieb==true)
		{document.all["betrieb"].value="EIN";}
	else
		{
			if(PLC_VAR.stLueftung.bStandby==true)
				{document.all["betrieb"].value="Standby";}
			else
				{document.all["betrieb"].value="AUS";}
		};
			

	document.all["schaltschwelle"].value=PLC_VAR.stLueftung.nTempSchaltschwelle / 10 + " °C";
	document.all["hysterese"].value=PLC_VAR.stLueftung.nTempHysterese / 10 + " °C";
	document.all["innentemperatur"].value=PLC_VAR.stLueftung.nTempRaumMittel / 10 + " °C";
	document.all["aussentemperatur"].value=PLC_VAR.stLueftung.nTempAussenluft / 10 + " °C";
	document.all["zulufttemperatur"].value=PLC_VAR.stLueftung.nTempZuluft / 10 + " °C";
	document.all["ablufttemperatur"].value=PLC_VAR.stLueftung.nTempAbluft / 10 + " °C";
	
	$('#sommerbetrieb').prop( "checked", PLC_VAR.stLueftung.bSommerbetrieb );
/********************************************************************************/

 	window.setTimeout('loop()', 200);
};	

	
	
function setup_timer()
{
	
	document.all["control"].value = "Start Funktion Setup";

	Plc.sumReadReq({
  //          id: 2,        //If an ID is given, the script waits for the end of the request before firing a new one.
            items: [
                {
                   	name: '.arrTimer',
					jvar: 'PLC_VAR.Timer',
					def: Timer_Struct,
             	}],
             	oc: function() {
					for (var k = 1; k < 5; k++) {
							if(PLC_VAR.Timer[k].ENABLE == true) 
							{
								document.getElementById("enable_timer_" + k).value = 'on';
									$('#enable_timer_' + k).slider('enable');
									$('#enable_timer_' + k).slider('refresh');
							}
							else
							{
								document.getElementById("enable_timer_" + k).value = 'off';
									$('#enable_timer_' + k).slider('enable');
									$('#enable_timer_' + k).slider('refresh');
							};
							document.all["startzeit_timer_" +k].value = PLC_VAR.Timer[k].START;
								$('#startzeit_timer_' +k).textinput('enable');
							document.all["dauer_timer_" +k].value = PLC_VAR.Timer[k].DURATION;
								$('#dauer_timer_' +k).textinput('enable');
							document.all["select_timer_" +k].value = PLC_VAR.Timer[k].MODE;
								$('#select_timer_' + k ).selectmenu('enable');
								$('#select_timer_' + k ).selectmenu('refresh');
							
					};
						$('#save_struct').prop('disabled',false);
						
						duration = PLC_VAR.Timer[1].DURATION;
						var hilf = duration.indexOf(':'); 
						stunden = duration.slice(0,hilf);
						minuten = duration.slice(hilf+1,duration.length);
    					document.all["control"].value = "Ende Lesen von SPS - " +duration +" - hilf= " +hilf+ " Stunden= " +stunden+ " Minuten= " +minuten;
					},
			/*			
						enable_timer_1
						document.all("select_ss_" + k + 1).value = PLC_VAR.ArrSS[iIndex].arrSS_ID_ON[k];
				$('#select_dimm_' + k + 3).selectmenu('refresh');
			
					$('#select_ss_' + k + 1).selectmenu('enable');
					$('#select_ss_' + k + 1).selectmenu('refresh');
*/			
      		});
      	
  
   

//document.getElementById("control").firstChild.data = PLC_VAR.arrTimer[1].MODE;

}




