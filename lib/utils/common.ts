

export const extractNumericPrice = (priceString : string) => {
  if (!priceString || typeof priceString !== "string") return 0;
  const match = priceString.match(/(\d+(\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
}
  
  
  
  export const extractPriceFilter = (query: string): number | null => {
      const priceMatch = query.match(/(?:under|less than|max|cheaper than)\s+(\d+(\.\d+)?)/i);
        return priceMatch ? parseFloat(priceMatch[1]) : null;
  };
  
  export const extractKeywordsForVector = (query: string): string => {
      return query
      .replace(/(?:under|less than|max|cheaper than)\s+\d+(\.\d+)?\s*(dollars|usd|\$)?/gi, "")
      .replace(/\s\s+/g, " ")
      .trim();
  };