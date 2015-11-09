   
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



var		plc_SystemTime;


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
               }],
        	});

	document.getElementById("systemtime").firstChild.data = plc_SystemTime;

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

window.setTimeout('loop()', 100);

};	

