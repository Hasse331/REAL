async function postRegFormData<T>(
  url: string,
  data: FormData,
  token: string | null
): Promise<T> {
  const dataObject: { [key: string]: any } = {};
  data.forEach((value, key) => {
    dataObject[key] = value;
  });
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(dataObject),
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch from ${url}: ${response.statusText}`);
  }

  return await response.json();
}

export { postRegFormData };
