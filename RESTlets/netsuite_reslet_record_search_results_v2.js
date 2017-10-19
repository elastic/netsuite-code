/**
*	RESTlet
*	Summary : Resturns a search dynamiclaly based on the request
					v2 option allows user to specify a cached search id
*
*	required : netsuite_restlet_LIBRARY.js
*
* TODO: Need to update the script setting variables to match script deployment
* TODO: need to test more than 1000 results because I modified the sortorder
**/
var RestSearch = {
	fromEmail : context.getSetting('SCRIPT', 'custscript_file_fromemail') || null,
	toEmail : context.getSetting('SCRIPT', 'custscript_file_toemails').replace(/\s+/g, '').split(',') || null, //should be comma sep list
	search:function(datain){

		//nlapiLogExecution('DEBUG','recordtype='+datain.recordtype);  
		//nlapiLogExecution('DEBUG','searchtype='+datain.searchtype);  
		//nlapiLogExecution('DEBUG','searchvalue='+datain.searchvalue);
		//nlapiLogExecution('DEBUG','searchoperator='+datain.searchoperator); 
		//nlapiLogExecution('DEBUG','searchcolumn='+datain.searchcolumn);    
		//nlapiLogExecution('DEBUG','rows='+datain.rows);  
		try{
			var resultset = [],
					filters = [],
					columns = [],
					subfilters = [],
					rows = [],
					searchid = datain.searchid || null;
			//if we have search filters, build up a filter search expresion
			if(datain.searchtype && datain.searchvalue) {
				var valuesplit = datain.searchvalue.split(",");
				for(var i=0, ii = valuesplit.length; i<ii; i++) {
					if(i!=0){
						subfilters.push('or');
					}
					if(datain.searchcolumn=='internalid'){ 	
						subfilters.push([datain.searchtype,datain.searchoperator,parseInt(valuesplit[i])]);
					}else{
						subfilters.push([datain.searchtype,datain.searchoperator,valuesplit[i]]);
					}
				}

				filters.push(subfilters);

				if(datain.mainline) {
					filters.push('and');
					filters.push(['mainline','is','T']);
				}

				nlapiLogExecution('DEBUG','filters='+filters);  
			}
			//if we have columns, add them to the search
			if(datain.searchcolumn){
				var searchcolumnsplit = datain.searchcolumn.split(",");
				for(var i=0, ii = searchcolumnsplit.length; i<ii; i++) {
					columns.push(new nlobjSearchColumn(searchcolumnsplit[i]));
				}
			}
			//make sure that the results are sorted by internal id number
				columns.push(new nlobjSearchColumn('internalid').setSort(true));
			// run the search
			var searchresults = nlapiSearchRecord(datain.recordtype, searchid, filters, columns);

			if(searchresults) {
				//adding the search results to the rows var
				rows = rows.concat(searchresults);
				// nlapiLogExecution('DEBUG','rows='+rows.length);
				//search only returns 1000 at a time, keep running the search until all results returned
				while(searchresults!=null && searchresults.length == 1000) {
					var lastId=searchresults[999].getId();
					// nlapiLogExecution('DEBUG','lastId='+lastId);

					if(filters.length == 0) {
						searchresults = nlapiSearchRecord(datain.recordtype, searchid, [new nlobjSearchFilter("internalIdNumber", null, "greaterThan", lastId)], columns);
					} else {
						searchresults = nlapiSearchRecord(datain.recordtype, searchid, filters.concat(["internalIdNumber", "greaterThan", lastId]),columns);
					}

					if(searchresults) {
						rows = rows.concat(searchresults);
						// nlapiLogExecution('DEBUG','rows='+rows.length);
					}
				}
			}
			var myReturnData = new FinalData(true, null, datain, rows);

			return myReturnData;
		}catch(e){
			var myReturnData = new FinalData(false, e, datain, '');

			var body = 'Error completing the search';
			elasticHandleError(myReturnData, RestSearch.fromEmail, RestSearch.toEmail, body);

			return myReturnData;	
		}
	}
}