const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const Route = require("../models/Route.model");
const RouteComment = require("../models/RouteComment.model");
const RouteRating = require("../models/RouteRating.model");
const Hike = require("../models/Hike.model");
const HikeComment = require("../models/HikeComment.model");

const { isAuthenticated } = require("../middleware/jwt.middleware.js");

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

// USER ROUTES
// Get logged-in user info
router.get("/user", (req, res, next) => {
  const { userId } = req.body;
  User.findById(userId)
    .then((foundUser) => {
      // console.log(foundUser);
      //* TO-DO: NEED TO ADD THE OTHER USER INFO OTHER THAN PASSWORD
      const { email, name, _id } = foundUser;

      // Create a new object that doesn't expose the password
      const user = { email, name, _id };

      // Send a json response containing the user object
      //console.log(user)
      res.status(201).json({ user: user });
    })
    .catch((error) => {
      console.error("Error while retrieving user info ->", error);
      res.status(500).json({ errorMessage: "Failed to retrieve user" });
    });
});

// Edit logged-in user info
router.put("/user/update", (req, res, next) => {
  const { userId } = req.body;
  //console.log(req.body)
  User.findByIdAndUpdate(userId, req.body, { new: true })
    .then((updatedUser) => {
      console.log("Updated user info ->", updatedUser);
      res.status(200).json(updatedUser);
    })
    .catch((error) => {
      console.error("Error while updating user info ->", error);
      res.status(500).json({ errorMessage: "Failed to update user info" });
    });
});

// Get logged-in user's hikes
router.get("/user-hikes/:userId", (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .populate("hikesJoined")
    .then((foundUser) => {
      //* TO-DO: Only show hikes that are in the future: Hike.find({ "date": { "$gte": date } }).sort({ date: 1 }).limit(3)
      console.log("Retrieved hikes joined ->", foundUser.hikesJoined);
      res.status(200).json(foundUser.hikesJoined);
    })
    .catch((error) => {
      console.error("Error retrieving hikes joined ->", error);
      res.status(500).json({ errorMessage: "Failed to retrieve hikes joined" });
    });
});

// Get User info by Id
router.get("/user/:userId", (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((foundUser) => {
      //console.log(foundUser);
      //* TO-DO: NEED TO ADD THE OTHER USER INFO OTHER THAN PASSWORD
      //* TO-DO: Should we hide the user's email as well? We might not want
      //* to allow users to snoop on each other's email addresses
      const { email, name, _id, age, hobbies, likes, description, city } =
        foundUser;

      // Create a new object that doesn't expose the password
      const user = { email, name, _id, age, hobbies, likes, description, city };

      // Send a json response containing the user object
      res.status(201).json(user);
    })
    .catch((error) => {
      console.error("Error while retrieving user info ->", error);
      res.status(500).json({ errorMessage: "Failed to retrieve user" });
    });
});

// ROUTE ROUTES
// Get all routes
router.get("/routes", (req, res, next) => {
  Route.find()
    .then((allRoutes) => {
      //console.log(allRoutes);
      res.status(200).json(allRoutes);
    })
    .catch((error) => {
      console.error("Error retrieving routes", error);
      res.status(500).json({ errorMessage: "Error retrieving routes" });
    });
});

// Add new route to database
router.post("/routes/create", (req, res, next) => {
  const {
    userId,
    name,
    city,
    length,
    duration,
    intensity,
    type,
    description,
    map,
    image,
  } = req.body;
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
    addedBy: userId,
  })
    .then((createdRoute) => {
      console.log("Route created ->", createdRoute);
      res.status(200).json(createdRoute);
    })
    .catch((error) => {
      console.log("Failed to create route", error);
      res.status(500).json({ errorMessage: "Failed to create route" });
    });
});

// Get Route info by Id
router.get("/routes/:routeId", (req, res, next) => {
  const { routeId } = req.params;
  //console.log(routeId)
  Route.findById(routeId)
    .then((foundRoute) => {
      console.log("Route found", foundRoute);
      res.status(200).json(foundRoute);
    })
    .catch((error) => {
      console.log("Failed to retrieve route", error);
      res.status(500).json({ errorMessage: "Failed to retrieve route" });
    });
});

//Get routes by city
router.get("/city/:city", (req, res, next) => {
  const { city } = req.params;
  //console.log("City:", city);
  Route.find({ city: { $regex: city } })
    .then((foundCityRoutes) => {
      console.log("City found", foundCityRoutes);
      res.status(200).json(foundCityRoutes);
    })
    .catch((error) => {
      console.log("Failed to retrieve city", error);
      res.status(500).json({ errorMessage: "Failed to retrieve city" });
    });
});

// Edit Route
router.put("/routes/edit/:routeId", (req, res, next) => {
  const { routeId } = req.params;
  const { clientId } = req.body;
  Route.findById(routeId)
    .populate("addedBy")
    .then((foundRoute) => {
      if (foundRoute.addedBy._id.toString() === clientId) {
        return Route.findByIdAndUpdate(routeId, req.body, { new: true });
      }
    })
    .then((updatedRoute) => {
      if (!updatedRoute) {
        res.status(403).json({ errorMessage: "Not authorized to edit route" });
      } else {
        console.log("Route updated! ->", updatedRoute);
        res.status(200).json(updatedRoute);
      }
    })
    .catch((error) => {
      console.log("Failed to update route ->", error);
      res.status(500).json({ errorMessage: "Failed to update route info" });
    });
});

// Delete Route
router.delete("/routes/delete/:routeId", isAuthenticated, (req, res, next) => {
  const { routeId } = req.params;
  Route.findById(routeId)
    .then((foundRoute) => {
      //console.log(foundRoute);
      if (foundRoute.addedBy._id.toString() === req.payload._id) {
        console.log("client and creator IDs match!");
        return Route.findByIdAndDelete(routeId);
      } else {
        console.log(
          "client and creator ID mismatch!",
          foundRoute.addedBy._id.toString(),
          clientId
        );
      }
    })
    .then((deletedRoute) => {
      if (!deletedRoute) {
        res
          .status(403)
          .json({ errorMessage: "Not authorized to delete route" });
      } else {
        console.log("Route deleted", deletedRoute);
        res.status(200).json(deletedRoute);
      }
    })
    .catch((error) => {
      console.log("Failed to delete route", error);
      res.status(500).json({ errorMessage: "Failed to delete route" });
    });
});

// ROUTE COMMENT ROUTES
// Create new comment on route by Id
//* THIS ROUTE PROBABLY NEEDS TO BE REPATHED, it likely conflicts with
//* with get('/routes/:routeId) above
router.post("/routes/comment/:routeId", (req, res, next) => {
  const { routeId } = req.params;
  const { userId, textBody } = req.body;
  RouteComment.create({
    user: userId,
    route: routeId,
    textBody,
  })
    .then((newComment) => {
      return Route.findByIdAndUpdate(routeId, {
        $push: { comments: newComment._id },
      });
    })
    .then((response) => {
      console.log("Comment added successfully!");
      res.status(200).json({ successMessage: "Comment added successfully!" });
    })
    .catch((error) => {
      console.log("Failed to add comment", error);
      res.status(500).json({ errorMessage: "Failed to add comment" });
    });
});

// HIKE ROUTES
// Create new Hike
router.post("/hikes/create", (req, res, next) => {
  const { name, description, route, date, startTime, userId } = req.body;
  Hike.create({ name, description, route, date, startTime, createdBy: userId })
    .then((createdHike) => {
      console.log("Created new hike ->", createdHike);
      res.status(201).json(createdHike);
    })
    .catch((error) => {
      console.error("Error creating new hike ->", error);
      res.status(500).json({ errorMessage: "Failed to create new hike" });
    });
});

//Get month and year hikes
router.get("/day/:date", (req, res, next) => {
  const { date } = req.params;
  //console.log("Date: ", date);
  Hike.find({ date: { $regex: date } })
    .populate("route")
    .populate("attendees")
    .then((foundHikes) => {
      console.log("Date found", foundHikes);
      res.status(200).json(foundHikes);
    })
    .catch((error) => {
      console.log("Failed to retrieve date", error);
      res.status(500).json({ errorMessage: "Failed to retrieve date" });
    });
});

// Get Upcoming hikes
router.get("/hikes/upcoming/:date", (req, res, next) => {
  const { date } = req.params;
  Hike.find({ date: { $gte: date } })
    .sort({ date: 1 })
    .limit(3)
    .populate("route")
    .then((foundHikes) => {
      res.status(200).json(foundHikes);
    })
    .catch((error) => {
      console.log("Failed to retrieve date", error);
      res.status(500).json({ errorMessage: "Failed to retrieve date" });
    });
});

// Get Upcoming hikes for logged-in user
/* Work in Progress - do not delete
router.get("/hikes/user-upcoming/:date", isAuthenticated, (req, res, next) => {
  const { date } = req.params;
  const userId = req.payload.id;
  Hike.find({"date": {$gte: date}, "attendees": {$in : [ObjectId(userId)]}})
    .sort({ date: 1 })
    .limit(3)
    .populate("route")
    .then((foundHikes) => {
      res.status(200).json(foundHikes);
    })
    .catch((error) => {
      console.log("Failed to retrieve date", error);
      res.status(500).json({ errorMessage: "Failed to retrieve date" });
    });
});
*/

//join new Hike - Gavs
//*TO-DO: Check the attendees array to see if the user is already added to it. If so, return an error message. This also gets addressed in the frontend, but the extra securtiy check is good here*//
router.put("/hikes/join/:hikeId", (req, res, next) => {
  const { hikeId } = req.params;
  const { userId } = req.body;
  //console.log(hikeId);

  Hike.findByIdAndUpdate(
    { _id: hikeId },
    { $push: { attendees: userId } },
    { new: true }
  )
    .populate("route")
    .then((foundHike) => {
      return User.findByIdAndUpdate(
        userId,
        { $push: { hikesJoined: foundHike._id } },
        { new: true }
      );
    })
    .then((updatedUser) => {
      res.status(200).json(updatedUser);
    })
    .catch((error) => {
      console.log("Failed to retrieve route", error);
      res.status(500).json({ errorMessage: "Failed to retrieve route" });
    });
});

// Edit Hike
router.put("/hikes/edit/:hikeId", (req, res, next) => {
  const { hikeId } = req.params;
  const { clientId, name, description, route, date, startTime, image } =
    req.body;
  console.log(req.body);
  Hike.findById(hikeId)
    .populate("createdBy")
    .then((foundHike) => {
      if (foundHike.createdBy._id.toString() === clientId) {
        console.log("ID MATCH!");
        return Hike.findByIdAndUpdate(hikeId, req.body, { new: true });
      }
    })
    .then((updatedHike) => {
      if (!updatedHike) {
        res.status(403).json({ errorMessage: "Not authorized to edit hike" });
      } else {
        console.log("Hike updated! ->", updatedHike);
        res.status(200).json(updatedHike);
      }
    })
    .catch((error) => {
      console.log("Failed to update hike ->", error);
      res.status(500).json({ errorMessage: "Failed to update hike info" });
    });
});

// Delete Hike
//*TO-DO: Need to remove the hike from the hikesJoined arrays for all attendees
router.delete("/hikes/delete/:hikeId", isAuthenticated, (req, res, next) => {
  const { hikeId } = req.params;
  //console.log(req.payload);
  Hike.findById(hikeId)
    .then((foundHike) => {
      if (foundHike.createdBy._id.toString() === req.payload._id) {
        console.log("client and creator IDs match!");
        return Hike.findByIdAndDelete(hikeId);
      } else {
        console.log(
          "client and creator ID mismatch!",
          foundHike.createdBy._id.toString(),
          clientId
        );
      }
    })
    .then((deletedHike) => {
      if (!deletedHike) {
        res.status(403).json({ errorMessage: "Not authorized to delete hike" });
      } else {
        console.log("Hike deleted", deletedHike);
        res.status(200).json(deletedHike);
      }
    })
    .catch((error) => {
      console.log("Failed to delete hike", error);
      res.status(500).json({ errorMessage: "Failed to delete hike" });
    });
});

//Get Hike info by ID
router.get("/hikes/:hikeId", (req, res, next) => {
  const { hikeId } = req.params;
  Hike.findById(hikeId)
    .populate("createdBy")
    .populate("route")
    .populate("attendees")
    .then((foundHike) => {
      //console.log("Hike found", foundHike);
      res.status(200).json(foundHike);
    })
    .catch((error) => {
      console.log("Failed to retrieve hike", error);
      res.status(500).json({ errorMessage: "Failed to retrieve hike" });
    });
});

//* Internal only - Add createdBy to all Hikes
router.put("/hikes/add-creator", (req, res, next) => {
  const { createdBy } = req.body;
  Hike.updateMany({}, { createdBy: createdBy })
    .then((updatedHikes) => {
      console.log("Hikes updated!", updatedHikes);
      res.status(200).json(updatedHikes);
    })
    .catch((error) => {
      console.log("Failed to update Hikes");
      res.status(500).json({ errorMessage: "Failed to update hikes" });
    });
});

router.put("/routes/add-addedBy", (req, res, next) => {
  const { addedBy } = req.body;
  Route.updateMany({}, { addedBy: addedBy })
    .then((updatedRoutes) => {
      console.log("Routes updated!", updatedRoutes);
      res.status(200).json(updatedRoutes);
    })
    .catch((error) => {
      console.log("Failed to update Routes");
      res.status(500).json({ errorMessage: "Failed to update routes" });
    });
});

module.exports = router;
