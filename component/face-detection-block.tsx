import { Inter } from "next/font/google";
import { useEffect, useRef } from "react";

import {
  draw,
  detectSingleFace,
  matchDimensions,
  TinyFaceDetectorOptions,
  resizeResults,
  nets,
  DetectAllFacesTask,
  detectAllFaces,
  WithFaceLandmarks,
  FaceDetection,
} from "face-api.js";
const inter = Inter({ subsets: ["latin"] });

export default function FaceDetectionBlock() {
  const faceDetection = useRef<
    WithFaceLandmarks<{
      detection: FaceDetection;
    }>[]
  >([]);
  useEffect(() => {
    const video = document.getElementById("video") as HTMLVideoElement;
    const canvas = document.getElementById("overlay") as HTMLCanvasElement;
    const log = document.getElementById("log") as HTMLDivElement;
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
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
          },
          audio: false,
        });
        log.innerHTML += "Webcam connected!";
        console.log(stream);
        video.srcObject = stream;
        video.addEventListener("loadeddata", () => {
          video.play();
        });
      } catch (err) {
        console.error("Error accessing webcam: ", err);
      }
    }

    // Function to detect faces
    async function detectFaces() {
      const displaySize = { width: screenW, height: screenH };
      matchDimensions(canvas, displaySize);

      log.innerHTML += "Detecting faces...";
      setInterval(async () => {
        // const detections = detectAllFaces(video, new TinyFaceDetectorOptions());
        // const resizedDetections = resizeResults(detections, displaySize);
        // const box = { x: 50, y: 50, width: 100, height: 100 };
        // // see DrawBoxOptions below
        // const drawOptions = {
        //   label: "Hello I am a box!",
        //   lineWidth: 2,
        // };
        // const drawBox = new draw.DrawBox(box, drawOptions);
        canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
        const detectionsWithLandmarks = await detectAllFaces(
          video
        ).withFaceLandmarks();
        // resize the detected boxes and landmarks in case your displayed image has a different size than the original
        const resizedResults = resizeResults(
          detectionsWithLandmarks,
          displaySize
        );
        // draw detections into the canvas
        draw.drawDetections(canvas, resizedResults);
        // draw the landmarks into the canvas
        draw.drawFaceLandmarks(canvas, resizedResults);

        log.innerHTML += JSON.stringify(detectionsWithLandmarks);
        if (!faceDetection.current.length) return;
        faceDetection.current = detectionsWithLandmarks;
      }, 1000);
    }

    // Load face-api.js models and start detection
    async function loadModels() {
      //https://github.com/justadudewhohacks/face-api.js/tree/master/weights
      await nets.tinyFaceDetector.loadFromUri("/weights"); // You can also use CDN for models
      await nets.ssdMobilenetv1.loadFromUri("/weights");
      await nets.faceLandmark68Net.loadFromUri("/weights");

      startVideo();
      video.addEventListener("play", detectFaces);
    }

    // Load models and start everything
    loadModels();
  }, []);
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
          border: "1px solid orange",
        }}
      >
        <video
          id="video"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            transform: "scaleX(-1)",
          }}
        />
        <canvas
          id="overlay"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
          }}
        />
      </div>
      <div id="log" />
    </>
  );
}
