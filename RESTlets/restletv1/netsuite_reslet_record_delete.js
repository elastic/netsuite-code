function deleteRecord(datain)  
{  
    //nlapiLogExecution('DEBUG','recordtype='+datain.recordtype);  
    //nlapiLogExecution('DEBUG','id='+datain.id);  
	
	return nlapiDeleteRecord ( datain.recordtype , datain.id )
}
