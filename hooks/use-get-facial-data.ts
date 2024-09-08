import {
  videoHeight,
  videoWidth,
} from "@/component/registry/face-detection-block";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import {
  detectSingleFace,
  matchDimensions,
  resizeResults,
  nets,
  detectAllFaces,
  WithFaceLandmarks,
  FaceDetection,
  WithFaceDescriptor,
  FaceLandmarks68,
} from "face-api.js";
import { useRef } from "react";

type UseGetFacialDateOption = UseMutationOptions<
  WithFaceDescriptor<
    WithFaceLandmarks<{ detection: FaceDetection }, FaceLandmarks68>
  >,
  Error,
  void
>;

const useGetFacialData = (options?: UseGetFacialDateOption) => {
  const streamRef = useRef<MediaStream | null>(null);
  const percentage = useRef<number>(0);
  const highestSource = useRef<{
    score: number;
    source?: WithFaceDescriptor<
      WithFaceLandmarks<
        {
          detection: FaceDetection;
        },
        FaceLandmarks68
      >
    >;
  }>({
    score: 0,
  });

  return useMutation({
    mutationFn: async () => {
      let currentPercentage = 0;
      const getFacialPromise = new Promise<
        WithFaceDescriptor<
          WithFaceLandmarks<
            {
              detection: FaceDetection;
            },
            FaceLandmarks68
          >
        >
      >((resolve, reject) => {
        // /temp
        // resolve("temp");
        const video = document.getElementById("video") as HTMLVideoElement;
        const canvas = document.getElementById("overlay") as HTMLCanvasElement;
        const ctx = canvas.getContext("2d");
        video.setAttribute("autoplay", "false");
        video.setAttribute("playsinline", "true");
        video.controls = false;
        video.autoplay = false;
        video.setAttribute("webkit-playsinline", "webkit-playsinline");
        video.setAttribute("playsinline", "playsinline");
        async function startVideo() {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({
              video: {
                facingMode: "user",
                width: videoWidth,
                height: videoHeight,
              },
              audio: false,
            });
            video.srcObject = stream;
            streamRef.current = stream;
            video.addEventListener("loadedmetadata", () => {
              video.play();
            });
          } catch (err) {
            console.error("Error accessing webcam: ", err);
          }
        }

        // Function to detect faces
        async function detectFaces() {
          const interval = setInterval(async () => {
            const source = await detectSingleFace(video)
              .withFaceLandmarks()
              .withFaceDescriptor();
            if (source?.detection?.score && source?.detection?.score > 0.95) {
              percentage.current += Math.random() * 5;
              if (
                source?.detection?.score &&
                highestSource.current?.score < source.detection.score
              ) {
                highestSource.current = {
                  score: source.detection.score,
                  source,
                };
              }
            } else if (
              source?.detection?.score &&
              source?.detection?.score > 0.85
            ) {
              percentage.current += Math.random() * 1;
              if (
                source?.detection?.score &&
                highestSource.current?.score < source.detection.score
              ) {
                highestSource.current = {
                  score: source.detection.score,
                  source,
                };
              }
            } else {
              percentage.current -= Math.random() * 3;
              if (percentage.current < 0) {
                percentage.current = 0;
              }
            }
            if (percentage.current >= 100 && highestSource.current.source) {
              clearInterval(interval);
              streamRef.current?.getTracks().forEach((track) => {
                track.stop();
              });
              resolve(highestSource.current.source);
            }
            update();
          }, 100);
        }

        // Load face-api.js models and start detection
        async function loadModels() {
          const MODEL_URL = "./weights";
          await nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
          await nets.faceLandmark68Net.loadFromUri(MODEL_URL);
          await nets.faceRecognitionNet.loadFromUri(MODEL_URL);

          startVideo();
          video.addEventListener("play", detectFaces);
        }

        function drawCircle(percentage: number) {
          // Clear the canvas
          if (!ctx) return;
          ctx.clearRect(0, 0, videoWidth, videoHeight);
          // Draw the progress circle
          const startAngle = -0.5 * Math.PI; // Start at the top
          const endAngle = startAngle + 2 * Math.PI * (percentage / 100); // End based on percentage

          ctx.beginPath();
          ctx.arc(
            canvas.width / 2,
            canvas.height / 2,
            videoWidth + 6,
            startAngle,
            endAngle
          );
          const gradient = createGradient(0, 0, canvas.width, canvas.height);
          // ctx.strokeStyle = "#0066dd";
          ctx.strokeStyle = gradient as CanvasGradient;
          ctx.lineWidth = 5;
          ctx.stroke();
        }

        function createGradient(
          x1: number,
          y1: number,
          x2: number,
          y2: number
        ) {
          if (!ctx) return;
          const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
          gradient.addColorStop(0, "#3498db");
          gradient.addColorStop(0, "#66aaff");
          gradient.addColorStop(1, "#cc4c66");
          return gradient;
        }

        // Update animation
        function update() {
          const targetPercentage = percentage.current;
          if (Math.round(currentPercentage) < Math.round(targetPercentage)) {
            currentPercentage += 0.1; // Smooth progress
          } else if (
            Math.round(currentPercentage) > Math.round(targetPercentage)
          ) {
            currentPercentage -= 0.1; // Smooth regress
          }

          drawCircle(currentPercentage);

          if (currentPercentage !== targetPercentage) {
            requestAnimationFrame(update);
          }
        }

        // Load models and start everything
        loadModels();
      });
      return getFacialPromise;
    },
    ...options,
  });
};

export default useGetFacialData;
