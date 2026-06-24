import * as DocumentPicker from "expo-document-picker";

export const pickSubmissionFile = async (maxSizeMB: number = 10) => {
  const result = await DocumentPicker.getDocumentAsync({
    type: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/*",
      "application/zip",
    ],
    copyToCacheDirectory: true,
    multiple: false,
  });

  if (result.canceled) {
    return null;
  }

  const file = result.assets[0];
  const fileSizeMB = (file.size ?? 0) / (1024 * 1024);
  if (fileSizeMB > maxSizeMB) {
    throw new Error(`File is too large. Maximum size is ${maxSizeMB}MB.`);
  }

  return file;
};