export const postRequest = (url: string, body: Record<string, string>) => {
  return fetch(`${url}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
};
export const getRequest = (url: string, query?: Record<string, string>) => {
  let requestUrl = query ? `${url}?${new URLSearchParams(query)}` : `${url}`;

  return fetch(requestUrl, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
};
