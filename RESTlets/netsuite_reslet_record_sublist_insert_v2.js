/**
*	RESTlet
*	Summary : Adds or replaces a sublist
* 					Nov 2017 it is mostly used for address and currency updates
*
*	@insert adds a new sublist
*	@replace replaces the 1st line in a sublist
*	
*	required : netsuite_restlet_LIBRARY.js
*
* TODO: Need to update the script setting variables to match script deployment
**/

var RestSublist = {
	fromEmail : context.getSetting('SCRIPT', 'custscript_file_fromemail') || null,
	toEmail : context.getSetting('SCRIPT', 'custscript_file_toemails').replace(/\s+/g, '').split(',') || null, //should be comma sep list
	insert:function(datain){
		// nlapiLogExecution('AUDIT', 'recordtype=' + datain.recordtype);
		// nlapiLogExecution('AUDIT', 'id=' + datain.id);
		
		try{
			var record = nlapiLoadRecord(datain.recordtype, datain.id);
			
			// nlapiLogExecution('AUDIT', 'datain.sublist.type =' + datain.sublist.type);
			// nlapiLogExecution('AUDIT', 'datain.sublist.field =' + datain.sublist.field);
			// nlapiLogExecution('AUDIT', 'datain.sublist.value =' + datain.sublist.value);

			record.selectNewLineItem(datain.sublist.type);
			
			var sublistfieldarray = datain.sublist.field.split("=");
			var sublistvaluearray = datain.sublist.value.split("=");
			
			for(k=0; k<sublistfieldarray.length; k++) {
				
				var sublistfieldvalue = sublistfieldarray[k];
				var sublistvaluevalue = sublistvaluearray[k];
				
				// nlapiLogExecution('AUDIT', 'sublistfieldvalue =' + sublistfieldvalue);
				// nlapiLogExecution('AUDIT', 'sublistvaluevalue =' + sublistvaluevalue);
			
				record.setCurrentLineItemValue(datain.sublist.type, sublistfieldvalue, sublistvaluevalue);
			}
			
			if(datain.sublist.type == 'addressbook' || datain.sublist.type == 'currency'){
				record.setCurrentLineItemValue(datain.sublist.type, 'isprimary', 'T');
			}
			record.commitLineItem(datain.sublist.type);
			
			var recordId = nlapiSubmitRecord(record);
			
			var nlobj = nlapiLoadRecord(datain.recordtype, recordId);

			var myReturnData = new FinalData(true, null, datain, nlobj);

			return myReturnData;
		}catch(e){
			var myReturnData = new FinalData(false, e, datain, '');

			var body = 'Error adding sublist entry to '+datain.sublist.type;
			elasticHandleError(myReturnData, RestRec.fromEmail, RestRec.toEmail, body);

			return myReturnData;
		}
	},
	replace:function(datain){
		// nlapiLogExecution('AUDIT', 'recordtype=' + datain.recordtype);
		// nlapiLogExecution('AUDIT', 'id=' + datain.id);
		try{
			var record = nlapiLoadRecord(datain.recordtype, datain.id);
			
			// nlapiLogExecution('AUDIT', 'datain.sublist.type =' + datain.sublist.type);
			// nlapiLogExecution('AUDIT', 'datain.sublist.field =' + datain.sublist.field);
			// nlapiLogExecution('AUDIT', 'datain.sublist.value =' + datain.sublist.value);

			record.selectLineItem (datain.sublist.type,1);
			
			var sublistfieldarray = datain.sublist.field.split("=");
			var sublistvaluearray = datain.sublist.value.split("=");
			
			for(k=0; k<sublistfieldarray.length; k++) {
				
				var sublistfieldvalue = sublistfieldarray[k];
				var sublistvaluevalue = sublistvaluearray[k];
				
				// nlapiLogExecution('AUDIT', 'sublistfieldvalue =' + sublistfieldvalue);
				// nlapiLogExecution('AUDIT', 'sublistvaluevalue =' + sublistvaluevalue);
			
				record.setCurrentLineItemValue(datain.sublist.type, sublistfieldvalue, sublistvaluevalue);
			}
			
			record.setCurrentLineItemValue(datain.sublist.type, 'isprimary', 'T');
			record.commitLineItem(datain.sublist.type);
			
			var recordId = nlapiSubmitRecord(record);
			
			var nlobj = nlapiLoadRecord(datain.recordtype, recordId);

			var myReturnData = new FinalData(true, null, datain, nlobj);

			return myReturnData;

		}catch(e){
			var myReturnData = new FinalData(false, e, datain, '');

			var body = 'Error replacing sublist entry to '+datain.sublist.type;
			elasticHandleError(myReturnData, RestRec.fromEmail, RestRec.toEmail, body);

			return myReturnData;

		}

	}
}