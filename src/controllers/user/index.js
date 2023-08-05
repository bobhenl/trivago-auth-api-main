const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const userController = {
  getUserData: async (req, res) => {
    // Retrieve user data based on authenticated user's ID

    try {
      // Fetch user data from the database using the provided user ID
      const userData = await prisma.user.findUnique({
        where: {
          id: req.user.id,
        },
      });

      // If the user data is not found, return a 404 error
      if (!userData)
        return res.status(404).json({ msg: "User not found with this ID" });

      // Return the user data with only the necessary fields (id, email, and createdAt)
      res.json({
        id: userData.id,
        email: userData.email,
        createdAt: userData.createdAt,
      });
    } catch (error) {
      console.error("Error while fetching user data:", error);
      res.status(500).json({ msg: "An internal server error occurred" });
    }
  },
};

module.exports = userController;
