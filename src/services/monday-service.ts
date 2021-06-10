import initMondayClient from 'monday-sdk-js';

class MondayService {
  token: string;
  cachedCreateItemFromItem: object;
  
  constructor(token: string) {
    this.token = token;
    this.cachedCreateItemFromItem = {};
  }

  async getItemName(itemId: number): Promise<string> {
    try {
      const mondayClient = initMondayClient();
      mondayClient.setToken(this.token);

      const query = `query($itemId: [Int]) {
        items (ids: $itemId) {
          name
        }
      }`;
      const variables = { itemId };
      const response = await mondayClient.api(query, { variables });

      console.log("Query:")
      console.log(query)
      console.log("Variables:")
      console.log(variables)
      console.dir(response, { depth: null })

      if (response.errors) throw response.errors

      return response.data.items[0].name;
    } catch (err) {
      console.log(err);
    }
    return "";
  }

  async getItemColumns(itemId: number): Promise<Array<any>> {
    try {
      const mondayClient = initMondayClient();
      mondayClient.setToken(this.token);

      const query = `query($itemId: [Int]) {
        items (ids: $itemId) {
          column_values {
            id
            value      
          }
        }
      }`;
      const variables = { itemId };
      const response = this.cachedCreateItemFromItem[itemId] ||= await mondayClient.api(query, { variables });

      console.log("Query:")
      console.log(query)
      console.log("Variables:")
      console.log(variables)
      console.dir(response, { depth: null })

      if (response.errors) throw response.errors

      return response.data.items[0].column_values;
    } catch (err) {
      console.log(err);
    }
    return [];
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
      
      console.log("Query:")
      console.log(query)
      console.log("Variables:")
      console.log(variables)
      console.dir(response, { depth: null })

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

      const itemColumns = await this.getItemColumns(itemId);
      const remapIds = (element: any) => {
        const MAPPINGS = {
          client_name_1: "crm_1"
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
        status_1: { label: asset } 
      }

      const query = `mutation($boardId: Int!, $groupId: String, $asset: String, $columnValues: JSON) {
        create_item (board_id: $boardId, group_id: $groupId, item_name: $asset, column_values: $columnValues) {
          id
        }
      }`;
      const variables = { boardId, groupId, asset, columnValues: JSON.stringify(columnValues) };
      const response = await mondayClient.api(query, { variables });
      
      console.log("Query:")
      console.log(query)
      console.log("Variables:")
      console.log(variables)
      console.dir(response, { depth: null })

      if (response.errors) throw response.errors

      return response.data.create_item.id;
    } catch (err) {
      console.log(err);
    }
    return "";
  }
}

export default MondayService;
