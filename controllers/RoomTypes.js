import RoomTypes from "../models/RoomTypeModel.js";

export const getRoomTypes = async (req, res) => {
  try {
    const response = await RoomTypes.findAll({
      attributes: ["uuid", "name", "description"],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getRoomType = async (req, res) => {
  try {
    const response = await RoomTypes.findOne({
      attributes: ["uuid", "name", "description"],
      where: {
        uuid: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createRoomType = async (req, res) => {
  const { name, description } = req.body;
  const roomType = {
    uuid: "RT-" + Date.now(),
    name: name,
    description: description,
  };

  try {
    // Validasi input
    if (!name || !description) {
      return res
        .status(400)
        .json({ msg: "Name and description are required." });
    }

    // Log sebelum operasi database
    console.log(`Creating Room Type: ${JSON.stringify(roomType)}`);

    // Operasi database
    await RoomTypes.create(roomType);

    // Log setelah operasi database
    console.log(`Room Type Created: ${JSON.stringify(roomType)}`);

    res.json({
      message: "Room Type Created",
    });
  } catch (error) {
    // Log jika terjadi kesalahan
    console.error(`Error creating Room Type: ${error.message}`);

    res.status(400).json({ msg: error.message });
  }
};

export const updateRoomType = async (req, res) => {
  const roomType = await RoomTypes.findOne({
    where: {
      uuid: req.params.id,
    },
  });

  if (!roomType) {
    return res.status(404).json({ msg: "Room Type not found" });
  }

  const { name, description } = req.body;

  const updates = {};

  if (name !== undefined) {
    updates.name = name;
  }

  if (description !== undefined) {
    updates.description = description;
  }

  try {
    await RoomTypes.update(updates, {
      where: {
        id: roomType.id,
      },
    });

    res.status(200).json({ msg: "Room Type Updated" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteRoomType = async (req, res) => {
  try {
    await RoomTypes.destroy({
      where: {
        uuid: req.params.id,
      },
    });
    res.status(200).json({ msg: "Room Type Deleted" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
