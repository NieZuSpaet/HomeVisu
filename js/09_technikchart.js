	 
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




/* SPS-Variablen */
var 	iWP_Watt,
		plc_SystemTime,
		arrTechnik_Leistung = new Array(),
		arrTechnik_TempOutdoor = new Array(),
		arrTechnik_TempFL = new Array(),
		arrTechnik_TempWG = new Array(),
		arrTechnik_TempWE = new Array(),
		arrTechnik_TempKU = new Array(),
		arrTechnik_TempGB = new Array(),
		arrTechnik_TempST = new Array(),
		arrTechnik_TempSC = new Array(),
		arrTechnik_TempBD = new Array(),
		arrTechnik_TempAN = new Array(),
		arrTechnik_TempTH = new Array(),
		arrTechnik_TempAVG = new Array(),
		arrTechnik_TempWP_VL = new Array(),
		arrTechnik_TempWP_RL = new Array(),
		arrTechnik_TempWW_Oben = new Array(),
		arrTechnik_TempWW_Unten = new Array(),
		arrTechnik_TempLftg_Zuluft = new Array(),
		arrTechnik_TempLftg_Abluft = new Array(),
		arrTechnik_Sonne = new Array(),
		arrTechnik_Heizstab= new Array(),
		arrTechnik_WattCnt = new Array();

var  	success = false,
		arrZeitstempel_technik= new Array();

	





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
/*****				Technikchart mit AM-Chart				*****/		
/*****														*****/		
/****************************************************************/

$(document).on('pageshow', '#technikchart2' ,function() {

 Plc.sumReadReq({
    	items: [{
			name: '.arrTechnik',
			jvar: 'PLC_VAR.arrTechnik',
			def: structdef_Technik,
		}],
		ocd: 50,
		oc: function() { technikchart2();},
	});

});

function technikchart2()
{	

	
	nStunde = -2;
	nMinute = 0;
	
	var nWattCnt = 0; 
	var nVerbrauch = 0;
	var	DataTechnikChart2 = new Array();
	for (var k = 0; k < 1439; k++) {

	nJahr = PLC_VAR.arrTechnik[0].dtTime.slice(0,4);
	nMonat = PLC_VAR.arrTechnik[0].dtTime.slice(5,7);
	nTag = PLC_VAR.arrTechnik[0].dtTime.slice(8,10);
//	nStunde = PLC_VAR.arrTechnik[k].dtTime.slice(11,13);
//	nMinute = PLC_VAR.arrTechnik[k].dtTime.slice(14,16);
		
	nMinute = nMinute + 1;
	if (nMinute == 60)
	{
		nMinute = 0;
		nStunde = nStunde + 1;
	}					
	var XstartHilf= new Date();
		
	XstartHilf.setFullYear(nJahr);
	XstartHilf.setMonth(nMonat-1);
	XstartHilf.setDate(nTag);
	XstartHilf.setUTCHours(nStunde);
	XstartHilf.setMinutes(nMinute);
	XstartHilf.setSeconds(0);

	arrZeitstempel_technik.push(XstartHilf);
		

		arrTechnik_Leistung[k]				= PLC_VAR.arrTechnik[k].nLeistung / 10;
		nVerbrauch = nVerbrauch + arrTechnik_Leistung[k];
		nWattCnt = nWattCnt + arrTechnik_Leistung[k];
		arrTechnik_WattCnt[k] = nWattCnt / 1000;
		
		arrTechnik_TempOutdoor[k]			= PLC_VAR.arrTechnik[k].nTempOutdoor / 10;
		arrTechnik_TempFL[k]					= PLC_VAR.arrTechnik[k].nTempFL / 10;
		arrTechnik_TempWG[k]					= PLC_VAR.arrTechnik[k].nTempWG / 10;
		arrTechnik_TempWE[k]					= PLC_VAR.arrTechnik[k].nTempWE / 10;
		arrTechnik_TempKU[k]					= PLC_VAR.arrTechnik[k].nTempKU / 10;
		arrTechnik_TempGB[k]					= PLC_VAR.arrTechnik[k].nTempGB / 10;
		arrTechnik_TempST[k]					= PLC_VAR.arrTechnik[k].nTempST / 10;
		arrTechnik_TempSC[k]					= PLC_VAR.arrTechnik[k].nTempSC / 10;
		arrTechnik_TempBD[k]					= PLC_VAR.arrTechnik[k].nTempBD / 10;
		arrTechnik_TempAN[k]					= PLC_VAR.arrTechnik[k].nTempAN / 10;
		arrTechnik_TempTH[k]					= PLC_VAR.arrTechnik[k].nTempTH / 10;
		arrTechnik_TempAVG[k]				= PLC_VAR.arrTechnik[k].nTempAVG / 10;
		arrTechnik_TempWP_VL[k]				= PLC_VAR.arrTechnik[k].nTempWP_VL / 10;
		arrTechnik_TempWP_RL[k]				= PLC_VAR.arrTechnik[k].nTempWP_RL / 10;
		arrTechnik_TempWW_Oben[k]			= PLC_VAR.arrTechnik[k].nTempWW_Oben / 10;
		arrTechnik_TempWW_Unten[k]			= PLC_VAR.arrTechnik[k].nTempWW_Unten / 10;
		arrTechnik_TempLftg_Zuluft[k]		= PLC_VAR.arrTechnik[k].nTempLftg_Zuluft / 10;
		arrTechnik_TempLftg_Abluft[k]		= PLC_VAR.arrTechnik[k].nTempLftg_Abluft / 10;
		arrTechnik_Sonne[k]					= PLC_VAR.arrTechnik[k].nSonne;
		arrTechnik_Heizstab[k]				= PLC_VAR.arrTechnik[k].nHeizstab;
	
	
	
		DataTechnikChart2.push({
			date 		: 	arrZeitstempel_technik[k],
			leistung	:	arrTechnik_Leistung[k],
			watt		:	arrTechnik_WattCnt[k],
			tempOutdoor	:	arrTechnik_TempOutdoor[k],			
			tempFL		:	arrTechnik_TempFL[k],				
			tempoWG		:	arrTechnik_TempWG[k],					
			tempWE		:	arrTechnik_TempWE[k],					
			tempKU		:	arrTechnik_TempKU[k],					
			tempGB		:	arrTechnik_TempGB[k],					
			tempST		:	arrTechnik_TempST[k],					
			tempSC		:	arrTechnik_TempSC[k],					
			tempBD		:	arrTechnik_TempBD[k],					
			tempAN		:	arrTechnik_TempAN[k],					
			tempTH		:	arrTechnik_TempTH[k],					
			tempAVG		:	arrTechnik_TempAVG[k],				
			tempWP_VL	:	arrTechnik_TempWP_VL[k],				
			tempWP_RL	:	arrTechnik_TempWP_RL[k],				
			tempWW_OB	:	arrTechnik_TempWW_Oben[k],			
			tempWW_UN	:	arrTechnik_TempWW_Unten[k],			
			tempLFTG_ZU	:	arrTechnik_TempLftg_Zuluft[k],		
			tempLFTG_AB	:	arrTechnik_TempLftg_Abluft[k],		
			Sonne		:	arrTechnik_Sonne[k],					
			Heizstab	:	arrTechnik_Heizstab[k],				
		});
 
 	}
	 
 	 var chart = AmCharts.makeChart("container_technikchart2", {
    	type: "stock",
    	theme: "custom",
    	pathToImages: "amcharts/images/",
   
		categoryAxesSettings: {
						minPeriod: "mm"
					},
   		
   		dataSets: [{ 	title: "1st data set",
   						dataProvider:  DataTechnikChart2,
       					fieldMappings: 	[	{fromField: "leistung",toField: "leistung"},
       										{fromField: "watt",toField: "watt"},
       										{fromField: "tempOutdoor",toField: "tempOutdoor"},
        									{fromField: "Heizstab",toField: "Heizstab"},
        									{fromField: "tempWP_VL",toField: "tempWP_VL"},
        									{fromField: "tempWP_RL",toField: "tempWP_RL"},
        									{fromField: "tempWW_OB",toField: "tempWW_OB"},
        									{fromField: "tempWW_UN",toField: "tempWW_UN"},
        									{fromField: "tempLFTG_ZU",toField: "tempLFTG_ZU"},
        									{fromField: "tempLFTG_AB",toField: "tempLFTG_AB"},
        									{fromField: "tempAVG",toField: "tempAVG"},
        									
        								],
        				categoryField: "date",
        				compared: true,
    				}],

  
  
					panels: [{
							showCategoryAxis: true,
							title: "",
							percentHeight: 20,
							
							
							valueAxes:[
									{id:"va11",title: "Watt",position: "left",dashLength: 5, inside:true},
									{id:"va12",title: "Temperatur",position: "right",dashLength: 5, inside:true},
									{id:"va13",title: "Watt",position: "left",dashLength: 5, inside:true,labelsEnabled:false},
									{id:"va14",title: "",position: "right"	,labelsEnabled:false,minimum:0, maximum:1, },
	
									],

		
							stockGraphs: [
									{	id: "g1",title: "Leistung",			valueField: "leistung",			type: "smoothedLine",	lineThickness: 2,bullet: "none",	useDataSetColors:false,fillAlphas: 0.06,	includeInMinMax: true,				valueAxis: "va11",},
									{	id: "g2",title: "WP Vorlauf",		valueField: "tempWP_VL",		type: "smoothedLine",	lineThickness: 2,bullet: "none",	useDataSetColors:false,fillAlphas: 0,	includeInMinMax: true,				valueAxis: "va12",},
									{	id: "g3",title: "WP Rücklauf",		valueField: "tempWP_RL",		type: "smoothedLine",	lineThickness: 2,bullet: "none",	useDataSetColors:false,fillAlphas: 0,	includeInMinMax: true,				valueAxis: "va12",},
									{	id: "g4",title: "WW Oben",			valueField: "tempWW_OB",		type: "smoothedLine",	lineThickness: 2,bullet: "none",	useDataSetColors:false,fillAlphas: 0,	includeInMinMax: true,				valueAxis: "va12",},
									{	id: "g5",title: "WW Unten",			valueField: "tempWW_UN",		type: "smoothedLine",	lineThickness: 2,bullet: "none",	useDataSetColors:false,fillAlphas: 0,	includeInMinMax: true,				valueAxis: "va12",},
									{	id: "g6",title: "Heizstab",			valueField: "Heizstab",		type: "step",	lineThickness: 0,bullet: "none",	useDataSetColors:false,fillAlphas: 0.3,	includeInMinMax: true,	valueAxis: "va14",},
									{	id: "g7",title: "Watt (Summe)",		valueField: "watt",		type: "line",	lineThickness: 1,bullet: "none",	useDataSetColors:false,fillAlphas: 0.01,	includeInMinMax: true,		hidden:true,	valueAxis: "va13",},
								],
								

							stockLegend: {valueText: [[]], markerSize:10}
						},{
							showCategoryAxis: true,
							title: "",
							percentHeight: 20,
						
							valueAxes:[
									{id:"va21",title: "Temperatur",position: "right"	, dashLength: 5,precision:1,labelsEnabled:true}
										
									],

					

		
							categoryAxis: {dashLength: 5},

							stockGraphs: [
								{	id: "g7",title: "Außentemperatur",	valueField: "tempOutdoor",			type: "smoothedLine",			lineThickness: 2,	useDataSetColors:false,fillAlphas: 0,valueAxis: "va21",},
								{	id: "g8",title: "Zuluft",		valueField: "tempLFTG_ZU",				type: "smoothedLine",	lineThickness: 2,	useDataSetColors:false,fillAlphas: 0.01,					valueAxis: "va21",},
								{	id: "g9",title: "Abluft",		valueField: "tempLFTG_AB",				type: "smoothedLine",			lineThickness: 2,	useDataSetColors:false,fillAlphas: 0,	valueAxis: "va21",},
								{	id: "g10",title: "Raumtemperatur Avg.",		valueField: "tempAVG",			type: "smoothedLine",	lineThickness: 2,	useDataSetColors:false,fillAlphas: 0.01,					valueAxis: "va21",},
								],
								

							stockLegend:{valueText: [[]], markerSize:10}
						}/*,{
							showCategoryAxis: true,
							title: "",
							percentHeight: 20,
						
							valueAxes:[
									{id:"va31",title: "regen",position: "right",logarithmic:true,precision:2},
									{id:"va32",title: "regenrate",position: "left"	,dashLength: 5,logarithmic:false,minimum:0},
			//						{id:"va33",title: "luftfeuchte",position: "left"	,dashLength: 5},
									],

							

							stockGraphs: [
								{	id: "g8",title: "Regen",			valueField: "regen",		type: "step",	lineThickness: 1,bullet: "none",	useDataSetColors:false,fillAlphas: 0.2,				valueAxis: "va31",},
								{	id: "g9",title: "Regenrate",			valueField: "regenrate",type: "column",	lineThickness: 1,bullet: "none",	useDataSetColors:false,fillAlphas: 0.1,					valueAxis: "va32",},
								{	id: "g10",title: "Regenrate Max.",			valueField: "regenratemax",type: "line",	lineThickness: 0,bullet: "square",	bulletSize: 3,	useDataSetColors:false,fillAlphas: 0,					valueAxis: "va32",},
			//					{	id: "g11",title: "Luftfeuchtigkeit",			valueField: "feuchte",type: "smoothedLine",	lineThickness: 1,bullet: "none",	bulletSize: 3,	useDataSetColors:false,fillAlphas: 0,					valueAxis: "va33",},
								],
								

							stockLegend: {valueTextRegular: " ",markerType: "none"}
						}*/
						
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
								{	period: "hh",	count: 1,	label: "1 Std.",}, 
								{	period: "hh",	count: 3,	label: "3 Std.",}, 
								{	period: "hh",	count: 6,	label: "6 Std.",}, 
								{	period: "hh",	count: 12,	label: "12 Std."}, 
								{	period: "hh",	count: 23,	label: "24 Std.",	selected: true}, 
								]
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
  
       	
  
  					
  


});
    	
 	
}
	

/****************************************************************/








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

	
	
 

