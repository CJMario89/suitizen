export const postWalrus = async ({
  content,
  type,
  query,
}: {
  content: Buffer | string | FormData;
  type: string;
  query?: string;
}) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_WALRUS_PUBLISHER}${query ? `?${query}` : ""}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": type,
      },
      body: content,
    }
  );
  const data = await response.json();
  return data;
};

export const getWalrus = async ({ id }: { id: string }) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_WALRUS_AGGREGATOR}/${id}`,
    {
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": "*",
        Accept: "*/*",
      },
    }
  );
  return response;
};
