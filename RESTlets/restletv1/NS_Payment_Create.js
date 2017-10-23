function saveCustomerPayment(datain) {
	nlapiLogExecution('DEBUG', 'recordtype=' + datain.recordtype);
	nlapiLogExecution('DEBUG', 'id=' + datain.id);

	var record = nlapiLoadRecord(datain.recordtype, datain.id);
	nlapiSubmitRecord(record, true);

}

function createPayment(datain) {
	nlapiLogExecution('DEBUG', 'recordtype=' + datain.recordtype);
	nlapiLogExecution('DEBUG', 'entity=' + datain.entity);
	nlapiLogExecution('DEBUG', 'invoice_date=' + datain.invoice_date);

	var record = nlapiCreateRecord(datain.recordtype);

	record.setFieldValue('trandate', datain.invoice_date);
	record.setFieldValue('customer', datain.customer);
	record.setFieldValue('customform', datain.customform);
	record.setFieldValue('payment', datain.payment);
	record.setFieldValue('applied', datain.payment);
	//record.setFieldValue('unapplied', datain.payment);
	record.setFieldValue('subsidiary', datain.subsidiary);
	record.setFieldValue('location', datain.location);
	record.setFieldValue('department', datain.department);
	record.setFieldValue('custbody_elastic_cctype', datain.custbody_elastic_cctype);
	record.setFieldValue('autoapply', 'T');
	
	record.setFieldValue('currency', datain.currency);

//	nlapiLogExecution('DEBUG’,’apply_length=' + datain.apply.length);
/*
	if (datain.apply.length == undefined) {
//		nlapiLogExecution('DEBUG’,’refnum=' + datain.apply.refnum);
//		nlapiLogExecution('DEBUG’,’apply=' + datain.apply.refnum);
//		nlapiLogExecution('DEBUG’,’amount=' + datain.apply.amount);
//		nlapiLogExecution('DEBUG’,’payment=' + datain.apply.amount);
*/
		//record.selectNewLineItem('apply');
		//record.setCurrentLineItemValue('apply', 'apply', datain.apply.apply);
		//record.setCurrentLineItemValue('apply', 'amount', datain.apply.amount);
		//record.setCurrentLineItemValue('apply', 'currency', datain.apply.currency);
		//record.setCurrentLineItemValue('apply', 'applydate', datain.apply.applydate);
		//record.setCurrentLineItemValue('apply', 'refnum', datain.apply.refnum);
		//record.setCurrentLineItemValue('apply', 'type', datain.apply.type);
		//record.setCurrentLineItemValue('apply', 'amount', datain.apply.amount);
		//record.commitLineItem('apply');
/*
	} else {

		for (var i = 0; i < datain.apply.length; i++) {
//			nlapiLogExecution('DEBUG’,’internalid=' + datain.apply[i].internalid);
//			nlapiLogExecution('DEBUG’,’amount=' + datain.apply[i].amount);
//			nlapiLogExecution('DEBUG’,’payment=' + datain.apply[i].amount);

			record.selectNewLineItem('apply');
			record.setCurrentLineItemValue('apply', 'refnum', datain.apply[i].refnum);
			record.setCurrentLineItemValue('apply', 'amount', datain.apply[i].amount);
			record.commitLineItem('apply');
		}
	}*/

	var recordId = nlapiSubmitRecord(record);
//	nlapiLogExecution('DEBUG', 'id=' + recordId);

	var nlobj = nlapiLoadRecord(datain.recordtype, recordId);
	//var linenum = nlobj.nlapiFindLineItemValue('apply','apply','F');
	var linenum = 1;
	nlapiLogExecution('DEBUG', 'linenum=' + linenum);
	if (linenum && linenum >=0){
		//nlapiSelectLineItem('apply',linenum);
		nlobj.selectLineItem('apply',1);
		nlobj.setCurrentLineItemValue('apply','apply','T');
		nlobj.setCurrentLineItemValue('apply','applydate',datain.invoice_date);
		nlobj.commitLineItem('apply');
		nlapiLogExecution('DEBUG', 'Updating linenum=' + linenum);
		//var subrecord = nlapiEditCurrentLineItemSubrecord('')
		//nlapiSetCurrentLineItemValue('apply','apply','T');
		//nlapiSetCurrentLineItemValue('apply','applydate','10-OCTOBER-2016');
		//nlapiCommitLineItem('apply');
	}
//	nlapiSubmitRecord(nlobj, true);
recordId = nlapiSubmitRecord(nlobj);
 nlobj = nlapiLoadRecord(datain.recordtype, recordId);
	return nlobj;

}
