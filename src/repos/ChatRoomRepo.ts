import EnvVars from '@src/constants/EnvVars';
import ChatRoom, { TChatRoom } from '@src/models/ChatRoom';
import { TQueryOptions } from '@src/types/TQueryOptions';
import { Document, FilterQuery } from 'mongoose';

type TQuery = FilterQuery<TChatRoom>;

type TCreate = Omit<TChatRoom, '_id' | 'name'>;

export type TUpdateChatRoom = Partial<TChatRoom>;

const getAll = async (
  query: TQuery,
  opts?: TQueryOptions<TChatRoom>,
): Promise<(Document<unknown, unknown, TChatRoom> & TChatRoom)[]> => {
  const allChatRooms = await ChatRoom.find(query)
    .sort(opts?.sort)
    .skip((opts?.page as number) * EnvVars.Bandwidth.maxDocsPerFetch)
    .exec();

  return allChatRooms;
};

const getOne = async (
  query: TQuery,
): Promise<(Document<unknown, unknown, TChatRoom> & TChatRoom) | null> => {
  const chatRoom = await ChatRoom.findOne(query).exec();

  return chatRoom;
};

const createOne = async (data: TCreate): Promise<void> => {
  const newChatRoom = new ChatRoom(data);
  await newChatRoom.save();
};

const updateOne = async (
  query: TQuery,
  newData: TUpdateChatRoom,
): Promise<void> => {
  await ChatRoom.findOneAndUpdate(query, newData, {
    runValidators: true,
    new: true,
  }).exec();
};

const persists = async (query: TQuery): Promise<boolean> => {
  const persistingChatRoom = await ChatRoom.findOne(query).exec();

  return !!persistingChatRoom;
};

export default {
  getAll,
  getOne,
  createOne,
  updateOne,
  persists,
} as const;
