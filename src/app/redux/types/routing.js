const ROUTING_PREFIX = '@ROUTING/';
export const GET_ENTRY = `${ROUTING_PREFIX}_GET_ENTRY`;
export const SET_ENTRY = `${ROUTING_PREFIX}_SET_ENTRY`;
export const SET_NODE = `${ROUTING_PREFIX}_SET_NODE`;
export const SET_ANCESTORS = `${ROUTING_PREFIX}_SET_ANCESTORS`;
export const SET_ENTRY_ID = `${ROUTING_PREFIX}_SET_ENTRY_ID`;
export const SET_ENTRY_RELATED_ARTICLES = `${ROUTING_PREFIX}_SET_ENTRY_RELATED_ARTICLES`;

export const SET_NAVIGATION_NOT_FOUND = `${ROUTING_PREFIX}_SET_NOT_FOUND`;
export const SET_NAVIGATION_PATH = `${ROUTING_PREFIX}_SET_NAVIGATION_PATH`;
export const SET_ROUTE_LOADING = `${ROUTING_PREFIX}_SET_ROUTE_LOADING`;

export const courseNav = [
  { link: 'overview', title: 'Overview' },
  { link: 'entryRequirements', title: 'Entry requirements' },
  { link: 'content', title: 'Course content' },
  { link: 'careers', title: 'Careers and your future' },
  { link: 'fees', title: 'Fees and funding' },
  { link: 'teaching', title: 'Teaching and learning' },
  { link: 'assessment', title: 'Assessment and feedback' },
];
