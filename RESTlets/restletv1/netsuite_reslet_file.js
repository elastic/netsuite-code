function createFile(datain)  
{  
	var fileCreated = nlapiCreateFile(datain.name, datain.fileType, datain.content);

    fileCreated.setFolder(datain.folder);

    var fileId = nlapiSubmitFile(fileCreated);
  	
	//var file = nlapiLoadFile(fileId);
	
	//file.setDescription(datain.description);

  	//nlapiSubmitField('file',fileId,'Description',datain.description);
	//nlapiSubmitField('file',fileId,'ExternalId',datain.externalid);

	nlapiAttachRecord('file',fileId,datain.recordtype,datain.id);
	
	return fileId;	
}