	 
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



/* SPS-Variablen */
var 	plc_SystemTime,
 		bMerkerWindrichtung = false,
		nWindHilf;
		

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
/*****					Chart Windrose						*****/		
/*****														*****/		
/****************************************************************/
$(document).on('pageshow', '#wetter_am' ,function() {

var chart_1 = AmCharts.makeChart("am_wetter_container", {
//    theme: "custom",
    type: "gauge",
    color:"#bbbbbb",
 

    axes: [{	id:"a1",	axisColor: "#cccccc",   axisThickness: 3, 	endValue: 35, 		radius: 200,	gridInside: false,   inside: false,  valueInterval:2.5, tickColor: "#cccccc",bottomTextBold:false,bottomTextYOffset:34}, 
    		{   id:"a2",	axisColor: "#cccccc",	axisThickness: 3,  	endValue: 126,  	radius: 160,    valueInterval:5,  		tickColor: "#cccccc",	showLastLabel:false, bottomTextBold:false,bottomTextYOffset:33, topTextBold:false, topTextYOffset:234 },
    		{   id:"a3",	axisColor: "#cccccc",	axisThickness: 0, 	endValue: 350,  	radius: 170,    valueInterval:350,  	tickColor: "#cccccc", tickThickness:0, bands: [	{"startValue": 0,"endValue": 3, 	color: "#ffffff",	alpha:0.1},
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
    			{ id:"a4",	axisColor: "#cccccc",	 axisThickness: 3,  endValue: 360,  startAngle:0,	endAngle:360, radius: 75,   gridInside: false, inside: false, valueInterval:45,  showLastLabel:false,	labelsEnabled:false,	tickColor: "#cccccc"   },
  	 			{ id:"a5",	axisColor: "#cccccc",	 axisThickness: 3,  endValue: 360,  startAngle:0,	endAngle:360, radius: 103,  valueInterval:45,   tickColor: "#cccccc", labelsEnabled:true,showLastLabel:false, labelFunction: formatValue},
  	 	//		{ id:"a6",	axisColor: "#cccccc",	 axisThickness: 0,  endValue: 360,  startAngle:0,	endAngle:0, radius: 0,  valueInterval:45,   tickColor: "#cccccc", labelsEnabled:false,showLastLabel:false, },
  			],
    arrows: [
    		{	axis:"a4", color: "#FF0000", innerRadius: 0,  nailRadius: 6,  radius: 63 }, // Windrichtung 
    		{	axis:"a4", color: "#0101DF", innerRadius: 0,  nailRadius: 6,  radius: 63 },	// Windrichtung blau (abgewandt)
  	 		{	axis:"a1",color: "#999999", innerRadius: 106,  nailRadius: 0,  radius: 190}, // Windgeschwindigkeit aktuell
    		{	axis:"a1",color: "#999", innerRadius: 193,  nailRadius: 0,  radius: 193 }, // Windgeschwindigkeit Mittelwert 10m
    		{	axis:"a1",color: "#ff8000", innerRadius: 193,  nailRadius: 0,  radius: 193 }, // Windgeschwindigkeit Max 10m
    		{	axis:"a1",color: "#ff0000", innerRadius: 193,  nailRadius: 0,  radius: 193 },	// Windgeschwindigkeit Max 24h
    		{	axis:"a6",color: "#ff0000", innerRadius: 0,  nailRadius: 0,  radius: 0, alpha:0 ,borderAlpha:0},	// Windgeschwindigkeit Max 24h
    		],
    		
});

		
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
 	chart_1.arrows[6].setValue(PLC_VAR.Wetter.nBft);
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
       			},{
					name: '.visWetter',
					jvar: 'PLC_VAR.Wetter',
					def: Wetter_Struct,
	       	}],
             });


	document.getElementById("systemtime").firstChild.data =plc_SystemTime;

  if(PLC_VAR.Wetter.nWindDir > 180 && PLC_VAR.Wetter.nWindDir < 270)
		nWindHilf = true;
  if(PLC_VAR.Wetter.nWindDir > 90 && PLC_VAR.Wetter.nWindDir < 180)
		nWindHilf = false;
		
 window.setTimeout('loop()', 300);
}	

/****************************************************************/
/*****														*****/		
/*****				Ende LOOP()								*****/		
/*****														*****/		
/****************************************************************/

	
	
 

