import {
  TransactionBlock,
  TransactionArgument,
} from "@mysten/sui.js/transactions";
import { SuiClient, SuiObjectDataFilter } from "@mysten/sui.js/client";

const PACKAGE_ID: string = `${process.env.NEXT_PUBLIC_PACKAGE_ID}`;
const GLOBAL_CONFIG_ID: string = `${process.env.NEXT_PUBLIC_GLOBAL_CONFIG_ID}`;
const ADMIN_CAP_ID: string = `${process.env.NEXT_PUBLIC_ADMIN_CAP_ID}`;
const REGISTRY_ID: string = `${process.env.NEXT_PUBLIC_REGISTRY_ID}`;
const PROPOSAL_RECORD_ID: string = `${process.env.NEXT_PUBLIC_PROPOSAL_RECORD_ID}`;
const TREASURY_ID: string = `${process.env.NEXT_PUBLIC_TREASURY_ID}`;
const TYPE_DICT_ID: string = `${process.env.NEXT_PUBLIC_TYPE_DICT_ID}`;

const SUITIZEN_MODULE: string = "suitizen";
const PROPOSAL_MODULE: string = "proposal";

const MINT_FUN: string = "mint";
const NEW_PROPOSAL_FUN: string = "new_proposal";
const VOTE_FUN: string = "vote";
const DISCUSS_FUN: string = "discuss";

const SUI_CLOCK_ID: string = "0x6";
const SUI_NS_TYPE = `${process.env.NEXT_PUBLIC_SUI_NS_TYPE}`;

const SUI_COIN_DECIMAL = 1_000_000_000;

const suiClient = new SuiClient({
  url: `${process.env.NEXT_PUBLIC_SUI_NETWORK_URL}`,
});

export async function packMintTxb(
  suiNs: string,
  index: number,
  pfpImg: string,
  cardImg: string,
  faceFeature: string
) {
  let txb: TransactionBlock = new TransactionBlock();

  let args: TransactionArgument[] = [
    txb.object(GLOBAL_CONFIG_ID),
    txb.object(REGISTRY_ID),
    txb.object(TREASURY_ID),
    txb.object(suiNs),
    txb.pure.u64(index),
    txb.pure.string(pfpImg),
    txb.pure.string(cardImg),
    txb.pure.string(faceFeature),
    txb.splitCoins(txb.gas, [txb.pure(0.1 * SUI_COIN_DECIMAL)]),
    txb.object(SUI_CLOCK_ID),
  ];

  txb.moveCall({
    target: `${PACKAGE_ID}::${SUITIZEN_MODULE}::${MINT_FUN}`,
    arguments: args,
  });

  return txb;
}

export async function packNewProposalTxb(
  cardId: string,
  category: number,
  topic: string,
  description: string,
  contents: string[]
) {
  //console.log(cardId, category, topic, description, contents);

  let txb: TransactionBlock = new TransactionBlock();

  let args: TransactionArgument[] = [
    txb.object(GLOBAL_CONFIG_ID),
    txb.object(PROPOSAL_RECORD_ID),
    txb.object(TYPE_DICT_ID),
    txb.object(cardId),
    txb.pure(category),
    txb.pure(topic),
    txb.pure(description),
    txb.pure(contents),
    txb.object(SUI_CLOCK_ID),
  ];

  txb.moveCall({
    target: `${PACKAGE_ID}::${PROPOSAL_MODULE}::${NEW_PROPOSAL_FUN}`,
    arguments: args,
  });

  return txb;
}

export async function packVoteTxb(
  proposalId: string,
  cardId: string,
  voteOption: number
) {
  //console.log(proposalId);
  //console.log(cardId);
  //console.log(voteOption);

  let txb: TransactionBlock = new TransactionBlock();

  let args: TransactionArgument[] = [
    txb.object(GLOBAL_CONFIG_ID),
    txb.object(proposalId),
    txb.object(cardId),
    txb.pure(voteOption),
    txb.object(SUI_CLOCK_ID),
  ];

  txb.moveCall({
    target: `${PACKAGE_ID}::${PROPOSAL_MODULE}::${VOTE_FUN}`,
    arguments: args,
  });

  return txb;
}

export async function packDiscussTxb(
  proposalId: string,
  cardId: string,
  content: string
) {
  let txb: TransactionBlock = new TransactionBlock();

  let args: TransactionArgument[] = [
    txb.object(GLOBAL_CONFIG_ID),
    txb.object(proposalId),
    txb.object(cardId),
    txb.pure(content),
    txb.object(SUI_CLOCK_ID),
  ];

  txb.moveCall({
    target: `${PACKAGE_ID}::${PROPOSAL_MODULE}::${DISCUSS_FUN}`,
    arguments: args,
  });

  return txb;
}

// 取得 Table 內的資料
async function getTableData(fieldId: string, cursor: any, limit: any) {
  let tableDataResp = await suiClient.getDynamicFields({
    parentId: fieldId,
    cursor: cursor,
    limit: limit,
  });
  let vo: any = {};
  let tableMap = new Map();
  if (tableDataResp.data) {
    vo.hasNextPage = tableDataResp.hasNextPage;
    vo.nextCursor = tableDataResp.nextCursor;
    for (let i = 0; i < tableDataResp.data.length; i += 1) {
      let obj = tableDataResp.data[i];
      let type = obj.name.type;
      let value = obj.name.value;

      await getTableRawData(fieldId, type, value).then((rep) => {
        //console.log(rep);
        //@ts-ignore
        for (let [key, value] of rep) {
          tableMap.set(key, value);
        }
      });
    }
  }
  vo.tableMap = tableMap;
  return vo;
}

// 取得 Table 內的原始資料
async function getTableRawData(fieldId: string, type: string, value: unknown) {
  let response = await suiClient.getDynamicFieldObject({
    parentId: fieldId,
    name: {
      type: type,
      value: value,
    },
  });

  const tableMap = new Map();
  if (response.data) {
    let content: any = response.data.content;
    let map_key = content.fields.name;
    let map_value = content.fields.value;
    tableMap.set(map_key, map_value);
  }

  return tableMap;
}

export async function getUserSuiNS(address: string) {
  let userSuiNsList: any[] = [];
  let objectResponse: any = await suiClient.getOwnedObjects({
    owner: address,
    options: {
      showContent: true,
      showDisplay: true,
    },
    filter: {
      MatchAny: [{ StructType: SUI_NS_TYPE }],
    },
  });
  if (objectResponse.data) {
    for (let data of objectResponse.data) {
      let vo: any = {};
      vo.objectId = data.data.objectId;
      vo.domainName = data.data.content.fields.domain_name;
      vo.imageUrl = data.data?.display?.data?.image_url;
      // vo.imageUrl = data.data.content.fields.image_url;
      userSuiNsList.push(vo);
    }
  }
  return userSuiNsList;
}

export async function getUserSuitizenCard(address: string) {
  let userSuitizenCardList: {
    objectId: string;
    cardImg: string;
    faceFeature: string;
    firstName: string;
    lastName: string;
  }[] = [];
  let objectResponse: any = await suiClient.getOwnedObjects({
    owner: address,
    options: {
      showContent: true,
      showDisplay: true,
    },
    filter: {
      MatchAny: [
        { StructType: `${PACKAGE_ID}::${SUITIZEN_MODULE}::SuitizenCard` },
      ],
    },
  });
  if (objectResponse.data) {
    for (let data of objectResponse.data) {
      //console.log(data.data);
      let vo: any = {};
      vo.objectId = data.data.objectId;
      vo.cardImg = data.data.display.data.image_url;
      // vo.cardImg = data.data.content.fields.card_img;
      vo.faceFeature = data.data.content.fields.face_feature;
      vo.firstName = data.data.content.fields.first_name;
      vo.lastName = data.data.content.fields.last_name;
      userSuitizenCardList.push(vo);
    }
  }
  return userSuitizenCardList;
}

// return true 為 已存在，false 為不存在
export async function checkIndexExist(index: number) {
  let objectResponse: any = await suiClient.getObject({
    id: REGISTRY_ID,
    options: {
      showContent: true,
    },
  });
  if (objectResponse.data) {
    //console.log(objectResponse);
    let tableId: string =
      objectResponse.data.content.fields.pfp_tab.fields.id.id;
    let tableVo: any = await getTableData(tableId, null, null);
    if (tableVo.tableMap.size > 0) {
      //console.log(tableVo.tableMap.has(index.toString()));
      return tableVo.tableMap.has(index.toString());
    } else {
      return false;
    }
  }
  return undefined;
}

export async function getProposal(
  category: number,
  cursor: string | null,
  limit: number | null
) {
  let proposal: any = {};
  let proposalList: any[] = [];
  let proposalRecord: any = await suiClient.getObject({
    id: PROPOSAL_RECORD_ID,
    options: {
      showContent: true,
      showDisplay: true,
    },
  });

  if (proposalRecord.data) {
    //console.log(proposalRecord);
    let tableId = "";
    let isVote = false;
    if (category == 0) {
      // vote
      //console.log("vote");
      isVote = true;
      tableId = proposalRecord.data.content.fields.vote_tab.fields.id.id;
    } else if (category == 1) {
      // discuss
      //console.log("discuss");
      tableId = proposalRecord.data.content.fields.discuss_tab.fields.id.id;
    }
    //console.log(tableId);
    let tableVo = await getTableData(tableId, cursor, limit);
    //console.log(tableVo);

    for (let [key, value] of tableVo.tableMap) {
      let dataResponse: any = await suiClient.getObject({
        id: value,
        options: {
          showContent: true,
        },
      });

      if (dataResponse.data) {
        //console.log(dataResponse.data);
        let dataVo: any = {};
        dataVo.category = dataResponse.data.content.fields.category;
        dataVo.categoryStr = dataResponse.data.content.fields.category_str;
        dataVo.topic = dataResponse.data.content.fields.topic;
        dataVo.description = dataResponse.data.content.fields.description;
        dataVo.flowNum = dataResponse.data.content.fields.flow_num;
        dataVo.proposer = dataResponse.data.content.fields.proposer;
        dataVo.objectId = dataResponse.data.objectId;

        if (isVote) {
          let dynamicData = await suiClient.getDynamicFieldObject({
            parentId: dataVo.objectId,
            name: {
              type: `${PACKAGE_ID}::proposal::VoteSituation`,
              value: {
                dummy_field: false,
              },
            },
          });
          if (dynamicData.data) {
            //console.log(dynamicData.data);
            let options: any[] = [];
            let dataContent: any = dynamicData.data.content;
            for (
              let i = 0;
              i < dataContent.fields.value.fields.options.length;
              i++
            ) {
              let optionVo: any = dataContent.fields.value.fields.options[i];
              //console.log(optionVo);
              options.push({
                index: i,
                amount: optionVo.fields.amount,
                content: optionVo.fields.content,
              });
            }
            dataVo.options = options;
          }
        } else {
          let dynamicData = await suiClient.getDynamicFieldObject({
            parentId: dataVo.objectId,
            name: {
              type: `${PACKAGE_ID}::proposal::DiscussionThread`,
              value: {
                dummy_field: false,
              },
            },
          });
          if (dynamicData.data) {
            //console.log(dynamicData.data);
            let comments: any[] = [];
            let dataContent: any = dynamicData.data.content;
            for (let i = 0; i < dataContent.fields.value.length; i++) {
              let commentVo: any = dataContent.fields.value[i];
              //console.log(commentVo);
              comments.push({
                name: commentVo.fields.name,
                content: commentVo.fields.content,
                sender: commentVo.fields.sender,
              });
            }
            dataVo.comments = comments;
          }
        }

        proposalList.push(dataVo);
      }
    }

    proposal.hasNextPage = tableVo.hasNextPage;
    proposal.nextCursor = tableVo.nextCursor;
    proposal.data = proposalList;
  }
  return proposal;
}

export async function getCardDetail(objectId: string) {
  let cardDetail: any = {};
  let objectResponse: any = await suiClient.getObject({
    id: objectId,
    options: {
      showContent: true,
      showDisplay: true,
    },
  });
  if (objectResponse.data) {
    let cardImg = objectResponse.data.display.data.image_url;
    let faceFeature = objectResponse.data.content.fields.face_feature;
    let firstName = objectResponse.data.content.fields.first_name;
    let lastName = objectResponse.data.content.fields.last_name;

    return {
      objectId,
      cardImg,
      faceFeature,
      firstName,
      lastName,
    };
  }
  return cardDetail;
}
