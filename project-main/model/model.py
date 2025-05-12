from ultralytics import YOLO

def train_model():

    model = YOLO('yolov10s.pt')


    results = model.train(
        data='data.yaml',
        epochs=250,
        imgsz=640,
        batch=8,
        patience=100,
        device='cuda',
        augment=True,
        degrees=10,
        translate=0.1,
        scale=0.5,
        shear=5,
        perspective=0.0005,
        flipud=0.2,
        fliplr=0.5,
        hsv_h=0.015, hsv_s=0.7, hsv_v=0.4,
        mosaic = 1.0,
        mixup = 0.2,
        copy_paste = 0.1,
    )
import cv2
import tkinter as tk
from tkinter import filedialog
import numpy as np

def upload_image():

    root = tk.Tk()
    root.withdraw()
    image_path = filedialog.askopenfilename(title="Select an Image", filetypes=[("Image files", "*.jpg;*.jpeg;*.png")])

    return image_path

def test_model():

    model = YOLO('C:/Dev/Python/Yolo/runs/detect/train9/weights/best.pt')  # Replace with your saved model's path


    image_path = upload_image()


    image = cv2.imread(image_path)


    results = model(image)

    # Annotate the image with the detected objects
    annotated_image = results[0].plot()  # This draws the bounding boxes on the image

    # Display the annotated image
    cv2.imshow('Annotated Image', annotated_image)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

    # Optionally save the annotated image
    cv2.imwrite('annotated_image.jpg', annotated_image)

if __name__ == "__main__":
    # test_model()
    train_model()


