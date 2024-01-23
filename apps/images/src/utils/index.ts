import { BadRequestException } from '@nestjs/common';

export function editFileName(
  req,
  file: Express.Multer.File,
  callback: (error: Error, filename: string) => void,
) {
  const originalFilename = file.originalname;
  const timestamp = Date.now();
  const fileExtension = originalFilename.split('.').pop();

  // Replace spaces with underscores in the original filename
  const nameWithoutSpaces = originalFilename.replace(/\s/g, '_');

  // Generate new filename by appending timestamp to sanitized filename (before extension)
  const newFilename = `${nameWithoutSpaces.replace(
    /\.[^/.]+$/,
    '',
  )}_${timestamp}.${fileExtension}`;
  return callback(null, newFilename);
}

export function imageFileFilter(
  req,
  file: Express.Multer.File,
  callback: (error: Error, acceptFile: boolean) => void,
) {
  const hasFileExtension = file.originalname.match(/\.(jpg|jpeg|png|gif)$/);

  if (!hasFileExtension) {
    return callback(
      new BadRequestException('Only image files are allowed!'),
      false,
    );
  }
  callback(null, true);
}
