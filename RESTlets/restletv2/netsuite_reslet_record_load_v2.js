/**
*	RESTlet
*	Summary : 
		Update a field on a record
		Get a record
		Create a record in NetSuite
*
*	required : netsuite_restlet_LIBRARY.js
*
* TODO: Need to update the script setting variables to match script deployment
**/
var RestRec = {
	fromEmail : context.getSetting('SCRIPT', 'custscript_file_fromemail') || null,
	toEmail : context.getSetting('SCRIPT', 'custscript_file_toemails').replace(/\s+/g, '').split(',') || null, //should be comma sep list
	update:function(datain){
		// nlapiLogExecution('AUDIT','recordtype='+datain.recordtype);
		// nlapiLogExecution('AUDIT','id='+datain.id);
		// nlapiLogExecution('AUDIT','column='+datain.column);
		// nlapiLogExecution('AUDIT','value='+datain.value);

		try{
			//using the nlapiSubmitField we can only update fields that are inline editable
			var recordId = nlapiSubmitField(datain.recordtype, datain.id, datain.column, datain.value);
			// nlapiLogExecution('AUDIT','id='+recordId);  

			// Loading the record so we can return all of it's data
			var record = nlapiLoadRecord(datain.recordtype,recordId);

			var myReturnData = new FinalData(true, null, datain, record);

			return myReturnData;
		}catch(e){
			var myReturnData = new FinalData(false, e, datain, '');

			var body = 'Error updating a field. Depending on the error below, remember that the field must be inline editable by the requesting user.';
			elasticHandleError(myReturnData, RestRec.fromEmail, RestRec.toEmail, body);

			return myReturnData;
		}
	},
	get:function(datain){
		// nlapiLogExecution('AUDIT','recordtype='+datain.recordtype);
		// nlapiLogExecution('AUDIT','id='+datain.id);	

			try{
				var record = nlapiLoadRecord(datain.recordtype, datain.id);

				var myReturnData = new FinalData(true, null, datain, record);

				return myReturnData;

			}catch(e){
				var myReturnData = new FinalData(false, e, datain, '');

				var body = 'Error loading record';
				elasticHandleError(myReturnData, RestRec.fromEmail, RestRec.toEmail, body);

				return myReturnData;
			}			
	},
	create:function(datain){
		try{
			var record = nlapiCreateRecord(datain.recordtype);  

			for (var fieldname in datain){  
				if (datain.hasOwnProperty(fieldname)){
					if (fieldname != 'recordtype' && fieldname != 'id'){
						var value = datain[fieldname];
						if (value && typeof value != 'object'){ // ignore other type of parameters 
							record.setFieldValue(fieldname, value);  
						}
					}
				}
			}
			var recordId = nlapiSubmitRecord(record);
			// nlapiLogExecution('AUDIT','id='+recordId);

			var nlobj = nlapiLoadRecord(datain.recordtype,recordId);
			var myReturnData = new FinalData(true, null, datain, nlobj);

			return myReturnData;
		}catch(e){
			var myReturnData = new FinalData(false, e, datain, '');

			var body = 'Error creating the record or loading the record afterwards';
			elasticHandleError(myReturnData, RestRec.fromEmail, RestRec.toEmail, body);

			return myReturnData;			
		}
	}
}