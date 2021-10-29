import { OpenId } from "./openIdType";

export const isOpenId = (
  maybeOpenId: Partial<OpenId>
): maybeOpenId is OpenId => {
  const openId = maybeOpenId as OpenId;
  return typeof openId.shortLivedToken === "string";
};
