export const validUrlConvert = (name) => {
  const url = name
    ?.toString()
    .replaceAll(" ", "-")
    .replaceAll(",", "-")
    .replaceAll("&", "-")
    .replaceAll(/[^\w\s-]/g, '') // Removes other special characters
    .toLowerCase(); // Converts to lowercase for consistency
  return url;
};
