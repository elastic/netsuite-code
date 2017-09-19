function copyDeptClassLoc(type, name)
{
   if (type != 'item') 
   {
       return true;
   }
   
   if(nlapiGetCurrentLineItemIndex('item') == 1)
   {
       return true;
   }
   
   var stItemType = nlapiGetCurrentLineItemValue('item','itemtype');
   
   if(stItemType!='Discount')
   {
          return true;
   }
   
   //get the value of item, class and department on the first line of SO or Invoice   
   var index = nlapiGetCurrentLineItemIndex('item');   
   var stDept = nlapiGetLineItemValue('item', 'department', index-1);
   var stClass = nlapiGetLineItemValue('item', 'class', index-1);
   var stLoc = nlapiGetLineItemValue('item', 'location', index-1);
   var stTax = nlapiGetLineItemValue('item','taxcode',index-1);
   
   //set the value of department, class and location based from above
   nlapiSetCurrentLineItemValue('item', 'department', stDept, false, true);
   nlapiSetCurrentLineItemValue('item', 'class', stClass, false, true);
   nlapiSetCurrentLineItemValue('item', 'location', stLoc, false, true);
   nlapiSetCurrentLineItemValue('item', 'taxcode', stTax, false, true);
   
   return true;
}