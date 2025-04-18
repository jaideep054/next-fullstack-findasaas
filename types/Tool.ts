export interface Tool {
    _id: string;
    name: string;
    description: string;
    category: string;
    pricing: number | string;
    approved: boolean;
    [key: string]: any; 
  }
  