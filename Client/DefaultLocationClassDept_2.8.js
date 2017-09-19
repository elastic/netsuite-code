function postSourcing_DefaultLocationClassDept(type,name)
{
  if(type!='item') //&& type!='expense')
  {
      return true;
  }
  
  
  if(name!='item') //&& name!='account')
  {
      return true;
  }
  
  var stVendor = nlapiGetFieldValue('entity');
  
  if(!stVendor)
  {
      return true;
  }
     

  var arrVendor = nlapiLookupField('vendor',stVendor,['custentity_department','custentity_location']);
  
  if(!arrVendor)
  {
     return true;
  }
  
  var stVendDept  = arrVendor.custentity_department;
  var stVendLoc   = arrVendor.custentity_location;
  
  //alert(stVendDept + ' ' + stVendLoc);
  
  //if(name=='item')
  //{
  var stItem = nlapiGetCurrentLineItemValue('item','item');

  if(!stItem)
  {
       return true;
  }
  
  //alert('item');
  nlapiSetCurrentLineItemValue('item','department',stVendDept,true,true);
  nlapiSetCurrentLineItemValue('item','location',stVendLoc,true,true);
  //}
  
  /*
  else
  {
      var stAcct = nlapiGetCurrentLineItemValue('expense','account');
 
      if(!stAcct)
      {
           return true;
      }
      
      //alert('expense');
      nlapiSetCurrentLineItemValue('expense','department',stVendDept,true,true);
      nlapiSetCurrentLineItemValue('expense','location',stVendLoc,true,true);
  }*/
  
  return true;
}



function validateLine_DefaultExpenseFields(type)
{
    if(type!='expense') //&& type!='expense')
    {
      return true;
    }
    
    //var isChanged = nlapiGetCurrentLineItemValue('expense','custcol_is_changed');
    //var stTaxCode = nlapiGetCurrentLineItemValue('expense','taxcode');
    //var stAmount = nlapiGetCurrentLineItemValue('expense','amount');
    
    //if(isChanged=='T' && (!stTaxCode || !stAmount))
    //{
        //return true;
    //}
    
    var stVendor = nlapiGetFieldValue('entity');
  
    if(!stVendor)
    {
        return true;
    }
    
    var arrVendor = nlapiLookupField('vendor',stVendor,['custentity_department','custentity_location']);
  
    if(!arrVendor)
    {
       return true;
    }
    
    var stAcct = nlapiGetCurrentLineItemValue('expense','account');
    
    if(!stAcct)
    {
        return true;
    }
    
    var stVendDept  = arrVendor.custentity_department;
    var stVendLoc   = arrVendor.custentity_location;
    
    var stCurrDept  = nlapiGetCurrentLineItemValue('expense','department');
    var stCurrLoc   = nlapiGetCurrentLineItemValue('expense','location');
    
    //alert('stVendDept=' + stVendDept);
    //alert('stVendLoc=' + stVendLoc);
   //alert('stCurrDept=' + stCurrDept);
   // alert('stCurrLoc=' + stCurrLoc);
    
    (stCurrDept!=null && stCurrDept!=undefined && stCurrDept!='') ? nlapiSetCurrentLineItemValue('expense','department',stCurrDept,true,true) : 
                                                                    nlapiSetCurrentLineItemValue('expense','department',stVendDept,true,true);
    
    (stCurrLoc!=null && stCurrLoc!=undefined && stCurrLoc!='') ? nlapiSetCurrentLineItemValue('expense','location',stCurrLoc,true,true) : 
                                                                 nlapiSetCurrentLineItemValue('expense','location',stVendLoc,true,true);
    return true;
}


/*
function fieldChange_SetIsChanged(type,name,line)
{
    if(type!='expense')
    {
        return true;
    }
    
    if(name!='department' && name!='location')
    {
        return true;
    }
    
    nlapiSetCurrentLineItemValue('expense','custcol_is_changed','T','','');
    
    return true;
}*/
