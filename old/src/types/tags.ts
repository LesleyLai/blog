import { tagInfos } from "../utils/tagInfo";

export type TagID = keyof typeof tagInfos;

export interface TagItem {
  id: TagID;
  totalCount: number;
}
