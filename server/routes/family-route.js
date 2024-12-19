const express = require("express");
const familyRouter = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
familyRouter.use(authMiddleware);

const Family = require("../models/family-model");

// Get all family members associated with the user
familyRouter.get("/", async (req, res) => {
    try {
        const userID = req.userID;
        const familyMembers = await Family.find({ user: userID });
        res.send({
            familyMembers: familyMembers,
            message: "Family members retrieved successfully",
            status: 1,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Failed to retrieve family members",
            status: 0,
        });
    }
});

// Create a new family member entry
familyRouter.post("/create", async (req, res) => {
    try {
        const userID = req.userID;
        let familyMember = new Family({
            name: req.body.name,
            birthday: req.body.birthday,
            contact: req.body.contact,
            address: req.body.address,
            hobby: req.body.hobby,
            song: req.body.song,
            movie: req.body.movie,
            gift: req.body.gift,
            memory: req.body.memory,
            quote: req.body.quote,
            user: userID,
            color: req.body.color,
            characterIcon: req.body.characterIcon,
        });
        await familyMember.save();
        res.send({
            message: "Family member created",
            status: 1,
            familyMember: familyMember,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: "Failed to create family member",
            status: 0,
        });
    }
});

// Update a selected family member by their ID
familyRouter.patch("/:id", async (req, res) => {
    try {
        const familyMemberID = req.params.id;
        const userID = req.userID;
        const updatedFamilyMember = await Family.findOneAndUpdate(
            { _id: familyMemberID, user: userID },
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedFamilyMember) {
            return res.status(404).send({
                message: "Family member not found or not authorized",
                status: 0,
            });
        }

        res.send({
            message: "Family member updated successfully",
            status: 1,
            familyMember: updatedFamilyMember,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: "Failed to update family member",
            status: 0,
        });
    }
});

// Delete a selected family member by their ID
familyRouter.delete("/:id", async (req, res) => {
    try {
        const familyMemberID = req.params.id;
        const userID = req.userID;
        const deletedFamilyMember = await Family.findOneAndDelete({ _id: familyMemberID, user: userID });

        if (!deletedFamilyMember) {
            return res.status(404).send({
                message: "Family member not found or not authorized",
                status: 0,
            });
        }

        res.send({
            message: "Family member deleted successfully",
            status: 1,
            familyMember: deletedFamilyMember,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Failed to delete family member",
            status: 0,
        });
    }
});

module.exports = familyRouter;
