import { uuid } from "../../..";

export class GetDataArgsI {
  filter?: {
    categoryIds?: number[];
  };
  exclude?: {
    categoryIds?: number[];
  };
  page?: {
    limit?: number;
    offset?: number;
  };
  configurationType?: string;
  timestamp?: number;
  @uuid uuid?: string;
  count?: number;
}
