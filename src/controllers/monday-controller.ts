import MondayService from '../services/monday-service';

// const ASSETS = ["Instagram Stories"];
const ASSETS = ["Instagram Stories", "Instagram Reels", "Facebook/LinkedIn Videos", "Graphics", "Youtube Chapters", "Youtube (Full)"];

export async function executeAction(req, res) {
  const { shortLivedToken } = req.session;
  const { payload } = req.body;
  
  const service = new MondayService(shortLivedToken);

  try {
    const { inboundFieldValues } = payload;
    const { boardId, itemId, targetBoardId } = inboundFieldValues;
    
    const itemName = await service.getItemName(itemId);
    if (!itemName.length) {
      return res.status(200).send({ message: "The item name can not be blank" });
    }
   
    const groupId = await service.createGroup(targetBoardId, itemName);
    if (!groupId.length) {
      return res.status(200).send({ message: "Failed to create a group" });
    }
  
    const itemIds = await Promise.all(ASSETS.map((asset) => service.createItemFromItem(targetBoardId, groupId, asset, itemId)))
    if (itemIds.some((itemId) => !itemId.length)) {
      return res.status(200).send({ message: "Failed to create all items" });
    }
    
    return res.status(200).send({ message: `Created group "${itemName}":${groupId} with items ${itemIds}` });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
}
