import { handlerWrapper } from '../../lib/utils/handlerWrapper';
import { LambdaLogic } from '../../lib/types/AWS';
import { updateVersionSchema, getVersionSchema } from './validator';
import { Version } from '../../lib/models';
import { HttpError } from '../../lib/utils';
import { INVALID_APP } from '../../lib/utils/ErrorMessage';

const update: LambdaLogic<{}, { app: string, version: string }, {}> = async (event, _context) => {
  let { app, version }  = event.body;
  const versionObj = await Version.findOneAndUpdate({app}, {$set: { updatedBy: event.user.id, version } }, {new: true});
  return versionObj;
};

const  get: LambdaLogic<{ app: string }> = async (event, _context) => {
    const { app } = event.queryStringParameters;
    const version = await Version.findOne({app}).select("version").lean();
    if(!version) throw new HttpError().BadRequest(INVALID_APP);
    return version;
}

export const updateVersion = handlerWrapper(update, updateVersionSchema);
export const getVersion = handlerWrapper(get, getVersionSchema);

