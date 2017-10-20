# NetSuite Restlet Integration Scripts

This is a list of NetSuite RESTlets leveraged by the Talend integration. V2 includes enhanced error logging so we can quickly determine the source of any issues.
Connection requires an Access Token or Integration user.
Webservices documentation for NetSuite can be found here: [SuiteTalk Platform Guide](https://netsuite.custhelp.com/app/answers/detail/a_id/11025)

## RESTLET DELETE
### netsuite_reslet_record_delete.js

`NOTE: This script is undeployed and must be requested to be turned on through the ERP team.`

<table>
	<tr>
		<th></th>
		<th>GET</th>
		<th>POST</th>
		<th>PUT</th>
		<th>DELETE</th>
	</tr>
	<tr>
		<td>REQUEST</td>
		<td></td>
		<td></td>
		<td></td>
		<td>https://{DYNAMIC_NETSUITE_REST_URL}/app/site/hosting/restlet.nl?script=388&deploy=1&recordtype=salesorder&id=2107362</td>
	</tr>
	<tr>
		<td>RESPONSE</td>
		<td></td>
		<td></td>
		<td></td>
		<td>N/A</td>
	</tr>
	<tr>
		<td>RESPONSE if ERROR</td>
		<td></td>
		<td></td>
		<td></td>
		<td>
			<pre lang="javascript">
{
	"error": 
	{
		"code" : "NETSUITE_ERROR_CODE",
		"message": "Netsuite Generic Error Message"
	}
}
			</pre>
		</td>
	</tr>
</table>


## RESTLET FILE
### netsuite_reslet_file_v2.js

<table>
	<tr>
		<th></th>
		<th>GET</th>
		<th>POST</th>
		<th>PUT</th>
		<th>DELETE</th>
	</tr>
	<tr>
		<td>REQUEST</td>
		<td></td>
		<td>
			<pre lang="javascript">
{
	"name": "AB00000076.pdf",
	"fileType": "PDF",
	"folder": "144",
	"recordtype": "salesorder",
	"id": "2041226",
	"content": "FILE DATA"
}
			</pre>
		</td>
		<td></td>
		<td></td>
	</tr>
	<tr>
		<td>RESPONSE</td>
		<td></td>
		<td>
			<p>The data returned is the internal id of the file created.</p>
			<pre lang="javascript">
{
    "success": true,
    "reason": {
        "code": "",
        "details": "",
        "originalRequest": ""
    },
    "scriptInfo": {
        "scriptid": "customscript_elastic_createfile_v2",
        "deployment": "customdeploy_elastic_createfile_v2",
        "requestor": 715642,
        "environment": "SANDBOX"
    },
    "data": 1248622
}
			</pre>			
		</td>
		<td></td>
		<td></td>
	</tr>
	<tr>
		<td>RESPONSE if ERROR</td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
	</tr>
</table>



## RESTLET RECORD LOAD
### netsuite_reslet_record_load_v2.js

<table>
	<tr>
		<th></th>
		<th>GET</th>
		<th>POST</th>
		<th>PUT</th>
		<th>DELETE</th>
	</tr>
	<tr>
		<td>REQUEST</td>
		<td>https://{DYNAMIC_NETSUITE_REST_URL}/app/site/hosting/restlet.nl?script=352&deploy=2&recordtype=salesorder&id=2032916</td>
		<td>
<pre lang="javascript">
{
	"recordtype":"customrecord_trainingevent",
	"name":"Advanced Elasticsearch Developer (Virtual Classroom) on Aug 28 in CANBERRA, Australia",
	"custrecord_eventlocation":"8",
	"custrecord_eventid":"1234",
}
</pre>
		</td>
		<td>
<pre lang="javascript">
{
  "recordtype" : "customer",
  "id": "715664",
  "column": "email",
  "value": "test@test.com"
}
</pre>
		</td>
		<td></td>
	</tr>
	<tr>
		<td>RESPONSE</td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
	</tr>
	<tr>
		<td>RESPONSE if ERROR</td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
	</tr>
</table>



## RESTLET SEARCH
### netsuite_reslet_record_search_results_v2.js

<table>
	<tr>
		<th></th>
		<th>GET</th>
		<th>POST</th>
		<th>PUT</th>
		<th>DELETE</th>
	</tr>
	<tr>
		<td>REQUEST</td>
		<td>https://rest.sandbox.netsuite.com/app/site/hosting/restlet.nl?script=351&deploy=6&recordtype=salesorder&searchtype=trandate&searchoperator=on&searchvalue=2017/10/12&searchcolumn=fxamount,quantity,item,currency,subsidiarynohierarchy,custbodysfdc_opportunity_id&mainline=T&searchid=123</td>
		<td></td>
		<td></td>
		<td></td>
	</tr>
	<tr>
		<td>RESPONSE</td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
	</tr>
	<tr>
		<td>RESPONSE if ERROR</td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
	</tr>
</table>



## RESTLET SEARCH SPECIFIC RECORD
### netsuite_reslet_record_search_results_singlesearch_v2.js

<table>
	<tr>
		<th></th>
		<th>GET</th>
		<th>POST</th>
		<th>PUT</th>
		<th>DELETE</th>
	</tr>
	<tr>
		<td>REQUEST</td>
		<td>https://{DYNAMIC_NETSUITE_REST_URL}/app/site/hosting/restlet.nl?script=385&deploy=15&recordtype=salesorder&searchtype=internalid&searchoperator=is&searchvalue=2032916&searchcolumn=name,fxamount,item,currency,subsidiary.namenohierarchy&mainline=T&searchid=123</td>
		<td></td>
		<td></td>
		<td></td>
	</tr>
	<tr>
		<td>RESPONSE</td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
	</tr>
	<tr>
		<td>RESPONSE if ERROR</td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
	</tr>
</table>



## RESTLET INSERT SUBLIST
### netsuite_reslet_record_sublist_insert_v2.js

<table>
	<tr>
		<th></th>
		<th>GET</th>
		<th>POST</th>
		<th>PUT</th>
		<th>DELETE</th>
	</tr>
	<tr>
		<td>REQUEST</td>
		<td></td>
		<td>
<pre lang="javascript">
{
  "recordtype" : "customer",
    "id": "715664",
      "sublist": {
        "type" : "currency",
          "field" : "currency",
            "value" : "3"
      }
}
</pre>
		</td>
		<td>
<pre lang="javascript">
{
  "recordtype" : "customer",
    "id": "715664",
      "sublist": {
        "type" : "addressbook",
          "field" : "addr1,city,state,zip,country",
            "value" : "test address,test city,test state,94040,US"
      }
}
</pre>
		</td>
		<td></td>
	</tr>
	<tr>
		<td>RESPONSE</td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
	</tr>
	<tr>
		<td>RESPONSE if ERROR</td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
	</tr>
</table>



## RESTLET CREATE SALES ORDER
### netsuite_reslet_salesorder_create_v2_1.js

<table>
	<tr>
		<th></th>
		<th>GET</th>
		<th>POST</th>
		<th>PUT</th>
		<th>DELETE</th>
	</tr>
	<tr>
		<td>REQUEST</td>
		<td></td>
		<td>
<pre lang="javascript">
{
	"recordtype":"salesorder",
	"entity":"444444",
	"location":"14",
	"department":"1",
	"currency":"1",
	"otherrefnum":"TUS555555555",
	"item":{
		"class":"1",
		"item":"384",
		"quantity":"15.0",
		"location":"14",
		"department":"30",
		"price":"-1",
		"istaxable":"F",
		"rate":"7400.0",
		"custcol_es_adi_discountamount":"-61020.0",
		"revrecenddate":"2018/10/26",
		"revrecstartdate":"2017/10/27",
		"description":"Billable Nodes for a Gold Subscription",
		"custcol2":"0.0",
		"custcol3":"0.0",
		"job":[]
	},
	"istaxable":"F",
	"email":"invoice@test.com",
	"saleseffectivedate":[],
	"source":[],
	"terms":"3",
	"tranid":"Q-555555",
	"trandate":"2017/10/12",
	"class":"1",
	"billaddressee":"test Systems, Inc.",
	"billattention":"Accounts Payable",
	"billaddr1":"PO Box # 696024",
	"billcity":"San Antonio",
	"billstate":"TX",
	"billzip":"55555",
	"billcountry":"US",
	"billphone":"+1.408.555.5555",
	"shipaddressee":"test Systems, Inc.",
	"shipaddr1":"555 Test Drive",
	"shipcity":"DA City",
	"shipstate":"CA",
	"shipzip":"55555",
	"shipcountry":"US",
	"shipphone":"3456789123",
	"customform":"139",
	"custbodyname__c":"Billable Nodes for a Gold Subscription; - test Systems, Inc.",
	"custbody_end_user":"48128",
	"custbodysfdc_opportunity_id":"5555555555Cn4UhAAJ",
	"custbody9":"invoice@test.com",
	"custbody11":"2",
	"custbody_elastic_cctype":[],
	"custform":"139",
	"custbody_order_type":"1",
	"custbodyregistration_date":[],
	"custbodyregistrant_type":[],
	"custbodyregistrant_status":[],
	"custbody_training_location":[],
	"custbody_renewal_terms":"24",
	"fax":[],
	"memo":[]
}	
</pre>		
		</td>
		<td></td>
		<td></td>
	</tr>
	<tr>
		<td>RESPONSE</td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
	</tr>
	<tr>
		<td>RESPONSE if ERROR</td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
	</tr>
</table>



## RESTLET CREATE PAYMENT
### netsuite_reslet_payment_create_v2.js

<table>
	<tr>
		<th></th>
		<th>GET</th>
		<th>POST</th>
		<th>PUT</th>
		<th>DELETE</th>
	</tr>
	<tr>
		<td>REQUEST</td>
		<td></td>
		<td>
<pre lang="javascript">
{
        "recordtype": "customerpayment",
        "invoice_date": "2017/8/11",
        "location": "126",
        "invoice_number": US00006668,
        "department": "29",
        "custbody_elastic_cctype": "4",
        "subsidiary": "22",
        "currency": "1",
        "customform": "155",
        "customer": "515081",
        "payment": "266.31"
}
</pre>
		</td>
		<td></td>
		<td></td>
	</tr>
	<tr>
		<td>RESPONSE</td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
	</tr>
	<tr>
		<td>RESPONSE if ERROR</td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
	</tr>
</table>


