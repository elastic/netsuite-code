/**
* //library functions to help with RESTlets
*
*
*	context : variable that gets the netsuite context
* 
* 	FinalData : constructor consisting of the data objects to be returned to requesting applicaiton
* 
*	elasticHandleError : logs error, sends email, (future will send info to another system)
*
*
*
**/
var context = nlapiGetContext();


/**
* FinalData constructor
* 
* success, Boolean
* e, error object if there is one
* requestData, the request params / payload
* returnData, if successful, we have data to return to the requesting application
**/
var FinalData = function(success, e, requestData, returnData){
		//success, true or false
		this.success = success;

		//if error object, log the data else return empty data
		if(e){
			this.reason = {
				code : e.getCode(),
				details : e.getDetails(),
				originalRequest: requestData
			};
		}else{
			this.reason = {
				code: '',
				details: '',
				originalRequest: ''
			};
		}

		//script info
		this.scriptInfo = {
			scriptid: context.getScriptId(),
			deployment: context.getDeploymentId(),
			requestor: context.getUser(),
			environment: context.getEnvironment()
		};

		this.data = returnData;

};
/**
* Handles errors by logging to NS, sending email, (future will end to log application too)
*
* 
* myFinalData, the data to return to the requestor
* fromEmail, internal id of the employee the email will be sent from. if null, no email will send
* toEmail, array of email addresses to send email to
* body, custom body message to send
* 
**/
function elasticHandleError(myReturnData, fromEmail, toEmail, body){

	//log the error
	nlapiLogExecution('DEBUG', myReturnData.reason.code, myReturnData.reason.details);

	//email the error
	if(fromEmail){
		var subject = 'Error during RESTlet process SCRIPT_ID: '+myReturnData.scriptInfo.scriptid+'. '+myReturnData.reason.code;
		body += '\n\n' +
					'Error Code: '+myReturnData.reason.code+'\n'+
					'Error Details: '+myReturnData.reason.details+'\n'+
					'Script ID: '+myReturnData.scriptInfo.scriptid+'\n'+
					'Script Deployment: '+myReturnData.scriptInfo.deployment+'\n'+
					'Requestor: '+myReturnData.scriptInfo.requestor+'\n'+
					'Environment: '+myReturnData.scriptInfo.requestor+'\n';

		try{
			nlapiSendEmail(fromEmail, toEmail, subject, body);
		}catch(e){
			nlapiLogExecution('DEBUG', 'Error sending email','');
		}
	}

	//send error to log application

}


