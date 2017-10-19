# NetSuite Restlet Integration Scripts


## RESTLET DELETE
### netsuite_reslet_record_delete.js

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
		<td></td>
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
		<td></td>
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
		<td></td>
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



## RESTLET CREATE SALES ORDER
### netsuite_reslet_salesorder_createv2_1.js

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


