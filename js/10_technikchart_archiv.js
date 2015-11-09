	 
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
var 	plc_SystemTime,
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
/*****			Technikchart-Archiv  mit AM-Chart			*****/		
/*****														*****/		
/****************************************************************/



function chart_3()
{

		/* letztes Element der Arrays löschen */
		arrTechnik_Leistung.pop();				
		arrTechnik_TempOutdoor.pop();			
		arrTechnik_TempFL.pop();					
		arrTechnik_TempWG.pop();				
	 	arrTechnik_TempWE.pop();				
		arrTechnik_TempKU.pop();					
		arrTechnik_TempGB.pop();					
		arrTechnik_TempST.pop();					
		arrTechnik_TempSC.pop();					
		arrTechnik_TempBD.pop();					
		arrTechnik_TempAN.pop();					
		arrTechnik_TempTH.pop();					
		arrTechnik_TempAVG.pop();				
		arrTechnik_TempWP_VL.pop();				
		arrTechnik_TempWP_RL.pop();				
		arrTechnik_TempWW_Oben.pop();				
		arrTechnik_TempWW_Unten.pop();				
		arrTechnik_TempLftg_Zuluft.pop();				
		arrTechnik_TempLftg_Abluft.pop();				
		arrTechnik_Sonne.pop();				
		arrTechnik_Heizstab.pop();				


	
//	nStunde = -2;
//	nMinute = 0;
	
	var nWattCnt = 0; 
	var	DataTechnikChart2 = new Array();

	for (var k = 0; k < 1439; k++) {

		nWattCnt = nWattCnt + arrTechnik_Leistung[k],
	
			DataTechnikChart2.push({
			date 		: 	arrZeitstempel_technik[k] - 7200000,
			leistung	:	arrTechnik_Leistung[k],
			watt		:	nWattCnt,
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
	 
 	 var chart = AmCharts.makeChart("container3", {
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
									{	id: "g1",title: "Leistung",			valueField: "leistung",		type: "line",	lineThickness: 2,bullet: "none",	useDataSetColors:false,fillAlphas: 0.06,	includeInMinMax: true,				valueAxis: "va11",},
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
						}],

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



function get_success()
{
	if(success == true)
	{
		document.getElementById("wp_file").firstChild.data = "";
     	chart_3();
    }
    else
    {
    	document.getElementById("wp_file").firstChild.data = " Es ist ein Fehler aufgetreten. File nicht vorhanden.";
    };

}	

	

/****************************************************************/





/****************************************************************/
/*****														*****/		
/*****				Initialisierung							*****/		
/*****														*****/		
/****************************************************************/

function init()
{ 
		



/****************************************************************/
/*****														*****/		
/*****	INIT: Button Date Select WP_statistik (AM-Chart)	*****/		
/*****														*****/		
/****************************************************************/

//	$("#btn_select_date").bind('vmousedown', function(){
btn_select_date.onclick = function()
{
		var select_date= document.all["date_select"].value; 
		success = false;
		stFilename = select_date.slice(6,10) + select_date.slice(3,5) + select_date.slice(0,2);
		
			 $.get("WP/" +stFilename +".xml", function(XMLTwinCatArray)
			  {
			  	
 // suche nach jedem (each) 'bluray' abschnitt 
    	    $(XMLTwinCatArray).find("value").each(function()
    	    {
 		        // gefundenen abschnitt in variable zwischenspeichern (cachen)
        		var $myTC = $(this);
    
 		       	// einzelne werte auslesen und zwischenspeichern
 		       	// attribute: funktion 'attr()'
 		       	// tags: nach dem tag suchen & text auslesen
 		       	var index = $myTC.attr("index");
					
 		       	
				arrZeitstempel_technik[index] 	 =  (($myTC.find("DTTIME").text()) * 1000);
 		  		arrTechnik_Leistung[index] 		= $myTC.find("NLEISTUNG").text() / 10; 
				arrTechnik_TempOutdoor[index] 	= $myTC.find("NTEMPOUTDOOR").text() / 10; 
				arrTechnik_TempFL[index] 		= $myTC.find("NTEMPFL").text() / 10; 
				arrTechnik_TempWG[index] 		= $myTC.find("NTEMPWG").text() / 10; 
				arrTechnik_TempWE[index] 		= $myTC.find("NTEMPWE").text() / 10; 
				arrTechnik_TempKU[index] 		= $myTC.find("NTEMPKU").text() / 10; 
				arrTechnik_TempGB[index] 		= $myTC.find("NTEMPGB").text() / 10; 
				arrTechnik_TempST[index] 		= $myTC.find("NTEMPST").text() / 10; 
				arrTechnik_TempSC[index] 		= $myTC.find("NTEMPSC").text() / 10; 
				arrTechnik_TempBD[index] 		= $myTC.find("NTEMPBD").text() / 10; 
				arrTechnik_TempAN[index] 		= $myTC.find("NTEMPAN").text() / 10; 
				arrTechnik_TempTH[index] 		= $myTC.find("NTEMPTH").text() / 10; 
				arrTechnik_TempAVG[index] 		= $myTC.find("NTEMPAVG").text() / 10;
				arrTechnik_TempWP_VL[index] 		= $myTC.find("NTEMPWP_VL").text() / 10;
				arrTechnik_TempWP_RL[index] 		= $myTC.find("NTEMPWP_RL").text() / 10;
				arrTechnik_TempWW_Oben[index] 		= $myTC.find("NTEMPWW_OBEN").text() / 10;
				arrTechnik_TempWW_Unten[index] 		= $myTC.find("NTEMPWW_UNTEN").text() / 10;
				arrTechnik_TempLftg_Zuluft[index] 		= $myTC.find("NTEMPLFTG_ZULUFT").text() / 10;
				arrTechnik_TempLftg_Abluft[index] 		= $myTC.find("NTEMPLFTG_ABLUFT").text() / 10;
				arrTechnik_Sonne[index] 			= $myTC.find("NSONNE").text() / 1; 
				arrTechnik_Heizstab[index] 			= $myTC.find("NHEIZSTAB").text() / 1; 
		 	});
 
 
 
		 success = true;
	     });
	     $('#container3').empty();
		document.getElementById("wp_file").firstChild.data = "Wait... File wird geladen...";	
     	window.setTimeout('get_success()', 7000);
//});
}




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

	
	
 

