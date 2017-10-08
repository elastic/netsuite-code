/**
*	RESTlet
*	request : 
*
*	required : netsuite_restlet_LIBRARY.js
*
**/

var RestFile = {
	create:function(datain){
		nlapiLogExecution('DEBUG', 'request', JSON.stringify(datain));

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