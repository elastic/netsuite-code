function aibeforeSubmit(type)
{

nlapiLogExecution('DEBUG',"START", "");

var recActionItem = nlapiGetNewRecord();

nlapiLogExecution('DEBUG',"got the record", "");

var aiPercent = recActionItem.getFieldValue('custrecord_action_items_percent_complete');
var aiStatus = recActionItem.getFieldText('custrecord_action_items_status');
var aiDate = recActionItem.getFieldValue('custrecord_action_items_date_completed');

nlapiLogExecution('DEBUG',"aiPercent :", aiPercent );
nlapiLogExecution('DEBUG',"aiStatus :", aiStatus );
nlapiLogExecution('DEBUG',"aiDate :", aiDate );

if( aiStatus=="Closed" && aiPercent!="100.0%" )
{

	recActionItem.setFieldValue('custrecord_action_items_percent_complete', '100');
	var today = new Date();
	var day = today.getDate();
	var month = today.getMonth()+1;
	var year = today.getFullYear();
	var dateText = month+"/"+day+"/"+year;
	
	recActionItem.setFieldValue('custrecord_action_items_date_completed', dateText);
}

}
