import Experience from "./Experience.js";
import { EventEmitter} from "events";
import * as faceapi from 'face-api.js';
import GSAP from "gsap"



export default class Facetrack extends EventEmitter {
    constructor() {
        super();
        
        this.experience = new Experience();        
        this.resources = this.experience.resources;
        // this.faceapi = new faceapi();  

        this.faceTracking();
        
    } 

    faceTracking() {

        Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
            faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
            faceapi.nets.faceExpressionNet.loadFromUri('/models')
        ]).then(startVideo())

        const video = document.getElementById("video")
           

        function startVideo(){
            navigator.getUserMedia(
                { video: {} },
                stream => video.srcObject = stream,
                err => console.error(err)
            )
        }
               
        video.addEventListener('play', () => {
            const canvas = faceapi.createCanvasFromMedia(video);
            canvas.setAttribute('id' , 'video')
            // canvas.style.position = 'absolute';
            // canvas.style.margin = 0;
            // canvas.style.padding = 0;
            // canvas.style.width = 100vw;
            
            document.body.append(canvas);
            
            const displaySize = { width: video.width, height: video.height }
            faceapi.matchDimensions(canvas, displaySize)
            
            setInterval( async () => {
                const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
                // console.log(detections)
                const resizedDetections = faceapi.resizeResults(detections, displaySize);
                canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
                // faceapi.draw.drawDetections(canvas, resizedDetections)
                faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
                faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
            }, 50)
        })







    }
                    
    update(){
        
        
    }
} 