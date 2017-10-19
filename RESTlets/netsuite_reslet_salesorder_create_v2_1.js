/**
*	RESTlet
*	Summary : Creates a Sales Order
*
*	required : netsuite_restlet_LIBRARY.js
*
* TODO: Need to update the script setting variables to match script deployment
* TODO: need to test more than 1000 results because I modified the sortorder
**/
var RestSO = {
	fromEmail : context.getSetting('SCRIPT', 'custscript_file_fromemail') || null,
	toEmail : context.getSetting('SCRIPT', 'custscript_file_toemails').replace(/\s+/g, '').split(',') || null, //should be comma sep list
	create:function(){
		try{
			//nlapiLogExecution('DEBUG', 'recordtype=' + datain.recordtype);
			var record = nlapiCreateRecord(datain.recordtype);

			for (var fieldname in datain) {
				if (datain.hasOwnProperty(fieldname)) {
					if (fieldname != 'recordtype' && fieldname != 'id') {
						var value = datain[fieldname];
						if (value) // ignore other type of parameters  
						{
							//nlapiLogExecution('DEBUG', 'typeof value =' + fieldname + '=' + typeof value);
							if (typeof value == 'object') {
								if (value.length == undefined) {

									record.selectNewLineItem(fieldname);

									for (var sublistfield in value) {

										var sublistvalue = value[sublistfield];
										//nlapiLogExecution('DEBUG', fieldname + '=' + sublistfield + '=' + sublistvalue);
										record.setCurrentLineItemValue(fieldname, sublistfield, sublistvalue);
									}
									record.commitLineItem(fieldname);

								} else {

									for (var i = 0; i < value.length; i++) {
										record.selectNewLineItem(fieldname);
										for (var sublistfield in value[i]) {
											var sublistvalue = value[i][sublistfield];
											//nlapiLogExecution('DEBUG', fieldname + '=' + sublistfield + '=' + sublistvalue);
											record.setCurrentLineItemValue(fieldname, sublistfield, sublistvalue);
										}
										record.commitLineItem(fieldname);
									}
								}
							} else {
								//nlapiLogExecution('DEBUG', fieldname + '=' + value);
								record.setFieldValue(fieldname, value);
							}
						}
					}
				}
			}

			var recordId = nlapiSubmitRecord(record);
			//nlapiLogExecution('DEBUG', 'id=' + recordId);

			var nlobj = nlapiLoadRecord(datain.recordtype, recordId);
			nlapiSubmitRecord(nlobj, true);
			return nlobj;

		}catch(e){
			
		}

	}
}