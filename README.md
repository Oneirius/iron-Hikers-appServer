# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


💻 <b>Programs</b> 

Welcome to our Full-Stack Application, using MERN. 

It contains an SPA frontend, built with React and a REST API backend build with ExpressJS, MONGODB and Mongoose for data rendering. Both will implement CRUD actions. 

We have six database models, sign-up, log-in and log-out functionality, with encrypted passwords and authorization. There are two repos published on GitHub and the backend deployed on Vercel. 

The process took 8 working days, including the deployment and presentation organisation. It will be presented to a jury on the final day of the course. 

🗺️🏔️🚶🏿‍♀️

<img src="./src/assets/Screenshot.png" alt="Dashboard wireframe" width="400px">
<br></br>

As for the app, it is a activity-based program allowing you to search for hikes and routes around the world, with the option to join hikers if you desire. First, you will need to sign-up, then log-in, to give you access to the hikes and routes. You can update your userpage with your likes and hobbies, as well as selected city, allowing other users to learn more about you. Then you can see a calender showing all of the upcoming hikes and routes in your selected city. You can choose to join hikes, or choose to create your own. Attenders (users) will be added to each route so users can see how many people and who will be hiking on said day.

🔗<link> </link> 

Thank you, and hope you enjoy!


👩‍💻<b>The Team</b>

Gavin Alexander, Barbara Lancuba, Kumar Daryanani 


<img src="./src/assets/groupPhoto.jpg" alt="Dashboard wireframe" width="400px">


⚙️ BACK END CODE


| Route | Path | Description |  |
| --- | --- | --- | --- |
| Sign-up | /signup | POST route to create a new user
|   |   |  | 
| Log-in | /login | POST route to login and generate a token |   |
| User Page | /user | GET route to get currently logged in user info |   |
| User Update | /user/update  | PUT/PATCH route to edit currently logged in user info |   |
| User ID | /user/:userId | GET route to get other user info |   |
| Hikes Dashboard | /hikes/dashboard | GET route to retrieve hikes the currently logged in user has joined |   |
| Create Hike Page | /hikes/create | POST route to create a new hike event |   |
| Hike ID Page | /hikes/join/:hikeId |  PATCH route to add the currently logged in user to a hike’s list of attendees |   |
| Hike Comment  | /hikes/comment/:hikeId | PATCH route to add a comment from the currently logged in user to an event (requires the user to be attending the hike)  |   |
| Hike Day | /hikes/day?date=0000-00-00 | GET route to show all hikes scheduled for the provided day |   |
| Create Route Pages | /routes/create | POST route to add a new route to the database |   |
| Route ID Pages | /routes:routeId | GET route to retrieve a route’s info by Id |   |
| Routes Comments Page | /routes/comment/:routeId | PATCH route to add a comment to a route by Id |   |
| Routes Rating Page | /routes/rating/:routeId | PATCH route to add a rating to a route by Id |   |


| Components | Where | Links |
| --- | --- | --- |
| Navbar | Home, City, Routes, User|
| Footer | About, GitHub |
| RouteGuard | To make pages private when logged in |
| HikeListCard | To show user's hikes|
| Calendar |Showing available hikes|
| RouteListCard | A list of routes|
| Upcoming Hikes | Showing upcoming hike cards to the user |

| Models |
| --- |
| User = {name, email, password, likes, hobbies, description, age, selected city} |
| Routes = {city, duration, difficulty, rating, description} |
| Hikes = {route, date, time, name, description, creator, attendees, comments} |
| Rating = {user, date, score, routecomment} |
| Hike Comment = {user, date, time, comment} |
| Route Comment = {user, date, time, comment, addphoto} |


| Backlog | 🤔
| An Interactive map showing available hikes around the world, Add more example of hikes and routes, Install an extension to select all countries in the world
