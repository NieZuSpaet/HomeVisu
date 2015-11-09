   
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


var structdef_ss_config ={
	arrSS_ID_ON				: 'ARRAY.17.INT',	
	arrSS_FKT_ON			: 'ARRAY.17.INT',	
	arrSS_ID_OFF			: 'ARRAY.17.INT',	
	arrSS_FKT_OFF			: 'ARRAY.17.INT',	
	arrSS_ID_TOGGLE	    	: 'ARRAY.17.INT',	
	arrSS_FKT_TOGGLE	    : 'ARRAY.17.INT'	
};	


var 	plc_SystemTime,
		bPLC_Write,
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
	fktReadArrSS(glbIndex);

save_array_ss.onclick = function(){
	document.all("status_ss").value = "Start Funktion Speichern des Steckdosen-Arrays Index " +glbIndex;
	for (var e = 1; e < 17; e++) {
		hilf = 100 + e; 
		document.all("status_ss").value = hilf;
		PLC_VAR.ArrSS[glbIndex].arrSS_ID_ON[e] = 		document.all("select_ss_" + hilf + 1).value;	
		PLC_VAR.ArrSS[glbIndex].arrSS_FKT_ON[e] = 		document.all("select_ss_" + hilf + 2).value;	
		PLC_VAR.ArrSS[glbIndex].arrSS_ID_OFF[e] = 		document.all("select_ss_" + hilf + 3).value;	
		PLC_VAR.ArrSS[glbIndex].arrSS_FKT_OFF[e] = 		document.all("select_ss_" + hilf + 4).value;	
		PLC_VAR.ArrSS[glbIndex].arrSS_ID_TOGGLE[e] = 	document.all("select_ss_" + hilf + 5).value;	
		PLC_VAR.ArrSS[glbIndex].arrSS_FKT_TOGGLE[e] = 	document.all("select_ss_" + hilf + 6).value;	
	};
	Plc.sumWriteReq({
            items: [{
				name: '.arrSS_Config',
				val: PLC_VAR.ArrSS,
				def: structdef_ss_config,
			}],
			oc: function(){
				document.all("status_ss").value = "Speichern des Steckdosen-Arrays Index " +glbIndex+ " feddich";
/*				Plc.sumWriteReq({
					items: [{
								name: "prgKonfiguration.bUpdate_SS_Config",
								val: true
							}],
				});
*/			},
		});
};


back_btn.onclick = function(){
	document.all("status_ss").value = "gesperrt ";
	for (var k = 1; k < 17; k++) {
		var hilf = 100 + k;
		document.all("select_ss_" + hilf + 1).value = 0;
			$('#select_ss_' + hilf + 1).selectmenu('disable');
			$('#select_ss_' + hilf + 1).selectmenu('refresh');
		document.all("select_ss_" + hilf + 2).value = 0;	
			$('#select_ss_' + hilf + 2).selectmenu('disable');
			$('#select_ss_' + hilf + 2).selectmenu('refresh');
		document.all("select_ss_" + hilf + 3).value = 0;	
			$('#select_ss_' + hilf + 3).selectmenu('disable');
			$('#select_ss_' + hilf + 3).selectmenu('refresh');
		document.all("select_ss_" + hilf + 4).value = 0;	
			$('#select_ss_' + hilf + 4).selectmenu('disable');
			$('#select_ss_' + hilf + 4).selectmenu('refresh');
		document.all("select_ss_" + hilf + 5).value = 0;	
			$('#select_ss_' + hilf + 5).selectmenu('disable');
			$('#select_ss_' + hilf + 5).selectmenu('refresh');
		document.all("select_ss_" + hilf + 6).value = 0;	
			$('#select_ss_' + hilf + 6).selectmenu('disable');
			$('#select_ss_' + hilf + 6).selectmenu('refresh');
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


function fktReadArrSS (iIndex){
	glbIndex = iIndex;
	document.all("status_ss").value = "Start Funktion Array einlesen " +iIndex;
	document.getElementById("showIndex11").firstChild.data = iIndex; 
	document.getElementById("showIndex12").firstChild.data = iIndex; 
	document.getElementById("showIndex13").firstChild.data = iIndex; 
	document.getElementById("showIndex14").firstChild.data = iIndex; 
    Plc.sumReadReq({
    	items: [{
			name: '.arrSS_Config',
			jvar: 'PLC_VAR.ArrSS',
			def: structdef_ss_config,
		}],
        oc: function() {
			for (var k = 1; k < 17; k++) {
				hilf = 100 + k;
				document.all("select_ss_" + hilf + 1).value = PLC_VAR.ArrSS[iIndex].arrSS_ID_ON[k];
					
					$('#select_ss_' + hilf + 1).selectmenu('enable');
					$('#select_ss_' + hilf + 1).selectmenu('refresh');
				document.all("select_ss_" + hilf + 2).value = PLC_VAR.ArrSS[iIndex].arrSS_FKT_ON[k];	
					$('#select_ss_' + hilf + 2).selectmenu('enable');
					$('#select_ss_' + hilf + 2).selectmenu('refresh');
				document.all("select_ss_" + hilf + 3).value = PLC_VAR.ArrSS[iIndex].arrSS_ID_OFF[k];	
					$('#select_ss_' + hilf + 3).selectmenu('enable');
					$('#select_ss_' + hilf + 3).selectmenu('refresh');
				document.all("select_ss_" + hilf + 4).value = PLC_VAR.ArrSS[iIndex].arrSS_FKT_OFF[k];	
					$('#select_ss_' + hilf + 4).selectmenu('enable');
					$('#select_ss_' + hilf + 4).selectmenu('refresh');
				document.all("select_ss_" + hilf + 5).value = PLC_VAR.ArrSS[iIndex].arrSS_ID_TOGGLE[k];	
					$('#select_ss_' + hilf + 5).selectmenu('enable');
					$('#select_ss_' + hilf + 5).selectmenu('refresh');
				document.all("select_ss_" + hilf + 6).value = PLC_VAR.ArrSS[iIndex].arrSS_FKT_TOGGLE[k];	
					$('#select_ss_' + hilf + 6).selectmenu('enable');
					$('#select_ss_' + hilf + 6).selectmenu('refresh');
				};
			$('#save_array_ss').prop('disabled',false);
			$('#read_array_ss').prop('disabled',false);
			document.all("status_ss").value = "Einlesen des Steckdosen-Arrays Index " +iIndex+ " feddich";
            },
	});
};
