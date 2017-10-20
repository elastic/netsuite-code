/**
*	RESTlet
*	Summary : 
		Re-save a payment to kick off automations (need to find out why NS does not do it already)
		Create a payment and apply it to invoice
*
*	required : netsuite_restlet_LIBRARY.js
*
* TODO: Need to update the script setting variables to match script deployment
*	TODO : If we start to pay multiple invoices, we will need to adjust the apply method.
**/


var RestPayment = {
	fromEmail : context.getSetting('SCRIPT', 'custscript_file_fromemail') || null,
	toEmail : context.getSetting('SCRIPT', 'custscript_file_toemails').replace(/\s+/g, '').split(',') || null, //should be comma sep list
	save:function(datain){
		// nlapiLogExecution('DEBUG', 'recordtype=' + datain.recordtype);
		// nlapiLogExecution('DEBUG', 'id=' + datain.id);
		try{
			var record = nlapiLoadRecord(datain.recordtype, datain.id);
			nlapiSubmitRecord(record, true);
		}catch(e){
			var myReturnData = new FinalData(false, e, datain, '');

			var body = 'Error loading or submitting the record.';
			elasticHandleError(myReturnData, RestPayment.fromEmail, RestPayment.toEmail, body);

			return myReturnData;
		}
	},
	create:function(datain){
		// nlapiLogExecution('DEBUG', 'recordtype=' + datain.recordtype);
		// nlapiLogExecution('DEBUG', 'entity=' + datain.entity);
		// nlapiLogExecution('DEBUG', 'invoice_date=' + datain.invoice_date);
		try{
			var record = nlapiCreateRecord(datain.recordtype);

			record.setFieldValue('trandate', datain.invoice_date);
			record.setFieldValue('customer', datain.customer);
			record.setFieldValue('customform', datain.customform);
			record.setFieldValue('payment', datain.payment);
			// record.setFieldValue('applied', datain.payment); //this is set when we apply the payment to a debt
			//record.setFieldValue('unapplied', datain.payment);
			record.setFieldValue('subsidiary', datain.subsidiary);
			record.setFieldValue('location', datain.location);
			record.setFieldValue('department', datain.department);
			record.setFieldValue('custbody_elastic_cctype', datain.custbody_elastic_cctype);
			// record.setFieldValue('autoapply', 'T');
			record.setFieldValue('currency', datain.currency);
			
			var linenum = 0;

			for(var i = 1;i<=record.getLineItemCount('apply');i++){
				var invoice_num = record.getLineItemValue( 'apply' , 'refnum' , i );
				if(invoice_num === datain.invoice_number) linenum = i; 
			}
			
			//nlapiLogExecution('DEBUG', 'linenum=' + linenum);
			if (linenum && linenum >=0){
				//nlapiSelectLineItem('apply',linenum);
				record.selectLineItem('apply',linenum);
				record.setCurrentLineItemValue('apply','apply','T');
				record.setCurrentLineItemValue('apply','applydate',datain.invoice_date);
				record.commitLineItem('apply');
				nlapiLogExecution('DEBUG', 'Updating linenum=' + linenum);
			}
			//	nlapiSubmitRecord(record, true);
			recordId = nlapiSubmitRecord(record);
			nlobj = nlapiLoadRecord(datain.recordtype, recordId);
			var myReturnData = new FinalData(true, null, datain, nlobj);

			return myReturnData;
		}catch(e){
			var myReturnData = new FinalData(false, e, datain, '');

			var body = 'Error loading or submitting the record.';
			elasticHandleError(myReturnData, RestPayment.fromEmail, RestPayment.toEmail, body);

			return myReturnData;

		}
	}
}