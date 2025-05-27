import { useState, useRef, useEffect } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { FileUpload, FileUploadHandlerEvent } from "primereact/fileupload";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Chart } from "primereact/chart";
import { TabView, TabPanel } from "primereact/tabview";
import { Tag } from "primereact/tag";
import { Dialog } from "primereact/dialog";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  container: {
    padding: "2rem",
    maxWidth: 1400,
    margin: "0 auto",
  },
  header: {
    marginBottom: "2rem",
    "& h1": {
      color: "#b71c1c",
      fontSize: "2rem",
      fontWeight: 800,
      marginBottom: "0.5rem",
    },
    "& p": {
      color: "#666",
      fontSize: "1.1rem",
    },
  },
  card: {
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 2px 14px #b71c1c11",
    border: "1px solid #f5c6a5",
    "& .p-card-title": {
      color: "#b71c1c",
      fontSize: "1.5rem",
      fontWeight: 700,
    },
    "& .p-card-content": {
      padding: "1.5rem",
    },
  },
  formLabel: {
    color: "#b85c38",
    fontWeight: 600,
    marginBottom: "0.5rem",
    display: "block",
  },
  input: {
    "& .p-inputtext": {
      border: "1.7px solid #e0cfc0",
      borderRadius: "12px",
      padding: "0.8rem 1rem",
      "&:focus": {
        borderColor: "#b71c1c",
        boxShadow: "0 2px 12px #b71c1c22",
      },
    },
  },
  dropdown: {
    "& .p-dropdown": {
      border: "1.7px solid #e0cfc0",
      borderRadius: "12px",
      "&:focus": {
        borderColor: "#b71c1c",
        boxShadow: "0 2px 12px #b71c1c22",
      },
    },
  },
  fileUpload: {
    "& .p-button": {
      background: "#b71c1c",
      border: "none",
      borderRadius: "12px",
      padding: "0.8rem 1.5rem",
      "&:hover": {
        background: "#892d05",
      },
    },
  },
  submitButton: {
    background: "linear-gradient(90deg, #b71c1c 60%, #b85c38 100%)",
    border: "none",
    borderRadius: "12px",
    padding: "0.8rem 2rem",
    fontSize: "1.1rem",
    fontWeight: 700,
    "&:hover": {
      background: "#892d05",
    },
  },
  table: {
    "& .p-datatable": {
      borderRadius: "12px",
      overflow: "hidden",
      border: "1px solid #f5c6a5",
    },
    "& .p-datatable-header": {
      background: "#fff7f0",
      border: "none",
    },
    "& .p-datatable-thead > tr > th": {
      background: "#fff7f0",
      color: "#b71c1c",
      fontWeight: 700,
    },
    "& .p-datatable-tbody > tr": {
      transition: "background 0.2s",
      "&:hover": {
        background: "#fbeee6",
      },
    },
  },
  chart: {
    background: "#fff",
    borderRadius: "12px",
    padding: "1.5rem",
    boxShadow: "0 2px 14px #b71c1c11",
    border: "1px solid #f5c6a5",
  },
  tabView: {
    "& .p-tabview-nav": {
      border: "none",
      "& li .p-tabview-nav-link": {
        color: "#b85c38",
        "&:hover": {
          background: "#fbeee6",
        },
      },
      "& li.p-highlight .p-tabview-nav-link": {
        color: "#b71c1c",
        borderColor: "#b71c1c",
      },
    },
  },
});

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'image' | 'video' | 'graphic';
  category: string | string[];
  tags: string[];
  fileUrl: string;
  thumbnailUrl: string;
  uploadedBy: string;
  downloadCount: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

const AdminUploadPage = () => {
  const classes = useStyles();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<'image' | 'video' | 'graphic' | null>(null);
  const [category, setCategory] = useState<'medical' | 'education' | 'campus' | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    // จำลองการดึงข้อมูลจาก API
    fetch('/mock/resources.json')
      .then(response => response.json())
      .then(data => setResources(data))
      .catch(error => {
        console.error('Error fetching resources:', error);
        toast.current?.show({
          severity: "error",
          summary: "เกิดข้อผิดพลาด",
          detail: "ไม่สามารถโหลดข้อมูลได้",
        });
      });
  }, []);

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
      toast.current?.show({
        severity: "warn",
        summary: "ข้อมูลไม่ครบ",
        detail: "กรุณากรอกข้อมูลและเลือกไฟล์ให้ครบถ้วน",
      });
      return;
    }

    const newResource: Resource = {
      id: `r${String(resources.length + 1).padStart(4, '0')}`,
      title,
      description,
      type,
      category: category,
      tags: [],
      fileUrl: URL.createObjectURL(file),
      thumbnailUrl: URL.createObjectURL(file),
      uploadedBy: "admin",
      downloadCount: 0,
      viewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setResources([...resources, newResource]);

    toast.current?.show({
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

  const typeTemplate = (rowData: Resource) => {
    const typeMap = {
      image: { label: "รูปภาพ", color: "#b71c1c" },
      video: { label: "วิดีโอ", color: "#1976d2" },
      graphic: { label: "กราฟฟิก", color: "#b85c38" },
    };
    const type = typeMap[rowData.type];
    return <Tag value={type.label} style={{ background: type.color }} />;
  };

  const categoryTemplate = (rowData: Resource) => {
    const categories = Array.isArray(rowData.category) ? rowData.category : [rowData.category];
    return (
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {categories.map((cat, index) => {
          const categoryMap = {
            medical: { label: "การแพทย์", color: "#b71c1c" },
            education: { label: "การเรียนการสอน", color: "#1976d2" },
            campus: { label: "รอบรั้วมหาวิทยาลัย", color: "#b85c38" },
          };
          const category = categoryMap[cat as keyof typeof categoryMap];
          return <Tag key={index} value={category.label} style={{ background: category.color }} />;
        })}
      </div>
    );
  };

  // คำนวณสถิติจากข้อมูลจริง
  const calculateStats = () => {
    const typeStats = {
      image: 0,
      video: 0,
      graphic: 0
    };
    const viewStats = {
      image: 0,
      video: 0,
      graphic: 0
    };

    resources.forEach(resource => {
      typeStats[resource.type]++;
      viewStats[resource.type] += resource.viewCount;
    });

    return { typeStats, viewStats };
  };

  const { typeStats, viewStats } = calculateStats();

  const chartData = {
    labels: ['รูปภาพ', 'วิดีโอ', 'กราฟฟิก'],
    datasets: [
      {
        data: [typeStats.image, typeStats.video, typeStats.graphic],
        backgroundColor: ['#b71c1c', '#1976d2', '#b85c38'],
        hoverBackgroundColor: ['#892d05', '#1565c0', '#8b4513'],
      },
    ],
  };

  const viewChartData = {
    labels: ['รูปภาพ', 'วิดีโอ', 'กราฟฟิก'],
    datasets: [
      {
        label: 'จำนวนการเข้าชม',
        data: [viewStats.image, viewStats.video, viewStats.graphic],
        backgroundColor: ['#b71c1c', '#1976d2', '#b85c38'],
      },
    ],
  };

  return (
    <div className={classes.container}>
      <Toast ref={toast} />
      <div className={classes.header}>
        <h1>จัดการทรัพยากร</h1>
        <p>อัปโหลด จัดการ และดูสถิติการใช้งานทรัพยากร</p>
      </div>

      <TabView className={classes.tabView}>
        <TabPanel header="อัปโหลดทรัพยากรใหม่">
          <Card className={classes.card}>
            <div className="p-fluid grid">
              <div className="col-12 mb-3">
                <label htmlFor="title" className={classes.formLabel}>ชื่อไฟล์</label>
                <InputText
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ระบุชื่อไฟล์"
                  className={classes.input}
                />
              </div>

              <div className="col-12 mb-3">
                <label htmlFor="description" className={classes.formLabel}>คำอธิบาย</label>
                <InputTextarea
                  id="description"
                  value={description}
                  rows={4}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="อธิบายรายละเอียดของไฟล์"
                  className={classes.input}
                />
              </div>

              <div className="col-12 md:col-6 mb-3">
                <label htmlFor="type" className={classes.formLabel}>ประเภท</label>
                <Dropdown
                  id="type"
                  value={type}
                  options={typeOptions}
                  onChange={(e) => setType(e.value as 'image' | 'video' | 'graphic' | null)}
                  placeholder="เลือกประเภทไฟล์"
                  className={classes.dropdown}
                />
              </div>

              <div className="col-12 md:col-6 mb-3">
                <label htmlFor="category" className={classes.formLabel}>หมวดหมู่</label>
                <Dropdown
                  id="category"
                  value={category}
                  options={categoryOptions}
                  onChange={(e) => setCategory(e.value as 'medical' | 'education' | 'campus' | null)}
                  placeholder="เลือกหมวดหมู่"
                  className={classes.dropdown}
                />
              </div>

              <div className="col-12 mb-4">
                <label className={classes.formLabel}>อัปโหลดไฟล์</label>
                <FileUpload
                  mode="basic"
                  auto
                  customUpload
                  chooseLabel="เลือกไฟล์"
                  uploadHandler={(e: FileUploadHandlerEvent) => setFile(e.files[0])}
                  accept="image/*,video/*"
                  className={classes.fileUpload}
                />
              </div>

              <div className="col-12 text-center">
                <Button
                  label="อัปโหลด"
                  icon="pi pi-upload"
                  onClick={handleUpload}
                  className={classes.submitButton}
                />
              </div>
            </div>
          </Card>
        </TabPanel>

        <TabPanel header="จัดการทรัพยากร">
          <Card className={classes.card}>
            <DataTable
              value={resources}
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 20]}
              className={classes.table}
            >
              <Column field="id" header="ID" style={{ width: '5%' }} />
              <Column field="title" header="ชื่อไฟล์" style={{ width: '30%' }} />
              <Column field="type" header="ประเภท" body={typeTemplate} style={{ width: '15%' }} />
              <Column field="category" header="หมวดหมู่" body={categoryTemplate} style={{ width: '20%' }} />
              <Column field="createdAt" header="วันที่อัปโหลด" style={{ width: '15%' }} body={(rowData) => new Date(rowData.createdAt).toLocaleDateString('th-TH')} />
              <Column field="viewCount" header="จำนวนการเข้าชม" style={{ width: '15%' }} />
            </DataTable>
          </Card>
        </TabPanel>

        <TabPanel header="สถิติการใช้งาน">
          <div className="grid">
            <div className="col-12 md:col-6">
              <Card className={classes.chart}>
                <h3>จำนวนทรัพยากรแยกตามประเภท</h3>
                <Chart type="pie" data={chartData} />
              </Card>
            </div>
            <div className="col-12 md:col-6">
              <Card className={classes.chart}>
                <h3>สถิติการเข้าชม</h3>
                <Chart type="bar" data={viewChartData} />
              </Card>
            </div>
          </div>
        </TabPanel>
      </TabView>
    </div>
  );
};

export default AdminUploadPage;
