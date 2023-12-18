import os
import boto3
from botocore.exceptions import NoCredentialsError
from fastapi import HTTPException, UploadFile
from botocore.exceptions import NoCredentialsError
from typing import Optional
from botocore.exceptions import NoCredentialsError


class MediaHandler():
    def __init__(self, media_type, user_id: Optional[str] = None,  post_id: Optional[str] = None, media: Optional[str] = None):

        self.media = media
        self.user_id = user_id
        self.media_type = media_type
        self.post_id = post_id

        aws_access_key_id = os.getenv("AWS_S3_USER_ACCESS_KEY")
        aws_secret_access_key = os.getenv("AWS_S3_USER_SECREY_KEY")
        self.BUCKET_NAME = os.getenv("AWS_BUCKET_NAME")
        self.REGION_NAME = os.getenv("AWS_REGION_NAME")

        self.s3 = boto3.client('s3', aws_access_key_id=aws_access_key_id,
                               aws_secret_access_key=aws_secret_access_key)

    def get_file_size(self, upload_file: UploadFile) -> int:
        return upload_file.file.tell()

    def validate(self):

        def check_type():
            if self.media_type == "profile":
                return validate_profile_image()

            elif self.media_type == "post":
                return validate_post_media()
            else:
                raise HTTPException(
                    status_code=400, detail="Invalid media_type identifier. Allowed values are 'profile', 'post' or 'placeholder'.")

        def validate_profile_image():
            if self.media:

                # Add image processing libraries to further validate the file content.
                if not self.media.content_type.startswith("image/"):
                    raise HTTPException(
                        status_code=400, detail="Invalid image type")

                file_size = self.get_file_size(self.media)

                if file_size > 5 * 1024 * 1024:
                    raise HTTPException(
                        status_code=400, detail="File size should not exceed 30MB")

            else:
                raise HTTPException(
                    status_code=404, detail="Media not not found")

            s3_path = f"media/profile/{self.user_id}/profile_image"
            return s3_path

        def validate_post_media():

            if self.media:
                file_size = self.get_file_size(self.media)

                if self.media.content_type.startswith(
                        "image/"):

                    if file_size > 8 * 1024 * 1024:
                        print("Image file size should not exceed 8MB")
                        raise HTTPException(
                            status_code=400, detail="Image file size should not exceed 8MB")

                elif self.media.content_type.startswith("video/"):
                    if file_size > 2000 * 1024 * 1024:
                        print("Video file size should not exceed 2GB")
                        raise HTTPException(
                            status_code=400, detail="Video file size should not exceed 2GB")
                else:
                    print("Invalid media type")
                    raise HTTPException(
                        status_code=400, detail="Invalid media type")

            else:
                raise HTTPException(
                    status_code=404, detail="Media not not found")

            s3_path = f"media/posts/{self.post_id}"
            return s3_path

        return check_type()

    def upload_media(self):

        s3_path = self.validate()

        try:
            print("uploading media")
            self.s3.upload_fileobj(
                self.media.file, self.BUCKET_NAME, s3_path)
            print("success!")
            return {"message": "success"}
        except NoCredentialsError:
            return {"message": "Credentials not available"}
