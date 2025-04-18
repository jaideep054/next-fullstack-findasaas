
import { pipeline, env } from "@xenova/transformers";
import path from "path";
import os from "os";

env.cacheDir = path.join(os.tmpdir(), "model_cache");
console.log("Using cache directory:", env.cacheDir);

let extractor : any;
let pipelineLoadingPromise : any = null;

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

export const generateQueryEmbedding = async (text : string) => {
  const searchText = text.trim();
  console.log(`Processing text for embedding: "${searchText}"`);

  try {
    const currentExtractor = await initializePipeline();
    
    console.time(`Embedding generation for "${searchText}"`);
    const output = await currentExtractor(searchText, { pooling: "mean", normalize: true });
    console.timeEnd(`Embedding generation for "${searchText}"`);

    const embedding = Array.from(output.data);
    
    // console.log(`Generated embedding for "${embedding}"`);

    return embedding;
  } catch (error) {
    console.error(`Error generating embedding for "${searchText}":`, error);
    return null;
  }
};
