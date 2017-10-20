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
					rows = [],
					searchid = datain.searchid || null;
			/**
			* Set the FILTERS
			**/
			if(datain.searchtype && datain.searchvalue){
				// Check if there are multiple search operators
				var operatorsplit = datain.searchoperator.split(",");

				for(var k=0, kk=operatorsplit.length; k<kk; k++) {
					var searchoperatorvalue = operatorsplit[k];

					// Check if there are multiple search filters
					var typesplit = datain.searchtype.split(",");

					for(var j=0, jj=typesplit.length; j<jj; j++) {

						var searchtypevalue = typesplit[j];

						// Check if there are multiple search values
						var valuesplit = datain.searchvalue.split(",");

						for(var i=0, ii=valuesplit.length; i<ii; i++) {
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
									filters.push(new nlobjSearchFilter(joinvalue,join,searchoperatorvalue,parseInt(valuesplit[i])).setOr(false));// use to be filters[i] ??
									// nlapiLogExecution('DEBUG','filters='+filters);  
								} else {
									filters.push(new nlobjSearchFilter(joinvalue,join,searchoperatorvalue,valuesplit[i]).setOr(false));// use to be filters[i] ??
									// nlapiLogExecution('DEBUG',joinvalue+','+join+','+searchoperatorvalue+','+valuesplit[i]);  
								}				
							}
						}
					}
				}
				// Check if we should filter on mainline
				if(datain.mainline) {
					filters.push(new nlobjSearchFilter('mainline', null, 'is', 'T'));
				}
				//nlapiLogExecution('DEBUG','filters='+filters);  
			}

			/**
			* Set The COLUMNS
			**/
			// Check if the return columns is undefined, return all if empty
			if(datain.searchcolumn){
				// Parse the return column list and add each column 
				var searchcolumnsplit = datain.searchcolumn.split(",");
				columns.push(new nlobjSearchColumn('internalid',null).setSort(true));//was being set to columns[i] ??

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
					columns.push(new nlobjSearchColumn(joinvalue,join));//was being set to columns[i] ??
				}
				columns.push(new nlobjSearchColumn('internalid',null).setSort(false));//was being set to columns[i] ??
			}

			// Perform the search
			var searchresults = nlapiSearchRecord(datain.recordtype, searchid, filters, columns);


			if(searchresults) {
				rows = rows.concat(searchresults);
				// nlapiLogExecution('DEBUG','rows='+rows.length);
				// If more than 1000 rows, loop until there are less than 1000 rows returned
				while(searchresults!=null && searchresults.length == 1000) {

					var lastId=searchresults[999].getId();

					// nlapiLogExecution('DEBUG','lastId='+lastId);

					if(filters==null) {
						searchresults = nlapiSearchRecord(datain.recordtype, searchid, [new nlobjSearchFilter("internalIdNumber", null, "greaterThan", lastId)], columns);
					} else {
						searchresults = nlapiSearchRecord(datain.recordtype, searchid, [new nlobjSearchFilter("internalIdNumber", null, "greaterThan", lastId),filters[0]],columns);
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