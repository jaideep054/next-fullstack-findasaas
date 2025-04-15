export const replaceS3WithCloudFront = (url) => {
    if (url) {
      return url.replace("https://fysassets.s3.ap-south-1.amazonaws.com", "https://d2srfewv7t3ba1.cloudfront.net");
    }
  };
  
  export const formatDate = (rawDate) => {
    const date = new Date(rawDate);
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  };
  
  export const formatChartDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };
  
  export const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1).replace(/_/g, " ");
  };
  
  export const sortChronologically = (data) => {
    return data.sort((a, b) => new Date(a.date) - new Date(b.date));
  };
  