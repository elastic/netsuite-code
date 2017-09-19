/**
 * Copyright (c) 1998-2015 NetSuite, Inc.
 * 2955 Campus Drive, Suite 100, San Mateo, CA, USA 94403-2511
 * All Rights Reserved.
 *
 * This software is the confidential and proprietary information of
 * NetSuite, Inc. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into
 * with NetSuite.
 */

/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.20       03 Aug 2016     mcabading		   Update: Added discount line now inherits account, & billings discount account of "parent" line IF HAS VALUE.
 * 											   Update: Added discount line now gets generated as long as "parent" HAS VALUE. (positive or negative)
 * 1.30       05 Aug 2016     mcabading		   Update: IF line amount is negative, then line discount amount SHOULD be a positive amount (and vice versa). 
 * 											           IF criteria PASS, ADD a discount line item
 *
 */


/** 
 *  End user (through web service/CSV/user interface) adds a line item to a Sales Order and updates a custom column Discount Amount
 *  The Sales Order is saved.
 *  A script reviews each line item and for each line item with Discount Amount > 0, the script will add a Discount Item underneath 
 *  the line item with an Amount = Discount Amount custom column from the line above.
 *
 * @author Aurel Shenne Sinsin
 * @version 1.0
 */
function beforeSubmit_addDiscountItem(stType)
{   
    try
    {   
        var stLoggerTitle = 'beforeSubmit_addDiscountItem';
        nlapiLogExecution('DEBUG', stLoggerTitle, '>>Entry<<');
        
        if (stType != 'create' && stType != 'edit')
        {
            nlapiLogExecution('DEBUG', stLoggerTitle, 'Type of Operation Unsupported. Exit. Type = ' + stType);
            return true;
        }
        
        var context = nlapiGetContext();
        
        // Determine the script parameters
        var stDiscItem = context.getSetting('SCRIPT', 'custscript_adi_disc_item');
        var stMissingDiscItemError = context.getSetting('SCRIPT', 'custscript_adi_missing_di_error');
        var stDiscAmtInternalId = context.getSetting('SCRIPT', 'custscript_adi_disc_amt_id');
        var stDiscAmtIsNotNumError = context.getSetting('SCRIPT', 'custscript_adi_disc_amt_nn_error');
        nlapiLogExecution('DEBUG', stLoggerTitle, 'stDiscItem = ' + stDiscItem
            + '\n <br /> stMissingDiscItemError = '+  stMissingDiscItemError
            + '\n <br /> stDiscAmtInternalId = '+  stDiscAmtInternalId
            + '\n <br /> stDiscAmtIsNotNumError = '+  stDiscAmtIsNotNumError);
        
        // If script parameters are missing
        var arrMissingScriptParams = [];
        if (isEmpty(stDiscItem))
        {
            arrMissingScriptParams.push('custscript_adi_disc_item');
        }
        if (isEmpty(stMissingDiscItemError))
        {
            arrMissingScriptParams.push('custscript_adi_missing_di_error');
        }
        if (isEmpty(stDiscAmtInternalId))
        {
            arrMissingScriptParams.push('custscript_adi_disc_amt_id');
        }
        if (isEmpty(stDiscAmtIsNotNumError))
        {
            arrMissingScriptParams.push('custscript_adi_disc_amt_nn_error');
        }
        
        // Throw error information so the script will not continue processing
        if (arrMissingScriptParams.length > 0)
        {
            nlapiLogExecution('ERROR', stLoggerTitle, 'Following script parameters are empty: ' + arrMissingScriptParams.toString());
            return;
        }
        
        // Get Record Id and Record Type
        var stRecordType = nlapiGetRecordType();
        var stRecordId = nlapiGetRecordId();
        nlapiLogExecution('DEBUG', stLoggerTitle, 'stRecordType = ' + stRecordType
            + '\n <br /> stRecordId = '+  stRecordId);
        
        // For each line item on Sales Order
        var arrDebugLines = [];
        var intLineItemCount = nlapiGetLineItemCount('item');
        for (var i = 1; i <= intLineItemCount; i++)
        {
            try
            {
                var bZeroOrEmpty = false;
                var bLastLine = false;
                if (i == intLineItemCount)
                {
                    bLastLine = true;
                }
                
                // Identify the Item on the next line
                var intNextLineNumber = i + 1;
                var stNextLineItem = nlapiGetLineItemValue('item', 'item', intNextLineNumber);
                
                var stRevrecstartdate = nlapiGetLineItemValue('item', 'revrecstartdate', i); // BLP - 2015/02/03 Added additional fields per customer request 
                var stRevrecenddate = nlapiGetLineItemValue('item', 'revrecenddate', i); // BLP - 2015/02/03 Added additional fields per customer request 
                var stLocation = nlapiGetLineItemValue('item', 'location', i); // BLP - 2015/02/03 Added additional fields per customer request 
                var stDepartment = nlapiGetLineItemValue('item', 'department', i); // BLP - 2015/02/03 Added additional fields per customer request 

                var stDiscAmount = nlapiGetLineItemValue('item', stDiscAmtInternalId, i);
                var stInputAmount = nlapiGetLineItemValue('item','amount',i); // BLP -2015/01/29 Added to log input values
                nlapiLogExecution('DEBUG', stLoggerTitle, 'Input Amount: ' + stInputAmount +'\n <br />' + 'line number: ' + i ); // BLP -2015/01/29 Added to log input values

                if (!isEmpty(stDiscAmount))
                {
                    // Check Discount Amount (custom) column for number
                    if (isNaN(stDiscAmount))
                    {
                        nlapiLogExecution('ERROR', stLoggerTitle, stDiscAmtIsNotNumError);
                    }
                    else
                    {
                        // If Discount Amount (custom) column > 0, then
                        var flDiscAmount = parseFloat(stDiscAmount);
    
                        // Check if next line item for Discount Item                        
//                        if (flDiscAmount > 0) // BLP - 20150128 - Should not be a positive value. Discounts are negative
//                        if (flDiscAmount < 0) // BLP - 20150128 - Should not be a positive value. Discounts are negative
                        if (validateDiscountAmount(flDiscAmount,stInputAmount))//mcabading 08052016
                        {
//                            flDiscAmount = flDiscAmount * -1; // Multiply Discount Amount by -1 // BLP - 20150128 - Unnecessary adjustment. flDiscAmount should always be negative

                            var stItem = nlapiGetLineItemValue('item', 'item', i);
                            // If the next line item is not the Discount Item then
                            if (stNextLineItem != stDiscItem)
                            {
                            	var stAccount = nlapiGetLineItemValue('item', 'custcol_account', i);//mcabading 08032016
                            	var stBillDiscAccount = nlapiGetLineItemValue('item', 'custcol_billing_discount', i);//mcabading 08032016
                            	
                                // Add discount item
                                nlapiInsertLineItem('item', intNextLineNumber);
                                nlapiSelectLineItem('item', intNextLineNumber);
                                nlapiSetCurrentLineItemValue('item', 'item', stDiscItem, true, true);
                                // Set Discount Item : Amount = Discount Amount (custom) column
                                nlapiSetCurrentLineItemValue('item', 'price', '-1', true, true);
                                nlapiSetCurrentLineItemValue('item', 'amount', processLineDiscountAmount(flDiscAmount), false, true);//mcabading 08052016
              
                                nlapiSetCurrentLineItemValue('item', 'revrecstartdate', stRevrecstartdate, false, true); // BLP - 2015/02/03 Added additional fields per customer request 
                                nlapiSetCurrentLineItemValue('item', 'revrecenddate', stRevrecenddate , false, true); // BLP - 2015/02/03 Added additional fields per customer request 
                                nlapiSetCurrentLineItemValue('item', 'location', stLocation , false, true); // BLP - 2015/02/03 Added additional fields per customer request 
                                nlapiSetCurrentLineItemValue('item', 'department', stDepartment , false, true); // BLP - 2015/02/03 Added additional fields per customer request 

                                if(!isEmpty(stAccount))//mcabading 08032016
                            	{
                                    nlapiSetCurrentLineItemValue('item', 'custcol_account', stAccount);
                            	}
                            	if(!isEmpty(stBillDiscAccount))//mcabading 08032016
                            	{
                                    nlapiSetCurrentLineItemValue('item', 'custcol_billing_discount', stBillDiscAccount);
                            	}
                            	
                                // Submit line item
                                nlapiCommitLineItem('item');
                                arrDebugLines.push(stItem + '|' + flDiscAmount + ', Adding Discount');
                                
                                i++; // Increment i so the next line item will be selected on the loop
                                intLineItemCount++; // Increment line item count so that the additional item lines are considered on the loop
                            }
                            else
                            {
                                // If Discount Item : Amount <> Discount Amount (custom) column, then
                                var flNextLineAmount = nlapiGetLineItemValue('item', 'amount', intNextLineNumber);
                                if (!bLastLine && flNextLineAmount != flDiscAmount)
                                {
                                    // Set Discount Item : Amount = Discount Amount (custom) column
                                    nlapiSelectLineItem('item', intNextLineNumber);
                                    nlapiSetCurrentLineItemValue('item', 'price', '-1', true, true);
                                    nlapiSetCurrentLineItemValue('item', 'amount', processLineDiscountAmount(flDiscAmount), false, true);//mcabading 08052016
                                    nlapiCommitLineItem('item');
                                    arrDebugLines.push(stItem + '|' + flDiscAmount + ', Updating Discount');
                                }
                            }
                        }
                        else
                        {
                            // If Discount Amount is 0, set remove line flag to true
                            bZeroOrEmpty = true;
                        }
                    }
                }
                else
                {
                    // If Discount Amount is empty, set remove line flag to true
                    bZeroOrEmpty = true;
                }
                
                // If current line is not the last line and remove line flag is true, remove the next line
                if (!bLastLine && bZeroOrEmpty)
                {
                    if (stNextLineItem == stDiscItem)
                    {
                        nlapiRemoveLineItem('item', intNextLineNumber);
                        intLineItemCount--;
                    }                    
                }
            }
            catch (error)
            {
                if (error.getDetails != undefined)
                {                    
                    nlapiLogExecution('ERROR', stLoggerTitle, 'Item #' + i + ' : ' + error.getCode() + ': ' + error.getDetails());
                }
                else
                {
                    nlapiLogExecution('ERROR', stLoggerTitle, error.toString());
                }
            }            
        }
        
        // Log Debug information
        nlapiLogExecution('DEBUG', stLoggerTitle, arrDebugLines.join('\n <br/>'));
        
        // Allow Sales Order record to save to the database
        
        nlapiLogExecution('DEBUG', stLoggerTitle, '>>Exit<<');
        return true;
    }
    catch (error)
    {
        if (error.getDetails != undefined)
        {
            nlapiLogExecution('ERROR','Process Error',error.getCode() + ': ' + error.getDetails());
            throw error;
        }
        else
        {
            nlapiLogExecution('ERROR','Unexpected Error',error.toString());
            throw nlapiCreateError('99999', error.toString());
        }
    }
}

/**
 * Function description:
 * Process discount amount based on its value.
 * @param stDiscountAmount
 * @returns {Float}
 */
function processLineDiscountAmount(stDiscountAmount)//mcabading 08052016
{
	if(isEmpty(stDiscountAmount))
	{
		return (0);
	}
	var flTmpDiscountAmount = parseFloat(stDiscountAmount);
	if(flTmpDiscountAmount!=0)
	{
		//return (flTmpDiscountAmount * -1);
		return (flTmpDiscountAmount * 1);
	}
}

/**
 * Function description:
 * Validates discount amount based on input amount value
 * @param stDiscountAmount
 * @param stInputAmount
 * @returns {Boolean}
 */
function validateDiscountAmount(stDiscountAmount,stInputAmount)//mcabading 08052016
{
	if(isEmpty(stDiscountAmount)||isEmpty(stInputAmount))
	{
		return (false);
	}
	var flTmpDiscountAmount = parseFloat(stDiscountAmount);
	var flTmpInputAmount = parseFloat(stInputAmount);
	if(flTmpInputAmount==0)
	{
		return (false);
	}
	else if(flTmpInputAmount>0)
	{
		if(flTmpDiscountAmount>0)
		{
			return (false);
		}
	}
	else if(flTmpInputAmount<0)
	{
		if(flTmpDiscountAmount<0)
		{
			return (false);
		}
	}
	return (true);
}

/**
 * Return true if value is null, empty string, or undefined
 * @param stValue
 * @returns {Boolean}
 */
function isEmpty(stValue)
{
    if ((stValue == '') || (stValue == null) ||(stValue == undefined))
    {
        return true;
    }
    return false;
}