   
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

var structdef_dimm_config ={
	arrDIM_ID			: 'ARRAY.17.INT',	
	arrDIM_TOGGLE		: 'ARRAY.17.INT',	
	arrDIM_FKT			: 'ARRAY.17.INT',	
	arrDIM_ON			: 'ARRAY.17.INT',	
	arrDIM_OFF			: 'ARRAY.17.INT',	
	arrDIM_STARTWERT	: 'ARRAY.17.INT'	
};	
    

var structdef_lampe_config ={
	arrLampe_ID_ON			: 'ARRAY.17.INT',	
	arrLampe_FKT_ON			: 'ARRAY.17.INT',	
	arrLampe_ID_OFF			: 'ARRAY.17.INT',	
	arrLampe_FKT_OFF		: 'ARRAY.17.INT',	
	arrLampe_ID_TOGGLE	    : 'ARRAY.17.INT',	
	arrLampe_FKT_TOGGLE	    : 'ARRAY.17.INT'	
};	

var structdef_raff_config ={
	arrLT_ID			: 'ARRAY.9.INT',	
	arrLT_S				: 'ARRAY.9.INT'	
};	

 
var structdef_raff_config_zeitsteuerung ={  
  	Morgens_Hell		:'ARRAY.8.BOOL',
	Abends_Hell			:'ARRAY.8.BOOL',
	Morgens_Zeit		:'ARRAY.8.BOOL',
	Abends_Zeit			:'ARRAY.8.BOOL',
	Morgens_Zeitwert	:'ARRAY.8.TOD.#hh#:#mm#',
	Abends_Zeitwert		:'ARRAY.8.TOD.#hh#:#mm#'
};	


var structdef_lueftung ={
	bBetrieb			:'BOOL',
	bSommerbetrieb		:'BOOL',
	bStosslueftung		:'BOOL',
	bStandby			:'BOOL',
	nTempSchaltschwelle	:'INT',
	nTempHysterese		:'INT',
	nTempRaumMittel		:'INT',
	nTempAussenluft		:'INT',
	nTempAbluft			:'INT',
	nTempZuluft			:'INT',
	nTempFrischluft		:'INT',
	nTempFortluft		:'INT'
};

var structdef_konfiguration ={
	bUpdate_SS_Config			:'BOOL',
	bUpdate_Lampe_Config		:'BOOL',
	bUpdate_DIMM_Config			:'BOOL',
	bUpdate_Raffstore_Config	:'BOOL',
	bUpdate_Raffstore_Config_Zeit		:'BOOL',
	bUpdate_Wetterdaten			:'BOOL',
	bUpdate_Technik_XML			:'BOOL',
	bRead_SS_Config 			:'BOOL',
	bRead_Lampe_Config 			:'BOOL',
	bRead_Dimm_Config 			:'BOOL',
	bRead_Raffstore_Config		:'BOOL',
	bRead_Raffstore_Config_Zeit		:'BOOL',
	bRead_Wetterdaten			:'BOOL',
	bRead_Technik_XML			:'BOOL',
	bWriteXMLBusy				:'BOOL',
	bReadXMLBusy				:'BOOL',
	bWriteXMLError				:'BOOL',
	bReadXMLError				:'BOOL',
	nWriteXMLErrID				:'UDINT',
	nReadXMLErrID				:'UDINT',
	strStatus					:'STRING.30',
};


var 	success = 0,
		errors = 0,
		docrev =1,
		count=1,
 		plc_toggle,
 		plc_SystemTime,
		slider_wert = 12,
		bPLC_Write,
		hilf,
		glbIndex,
		test;


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
steckdose101.onclick = function(){ glbIndex = 1;	fktReadArrSS(glbIndex); }
steckdose102.onclick = function(){ glbIndex = 2;	fktReadArrSS(glbIndex); }	
steckdose103.onclick = function(){ glbIndex = 3;	fktReadArrSS(glbIndex);	}
steckdose104.onclick = function(){ glbIndex = 4;	fktReadArrSS(glbIndex);	}
steckdose105.onclick = function(){ glbIndex = 5;	fktReadArrSS(glbIndex);	}
steckdose106.onclick = function(){ glbIndex = 6;	fktReadArrSS(glbIndex);	}
steckdose107.onclick = function(){ glbIndex = 7;	fktReadArrSS(glbIndex);	}
steckdose108.onclick = function(){ glbIndex = 8;	fktReadArrSS(glbIndex);	}
steckdose109.onclick = function(){ glbIndex = 9;	fktReadArrSS(glbIndex);	}
steckdose110.onclick = function(){ glbIndex = 10;	fktReadArrSS(glbIndex);	}
steckdose111.onclick = function(){ glbIndex = 11;	fktReadArrSS(glbIndex); }
steckdose112.onclick = function(){ glbIndex = 12;	fktReadArrSS(glbIndex);	}
steckdose113.onclick = function(){ glbIndex = 13;	fktReadArrSS(glbIndex);	}
steckdose114.onclick = function(){ glbIndex = 14;	fktReadArrSS(glbIndex);	}
steckdose115.onclick = function(){ glbIndex = 15;	fktReadArrSS(glbIndex);	}
steckdose116.onclick = function(){ glbIndex = 16;	fktReadArrSS(glbIndex);	}
steckdose117.onclick = function(){ glbIndex = 17;	fktReadArrSS(glbIndex);	}
steckdose118.onclick = function(){ glbIndex = 18;	fktReadArrSS(glbIndex);	}
steckdose119.onclick = function(){ glbIndex = 19;	fktReadArrSS(glbIndex);	}
steckdose120.onclick = function(){ glbIndex = 20;	fktReadArrSS(glbIndex);	}	
steckdose121.onclick = function(){ glbIndex = 21;	fktReadArrSS(glbIndex); }
steckdose122.onclick = function(){ glbIndex = 22;	fktReadArrSS(glbIndex);	}
steckdose123.onclick = function(){ glbIndex = 23;	fktReadArrSS(glbIndex);	}
steckdose124.onclick = function(){ glbIndex = 24;	fktReadArrSS(glbIndex);	}
steckdose125.onclick = function(){ glbIndex = 25;	fktReadArrSS(glbIndex);	}
steckdose126.onclick = function(){ glbIndex = 26;	fktReadArrSS(glbIndex);	}
steckdose127.onclick = function(){ glbIndex = 27;	fktReadArrSS(glbIndex);	}
steckdose128.onclick = function(){ glbIndex = 28;	fktReadArrSS(glbIndex);	}
steckdose129.onclick = function(){ glbIndex = 29;	fktReadArrSS(glbIndex);	}
steckdose130.onclick = function(){ glbIndex = 30;	fktReadArrSS(glbIndex);	}
steckdose131.onclick = function(){ glbIndex = 31;	fktReadArrSS(glbIndex); }
steckdose132.onclick = function(){ glbIndex = 32;	fktReadArrSS(glbIndex);	}
steckdose133.onclick = function(){ glbIndex = 33;	fktReadArrSS(glbIndex);	}
steckdose134.onclick = function(){ glbIndex = 34;	fktReadArrSS(glbIndex);	}
steckdose135.onclick = function(){ glbIndex = 35;	fktReadArrSS(glbIndex);	};
steckdose136.onclick = function(){ glbIndex = 36;	fktReadArrSS(glbIndex);	};
steckdose137.onclick = function(){ glbIndex = 37;	fktReadArrSS(glbIndex);	};
steckdose138.onclick = function(){ glbIndex = 38;	fktReadArrSS(glbIndex);	};
steckdose139.onclick = function(){ glbIndex = 39;	fktReadArrSS(glbIndex);	};
steckdose140.onclick = function(){ glbIndex = 40;	fktReadArrSS(glbIndex);	};
steckdose141.onclick = function(){ glbIndex = 41;	fktReadArrSS(glbIndex);	};
steckdose142.onclick = function(){ glbIndex = 42;	fktReadArrSS(glbIndex);	};
steckdose143.onclick = function(){ glbIndex = 43;	fktReadArrSS(glbIndex);	};
steckdose144.onclick = function(){ glbIndex = 44;	fktReadArrSS(glbIndex);	};
steckdose145.onclick = function(){ glbIndex = 45;	fktReadArrSS(glbIndex);	};
steckdose146.onclick = function(){ glbIndex = 46;	fktReadArrSS(glbIndex);	};
steckdose147.onclick = function(){ glbIndex = 47;	fktReadArrSS(glbIndex);	};
steckdose148.onclick = function(){ glbIndex = 48;	fktReadArrSS(glbIndex);	};
steckdose149.onclick = function(){ glbIndex = 49;	fktReadArrSS(glbIndex);	};
steckdose150.onclick = function(){ glbIndex = 50;	fktReadArrSS(glbIndex);	};
steckdose151.onclick = function(){ glbIndex = 51;	fktReadArrSS(glbIndex);	};
steckdose152.onclick = function(){ glbIndex = 52;	fktReadArrSS(glbIndex);	};
steckdose153.onclick = function(){ glbIndex = 53;	fktReadArrSS(glbIndex);	};
steckdose154.onclick = function(){ glbIndex = 54;	fktReadArrSS(glbIndex);	};
steckdose155.onclick = function(){ glbIndex = 55;	fktReadArrSS(glbIndex);	};
steckdose156.onclick = function(){ glbIndex = 56;	fktReadArrSS(glbIndex);	};

dimmer101.onclick = function(){	glbIndex = 1;	fktReadArrDimm(glbIndex);	document.all("status_dimm").value = "Dimmer " +glbIndex;	};
dimmer102.onclick = function(){	glbIndex = 2;	fktReadArrDimm(glbIndex);	document.all("status_dimm").value = "Dimmer " +glbIndex;	};
dimmer103.onclick = function(){	glbIndex = 3;	fktReadArrDimm(glbIndex);	document.all("status_dimm").value = "Dimmer " +glbIndex;	};
dimmer104.onclick = function(){	glbIndex = 4;	fktReadArrDimm(glbIndex);	document.all("status_dimm").value = "Dimmer " +glbIndex;	};
dimmer105.onclick = function(){	glbIndex = 5;	fktReadArrDimm(glbIndex);	document.all("status_dimm").value = "Dimmer " +glbIndex;	};
dimmer106.onclick = function(){	glbIndex = 6;	fktReadArrDimm(glbIndex);	document.all("status_dimm").value = "Dimmer " +glbIndex;	};
dimmer107.onclick = function(){	glbIndex = 7;	fktReadArrDimm(glbIndex);	document.all("status_dimm").value = "Dimmer " +glbIndex;	};
dimmer108.onclick = function(){	glbIndex = 8;	fktReadArrDimm(glbIndex);	document.all("status_dimm").value = "Dimmer " +glbIndex;	};
dimmer109.onclick = function(){	glbIndex = 9;	fktReadArrDimm(glbIndex);	document.all("status_dimm").value = "Dimmer " +glbIndex;	};
dimmer110.onclick = function(){	glbIndex = 10;	fktReadArrDimm(glbIndex);	document.all("status_dimm").value = "Dimmer " +glbIndex;	};
dimmer111.onclick = function(){	glbIndex = 11;	fktReadArrDimm(glbIndex);	document.all("status_dimm").value = "Dimmer " +glbIndex;	};
dimmer112.onclick = function(){	glbIndex = 2;	fktReadArrDimm(glbIndex);	document.all("status_dimm").value = "Dimmer " +glbIndex;	};

lampe101.onclick = function(){	glbIndex = 1;	fktReadArrLampe(glbIndex);	document.all("status_lampe").value = "Lampe " +glbIndex;	};
lampe102.onclick = function(){	glbIndex = 2;	fktReadArrLampe(glbIndex);	document.all("status_lampe").value = "Lampe " +glbIndex;	};
lampe103.onclick = function(){	glbIndex = 3;	fktReadArrLampe(glbIndex);	document.all("status_lampe").value = "Lampe " +glbIndex;	};
lampe104.onclick = function(){	glbIndex = 4;	fktReadArrLampe(glbIndex);	document.all("status_lampe").value = "Lampe " +glbIndex;	};
lampe105.onclick = function(){	glbIndex = 5;	fktReadArrLampe(glbIndex);	document.all("status_lampe").value = "Lampe " +glbIndex;	};
lampe406.onclick = function(){	glbIndex = 6;	fktReadArrLampe(glbIndex);	document.all("status_lampe").value = "Lampe " +glbIndex;	};
lampe407.onclick = function(){	glbIndex = 7;	fktReadArrLampe(glbIndex);	document.all("status_lampe").value = "Lampe " +glbIndex;	};
lampe408.onclick = function(){	glbIndex = 8;	fktReadArrLampe(glbIndex);	document.all("status_lampe").value = "Lampe " +glbIndex;	};

raffstore101.onclick = function(){glbIndex = 1; fktReadArrRaff(glbIndex);   document.all("status_raff1").value = "Raffstore " +glbIndex;    };
raffstore102.onclick = function(){glbIndex = 2; fktReadArrRaff(glbIndex);   document.all("status_raff1").value = "Raffstore " +glbIndex;    };
raffstore103.onclick = function(){glbIndex = 3; fktReadArrRaff(glbIndex);   document.all("status_raff1").value = "Raffstore " +glbIndex;    };
raffstore104.onclick = function(){glbIndex = 4; fktReadArrRaff(glbIndex);   document.all("status_raff1").value = "Raffstore " +glbIndex;    };
raffstore105.onclick = function(){glbIndex = 5; fktReadArrRaff(glbIndex);   document.all("status_raff1").value = "Raffstore " +glbIndex;    };
raffstore106.onclick = function(){glbIndex = 6; fktReadArrRaff(glbIndex);   document.all("status_raff1").value = "Raffstore " +glbIndex;    };
raffstore107.onclick = function(){glbIndex = 7; fktReadArrRaff(glbIndex);   document.all("status_raff1").value = "Raffstore " +glbIndex;    };
raffstore108.onclick = function(){glbIndex = 8; fktReadArrRaff(glbIndex);   document.all("status_raff1").value = "Raffstore " +glbIndex;    };
raffstore109.onclick = function(){glbIndex = 9; fktReadArrRaff(glbIndex);   document.all("status_raff1").value = "Raffstore " +glbIndex;    };
raffstore110.onclick = function(){glbIndex = 10; fktReadArrRaff(glbIndex);   document.all("status_raff1").value = "Raffstore " +glbIndex;    };
raffstore111.onclick = function(){glbIndex = 11; fktReadArrRaff(glbIndex);   document.all("status_raff1").value = "Raffstore " +glbIndex;    };
raffstore112.onclick = function(){glbIndex = 12; fktReadArrRaff(glbIndex);   document.all("status_raff1").value = "Raffstore " +glbIndex;    };


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

/*
read_array_ss.onclick = function(){
	$.mobile.loading( "show", {
	    text: 'loading...',
	    textVisible: true,
	    theme: 'a',
	    textonly: false,
	    html: "<span class='my_loader'><img src='images/my_loader.gif'><p>is loading for you ...</p></span> "
    });
	document.all("status_ss").value = "Start Funktion Lesen des Steckdosen-Arrays Index " +glbIndex;
	
	$('#save_array_ss').prop('disabled',true);
	$('#read_array_ss').prop('disabled',true);

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
		
	Plc.sumWriteReq({
            items: [{
					name: "prgKonfiguration.bRead_SS_Config",
					val: true
				}],
				oc: function() {
					document.all("status_ss").value = "30sec. Timeout abwarten..."; 
					setTimeout(function() { fktReadArrSS(glbIndex);$.mobile.loading( "hide", {}); },30000);
				},
		});
};


read_array_dimm.onclick = function(){
   $.mobile.loading( "show", {
            text: 'loading...',
            textVisible: true,
            theme: 'a',
            textonly: false,
            html: "<span class='my_loader'><img src='images/my_loader.gif'><p>is loading for you ...</p></span> "
    });
	
	document.all("status_dimm").value = "Start Funktion Lesen des Dimmer-Arrays Index " +glbIndex;
	
	$('#save_array_dimm').prop('disabled',true);
	$('#read_array_dimm').prop('disabled',true);

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
	

		
	Plc.sumWriteReq({
            items: [{
					name: "prgKonfiguration.bRead_Dimm_Config",
					val: true
				}],
				oc: function() {
					document.all("status_dimm").value = "30sec. Timeout abwarten..."; 
					setTimeout(function() { fktReadArrDimm(glbIndex);$.mobile.loading( "hide", {}); },30000);
				},
		});
};

read_array_lampe.onclick = function(){
	$.mobile.loading( "show", {
	    text: 'loading...',
	    textVisible: true,
	    theme: 'a',
	    textonly: false,
	    html: "<span class='my_loader'><img src='images/my_loader.gif'><p>is loading for you ...</p></span> "
    });
	document.all("status_lampe").value = "Start Funktion Lesen des Lampen-Arrays Index " +glbIndex;
	
	$('#save_array_lampe').prop('disabled',true);
	$('#read_array_lampe').prop('disabled',true);

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
		
	Plc.sumWriteReq({
            items: [{
					name: "prgKonfiguration.bRead_Lampe_Config",
					val: true
				}],
				oc: function() {
					document.all("status_lampe").value = "30sec. Timeout abwarten..."; 
					setTimeout(function() { fktReadArrLampe(glbIndex);$.mobile.loading( "hide", {}); },30000);
				},
		});
};
	
*/	

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
/*				Plc.sumWriteReq({
					items: [{
								name: "prgKonfiguration.bUpdate_DIMM_Config",
								val: true
							}],
				});
*/			},
		});
};


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
/*				Plc.sumWriteReq({
					items: [{
								name: "prgKonfiguration.bUpdate_SS_Config",
								val: true
							}],
				});
*/			},
		});
};



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
/*				Plc.sumWriteReq({
					items: [{
								name: "prgKonfiguration.bUpdate_Raffstore_Visu",
								val: true
							}],
				});
*/			},
		});
};

/*
 * 
    Plc.sumReadReq({
    	id:1,
    	items: [{	  
            	name: '.arrRaffstore_Visu',
				jvar: 'PLC_VAR.ArrRaffVisu',
				def: structdef_ArrRaffVisu,
		}],
		  oc: function() {
		  	for (var k = 1; k < 13; k++) {
		  		for (var j = 1; j < 8; j++) {	  		 
			  		 $('#mo_hell_' +j +'_' +k).prop( "checked", PLC_VAR.ArrRaffVisu[k].Morgens_Hell[j] );
			  		 $('#ab_hell_' +j +'_' +k).prop( "checked", PLC_VAR.ArrRaffVisu[k].Abends_Hell[j] );
			  		 $('#mo_uhr_' +j +'_' +k).prop( "checked", PLC_VAR.ArrRaffVisu[k].Morgens_Zeit[j] );
			  		 document.all('mo_uhrzeit_' +j +'_' +k).value = PLC_VAR.ArrRaffVisu[k].Morgens_Zeitwert[j] ;
			  		 $('#ab_uhr_' +j +'_' +k).prop( "checked", PLC_VAR.ArrRaffVisu[k].Abends_Zeit[j] );
			  		 document.all('ab_uhrzeit_' +j +'_' +k).value = PLC_VAR.ArrRaffVisu[k].Abends_Zeitwert[j] ;
			  	};
			  };
		  }
       
	});


 */

lesen_ss.onclick = function(){
	PLC_VAR.stKonfiguration.bRead_SS_Config = true;
	Plc.writeStruct({
       			name: 'prgKonfiguration.stData',
				val: PLC_VAR.stKonfiguration,
				def: structdef_konfiguration
				});
};

schreiben_ss.onclick = function(){
	PLC_VAR.stKonfiguration.bUpdate_SS_Config = true;
	Plc.writeStruct({
       			name: 'prgKonfiguration.stData',
				val: PLC_VAR.stKonfiguration,
				def: structdef_konfiguration
				});
};	

lesen_dim.onclick = function(){
	PLC_VAR.stKonfiguration.bRead_Dimm_Config = true;
	Plc.writeStruct({
       			name: 'prgKonfiguration.stData',
				val: PLC_VAR.stKonfiguration,
				def: structdef_konfiguration
				});
};

schreiben_dim.onclick = function(){
	PLC_VAR.stKonfiguration.bUpdate_DIMM_Config = true;
	Plc.writeStruct({
       			name: 'prgKonfiguration.stData',
				val: PLC_VAR.stKonfiguration,
				def: structdef_konfiguration
				});
};

lesen_lampe.onclick = function(){
	PLC_VAR.stKonfiguration.bRead_Lampe_Config = true;
	Plc.writeStruct({
       			name: 'prgKonfiguration.stData',
				val: PLC_VAR.stKonfiguration,
				def: structdef_konfiguration
				});
};

schreiben_lampe.onclick = function(){
	PLC_VAR.stKonfiguration.bUpdate_Lampe_Config = true;
	Plc.writeStruct({
       			name: 'prgKonfiguration.stData',
				val: PLC_VAR.stKonfiguration,
				def: structdef_konfiguration
				});
};	

lesen_raff.onclick = function(){
	PLC_VAR.stKonfiguration.bRead_Raffstore_Config = true;
	Plc.writeStruct({
       			name: 'prgKonfiguration.stData',
				val: PLC_VAR.stKonfiguration,
				def: structdef_konfiguration
				});
};

schreiben_raff.onclick = function(){
	PLC_VAR.stKonfiguration.bUpdate_Raffstore_Config = true;
	Plc.writeStruct({
       			name: 'prgKonfiguration.stData',
				val: PLC_VAR.stKonfiguration,
				def: structdef_konfiguration
				});
};	

lesen_raff_visu.onclick = function(){
	PLC_VAR.stKonfiguration.bRead_Raffstore_Config_Zeit = true;
	Plc.writeStruct({
       			name: 'prgKonfiguration.stData',
				val: PLC_VAR.stKonfiguration,
				def: structdef_konfiguration
				});
};

schreiben_raff_visu.onclick = function(){
	PLC_VAR.stKonfiguration.bUpdate_Raffstore_Config_Zeit = true;
	Plc.writeStruct({
       			name: 'prgKonfiguration.stData',
				val: PLC_VAR.stKonfiguration,
				def: structdef_konfiguration
				});
};	
				
lesen_wetterdaten.onclick = function(){
	PLC_VAR.stKonfiguration.bRead_Wetterdaten = true;
	Plc.writeStruct({
       			name: 'prgKonfiguration.stData',
				val: PLC_VAR.stKonfiguration,
				def: structdef_konfiguration
				});

};

schreiben_wetterdaten.onclick = function(){
	PLC_VAR.stKonfiguration.bUpdate_Wetterdaten = true;
	Plc.writeStruct({
       			name: 'prgKonfiguration.stData',
				val: PLC_VAR.stKonfiguration,
				def: structdef_konfiguration
				});
};				
				
				
			
lesen_technik.onclick = function(){
	PLC_VAR.stKonfiguration.bRead_Technik_XML = true;
	Plc.writeStruct({
       			name: 'prgKonfiguration.stData',
				val: PLC_VAR.stKonfiguration,
				def: structdef_konfiguration
				});

};

schreiben_technik.onclick = function(){
	PLC_VAR.stKonfiguration.bUpdate_Technik_XML = true;
	Plc.writeStruct({
       			name: 'prgKonfiguration.stData',
				val: PLC_VAR.stKonfiguration,
				def: structdef_konfiguration
				});
};				
				

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
/*				Plc.sumWriteReq({
					items: [{
								name: "prgKonfiguration.bUpdate_Lampe_Config",
								val: true
							}],
				});
*/			},
			
		});
};


back_btn_ss.onclick = function(){
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

back_btn_dimm.onclick = function(){
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


back_btn_lampe.onclick = function(){
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


sommerbetrieb.onchange = function(){
	
	if ($('#sommerbetrieb').prop("checked") == true)
	{
		PLC_VAR.stLueftung.bSommerbetrieb = true;
	}
	else
	{
		PLC_VAR.stLueftung.bSommerbetrieb = false;
	};
		
	
	Plc.sumWriteReq({
            items: [{
				name: 'prgLueftung.stData',
				val: PLC_VAR.stLueftung,
				def: structdef_lueftung,
			}],
			oc: function(){
				
/*				Plc.sumWriteReq({
					items: [{
								name: "prgKonfiguration.bUpdate_Raffstore_Visu",
								val: true
							}],
				});
*/			},
		});
};

standby.onclick = function(){
	if (PLC_VAR.stLueftung.bStandby == false)
	{
		PLC_VAR.stLueftung.bStandby = true;
	}
	else
	{
		PLC_VAR.stLueftung.bStandby = false;
	};
	
	Plc.sumWriteReq({
            items: [{
				name: 'prgLueftung.stData',
				val: PLC_VAR.stLueftung,
				def: structdef_lueftung,
			}],
	});	
};
	

stosslueftung.onclick = function(){

	PLC_VAR.stLueftung.bStosslueftung = true;
	
	Plc.sumWriteReq({
            items: [{
				name: 'prgLueftung.stData',
				val: PLC_VAR.stLueftung,
				def: structdef_lueftung,
			}],
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
				},{
      	            name: 'prgLueftung.stData',
                    jvar: 'PLC_VAR.stLueftung',
                    def: structdef_lueftung
				},{
      	            name: 'prgKonfiguration.stData',
                    jvar: 'PLC_VAR.stKonfiguration',
                    def: structdef_konfiguration
                },{
      	            name: 'MAIN.bToggle',
                    jvar: 'plc_toggle'
                }],
        	});

	document.getElementById("systemtime_eg").firstChild.data =
	document.getElementById("systemtime_og").firstChild.data =
	document.getElementById("systemtime_aussen").firstChild.data =
	document.getElementById("systemtime_ss").firstChild.data =
	document.getElementById("systemtime_raff1").firstChild.data =
	document.getElementById("systemtime_raff2").firstChild.data =
	document.getElementById("systemtime_lampe").firstChild.data =
	document.getElementById("systemtime_sicherung").firstChild.data =
	document.getElementById("systemtime_lueftung").firstChild.data =
	document.getElementById("systemtime_dimm").firstChild.data = plc_SystemTime;

/********************************************************************************/
/***** 				LOOP: Lüftung											*****/
/********************************************************************************/

	if(PLC_VAR.stLueftung.bBetrieb==true)
		{document.all["betrieb"].value="EIN";}
	else
		{
			if(PLC_VAR.stLueftung.bStandby==true)
				{document.all["betrieb"].value="Standby";}
			else
				{document.all["betrieb"].value="AUS";}
		};
			

	document.all["schaltschwelle"].value=(PLC_VAR.stLueftung.nTempSchaltschwelle / 10).toFixed(1) + " °C";
	document.all["hysterese"].value=(PLC_VAR.stLueftung.nTempHysterese / 10).toFixed(1) + " °C";
	document.all["innentemperatur"].value=(PLC_VAR.stLueftung.nTempRaumMittel / 10).toFixed(1) + " °C";
	document.all["aussentemperatur"].value=(PLC_VAR.stLueftung.nTempAussenluft / 10).toFixed(1) + " °C";
	document.all["zulufttemperatur"].value=(PLC_VAR.stLueftung.nTempZuluft / 10).toFixed(1) + " °C";
	document.all["ablufttemperatur"].value=(PLC_VAR.stLueftung.nTempAbluft / 10).toFixed(1) + " °C";
	
	$('#sommerbetrieb').prop( "checked", PLC_VAR.stLueftung.bSommerbetrieb );

/********************************************************************************/
/***** 				Konfiguration											*****/
/********************************************************************************/

document.all["file_xml"].value=PLC_VAR.stKonfiguration.strStatus;
document.all["error_lesen"].value=PLC_VAR.stKonfiguration.nReadXMLErrID;
document.all["error_schreiben"].value=PLC_VAR.stKonfiguration.nWriteXMLErrID;

	
	if(PLC_VAR.stKonfiguration.bWriteXMLBusy==true)
		{document.all["status_xml"].value="XML-Write Busy"}				
	else if(PLC_VAR.stKonfiguration.bReadXMLBusy==true)				
		{document.all["status_xml"].value="XML-Read Busy"}				
	else if(PLC_VAR.stKonfiguration.bWriteXMLError==true)				
		{document.all["status_xml"].value="XML-Write Error"}				
	else if(PLC_VAR.stKonfiguration.bReadXMLError==true)				
		{document.all["status_xml"].value="XML-Read Error"}				
	else
			{document.all["status_xml"].value="NOP"};				

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


//	document.getElementById("fl_mo_hell_2").firstChild.data = true;
// var test = PLC_VAR.ArrRaffVisu[1].Abends_Hell[1];
// 	document.getElementById('slider_dim_eg').value = PLC_VAR.DimmerVisu[glbIndexDIM].vis_DimmIst;
//		$('#fl_mo_hell_1').prop( "checked", PLC_VAR.ArrRaffVisu[1].Abends_Hell );
//		$('#fl_mo_hell_1').prop( "checked", test );
};
