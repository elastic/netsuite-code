# Client Scripts

Client scripts are SuiteScripts executed in the browser. They can run on most standard records, custom record types, and custom NetSuite pages (for example, Suitelets).Generally, client scripts are used to validate user-entered data and to auto-populate fields or sublists at various form events. Such events can include loading or initializing a form, changing a field, or saving a record. Another use case for client scripts is to source data from an external data source to a field.

##


Script Name	| Short Description | Records Applied To | Wiki Link | Creators | Maintainers
--- | --- | --- | --- | --- | ---
Copy Department, Class and Location	 | On Discount line items, adds values for these fields based on the item on the previous line: <li>department</li> <li>class</li> <li>location</li> <li>taxcode</li> | <li>Invoice</li>  <li>Sales Order</li> | [Field Defaulting](https://wiki.elastic.co/display/AD/Field+Defaulting) | ? | Charles Halliday
Default Line Location and Department | Sets the Department and Location at the line level for Items and Expenses. Department and Location are pulled from the Vendor record. | <li>Purchase Order</li><li>Vendor Bill</li> | [Field Defaulting](https://wiki.elastic.co/display/AD/Field+Defaulting) | ? | Charles Halliday
Default Rev Rec Dates | Sets the RevRec Start and End Date when an item is selected. Pulls the value from custom columns on the line item: <li>custcol_item_rev_rec_start</li><li>custcol_item_rev_rec_end</li> | Sales Order | [Field Defaulting](https://wiki.elastic.co/display/AD/Field+Defaulting) | ? | Charles Halliday
Disable Tax Amount | Disables "tax" column from user entry when entering an expense line. | Expense Report | [Field Defaulting](https://wiki.elastic.co/display/AD/Field+Defaulting) | ? |	Charles Halliday


<div id="main-content" class="wiki-content">

## <u>Summary:</u>

These scripts auto populate fields on Item lines and Expense lines

GitHub: [https://github.com/elastic/netsuite-suitescripts/tree/master/Client](https://github.com/elastic/netsuite-suitescripts/tree/master/Client)

* * *

## <u>Scripts</u>:

## _<span style="color: rgb(0,128,0);">Copy Department, Class and Location:</span>_

### Logic:

On Discount line items, adds values for these fields based on the item on the previous line:

*   department
*   class
*   location
*   taxcode

### Test Cases

<div class="table-wrap">

<table class="relative-table wrapped confluenceTable tablesorter tablesorter-default stickyTableHeaders" style="width: 81.9565%; padding: 0px;" role="grid"><colgroup><col><col style="width: 14.7313%;"><col style="width: 24.4194%;"><col style="width: 24.8839%;"><col style="width: 35.9655%;"></colgroup>

<thead class="tableFloatingHeaderOriginal" style="position: static; margin-top: 0px; left: 337.844px; z-index: 3; width: 1202px; top: 65px;">

<tr role="row" class="tablesorter-headerRow">

<th colspan="1" class="confluenceTh tablesorter-header sortableHeader tablesorter-headerUnSorted" data-column="0" tabindex="0" scope="col" role="columnheader" aria-disabled="false" unselectable="on" aria-sort="none" aria-label="#: No sort applied, activate to apply an ascending sort" style="user-select: none; min-width: 8px; max-width: none;">

<div class="tablesorter-header-inner">#</div>

</th>

<th class="confluenceTh tablesorter-header sortableHeader tablesorter-headerUnSorted" data-column="1" tabindex="0" scope="col" role="columnheader" aria-disabled="false" unselectable="on" aria-sort="none" aria-label="Record Type: No sort applied, activate to apply an ascending sort" style="user-select: none; min-width: 8px; max-width: none;">

<div class="tablesorter-header-inner">Record Type</div>

</th>

<th class="confluenceTh tablesorter-header sortableHeader tablesorter-headerUnSorted" data-column="2" tabindex="0" scope="col" role="columnheader" aria-disabled="false" unselectable="on" aria-sort="none" aria-label="Settings: No sort applied, activate to apply an ascending sort" style="user-select: none; min-width: 8px; max-width: none;">

<div class="tablesorter-header-inner">Settings</div>

</th>

<th colspan="1" class="confluenceTh tablesorter-header sortableHeader tablesorter-headerUnSorted" data-column="3" tabindex="0" scope="col" role="columnheader" aria-disabled="false" unselectable="on" aria-sort="none" aria-label="Action: No sort applied, activate to apply an ascending sort" style="user-select: none; min-width: 8px; max-width: none;">

<div class="tablesorter-header-inner">Action</div>

</th>

<th colspan="1" class="confluenceTh tablesorter-header sortableHeader tablesorter-headerUnSorted" data-column="4" tabindex="0" scope="col" role="columnheader" aria-disabled="false" unselectable="on" aria-sort="none" aria-label="Expected Result: No sort applied, activate to apply an ascending sort" style="user-select: none; min-width: 8px; max-width: none;">

<div class="tablesorter-header-inner">Expected Result</div>

</th>

</tr>

</thead>

<thead class="tableFloatingHeader" style="display: none;">

<tr role="row" class="tablesorter-headerRow">

<th colspan="1" class="confluenceTh tablesorter-header sortableHeader tablesorter-headerUnSorted" data-column="0" tabindex="0" scope="col" role="columnheader" aria-disabled="false" unselectable="on" aria-sort="none" aria-label="#: No sort applied, activate to apply an ascending sort" style="user-select: none;">

<div class="tablesorter-header-inner">#</div>

</th>

<th class="confluenceTh tablesorter-header sortableHeader tablesorter-headerUnSorted" data-column="1" tabindex="0" scope="col" role="columnheader" aria-disabled="false" unselectable="on" aria-sort="none" aria-label="Record Type: No sort applied, activate to apply an ascending sort" style="user-select: none;">

<div class="tablesorter-header-inner">Record Type</div>

</th>

<th class="confluenceTh tablesorter-header sortableHeader tablesorter-headerUnSorted" data-column="2" tabindex="0" scope="col" role="columnheader" aria-disabled="false" unselectable="on" aria-sort="none" aria-label="Settings: No sort applied, activate to apply an ascending sort" style="user-select: none;">

<div class="tablesorter-header-inner">Settings</div>

</th>

<th colspan="1" class="confluenceTh tablesorter-header sortableHeader tablesorter-headerUnSorted" data-column="3" tabindex="0" scope="col" role="columnheader" aria-disabled="false" unselectable="on" aria-sort="none" aria-label="Action: No sort applied, activate to apply an ascending sort" style="user-select: none;">

<div class="tablesorter-header-inner">Action</div>

</th>

<th colspan="1" class="confluenceTh tablesorter-header sortableHeader tablesorter-headerUnSorted" data-column="4" tabindex="0" scope="col" role="columnheader" aria-disabled="false" unselectable="on" aria-sort="none" aria-label="Expected Result: No sort applied, activate to apply an ascending sort" style="user-select: none;">

<div class="tablesorter-header-inner">Expected Result</div>

</th>

</tr>

</thead>

<tbody aria-live="polite" aria-relevant="all">

<tr role="row">

<td colspan="1" class="confluenceTd">1</td>

<td class="confluenceTd">

Invoice

Sales Order

Context:

When a line item is saved.

</td>

<td class="confluenceTd">

*   **Customer**: Any
*   **Subsidiary**: Any
*   **Currency**: Any
*   **Line** Level:
    *   **Item**: Non-Inventory or Service Item + Discount Item
    *   **department** : Any

    *   **class**: Any

    *   **location** : Any

    *   **taxcode**: Any

    *   **custcol_account** : Any

    *   **custcol_billing_discount** : Any

</td>

<td colspan="1" class="confluenceTd">

1.  Set one line item on the Sales Order or Invoice.
2.  Next Line, add a Discount Item.
3.  Repeat this process for different
    1.  1.  Modes
            1.  Create
            2.  Edit
        2.  Contexts
            1.  UI
    2.  Subsidiaries
    3.  Customers
    4.  Currencies
    5.  Items
        1.  Different non-inventory and Service items

</td>

<td colspan="1" class="confluenceTd">

*   After the Discount <u>line</u> is saved, it should have the following fields populated and they should match the line above:  

    *   _department_
    *   _class_
    *   _location_
    *   _taxcode_  

</td>

</tr>

</tbody>

</table>

</div>

## _<span style="color: rgb(0,128,0);">Default Line Location and Department:</span>_

### Logic:

Sets the Department and Location at the line level for Items and Expenses. Department and Location are pulled from the Vendor record.

### Test Cases

<div class="table-wrap">

<table class="relative-table wrapped confluenceTable tablesorter tablesorter-default stickyTableHeaders" style="width: 81.9565%; padding: 0px;" role="grid"><colgroup><col><col style="width: 14.7313%;"><col style="width: 24.4194%;"><col style="width: 24.8839%;"><col style="width: 35.9655%;"></colgroup>

<thead class="tableFloatingHeaderOriginal" style="position: static; margin-top: 0px; left: 337.844px; z-index: 3; width: 1202px; top: 65px;">

<tr role="row" class="tablesorter-headerRow">

<th colspan="1" class="confluenceTh tablesorter-header sortableHeader tablesorter-headerUnSorted" data-column="0" tabindex="0" scope="col" role="columnheader" aria-disabled="false" unselectable="on" aria-sort="none" aria-label="#: No sort applied, activate to apply an ascending sort" style="user-select: none; min-width: 8px; max-width: none;">

<div class="tablesorter-header-inner">#</div>

</th>

<th class="confluenceTh tablesorter-header sortableHeader tablesorter-headerUnSorted" data-column="1" tabindex="0" scope="col" role="columnheader" aria-disabled="false" unselectable="on" aria-sort="none" aria-label="Record Type: No sort applied, activate to apply an ascending sort" style="user-select: none; min-width: 8px; max-width: none;">

<div class="tablesorter-header-inner">Record Type</div>

</th>

<th class="confluenceTh tablesorter-header sortableHeader tablesorter-headerUnSorted" data-column="2" tabindex="0" scope="col" role="columnheader" aria-disabled="false" unselectable="on" aria-sort="none" aria-label="Settings: No sort applied, activate to apply an ascending sort" style="user-select: none; min-width: 8px; max-width: none;">

<div class="tablesorter-header-inner">Settings</div>

</th>

<th colspan="1" class="confluenceTh tablesorter-header sortableHeader tablesorter-headerUnSorted" data-column="3" tabindex="0" scope="col" role="columnheader" aria-disabled="false" unselectable="on" aria-sort="none" aria-label="Action: No sort applied, activate to apply an ascending sort" style="user-select: none; min-width: 8px; max-width: none;">

<div class="tablesorter-header-inner">Action</div>

</th>

<th colspan="1" class="confluenceTh tablesorter-header sortableHeader tablesorter-headerUnSorted" data-column="4" tabindex="0" scope="col" role="columnheader" aria-disabled="false" unselectable="on" aria-sort="none" aria-label="Expected Result: No sort applied, activate to apply an ascending sort" style="user-select: none; min-width: 8px; max-width: none;">

<div class="tablesorter-header-inner">Expected Result</div>

</th>

</tr>

</thead>

<thead class="tableFloatingHeader" style="display: none;">

<tr role="row" class="tablesorter-headerRow">

<th colspan="1" class="confluenceTh tablesorter-header sortableHeader tablesorter-headerUnSorted" data-column="0" tabindex="0" scope="col" role="columnheader" aria-disabled="false" unselectable="on" aria-sort="none" aria-label="#: No sort applied, activate to apply an ascending sort" style="user-select: none;">

<div class="tablesorter-header-inner">#</div>

</th>

<th class="confluenceTh tablesorter-header sortableHeader tablesorter-headerUnSorted" data-column="1" tabindex="0" scope="col" role="columnheader" aria-disabled="false" unselectable="on" aria-sort="none" aria-label="Record Type: No sort applied, activate to apply an ascending sort" style="user-select: none;">

<div class="tablesorter-header-inner">Record Type</div>

</th>

<th class="confluenceTh tablesorter-header sortableHeader tablesorter-headerUnSorted" data-column="2" tabindex="0" scope="col" role="columnheader" aria-disabled="false" unselectable="on" aria-sort="none" aria-label="Settings: No sort applied, activate to apply an ascending sort" style="user-select: none;">

<div class="tablesorter-header-inner">Settings</div>

</th>

<th colspan="1" class="confluenceTh tablesorter-header sortableHeader tablesorter-headerUnSorted" data-column="3" tabindex="0" scope="col" role="columnheader" aria-disabled="false" unselectable="on" aria-sort="none" aria-label="Action: No sort applied, activate to apply an ascending sort" style="user-select: none;">

<div class="tablesorter-header-inner">Action</div>

</th>

<th colspan="1" class="confluenceTh tablesorter-header sortableHeader tablesorter-headerUnSorted" data-column="4" tabindex="0" scope="col" role="columnheader" aria-disabled="false" unselectable="on" aria-sort="none" aria-label="Expected Result: No sort applied, activate to apply an ascending sort" style="user-select: none;">

<div class="tablesorter-header-inner">Expected Result</div>

</th>

</tr>

</thead>

<tbody aria-live="polite" aria-relevant="all">

<tr role="row">

<td colspan="1" class="confluenceTd">1</td>

<td class="confluenceTd">

Purchase Order

Vendor Bill

Context:

When a line is added and when a line is saved. Items and Expenses

</td>

<td class="confluenceTd">

*   **Customer**: Any
*   **Subsidiary**: Any
*   **Currency**: Any
*   **Line** Level:
    *   **Item**: Non-Inventory or Service Item <span>or Expense</span>
    *   **department** : Any

    *   **class**: Any

    *   **location** : Any

    *   **taxcode**: Any

    *   **custcol_account** : Any

    *   **custcol_billing_discount** : Any

</td>

<td colspan="1" class="confluenceTd">

1.  Set one Item or Expense on a PO or Vendor Bill.
2.  Repeat this process for different
    1.  1.  Modes
            1.  Create
            2.  Edit
        2.  Contexts
            1.  UI
    2.  Subsidiaries
    3.  Customers
    4.  Currencies
    5.  Items
        1.  Different non-inventory and Service items

</td>

<td colspan="1" class="confluenceTd">

*   After the <u>line</u> is saved, The columns for Department and Location should be updated with the values from the Vendor record.
*   If it is an expense line AND it already has Department and Location set, it will not pull from the Vendor record but instead, leave it the same.  

</td>

</tr>

</tbody>

</table>

</div>

## _<span style="color: rgb(0,128,0);">Default Rev Rec Dates:</span>_

### Logic:

Sets the RevRec Start and End Date when an item is selected. Pulls the value from custom columns on the line item:

*   custcol_item_rev_rec_start
*   custcol_item_rev_rec_end

### Test Cases

<div class="table-wrap">

<table class="relative-table wrapped confluenceTable tablesorter tablesorter-default stickyTableHeaders" style="width: 81.9565%; padding: 0px;" role="grid"><colgroup><col><col style="width: 14.7313%;"><col style="width: 24.4194%;"><col style="width: 24.8839%;"><col style="width: 35.9655%;"></colgroup>

<thead class="tableFloatingHeaderOriginal" style="position: static; margin-top: 0px; left: 337.844px; z-index: 3; width: 1202px; top: 65px;">

<tr role="row" class="tablesorter-headerRow">

<th colspan="1" class="confluenceTh tablesorter-header sortableHeader tablesorter-headerUnSorted" data-column="0" tabindex="0" scope="col" role="columnheader" aria-disabled="false" unselectable="on" aria-sort="none" aria-label="#: No sort applied, activate to apply an ascending sort" style="user-select: none; min-width: 8px; max-width: none;">

<div class="tablesorter-header-inner">#</div>

</th>

<th class="confluenceTh tablesorter-header sortableHeader tablesorter-headerUnSorted" data-column="1" tabindex="0" scope="col" role="columnheader" aria-disabled="false" unselectable="on" aria-sort="none" aria-label="Record Type: No sort applied, activate to apply an ascending sort" style="user-select: none; min-width: 8px; max-width: none;">

<div class="tablesorter-header-inner">Record Type</div>

</th>

<th class="confluenceTh tablesorter-header sortableHeader tablesorter-headerUnSorted" data-column="2" tabindex="0" scope="col" role="columnheader" aria-disabled="false" unselectable="on" aria-sort="none" aria-label="Settings: No sort applied, activate to apply an ascending sort" style="user-select: none; min-width: 8px; max-width: none;">

<div class="tablesorter-header-inner">Settings</div>

</th>

<th colspan="1" class="confluenceTh tablesorter-header sortableHeader tablesorter-headerUnSorted" data-column="3" tabindex="0" scope="col" role="columnheader" aria-disabled="false" unselectable="on" aria-sort="none" aria-label="Action: No sort applied, activate to apply an ascending sort" style="user-select: none; min-width: 8px; max-width: none;">

<div class="tablesorter-header-inner">Action</div>

</th>

<th colspan="1" class="confluenceTh tablesorter-header sortableHeader tablesorter-headerUnSorted" data-column="4" tabindex="0" scope="col" role="columnheader" aria-disabled="false" unselectable="on" aria-sort="none" aria-label="Expected Result: No sort applied, activate to apply an ascending sort" style="user-select: none; min-width: 8px; max-width: none;">

<div class="tablesorter-header-inner">Expected Result</div>

</th>

</tr>

</thead>

<thead class="tableFloatingHeader" style="display: none;">

<tr role="row" class="tablesorter-headerRow">

<th colspan="1" class="confluenceTh tablesorter-header sortableHeader tablesorter-headerUnSorted" data-column="0" tabindex="0" scope="col" role="columnheader" aria-disabled="false" unselectable="on" aria-sort="none" aria-label="#: No sort applied, activate to apply an ascending sort" style="user-select: none;">

<div class="tablesorter-header-inner">#</div>

</th>

<th class="confluenceTh tablesorter-header sortableHeader tablesorter-headerUnSorted" data-column="1" tabindex="0" scope="col" role="columnheader" aria-disabled="false" unselectable="on" aria-sort="none" aria-label="Record Type: No sort applied, activate to apply an ascending sort" style="user-select: none;">

<div class="tablesorter-header-inner">Record Type</div>

</th>

<th class="confluenceTh tablesorter-header sortableHeader tablesorter-headerUnSorted" data-column="2" tabindex="0" scope="col" role="columnheader" aria-disabled="false" unselectable="on" aria-sort="none" aria-label="Settings: No sort applied, activate to apply an ascending sort" style="user-select: none;">

<div class="tablesorter-header-inner">Settings</div>

</th>

<th colspan="1" class="confluenceTh tablesorter-header sortableHeader tablesorter-headerUnSorted" data-column="3" tabindex="0" scope="col" role="columnheader" aria-disabled="false" unselectable="on" aria-sort="none" aria-label="Action: No sort applied, activate to apply an ascending sort" style="user-select: none;">

<div class="tablesorter-header-inner">Action</div>

</th>

<th colspan="1" class="confluenceTh tablesorter-header sortableHeader tablesorter-headerUnSorted" data-column="4" tabindex="0" scope="col" role="columnheader" aria-disabled="false" unselectable="on" aria-sort="none" aria-label="Expected Result: No sort applied, activate to apply an ascending sort" style="user-select: none;">

<div class="tablesorter-header-inner">Expected Result</div>

</th>

</tr>

</thead>

<tbody aria-live="polite" aria-relevant="all">

<tr role="row">

<td colspan="1" class="confluenceTd">1</td>

<td class="confluenceTd">

<span>Sales Order</span>

<span>  
</span>

<span>Context:</span>

<span>When a line is added and when a line is saved. Items only.</span>

</td>

<td class="confluenceTd">

*   **Customer**: Any
*   **Subsidiary**: Any
*   **Currency**: Any
*   **Line** Level:
    *   **Item**: Non-Inventory or Service Item that has a rev-rec schedule
    *   **department** : Any

    *   **class**: Any

    *   **location** : Any

    *   **taxcode**: Any

    *   **custcol_account** : Any

    *   **custcol_billing_discount** : Any

</td>

<td colspan="1" class="confluenceTd">

1.  Set one line item on the Sales Order or Invoice.
2.  Repeat this process for different
    1.  1.  Modes
            1.  Create
            2.  Edit
        2.  Contexts
            1.  UI
    2.  Subsidiaries
    3.  Customers
    4.  Currencies
    5.  Items
        1.  Different non-inventory and Service items

</td>

<td colspan="1" class="confluenceTd">

*   After the line is saved, the "True" RevRec start and end date columns will be populated on the line that was just saved.  

</td>

</tr>

</tbody>

</table>

</div>

## _<span style="color: rgb(0,128,0);">Disable Tax Amount:</span>_

### Logic:

Disables "tax" column from user entry when entering an expense line.

### Test Cases

<div class="table-wrap">

<table class="relative-table wrapped confluenceTable tablesorter tablesorter-default stickyTableHeaders" style="width: 81.9565%; padding: 0px;" role="grid"><colgroup><col><col style="width: 14.7313%;"><col style="width: 24.4194%;"><col style="width: 24.8839%;"><col style="width: 35.9655%;"></colgroup>

<thead class="tableFloatingHeaderOriginal">

<tr role="row" class="tablesorter-headerRow">

<th colspan="1" class="confluenceTh tablesorter-header sortableHeader tablesorter-headerUnSorted" data-column="0" tabindex="0" scope="col" role="columnheader" aria-disabled="false" unselectable="on" aria-sort="none" aria-label="#: No sort applied, activate to apply an ascending sort" style="user-select: none;">

<div class="tablesorter-header-inner">#</div>

</th>

<th class="confluenceTh tablesorter-header sortableHeader tablesorter-headerUnSorted" data-column="1" tabindex="0" scope="col" role="columnheader" aria-disabled="false" unselectable="on" aria-sort="none" aria-label="Record Type: No sort applied, activate to apply an ascending sort" style="user-select: none;">

<div class="tablesorter-header-inner">Record Type</div>

</th>

<th class="confluenceTh tablesorter-header sortableHeader tablesorter-headerUnSorted" data-column="2" tabindex="0" scope="col" role="columnheader" aria-disabled="false" unselectable="on" aria-sort="none" aria-label="Settings: No sort applied, activate to apply an ascending sort" style="user-select: none;">

<div class="tablesorter-header-inner">Settings</div>

</th>

<th colspan="1" class="confluenceTh tablesorter-header sortableHeader tablesorter-headerUnSorted" data-column="3" tabindex="0" scope="col" role="columnheader" aria-disabled="false" unselectable="on" aria-sort="none" aria-label="Action: No sort applied, activate to apply an ascending sort" style="user-select: none;">

<div class="tablesorter-header-inner">Action</div>

</th>

<th colspan="1" class="confluenceTh tablesorter-header sortableHeader tablesorter-headerUnSorted" data-column="4" tabindex="0" scope="col" role="columnheader" aria-disabled="false" unselectable="on" aria-sort="none" aria-label="Expected Result: No sort applied, activate to apply an ascending sort" style="user-select: none;">

<div class="tablesorter-header-inner">Expected Result</div>

</th>

</tr>

</thead>

<thead class="tableFloatingHeader" style="display: none;">

<tr role="row" class="tablesorter-headerRow">

<th colspan="1" class="confluenceTh tablesorter-header sortableHeader tablesorter-headerUnSorted" data-column="0" tabindex="0" scope="col" role="columnheader" aria-disabled="false" unselectable="on" aria-sort="none" aria-label="#: No sort applied, activate to apply an ascending sort" style="user-select: none;">

<div class="tablesorter-header-inner">#</div>

</th>

<th class="confluenceTh tablesorter-header sortableHeader tablesorter-headerUnSorted" data-column="1" tabindex="0" scope="col" role="columnheader" aria-disabled="false" unselectable="on" aria-sort="none" aria-label="Record Type: No sort applied, activate to apply an ascending sort" style="user-select: none;">

<div class="tablesorter-header-inner">Record Type</div>

</th>

<th class="confluenceTh tablesorter-header sortableHeader tablesorter-headerUnSorted" data-column="2" tabindex="0" scope="col" role="columnheader" aria-disabled="false" unselectable="on" aria-sort="none" aria-label="Settings: No sort applied, activate to apply an ascending sort" style="user-select: none;">

<div class="tablesorter-header-inner">Settings</div>

</th>

<th colspan="1" class="confluenceTh tablesorter-header sortableHeader tablesorter-headerUnSorted" data-column="3" tabindex="0" scope="col" role="columnheader" aria-disabled="false" unselectable="on" aria-sort="none" aria-label="Action: No sort applied, activate to apply an ascending sort" style="user-select: none;">

<div class="tablesorter-header-inner">Action</div>

</th>

<th colspan="1" class="confluenceTh tablesorter-header sortableHeader tablesorter-headerUnSorted" data-column="4" tabindex="0" scope="col" role="columnheader" aria-disabled="false" unselectable="on" aria-sort="none" aria-label="Expected Result: No sort applied, activate to apply an ascending sort" style="user-select: none;">

<div class="tablesorter-header-inner">Expected Result</div>

</th>

</tr>

</thead>

<tbody aria-live="polite" aria-relevant="all">

<tr role="row">

<td colspan="1" class="confluenceTd">1</td>

<td class="confluenceTd">

<span>Expense Report</span>

</td>

<td class="confluenceTd">

*   **Customer**: Any
*   **Subsidiary**: Any
*   **Currency**: Any
*   **Line** Level:
    *   **Item**: Non-Inventory or Service Item + Discount Item
    *   **department** : Any

    *   **class**: Any

    *   **location** : Any

    *   **taxcode**: Any

    *   **custcol_account** : Any

    *   **custcol_billing_discount** : Any

</td>

<td colspan="1" class="confluenceTd">

1.  Set one line item on the Expense Report
2.  Repeat this process for different
    1.  1.  Modes
            1.  Create
            2.  Edit
        2.  Contexts
            1.  UI
    2.  Subsidiaries
    3.  Customers
    4.  Currencies
    5.  Items
        1.  Different non-inventory and Service items

</td>

<td colspan="1" class="confluenceTd">

*   At all times, the tax column should be disabled, not allowing a user to enter a value.

</td>

</tr>

</tbody>

</table>

</div>

</div>