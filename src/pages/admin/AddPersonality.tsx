/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table, Button, Modal, Form, Input, Space, Popconfirm, Spin } from "antd";
import { useEffect, useState } from "react";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { toast } from "sonner";

interface Personality {
  _id: string;
  name: string;
  role: string;
  bio: string;
  education: string;
  portfolioUrl: string;
  coverImage: string;
  profileImage: string;
  sortDes: string;
  longDes: string;
}

export default function AddPersonality() {
  const [data, setData] = useState<Personality[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<Personality | null>(null);
   const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const response = await fetch(
        "https://bd-news-backend.vercel.app/api/profile"
      );
      const result = await response.json();
      setData(result.data || result.items || []);
    } catch (error) {
      console.error("Error fetching personalities:", error);
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

  const showModal = (record: Personality | null = null) => {
    setIsModalOpen(true);
    setIsEditMode(!!record);
    setCurrentRecord(record);
    form.setFieldsValue(
      record || {
        name: "",
        role: "",
        bio: "",
        education: "",
        portfolioUrl: "",
        coverImage: "",
        profileImage: "",
        sortDes: "",
        longDes: "",
      }
    );
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`https://bd-news-backend.vercel.app/api/profile/${id}`, {
        method: "DELETE",
      });
      setData((prev) => prev.filter((item) => item._id !== id));
       toast.success("Personality deleted successfully!");
    } catch (error) {
      console.error("Error deleting personality:", error);
       toast.error("Error deleting personality");
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (isEditMode && currentRecord) {
        await fetch(
          `https://bd-news-backend.vercel.app/api/profile/${currentRecord._id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          }
        );
        toast.success("Personality updated successfully!");
      } else {
        await fetch(
          "https://bd-news-backend.vercel.app/api/profile/create-profile",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          }
        );
        toast.success("Personality created successfully!");
      }

      await fetchProfiles();
      setIsModalOpen(false);
      form.resetFields();
    } catch (err) {
      console.error("Error submitting form:", err);
       toast.error(
         "Something went wrong. Please check the form and try again."
       );
    }
  };

  const columns = [
    {
      title: "Profile",
      dataIndex: "profileImage",
      key: "profileImage",
      render: (url: string) => (
        <img
          src={url}
          alt="profile"
          width={60}
          height={60}
          style={{ borderRadius: "50%" }}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Bio",
      dataIndex: "bio",
      key: "bio",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Personality) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => showModal(record)} />
          <Popconfirm
            title="Are you sure to delete this personality?"
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
        Add Personality
      </Button>

      <Table columns={columns} dataSource={data} rowKey="_id" />

      <Modal
        title={isEditMode ? "Update Personality" : "Create Personality"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        okText={isEditMode ? "Update" : "Create"}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Profile Image URL"
            name="profileImage"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Cover Image URL"
            name="coverImage"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Role" name="role" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Bio" name="bio" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Education"
            name="education"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Portfolio URL"
            name="portfolioUrl"
            rules={[{ required: true }]}
          >
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
            label="Long Description"
            name="longDes"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
