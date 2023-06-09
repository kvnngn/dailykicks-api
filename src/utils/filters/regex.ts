export const buildRegexQuery = (query = ".") => ({
  $regex: new RegExp(query, "i"),
});
