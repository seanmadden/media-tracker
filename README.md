media-tracker Documentation
=============
Last Updated: 7/16/14
Currently, this project is broken into two different parts. The website and the Service. My primary focus has shifted to the service. It is intended to be fast and robust webservice for managing lists.

## Model
The current list model is as follows:

| Field | Type | Required | Notes |
|-------|------|----------|-------|
|title | String |  Y     |       |
|title_lower| String | Y  | Added automatically when using restful endpoint |
|createDate | Date | Y    | Added automatically when using restful endpoint |




All API calls are restful, support GET, PUT, POST and DELETE operations. All current API calls live behind the /api endpoint.




GET /api/lists - Returns a JSON array of all lists
