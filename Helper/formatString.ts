function formatString(username: string) {
  let newUsername = username.trim().split(" ");
  newUsername = newUsername.map(
    (username: string) =>
      `${username[0].toUpperCase()}${username.slice(1, username.length)}`
  );
  let concatenatedUsername = newUsername.join(" ");
  return concatenatedUsername;
}
export default formatString;
