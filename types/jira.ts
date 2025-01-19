/**
 * Jira Issue Response
 */
export interface JiraIssueResponse {
  expand: string;
  startAt: number;
  maxResults: number;
  total: number;
  issues: Issue[];
}

export interface Issue {
  expand: string;
  id: string;
  self: string;
  key: string;
  fields: Fields;
}

export interface Fields {
  statuscategorychangedate: string;
  issuetype: Issuetype;
  timespent: null;
  customfield_10030: null;
  project: Project;
  fixVersions: any[];
  customfield_10034: null;
  aggregatetimespent: null;
  resolution: null;
  customfield_10035: null;
  customfield_10036: null;
  customfield_10027: null;
  customfield_10028: null;
  customfield_10029: null;
  resolutiondate: null;
  workratio: number;
  lastViewed: null | string;
  watches: Watches;
  created: string;
  customfield_10020: Customfield10020[];
  customfield_10021: null;
  customfield_10022: null;
  priority: Priority;
  customfield_10023: null;
  customfield_10024: null;
  customfield_10025: null;
  labels: any[];
  customfield_10016: null;
  customfield_10017: null;
  customfield_10018: Customfield10018;
  customfield_10019: string;
  timeestimate: null;
  aggregatetimeoriginalestimate: null;
  versions: any[];
  issuelinks: any[];
  assignee: Assignee;
  updated: string;
  status: Status;
  components: any[];
  timeoriginalestimate: null;
  description: null;
  customfield_10010: null;
  customfield_10014: null;
  customfield_10015: null;
  customfield_10005: null;
  customfield_10006: null;
  security: null;
  customfield_10007: null;
  customfield_10008: null;
  customfield_10009: null;
  aggregatetimeestimate: null;
  summary: string;
  creator: Assignee;
  subtasks: any[];
  customfield_10041: any[];
  reporter: Assignee;
  customfield_10043: null;
  customfield_10044: null;
  aggregateprogress: Progress;
  customfield_10000: string;
  customfield_10001: null;
  customfield_10002: any[];
  customfield_10003: null;
  customfield_10004: null;
  customfield_10038: null;
  environment: null;
  duedate: null;
  progress: Progress;
  votes: Votes;
}

export interface Progress {
  progress: number;
  total: number;
}

export interface Assignee {
  self: string;
  accountId: string;
  emailAddress?: string;
  avatarUrls: AvatarUrls;
  displayName: string;
  active: boolean;
  timeZone: string;
  accountType: string;
}

export interface AvatarUrls {
  '48x48': string;
  '24x24': string;
  '16x16': string;
  '32x32': string;
}

export interface Customfield10018 {
  hasEpicLinkFieldDependency: boolean;
  showField: boolean;
  nonEditableReason: NonEditableReason;
}

export interface NonEditableReason {
  reason: string;
  message: string;
}

export interface Customfield10020 {
  id: number;
  name: string;
  state: string;
  boardId: number;
  goal: string;
  startDate: Date;
  endDate: Date;
}

export interface Issuetype {
  self: string;
  id: string;
  description: string;
  iconUrl: string;
  name: string;
  subtask: boolean;
  avatarId: number;
  entityId: string;
  hierarchyLevel: number;
}

export interface Priority {
  self: string;
  iconUrl: string;
  name: string;
  id: string;
}

export interface Project {
  self: string;
  id: string;
  key: string;
  name: string;
  projectTypeKey: string;
  simplified: boolean;
  avatarUrls: AvatarUrls;
}

export interface Status {
  self: string;
  description: string;
  iconUrl: string;
  name: string;
  id: string;
  statusCategory: StatusCategory;
}

export interface StatusCategory {
  self: string;
  id: number;
  key: string;
  colorName: string;
  name: string;
}

export interface Votes {
  self: string;
  votes: number;
  hasVoted: boolean;
}

export interface Watches {
  self: string;
  watchCount: number;
  isWatching: boolean;
}

export interface IssueResponse {
  expand: string;
  id: string;
  self: string;
  key: string;
  fields: IssueResponseFields;
}

/**
 * Jira Issue Response Fields
 */
export interface IssueResponseFields {
  statuscategorychangedate: string;
  issuetype: Issuetype;
  parent: Parent;
  timespent: null;
  customfield_10030: null;
  project: Project;
  fixVersions: any[];
  customfield_10034: null;
  aggregatetimespent: null;
  resolution: Priority;
  customfield_10035: null;
  customfield_10036: null;
  customfield_10027: null;
  customfield_10028: null;
  customfield_10029: null;
  resolutiondate: string;
  workratio: number;
  lastViewed: string;
  issuerestriction: Issuerestriction;
  watches: Watches;
  created: string;
  customfield_10020: Customfield10020[];
  customfield_10021: null;
  customfield_10022: null;
  priority: Priority;
  customfield_10023: null;
  customfield_10024: null;
  customfield_10025: string;
  labels: any[];
  customfield_10016: null;
  customfield_10017: null;
  customfield_10018: Customfield10018;
  customfield_10019: string;
  timeestimate: null;
  aggregatetimeoriginalestimate: null;
  versions: any[];
  issuelinks: any[];
  assignee: Assignee;
  updated: string;
  status: Status;
  components: any[];
  timeoriginalestimate: null;
  description: IssueDescription;
  customfield_10010: null;
  customfield_10014: null;
  customfield_10015: null;
  timetracking: Timetracking;
  customfield_10005: null;
  customfield_10006: null;
  customfield_10007: null;
  security: null;
  customfield_10008: null;
  customfield_10009: null;
  attachment: any[];
  aggregatetimeestimate: null;
  summary: string;
  creator: Assignee;
  subtasks: any[];
  customfield_10041: any[];
  reporter: Assignee;
  customfield_10000: string;
  aggregateprogress: Progress;
  customfield_10001: null;
  customfield_10002: any[];
  customfield_10003: null;
  customfield_10004: null;
  customfield_10038: null;
  environment: null;
  duedate: null;
  progress: Progress;
  votes: Votes;
  comment: FieldsComment;
  worklog: Worklog;
}

export interface IssueDescription {
  type: string;
  version: number;
  content: Content[];
}

export interface Content {
  type: string;
  content: ContentContent[];
}

export interface Progress {
  progress: number;
  total: number;
}

export interface AvatarUrls {
  '48x48': string;
  '24x24': string;
  '16x16': string;
  '32x32': string;
}

export interface FieldsComment {
  comments: CommentElement[];
  self: string;
  maxResults: number;
  total: number;
  startAt: number;
}

export interface CommentElement {
  self: string;
  id: string;
  author: Assignee;
  body: Body;
  updateAuthor: Assignee;
  created: string;
  updated: string;
  jsdPublic: boolean;
}

export interface Body {
  type: string;
  version: number;
  content: BodyContent[];
}

export interface BodyContent {
  type: string;
  content: ContentContent[];
}

export interface ContentContent {
  type: string;
  text: string;
}

export interface Customfield10018 {
  hasEpicLinkFieldDependency: boolean;
  showField: boolean;
  nonEditableReason: NonEditableReason;
}

export interface NonEditableReason {
  reason: string;
  message: string;
}

export interface Customfield10020 {
  id: number;
  name: string;
  state: string;
  boardId: number;
  goal: string;
  startDate: Date;
  endDate: Date;
}

export interface Issuerestriction {
  issuerestrictions: Timetracking;
  shouldDisplay: boolean;
}

export interface Timetracking {}

export interface Issuetype {
  self: string;
  id: string;
  description: string;
  iconUrl: string;
  name: string;
  subtask: boolean;
  avatarId: number;
  entityId: string;
  hierarchyLevel: number;
}

export interface Parent {
  id: string;
  key: string;
  self: string;
  fields: ParentFields;
}

export interface ParentFields {
  summary: string;
  status: Status;
  priority: Priority;
  issuetype: Issuetype;
}

export interface Status {
  self: string;
  description: string;
  iconUrl: string;
  name: string;
  id: string;
  statusCategory: StatusCategory;
}

export interface StatusCategory {
  self: string;
  id: number;
  key: string;
  colorName: string;
  name: string;
}

export interface Project {
  self: string;
  id: string;
  key: string;
  name: string;
  projectTypeKey: string;
  simplified: boolean;
  avatarUrls: AvatarUrls;
}

export interface Votes {
  self: string;
  votes: number;
  hasVoted: boolean;
}

export interface Watches {
  self: string;
  watchCount: number;
  isWatching: boolean;
}

export interface Worklog {
  startAt: number;
  maxResults: number;
  total: number;
  worklogs: any[];
}

/**
 * Comment Creation Response
 */

export interface CommentCreationResponse {
  self: string;
  id: string;
  author: Author;
  body: Body;
  updateAuthor: Author;
  created: string;
  updated: string;
  jsdPublic: boolean;
}

export interface Author {
  self: string;
  accountId: string;
  emailAddress: string;
  avatarUrls: AvatarUrls;
  displayName: string;
  active: boolean;
  timeZone: string;
  accountType: string;
}

export interface AvatarUrls {
  '48x48': string;
  '24x24': string;
  '16x16': string;
  '32x32': string;
}

export interface Body {
  type: string;
  version: number;
  content: BodyContent[];
}

export interface BodyContent {
  type: string;
  content: ContentContent[];
}

export interface ContentContent {
  type: string;
  text: string;
}

/**
 * Jira Issue Types Response
 */

export interface IssueTypeResponse {
  self: string;
  id: string;
  description: string;
  iconUrl: string;
  name: string;
  untranslatedName: string;
  subtask: boolean;
  avatarId: number;
  hierarchyLevel: number;
  scope: Scope;
}

export interface Scope {
  type: string;
  project: Project;
}

export interface Project {
  id: string;
}
/**
 * Issue Creation Body
 */
export interface IssueCreationBody {
  fields: FieldsCreation;
  update: Update;
}

export interface FieldsCreation {
  description: Description;
  issuetype: IssuetypeCreation;
  labels: string[];
  project: IssuetypeCreation;
  summary: string;
}

export interface Description {
  content: DescriptionContent[];
  type: string;
  version: number;
}

export interface DescriptionContent {
  content: ContentContent[];
  type: string;
}

export interface ContentContent {
  text: string;
  type: string;
}

export interface IssuetypeCreation {
  id: string;
}

export interface Update {}
