export const FileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  if (!file) callback(new Error('File is empty'), false);

  const fileExtension = file.mimetype.split('/')[1];

  const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];

  console.log('Inclue el archivo ', validExtensions.includes(fileExtension));
  
  if (validExtensions.includes(fileExtension)) {
    callback(null, true);
  }else{
    callback(null, false);
  }
};
