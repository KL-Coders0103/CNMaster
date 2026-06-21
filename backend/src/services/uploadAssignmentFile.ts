import cloudinary
from "../config/cloudinary";

import {
  UploadApiResponse,
} from "cloudinary";

export const uploadAssignmentFile =
  async (
    file: Express.Multer.File
  ) => {

    const result =
      await new Promise<UploadApiResponse>(
        (
          resolve,
          reject
        ) => {

          const stream =
            cloudinary.uploader.upload_stream(
              {
                folder:
                  "cn-master/assignment-submissions",

                resource_type:
                  "auto",
              },

              (
                error,
                result
              ) => {

                if (error) {
                  return reject(
                    error
                  );
                }

                if (!result) {
                  return reject(
                    new Error(
                      "Upload failed"
                    )
                  );
                }

                resolve(
                  result
                );
              }
            );

          stream.end(
            file.buffer
          );
        }
      );

    return result;
  };