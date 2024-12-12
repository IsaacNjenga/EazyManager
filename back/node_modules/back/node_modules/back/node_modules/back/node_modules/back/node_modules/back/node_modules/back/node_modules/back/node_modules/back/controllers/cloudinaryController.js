import cloudinary from "cloudinary";

// Configure Cloudinary globally
cloudinary.config({
  cloud_name: "dinsdfwod",
  api_key: "362982159655861",
  api_secret: "zPsy9pTxBixisFle7sbttY18uBg",
});

const deleteImage = async (req, res) => {
  const { publicId } = req.body;

  try {
    const timestamp = Math.floor(Date.now() / 1000);

    // Generate signature
    const signature = cloudinary.utils.api_sign_request(
      { public_id: publicId, timestamp },
      "zPsy9pTxBixisFle7sbttY18uBg"
    );

    // Perform deletion
    const result = await cloudinary.uploader.destroy(publicId, {
      timestamp,
      signature,
      api_key: "362982159655861", // This should now work
    });

    res.status(200).json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export { deleteImage };
