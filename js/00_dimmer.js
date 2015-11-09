   
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


var structdef_dimm_config ={
	arrDIM_ID			: 'ARRAY.17.INT',	
	arrDIM_TOGGLE		: 'ARRAY.17.INT',	
	arrDIM_FKT			: 'ARRAY.17.INT',	
	arrDIM_ON			: 'ARRAY.17.INT',	
	arrDIM_OFF			: 'ARRAY.17.INT',	
	arrDIM_STARTWERT	: 'ARRAY.17.INT'	
};	
    

var		plc_SystemTime,
//		bPLC_Write,
//		hilf,
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
	fktReadArrDimm(glbIndex);
	

save_array_dimm.onclick = function(){
	document.all("status_dimm").value = "Start Funktion Speichern des Dimmer-Arrays Index " +glbIndex;
	for (var e = 1; e < 17; e++) {
		var hilf = 100 + e;
		PLC_VAR.ArrDIMM[glbIndex].arrDIM_ID[e] = 		document.all("select_dimm_" + hilf + 1).value;	
		PLC_VAR.ArrDIMM[glbIndex].arrDIM_TOGGLE[e] = 	document.all("select_dimm_" + hilf + 2).value;	
		PLC_VAR.ArrDIMM[glbIndex].arrDIM_FKT[e] = 		document.all("select_dimm_" + hilf + 3).value;	
		PLC_VAR.ArrDIMM[glbIndex].arrDIM_ON[e] = 		document.all("select_dimm_" + hilf + 4).value;	
		PLC_VAR.ArrDIMM[glbIndex].arrDIM_OFF[e] = 		document.all("select_dimm_" + hilf + 5).value;	
		PLC_VAR.ArrDIMM[glbIndex].arrDIM_STARTWERT[e] = document.all("input_dimm_" + hilf + 6).value;	
	};
	Plc.sumWriteReq({
            items: [{
				name: '.arrDIM_Config',
				val: PLC_VAR.ArrDIMM,
				def: structdef_dimm_config,
			}],
			oc: function(){
				document.all("status_dimm").value = "Speichern des Dimmer-Arrays Index " +glbIndex+ " feddich";
			},
		});
};



back_btn.onclick = function(){
	document.all("status_dimm").value = "gesperrt ";
	for (var k = 1; k < 17; k++) {
		var hilf = 100 + k;
		document.all("select_dimm_" + hilf + 1).value = 0;
			$('#select_dimm_' + hilf + 1).selectmenu('disable');
			$('#select_dimm_' + hilf + 1).selectmenu('refresh');
		document.all("select_dimm_" + hilf + 2).value = 0;	
			$('#select_dimm_' + hilf + 2).selectmenu('disable');
			$('#select_dimm_' + hilf + 2).selectmenu('refresh');
		document.all("select_dimm_" + hilf + 3).value = 0;	
			$('#select_dimm_' + hilf + 3).selectmenu('disable');
			$('#select_dimm_' + hilf + 3).selectmenu('refresh');
		document.all("select_dimm_" + hilf + 4).value = 0;	
			$('#select_dimm_' + hilf + 4).selectmenu('disable');
			$('#select_dimm_' + hilf + 4).selectmenu('refresh');
		document.all("select_dimm_" + hilf + 5).value = 0;	
			$('#select_dimm_' + hilf + 5).selectmenu('disable');
			$('#select_dimm_' + hilf + 5).selectmenu('refresh');
		document.all("input_dimm_" + hilf + 6).value = 0;	
			$('#input_dimm_' + hilf + 6).textinput('disable');
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



function fktReadArrDimm (iIndex){
	glbIndex = iIndex;
	document.all("status_dimm").value = "Start Funktion Array einlesen " +glbIndex;
    Plc.sumReadReq({
    	items: [{
			name: '.arrDim_Config',
			jvar: 'PLC_VAR.ArrDIMM',
			def: structdef_dimm_config,
		}],
        oc: function() {
			for (var k = 1; k < 17; k++) {
				hilf = 100 + k;
				document.all("select_dimm_" + hilf + 1).value = PLC_VAR.ArrDIMM[iIndex].arrDIM_ID[k];
					$('#select_dimm_' + hilf + 1).selectmenu('enable');
					$('#select_dimm_' + hilf + 1).selectmenu('refresh');
				document.all("select_dimm_" + hilf + 2).value = PLC_VAR.ArrDIMM[iIndex].arrDIM_TOGGLE[k];	
					$('#select_dimm_' + hilf + 2).selectmenu('enable');
					$('#select_dimm_' + hilf + 2).selectmenu('refresh');
				document.all("select_dimm_" + hilf + 3).value = PLC_VAR.ArrDIMM[iIndex].arrDIM_FKT[k];	
					$('#select_dimm_' + hilf + 3).selectmenu('enable');
					$('#select_dimm_' + hilf + 3).selectmenu('refresh');
				document.all("select_dimm_" + hilf + 4).value = PLC_VAR.ArrDIMM[iIndex].arrDIM_ON[k];	
					$('#select_dimm_' + hilf + 4).selectmenu('enable');
					$('#select_dimm_' + hilf + 4).selectmenu('refresh');
				document.all("select_dimm_" + hilf + 5).value = PLC_VAR.ArrDIMM[iIndex].arrDIM_OFF[k];	
					$('#select_dimm_' + hilf + 5).selectmenu('enable');
					$('#select_dimm_' + hilf + 5).selectmenu('refresh');
				document.all("input_dimm_" + hilf + 6).value = PLC_VAR.ArrDIMM[iIndex].arrDIM_STARTWERT[k];	
					$('#input_dimm_' + hilf + 6).textinput('enable');
				};
			$('#read_array_dimm').prop('disabled',false);
			$('#save_array_dimm').prop('disabled',false);
			document.all("status_dimm").value = "Einlesen des Dimmer-Arrays Index " +iIndex+ " feddich";
            },
	});
};

 
