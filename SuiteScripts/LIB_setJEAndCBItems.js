/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.10       29 Mar 2016     mcabading		   Updated implementation. Now referenced object array instead of sublist.
 * 1.20       10 Jun 2016     mcabading		   Added checking for workflow specific function parameter 'type'.
 * 1.30       11 Jul 2016     mcabading		   Added discount item account identification logic.
 *
 */
//var INTERNALID_CONTRABILL = 178;
//var CUSTOMCOL_ACCOUNT = 'custcol_account';
//var CUSTOMCOL_ACCOUNT_DISCOUNT = 'custcol_billing_discount';
//var CUSTBODY_BOOKING = 'custbody_booking';

function checkLineItems(arrayLines, recJournal, strCustId)
{
	nlapiLogExecution('DEBUG', 'ACTIVITY', 'checkLineItems Started...');
	var flAmount = 0;
	var billLine = '';
	var contrabillLine = '';
	var intLine = 1;
	var bJournalHasLines = false;
	var stRecordType = nlapiGetRecordType();
	
	var objPrevLine = null;//mcabading 07112016
	for(var i=0;i<arrayLines.length;i++)
	{
		nlapiLogExecution('DEBUG', 'ACTIVITY', 'checking line item# '+(i+1));
		
		var objLine = arrayLines[i];
		var stExemptBilling = validateCheckboxField(objLine.exemptfrombilling);
		nlapiLogExecution('DEBUG', 'ACTIVITY', 'stExemptBilling: '+stExemptBilling);
		if(stExemptBilling == 'F')
		{
			var stDepartment = objLine.department;
			var stClass = objLine.classid;
			var stLocation = objLine.location;
			nlapiLogExecution('DEBUG', 'ACTIVITY', 'stDepartment: '+stDepartment+
					'stClass: '+stClass+
					'stLocation: '+stLocation);
			if(isEmpty(stDepartment)==false && isEmpty(stLocation)==false)//validate mandatory JE line fields.
			{
				nlapiLogExecution('DEBUG', 'ACTIVITY', 'creating JE lines for item# '+(i+1) +'obj line amount:' +objLine.amount);
				var stItem = objLine.item;
				flAmount = parseFloat(objLine.amount);
				var stLineAccount = null;
				var objItemType = nlapiLookupField('item', stItem, ['recordtype']);
				var stItemType = objItemType.recordtype;

				nlapiLogExecution('DEBUG', 'ACTIVITY', 'Item Type: '+stItemType+', Record Type: '+stRecordType);
				
				/*
				 * Identify line reversal and account. mcabading 07112016
				 */
				if(stItemType != 'discountitem')
				{
					if(Eval.inArray(stRecordType,['invoice','INVOICE']) && flAmount > 0)//mcabading 06102016 
					{
						billLine = 'credit';
						contrabillLine = 'debit';
					}else
					{
						billLine = 'debit';
						contrabillLine = 'credit';
					}
					stLineAccount = objLine.account;
					
					/*
					 * Store non-discount line. mcabading 07112016
					 */
					objPrevLine = objLine;
					
				}else
				{
					if(Eval.inArray(stRecordType,['invoice','INVOICE']) && flAmount < 0)//mcabading 06102016 
					{
						billLine = 'debit';
						contrabillLine = 'credit';
						nlapiLogExecution('DEBUG', 'ACTIVITY', 'flmount: '+flAmount);
					}else
					{
						billLine = 'credit';
						contrabillLine = 'debit';
					}

					/*
					 * Set Discount Item Account - mcabading 07112016
					 */
					if(!isEmpty(objLine.billingaccount))
					{
						stLineAccount = objLine.billingaccount;
					}
					else if(objPrevLine)
					{
						if(!isEmpty(objPrevLine.billingaccount))
						{
							stLineAccount = objPrevLine.billingaccount;
						}
						else if(!isEmpty(objPrevLine.account))
						{
							stLineAccount = objPrevLine.account;
						}
					}//mcabading 07112016 - END
				}
				if(isEmpty(stLineAccount)==false)//If line item has set account. proceed.
				{
					flAmount = Math.abs(flAmount);
					recJournal.setLineItemValue('line', 'account', intLine, stLineAccount);
					recJournal.setLineItemValue('line', billLine, intLine, nlapiFormatCurrency(flAmount)); //Updated by Shraddha on 2/15
					recJournal.setLineItemValue('line', 'entity', intLine, strCustId);
					recJournal.setLineItemValue('line', 'department', intLine, stDepartment);
					if(isEmpty(stClass)==false)
					{
						recJournal.setLineItemValue('line', 'class', intLine, stClass);
					}
					recJournal.setLineItemValue('line', 'location', intLine, stLocation);
					intLine++;
					
					recJournal.setLineItemValue('line', 'account', intLine, '178');
					recJournal.setLineItemValue('line', contrabillLine, intLine,nlapiFormatCurrency(flAmount));
					recJournal.setLineItemValue('line', 'entity', intLine, strCustId);
					recJournal.setLineItemValue('line', 'department', intLine, stDepartment);
					if(isEmpty(stClass)==false)
					{
						recJournal.setLineItemValue('line', 'class', intLine, stClass);
					}
					recJournal.setLineItemValue('line', 'location', intLine, stLocation);
					intLine++;
					
					bJournalHasLines = true;
				}
				
			}
			
		}
	}
	nlapiLogExecution('DEBUG', 'ACTIVITY', 'checkLineItems Ended Succesfully');
	return (bJournalHasLines);
}

//function setContraBilling(recJournal, strCustId, fltTotal, intLastLine, contrabilLine)
//{
//	nlapiLogExecution('DEBUG', 'ACTIVITY', 'setContraBilling Started...');
//	nlapiLogExecution('DEBUG', 'VALUE', 'Contra Billing Amount: '+fltTotal);
//	var strJournalType = 'line';
//	recJournal.setLineItemValue(strJournalType, 'account', intLastLine, INTERNALID_CONTRABILL);
//	recJournal.setLineItemValue(strJournalType, contrabilLine, intLastLine,nlapiFormatCurrency(parseFloat(fltTotal)));
//	recJournal.setLineItemValue(strJournalType, 'entity', intLastLine, strCustId);
//	recJournal.setLineItemValue(strJournalType, 'department', intLastLine, recJournal.getLineItemValue(strJournalType, 'department', intLastLine-1));
//	recJournal.setLineItemValue(strJournalType, 'class', intLastLine, recJournal.getLineItemValue(strJournalType, 'class', intLastLine-1));
//	recJournal.setLineItemValue(strJournalType, 'location', intLastLine, recJournal.getLineItemValue(strJournalType, 'location', intLastLine-1));
//	nlapiLogExecution('DEBUG', 'ACTIVITY', 'setContraBilling Ended Succesfully');
//}

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

var Eval =
{
	/**
	 * Evaluate if the given string or object value is empty, null or undefined.
	 * @param {String} stValue - string or object to evaluate
	 * @returns {Boolean} - true if empty/null/undefined, false if not
	 * @author mmeremilla
	 */
	isEmpty : function(stValue)
	{
		if ((stValue == '') || (stValue == null) || (stValue == undefined))
		{
			return true;
		}
		else
		{
			if ( typeof stValue == 'string')
			{
				if ((stValue == ''))
				{
					return true;
				}
			}
			else
				if ( typeof stValue == 'object')
				{
					if (stValue.length == 0 || stValue.length == 'undefined')
					{
						return true;
					}
				}

			return false;
		}
	},

	/**
	 * Evaluate if the given string is an element of the array
	 * @param {String} stValue - String value to find in the array
	 * @param {Array} arrValue - Array to be check for String value
	 * @returns {Boolean} - true if string is an element of the array, false if not
	 */
	inArray : function(stValue, arrValue)
	{
		var bIsValueFound = false;

		for (var i = 0; i < arrValue.length; i ++)
		{
			if (stValue == arrValue[i])
			{
				bIsValueFound = true;
				break;
			}
		}

		return bIsValueFound;
	},
};