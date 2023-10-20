import os
import boto3
from botocore.exceptions import NoCredentialsError
from fastapi import HTTPException, UploadFile
from botocore.exceptions import NoCredentialsError
from fastapi.responses import StreamingResponse
import io
from typing import Optional
from botocore.exceptions import NoCredentialsError, ClientError


class ImageHandler():
    def __init__(self, user_id, media_type, post_id: Optional[str] = None, media: Optional[str] = None):

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
                    status_code=400, detail="Invalid image_type identifier. Allowed values are 'profile', 'post' or 'placeholder'.")

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

                # Add image processing libraries to further validate the file content.
                if not self.media.content_type.startswith("image/"):
                    raise HTTPException(
                        status_code=400, detail="Invalid image type")

                if not self.media.content_type.startswith("video/"):
                    raise HTTPException(
                        status_code=400, detail="Invalid image type")

                if self.media.content_type.startswith("image/") and len(self.media) > 8 * 1024 * 1024:
                    raise HTTPException(
                        status_code=400, detail="Image file size should not exceed 8MB")

                if self.media.content_type.startswith("video/") and len(self.media) > 2000 * 1024 * 1024:
                    raise HTTPException(
                        status_code=400, detail="Video file size should not exceed 2GB")

            else:
                raise HTTPException(
                    status_code=404, detail="Media not not found")

            s3_path = f"media/posts/{self.user_id}/{self.post_id}"
            return s3_path

        return check_type()

    def upload_media(self):

        s3_path = self.validate()

        try:
            self.s3.upload_fileobj(
                self.media.file, self.BUCKET_NAME, s3_path)
            return {"message": "success"}
        except NoCredentialsError:
            return {"message": "Credentials not available"}

    def get_media(self):

        # media_type, user_id and post_id required here

        def check_type():
            if self.media_type == "profile":
                s3_path = f"media/profile/{self.user_id}/profile_image"
                return s3_path

            elif self.media_type == "post":
                s3_path = f"media/posts/{self.user_id}/{self.post_id}"
                return s3_path
            elif self.media_type == "placeholder":
                s3_path = f"placeholder.png"
                return s3_path
            else:
                raise HTTPException(
                    status_code=400, detail="Invalid image_type identifier. Allowed values are 'profile', 'post' or 'placeholder'.")

        s3_path = check_type()

        try:
            # Fetch the image from S3
            s3_response = self.s3.get_object(
                Bucket=self.BUCKET_NAME, Key=s3_path)
            response_content_type = s3_response['ContentType']
            response_body = s3_response['Body'].read()

            # Return the image as a response
            return StreamingResponse(io.BytesIO(response_body), media_type=response_content_type)

        except NoCredentialsError:
            raise HTTPException(
                status_code=401, detail="Missing AWS credentials")
        except ClientError as e:
            if e.response['Error']['Code'] == "NoSuchKey":
                s3_path = f"placeholder.png"
                response = self.s3.get_object(
                    Bucket=self.BUCKET_NAME, Key=s3_path)['Body'].read()
                return StreamingResponse(io.BytesIO(response), media_type="image/png")
            else:
                # If the error was due to some other reason, raise a 400 with the error message
                raise HTTPException(status_code=400, detail=str(e))
