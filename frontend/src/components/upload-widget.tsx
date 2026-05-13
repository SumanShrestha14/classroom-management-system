import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "@/constants";
import { UploadWidgetProps, UploadWidgetValue } from "@/types";
import { UploadCloud } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const UploadWidget: React.FC<UploadWidgetProps> = ({
  value = null,
  onChange,
  disabled = false,
}) => {
  const widgetRef = useRef<CloudinaryWidget | null>(null);
  const onChangeRef = useRef(onChange);
  const [preview, setPreview] = useState<UploadWidgetValue | null>(value);

  useEffect(() => {
    setPreview(value);
  }, [value]);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const initializeWidget = () => {
      if (!window.cloudinary || widgetRef.current) return false;
      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: CLOUDINARY_CLOUD_NAME,
          uploadPreset: CLOUDINARY_UPLOAD_PRESET,
          multiple: false,
          folder: "classroom-management-system-upload",
          maxFileSize: 5 * 1024 * 1024, // 5MB
          clientAllowedFormats: ["png", "jpeg", "jpg", "webp"],
        },
        (error, result) => {
          if (error) {
            console.error(error);
            return;
          }

          if (result?.event === "success") {
            const payload: UploadWidgetValue = {
              url: result.info.secure_url,
              publicId: result.info.public_id,
            };

            setPreview(payload);
            onChangeRef.current?.(payload);
          }
        },
      );
      return true;
    };
    if (initializeWidget()) return;
    let retryCount = 0;
    const MAX_RETRIES = 20; // 10 seconds total
    const intervalId = window.setInterval(() => {
      if (initializeWidget()) {
        window.clearInterval(intervalId);
        return;
      }

      retryCount++;
      if (retryCount >= MAX_RETRIES) {
        window.clearInterval(intervalId);
        console.error(
          "Failed to initialize Cloudinary widget: script did not load",
        );
      }
    }, 500);
    return () => window.clearInterval(intervalId);
  }, []);
  const openWidget = () => {
    if (!disabled) {
      widgetRef.current?.open();
    }
  };

  return (
    <div className="space-y-2">
      {preview ? (
        <div className="upload-preview">
          <img src={preview.url} alt="Preview File" />
        </div>
      ) : (
        <div
          className="upload-dropzone"
          role="button"
          tabIndex={0}
          onClick={openWidget}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              openWidget();
            }
          }}
        >
          <div className="upload-prompt">
            <UploadCloud className="icon" />
            <div>
              <p>Click to Upload a image</p>
              <p>PNG , JPEG up to 5MB</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadWidget;
