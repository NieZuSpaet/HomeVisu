	 
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
var 	plc_SystemTime,
 		plc_nDimmerWert,
 		lastDimmValue,
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
		
	
	
	
	
	dimmer108.onclick = function() {	glbIndexDIM = 8;	PopUp_Dimmer_OG();	};
	dimmer109.onclick = function() {	glbIndexDIM = 9;	PopUp_Dimmer_OG();	};
	dimmer110.onclick = function() {	glbIndexDIM = 10;	PopUp_Dimmer_OG();	};
	dimmer111.onclick = function() {	glbIndexDIM = 11;	PopUp_Dimmer_OG();	};
	dimmer112.onclick = function() {	glbIndexDIM = 2;	PopUp_Dimmer_OG();	};

	steckdose135.onclick = function() { glbIndexSS = 35;	PopUp_Steckdose_OG();	};
	steckdose136.onclick = function() { glbIndexSS = 36;	PopUp_Steckdose_OG();	};
	steckdose137.onclick = function() { glbIndexSS = 37;	PopUp_Steckdose_OG();	};
	steckdose138.onclick = function() { glbIndexSS = 38;	PopUp_Steckdose_OG();	};
	steckdose139.onclick = function() { glbIndexSS = 39;	PopUp_Steckdose_OG();	};
	steckdose140.onclick = function() { glbIndexSS = 40;	PopUp_Steckdose_OG();	};
	steckdose141.onclick = function() { glbIndexSS = 41;	PopUp_Steckdose_OG();	};
	steckdose142.onclick = function() { glbIndexSS = 42;	PopUp_Steckdose_OG();	};
	steckdose143.onclick = function() { glbIndexSS = 43;	PopUp_Steckdose_OG();	};
	steckdose144.onclick = function() { glbIndexSS = 44;	PopUp_Steckdose_OG();	};
	steckdose145.onclick = function() { glbIndexSS = 45;	PopUp_Steckdose_OG();	};
	steckdose146.onclick = function() { glbIndexSS = 46;	PopUp_Steckdose_OG();	};
	steckdose147.onclick = function() { glbIndexSS = 47;	PopUp_Steckdose_OG();	};
	steckdose148.onclick = function() { glbIndexSS = 48;	PopUp_Steckdose_OG();	};
	steckdose149.onclick = function() { glbIndexSS = 49;	PopUp_Steckdose_OG();	};
	steckdose150.onclick = function() { glbIndexSS = 50;	PopUp_Steckdose_OG();	};
	steckdose151.onclick = function() { glbIndexSS = 51;	PopUp_Steckdose_OG();	};
	steckdose152.onclick = function() { glbIndexSS = 52;	PopUp_Steckdose_OG();	};
	steckdose153.onclick = function() { glbIndexSS = 53;	PopUp_Steckdose_OG();	};
	steckdose154.onclick = function() { glbIndexSS = 54;	PopUp_Steckdose_OG();	};
	steckdose155.onclick = function() { glbIndexSS = 55;	PopUp_Steckdose_OG();	};
	steckdose156.onclick = function() { glbIndexSS = 56;	PopUp_Steckdose_OG();	};
	
	
	
	lampe103.onclick = function() { glbIndexLA = 3;	PopUp_Lampe();	};	
	lampe104.onclick = function() { glbIndexLA = 4;	PopUp_Lampe();	};	
	lampe105.onclick = function() { glbIndexLA = 5;	PopUp_Lampe();	};	
		
	raffstore106.onclick = function() {  glbIndexRA = 6; PopUpRaffstoreOG()};
	raffstore107.onclick = function() {  glbIndexRA = 7; PopUpRaffstoreOG()};
	raffstore108.onclick = function() {  glbIndexRA = 8; PopUpRaffstoreOG()};
	raffstore109.onclick = function() {  glbIndexRA = 9; PopUpRaffstoreOG()};
	raffstore110.onclick = function() {  glbIndexRA = 10; PopUpRaffstoreOG()};
	raffstore111.onclick = function() {  glbIndexRA = 11; PopUpRaffstoreOG()};
	raffstore112.onclick = function() {  glbIndexRA = 12; PopUpRaffstoreOG()};
	


/****************************************************************/
/*****														*****/		
/*****				INIT: Steckdosen OG						*****/		
/*****														*****/		
/****************************************************************/
	function PopUp_Steckdose_OG()
	{
		if(PLC_VAR.ArrStatusVisu[glbIndexSS] == true) 
		{
			document.getElementById("toggle_steckdose_og").value = 'on';
				$('#toggle_steckdose_og').slider('refresh');
		}
		else
		{
		document.getElementById("toggle_steckdose_og").value = 'off';
				$('#toggle_steckdose_og').slider('refresh');
		};
	};		
		
	toggle_steckdose_og.onchange = function()
	{
		PLC_VAR.ArrToggleSteckdose[glbIndexSS] ="true";
		
		Plc.writeArrayOfBool({
	                 					name: '.arrSS_Toggle_Visu',
	                 					item: glbIndexSS,
										val: PLC_VAR.ArrToggleSteckdose,
	      							}
	      						);
	};

/****************************************************************/
/*****														*****/		
/*****				INIT: Lampen							*****/		
/*****														*****/		
/****************************************************************/
	function PopUp_Lampe()
	{		
		if(PLC_VAR.ArrStatusVisu[glbIndexLA + nglbAnzahlSteckdosen + nglbAnzahlDimmer] == true) 
		{
			document.getElementById("toggle_lampe_og").value = 'on';
				$('#toggle_lampe_og').slider('refresh');
		}
		else
		{
		document.getElementById("toggle_lampe_og").value = 'off';
				$('#toggle_lampe_og').slider('refresh');
		};		
	};

	toggle_lampe_og.onchange = function()
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
/*****				INIT: Dimmer OG							*****/		
/*****														*****/		
/****************************************************************/
	function PopUp_Dimmer_OG()
	{   		
		document.all["dim_value_og"].value = PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmIst + " %";
		document.getElementById('slider_dim_og').value = PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmIst;
			$('#slider_dim_og').slider('refresh');
	};

	$("#btn_dim_dwn_og").bind('vmousedown', function()
	{
			PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmDwn = true;
	       	document.getElementById('slider_dim_og').value = PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmIst;
				$('#slider_dim_og').slider('refresh');
			PLC_WRITE_DIMM();
	}).bind('vmouseup', function(){
	       PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmDwn = false;
	       	document.getElementById('slider_dim_og').value = PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmIst;
				$('#slider_dim_og').slider('refresh');
			PLC_WRITE_DIMM();
	});

	$("#btn_dim_up_og").bind('vmousedown', function(){
			PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmUp = true;
	 		PLC_WRITE_DIMM();
	       	document.getElementById('slider_dim_og').value = PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmIst;
				$('#slider_dim_og').slider('refresh');	
		}).bind('vmouseup', function(){
	        PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmUp = false;
	       	document.getElementById('slider_dim_og').value = PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmIst;
			$('#slider_dim_og').slider('refresh');
 			PLC_WRITE_DIMM();
    });

	$("#btn_dim_set_og").bind('vmousedown', function(){
			PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmSet = true;
	  		PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmSoll = document.getElementById('slider_dim_og').value;
	 		PLC_WRITE_DIMM();
	    }).bind('vmouseup', function(){
	      	PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmSet = false;
	 		PLC_WRITE_DIMM();
	    });
	
	$("#btn_dim_off_og").bind('vmousedown', function(){
			PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmSet = true;
	  		PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmSoll = 0;
	 		PLC_WRITE_DIMM();
	    }).bind('vmouseup', function(){
	      	PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmSet = false;
	 		PLC_WRITE_DIMM();
	    });

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
	           
		
	};

/****************************************************************/
/*****														*****/		
/*****				INIT: Raffstore OG						*****/		
/*****														*****/		
/****************************************************************/
	function PopUpRaffstoreOG()
	{
		document.all["slider_raff_pos_og"].value = (PLC_VAR.ArrRaffVisu[glbIndexRA].iPosIst * (-1) + 100);
			$('#slider_raff_pos_og').slider('refresh');
		lastRaffPosValue = PLC_VAR.ArrRaffVisu[glbIndexRA].iPosIst;
	
		document.all["slider_raff_ang_og"].value = (PLC_VAR.ArrRaffVisu[glbIndexRA].iAngIst * (-1) + 100);
			$('#slider_raff_ang_og').slider('refresh');
		lastRaffAngValue = PLC_VAR.ArrRaffVisu[glbIndexRA].iAngIst;
	}
	
	btn_raff_sun_og.onchange = function()
	{
		if ($('#btn_raff_sun_og').prop("checked") == true)
		{
			PLC_VAR.ArrRaffVisu[glbIndexRA].bVerschattung_Visu = true;
		}
		else
		{
			PLC_VAR.ArrRaffVisu[glbIndexRA].bVerschattung_Visu = false;		
		};
		PLC_WRITE_RAFF();
	}

	btn_raff_tracking_og.onchange = function()
	{
		if ($('#btn_raff_tracking_og').prop("checked") == true)
		{
			PLC_VAR.ArrRaffVisu[glbIndexRA].bDisableTracking = true;
		}
		else
		{
			PLC_VAR.ArrRaffVisu[glbIndexRA].bDisableTracking = false;		
		};
		PLC_WRITE_RAFF();
	};


	btn_raff_door_og.onchange = function()
	{
		if ($('#btn_raff_door_og').prop("checked") == true)
		{
			PLC_VAR.ArrRaffVisu[glbIndexRA].bTuerKontaktAktiv = true;
		}
		else
		{
			PLC_VAR.ArrRaffVisu[glbIndexRA].bTuerKontaktAktiv = false;		
		};
		PLC_WRITE_RAFF();
	}

	$("#btn_raff_set_og").bind('vmousedown', function(){
			PLC_VAR.ArrRaffVisu[glbIndexRA].bSet = true;
	  		PLC_VAR.ArrRaffVisu[glbIndexRA].iPosSet = (document.all["slider_raff_pos_og"].value - 100) * (-1);
	 		PLC_VAR.ArrRaffVisu[glbIndexRA].iAngSet =  (document.all["slider_raff_ang_og"].value - 100) * (-1);
	 		PLC_WRITE_RAFF();
	    }).bind('vmouseup', function(){
	      	PLC_VAR.ArrRaffVisu[glbIndexRA].bSet = false;
	 		PLC_WRITE_RAFF();
	    });
	
	$("#btn_raff_up_og").bind('vmousedown', function(){
			PLC_VAR.ArrRaffVisu[glbIndexRA].bSet = true;
	  		PLC_VAR.ArrRaffVisu[glbIndexRA].iPosSet = 100;
	 		PLC_VAR.ArrRaffVisu[glbIndexRA].iAngSet = 100;
	 		PLC_WRITE_RAFF();
	    }).bind('vmouseup', function(){
	      	PLC_VAR.ArrRaffVisu[glbIndexRA].bSet = false;
	 		PLC_WRITE_RAFF();
	    });
	
	$("#btn_raff_dwn_og").bind('vmousedown', function(){
			PLC_VAR.ArrRaffVisu[glbIndexRA].bSet = true;
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



	nStartwert = 35;
	nEndwert = 57;	
	for (var i = nStartwert; i < nEndwert; i++)
	{
		if (PLC_VAR.ArrErrorVisu[i] == true)
			{
				document.getElementById("steckdose" +(100 +i)).className = "red my_li_steck_" +(100 +i);
			}
		else
			{
				if (PLC_VAR.ArrStatusVisu[i] == true)
					{
						document.getElementById("steckdose" +(100 +i)).className = "green my_li_steck_" +(100 +i);
					}
				else
					{
						document.getElementById("steckdose" +(100 +i)).className = "my_li_steck_" +(100 +i);	
					};	
			};	
			
	};		
	
	nStartwert = 64;
	nEndwert = 68;
	for (var j = nStartwert; j < nEndwert; j++)
	{
		nVarName = 100 + (j - 57 + 1);
		if (PLC_VAR.ArrStatusVisu[j] == true)
			{
				document.getElementById("dimmer" + nVarName).className = "green my_li_dimm_" + nVarName;
			}
		else
			{
				document.getElementById("dimmer" + nVarName).className = "my_li_dimm_" + nVarName;	
			};	
	};			
	
	if (PLC_VAR.ArrStatusVisu[58] == true)
			{
				document.getElementById("dimmer112").className = "green my_li_dimm_102";
			}
		else
			{
				document.getElementById("dimmer112").className = "my_li_dimm_102";	
			};	
		
	
	nStartwert = 70;
	nEndwert = 73;
	for (var j = nStartwert; j < nEndwert; j++)
	{
		nVarName = 100 + (j - 68 + 1);
		if (PLC_VAR.ArrStatusVisu[j] == true)
			{
				document.getElementById("lampe" + nVarName).className = "green my_li_lampe_" + nVarName;
			}
		else
			{
				document.getElementById("lampe" + nVarName).className = "my_li_lampe_" + nVarName;	
			};	
	};	
	
	
	nStartwert = 81;
	nEndwert = 88;	
	for (var j = nStartwert; j < nEndwert; j++)
	{
		nVarName = 100 + (j - 76 + 1);
		if (PLC_VAR.ArrStatusVisu[j] == true)
			{
				document.getElementById("raffstore" + nVarName).className = "green my_li_raffstore_" + nVarName;
				document.getElementById("raffstore" +(100 + nVarName)).className = "dark my_li_raffstore_" +(100 +nVarName);
			}
		else
			{
				document.getElementById("raffstore" + nVarName).className = "my_li_raffstore_" + nVarName;	
				document.getElementById("raffstore" +(100 + nVarName)).className = "my_li_raffstore_" +(100 + nVarName);	
			};	
	};	
	
	
	nStartwert = 96;
	nEndwert = 100;	
	for (var j = nStartwert; j < nEndwert; j++)
	{
		nVarName = 100 + (j - 88 + 1);
		if (PLC_VAR.ArrStatusVisu[j] == true)
			{
				document.getElementById("fenster" + nVarName).className = "green my_li_fenster_" + nVarName;
			}
		else
			{
				document.getElementById("fenster" + nVarName).className = "red my_li_fenster_" + nVarName;	
			};	
	};	
		
		
	nStartwert = 106;
	nEndwert = 109;	
	for (var j = nStartwert; j < nEndwert; j++)
	{
		nVarName = 100 + (j - 102 + 1);
		if (PLC_VAR.ArrErrorVisu[j] == true)
			{
				document.getElementById("rauchmelder" + nVarName).className = "red my_li_rauchmelder_" + nVarName;
			}
		else
			{
				if (PLC_VAR.ArrStatusVisu[j] == true)
					{
						document.getElementById("rauchmelder" + nVarName).className = "yellow my_li_rauchmelder_" + nVarName;
					}
				else
					{
						document.getElementById("rauchmelder" + nVarName).className = "my_li_rauchmelder_" + nVarName;	
					};
			};	
	};							

	document.getElementById("temp106").firstChild.data = (PLC_VAR.ArrTempVisu[6] / 10).toFixed(1) +" °C";
	document.getElementById("temp107").firstChild.data = (PLC_VAR.ArrTempVisu[7] / 10).toFixed(1) +" °C";
	document.getElementById("temp108").firstChild.data = (PLC_VAR.ArrTempVisu[8] / 10).toFixed(1) +" °C";
	document.getElementById("temp109").firstChild.data = (PLC_VAR.ArrTempVisu[9] / 10).toFixed(1) +" °C";
	document.getElementById("temp110").firstChild.data = (PLC_VAR.ArrTempVisu[10] / 10).toFixed(1) +" °C";
	document.getElementById("temp112").firstChild.data = (PLC_VAR.ArrTempVisu[12] / 10).toFixed(1) +" °C";	

	
	if ($.mobile.activePage.find(".class_popup_dimmer_og").parent().hasClass("ui-popup-active"))
	{
			if(lastDimmValue != PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmIst)
			{
				document.all["slider_dim_og"].value = PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmIst;
					$('#slider_dim_og').slider('refresh');
				lastDimmValue = PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmIst;
			};
		     // the popup is open
			document.all["dim_value_og"].value = PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmIst + " %";
				$('#slider_dim_og').slider('refresh');		
			
			if(PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmDwn == true)
			   	document.getElementById('slider_dim_og').value = PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmIst;
			if(PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmUp == true)
			   	document.getElementById('slider_dim_og').value = PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmIst;
	};
	if ($.mobile.activePage.find(".class_popup_raffstore_og").parent().hasClass("ui-popup-active"))
	{
			if(lastRaffPosValue != PLC_VAR.ArrRaffVisu[glbIndexRA].iPosIst)
			{
			document.all["slider_raff_pos_og"].value = (PLC_VAR.ArrRaffVisu[glbIndexRA].iPosIst * (-1) + 100);
				$('#slider_raff_pos_og').slider('refresh');
				lastRaffPosValue = PLC_VAR.ArrRaffVisu[glbIndexRA].iPosIst;
			};
			if(lastRaffAngValue != PLC_VAR.ArrRaffVisu[glbIndexRA].iAngIst)
			{
			document.all["slider_raff_ang_og"].value = (PLC_VAR.ArrRaffVisu[glbIndexRA].iAngIst * (-1) + 100);
				$('#slider_raff_ang_og').slider('refresh');
				lastRaffAngValue = PLC_VAR.ArrRaffVisu[glbIndexRA].iAngIst;
			};
		$("#btn_raff_sun_og").prop("checked",PLC_VAR.ArrRaffVisu[glbIndexRA].bVerschattung_Visu).checkboxradio("refresh");
		$("#btn_raff_tracking_og").prop("checked",PLC_VAR.ArrRaffVisu[glbIndexRA].bDisableTracking).checkboxradio("refresh");
		$("#btn_raff_door_og").prop("checked",PLC_VAR.ArrRaffVisu[glbIndexRA].bTuerKontaktAktiv).checkboxradio("refresh");
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

	
	
 

