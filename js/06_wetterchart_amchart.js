	 
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
var 	plc_SystemTime,
 	 	DataAMChart = new Array(),
 	 	DataTechnikChart2 = new Array(),
 	 	arrCategory = new Array(),
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
/*****				Wetterchart mit AM-Chart				*****/		
/*****														*****/		
/****************************************************************/

$(document).on('pageshow', '#amchart' ,function() {

 	Plc.sumReadReq({
    	items: [{
			name: '.arrWetterdaten',
			jvar: 'PLC_VAR.arrWetter',
			def: arrWetter_Struct,
		}],
		ocd: 50,
		oc: function() { AMchart();},
	});

});

	
//$(document).delegate('#amchart', 'pageshow', function( ) { 
//$(document).on('pageshow', '#amchart', function( ) { 
    
//	var A_chart = new AmCharts.AmStockChart();
function AMchart()
{	
/*	
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
	
	*/
/*	for (var k = 0; k < 360; k++) 
	{	   
		DataTest2.push({
			windrichtung : k,	
			wind : 0,	
			});
	};
	
*/
	nRegenSummeHilf = 0.01;
	for (var k = 0; k < 720; k++) 
	{
		
	nJahr = PLC_VAR.arrWetter[k].dtTime.slice(0,4);
	nMonat = PLC_VAR.arrWetter[k].dtTime.slice(5,7);
	nTag = PLC_VAR.arrWetter[k].dtTime.slice(8,10);
	nStunde = PLC_VAR.arrWetter[k].dtTime.slice(11,13);
	nMinute = PLC_VAR.arrWetter[k].dtTime.slice(14,16);
						
var XstartHilf= new Date();
		
	XstartHilf.setFullYear(nJahr);
	XstartHilf.setMonth(nMonat-1);
	XstartHilf.setDate(nTag);
	XstartHilf.setUTCHours(nStunde-2);
	XstartHilf.setMinutes(nMinute);
	XstartHilf.setSeconds(0);
//	XstartHilf.setMilliseconds(0);
	
//	Xstart = Date.parse(XstartHilf);
	
		arrZeitstempel_wetter.push(XstartHilf);
//		arrZeitstempel[k]		= PLC_VAR.arrWetter[k].dtTime;
		arrWetter_Temperatur[k]		= PLC_VAR.arrWetter[k].nTemperatur / 10;
		arrWetter_WindMittel[k] 		= PLC_VAR.arrWetter[k].nMittelWind / 100;
		arrWetter_WindMax[k]			= PLC_VAR.arrWetter[k].nMaxWind / 100;
		arrWetter_Windrichtung[k]			= PLC_VAR.arrWetter[k].nWindrichtung;
	
		
		arrWetter_Luftdruck[k] 		= PLC_VAR.arrWetter[k].nLuftdruck / 10;
		arrWetter_Luftfeuchtigkeit[k] 	= PLC_VAR.arrWetter[k].nLuftfeuchtigkeit / 10;
		if (nStunde == 0 && nMinute == 0)
			{
				nRegenSummeHilf = 0.01 ;			
			}
//		else
//		{
			nRegenSummeHilf = nRegenSummeHilf + (PLC_VAR.arrWetter[k].nRegen / 100);
//		};
		var Hilf = Math.round(nRegenSummeHilf * 100);
		arrWetter_Regenmenge[k] 		= Hilf / 100; 
		arrWetter_RegenRate[k] 		= PLC_VAR.arrWetter[k].nRegenRate / 100;
		arrWetter_RegenRateMax[k] 		= PLC_VAR.arrWetter[k].nMaxRegenRate10m / 100;
		arrWetter_Helligkeit[k] 		= PLC_VAR.arrWetter[k].nHelligkeit / 1000;
		nRegenHilf = PLC_VAR.arrWetter[k].bRain;
		if ( nRegenHilf == true)	{ 
			arrWetter_Regen[k] = 1;
		} else { 
			arrWetter_Regen[k] = 0;
		};
		DataAMChart.push({
			date : arrZeitstempel_wetter[k],
			temp : arrWetter_Temperatur[k],
			wind : arrWetter_WindMittel[k],	
			windmax : arrWetter_WindMax[k],	
			windrasp : arrWetter_WindMittelRasp[k],	
			windmaxrasp : arrWetter_WindMaxRasp[k],	
			windrichtung : arrWetter_Windrichtung[k],	
			luftdruck : arrWetter_Luftdruck[k]	,
			bRegen	:arrWetter_Regen[k],
			regen : arrWetter_Regenmenge[k]	,
			regenrate : arrWetter_RegenRate[k]	,
			regenratemax : arrWetter_RegenRateMax[k]	,
			feuchte : arrWetter_Luftfeuchtigkeit[k],
			sonne	: arrWetter_Helligkeit[k] 	
		});
	}


 
 	
 	 var chart = AmCharts.makeChart("AMcontainer1", {
    	type: "stock",
    	theme: "custom",
    	pathToImages: "amcharts/images/",
   
		categoryAxesSettings: {
						minPeriod: "mm"
					},
   		
   		dataSets: [{ 	title: "1st data set",
   						dataProvider:  DataAMChart,
       					fieldMappings: 	[	{fromField: "temp",toField: "temp"},
       										{fromField: "wind",toField: "wind"},
        									{fromField: "windmax",toField: "windmax"},
        									{fromField: "windrichtung",toField: "windrichtung"},
        									{fromField: "luftdruck",toField: "luftdruck"},
        									{fromField: "feuchte",toField: "feuchte"},
        									{fromField: "sonne",toField: "sonne"},
        									{fromField: "bRegen",toField: "bRegen"},
        									{fromField: "regen",toField: "regen"},
        									{fromField: "regenrate",toField: "regenrate"},
        									{fromField: "regenratemax",toField: "regenratemax"},
        								],
        				categoryField: "date",
        				compared: true,
    				}],

  
  
					panels: [{
							showCategoryAxis: true,
							title: "",
							percentHeight: 23,
							
							
							valueAxes:[
									{id:"va11",title: "temperatur",position: "right",dashLength: 5, inside:false,labelOffset:5},
									{id:"va12",title: "Helligkeit",position: "left"	,dashLength: 5,labelOffset:5},
									],

		
							stockGraphs: [
									{	id: "g1",title: "Temperatur",			valueField: "temp",		type: "smoothedLine",	lineThickness: 2,bullet: "none",	useDataSetColors:false,fillAlphas: 0.2,	includeInMinMax: true,				valueAxis: "va11",},
									{	id: "g2",title: "Helligkeit",			valueField: "sonne",type: "smoothedLine",	unit:" kLux",lineThickness: 0.1,bullet: "none",	useDataSetColors:false,fillAlphas: 0.1,					valueAxis: "va12",},
								],
								

							stockLegend:  {valueText: [[]], markerSize:10}
						},{
							showCategoryAxis: true,
							title: "",
							percentHeight: 23,
						
							valueAxes:[
									{id:"va21",
										title: "windrichtung",position: "left"	,minimum:-1100,maximum:360, autoGridCount:false,gridThickness:0,precision:0,labelsEnabled:false,labelOffset:5,
										
										guides: [	{"value": 0,"toValue": 90, 		fillColor: "#ffffff",	fillAlpha:0.08, balloonText:"Nord", label:"Nord"},
													{"value": 90,"toValue": 180, 	fillColor: "#ffffff",	fillAlpha:0.15, balloonText:"Ost",label:"Ost"},
													{"value": 180,"toValue": 270, 	fillColor: "#ffffff",	fillAlpha:0.08, balloonText:"Süd",label:"Süd"},
													{"value": 270,"toValue": 360,	fillColor: "#ffffff",	fillAlpha:0.15, balloonText:"West",label:"West"}],},
									{id:"va22",title: "wind",position: "right"	,dashLength: 5,					autoGridCount:true,		ignoreAxisWidth:true,			minMaxMultiplier:1.2, minimum:0,labelOffset:5,
										guides: [		
														{"value": 0.3,"toValue": 1.6, 		fillColor: "#ffffff",	fillAlpha:0.11, balloonText:"1",	label:"1",	labelOffset:100,	position:"left"},
														{"value": 1.6,"toValue": 3.4, 		fillColor: "#ffffff",	fillAlpha:0.08, balloonText:"2",	label:"2",	labelOffset:100,	position:"left"},
														{"value": 3.4,"toValue": 5.5, 		fillColor: "#ffffff",	fillAlpha:0.11, balloonText:"3",	label:"3",	labelOffset:100,	position:"left"},
														{"value": 5.5,"toValue": 8.0, 		fillColor: "#ffffff",	fillAlpha:0.08, balloonText:"4",	label:"4",	labelOffset:100,	position:"left"},
														{"value": 8.0,"toValue": 10.8, 		fillColor: "#ffffff",	fillAlpha:0.11, balloonText:"5",	label:"5",	labelOffset:100,	position:"left"},
														{"value": 10.8,"toValue": 13.9, 	fillColor: "#ffffff",	fillAlpha:0.08, balloonText:"6",	label:"6",	labelOffset:100,	position:"left"},
														{"value": 13.9,"toValue": 17.2, 	fillColor: "#ffffff",	fillAlpha:0.11, balloonText:"7",	label:"7",	labelOffset:100,	position:"left"},
														{"value": 17.2,"toValue": 20.8, 	fillColor: "#ffffff",	fillAlpha:0.08, balloonText:"8",	label:"8",	labelOffset:100,	position:"left"},
														{"value": 20.8,"toValue": 24.5, 	fillColor: "#ffffff",	fillAlpha:0.11, balloonText:"9",	label:"9",	labelOffset:100,	position:"left"},
														{"value": 24.5,"toValue": 28.5, 	fillColor: "#ffffff",	fillAlpha:0.08, balloonText:"10",	label:"10",	labelOffset:100,	position:"left"},
														{"value": 28.5,"toValue": 32.7,		fillColor: "#ffffff",	fillAlpha:0.11, balloonText:"11",	label:"11",	labelOffset:100,	position:"left"},
														{"value": 32.7,"toValue": 100, 		fillColor: "#ffffff",	fillAlpha:0.08, balloonText:"12",	label:"12",	labelOffset:100,	position:"left"},],},
												
									],

					

		
							categoryAxis: {dashLength: 5},

							stockGraphs: [
								{	id: "g3",title: "Windrichtung",	valueField: "windrichtung",		type: "line",			lineThickness: 0.5,bullet: "round",	bulletSize: 3,	useDataSetColors:false,fillAlphas: 0,	newStack: true,valueAxis: "va21",},
								{	id: "g4",title: "Wind",			valueField: "wind",				type: "smoothedLine",	lineThickness: 1,bullet: "none",	useDataSetColors:false,fillAlphas: 0.1,					valueAxis: "va22",},
								{	id: "g5",title: "Wind Max",		valueField: "windmax",			type: "line",			lineThickness: 0,bullet: "square",	bulletSize: 3,	useDataSetColors:false,fillAlphas: 0,	valueAxis: "va22",},
								],
								

							stockLegend: {valueText: [[]], markerSize:10}
						},{
							showCategoryAxis: true,
							title: "",
							percentHeight: 23,
							
							
							valueAxes:[
									{id:"va41",title: "luftdruck",position: "right"	,dashLength: 5,labelOffset:5},
									{id:"va42",title: "luftfeuchte",position: "left"	,dashLength: 5,labelOffset:5},
						],

		
							stockGraphs: [
									{	id: "g2",title: "Luftdruck",			valueField: "luftdruck",type: "smoothedLine",	unit:" hPa",lineThickness: 1.5,bullet: "none",	useDataSetColors:false,fillAlphas: 0.04,					valueAxis: "va41",},
									{	id: "g11",title: "Luftfeuchtigkeit",	valueField: "feuchte",	type: "smoothedLine",	lineThickness: 1.5,bullet: "none",	bulletSize: 3,	useDataSetColors:false,fillAlphas: 0.04,					valueAxis: "va42",},
						],
								

							stockLegend:  {valueText: [[]], markerSize:10}
						},{
							showCategoryAxis: true,
							title: "",
							percentHeight: 23,
						
							valueAxes:[
									{id:"va31",title: "regen",position: "right",logarithmic:true,precision:2,labelOffset:5},
									{id:"va32",title: "regenrate",position: "left"	,dashLength: 5,logarithmic:false,minimum:0,labelOffset:5},
			//						{id:"va33",title: "luftfeuchte",position: "left"	,dashLength: 5},
									{id:"va34",title: "",position: "right"	,labelsEnabled:false, dashLength: 5,minimum:0, maximum:1,labelOffset:5 },
									],

							

							stockGraphs: [
								{	id: "g8",title: "Regen",			valueField: "regen",		type: "step",	lineThickness: 1,bullet: "none",	useDataSetColors:false,fillAlphas: 0.2,				valueAxis: "va31",},
								{	id: "g9",title: "Regenrate",			valueField: "regenrate",type: "column",	lineThickness: 1,bullet: "none",	useDataSetColors:false,fillAlphas: 0.1,					valueAxis: "va32",},
								{	id: "g10",title: "Regenrate Max.",			valueField: "regenratemax",type: "line",	lineThickness: 0,bullet: "square",	bulletSize: 3,	useDataSetColors:false,fillAlphas: 0,					valueAxis: "va32",},
			//					{	id: "g11",title: "Luftfeuchtigkeit",			valueField: "feuchte",type: "smoothedLine",	lineThickness: 1,bullet: "none",	bulletSize: 3,	useDataSetColors:false,fillAlphas: 0,					valueAxis: "va33",},
								{	id: "g12",title: "Regen",			valueField: "bRegen",		type: "step",	lineThickness: 0,bullet: "none",	useDataSetColors:false,fillAlphas: 0.1,				valueAxis: "va34",},
								],
								

							stockLegend:  {valueText: [[]], markerSize:10}
						}
						
						],

					chartScrollbarSettings: {
						graph: "g1",
						usePeriod: "10mm",
						position: "bottom"
					},

					chartCursorSettings: {
						valueBalloonsEnabled: true,
						valueLineBalloonEnabled:true,
						valueLineEnabled:true,
						pan:true,
						zoomable:true,
						bulletSize:16,
						leaveCursor:false,
					
					},

					periodSelector: {
						position: "top",
						dateFormat: "DD.MM.YYYY HH:NN:SS",
						inputFieldWidth: 150,
						periods: [
								{	period: "hh",	count: 3,	label: "3 Std.",}, 
								{	period: "hh",	count: 6,	label: "6 Std.",}, 
								{	period: "hh",	count: 12,	label: "12 Std."}, 
								{	period: "hh",	count: 24,	label: "24 Std.",	selected: true}, 
								{	period: "hh",	count: 72,	label: "72 Std."}, 
								{	period: "MAX",	label: "MAX"}]
					},


					panelsSettings: {
						usePrefixes: false,
						creditsPosition:"top-middle",		
						thousandsSeparator:"",
						startDuration:0.4,
						startEffect:"easeOutSine",
						panelSpacing:35,
						marginLeft:20,
						marginRight:25,
						},
  
       	
  
  					stockLegend:{
  						enabled: true,
  						useGraphSettings: false,
						data: [{title: "One", color: "#3366CC"},{title: "Two", color: "#FFCC33"}]
  					}
  


});
    	
     
}
	
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

	
	
 

