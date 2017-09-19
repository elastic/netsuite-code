/* -------------------------------------------------------------------------------------------------------
*	
Function:	Sets the RevRec Start Date to the transaction date when item is selected.

Functionality:
Sets the RevRec Start Date to the transaction date when item is selected.

Deployment:
The script can be deployed on Sales form .

Event triggering the script:
It is called on the field change event item field .( Field Change function )

Custom Fields:
+------------------------------------------------------------------------------------------------------+
| S. No.|		Id			|	  Type			|	Level	|		Description							
+------------------------------------------------------------------------------------------------------+
No custom fields Required																					
*-----------------------------------------------------------------------------------------------------------
*/

// Global Variables
{
	var debugFieldChange = false ;
}

function setRevRecDate(type,name)
{
	if(type == 'item')
	{  
		
		if(name == 'item')
		{
			
			var stRevRecStartDate = nlapiGetCurrentLineItemValue('item','custcol_item_rev_rec_start');
			var stRevRecEndDate = nlapiGetCurrentLineItemValue('item','custcol_item_rev_rec_end');
			
			nlapiSetCurrentLineItemValue('item', 'revrecstartdate',stRevRecStartDate);
			nlapiSetCurrentLineItemValue('item', 'revrecenddate',stRevRecEndDate);
		}
          }
	   return true;
}