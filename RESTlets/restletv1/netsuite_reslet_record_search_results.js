function searchRecord(datain)  
{  
	var rows = 1;
    //nlapiLogExecution('DEBUG','recordtype='+datain.recordtype);  
	//nlapiLogExecution('DEBUG','searchtype='+datain.searchtype);  
	//nlapiLogExecution('DEBUG','searchvalue='+datain.searchvalue);
	//nlapiLogExecution('DEBUG','searchoperator='+datain.searchoperator); 
	//nlapiLogExecution('DEBUG','searchcolumn='+datain.searchcolumn);    
	//nlapiLogExecution('DEBUG','rows='+datain.rows);  
	
	var resultset = new Array();
	
	if(datain.searchtype==undefined||datain.searchvalue==undefined) {
		var filters = null;
	}
	else {
		var filters = new Array();
		var subfilters = new Array();
		
		var i=0;
		
		var valuesplit = datain.searchvalue.split(",");
		
		for(i=0; i<valuesplit.length; i++) {
			
			if(i!=0){
				subfilters.push('or');
			}
				
				if(datain.searchcolumn=='internalid'){ 	
					subfilters.push([datain.searchtype,datain.searchoperator,parseInt(valuesplit[i])]);
					
					//subfilters[i] = new nlobjSearchFilter(datain.searchtype,null,datain.searchoperator,parseInt(valuesplit[i])).setOr(true);
				} else {
					//subfilters[i] = new nlobjSearchFilter(datain.searchtype,null,datain.searchoperator,valuesplit[i]).setOr(true);
					subfilters.push([datain.searchtype,datain.searchoperator,valuesplit[i]]);
				}
				
		}
		
		filters.push(subfilters);
		
		if(datain.mainline!=undefined) {
			filters.push('and');
			filters.push(['mainline','is','T']);
			//filters.push(new nlobjSearchFilter('mainline', null, 'is', 'T'));
		}
		
		nlapiLogExecution('DEBUG','filters='+filters);  
	}
	
	if(datain.searchcolumn==undefined) {
		var columns = null;
	}
	else
	{
		var searchcolumnsplit = datain.searchcolumn.split(",");
	
		var columns = new Array();
	
		for(var i=0; i<searchcolumnsplit.length; i++) {
	
			columns[i] = new nlobjSearchColumn(searchcolumnsplit[i]);
		}
	}
	
	var searchresults = nlapiSearchRecord(datain.recordtype, null, filters, columns);
	
	var rows = new Array();
	
	if(searchresults) {
	    rows = rows.concat(searchresults);
		
		nlapiLogExecution('DEBUG','rows='+rows.length);
		
	    while(searchresults!=null && searchresults.length == 1000) {
			
	        var lastId=searchresults[999].getId();
			
			nlapiLogExecution('DEBUG','lastId='+lastId);
			
			if(filters==null) {
			
		        searchresults = nlapiSearchRecord(
		            datain.recordtype, 
		            null, 
		            [
		                new nlobjSearchFilter("internalIdNumber", null, "greaterThan", lastId)
		            ], 
		            columns
		        );
				
			} else {
				
				//filters.push(new nlobjSearchFilter("internalIdNumber", null, "greaterThan", lastId));
				
		        searchresults = nlapiSearchRecord(
		            datain.recordtype, 
		            null, 
					filters.concat(["internalIdNumber", "greaterThan", lastId]),
		            //filters.concat([new nlobjSearchFilter("internalIdNumber", null, "greaterThan", lastId)]), 
		            columns
				);
				
			}
			
	        if(searchresults) {
	            rows = rows.concat(searchresults);
				nlapiLogExecution('DEBUG','rows='+rows.length);
	        }
	    }
	}
	
	return rows;
}  