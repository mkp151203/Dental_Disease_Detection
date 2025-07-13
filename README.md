# 🦷 Dental Disease Detection Using YOLOv8/YOLOv10 and Flask

A deep learning-powered web application for real-time dental disease prediction from X-ray images. This tool utilizes cutting-edge YOLOv8n/m and YOLOv10s object detection models to classify six dental conditions and assist clinicians in diagnosing oral health issues efficiently.

---

## 🚀 Features

- ⚙️ **YOLO-Based Detection**: Utilizes Ultralytics' YOLOv8 and YOLOv10 models to detect and classify:
  - Caries
  - Infection
  - Impaction
  - Fractures
  - Root canal issues
  - Missing teeth

- 🎯 **Model Performance**:
  - Achieved **92% mAP@0.5**
  - **Recall**: 0.8194
  - Trained over **250 epochs** on a custom-labeled dental X-ray dataset

- 🌐 **Web Interface**:
  - Built using **Vite + React** for a fast and responsive front end
  - Backend powered by **Flask** to serve predictions in real time
  - Upload dental radiographs and receive immediate annotated results

---

## 🛠️ Tech Stack

| Layer       | Technologies Used                     |
|-------------|----------------------------------------|
| Frontend    | React (Vite), Tailwind CSS             |
| Backend     | Python, Flask                          |
| Model       | YOLOv8n, YOLOv8m, YOLOv10s (Ultralytics)|
| Dataset     | Custom-labeled dental X-ray images     |

---


