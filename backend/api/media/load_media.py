import os
import boto3
from botocore.exceptions import NoCredentialsError
from fastapi import HTTPException
from botocore.exceptions import NoCredentialsError
from fastapi.responses import StreamingResponse
import io
from typing import Optional
from botocore.exceptions import NoCredentialsError, ClientError


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

    def video_generator(self, s3_path):
        initial_chunk_size = 1048576 * 4
        reqular_chunk_size = 51200
        first_chunk = True

        with self.s3.get_object(
                Bucket=self.BUCKET_NAME, Key=s3_path)['Body'] as stream:
            while True:

                if first_chunk:
                    chunk = stream.read(initial_chunk_size)
                    first_chunk = False
                else:
                    chunk = stream.read(reqular_chunk_size)

                if not chunk:
                    break

                yield chunk

    def load_media(self):

        def check_load_type():
            if self.media_type == "profile":
                s3_path = f"media/profile/{self.user_id}/profile_image"
                return s3_path

            elif self.media_type == "post":
                s3_path = f"media/posts/{self.post_id}"
                return s3_path
            elif self.media_type == "placeholder":
                s3_path = f"placeholder.png"
                return s3_path
            else:
                raise HTTPException(
                    status_code=400, detail="Invalid image_type identifier. Allowed values are 'profile', 'post' or 'placeholder'.")

        s3_path = check_load_type()

        try:
            # Fetch the image from S3
            s3_response = self.s3.get_object(
                Bucket=self.BUCKET_NAME, Key=s3_path)
            response_content_type = s3_response['ContentType']
            print("response_content_type is: " + response_content_type)

            if response_content_type == "image":
                response_body = s3_response['Body'].read()

                # Return the image as a response
                return StreamingResponse(io.BytesIO(response_body), media_type=response_content_type)

            elif response_content_type == "binary/octet-stream":
                return StreamingResponse(self.video_generator(s3_path), media_type=response_content_type)
            else:
                raise HTTPException(
                    status_code=400, message="Invalid media type. Media has to be image or video")

        except NoCredentialsError:
            raise HTTPException(
                status_code=401, detail="Missing AWS credentials")
        except ClientError as e:
            if e.response['Error']['Code'] == "NoSuchKey":
                s3_path = f"placeholder.png"
                response = self.s3.get_object(
                    Bucket=self.BUCKET_NAME, Key=s3_path)['Body'].read()
                print("FETCH FAILED, RETURNING PLACEHOLDER")
                print("FETCH FAILED, RETURNING PLACEHOLDER")
                return StreamingResponse(io.BytesIO(response), media_type="image/png")
            else:
                # If the error was due to some other reason, raise a 400 with the error message
                raise HTTPException(status_code=400, detail=str(e))
