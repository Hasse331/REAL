import { useState } from "react";
import { useRouter } from "next/router";
import React from "react";
import useLoginCheck from "@/app/utils/useLoginCheck";

export default function ProfileEditButtons({ data, myJwtUsed, token }) {
  const [isOpen, setIsOpen] = useState(false);
  const [popMessage, setPopMessage] = useState("");
  const loggedIn = useLoginCheck("noSet");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const router = useRouter();

  const clickEditProfile = () => {
    router.push({
      pathname: "/editProfile",
      query: data,
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          alert("File size should not exceed 5MB");
          return;
        }
        if (!file.type.startsWith("image/")) {
          alert("Please upload a valid image");
          return;
        }
        setSelectedFile(file);
      }
    }
  };

  const imageUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    const imgType = "profile";

    formData.append("file", selectedFile);
    formData.append("media_type", imgType);

    const uploadMediaEndpoint =
      process.env.NEXT_PUBLIC_UPLOAD_MEDIA ||
      "ENV_VARIABLE_NOT_FOUND: uploadMediaEndpoint profile.tsx";

    try {
      const response = await fetch(uploadMediaEndpoint, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.message == "success") {
        setPopMessage(
          "Image uploaded succesfully! It may take a moment for the changes to appear."
        );
      }
    } catch (error) {
      console.error("Error uploading the file:", error);
    }
  };

  return (
    <div>
      {loggedIn && myJwtUsed && (
        <div>
          <button className="m-1 ml-0 p-2 text-xs" onClick={clickEditProfile}>
            Edit Profile
          </button>
          <button
            className="m-1 ml-0 p-2 text-xs"
            onClick={() => setIsOpen(true)}
          >
            Change Image
          </button>
          {isOpen && (
            <div className="fixed top-0 p-12 left-0 w-full h-full flex items-center justify-center z-50">
              {/* Backdrop */}
              <div className="absolute top-0 left-0 w-full h-full  bg-gray-900 opacity-80"></div>

              {/* Modal Content */}
              <div className="relative p-5 to-gray-600 from-gray-800 bg-gradient-to-r border-solid border-violet-700 border rounded-lg shadow-lg w-80">
                <h2 className="mb-5 text-lg font-bold">Change Profile Image</h2>

                <div className="space-y-2 mt-5">
                  <label className="block text-violet-700">
                    Upload Image <br />
                    <input
                      type="file"
                      name="image_name"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="p-2 border bg-transparent w-60 border-violet-700 text-gray-200 rounded"
                    />
                  </label>
                </div>
                <button
                  className="absolute top-2 right-2 p-1 h-8"
                  onClick={() => setIsOpen(false)}
                >
                  x
                </button>
                <div>
                  <p className="text-green-600">{popMessage}</p>
                  <button
                    onClick={imageUpload}
                    type="submit"
                    className="mt-5 mb-0"
                  >
                    submit
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
