// client/services/embeddingService.js
import { pipeline, env } from "@xenova/transformers";
// import { extractKeywordsForVector } from "@/lib/utils/searchutils";

// Set up the cache directory for the client
env.cacheDir = "model_cache";

let extractor;
let pipelineLoadingPromise = null;

const initializePipeline = async () => {
  if (extractor) {
    console.log("Pipeline already loaded.");
    return extractor;
  }

  if (pipelineLoadingPromise) {
    console.log("Pipeline is currently loading, awaiting completion...");
    return await pipelineLoadingPromise;
  }

  console.log("Initializing feature extraction pipeline (Xenova/all-MiniLM-L6-v2)...");
  pipelineLoadingPromise = pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2", {
    quantized: true,
  });

  try {
    extractor = await pipelineLoadingPromise;
    console.log("Pipeline loaded successfully.");
    pipelineLoadingPromise = null;
    return extractor;
  } catch (error) {
    console.error("Failed to load pipeline:", error);
    pipelineLoadingPromise = null;
    throw error;
  }
};

export const generateQueryEmbedding = async (text) => {
  const searchText = text.trim();
  console.log(`Processing text for embedding: "${searchText}"`);

  try {
    const currentExtractor = await initializePipeline();
    
    console.time(`Embedding generation for "${searchText}"`);
    const output = await currentExtractor(searchText, { pooling: "mean", normalize: true });
    console.timeEnd(`Embedding generation for "${searchText}"`);

    const embedding = Array.from(output.data);
    console.log(`Generated embedding for "${searchText}"`);

    return embedding;
  } catch (error) {
    console.error(`Error generating embedding for "${searchText}":`, error);
    return null;
  }
};

export const prepareSearchQuery = async (query) => {
  const maxPrice = extractPriceFilter(query);
  const semanticQueryText = extractKeywordsForVector(query);
  
  let embedding = null;
  if (semanticQueryText) {
    embedding = await generateQueryEmbedding(semanticQueryText);
  }
  
  return {
    maxPrice,
    embedding
  };
};

// Helper functions moved from server
export const extractPriceFilter = (query) => {
  const priceMatch = query.match(/(?:under|less than|max|cheaper than)\s+(\d+(\.\d+)?)/i);
  return priceMatch ? parseFloat(priceMatch[1]) : null;
};

export const extractKeywordsForVector = (query) => {
  return query
    .replace(/(?:under|less than|max|cheaper than)\s+\d+(\.\d+)?\s*(dollars|usd|\$)?/gi, "")
    .replace(/\s\s+/g, " ")
    .trim();
};