// upload all files to walrus
// record all object ids

// save them to file ./walrus-ids.json
const fs = require("fs");

async function readImage(index: number) {
  const image = fs.readFileSync(`./image/pfp_${index}.png`);
  return image;
}

async function uploadWalrus(image: any) {
  const walrusFacialObject = await postWalrus({
    content: image,
  });
  console.log(walrusFacialObject);
  return walrusFacialObject?.newlyCreated?.blobObject?.blobId;
}

async function main() {
  const walrusIds = [];
  for (let i = 1; i < 201; i++) {
    const image = await readImage(i);
    console.log("image:", image);
    const walrusId = await uploadWalrus(image);
    console.log("walrusId:", walrusId);
    walrusIds.push(walrusId);
  }
  fs.writeFileSync("./walrus-ids.json", JSON.stringify(walrusIds));
}

async function postWalrus({
  content,
}: {
  content: Buffer | string | FormData;
}) {
  const response = await fetch(
    `https://publisher-devnet.walrus.space/v1/store?epochs=5`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "image/png",
      },
      body: content,
    }
  );
  const data = await response.json();
  return data;
}

main();
