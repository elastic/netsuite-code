/**
 * Copyright (c) 1998-2016 NetSuite, Inc.
 * 2955 Campus Drive, Suite 100, San Mateo, CA, USA 94403-2511
 * All Rights Reserved.
 * 
 * This software is the confidential and proprietary information of
 * NetSuite, Inc. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into
 * with NetSuite.
 **/
/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       29 Mar 2016     mcabading
 * 1.01       06 Apr 2016     mcabading		   Updated logic so that Journal Entries will not get created if new lines amount to 0.
 * 1.10       22 Apr 2016     mcabading		   Booking ID referenced Journal Entry will now get deleted if header field 'Exempt From Billing' is 'T'(checked).
 * 											   Cleaned-up implementation.
 *
 */
/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord returnauthorization
 * 
 * @param {String} type Operation types: create, edit, delete, xedit,
 *                      approve, cancel, reject (SO, ER, Time Bill, PO & RMA only)
 *                      pack, ship (IF only)
 *                      dropship, specialorder, orderitems (PO only) 
 *                      paybills (vendor payments)
 * @returns {Void}
 */
function afterSubmit_generateJEFromRetAuth(type)
{
	try
	{
		nlapiLogExecution('DEBUG', 'ACTIVITY', 'Script Started...');
		if(type == 'create' || type == 'edit')
		{
			var stRecordID = nlapiGetRecordId();
			var stExemptFromBilling = validateCheckboxField(nlapiGetFieldValue('custbody_exempt_from_billing'));//Check Exempt Billing Flag (Record Level)
			var bValid = true;
			var arrLines = null;
			var objResult = null;

			nlapiLogExecution('DEBUG', 'ACTIVITY', 'stExemptFromBilling: '+stExemptFromBilling);
			if(type == 'edit')
			{
				var objRecOld = nlapiGetOldRecord();
				var stExemptFromBilling_recOld = validateCheckboxField(objRecOld.getFieldValue('custbody_exempt_from_billing'));//mcabading 04222016
				objResult = checkLineItemChanges(objRecOld);
				bValid = (stExemptFromBilling_recOld!=stExemptFromBilling)?true:objResult.haschanged;//mcabading 04222016
			}
			else
			{
				objResult = getLineItemValues();
			}
			arrLines = objResult.linearray;
			if( stExemptFromBilling == 'T' || (stExemptFromBilling == 'F' && bValid ==  true && arrLines) )//check for line amount changes.
			{
				if(type == 'edit')
				{
					var stExistingJournalID = nlapiGetFieldValue('custbody_booking'); 
					if(stExistingJournalID)
					{	
						nlapiDeleteRecord('journalentry', stExistingJournalID);
					}
				}

				if(stExemptFromBilling == 'F')
				{
					var objRecJournal = nlapiCreateRecord('journalentry');
					var stCustomerID = nlapiGetFieldValue('entity');
					nlapiLogExecution('DEBUG', 'VALUE', 'Customer ID: '+stCustomerID);
					
					objRecJournal.setFieldValue('currency', nlapiGetFieldValue('currency'));
					objRecJournal.setFieldValue('exchangerate', nlapiGetFieldValue('exchangerate'));
					objRecJournal.setFieldValue('postingperiod', nlapiGetFieldValue('postingperiod'));
					objRecJournal.setFieldValue('trandate', nlapiGetFieldValue('trandate'));
					objRecJournal.setFieldValue('subsidiary', nlapiGetFieldValue('subsidiary'));
					objRecJournal.setFieldValue('custbody_booking', stRecordID);
					
					if(checkLineItems(arrLines, objRecJournal, stCustomerID)==true)
					{
						var strJournalId = nlapiSubmitRecord(objRecJournal);
						nlapiLogExecution('DEBUG', 'VALUE', 'Journal ID: '+strJournalId);
						nlapiSubmitField('returnauthorization', stRecordID, 'custbody_booking', strJournalId);
					}
				}
			}
		}
		nlapiLogExecution('DEBUG', 'ACTIVITY', 'Script Ended Succesfully');
	}catch(err)
	{
		nlapiLogExecution('ERROR', 'ERROR', err.message);
		nlapiSendEmail(nlapiGetContext().getUser(), nlapiGetContext().getUser(), 'Error in creating JE from Return Authorization: '+nlapiGetFieldValue('tranid'), err.message);
	}
  
}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord returnauthorization
 * 
 * @param {String} type Operation types: create, edit, delete, xedit
 *                      approve, reject, cancel (SO, ER, Time Bill, PO & RMA only)
 *                      pack, ship (IF)
 *                      markcomplete (Call, Task)
 *                      reassign (Case)
 *                      editforecast (Opp, Estimate)
 * @returns {Void}
 */
function beforeSubmit_generateJEFromRetAuth(type)
{
	var stMethodName = 'beforeSubmit_generateJEFromRetAuth';
	try
	{
		nlapiLogExecution('DEBUG', stMethodName, 'Script Started...');
		var stRetAuthMemo = nlapiGetRecordId();
		if(stRetAuthMemo)
		{
			var objRetAuthLookup = nlapiLookupField('returnauthorization', stRetAuthMemo, ['custbody_booking']);
			if(type == 'delete')
			{
				var strJournalId = objRetAuthLookup.custbody_booking;
				if(strJournalId)
				{	
					nlapiLogExecution('DEBUG', 'ACTIVITY', 'Delete: Booking ID - Journal Entry: '+strJournalId);
					nlapiDeleteRecord('journalentry', strJournalId);
				}
			}
		}
		nlapiLogExecution('DEBUG', stMethodName, 'Script Ended Succesfully');
	}catch(err)
	{
		nlapiLogExecution('ERROR', 'ERROR', err.message);
		nlapiSendEmail(nlapiGetContext().getUser(), nlapiGetContext().getUser(), 'Error in creating JE from Return Authorization: '+nlapiGetFieldValue('tranid'), err.message);
	}
 
}
/**
 * Adapted existing library script.
 * 
 * @param arrLines
 * @param objRecJournal
 * @param stCustomerID
 */
function checkLineItems(arrLines, objRecJournal, stCustomerID)
{
	var stMethodName = 'checkLineItems';
	nlapiLogExecution('DEBUG', stMethodName, 'checkLineItems Started...');
	var objContext = nlapiGetContext();//initialize context variables.
	var stContraBillingAccount = objContext.getSetting('SCRIPT', 'custscript_contrabilling_acct');
	var bJournalHasLines = false;
	var intLine = 1;
	for(var i=0;i<arrLines.length;i++)
	{
		var objLine = arrLines[i];
		/*
		 * Check Exempt Billing Flag (Item Level)
		 */
		var stExemptBilling = validateCheckboxField(objLine.exemptfrombilling);
		if(stExemptBilling == 'F')
		{
			var stDepartment = objLine.department;
			var stClass = objLine.classid;
			var stLocation = objLine.location;//Return Authorization location is header level.

			if(!isEmpty(stDepartment) && !isEmpty(stLocation))//validate mandatory JE line fields.
			{
				var stBillLine = '';
				var stContraBillLine = '';
				var stItem = objLine.item;
				var objItemType = nlapiLookupField('item', stItem, ['recordtype']);
				var stItemType = objItemType.recordtype;
				var flAmount = parseFloat(Math.abs(objLine.amount));;
				var stLineAccount = null;

				if(stItemType != 'discountitem')
				{
					stLineAccount = objLine.account;//check account.
					stBillLine = 'debit';
					stContraBillLine = 'credit';
				}else
				{
					stLineAccount = objLine.billingaccount;//check account.
					stBillLine = 'credit';
					stContraBillLine = 'debit';
				}
				if(!isEmpty(stLineAccount))
				{
					objRecJournal.setLineItemValue('line', 'account', intLine,stLineAccount);
					objRecJournal.setLineItemValue('line', stBillLine, intLine, nlapiFormatCurrency(flAmount));
					objRecJournal.setLineItemValue('line', 'entity', intLine, stCustomerID);
					objRecJournal.setLineItemValue('line', 'department', intLine,stDepartment);
					if(!isEmpty(stClass))
					{
						objRecJournal.setLineItemValue('line', 'class', intLine, stClass);
					}
					objRecJournal.setLineItemValue('line', 'location', intLine, stLocation);
					intLine++;

					objRecJournal.setLineItemValue('line', 'account', intLine, stContraBillingAccount);
					objRecJournal.setLineItemValue('line', stContraBillLine, intLine,nlapiFormatCurrency(flAmount));
					objRecJournal.setLineItemValue('line', 'entity', intLine, stCustomerID);
					objRecJournal.setLineItemValue('line', 'department', intLine, stDepartment);
					if(!isEmpty(stClass))
					{
						objRecJournal.setLineItemValue('line', 'class', intLine, stClass);
					}
					objRecJournal.setLineItemValue('line', 'location', intLine, stLocation);
					intLine++;
					
					bJournalHasLines = true;
				}
				
			}
		}
		
	}
	nlapiLogExecution('DEBUG', stMethodName, 'checkLineItems Ended Succesfully');
	return (bJournalHasLines);
}


function getLineItemValues()
{
	var objResult = {};
	var intLineItemCount = nlapiGetLineItemCount('item');
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
		objLine['amount'] = parseFloat(nlapiGetLineItemValue('item', 'amount', i));
		objLine['item'] = nlapiGetLineItemValue('item', 'item', i);
		objLine['id'] = nlapiGetLineItemValue('item', 'id', i);
		objLine['exemptfrombilling'] = validateCheckboxField(nlapiGetLineItemValue('item', 'custcol_exempt_from_billing', i));
		objLine['department'] = nlapiGetLineItemValue('item', 'department', i);
		objLine['classid'] =  nlapiGetLineItemValue('item', 'class', i);
		objLine['location'] =  nlapiGetFieldValue('location');
		objLine['account'] =  nlapiGetLineItemValue('item', 'custcol_account', i);
		objLine['billingaccount'] =  nlapiGetLineItemValue('item', 'custcol_billing_discount', i);
		arrLineObj.push(objLine);
	}
	objResult['linearray'] = arrLineObj;
	return (objResult);
}
/**
 * Check for record line item changes.
 * 
 * @param recOld
 */
function checkLineItemChanges(recOld)
{
	var objResult = {};
	var bHasChanged = false;
	/*
	 * Get line item counts.
	 */
	var intOldRecLineItemCount = recOld.getLineItemCount('item');
	var intNewRecLineItemCount = nlapiGetLineItemCount('item');
	
	/*
	 * Store old.
	 */
	var objOldRec = {}
	for(var i=1; i<=intOldRecLineItemCount; i++)
	{
		var stTmpItemID = recOld.getLineItemValue('item', 'id', i);
		objOldRec[stTmpItemID] = {};
		objOldRec[stTmpItemID]['item'] = parseFloat(recOld.getLineItemValue('item', 'item', i));
		objOldRec[stTmpItemID]['amount'] = parseFloat(recOld.getLineItemValue('item', 'amount', i));
		objOldRec[stTmpItemID]['exemptfrombilling'] = validateCheckboxField(recOld.getLineItemValue('item', 'custcol_exempt_from_billing', i));
	}
	var arrNewLineObj = new Array();
	/*
	 * Compare each line item amount
	 */
	var arrOldLineCtr = new Array();
	for(var i=1; i<=intNewRecLineItemCount; i++)
	{
		var stTmpItem = nlapiGetLineItemValue('item', 'item', i);
		var stTmpItemID = nlapiGetLineItemValue('item', 'id', i);
		var flTmpAmount = parseFloat(nlapiGetLineItemValue('item', 'amount', i));
		var stExempt = validateCheckboxField(nlapiGetLineItemValue('item', 'custcol_exempt_from_billing', i));
		var stTmpOldLine = objOldRec[stTmpItemID];
		if(stTmpOldLine)
		{
			arrOldLineCtr.push(stTmpItemID);
			nlapiLogExecution('DEBUG', 'VALUE', 'checkLineItemChanges - Checking line ID: '+stTmpItemID
					+' stTmpOldLine.item: '+stTmpOldLine.item
					+' stTmpItem: '+stTmpItem
					+' stTmpOldLine.exemptfrombilling: '+stTmpOldLine.exemptfrombilling
					+' stExempt: '+stExempt
					+' stTmpOldLine.amount: '+stTmpOldLine.amount
					+' flTmpAmount: '+flTmpAmount);
			if(stTmpOldLine.item != stTmpItem || stTmpOldLine.exemptfrombilling != stExempt)
			{
				bHasChanged = true;
			}
			else
			{
				if(stTmpOldLine.amount != flTmpAmount && stExempt == 'F')//amount has changed.
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
			objLine['exemptfrombilling'] = validateCheckboxField(stExempt);
			objLine['department'] = nlapiGetLineItemValue('item', 'department', i);
			objLine['class'] =  nlapiGetLineItemValue('item', 'class', i);
			objLine['location'] =  nlapiGetFieldValue('location');
			objLine['class'] =  nlapiGetLineItemValue('item', 'class', i);
			objLine['account'] =  nlapiGetLineItemValue('item', 'custcol_account', i);
			objLine['billingaccount'] =  nlapiGetLineItemValue('item', 'custcol_billing_discount', i);
			arrNewLineObj.push(objLine);
			
		}
	}
	/*
	 * Check removed lines
	 */
	if(arrOldLineCtr.length!=intOldRecLineItemCount)
	{
		var intNewCount = arrOldLineCtr.length;
		for (var keyItemID in objOldRec) {
			if (objOldRec.hasOwnProperty(keyItemID)) {
				if(arrOldLineCtr.indexOf(keyItemID) == -1)
				{
					var objDeletedOldLine = objOldRec[keyItemID];
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
 * If check box value is empty, return 'F
 * @param stCheckBoxValue
 * @returns
 */
function validateCheckboxField(stCheckBoxValue)
{
	if(isEmpty(stCheckBoxValue))
	{
		return 'F';
	}
	return stCheckBoxValue;
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