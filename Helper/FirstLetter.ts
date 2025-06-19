function firstLetter(username: string) {
  let userName = username
    .trim()
    .split(" ")
    .map((name) => `${name[0].toUpperCase()}`)
    .join("");

  return userName;
}
export default firstLetter;
