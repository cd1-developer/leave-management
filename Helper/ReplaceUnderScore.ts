function replaceUnderScore(str: any) {
  const trimString = str.trim();
  const splitString = trimString
    .split("_")
    .map((string: String) => {
      return string;
    })
    .join(" ");
  return splitString;
}

export default replaceUnderScore;
