# Knight Life API
### v2.0 Documentation
The following will provide as a brief description of all callable API routes, as well as their general purpose, required parameters, and response. A more in-depth guide will be available soon.
##### API Root URL: https://bbnknightlife.com/api/
## Schedule Routes
### _Schedule Template_
Path: __[/schedule/template](https://bbnknightlife.com/api/schedule/template)__
<br>
Purpose: __Returns the default BB&N schedule__
<br>
###### Request:
```
Method: GET
Headers: None Required
Body: None Required
Params: None Required
```
###### Response:
```
Returns a list of Days, identified by IDs, and a list of blocks available on those days.
```
---
### _Schedule for Specific Date_
Path: __[/schedule](https://bbnknightlife.com/api/schedule)__
<br>
Purpose: __Returns the schedule for a given day.__
<br>
###### Request:
```
Method: GET
Headers: None Required
Body: None Required
Params:
  - date (YYYY-MM-dd)
```
###### Response:
```
Returns a list of blocks occurring on the given `date`. Additionally provides a list of notices to display to the user.
```
---
### _Next Schoolday_
Path: __[/schedule/next](https://bbnknightlife.com/api/schedule/next)__
<br>
Purpose: __Fetches the next Date with blocks available.__
<br>
###### Request:
```
Method: GET
Headers: None Required
Body: None Required
Params:
  - date (YYYY-MM-dd) (this will typically be today's date)
```
###### Response:
```
Returns the Date and Schedule for the next day of school after the given `date`.
```
---
### _Retrieve Special Schedules_
Path: __[/schedule/special](https://bbnknightlife.com/api/schedule/special)__
<br>
Purpose: __Retrieves all upcoming special schedules for the next month.__
<br>
###### Request:
```
Method: GET
Headers: None Required
Body: None Required
Params:
  - date (YYYY-MM-dd) (this will typically be today's date)
```
###### Response:
```
Returns a list of schedules (and dates) across the next 28 days that have irregular block schedules or notices available for the user. This route is commonly accessed to display upcoming irregular schedule items.
```
## Lunch Routes
### _Retrieve Date Lunch Menu_
Path: __[/lunch](https://bbnknightlife.com/api/lunch)__
<br>
Purpose: __Retrieves the Lunch menu for a given date.__
<br>
###### Request:
```
Method: GET
Headers: None Required
Body: None Required
Params:
  - date (YYYY-MM-dd)
```
###### Response:
```
Returns a list of Foods, denoted by a name and nullable allergy, and a nullable menu title. This list of foods will be empty if there has been no menu inputted.
```
## Event Routes
### _Retrieve Date Events_
Path: __[/events](https://bbnknightlife.com/api/events)__
<br>
Purpose: __Retrieves all events for a given date.__
<br>
###### Request:
```
Method: GET
Headers: None Required
Body: None Required
Params:
  - date (YYYY-MM-dd)
```
###### Response:
```
Returns a list of Events occurring on the given `date`.
```
## Misc. Routes
### _Upcoming Items_
Path: __[/upcoming](https://bbnknightlife.com/api/upcoming)__
<br>
Purpose: __Retrieves all upcoming events, schedule changes, and notices.__
<br>
###### Request:
```
Method: GET
Headers: None Required
Body: None Required
Params:
  - date (YYYY-MM-dd)
```
###### Response:
```
Returns a compiled list of all Upcoming Items, sorted by date. These are of three types: Event, Schedule Change, Notice. There can be multiple Items for a single date.
```
## DEVELOPMENT ENVIRONMENT HOWTO

1. Install Docker Desktop.
https://www.docker.com/products/docker-desktop

2.  At the terminal, build the images, export the root certificate
for installing into the iOS simulator, then launch the containers.

```
$ cd knightlife-api
$ docker-compose build
$ docker/genca/export_ca.sh
$ docker-compose up
```

3. Open a Finder window, navigate to /Users/[you]/tempCA, and drag rootCA.cer
to the Simulator window.

4.  The simulator will tell you to finish installing it in Settings.
Navigate to Settings > About > Certificate Trust Settings and install.
