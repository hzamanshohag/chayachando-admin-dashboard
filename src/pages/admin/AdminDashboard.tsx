import { useEffect, useState } from "react";
import { Card, Col, Row, Spin } from "antd";

export default function AdminDashboard() {
  const [hero, setHero] = useState([]);
  const [highlight, setHighlight] = useState([]);
  const [news, setNews] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const response = await fetch(
          "https://bd-news-backend.vercel.app/api/hero"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (!Array.isArray(result.data)) {
          throw new Error("Invalid data format received from API");
        }

        setHero(result.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch hero post"
        );
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHero();
  }, []);
  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const response = await fetch(
          "https://bd-news-backend.vercel.app/api/highlight"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (!Array.isArray(result.data)) {
          throw new Error("Invalid data format received from API");
        }

        setHighlight(result.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch highlights"
        );
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHighlights();
  }, []);
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          "https://bd-news-backend.vercel.app/api/article"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (!Array.isArray(result.data)) {
          throw new Error("Invalid data format received from API");
        }

        setNews(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch News");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch(
          "https://bd-news-backend.vercel.app/api/profile"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (!Array.isArray(result.data)) {
          throw new Error("Invalid data format received from API");
        }

        setProfiles(result.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch profiles"
        );
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

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

  if (error) {
    return <div className="text-center py-16 text-red-500">Error: {error}</div>;
  }

  return (
    <Row
      gutter={[16, 16]}
      style={{
        padding: "24px 16px",
        margin: "0 -8px",
      }}
    >
      {/* Hero Post Card */}
      <Col xs={24} sm={12} md={8} lg={8} style={{ padding: "0 8px" }}>
        <Card
          title="Total Hero Post"
          variant="borderless"
          style={{
            borderRadius: 8,
            backgroundColor: "rgba(255, 99, 132, 0.9)", // Soft red
            color: "#ffffff",
            transition: "all 0.3s ease",
          }}
          headStyle={{ color: "#ffffff", borderBottom: "none" }}
          bodyStyle={{ padding: "16px 24px" }}
          hoverable
        >
          <div style={{ fontSize: 24, fontWeight: 600, padding: "16px 0" }}>
            {hero?.length}
          </div>
        </Card>
      </Col>

      {/* Highlight Post Card */}
      <Col xs={24} sm={12} md={8} lg={8} style={{ padding: "0 8px" }}>
        <Card
          title="Total Highlight Post"
          variant="borderless"
          style={{
            borderRadius: 8,
            backgroundColor: "rgba(75, 192, 192, 0.9)", // Soft green
            color: "#ffffff",
            transition: "all 0.3s ease",
          }}
          headStyle={{ color: "#ffffff", borderBottom: "none" }}
          bodyStyle={{ padding: "16px 24px" }}
          hoverable
        >
          <div style={{ fontSize: 24, fontWeight: 600, padding: "16px 0" }}>
            {highlight?.length}
          </div>
        </Card>
      </Col>

      {/* Articles Card */}
      <Col xs={24} sm={12} md={8} lg={8} style={{ padding: "0 8px" }}>
        <Card
          title="Total Articles"
          variant="borderless"
          style={{
            borderRadius: 8,
            backgroundColor: "rgba(54, 162, 235, 0.9)", // Soft blue
            color: "#ffffff",
            transition: "all 0.3s ease",
          }}
          headStyle={{ color: "#ffffff", borderBottom: "none" }}
          bodyStyle={{ padding: "16px 24px" }}
          hoverable
        >
          <div style={{ fontSize: 24, fontWeight: 600, padding: "16px 0" }}>
            {news?.length}
          </div>
        </Card>
      </Col>

      {/* Profiles Card */}
      <Col xs={24} sm={12} md={8} lg={8} style={{ padding: "0 8px" }}>
        <Card
          title="Total Profiles"
          variant="borderless"
          style={{
            borderRadius: 8,
            backgroundColor: "rgba(153, 102, 255, 0.9)", // Soft purple
            color: "#ffffff",
            transition: "all 0.3s ease",
          }}
          headStyle={{ color: "#ffffff", borderBottom: "none" }}
          bodyStyle={{ padding: "16px 24px" }}
          hoverable
        >
          <div style={{ fontSize: 24, fontWeight: 600, padding: "16px 0" }}>
            {profiles?.length}
          </div>
        </Card>
      </Col>
    </Row>
  );
}
