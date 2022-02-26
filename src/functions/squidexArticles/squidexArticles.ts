import { handlerWrapper } from '../../lib/utils/handlerWrapper';
import { LambdaLogic } from '../../lib/types/AWS';
import { getSquidexArticlesListType } from '../../lib/types/squidexArticles';
import { getListAquidexArticlesSchema } from './validators';
import { ISquidexArticle, SquidexArticle } from '../../lib/models';
import { PaginateOptions } from 'mongoose';
import { HttpError } from "../../lib/utils";

const get: LambdaLogic<getSquidexArticlesListType> = async (event, _context) => {
    const { limit, page, subCategories } = event.queryStringParameters;
    let query: any = {}
    if (subCategories) {
      const array = subCategories.replace(/'/g,'').split(',')
        try {
            query['subcategory.en'] = { "$in": array }
        } catch (err) {
            console.log(err);
        }
    }
    const options: PaginateOptions = {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      lean: true,
      select: "title author description images readTime slug title",
    }
    const squidexArticles = await SquidexArticle.paginate(query, options);
    return squidexArticles;
}

const getBySlug: LambdaLogic<{},{}, {slug: string}> = async event => {
  const { slug } = event.pathParameters;
  const q = {
    "slug.en": decodeURIComponent(slug)
  }
  let article: ISquidexArticle | null = await SquidexArticle.findOne(q);
  if (!article) throw new HttpError().BadRequest("Article not found!");
  return article;
}

export const getSquidexArticles = handlerWrapper(get, getListAquidexArticlesSchema);
export const getSquidexArticleBySlug = handlerWrapper(getBySlug);