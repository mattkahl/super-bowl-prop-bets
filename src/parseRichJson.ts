export const parseRichJson = (jsonString: string) => {
  const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;

  function reviver(key: any, value: any) {
    if (typeof value === "string" && dateFormat.test(value)) {
      return new Date(value);
    }

    return value;
  }

  return JSON.parse(jsonString, reviver);
}
