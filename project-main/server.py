from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from ultralytics import YOLO
import numpy as np
import cv2
import os
import shutil

app = Flask(__name__)
CORS(app)

# Directory to store annotated images
OUTPUT_DIR = 'outputs'
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Load trained YOLO model
model = YOLO('new.pt')  # Replace with the correct model path if needed

@app.route("/predict", methods=["POST"])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    try:
        # Decode uploaded image
        file_bytes = np.frombuffer(file.read(), np.uint8)
        img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
        if img is None:
            return jsonify({"error": "Invalid image file"}), 400

        # Resize to match 1170x540
        target_width = 1170
        target_height = 540
        img = cv2.resize(img, (target_width, target_height), interpolation=cv2.INTER_AREA)

        # Run YOLO model
        results = model.predict(source=img, conf=0.5)
        pred = results[0]

        # Annotate and save the combined image
        annotated_image = pred.plot()
        combined_filename = "annotated_output.jpg"
        combined_path = os.path.join(OUTPUT_DIR, combined_filename)
        cv2.imwrite(combined_path, annotated_image)

        individual_detections = []
        for i, box in enumerate(pred.boxes):
            class_id = int(box.cls.item())
            conf = float(box.conf.item())
            label = model.names[class_id]

            x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
            box_img = img.copy()

            color = (0, 0, 0)  # Red color for text

            # Draw bounding box
            cv2.rectangle(box_img, (x1, y1), (x2, y2), color, 2)

            # Prepare text
            text = f"{label} {conf:.2f}"
            (text_width, text_height), baseline = cv2.getTextSize(text, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2)

            # Draw white rectangle behind text
            cv2.rectangle(box_img,
                          (x1, y1 - text_height - baseline - 4),
                          (x1 + text_width + 4, y1),
                          (255, 255, 255),
                          thickness=-1)

            # Put the label text
            cv2.putText(box_img, text, (x1 + 2, y1 - 4),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)

            # Save cropped image
            box_filename = f"detection_{i+1}_{label}.jpg"
            box_path = os.path.join(OUTPUT_DIR, box_filename)
            cv2.imwrite(box_path, box_img)

            individual_detections.append({
                "disease": label,
                "confidence": round(conf * 100, 2),
                "boxImageUrl": f"/outputs/{box_filename}"
            })

        return jsonify({
            "predictions": individual_detections,
            "annotatedImageUrl": f"/outputs/{combined_filename}"
        })

    except Exception as e:
        app.logger.exception("Error during prediction:")
        return jsonify({"error": str(e)}), 500

# Serve output images
@app.route('/outputs/<path:filename>')
def serve_annotated_image(filename):
    return send_from_directory(OUTPUT_DIR, filename)

# Clear all output files
@app.route("/clear_outputs", methods=["POST"])
def clear_outputs():
    try:
        shutil.rmtree(OUTPUT_DIR)
        os.makedirs(OUTPUT_DIR, exist_ok=True)
        return jsonify({"message": "All output files deleted successfully"}), 200
    except Exception as e:
        app.logger.exception("Error clearing output folder:")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)

