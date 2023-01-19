import { Gift } from "./Gift";

export type WebinarName = string;
export type WebinarId = string;
export type Webinar = {
  uuid: Uuid;
  id: WebinarId;
  name: WebinarName;
  gifts?: Array<Gift>
};