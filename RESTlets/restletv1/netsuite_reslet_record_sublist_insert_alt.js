function insertSublist(datain)  
{  
	//nlapiLogExecution('DEBUG', 'recordtype=' + datain.recordtype);
	//nlapiLogExecution('DEBUG', 'id=' + datain.id);
	
    var record = nlapiLoadRecord(datain.recordtype, datain.id);
	
	//nlapiLogExecution('DEBUG', 'datain.sublist.type =' + datain.sublist.type);
	//nlapiLogExecution('DEBUG', 'datain.sublist.field =' + datain.sublist.field);
	//nlapiLogExecution('DEBUG', 'datain.sublist.value =' + datain.sublist.value);

	record.selectNewLineItem(datain.sublist.type);
	
	var sublistfieldarray = datain.sublist.field.split("=");
	var sublistvaluearray = datain.sublist.value.split("=");
	
	for(k=0; k<sublistfieldarray.length; k++) {
		
		var sublistfieldvalue = sublistfieldarray[k];
		var sublistvaluevalue = sublistvaluearray[k];
		
		//nlapiLogExecution('DEBUG', 'sublistfieldvalue =' + sublistfieldvalue);
		//nlapiLogExecution('DEBUG', 'sublistvaluevalue =' + sublistvaluevalue);
	
		record.setCurrentLineItemValue(datain.sublist.type, sublistfieldvalue, sublistvaluevalue);
	}
	
	record.setCurrentLineItemValue(datain.sublist.type, 'isprimary', 'T');
	record.commitLineItem(datain.sublist.type);
	
	var recordId = nlapiSubmitRecord(record);
	
	return nlapiLoadRecord(datain.recordtype, recordId);
}

function replaceSublist(datain)  
{  
	//nlapiLogExecution('DEBUG', 'recordtype=' + datain.recordtype);
	//nlapiLogExecution('DEBUG', 'id=' + datain.id);
	
    var record = nlapiLoadRecord(datain.recordtype, datain.id);
	
	//nlapiLogExecution('DEBUG', 'datain.sublist.type =' + datain.sublist.type);
	//nlapiLogExecution('DEBUG', 'datain.sublist.field =' + datain.sublist.field);
	//nlapiLogExecution('DEBUG', 'datain.sublist.value =' + datain.sublist.value);

	record.selectLineItem (datain.sublist.type,1);
	
	var sublistfieldarray = datain.sublist.field.split("=");
	var sublistvaluearray = datain.sublist.value.split("=");
	
	for(k=0; k<sublistfieldarray.length; k++) {
		
		var sublistfieldvalue = sublistfieldarray[k];
		var sublistvaluevalue = sublistvaluearray[k];
		
		//nlapiLogExecution('DEBUG', 'sublistfieldvalue =' + sublistfieldvalue);
		//nlapiLogExecution('DEBUG', 'sublistvaluevalue =' + sublistvaluevalue);
	
		record.setCurrentLineItemValue(datain.sublist.type, sublistfieldvalue, sublistvaluevalue);
	}
	
	record.setCurrentLineItemValue(datain.sublist.type, 'isprimary', 'T');
	record.commitLineItem(datain.sublist.type);
	
	var recordId = nlapiSubmitRecord(record);
	
	return nlapiLoadRecord(datain.recordtype, recordId);
}