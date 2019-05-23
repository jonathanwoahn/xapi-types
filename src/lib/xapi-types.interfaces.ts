import { TinCanGroup } from './xapi-types.interfaces';

/**
 * REFERENCES
 * https://github.com/adlnet/xAPI-Spec/blob/master/xAPI-Data.md#attachments
 * http://rusticisoftware.github.io/TinCanJS/doc/api/latest/classes/TinCan.Statement.html
 */


interface AgentAccount {
  /**
   * The canonical home page for the system the account is on. This is based on FOAF's accountServiceHomePage.
   */
  homePage: string;
  /**
   * The unique id or name used to log in to this account. This is based on FOAF's accountName.
   */
  name: string;
}

interface Actor {
  /**
   * An Inverse Functional Identifier unique to the Agent.
   */
  openid?: string;
  /**
   * Agent. This property is optional except when the Agent is used as a Statement's object.
   */
  objectType: TinCanObjectTypes;
  /**
   * Full name of the Agent.
   */
  name?: string;
  /**
   * The required format is "mailto:email address". Only email addresses that have only ever been
   * and will ever be assigned to this Agent, but no others, SHOULD be used for this property and
   * mbox_sha1sum.
   */
  mbox?: string;
  /**
   * The hex-encoded SHA1 hash of a mailto IRI (i.e. the value of an mbox property). An LRS MAY
   * include Agents with a matching hash when a request is based on an mbox.
   */
  mbox_sha1sum?: string;
  /**
   * A user account on an existing system e.g. an LMS or intranet.
   */
  account?: AgentAccount;
  degraded?: boolean;
}

export interface TinCanAgent extends Actor {
  objectType: 'Agent';
}

export interface TinCanGroup extends Actor {
  /**
   * Name of the Group.
   */
  objectType: 'Group';
  /**
   * The members of this Group. This is an unordered list.
   */
  member?: TinCanAgent[];
}

export interface LanguageMap {
  'en-US': string;
}

export interface TinCanVerb {
  /**
   * IRI. Corresponds to a Verb definition. Each Verb definition corresponds to the meaning of a Verb, not the word.
   */
  id: string;
  /**
   * The human readable representation of the Verb in one or more languages. This does not have any impact on the
   * meaning of the Statement, but serves to give a human-readable display of the meaning already determined by the chosen Verb.
   */
  display: LanguageMap;
}

type TinCanObjectTypes = 'Activity' | 'Agent' | 'Group' | 'StatementRef';

export interface TinCanObject {
  /**
   * IRI. An identifier for a single unique Activity
   */
  id: string;
  objectType: TinCanObjectTypes;
}

type TinCanInteractionTypes = 'true-false' | 'choice' | 'fill-in' | 'long-fill-in' | 'matching'
  | 'performance' | 'sequencing' | 'likert' | 'numeric' | 'other';

export interface TinCanActivity extends TinCanObject {
  objectType: 'Activity';
  definition: {
    /**
     * The type of interaction. Possible values are: true-false, choice, fill-in,
     * long-fill-in, matching, performance, sequencing, likert, numeric or other.
     * https://github.com/adlnet/xAPI-Spec/blob/master/xAPI-Data.md#details-10
     */
    interactionType: TinCanInteractionTypes;
    choices?: Array<any>;
    /**
     * A pattern representing the correct response to the interaction. The structure
     * of this pattern varies depending on the interactionType. This is detailed below.
     * https://github.com/adlnet/xAPI-Spec/blob/master/xAPI-Data.md#response-patterns
     */
    correctResponsePattern?: Array<any>;
    /**
     * A map of other properties as needed (see: Extensions)
     */
    extensions?: object;
    /**
     * The human readable/visual name of the Activity
     */
    name: LanguageMap;
    /**
     * A description of the Activity
     */
    description?: LanguageMap;
    /**
     * IRL. Resolves to a document with human-readable information about the Activity,
     * which could include a way to launch the activity.
     */
    moreInfo?: string;
    scale?: Array<any>;
    source?: Array<any>;
    steps?: Array<any>;
    target?: Array<any>;
    /**
     * IRI. The type of Activity.
     */
    type?: string;
  };
}

export interface TinCanScore {
  /**
   * Decimal number greater than min (if present)	The highest possible score for
   * the experience described by the Statement.
   */
  max?: string;
  /**
   * Decimal number less than max (if present)	The lowest possible score for the
   * experience described by the Statement.
   */
  min?: string;
  /**
   * Decimal number between min and max (if present, otherwise unrestricted), inclusive
   * The score achieved by the Actor in the experience described by the Statement.
   * This is not modified by any scaling or normalization.
   */
  raw?: string;
  /**
   * Decimal number between -1 and 1, inclusive	The score related to the experience
   * as modified by scaling and/or normalization.
   */
  scaled?: string;
}

export interface TinCanResult {
  /**
   * Indicates whether or not the Activity was completed.
   */
  completion?: boolean | null;
  /**
   * ISO 8601 format
   * Period of time over which the Statement occurred.
   */
  duration?: string | null;
  /**
   * A map of other properties as needed. See: Extensions
   */
  extensions?: object | null;
  /**
   * A response appropriately formatted for the given Activity.
   */
  response?: string | null;
  /**
   * Indicates whether or not the attempt on the Activity was successful.
   */
  success?: boolean | null;
  /**
   * The score of the Agent in relation to the success or quality of the experience. See: Score
   */
  score?: TinCanScore | null;
}

interface TinCanStatementRef extends TinCanObject {
  /**
   * In this case, MUST be StatementRef
   */
  objectType: 'StatementRef';
}

export interface TinCanContext {
  /**
   * contextActivities Object	A map of the types of learning activity context that this Statement is related to.
   * Valid context types are: parent, "grouping", "category" and "other".
   */
  contextActivities?: TinCanContextActivities;
  /**
   * A map of any other domain-specific context relevant to this Statement. For example, in a flight simulator
   * altitude, airspeed, wind, attitude, GPS coordinates might all be relevant (See Extensions)
   */
  extensions?: object;
  /**
   * Agent (MAY be a Group)	Instructor that the Statement relates to, if not included as the Actor of the Statement.
   */
  instructor?: TinCanAgent | TinCanGroup | null;
  /**
   * String (as defined in RFC 5646)	Code representing the language in which the experience being recorded in
   * this Statement (mainly) occurred in, if applicable and known.
   */
  language?: string | null;
  /**
   * String	Platform used in the experience of this learning activity.
   */
  platform?: object | null;
  /**
   * UUID	The registration that the Statement is associated with.
   */
  registration?: string | null;
  /**
   * String	Revision of the learning activity associated with this Statement. Format is free.
   */
  revision?: string | null;
  /**
   * Another Statement to be considered as context for this Statement.
   */
  statementRef?: TinCanStatementRef;
  /**
   * Group	Team that this Statement relates to, if not included as the Actor of the Statement.
   */
  team?: TinCanAgent | TinCanGroup | null;
}

// https://github.com/adlnet/xAPI-Spec/blob/master/xAPI-Data.md#details-15
export interface TinCanContextActivities {
  category?: TinCanActivity[];
  grouping?: TinCanActivity[];
  other?: TinCanActivity[];
  parent?: TinCanActivity[];
}

export interface TinCanAttachment {
  content?: any[];
  /**
   * Internet Media Type	The content type of the Attachment.
   * https://www.ietf.org/rfc/rfc2046.txt?number=2046
   */
  contentType: string;
  /**
   * A description of the Attachment
   */
  description?: LanguageMap;
  /**
   * Display name (title) of this Attachment.
   */
  display?: LanguageMap;
  /**
   * An IRL at which the Attachment data can be retrieved, or from which it used to be retrievable.
   */
  fileUrl?: string;
  /**
   * The length of the Attachment data in octets.
   */
  length: number;
  /**
   * The SHA-2 hash of the Attachment data. This property is always required, even if fileURL is also specified.
   */
  sha2: string;
  /**
   * 	IRI	Identifies the usage of this Attachment. For example: one expected use case for Attachments is to
   * include a "completion certificate". An IRI corresponding to this usage MUST be coined, and used with
   * completion certificate attachments.
   */
  usageType?: string;
}

export interface TinCanStatement {
  /**
   * UUID assigned by LRS if not set by the Learning Record Provider.
   */
  id?: string;
  /**
   * Whom the Statement is about, as an Agent or Group Object.
   */
  actor: TinCanAgent | TinCanGroup;
  /**
   * Action taken by the Actor.
   */
  verb: TinCanVerb;
  /**
   * Activity, Agent, or another Statement that is the Object of the Statement.
   */
  object: TinCanActivity | TinCanAgent | TinCanGroup;
  /**
   * Result Object, further details representing a measured outcome
   */
  result?: TinCanResult;
  /**
   * Context that gives the Statement more meaning. Examples: a team the Actor is working with,
   * altitude at which a scenario was attempted in a flight simulator.
   */
  context?: TinCanContext;
  /**
   * Agent or Group who is asserting this Statement is true. Verified by the LRS based on authentication.
   * Set by LRS if not provided or if a strong trust relationship between the Learning Record Provider
   * and LRS has not been established.
   */
  authority?: TinCanAgent;
  /**
   * Timestamp of when the events described within this Statement occurred. Set by the LRS if not provided.
   */
  timestamp: string;
  /**
   * Timestamp of when this Statement was recorded. Set by LRS.
   */
  stored?: string;
  /**
   * The Statement’s associated xAPI version, formatted according to Semantic Versioning 1.0.0.
   */
  version?: string;
  /**
   * Headers for Attachments to the Statement
   */
  attachments?: TinCanAttachment[];
}
