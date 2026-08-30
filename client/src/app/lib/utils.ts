//Convert string to null | true |false
export function convertActiveToString(value: string): boolean | null {
  if (value === "") {
    return null;
  } else if (value === "true") {
    return true;
  }
  return false;
}

//Show issued + updated time relative to current time
export function convertTime(date: string) {
  const issuedDate = new Date(date).getTime();
  const currentDate = Date.now();
  const timeDifference = currentDate - issuedDate;
  const minutesSinceIssue = Math.floor(timeDifference / (1000 * 60));
  const hoursSinceIssue = Math.floor(timeDifference / (1000 * 60 * 60));
  const daysSinceIssue = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  if (minutesSinceIssue < 1) {
    return "just now";
  }
  if (minutesSinceIssue >= 1 && minutesSinceIssue < 60) {
    if (minutesSinceIssue === 1) {
      return `${minutesSinceIssue} minute ago`;
    }
    return `${minutesSinceIssue} minutes ago`;
  }
  if (hoursSinceIssue >= 1 && hoursSinceIssue < 24) {
    if (hoursSinceIssue === 1) {
      return `${hoursSinceIssue} hour ago`;
    }
    return `${hoursSinceIssue} hours ago`;
  }
  if (daysSinceIssue === 1) {
    return `${daysSinceIssue} day ago`;
  }
  return `${daysSinceIssue} days ago`;
}

//Normalise formatting (remove)
export function removeFormatting(value: string | null | undefined): string {
  if (value === null || value === undefined) {
    return "";
  }

  return value.toUpperCase().replace(/[-_'\s]/g, "");
}