	 
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
var		plc_SystemTime,
 		bMerkerWindrichtung = false,
		nRegenHilf,
		nRegenSummeHilf,
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
			
	if(PLC_VAR.Wetter.nOutdoortemp > 100)
	{
		document.getElementById("GefTempText").firstChild.data = "gefühlte Temperatur";
	}
	else
	{
		document.getElementById("GefTempText").firstChild.data = "Windchill";
	};			
			
		
	
 	document.getElementById("systemtime").firstChild.data =plc_SystemTime;

	document.all["Outdoortemp"].value 			= (PLC_VAR.Wetter.nOutdoortemp / 10).toFixed(1) + " °C";
	document.all["GefTemp"].value 				= (PLC_VAR.Wetter.nGefTemp / 10).toFixed(1) + " °C";
	document.all["MaxTemp"].value 				= (PLC_VAR.Wetter.nMaxTemp24h / 10).toFixed(1) +" °C";
	document.all["MinTemp"].value 				= (PLC_VAR.Wetter.nMinTemp24h / 10).toFixed(1) +" °C";
	document.all["Windspeed"].value 			= (PLC_VAR.Wetter.nWindspeed / 100).toFixed(2) + " m/s";
	document.all["WindspeedMittelwert"].value 	= (PLC_VAR.Wetter.nWindspeedMittelwert / 100).toFixed(2) + " m/s";
	document.all["WindspeedMax"].value 			= (PLC_VAR.Wetter.nWindspeedMax / 100).toFixed(2) + " m/s";
	document.all["MaxWind"].value 				= (PLC_VAR.Wetter.nMaxWind24h / 100).toFixed(2) + " m/s";
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
	else if (PLC_VAR.Wetter.nWindDir > 326 && PLC_VAR.Wetter.nWindDir <= 349)
		document.all["WindDirStr"].value = "NNW";	
	else
		document.all["WindDirStr"].value = "N";			






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

	
	
 

