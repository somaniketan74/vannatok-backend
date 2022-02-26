import { Content, Like } from "../../lib/models";
import { LambdaLogic } from "../../lib/types/AWS";
import { handlerWrapper, HttpError } from "../../lib/utils";
import { createLikeSchema } from "./validators";

const create: LambdaLogic = async (event, _context) => {
  const { contentId, type } = event.body as any;
  const userId = event.user.id;
  const oldLike = await Like.findOne({ userId, contentId });

  if (oldLike) {
    return oldLike;
  }

  const session = await Like.db.startSession();
  session.startTransaction();
  try {
    await Content.updateOne(
      { _id: contentId }, 
      { $inc: { "stats.like": 1 } }, 
      { session }
    );
    let like = new Like({ userId, contentId, type });
    await like.save({session});

    await session.commitTransaction();
    session.endSession();
    return like?.toObject();
  } catch (e) {
    await session.abortTransaction();
    session.endSession();
    console.log(e);
    throw new HttpError().InternalServerError();
  }
};

const deleteLike: LambdaLogic = async (event, _context) => {
  const { contentId } = event.body as any;
  const userId = event.user.id;
  let like = await Like.findOne({ userId, contentId });
  if(!like) throw new HttpError().BadRequest();
  try {
    await Content.updateOne(
      { _id: contentId }, 
      { $inc: { "stats.like": -1 } }
    );
    like = await Like.findOneAndRemove({_id: like._id});
    return like?.toObject();
  } catch (e) {
    console.log(e);
    throw new HttpError().InternalServerError();
  }
};

export const createLike = handlerWrapper(create, createLikeSchema);
export const removeLike = handlerWrapper(deleteLike, createLikeSchema);
