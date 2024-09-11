import bcrypt from "bcryptjs";

export const encryptPass = async (pass) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(pass, salt);
};

export const comparePass = async (pass, receivedPass) => {
  return await bcrypt.compare(pass, receivedPass);
};
