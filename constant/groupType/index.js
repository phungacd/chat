import createRequestTypes from '../constype';
export const GROUP_CHAT_TYPE = {
  ...createRequestTypes('GROUP_CHAT', 'CREATE_CHAT_GROUP'),
  ...createRequestTypes('GROUP_CHAT', 'EXIT_GROUP')
};
