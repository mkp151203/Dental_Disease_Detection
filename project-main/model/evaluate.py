from ultralytics import YOLO

def evaluate_model(model_path, data_yaml):

    model = YOLO(model_path)


    results = model.val(data=data_yaml, imgsz=640, save_json=True)


    mAP50 = results.box.map50
    mAP5095 = results.box.map
    precision = results.box.mp
    recall = results.box.mr

    print(f"Precision: {precision:.4f}")
    print(f"Recall: {recall:.4f}")
    print(f"mAP@0.5: {mAP50:.4f}")
    print(f"mAP@0.5:0.95: {mAP5095:.4f}")

    return mAP50, mAP5095, precision, recall


if __name__ == "__main__":
    model_path = "./runs/detect/Yolo_10s_train/weights/best.pt"
    data_yaml = "data.yaml"
    evaluate_model(model_path, data_yaml)
