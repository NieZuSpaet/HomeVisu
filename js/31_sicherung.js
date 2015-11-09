   
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
      	            name: 'prgKonfiguration.stData',
                    jvar: 'PLC_VAR.stKonfiguration',
                    def: structdef_konfiguration
                }],
        	});

	document.getElementById("systemtime").firstChild.data = plc_SystemTime;

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
