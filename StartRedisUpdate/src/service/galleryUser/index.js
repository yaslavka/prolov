const { GalleryUserModels } = require("../../Models/GalleryUserModels");

module.exports = async (id) => {
  return await GalleryUserModels.findAll({
    where: { userId: id },
  });
};
