/**
* Copyright (c) 1998-2012 NetSuite, Inc.
* 2955 Campus Drive, Suite 100, San Mateo, CA, USA 94403-2511
* All Rights Reserved.
*
* This software is the confidential and proprietary information of
* NetSuite, Inc. ("Confidential Information"). You shall not
* disclose such Confidential Information and shall use it only in
* accordance with the terms of the license agreement you entered into
* with NetSuite.
*
* 
* SCRIPT No: 1
* 
* @author Yassine Belhadi
* @version 1.0
*/
function copyDeptClassLoc(type)
{
   var arrayMaster = new Array();
   
   arrayMaster[0] = new Array();
   arrayMaster[1] = new Array();
   arrayMaster[2] = new Array();
   arrayMaster[3] = new Array();
   arrayMaster[4] = new Array();
   arrayMaster[5] = new Array(); 
   
   
   if ((type == 'create') || (type == 'edit'))
   {
   	var itemLineCount = nlapiGetLineItemCount('item');
	
	if (itemLineCount == 2) 
	{
		for (var i = 1; itemLineCount != null && i <= itemLineCount; i++) 
		{
			var stItemType = nlapiGetLineItemValue('item', 'itemtype', i);
			
			if (stItemType == 'Discount') 
			{
				if (i > 1) 
				{
					var stDept = nlapiGetLineItemValue('item', 'department', i - 1);
					var stClass = nlapiGetLineItemValue('item', 'class', i - 1);
					var stLoc = nlapiGetLineItemValue('item', 'location', i - 1);
					var stTax = nlapiGetLineItemValue('item', 'taxcode', i - 1);
					var accDisp = nlapiGetLineItemValue('item', 'custcol_account', i - 1);
					var billDisc = nlapiGetLineItemValue('item', 'custcol_billing_discount', i - 1);
					
					nlapiSetLineItemValue('item', 'department', i, stDept);
					nlapiSetLineItemValue('item', 'class', i, stClass);
					nlapiSetLineItemValue('item', 'location', i, stLoc);
					nlapiSetLineItemValue('item', 'taxcode', i, stTax);
					nlapiSetLineItemValue('item', 'custcol_account', i, accDisp);
					nlapiSetLineItemValue('item', 'custcol_billing_discount', i, billDisc);
				}
				else 
				{
					var stDept = nlapiGetLineItemValue('item', 'department', i);
					var stClass = nlapiGetLineItemValue('item', 'class', i);
					var stLoc = nlapiGetLineItemValue('item', 'location', i);
					var stTax = nlapiGetLineItemValue('item', 'taxcode', i);
					var accDisp = nlapiGetLineItemValue('item', 'custcol_account', i);
					var billDisc = nlapiGetLineItemValue('item', 'custcol_billing_discount', i);
					
					nlapiSetLineItemValue('item', 'department', i - 1, stDept);
					nlapiSetLineItemValue('item', 'class', i - 1, stClass);
					nlapiSetLineItemValue('item', 'location', i - 1, stLoc);
					nlapiSetLineItemValue('item', 'taxcode', i - 1, stTax);
					nlapiSetLineItemValue('item', 'custcol_account', i - 1, accDisp);
					nlapiSetLineItemValue('item', 'custcol_billing_discount', i - 1, billDisc);
				}
			}
			else 
			{
				setRevRecDates(nlapiGetLineItemValue('item', 'item', i), stItemType, i);
			}
		}
	}
	else 
	{
		var subArrayCount1 = 0;
		var subArrayCount2 = 0;
		var subArrayCount3 = 1;
		var tracker = 0;
		if (itemLineCount > 2) 
		{
			for (var t = 1; itemLineCount != null && t <= itemLineCount; t++) 
			{
				var stItemType = nlapiGetLineItemValue('item', 'itemtype', t);
				if (stItemType !== 'Discount') 
				{
					arrayMaster[0][subArrayCount1] = nlapiGetLineItemValue('item', 'department', t);
					arrayMaster[1][subArrayCount1] = nlapiGetLineItemValue('item', 'class', t);
					arrayMaster[2][subArrayCount1] = nlapiGetLineItemValue('item', 'location', t);
					arrayMaster[3][subArrayCount1] = nlapiGetLineItemValue('item', 'taxcode', t);
					arrayMaster[4][subArrayCount1] = nlapiGetLineItemValue('item', 'custcol_account', t);
					arrayMaster[5][subArrayCount1] = nlapiGetLineItemValue('item', 'custcol_billing_discount', t);
					subArrayCount1++;
					setRevRecDates(nlapiGetLineItemValue('item','item',t), stItemType, t);
				}
				
			}
			
			for (var k = 1; itemLineCount != null && k <= itemLineCount; k++) 
			{
				var stItemType = nlapiGetLineItemValue('item', 'itemtype', k);
				if (stItemType == 'Discount') 
				{
					try {
						if (!isEmpty(arrayMaster[0][subArrayCount2])) {
							nlapiSetLineItemValue('item', 'department', k, arrayMaster[0][subArrayCount2]);
						}
						
						if (!isEmpty(arrayMaster[1][subArrayCount2])) {
							nlapiSetLineItemValue('item', 'class', k, arrayMaster[1][subArrayCount2]);
						}
						
						if (!isEmpty(arrayMaster[2][subArrayCount2])) {
							nlapiSetLineItemValue('item', 'location', k, arrayMaster[2][subArrayCount2]);
						}
						
						if (!isEmpty(arrayMaster[3][subArrayCount2])) {
							nlapiSetLineItemValue('item', 'taxcode', k, arrayMaster[3][subArrayCount2]);
						}
						
						if (!isEmpty(arrayMaster[4][subArrayCount2])) {
							nlapiSetLineItemValue('item', 'custcol_account', k, arrayMaster[4][subArrayCount2]);
						}
						
						if (!isEmpty(arrayMaster[5][subArrayCount2])) {
							nlapiSetLineItemValue('item', 'custcol_billing_discount', k, arrayMaster[5][subArrayCount2]);
						}
					} 
					catch (err) {
					}
					subArrayCount2++;
				}	
			}
		}
		else
		{
			setRevRecDates(nlapiGetLineItemValue('item','item',1), stItemType, 1);
		}
		
		
		if (subArrayCount2 > subArrayCount1) {
			var remDiscountItems = (subArrayCount2 - subArrayCount1);
			
			for (var p = 1; itemLineCount != null && p <= itemLineCount; p++) {
				
				var stItemType = nlapiGetLineItemValue('item', 'itemtype', p);
				
				if (stItemType == 'Discount') {
					if (subArrayCount3 > subArrayCount1) {
						try {
							if (tracker > (subArrayCount1 - 1))
							{
								tracker = 0;
							}
							if (!isEmpty(arrayMaster[0][tracker])) {
								nlapiSetLineItemValue('item', 'department', p, arrayMaster[0][tracker]);
							}
							
							if (!isEmpty(arrayMaster[1][tracker])) {
								nlapiSetLineItemValue('item', 'class', p, arrayMaster[1][tracker]);
							}
							
							if (!isEmpty(arrayMaster[2][tracker])) {
								nlapiSetLineItemValue('item', 'location', p, arrayMaster[2][tracker]);
							}
							
							if (!isEmpty(arrayMaster[3][tracker])) {
								nlapiSetLineItemValue('item', 'taxcode', p, arrayMaster[3][tracker]);
							}
							
							if (!isEmpty(arrayMaster[4][tracker])) {
								nlapiSetLineItemValue('item', 'custcol_account', p, arrayMaster[4][tracker]);
							}
							
							if (!isEmpty(arrayMaster[5][tracker])) {
								nlapiSetLineItemValue('item', 'custcol_billing_discount', p, arrayMaster[5][tracker]);
							}
							tracker++;
						} 
						catch (err) {
						}
					}
					subArrayCount3++
				}
				
			}
		}
	}
  }
}

	/** ALL SUB FUNCTIONS ***************************************************************************************************/

function isEmpty(stValue)
{ 
    if ((stValue == '') || (stValue == null) || (stValue == undefined)) {
		return true;
	}
    
    return false;
}

function setRevRecDates(item, itemType, pos)
{
	if (itemType != 'Discount')
	{
		try {
			var itemRec = nlapiLoadRecord('noninventoryitem', item);
		}
		catch (err)
		{
			var itemRec = nlapiLoadRecord('serviceitem', item);
		}
		var itStDate = itemRec.getFieldValue('custitem_rev_rec_start_date');
		var itEnDate = itemRec.getFieldValue('custitem_rev_rec_end_date');
		var itRevTemplate = itemRec.getFieldValue('revrecschedule');
		
		if (!isEmpty(itStDate)) {
			nlapiSetLineItemValue('item', 'revrecstartdate', pos, itStDate);
		}
		if (!isEmpty(itEnDate)) {
			nlapiSetLineItemValue('item','revrecenddate',pos,itEnDate);
		}
		if (!isEmpty(itRevTemplate)) {
			nlapiSetLineItemValue('item','revrecschedule',pos, itRevTemplate);
		}
		
	}
}