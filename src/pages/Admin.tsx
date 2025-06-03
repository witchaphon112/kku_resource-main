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
import { createUseStyles } from "react-jss";
import { useResources } from "../contexts/ResourceContext";

const COLORS = {
  primary: "#2d3436",
  secondary: "#4a90e2",
  accent: "#4a90e2",
  danger: "#ff6b6b",
  success: "#51cf66",
  warning: "#ffd43b",
  gray: "#b2bec3",
  darkGray: "#636e72",
  lightGray: "#f1f2f6",
  white: "#ffffff",
};

const GRADIENTS = {
  primary: "linear-gradient(135deg, #2d3436 0%, #434343 100%)",
  accent: "linear-gradient(135deg, #4a90e2 0%, #357abd 100%)",
  card: "linear-gradient(135deg, #fff 0%, #f8f9fa 100%)",
};

const useStyles = createUseStyles({
  container: {
    padding: "4rem 2rem",
    maxWidth: 1400,
    margin: "0 auto",
    "@media (max-width: 768px)": {
      padding: "2rem 1rem",
    }
  },
  header: {
    marginBottom: "3rem",
    textAlign: "center",
    "& h1": {
      color: COLORS.primary,
      fontSize: "2.5rem",
      fontWeight: 800,
      marginBottom: "1rem",
      position: "relative",
      display: "inline-block",
      "@media (max-width: 768px)": {
        fontSize: "2rem",
      },
      "&::after": {
        content: '""',
        position: "absolute",
        bottom: -10,
        left: "50%",
        transform: "translateX(-50%)",
        width: 100,
        height: 4,
        background: COLORS.accent,
        borderRadius: 2,
      }
    },
    "& p": {
      color: COLORS.darkGray,
      fontSize: "1.2rem",
      maxWidth: 600,
      margin: "0 auto",
      lineHeight: 1.6,
      "@media (max-width: 768px)": {
        fontSize: "1rem",
        maxWidth: "100%",
      }
    }
  },
  card: {
    background: GRADIENTS.card,
    borderRadius: "20px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    border: `2px solid ${COLORS.lightGray}`,
    transition: "all 0.3s ease",
    overflow: "hidden",
    "@media (max-width: 768px)": {
      borderRadius: "16px",
    },
    "&:hover": {
      boxShadow: "0 6px 30px rgba(0,0,0,0.12)",
      transform: "translateY(-5px)",
    },
    "& .p-card-title": {
      color: COLORS.primary,
      fontSize: "1.75rem",
      fontWeight: 700,
      marginBottom: "1.5rem",
      "@media (max-width: 768px)": {
        fontSize: "1.5rem",
      }
    },
    "& .p-card-content": {
      padding: "2rem",
      "@media (max-width: 768px)": {
        padding: "1.5rem",
      }
    }
  },
  formLabel: {
    color: COLORS.primary,
    fontWeight: 600,
    marginBottom: "0.75rem",
    display: "block",
    fontSize: "1.1rem",
    "@media (max-width: 768px)": {
      fontSize: "1rem",
    }
  },
  input: {
    "& .p-inputtext": {
      border: `2px solid ${COLORS.lightGray}`,
      borderRadius: "12px",
      padding: "1rem 1.25rem",
      fontSize: "1rem",
      transition: "all 0.3s ease",
      "@media (max-width: 768px)": {
        padding: "0.75rem 1rem",
        fontSize: "0.95rem",
      },
      "&:focus": {
        borderColor: COLORS.accent,
        boxShadow: "0 0 0 3px rgba(74,144,226,0.1)",
      },
      "&:hover": {
        borderColor: COLORS.accent,
      }
    }
  },
  dropdown: {
    "& .p-dropdown": {
      border: `2px solid ${COLORS.lightGray}`,
      borderRadius: "12px",
      transition: "all 0.3s ease",
      "@media (max-width: 768px)": {
        width: "100%",
      },
      "&:hover": {
        borderColor: COLORS.accent,
      },
      "&:focus": {
        borderColor: COLORS.accent,
        boxShadow: "0 0 0 3px rgba(74,144,226,0.1)",
      },
      "& .p-dropdown-label": {
        padding: "1rem 1.25rem",
        fontSize: "1rem",
        "@media (max-width: 768px)": {
          padding: "0.75rem 1rem",
          fontSize: "0.95rem",
        }
      }
    }
  },
  fileUpload: {
    "& .p-button": {
      background: GRADIENTS.primary,
      border: "none",
      borderRadius: "12px",
      padding: "1rem 1.5rem",
      fontSize: "1rem",
      fontWeight: 600,
      transition: "all 0.3s ease",
      "@media (max-width: 768px)": {
        width: "100%",
        padding: "0.75rem 1rem",
      },
      "&:hover": {
        background: COLORS.primary,
        transform: "translateY(-2px)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      }
    }
  },
  submitButton: {
    background: GRADIENTS.accent,
    border: "none",
    borderRadius: "12px",
    padding: "1rem 2rem",
    fontSize: "1.1rem",
    fontWeight: 700,
    transition: "all 0.3s ease",
    "@media (max-width: 768px)": {
      width: "100%",
      padding: "0.75rem 1.5rem",
      fontSize: "1rem",
    },
    "&:hover": {
      background: COLORS.accent,
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(74,144,226,0.25)",
    }
  },
  table: {
    "& .p-datatable": {
      borderRadius: "16px",
      overflow: "hidden",
      border: `2px solid ${COLORS.lightGray}`,
      "@media (max-width: 768px)": {
        borderRadius: "12px",
      },
      "& .p-datatable-header": {
        background: COLORS.white,
        padding: "1.5rem",
        border: "none",
        "@media (max-width: 768px)": {
          padding: "1rem",
        }
      },
      "& .p-datatable-thead > tr > th": {
        background: GRADIENTS.primary,
        color: COLORS.white,
        padding: "1.25rem 1.5rem",
        fontWeight: 600,
        fontSize: "1rem",
        border: "none",
        "@media (max-width: 768px)": {
          padding: "1rem",
          fontSize: "0.9rem",
        }
      },
      "& .p-datatable-tbody > tr": {
        transition: "all 0.3s ease",
        "& > td": {
          padding: "1rem 1.5rem",
          fontSize: "1rem",
          "@media (max-width: 768px)": {
            padding: "0.75rem 1rem",
            fontSize: "0.9rem",
          }
        },
        "&:hover": {
          background: COLORS.lightGray,
          "& > td": {
            color: COLORS.primary,
          }
        }
      }
    }
  },
  chart: {
    background: COLORS.white,
    borderRadius: "20px",
    padding: "2rem",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    border: `2px solid ${COLORS.lightGray}`,
    transition: "all 0.3s ease",
    "@media (max-width: 768px)": {
      padding: "1.5rem",
      borderRadius: "16px",
    },
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 6px 30px rgba(0,0,0,0.12)",
    },
    "& h3": {
      color: COLORS.primary,
      fontSize: "1.5rem",
      fontWeight: 700,
      marginBottom: "1.5rem",
      textAlign: "center",
      "@media (max-width: 768px)": {
        fontSize: "1.3rem",
        marginBottom: "1rem",
      }
    }
  },
  tabView: {
    "& .p-tabview-nav": {
      border: "none",
      marginBottom: "2rem",
      "@media (max-width: 768px)": {
        flexWrap: "wrap",
        gap: "0.5rem",
      },
      "& li": {
        margin: "0 0.5rem",
        "@media (max-width: 768px)": {
          width: "100%",
          margin: 0,
        },
        "&:first-child": {
          marginLeft: 0,
        },
        "&:last-child": {
          marginRight: 0,
        },
        "& .p-tabview-nav-link": {
          background: COLORS.white,
          border: `2px solid ${COLORS.lightGray}`,
          borderRadius: "12px",
          padding: "1rem 1.5rem",
          color: COLORS.darkGray,
          fontWeight: 600,
          transition: "all 0.3s ease",
          "@media (max-width: 768px)": {
            width: "100%",
            justifyContent: "center",
            padding: "0.75rem 1rem",
          },
          "&:hover": {
            background: COLORS.lightGray,
            borderColor: COLORS.accent,
            color: COLORS.accent,
          }
        },
        "&.p-highlight .p-tabview-nav-link": {
          background: COLORS.accent,
          borderColor: COLORS.accent,
          color: COLORS.white,
        }
      }
    }
  },
  tag: {
    borderRadius: "8px",
    padding: "0.5rem 1rem",
    fontWeight: 600,
    fontSize: "0.9rem",
    "&.image": {
      background: `${COLORS.accent}22`,
      color: COLORS.accent,
    },
    "&.video": {
      background: `${COLORS.success}22`,
      color: COLORS.success,
    },
    "&.graphic": {
      background: `${COLORS.warning}22`,
      color: COLORS.warning,
    },
  },
});

type ResourceType = 'image' | 'video' | 'graphic';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
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

interface StatsObject {
  image: number;
  video: number;
  graphic: number;
}

const calculateStats = (resources: Resource[]) => {
  const typeStats: StatsObject = {
    image: 0,
    video: 0,
    graphic: 0
  };
  
  const viewStats: StatsObject = {
    image: 0,
    video: 0,
    graphic: 0
  };

  resources.forEach(resource => {
    if (resource.type === 'image' || resource.type === 'video' || resource.type === 'graphic') {
      typeStats[resource.type]++;
      viewStats[resource.type] += resource.viewCount;
    }
  });

  return { typeStats, viewStats };
};

const AdminUploadPage = () => {
  const classes = useStyles();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<ResourceType | null>(null);
  const [category, setCategory] = useState<'medical' | 'education' | 'campus' | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const toast = useRef<Toast>(null);
  const { resources, addResource } = useResources();

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

    const newResource = {
      id: `r${String(resources.length + 1).padStart(4, '0')}`,
      title,
      description,
      type,
      category: category,
      tags: [],
      fileUrl: URL.createObjectURL(file),
      thumbnailUrl: URL.createObjectURL(file),
      uploadedBy: "admin", // Use actual user ID here
      downloadCount: 0,
      viewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    addResource(newResource);

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
    const typeMap: Record<ResourceType, { label: string; className: string }> = {
      image: { label: "รูปภาพ", className: "image" },
      video: { label: "วิดีโอ", className: "video" },
      graphic: { label: "กราฟฟิก", className: "graphic" },
    };
    const type = typeMap[rowData.type];
    return <Tag value={type.label} className={`${classes.tag} ${type.className}`} />;
  };

  const categoryTemplate = (rowData: Resource) => {
    const categories = Array.isArray(rowData.category) ? rowData.category : [rowData.category];
    return (
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {categories.map((cat: string, index: number) => {
          const categoryMap: Record<string, { label: string; className: string }> = {
            medical: { label: "การแพทย์", className: "image" },
            education: { label: "การเรียนการสอน", className: "video" },
            campus: { label: "รอบรั้วมหาวิทยาลัย", className: "graphic" },
          };
          const category = categoryMap[cat] || { label: cat, className: "image" };
          return <Tag key={index} value={category.label} className={`${classes.tag} ${category.className}`} />;
        })}
      </div>
    );
  };

  const { typeStats, viewStats } = calculateStats(resources as Resource[]);

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
                  onChange={(e) => setType(e.value as ResourceType | null)}
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
