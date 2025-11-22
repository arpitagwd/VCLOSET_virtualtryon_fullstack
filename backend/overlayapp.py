import cv2
import mediapipe as mp
import numpy as np
import os
import io
import json
import asyncio
from fastapi import FastAPI, WebSocket
from fastapi.responses import StreamingResponse

# Initialize FastAPI
app = FastAPI()

mp_pose = mp.solutions.pose
pose = mp_pose.Pose(static_image_mode=False, min_detection_confidence=0.5)

SCALE_FACTOR_WIDTH_TOP = 1.2
SCALE_FACTOR_HEIGHT_TOP = 1.6
SCALE_FACTOR_WIDTH_DRESS = 2
SCALE_FACTOR_HEIGHT_DRESS = 1.4
SCALE_FACTOR_WIDTH_PANTS = 2
SCALE_FACTOR_HEIGHT_PANTS = 1.6


def load_cloth_image(path):
    """Load cloth image with transparency."""
    cloth_image = cv2.imread(path, cv2.IMREAD_UNCHANGED)
    if cloth_image is None:
        print("Error loading cloth image.")
    return cloth_image


def calculate_keypoints(landmarks, image_shape):
    """Extract keypoints from pose landmarks."""
    image_h, image_w, _ = image_shape
    points = {
        "neck": (int(landmarks[mp_pose.PoseLandmark.NOSE.value].x * image_w),
                 int(landmarks[mp_pose.PoseLandmark.NOSE.value].y * image_h),
                 landmarks[mp_pose.PoseLandmark.NOSE.value].z),  # Include z-coordinate)

        "shoulder_left": (int(landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x * image_w),
                          int(landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y * image_h)),
        "shoulder_right": (int(landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x * image_w),
                           int(landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y * image_h)),
        "elbow_left": (int(landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].x * image_w),
                       int(landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y * image_h)),
        "elbow_right": (int(landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].x * image_w),
                        int(landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].y * image_h)),
        "hip_left": (int(landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x * image_w),
                     int(landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y * image_h)),
        "hip_right": (int(landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x * image_w),
                      int(landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y * image_h)),
        "knee_left": (int(landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x * image_w),
                      int(landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y * image_h)),
        "knee_right": (int(landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].x * image_w),
                       int(landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].y * image_h)),

        "ankle_left": (int(landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].x * image_w),
                       int(landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].y * image_h)),
        "ankle_right": (int(landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].x * image_w),
                        int(landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].y * image_h)),
    }
    
    # Calculate waist position based on hip positions
    points["waist"] = (int((points["hip_left"][0] + points["hip_right"][0]) / 2),
                       int((points["hip_left"][1] + points["hip_right"][1]) / 2))

    return points


def resize_cloth(cloth_image, shoulder_to_elbow_width, shoulder_to_hip_height, cloth_name):
    """Resize cloth based on calculated dimensions."""
    if 'top' in cloth_name:
        SCALE_FACTOR_WIDTH = SCALE_FACTOR_WIDTH_TOP
        SCALE_FACTOR_HEIGHT = SCALE_FACTOR_HEIGHT_TOP
    elif 'pant' in cloth_name:
        SCALE_FACTOR_WIDTH = SCALE_FACTOR_WIDTH_PANTS
        SCALE_FACTOR_HEIGHT = SCALE_FACTOR_HEIGHT_PANTS
    else:
        SCALE_FACTOR_WIDTH = SCALE_FACTOR_WIDTH_DRESS
        SCALE_FACTOR_HEIGHT = SCALE_FACTOR_HEIGHT_DRESS

    cloth_width = int(shoulder_to_elbow_width * SCALE_FACTOR_WIDTH)
    cloth_height = int(shoulder_to_hip_height * SCALE_FACTOR_HEIGHT)
    return cv2.resize(cloth_image, (cloth_width, cloth_height))


def overlay_alpha(image, overlay, x, y):
    """Handles transparent overlay."""
    h, w = overlay.shape[:2]
    if x < 0 or y < 0 or x + w > image.shape[1] or y + h > image.shape[0]:
        return

    alpha = overlay[:, :, 3] / 255.0
    for c in range(3):
        image[y:y+h, x:x+w, c] = (1 - alpha) * image[y:y+h, x:x+w, c] + alpha * overlay[:, :, c]


def overlay_cloth(image, cloth_image, points, cloth_name):
    """Overlay the cloth on the detected pose with adjustments for better positioning."""
    if cloth_image is None:
        print("Error: Cloth image is not loaded.")
        return


    shoulder_to_elbow_width = np.linalg.norm(np.array(points["elbow_right"]) - np.array(points["elbow_left"]))
    shoulder_to_hip_height = np.linalg.norm(np.array(points["shoulder_left"]) - np.array(points["hip_left"]))

    # Resize cloth based on calculated dimensions
    resized_cloth = resize_cloth(cloth_image, shoulder_to_elbow_width, shoulder_to_hip_height, cloth_name)

    # Calculate center position for overlaying cloth
    center_x = int((points["shoulder_left"][0] + points["shoulder_right"][0]) / 2)

    # Adjust top_left_y based on clothing type and additional keypoints
    if 'top' in cloth_name:
        top_left_y = max(int(points["neck"][1] + 4), 0)  # Position slightly below neck level for tops
    elif 'pant' in cloth_name:
        top_left_y = max(int(points["waist"][1] - shoulder_to_hip_height * 0.3), 0)  # Position at waist level for pants
        top_left_y += 1  # Slightly adjust downwards if necessary to fit better
        knee_distance = np.linalg.norm(np.array(points["knee_left"]) - np.array(points["hip_left"]))
        resized_cloth_height_adjusted = resized_cloth.shape[0] + int(knee_distance // 2)  # Stretch downwards
        resized_cloth = cv2.resize(resized_cloth, (resized_cloth.shape[1], resized_cloth_height_adjusted))
    elif 'longdress' in cloth_name:
        top_left_y = max(int((points["shoulder_left"][1] + points["shoulder_right"][1]) / 2) - 30, 0)  # Position starting from shoulders
        knee_distance = np.linalg.norm(np.array(points["knee_left"]) - np.array(points["hip_left"]))
        resized_cloth_height_adjusted = resized_cloth.shape[0] + int(knee_distance + 80)  # Extend to cover knees
        resized_cloth = cv2.resize(resized_cloth, (resized_cloth.shape[1], resized_cloth_height_adjusted))

    elif 'shortdress' in cloth_name:
        top_left_y = max(int((points["shoulder_left"][1]+ points["shoulder_right"][1]) / 2) - 30, 0) # Position starting from shoulders
        hip_distance = np.linalg.norm(np.array(points["hip_left"]) - np.array(points["shoulder_left"]))
        resized_cloth_height_adjusted = resized_cloth.shape[0] + int(hip_distance // 2)  # Extend halfway to hips
        resized_cloth = cv2.resize(resized_cloth, (resized_cloth.shape[1], resized_cloth_height_adjusted))

    else:
        top_left_y = max(int(points["shoulder_left"][1] + shoulder_to_hip_height * 0.1), 0)  # Default position


    top_left_x = max(center_x - resized_cloth.shape[1] // 2, 0)

    # Ensure top left coordinates are within bounds
    if top_left_x < 0:
        top_left_x = 0
    if top_left_y < 0:
        top_left_y = 0

    # Overlay the cloth image
    if resized_cloth.shape[2] == 4:  # Check if cloth has an alpha channel
        overlay_alpha(image, resized_cloth, top_left_x, top_left_y)


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    # Open webcam stream
    cap = cv2.VideoCapture(0)
    cloth_image = None

    while cap.isOpened():
        success, image = cap.read()
        if not success or image is None:
            print("Frame read failed, skipping iteration.")
            await asyncio.sleep(0.1)  # Reduce CPU load in case of errors

            continue
        

        try:
            message = await asyncio.wait_for(websocket.receive_text(), timeout=0.1)  # Wait for 100ms
            data = json.loads(message)
            cloth_path = data["image_path"]

            # Convert to absolute path
            # base_directory = "C:\\Users\\inert\\Desktop\\finalmernstackvcloset\\client\\public"  
            base_directory = "C:\\cloth-models"

            absolute_cloth_path = os.path.join(base_directory, cloth_path.lstrip("/"))



            print(f"Resolved Cloth Image Path: {absolute_cloth_path}")

            if os.path.exists(absolute_cloth_path):
                cloth_image = load_cloth_image(absolute_cloth_path)
                print(f"Loaded Cloth Image: {absolute_cloth_path}")
            else:
                print(f"Error: Image path {absolute_cloth_path} not found.")
                cloth_image = None

        except asyncio.TimeoutError:
            pass  # Continue loop even if no message is received
        except Exception as e:
            print(f"Error receiving image path: {e}")
            cloth_image = None

       
            continue

        flipped_image = cv2.flip(image, 1)
        flipped_image_rgb = cv2.cvtColor(flipped_image, cv2.COLOR_BGR2RGB)
        results = pose.process(flipped_image_rgb)

        if results.pose_landmarks:
            landmarks = results.pose_landmarks.landmark
            points = calculate_keypoints(landmarks, flipped_image.shape)
            cloth_name = os.path.basename(absolute_cloth_path).lower()
            overlay_cloth(flipped_image, cloth_image, points, cloth_name)

        # Resize the frame to any dimensions
        resized_frame = cv2.resize(flipped_image, (800, 600))  # Change size here



        # Convert the frame to JPEG image
        _, buffer = cv2.imencode('.jpg', resized_frame)
        img_bytes = io.BytesIO(buffer)

        # Send frame to the frontend
        await websocket.send_bytes(img_bytes.getvalue())

        # Sleep to maintain real-time frame rate (30 FPS)
        await asyncio.sleep(0.033)

    cap.release()




# import cv2
# import mediapipe as mp
# import numpy as np
# import os
# import io
# import json
# import asyncio
# from fastapi import FastAPI, WebSocket
# from fastapi.responses import StreamingResponse
# import signal
# from fastapi.middleware.cors import CORSMiddleware

# import subprocess


# # Initialize FastAPI
# app = FastAPI()
# stop_server=False

# mp_pose = mp.solutions.pose
# pose = mp_pose.Pose(static_image_mode=False, min_detection_confidence=0.5)

# SCALE_FACTOR_WIDTH_TOP = 1.2
# SCALE_FACTOR_HEIGHT_TOP = 1.6
# SCALE_FACTOR_WIDTH_DRESS = 2
# SCALE_FACTOR_HEIGHT_DRESS = 1.4
# SCALE_FACTOR_WIDTH_PANTS = 2
# SCALE_FACTOR_HEIGHT_PANTS = 1.6

# def shutdown_server():
#     global stop_server
#     stop_server = True

# # Enable CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],  # Allow only your frontend
#     allow_credentials=True,
#     allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
#     allow_headers=["*"],  # Allow all headers
# )

# @app.get("/start-server")
# async def start_server():
#     return {"message": "FastAPI server started!"}


# def load_cloth_image(path):
#     """Load cloth image with transparency."""
#     cloth_image = cv2.imread(path, cv2.IMREAD_UNCHANGED)
#     if cloth_image is None:
#         print("Error loading cloth image.")
#     return cloth_image


# def calculate_keypoints(landmarks, image_shape):
#     """Extract keypoints from pose landmarks."""
#     image_h, image_w, _ = image_shape
#     points = {
#         "neck": (int(landmarks[mp_pose.PoseLandmark.NOSE.value].x * image_w),
#                  int(landmarks[mp_pose.PoseLandmark.NOSE.value].y * image_h),
#                  landmarks[mp_pose.PoseLandmark.NOSE.value].z),  # Include z-coordinate)

#         "shoulder_left": (int(landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x * image_w),
#                           int(landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y * image_h)),
#         "shoulder_right": (int(landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x * image_w),
#                            int(landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y * image_h)),
#         "elbow_left": (int(landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].x * image_w),
#                        int(landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y * image_h)),
#         "elbow_right": (int(landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].x * image_w),
#                         int(landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].y * image_h)),
#         "hip_left": (int(landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x * image_w),
#                      int(landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y * image_h)),
#         "hip_right": (int(landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x * image_w),
#                       int(landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y * image_h)),
#         "knee_left": (int(landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x * image_w),
#                       int(landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y * image_h)),
#         "knee_right": (int(landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].x * image_w),
#                        int(landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].y * image_h)),

#         "ankle_left": (int(landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].x * image_w),
#                        int(landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].y * image_h)),
#         "ankle_right": (int(landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].x * image_w),
#                         int(landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].y * image_h)),
#     }
    
#     # Calculate waist position based on hip positions
#     points["waist"] = (int((points["hip_left"][0] + points["hip_right"][0]) / 2),
#                        int((points["hip_left"][1] + points["hip_right"][1]) / 2))

#     return points


# def resize_cloth(cloth_image, shoulder_to_elbow_width, shoulder_to_hip_height, cloth_name):
#     """Resize cloth based on calculated dimensions."""
#     if 'top' in cloth_name:
#         SCALE_FACTOR_WIDTH = SCALE_FACTOR_WIDTH_TOP
#         SCALE_FACTOR_HEIGHT = SCALE_FACTOR_HEIGHT_TOP
#     elif 'pant' in cloth_name:
#         SCALE_FACTOR_WIDTH = SCALE_FACTOR_WIDTH_PANTS
#         SCALE_FACTOR_HEIGHT = SCALE_FACTOR_HEIGHT_PANTS
#     else:
#         SCALE_FACTOR_WIDTH = SCALE_FACTOR_WIDTH_DRESS
#         SCALE_FACTOR_HEIGHT = SCALE_FACTOR_HEIGHT_DRESS

#     cloth_width = int(shoulder_to_elbow_width * SCALE_FACTOR_WIDTH)
#     cloth_height = int(shoulder_to_hip_height * SCALE_FACTOR_HEIGHT)
#     return cv2.resize(cloth_image, (cloth_width, cloth_height))


# def overlay_alpha(image, overlay, x, y):
#     """Handles transparent overlay."""
#     h, w = overlay.shape[:2]
#     if x < 0 or y < 0 or x + w > image.shape[1] or y + h > image.shape[0]:
#         return

#     alpha = overlay[:, :, 3] / 255.0
#     for c in range(3):
#         image[y:y+h, x:x+w, c] = (1 - alpha) * image[y:y+h, x:x+w, c] + alpha * overlay[:, :, c]


# def overlay_cloth(image, cloth_image, points, cloth_name):
#     """Overlay the cloth on the detected pose with adjustments for better positioning."""
#     if cloth_image is None:
#         print("Error: Cloth image is not loaded.")
#         return


#     shoulder_to_elbow_width = np.linalg.norm(np.array(points["elbow_right"]) - np.array(points["elbow_left"]))
#     shoulder_to_hip_height = np.linalg.norm(np.array(points["shoulder_left"]) - np.array(points["hip_left"]))

#     # Resize cloth based on calculated dimensions
#     resized_cloth = resize_cloth(cloth_image, shoulder_to_elbow_width, shoulder_to_hip_height, cloth_name)

#     # Calculate center position for overlaying cloth
#     center_x = int((points["shoulder_left"][0] + points["shoulder_right"][0]) / 2)

#     # Adjust top_left_y based on clothing type and additional keypoints
#     if 'top' in cloth_name:
#         top_left_y = max(int(points["neck"][1] + 4), 0)  # Position slightly below neck level for tops
#     elif 'pant' in cloth_name:
#         top_left_y = max(int(points["waist"][1] - shoulder_to_hip_height * 0.3), 0)  # Position at waist level for pants
#         top_left_y += 1  # Slightly adjust downwards if necessary to fit better
#         knee_distance = np.linalg.norm(np.array(points["knee_left"]) - np.array(points["hip_left"]))
#         resized_cloth_height_adjusted = resized_cloth.shape[0] + int(knee_distance // 2)  # Stretch downwards
#         resized_cloth = cv2.resize(resized_cloth, (resized_cloth.shape[1], resized_cloth_height_adjusted))
#     elif 'longdress' in cloth_name:
#         top_left_y = max(int((points["shoulder_left"][1] + points["shoulder_right"][1]) / 2) - 30, 0)  # Position starting from shoulders
#         knee_distance = np.linalg.norm(np.array(points["knee_left"]) - np.array(points["hip_left"]))
#         resized_cloth_height_adjusted = resized_cloth.shape[0] + int(knee_distance + 80)  # Extend to cover knees
#         resized_cloth = cv2.resize(resized_cloth, (resized_cloth.shape[1], resized_cloth_height_adjusted))

#     elif 'shortdress' in cloth_name:
#         top_left_y = max(int((points["shoulder_left"][1]+ points["shoulder_right"][1]) / 2) - 30, 0) # Position starting from shoulders
#         hip_distance = np.linalg.norm(np.array(points["hip_left"]) - np.array(points["shoulder_left"]))
#         resized_cloth_height_adjusted = resized_cloth.shape[0] + int(hip_distance // 2)  # Extend halfway to hips
#         resized_cloth = cv2.resize(resized_cloth, (resized_cloth.shape[1], resized_cloth_height_adjusted))

#     else:
#         top_left_y = max(int(points["shoulder_left"][1] + shoulder_to_hip_height * 0.1), 0)  # Default position


#     top_left_x = max(center_x - resized_cloth.shape[1] // 2, 0)

#     # Ensure top left coordinates are within bounds
#     if top_left_x < 0:
#         top_left_x = 0
#     if top_left_y < 0:
#         top_left_y = 0

#     # Overlay the cloth image
#     if resized_cloth.shape[2] == 4:  # Check if cloth has an alpha channel
#         overlay_alpha(image, resized_cloth, top_left_x, top_left_y)


# @app.get("/shutdown")
# async def shutdown():
#     shutdown_server()
#     return {"message": "Shutting down FastAPI server..."}

# # Start the FastAPI server dynamically
# @app.get("/start-server")
# async def start_server():
#     try:
#         start_fastapi_server()
#         return {"message": "FastAPI server is starting..."}
#     except Exception as e:
#         return {"error": str(e)}


# @app.websocket("/ws")
# async def websocket_endpoint(websocket: WebSocket):
#     global stop_server
#     await websocket.accept()

#     # Open webcam stream
#     cap = cv2.VideoCapture(0)
#     cloth_image = None

#     while cap.isOpened():
#         if stop_server:
#             print("Stopping FastAPI server...")
#             break 

#         success, image = cap.read()
#         if not success or image is None:
#             print("Frame read failed, skipping iteration.")
#             await asyncio.sleep(0.1)  # Reduce CPU load in case of errors

#             continue
        

#         try:
#             message = await asyncio.wait_for(websocket.receive_text(), timeout=0.1)  # Wait for 100ms
#             data = json.loads(message)
#             cloth_path = data["image_path"]

#             # Convert to absolute path
#             # base_directory = "C:\\Users\\inert\\Desktop\\finalmernstackvcloset\\client\\public"  
#             base_directory = "C:\\cloth-models"

#             absolute_cloth_path = os.path.join(base_directory, cloth_path.lstrip("/"))



#             print(f"Resolved Cloth Image Path: {absolute_cloth_path}")

#             if os.path.exists(absolute_cloth_path):
#                 cloth_image = load_cloth_image(absolute_cloth_path)
#                 print(f"Loaded Cloth Image: {absolute_cloth_path}")
#             else:
#                 print(f"Error: Image path {absolute_cloth_path} not found.")
#                 cloth_image = None

#         except asyncio.TimeoutError:
#             pass  # Continue loop even if no message is received
#         except Exception as e:
#             print(f"Error receiving image path: {e}")
#             cloth_image = None

       
#             continue

#         flipped_image = cv2.flip(image, 1)
#         flipped_image_rgb = cv2.cvtColor(flipped_image, cv2.COLOR_BGR2RGB)
#         results = pose.process(flipped_image_rgb)

#         if results.pose_landmarks:
#             landmarks = results.pose_landmarks.landmark
#             points = calculate_keypoints(landmarks, flipped_image.shape)
#             cloth_name = os.path.basename(absolute_cloth_path).lower()
#             overlay_cloth(flipped_image, cloth_image, points, cloth_name)

#         # Resize the frame to any dimensions
#         resized_frame = cv2.resize(flipped_image, (800, 600))  # Change size here



#         # Convert the frame to JPEG image
#         _, buffer = cv2.imencode('.jpg', resized_frame)
#         img_bytes = io.BytesIO(buffer)

#         # Send frame to the frontend
#         await websocket.send_bytes(img_bytes.getvalue())

#         # Sleep to maintain real-time frame rate (30 FPS)
#         await asyncio.sleep(0.033)

#     cap.release()
#     print("WebSocket closed, releasing webcam...")









