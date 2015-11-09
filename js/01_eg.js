	 
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
var		plc_SystemTime,
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
		
	
	
	
	dimmer101.onclick = function() {	glbIndexDIM = 1;	PopUp_Dimmer_EG();	};
	dimmer102.onclick = function() {	glbIndexDIM = 2;	PopUp_Dimmer_EG();	};
	dimmer103.onclick = function() {	glbIndexDIM = 3;	PopUp_Dimmer_EG();	};
	dimmer104.onclick = function() {	glbIndexDIM = 4;	PopUp_Dimmer_EG();	};
	dimmer105.onclick = function() {	glbIndexDIM = 5;	PopUp_Dimmer_EG();	};
	dimmer106.onclick = function() {	glbIndexDIM = 6;	PopUp_Dimmer_EG();	};
	dimmer107.onclick = function() {	glbIndexDIM = 7;	PopUp_Dimmer_EG();	};

	steckdose101.onclick = function() {	glbIndexSS = 1;	PopUp_Steckdose_EG();	};
	steckdose102.onclick = function() {	glbIndexSS = 2;	PopUp_Steckdose_EG();	};
	steckdose103.onclick = function() {	glbIndexSS = 3;	PopUp_Steckdose_EG();	};
	steckdose104.onclick = function() {	glbIndexSS = 4;	PopUp_Steckdose_EG();	};
	steckdose105.onclick = function() {	glbIndexSS = 5;	PopUp_Steckdose_EG();	};
	steckdose106.onclick = function() {	glbIndexSS = 6;	PopUp_Steckdose_EG();	};
	steckdose107.onclick = function() {	glbIndexSS = 7;	PopUp_Steckdose_EG();	};
	steckdose108.onclick = function() {	glbIndexSS = 8;	PopUp_Steckdose_EG();	};
	steckdose109.onclick = function() {	glbIndexSS = 9;	PopUp_Steckdose_EG();	};
	steckdose110.onclick = function() {	glbIndexSS = 10;	PopUp_Steckdose_EG();	};
	steckdose111.onclick = function() {	glbIndexSS = 11;	PopUp_Steckdose_EG();	};
	steckdose112.onclick = function() {	glbIndexSS = 12;	PopUp_Steckdose_EG();	};
	steckdose113.onclick = function() {	glbIndexSS = 13;	PopUp_Steckdose_EG();	};
	steckdose114.onclick = function() {	glbIndexSS = 14;	PopUp_Steckdose_EG();	};
	steckdose115.onclick = function() {	glbIndexSS = 15;	PopUp_Steckdose_EG();	};
	steckdose116.onclick = function() {	glbIndexSS = 16;	PopUp_Steckdose_EG();	};
	steckdose117.onclick = function() {	glbIndexSS = 17;	PopUp_Steckdose_EG();	};
	steckdose118.onclick = function() {	glbIndexSS = 18;	PopUp_Steckdose_EG();	};
	steckdose119.onclick = function() {	glbIndexSS = 19;	PopUp_Steckdose_EG();	};
	steckdose120.onclick = function() {	glbIndexSS = 20;	PopUp_Steckdose_EG();	};
	steckdose121.onclick = function() {	glbIndexSS = 21;	PopUp_Steckdose_EG();	};
	steckdose122.onclick = function() {	glbIndexSS = 22;	PopUp_Steckdose_EG();	};
	steckdose123.onclick = function() {	glbIndexSS = 23;	PopUp_Steckdose_EG();	};
	steckdose124.onclick = function() {	glbIndexSS = 24;	PopUp_Steckdose_EG();	};
	steckdose125.onclick = function() {	glbIndexSS = 25;	PopUp_Steckdose_EG();	};
	steckdose126.onclick = function() {	glbIndexSS = 26;	PopUp_Steckdose_EG();	};
	steckdose127.onclick = function() {	glbIndexSS = 27;	PopUp_Steckdose_EG();	};
	steckdose128.onclick = function() {	glbIndexSS = 28;	PopUp_Steckdose_EG();	};
	steckdose129.onclick = function() {	glbIndexSS = 29;	PopUp_Steckdose_EG();	};
	steckdose130.onclick = function() {	glbIndexSS = 30;	PopUp_Steckdose_EG();	};
	steckdose131.onclick = function() {	glbIndexSS = 31;	PopUp_Steckdose_EG();	};
	steckdose132.onclick = function() {	glbIndexSS = 32;	PopUp_Steckdose_EG();	};
	steckdose133.onclick = function() {	glbIndexSS = 33;	PopUp_Steckdose_EG();	};
	steckdose134.onclick = function() {	glbIndexSS = 34;	PopUp_Steckdose_EG();	};	
	
	
	
	lampe101.onclick = function() { glbIndexLA = 1;	PopUp_Lampe();	};	
	lampe102.onclick = function() { glbIndexLA = 2;	PopUp_Lampe();	};	
	lampe107.onclick = function() { glbIndexLA = 7;	PopUp_Lampe();	};	
		
	raffstore101.onclick = function() {  glbIndexRA = 1; PopUpRaffstoreEG()};
	raffstore102.onclick = function() {  glbIndexRA = 2; PopUpRaffstoreEG()};
	raffstore103.onclick = function() {  glbIndexRA = 3; PopUpRaffstoreEG()};
	raffstore104.onclick = function() {  glbIndexRA = 4; PopUpRaffstoreEG()};
	raffstore105.onclick = function() {  glbIndexRA = 5; PopUpRaffstoreEG()};
	


/****************************************************************/
/*****														*****/		
/*****				INIT: Steckdosen EG						*****/		
/*****														*****/		
/****************************************************************/
	function PopUp_Steckdose_EG(){
		
		if(PLC_VAR.ArrStatusVisu[glbIndexSS] == true) 
		{
			document.getElementById("toggle_steckdose_eg").value = 'on';
				$('#toggle_steckdose_eg').slider('refresh');
		}
		else
		{
		document.getElementById("toggle_steckdose_eg").value = 'off';
				$('#toggle_steckdose_eg').slider('refresh');
		};
	
	}

	toggle_steckdose_eg.onchange = function()
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
/*****				INIT: Lampen							*****/		
/*****														*****/		
/****************************************************************/
	function PopUp_Lampe()
	{			
		if(PLC_VAR.ArrStatusVisu[glbIndexLA + nglbAnzahlSteckdosen + nglbAnzahlDimmer] == true) 
		{
			document.getElementById("toggle_lampe_eg").value = 'on';
				$('#toggle_lampe_eg').slider('refresh');
		}
		else
		{
			document.getElementById("toggle_lampe_eg").value = 'off';
				$('#toggle_lampe_eg').slider('refresh');
		};
	};

	toggle_lampe_eg.onchange = function()
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
/*****				INIT: Dimmer EG							*****/		
/*****														*****/		
/****************************************************************/
	function PopUp_Dimmer_EG()
	{   		
		document.all["dim_value_eg"].value = PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmIst + " %";
		document.getElementById('slider_dim_eg').value = PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmIst;
			$('#slider_dim_eg').slider('refresh');
	};

	$("#btn_dim_dwn_eg").bind('vmousedown', function()
	{
			PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmDwn = true;
	       	document.getElementById('slider_dim_eg').value = PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmIst;
				$('#slider_dim_eg').slider('refresh');
			PLC_WRITE_DIMM();
	}).bind('vmouseup', function(){
	       PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmDwn = false;
	       	document.getElementById('slider_dim_eg').value = PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmIst;
				$('#slider_dim_eg').slider('refresh');
			PLC_WRITE_DIMM();
    });

	$("#btn_dim_up_eg").bind('vmousedown', function()
	{
			PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmUp = true;
	 		PLC_WRITE_DIMM();
	       	document.getElementById('slider_dim_eg').value = PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmIst;
			$('#slider_dim_eg').slider('refresh');
	}).bind('vmouseup', function(){
	        PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmUp = false;
	 		PLC_WRITE_DIMM();
	       	document.getElementById('slider_dim_eg').value = PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmIst;
			$('#slider_dim_eg').slider('refresh');
	});


	$("#btn_dim_set_eg").bind('vmousedown', function(){
			PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmSet = true;
	  		PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmSoll = document.getElementById('slider_dim_eg').value;
	 		PLC_WRITE_DIMM();
	    }).bind('vmouseup', function(){
	      	PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmSet = false;
	 		PLC_WRITE_DIMM();
	    });
	
	$("#btn_dim_off_eg").bind('vmousedown', function(){
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
/*****				INIT: Raffstore EG						*****/		
/*****														*****/		
/****************************************************************/
	function PopUpRaffstoreEG()
	{
		document.all["slider_raff_pos_eg"].value = (PLC_VAR.ArrRaffVisu[glbIndexRA].iPosIst * (-1) + 100);
			$('#slider_raff_pos_eg').slider('refresh');
		lastRaffPosValue = PLC_VAR.ArrRaffVisu[glbIndexRA].iPosIst;
	
		document.all["slider_raff_ang_eg"].value = (PLC_VAR.ArrRaffVisu[glbIndexRA].iAngIst * (-1) + 100);
			$('#slider_raff_ang_eg').slider('refresh');
		lastRaffAngValue = PLC_VAR.ArrRaffVisu[glbIndexRA].iAngIst;
	}

	btn_raff_sun_eg.onchange = function()
	{
		if ($('#btn_raff_sun_eg').prop("checked") == true)
		{
			PLC_VAR.ArrRaffVisu[glbIndexRA].bVerschattung_Visu = true;
		}
		else
		{
			PLC_VAR.ArrRaffVisu[glbIndexRA].bVerschattung_Visu = false;		
		};
		PLC_WRITE_RAFF();
	};

	btn_raff_tracking_eg.onchange = function()
	{
		if ($('#btn_raff_tracking_eg').prop("checked") == true)
		{
			PLC_VAR.ArrRaffVisu[glbIndexRA].bDisableTracking = true;
		}
		else
		{
			PLC_VAR.ArrRaffVisu[glbIndexRA].bDisableTracking = false;		
		};
		PLC_WRITE_RAFF();
	};

	btn_raff_door_eg.onchange = function()
	{
		if ($('#btn_raff_door_eg').prop("checked") == true)
		{
			PLC_VAR.ArrRaffVisu[glbIndexRA].bTuerKontaktAktiv = true;
		}
		else
		{
			PLC_VAR.ArrRaffVisu[glbIndexRA].bTuerKontaktAktiv = false;		
		};
		PLC_WRITE_RAFF();
	};
	
	$("#btn_raff_set_eg").bind('vmousedown', function(){
			PLC_VAR.ArrRaffVisu[glbIndexRA].bSet = true;
	  		PLC_VAR.ArrRaffVisu[glbIndexRA].bVerschattung_Visu = false;
	  		PLC_VAR.ArrRaffVisu[glbIndexRA].iPosSet = (document.all["slider_raff_pos_eg"].value - 100) * (-1);
	 		PLC_VAR.ArrRaffVisu[glbIndexRA].iAngSet =  (document.all["slider_raff_ang_eg"].value - 100) * (-1);
	 		PLC_WRITE_RAFF();
	    }).bind('vmouseup', function(){
	      	PLC_VAR.ArrRaffVisu[glbIndexRA].bSet = false;
	 		PLC_WRITE_RAFF();
	    });
	
	$("#btn_raff_up_eg").bind('vmousedown', function(){
			PLC_VAR.ArrRaffVisu[glbIndexRA].bSet = true;
	  		PLC_VAR.ArrRaffVisu[glbIndexRA].bVerschattung_Visu = false;
	  		PLC_VAR.ArrRaffVisu[glbIndexRA].iPosSet = 100;
	 		PLC_VAR.ArrRaffVisu[glbIndexRA].iAngSet = 100;
	 		PLC_WRITE_RAFF();
	    }).bind('vmouseup', function(){
	      	PLC_VAR.ArrRaffVisu[glbIndexRA].bSet = false;
	 		PLC_WRITE_RAFF();
	    });

	$("#btn_raff_dwn_eg").bind('vmousedown', function(){
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
	           	}],
             });



	document.getElementById("systemtime").firstChild.data =plc_SystemTime;

	nStartwert = 1;
	nEndwert = nStartwert + 34;	
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
	
	nStartwert = 57;
	nEndwert = nStartwert + 7;
	for (var j = nStartwert; j < nEndwert; j++)
	{
		nVarName = 100 + (j - nStartwert + 1);
		if (PLC_VAR.ArrStatusVisu[j] == true)
			{
				document.getElementById("dimmer" + nVarName).className = "green my_li_dimm_" + nVarName;
			}
		else
			{
				document.getElementById("dimmer" + nVarName).className = "my_li_dimm_" + nVarName;	
			};	
	};			
	
	



	nStartwert = 68;
	nEndwert = 70;
	for (var j = nStartwert; j < nEndwert; j++)
	{
		nVarName = 100 + (j - nStartwert + 1);
		if (PLC_VAR.ArrStatusVisu[j] == true)
			{
				document.getElementById("lampe" + nVarName).className = "green my_li_lampe_" + nVarName;
			}
		else
			{
				document.getElementById("lampe" + nVarName).className = "my_li_lampe_" + nVarName;	
			};	
	};	
	
	
		if (PLC_VAR.ArrStatusVisu[74] == true)
			{
				document.getElementById("lampe107").className = "green my_li_lampe_107";
			}
		else
			{
				document.getElementById("lampe107").className = "my_li_lampe_107";	
			};	





	
	
	nStartwert = 76;
	nEndwert = nStartwert + 5;	
	for (var j = nStartwert; j < nEndwert; j++)
	{
		nVarName = 100 + (j - nStartwert + 1);
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
	
	
	nStartwert = 88;
	nEndwert = nStartwert + 7;	
	for (var j = nStartwert; j < nEndwert; j++)
	{
		nVarName = 100 + (j - nStartwert + 1);
		if (PLC_VAR.ArrStatusVisu[j] == true)
			{
				document.getElementById("fenster" + nVarName).className = "green my_li_fenster_" + nVarName;
			}
		else
			{
				document.getElementById("fenster" + nVarName).className = "red my_li_fenster_" + nVarName;	
			};	
	};	
		
		
	nStartwert = 102;
	nEndwert = nStartwert + 3;	
	for (var j = nStartwert; j < nEndwert; j++)
	{
		nVarName = 100 + (j - nStartwert + 1);
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

	document.getElementById("temp101").firstChild.data = (PLC_VAR.ArrTempVisu[1] / 10).toFixed(1) +" °C";
	document.getElementById("temp102").firstChild.data = (PLC_VAR.ArrTempVisu[2] / 10).toFixed(1) +" °C";
	document.getElementById("temp103").firstChild.data = (PLC_VAR.ArrTempVisu[3] / 10).toFixed(1) +" °C";
	document.getElementById("temp104").firstChild.data = (PLC_VAR.ArrTempVisu[4] / 10).toFixed(1) +" °C";
	document.getElementById("temp105").firstChild.data = (PLC_VAR.ArrTempVisu[5] / 10).toFixed(1) +" °C";
	document.getElementById("temp111").firstChild.data = (PLC_VAR.ArrTempVisu[11] / 10).toFixed(1) +" °C";	


	if ($.mobile.activePage.find(".class_popup_dimmer_eg").parent().hasClass("ui-popup-active"))
	{
			if(lastDimmValue != PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmIst)
			{
				document.all["slider_dim_eg"].value = PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmIst;
					$('#slider_dim_eg').slider('refresh');
				lastDimmValue = PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmIst;
			};
		     // the popup is open
			document.all["dim_value_eg"].value = PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmIst + " %";
				$('#slider_dim_eg').slider('refresh');		
			
			if(PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmDwn == true)
			   	document.getElementById('slider_dim_eg').value = PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmIst;
			if(PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmUp == true)
			   	document.getElementById('slider_dim_eg').value = PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmIst;
	};
	if ($.mobile.activePage.find(".class_popup_raffstore_eg").parent().hasClass("ui-popup-active"))
	{
			if(lastRaffPosValue != PLC_VAR.ArrRaffVisu[glbIndexRA].iPosIst)
			{
			document.all["slider_raff_pos_eg"].value = (PLC_VAR.ArrRaffVisu[glbIndexRA].iPosIst * (-1) + 100);
				$('#slider_raff_pos_eg').slider('refresh');
				lastRaffPosValue = PLC_VAR.ArrRaffVisu[glbIndexRA].iPosIst;
			};
			if(lastRaffAngValue != PLC_VAR.ArrRaffVisu[glbIndexRA].iAngIst)
			{
			document.all["slider_raff_ang_eg"].value = (PLC_VAR.ArrRaffVisu[glbIndexRA].iAngIst * (-1) + 100);
				$('#slider_raff_ang_eg').slider('refresh');
				lastRaffAngValue = PLC_VAR.ArrRaffVisu[glbIndexRA].iAngIst;
			};
		$("#btn_raff_sun_eg").prop("checked",PLC_VAR.ArrRaffVisu[glbIndexRA].bVerschattung_Visu).checkboxradio("refresh");
		$("#btn_raff_tracking_eg").prop("checked",PLC_VAR.ArrRaffVisu[glbIndexRA].bDisableTracking).checkboxradio("refresh");
		$("#btn_raff_door_eg").prop("checked",PLC_VAR.ArrRaffVisu[glbIndexRA].bTuerKontaktAktiv).checkboxradio("refresh");
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

	
	
 

