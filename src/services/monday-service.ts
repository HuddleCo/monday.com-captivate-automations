import initMondayClient from 'monday-sdk-js';

type ColumnValuesType = {
  id: number,
  value: string,
  type: string
};

type ItemType = {
  name: string,
  column_values: Array<ColumnValuesType>
}

class MondayService {
  token: string;
  cachedGetItem: {[id: string]: ItemType};
  queryCounter: number;
  
  constructor(token: string) {
    this.token = token;
    this.cachedGetItem = {};
    this.queryCounter = 1;
  }

  async getItem(itemId: number): Promise<ItemType> {
    if(this.cachedGetItem[itemId]) return this.cachedGetItem[itemId];

    try {
      const mondayClient = initMondayClient();
      mondayClient.setToken(this.token);

      const query = `query($itemId: [Int]) {
        items (ids: $itemId) {
          name
          column_values {
            id
            value
          }
        }
      }`;
      const variables = { itemId };
      const response = await mondayClient.api(query, { variables });

      console.log("-------------")
      console.log(`Query ${this.queryCounter++}:`)
      console.log(query)
      console.log("Variables:")
      console.log(variables)
      console.dir(response, { depth: null })
      console.log("-------------")

      if (response.errors) throw response.errors

      return this.cachedGetItem[itemId] = response.data.items[0];
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getItemName(itemId: number): Promise<string> { 
    return (await this.getItem(itemId)).name;
  }

  async createGroup(boardId: number, groupName: string): Promise<string> {
    try {
      const mondayClient = initMondayClient();
      mondayClient.setToken(this.token);

      const query = `mutation($boardId: Int!, $groupName: String!) {
        create_group (board_id: $boardId, group_name: $groupName) {
          id
        }
      }`;
      const variables = { boardId, groupName };
      const response = await mondayClient.api(query, { variables });
      
      console.log("-------------")
      console.log(`Query ${this.queryCounter++}:`)
      console.log(query)
      console.log("Variables:")
      console.log(variables)
      console.dir(response, { depth: null })
      console.log("-------------")

      if (response.errors) throw response.errors

      return response.data.create_group.id;
    } catch (err) {
      console.log(err);
    }
    return "";
  }

  async createItemFromItem(boardId: number, groupId: string, asset: string, itemId: number, additionalColumnValues = {}): Promise<string> {
    try {
      const mondayClient = initMondayClient();
      mondayClient.setToken(this.token);

      const itemColumns = (await this.getItem(itemId)).column_values;
      const remapIds = (element: any) => {
        const MAPPINGS = {
          client_name_1: "crm_1",
          connect_boards0: "connect_boards"
        };
        return {
          ...element,
          id: MAPPINGS[element.id] || element.id
        }
      };
      const notStatusColumn = ({id}) => {
        const EXCLUSIONS = ['status']
        return !EXCLUSIONS.includes(id);
      }
      const flattenIdAndValues = (accumulator: object, { id, value }) => {
        return {...accumulator, [id]: JSON.parse(value) };
      };

      const columnValues = {
        ...itemColumns
          .map(remapIds)
          .filter(notStatusColumn)
          .reduce(flattenIdAndValues, {}),
        ...additionalColumnValues,
        status_1: { label: asset },
        status_17: { label: asset },
      }

      // const connectedItemColumns = await this.getItem(columnValues.connect_boards.linkedPulseIds[0].linkedPulseId).column_values;

      const query = `mutation($boardId: Int!, $groupId: String, $asset: String, $columnValues: JSON) {
        create_item (board_id: $boardId, group_id: $groupId, item_name: $asset, column_values: $columnValues) {
          id
        }
      }`;
      const variables = { boardId, groupId, asset, columnValues: JSON.stringify(columnValues) };
      const response = await mondayClient.api(query, { variables });
      
      console.log("-------------")
      console.log(`Query ${this.queryCounter++}:`)
      console.log(query)
      console.log("Variables:")
      console.log(variables)
      console.dir(response, { depth: null })
      console.log("-------------")

      if (response.errors) throw response.errors

      return response.data.create_item.id;
    } catch (err) {
      console.log(err);
    }
    return "";
  }
}

export default MondayService;
