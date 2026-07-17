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

interface Article {
  _id: string;
  image: string;
  title: string;
  sortDes: string;
  longDes: string;
  category:
    | "সংবাদ"
    | "মতামত"
    | "বিনোদন"
    | "খেলাধুলা"
    | "সাক্ষাৎকার"
    | "ব্যক্তিত্ব"
    | "বিবিধ";
  time: {
    day: number;
    month: string;
    year: number;
  };
}

export default function AllArticle() {
  const [data, setData] = useState<Article[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await fetch("https://bd-news-backend.vercel.app/api/article");
      const result = await res.json();
      const actualData = result.data || result.items || result;
      setData(Array.isArray(actualData) ? actualData : []);
    } catch (error) {
      console.error("Error fetching articles:", error);
      toast.error("Failed to load data");
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

  const showModal = (record: Article | null = null) => {
    setIsModalOpen(true);
    setIsEditMode(!!record);
    setCurrentRecord(record);
    form.setFieldsValue(
      record || {
        image: "",
        title: "",
        sortDes: "",
        longDes: "",
        category: "সংবাদ",
        time: { day: 1, month: "Jan", year: 2025 },
      }
    );
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`https://bd-news-backend.vercel.app/api/article/${id}`, {
        method: "DELETE",
      });
      setData((prev) => prev.filter((item) => item._id !== id));
      toast.success("Article deleted successfully!");
    } catch (error) {
      console.error("Error deleting article:", error);
      toast.error("Error deleting article");
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const url = isEditMode
        ? `https://bd-news-backend.vercel.app/api/article/${currentRecord?._id}`
        : "https://bd-news-backend.vercel.app/api/article/create-article";

      const method = isEditMode ? "PUT" : "POST";

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      await fetchArticles();
      setIsModalOpen(false);
      form.resetFields();
      toast.success(
        isEditMode
          ? "Article updated successfully!"
          : "Article created successfully!"
      );
    } catch (err) {
      console.error("Error submitting article form:", err);
      toast.error("Error submitting article form.");
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (url: string) => (
        <img src={url} alt="article" width={60} height={40} />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Short Description",
      dataIndex: "sortDes",
      key: "sortDes",
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
      render: (time: Article["time"]) =>
        `${time.day}-${time.month}-${time.year}`,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Article) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => showModal(record)} />
          <Popconfirm
            title="Are you sure to delete this article?"
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
        Add Article
      </Button>

      <Table columns={columns} dataSource={data} rowKey="_id" />

      <Modal
        title={isEditMode ? "Update Article" : "Create Article"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        okText={isEditMode ? "Update" : "Create"}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Image URL"
            name="image"
            rules={[{ required: true, message: "Please enter image URL" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter title" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Short Description"
            name="sortDes"
            rules={[
              { required: true, message: "Please enter short description" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Long Description"
            name="longDes"
            rules={[
              { required: true, message: "Please enter long description" },
            ]}
          >
            <Input.TextArea rows={4} />
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
