const Family = require("../models/family-model");

const getAllFamilyMembers = async (req, res, next) => {
  try {
    const familyMembers = await Family.find({ user: req.user.id });
    res.status(200).json(familyMembers);
  } catch (error) {
    next(error);
  }
};

const createFamilyMember = async (req, res, next) => {
  try {
    const { name, birthday, contact, address, hobby, song, movie, gift, memory, quote, characterIcon } = req.body;
    const familyMember = new Family({
      name,
      birthday,
      contact,
      address,
      hobby,
      song,
      movie,
      gift,
      memory,
      quote,
      user: req.user.id,
      characterIcon
    });
    await familyMember.save();
    res.status(201).json(familyMember);
  } catch (error) {
    next(error);
  }
};

const updateFamilyMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, birthday, contact, address, hobby, song, movie, gift, memory, quote, characterIcon } = req.body;
    const familyMember = await Family.findByIdAndUpdate(id, {
      name,
      birthday,
      contact,
      address,
      hobby,
      song,
      movie,
      gift,
      memory,
      quote,
      characterIcon
    }, { new: true, runValidators: true });
    
    if (!familyMember) {
      return res.status(404).json({ msg: "Family member not found" });
    }

    res.status(200).json(familyMember);
  } catch (error) {
    next(error);
  }
};

const deleteFamilyMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedFamilyMember = await Family.findByIdAndDelete(id);

    if (!deletedFamilyMember) {
      return res.status(404).json({ msg: "Family member not found" });
    }

    res.status(200).json({ msg: "Family member deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllFamilyMembers, createFamilyMember, updateFamilyMember, deleteFamilyMember };
