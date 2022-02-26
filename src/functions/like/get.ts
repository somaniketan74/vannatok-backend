import { Like } from "../../lib/models";
import { LambdaLogic } from "../../lib/types/AWS";
import { handlerWrapper, HttpError } from "../../lib/utils";

const get: LambdaLogic = async (event) => {
  const params = event.queryStringParameters as any;
  const { page = 1, pageSize = 10 } = params;
  delete params.page;
  delete params.pageSize;

  const likes = await Like.find(params)
    .skip((page - 1) * pageSize)
    .limit(+pageSize);
  if (!likes) {
    throw new HttpError().BadRequest();
  }
  return likes;
};


export const getLike = handlerWrapper(get);
