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
- [ ] goal: asynchronous request returns a Promise instead of accepting a callback

### p4 express
