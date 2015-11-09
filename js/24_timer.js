	 
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

var Timer_Struct = {
	ENABLE					: 	'BOOL',
	NAME					: 	'STRING.16',
	START 					: 	'TOD.#hh#:#mm#',
	DURATION 				: 	'TIME.#hh#:#mm#',
	LUX						: 	'INT',
	STOP					: 	'TOD.#hh#:#mm#',
	MODE 					: 	'BYTE',
};




/* SPS-Variablen */
var plc_SystemTime;

/****************************************************************/
/*****														*****/		
/*****				Initialisierung							*****/		
/*****														*****/		
/****************************************************************/

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

function init()
{ 
		
	
	
	


/****************************************************************/
/*****														*****/		
/*****				INIT: Setup Timer						*****/		
/*****														*****/		
/****************************************************************/
function setup_timer()
{
	
	document.all["control"].value = "Start Funktion Setup";

	Plc.sumReadReq({
  //          id: 2,        //If an ID is given, the script waits for the end of the request before firing a new one.
            items: [
                {
                   	name: '.arrTimer',
					jvar: 'PLC_VAR.ArrTimer',
					def: Timer_Struct,
             	}],
             	oc: function() {
					for (var k = 1; k < 11; k++) {
							if(PLC_VAR.ArrTimer[k].ENABLE == true) 
							{
								document.getElementById("enable_timer_" + k).value = 'on';
									$('#enable_timer_' + k).slider('enable');
									$('#enable_timer_' + k).slider('refresh');
							}
							else
							{
								document.getElementById("enable_timer_" + k).value = 'off';
									$('#enable_timer_' + k).slider('enable');
									$('#enable_timer_' + k).slider('refresh');
							};
							document.all["name_timer_" +k].value = PLC_VAR.ArrTimer[k].NAME;
								$('#name_timer_' +k).textinput('enable');
							document.all["startzeit_timer_" +k].value = PLC_VAR.ArrTimer[k].START;
								$('#startzeit_timer_' +k).textinput('enable');
							document.all["dauer_timer_" +k].value = PLC_VAR.ArrTimer[k].DURATION;
								$('#dauer_timer_' +k).textinput('enable');
							document.all["select_timer_" +k].value = PLC_VAR.ArrTimer[k].MODE;
								$('#select_timer_' + k ).selectmenu('enable');
								$('#select_timer_' + k ).selectmenu('refresh');
					};
					for (var k = 11; k < 21; k++) {
							if(PLC_VAR.ArrTimer[k].ENABLE == true) 
							{
								document.getElementById("enable_timer_" + k).value = 'on';
									$('#enable_timer_' + k).slider('enable');
									$('#enable_timer_' + k).slider('refresh');
							}
							else
							{
								document.getElementById("enable_timer_" + k).value = 'off';
									$('#enable_timer_' + k).slider('enable');
									$('#enable_timer_' + k).slider('refresh');
							};
							document.all["name_timer_" +k].value = PLC_VAR.ArrTimer[k].NAME;
								$('#name_timer_' +k).textinput('enable');
							document.all["start_timer_" +k].value = PLC_VAR.ArrTimer[k].LUX;
								$('#start_timer_' +k).textinput('enable');
							document.all["stop_timer_" +k].value = PLC_VAR.ArrTimer[k].STOP;
								$('#stop_timer_' +k).textinput('enable');
							document.all["select_timer_" +k].value = PLC_VAR.ArrTimer[k].MODE;
								$('#select_timer_' + k ).selectmenu('enable');
								$('#select_timer_' + k ).selectmenu('refresh');
					};
					
						$('#save_struct').prop('disabled',false);
						
			
    					document.all["control"].value = "Ende Lesen von SPS";
					},
      		});
};

	read_struct.onclick = function(){ 
		document.all["control"].value = "Start Funktion Lesen der Struktur"; 
		setup_timer();
	};
   	
   	
	save_struct.onclick = function(){
		document.all("control").value = "Start Funktion Speichern der Struktur";
	
		for (var e = 1; e < 11; e++) {
			if(document.getElementById("enable_timer_" + e).value == 'on') 
			{
				PLC_VAR.ArrTimer[e].ENABLE = true;	
			}
			else
			{
				PLC_VAR.ArrTimer[e].ENABLE = false;	
			};
	
			
			PLC_VAR.ArrTimer[e].NAME = document.all("name_timer_" + e).value;	
			PLC_VAR.ArrTimer[e].START = document.all("startzeit_timer_" + e).value;	
			
			duration =  document.all("dauer_timer_" + e).value;	
			var hilf = duration.indexOf(':'); 
			var stunden = duration.slice(0,hilf);
			var minuten = duration.slice(hilf+1,duration.length);
			
			PLC_VAR.ArrTimer[e].DURATION = (stunden * 1000 * 60 * 60)+ (minuten * 1000 * 60);
			PLC_VAR.ArrTimer[e].MODE = document.all("select_timer_" + e).value;	
		};
		for (var e = 11; e < 21; e++) {
			if(document.getElementById("enable_timer_" + e).value == 'on') 
			{
				PLC_VAR.ArrTimer[e].ENABLE = true;	
			}
			else
			{
				PLC_VAR.ArrTimer[e].ENABLE = false;	
			};
	
			
			PLC_VAR.ArrTimer[e].NAME = document.all("name_timer_" + e).value;	
			PLC_VAR.ArrTimer[e].LUX = document.all("start_timer_" + e).value;	
			
			duration =  document.all("stop_timer_" + e).value;	
			var hilf = duration.indexOf(':'); 
			var stunden = duration.slice(0,hilf);
			var minuten = duration.slice(hilf+1,duration.length);
			
		//	PLC_VAR.ArrTimer[e].STOP = (stunden * 1000 * 60 * 60)+ (minuten * 1000 * 60);
			PLC_VAR.ArrTimer[e].STOP = document.all("stop_timer_" + e).value;	
			PLC_VAR.ArrTimer[e].MODE = document.all("select_timer_" + e).value;	
		};
		Plc.sumWriteReq({
	            items: [{
					name: '.arrTimer',
					val: PLC_VAR.ArrTimer,
					def: Timer_Struct,
				}],
				oc: function(){
					
					
					document.all("control").value = "Speichern der Struktur feddich DURATION 1 = " +stunden+":"+minuten;
				},
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
					name: '.dtSystemTime',
                    type: "DT.#WEEKDAY#, #DD#.#MM#.#YYYY#  - #hh#:#mm#:#ss#",
                    jvar: 'plc_SystemTime'
       	    	}],
             });
	

		
	
 	document.getElementById("systemtime_timer").firstChild.data = plc_SystemTime;

 window.setTimeout('loop()', 300);
}	

/****************************************************************/
/*****														*****/		
/*****				Ende LOOP()								*****/		
/*****														*****/		
/****************************************************************/

	
	
 

