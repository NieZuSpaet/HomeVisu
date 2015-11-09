   
var PLC_VAR = {
	stLueftung:[],
	stKonfiguration:[],
	ArrSS:[], 
	ArrDIMM:[], 
	ArrLampe:[],
	ArrRaffConfig:[], 
	ArrRaffConfigZeit:[] 
};

var Plc =  TAME.WebServiceClient.createClient({
    serviceUrl: 'http://192.168.2.220/TcAdsWebService/TcAdsWebService.dll',
    amsNetId: '192.168.2.220.1.1',
    amsPort: '801',     //default
    dataAlign4: true,  //default, set it to "true" if you have an ARM based PLC device (i.e. CX90xx)
    language: 'ge'       //default, set it to "en" for english names of days and months
});

 
var structdef_raff_config_zeitsteuerung ={  
  	Morgens_Hell		:'ARRAY.8.BOOL',
	Abends_Hell			:'ARRAY.8.BOOL',
	Morgens_Zeit		:'ARRAY.8.BOOL',
	Abends_Zeit			:'ARRAY.8.BOOL',
	Morgens_Zeitwert	:'ARRAY.8.TOD.#hh#:#mm#',
	Abends_Zeitwert		:'ARRAY.8.TOD.#hh#:#mm#'
};	

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
	
function INIT()
{
	

    Plc.sumReadReq({
    	id:1,
    	items: [{	  
            	name: '.arrRaffstore_Config_Zeitsteuerung',
				jvar: 'PLC_VAR.ArrRaffConfigZeit',
				def: structdef_raff_config_zeitsteuerung,
		}],
		  oc: function() {
		  	for (var k = 1; k < 13; k++) {
		  		for (var j = 1; j < 8; j++) {	  		 
			  		 $('#mo_hell_' +j +'_' +k).prop( "checked", PLC_VAR.ArrRaffConfigZeit[k].Morgens_Hell[j] );
			  		 $('#ab_hell_' +j +'_' +k).prop( "checked", PLC_VAR.ArrRaffConfigZeit[k].Abends_Hell[j] );
			  		 $('#mo_uhr_' +j +'_' +k).prop( "checked", PLC_VAR.ArrRaffConfigZeit[k].Morgens_Zeit[j] );
			  		 document.all('mo_uhrzeit_' +j +'_' +k).value = PLC_VAR.ArrRaffConfigZeit[k].Morgens_Zeitwert[j] ;
			  		 $('#ab_uhr_' +j +'_' +k).prop( "checked", PLC_VAR.ArrRaffConfigZeit[k].Abends_Zeit[j] );
			  		 document.all('ab_uhrzeit_' +j +'_' +k).value = PLC_VAR.ArrRaffConfigZeit[k].Abends_Zeitwert[j] ;
			  	};
			  };
		  }
       
	});


save_array_raff2.onclick = function(){
	document.all("status_raff2").value = "Start Funktion Speichern des Raffstore-Arrays ";
	for (var k = 1; k < 13; k++) 
	{
		for (var j = 1; j < 8; j++) {
			if ($('#mo_hell_' +j +'_' +k).prop( "checked") == true)
			{
				PLC_VAR.ArrRaffConfigZeit[k].Morgens_Hell[j]  = true;
			}
			else
			{
				PLC_VAR.ArrRaffConfigZeit[k].Morgens_Hell[j]  = false;
			};
			if ($('#ab_hell_' +j +'_' +k).prop( "checked") == true)
			{
				PLC_VAR.ArrRaffConfigZeit[k].Abends_Hell[j]  = true;
			}
			else
			{
				PLC_VAR.ArrRaffConfigZeit[k].Abends_Hell[j]  = false;
			};
			if ($('#mo_uhr_' +j +'_' +k).prop( "checked") == true)
			{
				PLC_VAR.ArrRaffConfigZeit[k].Morgens_Zeit[j]  = true;
			}
			else
			{
				PLC_VAR.ArrRaffConfigZeit[k].Morgens_Zeit[j]  = false;
			};
			if ($('#ab_uhr_' +j +'_' +k).prop( "checked") == true)
			{
				PLC_VAR.ArrRaffConfigZeit[k].Abends_Zeit[j]  = true;
			}
			else
			{
				PLC_VAR.ArrRaffConfigZeit[k].Abends_Zeit[j]  = false;
			};
			PLC_VAR.ArrRaffConfigZeit[k].Morgens_Zeitwert[j] = document.all('mo_uhrzeit_' +j +'_' +k).value;
			PLC_VAR.ArrRaffConfigZeit[k].Abends_Zeitwert[j]	= document.all('ab_uhrzeit_' +j +'_' +k).value;		
		};
	};
	
	
	Plc.sumWriteReq({
            items: [{
				name: '.arrRaffstore_Config_Zeitsteuerung',
				val: PLC_VAR.ArrRaffConfigZeit,
				def: structdef_raff_config_zeitsteuerung,
			}],
			oc: function(){
				document.all("status_raff2").value = "Speichern des Raffstore-Arrays Index feddich";
			},
		});
};

	
loop()

};


function loop()
{

  		
	Plc.sumReadReq({
            //id: 2,        //If an ID is given, the script waits for the end of the request before firing a new one.
            items: [
                {
                	name: '.dtSystemTime',
                    type: "DT.#WEEKDAY#, #DD#.#MM#.#YYYY#  - #hh#:#mm#:#ss#",
                    jvar: 'plc_SystemTime'
                }],
        	});

	document.getElementById("systemtime").firstChild.data = plc_SystemTime;
window.setTimeout('loop()', 100);

};	

 	
function fktReadArrRaffZeitsteuerung (iIndex){

    Plc.sumReadReq({
    	id:1,
    	items: [{	  
            	name: '.arrRaffstore_Config_Zeitsteuerung',
				jvar: 'PLC_VAR.ArrRaffConfigZeit',
				def: structdef_raff_config_zeitsteuerung,
		}],
		  oc: function() {
		  	for (var k = 1; k < 13; k++) {
		  		for (var j = 1; j < 8; j++) {	  		 
			  		 $('#mo_hell_' +j +'_' +k).prop( "checked", PLC_VAR.ArrRaffConfigZeit[k].Morgens_Hell[j] );
			  		 $('#ab_hell_' +j +'_' +k).prop( "checked", PLC_VAR.ArrRaffConfigZeit[k].Abends_Hell[j] );
			  		 $('#mo_uhr_' +j +'_' +k).prop( "checked", PLC_VAR.ArrRaffConfigZeit[k].Morgens_Zeit[j] );
			  		 document.all('mo_uhrzeit_' +j +'_' +k).value = PLC_VAR.ArrRaffConfigZeit[k].Morgens_Zeitwert[j] ;
			  		 $('#ab_uhr_' +j +'_' +k).prop( "checked", PLC_VAR.ArrRaffConfigZeit[k].Abends_Zeit[j] );
			  		 document.all('ab_uhrzeit_' +j +'_' +k).value = PLC_VAR.ArrRaffConfigZeit[k].Abends_Zeitwert[j] ;
			  	};
			  };
		  }
       
	});

};
