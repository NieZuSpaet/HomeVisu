	 
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


var structdef_ArrStatusVisu = {
	arrStatusVisu		:'BOOL'
};

var structdef_ArrErrorVisu = {
	arrErrorVisu		:'BOOL'
};

	
var structdef_ArrTempVisu = {
	arrTempVisu		:'INT'
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


/* SPS-Variablen */
var 	test,
		plc_SystemTime,
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


$(document).ready(function() {
  $('body').css('display', 'none');
  $('body').fadeIn(300);
  $('.link').click(function(event) {
    event.preventDefault();
    newLocation = $('.link a').attr("href");
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
		
	
	
	
	
	lampe306.onclick = function() { glbIndexLA = 6;	PopUp_LampeUebersicht();	};	
	lampe307.onclick = function() { glbIndexLA = 7;	PopUp_LampeUebersicht();	};	
	lampe308.onclick = function() { glbIndexLA = 8;	PopUp_LampeUebersicht();	};	
		
	
	raffstore301.onclick = function() {  glbIndexRA = 0; PopUpRaffstore()};
	raffstore302.onclick = function() {  glbIndexRA = 0; PopUpRaffstore()};
	raffstore303.onclick = function() {  glbIndexRA = 0; PopUpRaffstore()};
	raffstore304.onclick = function() {  glbIndexRA = 0; PopUpRaffstore()};
	raffstore305.onclick = function() {  glbIndexRA = 0; PopUpRaffstore()};
	raffstore306.onclick = function() {  glbIndexRA = 0; PopUpRaffstore()};
	raffstore307.onclick = function() {  glbIndexRA = 0; PopUpRaffstore()};
	raffstore308.onclick = function() {  glbIndexRA = 0; PopUpRaffstore()};
	raffstore309.onclick = function() {  glbIndexRA = 0; PopUpRaffstore()};
	raffstore310.onclick = function() {  glbIndexRA = 0; PopUpRaffstore()};
	raffstore311.onclick = function() {  glbIndexRA = 0; PopUpRaffstore()};
	raffstore312.onclick = function() {  glbIndexRA = 0; PopUpRaffstore()};


/****************************************************************/
/*****														*****/		
/*****				INIT: Lampen							*****/		
/*****														*****/		
/****************************************************************/
	function PopUp_LampeUebersicht()
	{
		if(PLC_VAR.ArrStatusVisu[glbIndexLA + nglbAnzahlSteckdosen + nglbAnzahlDimmer] == true) 
		{
			document.getElementById("toggle_lampe_uebersicht").value = 'on';
				$('#toggle_lampe_uebersicht').slider('refresh');
		}
		else
		{
		document.getElementById("toggle_lampe_uebersicht").value = 'off';
				$('#toggle_lampe_uebersicht').slider('refresh');
		};
	};

	toggle_lampe_uebersicht.onchange = function()
	{
		PLC_VAR.ArrToggleLicht[glbIndexLA] ="true";
		
		Plc.writeArrayOfBool({
	                 					name: '.arrLicht_Toggle_Visu',
	                 					item: glbIndexLA,
										val: PLC_VAR.ArrToggleLicht,
	      							}
	      						);
	}
	
/****************************************************************/
/*****														*****/		
/*****				INIT: Raffstore Übersicht				*****/		
/*****														*****/		
/****************************************************************/
	function PopUpRaffstore()
	{
		document.all["slider_raff_pos"].value = (PLC_VAR.ArrRaffVisu[glbIndexRA].iPosIst * (-1) + 100);
			$('#slider_raff_pos').slider('refresh');
		lastRaffPosValue = PLC_VAR.ArrRaffVisu[glbIndexRA].iPosIst;
	
		document.all["slider_raff_ang"].value = (PLC_VAR.ArrRaffVisu[glbIndexRA].iAngIst * (-1) + 100);
			$('#slider_raff_ang').slider('refresh');
		lastRaffAngValue = PLC_VAR.ArrRaffVisu[glbIndexRA].iAngIst;
	}

	btn_raff_sun.onchange = function()
	{
		if ($('#btn_raff_sun').prop("checked") == true)
		{
			for (var k = 0; k < 13; k++) {
				PLC_VAR.ArrRaffVisu[k].bVerschattung_Visu = true;
				}
		}
		else
		{
			for (var k = 0; k < 13; k++) {
				PLC_VAR.ArrRaffVisu[k].bVerschattung_Visu = false;
				}
		};
		PLC_WRITE_RAFF();
	};
	
	btn_raff_tracking.onchange = function()
	{
		if ($('#btn_raff_tracking').prop("checked") == true)
		{
			for (var k = 0; k < 13; k++) {
				PLC_VAR.ArrRaffVisu[k].bDisableTracking = true;
				}		
		}
		else
		{
			for (var k = 0; k < 13; k++) {
				PLC_VAR.ArrRaffVisu[k].bDisableTracking = false;		
				}
		};
		PLC_WRITE_RAFF();
	};

btn_raff_wind.onchange = function()
	{
		if ($('#btn_raff_wind').prop("checked") == true)
		{
			for (var k = 0; k < 13; k++) {
				PLC_VAR.ArrRaffVisu[k].bWindAktiv = true;
				}
		}
		else
		{
			for (var k = 0; k < 13; k++) {
				PLC_VAR.ArrRaffVisu[k].bWindAktiv = false;		
				}
		};
		PLC_WRITE_RAFF();
	};

	$("#btn_raff_set").bind('vmousedown', function(){
			for (var k = 0; k < 13; k++) {
				PLC_VAR.ArrRaffVisu[k].bSet = true;
		  		PLC_VAR.ArrRaffVisu[k].bVerschattung_Visu = false;
		  		PLC_VAR.ArrRaffVisu[k].iPosSet = (document.all["slider_raff_pos"].value - 100) * (-1);
		 		PLC_VAR.ArrRaffVisu[k].iAngSet =  (document.all["slider_raff_ang"].value - 100) * (-1);
				}
	 		PLC_WRITE_RAFF();
	    }).bind('vmouseup', function(){
			for (var k = 0; k < 13; k++) {
	   		   	PLC_VAR.ArrRaffVisu[k].bSet = false;
				}
	 		PLC_WRITE_RAFF();
	    });
	
	$("#btn_raff_up").bind('vmousedown', function(){
			for (var k = 0; k < 13; k++) {
				PLC_VAR.ArrRaffVisu[k].bSet = true;
		  		PLC_VAR.ArrRaffVisu[k].bVerschattung_Visu = false;
		  		PLC_VAR.ArrRaffVisu[k].iPosSet = 100;
		 		PLC_VAR.ArrRaffVisu[k].iAngSet = 100;
				}
	 		PLC_WRITE_RAFF();
	    }).bind('vmouseup', function(){
			for (var k = 0; k < 13; k++) {
	      		PLC_VAR.ArrRaffVisu[k].bSet = false;
				}
	 		PLC_WRITE_RAFF();
	    });

	$("#btn_raff_dwn").bind('vmousedown', function(){
			for (var k = 0; k < 13; k++) {
				PLC_VAR.ArrRaffVisu[k].bSet = true;
		  		PLC_VAR.ArrRaffVisu[k].bVerschattung_Visu = false;
		  		PLC_VAR.ArrRaffVisu[k].iPosSet = 0;
		 		PLC_VAR.ArrRaffVisu[k].iAngSet = 0;
				}
	 		PLC_WRITE_RAFF();
	    }).bind('vmouseup', function(){
			for (var k = 0; k < 13; k++) {
	     	 	PLC_VAR.ArrRaffVisu[k].bSet = false;
				}
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
	};


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

 


	
	nStartwert = 68;
	nEndwert = 76;
	for (var j = nStartwert; j < nEndwert; j++)
	{
		nVarName = 100 + (j - nStartwert + 1);
		if (PLC_VAR.ArrStatusVisu[j] == true)
			{
				document.getElementById("lampe" + (200 + nVarName)).className = "green my_li_lampe_" + (200 + nVarName);
			}
		else
			{
				document.getElementById("lampe" + (200 + nVarName)).className = "my_li_lampe_" + (200 + nVarName);	
			};	
	};	
	
	
	
	
	nStartwert = 88;
	nEndwert = 102;	
	for (var j = nStartwert; j < nEndwert; j++)
	{
		nVarName = 100 + (j - nStartwert + 1);
		if (PLC_VAR.ArrStatusVisu[j] == true)
			{
					document.getElementById("fenster" + (200 +nVarName)).className = "green my_li_fenster_" + (200 +nVarName);
			}
		else
			{
				document.getElementById("fenster" + (200 +nVarName)).className = "red my_li_fenster_" + (200 +nVarName);	
			};	
	};	
		
		
	nStartwert = 102;
	nEndwert = 109;	
	for (var j = nStartwert; j < nEndwert; j++)
	{
		nVarName = 100 + (j - nStartwert + 1);
		if (PLC_VAR.ArrErrorVisu[j] == true)
			{
				document.getElementById("rauchmelder" + (200 +nVarName)).className = "red my_li_rauchmelder_" + (200 +nVarName);
			}
		else
			{
				if (PLC_VAR.ArrStatusVisu[j] == true)
					{
						document.getElementById("rauchmelder" + (200 + nVarName)).className = "yellow my_li_rauchmelder_" + (200 +nVarName);
					}
				else
					{
						document.getElementById("rauchmelder" + (200 + nVarName)).className = "my_li_rauchmelder_" + (200 +nVarName);	
					};
			};	
	};							

for (var k = 1; k < 13; k++)
{
	document.getElementById("temp" +(300 +k)).firstChild.data = (PLC_VAR.ArrTempVisu[k] / 10).toFixed(1) +" °C";
};			


if ($("#uebersicht").is(".ui-page-active")) {
	if ($.mobile.activePage.find(".class_popup_raffstore").parent().hasClass("ui-popup-active"))
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
		$("#btn_raff_sun").prop("checked",PLC_VAR.ArrRaffVisu[glbIndexRA].bVerschattung_Visu).checkboxradio("refresh");
		$("#btn_raff_tracking").prop("checked",PLC_VAR.ArrRaffVisu[glbIndexRA].bDisableTracking).checkboxradio("refresh");
	//	$("#btn_raff_door").prop("checked",PLC_VAR.ArrRaffVisu[glbIndexRA].bTuerKontaktAktiv).checkboxradio("refresh");
		$("#btn_raff_wind").prop("checked",PLC_VAR.ArrRaffVisu[glbIndexRA].bWindAktiv).checkboxradio("refresh");
		};

};




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

	
	
 

