import * as DocumentPicker
  from "expo-document-picker";

export const pickSubmissionFile =
  async () => {

    const result =
      await DocumentPicker.getDocumentAsync(
        {
          type: [
            "application/pdf",

            "application/msword",

            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

            "image/*",

            "application/zip",
          ],

          copyToCacheDirectory:
            true,

          multiple: false,
        }
      );

    if (
      result.canceled
    ) {
      return null;
    }

    return result.assets[0];
  };