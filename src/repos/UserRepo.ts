import User, { TUser } from '@src/models/User';
import { FilterQuery } from 'mongoose';

type TQuery = FilterQuery<TUser>;

type TCreate = Omit<TUser, '_id' | 'profile_image'>;

type TUpdate = Partial<TUser>;

const getAll = async (query: TQuery): Promise<TUser[]> => {
  const allUsers = await User.find(query).exec();

  return allUsers;
};

const getOne = async (query: TQuery): Promise<TUser | null> => {
  const user = await User.findOne(query).exec();

  return user;
};

const createOne = async (data: TCreate): Promise<void> => {
  const newUser = new User(data);
  await newUser.save();
};

const updateOne = async (id: string, data: TUpdate): Promise<void> => {
  await User.findByIdAndUpdate(id, data, {
    runValidators: true,
    new: true,
  });
};

const deleteOne = async (id: string): Promise<void> => {
  await User.findByIdAndDelete(id);
};

const persistOne = async (query: TQuery): Promise<boolean> => {
  const persistingUser = await User.findOne(query).exec();

  return !!persistingUser;
};

const persistMany = async (ids: string[]): Promise<boolean> => {
  const persistingUsers = await User.find({ _id: { $in: ids } }).exec();

  return persistingUsers.length === ids.length;
};

export default {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
  persistOne,
  persistMany,
} as const;
