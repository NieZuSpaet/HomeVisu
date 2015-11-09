	 
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
	ArrStatusVisu:[],
	ArrErrorVisu:[],
	ArrRaffVisu:[],
	ArrToggleSteckdose:[],
	ArrToggleLicht:[],
	ArrTempVisu:[], 
	arrWetter: [],
	arrTechnik: []
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

  


/* SPS-Variablen */
var		plc_SystemTime,
 		arrWetter_Temperatur = new Array(),
		arrWetter_WindMittel = new Array(),
		arrWetter_WindMax = new Array(),
		arrWetter_WindMittelRasp = new Array(),
		arrWetter_WindMaxRasp = new Array(),
		arrWetter_Windrichtung = new Array(),
		arrWetter_Luftdruck = new Array(),
		arrWetter_Luftfeuchtigkeit = new Array(),
		arrWetter_Regenmenge = new Array(),
		arrWetter_RegenRate = new Array(),
		arrWetter_RegenRateMax = new Array(),
		arrWetter_Helligkeit = new Array(),
		arrWetter_Regen = new Array();
		
var  	nJahr,
		nMonat,
		nTag,
		nStunde,
		nMinute,
		arrZeitstempel_wetter= new Array(),
		XstartHilf = new Date();


$(document).ready(function() {
	$('body').css('display', 'none');
	$('body').fadeIn(350);
	$('.link').click(function() {
		event.preventDefault();
		newLocation = this.href;
		$('body').fadeOut(350, newpage);
	});
	function newpage() {
		window.location = newLocation;
	}
});
		
/****************************************************************/
/*****														*****/		
/*****				Wetterdaten Chart						*****/		
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
		arrWetter_Temperatur[k]		= PLC_VAR.arrWetter[k].nTemperatur / 10;
		arrWetter_WindMittel[k] 		= PLC_VAR.arrWetter[k].nMittelWind / 100;
		arrWetter_WindMax[k]			= PLC_VAR.arrWetter[k].nMaxWind / 100;
		arrWetter_Luftdruck[k] 		= PLC_VAR.arrWetter[k].nLuftdruck / 10;
		arrWetter_Luftfeuchtigkeit[k] 	= PLC_VAR.arrWetter[k].nLuftfeuchtigkeit / 10;
		arrWetter_Helligkeit[k] 		= PLC_VAR.arrWetter[k].nHelligkeit / 1000;
		nRegenHilf = PLC_VAR.arrWetter[k].bRain;
		if ( nRegenHilf == true)	{ 
			arrWetter_Regen[k] = 1;
		} else { 
			arrWetter_Regen[k] = 0;
		};
	}

var highchartsOptions = Highcharts.setOptions(Highcharts.theme);   
     	 
	
    		   
 //document.all("status").value = PLC_VAR.arrWetter[0].nTemperatur + " und "+ PLC_VAR.arrWetter[0].dtTime + " und " +Xstart;	

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
					inputDateFormat: '%d.%m.%Y',inputEditDateFormat: '%d.%m.%Y',},
		scrollbar : {enabled : false},title: { text: '' },
		legend: {enabled: true,verticalAlign: 'top',},
	    tooltip: {enabled: true, },
		yAxis: [	{	labels:{enabled: true, x:20},		title: {text: 'Wind'		},			opposite: false,				height: 200,	lineWidth: 0,	min: 0},
            		{	labels:{enabled: true, x:-15},		title: {text: 'Temperatur'	},			opposite: true,					height: 200,	lineWidth: 0,							},
            		{	labels:{enabled: true, x:35},		title: {text: 'Regen'		},			opposite: false,	top: 470,	height: 55,						min: 0,	range: 0 },
	    			{	labels:{enabled: true, x:-35},		title: {text: 'Luftdruck'	},			opposite: true,		top: 265,	height: 200,	lineWidth: 0,					offset: 0,				minTickInterval: 4},
	    			{	labels:{enabled: true, x:-15},		title: {text: 'Helligkeit'  },			opposite: true,		top: 470,	height: 55,		lineWidth: 0,	min: 0,	offset: 0},
	    			{	labels:{enabled: true, x:15},		title: {text: 'Luftfeuchte'},			opposite: false,	top: 265,	height: 200,	lineWidth: 0,					offset: 0,startOnTick: false,endOnTick: false},
	    		],
	    series: [	{	index: 0,type: 'areaspline',	name: 'Temperatur',			tooltip: {valueSuffix: '°C',	valueDecimals:1,yDecimals: 1},	data:  arrWetter_Temperatur,		pointStart: Xstart,pointInterval: 1000 * 60 * 10,yAxis: 1,threshold : null,	fillColor :	{linearGradient : {x1: 4, y1: 4, x2: 0, y2: 0},	stops : [[0, Highcharts.getOptions().colors[0]], [1, 'rgba(0,0,0,0)']]}},
		      		{	index: 1,type: 'areaspline',	name: 'Wind',				tooltip: {valueSuffix: 'm/s',	valueDecimals:1,yDecimals: 1},	data:  arrWetter_WindMittel,		pointStart: Xstart,pointInterval: 1000 * 60 * 10,yAxis: 0,threshold : null,	fillColor :	{linearGradient : {x1: 3, y1: 3, x2: 0, y2: 0},	stops : [[0, Highcharts.getOptions().colors[1]], [1, 'rgba(0,0,0,0)']]}},
		     		{	index: 2,type: 'spline',		name: 'Windmax',			tooltip: {valueSuffix: 'm/s',	valueDecimals:1,yDecimals: 1},	data:  arrWetter_WindMax,			pointStart: Xstart,pointInterval: 1000 * 60 * 10,yAxis: 0,lineWidth : 0,marker : {enabled : true,radius : 2},},
					{	index: 3,type: 'spline',		name: 'Helligkeit',			tooltip: {valueSuffix: 'kLux',	valueDecimals:3,yDecimals: 3},	data:  arrWetter_Helligkeit,		pointStart: Xstart,pointInterval: 1000 * 60 * 10,yAxis: 4,					fillColor :	{linearGradient : {x1: 4, y1: 4, x2: 0, y2: 0},	stops : [[0, Highcharts.getOptions().colors[5]], [1, 'rgba(0,0,0,0)']]}},
					{	index: 4,type: 'areaspline',	name: 'Luftdruck',			tooltip: {valueSuffix: 'hPa',	valueDecimals:1,yDecimals: 1},	data:  arrWetter_Luftdruck,		pointStart: Xstart,pointInterval: 1000 * 60 * 10,yAxis: 3,threshold : null,	fillColor :	{linearGradient : {x1: 4, y1: 4, x2: 0, y2: 0},	stops : [[0, Highcharts.getOptions().colors[4]], [1, 'rgba(0,0,0,0)']]}},
					{	index: 5,type: 'column',		name: 'Regen',																data:  arrWetter_Regen,			pointStart: Xstart,pointInterval: 1000 * 60 * 10,yAxis: 2},
					{	index: 6,type: 'spline',		name: 'Luftfeuchtigkeit',	tooltip: {valueSuffix: '%',		valueDecimals:1,yDecimals: 1},	data:  arrWetter_Luftfeuchtigkeit,	pointStart: Xstart,pointInterval: 1000 * 60 * 10,yAxis: 5,threshold : null,	fillColor :	{linearGradient : {x1: 5, y1: 3, x2: 0, y2: 0},	stops : [[0, Highcharts.getOptions().colors[6]], [1, 'rgba(0,0,0,0)']]}}
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


$(document).ready(function() {
	$('body').css('display', 'none');
	$('body').fadeIn(250);
	$('.link').click(function() {
		event.preventDefault();
		newLocation = this.href;
		$('body').fadeOut(250, newpage);
	});
	function newpage() {
		window.location = newLocation;
	}
});	

/****************************************************************/
/*****														*****/		
/*****				Initialisierung							*****/		
/*****														*****/		
/****************************************************************/

function init()
{ 
		
	




/***** Aufruf LOOP(); *****/
	loop();
}		
/****************************************************************/
/*****														*****/		
/*****				Ende INIT								*****/		
/*****														*****/		
/****************************************************************/

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
					name: '.dtSystemTime',
                    type: "DT.#WEEKDAY#, #DD#.#MM#.#YYYY#  - #hh#:#mm#:#ss#",
                    jvar: 'plc_SystemTime'
       			}],
             });




 	document.getElementById("systemtime").firstChild.data = plc_SystemTime;

//var PageNameActive = $.mobile.activePage.attr('id'); 

var hideKeyboard = function() {
    document.activeElement.blur();
    $("input").blur();
};
 window.setTimeout('loop()', 300);
}	

/****************************************************************/
/*****														*****/		
/*****				Ende LOOP()								*****/		
/*****														*****/		
/****************************************************************/

	
	
 

