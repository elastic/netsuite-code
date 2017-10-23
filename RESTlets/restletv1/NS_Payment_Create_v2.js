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

	var recordId = nlapiSubmitRecord(record);
	//	nlapiLogExecution('DEBUG', 'id=' + recordId);

	var nlobj = nlapiLoadRecord(datain.recordtype, recordId);
	
	var linenum = 0;

	for(var i = 1;i<=nlobj.getLineItemCount('apply');i++){
	    var invoice_num = nlobj.getLineItemValue( 'apply' , 'refnum' , i );
		if(invoice_num === datain.invoice_number) linenum = i; 
    }
	
	//var linenum = nlobj.nlapiFindLineItemValue('apply','apply','F');
	//var linenum = 1;
	
	nlapiLogExecution('DEBUG', 'linenum=' + linenum);
	if (linenum && linenum >=0){
		//nlapiSelectLineItem('apply',linenum);
		nlobj.selectLineItem('apply',linenum);
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