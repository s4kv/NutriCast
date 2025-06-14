import { useEffect, useState } from "react";
import { View, Image, Button, Text, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import backend from "../backend";

export default function NutriCast() {
  const [image, setImage] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [aiResponse, setIaResponse] = useState<string | null>(null);

  // permissions
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const [cameraStatus, requestCameraPermission] =
    ImagePicker.useCameraPermissions();

  // handle image picking from gallerr / documents
  const pickImage = async () => {
    let res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      allowsMultipleSelection: false,
      aspect: [16, 9],
      quality: 1,
    });

    console.log("ImagePicker result:", res);

    if (!res.canceled && res.assets && res.assets.length > 0) {
      setImage(res.assets[0].uri);
      setImageBase64(res.assets[0].base64 || null);

      // post to backend "/api/nutricast", body: { userMessage: prompt, base64Image: res.assets[0].base64 }
      backend
        .post("/api/nutricast", {
          userMessage: "Analyze this image",
          // this will actually pass a base64 image string (dont let the uri fool you :)  )
          base64Image: res.assets[0].uri,
        })
        .then((res) => setIaResponse(res.data))
        .catch((err) => console.error("Error posting to backend:", err));

      console.log("Selected image URI:", res.assets[0].uri);
    } else {
      console.log("Image selection was canceled or no image was selected.");
    }
  };

  // handle image capture from camera
  const takePhoto = async () => {
    let res = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    console.log("Camera result:", res);

    if (!res.canceled && res.assets && res.assets.length > 0) {
      setImage(res.assets[0].uri);
      setImageBase64(res.assets[0].base64 || null);
    } else {
      console.log("Camera capture was canceled or no image was captured.");
    }
  };

  // use effect: idk if we are going to use this, (for fetching openai data)
  // I feel that a better idea is to use the backend to handle the openai requests
  // but, openai sdk is easier to use on javascript....

  // Read the image as base64
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>NutriCast</Text>
      {status?.granted === false ? (
        <Button title="Grant Permission" onPress={requestPermission} />
      ) : (
        <div>
          <Button title="Pick an image" onPress={pickImage} />
        </div>
      )}

      {(Platform.OS === "android" || Platform.OS === "ios") &&
        (cameraStatus?.granted === false ? (
          <Button
            title="Grant Camera Permission"
            onPress={requestCameraPermission}
          />
        ) : (
          <Button title="Take a Photo" onPress={takePhoto} />
        ))}

      {image && (
        <Image
          source={{ uri: image }}
          style={{ width: 200, height: 200, marginTop: 20 }}
        />
      )}

      {aiResponse && (
        <Text style={{ marginTop: 20, fontSize: 16 }}>{aiResponse}</Text>
      )}
      {!image && !aiResponse && (
        <Text style={{ marginTop: 20, fontSize: 16 }}>
          No image selected or AI response available.
        </Text>
      )}
    </View>
  );
}
