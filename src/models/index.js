// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { File } = initSchema(schema);

export {
  File
};