// //normal static hardcoded cloth value overlay
// import React, { useEffect, useRef, useState } from 'react';

// function RealTimeClothingOverlay() {
//     const [socket, setSocket] = useState(null);
//     const canvasRef = useRef(null);

//     useEffect(() => {
//         // Connect to WebSocket server
//         const ws = new WebSocket('ws://localhost:8000/ws');
//         setSocket(ws);

//         ws.onmessage = (event) => {
//             // Convert received byte data into an image
//             const img = new Image();
//             img.onload = () => {
//                 const canvas = canvasRef.current;
//                 const ctx = canvas.getContext('2d');
//                 ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before drawing new frame
//                 ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // Draw the new frame
//             };
//             img.src = URL.createObjectURL(event.data); // Create image URL from WebSocket byte data
//         };

//         return () => {
//             ws.close(); // Clean up WebSocket connection when component unmounts
//         };
//     }, []);

//     return <canvas ref={canvasRef} width={640} height={480} />;
// }

// export default RealTimeClothingOverlay;
