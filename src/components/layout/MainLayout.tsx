import { Layout } from "antd";
const { Header, Content} = Layout;

import { Outlet } from "react-router";

import Sidebar from "./Sidebar";

export default function MainLayout() {
  return (
    <Layout
      style={{ minHeight: "100vh", display: "flex", flexDirection: "row" }}
    >
      <Sidebar />
      <Layout style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Header style={{ padding: 0 }} />
        <Content style={{ margin: "24px 16px 0", flex: 1, overflowY: "auto" }}>
          <div
            style={{
              padding: 24,
              minHeight: "100%",
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
