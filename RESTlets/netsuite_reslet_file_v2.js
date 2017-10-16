/**
*	RESTlet
*	Summary : A way to send a file to the NetSuite file cabinet by
*					using the nlapiCreateFile api
*
*	required : netsuite_restlet_LIBRARY.js
*
**/

var RestFile = {
	/**
	* creates a file in the netsuite file cabinet
	* @input  name of file, type of file, content of file, folder for file, record to attach file to)
	**/
	create:function(datain){
		// nlapiLogExecution('AUDIT', 'request', JSON.stringify(datain));

		try{
		//create file object
		var fileCreated = nlapiCreateFile(datain.name, datain.fileType, datain.content);
			//set folder
			fileCreated.setFolder(datain.folder);
		
			// write file to cabinet
			var fileId = nlapiSubmitFile(fileCreated);

			// attach the file to a record so tht it can be viewed in the communications tab
			nlapiAttachRecord('file',fileId,datain.recordtype,datain.id);		

			var myReturnData = new FinalData(true, null, datain, fileId);

			return myReturnData;

		}catch(e){
			var myReturnData = new FinalData(false, e, datain, '');

			var fromEmail = context.getSetting('SCRIPT', 'custscript_file_fromemail') || null;
			var toEmail = context.getSetting('SCRIPT', 'custscript_file_toemails').replace(/\s+/g, '').split(',') || null; //should be comma sep list
			var body = 'Error Creating file or attaching it to the record.';
			elasticHandleError(myReturnData, fromEmail, toEmail, body);

			return myReturnData;
		}
	}
}