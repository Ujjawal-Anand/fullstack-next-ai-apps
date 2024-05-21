const createURL = (path: string) => window.location.origin + path;

export const fetcher = async (...args: any[]) => {
  const res = await fetch(args[0], args[1]);
  return res.json();
};

export const deleteEntry = async (id: string) => {
  const res = await fetch(
    new Request(createURL(`/api/entry/${id}`), {
      method: "DELETE",
    })
  );

  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Something went wrong on API server!");
  }
};

export const newEntry = async () => {
  const res = await fetch(
    new Request(createURL("/api/entry"), {
      method: "POST",
      body: JSON.stringify({ content: "new entry" }),
    })
  );

  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Something went wrong on API server!");
  }
};

export const updateEntry = async (id: any, updates: { content: any }) => {
  const res = await fetch(
    new Request(createURL(`/api/entry/${id}`), {
      method: "PATCH",
      body: JSON.stringify({ updates }),
    })
  );

  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Something went wrong on API server!");
  }
};

export const askQuestion = async (question: string) => {
  const res = await fetch(
    new Request(createURL(`/api/question`), {
      method: "POST",
      body: JSON.stringify({ question }),
    })
  );

  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Something went wrong on API server!");
  }
};
