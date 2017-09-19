function updateRecord(datain)  
{  
    //nlapiLogExecution('DEBUG','recordtype='+datain.recordtype);  
    //nlapiLogExecution('DEBUG','id='+datain.id);  
	//nlapiLogExecution('DEBUG','column='+datain.column);  
	//nlapiLogExecution('DEBUG','value='+datain.value);
	
	//return nlapiSubmitField(datain.recordtype, datain.id, datain.column, datain.value);  
	
    var recordId = nlapiSubmitField(datain.recordtype, datain.id, datain.column, datain.value);
    nlapiLogExecution('DEBUG','id='+recordId);  
     
    var nlobj = nlapiLoadRecord(datain.recordtype,recordId);  
    return nlobj;  
}

function getRecord(datain)  
{  
    //nlapiLogExecution('DEBUG','recordtype='+datain.recordtype);  
    //nlapiLogExecution('DEBUG','id='+datain.id);  
	//nlapiLogExecution('DEBUG','searchcolumn='+datain.searchcolumn);  
    
	var record = nlapiLoadRecord(datain.recordtype, datain.id);
	
	if(datain.searchcolumn==undefined) {
		return nlapiLoadRecord(datain.recordtype, datain.id);
	}
	else
	{
		var searchcolumnsplit = datain.searchcolumn.split(",");
	
		var columns = new Array();
		
		var returnjson = {};
	
		for(var i=0; i<searchcolumnsplit.length; i++) {
			
			//nlapiLogExecution('DEBUG','indexof='+searchcolumnsplit[i].indexOf("."));  
			
			if(searchcolumnsplit[i].indexOf(".") !== -1) {
				
				var sublist = searchcolumnsplit[i].split(".");
				
				columns[i] = record.getLineItemValue(sublist[0],sublist[1],1);
				
				//nlapiLogExecution('DEBUG','sublist[0]='+sublist[0]);  
				//nlapiLogExecution('DEBUG','sublist[1]='+sublist[1]);  
				
			} 
			else
			{
				columns[i] = record.getFieldValue(searchcolumnsplit[i]);
				
				returnjson[searchcolumnsplit[i]] = record.getFieldValue(searchcolumnsplit[i]);
			}
		}
		
		return returnjson;
	}
  		
     // e.g recordtype="customer", id="769"  
}  
  
// Create a standard NetSuite record  
function createRecord(datain)  
{  
    var err = new Object();  
     
    // Validate if mandatory record type is set in the request  
    if (!datain.recordtype)  
    {  
        err.status = "failed";  
        err.message= "missing recordtype";  
        return err;  
    }  
     
    var record = nlapiCreateRecord(datain.recordtype);  
     
    for (var fieldname in datain)  
    {  
     if (datain.hasOwnProperty(fieldname))  
     {  
         if (fieldname != 'recordtype' && fieldname != 'id')  
         {  
             var value = datain[fieldname];  
             if (value && typeof value != 'object') // ignore other type of parameters  
             {  
                 record.setFieldValue(fieldname, value);  
             }  
         }  
     }  
    }  
    var recordId = nlapiSubmitRecord(record);  
    nlapiLogExecution('DEBUG','id='+recordId);  
     
    var nlobj = nlapiLoadRecord(datain.recordtype,recordId);  
    return nlobj;  
}  