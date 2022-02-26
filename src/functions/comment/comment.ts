import { handlerWrapper } from '../../lib/utils/handlerWrapper';
import { LambdaLogic } from '../../lib/types/AWS';
import { getCommentListType } from '../../lib/types/comment';
import { createCommentSchema, updateCommentSchema, getListCommentSchema } from './validators';
import { Comment, IComment } from '../../lib/models';
import { HttpError } from '../../lib/utils';
import { Content } from '../../lib/models/Content';
import { PaginateOptions } from 'mongoose'
type PathParams = {
    id: string
}

const create: LambdaLogic<{}, IComment, {}> = async (event, _context) => {
 
  const session = await Content.db.startSession();
  session.startTransaction();  
  const comment = new Comment({...event.body, userId: event.user.id});

  try {
    const content = await Content.findOneAndUpdate({_id:event.body.contentId}, {$inc: { 'stats.comment': 1}} , {new: true, lean: true});
    if (!content) {
      throw new HttpError().BadRequest();
    }
    await comment.save({session});
    await session.commitTransaction();
    return comment;
  } catch (e) {
    await session.abortTransaction();
    console.log(e);
    throw e;
  } finally {
    session.endSession();
  }
};

const update: LambdaLogic<{}, {text: string}, PathParams>  = async (event, _context) => {
    const comment = await Comment.findOneAndUpdate({_id: event.pathParameters.id, userId: event.user.id}, {...event.body} , {lean: true, new: true});
    if (!comment) {
        throw new HttpError().BadRequest();
    }
    return comment;
}

const  get: LambdaLogic<getCommentListType> = async (event, _context) => {
    const { contentId, limit, userId, page } = event.queryStringParameters;
    let query:any = {};
    const populate = [
      { path: "userId", select: "username fullName profileImg" }
    ]
    const sort = { createdAt: -1 };
    if(contentId) query["contentId"] = contentId;
    if(userId) query["userId"] = userId; 
    const options: PaginateOptions = {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      sort,
      populate,
      select: "-deleted -__v -id",
      lean: true
    }
    const comments = await Comment.paginate(query, options);
    return comments;
}

export const createComment = handlerWrapper(create, createCommentSchema);
export const updateComment = handlerWrapper(update, updateCommentSchema);
export const getComment = handlerWrapper(get, getListCommentSchema);

