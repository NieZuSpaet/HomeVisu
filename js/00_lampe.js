   
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
 

var structdef_lampe_config ={
	arrLampe_ID_ON			: 'ARRAY.17.INT',	
	arrLampe_FKT_ON			: 'ARRAY.17.INT',	
	arrLampe_ID_OFF			: 'ARRAY.17.INT',	
	arrLampe_FKT_OFF		: 'ARRAY.17.INT',	
	arrLampe_ID_TOGGLE	    : 'ARRAY.17.INT',	
	arrLampe_FKT_TOGGLE	    : 'ARRAY.17.INT'	
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
	fktReadArrLampe(glbIndex);
	 
	
save_array_lampe.onclick = function(){
	document.all("status_lampe").value = "Start Funktion Speichern des Lampen-Arrays Index " +glbIndex;
	for (var e = 1; e < 17; e++) {
		hilf = 100 + e; 
		document.all("status_lampe").value = hilf;
		PLC_VAR.ArrLampe[glbIndex].arrLampe_ID_ON[e] = 			document.all("select_lampe_" + hilf + 1).value;	
		PLC_VAR.ArrLampe[glbIndex].arrLampe_FKT_ON[e] = 		document.all("select_lampe_" + hilf + 2).value;	
		PLC_VAR.ArrLampe[glbIndex].arrLampe_ID_OFF[e] = 		document.all("select_lampe_" + hilf + 3).value;	
		PLC_VAR.ArrLampe[glbIndex].arrLampe_FKT_OFF[e] = 		document.all("select_lampe_" + hilf + 4).value;	
		PLC_VAR.ArrLampe[glbIndex].arrLampe_ID_TOGGLE[e] = 		document.all("select_lampe_" + hilf + 5).value;	
		PLC_VAR.ArrLampe[glbIndex].arrLampe_FKT_TOGGLE[e] = 	document.all("select_lampe_" + hilf + 6).value;	
	};
	Plc.sumWriteReq({
            items: [{
				name: '.arrLampe_Config',
				val: PLC_VAR.ArrLampe,
				def: structdef_lampe_config,
			}],
			oc: function(){
				document.all("status_lampe").value = "Speichern des Lampen-Arrays Index " +glbIndex+ " feddich";
			},
			
		});
};



back_btn.onclick = function(){
	document.all("status_lampe").value = "gesperrt ";
	for (var k = 1; k < 17; k++) {
		var hilf = 100 + k;
		document.all("select_lampe_" + hilf + 1).value = 0;
			$('#select_lampe_' + hilf + 1).selectmenu('disable');
			$('#select_lampe_' + hilf + 1).selectmenu('refresh');
		document.all("select_lampe_" + hilf + 2).value = 0;	
			$('#select_lampe_' + hilf + 2).selectmenu('disable');
			$('#select_lampe_' + hilf + 2).selectmenu('refresh');
		document.all("select_lampe_" + hilf + 3).value = 0;	
			$('#select_lampe_' + hilf + 3).selectmenu('disable');
			$('#select_lampe_' + hilf + 3).selectmenu('refresh');
		document.all("select_lampe_" + hilf + 4).value = 0;	
			$('#select_lampe_' + hilf + 4).selectmenu('disable');
			$('#select_lampe_' + hilf + 4).selectmenu('refresh');
		document.all("select_lampe_" + hilf + 5).value = 0;	
			$('#select_lampe_' + hilf + 5).selectmenu('disable');
			$('#select_lampe_' + hilf + 5).selectmenu('refresh');
		document.all("select_lampe_" + hilf + 6).value = 0;	
			$('#select_lampe_' + hilf + 6).selectmenu('disable');
			$('#select_lampe_' + hilf + 6).selectmenu('refresh');
		};
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


function fktReadArrLampe (iIndex){
	glbIndex = iIndex;
	document.all("status_lampe").value = "Start Funktion Array einlesen " +iIndex;
	document.getElementById("showIndex31").firstChild.data = iIndex; 
	document.getElementById("showIndex32").firstChild.data = iIndex; 
	document.getElementById("showIndex33").firstChild.data = iIndex; 
	document.getElementById("showIndex34").firstChild.data = iIndex; 
    Plc.sumReadReq({
    	items: [{
			name: '.arrLampe_Config',
			jvar: 'PLC_VAR.ArrLampe',
			def: structdef_lampe_config,
		}],
        oc: function() {
			for (var k = 1; k < 17; k++) {
				hilf = 100 + k;
				document.all("select_lampe_" + hilf + 1).value = PLC_VAR.ArrLampe[iIndex].arrLampe_ID_ON[k];
					
					$('#select_lampe_' + hilf + 1).selectmenu('enable');
					$('#select_lampe_' + hilf + 1).selectmenu('refresh');
				document.all("select_lampe_" + hilf + 2).value = PLC_VAR.ArrLampe[iIndex].arrLampe_FKT_ON[k];	
					$('#select_lampe_' + hilf + 2).selectmenu('enable');
					$('#select_lampe_' + hilf + 2).selectmenu('refresh');
				document.all("select_lampe_" + hilf + 3).value = PLC_VAR.ArrLampe[iIndex].arrLampe_ID_OFF[k];	
					$('#select_lampe_' + hilf + 3).selectmenu('enable');
					$('#select_lampe_' + hilf + 3).selectmenu('refresh');
				document.all("select_lampe_" + hilf + 4).value = PLC_VAR.ArrLampe[iIndex].arrLampe_FKT_OFF[k];	
					$('#select_lampe_' + hilf + 4).selectmenu('enable');
					$('#select_lampe_' + hilf + 4).selectmenu('refresh');
				document.all("select_lampe_" + hilf + 5).value = PLC_VAR.ArrLampe[iIndex].arrLampe_ID_TOGGLE[k];	
					$('#select_lampe_' + hilf + 5).selectmenu('enable');
					$('#select_lampe_' + hilf + 5).selectmenu('refresh');
				document.all("select_lampe_" + hilf + 6).value = PLC_VAR.ArrLampe[iIndex].arrLampe_FKT_TOGGLE[k];	
					$('#select_lampe_' + hilf + 6).selectmenu('enable');
					$('#select_lampe_' + hilf + 6).selectmenu('refresh');
				};
			$('#read_array_lampe').prop('disabled',false);
			$('#save_array_lampe').prop('disabled',false);
			document.all("status_lampe").value = "Einlesen des Lampen-Arrays Index " +iIndex+ " feddich";
            },
	});
};
