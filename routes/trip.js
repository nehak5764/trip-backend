// const express = require("express");
// const router = express.Router();
// const {
//   createTrip,
//   getTrip,
//   getUserTrips,
//   joinTripByCode,
//   updateTrip,
// } = require("../controllers/tripController");
// const { authMiddleware } = require("../middleware/authMiddleware");
// const Trip = require("../models/Trip");

// /* -------------------- ROUTES -------------------- */

// // ✅ Create a new trip
// router.post("/", authMiddleware, createTrip);

// // ✅ Get all trips for the logged-in user
// router.get("/", authMiddleware, getUserTrips);

// // ✅ Get a specific trip
// router.get("/:tripId", authMiddleware, getTrip);

// // ✅ Join trip by invite code
// router.post("/join", authMiddleware, joinTripByCode);

// // ✅ Update trip (edit title/description)
// router.put("/:id", authMiddleware, updateTrip);

// // ✅ Leave trip (for members)
// router.delete("/:id/leave", authMiddleware, async (req, res) => {
//   try {
//     const trip = await Trip.findById(req.params.id);
//     if (!trip) return res.status(404).json({ message: "Trip not found" });

//     // Remove current user from members
//     trip.members = trip.members.filter(
//       (m) => m.user.toString() !== req.user._id.toString()
//     );

//     // ✅ If no members remain, delete the trip completely
//     if (trip.members.length === 0) {
//       await Trip.findByIdAndDelete(req.params.id);
//       return res.json({ message: "Trip deleted (no members left)" });
//     }

//     await trip.save();
//     res.json({ message: "Left the trip successfully" });
//   } catch (err) {
//     console.error("Error leaving trip:", err);
//     res.status(500).json({ message: err.message });
//   }
// });

// // ✅ Delete trip (only by admin)
// router.delete("/:id", authMiddleware, async (req, res) => {
//   try {
//     const trip = await Trip.findById(req.params.id);
//     if (!trip) return res.status(404).json({ message: "Trip not found" });

//     // Check if the requester is admin
//     const isAdmin = trip.members.some(
//       (m) => m.user.toString() === req.user._id.toString() && m.role === "admin"
//     );

//     if (!isAdmin) {
//       return res
//         .status(403)
//         .json({ message: "Only admin can delete the trip" });
//     }

//     await Trip.findByIdAndDelete(req.params.id);
//     res.json({ message: "Trip deleted successfully" });
//   } catch (err) {
//     console.error("Error deleting trip:", err);
//     res.status(500).json({ message: err.message });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const {
  createTrip,
  getTrip,
  getUserTrips,
  joinTripByCode,
  updateTrip,
} = require("../controllers/tripController");
const { authMiddleware } = require("../middleware/authMiddleware");
const Trip = require("../models/Trip");

/* -------------------- ROUTES -------------------- */

// ✅ Create a new trip (includes destination)
router.post("/", authMiddleware, createTrip);

// ✅ Get all trips for the logged-in user
router.get("/", authMiddleware, getUserTrips);

// ✅ Get a specific trip by ID
router.get("/:tripId", authMiddleware, getTrip);

// ✅ Join a trip using invite code
router.post("/join", authMiddleware, joinTripByCode);

// ✅ Update trip (edit title, description, or destination)
router.put("/:id", authMiddleware, updateTrip);

// ✅ Leave a trip (for regular members)
router.delete("/:id/leave", authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    // Remove the user from trip members
    trip.members = trip.members.filter(
      (m) => m.user.toString() !== req.user._id.toString()
    );

    // ✅ If no members remain, delete the trip
    if (trip.members.length === 0) {
      await Trip.findByIdAndDelete(req.params.id);
      return res.json({ message: "Trip deleted (no members left)" });
    }

    await trip.save();
    res.json({ message: "Left the trip successfully" });
  } catch (err) {
    console.error("Error leaving trip:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Delete a trip (only admin can delete)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    // Ensure only admin can delete
    const isAdmin = trip.members.some(
      (m) => m.user.toString() === req.user._id.toString() && m.role === "admin"
    );

    if (!isAdmin)
      return res
        .status(403)
        .json({ message: "Only the trip admin can delete this trip" });

    await Trip.findByIdAndDelete(req.params.id);
    res.json({ message: "Trip deleted successfully" });
  } catch (err) {
    console.error("Error deleting trip:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
