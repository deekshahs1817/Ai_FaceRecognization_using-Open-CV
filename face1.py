import cv2
import face_recognition
from PIL import Image
import numpy as np

# Helper function to load image with PIL, convert to RGB numpy array, and encode faces
def load_and_encode(image_path):
    pil_img = Image.open(image_path).convert('RGB')  # Convert to RGB
    img_np = np.array(pil_img)
    encodings = face_recognition.face_encodings(img_np)
    if len(encodings) > 0:
        return encodings[0]
    else:
        print(f"No faces found in {image_path}")
        return None

# Paths to your images
person1_path = "C:/Users/deeks/OneDrive/Desktop/face_recognition_project/virat.jpg"
person2_path = "C:/Users/deeks/OneDrive/Desktop/face_recognition_project/ronaldo.jpg"

# Load and encode known faces
person1_encoding = load_and_encode(person1_path)
person2_encoding = load_and_encode(person2_path)

known_face_encodings = []
known_face_names = []

if person1_encoding is not None:
    known_face_encodings.append(person1_encoding)
    known_face_names.append("virat")  # Change to actual name

if person2_encoding is not None:
    known_face_encodings.append(person2_encoding)
    known_face_names.append("ronaldo")  # Change to actual name

# Initialize webcam
video_capture = cv2.VideoCapture(0)

while True:
    ret, frame = video_capture.read()
    if not ret:
        break

    # Convert webcam frame from BGR(OpenCV) to RGB
    rgb_frame = frame[:, :, ::-1]

    # Detect face locations and face encodings in the current frame
    face_locations = face_recognition.face_locations(rgb_frame)
    face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

    for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
        matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
        name = "Unknown"

        if True in matches:
            first_match_index = matches.index(True)
            name = known_face_names[first_match_index]

        # Draw a rectangle around the face and label it
        cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
        cv2.putText(frame, name, (left, top - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

    # Display the resulting frame
    cv2.imshow('Face Recognition', frame)

    # Press 'q' to exit
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

video_capture.release()
cv2.destroyAllWindows()
