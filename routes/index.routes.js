const express = require("express");
const router = express.Router();
const User = require ("../models/User.model");
const Route = require ("../models/Route.model");
const RouteComment = require ("../models/RouteComment.model");
const RouteRating = require ("../models/RouteRating.model");
const Hike = require ("../models/Hike.model");
const HikeComment = require ("../models/HikeComment.model");


router.get("/", (req, res, next) => {
  res.json("All good in here");
});


// USER ROUTES
// Get logged-in user info
router.get("/user", (req, res, next)=>{
  const {userId} = req.body;
  User.findById(userId)
  .then((foundUser)=>{
    console.log(foundUser);
    //* TO-DO: NEED TO ADD THE OTHER USER INFO OTHER THAN PASSWORD
      const { email, name, _id } = foundUser;

      // Create a new object that doesn't expose the password
      const user = { email, name, _id };

      // Send a json response containing the user object
      console.log(user)
      res.status(201).json({ user: user });
  })
  .catch((error)=>{
    console.error("Error while retrieving user info ->", error);
    res.status(500).json({errorMessage: "Failed to retrieve user"})
  })
})

// Update logged-in user info
router.put("/user/update", (req, res, next)=>{
  const {userId} = req.body;
  User.findByIdAndUpdate(userId, req.body, {new: true})
  .then((updatedUser)=>{
    console.log("Updated user info ->", updatedUser);
    res.status(204).json(updatedUser);
  })
  .catch((error)=>{
    console.error("Error while updating user info ->", error);
    res.status(500).json({errorMessage: "Failed to update user info"})
  })
})

// Get logged-in user's hikes
router.get("/user-hikes", (req, res, next)=>{
  const{userId} = req.body;
  User.findById(userId)
  .then((foundUser)=>{
    //* TO-DO: Probably need to retrieve or send back only upcoming hikes
    console.log("Retrieved hikes joined ->", foundUser.hikesJoined);
    res.status(200).json(foundUser.hikesJoined);
  })
  .catch((error)=>{
    console.error('Error retrieving hikes joined ->', error);
    res.status(500).json({errorMessage: "Failed to retrieve hikes joined"})
  });
});

// Get User info by Id
router.get("/user/:userId", (req, res, next)=>{
  const{userId} = req.params;
  User.findById(userId)
  .then((foundUser)=>{
    console.log(foundUser);
    //* TO-DO: NEED TO ADD THE OTHER USER INFO OTHER THAN PASSWORD
    //* TO-DO: Should we hide the user's email as well? We might not want
    //* to allow users to snoop on each other's email addresses
    const { email, name, _id } = foundUser;
    
    // Create a new object that doesn't expose the password
    const user = { email, name, _id };
    
    // Send a json response containing the user object
    res.status(201).json({ user: user });
  })
  .catch((error)=>{
    console.error("Error while retrieving user info ->", error);
    res.status(500).json({errorMessage: "Failed to retrieve user"})
  });
})

// ROUTE ROUTES
// Get all routes
router.get('/routes', (req, res, next)=>{
  Route.find()
  .then((allProjects)=>{
    console.log(allProjects);
    res.status(200).json(allProjects);
  })
  .catch((error)=>{
    console.error("Error retrieving routes", error);
    res.status(500).json({errorMessage: "Error retrieving routes"});
  })
})

// Add new route to database
router.post('/routes/create', (req, res, next)=>{
  const {userId, name, city, length, duration, intensity, type, description, map, image} = req.body;
  Route.create({
    name,
    city,
    length,
    duration,
    intensity,
    type,
    description,
    map,
    image,
    addedBy: userId
  })
  .then((createdRoute)=>{
    console.log("Route created ->", createdRoute);
    res.status(200).json({successMessage: "New route created!"});
  })
  .catch((error)=>{
    console.log("Failed to create route", error);
    res.status(500).json({errorMessage: "Failed to create route"});
  })
})


  // Get Route info by Id
  router.get('/routes/:routeId', (req, res, next)=>{
    const {routeId} = req.params;
    console.log(routeId)
    Route.findById(routeId)
    .then((foundRoute)=>{
      console.log("Route found", foundRoute);
      res.status(200).json(foundRoute);
    })
    .catch((error)=>{
      console.log("Failed to retrieve route", error);
      res.status(500).json({errorMessage: "Failed to retrieve route"});
    })
  })
  
  // ROUTE COMMENT ROUTES
  // Create new comment on route by Id
  //* THIS ROUTE PROBABLY NEEDS TO BE REPATHED, it likely conflicts with
  //* with get('/routes/:routeId) above
  router.post('/routes/comment/:routeId', (req, res, next)=>{
    const {routeId} = req.params;
    const {userId, textBody} = req.body;
    RouteComment.create({
      user: userId,
      route: routeId,
      textBody
    })
    .then((newComment)=>{
      return Route.findByIdAndUpdate(routeId, {$push: { comments: newComment._id }
      })
    })
    .then((response)=>{
      console.log("Comment added successfully!")
      res.status(200).json({successMessage: "Comment added successfully!"})
    })
    .catch((error)=>{
      console.log("Failed to add comment", error);
      res.status(500).json({errorMessage: "Failed to add comment"})
    })
  })

  
  // HIKE ROUTES
  // Create new Hike
  router.post('/hikes/create', (req, res, next)=>{
    const {name, description, route, date, startTime, userId} = req.body;
    Hike.create({name, description, route, date, startTime, creator: userId})
    .then((createdHike)=>{
      console.log("Created new hike ->", createdHike);
      res.status(201).json(createdHike);
    })
    .catch((error)=>{
      console.error('Error retrieving hikes joined ->', error);
      res.status(500).json({errorMessage: "Failed to create new hike"})
    });
  })



//join new Hike - Gavs
router.post('/hikes/join/:hikeId', (req, res, next) => {
  const { hikeId } = req.params;
  console.log(hikeId)
  Hike.findById(hikeId)
    .then((foundHike) => {
      console.log("Hike found", foundHike);
      res.status(200).json(foundHike);
    })
    .catch((error) => {
      console.log("Failed to retrieve route", error);
      res.status(500).json({ errorMessage: "Failed to retrieve route" });
    })
})






module.exports = router;