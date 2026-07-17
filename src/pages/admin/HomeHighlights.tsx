/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  Select,
  Spin,
} from "antd";
import { useState, useEffect } from "react";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { toast } from "sonner";

interface Highlight {
  _id: string;
  image: string;
  category:
    | "সংবাদ"
    | "মতামত"
    | "বিনোদন"
    | "খেলাধুলা"
    | "সাক্ষাৎকার"
    | "ব্যক্তিত্ব"
    | "বিবিধ";
  articleID: string;
  title: string;
  des: string;
  time: {
    day: number;
    month: string;
    year: number;
  };
}

export default function HomeHighlights() {
  const [data, setData] = useState<Highlight[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<Highlight | null>(null);
   const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchHighlights();
  }, []);

  const fetchHighlights = async () => {
    try {
      const response = await fetch(
        "https://bd-news-backend.vercel.app/api/highlight"
      );
      const result = await response.json();
      const actualData = result.data || result.items || result;
      setData(Array.isArray(actualData) ? actualData : []);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load data");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

     if (loading) {
       return (
         <div
           style={{
             position: "absolute",
             top: 0,
             left: 0,
             width: "100%",
             height: "100%",
             backgroundColor: "rgba(255, 255, 255, 0.7)",
             display: "flex",
             justifyContent: "center",
             alignItems: "center",
           }}
         >
           <Spin size="large" />
         </div>
       );
     }

  const showModal = (record: Highlight | null = null) => {
    setIsModalOpen(true);
    setIsEditMode(!!record);
    setCurrentRecord(record);
    form.setFieldsValue(
      record || {
        image: "",
        title: "",
        des: "",
        category: "সংবাদ",
        articleID: "",
        time: { day: 1, month: "Jan", year: 2025 },
      }
    );
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`https://bd-news-backend.vercel.app/api/highlight/${id}`, {
        method: "DELETE",
      });
      setData((prev) => prev.filter((item) => item._id !== id));
      toast.success("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting highlight:", error);
      toast.error("Error deleting post");
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (isEditMode && currentRecord) {
        await fetch(
          `https://bd-news-backend.vercel.app/api/highlight/${currentRecord._id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          }
        );
        toast.success("Post updated successfully!");
      } else {
        await fetch(
          "https://bd-news-backend.vercel.app/api/highlight/create-highlight",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          }
        );
         toast.success("Post created successfully!");
      }

      await fetchHighlights();
      setIsModalOpen(false);
      form.resetFields();
    } catch (err) {
      console.error("Error submitting form:", err);
      toast.error("Something went wrong. Please check the form and try again.");
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (url: string) => (
        <img src={url} alt="highlight" width={60} height={40} />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "des",
      key: "des",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Date",
      dataIndex: "time",
      key: "time",
      render: (time: Highlight["time"]) =>
        `${time.day}-${time.month}-${time.year}`,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Highlight) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => showModal(record)} />
          <Popconfirm
            title="Are you sure to delete this highlight?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => showModal()}
        style={{ marginBottom: 16 }}
      >
        Add Highlight
      </Button>

      <Table columns={columns} dataSource={data} rowKey="_id" />

      <Modal
        title={isEditMode ? "Update Highlight" : "Create Highlight"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        okText={isEditMode ? "Update" : "Create"}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Image URL"
            name="image"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Title" name="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="des"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Article ID"
            name="articleID"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="সংবাদ">সংবাদ</Select.Option>
              <Select.Option value="মতামত">মতামত</Select.Option>
              <Select.Option value="বিনোদন">বিনোদন</Select.Option>
              <Select.Option value="খেলাধুলা">খেলাধুলা</Select.Option>
              <Select.Option value="সাক্ষাৎকার">সাক্ষাৎকার</Select.Option>
              {/* <Select.Option value="ব্যক্তিত্ব">ব্যক্তিত্ব</Select.Option> */}
              <Select.Option value="বিবিধ">বিবিধ</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Day"
            name={["time", "day"]}
            rules={[{ required: true, message: "Please select day" }]}
          >
            <Select>
              {Array.from({ length: 31 }, (_, i) => (
                <Select.Option key={i + 1} value={i + 1}>
                  {i + 1}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Month"
            name={["time", "month"]}
            rules={[{ required: true, message: "Please select month" }]}
          >
            <Select>
              {[
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ].map((month) => (
                <Select.Option key={month} value={month}>
                  {month}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Year"
            name={["time", "year"]}
            rules={[{ required: true, message: "Please enter year" }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
