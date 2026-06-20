import * as FileSystem
  from "expo-file-system/legacy";

import * as Sharing
  from "expo-sharing";


export const downloadNote =
  async (
    noteId: string,
    title: string,
    pdfUrl: string,
    onProgress?: (
      progress: number
    ) => void
  ) => {

    const fileUri =
      `${FileSystem.documentDirectory}${title}.pdf`;

    const download =
      FileSystem.createDownloadResumable(
        pdfUrl,
        fileUri,
        {},

        progress => {

          const percentage =
            progress.totalBytesWritten /
            progress.totalBytesExpectedToWrite;

          onProgress?.(
            Math.round(
              percentage * 100
            )
          );
        }
      );

    const result =
      await download.downloadAsync();

    if (!result?.uri) {
      throw new Error(
        "Download failed"
      );
    }

    return {
      uri: result.uri,
    };
    
  };

export const openOfflinePdf =
  async (
    uri: string
  ) => {

    const available =
      await Sharing.isAvailableAsync();

    if (!available) {
      throw new Error(
        "Sharing unavailable"
      );
    }

    await Sharing.shareAsync(
      uri
    );
  };