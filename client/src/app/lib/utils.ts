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

export function formatDate(dateString: string | null){
  if(dateString === null) return null
  
  const date = new Date(dateString);

  const formattedDate = new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);

  return formattedDate
}

export function convertDate(dateString: string | null) {
  if(dateString === null) return null

  const date = new Date(dateString)
  const isoString = date.toISOString()
  return isoString
}

// Remove formatting for filter comparison
export function normalise(value: string | null): string | null {
  if (value === null) return null;
  return value.toUpperCase().replace(/[-_'\s]/g, "");
}

// Change data format to be more readable
export function displayFormat(value: string): string | null {
  if (value === null) return null;
  return value
    .replace(/_/g, " ")
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}