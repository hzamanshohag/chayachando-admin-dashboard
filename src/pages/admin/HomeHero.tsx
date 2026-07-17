/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Image,
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
  colSpan: string;
  category:
    | "সংবাদ"
    | "মতামত"
    | "বিনোদন"
    | "খেলাধুলা"
    | "সাক্ষাৎকার"
    | "ব্যক্তিত্ব"
    | "বিবিধ";
}

export default function HomeHero() {
  const [data, setData] = useState<Article[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<Article | null>(null);
   const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchHeroes();
  }, []);

  const fetchHeroes = async () => {
    try {
      const response = await fetch(
        "https://bd-news-backend.vercel.app/api/hero"
      );
      const result = await response.json();
      const actualData = result.data || result.items || result;
      setData(Array.isArray(actualData) ? actualData : []);
    } catch (error) {
      console.log(error);
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

  const showModal = (record: Article | null = null) => {
    setIsModalOpen(true);
    setIsEditMode(!!record);
    setCurrentRecord(record);
    form.setFieldsValue(
      record || {
        image: "",
        title: "",
        sortDes: "",
        colSpan: "",
        category: "সংবাদ",
      }
    );
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`https://bd-news-backend.vercel.app/api/hero/${id}`, {
        method: "DELETE",
      });
      setData((prev) => prev.filter((item) => item._id !== id));
      toast.success("Hero deleted successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Error deleting hero");
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (isEditMode && currentRecord) {
        await fetch(
          `https://bd-news-backend.vercel.app/api/hero/${currentRecord._id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          }
        );
        toast.success("Hero updated successfully!");
      } else {
        await fetch("https://bd-news-backend.vercel.app/api/hero/create-hero", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        toast.success("Hero created successfully!");
      }

      await fetchHeroes();
      setIsModalOpen(false);
      form.resetFields();
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong. Please check the form and try again.");
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (url: string) => <Image width={60} src={url} />,
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
      title: "Actions",
      key: "actions",
      render: (_: any, record: Article) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => showModal(record)} />
          <Popconfirm
            title="Are you sure to delete this item?"
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
        Add Hero News
      </Button>

      <Table columns={columns} dataSource={data || []} rowKey="_id" />

      <Modal
        title={isEditMode ? "Update Article" : "Create Hero News"}
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
            label="Short Description"
            name="sortDes"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Article ID"
            name="articleID"
            rules={[{ required: true, message: "Please enter Article ID" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Col Span"
            name="colSpan"
            rules={[{ required: true }]}
          >
            <Input disabled={isEditMode} />
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
              <Select.Option value="ব্যক্তিত্ব">ব্যক্তিত্ব</Select.Option>
              <Select.Option value="বিবিধ">বিবিধ</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
