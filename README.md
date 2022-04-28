# Ex.3 BusBoard

given a postcode, finds the two nearest bus stops, and shows the next five buses due at each.

### p1 bus times
ask the user for a stop code:
- [x] print a list of the next five buses at that stop code
- [x] with their routes, destinations, and the time until they arrive in minutes.

### p2 bus stops
- [x] postcode -> lon lat   (http://api.postcodes.io)
- [x] lon lat -> bus stop   (get a list of StopPoints within)
- [x] combine them

### p3 promises
- [x] pull each function out and give them their own definition
- [ ] give chance to pass errors along to the top-level function.
- [x] goal: asynchronous request returns a Promise instead of accepting a callback

### p4 express
- [x] Create an endpoint ('/board') which takes the postcode as a query parameter 
- [x] and returns the next 5 arrivals for the closest 2 stops as an appropriate JSON object
- [x] Run your Express application and try to access this endpoint from your browser to check that it's working.

See if you can return a sensible error code in case you can't find any results!

### p5 all aboard
- [x] render HTML
- [x] Get the postcode that was entered
- [x] Execute some js when the form is submitted using the onsubmit attribute of the form element
- [x] Make a request to our API endpoint to find the data for that postcode
- [x] Update the HTML from js to display the results

### p6 html
- [x] add a page
- [ ] add more new features
- [ ] navigate between pages

### stretch goals
- [ ] CSS
- [ ] aotomatic refresh
- [ ] display error message if postcode is invalid
