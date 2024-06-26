import EnvVars from '@src/constants/EnvVars';

import type { TMessage } from '@src/models/Message';
import type { TIdQuery } from '@src/types/IdQuery';
import type { TQueryOptions } from '@src/types/TQueryOptions';
import type { FilterQuery } from 'mongoose';

import Message from '@src/models/Message';

type TQuery = FilterQuery<TMessage>;

type TCreate = Pick<TMessage, 'body' | 'type' | 'created'> &
  Partial<Pick<TMessage, 'user' | 'reply'>> & {
    chat_room: TIdQuery;
  };

export type TUpdateMessage = Partial<TMessage>;

const getAll = async (query: TQuery, opts?: TQueryOptions<TMessage>) => {
  const messages = await Message.find(query)
    .limit(opts?.limit as number)
    .sort(opts?.sort)
    .skip((opts?.page as number) * EnvVars.Bandwidth.MAX_DOCS_PER_FETCH)
    .exec();

  return messages;
};

const getOne = async (query: TQuery) => {
  const message = await Message.findOne(query).exec();

  return message;
};

const createOne = async (data: TCreate) => {
  const message = new Message(data);
  const savedMessage = await message.save();

  return savedMessage;
};

const updateOne = async (query: TQuery, messageData: TUpdateMessage) => {
  await Message.findOneAndUpdate(query, messageData, { runValidators: true });
};

const deleteOne = async (query: TQuery) => {
  await Message.deleteOne(query);
};

const persists = async (ids: TIdQuery[]) => {
  const messages = await Message.find({ _id: { $in: ids } }).exec();

  return ids.length === messages.length;
};

const getCount = async (query: TQuery) => {
  const docCount = await Message.countDocuments(query).exec();

  return docCount;
};

export default {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
  persists,
  getCount,
} as const;
