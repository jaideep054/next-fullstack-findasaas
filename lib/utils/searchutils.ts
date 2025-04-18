

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