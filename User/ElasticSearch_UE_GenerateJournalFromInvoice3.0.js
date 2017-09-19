/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.40       29 Mar 2016     mcabading		   Updated implementation: 
 * 											   Implemented line amount change, exempt from billing flag (record and line level) check to determine if record is for JE creation. 
 * 											   Implemented Invoice Posting Period Checking.
 * 1.41       06 Apr 2016     mcabading		   Updated logic so that Journal Entries will not get created if new lines amount to 0.
 * 1.45       22 Apr 2016     mcabading		   Booking ID referenced Journal Entry will now get deleted if header field 'Exempt From Billing' is 'T'(checked).
 * 											   Cleaned-up implementation.
 * 1.50       26 Apr 2016     mcabading		   Code Review optimization.
 * 1.60       24 Jun 2016     mcabading		   Added booking id check.
 * 1.70       03 Aug 2016     mcabading		   Updated "update date" implementation. Will no longer update deleted JE records.
 *											   Handled issue on a scenario where a <blank> line item exempt column is registered as null instead of 'F'.
 * 1.80       05 Aug 2016     mcabading		   Fixed issue where reference Journal Entry gets deleted when an invoice/creditmemo is "made a copy".
 */

//var INTERNALID_CONTRABILL = 178;
//var CUSTOMCOL_ACCOUNT = 'custcol_account';
//var CUSTOMCOL_ACCOUNT_DISCOUNT = 'custcol_billing_discount';
var CUSTBODY_BOOKING = 'custbody_booking';
//non deletion of JE when not created on invoice - 02062013
//setting of contrabilling per line in oppose to JE line - 02062013
//email error to user - 02062013
function beforeSubmit_deleteJournalEntry(type)
{
	try
	{
		nlapiLogExecution('DEBUG', 'ACTIVITY', 'Script Started...');
		var stRecordID = nlapiGetRecordId();
		if(stRecordID)
		{
			var objInvoiceLookup = nlapiLookupField('invoice', stRecordID, ['custbody_booking']);
			if(type == 'delete')
			{
				var stJournalId = objInvoiceLookup.custbody_booking;
				if(stJournalId)
				{	
					nlapiLogExecution('DEBUG', 'ACTIVITY', 'Delete: Booking ID - Journal Entry: '+stJournalId);
					nlapiDeleteRecord('journalentry', stJournalId);
				}
			}
		}
		nlapiLogExecution('DEBUG', 'ACTIVITY', 'Script Ended Succesfully');
	}catch(err)
	{
		nlapiLogExecution('ERROR', 'ERROR', err.message);
		nlapiSendEmail(nlapiGetContext().getUser(), nlapiGetContext().getUser(), 'Error in creating JE from Invoice: '+nlapiGetFieldValue('tranid'), err.message);
	}

}

function afterSubmit_generateJournalEntry(type)
{
	try
	{
		nlapiLogExecution('DEBUG', 'ACTIVITY', 'Script Started...'
				+'Operation Type: '+type);//operation type. 

		var stRecordID = nlapiGetRecordId();
		var objRecTransactionNew = nlapiGetNewRecord();//mcabading 04262016
		if(!objRecTransactionNew)
		{
			throw nlapiCreateError('NEW_RECORD_INIT_FAILURE', 'Failed to load new record.');//throw error.
		}
		
		var stPostingPeriod = objRecTransactionNew.getFieldValue('postingperiod');
		var stPostingPeriodClosed = nlapiLookupField('accountingperiod', stPostingPeriod, 'closed');
		
		if(stPostingPeriodClosed == 'F')//If transaction posting period is still open, proceed.
		{
			if(type == 'create' || type == 'edit')
			{
				var stExemptFromBilling_recNew = processExemptValue(objRecTransactionNew.getFieldValue('custbody_exempt_from_billing'));
				var stExistingJournalID = nlapiLookupField('invoice', stRecordID, CUSTBODY_BOOKING);//mcabading 06242016
				var stTrandate = nlapiLookupField('invoice', stRecordID, 'trandate');
				
				var bValid = true;
				var arrLines = null;
				var objResult = null;
				
				if(type == 'edit' && !isEmpty(stExistingJournalID))//mcabading 06242016
				{
					var objRecTransactionOld = nlapiGetOldRecord();
					if(!objRecTransactionOld)
					{
						throw nlapiCreateError('OLD_RECORD_INIT_FAILURE', 'Failed to load new record.');//throw error.
					}
					
					var stExemptFromBilling_recOld = processExemptValue(objRecTransactionOld.getFieldValue('custbody_exempt_from_billing'));//mcabading 04222016
					objResult = checkLineItemChanges(objRecTransactionOld,objRecTransactionNew);
					bValid = (stExemptFromBilling_recOld!=stExemptFromBilling_recNew)?true:objResult.haschanged;//mcabading 04222016
				}
				else
				{
					objResult = getLineItemValues(objRecTransactionNew);
				}
				
				arrLines = objResult.linearray;
				
				var bExistingJEDeleted = false;//mcabading 08032016
				if( stExemptFromBilling_recNew == 'T' || (stExemptFromBilling_recNew == 'F' && bValid ==  true && arrLines) )//check for line amount changes. mcabading 04222016
				{
					if(!isEmpty(stExistingJournalID) && (type!='create'))//mcabading 08052016
					{	
						nlapiDeleteRecord('journalentry', stExistingJournalID);
						bExistingJEDeleted = true;//mcabading 08032016
					}
					if(stExemptFromBilling_recNew == 'F')//Check Exempt Billing Flag (Record Level)
					{
						var objRecJournal = nlapiCreateRecord('journalentry');
						var stCustomerID = objRecTransactionNew.getFieldValue('entity');
						nlapiLogExecution('DEBUG', 'VALUE', 'Customer ID: '+stCustomerID);
						
						objRecJournal.setFieldValue('currency', objRecTransactionNew.getFieldValue('currency'));
						objRecJournal.setFieldValue('exchangerate', objRecTransactionNew.getFieldValue('exchangerate'));
						objRecJournal.setFieldValue('postingperiod', objRecTransactionNew.getFieldValue('postingperiod'));
						objRecJournal.setFieldValue('trandate', objRecTransactionNew.getFieldValue('trandate'));
						objRecJournal.setFieldValue('subsidiary', objRecTransactionNew.getFieldValue('subsidiary'));
						objRecJournal.setFieldValue(CUSTBODY_BOOKING, stRecordID);
						
						if(checkLineItems(arrLines, objRecJournal, stCustomerID)==true)
						{
							var stJournalID = nlapiSubmitRecord(objRecJournal);
							nlapiLogExecution('DEBUG', 'VALUE', 'Journal ID: '+stJournalID);
							nlapiSubmitField('invoice', stRecordID, CUSTBODY_BOOKING, stJournalID);
						}
					}
				}
				if(!bExistingJEDeleted)//mcabading 08032016
				{
					updateDate(stExistingJournalID, stTrandate, type);
				}
			}
		}
		nlapiLogExecution('DEBUG', 'ACTIVITY', 'Script Ended Succesfully');
	}catch(err)
	{
		nlapiLogExecution('ERROR', 'ERROR', err.message);
		nlapiSendEmail(nlapiGetContext().getUser(), nlapiGetContext().getUser(), 'Error in creating JE from Invoice', err.message);
	}
}

function updateDate(stExistingJournalID, stTrandate, type)
{
	if(type == 'edit')
	{
		if(!isEmpty(stExistingJournalID) && !isEmpty(stTrandate))
		{
			var stTrandateJE = nlapiLookupField('journalentry', stExistingJournalID, 'trandate');
			
			if(stTrandateJE != stTrandate)
			{
				nlapiSubmitField('journalentry', stExistingJournalID, 'trandate', stTrandate);
				nlapiLogExecution('AUDIT', 'updateDate', 'Updated Journal Entry Record : ' + stExistingJournalID);
			}
		}
	}
}

function getLineItemValues(recTransaction)
{
	var objResult = {};
	var intLineItemCount = recTransaction.getLineItemCount('item');
	var arrLineObj = new Array();
	/*
	 * Compare each line item amount
	 */
	for(var i=1; i<=intLineItemCount; i++)
	{
		/*
		 * Initialize line object. (Specific per record type)
		 */
		var objLine = {};
		objLine['amount'] = parseFloat(recTransaction.getLineItemValue('item', 'amount', i));
		objLine['item'] = recTransaction.getLineItemValue('item', 'item', i);
		objLine['id'] = recTransaction.getLineItemValue('item', 'id', i);
		objLine['exemptfrombilling'] = processExemptValue(recTransaction.getLineItemValue('item', 'custcol_exempt_from_billing', i));
		objLine['department'] = recTransaction.getLineItemValue('item', 'department', i);
		objLine['classid'] =  recTransaction.getLineItemValue('item', 'class', i);
		objLine['location'] =  recTransaction.getLineItemValue('item', 'location', i);
		objLine['account'] =  recTransaction.getLineItemValue('item', 'custcol_account', i);
		objLine['billingaccount'] =  recTransaction.getLineItemValue('item', 'custcol_billing_discount', i);
		arrLineObj.push(objLine);
	}
	objResult['linearray'] = arrLineObj;
	return (objResult);
}
/**
 * Check for record line item changes.
 * 
 * @param recOld
 * @param recNew
 */
function checkLineItemChanges(objRecOldParam,objRecNewParam)
{
	var objResult = {};
	var bHasChanged = false;
	/*
	 * Get line item counts.
	 */
	var intOldRecLineItemCount = objRecOldParam.getLineItemCount('item');
	var intNewRecLineItemCount = objRecNewParam.getLineItemCount('item');
	
	/*
	 * Store old.
	 */
	var objRecOld = {};
	for(var i=1; i<=intOldRecLineItemCount; i++)
	{
		var stTmpItemID = objRecOldParam.getLineItemValue('item', 'id', i);
		objRecOld[stTmpItemID] = {};
		objRecOld[stTmpItemID]['item'] = parseFloat(objRecOldParam.getLineItemValue('item', 'item', i));
		objRecOld[stTmpItemID]['amount'] = parseFloat(objRecOldParam.getLineItemValue('item', 'amount', i));
		objRecOld[stTmpItemID]['exemptfrombilling'] = processExemptValue(objRecOldParam.getLineItemValue('item', 'custcol_exempt_from_billing', i));
	}
	var arrNewLineObj = new Array();
	/*
	 * Compare each line item amount
	 */
	var arrOldLineCtr = new Array();
	for(var i=1; i<=intNewRecLineItemCount; i++)
	{
		var stTmpItem = objRecNewParam.getLineItemValue('item', 'item', i);
		var stTmpItemID = objRecNewParam.getLineItemValue('item', 'id', i);
		var flTmpAmount = parseFloat(objRecNewParam.getLineItemValue('item', 'amount', i));
		var stExempt = processExemptValue(objRecNewParam.getLineItemValue('item', 'custcol_exempt_from_billing', i));//mcabading 08032016
		var stTmpOldLine = objRecOld[stTmpItemID];
		if(stTmpOldLine)
		{
			arrOldLineCtr.push(stTmpItemID);
			if(stTmpOldLine.item != stTmpItem || stTmpOldLine.exemptfrombilling != stExempt)
			{
				bHasChanged = true;
			}
			else
			{
				if(stTmpOldLine.amount != flTmpAmount && stExempt == 'F' )//amount has changed.
				{
					bHasChanged = true;
				}
			}
		}
		else//is new line.
		{
			if(flTmpAmount != 0 && stExempt == 'F' )//check if new line amount is > 0, if not, do nothing.
			{
				bHasChanged = true;
			}
		}
		/*
		 * Initialize line object. (Specific per record type)
		 */
		if(flTmpAmount!=0  && stExempt == 'F')//only include line items with amount greater than 0 and is NOT exempted from billing.
		{
			var objLine = {};
			objLine['amount'] = flTmpAmount;
			objLine['item'] = stTmpItem;
			objLine['id'] = stTmpItemID;
			objLine['exemptfrombilling'] = processExemptValue(objRecNewParam.getLineItemValue('item', 'custcol_exempt_from_billing', i));
			objLine['department'] = objRecNewParam.getLineItemValue('item', 'department', i);
			objLine['class'] =  objRecNewParam.getLineItemValue('item', 'class', i);
			objLine['location'] =  objRecNewParam.getLineItemValue('item', 'location', i);
			objLine['class'] =  objRecNewParam.getLineItemValue('item', 'class', i);
			objLine['account'] =  objRecNewParam.getLineItemValue('item', 'custcol_account', i);
			objLine['billingaccount'] =  objRecNewParam.getLineItemValue('item', 'custcol_billing_discount', i);
			arrNewLineObj.push(objLine);
		}
	}
	/*
	 * Check removed lines
	 */
	if(arrOldLineCtr.length!=intOldRecLineItemCount)
	{
		var intNewCount = arrOldLineCtr.length;
		for (var keyItemID in objRecOld) {
			if (objRecOld.hasOwnProperty(keyItemID)) {
				if(arrOldLineCtr.indexOf(keyItemID) == -1)
				{
					var objDeletedOldLine = objRecOld[keyItemID];
					if(objDeletedOldLine.amount == 0 || objDeletedOldLine.exemptfrombilling == 'T')//check if deleted line amount is 0, remove from count;
					{
						intNewCount++;
					}
				}
			}
		}
		if(intNewCount!=intOldRecLineItemCount)
		{
			bHasChanged = true;
		}
	}
	objResult['haschanged'] = bHasChanged;
	objResult['linearray'] = arrNewLineObj;
	
	return (objResult);
}

/**
 * Function Description:
 * Handles instance where exempt column value is null instead of 'F'.
 * 
 * @param stValue
 * @returns {Any}
 */
function processExemptValue(stValue)
{
	if(isEmpty(stValue))
	{
		return ('F');
	}
	else
	{
		return (stValue);
	}
}


/**
 * Check if a string is empty
 * @param stValue (string) value to check
 * @returns {Boolean}
 */
function isEmpty (stValue) {
     if ((stValue == '') || (stValue == null) || (stValue == undefined)) {
          return true;
     }

     return false;
}