media-tracker Documentation
=============
Last Updated: 7/22/14
Currently, this project is broken into two different parts. The website and the Service. My primary focus has shifted to the service. It is intended to be fast and robust webservice for managing lists.

## Model

###List
The current list model is as follows:

| Field | Type | Required | Notes |
|-------|------|----------|-------|
|title | String |  Y     |       |
|title_lower| String | Y  | Added automatically when using restful endpoint |
|createDate | Date | Y    | Added automatically when using restful endpoint |

###List Item
The list item model looks like this:

| Field | Type | Required | Notes |
|-------|------|----------|-------|
|title | String |  Y     |       |
|title_lower| String | Y  | Added automatically when using restful endpoint |
|createDate | Date | Y    | Added automatically when using restful endpoint |
|complete   | Boolean | Y | Default false |
|completeDate| Date  | N  | Date the item was marked as complete |
|parentList | ID | Y      | Relates the list item back to a parent list |
|order      | Number | N  | Used for custom user ordering |

###User
| Field | Type | Required | Notes |
|-------|------|----------|-------|
|email  |String|Y         |       |
|email_lower|String|Y     |       |
|password | String | Y    |       |


All API calls are restful, support GET, PUT, POST and DELETE operations. All current API calls live behind the /api endpoint.




GET /api/lists - Returns a JSON array of all lists
