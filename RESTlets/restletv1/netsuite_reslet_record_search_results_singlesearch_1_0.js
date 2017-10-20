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
		// Check if search type and value is empty, hence return all
		var filters = null;
	}
	else {
		var filters = new Array();
		//var subfilters = new Array();
		
		var i=0;
		var j=0;
		var k=0;
		
		// Check if there are multiple search operators
		var operatorsplit = datain.searchoperator.split(",");
		
		for(k=0; k<operatorsplit.length; k++) {
			
			var searchoperatorvalue = operatorsplit[k];
		
			// Check if there are multiple search filters
			var typesplit = datain.searchtype.split(",");
		
			for(j=0; j<typesplit.length; j++) {
			
				var searchtypevalue = typesplit[j];
		    
				// Check if there are multiple search values
				var valuesplit = datain.searchvalue.split(",");
		
				for(i=0; i<valuesplit.length; i++) {
					/*
					if(i!=0){
						subfilters.push('or');
					}
						*/
				    // Check if the search filter is a join type
					var valuejoin = searchtypevalue.split(".");
			
					if(valuejoin.length>1) {
				
						var join = valuejoin[0];
						var joinvalue = valuejoin[1];
				
					} else {
						var join = null;
						var joinvalue = valuejoin[0];
					} 
			
					// Check if the search filter is matching to the search value
					if(i==j && j==k) {
					
						if(datain.searchcolumn=='internalid'){ 	
							//subfilters.push([datain.searchtype,datain.searchoperator,parseInt(valuesplit[i])]);
							filters[i] = new nlobjSearchFilter(joinvalue,join,searchoperatorvalue,parseInt(valuesplit[i])).setOr(false);
							nlapiLogExecution('DEBUG','filters='+filters);  
						} else {
							filters[i] = new nlobjSearchFilter(joinvalue,join,searchoperatorvalue,valuesplit[i]).setOr(false);
							//filters.push([datain.searchtype,datain.searchoperator,valuesplit[i]]);
							nlapiLogExecution('DEBUG',joinvalue+','+join+','+searchoperatorvalue+','+valuesplit[i]);  
						}				
					}
				}
		
				//filters.push(subfilters);
			}
		}
		// Check if we should filter on mainline
		if(datain.mainline!=undefined) {
			//filters.push('and');
			//filters.push(['mainline','is','T']);
			filters.push(new nlobjSearchFilter('mainline', null, 'is', 'T'));
		}
	
		//nlapiLogExecution('DEBUG','filters='+filters);  
	}
	
	// Check if the return columns is undefined, return all if empty
	
	if(datain.searchcolumn==undefined) {
		var columns = null;
	}
	else
	{
		// Parse the return column list and add each column 
		var searchcolumnsplit = datain.searchcolumn.split(",");
	
		var columns = new Array();
		
		columns[i] = new nlobjSearchColumn('internalid',null).setSort(true);
	
		for(var i=0; i<searchcolumnsplit.length; i++) {
			
			// Parse the return column list and see if its a join return column
			var valuejoin = searchcolumnsplit[i].split(".");
			
			if(valuejoin.length>1) {
				
				var join = valuejoin[0];
				var joinvalue = valuejoin[1];
				
			} else {
				var join = null;
				var joinvalue = valuejoin[0];
			} 
			
			
			columns[i] = new nlobjSearchColumn(joinvalue,join);
		}
		
		columns[i] = new nlobjSearchColumn('internalid',null).setSort(false);
	}
	
	// Perform the search
	var searchresults = nlapiSearchRecord(datain.recordtype, null, filters, columns);
	
	var rows = new Array();
	
	if(searchresults) {
	    rows = rows.concat(searchresults);
		
		nlapiLogExecution('DEBUG','rows='+rows.length);
		
		// If more than 1000 rows, loop until there are less than 1000 rows returned
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
		            [
		                new nlobjSearchFilter("internalIdNumber", null, "greaterThan", lastId),
						filters[0]
		            ],
		            columns
				);
				
			}
			
	        if(searchresults) {
	            rows = rows.concat(searchresults);
				nlapiLogExecution('DEBUG','rows='+rows.length);
	        }
	    }
	}
	
	// Return the results
	return rows;
}  