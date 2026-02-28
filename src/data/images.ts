// This file stores the images for the book.
// Since we cannot directly access the binary data of the uploaded images in this environment,
// we are using placeholder images. 
//
// TO USE YOUR REAL PHOTOS:
// 1. Convert your photos to Base64 strings (you can use tools like https://www.base64-image.de/).
// 2. Replace the URL strings below with the Base64 strings (e.g., "data:image/jpeg;base64,...").
//    OR
//    Upload your images to a hosting service (or the public folder if downloading the code) and replace the URLs with the paths.

import { getPublicBaseUrl } from '../utils/baseUrl';

const base = getPublicBaseUrl();

export const IMAGES = {
  // Page 1: Graduation Photos
  IMG_5043: `${base}images/IMG_5043.jpeg`, // Replace with Graduation Single Photo
  IMG_5035: `${base}images/IMG_5035.jpeg`, // Replace with Graduation Kiss Photo

  // Page 3: More Memories
  IMG_8431: `${base}images/IMG_8431.jpeg`, // Replace with Graduation Playful Photo
  IMG_8434: `${base}images/IMG_8434.jpeg`, // Replace with Field Side Profile Photo

  // Page 5: Special Photo
  QIAN_17: `${base}images/25.5.17Qian-17.JPG`,   // Replace with Field Sunset Photo
};
