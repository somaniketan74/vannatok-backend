import { handlerWrapper } from '../../lib/utils/handlerWrapper';
import { LambdaLogic } from '../../lib/types/AWS';
import { getSkillListSchema } from './validator';
import { Skill } from '../../lib/models';
import { HttpError } from '../../lib/utils';
import { PaginateOptions } from 'mongoose';

const getList: LambdaLogic<{page:number, limit:number, q:string}> = async (event, _context) => {
    try {
        let { page, limit, q } = event.queryStringParameters;
        let sortQ: any = {
            createdAt: -1
        };

        let query: any = {};
        if(q){
            query["name"] = { $regex: q, $options: 'i' }
        }

        const options: PaginateOptions = {
            page: page || 1,
            limit: limit || 10,
            sort: sortQ,
            select: "name",
            lean: true
        }
        let result: any = await Skill.paginate(query, options);
        return result;
    } catch (e) {
        console.log(e);
        throw e;
    }
};

export const getSkillList = handlerWrapper(getList, getSkillListSchema);