import { useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { FileUpload } from "primereact/fileupload";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { useRef } from "react";

const AdminUploadPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState(null);
  const [category, setCategory] = useState(null);
  const [file, setFile] = useState(null);
  const toast = useRef(null);

  const typeOptions = [
    { label: "รูปภาพ", value: "image" },
    { label: "วิดีโอ", value: "video" },
    { label: "กราฟฟิก", value: "graphic" },
  ];

  const categoryOptions = [
    { label: "การแพทย์", value: "medical" },
    { label: "การเรียนการสอน", value: "education" },
    { label: "รอบรั้วมหาวิทยาลัย", value: "campus" },
  ];

  const handleUpload = () => {
    if (!title || !type || !category || !file) {
      toast.current.show({
        severity: "warn",
        summary: "ข้อมูลไม่ครบ",
        detail: "กรุณากรอกข้อมูลและเลือกไฟล์ให้ครบถ้วน",
      });
      return;
    }

    const data = {
      title,
      description,
      type,
      category,
      file,
    };

    console.log("Uploading resource:", data);

    toast.current.show({
      severity: "success",
      summary: "อัปโหลดสำเร็จ",
      detail: "ข้อมูลของคุณถูกบันทึกแล้ว",
    });

    setTitle("");
    setDescription("");
    setType(null);
    setCategory(null);
    setFile(null);
  };

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <Card title="อัปโหลดทรัพยากรใหม่" className="shadow-4">
        <div className="p-fluid grid">
          <div className="col-12 mb-3">
            <label htmlFor="title">ชื่อไฟล์</label>
            <InputText
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ระบุชื่อไฟล์"
            />
          </div>

          <div className="col-12 mb-3">
            <label htmlFor="description">คำอธิบาย</label>
            <InputTextarea
              id="description"
              value={description}
              rows={4}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="อธิบายรายละเอียดของไฟล์"
            />
          </div>

          <div className="col-12 md:col-6 mb-3">
            <label htmlFor="type">ประเภท</label>
            <Dropdown
              id="type"
              value={type}
              options={typeOptions}
              onChange={(e) => setType(e.value)}
              placeholder="เลือกประเภทไฟล์"
            />
          </div>

          <div className="col-12 md:col-6 mb-3">
            <label htmlFor="category">หมวดหมู่</label>
            <Dropdown
              id="category"
              value={category}
              options={categoryOptions}
              onChange={(e) => setCategory(e.value)}
              placeholder="เลือกหมวดหมู่"
            />
          </div>

          <div className="col-12 mb-4">
            <label>อัปโหลดไฟล์</label>
            <FileUpload
              mode="basic"
              auto
              customUpload
              chooseLabel="เลือกไฟล์"
              uploadHandler={(e) => setFile(e.files[0])}
              accept="image/*,video/*"
            />
          </div>

          <div className="col-12 text-center">
            <Button
              label="อัปโหลด"
              icon="pi pi-upload"
              onClick={handleUpload}
              className="p-button-success"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminUploadPage;
