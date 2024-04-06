import User, { TUserMutable } from '@src/models/User';

import { TUser } from '@src/models/User';

const getAll = async (): Promise<TUser[]> => {
  const allUsers = await User.find().exec();

  return allUsers;
};

const getOne = async (id: string): Promise<TUser | null> => {
  const user = await User.findById(id).exec();

  return user;
};

const persists = async (id: string): Promise<boolean> => {
  const persistingUser = await User.findById(id).exec();

  return !!persistingUser;
};

const createOne = async (data: TUserMutable): Promise<void> => {
  const newUser = new User(data);
  await newUser.save();
};

const updateOne = async (id: string, data: TUserMutable): Promise<void> => {
  await User.findByIdAndUpdate(id, data, {
    runValidators: true,
    new: true,
  });
};

const deleteOne = async (userId: string): Promise<void> => {
  await User.findByIdAndDelete(userId);
};

export default {
  getAll,
  getOne,
  persists,
  createOne,
  updateOne,
  deleteOne: deleteOne,
} as const;
