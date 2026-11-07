import bcrypt from "bcrypt";

export const hashPassword = (password) => bcrypt.hash(password, 10);

export const comparePassword = (password, hashedPassword) =>
  bcrypt.compare(password, hashedPassword);

// user data that is safe to send to the client
export const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  address: user.address,
  role: user.role,
});
