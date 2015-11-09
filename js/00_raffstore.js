   
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

var structdef_raff_config ={
	arrLT_ID			: 'ARRAY.9.INT',	
	arrLT_S				: 'ARRAY.9.INT'	
};	

var 	plc_SystemTime,
		glbIndex;


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

function URLWert (querystring) {
  if (querystring == '') return;
  	var wertestring = querystring.slice(1);
 	glbIndex = parseInt(wertestring);
 
 }

	
function INIT()
{
 	new URLWert(location.search);
	fktReadArrRaff(glbIndex);
	 
	
save_array_raff1.onclick = function(){
	document.all("status_raff1").value = "Start Funktion Speichern des Raffstore-Arrays Index " +glbIndex;
	for (var e = 1; e < 9; e++) {
		hilf = 100 + e; 
		document.all("status_raff1").value = hilf;
		PLC_VAR.ArrRaffConfig[glbIndex].arrLT_ID[e] = 		document.all("select_raff_" + hilf + 1).value;	
		PLC_VAR.ArrRaffConfig[glbIndex].arrLT_S[e] = 			document.all("select_raff_" + hilf + 2).value;	
	};
	Plc.sumWriteReq({
            items: [{
				name: '.arrRaffstore_Config',
				val: PLC_VAR.ArrRaffConfig,
				def: structdef_raff_config,
			}],
			oc: function(){
				document.all("status_raff1").value = "Speichern des Raffstore-Arrays Index " +glbIndex+ " feddich";
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

 	
function fktReadArrRaff (iIndex){
	glbIndex = iIndex;
	document.all("status_raff1").value = "Start Funktion Array einlesen " +iIndex;
	document.getElementById("showIndex41").firstChild.data = iIndex; 
    Plc.sumReadReq({
    	items: [{
			name: '.arrRaffstore_Config',
			jvar: 'PLC_VAR.ArrRaffConfig',
			def: structdef_raff_config,
		}],
        oc: function() {
			for (var k = 1; k < 9; k++) {
				hilf = 100 + k;
				document.all("select_raff_" + hilf + 1).value = PLC_VAR.ArrRaffConfig[iIndex].arrLT_ID[k];			
					$('#select_raff_' + hilf + 1).selectmenu('enable');
					$('#select_raff_' + hilf + 1).selectmenu('refresh');
				document.all("select_raff_" + hilf + 2).value = PLC_VAR.ArrRaffConfig[iIndex].arrLT_S[k];	
					$('#select_raff_' + hilf + 2).selectmenu('enable');
					$('#select_raff_' + hilf + 2).selectmenu('refresh');
				};
			$('#save_array_raff1').prop('disabled',false);
			$('#read_array_raff1').prop('disabled',false);
			document.all("status_raff1").value = "Einlesen des Raffstore-Arrays Index " +iIndex+ " feddich";
            },
	});
};
 	
