# import cv2
# import mediapipe as mp
# import numpy as np
# import os
# import io
# import json
# import asyncio
# from fastapi import FastAPI, WebSocket
# from fastapi.responses import StreamingResponse

# # Initialize FastAPI
# app = FastAPI()

# mp_pose = mp.solutions.pose
# pose = mp_pose.Pose(static_image_mode=False, min_detection_confidence=0.5)

# SCALE_FACTOR_WIDTH_TOP = 1.2
# SCALE_FACTOR_HEIGHT_TOP = 1.6
# SCALE_FACTOR_WIDTH_DRESS = 2
# SCALE_FACTOR_HEIGHT_DRESS = 1.4
# SCALE_FACTOR_WIDTH_PANTS = 2
# SCALE_FACTOR_HEIGHT_PANTS = 1.6


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


# @app.websocket("/ws")
# async def websocket_endpoint(websocket: WebSocket):
#     await websocket.accept()

#     # Open webcam stream
#     cap = cv2.VideoCapture(0)
#     cloth_image = None

#     while cap.isOpened():
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


import cv2
import mediapipe as mp
import numpy as np
import os
import io
import json
import asyncio
import logging
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from starlette.websockets import WebSocketState

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Config  —  edit these or set as environment variables
# ---------------------------------------------------------------------------
CONFIG = {
    "base_directory":        os.environ.get("CLOTH_BASE_DIR", "C:/cloth-models"),
    "camera_index":          int(os.environ.get("CAMERA_INDEX", "0")),
    "frame_width":           int(os.environ.get("FRAME_WIDTH",  "800")),
    "frame_height":          int(os.environ.get("FRAME_HEIGHT", "600")),
    "target_fps":            int(os.environ.get("TARGET_FPS",   "30")),
    "detection_confidence":  float(os.environ.get("DETECTION_CONFIDENCE", "0.5")),
    "tracking_confidence":   float(os.environ.get("TRACKING_CONFIDENCE",  "0.5")),
    "jpeg_quality":          int(os.environ.get("JPEG_QUALITY", "85")),
}

SCALE_FACTORS: dict[str, dict[str, float]] = {
    "top":        {"width": 1.2, "height": 1.6},
    "pant":       {"width": 2.0, "height": 1.6},
    "longdress":  {"width": 2.0, "height": 1.4},
    "shortdress": {"width": 2.0, "height": 1.4},
    "default":    {"width": 2.0, "height": 1.4},
}

VALID_CLOTH_TYPES = set(SCALE_FACTORS.keys())

# ---------------------------------------------------------------------------
# App & MediaPipe initialisation
# ---------------------------------------------------------------------------
app = FastAPI()

mp_pose = mp.solutions.pose
pose = mp_pose.Pose(
    static_image_mode=False,
    min_detection_confidence=CONFIG["detection_confidence"],
    min_tracking_confidence=CONFIG["tracking_confidence"],
)


# ---------------------------------------------------------------------------
# Path validation
# ---------------------------------------------------------------------------
def safe_resolve_path(cloth_path: str, base_dir: str) -> str | None:
    """
    Resolve cloth_path relative to base_dir and confirm it stays inside base_dir.
    Returns the absolute path, or None if path-traversal is detected.
    """
    base = os.path.realpath(base_dir)
    # Strip leading slashes / backslashes so os.path.join treats it as relative
    relative = cloth_path.lstrip("/\\")
    joined   = os.path.realpath(os.path.join(base, relative))
    if not (joined == base or joined.startswith(base + os.sep)):
        logger.warning("Path traversal attempt blocked: %s", cloth_path)
        return None
    return joined


# ---------------------------------------------------------------------------
# Cloth type detection
# ---------------------------------------------------------------------------
def detect_cloth_type(path: str) -> str:
    """
    Infer cloth type from filename.
    Priority: longdress > shortdress > pant > top > default
    so that 'longdress' is not accidentally matched by 'dress' alone.
    """
    name = os.path.basename(path).lower()
    for key in ("longdress", "shortdress", "pant", "top"):
        if key in name:
            return key
    return "default"


# ---------------------------------------------------------------------------
# Cloth image cache
# ---------------------------------------------------------------------------
class ClothCache:
    """
    Caches the last loaded cloth image and the last resized result so that
    cv2.resize is only called when the cloth or the target dimensions change.
    """

    def __init__(self) -> None:
        self._image:      np.ndarray | None = None
        self._cloth_type: str               = "default"
        self._last_path:  str | None        = None
        self._resized:    np.ndarray | None = None
        self._last_dims:  tuple[int, int] | None = None   # (w, h)

    # ------------------------------------------------------------------
    def load(self, path: str, cloth_type_override: str | None = None) -> bool:
        """Load a cloth from disk.  Returns True on success."""
        img = cv2.imread(path, cv2.IMREAD_UNCHANGED)
        if img is None:
            logger.error("Failed to load cloth image: %s", path)
            return False

        if img.ndim < 3 or img.shape[2] != 4:
            logger.warning(
                "Cloth image '%s' has no alpha channel — overlay may look wrong.",
                os.path.basename(path),
            )

        self._image      = img
        self._last_path  = path
        self._cloth_type = (
            cloth_type_override
            if cloth_type_override in VALID_CLOTH_TYPES
            else detect_cloth_type(path)
        )
        # Invalidate resize cache
        self._resized   = None
        self._last_dims = None
        logger.info("Loaded cloth '%s' (type: %s)", os.path.basename(path), self._cloth_type)
        return True

    # ------------------------------------------------------------------
    @property
    def image(self) -> np.ndarray | None:
        return self._image

    @property
    def cloth_type(self) -> str:
        return self._cloth_type

    @property
    def loaded(self) -> bool:
        return self._image is not None

    # ------------------------------------------------------------------
    def get_resized(self, target_w: int, target_h: int) -> np.ndarray | None:
        """Return a cached resize when dimensions match; recompute otherwise."""
        if self._image is None:
            return None
        if self._last_dims == (target_w, target_h) and self._resized is not None:
            return self._resized
        self._resized   = cv2.resize(self._image, (target_w, target_h))
        self._last_dims = (target_w, target_h)
        return self._resized


# ---------------------------------------------------------------------------
# Keypoint extraction
# ---------------------------------------------------------------------------
def calculate_keypoints(landmarks, image_shape: tuple) -> dict:
    """Return pixel-coordinate body keypoints from MediaPipe landmarks."""
    h, w = image_shape[:2]
    P = mp_pose.PoseLandmark

    def pt(lm_val: int) -> tuple[int, int]:
        lm = landmarks[lm_val]
        return (int(lm.x * w), int(lm.y * h))

    points: dict[str, tuple[int, int]] = {
        "neck":           pt(P.NOSE.value),
        "shoulder_left":  pt(P.LEFT_SHOULDER.value),
        "shoulder_right": pt(P.RIGHT_SHOULDER.value),
        "elbow_left":     pt(P.LEFT_ELBOW.value),
        "elbow_right":    pt(P.RIGHT_ELBOW.value),
        "hip_left":       pt(P.LEFT_HIP.value),
        "hip_right":      pt(P.RIGHT_HIP.value),
        "knee_left":      pt(P.LEFT_KNEE.value),
        "knee_right":     pt(P.RIGHT_KNEE.value),
        "ankle_left":     pt(P.LEFT_ANKLE.value),
        "ankle_right":    pt(P.RIGHT_ANKLE.value),
    }
    points["waist"] = (
        (points["hip_left"][0] + points["hip_right"][0]) // 2,
        (points["hip_left"][1] + points["hip_right"][1]) // 2,
    )
    return points


# ---------------------------------------------------------------------------
# Cloth sizing — all placement logic in one place
# ---------------------------------------------------------------------------
def compute_cloth_rect(points: dict, cloth_type: str) -> tuple[int, int, int, int]:
    """
    Return (cloth_w, cloth_h, top_left_x, top_left_y) for the given cloth type.
    All garment-specific positioning is centralised here.
    """
    def dist(a: str, b: str) -> float:
        return float(np.linalg.norm(np.array(points[a]) - np.array(points[b])))

    elbow_span      = dist("elbow_left",    "elbow_right")
    shoulder_hip_h  = dist("shoulder_left", "hip_left")

    sf      = SCALE_FACTORS.get(cloth_type, SCALE_FACTORS["default"])
    base_w  = int(elbow_span     * sf["width"])
    base_h  = int(shoulder_hip_h * sf["height"])

    center_x   = (points["shoulder_left"][0] + points["shoulder_right"][0]) // 2
    top_left_x = max(center_x - base_w // 2, 0)

    if cloth_type == "top":
        top_left_y = max(points["neck"][1] + 4, 0)
        cloth_w, cloth_h = base_w, base_h

    elif cloth_type == "pant":
        top_left_y = max(int(points["waist"][1] - shoulder_hip_h * 0.3) + 1, 0)
        knee_dist  = dist("knee_left", "hip_left")
        cloth_w    = base_w
        cloth_h    = base_h + int(knee_dist // 2)

    elif cloth_type == "longdress":
        shoulder_mid_y = (points["shoulder_left"][1] + points["shoulder_right"][1]) // 2
        top_left_y     = max(shoulder_mid_y - 30, 0)
        knee_dist      = dist("knee_left", "hip_left")
        cloth_w        = base_w
        cloth_h        = base_h + int(knee_dist) + 80

    elif cloth_type == "shortdress":
        shoulder_mid_y = (points["shoulder_left"][1] + points["shoulder_right"][1]) // 2
        top_left_y     = max(shoulder_mid_y - 30, 0)
        hip_dist       = dist("hip_left", "shoulder_left")
        cloth_w        = base_w
        cloth_h        = base_h + int(hip_dist // 2)

    else:  # default
        top_left_y = max(int(points["shoulder_left"][1] + shoulder_hip_h * 0.1), 0)
        cloth_w, cloth_h = base_w, base_h

    return max(cloth_w, 1), max(cloth_h, 1), top_left_x, top_left_y


# ---------------------------------------------------------------------------
# Alpha blending (fully vectorised — no Python pixel loop)
# ---------------------------------------------------------------------------
def overlay_alpha(
    image:   np.ndarray,
    overlay: np.ndarray,
    x: int,
    y: int,
) -> None:
    """
    Blend an RGBA overlay onto a BGR image at (x, y).
    Clamps to image boundaries instead of silently dropping the garment.
    Uses NumPy operations only — no Python loop over channels.
    """
    img_h, img_w = image.shape[:2]
    ov_h,  ov_w  = overlay.shape[:2]

    # Source slice inside the overlay (handles negative x / y)
    src_x1 = max(-x, 0);  src_y1 = max(-y, 0)
    src_x2 = min(ov_w, img_w - x)
    src_y2 = min(ov_h, img_h - y)

    if src_x2 <= src_x1 or src_y2 <= src_y1:
        return  # Entirely outside the frame

    dst_x1 = x + src_x1;  dst_y1 = y + src_y1
    dst_x2 = dst_x1 + (src_x2 - src_x1)
    dst_y2 = dst_y1 + (src_y2 - src_y1)

    src = overlay[src_y1:src_y2, src_x1:src_x2]
    dst = image[dst_y1:dst_y2, dst_x1:dst_x2]

    # alpha shape: (h, w, 1) — broadcasts over 3 colour channels
    alpha   = src[:, :, 3:4].astype(np.float32) / 255.0
    blended = (1.0 - alpha) * dst.astype(np.float32) + alpha * src[:, :, :3].astype(np.float32)
    image[dst_y1:dst_y2, dst_x1:dst_x2] = blended.astype(np.uint8)


# ---------------------------------------------------------------------------
# Cloth overlay entry-point
# ---------------------------------------------------------------------------
def overlay_cloth(image: np.ndarray, cache: ClothCache, points: dict) -> None:
    """Compute garment placement and composite it onto the frame."""
    if not cache.loaded:
        return

    cloth_w, cloth_h, tlx, tly = compute_cloth_rect(points, cache.cloth_type)
    resized = cache.get_resized(cloth_w, cloth_h)
    if resized is None:
        return

    if resized.ndim == 3 and resized.shape[2] == 4:
        overlay_alpha(image, resized, tlx, tly)
    else:
        # No alpha — paste with boundary clamp
        img_h, img_w = image.shape[:2]
        x2 = min(tlx + cloth_w, img_w)
        y2 = min(tly + cloth_h, img_h)
        pw = x2 - tlx;  ph = y2 - tly
        if pw > 0 and ph > 0:
            image[tly:y2, tlx:x2] = resized[:ph, :pw, :3]


# ---------------------------------------------------------------------------
# WebSocket endpoint
# ---------------------------------------------------------------------------
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket) -> None:
    await websocket.accept()
    logger.info("WebSocket client connected.")

    # Open camera
    cap = cv2.VideoCapture(CONFIG["camera_index"])
    if not cap.isOpened():
        logger.error("Cannot open camera index %d", CONFIG["camera_index"])
        await websocket.close(code=1011, reason="Camera unavailable")
        return

    cache          = ClothCache()
    frame_interval = 1.0 / CONFIG["target_fps"]
    encode_params  = [cv2.IMWRITE_JPEG_QUALITY, CONFIG["jpeg_quality"]]

    try:
        while cap.isOpened():
            # --- Capture frame ---
            success, image = cap.read()
            if not success or image is None:
                logger.warning("Frame read failed — skipping.")
                await asyncio.sleep(0.05)
                continue

            # --- Non-blocking message check (new cloth path from client) ---
            try:
                raw  = await asyncio.wait_for(websocket.receive_text(), timeout=0.01)
                data = json.loads(raw)

                cloth_path          = data.get("image_path", "")
                cloth_type_override = data.get("cloth_type")  # optional explicit type

                resolved = safe_resolve_path(cloth_path, CONFIG["base_directory"])
                if resolved and os.path.isfile(resolved):
                    cache.load(resolved, cloth_type_override)
                else:
                    logger.warning("Cloth path not found or blocked: %s", cloth_path)

            except asyncio.TimeoutError:
                pass  # No message this frame — carry on
            except json.JSONDecodeError as exc:
                logger.warning("Invalid JSON from client: %s", exc)
            except WebSocketDisconnect:
                logger.info("Client disconnected (receive).")
                break

            # --- Pose estimation & overlay ---
            flipped = cv2.flip(image, 1)
            rgb     = cv2.cvtColor(flipped, cv2.COLOR_BGR2RGB)
            results = pose.process(rgb)

            if results.pose_landmarks and cache.loaded:
                points = calculate_keypoints(results.pose_landmarks.landmark, flipped.shape)
                overlay_cloth(flipped, cache, points)

            # --- Encode & send ---
            output = cv2.resize(flipped, (CONFIG["frame_width"], CONFIG["frame_height"]))
            ok, buf = cv2.imencode(".jpg", output, encode_params)
            if not ok:
                logger.warning("JPEG encoding failed — skipping frame.")
                continue

            try:
                await websocket.send_bytes(buf.tobytes())
            except WebSocketDisconnect:
                logger.info("Client disconnected (send).")
                break

            await asyncio.sleep(frame_interval)

    except Exception:
        logger.exception("Unexpected error in WebSocket handler.")

    finally:
        cap.release()
        if websocket.client_state != WebSocketState.DISCONNECTED:
            await websocket.close()
        logger.info("WebSocket session ended — camera released.")