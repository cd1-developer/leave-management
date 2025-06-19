function formatDate(dateString: Date) {
  const dateInfo = new Date(dateString);
  const month = dateInfo.getMonth() + 1;
  const year = dateInfo.getFullYear();

  const date = dateInfo.getDate();
  return `${year}-${month}-${date}`;
}

export default formatDate;
