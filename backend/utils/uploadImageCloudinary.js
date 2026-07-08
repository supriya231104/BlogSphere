import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

async function uploadImageToCloudinary(buffer) {
  return 
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "blog app",
        timeout: 60000,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result); 
      } // you tell cloudinary use this callback when you start uploading file 
    ); // create container to accept stream of data that container is stream here 
    //yeah tks for that everythings clear now so what i got is stream here is like storage that accepts stream and pipe is way to pour that stream data into what we created on cloudinary but it accepts stream    so we need to convert it in stream from buffer and callback after finishing upload
//     upload_stream() → creates a receiver (writable stream)
// createReadStream(buffer) → creates a sender (readable stream)
// .pipe() → connects sender → receiver
// “Cloudinary gives me a writable stream that accepts data.
// I convert my buffer into a readable stream and use pipe to send data into it.
// When upload finishes, the callback runs.”

    streamifier.createReadStream(buffer).pipe(stream); //actaul upload here
  });
}

export { uploadImageToCloudinary };