import {
  TransactionBlock,
  TransactionArgument,
} from "@mysten/sui.js/transactions";
import { SuiClient } from "@mysten/sui.js/client";
import { initializeApp } from "firebase/app";
// import { getDatabase, ref, get, set, query, orderByChild, limitToFirst } from "firebase/database";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

const PACKAGE_ID: string = `${process.env.NEXT_PUBLIC_PACKAGE_ID}`;
const GLOBAL_CONFIG_ID: string = `${process.env.NEXT_PUBLIC_GLOBAL_CONFIG_ID}`;
const REGISTRY_ID: string = `${process.env.NEXT_PUBLIC_REGISTRY_ID}`;
const INTERACTION_RECORD_ID: string = `${process.env.NEXT_PUBLIC_INTERACTION_RECORD_ID}`;
const TREASURY_ID: string = `${process.env.NEXT_PUBLIC_TREASURY_ID}`;
const TYPE_DICT_ID: string = `${process.env.NEXT_PUBLIC_TYPE_DICT_ID}`;
const TRANSFER_REQUEST_RECORD_ID: string = `${process.env.NEXT_PUBLIC_TRANSFER_REQUEST_RECORD}`;

const SUITIZEN_MODULE: string = "suitizen";
const INTERACTION_MODULE: string = "interaction";

const MINT_FUN: string = "mint";
const NEW_INTERACTION_FUN: string = "new_interaction";
const VOTE_FUN: string = "vote";
const DISCUSS_FUN: string = "discuss";
const TAKE_SUI_NS_FUN: string = "take_sui_ns";
const NEW_TRANSFER_REQUEST_FUN: string = "new_transfer_request";
const CANCEL_TRANSFER_REQUEST_FUN: string = "cancel_transfer_request";
const CONFIRM_FUN: string = "confirm";
const CANCEL_CONFIRM_FUN: string = "cancel_confirm";
const TRANSFER_CARD_FUN: string = "transfer_card";
const ADD_GUARDIAN_FUN: string = "add_guardian";
const REMOVE_GUARDIAN_FUN: string = "remove_guardian";

const SUI_CLOCK_ID: string = "0x6";
const SUI_NS_TYPE = `${process.env.NEXT_PUBLIC_SUI_NS_TYPE}`;

const SUI_COIN_DECIMAL = 1_000_000_000;

const suiClient = new SuiClient({
  url: `${process.env.NEXT_PUBLIC_SUI_NETWORK_URL}`,
});

const FIREBASE_ENV: string = `${process.env.NEXT_PUBLIC_FIREBASE_ENV}`;
const FIREBASE_CONFIG: string = `${process.env.NEXT_PUBLIC_FIREBASE_CONFIG}`;

const FIREBASE_APP = initializeApp(JSON.parse(FIREBASE_CONFIG));
// const FIREBASE_DB = getDatabase(FIREBASE_APP);
const FIREBASE_DB = getFirestore(FIREBASE_APP);
const DB_ROOT_PATH = `${PACKAGE_ID}/`;

export async function packMintTxb(
  suiNs: string,
  index: number,
  pfpImg: string,
  cardImg: string,
  faceFeature: string,
  birth: number
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
    txb.pure.u64(birth),
    txb.splitCoins(txb.gas, [txb.pure(0.1 * SUI_COIN_DECIMAL)]),
    txb.object(SUI_CLOCK_ID),
  ];

  console.log(args);

  txb.moveCall({
    target: `${PACKAGE_ID}::${SUITIZEN_MODULE}::${MINT_FUN}`,
    arguments: args,
  });

  return txb;
}

export async function packNewInteractionTxb(
  cardId: string,
  category: number,
  topic: string,
  description: string,
  contents: string[]
) {
  console.log(cardId);

  let txb: TransactionBlock = new TransactionBlock();

  let args: TransactionArgument[] = [
    txb.object(GLOBAL_CONFIG_ID),
    txb.object(INTERACTION_RECORD_ID),
    txb.object(TYPE_DICT_ID),
    txb.object(cardId),
    txb.pure(category),
    txb.pure(topic),
    txb.pure(description),
    txb.pure(contents),
    txb.object(SUI_CLOCK_ID),
  ];

  txb.moveCall({
    target: `${PACKAGE_ID}::${INTERACTION_MODULE}::${NEW_INTERACTION_FUN}`,
    arguments: args,
  });

  return txb;
}

export async function packVoteTxb(
  interactionId: string,
  cardId: string,
  voteOption: number
) {
  console.log(interactionId);
  console.log(cardId);
  console.log(voteOption);

  let txb: TransactionBlock = new TransactionBlock();

  let args: TransactionArgument[] = [
    txb.object(GLOBAL_CONFIG_ID),
    txb.object(interactionId),
    txb.object(cardId),
    txb.pure(voteOption),
    txb.object(SUI_CLOCK_ID),
  ];

  txb.moveCall({
    target: `${PACKAGE_ID}::${INTERACTION_MODULE}::${VOTE_FUN}`,
    arguments: args,
  });

  return txb;
}

export async function packDiscussTxb(
  interactionId: string,
  cardId: string,
  content: string
) {
  let txb: TransactionBlock = new TransactionBlock();

  let args: TransactionArgument[] = [
    txb.object(GLOBAL_CONFIG_ID),
    txb.object(interactionId),
    txb.object(cardId),
    txb.pure(content),
    txb.object(SUI_CLOCK_ID),
  ];

  txb.moveCall({
    target: `${PACKAGE_ID}::${INTERACTION_MODULE}::${DISCUSS_FUN}`,
    arguments: args,
  });

  return txb;
}

export async function packTakeUserSuiNsTxb(cardId: string) {
  let txb: TransactionBlock = new TransactionBlock();

  let args: TransactionArgument[] = [
    txb.object(REGISTRY_ID),
    txb.object(cardId),
  ];

  txb.moveCall({
    target: `${PACKAGE_ID}::${SUITIZEN_MODULE}::${TAKE_SUI_NS_FUN}`,
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
        for (let [key, value] of rep as any) {
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
      console.log(data.data);
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
  let userSuitizenCardList: any[] = [];
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
      console.log(data.data);
      let vo: any = {};
      vo.objectId = data.data.objectId;
      vo.cardImg = data.data.display.data.image_url;
      // vo.cardImg = data.data.content.fields.card_img;
      vo.faceFeature = data.data.content.fields.face_feature;
      vo.firstName = data.data.content.fields.first_name;
      vo.lastName = data.data.content.fields.last_name;
      vo.birth = data.data.content.fields.birth;
      vo.guardians = data.data.content.fields.guardians;
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
    console.log(objectResponse);
    let tableId: string =
      objectResponse.data.content.fields.pfp_tab.fields.id.id;
    let tableVo: any = await getTableData(tableId, null, null);
    if (tableVo.tableMap.size > 0) {
      console.log(tableVo.tableMap.has(index.toString()));
      return tableVo.tableMap.has(index.toString());
    } else {
      return false;
    }
  }
  return undefined;
}

export async function getInteraction(
  category: number,
  pageNumber: number | null,
  pageSize: number | null
) {
  let vo: any = {};

  let categoryStr = category == 0 ? VOTE_FUN : DISCUSS_FUN;

  try {
    // 取得父文檔的參考
    const parentDocRef = doc(FIREBASE_DB, DB_ROOT_PATH, categoryStr);

    // 獲取文檔內容
    const docSnap = await getDoc(parentDocRef);

    if (docSnap.exists()) {
      vo.totalCount = docSnap.get("totalCount");
    } else {
      vo.totalCount = 0;
    }

    // 取得子集合的參考
    const subcollectionRef = collection(parentDocRef, "data");

    // 創建查詢
    let queryDoc = query(subcollectionRef);

    if (pageNumber != null && pageSize != null) {
      // 創建查詢，按照 lastUpdate 欄位降序排序
      queryDoc = query(
        subcollectionRef,
        orderBy("lastUpdate", "desc"),
        limit(pageSize)
      );

      // 如果需要查詢第二頁或之後的頁數
      if (pageNumber > 1) {
        // 查詢前一頁的文檔以獲取最後一個文檔的快照
        const previousPageQuery = query(
          subcollectionRef,
          orderBy("lastUpdate", "desc"),
          limit((pageNumber - 1) * pageSize)
        );
        const previousPageSnapshot = await getDocs(previousPageQuery);

        if (!previousPageSnapshot.empty) {
          // 使用前一頁的最後一個文檔作為查詢的起點
          const lastVisibleDoc =
            previousPageSnapshot.docs[previousPageSnapshot.docs.length - 1];
          queryDoc = query(
            subcollectionRef,
            orderBy("lastUpdate", "desc"),
            startAfter(lastVisibleDoc),
            limit(pageSize)
          );
        } else {
          // 如果沒有找到前一頁的數據，則返回空結果
          return { documents: [], lastDoc: null };
        }
      }
    }

    // 執行查詢
    const querySnapshot = await getDocs(queryDoc);

    // 處理查詢結果
    let documents: any = [];
    querySnapshot.forEach((doc) => {
      documents.push(doc.data());
    });

    vo.data = documents;

    return vo;
  } catch (e) {
    console.error("獲取文檔時出錯: ", e);
    return {};
  }
}

export async function getCardIdByName(name: string) {
  let realName = name + "sui";
  const decoder = new TextDecoder("utf-8");
  let objectResponse: any = await suiClient.getObject({
    id: REGISTRY_ID,
    options: {
      showContent: true,
    },
  });
  if (objectResponse.data) {
    console.log(objectResponse);
    let tableId: string =
      objectResponse.data.content.fields.reg_tab.fields.id.id;
    let tableVo: any = await getTableData(tableId, null, null);
    if (tableVo.tableMap.size > 0) {
      for (let [key, value] of tableVo.tableMap) {
        const byteArray = new Uint8Array(key);
        let deocdeKey = decoder.decode(byteArray);
        if (deocdeKey == realName) {
          return value;
        }
      }
    }
  }
  return null;
}

export async function packAddGuardianTxb(cardId: string, guardianName: string) {
  let guardianCardId = await getCardIdByName(guardianName);

  if (guardianCardId == null) {
    throw new Error(guardianName + " Not Found");
  }

  let txb: TransactionBlock = new TransactionBlock();

  let args: TransactionArgument[] = [
    txb.object(GLOBAL_CONFIG_ID),
    txb.object(cardId),
    txb.pure.address(guardianCardId),
  ];

  console.log(args);

  txb.moveCall({
    target: `${PACKAGE_ID}::${SUITIZEN_MODULE}::${ADD_GUARDIAN_FUN}`,
    arguments: args,
  });

  return txb;
}

export async function packRemoveGuardianTxb(
  cardId: string,
  guardianName: string
) {
  let guardianCardId = await getCardIdByName(guardianName);

  if (guardianCardId == null) {
    throw new Error(guardianName + " Not Found");
  }

  let txb: TransactionBlock = new TransactionBlock();

  let args: TransactionArgument[] = [
    txb.object(GLOBAL_CONFIG_ID),
    txb.object(cardId),
    txb.pure.address(guardianCardId),
  ];

  console.log(args);

  txb.moveCall({
    target: `${PACKAGE_ID}::${SUITIZEN_MODULE}::${REMOVE_GUARDIAN_FUN}`,
    arguments: args,
  });

  return txb;
}

export async function packNewTransferRequestTxb(
  cardId: string,
  newOwnerAddress: string
) {
  let txb: TransactionBlock = new TransactionBlock();

  let args: TransactionArgument[] = [
    txb.object(GLOBAL_CONFIG_ID),
    txb.object(TRANSFER_REQUEST_RECORD_ID),
    txb.pure(newOwnerAddress),
    txb.object(cardId),
  ];

  console.log(args);

  txb.moveCall({
    target: `${PACKAGE_ID}::${SUITIZEN_MODULE}::${NEW_TRANSFER_REQUEST_FUN}`,
    arguments: args,
  });

  return txb;
}

export async function getTransferRequestList(cardId: string, type: number) {
  let transferRequestList = [];
  let objectResponse: any = await suiClient.getObject({
    id: TRANSFER_REQUEST_RECORD_ID,
    options: {
      showContent: true,
    },
  });
  if (objectResponse.data) {
    console.log(objectResponse);
    let tableId: string = "";
    if (type == 0) {
      // 查自己發起的請求
      tableId =
        objectResponse.data.content.fields.requester_to_requests.fields.id.id;
    } else {
      // 查別人發起，自己是監護人的請求
      tableId =
        objectResponse.data.content.fields.guardian_to_requests.fields.id.id;
    }
    let tableVo: any = await getTableData(tableId, null, null);
    if (tableVo.tableMap.size > 0) {
      if (tableVo.tableMap.has(cardId)) {
        // 是發起者
        for (let requestId of tableVo.tableMap.get(cardId)) {
          let transferShardObjectResp: any = await suiClient.getObject({
            id: requestId,
            options: {
              showContent: true,
            },
          });
          if (transferShardObjectResp.data) {
            console.log(transferShardObjectResp.data);
            let requestVo: any = {};
            requestVo.cardId =
              transferShardObjectResp.data.content.fields.card_id;
            requestVo.confirmThreshold =
              transferShardObjectResp.data.content.fields.confirm_threshold;
            requestVo.currentConfirm =
              transferShardObjectResp.data.content.fields.current_confirm;
            requestVo.guardians =
              transferShardObjectResp.data.content.fields.guardians;
            requestVo.newOwner =
              transferShardObjectResp.data.content.fields.new_owner;
            requestVo.objectId = transferShardObjectResp.data.objectId;
            transferRequestList.push(requestVo);
          }
        }
      }
    }
  }
  return transferRequestList;
}

export async function packCancelTransferRequestTxb(
  cardId: string,
  requestId: string
) {
  let txb: TransactionBlock = new TransactionBlock();

  let args: TransactionArgument[] = [
    txb.object(GLOBAL_CONFIG_ID),
    txb.object(TRANSFER_REQUEST_RECORD_ID),
    txb.object(requestId),
    txb.object(cardId),
  ];

  console.log(args);

  txb.moveCall({
    target: `${PACKAGE_ID}::${SUITIZEN_MODULE}::${CANCEL_TRANSFER_REQUEST_FUN}`,
    arguments: args,
  });

  return txb;
}

export async function packConfirmTxb(cardId: string, requestId: string) {
  let txb: TransactionBlock = new TransactionBlock();

  let args: TransactionArgument[] = [
    txb.object(GLOBAL_CONFIG_ID),
    txb.object(cardId),
    txb.object(requestId),
  ];

  console.log(args);

  txb.moveCall({
    target: `${PACKAGE_ID}::${SUITIZEN_MODULE}::${CONFIRM_FUN}`,
    arguments: args,
  });

  return txb;
}

export async function packCancelConfirmTxb(cardId: string, requestId: string) {
  let txb: TransactionBlock = new TransactionBlock();

  let args: TransactionArgument[] = [
    txb.object(GLOBAL_CONFIG_ID),
    txb.object(cardId),
    txb.object(requestId),
  ];

  console.log(args);

  txb.moveCall({
    target: `${PACKAGE_ID}::${SUITIZEN_MODULE}::${CANCEL_CONFIRM_FUN}`,
    arguments: args,
  });

  return txb;
}

export async function packTransferCardTxb(cardId: string, requestId: string) {
  let txb: TransactionBlock = new TransactionBlock();

  let args: TransactionArgument[] = [
    txb.object(GLOBAL_CONFIG_ID),
    txb.object(TRANSFER_REQUEST_RECORD_ID),
    txb.object(cardId),
    txb.object(requestId),
  ];

  console.log(args);

  txb.moveCall({
    target: `${PACKAGE_ID}::${SUITIZEN_MODULE}::${TRANSFER_CARD_FUN}`,
    arguments: args,
  });

  return txb;
}

// 刷新 Interaction 緩存資料
export async function refreshInteractionData() {
  let objectResponse: any = await suiClient.getObject({
    id: INTERACTION_RECORD_ID,
    options: {
      showContent: true,
    },
  });
  if (objectResponse.data) {
    console.log(objectResponse);

    let voteTableId = objectResponse.data.content.fields.vote_tab.fields.id.id;
    let discussTableId =
      objectResponse.data.content.fields.discuss_tab.fields.id.id;

    let voteTableVo = await getTableData(voteTableId, null, null);
    let discussTableVo = await getTableData(discussTableId, null, null);

    const voteDocRef = doc(FIREBASE_DB, DB_ROOT_PATH, VOTE_FUN);
    const discussDocRef = doc(FIREBASE_DB, DB_ROOT_PATH, DISCUSS_FUN);

    // 取得子集合 data 的參考
    const voteDataRef = collection(voteDocRef, "data");
    const discussDataRef = collection(discussDocRef, "data");

    // 獲取 vote 子集合中 data 所有文檔
    const voteQuerySnapshot = await getDocs(voteDataRef);
    const voteDocumentIds = voteQuerySnapshot.docs.map((doc) => doc.id);

    // 獲取 discuss 子集合中 data 所有文檔
    const discussQuerySnapshot = await getDocs(discussDataRef);
    const discussDocumentIds = discussQuerySnapshot.docs.map((doc) => doc.id);

    let voteList: any[] = [];
    let discussList: any[] = [];

    for (let [key, value] of voteTableVo.tableMap) {
      let dataResponse: any = await suiClient.getObject({
        id: value,
        options: {
          showContent: true,
        },
      });

      if (dataResponse.data) {
        console.log(dataResponse.data);
        let dataVo: any = {};
        dataVo.category = dataResponse.data.content.fields.category;
        dataVo.categoryStr = dataResponse.data.content.fields.category_str;
        dataVo.topic = dataResponse.data.content.fields.topic;
        dataVo.description = dataResponse.data.content.fields.description;
        dataVo.flowNum = dataResponse.data.content.fields.flow_num;
        dataVo.host = dataResponse.data.content.fields.host;
        dataVo.objectId = dataResponse.data.objectId;
        dataVo.lastUpdate = Number(
          dataResponse.data.content.fields.last_update
        );

        let dynamicData = await suiClient.getDynamicFieldObject({
          parentId: dataVo.objectId,
          name: {
            type: `${PACKAGE_ID}::interaction::VoteSituation`,
            value: {
              dummy_field: false,
            },
          },
        });
        if (dynamicData.data) {
          console.log(dynamicData.data);
          let options: any[] = [];
          let dataContent: any = dynamicData.data.content;
          for (
            let i = 0;
            i < dataContent.fields.value.fields.options.length;
            i++
          ) {
            let optionVo: any = dataContent.fields.value.fields.options[i];
            console.log(optionVo);
            options.push({
              index: i,
              amount: optionVo.fields.amount,
              content: optionVo.fields.content,
            });
          }
          dataVo.options = options;
        }

        const docRef = doc(voteDataRef, dataVo.objectId); // 使用 objectId 唯一 ID
        // 設置文檔資料
        await setDoc(docRef, dataVo);

        voteList.push(dataVo.objectId);
      }
    }

    for (let [key, value] of discussTableVo.tableMap) {
      let dataResponse: any = await suiClient.getObject({
        id: value,
        options: {
          showContent: true,
        },
      });

      if (dataResponse.data) {
        console.log(dataResponse.data);
        let dataVo: any = {};
        dataVo.category = dataResponse.data.content.fields.category;
        dataVo.categoryStr = dataResponse.data.content.fields.category_str;
        dataVo.topic = dataResponse.data.content.fields.topic;
        dataVo.description = dataResponse.data.content.fields.description;
        dataVo.flowNum = dataResponse.data.content.fields.flow_num;
        dataVo.host = dataResponse.data.content.fields.host;
        dataVo.objectId = dataResponse.data.objectId;
        dataVo.lastUpdate = Number(
          dataResponse.data.content.fields.last_update
        );

        let dynamicData = await suiClient.getDynamicFieldObject({
          parentId: dataVo.objectId,
          name: {
            type: `${PACKAGE_ID}::interaction::DiscussionThread`,
            value: {
              dummy_field: false,
            },
          },
        });
        if (dynamicData.data) {
          console.log(dynamicData.data);
          let comments: any[] = [];
          let dataContent: any = dynamicData.data.content;
          for (let i = 0; i < dataContent.fields.value.length; i++) {
            let commentVo: any = dataContent.fields.value[i];
            console.log(commentVo);
            comments.push({
              name: commentVo.fields.name,
              content: commentVo.fields.content,
              sender: commentVo.fields.sender,
            });
          }
          dataVo.comments = comments;
        }

        const docRef = doc(discussDataRef, dataVo.objectId); // 使用 objectId 唯一 ID
        // 設置文檔資料
        await setDoc(docRef, dataVo);

        discussList.push(dataVo.objectId);
      }
    }

    await setDoc(voteDocRef, {
      totalCount: voteList.length,
    });

    await setDoc(discussDocRef, {
      totalCount: discussList.length,
    });

    // 清掉 vote 已不存在的文檔
    for (let objectId of voteDocumentIds) {
      if (!voteList.includes(objectId)) {
        let objectDoc = doc(voteDocRef, "data", objectId);
        // 刪除指定文檔
        await deleteDoc(objectDoc);
      }
    }

    // 清掉 discuss 已不存在的文檔
    for (let objectId of discussDocumentIds) {
      console.log(objectId);
      console.log(discussList.includes(objectId));
      if (!discussList.includes(objectId)) {
        let objectDoc = doc(discussDocRef, "data", objectId);
        // 刪除指定文檔
        await deleteDoc(objectDoc);
      }
    }
  }
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
