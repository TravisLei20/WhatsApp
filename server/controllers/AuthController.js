import getPrismaInstance from "../utils/PrismaClient.js";

export const checkUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.json({ msg: "Email is required", status: false });
    }
    const prisma = getPrismaInstance();
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return res.json({ msg: "User not found", status: false });
    } else {
      return res.json({ msg: "User found", status: true, data: user });
    }
  } catch (error) {
    next(error);
  }
};

export const onBoardUser = async (req, res, next) => {
  try {
    console.log("onBoardUser");
    console.log(req.body);

    const { email, name, about, image: profilePicture } = req.body;
    if (!email || !name || !profilePicture) {
      return res.send("Email, Name and Image are required.");
    }
    const prisma = getPrismaInstance();
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        about,
        profilePicture,
      },
    });
    if (!newUser) {
      return res.json({ msg: "Failed to create user", status: false });
    }
    console.log(newUser);

    return res.json({ msg: "Success", status: true, id: newUser.id });
  } catch (error) {
    next(error);
  }
};
