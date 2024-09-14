import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { nets } from "face-api.js";

type UsePrepareScanningProps = Omit<UseQueryOptions<void, Error>, "queryKey">;

const usePrepareScanning = (options?: UsePrepareScanningProps) => {
  return useQuery({
    queryKey: ["scan"],
    queryFn: async () => {
      const MODEL_URL = "./weights";
      await nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
      await nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      await nets.ageGenderNet.loadFromUri(MODEL_URL);
    },
    ...options,
    enabled: options?.enabled,
  });
};

export default usePrepareScanning;
