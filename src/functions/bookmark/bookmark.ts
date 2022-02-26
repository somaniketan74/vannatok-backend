import { handlerWrapper } from '../../lib/utils/handlerWrapper';
import { LambdaLogic } from '../../lib/types/AWS';
import { createBookmarkSchema, deleteBookmarkSchema, getBookmarkSchema } from './validators';
import { Bookmark, ILike, Like } from '../../lib/models';
import { PaginateOptions } from 'mongoose'
import _ from "lodash";
type PathParams = {
    id: string
}

const create: LambdaLogic<{}, { contentId: string }, {}> = async (event, _context) => {
  const data = {...event.body, userId: event.user.id};
  const bookmark = await Bookmark.findOneAndUpdate(data, {...data}, {new: true, upsert: true}).select("-deleted -updatedAt -createdAt -__v");
  return bookmark;
};

const deleteBookmark: LambdaLogic<{}, {}, PathParams>  = async (event, _context) => {
    let { id } = event.pathParameters;
    let bookmark = await Bookmark.delete({_id: id});
    if(bookmark)
      return {success: true};
    else
      return {success: false};
}

const  get: LambdaLogic<{ page: number, limit: number }> = async (event, _context) => {
    const { limit=10, page=1 } = event.queryStringParameters;
    let query:any = {
      userId: event.user.id
    };
    let populate = [
      { path: "contentId", select: "-deleted -__v" },
      { path: "userId", select: "username fullName profileImg" }
    ]
    const sort = { createdAt: -1 };
    const options: PaginateOptions = {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      sort,
      select: "-deleted -__v",
      lean: true,
      populate
    }
    const bookmarks:any = await Bookmark.paginate(query, options);
    if(bookmarks && bookmarks.docs && bookmarks.docs.length){
      let contentIds: Array<string> = [];
      bookmarks.docs.forEach((d:any) => {
        contentIds.push(d.contentId._id.toString());
      });
      let likes = await getLikes(contentIds, event.user.id);
      bookmarks.docs.forEach((d:any) => {
        d.contentId.isBookmark = true
        d.contentId.isLike = d.contentId._id?.toString() in likes;
      });
    }
    return bookmarks;
}

const getLikes = async (contentIds: Array<string>, userId: string) => {
  let result: any = {};
  if (!contentIds || !contentIds.length) return result
  let query = {
      contentId: { $in: contentIds },
      userId
  }
  const likes: Array<ILike> = await Like.find(query).select('contentId').lean();
  for (const key of likes) {
      result[key.contentId.toString()] = key;
  }
  return result;
}

export const createBookmark = handlerWrapper(create, createBookmarkSchema);
export const removeBookmark = handlerWrapper(deleteBookmark, deleteBookmarkSchema);
export const getBookmark = handlerWrapper(get, getBookmarkSchema);

