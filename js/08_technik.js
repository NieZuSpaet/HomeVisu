	 
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
var 	plc_SystemTime;
 	

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
					name: '.visTechnik',
					jvar: 'PLC_VAR.Technik',
					def: structdef_Technik,
				},{
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

   	document.getElementById("temp_wp_vl").firstChild.data 				= "VL: " + (PLC_VAR.Technik.nTempWP_VL / 10).toFixed(1) + " °C";
   	document.getElementById("temp_wp_rl").firstChild.data  				= "RL: " + (PLC_VAR.Technik.nTempWP_RL / 10).toFixed(1) + " °C";
   	document.getElementById("wp_leistung").firstChild.data  				= (PLC_VAR.Technik.nLeistung) + " Watt";
   	document.getElementById("temp_ww_oben").firstChild.data 				= (PLC_VAR.Technik.nTempWW_Oben / 10).toFixed(1) + " °C";
   	document.getElementById("temp_ww_unten").firstChild.data 				= (PLC_VAR.Technik.nTempWW_Unten / 10).toFixed(1) + " °C";
   	document.getElementById("temp_lftg_ab").firstChild.data 				= (PLC_VAR.Technik.nTempLftg_Abluft / 10).toFixed(1) + " °C";
   	document.getElementById("temp_lftg_zu").firstChild.data 				= (PLC_VAR.Technik.nTempLftg_Zuluft / 10).toFixed(1) + " °C";
   	document.getElementById("temp_lftg_au").firstChild.data 				= (PLC_VAR.Wetter.nOutdoortemp / 10).toFixed(1) + " °C";
         
	

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

	
	
 

